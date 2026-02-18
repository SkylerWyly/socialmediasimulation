'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/header";
import { Feed } from "@/components/feed";
import { TrendingTopics } from "@/components/trending-topics";
import { Sidebar } from "@/components/sidebar";
import { TutorialCard } from "@/components/tutorial-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function TutorialPage() {
  const router = useRouter();
  const [canAdvance, setCanAdvance] = useState(false);

  // 5-second delay before "Start Experiment" appears
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanAdvance(true);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-x-4">
          
          <aside className="col-span-2 hidden md:block">
            <Sidebar />
          </aside>
          
          <div className="col-span-10 md:col-span-8 lg:col-span-5 border-x min-h-screen pb-24">
            <div className="p-4 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
               <h2 className="text-xl font-bold">Tutorial</h2>
            </div>
            
            <div className="p-4">
              <TutorialCard />
            </div>
            
            {/* isTutorial={true} uses the sun-dried tomato content defined in Feed */}
            <Feed isTutorial={true} />
          </div>
          
          <aside className="col-span-3 hidden lg:block">
            <TrendingTopics />
          </aside>
        </div>
      </main>

      {canAdvance && (
        <div className="fixed bottom-10 right-10 z-50 animate-in fade-in zoom-in duration-500">
          <Button 
            size="lg" 
            onClick={() => router.push('/simulation')} 
            className="shadow-xl px-8 py-6 text-lg font-semibold animate-pulse"
          >
            Start Experiment <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}