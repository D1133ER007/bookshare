import React from "react";
import { Link } from "react-router-dom";
import {
  Book,
  Search,
  BookOpen,
  Users,
  Clock,
  ArrowRight,
  Star,
  BookmarkIcon,
  Heart,
  MapPin,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanding } from "@/hooks/useLanding";
import { Skeleton } from "@/components/ui/skeleton";

const LandingPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    handleSearch,
    isSearching,
    stats,
    isLoadingStats,
    navigateToSection,
  } = useLanding();
  const { user, setShowAuthModal, setAuthModalTab } = useAuth();
  const { toast } = useToast();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    } else {
      toast({
        title: "Search error",
        description: "Please enter a search term",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "You've been added to our newsletter",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        isAuthenticated={!!user}
        username={user?.user_metadata?.name || "User"}
        onLogin={() => {
          setAuthModalTab("login");
          setShowAuthModal(true);
        }}
        onSignup={() => {
          setAuthModalTab("signup");
          setShowAuthModal(true);
        }}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm bg-blue-50 border-blue-200 text-blue-700 mb-4 inline-flex items-center gap-2"
            >
              <Sparkles size={14} className="text-yellow-500" />
              Join {stats.activeUsers.toLocaleString()}+ book lovers in your community
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Share Books, <span className="text-blue-600">Connect</span>{" "}
              Communities
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover, borrow, and exchange books with people in your
              neighborhood. Join our community of readers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="xl"
                className="gap-2 font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
                onClick={() => {
                  setAuthModalTab("signup");
                  setShowAuthModal(true);
                  toast({
                    title: "Welcome!",
                    description: "Create an account to get started",
                    duration: 3000,
                  });
                }}
              >
                Get Started
                <ArrowRight size={18} />
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="font-semibold border-blue-200 hover:bg-blue-50 transition-colors"
                onClick={() => navigateToSection("how-it-works")}
              >
                How It Works
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mt-8 max-w-md">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for books by title, author, or genre..."
                  className="pl-10 pr-20 py-6 text-base rounded-full shadow-sm border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isSearching}
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -top-6 -left-6 w-64 h-80 bg-blue-100 rounded-lg transform rotate-6"></div>
            <div className="absolute -bottom-6 -right-6 w-64 h-80 bg-green-100 rounded-lg transform -rotate-6"></div>
            <img
              src="https://images.unsplash.com/photo-1521056787327-165eb2a35993?q=80&w=1000"
              alt="Books on shelves"
              className="relative z-10 w-full h-[500px] object-cover rounded-xl shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg z-20 flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.communities}+ Communities</p>
                <p className="text-xs text-gray-500">Near you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-50 p-3 rounded-full mb-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.booksShared.toLocaleString()}+
                    </p>
                <p className="text-gray-600">Books Shared</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-50 p-3 rounded-full mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.activeUsers.toLocaleString()}+
                    </p>
                <p className="text-gray-600">Active Users</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-50 p-3 rounded-full mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.communities}+
                    </p>
                <p className="text-gray-600">Communities</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-50 p-3 rounded-full mb-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                {isLoadingStats ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats.averageRating}/5
                    </p>
                <p className="text-gray-600">User Rating</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm bg-blue-50 border-blue-200 text-blue-700 mb-4"
            >
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How BookShare Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to share books with others in your
              community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">List Your Books</h3>
                <p className="text-gray-600">
                  Add books you're willing to share, rent, or exchange with
                  others. Set your own rental prices and conditions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Connect with Readers
                </h3>
                <p className="text-gray-600">
                  Find readers in your area who share your interests. Message
                  them directly and arrange book exchanges.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Track & Return
                </h3>
                <p className="text-gray-600">
                  Keep track of your borrowed and lent books. Get reminders for
                  due dates and manage returns easily.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Sharing?
              </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of book lovers in your community and start sharing
            your favorite reads today.
          </p>
            <Button
            size="xl"
              variant="secondary"
            className="gap-2 font-semibold"
              onClick={() => {
                setAuthModalTab("signup");
                setShowAuthModal(true);
              }}
            >
              Create Your Account
            <ArrowRight size={18} />
            </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
