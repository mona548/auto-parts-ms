import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Printer, TrendingUp, Package, Users, DollarSign, FileText } from "lucide-react";
import { useParts } from "../context/PartsContext";
import { useSettings } from "../context/SettingsContext";

type TabType = "sales" | "inventory" | "customers" | "financial";
type SalesPeriod = "7days" | "30days" | "3months";

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabType>("sales");
  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod>("30days");
  const { parts } = useParts();
  const { settings } = useSettings();

  // Get invoices and customers from localStorage
  const getInvoices = () => {
    try {
      const data = window.localStorage.getItem("invoices");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const getCustomers = () => {
    try {
      const data = window.localStorage.getItem("customers");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const invoices = getInvoices();
  const customers = getCustomers();

  // Calculate sales data for chart
  const salesData = useMemo(() => {
    const days = salesPeriod === "7days" ? 7 : salesPeriod === "30days" ? 30 : 90;
    const data: { date: string; sales: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const daySales = invoices
        .filter((inv: any) => inv.date?.startsWith(dateStr))
        .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

      data.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        sales: daySales,
      });
    }

    return data;
  }, [invoices, salesPeriod]);

  // Calculate inventory data by category and status
  const inventoryData = useMemo(() => {
    const categoryData: { [key: string]: { available: number; low: number; critical: number } } = {};

    parts.forEach((part) => {
      if (!categoryData[part.category]) {
        categoryData[part.category] = { available: 0, low: 0, critical: 0 };
      }

      if (part.status === "متوفر") {
        categoryData[part.category].available += part.quantity;
      } else if (part.status === "منخفض") {
        categoryData[part.category].low += part.quantity;
      } else if (part.status === "ينفذ") {
        categoryData[part.category].critical += part.quantity;
      }
    });

    return Object.entries(categoryData).map(([category, data]) => ({
      category,
      متوفر: data.available,
      منخفض: data.low,
      ينفذ: data.critical,
    }));
  }, [parts]);

  // Get low stock parts
  const lowStockParts = useMemo(() => {
    return parts
      .filter((part) => part.status === "ينفذ" || part.status === "منخفض")
      .sort((a, b) => a.quantity - b.quantity);
  }, [parts]);

  // Calculate top customers
  const topCustomers = useMemo(() => {
    const customerStats: { [key: string]: any } = {};

    customers.forEach((customer: any) => {
      customerStats[customer.id] = {
        id: customer.id,
        name: customer.name,
        invoiceCount: 0,
        total: 0,
        paid: 0,
        remaining: 0,
      };
    });

    invoices.forEach((invoice: any) => {
      if (customerStats[invoice.customerId]) {
        customerStats[invoice.customerId].invoiceCount++;
        customerStats[invoice.customerId].total += invoice.total || 0;
        customerStats[invoice.customerId].paid += invoice.paid || 0;
        customerStats[invoice.customerId].remaining += invoice.remaining || 0;
      }
    });

    return Object.values(customerStats)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 10);
  }, [customers, invoices]);

  // Prepare pie chart data for top 5 customers
  const customerPieData = useMemo(() => {
    return topCustomers.slice(0, 5).map((customer: any) => ({
      name: customer.name,
      value: customer.total,
    }));
  }, [topCustomers]);

  // Calculate financial summary
  const financialSummary = useMemo(() => {
    const total = invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
    const paid = invoices.reduce((sum: number, inv: any) => sum + (inv.paid || 0), 0);
    const remaining = invoices.reduce((sum: number, inv: any) => sum + (inv.remaining || 0), 0);

    return {
      totalSales: total,
      totalPaid: paid,
      totalRemaining: remaining,
      invoiceCount: invoices.length,
    };
  }, [invoices]);

  // Get unpaid invoices
  const unpaidInvoices = useMemo(() => {
    return invoices
      .filter((inv: any) => (inv.remaining || 0) > 0)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [invoices]);

  const handlePrint = () => {
    window.print();
  };

  const COLORS = ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#A855F7"];

  const tabs = [
    { id: "sales", label: "تقرير المبيعات", icon: TrendingUp },
    { id: "inventory", label: "تقرير المخزون", icon: Package },
    { id: "customers", label: "تقرير العملاء", icon: Users },
    { id: "financial", label: "ملخص مالي", icon: DollarSign },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">التقارير والإحصائيات</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">تحليل شامل لأداء النظام</p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl mb-6 transition-colors" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Content */}
      <div className="print:p-4">
        {/* Sales Report */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            {/* Header with filters */}
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">تقرير المبيعات</h2>
                <div className="flex items-center gap-4">
                  <select
                    value={salesPeriod}
                    onChange={(e) => setSalesPeriod(e.target.value as SalesPeriod)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                  >
                    <option value="7days">آخر 7 أيام</option>
                    <option value="30days">آخر 30 يوم</option>
                    <option value="3months">آخر 3 أشهر</option>
                  </select>
                  <button
                    onClick={handlePrint}
                    className="print:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <Printer size={18} />
                    طباعة التقرير
                  </button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "var(--shadow-md)",
                    }}
                    formatter={(value: any) => [`${value} ${settings.currency}`, "المبيعات"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="المبيعات"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
                <p className="text-gray-600 text-sm mb-2">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-blue-600">
                  {salesData.reduce((sum, day) => sum + day.sales, 0).toFixed(2)} {settings.currency}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
                <p className="text-gray-600 text-sm mb-2">متوسط المبيعات اليومي</p>
                <p className="text-2xl font-bold text-green-600">
                  {(salesData.reduce((sum, day) => sum + day.sales, 0) / salesData.length).toFixed(2)}{" "}
                  {settings.currency}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
                <p className="text-gray-600 text-sm mb-2">أعلى يوم مبيعات</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.max(...salesData.map((d) => d.sales)).toFixed(2)} {settings.currency}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Report */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">تقرير المخزون حسب الفئة</h2>
                <button
                  onClick={handlePrint}
                  className="print:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Printer size={18} />
                  طباعة التقرير
                </button>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "0.875rem" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "var(--shadow-md)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="متوفر" fill="#22C55E" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="منخفض" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="ينفذ" fill="#EF4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Low Stock Table */}
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                القطع التي وصلت للحد الأدنى ({lowStockParts.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الكود</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الاسم</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الفئة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الكمية</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockParts.map((part) => (
                      <tr key={part.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{part.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{part.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{part.category}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{part.quantity}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              part.status === "ينفذ" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {part.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Report */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">أفضل 10 عملاء</h2>
                <button
                  onClick={handlePrint}
                  className="print:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Printer size={18} />
                  طباعة التقرير
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الترتيب</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">اسم العميل</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">عدد الفواتير</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">إجمالي المشتريات</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المدفوع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المتبقي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer: any, index: number) => (
                      <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{customer.invoiceCount}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                          {customer.total.toFixed(2)} {settings.currency}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-600">
                          {customer.paid.toFixed(2)} {settings.currency}
                        </td>
                        <td className="px-6 py-4 text-sm text-red-600">
                          {customer.remaining.toFixed(2)} {settings.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع المبيعات على أفضل 5 عملاء</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={customerPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {customerPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => `${value} ${settings.currency}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "var(--shadow-md)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        {activeTab === "financial" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-blue-600" size={24} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {financialSummary.totalSales.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{settings.currency}</p>
              </div>

              <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">إجمالي المحصّل</p>
                <p className="text-2xl font-bold text-green-600">
                  {financialSummary.totalPaid.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{settings.currency}</p>
              </div>

              <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-red-600" size={24} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">إجمالي المتبقي</p>
                <p className="text-2xl font-bold text-red-600">
                  {financialSummary.totalRemaining.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">{settings.currency}</p>
              </div>

              <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-purple-600" size={24} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">عدد الفواتير</p>
                <p className="text-2xl font-bold text-gray-900">{financialSummary.invoiceCount}</p>
                <p className="text-sm text-gray-500 mt-1">فاتورة</p>
              </div>
            </div>

            {/* Unpaid Invoices Table */}
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  الفواتير غير المسددة ({unpaidInvoices.length})
                </h2>
                <button
                  onClick={handlePrint}
                  className="print:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Printer size={18} />
                  طباعة التقرير
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">رقم الفاتورة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">اسم العميل</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">التاريخ</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإجمالي</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المدفوع</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">المتبقي</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidInvoices.map((invoice: any) => (
                      <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {invoice.invoiceNumber || invoice.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {(invoice.total || 0).toFixed(2)} {settings.currency}
                        </td>
                        <td className="px-6 py-4 text-sm text-green-600">
                          {(invoice.paid || 0).toFixed(2)} {settings.currency}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-red-600">
                          {(invoice.remaining || 0).toFixed(2)} {settings.currency}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              invoice.remaining > 0 && invoice.paid > 0
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {invoice.remaining > 0 && invoice.paid > 0 ? "جزئية" : "غير مدفوعة"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
