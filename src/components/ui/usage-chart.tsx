'use client';

import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';

interface UsageChartProps {
  userId: string;
}

export function UsageChart({ userId }: UsageChartProps) {
  const [data, setData] = useState<{ date: string; conversions: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate some data
    const mockData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: formatDate(date),
        conversions: Math.floor(Math.random() * 5) + 1,
      };
    });
    
    setData(mockData);
    setLoading(false);
  }, [userId]);

  if (loading) {
    return <div className="card h-64 animate-pulse bg-background-light" />;
  }

  const maxConversions = Math.max(...data.map(d => d.conversions), 1);

  return (
    <div className="card">
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((day, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-background rounded-t-md relative">
              <div
                className="bg-accent rounded-t-md transition-all duration-300"
                style={{
                  height: `${(day.conversions / maxConversions) * 200}px`,
                }}
              />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-text-dark">
                {day.conversions}
              </span>
            </div>
            <span className="text-xs text-text-dark">
              {day.date.split(' ')[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}