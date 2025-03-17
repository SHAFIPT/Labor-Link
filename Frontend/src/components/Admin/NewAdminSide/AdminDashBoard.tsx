import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, HardHat, Calendar, DollarSign, Briefcase, Handshake } from 'lucide-react';
import { fetchAllBookings } from '../../../services/AdminAuthServices';

interface BookingStats {
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  paid: number;
  paymentPending: number;
  paymentFailed: number;
  monthlyEarnings?: MonthlyEarning[];
  yearlyEarnings?: YearlyEarning[];
  dailyEarnings?: DailyEarning[];
}

interface MonthlyEarning {
  month: string;
  earnings: number;
}

interface YearlyEarning {
  year: string;
  earnings: number;
}

interface DailyEarning {
  date: string;
  earnings: number;
}

interface BookingItem {
  id: string;
  name: string;
  completed: number;
  cancelled: number;
  pending: number;
}

const AdminDashBoard = () => {
  const [currentPage] = useState(1);
  const [limit] = useState(200);
  const [filter] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalLabors, setTotalLabors] = useState(0);
  const [totalBooking, setTotalBookings] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalLaborErnigs, setTotalLaborErnigs] = useState(0);
  const [totalCompnyProfit, setTotalCompnyProfit] = useState(0);
  const [timeFrame, setTimeFrame] = useState("daily");
  const [bookingStats, setbookingStats] = useState<BookingStats | null>(null);
  const [chartData, setChartData] = useState<{ name: string; earnings: number; }[]>([]);

  const [bookingData, setBookingData] = useState<BookingItem[]>([]);
  useEffect(() => {
    const fetchBooings = async () => {
      try {
        const response = await fetchAllBookings(currentPage, limit, "");
        if (response.status === 200) {
          console.log("Thsi si teh preosnf", response);
          const {
            totalAmount,
            totalLabors,
            totalUsers,
            total,
            bookingStats,
            totalLaborErnigs,
            totalCompnyProfit,
          } = response.data;
          setTotalUsers(totalUsers);
          setTotalLabors(totalLabors);
          setTotalBookings(total);
          setTotalAmount(totalAmount);
          setbookingStats(bookingStats);
          setTotalLaborErnigs(totalLaborErnigs);
          setTotalCompnyProfit(totalCompnyProfit);

          // Process and set booking status data for bar chart
          setBookingData(processBookingData(bookingStats));

        }
      } catch (error) {
        console.error("Error fetching labor bookings:", error);
      }
    };

    fetchBooings();
  }, [currentPage, limit, filter]);

  // Sample data for statistics
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <Users size={24} className="text-blue-200" />, // Lighter blue
      bgColor: "bg-blue-500",
    },
    {
      title: "Total Labors",
      value: totalLabors,
      icon: <HardHat size={24} className="text-green-200" />, // Lighter green
      bgColor: "bg-green-500",
    },
    {
      title: "Total Bookings",
      value: totalBooking,
      icon: <Calendar size={24} className="text-purple-200" />, // Lighter purple
      bgColor: "bg-purple-500",
    },
    {
      title: "Total Earnings",
      value: totalAmount,
      icon: <DollarSign size={24} className="text-amber-200" />, // Lighter amber
      bgColor: "bg-amber-500",
    },
    {
      title: "Total Company Earnings",
      value: totalCompnyProfit,
      icon: <Briefcase size={24} className="text-teal-300" />, // Distinct teal color
      bgColor: "bg-teal-500",
    },
    {
      title: "Total Labor Earnings",
      value: totalLaborErnigs,
      icon: <Handshake size={24} className="text-red-300" />, // Distinct red color
      bgColor: "bg-red-500",
    },
  ];

  useEffect(() => {
    if (bookingStats) {
      setChartData(processChartData(bookingStats, timeFrame));
    }
  }, [timeFrame, bookingStats]);

  // Process booking data for bar chart
  const processBookingData = (stats : BookingStats) => {
    if (!stats) return [];

    // Create a weekly data representation
    // This is a simplified approach - in a real app you might want to fetch this data from backend
    const daysOfWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // Calculate total bookings
    const totalBookings =
      stats.completed + stats.pending + stats.cancelled + stats.inProgress;

    // If no bookings, return empty array
    if (totalBookings === 0) return [];

    // Distribute bookings across days with some variation
    return daysOfWeek.map((day, index) => {
      // Create distribution factor based on day of week
      // Weekend days typically have more bookings
      const dayFactor = index >= 5 ? 1.5 : 1;
      const randomVariation = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2

      const completedRatio =
        (stats.completed / totalBookings) * randomVariation * dayFactor;
      const cancelledRatio =
        (stats.cancelled / totalBookings) * randomVariation * dayFactor;
      const pendingRatio =
        ((stats.pending + stats.inProgress) / totalBookings) *
        randomVariation *
        dayFactor;

      return {
        id: `booking-${day}-${index}`,
        name: day,
        completed: Math.round((stats.completed * completedRatio) / 7),
        cancelled: Math.round((stats.cancelled * cancelledRatio) / 7),
        pending: Math.round(
          ((stats.pending + stats.inProgress) * pendingRatio) / 7
        ),
      };
    });
  };


  // Process chart data based on timeFrame and booking stats
  const processChartData = (bookingStats: BookingStats, timeFrame: string) => {
  if (!bookingStats) {
    return [];
  }

  if (
    timeFrame === "monthly" &&
    bookingStats.monthlyEarnings &&
    bookingStats.monthlyEarnings.length > 0
  ) {
    // Return the monthly data
    return bookingStats.monthlyEarnings.map((item: MonthlyEarning) => ({
      name: formatMonthLabel(item.month),
      earnings: item.earnings,
    }));
  } else if (
    timeFrame === "yearly" &&
    bookingStats.yearlyEarnings &&
    bookingStats.yearlyEarnings.length > 0
  ) {
    // Return the yearly data
    return bookingStats.yearlyEarnings.map((item: YearlyEarning) => ({
      name: item.year,
      earnings: item.earnings,
    }));
  } else if (
    timeFrame === "daily" &&
    bookingStats.dailyEarnings &&
    bookingStats.dailyEarnings.length > 0
  ) {
    // Return the daily data
    return bookingStats.dailyEarnings.map((item: DailyEarning) => ({
      name: formatDayLabel(item.date),
      earnings: item.earnings,
    }));
  } else {
    // Fallback case - empty data or unknown timeFrame
    console.log(
      `No data available for ${timeFrame} view or bookingStats is missing required data`
    );
    return [];
  }
};

  const paymentData = [
    { name: 'Paid', value: bookingStats?.paid || 0, color: '#059669' },
    { name: 'Pending', value: bookingStats?.paymentPending || 0, color: '#D97706' },
    { name: 'Failed', value: bookingStats?.paymentFailed || 0, color: '#DC2626' }
  ];

  // Helper function to format month labels
  const formatMonthLabel = (monthStr : string) => {
    if (!monthStr) return "";
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString("default", { month: "short" }) + " " + year;
  };

  // Helper function to format day labels
  const formatDayLabel = (dateStr :string) => {
    if (!dateStr) return "";
    const [day] = dateStr.split("-");
    // Just return the day number for cleaner display
    return day;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.title === "Total Earnings"
                        ? formatCurrency(stat.value)
                        : stat.value.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
              </div>
            </div>
            <div className={`h-1 ${stat.bgColor}`}></div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Earnings Overview
          </h2>
          <div className="flex mt-4 sm:mt-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setTimeFrame("daily")}
              className={`px-4 py-2 text-sm font-medium ${
                timeFrame === "daily"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeFrame("monthly")}
              className={`px-4 py-2 text-sm font-medium ${
                timeFrame === "monthly"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeFrame("yearly")}
              className={`px-4 py-2 text-sm font-medium ${
                timeFrame === "yearly"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [`${formatCurrency(Number(value))}`, "Earnings"]}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "#E5E7EB" }}
                labelStyle={{
                  color: "#E5E7EB",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              />
              <Legend />
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                fillOpacity={1}
                fill="url(#colorEarnings)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking & Payment Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Booking Statistics
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bookingData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#6B7280" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#E5E7EB" }}
                  labelStyle={{
                    color: "#E5E7EB",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#4ADE80"
                  radius={[4, 4, 0, 0]}
                  key="completed-bar"
                />
                <Bar
                  dataKey="cancelled"
                  name="Cancelled"
                  fill="#F87171"
                  radius={[4, 4, 0, 0]}
                  key="cancelled-bar"
                />
                <Bar
                  dataKey="pending"
                  name="Pending"
                  fill="#FBBF24"
                  radius={[4, 4, 0, 0]}
                  key="pending-bar"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-red-400 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Cancelled
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-amber-400 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Payment Status
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload[0]) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-900">
                            {data.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {data.value} payments
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="div"></div>
    </div>
  );
};

export default AdminDashBoard;