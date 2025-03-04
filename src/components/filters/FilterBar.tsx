import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import { X, Filter, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface FilterBarProps {
  onFilterChange?: (filters: FilterOptions) => void;
  className?: string;
}

interface FilterOptions {
  genre: string;
  locationRadius: number;
  priceRange: [number, number];
  condition: string;
}

const genres = [
  "All Genres",
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Children's",
  "Young Adult",
  "Poetry",
  "Comics & Graphic Novels",
];

const conditions = [
  "All Conditions",
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor",
];

const FilterBar = ({
  onFilterChange = () => {},
  className = "",
}: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    genre: "All Genres",
    locationRadius: 10,
    priceRange: [0, 50],
    condition: "All Conditions",
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);

    // Update active filters
    updateActiveFilters(key, value);
  };

  const updateActiveFilters = (key: keyof FilterOptions, value: any) => {
    const newActiveFilters = [...activeFilters];

    // Remove existing filter of the same type
    const existingIndex = newActiveFilters.findIndex((filter) =>
      filter.startsWith(key),
    );
    if (existingIndex !== -1) {
      newActiveFilters.splice(existingIndex, 1);
    }

    // Add new filter if it's not the default value
    if (
      (key === "genre" && value !== "All Genres") ||
      (key === "condition" && value !== "All Conditions") ||
      (key === "locationRadius" && value !== 10) ||
      (key === "priceRange" && (value[0] !== 0 || value[1] !== 50))
    ) {
      let filterText = "";
      if (key === "genre" || key === "condition") {
        filterText = `${key}:${value}`;
      } else if (key === "locationRadius") {
        filterText = `radius:${value}mi`;
      } else if (key === "priceRange") {
        filterText = `price:$${value[0]}-$${value[1]}`;
      }
      newActiveFilters.push(filterText);
    }

    setActiveFilters(newActiveFilters);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      genre: "All Genres",
      locationRadius: 10,
      priceRange: [0, 50],
      condition: "All Conditions",
    };
    setFilters(defaultFilters);
    setActiveFilters([]);
    onFilterChange(defaultFilters);
  };

  const removeFilter = (filterToRemove: string) => {
    const newActiveFilters = activeFilters.filter(
      (filter) => filter !== filterToRemove,
    );
    setActiveFilters(newActiveFilters);

    // Update the actual filter value
    const [key, value] = filterToRemove.split(":");
    let newFilters = { ...filters };

    if (key === "genre") {
      newFilters.genre = "All Genres";
    } else if (key === "condition") {
      newFilters.condition = "All Conditions";
    } else if (key === "radius") {
      newFilters.locationRadius = 10;
    } else if (key === "price") {
      newFilters.priceRange = [0, 50];
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={`w-full bg-white p-4 rounded-md shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        {/* Genre Filter */}
        <Select
          value={filters.genre}
          onValueChange={(value) => handleFilterChange("genre", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Condition Filter */}
        <Select
          value={filters.condition}
          onValueChange={(value) => handleFilterChange("condition", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Radius Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              <span>Within {filters.locationRadius} miles</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Distance</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm">0 mi</span>
                <span className="text-sm">50 mi</span>
              </div>
              <Slider
                value={[filters.locationRadius]}
                min={0}
                max={50}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("locationRadius", value[0])
                }
              />
              <div className="text-center text-sm">
                {filters.locationRadius} miles
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Price Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              <span>
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Price Range</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm">$0</span>
                <span className="text-sm">$50+</span>
              </div>
              <Slider
                value={filters.priceRange}
                min={0}
                max={50}
                step={1}
                onValueChange={(value) =>
                  handleFilterChange("priceRange", value)
                }
              />
              <div className="text-center text-sm">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="ml-auto"
          disabled={activeFilters.length === 0}
        >
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center mr-2">
            <Filter className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-500">Active Filters:</span>
          </div>
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {filter.replace(":", ": ")}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => removeFilter(filter)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
