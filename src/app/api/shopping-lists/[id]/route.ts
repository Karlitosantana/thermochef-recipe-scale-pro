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

    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
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

    if (!shoppingList) {
      return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 });
    }

    return NextResponse.json(shoppingList);
  } catch (error) {
    console.error('Shopping list fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch shopping list' }, { status: 500 });
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

    const { name } = await request.json();

    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!shoppingList) {
      return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 });
    }

    const updatedShoppingList = await prisma.shoppingList.update({
      where: { id: resolvedParams.id },
      data: { name: name || shoppingList.name },
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

    return NextResponse.json(updatedShoppingList);
  } catch (error) {
    console.error('Shopping list update error:', error);
    return NextResponse.json({ error: 'Failed to update shopping list' }, { status: 500 });
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

    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!shoppingList) {
      return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 });
    }

    await prisma.shoppingList.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Shopping list deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete shopping list' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}