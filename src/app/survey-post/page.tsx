'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
// Firebase Imports
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function SurveyPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const likertQuestions = [
    { id: 'q1-post', text: 'To what extent do you agree with the opinions expressed in the posts you saw?' },
    { id: 'q2-post', text: 'How credible did you find the information presented?' },
  ];

  const likertLabels = [
    'Not at all',
    'Slightly',
    'Moderately',
    'Very',
    'Extremely',
  ];
  
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setResponses(prev => ({ ...prev, 'slider1-post': value[0] }));
  };

  const isFormComplete = () => {
    const answeredLikert = likertQuestions.every(q => responses[q.id]);
    const answeredSlider = responses['slider1-post'] !== undefined;
    return answeredLikert && answeredSlider;
  };

  const handleContinue = async () => {
    setSubmitted(true);
    
    if (!isFormComplete()) {
      toast({
        title: "Incomplete Form",
        description: "Please answer all questions before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Save to Firebase
    const participantId = localStorage.getItem('participantId');
    if (participantId) {
        setIsSaving(true);
        try {
            await updateDoc(doc(db, 'participants', participantId), {
                surveyPost: responses,
                surveyPostCompletedAt: serverTimestamp()
            });
            
            // --- REDIRECT UPDATE ---
            // Send user to the final redirect page which handles the Qualtrics handoff
            router.push('/redirect'); 
            
        } catch (error) {
            console.error("Error saving survey:", error);
            setIsSaving(false);
            toast({ title: "Error", description: "Could not save responses. Please try again." });
        }
    } else {
        // Fallback if ID is missing (dev mode)
        router.push('/redirect');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle>Post-Study Survey</CardTitle>
          <CardDescription className="text-base text-foreground">
            Please answer the following questions based on your experience in the study.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-6">
                {likertQuestions.map((question) => (
                <div key={question.id}>
                    <Label className={cn("font-semibold text-lg", submitted && !responses[question.id] && "text-destructive")}>
                        {question.text}
                    </Label>
                    <RadioGroup 
                        className="mt-4"
                        onValueChange={(value) => handleResponseChange(question.id, value)}
                        value={responses[question.id] as string}
                    >
                    <div className="flex flex-col gap-y-4 md:flex-row md:justify-around">
                        {likertLabels.map((label, index) => (
                        <div key={`${question.id}-${index}`} className="flex items-center space-x-3 md:flex-col md:space-x-0 md:space-y-2 md:w-24">
                            <RadioGroupItem value={String(index + 1)} id={`${question.id}-${index}`} className="h-5 w-5 md:h-4 md:w-4" />
                            <Label htmlFor={`${question.id}-${index}`} className="text-base text-center font-normal md:text-sm">{label}</Label>
                        </div>
                        ))}
                    </div>
                    </RadioGroup>
                </div>
                ))}
            </div>

            <Separator />

            <div>
                <Label htmlFor="slider1-post" className={cn("font-semibold text-lg", submitted && responses['slider1-post'] === undefined && "text-destructive")}>
                    How engaging did you find the social media feed?
                </Label>
                <div className="mt-4">
                <Slider
                    id="slider1-post"
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    className="w-full"
                    onValueChange={handleSliderChange}
                />
                <div className="flex justify-between text-base mt-2 text-foreground">
                    <span>Not at all engaging</span>
                    <span>Moderately engaging</span>
                    <span>Very engaging</span>
                </div>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button size="lg" onClick={handleContinue} disabled={isSaving}>
                {isSaving ? "Saving..." : "Submit & Finish"}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}