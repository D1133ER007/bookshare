import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import SearchBar from "@/components/filters/SearchBar";
import FilterBar from "@/components/filters/FilterBar";
import BookGrid from "@/components/books/BookGrid";
import BookDetailModal from "@/components/books/BookDetailModal";
import RentalRequestModal from "@/components/transactions/RentalRequestModal";
import ExchangeProposalModal from "@/components/transactions/ExchangeProposalModal";
import { useAuth } from "@/context/AuthContext";
import {
  getBooks,
  getBookById,
  createRentalRequest,
  createExchangeProposal,
} from "@/services/supabaseService";

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
  location?: string;
  distance?: number;
  publishedYear?: number;
  genre?: string;
  pages?: number;
  isbn?: string;
  owner?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    booksShared: number;
  };
}

interface FilterOptions {
  genre: string;
  locationRadius: number;
  priceRange: [number, number];
  condition: string;
}

const BooksPage = () => {
  const { user, setShowAuthModal, setAuthModalTab } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [filters, setFilters] = useState<FilterOptions>({
    genre: "All Genres",
    locationRadius: 10,
    priceRange: [0, 50],
    condition: "All Conditions",
  });

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm, searchType, filters]);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError("");

    try {
      // In a real app, you would apply all filters and pagination here
      const { data, error } = await getBooks();

      if (error) throw error;

      if (data) {
        // Transform data and apply client-side filtering
        const transformedBooks = data.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          coverImage:
            book.cover_image ||
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          isAvailable: book.is_available,
          isOwner: user?.id === book.owner_id,
          condition: book.condition,
          rentalPrice: book.rental_price,
          description: book.description,
          location: book.location,
          genre: book.genre,
          publishedYear: book.published_year,
          pages: book.pages,
          isbn: book.isbn,
        }));

        // Apply client-side filtering
        let filteredBooks = transformedBooks;

        if (searchTerm) {
          filteredBooks = filteredBooks.filter((book) => {
            if (searchType === "title") {
              return book.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            } else if (searchType === "author") {
              return book.author
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            } else if (searchType === "isbn" && book.isbn) {
              return book.isbn.includes(searchTerm);
            }
            return false;
          });
        }

        if (filters.genre !== "All Genres") {
          filteredBooks = filteredBooks.filter(
            (book) => book.genre === filters.genre,
          );
        }

        if (filters.condition !== "All Conditions") {
          filteredBooks = filteredBooks.filter(
            (book) => book.condition === filters.condition,
          );
        }

        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50) {
          filteredBooks = filteredBooks.filter(
            (book) =>
              book.rentalPrice >= filters.priceRange[0] &&
              book.rentalPrice <= filters.priceRange[1],
          );
        }

        setBooks(filteredBooks);
        setTotalPages(Math.ceil(filteredBooks.length / 10) || 1); // Assuming 10 books per page
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookClick = async (bookId: string) => {
    try {
      // In a real app, you would fetch the book details with owner info
      const { data, error } = await getBookById(bookId);

      if (error) throw error;

      if (data) {
        const bookWithDetails: Book = {
          id: data.id,
          title: data.title,
          author: data.author,
          coverImage:
            data.cover_image ||
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          isAvailable: data.is_available,
          isOwner: user?.id === data.owner_id,
          condition: data.condition,
          rentalPrice: data.rental_price,
          description: data.description,
          location: data.location,
          distance: 2.5, // This would be calculated based on user location
          publishedYear: data.published_year,
          genre: data.genre,
          pages: data.pages,
          isbn: data.isbn,
          owner: data.owner
            ? {
                id: data.owner.id,
                name: data.owner.name,
                avatar:
                  data.owner.avatar_url ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=owner",
                rating: data.owner.rating || 4.5,
                booksShared: data.owner.books_shared || 10,
              }
            : undefined,
        };

        setSelectedBook(bookWithDetails);
        setShowBookDetail(true);
      }
    } catch (err) {
      console.error("Error fetching book details:", err);
    }
  };

  const handleRentalRequest = (bookId: string) => {
    if (!user) {
      // Show auth modal if user is not logged in
      setAuthModalTab("login");
      setShowAuthModal(true);
      return;
    }

    const book = books.find((b) => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setShowRentalModal(true);
    }
  };

  const handleExchangeProposal = (bookId: string) => {
    if (!user) {
      // Show auth modal if user is not logged in
      setAuthModalTab("login");
      setShowAuthModal(true);
      return;
    }

    const book = books.find((b) => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      setShowExchangeModal(true);
    }
  };

  const handleSearch = (term: string, type: string) => {
    setSearchTerm(term);
    setSearchType(type);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRentalSubmit = async (data: any) => {
    try {
      const rentalData = {
        book_id: data.bookId,
        requester_id: user?.id,
        owner_id: selectedBook?.owner?.id,
        start_date: data.dateRange?.from,
        end_date: data.dateRange?.to,
        status: "pending",
        message: data.message || "",
      };

      const { error } = await createRentalRequest(rentalData);

      if (error) throw error;

      alert("Rental request submitted successfully!");
      setShowRentalModal(false);
    } catch (err) {
      console.error("Error submitting rental request:", err);
      alert("Failed to submit rental request. Please try again.");
    }
  };

  const handleExchangeSubmit = async (data: any) => {
    try {
      const exchangeData = {
        book_requested_id: data.bookRequestedId,
        book_offered_id: data.bookOfferedId,
        requester_id: user?.id,
        owner_id: selectedBook?.owner?.id,
        status: "pending",
        message: data.message || "",
      };

      const { error } = await createExchangeProposal(exchangeData);

      if (error) throw error;

      alert("Exchange proposal submitted successfully!");
      setShowExchangeModal(false);
    } catch (err) {
      console.error("Error submitting exchange proposal:", err);
      alert("Failed to submit exchange proposal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        isAuthenticated={!!user}
        username={user?.user_metadata?.name || "User"}
        onLogin={() => {
          setAuthModalTab("login");
          setShowAuthModal(true);
        }}
        onSignup={() => {
          setAuthModalTab("signup");
          setShowAuthModal(true);
        }}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Books</h1>

        <div className="space-y-6">
          <SearchBar onSearch={handleSearch} />

          <FilterBar onFilterChange={handleFilterChange} />

          <BookGrid
            books={books}
            isLoading={isLoading}
            error={error}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onBookClick={handleBookClick}
            onRentalRequest={handleRentalRequest}
            onExchangeProposal={handleExchangeProposal}
          />
        </div>
      </main>

      {/* Modals */}
      {selectedBook && (
        <>
          <BookDetailModal
            open={showBookDetail}
            onOpenChange={setShowBookDetail}
            book={selectedBook as any}
            onRentalRequest={() => setShowRentalModal(true)}
            onExchangeProposal={() => setShowExchangeModal(true)}
          />

          <RentalRequestModal
            open={showRentalModal}
            onOpenChange={setShowRentalModal}
            bookId={selectedBook.id}
            bookTitle={selectedBook.title}
            bookCoverImage={selectedBook.coverImage}
            ownerName={selectedBook.owner?.name || "Owner"}
            rentalPrice={selectedBook.rentalPrice}
            onSubmit={handleRentalSubmit}
            onCancel={() => setShowRentalModal(false)}
          />

          <ExchangeProposalModal
            open={showExchangeModal}
            onOpenChange={setShowExchangeModal}
            bookToExchangeFor={{
              id: selectedBook.id,
              title: selectedBook.title,
              author: selectedBook.author,
              coverImage: selectedBook.coverImage,
              owner: {
                id: selectedBook.owner?.id || "owner-id",
                name: selectedBook.owner?.name || "Owner",
              },
            }}
            onSubmit={handleExchangeSubmit}
            onCancel={() => setShowExchangeModal(false)}
          />
        </>
      )}
    </div>
  );
};

export default BooksPage;
