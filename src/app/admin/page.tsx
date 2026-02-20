'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Users, 
  Clock, 
  AlertCircle, 
  PieChart, 
  AlertTriangle, 
  Trash2, 
  Lock,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';

export default function AdminDashboard() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Clear Data Modal States
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearInput, setClearInput] = useState('');
  const [isClearing, setIsClearing] = useState(false);

  // --- STABLE AUTH INITIALIZATION ---
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error) {
      alert("Login failed. Check your email/password.");
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setIsAuthenticated(false);
  };

  // --- DATA LISTENER ---
  useEffect(() => {
    if (!isAuthenticated) return;
    const q = query(collection(db, 'participants'), orderBy('landedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(document => ({ id: document.id, ...document.data() }));
      setParticipants(data);
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  const executeClearData = async () => {
    setIsClearing(true);
    try {
      const promises = participants.map(p => deleteDoc(doc(db, 'participants', p.id)));
      await Promise.all(promises);
      setShowClearModal(false);
      setClearInput('');
    } catch (error) {
      console.error("Error clearing data:", error);
    } finally {
      setIsClearing(false);
    }
  };

  // --- ENHANCED SPSS BUNDLE EXPORT LOGIC ---
  const exportFullData = () => {
    const postIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
    const realPostIds = ['p1', 'p3', 'p5', 'p6', 'p8'];

    // Platform-Agnostic Headers (Honed for SONA, Prolific, CloudResearch)
    const headers = [
      "id", "PROLIFIC_PID", "STUDY_ID", "SESSION_ID", 
      "assignmentId", "projectId", "Condition", "Time_Sec", 
      "Is_Bot", "Is_Verified", "Q1_Agree", "Q2_Credible", "Slider_Engage",
      "Total_Real_Likes", "Total_Real_Shares", "Total_Real_CommViews", "Total_Real_DwellAvg", "User_Agent"
    ];

    postIds.forEach(pid => {
      headers.push(`${pid}_L`, `${pid}_S`, `${pid}_V`, `${pid}_Dwell`, `${pid}_Text`);
    });

    const rows = participants.map(p => {
      let rL = 0, rS = 0, rV = 0, rDwellSum = 0, rDwellCount = 0;

      realPostIds.forEach(pid => {
        const inter = p.interactions?.[pid] || {};
        if (inter.liked) rL++;
        if (inter.reposted) rS++;
        if (inter.viewedComments) rV++;
        if (inter.dwellTimes?.length) {
          rDwellSum += inter.dwellTimes.reduce((a: number, b: number) => a + b, 0);
          rDwellCount += inter.dwellTimes.length;
        }
      });

      // Mapping honed IDs directly 
      const pData = [
        p.id, // Serves as SONA 'id' and the universal document id
        p.PROLIFIC_PID || "N/A",
        p.STUDY_ID || "N/A",
        p.SESSION_ID || "N/A",
        p.assignmentId || "N/A",
        p.projectId || "N/A",
        p.valenceCondition || "neutral",
        ((p.totalSimulationTimeMs || 0) / 1000).toFixed(2),
        p.isBot ? 1 : 0,
        p.isHumanVerified ? 1 : 0,
        p.surveyPost?.['q1-post'] || "", 
        p.surveyPost?.['q2-post'] || "", 
        p.surveyPost?.['slider1-post'] || "",
        rL, rS, rV, 
        rDwellCount > 0 ? (rDwellSum / rDwellCount / 1000).toFixed(2) : "0",
        `"${(p.userAgent || "Unknown").replace(/"/g, "'")}"`
      ];

      postIds.forEach(pid => {
        const inter = p.interactions?.[pid] || {};
        const dwellSum = (inter.dwellTimes || []).reduce((a: number, b: number) => a + b, 0);
        const dwellAvg = inter.dwellTimes?.length ? (dwellSum / inter.dwellTimes.length / 1000).toFixed(2) : "0";
        
        // DISCRETIZED TEXT LOGIC
        let commentString = "";
        if (Array.isArray(inter.userComments)) {
          commentString = inter.userComments
            .map((c: any) => `[TO:${c.target || 'post'}] ${c.text}`)
            .join(" | ");
        } else if (typeof inter.commentText === 'string') {
          commentString = inter.commentText;
        }
        
        const cleanComment = `"${commentString.replace(/"/g, "'").replace(/\n/g, " ")}"`;

        pData.push(inter.liked ? 1 : 0, inter.reposted ? 1 : 0, inter.viewedComments ? 1 : 0, dwellAvg, cleanComment);
      });
      return pData;
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const csvLink = document.createElement('a');
    csvLink.href = URL.createObjectURL(csvBlob);
    csvLink.download = `simulation_data.csv`;
    csvLink.click();

    // Realigned SPSS Syntax
    const spssSyntax = `GET DATA /TYPE=TXT /FILE="simulation_data.csv" /DELIMITERS="," /FIRSTCASE=2
    /VARIABLES= id A30 PROLIFIC_PID A30 STUDY_ID A30 SESSION_ID A30 assignmentId A30 projectId A30 Condition A20 Time_Sec F8.2 Is_Bot F1.0 Is_Verified F1.0 Q1_Agree F2.0 Q2_Credible F2.0 Slider_Engage F3.0 Total_Real_Likes F4.0 Total_Real_Shares F4.0 Total_Real_CommViews F4.0 Total_Real_DwellAvg F8.2 User_Agent A200
    ${postIds.map(pid => `${pid}_L F1.0 ${pid}_S F1.0 ${pid}_V F1.0 ${pid}_D F8.2 ${pid}_Text A1000`).join(' ')}.
    VARIABLE LABELS Is_Bot 'Caught by Honeypot' Is_Verified 'Passed Consent'.
    EXECUTE.`;

    const spsBlob = new Blob([spssSyntax], { type: 'text/plain' });
    const spsLink = document.createElement('a');
    spsLink.href = URL.createObjectURL(spsBlob);
    spsLink.download = `import_to_spss.sps`;
    setTimeout(() => spsLink.click(), 500);
  };

  const getHumanParticipants = () => participants.filter(p => !p.isBot);
  const getBotCount = () => participants.filter(p => p.isBot).length;
  const getConditionCount = (condition: string) => getHumanParticipants().filter(p => p.valenceCondition === condition).length;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Checking authentication...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md shadow-xl p-6">
           <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex justify-center mb-4"><Lock className="h-10 w-10 text-primary" /></div>
              <h2 className="text-xl font-bold text-center text-foreground">Researcher Login</h2>
              <input type="email" placeholder="Researcher Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700">Unlock Dashboard</Button>
           </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-background text-foreground">
      {showClearModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-destructive shadow-2xl bg-card">
            <CardHeader><CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle /> Danger Zone</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm">Permanently delete all records from Firestore. This cannot be undone.</p>
               <Input value={clearInput} onChange={e => setClearInput(e.target.value)} placeholder="Type DELETE to confirm" className="bg-background" />
               <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => {setShowClearModal(false); setClearInput('');}}>Cancel</Button>
                  <Button variant="destructive" disabled={clearInput !== 'DELETE' || isClearing} onClick={executeClearData}>
                    {isClearing ? "Deleting..." : "Permanently Delete Data"}
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Research Monitor</h1>
          <p className="text-muted-foreground text-sm mt-1">Telemetry Dashboard</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          <Button variant="destructive" onClick={() => setShowClearModal(true)}><Trash2 className="h-4 w-4 mr-2" /> Wipe Data</Button>
          <Button onClick={exportFullData}><Download className="h-4 w-4 mr-2" /> Export Bundle</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardHeader><CardTitle className="text-xs font-bold uppercase opacity-60">Total N (Humans)</CardTitle></CardHeader>
        <CardContent><div className="text-3xl font-bold">{getHumanParticipants().length}</div></CardContent></Card>
        
        <Card className="border-red-500/20">
          <CardHeader><CardTitle className="text-xs font-bold uppercase text-red-500">Bots Caught</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-red-500">{getBotCount()}</div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-xs font-bold uppercase opacity-60">Condition Distribution</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm font-semibold">
               <div className="text-blue-500">Sympathetic: {getConditionCount('sympathetic')}</div>
               <div className="text-red-500">Condemning: {getConditionCount('condemning')}</div>
               <div className="text-slate-500">Neutral: {getConditionCount('neutral')}</div>
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle className="text-xs font-bold uppercase opacity-60">Avg Session Time</CardTitle></CardHeader>
        <CardContent><div className="text-3xl font-bold">{getHumanParticipants().length > 0 ? (getHumanParticipants().reduce((acc, p) => acc + (p.totalSimulationTimeMs || 0), 0) / getHumanParticipants().length / 1000).toFixed(1) : 0}s</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Participant Activity</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>ID / Prolific</TableHead><TableHead>Condition</TableHead><TableHead>Feedback</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Total Time</TableHead></TableRow></TableHeader>
            <TableBody>
              {participants.map((p) => {
                const isSpeeder = (p.totalSimulationTimeMs || 0) < 30000 && p.status === 'completed_simulation';
                const hasComments = Object.values(p.interactions || {}).some((i: any) => i.userComments?.length > 0 || i.commentText);
                
                if (p.isBot) {
                  return (
                    <TableRow key={p.id} className="opacity-50 grayscale bg-red-50/10">
                      <TableCell className="font-mono text-[10px] text-red-500 italic flex items-center gap-2">
                        {p.id} (BOT) <ShieldAlert className="h-3 w-3" />
                      </TableCell>
                      <TableCell><Badge variant="outline">N/A</Badge></TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="text-xs text-red-500">Honeypot Triggered</TableCell>
                      <TableCell className="text-right font-mono">—</TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-[10px] flex items-center gap-2">
                       <div className="font-bold">{p.PROLIFIC_PID || p.id}</div>
                       {isSpeeder && <AlertCircle className="h-4 w-4 text-red-500" title="Speeding Alert" />}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        p.valenceCondition === 'sympathetic' ? "bg-blue-500/10 text-blue-500 border-none" :
                        p.valenceCondition === 'condemning' ? "bg-red-500/10 text-red-500 border-none" :
                        "bg-slate-500/10 text-slate-500 border-none"
                      }>{p.valenceCondition || "neutral"}</Badge>
                    </TableCell>
                    <TableCell>
                      {hasComments ? <MessageSquare className="h-4 w-4 text-green-500" /> : <span className="opacity-20">—</span>}
                    </TableCell>
                    <TableCell className="text-xs capitalize opacity-70">{p.status?.replace('_', ' ')}</TableCell>
                    <TableCell className={`text-right font-mono ${isSpeeder ? "text-red-500 font-bold underline decoration-red-500" : ""}`}>
                      {((p.totalSimulationTimeMs || 0) / 1000).toFixed(1)}s
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}