'use client';

import { useState, useEffect } from 'react';

interface DeviceData {
  deviceModel: string;
  _count: number;
}

export function DeviceChart() {
  const [data, setData] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeviceData();
  }, []);

  const fetchDeviceData = async () => {
    try {
      const response = await fetch('/api/analytics?type=devices&period=30');
      if (response.ok) {
        const result = await response.json();
        setData(result.deviceUsage || []);
      }
    } catch (error) {
      console.error('Failed to fetch device data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Device Usage</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Device Usage</h3>
        <div className="h-64 flex items-center justify-center text-text-dark">
          No device usage data available
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item._count, 0);
  const deviceColors = {
    TM5: 'bg-accent',
    TM6: 'bg-secondary', 
    TM7: 'bg-warning',
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Device Usage</h3>
      
      {/* Pie chart representation */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {data.map((item, index) => {
              const percentage = (item._count / total) * 100;
              const circumference = 2 * Math.PI * 50;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -index * (circumference / data.length);
              
              return (
                <circle
                  key={item.deviceModel}
                  cx="60"
                  cy="60"
                  r="50"
                  fill="transparent"
                  stroke={item.deviceModel === 'TM5' ? '#00FF87' : 
                         item.deviceModel === 'TM6' ? '#0084FF' : '#FFB800'}
                  strokeWidth="10"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.deviceModel} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                deviceColors[item.deviceModel as keyof typeof deviceColors] || 'bg-text-dark'
              }`} />
              <span className="font-medium">{item.deviceModel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-dark">
                {((item._count / total) * 100).toFixed(1)}%
              </span>
              <span className="text-sm font-medium">
                {item._count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}