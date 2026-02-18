
'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exportData } from '@/lib/data-logger';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';

export default function DebriefingPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCompleteStudy = async () => {
    setIsSubmitting(true);
    const finalData = exportData();

    if (!finalData) {
      toast({
        title: "Submission Error",
        description: "Could not retrieve participant data to submit.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/submit-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ error: 'Could not parse error response.' }));
        console.error('Server error response:', errorBody);
        const errorMessage = errorBody.details || errorBody.error || 'An unknown server error occurred.';
        throw new Error(`Server responded with status: ${response.status}. Message: ${errorMessage}`);
      }

      console.log('Data submitted successfully.');
      setIsSubmitted(true);

    } catch (error: any) {
      console.error('Failed to submit data:', error);
      toast({
        title: "Submission Error",
        description: error.message || "There was a problem submitting your data. Please contact the researcher.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Debriefing</CardTitle>
          <CardDescription>Thank you for your participation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Thank you for completing the study. The purpose of this research was to examine how users engage with different types of social media content.
            Some of the posts and users you interacted with were simulated to test specific hypotheses about user behavior.
          </p>
          <p>
            All the data we collected is anonymous and will be kept confidential. Your contribution is greatly appreciated and will help us better understand the dynamics of online social environments.
          </p>
          <p>
            If you have any questions about this study, please feel free to contact the research team at [Researcher Contact Information].
          </p>
          {isSubmitted ? (
            <div className="flex items-center gap-3 rounded-md border border-green-500 bg-green-50 p-4 text-green-700 dark:bg-green-950 dark:text-green-300">
                <CheckCircle className="h-6 w-6" />
                <div>
                    <p className="font-bold">Submission successful!</p>
                    <p className="text-sm">Your data has been saved. Thank you for completing the study.</p>
                </div>
            </div>
          ) : (
            <p className="font-bold pt-4">
              Click the button below to complete the study and receive your credit.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCompleteStudy} size="lg" disabled={isSubmitting || isSubmitted}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitted ? 'Completed' : isSubmitting ? 'Submitting...' : 'Complete Study'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
