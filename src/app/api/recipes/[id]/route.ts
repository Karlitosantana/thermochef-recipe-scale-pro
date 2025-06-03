import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
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

    const recipe = await prisma.recipe.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        conversions: {
          orderBy: { createdAt: 'desc' },
        },
        nutritionInfo: true,
        collectionItems: {
          include: {
            collection: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        ratings: {
          where: { userId: user.id },
          take: 1,
        },
        _count: {
          select: {
            conversions: true,
            ratings: true,
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Recipe fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

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

    const updateData = await request.json();

    // Verify recipe exists and belongs to user
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Update recipe
    const updatedRecipe = await prisma.recipe.update({
      where: { id: resolvedParams.id },
      data: {
        title: updateData.title || recipe.title,
        description: updateData.description || recipe.description,
        cuisine: updateData.cuisine || recipe.cuisine,
        difficulty: updateData.difficulty || recipe.difficulty,
        prepTime: updateData.prepTime || recipe.prepTime,
        cookTime: updateData.cookTime || recipe.cookTime,
        totalTime: updateData.totalTime || recipe.totalTime,
        servings: updateData.servings || recipe.servings,
        diet: updateData.diet || recipe.diet,
        imageUrl: updateData.imageUrl || recipe.imageUrl,
        status: updateData.status || recipe.status,
      },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        conversions: {
          orderBy: { createdAt: 'desc' },
        },
        nutritionInfo: true,
      },
    });

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error('Recipe update error:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
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

    // Verify recipe exists and belongs to user
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Delete recipe (cascading deletes will handle related records)
    await prisma.recipe.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Recipe deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}