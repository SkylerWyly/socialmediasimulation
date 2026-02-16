'use client';

import { useState } from 'react';
import { mockTrends } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';

const INITIAL_TRENDS_COUNT = 5;

export function TrendingTopics() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_TRENDS_COUNT);

  const formatPostCount = (count: number) => {
    if (count < 1000) return `${count} posts`;
    return `${(count / 1000).toFixed(1)}K posts`;
  };

  const handleShowMore = () => {
    setVisibleCount(mockTrends.length);
  };

  const visibleTrends = mockTrends.slice(0, visibleCount);
  const canShowMore = visibleCount < mockTrends.length;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Trending</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {visibleTrends.map((trend, index) => (
            <li key={index} className="group flex items-center justify-between py-2 hover:bg-muted/50 -mx-6 px-6 rounded-md">
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
