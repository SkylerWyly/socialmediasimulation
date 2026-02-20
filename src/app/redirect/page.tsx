'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RedirectPage() {
  const [status, setStatus] = useState("Finalizing experiment data...");

  useEffect(() => {
    const redirectUser = async () => {
      // 1. Get the primary Participant ID
      const participantId = localStorage.getItem('participantId');
      
      if (!participantId) {
        setStatus("Error: No participant ID found.");
        return;
      }

      // 2. Fetch the valenceCondition to pass to Qualtrics
      let valence = "unknown";
      try {
        const docRef = doc(db, 'participants', participantId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          valence = docSnap.data().valenceCondition || "unknown";
        }
        
        // Log the final handoff for perfect admin dashboard tracking
        await updateDoc(docRef, {
          status: 'redirected_to_qualtrics',
          finalHandoffAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error fetching condition or updating status:", error);
      }

      // 3. YOUR DUKE QUALTRICS URL
      const QUALTRICS_BASE_URL = "https://duke.qualtrics.com/jfe/form/SV_0oKzl4upn6OG5Ke";
      const url = new URL(QUALTRICS_BASE_URL);
      
      // 4. Append Core Data
      url.searchParams.append('participantId', participantId);
      url.searchParams.append('valence', valence);
      
      // 5. Append Platform-Specific Metadata
      
      // --- CloudResearch Connect ---
      const projectId = localStorage.getItem('projectId');
      if (projectId) url.searchParams.append('projectId', projectId);
      
      const assignmentId = localStorage.getItem('assignmentId');
      if (assignmentId) url.searchParams.append('assignmentId', assignmentId);

      // --- Prolific ---
      const prolificPid = localStorage.getItem('PROLIFIC_PID');
      if (prolificPid) url.searchParams.append('PROLIFIC_PID', prolificPid);
      
      const studyId = localStorage.getItem('STUDY_ID');
      if (studyId) url.searchParams.append('STUDY_ID', studyId);
      
      const sessionId = localStorage.getItem('SESSION_ID');
      if (sessionId) url.searchParams.append('SESSION_ID', sessionId);

      // --- SONA ---
      const sonaId = localStorage.getItem('id');
      if (sonaId) url.searchParams.append('id', sonaId);

      // 6. Execute Redirect
      setStatus("Redirecting to Qualtrics...");
      setTimeout(() => {
        window.location.href = url.toString();
      }, 500); // Tiny delay to ensure Firestore writes finish before navigation
    };

    redirectUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <CardTitle>Simulation Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 py-8">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">{status}</p>
        </CardContent>
      </Card>
    </div>
  );
}