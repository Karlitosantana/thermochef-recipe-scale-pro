interface UsageDisplayProps {
  usage: {
    conversions: number;
    recipes: number;
    imagesGenerated: number;
  };
  tier: string;
}

export function UsageDisplay({ usage, tier }: UsageDisplayProps) {
  const limits = {
    FREE: { conversions: 5, recipes: 25 },
    PRO: { conversions: null, recipes: null },
    FAMILY: { conversions: null, recipes: null },
  };

  const currentLimits = limits[tier as keyof typeof limits];

  const getUsageColor = (current: number, limit: number | null) => {
    if (!limit) return 'text-success';
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getProgressWidth = (current: number, limit: number | null) => {
    if (!limit) return 100;
    return Math.min((current / limit) * 100, 100);
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold">Usage This Month</h3>
      
      <div className="mt-6 space-y-6">
        {/* Conversions */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Recipe Conversions</span>
            <span className={`text-sm ${getUsageColor(usage.conversions, currentLimits.conversions)}`}>
              {usage.conversions}
              {currentLimits.conversions && ` / ${currentLimits.conversions}`}
            </span>
          </div>
          <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{
                width: `${getProgressWidth(usage.conversions, currentLimits.conversions)}%`,
              }}
            />
          </div>
        </div>

        {/* Total Recipes */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Recipes Saved</span>
            <span className={`text-sm ${getUsageColor(usage.recipes, currentLimits.recipes)}`}>
              {usage.recipes}
              {currentLimits.recipes && ` / ${currentLimits.recipes}`}
            </span>
          </div>
          <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-300"
              style={{
                width: `${getProgressWidth(usage.recipes, currentLimits.recipes)}%`,
              }}
            />
          </div>
        </div>

        {/* Images Generated */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Images Generated</span>
            <span className="text-sm text-text">
              {usage.imagesGenerated}
              {tier === 'FREE' && ' (Standard quality)'}
              {tier !== 'FREE' && ' (HD quality)'}
            </span>
          </div>
        </div>
      </div>

      {tier === 'FREE' && (
        <div className="mt-6 rounded-lg bg-accent/10 p-4">
          <p className="text-sm">
            <strong>Upgrade to unlock:</strong> Unlimited conversions, unlimited recipe storage, 
            HD image generation, and priority support.
          </p>
        </div>
      )}
    </div>
  );
}