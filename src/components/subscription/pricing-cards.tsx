'use client';

import { useState } from 'react';

interface PricingCardsProps {
  currentTier: string;
}

const tiers = [
  {
    id: 'PRO',
    name: 'Pro',
    price: 39.99,
    description: 'For serious home cooks',
    features: [
      'Unlimited recipe conversions',
      'Unlimited recipe storage',
      'HD image generation',
      'Priority email support',
      'Export capabilities',
      'Advanced search filters',
    ],
  },
  {
    id: 'FAMILY',
    name: 'Family',
    price: 59.99,
    description: 'Share with loved ones',
    features: [
      'Everything in Pro',
      '5 family member accounts',
      'Shared recipe collections',
      'Meal planning calendar',
      'Shopping list sync',
      'Premium phone support',
    ],
  },
];

export function PricingCards({ currentTier }: PricingCardsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (tier: string) => {
    setLoading(tier);
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to start upgrade process. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className={`card ${
            tier.id === 'PRO' ? 'border-accent glow' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className="mt-2 text-text-dark">{tier.description}</p>
            </div>
            {tier.id === 'PRO' && (
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                Most Popular
              </span>
            )}
          </div>

          <div className="my-6">
            <span className="text-4xl font-bold">${tier.price}</span>
            <span className="text-text-dark">/year</span>
          </div>

          <ul className="space-y-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <span className="mr-2 text-accent">✓</span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleUpgrade(tier.id)}
            disabled={loading === tier.id || currentTier === tier.id}
            className={`mt-8 w-full ${
              tier.id === 'PRO' ? 'btn-primary' : 'btn-outline'
            } btn-md`}
          >
            {loading === tier.id ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </>
            ) : currentTier === tier.id ? (
              'Current Plan'
            ) : (
              `Upgrade to ${tier.name}`
            )}
          </button>
        </div>
      ))}
    </div>
  );
}