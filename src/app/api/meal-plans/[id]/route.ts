import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { recipeId, customMeal, notes, servings } = await request.json();

    // Verify meal plan exists and belongs to user
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!mealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }

    // Verify recipe exists and belongs to user if provided
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

    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id: resolvedParams.id },
      data: {
        recipeId: recipeId || null,
        customMeal: customMeal || null,
        notes: notes || null,
        servings: servings || mealPlan.servings,
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
  } catch (error) {
    console.error('Meal plan update error:', error);
    return NextResponse.json({ error: 'Failed to update meal plan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify meal plan exists and belongs to user
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!mealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }

    await prisma.mealPlan.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Meal plan deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete meal plan' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}