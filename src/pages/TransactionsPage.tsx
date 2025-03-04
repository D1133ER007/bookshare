import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Clock, Repeat, Check, X, MessageCircle } from "lucide-react";
import {
  getRentalRequests,
  getExchangeProposals,
  updateRentalRequest,
  updateExchangeProposal,
} from "@/services/supabaseService";

interface Transaction {
  id: string;
  type: "rental" | "exchange";
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  date: string;
  book: {
    id: string;
    title: string;
    coverImage: string;
  };
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  details: {
    startDate?: string;
    endDate?: string;
    price?: number;
    offeredBook?: {
      id: string;
      title: string;
      coverImage: string;
    };
  };
}

const TransactionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("incoming");
  const [incomingTransactions, setIncomingTransactions] = useState<
    Transaction[]
  >([]);
  const [outgoingTransactions, setOutgoingTransactions] = useState<
    Transaction[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetchTransactions();
  }, [user, navigate]);

  const fetchTransactions = async () => {
    setIsLoading(true);

    try {
      // Fetch rental requests
      const { data: incomingRentals, error: incomingRentalsError } =
        await getRentalRequests(user?.id || "", "incoming");

      const { data: outgoingRentals, error: outgoingRentalsError } =
        await getRentalRequests(user?.id || "", "outgoing");

      // Fetch exchange proposals
      const { data: incomingExchanges, error: incomingExchangesError } =
        await getExchangeProposals(user?.id || "", "incoming");

      const { data: outgoingExchanges, error: outgoingExchangesError } =
        await getExchangeProposals(user?.id || "", "outgoing");

      if (
        incomingRentalsError ||
        outgoingRentalsError ||
        incomingExchangesError ||
        outgoingExchangesError
      ) {
        throw new Error("Failed to fetch transactions");
      }

      // Transform rental requests to Transaction format
      const incomingRentalTransactions =
        incomingRentals?.map((rental: any) => ({
          id: rental.id,
          type: "rental" as const,
          status: rental.status,
          date: rental.created_at,
          book: {
            id: rental.book.id,
            title: rental.book.title,
            coverImage:
              rental.book.cover_image ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          },
          user: {
            id: rental.requester.id,
            name: rental.requester.name,
            avatar:
              rental.requester.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${rental.requester.id}`,
          },
          details: {
            startDate: rental.start_date,
            endDate: rental.end_date,
            price: rental.book.rental_price,
          },
        })) || [];

      const outgoingRentalTransactions =
        outgoingRentals?.map((rental: any) => ({
          id: rental.id,
          type: "rental" as const,
          status: rental.status,
          date: rental.created_at,
          book: {
            id: rental.book.id,
            title: rental.book.title,
            coverImage:
              rental.book.cover_image ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          },
          user: {
            id: rental.owner.id,
            name: rental.owner.name,
            avatar:
              rental.owner.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${rental.owner.id}`,
          },
          details: {
            startDate: rental.start_date,
            endDate: rental.end_date,
            price: rental.book.rental_price,
          },
        })) || [];

      // Transform exchange proposals to Transaction format
      const incomingExchangeTransactions =
        incomingExchanges?.map((exchange: any) => ({
          id: exchange.id,
          type: "exchange" as const,
          status: exchange.status,
          date: exchange.created_at,
          book: {
            id: exchange.book_requested.id,
            title: exchange.book_requested.title,
            coverImage:
              exchange.book_requested.cover_image ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          },
          user: {
            id: exchange.requester.id,
            name: exchange.requester.name,
            avatar:
              exchange.requester.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${exchange.requester.id}`,
          },
          details: {
            offeredBook: {
              id: exchange.book_offered.id,
              title: exchange.book_offered.title,
              coverImage:
                exchange.book_offered.cover_image ||
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
            },
          },
        })) || [];

      const outgoingExchangeTransactions =
        outgoingExchanges?.map((exchange: any) => ({
          id: exchange.id,
          type: "exchange" as const,
          status: exchange.status,
          date: exchange.created_at,
          book: {
            id: exchange.book_requested.id,
            title: exchange.book_requested.title,
            coverImage:
              exchange.book_requested.cover_image ||
              "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
          },
          user: {
            id: exchange.owner.id,
            name: exchange.owner.name,
            avatar:
              exchange.owner.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${exchange.owner.id}`,
          },
          details: {
            offeredBook: {
              id: exchange.book_offered.id,
              title: exchange.book_offered.title,
              coverImage:
                exchange.book_offered.cover_image ||
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
            },
          },
        })) || [];

      // Combine all transactions
      setIncomingTransactions([
        ...incomingRentalTransactions,
        ...incomingExchangeTransactions,
      ]);
      setOutgoingTransactions([
        ...outgoingRentalTransactions,
        ...outgoingExchangeTransactions,
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      // Fallback to placeholder data if there's an error
      setTimeout(() => {
        setIncomingTransactions([
          {
            id: "tr-1",
            type: "rental",
            status: "pending",
            date: "2023-06-15",
            book: {
              id: "book-1",
              title: "The Great Gatsby",
              coverImage:
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000",
            },
            user: {
              id: "user-2",
              name: "Jane Smith",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
            },
            details: {
              startDate: "2023-06-20",
              endDate: "2023-07-04",
              price: 10,
            },
          },
          {
            id: "tr-2",
            type: "exchange",
            status: "approved",
            date: "2023-06-10",
            book: {
              id: "book-2",
              title: "To Kill a Mockingbird",
              coverImage:
                "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000",
            },
            user: {
              id: "user-3",
              name: "Mike Johnson",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
            },
            details: {
              offeredBook: {
                id: "book-3",
                title: "1984",
                coverImage:
                  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000",
              },
            },
          },
        ]);

        setOutgoingTransactions([
          {
            id: "tr-3",
            type: "rental",
            status: "completed",
            date: "2023-05-20",
            book: {
              id: "book-4",
              title: "Pride and Prejudice",
              coverImage:
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000",
            },
            user: {
              id: "user-4",
              name: "Sarah Williams",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
            },
            details: {
              startDate: "2023-05-25",
              endDate: "2023-06-08",
              price: 8,
            },
          },
          {
            id: "tr-4",
            type: "exchange",
            status: "rejected",
            date: "2023-05-15",
            book: {
              id: "book-5",
              title: "The Hobbit",
              coverImage:
                "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=1000",
            },
            user: {
              id: "user-5",
              name: "Alex Brown",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
            },
            details: {
              offeredBook: {
                id: "book-6",
                title: "Harry Potter",
                coverImage:
                  "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=1000",
              },
            },
          },
        ]);
        setIsLoading(false);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    transactionId: string,
    action: string,
    type: "rental" | "exchange",
  ) => {
    try {
      let status = "";
      switch (action) {
        case "approve":
          status = "approved";
          break;
        case "reject":
          status = "rejected";
          break;
        case "cancel":
          status = "cancelled";
          break;
        case "complete":
          status = "completed";
          break;
        default:
          return;
      }

      if (type === "rental") {
        const { error } = await updateRentalRequest(transactionId, status);
        if (error) throw error;
      } else {
        const { error } = await updateExchangeProposal(transactionId, status);
        if (error) throw error;
      }

      // Refresh transactions after update
      fetchTransactions();
    } catch (error) {
      console.error(`Error updating transaction ${transactionId}:`, error);
      alert("Failed to update transaction. Please try again.");
    }
  };

  const renderTransactionCard = (transaction: Transaction) => {
    const isRental = transaction.type === "rental";
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
    };

    return (
      <Card key={transaction.id} className="mb-4">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0">
              <img
                src={transaction.book.coverImage}
                alt={transaction.book.title}
                className="w-20 h-28 object-cover rounded-md"
              />
            </div>

            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium text-lg">
                    {transaction.book.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <Badge className={statusColors[transaction.status]}>
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  {isRental ? (
                    <Clock size={16} className="text-blue-500" />
                  ) : (
                    <Repeat size={16} className="text-purple-500" />
                  )}
                  <span className="font-medium">
                    {isRental ? "Rental Request" : "Exchange Proposal"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <img
                  src={transaction.user.avatar}
                  alt={transaction.user.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm">
                  {activeTab === "incoming" ? "From" : "To"}{" "}
                  <span className="font-medium">{transaction.user.name}</span>
                </span>
              </div>

              <div className="bg-gray-50 p-3 rounded-md mb-4">
                {isRental ? (
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Period:</span>{" "}
                      {new Date(
                        transaction.details.startDate!,
                      ).toLocaleDateString()}{" "}
                      to{" "}
                      {new Date(
                        transaction.details.endDate!,
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Price:</span> $
                      {transaction.details.price}/week
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      In exchange for:
                    </span>
                    <div className="flex items-center gap-2">
                      <img
                        src={transaction.details.offeredBook!.coverImage}
                        alt={transaction.details.offeredBook!.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <span className="text-sm">
                        {transaction.details.offeredBook!.title}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {transaction.status === "pending" && activeTab === "incoming" && (
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      handleAction(transaction.id, "approve", transaction.type)
                    }
                  >
                    <Check size={16} />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      handleAction(transaction.id, "reject", transaction.type)
                    }
                  >
                    <X size={16} />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 ml-auto"
                    onClick={() =>
                      handleAction(transaction.id, "message", transaction.type)
                    }
                  >
                    <MessageCircle size={16} />
                    Message
                  </Button>
                </div>
              )}

              {transaction.status === "pending" && activeTab === "outgoing" && (
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      handleAction(transaction.id, "cancel", transaction.type)
                    }
                  >
                    <X size={16} />
                    Cancel Request
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 ml-auto"
                    onClick={() =>
                      handleAction(transaction.id, "message", transaction.type)
                    }
                  >
                    <MessageCircle size={16} />
                    Message
                  </Button>
                </div>
              )}

              {(transaction.status === "approved" ||
                transaction.status === "completed") && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      handleAction(transaction.id, "message", transaction.type)
                    }
                  >
                    <MessageCircle size={16} />
                    Message
                  </Button>
                  {transaction.status === "approved" && (
                    <Button
                      variant="success"
                      size="sm"
                      className="gap-1 ml-auto"
                      onClick={() =>
                        handleAction(
                          transaction.id,
                          "complete",
                          transaction.type,
                        )
                      }
                    >
                      <Check size={16} />
                      Mark as Completed
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        isAuthenticated={!!user}
        username={user?.user_metadata?.name || "User"}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="incoming" className="gap-2">
              <Clock size={16} />
              Incoming Requests
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="gap-2">
              <Repeat size={16} />
              Outgoing Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="mt-0">
            {isLoading ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : incomingTransactions.length > 0 ? (
              incomingTransactions.map(renderTransactionCard)
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Incoming Requests
                </h3>
                <p className="text-gray-500">
                  You don't have any incoming rental or exchange requests yet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="outgoing" className="mt-0">
            {isLoading ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : outgoingTransactions.length > 0 ? (
              outgoingTransactions.map(renderTransactionCard)
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <Repeat size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Outgoing Requests
                </h3>
                <p className="text-gray-500">
                  You haven't made any rental or exchange requests yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TransactionsPage;
