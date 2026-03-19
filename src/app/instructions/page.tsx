'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore'; // Added collection, getDocs

// --- Utility: Shorten large numbers (e.g., 308234 -> 308K) ---
const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
};

// --- Gaussian Randomizer Helper Functions ---
const boxMullerTransform = () => {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
};

const generateGaussian = (mean: number, stdDev: number, min: number, max: number) => {
    const z = boxMullerTransform();
    const value = Math.round(z * stdDev + mean);
    return Math.max(min, Math.min(value, max));
};

const VALENCE_CONDITIONS = ["sympathetic", "condemning", "neutral"];

export default function InstructionsPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('participantId');
    if (id) {
        setParticipantId(id);
    } else {
        router.push('/'); 
    }
  }, [router]);

  const handleStartSimulation = async () => {
    if (!participantId) return;
    setIsSubmitting(true);

    try {
      // --- QUALTRICS STYLE "EVENLY PRESENT ELEMENTS" RANDOMIZATION ---
      let assignedValence = "neutral"; // Fallback default
      
      try {
        const participantsSnap = await getDocs(collection(db, 'participants'));
        const counts: Record<string, number> = { sympathetic: 0, condemning: 0, neutral: 0 };

        participantsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          
          // CRITICAL: Ignore bots and dev testing IDs from the balancing counts
          const isDev = data.participantId?.startsWith('dev_') || data.id?.startsWith('dev_');
          
          if (!data.isBot && !isDev && data.valenceCondition) {
             if (counts[data.valenceCondition] !== undefined) {
                 counts[data.valenceCondition]++;
             }
          }
        });

        // Find the lowest count among the conditions
        const minCount = Math.min(counts.sympathetic, counts.condemning, counts.neutral);
        
        // Find all conditions that are tied for the lowest count
        const eligibleConditions = VALENCE_CONDITIONS.filter(c => counts[c] === minCount);
        
        // Randomly assign from the eligible (tied) conditions
        assignedValence = eligibleConditions[Math.floor(Math.random() * eligibleConditions.length)];
        
      } catch (error) {
        console.error("Error fetching condition counts, falling back to random:", error);
        // Pure random fallback just in case of a Firestore read error
        assignedValence = VALENCE_CONDITIONS[Math.floor(Math.random() * VALENCE_CONDITIONS.length)];
      }

      // --- FEED GENERATION LOGIC ---
      const feedEngagement: Record<string, any> = {};

      for (let i = 1; i <= 8; i++) {
        const postId = `p${i}`;
        const rawLikes = generateGaussian(530000, 150000, 80000, 980000);
        const rawReposts = generateGaussian(30000, 5000, 15000, 45000);
        const rawTotalComments = generateGaussian(400, 150, 50, 800);
        
        feedEngagement[postId] = {
          likes: rawLikes,
          likesDisplay: formatNumber(rawLikes),
          reposts: rawReposts,
          repostsDisplay: formatNumber(rawReposts),
          totalComments: rawTotalComments, 
          totalCommentsDisplay: formatNumber(rawTotalComments),
          comments: {} as Record<string, any>
        };

        for (let j = 1; j <= 10; j++) {
            const commentId = `${postId}c${j}`;
            const cLikes = generateGaussian(7500, 2500, 0, 15000);
            const cReposts = generateGaussian(1000, 333, 0, 2000);

            feedEngagement[postId].comments[commentId] = {
                likes: cLikes,
                likesDisplay: formatNumber(cLikes),
                reposts: cReposts,
                repostsDisplay: formatNumber(cReposts)
            };
        }
      }
      
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // Update Firestore with assigned conditions
      await updateDoc(doc(db, 'participants', participantId), {
        valenceCondition: assignedValence,
        engagementCondition: 'randomized_gaussian', 
        feedEngagement: feedEngagement,
        sessionId: sessionId,
        status: 'instructions_completed',
        instructionsCompletedAt: serverTimestamp()
      });

      // Reconstruct URL Parameters for Qualtrics Continuity
      const params = new URLSearchParams();
      const idKeys = ['id', 'PROLIFIC_PID', 'participantId', 'uid', 'STUDY_ID', 'SESSION_ID'];
      
      idKeys.forEach(key => {
        const val = localStorage.getItem(key);
        if (val) params.set(key, val);
      });

      router.push(`/tutorial?${params.toString()}`);

    } catch (error) {
      console.error("Error starting simulation:", error);
      setIsSubmitting(false);
      alert("System error. Please refresh and try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg border-muted">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Instructions</CardTitle>
          <CardDescription className="text-center">Please read carefully before starting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-lg leading-relaxed text-foreground">
            <p>
              In this study, you will interact with a simulated social media feed based on real posts and comments online about unfolding news stories.
            </p>
            <p>
              While you interact with this platform, your responses and interaction data will remain <strong>anonymous</strong> and will not be attributable to you.
            </p>
            <p>
              You can like and repost any posts and comments, and even leave your own comments.
            </p>
            <p>
              <strong>IMPORTANT:</strong> To fully experience the social media feed, <strong>you must view each post and read the comment section</strong>. Click directly on a post or the comment icon to view comments—this is essential for completing the study and for context.
            </p>
            <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r mt-4">
                <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Technical Note</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Please <strong>do not refresh your browser</strong> during the simulation. 
                            Refreshing will reset the feed and may affect your completion status.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            size="lg" 
            className="w-full text-lg py-6 font-semibold"
            onClick={handleStartSimulation} 
            disabled={!participantId || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Initializing Simulation...
              </>
            ) : (
              "Start Tutorial"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}