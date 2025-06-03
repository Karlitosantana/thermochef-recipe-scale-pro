import { loadStripe } from '@stripe/stripe-js';

// Only load Stripe if the publishable key is available
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default stripePromise;