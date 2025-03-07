import { useState, useEffect } from "react";
import { Book } from "@/types/books";
import BookGrid from "@/components/books/BookGrid";
import BookDetailModal from "@/components/books/BookDetailModal";
import { getBooks } from "@/services/supabaseService";
import { useToast } from "@/components/ui/use-toast";

const BooksPage = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getBooks();
      if (error) throw error;

      if (data) {
        const transformedBooks = data.map(book => ({
          ...book,
          cover_image: book.cover_image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
          rating: book.rating || 0,
          rental_price: book.rental_price || 0,
          genre: Array.isArray(book.genre) ? book.genre : []
        }));
        setBooks(transformedBooks);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookClick = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setShowBookDetail(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Books</h1>

        <div className="space-y-6">
          <BookGrid
            books={books}
            isLoading={isLoading}
            error={error}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onBookClick={handleBookClick}
          />
        </div>
      </main>

      {selectedBook && (
        <BookDetailModal
          open={showBookDetail}
          onOpenChange={setShowBookDetail}
          book={selectedBook}
        />
      )}
    </div>
  );
};

export default BooksPage;
