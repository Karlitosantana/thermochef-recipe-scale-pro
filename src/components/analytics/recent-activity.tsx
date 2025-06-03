'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ActivityItem {
  id: string;
  title: string;
  createdAt: Date;
  difficulty?: string;
  cuisine?: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/analytics?type=recipes&period=30');
      if (response.ok) {
        const result = await response.json();
        setActivities(result.recentActivity || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-background rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-background rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-text-dark">
          No recent activity
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <Link 
          href="/dashboard/recipes" 
          className="text-sm text-accent hover:text-accent-light"
        >
          View all recipes →
        </Link>
      </div>
      
      <div className="space-y-3">
        {activities.slice(0, 10).map((activity) => (
          <Link
            key={activity.id}
            href={`/dashboard/recipes/${activity.id}`}
            className="block p-3 rounded-lg border border-text-dark/20 hover:border-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium line-clamp-1">{activity.title}</h4>
                <div className="mt-1 flex items-center gap-2 text-sm text-text-dark">
                  <span>{formatDate(activity.createdAt)}</span>
                  {activity.cuisine && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{activity.cuisine}</span>
                    </>
                  )}
                  {activity.difficulty && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{activity.difficulty}</span>
                    </>
                  )}
                </div>
              </div>
              <span className="text-text-dark">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}