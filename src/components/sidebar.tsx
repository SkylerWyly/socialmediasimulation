'use client';

import Link from 'next/link';
import { Home, Hash, Bell, Mail, Bookmark, User, MoreHorizontal, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { mockUsers } from '@/lib/mock-data';
import { useState } from 'react';
import type { Notification } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '@/context/notifications-context';

// Updated menu items: Home is now flagged as static
const menuItems = [
  { icon: Home, text: 'Home', isStatic: true }, 
  { icon: Hash, text: 'Explore', href: '#' },
  { icon: Bell, text: 'Notifications', href: '#', id: 'notifications' },
  { icon: Mail, text: 'Messages', href: '#' },
  { icon: Bookmark, text: 'Bookmarks', href: '#' },
  { icon: User, text: 'Profile', href: '#' },
];

function NotificationItem({ notification }: { notification: Notification }) {
  const formattedTimestamp = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true });

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
        <AvatarFallback><UserCircle /></AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-bold">{notification.user.name}</span> {notification.content}
        </p>
        <p className="text-xs text-muted-foreground">{formattedTimestamp}</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const currentUser = mockUsers.participant;
  const { hasNewNotification, setHasNewNotification, visibleNotifications } = useNotifications();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleNotificationsClick = () => {
    setIsPopoverOpen(!isPopoverOpen);
    if (hasNewNotification) {
      setHasNewNotification(false);
    }
  };

  const NotificationsPopover = (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center justify-start gap-3 p-3 h-auto text-base w-full"
          onClick={handleNotificationsClick}
        >
          {hasNewNotification && (
            <span className="absolute left-3 top-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
          <Bell className="h-6 w-6" />
          <span>Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <h4 className="font-medium text-lg">Notifications</h4>
        </div>
        <Separator />
        {visibleNotifications.length > 0 ? (
          <div className="space-y-4 p-4 max-h-96 overflow-y-auto">
            {visibleNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        ) : (
          <p className="p-4 text-sm text-muted-foreground">No new notifications</p>
        )}
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col justify-between py-4 md:py-0">
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          // 1. Handle Notifications
          if (item.id === 'notifications') {
            return <div key={item.id}>{NotificationsPopover}</div>;
          }
          
          // 2. Handle the Disabled Home Button
          if (item.isStatic) {
            return (
              <Button
                key={item.text}
                variant="ghost"
                className="flex items-center justify-start gap-3 p-3 h-auto font-bold text-base cursor-default opacity-70 hover:bg-transparent pointer-events-none"
              >
                <item.icon className="h-6 w-6" />
                <span>{item.text}</span>
              </Button>
            );
          }

          // 3. Handle Regular Nav Items
          return (
            <Link key={item.text} href={item.href || '#'} passHref className="w-full">
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-3 p-3 h-auto text-base w-full"
              >
                <item.icon className="h-6 w-6" />
                <span>{item.text}</span>
              </Button>
            </Link>
          );
        })}
        <Button className="mt-4 rounded-full text-lg p-3 h-auto w-full">Post</Button>
      </nav>

      <div className="mt-auto">
        <div className="flex items-center justify-between p-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start items-center p-0 rounded-full h-auto">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="font-bold text-sm">{currentUser.name}</p>
                    <p className="text-muted-foreground text-sm">@{currentUser.username}</p>
                  </div>
                </div>
                <MoreHorizontal className="h-5 w-5 ml-auto hidden lg:block" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <Button variant="ghost" className="w-full justify-start">Add an existing account</Button>
              <Button variant="ghost" className="w-full justify-start">Log out @{currentUser.username}</Button>
            </PopoverContent>
          </Popover>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}