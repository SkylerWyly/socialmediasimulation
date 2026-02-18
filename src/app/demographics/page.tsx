'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { logEvent } from '@/lib/data-logger';

export default function DemographicsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [race, setRace] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isAgeValid = () => {
    const numericAge = Number(age);
    return !isNaN(numericAge) && numericAge >= 18 && numericAge <= 120;
  };

  const isFormComplete = () => {
    return isAgeValid() && gender && education && ethnicity && race;
  };

  const logResponse = (questionId: string, response: string | number) => {
    logEvent('demographics_response', {
      questionId,
      response,
    });
  };

  const handleContinue = () => {
    setSubmitted(true);
    if (isFormComplete()) {
      router.push('/debriefing');
    } else {
      toast({
        title: "Incomplete Form",
        description: "Please complete all required fields before continuing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
          <CardDescription className="text-base text-foreground">Please provide some information about yourself. This data is collected for statistical purposes only.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-lg font-semibold">Age</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="e.g., 25"
              value={age}
              onChange={(e) => {
                  setAge(e.target.value);
                  if (Number(e.target.value) >= 18 && Number(e.target.value) <= 120) {
                      logResponse('age', e.target.value);
                  }
              }}
              min="18"
              max="120"
              className={cn(submitted && !isAgeValid() && "border-destructive")}
            />
             {submitted && !isAgeValid() && (
                <p className="text-sm text-destructive">Please enter a valid age between 18 and 120.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className={cn("text-lg font-semibold", submitted && !gender && "text-destructive")}>Gender</Label>
            <RadioGroup onValueChange={(value) => { setGender(value); logResponse('gender', value); }} value={gender} className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" className="h-5 w-5 md:h-4 md:w-4"/>
                    <Label htmlFor="male" className="text-base font-normal md:text-sm">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" className="h-5 w-5 md:h-4 md:w-4"/>
                    <Label htmlFor="female" className="text-base font-normal md:text-sm">Female</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nonbinary" id="nonbinary" className="h-5 w-5 md:h-4 md:w-4"/>
                    <Label htmlFor="nonbinary" className="text-base font-normal md:text-sm">Non-binary</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other-gender" id="other-gender" className="h-5 w-5 md:h-4 md:w-4"/>
                    <Label htmlFor="other-gender" className="text-base font-normal md:text-sm">Other / Prefer not to say</Label>
                </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education" className={cn("text-lg font-semibold", submitted && !education && "text-destructive")}>Highest Level of Education Completed</Label>
            <Select onValueChange={(value) => { setEducation(value); logResponse('education', value); }} value={education}>
              <SelectTrigger id="education" className={cn("mt-2", submitted && !education && "border-destructive")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high-school">High School or equivalent</SelectItem>
                <SelectItem value="some-college">Some college, no degree</SelectItem>
                <SelectItem value="associates">Associate's degree</SelectItem>
                <SelectItem value="bachelors">Bachelor's degree</SelectItem>
                <SelectItem value="masters">Master's degree</SelectItem>
                <SelectItem value="doctorate">Doctorate or professional degree</SelectItem>
                <SelectItem value="prefer-not-to-say-education">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

           <div className="space-y-2">
            <Label htmlFor="ethnicity" className={cn("text-lg font-semibold", submitted && !ethnicity && "text-destructive")}>Ethnicity</Label>
            <Select onValueChange={(value) => { setEthnicity(value); logResponse('ethnicity', value); }} value={ethnicity}>
              <SelectTrigger id="ethnicity" className={cn("mt-2", submitted && !ethnicity && "border-destructive")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hispanic-latino">Hispanic or Latino</SelectItem>
                <SelectItem value="not-hispanic-latino">Not Hispanic or Latino</SelectItem>
                <SelectItem value="prefer-not-to-say-ethnicity">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

           <div className="space-y-2">
            <Label className={cn("text-lg font-semibold", submitted && !race && "text-destructive")}>Race</Label>
             <Select onValueChange={(value) => { setRace(value); logResponse('race', value); }} value={race}>
              <SelectTrigger id="race" className={cn("mt-2", submitted && !race && "border-destructive")}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="american-indian-alaska-native">American Indian or Alaska Native</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="black-african-american">Black or African American</SelectItem>
                <SelectItem value="native-hawaiian-pacific-islander">Native Hawaiian or Other Pacific Islander</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="multiracial">Multiracial or Biracial</SelectItem>
                <SelectItem value="other-race">Other</SelectItem>
                <SelectItem value="prefer-not-to-say-race">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {(race === 'multiracial' || race === 'other-race') && (
              <div className="mt-2 space-y-2">
                <Label htmlFor="race-text" className="text-sm">
                  Please specify:
                </Label>
                <Input id="race-text" placeholder="Please describe" onChange={(e) => logResponse('race_specified', e.target.value)} />
              </div>
            )}
          </div>

        </CardContent>
        <CardFooter>
            <Button size="lg" onClick={handleContinue}>
                Continue to Debriefing
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
