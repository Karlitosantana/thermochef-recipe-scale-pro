import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { categorizIngredient } from '@/lib/meal-planning';

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

    const { name, amount, unit, category } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
    }

    // Verify shopping list exists and belongs to user
    const shoppingList = await prisma.shoppingList.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!shoppingList) {
      return NextResponse.json({ error: 'Shopping list not found' }, { status: 404 });
    }

    // Get next order number
    const lastItem = await prisma.shoppingListItem.findFirst({
      where: { shoppingListId: resolvedParams.id },
      orderBy: { order: 'desc' },
    });

    const newOrder = (lastItem?.order || 0) + 1;

    const item = await prisma.shoppingListItem.create({
      data: {
        shoppingListId: resolvedParams.id,
        name: name.trim(),
        amount: amount || null,
        unit: unit || null,
        category: category || categorizIngredient(name),
        order: newOrder,
      },
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Shopping list item creation error:', error);
    return NextResponse.json({ error: 'Failed to add item to shopping list' }, { status: 500 });
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

    const { itemId, isChecked, name, amount, unit, category } = await request.json();

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Verify shopping list and item exist and belong to user
    const item = await prisma.shoppingListItem.findFirst({
      where: {
        id: itemId,
        shoppingList: {
          id: resolvedParams.id,
          userId: user.id,
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Shopping list item not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (typeof isChecked === 'boolean') updateData.isChecked = isChecked;
    if (name !== undefined) updateData.name = name.trim();
    if (amount !== undefined) updateData.amount = amount;
    if (unit !== undefined) updateData.unit = unit;
    if (category !== undefined) updateData.category = category;

    const updatedItem = await prisma.shoppingListItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Shopping list item update error:', error);
    return NextResponse.json({ error: 'Failed to update shopping list item' }, { status: 500 });
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
    const itemId = url.searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Verify shopping list and item exist and belong to user
    const item = await prisma.shoppingListItem.findFirst({
      where: {
        id: itemId,
        shoppingList: {
          id: resolvedParams.id,
          userId: user.id,
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Shopping list item not found' }, { status: 404 });
    }

    await prisma.shoppingListItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Shopping list item deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete shopping list item' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}