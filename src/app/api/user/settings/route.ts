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
        settings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Default settings if none exist
    const defaultSettings = {
      language: 'en',
      currency: 'USD',
      defaultDevice: 'TM6',
      emailNotifications: true,
      weeklyDigest: false,
      measurementSystem: 'metric',
      theme: 'dark',
    };

    return NextResponse.json({
      ...defaultSettings,
      ...(user.settings as object || {}),
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
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

    const settings = await request.json();

    // Validate settings
    const allowedFields = [
      'language',
      'currency',
      'defaultDevice',
      'emailNotifications',
      'weeklyDigest',
      'measurementSystem',
      'theme',
    ];

    const filteredSettings = Object.fromEntries(
      Object.entries(settings).filter(([key]) => allowedFields.includes(key))
    );

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        settings: filteredSettings as any,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}