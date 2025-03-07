import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, BookOpen, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const bookConditions = [
  { value: "new", label: "New - Never used" },
  { value: "good", label: "Good - Minor wear" },
  { value: "fair", label: "Fair - Visible wear but intact" },
  { value: "poor", label: "Poor - Significant wear" },
] as const;

const popularGenres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "Horror",
  "Biography",
  "History",
  "Science",
  "Technology",
  "Self-Help",
  "Business",
  "Children's",
  "Young Adult",
] as const;

const bookFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters"),
  description: z
    .string()
    .nullable()
    .optional(),
  cover_image: z
    .string()
    .url("Please enter a valid image URL")
    .nullable()
    .optional(),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']),
  genre: z.array(z.string()).min(1, "Please select at least one genre"),
  rental_price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(10000, "Price must be less than 10000")
    .nullable()
    .optional(),
  isbn: z
    .string()
    .nullable()
    .optional(),
  status: z.enum(['available', 'borrowed', 'unavailable']).default('available')
});

type BookFormData = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  defaultValues?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const BookForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: BookFormProps) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    defaultValues?.genre || []
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      cover_image: "",
      condition: "good",
      genre: [],
      rental_price: 0,
      status: "available",
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: BookFormData) => {
    try {
      // Reset success state
      setIsSuccess(false);
      
      // Ensure basic data is present
      if (!data.title || !data.author) {
        if (!data.title) {
          form.setError("title", {
            type: 'manual',
            message: 'Title is required',
          });
        }
        if (!data.author) {
          form.setError("author", {
            type: 'manual',
            message: 'Author is required',
          });
        }
        return;
      }
      
      // Make sure rental_price is a number
      if (typeof data.rental_price !== 'number') {
        data.rental_price = Number(data.rental_price) || 0;
      }
      
      // Ensure cover_image is a valid URL if provided
      if (data.cover_image) {
        try {
          // Add https:// if missing
          if (!/^https?:\/\//i.test(data.cover_image)) {
            data.cover_image = `https://${data.cover_image}`;
          }
          
          // Test if URL is valid
          new URL(data.cover_image);
        } catch (e) {
          form.setError("cover_image", {
            type: "manual",
            message: "Please enter a valid URL",
          });
          return;
        }
      } else {
        // Set default cover image if none provided
        data.cover_image = 'https://via.placeholder.com/300x450?text=No+Cover';
      }
      
      // Ensure genre is an array
      if (!Array.isArray(data.genre)) {
        data.genre = [];
      }
      
      // Set default condition if not selected
      if (!data.condition) {
        data.condition = "good";
      }
      
      // Ensure status is set
      if (!data.status) {
        data.status = "available";
      }
      
      // Submit the form
      await onSubmit(data);
      
      // Show success message
      setIsSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        form.reset(); 
        setSelectedGenres([]);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle specific error types if needed
      if (error instanceof Error) {
        // Show error message
        form.setError("root", {
          type: "manual",
          message: `Submission failed: ${error.message}`,
        });
      }
    }
  };

  const handleGenreSelect = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    form.setValue("genre", newGenres);
    form.clearErrors("genre");
  };

  const resetForm = () => {
    form.reset();
    setSelectedGenres([]);
    setIsSuccess(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 py-2">
        {/* Success message */}
        {isSuccess && (
          <Alert className="bg-green-50 text-green-700 border-green-200 mb-4">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>Book added successfully!</AlertDescription>
          </Alert>
        )}
        
        {/* Root error message */}
        {form.formState.errors.root && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {form.formState.errors.root.message}
          </div>
        )}
        
        {/* Progress indicator */}
        <Progress 
          value={Math.min(100, Object.keys(form.formState.dirtyFields).length * 14.3)} 
          className="mb-8"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-medium flex items-center">
                  Title <span className="text-destructive ml-1">*</span>
                  {form.formState.dirtyFields.title && !form.formState.errors.title && (
                    <svg className="w-4 h-4 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter book title" 
                    {...field} 
                    className="h-11 transition-all focus-visible:ring-primary"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  The complete title as it appears on the book cover
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-medium flex items-center">
                  Author <span className="text-destructive ml-1">*</span>
                  {form.formState.dirtyFields.author && !form.formState.errors.author && (
                    <svg className="w-4 h-4 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter author name" 
                    {...field} 
                    className="h-11 transition-all focus-visible:ring-primary"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Full name of the book's author(s)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base font-medium flex items-center">
                Description <span className="text-destructive ml-1">*</span>
                {form.formState.dirtyFields.description && !form.formState.errors.description && (
                  <svg className="w-4 h-4 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter book description" 
                  className="min-h-[120px] resize-none transition-all focus-visible:ring-primary"
                  {...field} 
                />
              </FormControl>
              <div className="flex justify-between items-center">
                <FormDescription className="text-xs">
                  A brief summary of the book's content
                </FormDescription>
                <span className={cn(
                  "text-xs",
                  field.value.length < 10 ? "text-destructive" : 
                  field.value.length > 400 ? "text-amber-500" : "text-green-500"
                )}>
                  {field.value.length}/500 characters
                </span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-base font-medium flex items-center">
                    Cover Image URL <span className="text-destructive ml-1">*</span>
                    {form.formState.dirtyFields.cover_image && !form.formState.errors.cover_image && (
                      <svg className="w-4 h-4 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter the book cover image URL" 
                      {...field} 
                      className="h-11 transition-all focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Direct link to the book's cover image (e.g., https://example.com/image.jpg)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center md:justify-start">
            {form.watch("cover_image") ? (
              <div className="relative group">
                <img
                  src={form.watch("cover_image")}
                  alt="Book cover preview"
                  className="w-32 h-48 object-cover rounded-md border shadow-md transition-all group-hover:shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                  }}
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
              </div>
            ) : (
              <div className="w-32 h-48 border border-dashed rounded-md flex items-center justify-center bg-muted/30">
                <p className="text-xs text-muted-foreground text-center px-2">Cover preview will appear here</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Condition */}
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-medium flex items-center">
                  Condition <span className="text-destructive ml-1">*</span>
                  {form.formState.dirtyFields.condition && !form.formState.errors.condition && (
                    <svg className="w-4 h-4 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 transition-all focus:ring-primary">
                      <SelectValue placeholder="Select book condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bookConditions.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  Choose the condition that best describes your book
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Rental Price */}
          <FormField
            control={form.control}
            name="rental_price"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-medium flex items-center">
                  Rental Price (NPR/week)
                  {form.formState.dirtyFields.rental_price && !form.formState.errors.rental_price && (
                    <svg className="w-4 h-4 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      NPR
                    </span>
                    <Input 
                      type="number" 
                      placeholder="Enter rental price" 
                      className="pl-12 h-11 transition-all focus-visible:ring-primary"
                      value={field.value || 0}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                      min={0}
                      max={10000}
                    />
                  </div>
                </FormControl>
                <div className="flex justify-between items-center">
                  <FormDescription className="text-xs">
                    Set a weekly rental price in Nepalese Rupees
                  </FormDescription>
                  <span className="text-xs text-muted-foreground">
                    Range: 0-10,000 NPR
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Genre */}
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel className="text-base font-medium flex items-center">
                  Genre <span className="text-destructive ml-1">*</span>
                  {form.formState.dirtyFields.genre && field.value.length > 0 && !form.formState.errors.genre && (
                    <svg className="w-4 h-4 ml-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </FormLabel>
                <span className="text-xs text-muted-foreground">
                  Selected: {field.value?.length || 0}
                </span>
              </div>
              <FormDescription className="text-xs mt-0">
                Select one or more genres that match your book
              </FormDescription>
              <FormControl>
                <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-background/50 shadow-inner">
                  {popularGenres.map((genre) => (
                    <Button
                      key={genre}
                      type="button"
                      variant={field.value?.includes(genre) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleGenreSelect(genre)}
                      className={cn(
                        "capitalize transition-all",
                        field.value?.includes(genre) 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "hover:bg-primary/10"
                      )}
                    >
                      {genre}
                      {field.value?.includes(genre) && (
                        <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form completion status */}
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-muted/30 rounded-md mt-6">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{Object.keys(form.formState.dirtyFields).length}</span> of <span className="font-medium">7</span> fields completed
          </div>
          <div className="h-4 w-px bg-border mx-2"></div>
          {form.formState.isValid ? 
            <span className="text-sm text-green-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Form is valid
            </span> : 
            <span className="text-sm text-amber-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Some fields need attention
            </span>
          }
        </div>

        {/* Submit Button */}
        <div className="flex justify-between space-x-4 pt-6 border-t bg-background z-10 mt-4">
          <div className="space-x-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="px-8 h-12 border-gray-200"
              >
                Cancel
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
              className="px-8 h-12 text-gray-500 border-gray-200"
            >
              Reset
            </Button>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="px-8 h-12 bg-gray-500 hover:bg-gray-600 text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding Book...
              </>
            ) : (
              <>
                <svg 
                  className="mr-2 h-5 w-5" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Add Book
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 