'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';

interface SubscriptionCardProps {
  subscription: {
    tier: string;
    status: string;
    currentPeriodEnd?: Date | null;
    trialEndsAt?: Date | null;
    cancelledAt?: Date | null;
    stripeCustomerId?: string | null;
  } | null;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    if (!subscription?.stripeCustomerId) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create billing portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Billing portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-success';
      case 'TRIALING':
        return 'text-warning';
      case 'CANCELLED':
      case 'PAST_DUE':
        return 'text-error';
      default:
        return 'text-text-dark';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'TRIALING':
        return 'Trial';
      case 'CANCELLED':
        return 'Cancelled';
      case 'PAST_DUE':
        return 'Past Due';
      default:
        return 'Free';
    }
  };

  if (!subscription || subscription.tier === 'FREE') {
    return (
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">Free Plan</h2>
            <p className="mt-1 text-text-dark">
              5 conversions per month • Basic features
            </p>
          </div>
          <span className="rounded-full bg-text-dark/20 px-3 py-1 text-sm">
            Free
          </span>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-text-dark">
            Upgrade to Pro or Family for unlimited conversions and premium features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {subscription.tier} Plan
          </h2>
          <p className="mt-1 text-text-dark">
            {subscription.tier === 'PRO' 
              ? 'Unlimited conversions • Premium features'
              : 'Everything in Pro • 5 family accounts'
            }
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${
          subscription.status === 'ACTIVE' 
            ? 'bg-success/20 text-success'
            : subscription.status === 'TRIALING'
            ? 'bg-warning/20 text-warning'
            : 'bg-error/20 text-error'
        }`}>
          {getStatusText(subscription.status)}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {subscription.trialEndsAt && subscription.status === 'TRIALING' && (
          <div className="flex justify-between text-sm">
            <span className="text-text-dark">Trial ends:</span>
            <span className="font-medium">
              {formatDate(subscription.trialEndsAt)}
            </span>
          </div>
        )}
        
        {subscription.currentPeriodEnd && (
          <div className="flex justify-between text-sm">
            <span className="text-text-dark">
              {subscription.status === 'CANCELLED' ? 'Ends:' : 'Renews:'}
            </span>
            <span className="font-medium">
              {formatDate(subscription.currentPeriodEnd)}
            </span>
          </div>
        )}

        {subscription.cancelledAt && (
          <div className="flex justify-between text-sm">
            <span className="text-text-dark">Cancelled:</span>
            <span className="font-medium">
              {formatDate(subscription.cancelledAt)}
            </span>
          </div>
        )}
      </div>

      {subscription.status === 'PAST_DUE' && (
        <div className="mt-4 rounded-lg bg-error/10 p-4">
          <p className="text-sm text-error">
            Your payment failed. Please update your payment method to continue using premium features.
          </p>
        </div>
      )}

      {subscription.stripeCustomerId && subscription.tier !== 'FREE' && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleManageBilling}
            disabled={loading}
            className="btn-outline btn-sm w-full"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Loading...
              </>
            ) : (
              'Manage Billing'
            )}
          </button>
        </div>
      )}
    </div>
  );
}