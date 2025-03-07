-- Drop existing constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'books_condition_check'
  ) THEN
    ALTER TABLE books DROP CONSTRAINT books_condition_check;
  END IF;
END $$;

-- Update existing data to match new constraints
UPDATE books 
SET condition = 'good' 
WHERE condition NOT IN ('new', 'like_new', 'good', 'fair', 'poor');

-- Update books table schema
ALTER TABLE books
  ALTER COLUMN rental_price TYPE numeric(10,2),
  ALTER COLUMN rental_price SET DEFAULT 0,
  ALTER COLUMN genre TYPE text[] USING string_to_array(NULLIF(genre, ''), ','),
  ALTER COLUMN condition TYPE text,
  ALTER COLUMN condition SET DEFAULT 'good',
  ALTER COLUMN is_available SET DEFAULT true;

-- Add enum for book condition if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'book_condition') THEN
    CREATE TYPE book_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');
  END IF;
END $$;

-- Add constraint for condition values
ALTER TABLE books
  ADD CONSTRAINT books_condition_check 
  CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')); 