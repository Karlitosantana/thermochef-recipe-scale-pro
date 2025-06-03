import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        name: true,
        bio: true,
        location: true,
        website: true,
        cookingLevel: true,
        favoriteDevices: true,
        cookingGoals: true,
        allergens: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name || '',
      bio: user.bio,
      location: user.location,
      website: user.website,
      cookingLevel: user.cookingLevel || 'beginner',
      favoriteDevices: user.favoriteDevices || ['TM6'],
      cookingGoals: user.cookingGoals || [],
      allergens: user.allergens || [],
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
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

    const profileData = await request.json();

    // Validate and sanitize profile data
    const allowedFields = [
      'name',
      'bio',
      'location',
      'website',
      'cookingLevel',
      'favoriteDevices',
      'cookingGoals',
      'allergens',
    ];

    const filteredData = Object.fromEntries(
      Object.entries(profileData).filter(([key]) => allowedFields.includes(key))
    );

    // Validate cookingLevel
    if (filteredData.cookingLevel && 
        !['beginner', 'intermediate', 'advanced', 'expert'].includes(filteredData.cookingLevel as string)) {
      filteredData.cookingLevel = 'beginner';
    }

    // Ensure arrays are properly formatted
    if (filteredData.favoriteDevices && !Array.isArray(filteredData.favoriteDevices)) {
      filteredData.favoriteDevices = ['TM6'];
    }
    if (filteredData.cookingGoals && !Array.isArray(filteredData.cookingGoals)) {
      filteredData.cookingGoals = [];
    }
    if (filteredData.allergens && !Array.isArray(filteredData.allergens)) {
      filteredData.allergens = [];
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...filteredData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}