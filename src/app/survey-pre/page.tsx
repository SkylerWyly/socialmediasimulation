'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { logEvent } from '@/lib/data-logger';


export default function SurveyPrePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const scale1Questions = [
    { id: 's1q1', text: 'I use social media every day.' },
    { id: 's1q2', text: 'I often get my news from social media.' },
    { id: 's1q3', text: 'I frequently comment on or share posts I see on social media.' },
  ];

  const scale2Questions = [
    { id: 's2q1', text: 'I am confident in my ability to distinguish between true and false information online.' },
    { id: 's2q2', text: 'I believe online discussions are generally productive.' },
    { id: 's2q3', text: 'I am concerned about the presence of "echo chambers" on social media.' },
  ];
  
  const allQuestions = [...scale1Questions, ...scale2Questions];

  const likertLabels = [
    'Strongly Disagree',
    'Disagree',
    'Neutral',
    'Agree',
    'Strongly Agree',
  ];
  
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    logEvent('survey_response', {
        page: 'survey-pre',
        questionId: questionId,
        response: value
    });
  };

  const isFormComplete = () => {
    return allQuestions.every(q => responses[q.id]);
  };

  const handleContinue = () => {
    setSubmitted(true);
    if (isFormComplete()) {
      router.push('/instructions');
    } else {
      toast({
        title: "Incomplete Form",
        description: "Please answer all questions before continuing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle>Pre-Study Survey</CardTitle>
          <CardDescription className="text-base pt-1 text-foreground">Please answer the following questions about your habits and attitudes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div>
            <h3 className="font-bold text-xl mb-4">Social Media Usage</h3>
            <div className="space-y-6">
              {scale1Questions.map((question) => (
                <div key={question.id}>
                  <Label className={cn("font-semibold text-lg", submitted && !responses[question.id] && "text-destructive")}>{question.text}</Label>
                  <RadioGroup 
                    className="mt-4"
                    onValueChange={(value) => handleResponseChange(question.id, value)}
                    value={responses[question.id]}
                  >
                    <div className="flex flex-col gap-y-4 md:flex-row md:justify-around">
                      {likertLabels.map((label, index) => (
                        <div key={`${question.id}-${index}`} className="flex items-center space-x-3 md:flex-col md:space-x-0 md:space-y-2 md:w-24">
                          <RadioGroupItem value={String(index + 1)} id={`${question.id}-${index}`} className="h-5 w-5 md:h-4 md:w-4"/>
                          <Label htmlFor={`${question.id}-${index}`} className="text-base text-center font-normal md:text-sm">{label}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-bold text-xl mb-4">Online Information Attitudes</h3>
            <div className="space-y-6">
              {scale2Questions.map((question) => (
                <div key={question.id}>
                  <Label className={cn("font-semibold text-lg", submitted && !responses[question.id] && "text-destructive")}>{question.text}</Label>
                  <RadioGroup 
                    className="mt-4"
                    onValueChange={(value) => handleResponseChange(question.id, value)}
                    value={responses[question.id]}
                  >
                    <div className="flex flex-col gap-y-4 md:flex-row md:justify-around">
                      {likertLabels.map((label, index) => (
                        <div key={`${question.id}-${index}`} className="flex items-center space-x-3 md:flex-col md:space-x-0 md:space-y-2 md:w-24">
                          <RadioGroupItem value={String(index + 1)} id={`${question.id}-${index}`} className="h-5 w-5 md:h-4 md:w-4"/>
                          <Label htmlFor={`${question.id}-${index}`} className="text-base text-center font-normal md:text-sm">{label}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </div>
          
        </CardContent>
        <CardFooter>
            <Button size="lg" onClick={handleContinue}>Continue to Instructions</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
