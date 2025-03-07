-- Create notification_type enum
CREATE TYPE notification_type AS ENUM ('rental_request', 'return_reminder', 'message', 'system');

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    action_url TEXT,
    metadata JSONB,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_type_idx ON public.notifications(type);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Add trigger to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS trigger AS $$
BEGIN
    DELETE FROM public.notifications
    WHERE (expires_at IS NOT NULL AND expires_at < NOW())
       OR (expires_at IS NULL AND created_at < NOW() - INTERVAL '30 days');
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_old_notifications_trigger
    AFTER INSERT ON public.notifications
    EXECUTE FUNCTION cleanup_old_notifications();

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema'; 