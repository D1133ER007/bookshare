import React from "react";
import { Book, BookInsert } from "@/types/books";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookForm } from "./BookForm";

interface EditBookModalProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BookInsert) => Promise<void>;
}

const EditBookModal = ({
  book,
  open,
  onOpenChange,
  onSubmit,
}: EditBookModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <BookForm
          defaultValues={{
            title: book.title,
            author: book.author,
            description: book.description,
            cover_image: book.cover_image,
            condition: book.condition,
            genre: Array.isArray(book.genre) ? book.genre : [],
            location: book.location,
            rental_price: book.rental_price || 0,
          }}
          onSubmit={async (data) => {
            await onSubmit(data as BookInsert);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditBookModal; 