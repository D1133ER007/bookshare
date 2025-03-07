-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    participants UUID[] NOT NULL,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS conversations_participants_idx ON public.conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS conversations_last_message_at_idx ON public.conversations(last_message_at);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_receiver_id_idx ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS messages_read_idx ON public.messages(read);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view their own conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create conversations they're part of"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() = ANY(participants));

CREATE POLICY "Users can update conversations they're part of"
    ON public.conversations FOR UPDATE
    USING (auth.uid() = ANY(participants));

-- Create policies for messages
CREATE POLICY "Users can view messages in their conversations"
    ON public.messages FOR SELECT
    USING (
        auth.uid() IN (
            SELECT unnest(participants)
            FROM public.conversations
            WHERE id = conversation_id
        )
    );

CREATE POLICY "Users can send messages"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they sent"
    ON public.messages FOR UPDATE
    USING (auth.uid() = sender_id);

-- Add function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS trigger AS $$
BEGIN
    UPDATE public.conversations
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating conversation last_message_at
CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema'; 