import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookGrid from "@/components/books/BookGrid";
import BookDetailModal from "@/components/books/BookDetailModal";
import { useAuth } from "@/context/AuthContext";
import { getBooks, deleteBook } from "@/services/supabaseService";
import { Plus, BookOpen } from "lucide-react";
import AddBookModal from "@/components/books/AddBookModal";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  isAvailable: boolean;
  isOwner: boolean;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  rentalPrice: number;
  description?: string;
}

const MyBooksPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-books");
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetchMyBooks();
    fetchBorrowedBooks();
  }, [user, navigate]);

  const fetchMyBooks = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await getBooks({ owner_id: user?.id });

      if (error) throw error;

      if (data) {
        const transformedBooks = data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage:
            book.cover_image ||
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          isAvailable: book.is_available,
          isOwner: true,
          condition: book.condition,
          rentalPrice: book.rental_price,
          description: book.description,
        }));

        setMyBooks(transformedBooks);
      }
    } catch (err) {
      console.error("Error fetching my books:", err);
      setError("Failed to load your books. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBorrowedBooks = async () => {
    // In a real app, you would fetch books the user has borrowed
    // For now, we'll use placeholder data
    setBorrowedBooks([
      {
        id: "borrowed-1",
        title: "The Alchemist",
        author: "Paulo Coelho",
        coverImage:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
        isAvailable: false,
        isOwner: false,
        condition: "Good" as const,
        rentalPrice: 3,
        description:
          "A special 25th anniversary edition of the extraordinary international bestseller, including a new Foreword by Paulo Coelho.",
      },
    ]);
  };

  const handleBookClick = (bookId: string) => {
    const book =
      activeTab === "my-books"
        ? myBooks.find((b) => b.id === bookId)
        : borrowedBooks.find((b) => b.id === bookId);

    if (book) {
      setSelectedBook(book);
      setShowBookDetail(true);
    }
  };

  const handleEditBook = () => {
    if (selectedBook) {
      // In a real app, you would open an edit modal
      console.log("Edit book:", selectedBook);
    }
  };

  const handleDeleteBook = async () => {
    if (selectedBook) {
      try {
        const { error } = await deleteBook(selectedBook.id);

        if (error) throw error;

        setShowBookDetail(false);
        fetchMyBooks(); // Refresh the list
      } catch (err) {
        console.error("Error deleting book:", err);
      }
    }
  };

  const handleAddBook = async (bookData: any) => {
    console.log("Add book:", bookData);
    // In a real app, you would add the book to the database
    setShowAddBookModal(false);
    fetchMyBooks(); // Refresh the list
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        isAuthenticated={!!user}
        username={user?.user_metadata?.name || "User"}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Books</h1>
          <Button onClick={() => setShowAddBookModal(true)} className="gap-2">
            <Plus size={16} />
            Add Book
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="my-books" className="gap-2">
              <BookOpen size={16} />
              My Books
            </TabsTrigger>
            <TabsTrigger value="borrowed" className="gap-2">
              <BookOpen size={16} />
              Borrowed Books
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-books" className="mt-0">
            <BookGrid
              books={myBooks}
              isLoading={isLoading}
              error={error}
              onBookClick={handleBookClick}
            />
          </TabsContent>

          <TabsContent value="borrowed" className="mt-0">
            <BookGrid
              books={borrowedBooks}
              isLoading={false}
              error=""
              onBookClick={handleBookClick}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      {selectedBook && (
        <BookDetailModal
          open={showBookDetail}
          onOpenChange={setShowBookDetail}
          book={
            {
              ...selectedBook,
              owner: {
                id: user?.id || "",
                name: user?.user_metadata?.name || "You",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
                rating: 4.5,
                booksShared: myBooks.length,
              },
              location: "Your Location",
              distance: 0,
              publishedYear: 2020,
              genre: "Fiction",
              pages: 200,
              isbn: "1234567890",
            } as any
          }
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
        />
      )}

      {/* Add Book Modal */}
      <AddBookModal
        open={showAddBookModal}
        onOpenChange={setShowAddBookModal}
        onSubmit={handleAddBook}
      />
    </div>
  );
};

export default MyBooksPage;
