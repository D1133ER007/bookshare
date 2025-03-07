-- Create payment_status type
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    amount INTEGER NOT NULL, -- Amount in NPR
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    borrower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    lender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    payment_method VARCHAR DEFAULT 'esewa' NOT NULL,
    ref_id TEXT, -- eSewa reference ID
    error_message TEXT,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS payments_book_id_idx ON public.payments(book_id);
CREATE INDEX IF NOT EXISTS payments_borrower_id_idx ON public.payments(borrower_id);
CREATE INDEX IF NOT EXISTS payments_lender_id_idx ON public.payments(lender_id);
CREATE INDEX IF NOT EXISTS payments_transaction_id_idx ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON public.payments(status);
CREATE INDEX IF NOT EXISTS payments_payment_method_idx ON public.payments(payment_method);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() IN (borrower_id, lender_id));

CREATE POLICY "Users can create payments as borrower"
    ON public.payments FOR INSERT
    WITH CHECK (auth.uid() = borrower_id);

CREATE POLICY "Users can update their own payments"
    ON public.payments FOR UPDATE
    USING (auth.uid() IN (borrower_id, lender_id));

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema'; 