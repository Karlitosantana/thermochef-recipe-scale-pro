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
      include: {
        subscription: true,
        _count: {
          select: {
            recipes: true,
            conversions: true,
            collections: true,
            mealPlans: true,
            shoppingLists: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get current month usage
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyUsage = await prisma.usageStat.aggregate({
      where: {
        userId: user.id,
        date: { gte: currentMonth },
      },
      _sum: {
        conversions: true,
        recipesCreated: true,
        imagesGenerated: true,
      },
    });

    return NextResponse.json({
      ...user,
      monthlyUsage: {
        conversions: monthlyUsage._sum.conversions || 0,
        recipesCreated: monthlyUsage._sum.recipesCreated || 0,
        imagesGenerated: monthlyUsage._sum.imagesGenerated || 0,
      },
    });
  } catch (error) {
    console.error('User profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { language, preferredUnits } = await request.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        language: language || user.language,
        preferredUnits: preferredUnits || user.preferredUnits,
      },
      include: {
        subscription: true,
        _count: {
          select: {
            recipes: true,
            conversions: true,
            collections: true,
            mealPlans: true,
            shoppingLists: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('User profile update error:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}