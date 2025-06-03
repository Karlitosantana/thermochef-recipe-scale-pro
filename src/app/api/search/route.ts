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
    const query = url.searchParams.get('q');
    const type = url.searchParams.get('type') || 'all'; // all, recipes, collections
    const limit = parseInt(url.searchParams.get('limit') || '20');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Search query must be at least 2 characters long' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const searchTerm = query.trim();
    const results: any = {};

    // Search recipes
    if (type === 'all' || type === 'recipes') {
      const recipes = await prisma.recipe.findMany({
        where: {
          userId: user.id,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { cuisine: { contains: searchTerm, mode: 'insensitive' } },
            { ingredients: { some: { name: { contains: searchTerm, mode: 'insensitive' } } } },
          ],
        },
        include: {
          _count: {
            select: { conversions: true },
          },
          conversions: {
            select: { deviceModel: true },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      });

      results.recipes = recipes.map((recipe: any) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        cuisine: recipe.cuisine,
        difficulty: recipe.difficulty,
        imageUrl: recipe.imageUrl,
        totalTime: recipe.totalTime,
        servings: recipe.servings,
        conversions: recipe._count.conversions,
        deviceModel: recipe.conversions[0]?.deviceModel,
        type: 'recipe',
      }));
    }

    // Search collections
    if (type === 'all' || type === 'collections') {
      const collections = await prisma.collection.findMany({
        where: {
          userId: user.id,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        include: {
          _count: {
            select: { items: true },
          },
          items: {
            include: {
              recipe: {
                select: {
                  id: true,
                  title: true,
                  imageUrl: true,
                },
              },
            },
            take: 3,
          },
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      });

      results.collections = collections.map((collection: any) => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isPublic: collection.isPublic,
        itemCount: collection._count.items,
        previewRecipes: collection.items.map((item: any) => ({
          id: item.recipe.id,
          title: item.recipe.title,
          imageUrl: item.recipe.imageUrl,
        })),
        type: 'collection',
      }));
    }

    // Search meal plans
    if (type === 'all' || type === 'meal-plans') {
      const mealPlans = await prisma.mealPlan.findMany({
        where: {
          userId: user.id,
          OR: [
            { customMeal: { contains: searchTerm, mode: 'insensitive' } },
            { notes: { contains: searchTerm, mode: 'insensitive' } },
            { recipe: { title: { contains: searchTerm, mode: 'insensitive' } } },
          ],
        },
        include: {
          recipe: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
        take: limit,
        orderBy: { date: 'desc' },
      });

      results.mealPlans = mealPlans.map((mealPlan: any) => ({
        id: mealPlan.id,
        date: mealPlan.date,
        mealType: mealPlan.mealType,
        customMeal: mealPlan.customMeal,
        recipe: mealPlan.recipe,
        notes: mealPlan.notes,
        type: 'meal-plan',
      }));
    }

    // Calculate total results
    const totalResults = Object.values(results).reduce((sum: number, items: any) => sum + items.length, 0);

    return NextResponse.json({
      query: searchTerm,
      totalResults,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}