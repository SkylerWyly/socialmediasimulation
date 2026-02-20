'use client';

import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input'; 
import { initializeParticipant } from '@/lib/data-logger';

export function ConsentPageContent() {
  const [consentChoice, setConsentChoice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // --- HONEYPOT STATE ---
  const [hpValue, setHpValue] = useState(''); 
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // 1. Platform-Specific ID capture (SONA, Prolific, CloudResearch)
    const idKeys = [
      'id', 'PROLIFIC_PID', 'STUDY_ID', 'SESSION_ID', 
      'participantId', 'assignmentId', 'projectId'
    ];
    
    let primaryId: string | null = null;
    const metaData: Record<string, string> = {};

    // Capture IDs from URL
    for (const key of idKeys) {
      if (searchParams.has(key)) {
        const val = searchParams.get(key)!;
        metaData[key] = val;
        
        // Define priority for primary participantId if multiple exist
        if (!primaryId && ['id', 'PROLIFIC_PID', 'participantId'].includes(key)) {
            primaryId = val; 
        }
      }
    }
    
    if (!primaryId && process.env.NODE_ENV === 'development') {
        primaryId = `dev_${Math.random().toString(36).substring(2, 9)}`;
    }

    if (primaryId) {
      try {
        setErrorMessage(null);
        localStorage.setItem('participantId', primaryId);
        
        // Save all incoming platform params to local storage for the final redirect
        searchParams.forEach((value, key) => {
          localStorage.setItem(key, value);
        });
        
        // Capture browser metadata for data cleaning
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';

        initializeParticipant(primaryId);

        // 2. Initializing Integrity: Sync IDs and User Agent to Firestore
        setDoc(doc(db, 'participants', primaryId), {
          participantId: primaryId,
          ...metaData, // Spreads exact IDs (e.g., PROLIFIC_PID, assignmentId)
          userAgent: userAgent,
          status: 'landed_on_consent',
          consented: false,
          landedAt: serverTimestamp(),
        }, { merge: true });

      } catch (error) {
        console.error('Initialization error:', error);
      }
    } else {
      setErrorMessage("Required ID not found. Please ensure you clicked the link provided by your recruitment platform.");
    }
  }, [searchParams]);

  const handleFinalDecision = async () => {
    const participantId = localStorage.getItem('participantId');

    // --- HONEYPOT TRAP & DATA LOGGING ---
    if (hpValue !== '') {
      console.warn("Bot activity detected.");
      const botId = participantId || `bot_${Math.random().toString(36).substring(2, 9)}`;
      
      try {
        await setDoc(doc(db, 'participants', botId), {
          participantId: botId,
          status: 'bot_detected',
          isBot: true,
          detectedAt: serverTimestamp(),
        }, { merge: true });
      } catch (e) {
        console.error("Bot logging error:", e);
      }

      router.push(`/exit?reason=failed_check&id=${botId}`);
      return; 
    }

    if (consentChoice === 'no') {
      if (participantId) {
        await updateDoc(doc(db, 'participants', participantId), {
          status: 'declined_consent',
          consented: false,
          declinedAt: serverTimestamp()
        });
      }
      
      const customRedirect = searchParams.get('redirect');
      if (customRedirect) {
        window.location.href = customRedirect;
      } else {
        router.push('/exit?reason=declined'); 
      }
      return;
    }

    if (!participantId) {
      setErrorMessage("Cannot proceed without a valid ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'participants', participantId), {
        status: 'consented',
        consented: true,
        consentedAt: serverTimestamp(),
        isHumanVerified: true 
      });
      
      router.push(`/instructions?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error saving consent:", error);
      setIsSubmitting(false);
      router.push(`/instructions?${searchParams.toString()}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center border-b mb-6">
          <CardTitle className="text-2xl font-bold">Key Study Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm md:text-base leading-relaxed">
          
          <p><strong>Purpose:</strong> The purpose of this study is to understand how people interpret and respond to different situations involving other individuals.</p>

          <p><strong>Procedures:</strong> In this study, you will answer some questions about yourself and decision-making and respond to different vignettes. You will also have the opportunity to interact with different social media posts. The study should take about 12 minutes to complete and you will receive compensation $2.00 for your participation. The compensation will be granted only if you complete 90% of the survey, follow directions, and submit a completion code at the end of the study.</p>

          <p><strong>Eligibility:</strong> You must be at least 18 years old and fluent in English.</p>
          
          <p><strong>Risks and Benefits:</strong> You might find the vignettes or post content to be upsetting to you. Although this study will not benefit you personally, we hope that our results will add to current knowledge about thinking processes.</p>

          <p><strong>Confidentiality:</strong> Although researchers will collect and retain your ID, we will not share your ID with others outside the research team. Data from this study will be stored securely. Any data that we publish, use for future research, or is made publicly available will not be linked to your identity.</p>

          <p><strong>Voluntary Participation:</strong> Participation in this research is voluntary. If you agree to participate, you can skip questions or cancel your participation at any time for any reason. However, if you do not answer at least 90% of the questions or follow directions, you will not receive compensation.</p>
          
          <p><strong>Questions:</strong> For questions about the research, please contact James Shah at james.shah@duke.edu. For questions about your rights as a participant in this research, please contact Duke University IRB at campusirb@duke.edu. If you need to contact the Duke University IRB, please reference protocol #2025-0336.</p>

          <p><strong>Agreement to Participate:</strong> By continuing on with the study, you are indicating that you have read the information above, are at least 18 years of age, and agree to participate in this study.</p>

          {/* --- THE HONEYPOT (Silent & Deceptive) --- */}
          <div 
            aria-hidden="true" 
            style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }}
          >
            <label htmlFor="secondary_email_confirm">Please confirm your secondary email:</label>
            <Input
              id="secondary_email_confirm"
              type="text"
              name="secondary_email_confirm"
              value={hpValue}
              onChange={(e) => setHpValue(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="mt-8 p-6 bg-muted/50 rounded-lg border border-muted-foreground/20">
            <RadioGroup onValueChange={setConsentChoice} className="flex flex-col md:flex-row justify-around gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="font-bold text-base cursor-pointer">Yes, I agree to participate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="font-bold text-base cursor-pointer">No, I do not agree to participate</Label>
              </div>
            </RadioGroup>
          </div>

        </CardContent>
        <CardFooter>
          <Button 
            size="lg"
            className="w-full"
            disabled={!consentChoice || isSubmitting || !!errorMessage} 
            onClick={handleFinalDecision}
          >
            {consentChoice === 'no' ? "Exit Study" : isSubmitting ? "Processing..." : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}