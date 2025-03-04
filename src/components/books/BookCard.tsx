import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { BookOpen, Repeat, Clock, Star } from "lucide-react";

interface BookCardProps {
  id?: string;
  title?: string;
  author?: string;
  coverImage?: string;
  isAvailable?: boolean;
  isOwner?: boolean;
  condition?: "New" | "Like New" | "Good" | "Fair" | "Poor";
  rentalPrice?: number;
  genre?: string;
  rating?: number;
  onClick?: () => void;
  onRentalRequest?: () => void;
  onExchangeProposal?: () => void;
}

const BookCard = ({
  id = "1",
  title = "The Great Gatsby",
  author = "F. Scott Fitzgerald",
  coverImage = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
  isAvailable = true,
  isOwner = false,
  condition = "Good",
  rentalPrice = 5,
  genre = "Fiction",
  rating = 4.5,
  onClick = () => {},
  onRentalRequest = () => {},
  onExchangeProposal = () => {},
}: BookCardProps) => {
  return (
    <Card
      className="w-[280px] h-[420px] flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 bg-white transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={isAvailable ? "default" : "secondary"}
            className={isAvailable ? "bg-green-500 text-white" : "bg-gray-500"}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        {isOwner && (
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-blue-100 border-blue-300">
              Your Book
            </Badge>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
          {genre}
        </div>
      </div>

      <CardHeader className="p-4 pb-0">
        <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-500">{author}</p>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gray-500" />
            <span className="text-sm">{condition}</span>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.floor(rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="text-xs ml-1">{rating}</span>
          </div>
        </div>
        {rentalPrice > 0 && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-blue-600">
              ${rentalPrice}/week rental
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        {!isOwner && isAvailable && (
          <>
            <Button
              variant="accent"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onRentalRequest();
              }}
            >
              <Clock size={16} className="mr-1" />
              Rent
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onExchangeProposal();
              }}
            >
              <Repeat size={16} className="mr-1" />
              Exchange
            </Button>
          </>
        )}
        {isOwner && (
          <Button variant="secondary" size="sm" className="w-full">
            Manage Book
          </Button>
        )}
        {!isAvailable && !isOwner && (
          <Button variant="ghost" size="sm" className="w-full" disabled>
            Currently Unavailable
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
