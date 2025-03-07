import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddBookModal from "./AddBookModal";
import { BookFormData } from "@/types/books";

interface AddBookButtonProps {
  onBookAdded: () => void;
  onSubmit: (data: Partial<BookFormData>) => Promise<void>;
}

export function AddBookButton({ onBookAdded, onSubmit }: AddBookButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (data: Partial<BookFormData>) => {
    await onSubmit(data);
    onBookAdded();
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary hover:bg-primary/90"
        size="lg"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Book
      </Button>

      <AddBookModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
} 