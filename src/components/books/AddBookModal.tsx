import React, { useState, useCallback } from "react";
import { BookFormData } from "@/types/books";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookForm } from "./BookForm";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<BookFormData>) => Promise<void>;
}

const AddBookModal = ({ open, onOpenChange, onSubmit }: AddBookModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens/closes
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(isOpen);
      if (!isOpen) {
        // Reset state when closing
        setError(null);
        setSuccess(false);
      }
    }
  }, [isSubmitting, onOpenChange]);

  const handleSubmit = async (data: BookFormData) => {
    try {
      setError(null);
      setSuccess(false);
      setIsSubmitting(true);
      
      // Prepare book data with required status field
      const bookData: Partial<BookFormData> = {
        title: data.title,
        author: data.author,
        description: data.description || null,
        cover_image: data.cover_image || null,
        condition: data.condition,
        genre: Array.isArray(data.genre) ? data.genre : [],
        rental_price: data.rental_price || null,
        isbn: data.isbn || null,
        status: data.status // This will now always be set due to the default value
      };
      
      await onSubmit(bookData);
      
      setSuccess(true);
      // Close modal after success with a slight delay
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error instanceof Error ? error.message : "Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">Share Your Book</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Fill in the details about your book. The more information you provide, the easier it will be for others to find and borrow your book.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mt-4 bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Book added successfully!</AlertDescription>
          </Alert>
        )}
        
        <BookForm
          onSubmit={handleSubmit}
          onCancel={() => !isSubmitting && handleOpenChange(false)}
          isLoading={isSubmitting}
          defaultValues={{ status: "available" }}
        />
        
        <DialogFooter className="text-xs text-muted-foreground mt-4 pt-2 border-t">
          All fields marked with <span className="text-destructive">*</span> are required
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookModal;
