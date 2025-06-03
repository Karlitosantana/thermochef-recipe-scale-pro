import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  
  await prisma.subscription.update({
    where: { userId },
    data: {
      stripeSubscriptionId: subscription.id,
      status: 'TRIALING',
      tier: subscription.items.data[0].price.id === process.env.STRIPE_PRO_YEARLY_PRICE_ID ? 'PRO' : 'FAMILY',
      trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const user = await prisma.user.findFirst({
    where: {
      subscription: {
        stripeSubscriptionId: subscriptionId,
      },
    },
  });

  if (user) {
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        status: 'ACTIVE',
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  const user = await prisma.user.findFirst({
    where: {
      subscription: {
        stripeSubscriptionId: subscriptionId,
      },
    },
  });

  if (user) {
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        status: 'PAST_DUE',
      },
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: {
      subscription: {
        stripeSubscriptionId: subscription.id,
      },
    },
  });

  if (user) {
    let status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'INCOMPLETE' | 'TRIALING';
    
    switch (subscription.status) {
      case 'active':
        status = 'ACTIVE';
        break;
      case 'canceled':
        status = 'CANCELLED';
        break;
      case 'past_due':
        status = 'PAST_DUE';
        break;
      case 'incomplete':
        status = 'INCOMPLETE';
        break;
      case 'trialing':
        status = 'TRIALING';
        break;
      default:
        status = 'INCOMPLETE';
    }

    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        status,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelledAt: (subscription as any).cancel_at_period_end ? new Date((subscription as any).cancel_at * 1000) : null,
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: {
      subscription: {
        stripeSubscriptionId: subscription.id,
      },
    },
  });

  if (user) {
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        status: 'CANCELLED',
        tier: 'FREE',
        cancelledAt: new Date(),
      },
    });
  }
}