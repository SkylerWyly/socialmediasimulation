'use client';
export const dynamic = 'force-dynamic';

import { Header } from "@/components/header";
import { Feed } from "@/components/feed";
import { TrendingTopics } from "@/components/trending-topics";
import { Sidebar } from "@/components/sidebar";

export default function SimulationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* ORIGINAL GRID LAYOUT RESTORED */}
      <main className="container max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-x-4">
          
          {/* Left Sidebar */}
          <aside className="col-span-2 hidden md:block">
            <Sidebar />
          </aside>
          
          {/* Center Feed (Main Content) */}
          <div className="col-span-10 md:col-span-8 lg:col-span-5 border-x min-h-screen">
            <div className="p-4 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
               <h2 className="text-xl font-bold">Home</h2>
            </div>
            
            {/* The Feed handles the posts and the "Next Section" logic internally */}
            <Feed isTutorial={false} />
            
          </div>
          
          {/* Right Sidebar */}
          <aside className="col-span-3 hidden lg:block">
            <TrendingTopics />
          </aside>
          
        </div>
      </main>
    </div>
  );
}