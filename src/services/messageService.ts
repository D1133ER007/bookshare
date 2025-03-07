import { supabase } from '@/lib/supabaseClient';
import { notificationService } from './notificationService';

export interface Message {
  id: string;
  created_at: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  created_at: string;
  participants: string[];
  last_message_at: string;
}

export const messageService = {
  async sendMessage(receiverId: string, content: string): Promise<Message | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Check if conversation exists or create new one
      const { data: existingConversations } = await supabase
        .from('conversations')
        .select('id')
        .contains('participants', [user.id, receiverId])
        .single();

      let conversationId = existingConversations?.id;

      if (!conversationId) {
        const { data: newConversation, error: convError } = await supabase
          .from('conversations')
          .insert({
            participants: [user.id, receiverId],
            last_message_at: new Date().toISOString()
          })
          .select()
          .single();

        if (convError || !newConversation) throw new Error('Failed to create conversation');
        conversationId = newConversation.id;
      }

      // Insert message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          read: false
        })
        .select()
        .single();

      if (messageError || !message) throw new Error('Failed to send message');

      // Create notification for receiver
      await notificationService.createNotification({
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        message: `You have a new message`,
        actionUrl: `/messages/${conversationId}`,
        metadata: { conversationId, messageId: message.id }
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  },

  async getConversations(): Promise<Conversation[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id])
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .eq('receiver_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('receiver_id', user.id)
        .eq('read', false);

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}; 