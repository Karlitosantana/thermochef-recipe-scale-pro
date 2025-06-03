# Recipe Scale Pro Setup Guide

This guide will walk you through setting up the Recipe Scale Pro application from scratch.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git (for version control)

## 1. Database Setup

### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE recipe_scale_pro;
```

### Option B: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

## 2. Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Fill in the following required variables:

### Database
```
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Clerk Authentication
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Get your keys from the API Keys section:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

4. Set up webhook endpoint:
   - Go to Webhooks in Clerk dashboard
   - Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy the signing secret:
```
CLERK_WEBHOOK_SECRET="whsec_..."
```

### OpenAI API
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
```
OPENAI_API_KEY="sk-..."
```

### Stripe (for subscriptions)
1. Go to [stripe.com](https://stripe.com)
2. Get your API keys from the Developers section:
```
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

3. Create products and prices:
   - Create "Pro Yearly" product with $39.99/year price
   - Create "Family Yearly" product with $59.99/year price
   - Copy the price IDs:
```
STRIPE_PRO_YEARLY_PRICE_ID="price_..."
STRIPE_FAMILY_YEARLY_PRICE_ID="price_..."
```

4. Set up webhook endpoint:
   - Go to Webhooks in Stripe dashboard
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook secret:
```
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Replicate (for image generation)
1. Go to [replicate.com](https://replicate.com)
2. Create an API token
```
REPLICATE_API_TOKEN="r8_..."
```

### App Configuration
```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

## 3. Installation

Install dependencies:
```bash
npm install
```

## 4. Database Migration

Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 5. Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 6. Production Deployment

### Option A: Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### Option B: Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 7. Post-Deployment Setup

### Clerk Configuration
1. Update your Clerk application settings:
   - Add your production domain to allowed origins
   - Update redirect URLs for sign-in/sign-up

### Stripe Configuration
1. Switch to live mode in Stripe dashboard
2. Update webhook endpoints to use production URLs
3. Update API keys in environment variables

### Database
1. Run migrations on production database:
```bash
npx prisma migrate deploy
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check your DATABASE_URL format
   - Ensure database server is running
   - Verify credentials and permissions

2. **Clerk authentication not working**
   - Check that all Clerk environment variables are set
   - Verify webhook endpoint is accessible
   - Check Clerk dashboard for error logs

3. **Stripe webhooks failing**
   - Ensure webhook endpoint is publicly accessible
   - Check webhook signing secret matches
   - Verify selected events in Stripe dashboard

4. **OpenAI API errors**
   - Check API key is valid and has credits
   - Verify rate limits aren't exceeded
   - Check model availability

## Support

If you encounter issues:
1. Check the application logs
2. Verify all environment variables are set correctly
3. Test webhook endpoints manually
4. Check service status pages for third-party providers

For additional help, create an issue in the repository.