import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Book } from "@/types/books";

interface LandingStats {
  booksShared: number;
  activeUsers: number;
  communities: number;
  averageRating: number;
}

export function useLanding() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<LandingStats>({
    booksShared: 0,
    activeUsers: 0,
    communities: 0,
    averageRating: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      // Get total books
      const { data: books } = await supabase.from("books").select("id");
      const booksCount = books?.length || 0;

      // Get unique users (active users)
      const { data: users } = await supabase.from("profiles").select("id");
      const usersCount = users?.length || 0;

      // Get unique locations (communities)
      const { data: locations } = await supabase
        .from("profiles")
        .select("location");
      const uniqueLocations = new Set(locations?.map((l) => l.location));
      const communitiesCount = uniqueLocations.size;

      // Get average rating
      const { data: ratings } = await supabase
        .from("profiles")
        .select("rating");
      const avgRating =
        ratings?.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          (ratings?.length || 1) || 0;

      setStats({
        booksShared: booksCount,
        activeUsers: usersCount,
        communities: communitiesCount,
        averageRating: Number(avgRating.toFixed(1)),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setIsSearching(true);
    try {
      const { data: searchResults } = await supabase
        .from("books")
        .select("*")
        .or(`title.ilike.%${term}%,author.ilike.%${term}%,description.ilike.%${term}%`)
        .limit(5);

      if (searchResults?.length) {
        // If we have results, navigate to books page with search term
        navigate(`/books?search=${encodeURIComponent(term)}`);
      }
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const navigateToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    handleSearch,
    isSearching,
    stats,
    isLoadingStats,
    navigateToSection,
  };
} 