import React, { useState } from "react";
import { Book } from "@/types/books";
import BookCard from "@/components/books/BookCard";
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
import { BookOpen, RefreshCw, Grid3X3, List, Star, Clock, Repeat } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  error?: string;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onBookClick?: (bookId: string) => void;
  onRentalRequest?: (bookId: string) => void;
  onExchangeProposal?: (bookId: string) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

const BookGrid = ({
  books,
  isLoading = false,
  error = "",
  totalPages = 5,
  currentPage = 1,
  onPageChange = () => {},
  onBookClick = () => {},
  onRentalRequest = () => {},
  onExchangeProposal = () => {},
  onEdit,
  onDelete,
}: BookGridProps) => {
  const { user } = useAuth();
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
          : books.map((book) => {
              const genres = Array.isArray(book.genre) ? book.genre : [];
              return (
                <div
                  key={book.id}
                  className={viewMode === "list" ? "w-full" : ""}
                >
                  {viewMode === "grid" ? (
                    <BookCard 
                      book={{...book, genre: genres}}
                      onClick={() => onBookClick(book.id)}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ) : (
                    <div className="flex bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-24 h-36 object-cover rounded-md mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg">{book.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {Array.isArray(genres) ? genres.join(", ") : ""}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {book.condition}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            ${book.rental_price}/week
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
                          {book.status === "available" && book.owner_id !== user?.id && (
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
                          {book.owner_id === user?.id && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit?.(book);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete?.(book);
                                }}
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {book.status === "available" ? (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Available
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {book.status}
                          </span>
                        )}
                        {book.owner_id === user?.id && (
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Your Book
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
