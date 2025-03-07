import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { transactionService } from "@/services/supabase";
import { Book } from "@/types/books";
import { successToast, errorToast } from "@/components/ui/custom-toast";

interface RentalFormData {
  borrow_date: Date;
  return_date: Date;
  notes?: string;
}

export function useRental(book: Book) {
  const { user } = useAuth();
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRentalRequest = async (formData: RentalFormData) => {
    if (!user) {
      errorToast({ message: "You must be logged in to borrow books" });
      return;
    }

    setIsLoading(true);
    try {
      await transactionService.createTransaction({
        book_id: book.id,
        borrower_id: user.id,
        lender_id: book.owner_id,
        start_date: formData.borrow_date.toISOString(),
        end_date: formData.return_date.toISOString(),
        notes: formData.notes,
      });

      successToast({
        message: "Rental request sent successfully! Waiting for owner approval.",
      });
      setIsRentalModalOpen(false);
    } catch (error: any) {
      errorToast({
        message: error.message || "Failed to send rental request",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isRentalModalOpen,
    setIsRentalModalOpen,
    handleRentalRequest,
    isLoading,
  };
} 