import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Plus,
  FileText,
  Users,
  Settings,
  FilePlus,
  ReceiptText,
  BarChart2,
  Moon,
  Sun,
  Bell,
  X,
  Clock,
  Wrench,
  Sparkles,
} from "lucide-react";
import GlobalSearch, { GlobalSearchTrigger } from "./GlobalSearch";
import { useTheme } from "../hooks/useTheme";
import { useNotifications } from "../hooks/useNotifications";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function NotificationPopover() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setOpen(false);
    navigate(notification.link);
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "الآن";
    if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
    if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
    return `منذ ${Math.floor(seconds / 86400)} يوم`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="التنبيهات"
        >
          <Bell size={20} className="text-gray-700 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-gray-100">التنبيهات</h3>
          {notifications.length > 0 && (
            <button
              onClick={() => {
                markAllAsRead();
              }}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              تحديد الكل كمقروء
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">لا توجد تنبيهات جديدة</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => {
                const IconComponent = notification.icon === "Package" ? Package : FileText;
                return (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={`flex-shrink-0 ${notification.iconColor}`}>
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                          <Clock size={12} />
                          {getTimeAgo(notification.timestamp)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <X size={14} className="text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Layout() {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { path: "/",               icon: LayoutDashboard, label: "لوحة التحكم" },
    { path: "/inventory",      icon: Package,         label: "المخزون" },
    { path: "/add-part",       icon: Plus,            label: "إضافة قطعة" },
    { path: "/invoices",       icon: FileText,        label: "الفواتير" },
    { path: "/customers",      icon: Users,           label: "العملاء" },
    { path: "/create-invoice", icon: FilePlus,        label: "عمل فاتورة لعميل" },
    { path: "/settlement",     icon: ReceiptText,     label: "تسديد الفواتير" },
    { path: "/reports",        icon: BarChart2,       label: "التقارير" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors" dir="rtl">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-gray-800 flex flex-col border-l border-gray-200 dark:border-gray-700 transition-colors" style={{ boxShadow: 'var(--shadow-lg)' }}>
        {/* Header with Logo */}
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Wrench size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Sparkles size={10} className="text-white" strokeWidth={3} />
              </div>
            </div>

            {/* App Title */}
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400" style={{ fontFamily: 'Cairo, sans-serif' }}>
                نظام قطع الغيار
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">إدارة متكاملة واحترافية</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 ease-in-out
                  group relative overflow-hidden
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:translate-x-[-2px]"
                  }
                `}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 animate-pulse" />
                )}
                <Icon
                  size={20}
                  className={`flex-shrink-0 relative z-10 ${active ? '' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className="relative z-10 font-medium" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/settings"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-200 group
              ${
                isActive("/settings")
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/30 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }
            `}
          >
            <Settings
              size={20}
              className={`flex-shrink-0 ${isActive("/settings") ? '' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}
              strokeWidth={isActive("/settings") ? 2.5 : 2}
            />
            <span className="font-medium" style={{ fontFamily: 'Cairo, sans-serif' }}>الإعدادات</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header with Search */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 transition-colors" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-2xl">
              <GlobalSearchTrigger onClick={() => setSearchOpen(true)} />
            </div>
            <div className="flex items-center gap-2">
              <NotificationPopover />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={theme === "light" ? "التبديل إلى الوضع الليلي" : "التبديل إلى الوضع النهاري"}
              >
                {theme === "light" ? (
                  <Moon size={20} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <Sun size={20} className="text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>

        {/* Global Search Modal */}
        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </div>
  );
}