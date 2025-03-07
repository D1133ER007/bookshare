import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw, Calendar as CalendarIcon, BookOpen, Users, Clock, CheckCircle } from "lucide-react";
import { CircularProgress, LineChart, BarChart, DailyActivity } from "@/components/dashboard";
import { Calendar } from "@/components/ui/calendar";
import { useDashboard } from "@/hooks/useDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { isLoading, stats, error, timeRange, setTimeRange, refreshStats } = useDashboard();

  const handleExport = () => {
    const data = {
      stats,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-stats-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    refreshStats();
  };

  const StatCard = ({ title, value, icon, loading, suffix = "" }: { title: string; value: number; icon: React.ReactNode; loading: boolean; suffix?: string }) => (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p className="text-3xl font-bold">{value}{suffix}</p>
      )}
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your library overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={(value: "week" | "month" | "year") => setTimeRange(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
          <Button className="gap-2" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={16} className={cn("transition-all", isLoading && "animate-spin")} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Books Borrowed"
          value={stats.booksBorrowed}
          icon={<BookOpen size={20} />}
          loading={isLoading}
        />
        <StatCard
          title="Return Rate"
          value={stats.returnRate}
          icon={<Clock size={20} />}
          loading={isLoading}
          suffix="%"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<Users size={20} />}
          loading={isLoading}
        />
        <StatCard
          title="On-time Returns"
          value={stats.onTimeReturns}
          icon={<CalendarIcon size={20} />}
          loading={isLoading}
          suffix="%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Monthly Transactions</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Borrows</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>Returns</span>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : stats.monthlyTransactions.length > 0 ? (
            <BarChart data={stats.monthlyTransactions} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No transaction data available
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Weekly Activity</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Transactions</span>
            </div>
          </div>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : stats.weeklyActivity.length > 0 ? (
            <LineChart data={stats.weeklyActivity} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No activity data available
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : stats.recentActivity.length > 0 ? (
            <div className="space-y-6">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    activity.type === "borrow" && "bg-blue-100 text-blue-600",
                    activity.type === "return" && "bg-green-100 text-green-600",
                    activity.type === "overdue" && "bg-red-100 text-red-600"
                  )}>
                    {activity.type === "borrow" && <BookOpen size={16} />}
                    {activity.type === "return" && <CheckCircle size={16} />}
                    {activity.type === "overdue" && <Clock size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No recent activity
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Calendar</h3>
            <Button variant="outline" size="sm">
              View Schedule
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
