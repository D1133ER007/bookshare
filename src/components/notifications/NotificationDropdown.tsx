import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { notificationService, Notification } from '@/services/notificationService';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export const NotificationDropdown = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const notifications = await notificationService.getNotifications(user.id);
      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.read && n.type !== 'message').length);
      setMessageCount(notifications.filter(n => !n.read && n.type === 'message').length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAllAsRead(user.id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Messages */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            {messageCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              >
                {messageCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between p-4">
            <h3 className="font-semibold">Messages</h3>
            {messageCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
          <Separator />
          <ScrollArea className="h-[300px]">
            {notifications
              .filter(notification => notification.type === 'message')
              .map(notification => (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-4 focus:bg-accent cursor-pointer"
                  onClick={() => {
                    handleMarkAsRead(notification.id);
                    if (notification.action_url) {
                      window.location.href = notification.action_url;
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <MessageSquare className="h-5 w-5 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.created_at), 'PPp')}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between p-4">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
          <Separator />
          <ScrollArea className="h-[300px]">
            {notifications
              .filter(notification => notification.type !== 'message')
              .map(notification => (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-4 focus:bg-accent cursor-pointer"
                  onClick={() => {
                    handleMarkAsRead(notification.id);
                    if (notification.action_url) {
                      window.location.href = notification.action_url;
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.created_at), 'PPp')}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 