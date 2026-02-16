
import { Header } from "@/components/header";
import { Feed } from "@/components/feed";
import { TrendingTopics } from "@/components/trending-topics";
import { Sidebar } from "@/components/sidebar";
import { NextSectionButton } from "@/components/next-section-button";
import { TutorialCard } from "@/components/tutorial-card";

export default function TutorialPage() {
  return (
    <>
      <Header />
      <main className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-x-4">
          <aside className="col-span-2 hidden md:block">
            <Sidebar />
          </aside>
          <div className="col-span-10 md:col-span-8 lg:col-span-5 border-x">
            <div className="p-4 border-b">
               <h2 className="text-xl font-bold">Tutorial</h2>
            </div>
            <div className="p-4">
              <TutorialCard />
            </div>
            <Feed />
          </div>
          <aside className="col-span-3 hidden lg:block">
            <TrendingTopics />
          </aside>
        </div>
      </main>
      <NextSectionButton href="/section1" delay={5000}>
        Start Experiment
      </NextSectionButton>
    </>
  );
}
