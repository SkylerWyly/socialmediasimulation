'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';

// Balanced mock data: Mixture of realistic, socially relevant, and lighthearted
const BALANCED_TRENDS = [
  { category: 'Breaking News', topic: '#LocalTransitStrike', posts: 42100 },
  { category: 'Entertainment', topic: '#AutotuneFail', posts: 156000 },
  { category: 'Local News', topic: '#MainStreetIncident', posts: 12400 },
  { category: 'Technology', topic: '#SubscriptionPricing', posts: 98700 },
  { category: 'Lifestyle', topic: '#MealPrepSunday', posts: 33500 },
  { category: 'Community', topic: '#GroceryCartEtiquette', posts: 45100 },
  { category: 'Weather', topic: '#SevereStormWarning', posts: 15600 },
];

const INITIAL_TRENDS_COUNT = 5;

export function TrendingTopics() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_TRENDS_COUNT);

  // Formatter for post counts (e.g., 156000 -> 156.0K)
  const formatPostCount = (count: number) => {
    if (count < 1000) return `${count} posts`;
    return `${(count / 1000).toFixed(1)}K posts`;
  };

  const handleShowMore = () => {
    setVisibleCount(BALANCED_TRENDS.length);
  };

  const visibleTrends = BALANCED_TRENDS.slice(0, visibleCount);
  const canShowMore = visibleCount < BALANCED_TRENDS.length;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Trending</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {visibleTrends.map((trend, index) => (
            <li key={index} className="group flex items-center justify-between py-2 hover:bg-muted/50 -mx-6 px-6 rounded-md transition-colors">
              <div>
                <p className="text-xs text-muted-foreground">{trend.category} · Trending</p>
                <p className="font-bold">{trend.topic}</p>
                <p className="text-xs text-muted-foreground">{formatPostCount(trend.posts)}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </li>
          ))}
        </ul>
        {canShowMore && (
          <Button variant="link" className="p-0 h-auto mt-4 text-primary" onClick={handleShowMore}>
            Show more
          </Button>
        )}
      </CardContent>
    </Card>
  );
}