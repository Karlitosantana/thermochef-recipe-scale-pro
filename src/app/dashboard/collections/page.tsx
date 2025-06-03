import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { CollectionGrid } from '@/components/collections/collection-grid';
import { CreateCollectionButton } from '@/components/collections/create-collection-button';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function CollectionsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect('/sign-in');
  }

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    include: {
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
        take: 4, // Preview images
      },
      _count: {
        select: { items: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  await prisma.$disconnect();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recipe Collections</h1>
          <p className="mt-2 text-text-dark">
            Organize your recipes into collections and share them with others.
          </p>
        </div>
        
        <CreateCollectionButton />
      </div>

      {collections.length === 0 ? (
        <div className="card text-center">
          <div className="py-12">
            <span className="text-6xl">📁</span>
            <h3 className="mt-4 text-xl font-semibold">No collections yet</h3>
            <p className="mt-2 text-text-dark">
              Create your first collection to organize your recipes.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <CreateCollectionButton />
              <Link href="/dashboard/recipes" className="btn-outline btn-md">
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <CollectionGrid collections={collections} />
      )}
    </div>
  );
}