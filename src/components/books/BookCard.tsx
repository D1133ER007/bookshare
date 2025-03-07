import React from 'react';
import { Book } from "@/types/books";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface BookCardProps {
  book: Book;
  onClick: () => void;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => void;
}

const BookCard = ({ book, onClick, onEdit, onDelete }: BookCardProps) => {
  const { user } = useAuth();
  // Ensure genre is an array
  const genres = Array.isArray(book.genre) ? book.genre : [];

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
          {genres.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{genres.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center mb-2">
          <Badge
            variant={book.status === 'available' ? 'default' : 'secondary'}
          >
            {book.status}
          </Badge>
          {book.rental_price && (
            <span className="text-sm font-medium">
              ${book.rental_price.toFixed(2)}/week
            </span>
          )}
        </div>

        {book.owner_id === user?.id && onEdit && onDelete && (
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(book);
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(book);
              }}
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard;
