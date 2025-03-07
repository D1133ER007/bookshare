-- Insert a record into schema_migrations to mark the initial schema as applied
INSERT INTO supabase_migrations.schema_migrations (version, statements) 
VALUES ('00000000000000', ARRAY['-- Initial schema already applied']);

-- Drop existing foreign key constraints if they exist
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_book_id_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_borrower_id_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_lender_id_fkey;

-- Recreate foreign key constraints with explicit names
ALTER TABLE transactions
  ADD CONSTRAINT transactions_book_id_fkey 
  FOREIGN KEY (book_id) 
  REFERENCES books(id) 
  ON DELETE CASCADE;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_borrower_id_fkey 
  FOREIGN KEY (borrower_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_lender_id_fkey 
  FOREIGN KEY (lender_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- Refresh the foreign key relationships in PostgREST's schema cache
NOTIFY pgrst, 'reload schema'; 