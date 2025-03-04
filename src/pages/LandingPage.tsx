import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, setShowAuthModal, setAuthModalTab } = useAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      toast({
        title: "Searching for books",
        description: `Finding results for "${searchTerm}"`,
        duration: 3000,
      });
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
              Join 5,000+ book lovers in your community
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
              >
                How It Works
              </Button>
            </div>

            {/* Search Bar */}
            <div className="mt-8 max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for books by title, author, or genre..."
                  className="pl-10 pr-20 py-6 text-base rounded-full shadow-sm border-gray-200 focus:border-blue-300 focus:ring-blue-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Search
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
                <p className="text-sm font-medium">120+ Communities</p>
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
                <p className="text-3xl font-bold text-blue-600">5,000+</p>
                <p className="text-gray-600">Books Shared</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-50 p-3 rounded-full mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600">2,500+</p>
                <p className="text-gray-600">Active Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-50 p-3 rounded-full mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600">120+</p>
                <p className="text-gray-600">Communities</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-yellow-50 p-3 rounded-full mb-3">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-yellow-600">4.8/5</p>
                <p className="text-gray-600">User Rating</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
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
                  Find people nearby who have books you want or who want yours.
                  Message directly through our secure platform.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Exchange & Return
                </h3>
                <p className="text-gray-600">
                  Arrange meetups to exchange books and track rental periods.
                  Rate your experience and build your community reputation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm bg-blue-50 border-blue-200 text-blue-700 mb-4"
              >
                Curated Selection
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Books
              </h2>
            </div>
            <Link
              to="/books"
              className="text-blue-600 font-medium flex items-center gap-1 hover:underline mt-4 md:mt-0"
            >
              View all books <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* Book Cards */}
            {[
              {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                image:
                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
                price: 5,
                genre: "Classic",
              },
              {
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                image:
                  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000",
                price: 4,
                genre: "Fiction",
              },
              {
                title: "1984",
                author: "George Orwell",
                image:
                  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000",
                price: 3,
                genre: "Sci-Fi",
              },
              {
                title: "Pride and Prejudice",
                author: "Jane Austen",
                image:
                  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000",
                price: 6,
                genre: "Romance",
              },
              {
                title: "The Hobbit",
                author: "J.R.R. Tolkien",
                image:
                  "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=1000",
                price: 5,
                genre: "Fantasy",
              },
            ].map((book, i) => (
              <Card
                key={i}
                className="overflow-hidden hover:shadow-md transition-shadow border-none shadow-sm"
              >
                <div className="relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                    {book.genre}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500">{book.author}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-600">
                      ${book.price}/week
                    </span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Available
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm bg-blue-50 border-blue-200 text-blue-700 mb-4"
            >
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied readers in our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                since: "2022",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                quote:
                  "BookShare has completely changed how I read. I've discovered so many new books and met amazing people in my neighborhood who share my interests.",
              },
              {
                name: "Michael Chen",
                since: "2023",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
                quote:
                  "As someone who reads a lot but doesn't want to keep every book, this platform is perfect. I've saved money and storage space while still enjoying a wide variety of books.",
              },
              {
                name: "Jessica Williams",
                since: "2021",
                avatar:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
                quote:
                  "The exchange feature is brilliant! I've traded books I've already read for new ones without spending a dime. The community is friendly and respectful.",
              },
            ].map((testimonial, i) => (
              <Card
                key={i}
                className="border-none shadow-md hover:shadow-lg transition-shadow bg-gray-50"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <img
                        src={testimonial.avatar}
                        alt="User avatar"
                        className="w-12 h-12 rounded-full border-2 border-blue-100"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">
                        Member since {testimonial.since}
                      </p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <Badge
            variant="outline"
            className="px-3 py-1 text-sm bg-blue-500 border-blue-400 text-white mb-6"
          >
            Join Today
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Ready to Start Sharing?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our community today and connect with fellow book lovers in your
            area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 bg-white text-blue-600 hover:bg-gray-100"
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
              Create Your Account
              <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white text-white hover:bg-blue-500"
              onClick={() => {
                setAuthModalTab("login");
                setShowAuthModal(true);
              }}
            >
              Sign In
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">BookShare</span>
            </div>
            <p className="text-sm">Connecting readers, building communities.</p>
            <div className="flex gap-4 mt-4">
              {["facebook", "twitter", "instagram", "linkedin"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <i className={`fab fa-${social}`}></i>
                    </div>
                  </a>
                ),
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className="hover:text-white transition-colors"
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4">Stay Connected</h4>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for updates
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-r-none bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="submit"
                className="rounded-l-none bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-sm text-center">
          <p>© {new Date().getFullYear()} BookShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
