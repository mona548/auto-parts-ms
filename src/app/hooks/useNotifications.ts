import { useState, useEffect, useMemo } from "react";
import { useParts } from "../context/PartsContext";

export interface Notification {
  id: string;
  type: "low-stock" | "overdue-invoice";
  title: string;
  message: string;
  icon: "Package" | "FileText";
  iconColor: string;
  link: string;
  timestamp: number;
  partId?: string;
  invoiceId?: string;
}

export function useNotifications() {
  const { parts } = useParts();
  const [readNotifications, setReadNotifications] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("readNotifications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Get invoices from localStorage
  const getInvoices = () => {
    try {
      const data = localStorage.getItem("invoices");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Calculate all notifications
  const notifications = useMemo(() => {
    const notifs: Notification[] = [];
    const now = Date.now();

    // Type 1: Low Stock Notifications
    parts.forEach((part) => {
      if (part.status === "منخفض" || part.status === "ينفذ") {
        const iconColor = part.status === "ينفذ" ? "text-red-600" : "text-orange-600";
        notifs.push({
          id: `low-stock-${part.id}`,
          type: "low-stock",
          title: "مخزون منخفض",
          message: `${part.name} - كمية منخفضة (${part.quantity} قطعة)`,
          icon: "Package",
          iconColor,
          link: "/inventory",
          timestamp: now,
          partId: part.id,
        });
      }
    });

    // Type 2: Overdue Invoice Notifications
    const invoices = getInvoices();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    invoices.forEach((invoice: any) => {
      if (invoice.status === "معلق" || invoice.status === "pending") {
        const invoiceDate = new Date(invoice.date).getTime();
        const daysOverdue = Math.floor((now - invoiceDate) / (24 * 60 * 60 * 1000));

        if (invoiceDate < thirtyDaysAgo) {
          notifs.push({
            id: `overdue-${invoice.id}`,
            type: "overdue-invoice",
            title: "فاتورة متأخرة",
            message: `فاتورة ${invoice.id} - متأخرة ${daysOverdue} يوم`,
            icon: "FileText",
            iconColor: "text-red-600",
            link: "/invoices",
            timestamp: now,
            invoiceId: invoice.id,
          });
        }
      }
    });

    return notifs;
  }, [parts]);

  // Filter out read notifications
  const unreadNotifications = useMemo(() => {
    return notifications.filter((n) => !readNotifications.includes(n.id));
  }, [notifications, readNotifications]);

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setReadNotifications((prev) => {
      const updated = [...prev, notificationId];
      localStorage.setItem("readNotifications", JSON.stringify(updated));
      return updated;
    });
  };

  // Mark all as read
  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifications(allIds);
    localStorage.setItem("readNotifications", JSON.stringify(allIds));
  };

  // Clear read notifications list (for cleanup)
  const clearReadList = () => {
    setReadNotifications([]);
    localStorage.removeItem("readNotifications");
  };

  return {
    notifications: unreadNotifications,
    allNotifications: notifications,
    unreadCount: unreadNotifications.length,
    markAsRead,
    markAllAsRead,
    clearReadList,
  };
}
