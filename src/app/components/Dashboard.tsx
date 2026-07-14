import { useState, useEffect } from "react";
import {
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Skeleton } from "./ui/skeleton";

function DashboardSkeleton() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-7 w-20 mb-2" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        ))}
      </div>

      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }
  const stats = [
    {
      title: "إجمالي القطع",
      value: "1,234",
      change: "+12%",
      icon: Package,
      color: "blue",
    },
    {
      title: "المبيعات اليوم",
      value: "45,000 ج.م",
      change: "+8%",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "الطلبات",
      value: "89",
      change: "+23%",
      icon: ShoppingCart,
      color: "purple",
    },
    {
      title: "قطع منخفضة",
      value: "12",
      change: "تحذير",
      icon: AlertCircle,
      color: "red",
    },
  ];

  const salesData = [
    { month: "يناير", sales: 45000 },
    { month: "فبراير", sales: 52000 },
    { month: "مارس", sales: 48000 },
    { month: "أبريل", sales: 61000 },
    { month: "مايو", sales: 55000 },
    { month: "يونيو", sales: 67000 },
  ];

  const topParts = [
    { name: "فلتر زيت تويوتا", sales: 156, revenue: "12,480 ج.م" },
    { name: "فرامل هيونداي", sales: 134, revenue: "26,800 ج.م" },
    { name: "بطارية 70 أمبير", sales: 98, revenue: "29,400 ج.م" },
    { name: "إطار ميشلان 185", sales: 87, revenue: "43,500 ج.م" },
    { name: "زيت موتور 5W30", sales: 76, revenue: "15,200 ج.م" },
  ];

  const recentOrders = [
    { id: "INV-001", customer: "أحمد محمد", amount: "2,500 ج.م", status: "مكتمل" },
    { id: "INV-002", customer: "فاطمة علي", amount: "1,200 ج.م", status: "قيد التجهيز" },
    { id: "INV-003", customer: "محمود حسن", amount: "5,400 ج.م", status: "مكتمل" },
    { id: "INV-004", customer: "نور الدين", amount: "890 ج.م", status: "قيد التجهيز" },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">لوحة التحكم</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">مرحباً بك في نظام إدارة قطع الغيار</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "bg-blue-500",
            green: "bg-green-500",
            purple: "bg-purple-500",
            red: "bg-red-500",
          };
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium mb-2">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <p
                    className={`text-sm font-medium ${
                      stat.color === "red" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`${
                    colorClasses[stat.color as keyof typeof colorClasses]
                  } p-3 rounded-xl`}
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            المبيعات الشهرية
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '0.875rem' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '0.875rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            اتجاه المبيعات
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '0.875rem' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '0.875rem' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Parts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            أكثر القطع مبيعاً
          </h2>
          <div className="space-y-2">
            {topParts.map((part, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:translate-x-[-2px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm" style={{ boxShadow: 'var(--shadow-sm)' }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{part.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{part.sales} قطعة</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-green-600">{part.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            آخر الطلبات
          </h2>
          <div className="space-y-2">
            {recentOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div>
                  <p className="font-medium text-gray-900">{order.customer}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{order.id}</p>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 mb-1">{order.amount}</p>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      order.status === "مكتمل"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
