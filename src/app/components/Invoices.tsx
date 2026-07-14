import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Printer,
  Download,
  X,
  Package,
  FileX,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import PrintInvoice from "./PrintInvoice";

function InvoicesSkeleton() {
  return (
    <div
      className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen"
      dir="rtl"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-24 w-full rounded-xl"
          />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface InvoiceItem {
  name: string;
  qty: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  customer: string;
  phone: string;
  date: string;
  items: InvoiceItem[];
  status: "مدفوع" | "معلق" | "ملغي";
}

const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    customer: "أحمد محمد علي",
    phone: "0501234567",
    date: "2026-04-01",
    items: [
      { name: "فلتر زيت", qty: 2, unitPrice: 150 },
      { name: "شمعات إشعال", qty: 4, unitPrice: 80 },
      { name: "حزام توقيت", qty: 1, unitPrice: 900 },
    ],
    status: "مدفوع",
  },
  {
    id: "INV-002",
    customer: "فاطمة علي حسن",
    phone: "0559876543",
    date: "2026-03-31",
    items: [
      { name: "فلتر هواء", qty: 1, unitPrice: 120 },
      { name: "زيت محرك", qty: 4, unitPrice: 270 },
    ],
    status: "معلق",
  },
  {
    id: "INV-003",
    customer: "محمود حسن",
    phone: "0512223344",
    date: "2026-03-30",
    items: [
      { name: "تيل أمامي", qty: 2, unitPrice: 550 },
      { name: "قرص فرامل", qty: 2, unitPrice: 800 },
      { name: "أستر فرامل", qty: 1, unitPrice: 300 },
    ],
    status: "مدفوع",
  },
  {
    id: "INV-004",
    customer: "نور الدين أحمد",
    phone: "0566778899",
    date: "2026-03-29",
    items: [
      { name: "مصباح أمامي", qty: 1, unitPrice: 450 },
      { name: "مصهر كهربائي", qty: 5, unitPrice: 88 },
    ],
    status: "معلق",
  },
  {
    id: "INV-005",
    customer: "سارة محمد",
    phone: "0544332211",
    date: "2026-03-28",
    items: [
      { name: "بطارية", qty: 1, unitPrice: 1200 },
      { name: "دينمو", qty: 1, unitPrice: 2000 },
    ],
    status: "مدفوع",
  },
  {
    id: "INV-006",
    customer: "خالد عبدالله",
    phone: "05334*******",
    date: "2026-03-27",
    items: [{ name: "ضغاط تكييف", qty: 1, unitPrice: 1800 }],
    status: "ملغي",
  },
  {
    id: "INV-007",
    customer: "منى إبراهيم",
    phone: "0577*******",
    date: "2026-03-26",
    items: [
      { name: "جير كامل", qty: 1, unitPrice: 3500 },
      { name: "زيت جير", qty: 2, unitPrice: 300 },
    ],
    status: "مدفوع",
  },
  {
    id: "INV-008",
    customer: "يوسف صالح",
    phone: "051122*****",
    date: "2026-03-25",
    items: [
      { name: "فلتر وقود", qty: 1, unitPrice: 95 },
      { name: "مضخة وقود", qty: 1, unitPrice: 855 },
    ],
    status: "معلق",
  },
];

function calcTotal(items: InvoiceItem[]) {
  return items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
}

// ─── View Modal ───────────────────────────────────────────────────────────────
function InvoiceViewModal({
  invoice,
  onClose,
  onPrint,
}: {
  invoice: Invoice;
  onClose: () => void;
  onPrint: () => void;
}) {
  const total = calcTotal(invoice.items);
  const statusColor =
    invoice.status === "مدفوع"
      ? "bg-green-100 text-green-700"
      : invoice.status === "معلق"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              فاتورة رقم: {invoice.id}
            </h2>
            <p className="text-blue-200 text-sm mt-0.5">
              تاريخ: {invoice.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">
                اسم العميل
              </p>
              <p className="font-bold text-gray-800">
                {invoice.customer}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">
                رقم الهاتف
              </p>
              <p className="font-bold text-gray-800">
                {invoice.phone}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">
                حالة الفاتورة
              </p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
              >
                {invoice.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">
                عدد الأصناف
              </p>
              <p className="font-bold text-gray-800">
                {invoice.items.length} صنف
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-5">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600">
                <th className="px-4 py-2.5 text-right rounded-r-lg">
                  الصنف
                </th>
                <th className="px-4 py-2.5 text-center">
                  الكمية
                </th>
                <th className="px-4 py-2.5 text-center">
                  سعر القطعة
                </th>
                <th className="px-4 py-2.5 text-left rounded-l-lg">
                  الإجمالي
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.items.map((item, idx) => (
                <tr
                  key={idx}
                  className="text-sm hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                        <Package
                          size={13}
                          className="text-blue-500"
                        />
                      </div>
                      {item.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 font-medium">
                    {item.qty}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-gray-800 font-medium">
                      {item.unitPrice.toLocaleString()} ج.م
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left font-bold text-gray-900">
                    {(
                      item.qty * item.unitPrice
                    ).toLocaleString()}{" "}
                    ج.م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-between items-center bg-blue-50 rounded-xl px-6 py-4">
            <span className="font-bold text-gray-700">
              الإجمالي الكلي
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {total.toLocaleString()} ج.م
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onPrint}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Printer size={16} /> طباعة
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Invoice Modal ────────────────────────────────────────────────────────
function NewInvoiceModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (inv: Invoice) => void;
}) {
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] =
    useState<Invoice["status"]>("معلق");
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: "", qty: 1, unitPrice: 0 },
  ]);

  const addItem = () =>
    setItems([...items, { name: "", qty: 1, unitPrice: 0 }]);
  const removeItem = (i: number) =>
    setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (
    i: number,
    field: keyof InvoiceItem,
    val: string,
  ) => {
    const updated = [...items];
    (updated[i] as any)[field] =
      field === "name" ? val : parseFloat(val) || 0;
    setItems(updated);
  };

  const handleSave = () => {
    if (!customer.trim()) {
      alert("أدخل اسم العميل");
      return;
    }
    if (items.some((it) => !it.name.trim())) {
      alert("أدخل اسم كل الأصناف");
      return;
    }
    const newId = `INV-${String(Date.now()).slice(-4)}`;
    onSave({
      id: newId,
      customer,
      phone,
      date: new Date().toISOString().slice(0, 10),
      items,
      status,
    });
    onClose();
  };

  const total = calcTotal(items);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">فاتورة جديدة</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 flex flex-col gap-4">
          {/* Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                اسم العميل *
              </label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="أدخل اسم العميل"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                رقم الهاتف
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              حالة الفاتورة
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as Invoice["status"])
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            >
              <option value="معلق">معلق</option>
              <option value="مدفوع">مدفوع</option>
              <option value="ملغي">ملغي</option>
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-700">
                الأصناف
              </p>
              <button
                onClick={addItem}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> إضافة صنف
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(idx, "name", e.target.value)
                    }
                    placeholder="اسم الصنف"
                    className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(idx, "qty", e.target.value)
                    }
                    placeholder="الكمية"
                    min="1"
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-center"
                  />
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(
                        idx,
                        "unitPrice",
                        e.target.value,
                      )
                    }
                    placeholder="السعر"
                    min="0"
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <div className="col-span-1 text-center text-xs text-gray-500">
                    {(
                      item.qty * item.unitPrice
                    ).toLocaleString()}
                  </div>
                  <button
                    onClick={() => removeItem(idx)}
                    className="col-span-1 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={items.length === 1}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center bg-blue-50 rounded-xl px-5 py-3 mt-1">
            <span className="font-bold text-gray-700">
              الإجمالي
            </span>
            <span className="text-xl font-bold text-blue-600">
              {total.toLocaleString()} ج.م
            </span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            حفظ الفاتورة
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const stored = localStorage.getItem("invoices");
      if (stored) return JSON.parse(stored) as Invoice[];
    } catch {
      /* fall through */
    }
    localStorage.setItem(
      "invoices",
      JSON.stringify(initialInvoices),
    );
    return initialInvoices;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [viewInvoice, setViewInvoice] =
    useState<Invoice | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [printInvoice, setPrintInvoice] =
    useState<Invoice | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = (invoice: Invoice) => {
    setPrintInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      inv.customer
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "الكل" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مدفوع":
        return "bg-green-100 text-green-700";
      case "معلق":
        return "bg-yellow-100 text-yellow-700";
      case "ملغي":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalRevenue = filteredInvoices
    .filter((inv) => inv.status === "مدفوع")
    .reduce((sum, inv) => sum + calcTotal(inv.items), 0);

  const handleSaveNewInvoice = (inv: Invoice) => {
    const updated = [inv, ...invoices];
    setInvoices(updated);
    localStorage.setItem("invoices", JSON.stringify(updated));
  };

  if (loading) {
    return <InvoicesSkeleton />;
  }

  return (
    <div
      className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors"
      dir="rtl"
    >
      {/* Modals */}
      {viewInvoice && (
        <InvoiceViewModal
          invoice={viewInvoice}
          onClose={() => setViewInvoice(null)}
          onPrint={() => handlePrint(viewInvoice)}
        />
      )}
      {showNewModal && (
        <NewInvoiceModal
          onClose={() => setShowNewModal(false)}
          onSave={handleSaveNewInvoice}
        />
      )}

      {/* Print Invoice */}
      {printInvoice && (
        <PrintInvoice
          invoiceId={printInvoice.id}
          date={printInvoice.date}
          customer={{
            name: printInvoice.customer,
            phone: printInvoice.phone,
          }}
          items={printInvoice.items.map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.unitPrice,
          }))}
          subtotal={calcTotal(printInvoice.items)}
          total={calcTotal(printInvoice.items)}
          paid={
            printInvoice.status === "مدفوع"
              ? calcTotal(printInvoice.items)
              : 0
          }
          remaining={
            printInvoice.status === "معلق"
              ? calcTotal(printInvoice.items)
              : 0
          }
          showPrint={true}
        />
      )}

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            إدارة الفواتير
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            عرض وإدارة جميع الفواتير
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg"
        >
          <Plus size={20} />
          فاتورة جديدة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
          <p className="text-gray-600 text-sm mb-1">
            إجمالي الفواتير
          </p>
          <p className="text-3xl font-bold text-gray-800">
            {filteredInvoices.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">مدفوع</p>
          <p className="text-3xl font-bold text-green-600">
            {
              filteredInvoices.filter(
                (inv) => inv.status === "مدفوع",
              ).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">معلق</p>
          <p className="text-3xl font-bold text-yellow-600">
            {
              filteredInvoices.filter(
                (inv) => inv.status === "معلق",
              ).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">
            إجمالي الإيرادات
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {totalRevenue.toLocaleString()} ج.م
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث برقم الفاتورة أو اسم العميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="الكل">جميع الحالات</option>
            <option value="مدفوع">مدفوع</option>
            <option value="معلق">معلق</option>
            <option value="ملغي">ملغي</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center">
          <FileX
            size={64}
            className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
          />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            لا توجد فواتير
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery || statusFilter !== "الكل"
              ? "لا توجد نتائج مطابقة للبحث أو الفلتر"
              : "ابدأ بإنشاء فاتورة جديدة"}
          </p>
          {searchQuery || statusFilter !== "الكل" ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("الكل");
              }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <X size={20} />
              إزالة الفلتر
            </button>
          ) : (
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={20} />
              إنشاء فاتورة جديدة
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {filteredInvoices.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    رقم الفاتورة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    العميل
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    التاريخ
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    عدد الأصناف
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    الإجمالي
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {invoice.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {invoice.items.length} صنف
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {calcTotal(
                        invoice.items,
                      ).toLocaleString()}{" "}
                      ج.م
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {/* عرض */}
                        <button
                          onClick={() =>
                            setViewInvoice(invoice)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض الفاتورة"
                        >
                          <Eye size={18} />
                        </button>
                        {/* طباعة */}
                        <button
                          onClick={() => handlePrint(invoice)}
                          className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="طباعة"
                        >
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}