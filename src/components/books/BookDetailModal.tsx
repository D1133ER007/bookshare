'use client';

import React, { useState } from 'react';
import { Book, BookUpdate } from '@/types/books';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { bookService } from '@/services/supabase';
import EditBookModal from './EditBookModal';
import RentalModal from './RentalModal';
import ExchangeModal from './ExchangeModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';

interface BookDetailModalProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookUpdated?: () => void;
}

const BookDetailModal = ({
  book,
  open,
  onOpenChange,
  onBookUpdated,
}: BookDetailModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  const handleEditBook = async (data: BookUpdate) => {
    try {
      await bookService.updateBook(book.id, data);
      toast({
        title: 'Success',
        description: 'Book updated successfully',
      });
      onBookUpdated?.();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating book:', error);
      toast({
        title: 'Error',
        description: 'Failed to update book',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBook = async () => {
    try {
      await bookService.deleteBook(book.id);
      toast({
        title: 'Success',
        description: 'Book deleted successfully',
      });
      onOpenChange(false);
      onBookUpdated?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        variant: 'destructive',
      });
    }
  };

  const isOwner = user?.id === book.owner_id;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold">Author</h3>
              <p>{book.author}</p>
            </div>

            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600">{book.description}</p>
            </div>

            <div>
              <h3 className="font-semibold">Cover Image</h3>
              <img
                src={book.cover_image}
                alt={book.title}
                className="mt-2 rounded-md w-full max-w-[200px]"
              />
            </div>

            <div>
              <h3 className="font-semibold">Condition</h3>
              <Badge variant="secondary" className="mt-1">
                {book.condition}
              </Badge>
            </div>

            <div>
              <h3 className="font-semibold">Genres</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {book.genre.map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{book.location}</p>
            </div>

            {book.rental_price && (
              <div>
                <h3 className="font-semibold">Weekly Rental Price</h3>
                <p>${book.rental_price.toFixed(2)}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              {isOwner ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsExchangeModalOpen(true)}
                  >
                    Exchange
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setIsRentalModalOpen(true)}
                  >
                    Rent
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditBookModal
        book={book}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditBook}
      />

      <RentalModal
        book={book}
        open={isRentalModalOpen}
        onOpenChange={setIsRentalModalOpen}
        onSuccess={() => {
          onOpenChange(false);
          onBookUpdated?.();
        }}
      />

      <ExchangeModal
        book={book}
        open={isExchangeModalOpen}
        onOpenChange={setIsExchangeModalOpen}
        onSuccess={() => {
          onOpenChange(false);
          onBookUpdated?.();
        }}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book
              "{book.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBook}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookDetailModal;
