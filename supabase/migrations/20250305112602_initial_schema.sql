-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'book_status') THEN
        CREATE TYPE book_status AS ENUM ('available', 'borrowed', 'unavailable');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'book_condition') THEN
        CREATE TYPE book_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        CREATE TYPE transaction_status AS ENUM ('pending', 'accepted', 'rejected', 'completed', 'cancelled');
    END IF;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    rating NUMERIC DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    total_ratings INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    isbn TEXT,
    cover_image TEXT,
    genre TEXT[],
    condition book_condition NOT NULL,
    rental_price NUMERIC,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status book_status DEFAULT 'available' NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    borrower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    lender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status transaction_status DEFAULT 'pending' NOT NULL,
    borrower_rating NUMERIC CHECK (borrower_rating >= 1 AND borrower_rating <= 5),
    lender_rating NUMERIC CHECK (lender_rating >= 1 AND lender_rating <= 5)
);

-- Create indexes if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'books_owner_id_idx') THEN
        CREATE INDEX books_owner_id_idx ON public.books(owner_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'transactions_book_id_idx') THEN
        CREATE INDEX transactions_book_id_idx ON public.transactions(book_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'transactions_borrower_id_idx') THEN
        CREATE INDEX transactions_borrower_id_idx ON public.transactions(borrower_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'transactions_lender_id_idx') THEN
        CREATE INDEX transactions_lender_id_idx ON public.transactions(lender_id);
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile.') THEN
        CREATE POLICY "Users can view their own profile."
            ON public.profiles FOR SELECT
            USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile.') THEN
        CREATE POLICY "Users can update own profile."
            ON public.profiles FOR UPDATE
            USING (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view books') THEN
        CREATE POLICY "Anyone can view books"
            ON public.books FOR SELECT
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own books') THEN
        CREATE POLICY "Users can insert their own books"
            ON public.books FOR INSERT
            WITH CHECK (auth.uid() = owner_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own books') THEN
        CREATE POLICY "Users can update their own books"
            ON public.books FOR UPDATE
            USING (auth.uid() = owner_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own books') THEN
        CREATE POLICY "Users can delete their own books"
            ON public.books FOR DELETE
            USING (auth.uid() = owner_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their transactions') THEN
        CREATE POLICY "Users can view their transactions"
            ON public.transactions FOR SELECT
            USING (auth.uid() IN (borrower_id, lender_id));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert transactions as borrower') THEN
        CREATE POLICY "Users can insert transactions as borrower"
            ON public.transactions FOR INSERT
            WITH CHECK (auth.uid() = borrower_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their transactions') THEN
        CREATE POLICY "Users can update their transactions"
            ON public.transactions FOR UPDATE
            USING (auth.uid() IN (borrower_id, lender_id));
    END IF;
END $$;

-- Create or replace the function to update book status
CREATE OR REPLACE FUNCTION update_book_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' THEN
        UPDATE public.books SET status = 'borrowed' WHERE id = NEW.book_id;
    ELSIF NEW.status IN ('completed', 'cancelled', 'rejected') THEN
        UPDATE public.books SET status = 'available' WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS update_book_status_trigger ON public.transactions;
CREATE TRIGGER update_book_status_trigger
    AFTER UPDATE OF status ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_book_status();

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema'; 