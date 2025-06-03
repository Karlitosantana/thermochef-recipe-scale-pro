'use client';

import { useState, useEffect } from 'react';

interface CuisineData {
  cuisine: string;
  _count: number;
}

export function CuisineChart() {
  const [data, setData] = useState<CuisineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCuisineData();
  }, []);

  const fetchCuisineData = async () => {
    try {
      const response = await fetch('/api/analytics?type=recipes&period=30');
      if (response.ok) {
        const result = await response.json();
        setData(result.cuisineStats || []);
      }
    } catch (error) {
      console.error('Failed to fetch cuisine data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Popular Cuisines</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Popular Cuisines</h3>
        <div className="h-64 flex items-center justify-center text-text-dark">
          No cuisine data available
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d._count));
  const colors = [
    'bg-accent',
    'bg-secondary',
    'bg-warning',
    'bg-error',
    'bg-success',
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Popular Cuisines</h3>
      <div className="space-y-3">
        {data.slice(0, 8).map((item, index) => (
          <div key={item.cuisine} className="flex items-center gap-3">
            <div className="w-24 text-sm font-medium capitalize">
              {item.cuisine}
            </div>
            <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  colors[index % colors.length]
                }`}
                style={{
                  width: `${(item._count / maxCount) * 100}%`,
                }}
              />
            </div>
            <div className="w-8 text-sm text-text-dark text-right">
              {item._count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}