'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// --- Gaussian Randomizer Helper Functions (Retained for experimental realism) ---
const boxMullerTransform = () => {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z1;
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
        // Redirect to consent if ID is missing
        router.push('/'); 
    }
  }, [router]);

  const handleStartSimulation = async () => {
    if (!participantId) return;
    setIsSubmitting(true);

    try {
      // 1. Assign Valence Condition
      const assignedValence = VALENCE_CONDITIONS[Math.floor(Math.random() * VALENCE_CONDITIONS.length)];
      
      // 2. Generate Unique Engagement Map for p1 through p8
      const feedEngagement: Record<string, any> = {};

      for (let i = 1; i <= 8; i++) {
        const postId = `p${i}`;
        
        feedEngagement[postId] = {
          likes: generateGaussian(530000, 150000, 80000, 980000),
          reposts: generateGaussian(30000, 5000, 15000, 45000),
          comments: {} as Record<string, any>
        };

        // Generate stats for up to 10 comments per post
        for (let j = 1; j <= 10; j++) {
            const commentId = `${postId}c${j}`;
            feedEngagement[postId].comments[commentId] = {
                likes: generateGaussian(7500, 2500, 0, 15000),
                reposts: generateGaussian(1000, 333, 0, 2000)
            };
        }
      }
      
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // 3. Save experimental setup to Firebase
      await updateDoc(doc(db, 'participants', participantId), {
        valenceCondition: assignedValence,
        engagementCondition: 'randomized_gaussian', 
        feedEngagement: feedEngagement,
        sessionId: sessionId,
        status: 'instructions_completed',
        instructionsCompletedAt: serverTimestamp()
      });

      // 4. Navigate to Tutorial (Sun-dried tomato content)
      router.push('/tutorial');

    } catch (error) {
      console.error("Error starting simulation:", error);
      setIsSubmitting(false);
      alert("System error. Please refresh and try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">Instructions</CardTitle>
          <CardDescription className="text-center">Please read carefully before starting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-lg leading-relaxed">
            <p>
              In this study, you will interact with a simulated social media feed. Your task is to <strong>browse the feed naturally</strong> as you would on your own phone.
            </p>
            <p>
              Feel free to read posts, view comments, like content, and form your own impressions.
            </p>
            
            {/* AMBER WARNING BANNER to prevent data loss */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r mt-4">
                <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-amber-800">Important Technical Note</p>
                        <p className="text-sm text-amber-700">
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
            className="w-full text-lg py-6"
            onClick={handleStartSimulation} 
            disabled={!participantId || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Initializing...
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