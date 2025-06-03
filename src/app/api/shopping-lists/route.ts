import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { categorizIngredient } from '@/lib/meal-planning';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const shoppingLists = await prisma.shoppingList.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: [
            { category: 'asc' },
            { order: 'asc' },
            { name: 'asc' },
          ],
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(shoppingLists);
  } catch (error) {
    console.error('Shopping lists fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch shopping lists' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { name, generateFromMealPlan, startDate, endDate } = await request.json();

    const shoppingList = await prisma.shoppingList.create({
      data: {
        userId: user.id,
        name: name || 'Shopping List',
      },
    });

    // If generating from meal plan, add ingredients automatically
    if (generateFromMealPlan && startDate && endDate) {
      const mealPlans = await prisma.mealPlan.findMany({
        where: {
          userId: user.id,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
          recipeId: { not: null },
        },
        include: {
          recipe: {
            include: {
              ingredients: true,
            },
          },
        },
      });

      // Aggregate ingredients by name and unit
      const ingredientMap = new Map();

      for (const mealPlan of mealPlans) {
        if (!mealPlan.recipe) continue;

        const scaleFactor = mealPlan.servings / mealPlan.recipe.servings;

        for (const ingredient of mealPlan.recipe.ingredients) {
          const key = `${ingredient.name.toLowerCase()}-${ingredient.unit.toLowerCase()}`;
          
          if (ingredientMap.has(key)) {
            const existing = ingredientMap.get(key);
            existing.amount += ingredient.amount * scaleFactor;
            existing.recipes.add(mealPlan.recipe.title);
          } else {
            ingredientMap.set(key, {
              name: ingredient.name,
              amount: ingredient.amount * scaleFactor,
              unit: ingredient.unit,
              category: categorizIngredient(ingredient.name),
              recipes: new Set([mealPlan.recipe.title]),
              recipeId: mealPlan.recipe.id,
            });
          }
        }
      }

      // Create shopping list items
      const items = Array.from(ingredientMap.values()).map((item, index) => ({
        shoppingListId: shoppingList.id,
        name: item.name,
        amount: Math.round(item.amount * 100) / 100, // Round to 2 decimal places
        unit: item.unit,
        category: item.category,
        recipeId: item.recipeId,
        order: index,
      }));

      if (items.length > 0) {
        await prisma.shoppingListItem.createMany({
          data: items,
        });
      }
    }

    // Return the shopping list with items
    const fullShoppingList = await prisma.shoppingList.findUnique({
      where: { id: shoppingList.id },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: [
            { category: 'asc' },
            { order: 'asc' },
            { name: 'asc' },
          ],
        },
      },
    });

    return NextResponse.json(fullShoppingList);
  } catch (error) {
    console.error('Shopping list creation error:', error);
    return NextResponse.json({ error: 'Failed to create shopping list' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}