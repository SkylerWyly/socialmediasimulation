'use client';

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
import { Loader2, AlertCircle } from 'lucide-react';

// Firebase Imports
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function SurveyPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // --- GENERAL FEEDBACK MEASURES ---
  const likertQuestions = [
    { id: 'q1-post', text: 'To what extent do you agree with the opinions expressed in the comments you saw?' },
    { id: 'q2-post', text: 'How credible did you find the information presented?' },
  ];
  const likertLabels = ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely'];

  // --- BLAMEWORTHINESS MEASURES ---
  const blameQuestions = [
    { id: 'blame_camille', text: 'Please rate how blameworthy Camille Reyes was for her decision to assault Jordan Vale.' },
    { id: 'blame_marcus', text: 'Please rate how blameworthy Marcus Webb was for his decision to set his house on fire. ' }
  ];
  const blameLabels = ['0 - Not blameworthy at all', '1', '2', '3', '4', '5', '6 - Extremely blameworthy'];

  // --- EMOTIONALITY POST-MEASURES ---
  const emotionalityQuestions = [
    { id: 'EMO_POST_1', text: 'How morally wrong was the student\'s behavior in this situation?' },
    { id: 'EMO_POST_2', text: 'How strongly do you feel about individuals circumventing official channels and taking matters into their own hands?' }
  ];
  const emo1Labels = ['1 - Not at all morally wrong', '2', '3', '4', '5', '6 - Extremely morally wrong'];
  const emo2Labels = ['1 - Not at all', '2', '3', '4', '5', '6', '7 - Extremely'];

  const allRadioQuestions = [...likertQuestions, ...blameQuestions, ...emotionalityQuestions];

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setResponses(prev => ({ ...prev, 'slider1-post': value[0] }));
  };

  const isFormComplete = () => {
    const answeredRadio = allRadioQuestions.every(q => responses[q.id]);
    const answeredSlider = responses['slider1-post'] !== undefined;
    return answeredRadio && answeredSlider;
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
      const firstUnanswered = allRadioQuestions.find(q => !responses[q.id]);
      if (firstUnanswered) {
        document.getElementById(firstUnanswered.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (responses['slider1-post'] === undefined) {
        document.getElementById('slider-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Save to Firebase
    const participantId = localStorage.getItem('participantId');
    if (participantId) {
        setIsSaving(true);
        try {
            await updateDoc(doc(db, 'participants', participantId), {
                surveyPost: responses,
                status: 'survey_completed', 
                surveyPostCompletedAt: serverTimestamp()
            });
            
            router.push('/redirect'); 
            
        } catch (error) {
            console.error("Error saving survey:", error);
            setIsSaving(false);
            toast({ title: "Error", description: "Could not save responses. Please try again." });
        }
    } else {
        router.push('/redirect');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-8">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="border-b mb-6 bg-muted/30">
          <CardTitle className="text-2xl">Post-Study Survey</CardTitle>
          <CardDescription className="text-base text-foreground">
            Please answer the following questions based on your experience during the simulation.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-12">
            
            {/* GENERAL FEEDBACK SECTION */}
            <div>
              <div className="mb-6">
                <h3 className="font-bold text-xl text-primary">Simulation Experience</h3>
              </div>
              <div className="space-y-8">
                  {likertQuestions.map((question) => (
                  <div key={question.id} id={question.id} className={cn("p-5 rounded-lg border bg-card", submitted && !responses[question.id] ? "border-destructive bg-destructive/5" : "border-border")}>
                      <Label className={cn("font-semibold text-base mb-4 block", submitted && !responses[question.id] && "text-destructive")}>
                          {question.text}
                      </Label>
                      <RadioGroup onValueChange={(value) => handleResponseChange(question.id, value)} value={responses[question.id] as string} className="flex flex-col space-y-3 mt-4 ml-6">
                        {likertLabels.map((label, index) => (
                          <div key={`${question.id}-${index}`} className="flex items-center space-x-3">
                              <RadioGroupItem value={String(index + 1)} id={`${question.id}-${index}`} className="h-4 w-4" />
                              <Label htmlFor={`${question.id}-${index}`} className="text-sm font-normal cursor-pointer leading-none">{label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                  </div>
                  ))}

                  {/* SLIDER QUESTION */}
                  <div id="slider-section" className={cn("p-5 rounded-lg border bg-card", submitted && responses['slider1-post'] === undefined ? "border-destructive bg-destructive/5" : "border-border")}>
                      <Label htmlFor="slider1-post" className={cn("font-semibold text-base", submitted && responses['slider1-post'] === undefined && "text-destructive")}>
                          How engaging did you find the social media feed?
                      </Label>
                      <div className="mt-8 px-2">
                        <Slider
                            id="slider1-post"
                            defaultValue={[50]}
                            max={100}
                            step={1}
                            className="w-full"
                            onValueChange={handleSliderChange}
                        />
                        <div className="flex justify-between text-sm mt-4 text-muted-foreground font-medium">
                            <span>Not at all engaging</span>
                            <span>Moderately engaging</span>
                            <span>Very engaging</span>
                        </div>
                      </div>
                  </div>
              </div>
            </div>

            <Separator />

            {/* BLAMEWORTHINESS SECTION */}
            <div>
              <div className="mb-6">
                <h3 className="font-bold text-xl text-primary">Story Evaluation</h3>
                <p className="text-muted-foreground text-sm mt-1">Please evaluate the actions of the individuals you read about in the feed.</p>
              </div>
              <div className="space-y-8">
                  {blameQuestions.map((question) => (
                  <div key={question.id} id={question.id} className={cn("p-5 rounded-lg border bg-card", submitted && !responses[question.id] ? "border-destructive bg-destructive/5" : "border-border")}>
                      <Label className={cn("font-semibold text-base mb-4 block", submitted && !responses[question.id] && "text-destructive")}>
                          {question.text}
                      </Label>
                      <RadioGroup onValueChange={(value) => handleResponseChange(question.id, value)} value={responses[question.id] as string} className="flex flex-col space-y-3 mt-4 ml-6">
                        {blameLabels.map((label, index) => (
                          <div key={`${question.id}-${index}`} className="flex items-center space-x-3">
                              <RadioGroupItem value={String(index)} id={`${question.id}-${index}`} className="h-4 w-4" />
                              <Label htmlFor={`${question.id}-${index}`} className="text-sm font-normal cursor-pointer leading-none">{label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                  </div>
                  ))}
              </div>
            </div>

            <Separator />

            {/* EMOTIONALITY POST-MEASURE SECTION */}
            <div>
              <div className="mb-6">
                <h3 className="font-bold text-xl text-primary">Final Scenario Evaluation</h3>
                <p className="text-muted-foreground text-sm mt-1">Please read the following scenario carefully and answer the questions below.</p>
              </div>
              
              <div className="space-y-8">
                
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
                <div id="EMO_POST_1" className={cn("p-5 rounded-lg border bg-card", submitted && !responses['EMO_POST_1'] ? "border-destructive bg-destructive/5" : "border-border")}>
                  <Label className={cn("font-semibold text-base mb-4 block", submitted && !responses['EMO_POST_1'] && "text-destructive")}>
                    How morally wrong was the student's behavior in this situation?
                  </Label>
                  <RadioGroup onValueChange={(value) => handleResponseChange('EMO_POST_1', value)} value={responses['EMO_POST_1'] as string} className="flex flex-col space-y-3 mt-4 ml-6">
                    {emo1Labels.map((label, index) => (
                      <div key={`emoPost1-${index}`} className="flex items-center space-x-3">
                        <RadioGroupItem value={String(index + 1)} id={`emoPost1-${index}`} className="h-4 w-4" />
                        <Label htmlFor={`emoPost1-${index}`} className="text-sm font-normal cursor-pointer leading-none">{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Question 2 */}
                <div id="EMO_POST_2" className={cn("p-5 rounded-lg border bg-card", submitted && !responses['EMO_POST_2'] ? "border-destructive bg-destructive/5" : "border-border")}>
                  <Label className={cn("font-semibold text-base mb-4 block leading-relaxed", submitted && !responses['EMO_POST_2'] && "text-destructive")}>
                    How strongly do you feel about individuals circumventing official channels and taking matters into their own hands?
                  </Label>
                  <RadioGroup onValueChange={(value) => handleResponseChange('EMO_POST_2', value)} value={responses['EMO_POST_2'] as string} className="flex flex-col space-y-3 mt-4 ml-6">
                    {emo2Labels.map((label, index) => (
                      <div key={`emoPost2-${index}`} className="flex items-center space-x-3">
                        <RadioGroupItem value={String(index + 1)} id={`emoPost2-${index}`} className="h-4 w-4" />
                        <Label htmlFor={`emoPost2-${index}`} className="text-sm font-normal cursor-pointer leading-none">{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

              </div>
            </div>

        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 pt-6 border-t bg-muted/20 rounded-b-lg">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Upon submitting, you will be securely redirected to Qualtrics to complete the final portion of the study.
            </p>
            <Button size="lg" className="w-full md:w-auto px-12" onClick={handleContinue} disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Submit & Continue to Part 2"}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}