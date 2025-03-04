import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, X, BookOpen, User, BookmarkIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SearchBarProps {
  onSearch?: (searchTerm: string, searchType: string) => void;
  className?: string;
  recentSearches?: string[];
  popularSearches?: string[];
}

const SearchBar = ({
  onSearch = () => {},
  className = "",
  recentSearches = ["Harry Potter", "Lord of the Rings", "Jane Austen"],
  popularSearches = [
    "Fantasy",
    "Science Fiction",
    "Classic Literature",
    "Romance",
  ],
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm, searchType);
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    // Optionally trigger search with empty term to reset results
    onSearch("", searchType);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSearch(suggestion, searchType);
    setShowSuggestions(false);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-white ${className}`}>
      <div className="relative">
        <div className="flex items-center gap-2 w-full h-14 rounded-xl border border-gray-200 px-3 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-[120px] border-0 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} />
                  <span>Title</span>
                </div>
              </SelectItem>
              <SelectItem value="author">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>Author</span>
                </div>
              </SelectItem>
              <SelectItem value="isbn">
                <div className="flex items-center gap-2">
                  <BookmarkIcon size={14} />
                  <span>ISBN</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="h-6 w-px bg-gray-200" />

          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder={`Search by ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 pl-2 pr-8 text-base"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-full"
                onClick={handleClear}
              >
                <X size={16} />
              </Button>
            )}
          </div>

          <Button
            variant="accent"
            size="sm"
            onClick={handleSearch}
            className="flex items-center gap-1 px-5 rounded-lg"
          >
            <Search size={16} />
            Search
          </Button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-3">
                <h3 className="text-xs font-medium text-gray-500 mb-2">
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Categories */}
            {popularSearches.length > 0 && (
              <div className="p-3 border-t border-gray-100">
                <h3 className="text-xs font-medium text-gray-500 mb-2">
                  Popular Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="p-2 border-t border-gray-100 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500"
                onClick={() => setShowSuggestions(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
