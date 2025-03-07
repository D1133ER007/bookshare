'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { messageService, type Conversation } from '@/services/messageService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageDropdownProps {
  children: React.ReactNode;
}

export function MessageDropdown({ children }: MessageDropdownProps) {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadConversations = async () => {
      try {
        const data = await messageService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();

    // Refresh conversations every 30 seconds
    const interval = setInterval(loadConversations, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <h3 className="font-semibold mb-2">Messages</h3>
          {loading ? (
            <p className="text-center py-4 text-muted-foreground">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No messages</p>
          ) : (
            <ScrollArea className="h-80">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  to={`/messages?conversation=${conversation.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {conversation.participants.find(id => id !== user?.id)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(conversation.last_message_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </Link>
              ))}
            </ScrollArea>
          )}
          <div className="mt-2 pt-2 border-t">
            <Link
              to="/messages"
              className="block w-full text-center text-sm text-primary hover:underline"
            >
              View all messages
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 