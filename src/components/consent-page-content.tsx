
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { initializeParticipant } from '@/lib/data-logger';

export function ConsentPageContent() {
  const [consentGiven, setConsentGiven] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // List of possible query parameter keys for participant IDs
    const idKeys = ['id', 'PROLIFIC_PID', 'participantId'];
    let participantId: string | null = null;

    for (const key of idKeys) {
      if (searchParams.has(key)) {
        participantId = searchParams.get(key);
        break; // Stop at the first key found
      }
    }
    
    // In development mode, if no ID is found, generate a random one.
    if (!participantId && process.env.NODE_ENV === 'development') {
        participantId = `dev_${Math.random().toString(36).substring(2, 9)}`;
        console.log(`Development mode: using generated participant ID ${participantId}`);
    }

    if (participantId) {
      try {
        localStorage.setItem('participantId', participantId);
        initializeParticipant(participantId);
        console.log(`Participant ID ${participantId} saved and logger initialized.`);
      } catch (error) {
        console.error('Failed to save participant ID or initialize logger:', error);
      }
    } else {
      console.log('No participant ID found in URL.');
    }
  }, [searchParams]);

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
              <Label htmlFor="terms1" className="font-bold">
                I have read and understood the information above.
              </Label>
              <p className="text-sm text-muted-foreground">
                By checking this box, I consent to participate in the study.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/survey-pre">
            <Button disabled={!consentGiven}>Agree & Continue</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
