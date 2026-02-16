
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Helper function for Box-Muller transform to get a normally distributed random number
const boxMullerTransform = (): [number, number] => {
  let u1 = 0, u2 = 0;
  // Convert [0,1) to (0,1)
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const z2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
  return [z1, z2];
};

// Generates a random number from a Gaussian distribution, clamped to a min/max
const generateGaussian = (mean: number, stdDev: number, min: number, max: number): number => {
  const [z1] = boxMullerTransform();
  const value = z1 * stdDev + mean;
  return Math.max(min, Math.min(Math.round(value), max));
};

const VALENCE_CONDITIONS = ["sympathetic", "condemning", "neutral"];

export default function InstructionsPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Read participantId from localStorage on the client
    const id = localStorage.getItem('participantId');
    setParticipantId(id);
  }, []);

  const assignConditionsAndStart = async () => {
    if (!participantId) {
      alert("Error: Participant ID not found. Please start over.");
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Assign Valence Condition
      const valenceCondition = VALENCE_CONDITIONS[Math.floor(Math.random() * VALENCE_CONDITIONS.length)];

      // 2. Generate Engagement Stats using Gaussian distribution
      const engagementStats = {
        postLikes: generateGaussian(530000, 150000, 80000, 980000),
        postReposts: generateGaussian(30000, 5000, 15000, 45000),
        commentLikes: generateGaussian(7500, 2500, 0, 15000),
        commentReposts: generateGaussian(1000, 333, 0, 2000),
      };

      // 3. Generate a unique session ID
      const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // 4. Save to Firebase
      const participantRef = doc(db, 'participants', participantId);
      await updateDoc(participantRef, {
        valenceCondition,
        engagementStats,
        sessionId,
      });

      // 5. Navigate to the simulation page
      router.push('/simulation');

    } catch (error) {
      console.error("Failed to assign conditions and update Firebase:", error);
      alert("An error occurred while starting the simulation. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>How to participate in this study.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You will now be taken to a simulated social media feed. Your task is to browse the feed and interact with the content as you normally would.
          </p>
          <p>
            You can like, comment on, and share posts. Please engage with the content naturally for the duration of the session.
          </p>
          <p>
            Click the "Start Simulation" button below when you are ready to begin.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="lg" onClick={assignConditionsAndStart} disabled={isSubmitting || !participantId}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              "Start Simulation"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
