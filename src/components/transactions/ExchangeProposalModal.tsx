import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Repeat, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import BookCard from "../books/BookCard";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
  isAvailable: boolean;
}

interface ExchangeProposalModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  bookToExchangeFor?: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    owner: {
      name: string;
      id: string;
    };
  };
  userBooks?: Book[];
  onSubmit?: (data: {
    bookOfferedId: string;
    message: string;
    bookRequestedId: string;
  }) => void;
  onCancel?: () => void;
}

const ExchangeProposalModal = ({
  open = true,
  onOpenChange = () => {},
  bookToExchangeFor = {
    id: "book-123",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
    owner: {
      name: "Jane Doe",
      id: "user-456",
    },
  },
  userBooks = [
    {
      id: "user-book-1",
      title: "1984",
      author: "George Orwell",
      coverImage:
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000",
      condition: "Good" as const,
      isAvailable: true,
    },
    {
      id: "user-book-2",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      coverImage:
        "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=1000",
      condition: "Like New" as const,
      isAvailable: true,
    },
    {
      id: "user-book-3",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      coverImage:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000",
      condition: "Fair" as const,
      isAvailable: true,
    },
  ],
  onSubmit = () => {},
  onCancel = () => {},
}: ExchangeProposalModalProps) => {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = userBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmit = () => {
    if (!selectedBookId) return;

    onSubmit({
      bookOfferedId: selectedBookId,
      message,
      bookRequestedId: bookToExchangeFor.id,
    });

    // Reset form state
    setSelectedBookId(null);
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Propose Book Exchange
          </DialogTitle>
          <DialogDescription>
            Offer one of your books in exchange for "{bookToExchangeFor.title}"
            by {bookToExchangeFor.author} from {bookToExchangeFor.owner.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Book you want:</h3>
            <div className="border rounded-md p-3 bg-gray-50 flex items-center gap-3">
              <img
                src={bookToExchangeFor.coverImage}
                alt={bookToExchangeFor.title}
                className="h-16 w-12 object-cover rounded"
              />
              <div>
                <p className="font-medium">{bookToExchangeFor.title}</p>
                <p className="text-sm text-gray-500">
                  {bookToExchangeFor.author}
                </p>
                <p className="text-xs text-gray-400">
                  Owned by {bookToExchangeFor.owner.name}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">
              Select a book to offer:
            </h3>
            <div className="relative mb-3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your books..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-2.5"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            <ScrollArea className="h-[220px] rounded-md border">
              {filteredBooks.length > 0 ? (
                <div className="p-4 grid grid-cols-1 gap-4">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className={`border rounded-md p-3 flex items-center gap-3 cursor-pointer transition-colors ${selectedBookId === book.id ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"}`}
                      onClick={() => setSelectedBookId(book.id)}
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-16 w-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{book.title}</p>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        <p className="text-xs text-gray-400">
                          {book.condition} condition
                        </p>
                      </div>
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${selectedBookId === book.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}"
                      >
                        {selectedBookId === book.id && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {searchQuery
                    ? "No books match your search"
                    : "You don't have any books to exchange"}
                </div>
              )}
            </ScrollArea>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">
              Add a message (optional):
            </h3>
            <Textarea
              placeholder="Let the owner know why you're interested in this exchange..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedBookId}
            className="gap-2"
          >
            <Repeat className="h-4 w-4" />
            Propose Exchange
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExchangeProposalModal;
