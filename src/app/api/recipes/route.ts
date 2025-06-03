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
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search');
    const cuisine = url.searchParams.get('cuisine');
    const difficulty = url.searchParams.get('difficulty');
    const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build where clause
    const where: any = { userId: user.id };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ingredients: { some: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (cuisine) {
      where.cuisine = cuisine;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build order by clause
    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'totalTime') {
      orderBy.totalTime = sortOrder;
    } else if (sortBy === 'difficulty') {
      orderBy.difficulty = sortOrder;
    } else {
      orderBy.updatedAt = sortOrder;
    }

    // Fetch recipes with pagination
    const [recipes, totalCount] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: {
          _count: {
            select: { conversions: true },
          },
          conversions: {
            select: { deviceModel: true },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          ingredients: {
            select: { name: true, amount: true, unit: true },
            take: 5,
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.recipe.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      recipes,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Recipes fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
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

    const recipeData = await request.json();

    if (!recipeData.title || !recipeData.ingredients || !Array.isArray(recipeData.ingredients)) {
      return NextResponse.json({ 
        error: 'Title and ingredients array are required' 
      }, { status: 400 });
    }

    // Create recipe with ingredients
    const recipe = await prisma.recipe.create({
      data: {
        userId: user.id,
        title: recipeData.title,
        description: recipeData.description || null,
        sourceUrl: recipeData.sourceUrl || null,
        sourceAttribution: recipeData.sourceAttribution || null,
        cuisine: recipeData.cuisine || null,
        diet: recipeData.diet || [],
        prepTime: recipeData.prepTime || null,
        cookTime: recipeData.cookTime || null,
        totalTime: recipeData.totalTime || null,
        servings: recipeData.servings || 4,
        difficulty: recipeData.difficulty || null,
        imageUrl: recipeData.imageUrl || null,
        status: recipeData.status || 'DRAFT',
        language: recipeData.language || 'en',
        ingredients: {
          create: recipeData.ingredients.map((ing: any, index: number) => ({
            name: ing.name,
            amount: ing.amount || 0,
            unit: ing.unit || '',
            notes: ing.notes || null,
            order: index,
          })),
        },
      },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { conversions: true },
        },
      },
    });

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
        recipesCreated: { increment: 1 },
      },
      create: {
        userId: user.id,
        date: today,
        recipesCreated: 1,
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Recipe creation error:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}