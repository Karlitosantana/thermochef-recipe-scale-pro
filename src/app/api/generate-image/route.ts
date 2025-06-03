import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { ImageGenerator } from '@/lib/image-generation';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipeName, ingredients, description } = await request.json();
    
    if (!recipeName && !description) {
      return NextResponse.json({ 
        error: 'Recipe name or description is required' 
      }, { status: 400 });
    }

    // Get user subscription to determine image quality
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isHD = user.subscription?.tier === 'PRO' || user.subscription?.tier === 'FAMILY';

    // Generate image
    let imageUrl: string | null = null;
    
    if (description) {
      imageUrl = await ImageGenerator.generateImageFromDescription(description, isHD);
    } else {
      imageUrl = await ImageGenerator.generateRecipeImage(recipeName, ingredients || [], isHD);
    }

    if (!imageUrl) {
      return NextResponse.json({ 
        error: 'Failed to generate image. Please try again.' 
      }, { status: 500 });
    }

    // Update usage stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.usageStat.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        imagesGenerated: { increment: 1 },
      },
      create: {
        userId: user.id,
        date: today,
        imagesGenerated: 1,
      },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate image' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}