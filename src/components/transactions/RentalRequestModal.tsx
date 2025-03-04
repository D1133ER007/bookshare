import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Clock, MessageSquare } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { DateRange } from "react-day-picker";

interface RentalRequestModalProps {
  bookId?: string;
  bookTitle?: string;
  bookCoverImage?: string;
  ownerName?: string;
  rentalPrice?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: RentalRequestData) => void;
  onCancel?: () => void;
}

interface RentalRequestData {
  bookId: string;
  dateRange: DateRange | undefined;
  duration: string;
  message: string;
}

const RentalRequestModal = ({
  bookId = "1",
  bookTitle = "The Great Gatsby",
  bookCoverImage = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
  ownerName = "Jane Doe",
  rentalPrice = 5,
  open = true,
  onOpenChange = () => {},
  onSubmit = () => {},
  onCancel = () => {},
}: RentalRequestModalProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [duration, setDuration] = useState<string>("1-week");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = () => {
    onSubmit({
      bookId,
      dateRange,
      duration,
      message,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Request Rental</DialogTitle>
          <DialogDescription>
            Request to rent "{bookTitle}" from {ownerName}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-start gap-4">
            <img
              src={bookCoverImage}
              alt={bookTitle}
              className="w-20 h-28 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium">{bookTitle}</h3>
              <p className="text-sm text-gray-500">Owner: {ownerName}</p>
              <p className="text-sm font-medium mt-1">${rentalPrice}/week</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">Select Rental Period</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Rental Duration</Label>
            <RadioGroup
              value={duration}
              onValueChange={setDuration}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-week" id="1-week" />
                <Label htmlFor="1-week" className="font-normal">
                  1 Week (${rentalPrice})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-weeks" id="2-weeks" />
                <Label htmlFor="2-weeks" className="font-normal">
                  2 Weeks (${rentalPrice * 2})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-month" id="1-month" />
                <Label htmlFor="1-month" className="font-normal">
                  1 Month (${rentalPrice * 4})
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Owner (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain why you'd like to rent this book..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Clock size={16} />
            Request Rental
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RentalRequestModal;
