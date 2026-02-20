'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Info, LogOut } from 'lucide-react';
import { Suspense } from 'react';

function ExitContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  // Content mapping based on why they arrived here
  const content = {
    failed_check: {
      icon: <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-4" />,
      title: "Quality Check Failed",
      message: "Our system has detected unusual interaction patterns. To maintain research integrity, this session has been terminated and no completion code will be issued.",
      color: "text-destructive"
    },
    declined: {
      icon: <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />,
      title: "Study Terminated",
      message: "You have chosen not to participate in this study. No further data will be collected and you may safely close this window.",
      color: "text-foreground"
    },
    default: {
      icon: <LogOut className="h-12 w-12 text-slate-500 mx-auto mb-4" />,
      title: "Session Ended",
      message: "Thank you for your time. You may now close this browser window.",
      color: "text-foreground"
    }
  };

  const activeContent = reason === 'failed_check' ? content.failed_check : 
                        reason === 'declined' ? content.declined : 
                        content.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-muted bg-card">
        <CardHeader className="text-center pb-2">
          {activeContent.icon}
          <CardTitle className={`text-2xl font-bold ${activeContent.color}`}>
            {activeContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 pt-2">
          <p className="text-muted-foreground leading-relaxed">
            {activeContent.message}
          </p>
          
          <div className="pt-6 border-t border-muted">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              Duke University | Social Psychology Research
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Protocol #2025-0336
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ExitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground font-mono">Finalizing session...</div>
      </div>
    }>
      <ExitContent />
    </Suspense>
  );
}