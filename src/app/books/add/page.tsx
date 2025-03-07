import { BookForm } from "@/components/books/BookForm";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function AddBookPage() {
  const handleAddBook = async (data: any) => {
    try {
      // TODO: Implement the actual book addition logic here
      console.log("Adding book:", data);
      // You would typically make an API call here to save the book
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Add a New Book</h1>
          <Button onClick={() => window.history.back()}>
            <BookOpen className="mr-2 h-5 w-5" />
            Back to Books
          </Button>
        </div>
        <div className="bg-card rounded-lg shadow-lg">
          <BookForm 
            onSubmit={handleAddBook}
            onCancel={() => window.history.back()}
          />
        </div>
      </div>
    </div>
  );
} 