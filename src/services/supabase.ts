import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import type { 
  Book, 
  Transaction, 
  TransactionResponse, 
  TransactionInsert, 
  TransactionUpdate, 
  BookInsert,
  TransactionStatus,
  BookStatus
} from "@/types/books";

type Tables = Database["public"]["Tables"];
type Profile = Tables["profiles"]["Row"];

export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(userId: string, profile: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async createProfile(profile: Tables["profiles"]["Insert"]) {
    const { data, error } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }
};

export const bookService = {
  async getBooks(filters?: {
    owner_id?: string;
    status?: BookStatus;
    genre?: string;
    search?: string;
  }) {
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

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getBook(bookId: string) {
    const { data, error } = await supabase
      .from("books")
      .select(`
        *,
        owner:profiles(*)
      `)
      .eq("id", bookId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createBook(book: BookInsert) {
    const { data, error } = await supabase
      .from("books")
      .insert({
        ...book,
        status: book.status || 'available',
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        owner:profiles(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating book:', error);
      throw error;
    }
    return data as Book;
  },

  async updateBook(bookId: string, book: Partial<Tables["books"]["Update"]>) {
    const { data, error } = await supabase
      .from("books")
      .update(book)
      .eq("id", bookId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Book;
  },

  async deleteBook(bookId: string) {
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", bookId);
    
    if (error) throw error;
  }
};

export const transactionService = {
  async getTransactions(filters?: {
    status?: TransactionStatus;
    borrower_id?: string;
    lender_id?: string;
    end_date?: string;
  }) {
    let query = supabase
      .from("transactions")
      .select(`
        id,
        created_at,
        status,
        start_date,
        end_date,
        book:book_id (
          id,
          title
        ),
        borrower:borrower_id (
          id,
          name
        ),
        lender:lender_id (
          id,
          name
        )
      `);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.borrower_id) {
      query = query.eq("borrower_id", filters.borrower_id);
    }
    if (filters?.lender_id) {
      query = query.eq("lender_id", filters.lender_id);
    }
    if (filters?.end_date) {
      query = query.lte("end_date", filters.end_date);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data as any[]).map(item => ({
      ...item,
      book: item.book[0],
      borrower: item.borrower[0],
      lender: item.lender[0]
    })) as Transaction[];
  },

  async createTransaction(transaction: TransactionInsert) {
    const { data, error } = await supabase
      .from("transactions")
      .insert(transaction)
      .select(`
        id,
        created_at,
        status,
        start_date,
        end_date,
        book:book_id (
          id,
          title
        ),
        borrower:borrower_id (
          id,
          name
        ),
        lender:lender_id (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    const response = data as any;
    return {
      ...response,
      book: response.book[0],
      borrower: response.borrower[0],
      lender: response.lender[0]
    } as Transaction;
  },

  async updateTransaction(id: string, transaction: TransactionUpdate) {
    const { data, error } = await supabase
      .from("transactions")
      .update(transaction)
      .eq("id", id)
      .select(`
        id,
        created_at,
        status,
        start_date,
        end_date,
        book:book_id (
          id,
          title
        ),
        borrower:borrower_id (
          id,
          name
        ),
        lender:lender_id (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;
    const response = data as any;
    return {
      ...response,
      book: response.book[0],
      borrower: response.borrower[0],
      lender: response.lender[0]
    } as Transaction;
  }
}; 