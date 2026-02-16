
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Notification } from '@/lib/types';
import { mockNotifications, notificationTriggers } from '@/lib/mock-data';

interface NotificationsContextType {
  hasNewNotification: boolean;
  setHasNewNotification: (hasNew: boolean) => void;
  visibleNotifications: Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Clear interaction history on initial load for a clean slate
    try {
      localStorage.removeItem('interactedPosts');
      localStorage.removeItem('triggeredNotifications');
    } catch (error) {
      console.error("Could not clear localStorage on init", error);
    }

    const handleStorageChange = () => {
      try {
        const interactedPostsJSON = localStorage.getItem('interactedPosts');
        const interactedPosts: string[] = interactedPostsJSON ? JSON.parse(interactedPostsJSON) : [];

        const triggeredNotificationsJSON = localStorage.getItem('triggeredNotifications');
        const currentTriggered: string[] = triggeredNotificationsJSON ? JSON.parse(triggeredNotificationsJSON) : [];
        
        const newNotificationsToShow: Notification[] = [];
        const newTriggeredNotificationIds: string[] = [...currentTriggered];

        for (const post of interactedPosts) {
            const trigger = notificationTriggers[post];
            if (trigger && !currentTriggered.includes(trigger.id)) {
                newTriggeredNotificationIds.push(trigger.id);
                setHasNewNotification(true);
            }
        }

        for (const triggerId of newTriggeredNotificationIds) {
            const trigger = Object.values(notificationTriggers).find(t => t.id === triggerId);
            if(trigger) {
                const notification = mockNotifications.find(n => n.id === trigger.notificationId);
                if (notification && !newNotificationsToShow.some(n => n.id === notification.id)) {
                    newNotificationsToShow.push(notification);
                }
            }
        }
        
        newNotificationsToShow.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setVisibleNotifications(newNotificationsToShow);
        
        if (newTriggeredNotificationIds.length > currentTriggered.length) {
            localStorage.setItem('triggeredNotifications', JSON.stringify(newTriggeredNotificationIds));
        }

      } catch (error) {
        console.error("Error processing notifications", error);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <NotificationsContext.Provider value={{ hasNewNotification, setHasNewNotification, visibleNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
