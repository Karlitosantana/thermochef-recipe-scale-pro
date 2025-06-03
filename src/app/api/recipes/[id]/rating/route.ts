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

    const { rating, comment } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5' 
      }, { status: 400 });
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

    // Create or update rating
    const ratingRecord = await prisma.rating.upsert({
      where: {
        recipeId_userId: {
          recipeId: resolvedParams.id,
          userId: user.id,
        },
      },
      create: {
        recipeId: resolvedParams.id,
        userId: user.id,
        rating,
        comment: comment || null,
      },
      update: {
        rating,
        comment: comment || null,
      },
    });

    return NextResponse.json(ratingRecord);
  } catch (error) {
    console.error('Rating creation error:', error);
    return NextResponse.json({ error: 'Failed to rate recipe' }, { status: 500 });
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

    // Delete rating
    await prisma.rating.delete({
      where: {
        recipeId_userId: {
          recipeId: resolvedParams.id,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rating deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete rating' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}