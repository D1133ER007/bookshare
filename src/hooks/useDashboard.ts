import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { transactionService } from "@/services/supabase";
import { format, subDays, startOfMonth, endOfMonth, subMonths, subYears, isWithinInterval } from "date-fns";

interface DashboardStats {
  booksBorrowed: number;
  returnRate: number;
  activeUsers: number;
  onTimeReturns: number;
  monthlyTransactions: {
    month: string;
    borrows: number;
    returns: number;
  }[];
  weeklyActivity: {
    name: string;
    value: number;
  }[];
  recentActivity: {
    time: string;
    title: string;
    description: string;
    type: "borrow" | "return" | "overdue";
  }[];
}

const initialStats: DashboardStats = {
  booksBorrowed: 0,
  returnRate: 0,
  activeUsers: 0,
  onTimeReturns: 0,
  monthlyTransactions: [],
  weeklyActivity: [],
  recentActivity: [],
};

export function useDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [error, setError] = useState<string | null>(null);

  const getTimeRangeInterval = (range: "week" | "month" | "year") => {
    const now = new Date();
    switch (range) {
      case "week":
        return { start: subDays(now, 7), end: now };
      case "month":
        return { start: subMonths(now, 1), end: now };
      case "year":
        return { start: subYears(now, 1), end: now };
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all transactions
      const transactions = await transactionService.getTransactions({
        borrower_id: user.id,
        lender_id: user.id,
      });

      if (!transactions || transactions.length === 0) {
        setStats(initialStats);
        return;
      }

      const interval = getTimeRangeInterval(timeRange);
      const filteredTransactions = transactions.filter(t => 
        isWithinInterval(new Date(t.created_at), interval)
      );

      // Calculate stats
      const totalTransactions = filteredTransactions.length;
      const completedTransactions = filteredTransactions.filter(
        (t) => t.status === "completed"
      ).length;
      const onTimeReturns = filteredTransactions.filter(
        (t) => t.status === "completed" && new Date(t.end_date) >= new Date(t.start_date)
      ).length;

      // Get unique users involved in transactions
      const uniqueUsers = new Set(
        filteredTransactions.flatMap((t) => [t.borrower.id, t.lender.id])
      );

      // Calculate monthly transactions
      const monthlyData = Array.from({ length: timeRange === "year" ? 12 : 6 }, (_, i) => {
        const month = subDays(new Date(), i * 30);
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        
        const monthTransactions = filteredTransactions.filter(
          (t) => {
            const date = new Date(t.created_at);
            return date >= monthStart && date <= monthEnd;
          }
        );

        return {
          month: format(month, "MMM"),
          borrows: monthTransactions.filter(t => t.status === "pending").length,
          returns: monthTransactions.filter(t => t.status === "completed").length,
        };
      }).reverse();

      // Calculate weekly activity
      const weeklyData = Array.from({ length: timeRange === "week" ? 7 : 30 }, (_, i) => {
        const day = subDays(new Date(), i);
        const dayTransactions = filteredTransactions.filter(
          (t) => format(new Date(t.created_at), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        );

        return {
          name: format(day, timeRange === "week" ? "EEE" : "MMM dd"),
          value: dayTransactions.length,
        };
      }).reverse();

      // Get recent activity
      const recentActivity = filteredTransactions
        .slice(0, 5)
        .map((t) => ({
          time: format(new Date(t.created_at), "h:mm a"),
          title: t.status === "completed" ? "Book Returned" : "Book Borrowed",
          description: `${t.borrower.name} ${t.status === "completed" ? "returned" : "borrowed"} "${t.book.title}"`,
          type: (t.status === "completed" 
            ? "return" 
            : new Date(t.end_date) < new Date() 
              ? "overdue" 
              : "borrow") as "borrow" | "return" | "overdue",
        }));

      setStats({
        booksBorrowed: totalTransactions,
        returnRate: Math.round((completedTransactions / totalTransactions) * 100) || 0,
        activeUsers: uniqueUsers.size,
        onTimeReturns: Math.round((onTimeReturns / completedTransactions) * 100) || 0,
        monthlyTransactions: monthlyData,
        weeklyActivity: weeklyData,
        recentActivity,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
      setStats(initialStats);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, timeRange]);

  return {
    isLoading,
    stats,
    error,
    timeRange,
    setTimeRange,
    refreshStats: fetchDashboardData,
  };
}