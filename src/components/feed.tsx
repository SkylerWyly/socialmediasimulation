
'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './post-card';
import { mockPosts } from '@/lib/mock-data';
import type { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from './ui/card';
import { getCondition, applyEngagementFormula } from '@/lib/conditions';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const condition = getCondition();
    
    if (condition) {
      const [valence, socialSupport] = condition.split('-');
      
      // 1. Filter posts by the assigned valence condition
      const filteredPosts = mockPosts.filter(p => p.valence === valence);

      // 2. Apply the engagement formula based on the social support condition
      const conditionedPosts = filteredPosts.map(p => 
        applyEngagementFormula(p, socialSupport as 'high' | 'low')
      );

      // 3. Shuffle the conditioned posts for random presentation
      const randomizedPosts = shuffleArray(conditionedPosts);

      // Use a timeout to simulate network latency
      setTimeout(() => {
        setPosts(randomizedPosts);
        setIsLoading(false);
      }, 500);
    } else {
      // Fallback for when condition is not set (e.g., in tutorial)
      const randomizedPosts = shuffleArray(mockPosts);
      setTimeout(() => {
        setPosts(randomizedPosts);
        setIsLoading(false);
      }, 500);
    }
  }, []);

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    console.log(`Interaction logged for post: ${updatedPost.id} (isFocal: ${updatedPost.isFocal})`, updatedPost);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
           <Card key={i} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-11/12 mb-4" />
            <Skeleton className="aspect-[16/9] w-full rounded-md" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onUpdatePost={handleUpdatePost} />
      ))}
    </div>
  );
}
