import { supabase } from "@/lib/supabase";
import { Book, BookInsert, Transaction, TransactionInsert } from "@/types/books";

// Books
export const getBooks = async (filters?: {
  owner_id?: string;
  status?: Book["status"];
  genre?: string;
  search?: string;
}) => {
  let query = supabase.from("books").select(`
    *,
    owner:profiles(*)
  `);

  if (filters?.owner_id) {
    query = query.eq("owner_id", filters.owner_id);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.genre) {
    query = query.contains("genre", [filters.genre]);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
  }

  return query;
};

export const getBookById = async (id: string) => {
  return supabase
    .from("books")
    .select(`
      *,
      owner:profiles(*)
    `)
    .eq("id", id)
    .single();
};

export const createBook = async (book: BookInsert) => {
  return supabase.from("books").insert(book).select().single();
};

export const updateBook = async (id: string, updates: Partial<Book>) => {
  return supabase.from("books").update(updates).eq("id", id);
};

export const deleteBook = async (id: string) => {
  return supabase.from("books").delete().eq("id", id);
};

// Transactions
export const createTransaction = async (transaction: TransactionInsert) => {
  return supabase
    .from("transactions")
    .insert(transaction)
    .select(`
      *,
      book:books!book_id(*),
      borrower:profiles!transactions_borrower_id_fkey(*),
      lender:profiles!transactions_lender_id_fkey(*)
    `)
    .single();
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
  return supabase
    .from("transactions")
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      book:books!book_id(*),
      borrower:profiles!transactions_borrower_id_fkey(*),
      lender:profiles!transactions_lender_id_fkey(*)
    `)
    .single();
};

export const getTransactions = async (filters?: {
  user_id?: string;
  status?: Transaction["status"];
  as_borrower?: boolean;
  as_lender?: boolean;
  return_date?: string;
}) => {
  let query = supabase
    .from("transactions")
    .select(`
      *,
      book:books!book_id(*),
      borrower:profiles!transactions_borrower_id_fkey(*),
      lender:profiles!transactions_lender_id_fkey(*)
    `);

  if (filters?.user_id) {
    if (filters.as_borrower) {
      query = query.eq('borrower_id', filters.user_id);
    } else if (filters.as_lender) {
      query = query.eq('lender_id', filters.user_id);
    } else {
      query = query.or(`borrower_id.eq.${filters.user_id},lender_id.eq.${filters.user_id}`);
    }
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.return_date) {
    query = query.lte('return_date', filters.return_date);
  }

  return query.order('created_at', { ascending: false });
};

// User profile services
export const getUserProfile = async (userId: string) => {
  return await supabase.from("profiles").select("*").eq("id", userId).single();
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  return await supabase.from("profiles").update(profileData).eq("id", userId);
};

// Transaction services
export const getRentalRequests = async (
  userId: string,
  type: "incoming" | "outgoing",
) => {
  if (type === "incoming") {
    return await supabase
      .from("transactions")
      .select(`
        *,
        book:book_id (
          id,
          title,
          cover_image,
          rental_price
        ),
        borrower:borrower_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq("lender_id", userId);
  } else {
    return await supabase
      .from("transactions")
      .select(`
        *,
        book:book_id (
          id,
          title,
          cover_image,
          rental_price
        ),
        lender:lender_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq("borrower_id", userId);
  }
};

export const updateRentalRequest = async (id: string, status: string) => {
  return await supabase
    .from("transactions")
    .update({ status })
    .eq("id", id);
};

// Since we're using a single transactions table, we don't need separate exchange functions
export const getExchangeProposals = getRentalRequests;
export const updateExchangeProposal = updateRentalRequest;
