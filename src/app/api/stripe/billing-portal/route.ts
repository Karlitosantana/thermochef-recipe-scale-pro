import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { createBillingPortalSession } from '@/lib/stripe';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user subscription
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true },
    });

    if (!user?.subscription?.stripeCustomerId) {
      return NextResponse.json({ 
        error: 'No subscription found' 
      }, { status: 404 });
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`;
    const session = await createBillingPortalSession({
      customerId: user.subscription.stripeCustomerId,
      returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    return NextResponse.json({ 
      error: 'Failed to create billing portal session' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}