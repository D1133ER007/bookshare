import type { Database } from "./supabase";
import * as z from "zod";

type Tables = Database["public"]["Tables"];

export type BookStatus = 'available' | 'borrowed' | 'unavailable';

const bookFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters"),
  description: z
    .string()
    .nullable()
    .optional(),
  cover_image: z
    .string()
    .url("Please enter a valid image URL")
    .nullable()
    .optional(),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']),
  genre: z.array(z.string()).min(1, "Please select at least one genre"),
  rental_price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(10000, "Price must be less than 10000")
    .default(0),
  isbn: z
    .string()
    .nullable()
    .optional(),
  status: z.enum(['available', 'borrowed', 'unavailable']).default('available'),
  pages: z.number().nullable().optional(),
  published_year: z.number().nullable().optional(),
  location: z.string().nullable().optional()
});

export type BookFormData = z.infer<typeof bookFormSchema>;

export type Book = {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  title: string;
  author: string;
  description: string | null;
  isbn: string | null;
  cover_image: string | null;
  genre: string[] | null;
  condition: string;
  rental_price: number;
  owner_id: string;
  status: BookStatus;
  location: string | null;
  pages: number | null;
  published_year: number | null;
  owner?: Tables["profiles"]["Row"];
};

export type BookInsert = {
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
  title: string;
  author: string;
  description?: string | null;
  isbn?: string | null;
  cover_image?: string | null;
  genre?: string[] | null;
  condition: string;
  rental_price: number;
  owner_id: string;
  status?: BookStatus;
  location?: string | null;
  pages?: number | null;
  published_year?: number | null;
};

export interface BookUpdate {
  id?: string;
  created_at?: string;
  title?: string;
  author?: string;
  description?: string;
  cover_image?: string;
  owner_id?: string;
  status?: BookStatus;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  genre?: string[] | null;
  location?: string;
  rental_price?: number;
  pages?: number;
  published_year?: number;
}

export type TransactionStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export type TransactionResponse = {
  id: string;
  created_at: string;
  status: TransactionStatus;
  start_date: string;
  end_date: string;
  book: {
    id: string;
    title: string;
  };
  borrower: {
    id: string;
    name: string;
  };
  lender: {
    id: string;
    name: string;
  };
};

export type Transaction = TransactionResponse;

export type TransactionInsert = {
  book_id: string;
  borrower_id: string;
  lender_id: string;
  start_date: string;
  end_date: string;
  status?: TransactionStatus;
  notes?: string | null;
};

export type TransactionUpdate = Partial<TransactionInsert>; 