import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const whereClause: any = { userId: user.id };
    
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: whereClause,
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            prepTime: true,
            cookTime: true,
            difficulty: true,
            ingredients: {
              select: {
                name: true,
                amount: true,
                unit: true,
              },
            },
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { mealType: 'asc' },
      ],
    });

    return NextResponse.json(mealPlans);
  } catch (error) {
    console.error('Meal plans fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch meal plans' }, { status: 500 });
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

    const { date, mealType, recipeId, customMeal, notes, servings } = await request.json();

    if (!date || !mealType) {
      return NextResponse.json({ 
        error: 'Date and meal type are required' 
      }, { status: 400 });
    }

    if (!recipeId && !customMeal) {
      return NextResponse.json({ 
        error: 'Either recipe ID or custom meal is required' 
      }, { status: 400 });
    }

    // Verify recipe exists and belongs to user
    if (recipeId) {
      const recipe = await prisma.recipe.findFirst({
        where: {
          id: recipeId,
          userId: user.id,
        },
      });

      if (!recipe) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
      }
    }

    // Check if meal plan already exists for this date/meal type
    const existingMealPlan = await prisma.mealPlan.findUnique({
      where: {
        userId_date_mealType: {
          userId: user.id,
          date: new Date(date),
          mealType: mealType.toUpperCase(),
        },
      },
    });

    if (existingMealPlan) {
      // Update existing meal plan
      const updatedMealPlan = await prisma.mealPlan.update({
        where: { id: existingMealPlan.id },
        data: {
          recipeId: recipeId || null,
          customMeal: customMeal || null,
          notes: notes || null,
          servings: servings || 4,
        },
        include: {
          recipe: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              prepTime: true,
              cookTime: true,
              difficulty: true,
            },
          },
        },
      });

      return NextResponse.json(updatedMealPlan);
    } else {
      // Create new meal plan
      const mealPlan = await prisma.mealPlan.create({
        data: {
          userId: user.id,
          date: new Date(date),
          mealType: mealType.toUpperCase(),
          recipeId: recipeId || null,
          customMeal: customMeal || null,
          notes: notes || null,
          servings: servings || 4,
        },
        include: {
          recipe: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              prepTime: true,
              cookTime: true,
              difficulty: true,
            },
          },
        },
      });

      return NextResponse.json(mealPlan);
    }
  } catch (error) {
    console.error('Meal plan creation error:', error);
    return NextResponse.json({ error: 'Failed to create meal plan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}