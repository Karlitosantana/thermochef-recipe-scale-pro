import Stripe from 'stripe';

// Only initialize Stripe if the secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil',
    })
  : null as any;

export const PRICE_IDS = {
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  FAMILY_YEARLY: process.env.STRIPE_FAMILY_YEARLY_PRICE_ID!,
};

export const getStripeCustomerByEmail = async (email: string) => {
  if (!stripe) throw new Error('Stripe not initialized');
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });
  return customers.data[0];
};

export const createStripeCustomer = async (email: string, name?: string) => {
  if (!stripe) throw new Error('Stripe not initialized');
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      app: 'recipe-scale-pro',
    },
  });
};

export const createCheckoutSession = async ({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  userId,
  trialDays = 7,
}: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  userId: string;
  trialDays?: number;
}) => {
  if (!stripe) throw new Error('Stripe not initialized');
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: trialDays,
      metadata: {
        userId,
      },
    },
    metadata: {
      userId,
    },
  });
};

export const createBillingPortalSession = async ({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) => {
  if (!stripe) throw new Error('Stripe not initialized');
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
};

export const cancelSubscription = async (subscriptionId: string) => {
  if (!stripe) throw new Error('Stripe not initialized');
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
};

export const reactivateSubscription = async (subscriptionId: string) => {
  if (!stripe) throw new Error('Stripe not initialized');
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
};