'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';

// Firebase Imports
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function SurveyPrePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- EMOTIONALITY MEASURES ---
  const emotionalityQuestions = [
    { id: 'EMO_1', text: 'How morally wrong was the student\'s behavior in this situation?' },
    { id: 'EMO_2', text: 'How strongly do you feel about individuals circumventing official channels and taking matters into their own hands?' }
  ];

  const emo1Labels = ['1 - Not at all morally wrong', '2', '3', '4', '5', '6 - Extremely morally wrong'];
  const emo2Labels = ['1 - Not at all', '2', '3', '4', '5', '6', '7 - Extremely'];

  const allQuestions = [...emotionalityQuestions];

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const isFormComplete = () => {
    return allQuestions.every(q => responses[q.id]);
  };

  const handleContinue = async () => {
    setSubmitted(true);
    
    if (!isFormComplete()) {
      toast({
        title: "Incomplete Form",
        description: "Please answer all questions before continuing.",
        variant: "destructive",
      });
      
      // Scroll to the first unanswered question
      const firstUnanswered = allQuestions.find(q => !responses[q.id]);
      if (firstUnanswered) {
        document.getElementById(firstUnanswered.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const participantId = localStorage.getItem('participantId');
    if (participantId) {
        setIsSaving(true);
        try {
            await updateDoc(doc(db, 'participants', participantId), {
                surveyPre: responses,
                status: 'survey_pre_completed',
                surveyPreCompletedAt: serverTimestamp()
            });
            
            router.push('/instructions'); 
            
        } catch (error) {
            console.error("Error saving survey:", error);
            setIsSaving(false);
            toast({ title: "Error", description: "Could not save responses. Please try again." });
        }
    } else {
        router.push('/instructions');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-8">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="border-b mb-6 bg-muted/30">
          <CardTitle className="text-2xl text-primary">Scenario Evaluation</CardTitle>
          <CardDescription className="text-base text-foreground mt-1">
            Please read the following scenario carefully and answer the questions below.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          
          {/* Prominent Vignette Callout */}
          <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <p className="text-lg md:text-xl font-medium italic text-foreground leading-relaxed">
                A student believed they had been unfairly graded on multiple assignments throughout the semester. After raising concerns directly with the professor, filing a formal grade appeal with the department, and meeting with the dean of students, no changes were made and the student received no satisfactory explanation. The student then anonymously leaked the professor's upcoming final exam to other students in the class.
              </p>
            </div>
          </div>

          {/* Question 1 */}
          <div id="EMO_1" className={cn("p-5 rounded-lg border bg-card", submitted && !responses['EMO_1'] ? "border-destructive bg-destructive/5" : "border-border")}>
            <Label className={cn("font-semibold text-base mb-4 block", submitted && !responses['EMO_1'] && "text-destructive")}>
              How morally wrong was the student's behavior in this situation?
            </Label>
            <RadioGroup onValueChange={(value) => handleResponseChange('EMO_1', value)} value={responses['EMO_1']} className="flex flex-col space-y-3 mt-4 ml-6">
              {emo1Labels.map((label, index) => (
                <div key={`emo1-${index}`} className="flex items-center space-x-3">
                  <RadioGroupItem value={String(index + 1)} id={`emo1-${index}`} className="h-4 w-4" />
                  <Label htmlFor={`emo1-${index}`} className="text-sm font-normal cursor-pointer leading-none">{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Question 2 */}
          <div id="EMO_2" className={cn("p-5 rounded-lg border bg-card", submitted && !responses['EMO_2'] ? "border-destructive bg-destructive/5" : "border-border")}>
            <Label className={cn("font-semibold text-base mb-4 block leading-relaxed", submitted && !responses['EMO_2'] && "text-destructive")}>
              How strongly do you feel about individuals circumventing official channels and taking matters into their own hands?
            </Label>
            <RadioGroup onValueChange={(value) => handleResponseChange('EMO_2', value)} value={responses['EMO_2']} className="flex flex-col space-y-3 mt-4 ml-6">
              {emo2Labels.map((label, index) => (
                <div key={`emo2-${index}`} className="flex items-center space-x-3">
                  <RadioGroupItem value={String(index + 1)} id={`emo2-${index}`} className="h-4 w-4" />
                  <Label htmlFor={`emo2-${index}`} className="text-sm font-normal cursor-pointer leading-none">{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
        </CardContent>
        <CardFooter className="flex justify-end pt-6 border-t bg-muted/20 rounded-b-lg mt-4">
            <Button size="lg" className="w-full md:w-auto px-12" onClick={handleContinue} disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Continue to Instructions"}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}