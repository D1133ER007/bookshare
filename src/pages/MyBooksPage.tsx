import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookGrid from "@/components/books/BookGrid";
import BookDetailModal from "@/components/books/BookDetailModal";
import { useAuth } from "@/context/AuthContext";
import { getBooks, deleteBook, createBook, getTransactions } from "@/services/supabaseService";
import { Plus, BookOpen } from "lucide-react";
import AddBookModal from "@/components/books/AddBookModal";
import { Book, BookInsert } from "@/types/books";
import { supabase } from "@/lib/supabase";
import { successToast, errorToast } from "@/components/ui/custom-toast";
import { useToast } from "@/components/ui/use-toast";

const MyBooksPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
      const { data: books, error } = await getBooks({ owner_id: user?.id });

      if (error) throw error;

      if (books) {
        const transformedBooks = books.map((book: any) => ({
          ...book,
          cover_image: book.cover_image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          rating: book.rating || 0,
          rental_price: book.rental_price || 0,
          genre: Array.isArray(book.genre) ? book.genre : []
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
    setIsLoading(true);
    setError("");

    try {
      const { data: transactions, error: transactionError } = await getTransactions({
        user_id: user?.id,
        as_borrower: true,
        status: "completed",
      });

      if (transactionError) throw transactionError;

      if (transactions) {
        // Transform the books from transactions
        const borrowedBooks = transactions.map((transaction) => ({
          ...transaction.book,
          rating: transaction.book.rating || 0,
          rental_price: transaction.book.rental_price || 0,
          cover_image: transaction.book.cover_image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          genre: Array.isArray(transaction.book.genre) ? transaction.book.genre : []
        }));

        setBorrowedBooks(borrowedBooks);
      }
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      setError("Failed to load borrowed books. Please try again later.");
    } finally {
      setIsLoading(false);
    }
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

  const handleAddBook = async (bookData: BookInsert) => {
    try {
      const { data, error } = await createBook({
        ...bookData,
        owner_id: user?.id!,
        status: "available",
      });

      if (error) throw error;

      successToast({ message: "Book added successfully!" });
      setShowAddBookModal(false);
      fetchMyBooks(); // Refresh the list
    } catch (err: any) {
      errorToast({ 
        message: err.message || "Failed to add book. Please try again." 
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg text-gray-600">Please log in to view your books.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
          book={selectedBook}
          onBookUpdated={fetchMyBooks}
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
