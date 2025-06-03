import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { 
  stripe, 
  PRICE_IDS, 
  getStripeCustomerByEmail, 
  createStripeCustomer, 
  createCheckoutSession 
} from '@/lib/stripe';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await request.json();
    if (!['PRO', 'FAMILY'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true },
    });

    if (!user || !user.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has an active subscription
    if (user.subscription?.status === 'ACTIVE') {
      return NextResponse.json({ 
        error: 'You already have an active subscription' 
      }, { status: 400 });
    }

    // Get or create Stripe customer
    let stripeCustomer = await getStripeCustomerByEmail(user.email);
    if (!stripeCustomer) {
      stripeCustomer = await createStripeCustomer(user.email, user.name || undefined);
    }

    // Update user with Stripe customer ID
    if (!user.subscription?.stripeCustomerId) {
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          tier: 'FREE',
          status: 'INCOMPLETE',
          stripeCustomerId: stripeCustomer.id,
        },
        update: {
          stripeCustomerId: stripeCustomer.id,
        },
      });
    }

    // Create checkout session
    const priceId = tier === 'PRO' ? PRICE_IDS.PRO_YEARLY : PRICE_IDS.FAMILY_YEARLY;
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`;

    const session = await createCheckoutSession({
      customerId: stripeCustomer.id,
      priceId,
      successUrl,
      cancelUrl,
      userId: user.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}