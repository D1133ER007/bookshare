import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/types/supabase';

export interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  type: 'rental_request' | 'return_reminder' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
}

export interface CreateNotificationParams {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async createNotification(params: CreateNotificationParams): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: params.userId,
          type: params.type,
          title: params.title,
          message: params.message,
          action_url: params.actionUrl,
          metadata: params.metadata,
          expires_at: params.expiresAt,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
}; 