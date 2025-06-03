'use client';

import { formatDate } from '@/lib/utils';

interface ChartData {
  date: Date;
  conversions: number;
  recipesCreated: number;
  imagesGenerated: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-text-dark">
        No data available for this period
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.map(d => Math.max(d.conversions, d.recipesCreated, d.imagesGenerated))
  );

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full"></div>
          <span>Conversions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-secondary rounded-full"></div>
          <span>Recipes Created</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-warning rounded-full"></div>
          <span>Images Generated</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end justify-between gap-1">
        {data.map((day, index) => {
          const date = new Date(day.date);
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              {/* Bars */}
              <div className="relative w-full flex flex-col gap-0.5 h-48">
                <div className="flex-1 flex flex-col justify-end">
                  {/* Conversions bar */}
                  <div
                    className="bg-accent rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${maxValue > 0 ? (day.conversions / maxValue) * 100 : 0}%`,
                    }}
                    title={`${day.conversions} conversions`}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  {/* Recipes bar */}
                  <div
                    className="bg-secondary rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${maxValue > 0 ? (day.recipesCreated / maxValue) * 100 : 0}%`,
                    }}
                    title={`${day.recipesCreated} recipes created`}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  {/* Images bar */}
                  <div
                    className="bg-warning rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${maxValue > 0 ? (day.imagesGenerated / maxValue) * 100 : 0}%`,
                    }}
                    title={`${day.imagesGenerated} images generated`}
                  />
                </div>
              </div>

              {/* Date label */}
              <span className="text-xs text-text-dark">
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Month labels */}
      <div className="flex justify-between text-xs text-text-dark">
        <span>{formatDate(data[0]?.date || new Date())}</span>
        <span>{formatDate(data[data.length - 1]?.date || new Date())}</span>
      </div>
    </div>
  );
}