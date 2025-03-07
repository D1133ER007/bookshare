"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Book, BookInsert } from "@/types/books";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BookGrid from "@/components/books/BookGrid";
import AddBookModal from "@/components/books/AddBookModal";
import EditBookModal from "@/components/books/EditBookModal";
import DeleteBookModal from "@/components/books/DeleteBookModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyBooksPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchMyBooks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("owner_id", user.id);

      if (error) throw error;

      setBooks(
        data.map((book) => ({
          ...book,
          genre: Array.isArray(book.genre) ? book.genre : [],
        }))
      );
    } catch (error) {
      console.error("Error fetching books:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your books",
        variant: "destructive",
      });
    }
  };

  const fetchBorrowedBooks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("rentals")
        .select("*, book:books(*)")
        .eq("borrower_id", user.id)
        .eq("status", "active");

      if (error) throw error;

      const borrowedBooks = data.map((rental) => ({
        ...rental.book,
        genre: Array.isArray(rental.book.genre) ? rental.book.genre : [],
      }));

      setBorrowedBooks(borrowedBooks);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      toast({
        title: "Error",
        description: "Failed to fetch borrowed books",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchMyBooks(), fetchBorrowedBooks()]);
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleAddBook = async (bookData: BookInsert) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("books").insert([
        {
          ...bookData,
          owner_id: user.id,
          status: "available",
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book added successfully",
      });

      await fetchMyBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive",
      });
    }
  };

  const handleEditBook = async (bookData: BookInsert) => {
    if (!user || !selectedBook) return;

    try {
      const { error } = await supabase
        .from("books")
        .update(bookData)
        .eq("id", selectedBook.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book updated successfully",
      });

      await fetchMyBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      toast({
        title: "Error",
        description: "Failed to update book",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBook = async () => {
    if (!user || !selectedBook) return;

    try {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", selectedBook.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Book deleted successfully",
      });

      await fetchMyBooks();
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Books</h1>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>

      <Tabs defaultValue="owned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="owned">My Books</TabsTrigger>
          <TabsTrigger value="borrowed">Borrowed Books</TabsTrigger>
        </TabsList>

        <TabsContent value="owned">
          <BookGrid
            books={books}
            isLoading={loading}
            onEdit={(book) => {
              setSelectedBook(book);
              setEditModalOpen(true);
            }}
            onDelete={(book) => {
              setSelectedBook(book);
              setDeleteModalOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="borrowed">
          <BookGrid books={borrowedBooks} isLoading={loading} />
        </TabsContent>
      </Tabs>

      <AddBookModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddBook}
      />

      {selectedBook && (
        <>
          <EditBookModal
            book={selectedBook}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onSubmit={handleEditBook}
          />

          <DeleteBookModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleDeleteBook}
            bookTitle={selectedBook.title}
          />
        </>
      )}
    </div>
  );
};

export default MyBooksPage; 