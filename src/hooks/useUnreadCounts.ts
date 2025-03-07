import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import { messageService } from '@/services/messageService';
import { notificationService } from '@/services/notificationService';

export function useUnreadCounts() {
  const { user } = useUser();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setUnreadMessages(0);
      setUnreadNotifications(0);
      setLoading(false);
      return;
    }

    const loadCounts = async () => {
      try {
        const [messageCount, notificationCount] = await Promise.all([
          messageService.getUnreadCount(),
          notificationService.getUnreadCount(user.id)
        ]);

        setUnreadMessages(messageCount);
        setUnreadNotifications(notificationCount);
      } catch (error) {
        console.error('Error loading unread counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();

    // Refresh counts every 30 seconds
    const interval = setInterval(loadCounts, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return {
    unreadMessages,
    unreadNotifications,
    loading,
    refresh: async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [messageCount, notificationCount] = await Promise.all([
          messageService.getUnreadCount(),
          notificationService.getUnreadCount(user.id)
        ]);

        setUnreadMessages(messageCount);
        setUnreadNotifications(notificationCount);
      } catch (error) {
        console.error('Error refreshing unread counts:', error);
      } finally {
        setLoading(false);
      }
    }
  };
} 