import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ShareButton } from '@/components/social/share-button';

interface Collection {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  updatedAt: Date;
  items: Array<{
    recipe: {
      id: string;
      title: string;
      imageUrl?: string | null;
    };
  }>;
  _count: {
    items: number;
  };
}

interface CollectionGridProps {
  collections: Collection[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <div key={collection.id} className="card">
          {/* Preview Images */}
          <div className="mb-4 grid grid-cols-2 gap-1 h-32 rounded-lg overflow-hidden bg-background">
            {collection.items.slice(0, 4).map((item, index) => (
              <div
                key={item.recipe.id}
                className="bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center"
              >
                {item.recipe.imageUrl ? (
                  <img
                    src={item.recipe.imageUrl}
                    alt={item.recipe.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🍽️</span>
                )}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 4 - collection.items.length) }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="bg-background-light flex items-center justify-center"
              >
                <span className="text-text-dark text-xl">+</span>
              </div>
            ))}
          </div>

          {/* Collection Info */}
          <div className="flex items-start justify-between mb-2">
            <Link
              href={`/dashboard/collections/${collection.id}`}
              className="flex-1"
            >
              <h3 className="font-semibold line-clamp-1 hover:text-accent transition-colors">
                {collection.name}
              </h3>
            </Link>
            
            {collection.isPublic && (
              <ShareButton
                title={collection.name}
                url={`${process.env.NEXT_PUBLIC_APP_URL}/collections/${collection.id}`}
                description={collection.description || undefined}
              />
            )}
          </div>

          {collection.description && (
            <p className="text-sm text-text-dark line-clamp-2 mb-3">
              {collection.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-text-dark">
            <div className="flex items-center gap-4">
              <span>{collection._count.items} recipe{collection._count.items !== 1 ? 's' : ''}</span>
              {collection.isPublic && (
                <span className="flex items-center gap-1">
                  <span>🌐</span>
                  Public
                </span>
              )}
            </div>
            <span>{formatDate(collection.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}