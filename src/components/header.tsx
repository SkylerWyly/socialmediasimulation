'use client';

import { Menu, MessageSquare } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Sidebar } from './sidebar';
import { TrendingTopics } from './trending-topics';
import { useNotifications } from '@/context/notifications-context';

export function Header() {
  const { hasNewNotification } = useNotifications();

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                   {hasNewNotification && (
                    <span className="absolute top-2 right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  )}
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <Sidebar />
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <TrendingTopics />
                  </div>
              </SheetContent>
            </Sheet>
          </div>
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Social Feed</h1>
        </div>
      </div>
    </header>
  );
}
