'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostCard } from './post-card';
import type { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { FEED_CONTENT } from '@/lib/simulation-data';

interface FeedProps {
  isTutorial?: boolean;
}

export function Feed({ isTutorial = false }: FeedProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [participantId, setParticipantId] = useState<string | null>(null);
  
  const [canAdvance, setCanAdvance] = useState(false);

  useEffect(() => {
    const init = async () => {
      // 1. TUTORIAL MODE - Updated to Sun-Dried Tomato Content
      if (isTutorial) {
        setPosts([{
            id: 'tutorial_post',
            user: { name: 'Home Chef', username: 'kitchen_hacks', avatar: "" },
            content: "I finally mastered making sun-dried tomatoes in the oven! 🍅 They are so much better than store-bought. Does anyone have a favorite pasta recipe to use these in?",
            timestamp: 'Just now',
            likes: 124,
            shares: 18,
            isLikedByUser: false,
            isSharedByUser: false,
            comments: [
              {
                id: 'tc1',
                user: { name: 'PastaLover', username: 'noodle_fanatic', avatar: "" },
                content: "These look amazing! Try them in a creamy garlic penne.",
                timestamp: '2m',
                likes: 12,
                replies: []
              }
            ]
        }]);
        setIsLoading(false);
        return; 
      }

      // 2. SIMULATION MODE
      const id = localStorage.getItem('participantId');
      if (id) setParticipantId(id);
      
      let condition = 'neutral';
      let engagementMap: Record<string, any> = {};
      let existingInteractions: Record<string, any> = {}; // <--- NEW: Store previous actions

      if (id) {
        try {
          const docRef = doc(db, 'participants', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            condition = data.valenceCondition || 'neutral';
            engagementMap = data.feedEngagement || {};
            existingInteractions = data.interactions || {}; // <--- FETCH PREVIOUS ACTIONS
          }
        } catch (error) {
          console.error("Error fetching Firebase data:", error);
        }
      }

      const adaptedPosts: Post[] = FEED_CONTENT.map((p) => {
        const stats = engagementMap[p.id] || { likes: 0, reposts: 0, comments: {} };
        const userAction = existingInteractions[p.id] || {}; // <--- CHECK SPECIFIC POST

        let rawComments: any[] = [];
        if (p.type === 'filler') rawComments = p.comments.filler || [];
        else if (condition === 'sympathetic') rawComments = p.comments.supportive || [];
        else if (condition === 'condemning') rawComments = p.comments.condemning || [];
        else rawComments = p.comments.neutral || [];

        return {
          id: p.id,
          user: { name: `User_${p.id}`, username: `${p.id}_official`, avatar: "" },
          content: p.content,
          timestamp: "2h ago",
          likes: stats.likes || 0,
          shares: stats.reposts || 0,
          
          // --- HYDRATION FIX ---
          // If we found a record of them liking this post, set it to true immediately
          isLikedByUser: userAction.liked === true,     
          isSharedByUser: userAction.reposted === true, 
          // ---------------------

          isFocal: p.type === 'real',
          valence: condition,
          comments: rawComments.map((c: any) => ({
            id: c.id,
            user: { name: `User_${c.id.split('c')[0]}`, username: `user${c.id}`, avatar: "" },
            content: c.text,
            timestamp: "2h",
            likes: stats.comments?.[c.id]?.likes || 0,
            replies: []
          }))
        };
      });

      setPosts(adaptedPosts);
      setIsLoading(false);
    };

    init();
  }, [isTutorial]);

  // --- DELAY LOGIC ---
  useEffect(() => {
    if (isTutorial) return;
    setCanAdvance(false);
    const timer = setTimeout(() => { setCanAdvance(true); }, 5000);
    return () => clearTimeout(timer);
  }, [sectionIndex, isTutorial]);

  // --- HANDLERS ---
  const POSTS_PER_SECTION = 2;
  const currentPosts = isTutorial 
    ? posts 
    : posts.slice(sectionIndex * POSTS_PER_SECTION, (sectionIndex + 1) * POSTS_PER_SECTION);
  const isLastSection = (sectionIndex + 1) * POSTS_PER_SECTION >= posts.length;

  const handleNextSection = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSectionIndex(prev => prev + 1);
  };

  const handleFinish = async () => {
    if (participantId) {
        await updateDoc(doc(db, 'participants', participantId), {
            status: 'completed_simulation',
            completedAt: serverTimestamp()
        });
    }
    router.push('/survey-post');
  };

  if (isLoading) {
    return <div className="p-4 space-y-4"><Skeleton className="h-40 w-full"/><Skeleton className="h-40 w-full"/></div>;
  }

  return (
    <div className="relative">
      <div className="space-y-4">
        {currentPosts.map((post) => (
            <PostCard key={post.id} post={post} onUpdatePost={() => {}} />
        ))}
      </div>

      {!isTutorial && canAdvance && (
         <div className="fixed bottom-10 right-10 z-50 animate-in fade-in zoom-in duration-500">
            {isLastSection ? (
               <Button size="lg" onClick={handleFinish} className="shadow-xl px-8 py-6 text-lg font-semibold bg-green-600 hover:bg-green-700">
                 Finish Experiment <CheckCircle className="ml-2 h-5 w-5" />
               </Button>
            ) : (
               <Button size="lg" onClick={handleNextSection} className="shadow-xl px-8 py-6 text-lg font-semibold">
                 Next Section <ArrowRight className="ml-2 h-5 w-5" />
               </Button>
            )}
         </div>
      )}
    </div>
  );
}