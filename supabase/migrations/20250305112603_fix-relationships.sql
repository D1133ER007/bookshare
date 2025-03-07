-- Drop existing constraints if they exist
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'transactions_book_id_fkey'
    ) THEN
        ALTER TABLE public.transactions DROP CONSTRAINT transactions_book_id_fkey;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'transactions_borrower_id_fkey'
    ) THEN
        ALTER TABLE public.transactions DROP CONSTRAINT transactions_borrower_id_fkey;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'transactions_lender_id_fkey'
    ) THEN
        ALTER TABLE public.transactions DROP CONSTRAINT transactions_lender_id_fkey;
    END IF;
END $$;

-- Add foreign key constraints with explicit names
ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_book_id_fkey 
    FOREIGN KEY (book_id) 
    REFERENCES public.books(id) 
    ON DELETE CASCADE;

ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_borrower_id_fkey 
    FOREIGN KEY (borrower_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;

ALTER TABLE public.transactions
    ADD CONSTRAINT transactions_lender_id_fkey 
    FOREIGN KEY (lender_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
