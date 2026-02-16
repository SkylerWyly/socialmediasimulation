'use client';

import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { initializeParticipant } from '@/lib/data-logger';

export function ConsentPageContent() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const idKeys = ['id', 'PROLIFIC_PID', 'participantId'];
    let participantId: string | null = null;

    for (const key of idKeys) {
      if (searchParams.has(key)) {
        participantId = searchParams.get(key);
        break;
      }
    }
    
    if (!participantId && process.env.NODE_ENV === 'development') {
        participantId = `dev_${Math.random().toString(36).substring(2, 9)}`;
    }

    if (participantId) {
      try {
        // Local persistence
        localStorage.setItem('participantId', participantId);
        initializeParticipant(participantId);

        // Firebase: Log initial arrival
        setDoc(doc(db, 'participants', participantId), {
          participantId: participantId,
          status: 'landed_on_consent',
          consented: false,
          landedAt: serverTimestamp(),
          valenceCondition: 'not_assigned',
          engagementCondition: 'not_assigned'
        }, { merge: true });

        console.log(`Participant ID ${participantId} initialized in Firebase.`);
      } catch (error) {
        console.error('Initialization error:', error);
      }
    }
  }, [searchParams]);

  const handleContinue = async () => {
    const participantId = localStorage.getItem('participantId');
    if (!participantId) return;

    setIsSubmitting(true);
    try {
      // Update Firebase to confirm consent before moving on
      await updateDoc(doc(db, 'participants', participantId), {
        status: 'consented',
        consented: true,
        consentedAt: serverTimestamp()
      });
      
      // Navigate to the pre-survey
      router.push('/survey-pre');
    } catch (error) {
      console.error("Error saving consent:", error);
      setIsSubmitting(false);
      // Fallback: move forward anyway if Firebase fails, so we don't lose the participant
      router.push('/survey-pre');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Informed Consent</CardTitle>
          <CardDescription>Please read the following information carefully before proceeding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to our study. This research aims to understand user behavior on social media platforms.
            Your participation will involve viewing and interacting with a simulated social media feed.
            The study is expected to take approximately 15-20 minutes to complete.
          </p>
          <p>
            Your participation in this study is completely voluntary. You can withdraw at any time without any penalty.
            All data collected will be anonymous and used solely for research purposes.
          </p>
          <p>
            There are no direct benefits to you for participating, but your contribution will help advance our understanding of social media dynamics.
            There are no foreseeable risks associated with this study beyond those encountered in everyday computer use.
          </p>
          <div className="items-top flex space-x-2 mt-6">
            <Checkbox 
              id="terms1" 
              checked={consentGiven}
              onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="terms1" className="font-bold cursor-pointer">
                I have read and understood the information above.
              </Label>
              <p className="text-sm text-muted-foreground">
                By checking this box, I consent to participate in the study.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            disabled={!consentGiven || isSubmitting} 
            onClick={handleContinue}
          >
            {isSubmitting ? "Saving..." : "Agree & Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
