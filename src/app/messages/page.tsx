'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { messageService, type Conversation, type Message } from '@/services/messageService';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!user) return;
    const data = await messageService.getConversations();
    setConversations(data);
    setLoading(false);
  };

  const loadMessages = async (conversationId: string) => {
    const data = await messageService.getMessages(conversationId);
    setMessages(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !newMessage.trim() || !user) return;

    const receiverId = selectedConversation.participants.find(id => id !== user.id);
    if (!receiverId) return;

    await messageService.sendMessage(receiverId, newMessage);
    setNewMessage('');
    await loadMessages(selectedConversation.id);
  };

  if (!user || loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
        {/* Conversations List */}
        <Card className="col-span-4 h-full">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Conversations</h2>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                    selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">
                      {conversation.participants.find(id => id !== user.id)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(conversation.last_message_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="col-span-8 h-full">
          <CardContent className="p-4 flex flex-col h-full">
            {selectedConversation ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Messages</h2>
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender_id === user.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {format(new Date(message.created_at), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 