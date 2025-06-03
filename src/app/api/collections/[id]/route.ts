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

    const collection = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        OR: [
          { userId: user.id },
          { isPublic: true },
        ],
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: {
            recipe: {
              include: {
                ingredients: true,
                conversions: {
                  select: { deviceModel: true },
                  take: 1,
                },
                _count: {
                  select: { conversions: true },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Collection fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
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

    const { name, description, isPublic } = await request.json();

    const collection = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    const updatedCollection = await prisma.collection.update({
      where: { id: resolvedParams.id },
      data: {
        name: name?.trim() || collection.name,
        description: description?.trim() || collection.description,
        isPublic: isPublic ?? collection.isPublic,
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(updatedCollection);
  } catch (error) {
    console.error('Collection update error:', error);
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
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

    const collection = await prisma.collection.findFirst({
      where: {
        id: resolvedParams.id,
        userId: user.id,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    await prisma.collection.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Collection deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}