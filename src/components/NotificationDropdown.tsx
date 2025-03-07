'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { notificationService, type Notification } from '@/services/notificationService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface NotificationDropdownProps {
  children: React.ReactNode;
}

export function NotificationDropdown({ children }: NotificationDropdownProps) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadNotifications = async () => {
      try {
        const data = await notificationService.getNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <h3 className="font-semibold mb-2">Notifications</h3>
          {loading ? (
            <p className="text-center py-4 text-muted-foreground">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No notifications</p>
          ) : (
            <ScrollArea className="h-80">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 