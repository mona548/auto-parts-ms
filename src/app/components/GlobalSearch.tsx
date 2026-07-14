import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Package,
  Users,
  FileText,
  X,
} from "lucide-react";
import { useParts } from "../context/PartsContext";

interface SearchResult {
  type: "part" | "customer" | "invoice";
  id: string;
  title: string;
  subtitle: string;
  path: string;
}

interface GlobalSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function GlobalSearch({ open: externalOpen, onOpenChange }: GlobalSearchProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();
  const { parts } = useParts();

  // Use external open state if provided, otherwise use internal
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Get customers and invoices from localStorage
  const getCustomers = () => {
    try {
      const data = window.localStorage.getItem("customers");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const getInvoices = () => {
    try {
      const data = window.localStorage.getItem("invoices");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  // Keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search function
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search Parts (قطع الغيار)
    parts.forEach((part) => {
      const matchesName = part.name.toLowerCase().includes(query);
      const matchesCode = part.partCode?.toLowerCase().includes(query);
      const matchesCategory = part.category.toLowerCase().includes(query);

      if (matchesName || matchesCode || matchesCategory) {
        searchResults.push({
          type: "part",
          id: part.id,
          title: part.name,
          subtitle: `${part.category} • ${part.status} • ${part.quantity} قطعة`,
          path: "/inventory",
        });
      }
    });

    // Search Customers (العملاء)
    const customers = getCustomers();
    customers.forEach((customer: any) => {
      const matchesName = customer.name?.toLowerCase().includes(query);
      const matchesPhone = customer.phone?.toLowerCase().includes(query);

      if (matchesName || matchesPhone) {
        searchResults.push({
          type: "customer",
          id: customer.id,
          title: customer.name,
          subtitle: `📞 ${customer.phone || "لا يوجد"}`,
          path: `/customers/${customer.id}`,
        });
      }
    });

    // Search Invoices (الفواتير)
    const invoices = getInvoices();
    invoices.forEach((invoice: any) => {
      const matchesInvoiceNumber = invoice.invoiceNumber?.toLowerCase().includes(query);
      const matchesCustomerName = invoice.customerName?.toLowerCase().includes(query);

      if (matchesInvoiceNumber || matchesCustomerName) {
        searchResults.push({
          type: "invoice",
          id: invoice.id,
          title: invoice.invoiceNumber || `فاتورة ${invoice.id}`,
          subtitle: `${invoice.customerName} • ${invoice.total || 0} ريال`,
          path: "/invoices",
        });
      }
    });

    setResults(searchResults.slice(0, 15)); // Limit to 15 results
  }, [searchQuery, parts]);

  const handleSelectResult = (result: SearchResult) => {
    setOpen(false);
    setSearchQuery("");
    navigate(result.path);

    // Store selected item in sessionStorage for highlighting
    if (result.type === "part") {
      sessionStorage.setItem("highlightPart", result.id);
    } else if (result.type === "invoice") {
      sessionStorage.setItem("highlightInvoice", result.id);
    }
  };

  const groupedResults = {
    parts: results.filter((r) => r.type === "part"),
    customers: results.filter((r) => r.type === "customer"),
    invoices: results.filter((r) => r.type === "invoice"),
  };

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "part":
        return <Package size={18} className="text-blue-600" />;
      case "customer":
        return <Users size={18} className="text-green-600" />;
      case "invoice":
        return <FileText size={18} className="text-purple-600" />;
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command Dialog */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" dir="rtl">
        <div
          className="relative bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden"
          style={{ boxShadow: "var(--shadow-xl)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Search className="text-gray-400 flex-shrink-0" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن قطع غيار، عملاء، أو فواتير..."
              className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 outline-none text-lg"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-300">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!searchQuery.trim() && (
              <div className="p-8 text-center text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  ابحث في جميع البيانات
                </p>
                <p className="text-sm">
                  اكتب للبحث في قطع الغيار، العملاء، والفواتير
                </p>
              </div>
            )}

            {searchQuery.trim() && results.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  لا توجد نتائج
                </p>
                <p className="text-sm">
                  جرب كلمات بحث مختلفة
                </p>
              </div>
            )}

            {/* Parts Section */}
            {groupedResults.parts.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                  <Package size={16} className="text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    قطع الغيار ({groupedResults.parts.length})
                  </span>
                </div>
                {groupedResults.parts.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-right"
                  >
                    {getIcon(result.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{result.title}</p>
                      <p className="text-sm text-gray-500">{result.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Customers Section */}
            {groupedResults.customers.length > 0 && (
              <div className="border-b border-gray-100">
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                  <Users size={16} className="text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    العملاء ({groupedResults.customers.length})
                  </span>
                </div>
                {groupedResults.customers.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-green-50 transition-colors text-right"
                  >
                    {getIcon(result.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{result.title}</p>
                      <p className="text-sm text-gray-500">{result.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Invoices Section */}
            {groupedResults.invoices.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                  <FileText size={16} className="text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    الفواتير ({groupedResults.invoices.length})
                  </span>
                </div>
                {groupedResults.invoices.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors text-right"
                  >
                    {getIcon(result.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{result.title}</p>
                      <p className="text-sm text-gray-500">{result.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer with keyboard hints */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↑↓</kbd>
                للتنقل
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">Enter</kbd>
                للاختيار
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">ESC</kbd>
              للإغلاق
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// Export the trigger button component
export function GlobalSearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-200"
    >
      <Search size={18} />
      <span className="hidden md:inline">ابحث...</span>
      <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-white text-gray-500 text-xs rounded border border-gray-300">
        Ctrl+K
      </kbd>
    </button>
  );
}
