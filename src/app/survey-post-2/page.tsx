'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { logEvent } from '@/lib/data-logger';

export default function SurveyPostPage2() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  const questions = [
    { id: 'q1-dv', text: 'It is sometimes necessary to bend the rules to help a loved one.' },
    { id: 'q2-dv', text: 'People who are in a panic should not be held fully responsible for their actions.' },
    { id: 'q3-dv', text: 'In a crisis, a person\'s first responsibility is to their family, even if it means delaying their responsibility to others.' },
  ];

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
        page: 'survey-post-2',
        questionId: questionId,
        response: value
    });
  };

  const isFormComplete = () => {
    return questions.every(q => responses[q.id]);
  };

  const handleContinue = () => {
    setSubmitted(true);
    if (isFormComplete()) {
      router.push('/demographics');
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
          <CardTitle>Post-Study Survey (2 of 2)</CardTitle>
          <CardDescription className="text-base text-foreground">Please continue to answer the following questions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-6">
                {questions.map((question) => (
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
                            <RadioGroupItem value={String(index + 1)} id={`${question.id}-${index}`} className="h-5 w-5 md:h-4 md:w-4" />
                            <Label htmlFor={`${question.id}-${index}`} className="text-base text-center font-normal md:text-sm">{label}</Label>
                        </div>
                        ))}
                    </div>
                    </RadioGroup>
                </div>
                ))}
            </div>
        </CardContent>
        <CardFooter>
            <Button size="lg" onClick={handleContinue}>Continue to Demographics</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
