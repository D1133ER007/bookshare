-- Create enum type for book status if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'book_status') THEN
    CREATE TYPE book_status AS ENUM ('available', 'borrowed', 'unavailable');
  END IF;
END $$;

-- Add status column to books table
ALTER TABLE books 
  ADD COLUMN IF NOT EXISTS status book_status NOT NULL DEFAULT 'available';

-- Drop is_available column as it's being replaced by status
ALTER TABLE books 
  DROP COLUMN IF EXISTS is_available; 