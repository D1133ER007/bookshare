import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BookOpen,
  Clock,
  MapPin,
  Star,
  Calendar,
  Repeat,
  MessageCircle,
  Edit,
  Trash,
  User,
} from "lucide-react";

interface BookDetailModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  book?: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    description: string;
    isAvailable: boolean;
    isOwner: boolean;
    condition: "New" | "Like New" | "Good" | "Fair" | "Poor";
    rentalPrice: number;
    location: string;
    distance: number;
    publishedYear: number;
    genre: string;
    pages: number;
    isbn: string;
    owner: {
      id: string;
      name: string;
      avatar: string;
      rating: number;
      booksShared: number;
    };
  };
  onRentalRequest?: () => void;
  onExchangeProposal?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMessageOwner?: () => void;
}

const BookDetailModal = ({
  open = true,
  onOpenChange = () => {},
  book = {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
    description:
      "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    isAvailable: true,
    isOwner: false,
    condition: "Good" as const,
    rentalPrice: 5,
    location: "Brooklyn, NY",
    distance: 2.5,
    publishedYear: 1925,
    genre: "Classic Literature",
    pages: 180,
    isbn: "9780743273565",
    owner: {
      id: "user1",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      rating: 4.8,
      booksShared: 24,
    },
  },
  onRentalRequest = () => {},
  onExchangeProposal = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onMessageOwner = () => {},
}: BookDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Book cover and quick actions */}
          <div className="p-6 flex flex-col items-center">
            <div className="relative w-full max-w-[300px] aspect-[2/3] mb-4">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded-md shadow-md"
              />
              <div className="absolute top-2 right-2">
                <Badge
                  variant={book.isAvailable ? "default" : "secondary"}
                  className={book.isAvailable ? "bg-green-500" : "bg-gray-500"}
                >
                  {book.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
              {book.isOwner && (
                <div className="absolute top-2 left-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 border-blue-300"
                  >
                    Your Book
                  </Badge>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-3 mt-2">
              {!book.isOwner && book.isAvailable && (
                <>
                  <Button className="w-full" onClick={onRentalRequest}>
                    <Clock size={18} className="mr-2" />
                    Request Rental
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onExchangeProposal}
                  >
                    <Repeat size={18} className="mr-2" />
                    Propose Exchange
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={onMessageOwner}
                  >
                    <MessageCircle size={18} className="mr-2" />
                    Message Owner
                  </Button>
                </>
              )}

              {book.isOwner && (
                <>
                  <Button variant="default" className="w-full" onClick={onEdit}>
                    <Edit size={18} className="mr-2" />
                    Edit Book
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={onDelete}
                  >
                    <Trash size={18} className="mr-2" />
                    Remove Book
                  </Button>
                </>
              )}

              {!book.isAvailable && !book.isOwner && (
                <Button variant="ghost" className="w-full" disabled>
                  Currently Unavailable
                </Button>
              )}
            </div>
          </div>

          {/* Right column - Book details */}
          <div className="col-span-2 p-6 pt-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {book.title}
              </DialogTitle>
              <DialogDescription className="text-lg text-gray-700">
                by {book.author}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Book Details</TabsTrigger>
                <TabsTrigger value="rental">Rental Terms</TabsTrigger>
                <TabsTrigger value="owner">About Owner</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 space-y-4">
                <p className="text-gray-700">{book.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Condition:</strong> {book.condition}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Published:</strong> {book.publishedYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Location:</strong> {book.location} (
                      {book.distance} miles away)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Genre:</strong> {book.genre}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>Pages:</strong> {book.pages}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-gray-500" />
                    <span className="text-sm">
                      <strong>ISBN:</strong> {book.isbn}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rental" className="mt-4 space-y-4">
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium text-lg mb-2">
                    Rental Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-gray-500" />
                      <span>
                        <strong>Price:</strong> ${book.rentalPrice}/week
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-gray-500" />
                      <span>
                        <strong>Minimum rental:</strong> 1 week
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-gray-500" />
                      <span>
                        <strong>Maximum rental:</strong> 8 weeks
                      </span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <h3 className="font-medium text-lg mb-2">Rental Policies</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Late returns incur a fee of $1/day</li>
                    <li>Damage deposit may be required</li>
                    <li>Book must be returned in same condition</li>
                    <li>Pickup and return at agreed location</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="owner" className="mt-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={book.owner.avatar}
                      alt={book.owner.name}
                    />
                    <AvatarFallback>
                      <User size={24} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{book.owner.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                      <span className="text-sm">
                        {book.owner.rating} rating · {book.owner.booksShared}{" "}
                        books shared
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium mb-2">About the Owner</h3>
                  <p className="text-sm text-gray-700">
                    {book.owner.name} has been sharing books on BookShare since
                    2022. They specialize in classic literature and contemporary
                    fiction.
                  </p>

                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Recent Reviews</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded border">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${i < 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            2 weeks ago
                          </span>
                        </div>
                        <p className="text-sm">
                          "Great experience! Book was in perfect condition and
                          owner was very responsive."
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            1 month ago
                          </span>
                        </div>
                        <p className="text-sm">
                          "Smooth transaction and the book was exactly as
                          described. Would rent from again."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailModal;
