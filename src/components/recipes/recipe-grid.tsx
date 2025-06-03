import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface Recipe {
  id: string;
  title: string;
  description?: string | null;
  servings: number;
  difficulty?: string | null;
  totalTime?: number | null;
  createdAt: Date;
  _count: {
    conversions: number;
  };
  conversions: {
    deviceModel: string;
  }[];
}

interface RecipeGridProps {
  recipes: Recipe[];
  viewMode: 'grid' | 'list';
}

export function RecipeGrid({ recipes, viewMode }: RecipeGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {recipes.map((recipe: Recipe) => (
          <Link
            key={recipe.id}
            href={`/dashboard/recipes/${recipe.id}`}
            className="card block transition-colors hover:border-accent/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                {recipe.description && (
                  <p className="mt-1 text-sm text-text-dark line-clamp-2">
                    {recipe.description}
                  </p>
                )}
                
                <div className="mt-3 flex items-center gap-4 text-sm text-text-dark">
                  <span>🍽️ {recipe.servings} servings</span>
                  {recipe.difficulty && (
                    <span>📊 {recipe.difficulty}</span>
                  )}
                  {recipe.totalTime && (
                    <span>⏱️ {recipe.totalTime} min</span>
                  )}
                  <span>📅 {formatDate(recipe.createdAt)}</span>
                </div>
              </div>
              
              <div className="ml-4 flex flex-col items-end gap-2">
                {recipe.conversions[0] && (
                  <span className="rounded-full bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
                    {recipe.conversions[0].deviceModel}
                  </span>
                )}
                <span className="text-sm text-text-dark">
                  {recipe._count.conversions} conversion{recipe._count.conversions !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe: Recipe) => (
        <Link
          key={recipe.id}
          href={`/dashboard/recipes/${recipe.id}`}
          className="card block transition-colors hover:border-accent/50"
        >
          <div className="aspect-video bg-gradient-to-br from-accent/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
          
          <h3 className="font-semibold line-clamp-2">{recipe.title}</h3>
          
          {recipe.description && (
            <p className="mt-2 text-sm text-text-dark line-clamp-3">
              {recipe.description}
            </p>
          )}
          
          <div className="mt-4 flex items-center justify-between text-sm text-text-dark">
            <div className="flex items-center gap-2">
              <span>🍽️ {recipe.servings}</span>
              {recipe.difficulty && (
                <span>• {recipe.difficulty}</span>
              )}
            </div>
            
            {recipe.conversions[0] && (
              <span className="rounded-full bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
                {recipe.conversions[0].deviceModel}
              </span>
            )}
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-text-dark">
            <span>{formatDate(recipe.createdAt)}</span>
            <span>{recipe._count.conversions} conversion{recipe._count.conversions !== 1 ? 's' : ''}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}