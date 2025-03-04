import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  BarChart3,
  BookOpen,
  RefreshCw,
  Clock,
  Download,
  Filter,
} from "lucide-react";

// Mock data for charts
const monthlyData = [
  { name: "Jan", value1: 65, value2: 35 },
  { name: "Feb", value1: 45, value2: 55 },
  { name: "Mar", value1: 35, value2: 40 },
  { name: "Apr", value1: 50, value2: 65 },
  { name: "May", value1: 40, value2: 45 },
  { name: "Jun", value1: 50, value2: 55 },
];

const weeklyData = [
  { day: "Mon", value: 35 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 30 },
  { day: "Thu", value: 50 },
  { day: "Fri", value: 40 },
  { day: "Sat", value: 35 },
  { day: "Sun", value: 25 },
];

const scheduleData = [
  { id: 1, title: "Schedule 1", percentage: 88, color: "#4F86F7" },
  { id: 2, title: "Schedule 2", percentage: 65, color: "#FF8042" },
  { id: 3, title: "Schedule 3", percentage: 75, color: "#00C49F" },
  { id: 4, title: "Schedule 4", percentage: 92, color: "#FFBB28" },
];

const barChartData = [
  { month: "Jan", value: 800 },
  { month: "Feb", value: 600 },
  { month: "Mar", value: 900 },
  { month: "Apr", value: 700 },
  { month: "May", value: 850 },
  { month: "Jun", value: 750 },
  { month: "Jul", value: 950 },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSchedule, setSelectedSchedule] = useState(scheduleData[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleScheduleSelect = (schedule: any) => {
    setSelectedSchedule(schedule);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleExport = () => {
    alert("Exporting data...");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar
          isAuthenticated={!!user}
          username={user?.user_metadata?.name || "User"}
        />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        isAuthenticated={!!user}
        username={user?.user_metadata?.name || "User"}
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.user_metadata?.name || "User"}!
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download size={16} />
              Export
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filter
            </Button>
            <Button className="gap-2">
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Schedule 1 */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleScheduleSelect(scheduleData[0])}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Schedule 1
                  </p>
                  <div className="text-2xl font-bold">
                    {scheduleData[0].percentage}%
                  </div>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="2"
                    ></circle>
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={scheduleData[0].color}
                      strokeWidth="2"
                      strokeDasharray={`${scheduleData[0].percentage} 100`}
                      strokeLinecap="round"
                      transform="rotate(-90 18 18)"
                    ></circle>
                  </svg>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs">Designation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
                  <span className="text-xs">Designation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule 2 */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleScheduleSelect(scheduleData[1])}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Schedule 2
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    Month
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 px-2 bg-blue-600"
                  >
                    Year
                  </Button>
                </div>
              </div>
              <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData.slice(0, 4)}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="value1"
                      stroke="#4F86F7"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  +34.6%
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  -14.5%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Schedule 3 */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleScheduleSelect(scheduleData[2])}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Schedule 3
                  </p>
                  <div className="text-sm">All Tracked</div>
                  <div className="text-xl font-bold">88.00</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    Month
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 px-2 bg-blue-600"
                  >
                    Year
                  </Button>
                </div>
              </div>
              <div className="h-[40px] flex mb-4">
                <div className="h-full w-1/4 bg-blue-500"></div>
                <div className="h-full w-1/4 bg-blue-300"></div>
                <div className="h-full w-1/4 bg-orange-300"></div>
                <div className="h-full w-1/4 bg-orange-400"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                  <span>01</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border border-blue-500 mr-2 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span>02</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                  <span>03</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule 4 */}
          <Card
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleScheduleSelect(scheduleData[3])}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Schedule 4
                  </p>
                  <div className="text-sm text-muted-foreground">Profit</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    Month
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 px-2 bg-blue-600"
                  >
                    Year
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">44</div>
                  <div className="text-xs text-muted-foreground">OPERATING</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">740</div>
                  <div className="text-xs text-muted-foreground">PREVIOUS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">9 101.50</div>
                  <div className="text-xs text-muted-foreground">PROFIT</div>
                </div>
              </div>
              <div className="relative h-[80px]">
                <div className="absolute inset-0">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <path
                      d="M 0,50 C 40,30 60,70 100,50 C 140,30 160,70 200,50"
                      fill="none"
                      stroke="#E6E6E6"
                      strokeWidth="40"
                    />
                    <path
                      d="M 0,50 C 40,30 60,70 100,50"
                      fill="none"
                      stroke="#4F86F7"
                      strokeWidth="40"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 text-xs">
                  Begin
                  <br />
                  0%
                </div>
                <div className="absolute bottom-0 right-0 text-xs text-right">
                  Pro
                  <br />
                  100%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* General Stats */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">
                General stats
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Mon
                </Button>
                <Button size="sm" variant="outline">
                  Tue
                </Button>
                <Button size="sm" variant="default">
                  Wed
                </Button>
                <Button size="sm" variant="outline">
                  Thu
                </Button>
                <Button size="sm" variant="outline">
                  Fri
                </Button>
                <Button size="sm" variant="outline">
                  Sat
                </Button>
                <Button size="sm" variant="outline">
                  Sun
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value1"
                      stroke="#4F86F7"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value2"
                      stroke="#FF8042"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">The first number</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-sm">The second number</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">
                Main schedule
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 px-2">
                  Month
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="h-8 px-2 bg-blue-600"
                >
                  Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData.slice(0, 5)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="value" fill="#4F86F7" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">The first number</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <span className="text-sm">The second number</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Calendar */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="bg-blue-50 w-full p-4 rounded-lg mb-4">
                  <div className="text-center text-2xl font-bold">MAY</div>
                  <div className="text-center text-5xl font-bold">17</div>
                </div>
                <div className="w-full space-y-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <div className="text-xs font-medium">Stand up</div>
                    <div className="text-xs text-gray-500">10:00-12:00 AM</div>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <div className="text-xs font-medium">Happy Hour</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Account</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 px-2">
                  Month
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="h-8 px-2 bg-blue-600"
                >
                  Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Day</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="w-full max-w-[200px]">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Week</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="w-full max-w-[200px]">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Month</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="w-full max-w-[200px]">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Chart 1 */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Account</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 px-2">
                  Month
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="h-8 px-2 bg-blue-600"
                >
                  Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData.slice(0, 6)}
                    layout="vertical"
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="month" type="category" hide />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#4F86F7"
                      radius={[0, 10, 10, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Category: <span className="text-blue-500">no</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Chart 2 */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Account</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 px-2">
                  Month
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="h-8 px-2 bg-blue-600"
                >
                  Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[100px] mb-4">
                <div className="w-full h-[30px] bg-gray-100 relative">
                  <div className="absolute inset-0 flex">
                    {[
                      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130,
                    ].map((value, index) => (
                      <div
                        key={index}
                        className="flex-1 border-r border-gray-300 flex items-center justify-center"
                      >
                        <div className="text-[8px] text-gray-500">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="absolute top-0 h-full bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      left: "50%",
                      width: "30px",
                      transform: "translateX(-50%)",
                    }}
                  >
                    90
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 text-center text-xs text-gray-500 mt-4">
                  <div>January</div>
                  <div>February</div>
                  <div>March</div>
                  <div>April</div>
                  <div>May</div>
                  <div>June</div>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Category: <span className="text-blue-500">no</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Weekly Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">Account</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 px-2">
                  Month
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="h-8 px-2 bg-blue-600"
                >
                  Year
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 1000]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="value" fill="#4F86F7">
                      {weeklyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "#4F86F7" : "#E6E6E6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
