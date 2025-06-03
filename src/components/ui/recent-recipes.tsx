import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Recipe {
  id: string;
  title: string;
  createdAt: Date;
  _count: {
    conversions: number;
  };
}

interface RecentRecipesProps {
  recipes: Recipe[];
}

export function RecentRecipes({ recipes }: RecentRecipesProps) {
  if (recipes.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-text-dark">No recipes yet.</p>
        <Link href="/dashboard/convert" className="btn-primary btn-sm mt-4">
          Convert Your First Recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recipes.map((recipe: Recipe) => (
        <Link
          key={recipe.id}
          href={`/dashboard/recipes/${recipe.id}`}
          className="card block transition-colors hover:border-accent/50"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{recipe.title}</h3>
              <p className="mt-1 text-sm text-text-dark">
                {formatDate(recipe.createdAt)} • {recipe._count.conversions} conversion{recipe._count.conversions !== 1 ? 's' : ''}
              </p>
            </div>
            <span className="text-text-dark">→</span>
          </div>
        </Link>
      ))}
      
      <Link
        href="/dashboard/recipes"
        className="btn-outline btn-sm w-full"
      >
        View All Recipes
      </Link>
    </div>
  );
}