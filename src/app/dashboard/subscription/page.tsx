import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubscriptionCard } from '@/components/subscription/subscription-card';
import { PricingCards } from '@/components/subscription/pricing-cards';
import { UsageDisplay } from '@/components/subscription/usage-display';

const prisma = new PrismaClient();

export default async function SubscriptionPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscription: true,
      _count: {
        select: {
          recipes: true,
          conversions: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/sign-in');
  }

  // Get current month usage
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyUsage = await prisma.usageStat.aggregate({
    where: {
      userId: user.id,
      date: { gte: currentMonth },
    },
    _sum: {
      conversions: true,
      recipesCreated: true,
      imagesGenerated: true,
    },
  });

  const usage = {
    conversions: monthlyUsage._sum.conversions || 0,
    recipes: user._count.recipes,
    imagesGenerated: monthlyUsage._sum.imagesGenerated || 0,
  };

  await prisma.$disconnect();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="mt-2 text-text-dark">
          Manage your subscription and view usage statistics.
        </p>
      </div>

      {/* Current Subscription */}
      <SubscriptionCard subscription={user.subscription} />

      {/* Usage Statistics */}
      <UsageDisplay 
        usage={usage} 
        tier={user.subscription?.tier || 'FREE'} 
      />

      {/* Upgrade Options */}
      {(!user.subscription || user.subscription.tier === 'FREE') && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
          <PricingCards currentTier={user.subscription?.tier || 'FREE'} />
        </div>
      )}

      {/* Billing History */}
      {user.subscription?.stripeCustomerId && (
        <div className="card">
          <h3 className="text-lg font-semibold">Billing</h3>
          <p className="mt-2 text-text-dark">
            Manage your billing information, view invoices, and update payment methods.
          </p>
          <form action="/api/stripe/billing-portal" method="POST" className="mt-4">
            <button type="submit" className="btn-outline btn-md">
              Manage Billing
            </button>
          </form>
        </div>
      )}
    </div>
  );
}