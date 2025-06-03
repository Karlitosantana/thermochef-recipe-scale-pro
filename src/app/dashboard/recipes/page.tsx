import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { RecipeFilters } from '@/components/recipes/recipe-filters';
import { ViewToggle } from '@/components/recipes/view-toggle';
import Link from 'next/link';

const prisma = new PrismaClient();

interface SearchParams {
  search?: string;
  cuisine?: string;
  difficulty?: string;
  view?: 'grid' | 'list';
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const resolvedSearchParams = await searchParams;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect('/sign-in');
  }

  // Build where clause for filtering
  const where: any = { userId: user.id };
  
  if (resolvedSearchParams.search) {
    where.OR = [
      { title: { contains: resolvedSearchParams.search, mode: 'insensitive' } },
      { description: { contains: resolvedSearchParams.search, mode: 'insensitive' } },
    ];
  }

  if (resolvedSearchParams.cuisine) {
    where.cuisine = resolvedSearchParams.cuisine;
  }

  if (resolvedSearchParams.difficulty) {
    where.difficulty = resolvedSearchParams.difficulty;
  }

  // Get recipes with filters
  const recipes = await prisma.recipe.findMany({
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
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get filter options
  const cuisines = await prisma.recipe.groupBy({
    by: ['cuisine'],
    where: { userId: user.id, cuisine: { not: null } },
  });

  const difficulties = await prisma.recipe.groupBy({
    by: ['difficulty'],
    where: { userId: user.id, difficulty: { not: null } },
  });

  await prisma.$disconnect();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <p className="mt-2 text-text-dark">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <ViewToggle currentView={resolvedSearchParams.view || 'grid'} />
          <Link href="/dashboard/convert" className="btn-primary btn-md">
            Convert Recipe
          </Link>
        </div>
      </div>

      {/* Filters */}
      <RecipeFilters
        cuisines={cuisines.map((c: any) => c.cuisine).filter(Boolean) as string[]}
        difficulties={difficulties.map((d: any) => d.difficulty).filter(Boolean) as string[]}
        currentFilters={{
          search: resolvedSearchParams.search,
          cuisine: resolvedSearchParams.cuisine,
          difficulty: resolvedSearchParams.difficulty,
        }}
      />

      {/* Recipes */}
      {recipes.length === 0 ? (
        <div className="card text-center">
          <div className="py-12">
            <span className="text-6xl">📖</span>
            <h3 className="mt-4 text-xl font-semibold">No recipes yet</h3>
            <p className="mt-2 text-text-dark">
              {resolvedSearchParams.search || resolvedSearchParams.cuisine || resolvedSearchParams.difficulty
                ? 'No recipes match your current filters.'
                : 'Start by converting your first recipe from any website.'
              }
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/dashboard/convert" className="btn-primary btn-md">
                Convert Recipe
              </Link>
              {(resolvedSearchParams.search || resolvedSearchParams.cuisine || resolvedSearchParams.difficulty) && (
                <Link href="/dashboard/recipes" className="btn-outline btn-md">
                  Clear Filters
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <RecipeGrid 
          recipes={recipes} 
          viewMode={resolvedSearchParams.view || 'grid'} 
        />
      )}
    </div>
  );
}