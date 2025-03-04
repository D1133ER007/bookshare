import React, { useState } from "react";
import BookCard from "./BookCard";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Skeleton } from "../ui/skeleton";
import { BookOpen, RefreshCw, Grid3X3, List } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  isAvailable: boolean;
  isOwner: boolean;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  rentalPrice: number;
  genre?: string;
  rating?: number;
}

interface BookGridProps {
  books?: Book[];
  isLoading?: boolean;
  error?: string;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onBookClick?: (bookId: string) => void;
  onRentalRequest?: (bookId: string) => void;
  onExchangeProposal?: (bookId: string) => void;
}

const BookGrid = ({
  books = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
      isAvailable: true,
      isOwner: false,
      condition: "Good" as const,
      rentalPrice: 5,
      genre: "Classic Literature",
      rating: 4.7,
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      coverImage:
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000",
      isAvailable: true,
      isOwner: true,
      condition: "Like New" as const,
      rentalPrice: 4,
      genre: "Classic Literature",
      rating: 4.9,
    },
    {
      id: "3",
      title: "1984",
      author: "George Orwell",
      coverImage:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000",
      isAvailable: false,
      isOwner: false,
      condition: "Fair" as const,
      rentalPrice: 3,
      genre: "Science Fiction",
      rating: 4.6,
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      coverImage:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000",
      isAvailable: true,
      isOwner: false,
      condition: "New" as const,
      rentalPrice: 6,
      genre: "Romance",
      rating: 4.8,
    },
    {
      id: "5",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      coverImage:
        "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=1000",
      isAvailable: true,
      isOwner: false,
      condition: "Good" as const,
      rentalPrice: 5,
      genre: "Fantasy",
      rating: 4.9,
    },
    {
      id: "6",
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      coverImage:
        "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=1000",
      isAvailable: true,
      isOwner: false,
      condition: "Good" as const,
      rentalPrice: 4,
      genre: "Fantasy",
      rating: 4.8,
    },
  ],
  isLoading = false,
  error = "",
  totalPages = 5,
  currentPage = 1,
  onPageChange = () => {},
  onBookClick = () => {},
  onRentalRequest = () => {},
  onExchangeProposal = () => {},
}: BookGridProps) => {
  // State for handling loading more books (for skeleton display)
  const [loadingMore, setLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Function to simulate loading more books
  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simulate API call
    setTimeout(() => {
      setLoadingMore(false);
    }, 1500);
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="w-[280px] h-[420px]">
          <Skeleton className="w-full h-[240px] rounded-t-lg" />
          <div className="mt-4">
            <Skeleton className="w-3/4 h-6 mb-2" />
            <Skeleton className="w-1/2 h-4 mb-4" />
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-2/3 h-4 mb-6" />
            <div className="flex gap-2">
              <Skeleton className="w-1/2 h-9" />
              <Skeleton className="w-1/2 h-9" />
            </div>
          </div>
        </div>
      ));
  };

  // Render error state
  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <div className="text-red-500 mb-4 text-6xl">
          <BookOpen size={64} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Error Loading Books</h3>
        <p className="text-gray-500 mb-6 text-center">{error}</p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  // Render empty state
  if (!isLoading && books.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
        <div className="text-gray-400 mb-4 text-6xl">
          <BookOpen size={64} />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Books Found</h3>
        <p className="text-gray-500 mb-6 text-center">
          We couldn't find any books matching your criteria. Try adjusting your
          filters or search terms.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center bg-white">
      {/* View Mode Toggle */}
      <div className="w-full flex justify-end mb-4">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 size={18} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
          </Button>
        </div>
      </div>

      {/* Book Grid */}
      <div
        className={
          viewMode === "grid"
            ? "w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center"
            : "w-full flex flex-col gap-4"
        }
      >
        {isLoading
          ? renderSkeletons()
          : books.map((book) => (
              <div
                key={book.id}
                className={viewMode === "list" ? "w-full" : ""}
              >
                {viewMode === "grid" ? (
                  <BookCard
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    coverImage={book.coverImage}
                    isAvailable={book.isAvailable}
                    isOwner={book.isOwner}
                    condition={book.condition}
                    rentalPrice={book.rentalPrice}
                    genre={book.genre}
                    rating={book.rating}
                    onClick={() => onBookClick(book.id)}
                    onRentalRequest={() => onRentalRequest(book.id)}
                    onExchangeProposal={() => onExchangeProposal(book.id)}
                  />
                ) : (
                  <div className="flex bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-24 h-36 object-cover rounded-md mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">{book.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {book.author}
                      </p>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {book.genre}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {book.condition}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          ${book.rentalPrice}/week
                        </span>
                      </div>
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(book.rating || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="text-xs ml-1">{book.rating}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onBookClick(book.id)}
                        >
                          View Details
                        </Button>
                        {!book.isOwner && book.isAvailable && (
                          <>
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => onRentalRequest(book.id)}
                            >
                              <Clock size={16} className="mr-1" />
                              Rent
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onExchangeProposal(book.id)}
                            >
                              <Repeat size={16} className="mr-1" />
                              Exchange
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {book.isAvailable ? (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Available
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          Unavailable
                        </span>
                      )}
                      {book.isOwner && (
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Your Book
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
        {loadingMore && renderSkeletons()}
      </div>

      {/* Pagination */}
      <div className="mt-8 mb-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </p>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                isActive={currentPage === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                isActive={currentPage > 1}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              // Skip page 1 as it's already rendered
              if (pageNum === 1) return null;

              return (
                <PaginationItem key={`page-${pageNum}`}>
                  <PaginationLink
                    isActive={pageNum === currentPage}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                isActive={currentPage < totalPages}
              />
            </PaginationItem>
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default BookGrid;
