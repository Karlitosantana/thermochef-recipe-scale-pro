import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
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

    const { recipeId } = await request.json();

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    // Verify collection ownership
    const collection = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    // Verify recipe exists and user has access
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
        userId: user.id,
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Check if already in collection
    const existingItem = await prisma.collectionItem.findUnique({
      where: {
        collectionId_recipeId: {
          collectionId: resolvedParams.id,
          recipeId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json({ error: 'Recipe already in collection' }, { status: 400 });
    }

    // Get next order number
    const lastItem = await prisma.collectionItem.findFirst({
      where: { collectionId: resolvedParams.id },
      orderBy: { order: 'desc' },
    });

    const newOrder = (lastItem?.order || 0) + 1;

    const collectionItem = await prisma.collectionItem.create({
      data: {
        collectionId: resolvedParams.id,
        recipeId,
        order: newOrder,
      },
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            difficulty: true,
            totalTime: true,
          },
        },
      },
    });

    return NextResponse.json(collectionItem);
  } catch (error) {
    console.error('Collection item add error:', error);
    return NextResponse.json({ error: 'Failed to add recipe to collection' }, { status: 500 });
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

    const url = new URL(request.url);
    const recipeId = url.searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    // Verify collection ownership
    const collection = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    await prisma.collectionItem.delete({
      where: {
        collectionId_recipeId: {
          collectionId: resolvedParams.id,
          recipeId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Collection item remove error:', error);
    return NextResponse.json({ error: 'Failed to remove recipe from collection' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}