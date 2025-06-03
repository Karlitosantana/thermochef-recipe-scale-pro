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

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const includePublic = url.searchParams.get('public') === 'true';

    const whereClause = includePublic 
      ? { OR: [{ userId: user.id }, { isPublic: true }] }
      : { userId: user.id };

    const collections = await prisma.collection.findMany({
      where: whereClause,
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
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
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error('Collections fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
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

    const { name, description, isPublic = false } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        userId: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        isPublic,
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error('Collection creation error:', error);
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}