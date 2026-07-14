import { useState, useRef, useEffect } from "react";
import {
  Search, User, Building2, Package, Plus, Trash2, ChevronDown, Check, X,
  FileText, Phone, ShoppingCart, Tag, Hash, Layers, TrendingUp, Star,
  Printer, Eye, MessageSquare, Percent, Wallet, UserPlus, Clock, Save,
  AlertCircle, ChevronLeft, Home,
} from "lucide-react";
import { useParts, Part } from "../context/PartsContext";
import { getStoredCustomers, saveStoredCustomers } from "./CustomerProfile";
import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import PrintInvoice from "./PrintInvoice";

/* ══════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════ */
const INIT_CUSTOMERS = [
  { id: "C001", name: "أحمد محمد علي",   phone: "0100-***-****" },
  { id: "C002", name: "فاطمة علي حسن",  phone: "0111-***-****" },
  { id: "C003", name: "محمود حسن",       phone: "0122-***-****" },
  { id: "C004", name: "نور الدين أحمد", phone: "0101-4****-***" },
  { id: "C005", name: "سارة محمد",       phone: "0112-***-****" },
  { id: "C006", name: "خالد عبدالله",   phone: "0123-***-****" },
];

const PREV_INVOICES: Record<string, { id: string; date: string; total: number; status: string }[]> = {
  C001: [{ id: "INV-089", date: "2026-03-15", total: 2400, status: "مدفوع" }, { id: "INV-076", date: "2026-02-28", total: 1750, status: "مدفوع" }, { id: "INV-063", date: "2026-01-20", total: 3200, status: "مدفوع" }],
  C002: [{ id: "INV-084", date: "2026-03-10", total: 950, status: "مدفوع" }, { id: "INV-071", date: "2026-02-14", total: 1200, status: "معلق" }],
  C003: [{ id: "INV-091", date: "2026-03-30", total: 5600, status: "مدفوع" }, { id: "INV-082", date: "2026-03-05", total: 2100, status: "مدفوع" }, { id: "INV-070", date: "2026-02-11", total: 890, status: "مدفوع" }],
  C004: [{ id: "INV-079", date: "2026-02-22", total: 1500, status: "معلق" }],
  C005: [{ id: "INV-088", date: "2026-03-25", total: 3200, status: "مدفوع" }, { id: "INV-075", date: "2026-02-17", total: 600, status: "مدفوع" }],
  C006: [{ id: "INV-081", date: "2026-03-01", total: 1800, status: "معلق" }, { id: "INV-068", date: "2026-01-30", total: 4200, status: "مدفوع" }],
};

const POPULAR_IDS = ["P001", "P003", "P005", "P007"];

const CAT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  "فلاتر":     { bg: "bg-blue-100",   text: "text-blue-700",   bar: "bg-blue-500" },
  "فرامل":     { bg: "bg-red-100",    text: "text-red-700",    bar: "bg-red-500" },
  "كهرباء":    { bg: "bg-yellow-100", text: "text-yellow-700", bar: "bg-yellow-400" },
  "إطارات":    { bg: "bg-slate-100",  text: "text-slate-700",  bar: "bg-slate-500" },
  "زيوت":      { bg: "bg-green-100",  text: "text-green-700",  bar: "bg-green-500" },
  "محرك":      { bg: "bg-orange-100", text: "text-orange-700", bar: "bg-orange-500" },
  "إكسسوارات": { bg: "bg-purple-100", text: "text-purple-700", bar: "bg-purple-500" },
};
const defCat = { bg: "bg-gray-100", text: "text-gray-700", bar: "bg-gray-400" };

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface CartItem {
  partId: string; name: string; code: string;
  supplier: string; sellPrice: number; qty: number; note: string;
}
interface Customer { id: string; name: string; phone: string; }
interface Discount { type: "percent" | "fixed"; value: number; }

/* ══════════════════════════════════════════════
   HIGHLIGHT
══════════════════════════════════════════════ */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return <>{text.slice(0, idx)}<mark className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5 not-italic">{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>;
}

/* ══════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════ */
function ProductCard({ part, inCart, onAdd, query = "", popular = false }: {
  part: Part; inCart: boolean; onAdd: (p: Part) => void; query?: string; popular?: boolean;
}) {
  const cat   = CAT_COLORS[part.category] ?? defCat;
  const stock = part.status === "متوفر" ? { cls: "text-green-600 bg-green-50 border-green-200", dot: "bg-green-500" }
              : part.status === "منخفض" ? { cls: "text-yellow-600 bg-yellow-50 border-yellow-200", dot: "bg-yellow-500" }
              :                           { cls: "text-red-600 bg-red-50 border-red-200",           dot: "bg-red-500" };
  return (
    <div className={`relative flex flex-col rounded-2xl border-2 transition-all duration-200 overflow-hidden
      ${inCart ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md shadow-green-100"
               : "border-gray-100 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50"}`}>
      <div className={`h-1.5 w-full ${cat.bar}`} />
      {popular && (
        <div className="absolute top-3 left-3 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow">
          <Star size={10} className="text-white fill-white" />
        </div>
      )}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 flex-1">
            {query ? <Highlight text={part.name} query={query} /> : part.name}
          </p>
          {inCart && <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={12} className="text-white" /></div>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cat.bg} ${cat.text}`}><Tag size={10} />{part.category}</span>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${stock.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />{part.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
            <p className="text-gray-400 mb-0.5 flex items-center gap-1"><Hash size={9} />الكود</p>
            <p className="font-bold text-gray-700 truncate">{query ? <Highlight text={part.partCode || part.id} query={query} /> : (part.partCode || part.id)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-2.5 py-1.5">
            <p className="text-gray-400 mb-0.5 flex items-center gap-1"><Layers size={9} />المخزون</p>
            <p className={`font-bold ${part.quantity <= 5 ? "text-red-600" : part.quantity <= 15 ? "text-yellow-600" : "text-gray-700"}`}>{part.quantity} قطعة</p>
          </div>
        </div>
        {part.supplier && (
          <div className="bg-purple-50 rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-1.5">
            <Building2 size={10} className="text-purple-400 flex-shrink-0" />
            <span className="text-purple-400">الشركة</span>
            <span className="font-bold text-purple-700 truncate mr-auto">{part.supplier}</span>
          </div>
        )}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp size={9} />سعر البيع</p>
            <p className="text-blue-600 font-black text-lg leading-none mt-0.5">{part.sellPrice.toLocaleString()}<span className="text-xs font-medium mr-0.5">ج.م</span></p>
          </div>
          <button onClick={() => onAdd(part)} disabled={inCart}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              inCart ? "bg-green-100 text-green-600 cursor-default" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm"}`}>
            {inCart ? <><Check size={13} />مُضاف</> : <><Plus size={13} />إضافة</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   QTY POPUP MODAL
══════════════════════════════════════════════ */
function QtyPopupModal({ part, onConfirm, onCancel }: { part: Part; onConfirm: (qty: number) => void; onCancel: () => void }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-80 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-800">تحديد الكمية</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 mb-4">
          <p className="font-bold text-gray-800 text-sm">{part.name}</p>
          <p className="text-blue-600 font-black text-lg mt-1">{part.sellPrice.toLocaleString()} ج.م / قطعة</p>
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center font-black text-xl transition-colors">−</button>
          <div className="text-center">
            <input type="number" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center text-2xl font-black text-gray-800 border-2 border-gray-200 rounded-xl py-2 outline-none focus:border-blue-500" min="1" />
          </div>
          <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center font-black text-xl transition-colors">+</button>
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 mb-4">
          <span className="text-sm text-gray-500">الإجمالي</span>
          <span className="font-black text-blue-600">{(part.sellPrice * qty).toLocaleString()} ج.م</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">إلغاء</button>
          <button onClick={() => onConfirm(qty)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">إضافة للسلة</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ADD CUSTOMER MODAL
══════════════════════════════════════════════ */
function AddCustomerModal({ onSave, onClose }: { onSave: (c: Customer) => void; onClose: () => void }) {
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const handleSave = () => {
    if (!name.trim() || !phone.trim()) { alert("أدخل الاسم ورقم الهاتف"); return; }
    onSave({ id: `C${Date.now()}`, name, phone });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-96 mx-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><UserPlus size={18} className="text-white" /></div>
          <div>
            <h3 className="font-black text-gray-800">إضافة عميل جديد</h3>
            <p className="text-xs text-gray-400">سيُضاف العميل فوراً للقائمة</p>
          </div>
          <button onClick={onClose} className="mr-auto p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">الاسم الكامل *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="مثال: محمد أحمد علي"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">رقم الهاتف *</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="مثال: 0100-000-0000"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors">إلغاء</button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <UserPlus size={15} />حفظ العميل
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PREVIEW MODAL
══════════════════════════════════════════════ */
function PreviewModal({ customer, cart, discount, paymentStatus, paidAmount, onClose, onConfirm, onPrint }: {
  customer: Customer; cart: CartItem[]; discount: Discount;
  paymentStatus: string; paidAmount: number; onClose: () => void; onConfirm: () => void; onPrint: () => void;
}) {
  const subtotal  = cart.reduce((s, i) => s + i.sellPrice * i.qty, 0);
  const discVal   = discount.type === "percent" ? (subtotal * discount.value) / 100 : discount.value;
  const total     = Math.max(0, subtotal - discVal);
  const remaining = paymentStatus === "جزئي" ? Math.max(0, total - paidAmount) : 0;
  const today     = new Date().toISOString().slice(0, 10);
  const invId     = `INV-${String(Date.now()).slice(-5)}`;
  const statusColor = paymentStatus === "مدفوع" ? "text-green-700 bg-green-100" : paymentStatus === "معلق" ? "text-yellow-700 bg-yellow-100" : "text-blue-700 bg-blue-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-white" />
            <div>
              <h2 className="font-black text-white">معاينة الفاتورة</h2>
              <p className="text-blue-200 text-xs mt-0.5">{invId} — {today}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-xl transition-colors"><X size={18} className="text-white" /></button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {/* Customer + Status */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">اسم العميل</p>
              <p className="font-black text-gray-800">{customer.name}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={12} />{customer.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">حالة الدفع</p>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${statusColor}`}>{paymentStatus}</span>
              {paymentStatus === "جزئي" && (
                <p className="text-xs text-gray-500 mt-2">مدفوع: <strong>{paidAmount.toLocaleString()} ج.م</strong></p>
              )}
            </div>
          </div>

          {/* Items */}
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-100 text-xs text-gray-600">
                <th className="px-3 py-2.5 text-right rounded-r-lg">الصنف</th>
                <th className="px-3 py-2.5 text-center">الكمية</th>
                <th className="px-3 py-2.5 text-center">السعر</th>
                <th className="px-3 py-2.5 text-left rounded-l-lg">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {cart.map((item) => (
                <tr key={item.partId} className="text-sm">
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.note && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MessageSquare size={10} />{item.note}</p>}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-700 font-medium">{item.qty}</td>
                  <td className="px-3 py-3 text-center text-gray-700">{item.sellPrice.toLocaleString()} ج.م</td>
                  <td className="px-3 py-3 text-left font-black text-gray-900">{(item.qty * item.sellPrice).toLocaleString()} ج.م</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>المجموع الفرعي</span><span className="font-medium text-gray-800">{subtotal.toLocaleString()} ج.م</span>
            </div>
            {discount.value > 0 && (
              <div className="flex justify-between text-sm text-red-500">
                <span>الخصم {discount.type==="percent" ? `(${discount.value}%)` : ""}</span>
                <span>- {discVal.toLocaleString()} ج.م</span>
              </div>
            )}
            <div className="flex justify-between font-black text-lg border-t pt-2">
              <span className="text-gray-700">الإجمالي</span>
              <span className="text-blue-600">{total.toLocaleString()} ج.م</span>
            </div>
            {paymentStatus === "جزئي" && (
              <>
                <div className="flex justify-between text-sm text-green-600">
                  <span>المدفوع</span><span className="font-bold">{paidAmount.toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-sm text-red-600 font-bold">
                  <span>المتبقي</span><span>{remaining.toLocaleString()} ج.م</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button onClick={onPrint} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
            <Printer size={16} />طباعة PDF
          </button>
          <button onClick={onConfirm} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
            <Check size={16} />تأكيد وحفظ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function CreateInvoice() {
  const { parts } = useParts();

  // Customers (extendable)
  const [customers, setCustomers] = useState<Customer[]>(INIT_CUSTOMERS);

  // Customer field
  const [customerQuery, setCustomerQuery]       = useState("");
  const [customerOpen, setCustomerOpen]         = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const customerRef = useRef<HTMLDivElement>(null);

  // Supplier field
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  // Part search
  const [partQuery, setPartQuery] = useState("");

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Discount
  const [discount, setDiscount] = useState<Discount>({ type: "percent", value: 0 });

  // Payment
  const [paymentStatus, setPaymentStatus] = useState<"مدفوع" | "معلق" | "جزئي">("معلق");
  const [paidAmount, setPaidAmount]       = useState("");

  // Modals
  const [qtyPopup, setQtyPopup]           = useState<Part | null>(null);
  const [showPreview, setShowPreview]     = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Print state
  const [printData, setPrintData] = useState<{
    customer: Customer;
    cart: CartItem[];
    discount: Discount;
    paymentStatus: string;
    paidAmount: number;
  } | null>(null);

  const handlePrint = () => {
    if (selectedCustomer) {
      setPrintData({
        customer: selectedCustomer,
        cart,
        discount,
        paymentStatus,
        paidAmount: parseFloat(paidAmount) || 0,
      });
      setTimeout(() => {
        window.print();
      }, 100);
    }
  };

  // Draft
  const [hasDraft, setHasDraft] = useState(() => !!localStorage.getItem("invoice_draft"));

  // Close customer dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (customerRef.current && !customerRef.current.contains(e.target as Node)) setCustomerOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── Derived ── */
  const suppliers         = Array.from(new Set(parts.map(p => p.supplier))).sort();
  const supplierParts     = selectedSupplier ? parts.filter(p => p.supplier === selectedSupplier) : [];
  const popularParts      = parts.filter(p => POPULAR_IDS.includes(p.id));
  const customerResults   = customers.filter(c => c.name.toLowerCase().includes(customerQuery.toLowerCase()) || c.phone.includes(customerQuery));
  const partSearchResults = partQuery.trim().length >= 1
    ? parts.filter(p => p.name.toLowerCase().includes(partQuery.toLowerCase()) || (p.partCode || "").toLowerCase().includes(partQuery.toLowerCase()) || p.id.toLowerCase().includes(partQuery.toLowerCase()))
    : [];
  const prevInvoices      = selectedCustomer ? (PREV_INVOICES[selectedCustomer.id] || []) : [];

  /* ── Calculations ── */
  const subtotal = cart.reduce((s, i) => s + i.sellPrice * i.qty, 0);
  // Clamp percent discount to 0–100 to prevent negative totals
  const clampedDiscVal = discount.type === "percent"
    ? (subtotal * Math.min(Math.max(discount.value, 0), 100)) / 100
    : Math.max(0, discount.value);
  const discVal  = clampedDiscVal;
  const total    = Math.max(0, subtotal - discVal);
  const paid     = Math.min(parseFloat(paidAmount) || 0, total); // clamp paid ≤ total
  const remaining = paymentStatus === "جزئي" ? Math.max(0, total - paid) : 0;

  /* ── Cart helpers ── */
  const openQtyPopup = (part: Part) => setQtyPopup(part);

  const addToCart = (part: Part, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(c => c.partId === part.id);
      if (exists) return prev.map(c => c.partId === part.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { partId: part.id, name: part.name, code: part.partCode || part.id, supplier: part.supplier, sellPrice: part.sellPrice, qty, note: "" }];
    });
    setQtyPopup(null);
  };

  const confirmQtyPopup = (qty: number) => { if (qtyPopup) addToCart(qtyPopup, qty); };

  const updateQty   = (id: string, v: number) => { if (v < 1) return; setCart(p => p.map(c => c.partId === id ? { ...c, qty: v } : c)); };
  const updateNote  = (id: string, n: string) => setCart(p => p.map(c => c.partId === id ? { ...c, note: n } : c));
  const removeItem  = (id: string) => setCart(p => p.filter(c => c.partId !== id));

  /* ── Draft ── */
  const saveDraft = () => {
    localStorage.setItem("invoice_draft", JSON.stringify({ customer: selectedCustomer, cart, discount, paymentStatus, paidAmount }));
    setHasDraft(true);
    alert("✅ تم حفظ المسودة بنجاح");
  };
  const loadDraft = () => {
    const d = localStorage.getItem("invoice_draft");
    if (!d) return;
    const { customer, cart: c, discount: dis, paymentStatus: ps, paidAmount: pa } = JSON.parse(d);
    setSelectedCustomer(customer);
    setCart(c);
    setDiscount(dis);
    setPaymentStatus(ps);
    setPaidAmount(pa);
    setHasDraft(false);
  };
  const clearDraft = () => { localStorage.removeItem("invoice_draft"); setHasDraft(false); };

  /* ── Save confirmed ── */
  const handleConfirmSave = () => {
    if (!selectedCustomer || cart.length === 0) return;

    const subtotal = cart.reduce((s, i) => s + i.sellPrice * i.qty, 0);
    const discountAmt = discount.type === "percent"
      ? (subtotal * discount.value) / 100
      : discount.value;
    const total = Math.max(0, subtotal - discountAmt);
    const paid = paymentStatus === "مدفوع" ? total
      : paymentStatus === "جزئي" ? (parseFloat(paidAmount) || 0)
      : 0;
    const invoiceId = `INV-${String(Date.now()).slice(-6)}`;
    const today = new Date().toISOString().slice(0, 10);

    // 1. Save to flat invoices list (used by Invoices page)
    const flatInvoice = {
      id: invoiceId,
      customer: selectedCustomer.name,
      phone: selectedCustomer.phone,
      date: today,
      items: cart.map(i => ({ name: i.name, qty: i.qty, unitPrice: i.sellPrice })),
      status: paymentStatus === "مدفوع" ? "مدفوع" : "معلق",
    };
    try {
      const existing = JSON.parse(localStorage.getItem("invoices") || "[]");
      localStorage.setItem("invoices", JSON.stringify([flatInvoice, ...existing]));
    } catch { /* ignore */ }

    // 2. Save to customers_data so Settlement & CustomerProfile show it
    try {
      const allCustomers = getStoredCustomers();
      const customerInvoice = {
        id: invoiceId,
        date: today,
        total,
        paid,
        status: paymentStatus === "مدفوع" ? ("مدفوع" as const) : ("معلق" as const),
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.sellPrice })),
      };
      const updated = allCustomers.map(c => {
        if (c.name !== selectedCustomer.name && c.phone !== selectedCustomer.phone) return c;
        const remaining = total - paid;
        const newOverdue = c.overdueBalance + (remaining > 0 ? remaining : 0);
        return {
          ...c,
          invoices: [customerInvoice, ...c.invoices],
          totalPurchases: c.totalPurchases + total,
          orders: c.orders + 1,
          overdueBalance: newOverdue,
          lastVisit: today,
          type: newOverdue > 0 && c.type === "عادي" ? ("متأخر" as const) : c.type,
        };
      });
      saveStoredCustomers(updated);
    } catch { /* ignore */ }

    setShowPreview(false);
    clearDraft();
    setSelectedCustomer(null); setCustomerQuery(""); setSelectedSupplier(null);
    setCart([]); setDiscount({ type: "percent", value: 0 }); setPaymentStatus("معلق"); setPaidAmount("");
    alert("✅ تم حفظ الفاتورة بنجاح! يمكنك مراجعتها في قسم الفواتير.");
  };

  /* ════════════════════════════════════════ */
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors" dir="rtl">

      {/* Modals */}
      {qtyPopup && <QtyPopupModal part={qtyPopup} onConfirm={confirmQtyPopup} onCancel={() => setQtyPopup(null)} />}
      {showAddCustomer && <AddCustomerModal onSave={c => { setCustomers(prev => [c, ...prev]); setSelectedCustomer(c); }} onClose={() => setShowAddCustomer(false)} />}
      {showPreview && selectedCustomer && (
        <PreviewModal customer={selectedCustomer} cart={cart} discount={discount}
          paymentStatus={paymentStatus} paidAmount={paid}
          onClose={() => setShowPreview(false)} onConfirm={handleConfirmSave} onPrint={handlePrint} />
      )}

      {/* Print Invoice */}
      {printData && (
        <PrintInvoice
          invoiceId={`INV-${String(Date.now()).slice(-5)}`}
          date={new Date().toISOString()}
          customer={{
            name: printData.customer.name,
            phone: printData.customer.phone,
          }}
          items={printData.cart.map(item => ({
            name: item.name + (item.note ? ` (${item.note})` : ''),
            qty: item.qty,
            price: item.sellPrice,
          }))}
          subtotal={printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0)}
          discount={printData.discount.type === "percent"
            ? (printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) * printData.discount.value) / 100
            : printData.discount.value}
          total={Math.max(0, printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) - (printData.discount.type === "percent"
            ? (printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) * printData.discount.value) / 100
            : printData.discount.value))}
          paid={printData.paymentStatus === "جزئي" ? printData.paidAmount : (printData.paymentStatus === "مدفوع" ? Math.max(0, printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) - (printData.discount.type === "percent"
            ? (printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) * printData.discount.value) / 100
            : printData.discount.value)) : 0)}
          remaining={printData.paymentStatus === "جزئي" ? Math.max(0, Math.max(0, printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) - (printData.discount.type === "percent"
            ? (printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) * printData.discount.value) / 100
            : printData.discount.value)) - printData.paidAmount) : (printData.paymentStatus === "معلق" ? Math.max(0, printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) - (printData.discount.type === "percent"
            ? (printData.cart.reduce((s, i) => s + i.sellPrice * i.qty, 0) * printData.discount.value) / 100
            : printData.discount.value)) : 0)}
          showPrint={true}
        />
      )}

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList className="flex-row-reverse">
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 dark:text-gray-100">إنشاء فاتورة جديدة</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/invoices" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 flex items-center gap-1">
                  <FileText size={14} />
                  الفواتير
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 flex items-center gap-1">
                  <Home size={14} />
                  الرئيسية
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">عمل فاتورة لعميل</h1>
            <p className="text-gray-400 text-sm mt-0.5">اختر العميل والأصناف لإنشاء فاتورة جديدة</p>
          </div>
        </div>
        {hasDraft && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <AlertCircle size={16} className="text-amber-500" />
            <span className="text-sm text-amber-700 font-medium">يوجد مسودة محفوظة</span>
            <button onClick={loadDraft} className="text-xs bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition-colors font-bold">استرداد</button>
            <button onClick={clearDraft} className="text-xs text-amber-400 hover:text-amber-600 transition-colors"><X size={14} /></button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ══ MAIN COLUMN ══ */}
        <div className="xl:col-span-2 flex flex-col gap-5">

          {/* ── 1. Customer ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center"><User size={14} className="text-white" /></div>
              <h2 className="font-bold text-gray-800">بيانات العميل</h2>
            </div>

            {selectedCustomer ? (
              <div>
                <div className="flex items-center justify-between bg-gradient-to-l from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{selectedCustomer.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5"><Phone size={12} className="text-blue-400" />{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1"><Check size={11} />تم الاختيار</span>
                    <button onClick={() => { setSelectedCustomer(null); setCustomerQuery(""); }}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={15} /></button>
                  </div>
                </div>

                {/* Previous invoices */}
                {prevInvoices.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 mb-2"><Clock size={11} />آخر فواتير هذا العميل</p>
                    <div className="flex flex-col gap-1.5">
                      {prevInvoices.map(inv => (
                        <div key={inv.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <div className="flex items-center gap-2">
                            <FileText size={13} className="text-blue-400" />
                            <span className="text-xs font-bold text-blue-600">{inv.id}</span>
                            <span className="text-xs text-gray-400">{inv.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-700">{inv.total.toLocaleString()} ج.م</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.status==="مدفوع"?"bg-green-100 text-green-700":inv.status==="معلق"?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"}`}>{inv.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div ref={customerRef} className="relative mb-3">
                  <div className="relative">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                    <input type="text" placeholder="ابحث باسم العميل أو رقم هاتفه..."
                      value={customerQuery} onChange={e => { setCustomerQuery(e.target.value); setCustomerOpen(true); }}
                      onFocus={() => setCustomerOpen(true)}
                      className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors text-sm" />
                  </div>
                  {customerOpen && (
                    <div className="absolute z-40 w-full top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                      {customerQuery.length > 0 && customerResults.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-400 text-sm">لم يُعثر على عميل</div>
                      ) : (
                        <>
                          <p className="px-4 py-2.5 text-xs text-gray-400 bg-gray-50 border-b">
                            {customerQuery ? `نتائج البحث (${customerResults.length})` : "العملاء المسجلون"}
                          </p>
                          {(customerQuery ? customerResults : customers).map(c => (
                            <button key={c.id} onClick={() => { setSelectedCustomer(c); setCustomerOpen(false); setCustomerQuery(""); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-right border-b border-gray-50 last:border-0">
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{c.name.charAt(0)}</div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm"><Highlight text={c.name} query={customerQuery} /></p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone size={10} /><Highlight text={c.phone} query={customerQuery} /></p>
                              </div>
                              <ChevronLeft size={14} className="text-gray-300" />
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => setShowAddCustomer(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all text-sm font-medium">
                  <UserPlus size={15} />إضافة عميل جديد غير مسجل
                </button>
              </div>
            )}
          </div>

          {/* ── 2. Popular Items ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center"><Star size={14} className="text-white fill-white" /></div>
              <h2 className="font-bold text-gray-800">الأكثر طلباً</h2>
              <span className="text-xs text-gray-400 mr-auto">أصناف يتم بيعها بشكل متكرر</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {popularParts.map(part => (
                <ProductCard key={part.id} part={part} inCart={!!cart.find(c => c.partId === part.id)} onAdd={openQtyPopup} popular />
              ))}
            </div>
          </div>

          {/* ── 3. Supplier ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center"><Building2 size={14} className="text-white" /></div>
              <h2 className="font-bold text-gray-800">اختر الشركة</h2>
              {selectedSupplier && <span className="mr-auto text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">{supplierParts.length} منتج</span>}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setSelectedSupplier(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${!selectedSupplier ? "bg-gray-800 text-white border-gray-800 shadow" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                الكل
              </button>
              {suppliers.map(s => (
                <button key={s} onClick={() => setSelectedSupplier(selectedSupplier === s ? null : s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 ${
                    selectedSupplier === s ? "bg-purple-600 text-white border-purple-600 shadow shadow-purple-200" : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50"}`}>
                  <Building2 size={13} />{s}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${selectedSupplier === s ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {parts.filter(p => p.supplier === s).length}
                  </span>
                </button>
              ))}
            </div>
            {selectedSupplier && supplierParts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {supplierParts.map(part => (
                  <ProductCard key={part.id} part={part} inCart={!!cart.find(c => c.partId === part.id)} onAdd={openQtyPopup} />
                ))}
              </div>
            ) : !selectedSupplier ? (
              <div className="text-center py-8 text-gray-300 border-2 border-dashed border-gray-100 rounded-xl">
                <Building2 size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">اختر شركة لعرض منتجاتها</p>
              </div>
            ) : null}
          </div>

          {/* ── 4. Part Search ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center"><Search size={14} className="text-white" /></div>
              <h2 className="font-bold text-gray-800">بحث عن صنف</h2>
              <span className="text-xs text-gray-400 mr-auto">بالاسم أو الكود</span>
            </div>
            <div className="relative mb-4">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
              <input type="text" placeholder="اكتب اسم الصنف أو الكود للبحث الفوري..." value={partQuery}
                onChange={e => setPartQuery(e.target.value)}
                className="w-full pr-10 pl-10 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 outline-none transition-colors text-sm" />
              {partQuery && <button onClick={() => setPartQuery("")} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"><X size={11} className="text-gray-600" /></button>}
            </div>
            {partQuery.trim().length >= 1 ? (
              partSearchResults.length === 0 ? (
                <div className="py-10 text-center">
                  <Package size={36} className="mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">لم يُعثر على صنف</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-400 mb-3">نتائج البحث — <strong className="text-gray-600">{partSearchResults.length} صنف</strong></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {partSearchResults.map(part => (
                      <ProductCard key={part.id} part={part} inCart={!!cart.find(c => c.partId === part.id)} onAdd={openQtyPopup} query={partQuery} />
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="py-8 text-center text-gray-300 border-2 border-dashed border-gray-100 rounded-xl">
                <Search size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">ابدأ الكتابة للبحث الفوري</p>
              </div>
            )}
          </div>
        </div>

        {/* ══ CART COLUMN ══ */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            {/* Cart Header */}
            <div className="bg-gradient-to-l from-blue-700 to-blue-600 px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"><ShoppingCart size={17} className="text-white" /></div>
              <h2 className="font-bold text-white">الأصناف المختارة</h2>
              {cart.length > 0 && <span className="mr-auto bg-white text-blue-700 text-xs font-black px-2.5 py-0.5 rounded-full">{cart.length}</span>}
            </div>

            {/* Cart Items */}
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3"><ShoppingCart size={24} className="text-gray-200" /></div>
                  <p className="text-sm text-gray-400">لم تختر أي أصناف بعد</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.partId} className="px-4 py-3.5">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"><Package size={13} className="text-blue-500" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 leading-snug">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Hash size={10} />{item.code}</p>
                      </div>
                      <button onClick={() => removeItem(item.partId)} className="p-1 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                    </div>
                    {/* Qty row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.partId, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors font-bold">−</button>
                        <span className="text-sm font-black text-gray-700 w-8 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.partId, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors font-bold">+</button>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-gray-400">{item.sellPrice.toLocaleString()} × {item.qty}</p>
                        <p className="font-black text-blue-600 text-sm">{(item.sellPrice * item.qty).toLocaleString()} ج.م</p>
                      </div>
                    </div>
                    {/* Note field */}
                    <div className="relative">
                      <MessageSquare size={11} className="absolute right-2.5 top-2.5 text-gray-300" />
                      <input type="text" placeholder="ملاحظة على هذا الصنف..." value={item.note}
                        onChange={e => updateNote(item.partId, e.target.value)}
                        className="w-full pr-7 pl-3 py-1.5 border border-gray-100 rounded-lg text-xs text-gray-600 placeholder-gray-300 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 outline-none transition-colors bg-gray-50" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount */}
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Percent size={13} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-600">خصم</span>
                <div className="flex gap-1 mr-auto">
                  {(["percent", "fixed"] as const).map(t => (
                    <button key={t} onClick={() => setDiscount({ ...discount, type: t })}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium ${discount.type === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                      {t === "percent" ? "%" : "ج.م"}
                    </button>
                  ))}
                </div>
              </div>
              <input type="number" min="0" value={discount.value || ""} placeholder={discount.type === "percent" ? "نسبة الخصم..." : "مبلغ الخصم..."}
                onChange={e => setDiscount({ ...discount, value: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-400 outline-none transition-colors" />
            </div>

            {/* Payment Status */}
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={13} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-600">حالة الدفع</span>
              </div>
              <div className="flex gap-1.5 mb-2">
                {(["مدفوع", "معلق", "جزئي"] as const).map(s => (
                  <button key={s} onClick={() => setPaymentStatus(s)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      paymentStatus === s
                        ? s==="مدفوع" ? "bg-green-500 text-white" : s==="معلق" ? "bg-yellow-500 text-white" : "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {s}
                  </button>
                ))}
              </div>
              {paymentStatus === "جزئي" && (
                <input type="number" min="0" value={paidAmount} placeholder="المبلغ المدفوع..."
                  onChange={e => setPaidAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-400 outline-none transition-colors" />
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-100 px-4 py-3 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>المجموع الفرعي</span><span className="font-medium text-gray-600">{subtotal.toLocaleString()} ج.م</span>
                </div>
                {discount.value > 0 && (
                  <div className="flex justify-between text-xs text-red-400">
                    <span>الخصم</span><span>- {discVal.toLocaleString()} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-base border-t border-gray-200 pt-1.5">
                  <span className="text-gray-700">الإجمالي</span>
                  <span className="text-blue-600">{total.toLocaleString()} ج.م</span>
                </div>
                {paymentStatus === "جزئي" && paid > 0 && (
                  <>
                    <div className="flex justify-between text-xs text-green-500"><span>مدفوع</span><span className="font-bold">{paid.toLocaleString()} ج.م</span></div>
                    <div className="flex justify-between text-xs text-red-500 font-bold"><span>متبقي</span><span>{remaining.toLocaleString()} ج.م</span></div>
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
              <button onClick={() => setShowPreview(true)} disabled={!selectedCustomer || cart.length === 0}
                className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                  selectedCustomer && cart.length > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                <Eye size={16} />معاينة وحفظ الفاتورة
              </button>
              <button onClick={saveDraft} disabled={cart.length === 0}
                className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm border-2 ${
                  cart.length > 0 ? "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors" : "border-gray-100 text-gray-300 cursor-not-allowed"}`}>
                <Save size={14} />حفظ كمسودة
              </button>
              {(!selectedCustomer || cart.length === 0) && (
                <p className="text-xs text-center text-gray-300">{!selectedCustomer ? "اختر العميل أولاً" : "أضف صنفاً واحداً على الأقل"}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}