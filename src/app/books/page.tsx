'use client';

import React, { useEffect, useState } from 'react';
import { Book, BookInsert, BookFormData } from '@/types/books';
import type { Database } from '@/types/supabase';
import { bookService } from '@/services/supabase';
import BookGrid from '@/components/books/BookGrid';
import BookDetailModal from '@/components/books/BookDetailModal';
import { AddBookButton } from '@/components/books/AddBookButton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const data = await bookService.getBooks() as unknown as (Database['public']['Tables']['books']['Row'] & { owner: Database['public']['Tables']['profiles']['Row'] })[];
      const transformedBooks = data.map(book => {
        const transformedBook: Book = {
          id: book.id,
          created_at: book.created_at,
          updated_at: book.updated_at,
          title: book.title,
          author: book.author,
          description: book.description,
          isbn: book.isbn,
          cover_image: book.cover_image || 'https://via.placeholder.com/300x450?text=No+Cover',
          genre: book.genre,
          condition: book.condition,
          rental_price: book.rental_price || 0,
          owner_id: book.owner_id,
          status: book.status,
          location: book.location,
          pages: book.pages,
          published_year: book.published_year,
          owner: book.owner
        };
        return transformedBook;
      });
      setBooks(transformedBooks);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch books',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookClick = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setIsDetailModalOpen(true);
    }
  };

  const handleAddBook = async (data: Partial<BookFormData>) => {
    try {
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to add a book',
          variant: 'destructive',
        });
        return;
      }
      
      if (!data.title || !data.author || !data.condition) {
        toast({
          title: 'Error',
          description: 'Title, author, and condition are required',
          variant: 'destructive',
        });
        return;
      }
      
      // Create complete book data with required fields
      const bookData: BookInsert = {
        title: data.title,
        author: data.author,
        description: data.description || null,
        cover_image: data.cover_image || null,
        owner_id: user.id,
        condition: data.condition,
        genre: data.genre || null,
        rental_price: data.rental_price || 0,
        isbn: data.isbn || null,
        status: 'available',
        location: data.location || null,
        pages: data.pages || null,
        published_year: data.published_year || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Log the data being sent
      console.log('Attempting to create book with data:', bookData);
      
      const result = await bookService.createBook(bookData);
      console.log('Book created successfully:', result);
      
      toast({
        title: 'Success',
        description: 'Book added successfully',
      });
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Error adding book:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add book',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Books</h1>
        <AddBookButton 
          onBookAdded={fetchBooks} 
          onSubmit={handleAddBook} 
        />
      </div>
      
      <div className="space-y-6">
        <BookGrid
          books={books}
          isLoading={isLoading}
          onBookClick={handleBookClick}
        />
      </div>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          onBookUpdated={fetchBooks}
        />
      )}
    </div>
  );
} 