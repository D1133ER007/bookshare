import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Book,
  RefreshCw,
  User,
  LogIn,
  Menu,
  Bell,
  MessageSquare,
  Heart,
  BookOpen,
  Plus,
  X,
  Home,
  BarChart3,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  isAuthenticated?: boolean;
  username?: string;
  avatarUrl?: string;
  onLogin?: () => void;
  onSignup?: () => void;
}

const Navbar = ({
  isAuthenticated = false,
  username = "John Doe",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=bookshare",
  onLogin = () => {},
  onSignup = () => {},
}: NavbarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      duration: 3000,
    });
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/books?search=${searchTerm}`);
      toast({
        title: "Searching for books",
        description: `Finding results for "${searchTerm}"`,
        duration: 3000,
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="w-full h-[72px] px-4 md:px-6 lg:px-8 flex items-center justify-between border-b border-gray-200 bg-background sticky top-0 z-50 shadow-sm">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
            onClick={() => navigate("/")}
          >
            <Book className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold hidden sm:inline bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              BookShare
            </span>
          </Link>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center max-w-md w-full mx-4 relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* Navigation Links and User Menu */}
        <div className="flex items-center gap-2">
          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors relative group ${isActive("/") ? "text-blue-600" : "hover:text-blue-600"}`}
            >
              Home
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all ${isActive("/") ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>
            <Link
              to="/books"
              className={`text-sm font-medium transition-colors relative group ${isActive("/books") ? "text-blue-600" : "hover:text-blue-600"}`}
            >
              Browse Books
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all ${isActive("/books") ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/my-books"
                  className={`text-sm font-medium transition-colors relative group ${isActive("/my-books") ? "text-blue-600" : "hover:text-blue-600"}`}
                >
                  My Books
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all ${isActive("/my-books") ? "w-full" : "w-0 group-hover:w-full"}`}
                  ></span>
                </Link>
                <Link
                  to="/transactions"
                  className={`text-sm font-medium transition-colors relative group ${isActive("/transactions") ? "text-blue-600" : "hover:text-blue-600"}`}
                >
                  Transactions
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all ${isActive("/transactions") ? "w-full" : "w-0 group-hover:w-full"}`}
                  ></span>
                </Link>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors relative group ${isActive("/dashboard") ? "text-blue-600" : "hover:text-blue-600"}`}
                >
                  Dashboard
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all ${isActive("/dashboard") ? "w-full" : "w-0 group-hover:w-full"}`}
                  ></span>
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification Icons - Only for authenticated users */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  toast({
                    title: "Notifications",
                    description: "You have 3 unread notifications",
                    duration: 3000,
                  });
                }}
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  toast({
                    title: "Messages",
                    description: "You have 2 unread messages",
                    duration: 3000,
                  });
                }}
              >
                <MessageSquare className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  2
                </Badge>
              </Button>
            </div>
          )}

          {/* Auth Buttons or User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar>
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl} alt={username} />
                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-sm">{username}</p>
                    <p className="text-xs text-muted-foreground">
                      View profile
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-books" className="cursor-pointer w-full">
                    <Book className="mr-2 h-4 w-4" />
                    <span>My Books</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/transactions" className="cursor-pointer w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Transactions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="cursor-pointer w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogIn className="mr-2 h-4 w-4 rotate-180" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogin}
                className="font-medium hover:text-blue-600 hover:bg-blue-50"
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={onSignup}
                variant="accent"
                className="font-medium"
              >
                Sign up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Book className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  BookShare
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search books..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      setShowMobileMenu(false);
                    }
                  }}
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-1 overflow-auto">
              <div className="p-4 space-y-4">
                <Link
                  to="/"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </Link>
                <Link
                  to="/books"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">Browse Books</span>
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/my-books"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Book className="h-5 w-5" />
                      <span className="font-medium">My Books</span>
                    </Link>
                    <Link
                      to="/transactions"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span className="font-medium">Transactions</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Heart className="h-5 w-5" />
                      <span className="font-medium">Favorites</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <div className="border-t my-4"></div>
                    <button
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground w-full text-left"
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                    >
                      <LogIn className="h-5 w-5 rotate-180" />
                      <span className="font-medium">Log out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t my-4"></div>
                    <button
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground w-full text-left"
                      onClick={() => {
                        onLogin();
                        setShowMobileMenu(false);
                      }}
                    >
                      <LogIn className="h-5 w-5" />
                      <span className="font-medium">Log in</span>
                    </button>
                    <button
                      className="flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white w-full text-left hover:bg-blue-700"
                      onClick={() => {
                        onSignup();
                        setShowMobileMenu(false);
                      }}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Sign up</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Add Book Button - Only for authenticated users */}
            {isAuthenticated && (
              <div className="p-4 border-t">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => {
                    navigate("/my-books");
                    setShowMobileMenu(false);
                    toast({
                      title: "Add a Book",
                      description: "Let's add a new book to your collection",
                      duration: 3000,
                    });
                  }}
                >
                  <Plus size={18} />
                  Add a Book
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
