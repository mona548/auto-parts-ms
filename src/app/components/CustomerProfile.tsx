import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  TrendingUp,
  Wallet,
  ShoppingBag,
  MessageCircle,
  Copy,
  Send,
  Calendar,
  Hash,
  Package,
  ChevronDown,
  ChevronUp,
  Crown,
  User,
  BadgeAlert,
  Printer,
  Eye,
  BarChart3,
  X,
} from "lucide-react";

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
export const CUSTOMERS_DATA = [
  {
    id: "C001",
    name: "أحمد محمد علي",
    phone: "01******",
    email: "ahmed@example.com",
    address: "القاهرة، مصر الجديدة",
    type: "VIP" as const,
    joinDate: "2024-01-15",
    totalPurchases: 12500,
    overdueBalance: 0,
    orders: 8,
    lastVisit: "2026-04-01",
    notes: "عميل مميز، يفضل التواصل على الواتساب",
    invoices: [
      // 2×350=700 + 1×180=180 + 4×380=1520 = 2400 ✓
      {
        id: "INV-089",
        date: "2026-03-15",
        total: 2400,
        paid: 2400,
        status: "مدفوع",
        items: [
          { name: "فلتر زيت تويوتا", qty: 2, price: 350 },
          { name: "فلتر هواء", qty: 1, price: 180 },
          { name: "زيت موتور 5W30", qty: 4, price: 380 },
        ],
      },
      // 1×950=950 + 1×450=450 + 1×350=350 = 1750 ✓
      {
        id: "INV-076",
        date: "2026-02-28",
        total: 1750,
        paid: 1750,
        status: "مدفوع",
        items: [
          { name: "طقم فرامل أمامي", qty: 1, price: 950 },
          { name: "أسلاك بواجي", qty: 1, price: 450 },
          { name: "فلتر زيت", qty: 1, price: 350 },
        ],
      },
      // 1×1800=1800 + 1×1200=1200 + 1×200=200 = 3200 ✓
      {
        id: "INV-063",
        date: "2026-01-20",
        total: 3200,
        paid: 3200,
        status: "مدفوع",
        items: [
          { name: "بطارية 70 أمبير", qty: 1, price: 1800 },
          { name: "دينمو تويوتا", qty: 1, price: 1200 },
          { name: "حزام توقيت", qty: 1, price: 200 },
        ],
      },
      // 1×3500=3500 + 2×450=900 + 1×150=150 = 4550 ✓
      {
        id: "INV-051",
        date: "2025-12-10",
        total: 4550,
        paid: 4550,
        status: "مدفوع",
        items: [
          { name: "كومبروسور تكييف", qty: 1, price: 3500 },
          { name: "فريون R134a", qty: 2, price: 450 },
          { name: "فلتر كابينة", qty: 1, price: 150 },
        ],
      },
    ],
  },
  {
    id: "C002",
    name: "فاطمة علي حسن",
    phone: "011********",
    email: "fatma@example.com",
    address: "الجيزة، المهندسين",
    type: "عادي" as const,
    joinDate: "2024-06-20",
    totalPurchases: 8200,
    overdueBalance: 1200,
    orders: 5,
    lastVisit: "2026-03-31",
    notes: "",
    invoices: [
      // 1×220=220 + 1×320=320 + 1×410=410 = 950 ✓
      {
        id: "INV-084",
        date: "2026-03-10",
        total: 950,
        paid: 950,
        status: "مدفوع",
        items: [
          { name: "فلتر هواء هوندا", qty: 1, price: 220 },
          { name: "فلتر زيت", qty: 1, price: 320 },
          { name: "زيت موتور", qty: 1, price: 410 },
        ],
      },
      // 1×780=780 + 1×420=420 = 1200 ✓
      {
        id: "INV-071",
        date: "2026-02-14",
        total: 1200,
        paid: 0,
        status: "معلق",
        items: [
          { name: "طقم فرامل خلفي", qty: 1, price: 780 },
          { name: "أسطوانة فرامل", qty: 1, price: 420 },
        ],
      },
      // 1×1500=1500 + 1×850=850 + 1×250=250 = 2600 ✓
      {
        id: "INV-060",
        date: "2026-01-05",
        total: 2600,
        paid: 2600,
        status: "مدفوع",
        items: [
          { name: "بطارية 60 أمبير", qty: 1, price: 1500 },
          { name: "تيل بنزين", qty: 1, price: 850 },
          { name: "فلتر بنزين", qty: 1, price: 250 },
        ],
      },
    ],
  },
  {
    id: "C003",
    name: "محمود حسن",
    phone: "012*******",
    email: "mahmoud@example.com",
    address: "الإسكند��ية، سيدي بشر",
    type: "VIP" as const,
    joinDate: "2023-09-01",
    totalPurchases: 15800,
    overdueBalance: 0,
    orders: 12,
    lastVisit: "2026-03-30",
    notes: "ورشة سيارات، يشتري بالجملة",
    invoices: [
      // 1×2800=2800 + 1×1200=1200 + 2×350=700 + 3×300=900 = 5600 ✓
      {
        id: "INV-091",
        date: "2026-03-30",
        total: 5600,
        paid: 5600,
        status: "مدفوع",
        items: [
          { name: "طقم تيمينج كامل", qty: 1, price: 2800 },
          { name: "ووتر بمب", qty: 1, price: 1200 },
          { name: "تيرموستات", qty: 2, price: 350 },
          { name: "فلاتر متنوعة", qty: 3, price: 300 },
        ],
      },
      // 2×650=1300 + 2×400=800 = 2100 ✓
      {
        id: "INV-082",
        date: "2026-03-05",
        total: 2100,
        paid: 2100,
        status: "مدفوع",
        items: [
          { name: "ديسك فرامل أمامي", qty: 2, price: 650 },
          { name: "طقم فرامل", qty: 2, price: 400 },
        ],
      },
      // 4×180=720 + 2×85=170 = 890 ✓
      {
        id: "INV-070",
        date: "2026-02-11",
        total: 890,
        paid: 890,
        status: "مدفوع",
        items: [
          { name: "بلوف شمعات", qty: 4, price: 180 },
          { name: "فلتر هواء", qty: 2, price: 85 },
        ],
      },
    ],
  },
  {
    id: "C004",
    name: "نور الدين أحمد",
    phone: "010*******",
    email: "nour@example.com",
    address: "القاهرة، مدينة نصر",
    type: "متأخر" as const,
    joinDate: "2024-11-10",
    totalPurchases: 5400,
    overdueBalance: 1500,
    orders: 4,
    lastVisit: "2026-03-29",
    notes: "تأخر في سداد فاتورة فبراير",
    invoices: [
      // 1×1200=1200 + 2×150=300 = 1500 ✓
      {
        id: "INV-079",
        date: "2026-02-22",
        total: 1500,
        paid: 0,
        status: "معلق",
        items: [
          { name: "كلتش كامل", qty: 1, price: 1200 },
          { name: "زيت جيربوكس", qty: 2, price: 150 },
        ],
      },
      // 1×1800=1800 + 1×200=200 + 4×100=400 = 2400 ✓
      {
        id: "INV-065",
        date: "2026-01-14",
        total: 2400,
        paid: 2400,
        status: "مدفوع",
        items: [
          { name: "رادياتير ألومنيوم", qty: 1, price: 1800 },
          { name: "خرطوم مياه", qty: 1, price: 200 },
          { name: "ماء حرارة", qty: 4, price: 100 },
        ],
      },
      // 1×350=350 + 1×350=350 + 2×400=800 = 1500 ✓
      {
        id: "INV-048",
        date: "2025-11-20",
        total: 1500,
        paid: 1500,
        status: "مدفوع",
        items: [
          { name: "فلتر مكيف", qty: 1, price: 350 },
          { name: "فلتر زيت", qty: 1, price: 350 },
          { name: "زيت موتور", qty: 2, price: 400 },
        ],
      },
    ],
  },
  {
    id: "C005",
    name: "سارة محمد",
    phone: "011*******",
    email: "sara@example.com",
    address: "القاهرة، الزمالك",
    type: "عادي" as const,
    joinDate: "2025-02-14",
    totalPurchases: 9600,
    overdueBalance: 0,
    orders: 7,
    lastVisit: "2026-03-28",
    notes: "",
    invoices: [
      {
        id: "INV-088",
        date: "2026-03-25",
        total: 3200,
        paid: 3200,
        status: "مدفوع",
        items: [
          { name: "إطار 185/65R15", qty: 2, price: 1200 },
          { name: "جنط ألمنيوم", qty: 1, price: 800 },
        ],
      },
      {
        id: "INV-075",
        date: "2026-02-17",
        total: 600,
        paid: 600,
        status: "مدفوع",
        items: [
          { name: "فلتر زيت", qty: 1, price: 350 },
          { name: "فلتر هواء", qty: 1, price: 250 },
        ],
      },
      {
        id: "INV-062",
        date: "2026-01-09",
        total: 2800,
        paid: 2800,
        status: "مدفوع",
        items: [
          { name: "أمورتيزير أمامي", qty: 2, price: 1400 },
        ],
      },
    ],
  },
  {
    id: "C006",
    name: "خالد عبدالله",
    phone: "0123*******",
    email: "khaled@example.com",
    address: "الجيزة، الدقي",
    type: "متأخر" as const,
    joinDate: "2024-08-05",
    totalPurchases: 6700,
    overdueBalance: 1800,
    orders: 6,
    lastVisit: "2026-03-27",
    notes: "فاتورة مارس غير مسددة",
    invoices: [
      {
        id: "INV-081",
        date: "2026-03-01",
        total: 1800,
        paid: 0,
        status: "معلق",
        items: [{ name: "كمبروسور AC", qty: 1, price: 1800 }],
      },
      {
        id: "INV-068",
        date: "2026-01-30",
        total: 4200,
        paid: 4200,
        status: "مدفوع",
        items: [
          {
            name: "جيربوكس أوتوماتيك مستعمل",
            qty: 1,
            price: 3500,
          },
          { name: "زيت جيربوكس", qty: 4, price: 175 },
        ],
      },
      {
        id: "INV-055",
        date: "2025-12-01",
        total: 700,
        paid: 700,
        status: "مدفوع",
        items: [
          { name: "فلتر هواء", qty: 2, price: 200 },
          { name: "فلتر زيت", qty: 1, price: 300 },
        ],
      },
    ],
  },
];

/* ══════════════════════════════════════════════
   SHARED STORAGE HELPERS
   All components that read/write customer data
   must use these helpers so changes persist.
══════════════════════════════════════════════ */
const CUSTOMERS_STORAGE_KEY = "customers_data";

export type CustomerData = (typeof CUSTOMERS_DATA)[0];

export function getStoredCustomers(): CustomerData[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CustomerData[];
  } catch {
    /* fall through */
  }
  // First run: persist defaults so future reads stay consistent
  localStorage.setItem(
    CUSTOMERS_STORAGE_KEY,
    JSON.stringify(CUSTOMERS_DATA),
  );
  return CUSTOMERS_DATA as CustomerData[];
}

export function saveStoredCustomers(
  data: CustomerData[],
): void {
  localStorage.setItem(
    CUSTOMERS_STORAGE_KEY,
    JSON.stringify(data),
  );
}

/* ══════════════════════════════════════════════
   TYPE CONFIG
══════════════════════════════════════════════ */
const TYPE_CFG = {
  VIP: {
    label: "VIP",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
    dot: "bg-amber-400",
    Icon: Crown,
    gradient: "from-amber-500 to-yellow-400",
  },
  عادي: {
    label: "عادي",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
    Icon: User,
    gradient: "from-blue-500 to-indigo-500",
  },
  متأخر: {
    label: "متأخر الدفع",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    Icon: BadgeAlert,
    gradient: "from-red-500 to-rose-500",
  },
};

/* ══════════════════════════════════════════════
   WHATSAPP MODAL
══════════════════════════════════════════════ */
function WhatsAppModal({
  customer,
  invoice,
  onClose,
}: {
  customer: (typeof CUSTOMERS_DATA)[0];
  invoice?: (typeof CUSTOMERS_DATA)[0]["invoices"][0] | null;
  onClose: () => void;
}) {
  const defaultMsg = invoice
    ? `مرحباً ${customer.name} 👋\n\nبخصوص فاتورة رقم ${invoice.id} بتاريخ ${invoice.date}\n\nالأصناف:\n${invoice.items.map((i) => `• ${i.name} × ${i.qty} = ${(i.qty * i.price).toLocaleString()} ج.م`).join("\n")}\n\nإجمالي الفاتورة: ${invoice.total.toLocaleString()} ج.م\n${invoice.status === "معلق" ? `⚠️ المبلغ المتبقي: ${invoice.total.toLocaleString()} ج.م\nنرجو سرعة السداد 🙏` : "✅ تم الدفع — شكراً لثقتكم"}\n\nنظام قطع الغيار`
    : `مرحباً ${customer.name} 👋\n\nنتشرف بتعاملكم معنا.\nإجمالي مشترياتكم حتى الآن: ${customer.totalPurchases.toLocaleString()} ج.م\n${customer.overdueBalance > 0 ? `⚠️ يوجد رصيد متأخر: ${customer.overdueBalance.toLocaleString()} ج.م\n` : ""}نتطلع لخدمتكم دائماً 🙏\nنظام قطع الغيار`;

  const [msg, setMsg] = useState(defaultMsg);
  const [copied, setCopied] = useState(false);

  const waPhone = "2" + customer.phone.replace(/^0/, "");
  const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-l from-green-600 to-emerald-500 px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <MessageCircle size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-white">
              رسالة واتساب
            </h3>
            <p className="text-green-100 text-xs mt-0.5">
              {customer.name} — {customer.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="mr-auto p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
        <div className="p-5">
          <label className="text-xs font-bold text-gray-600 mb-2 block">
            نص الرسالة (قابل للتعديل)
          </label>
          <textarea
            rows={10}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm text-gray-700 leading-relaxed outline-none focus:border-green-400 transition-colors resize-none font-[inherit]"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2 ${copied ? "bg-green-50 text-green-600 border-green-200" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {copied ? (
                <>
                  <CheckCircle2 size={15} />
                  تم النسخ!
                </>
              ) : (
                <>
                  <Copy size={15} />
                  نسخ النص
                </>
              )}
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
            >
              <Send size={15} />
              فتح واتساب
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   INVOICE ROW
══════════════════════════════════════════════ */
function InvoiceRow({
  inv,
  customer,
}: {
  inv: (typeof CUSTOMERS_DATA)[0]["invoices"][0];
  customer: (typeof CUSTOMERS_DATA)[0];
}) {
  const [open, setOpen] = useState(false);
  const [waModal, setWaModal] = useState(false);
  const isPaid = inv.status === "مدفوع";

  return (
    <>
      {waModal && (
        <WhatsAppModal
          customer={customer}
          invoice={inv}
          onClose={() => setWaModal(false)}
        />
      )}
      <div
        className={`rounded-xl border-2 overflow-hidden transition-all ${isPaid ? "border-gray-100" : "border-red-200 bg-red-50/30"}`}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPaid ? "bg-green-100" : "bg-red-100"}`}
          >
            <FileText
              size={15}
              className={
                isPaid ? "text-green-600" : "text-red-500"
              }
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-gray-800 text-sm">
                {inv.id}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {inv.status}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={10} />
                {inv.date}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Package size={10} />
                {inv.items.length} أصناف
              </span>
            </div>
          </div>
          <div className="text-left flex-shrink-0">
            <p className="font-black text-blue-600">
              {inv.total.toLocaleString()} ج.م
            </p>
            {!isPaid && (
              <p className="text-xs text-red-500">غير مسدد</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 mr-2">
            <button
              onClick={() => setWaModal(true)}
              className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
              title="إرسال واتساب"
            >
              <MessageCircle size={14} />
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
            >
              {open ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <p className="text-xs font-bold text-gray-500 mb-2">
              تفاصيل الأصناف
            </p>
            <div className="space-y-1.5">
              {inv.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <Package
                        size={10}
                        className="text-blue-500"
                      />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      × {item.qty}
                    </span>
                  </div>
                  <span className="text-xs font-black text-gray-800">
                    {(item.qty * item.price).toLocaleString()}{" "}
                    ج.م
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-400">
                الإجمالي
              </span>
              <span className="font-black text-blue-600">
                {inv.total.toLocaleString()} ج.م
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = getStoredCustomers().find(
    (c) => c.id === id,
  );
  const [tab, setTab] = useState<"invoices" | "info" | "stats">(
    "invoices",
  );
  const [waModal, setWaModal] = useState(false);

  if (!customer) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full p-12 text-center"
        dir="rtl"
      >
        <AlertCircle size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500">العميل غير موجود</p>
        <button
          onClick={() => navigate("/customers")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold"
        >
          رجوع
        </button>
      </div>
    );
  }

  const cfg = TYPE_CFG[customer.type];
  const TypeIcon = cfg.Icon;
  const paid = customer.invoices.reduce(
    (s, i) => s + i.paid,
    0,
  );
  const totalInv = customer.invoices.reduce(
    (s, i) => s + i.total,
    0,
  );
  const pendingInvs = customer.invoices.filter(
    (i) => i.status === "معلق",
  );
  const paidInvs = customer.invoices.filter(
    (i) => i.status === "مدفوع",
  );

  /* month breakdown */
  const monthMap: Record<string, number> = {};
  customer.invoices.forEach((inv) => {
    const m = inv.date.slice(0, 7);
    monthMap[m] = (monthMap[m] || 0) + inv.total;
  });
  const months = Object.entries(monthMap).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  const maxMonth = Math.max(...months.map((m) => m[1]), 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {waModal && (
        <WhatsAppModal
          customer={customer}
          onClose={() => setWaModal(false)}
        />
      )}

      {/* Back */}
      <button
        onClick={() => navigate("/customers")}
        className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors mb-5 text-sm font-medium group"
      >
        <ArrowRight
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        العودة لقائمة العملاء
      </button>

      {/* ── HERO ── */}
      <div
        className={`bg-gradient-to-l ${cfg.gradient} rounded-2xl p-6 mb-5 text-white relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 bg-white/25 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-lg flex-shrink-0 border-2 border-white/30">
            {customer.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-black">
                {customer.name}
              </h1>
              <span
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/25 border border-white/30`}
              >
                <TypeIcon size={12} className="fill-current" />
                {cfg.label}
              </span>
            </div>
            <p className="text-white/70 text-sm mb-3 flex items-center gap-1.5">
              <Hash size={12} />
              {customer.id} — عضو منذ {customer.joinDate}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5 text-sm">
                <Phone size={13} />
                {customer.phone}
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5 text-sm">
                <Mail size={13} />
                {customer.email}
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5 text-sm">
                <MapPin size={13} />
                {customer.address}
              </span>
            </div>
          </div>
          <button
            onClick={() => setWaModal(true)}
            className="flex-shrink-0 flex items-center gap-2 bg-white text-green-600 px-5 py-3 rounded-xl font-black text-sm hover:bg-green-50 transition-colors shadow-lg"
          >
            <MessageCircle size={16} />
            واتساب
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          {
            label: "إجمالي المشتريات",
            value: `${customer.totalPurchases.toLocaleString()} ج.م`,
            sub: `${customer.orders} فاتورة`,
            color: "text-blue-600",
            bg: "bg-blue-50",
            Icon: TrendingUp,
          },
          {
            label: "المبالغ المسددة",
            value: `${paid.toLocaleString()} ج.م`,
            sub: `${paidInvs.length} فاتورة مدفوعة`,
            color: "text-green-600",
            bg: "bg-green-50",
            Icon: CheckCircle2,
          },
          {
            label: "الرصيد المتأخر",
            value: `${customer.overdueBalance.toLocaleString()} ج.م`,
            sub: `${pendingInvs.length} فاتورة معلقة`,
            color:
              customer.overdueBalance > 0
                ? "text-red-600"
                : "text-gray-400",
            bg:
              customer.overdueBalance > 0
                ? "bg-red-50"
                : "bg-gray-50",
            Icon: AlertCircle,
          },
          {
            label: "آخر زيارة",
            value: customer.lastVisit,
            sub: "تاريخ آخر فاتورة",
            color: "text-purple-600",
            bg: "bg-purple-50",
            Icon: Clock,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">
                {card.label}
              </p>
              <div
                className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center`}
              >
                <card.Icon size={14} className={card.color} />
              </div>
            </div>
            <p className={`font-black text-lg ${card.color}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 mb-4">
        {(
          [
            {
              key: "invoices",
              label: "الفواتير",
              Icon: FileText,
              count: customer.invoices.length,
            },
            {
              key: "info",
              label: "بيانات العميل",
              Icon: User,
              count: null,
            },
            {
              key: "stats",
              label: "الإحصائيات",
              Icon: BarChart3,
              count: null,
            },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.key ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}
          >
            <t.Icon size={14} />
            {t.label}
            {t.count !== null && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-black ${tab === t.key ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {/* INVOICES TAB */}
        {tab === "invoices" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-800">
                سجل الفواتير
              </h2>
              <div className="flex gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  {paidInvs.length} مدفوعة
                </span>
                {pendingInvs.length > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <AlertCircle size={11} />
                    {pendingInvs.length} معلقة
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {customer.invoices.map((inv) => (
                <InvoiceRow
                  key={inv.id}
                  inv={inv}
                  customer={customer}
                />
              ))}
            </div>
          </div>
        )}

        {/* INFO TAB */}
        {tab === "info" && (
          <div>
            <h2 className="font-black text-gray-800 mb-4">
              بيانات العميل
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "الاسم الكامل",
                  value: customer.name,
                  Icon: User,
                },
                {
                  label: "رقم الهاتف",
                  value: customer.phone,
                  Icon: Phone,
                },
                {
                  label: "البريد الإلكتروني",
                  value: customer.email,
                  Icon: Mail,
                },
                {
                  label: "العنوان",
                  value: customer.address,
                  Icon: MapPin,
                },
                {
                  label: "تصنيف العميل",
                  value: cfg.label,
                  Icon: TypeIcon,
                },
                {
                  label: "تاريخ التسجيل",
                  value: customer.joinDate,
                  Icon: Calendar,
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0 mt-0.5">
                    <f.Icon
                      size={14}
                      className="text-gray-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">
                      {f.label}
                    </p>
                    <p className="font-bold text-gray-800 text-sm">
                      {f.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {customer.notes && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-600 mb-1 flex items-center gap-1">
                  <AlertCircle size={11} />
                  ملاحظات
                </p>
                <p className="text-sm text-amber-800">
                  {customer.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* STATS TAB */}
        {tab === "stats" && (
          <div>
            <h2 className="font-black text-gray-800 mb-4">
              إحصائيات المشتريات
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-400 mb-1">
                  متوسط الفاتورة
                </p>
                <p className="font-black text-blue-700 text-xl">
                  {Math.round(
                    totalInv / customer.invoices.length,
                  ).toLocaleString()}{" "}
                  ج.م
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xs text-green-400 mb-1">
                  نسبة السداد
                </p>
                <p className="font-black text-green-700 text-xl">
                  {totalInv > 0
                    ? Math.round((paid / totalInv) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-xs text-purple-400 mb-1">
                  إجمالي الأصناف
                </p>
                <p className="font-black text-purple-700 text-xl">
                  {customer.invoices.reduce(
                    (s, inv) =>
                      s +
                      inv.items.reduce(
                        (ss, item) => ss + item.qty,
                        0,
                      ),
                    0,
                  )}{" "}
                  قطعة
                </p>
              </div>
            </div>

            {/* Payments bar */}
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-500 mb-3">
                نسبة المدفوع / المتبقي
              </p>
              <div className="flex rounded-xl overflow-hidden h-8 border border-gray-100">
                <div
                  className="bg-green-500 flex items-center justify-center text-white text-xs font-bold transition-all"
                  style={{
                    width: `${totalInv > 0 ? (paid / totalInv) * 100 : 0}%`,
                  }}
                >
                  {totalInv > 0
                    ? Math.round((paid / totalInv) * 100)
                    : 0}
                  %
                </div>
                {customer.overdueBalance > 0 && (
                  <div className="bg-red-400 flex-1 flex items-center justify-center text-white text-xs font-bold">
                    {Math.round(
                      (customer.overdueBalance / totalInv) *
                        100,
                    )}
                    %
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-3 h-3 bg-green-500 rounded-sm" />
                  مدفوع
                </span>
                {customer.overdueBalance > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 bg-red-400 rounded-sm" />
                    متأخر
                  </span>
                )}
              </div>
            </div>

            {/* Monthly chart */}
            <div>
              <p className="text-xs font-bold text-gray-500 mb-3">
                المشتريات الشهرية
              </p>
              <div className="flex items-end gap-3 h-32">
                {months.map(([month, val]) => (
                  <div
                    key={month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-xs font-bold text-blue-600">
                      {val.toLocaleString()}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all"
                      style={{
                        height: `${(val / maxMonth) * 80}px`,
                      }}
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {month.slice(5)}/{month.slice(2, 4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}