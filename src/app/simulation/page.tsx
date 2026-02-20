'use client';

import { Header } from "@/components/header";
import { Feed } from "@/components/feed";
import { TrendingTopics } from "@/components/trending-topics";
import { Sidebar } from "@/components/sidebar";

export default function SimulationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* GRID LAYOUT FOR THE SIMULATION ENVIRONMENT */}
      <main className="container max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-x-4">
          
          {/* Left Sidebar - Navigation and User Info */}
          <aside className="col-span-2 hidden md:block">
            <Sidebar />
          </aside>
          
          {/* Center Feed (Main Content) */}
          <div className="col-span-10 md:col-span-8 lg:col-span-5 border-x min-h-screen">
            {/* REMOVAL NOTE: The "Home" header block that was previously here has been removed 
              to maximize visual space for the experimental stimuli and prevent navigation errors. 
            */}
            
            {/* The Feed component handles posts p1-p8 and the "Next Section" logic internally */}
            <Feed isTutorial={false} />
            
          </div>
          
          {/* Right Sidebar - Contextual trending topics */}
          <aside className="col-span-3 hidden lg:block">
            <TrendingTopics />
          </aside>
          
        </div>
      </main>
    </div>
  );
}