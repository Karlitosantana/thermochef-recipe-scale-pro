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
    const period = url.searchParams.get('period') || '30';
    const type = url.searchParams.get('type') || 'overview';

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    startDate.setHours(0, 0, 0, 0);

    switch (type) {
      case 'overview':
        return await getOverviewAnalytics(user.id, startDate);
      case 'usage':
        return await getUsageAnalytics(user.id, startDate);
      case 'recipes':
        return await getRecipeAnalytics(user.id, startDate);
      case 'devices':
        return await getDeviceAnalytics(user.id, startDate);
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function getOverviewAnalytics(userId: string, startDate: Date) {
  const [totalStats, periodStats, dailyUsage] = await Promise.all([
    // Total stats
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            recipes: true,
            conversions: true,
            collections: true,
          },
        },
      },
    }),
    
    // Period stats
    prisma.usageStat.aggregate({
      where: {
        userId,
        date: { gte: startDate },
      },
      _sum: {
        conversions: true,
        recipesCreated: true,
        imagesGenerated: true,
      },
    }),
    
    // Daily usage breakdown
    prisma.usageStat.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    }),
  ]);

  return NextResponse.json({
    overview: {
      totalRecipes: totalStats?._count.recipes || 0,
      totalConversions: totalStats?._count.conversions || 0,
      totalCollections: totalStats?._count.collections || 0,
      periodConversions: periodStats._sum.conversions || 0,
      periodRecipes: periodStats._sum.recipesCreated || 0,
      periodImages: periodStats._sum.imagesGenerated || 0,
    },
    dailyUsage,
  });
}

async function getUsageAnalytics(userId: string, startDate: Date) {
  const [dailyStats, hourlyDistribution] = await Promise.all([
    // Daily usage stats
    prisma.usageStat.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    }),
    
    // Hourly distribution (approximated from creation times)
    prisma.recipe.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: { gte: startDate },
      },
    }),
  ]);

  // Process hourly distribution
  const hourlyUsage = Array(24).fill(0);
  hourlyDistribution.forEach((item: any) => {
    const hour = new Date(item.createdAt).getHours();
    hourlyUsage[hour]++;
  });

  return NextResponse.json({
    dailyStats,
    hourlyUsage,
  });
}

async function getRecipeAnalytics(userId: string, startDate: Date) {
  const [cuisineStats, difficultyStats, popularRecipes, recentActivity] = await Promise.all([
    // Cuisine distribution
    prisma.recipe.groupBy({
      by: ['cuisine'],
      where: {
        userId,
        cuisine: { not: null },
        createdAt: { gte: startDate },
      },
      _count: true,
    }),
    
    // Difficulty distribution
    prisma.recipe.groupBy({
      by: ['difficulty'],
      where: {
        userId,
        difficulty: { not: null },
        createdAt: { gte: startDate },
      },
      _count: true,
    }),
    
    // Most converted recipes
    prisma.recipe.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      include: {
        _count: {
          select: { conversions: true },
        },
      },
      orderBy: {
        conversions: {
          _count: 'desc',
        },
      },
      take: 10,
    }),
    
    // Recent activity
    prisma.recipe.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        createdAt: true,
        difficulty: true,
        cuisine: true,
      },
    }),
  ]);

  return NextResponse.json({
    cuisineStats,
    difficultyStats,
    popularRecipes,
    recentActivity,
  });
}

async function getDeviceAnalytics(userId: string, startDate: Date) {
  const [deviceUsage, deviceTrends] = await Promise.all([
    // Device usage distribution
    prisma.conversion.groupBy({
      by: ['deviceModel'],
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      _count: true,
    }),
    
    // Device usage over time
    prisma.conversion.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
      select: {
        deviceModel: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  return NextResponse.json({
    deviceUsage,
    deviceTrends,
  });
}