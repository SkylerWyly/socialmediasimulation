'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { assignCondition } from '@/lib/conditions';
import { setCondition } from '@/lib/data-logger';

const conditions = [
  'sympathetic-high', 'sympathetic-low',
  'condemning-high', 'condemning-low',
  'neutral-high', 'neutral-low'
];

export default function InstructionsPage() {
  const isDevMode = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Automatically assign and log condition if not in dev mode
    if (!isDevMode && !localStorage.getItem('participantCondition')) {
      const assignedCondition = assignCondition();
      if(assignedCondition) {
        setCondition(assignedCondition);
      }
    }
  }, [isDevMode]);

  const handleConditionChange = (condition: string) => {
    if (isDevMode) {
      try {
        localStorage.setItem('participantCondition', condition);
        setCondition(condition);
        console.log('Manually set condition to:', condition);
      } catch (error) {
        console.error('Failed to set participant condition:', error);
      }
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
            You will now be taken to a tutorial section with a simulated social media feed.
            You are encouraged to interact with the content as you normally would on any social media platform to familiarize yourself with the features.
          </p>
          <p>
            You can like posts, share them, and add comments or replies. 
            After you've had a chance to try things out, a button will appear to start the main experiment.
          </p>
          <p>Click the "Begin Tutorial" button below when you are ready to begin.</p>
          
          {isDevMode && (
            <Card className="mt-6 bg-muted/50 p-4">
              <h3 className="font-bold text-lg mb-2">Development Controls</h3>
              <p className="text-sm text-muted-foreground mb-4">Select a condition to test. This panel is only visible in development mode.</p>
              <RadioGroup onValueChange={handleConditionChange}>
                <div className="grid grid-cols-2 gap-4">
                  {conditions.map(condition => (
                    <div key={condition} className="flex items-center space-x-2">
                      <RadioGroupItem value={condition} id={condition} />
                      <Label htmlFor={condition} className="capitalize font-normal">{condition.replace('-', ' ')}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/tutorial" passHref>
            <Button size="lg">Begin Tutorial</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
