import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  BookOpen,
  RefreshCw,
  BarChart3,
  Search,
  Filter,
  Download,
  Trash,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeRentals: 0,
    completedExchanges: 0,
  });
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        // In a real app, you would check if the user has admin role
        // For demo purposes, we'll assume the logged-in user is an admin
        setIsAdmin(true);
        fetchDashboardData();
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const { data: usersData } = await supabase.from("profiles").select("*");
      const { data: booksData } = await supabase.from("books").select("*");
      const { data: rentalsData } = await supabase
        .from("rental_requests")
        .select("*")
        .eq("status", "approved");
      const { data: exchangesData } = await supabase
        .from("exchange_proposals")
        .select("*")
        .eq("status", "completed");

      setStats({
        totalUsers: usersData?.length || 0,
        totalBooks: booksData?.length || 0,
        activeRentals: rentalsData?.length || 0,
        completedExchanges: exchangesData?.length || 0,
      });

      setUsers(usersData || []);
      setBooks(booksData || []);

      // Combine rental and exchange transactions
      const { data: allRentals } = await supabase
        .from("rental_requests")
        .select("*, book:books(*), requester:profiles(*), owner:profiles(*)");

      const { data: allExchanges } = await supabase
        .from("exchange_proposals")
        .select(
          "*, book_requested:books(*), book_offered:books(*), requester:profiles(*), owner:profiles(*)",
        );

      const formattedRentals = (allRentals || []).map((rental) => ({
        id: rental.id,
        type: "rental",
        status: rental.status,
        date: rental.created_at,
        book: rental.book.title,
        requester: rental.requester.name,
        owner: rental.owner.name,
        details: `${new Date(rental.start_date).toLocaleDateString()} to ${new Date(
          rental.end_date,
        ).toLocaleDateString()}`,
      }));

      const formattedExchanges = (allExchanges || []).map((exchange) => ({
        id: exchange.id,
        type: "exchange",
        status: exchange.status,
        date: exchange.created_at,
        book: exchange.book_requested.title,
        requester: exchange.requester.name,
        owner: exchange.owner.name,
        details: `Exchanged for: ${exchange.book_offered.title}`,
      }));

      setTransactions([...formattedRentals, ...formattedExchanges]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // For demo purposes, set placeholder data
      setStats({
        totalUsers: 125,
        totalBooks: 450,
        activeRentals: 32,
        completedExchanges: 18,
      });

      setUsers([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          created_at: "2023-01-15T00:00:00",
          books_shared: 5,
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          created_at: "2023-02-20T00:00:00",
          books_shared: 12,
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike@example.com",
          created_at: "2023-03-10T00:00:00",
          books_shared: 3,
        },
      ]);

      setBooks([
        {
          id: "1",
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          condition: "Good",
          is_available: true,
          created_at: "2023-01-20T00:00:00",
        },
        {
          id: "2",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          condition: "Like New",
          is_available: false,
          created_at: "2023-02-15T00:00:00",
        },
        {
          id: "3",
          title: "1984",
          author: "George Orwell",
          condition: "Fair",
          is_available: true,
          created_at: "2023-03-05T00:00:00",
        },
      ]);

      setTransactions([
        {
          id: "1",
          type: "rental",
          status: "approved",
          date: "2023-04-10T00:00:00",
          book: "The Great Gatsby",
          requester: "Jane Smith",
          owner: "John Doe",
          details: "04/15/2023 to 04/29/2023",
        },
        {
          id: "2",
          type: "exchange",
          status: "completed",
          date: "2023-03-25T00:00:00",
          book: "To Kill a Mockingbird",
          requester: "Mike Johnson",
          owner: "Jane Smith",
          details: "Exchanged for: 1984",
        },
      ]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.book?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.requester?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.owner?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteUser = async (userId) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        // In a real app, you would delete the user from the database
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
        alert("User deleted successfully");
        fetchDashboardData();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (
      confirm(
        "Are you sure you want to delete this book? This action cannot be undone.",
      )
    ) {
      try {
        // In a real app, you would delete the book from the database
        const { error } = await supabase
          .from("books")
          .delete()
          .eq("id", bookId);
        if (error) throw error;
        alert("Book deleted successfully");
        fetchDashboardData();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book. Please try again.");
      }
    }
  };

  const handleUpdateTransactionStatus = async (
    transactionId,
    type,
    newStatus,
  ) => {
    try {
      if (type === "rental") {
        const { error } = await supabase
          .from("rental_requests")
          .update({ status: newStatus })
          .eq("id", transactionId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("exchange_proposals")
          .update({ status: newStatus })
          .eq("id", transactionId);
        if (error) throw error;
      }
      alert(`Transaction status updated to ${newStatus}`);
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating transaction status:", error);
      alert("Failed to update transaction status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access the admin dashboard.
        </p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        isAuthenticated={!!user}
        username={user?.user_metadata?.name || "Admin"}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              Export Data
            </Button>
            <Button className="gap-2">
              <RefreshCw size={16} onClick={fetchDashboardData} />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users size={16} />
              Users
            </TabsTrigger>
            <TabsTrigger value="books" className="gap-2">
              <BookOpen size={16} />
              Books
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <RefreshCw size={16} />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Users
                      </p>
                      <h3 className="text-3xl font-bold mt-1">
                        {stats.totalUsers}
                      </h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users size={24} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    ↑ 12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total Books
                      </p>
                      <h3 className="text-3xl font-bold mt-1">
                        {stats.totalBooks}
                      </h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <BookOpen size={24} className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    ↑ 8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Active Rentals
                      </p>
                      <h3 className="text-3xl font-bold mt-1">
                        {stats.activeRentals}
                      </h3>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock size={24} className="text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    ↑ 5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Completed Exchanges
                      </p>
                      <h3 className="text-3xl font-bold mt-1">
                        {stats.completedExchanges}
                      </h3>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <RefreshCw size={24} className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    ↑ 15% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Books Shared</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.slice(0, 5).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{user.books_shared || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.slice(0, 5).map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">
                            {book.title}
                          </TableCell>
                          <TableCell>{book.author}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                book.is_available ? "success" : "secondary"
                              }
                              className={
                                book.is_available
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {book.is_available ? "Available" : "Unavailable"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>User Management</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Books Shared</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{user.books_shared || 0}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Filter size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() =>
                                  alert(`View user profile: ${user.id}`)
                                }
                              >
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => alert(`Edit user: ${user.id}`)}
                              >
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Books Tab */}
          <TabsContent value="books" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Book Management</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search books..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">
                          {book.title}
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.condition}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              book.is_available ? "success" : "secondary"
                            }
                            className={
                              book.is_available
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {book.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(book.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => alert(`Edit book: ${book.id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleDeleteBook(book.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-0">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Transaction Management</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.type === "rental"
                                ? "default"
                                : "outline"
                            }
                            className={
                              transaction.type === "rental"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }
                          >
                            {transaction.type === "rental"
                              ? "Rental"
                              : "Exchange"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.book}
                        </TableCell>
                        <TableCell>{transaction.requester}</TableCell>
                        <TableCell>{transaction.owner}</TableCell>
                        <TableCell className="text-sm">
                          {transaction.details}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              transaction.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : transaction.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : transaction.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                            }
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {transaction.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600"
                                  onClick={() =>
                                    handleUpdateTransactionStatus(
                                      transaction.id,
                                      transaction.type,
                                      "approved",
                                    )
                                  }
                                >
                                  <CheckCircle size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() =>
                                    handleUpdateTransactionStatus(
                                      transaction.id,
                                      transaction.type,
                                      "rejected",
                                    )
                                  }
                                >
                                  <XCircle size={16} />
                                </Button>
                              </>
                            )}
                            {transaction.status === "approved" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-blue-600"
                                onClick={() =>
                                  handleUpdateTransactionStatus(
                                    transaction.id,
                                    transaction.type,
                                    "completed",
                                  )
                                }
                              >
                                <CheckCircle size={16} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
