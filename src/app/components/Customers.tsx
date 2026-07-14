import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Search, UserPlus, Phone, Mail, MapPin, Crown, User, BadgeAlert,
  TrendingUp, FileText, MessageCircle, Eye, AlertCircle, Star,
  Clock, Filter, ChevronDown, X, Hash,
} from "lucide-react";
import { CUSTOMERS_DATA, getStoredCustomers, saveStoredCustomers } from "./CustomerProfile";

/* ══════════════════════════════════════════════
   TYPE CONFIG
══════════════════════════════════════════════ */
const TYPE_CFG = {
  VIP:   { label: "VIP",         bg: "bg-amber-100",  text: "text-amber-800", border: "border-amber-300", dot: "bg-amber-400", Icon: Crown,      gradient: "from-amber-400 to-yellow-400", ring: "ring-amber-200" },
  عادي:  { label: "عادي",        bg: "bg-blue-100",   text: "text-blue-700",  border: "border-blue-200",  dot: "bg-blue-400",  Icon: User,       gradient: "from-blue-500 to-indigo-500",  ring: "ring-blue-100"  },
  متأخر: { label: "متأخر الدفع", bg: "bg-red-100",    text: "text-red-700",   border: "border-red-200",   dot: "bg-red-500",   Icon: BadgeAlert, gradient: "from-red-500 to-rose-500",    ring: "ring-red-100"   },
};

/* ══════════════════════════════════════════════
   ADD CUSTOMER MODAL
══════════════════════════════════════════════ */
function AddCustomerModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: typeof CUSTOMERS_DATA[0]) => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", type: "عادي" as "عادي" | "VIP" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validate = () => {
    const e: { name?: string; phone?: string } = {};
    if (!form.name.trim())  e.name  = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const newCustomer: typeof CUSTOMERS_DATA[0] = {
      id:             `CUS-${Date.now().toString().slice(-4)}`,
      name:           form.name.trim(),
      phone:          form.phone.trim(),
      email:          form.email.trim() || "—",
      address:        form.address.trim() || "��",
      type:           form.type,
      orders:         0,
      totalPurchases: 0,
      overdueBalance: 0,
      lastVisit:      new Date().toISOString().slice(0, 10),
      invoices:       [],
    };
    onAdd(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-96 mx-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><UserPlus size={18} className="text-white" /></div>
          <h3 className="font-black text-gray-800">إضافة عميل جديد</h3>
          <button onClick={onClose} className="mr-auto p-1.5 hover:bg-gray-100 rounded-lg"><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3 mb-5">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">الاسم الكامل *</label>
            <input type="text" placeholder="مثال: محمد أحمد علي"
              value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: undefined })); }}
              className={`w-full px-4 py-2.5 border-2 rounded-xl outline-none text-sm transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1 font-bold">{errors.name}</p>}
          </div>
          {/* Phone */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">رقم الهاتف *</label>
            <input type="text" placeholder="مثال: 0100-000-0000"
              value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: undefined })); }}
              className={`w-full px-4 py-2.5 border-2 rounded-xl outline-none text-sm transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500"}`} />
            {errors.phone && <p className="text-xs text-red-500 mt-1 font-bold">{errors.phone}</p>}
          </div>
          {/* Email */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">البريد الإلكتروني</label>
            <input type="text" placeholder="example@email.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors" />
          </div>
          {/* Address */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">العنوان</label>
            <input type="text" placeholder="المدينة، الحي"
              value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors" />
          </div>
          {/* Type */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">التصنيف</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "عادي" | "VIP" }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors">
              <option value="عادي">عادي</option>
              <option value="VIP">VIP</option>
            </select>
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
   CUSTOMER CARD
══════════════════════════════════════════════ */
function CustomerCard({ customer, onView }: {
  customer: typeof CUSTOMERS_DATA[0];
  onView: () => void;
}) {
  const cfg      = TYPE_CFG[customer.type];
  const TypeIcon = cfg.Icon;
  const waPhone  = "2" + customer.phone.replace(/^0/, "");
  const waMsg    = encodeURIComponent(`مرحباً ${customer.name} 👋\nنتشرف بتعاملكم معنا.\nإجمالي مشترياتكم: ${customer.totalPurchases.toLocaleString()} ج.م\n${customer.overdueBalance > 0 ? `⚠️ يوجد رصيد متأخر: ${customer.overdueBalance.toLocaleString()} ج.م\n` : ""}نظام قطع الغيار`);

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden ${customer.type === "متأخر" ? "border-red-200 hover:border-red-300" : customer.type === "VIP" ? "border-amber-200 hover:border-amber-300" : "border-gray-100 hover:border-blue-200"}`}>
      {/* Color bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${cfg.gradient}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-13 h-13 w-12 h-12 bg-gradient-to-br ${cfg.gradient} rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md ring-4 ${cfg.ring}`}>
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-gray-800">{customer.name}</h3>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Hash size={10} />{customer.id}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border} flex-shrink-0`}>
            <TypeIcon size={11} />
            {cfg.label}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500"><Phone size={13} className="text-blue-400 flex-shrink-0" />{customer.phone}</div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail size={13} className="text-blue-400 flex-shrink-0" /><span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} className="text-blue-400 flex-shrink-0" />{customer.address}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-green-50 rounded-xl px-2.5 py-2 text-center">
            <p className="font-black text-green-700 text-xs">{customer.totalPurchases.toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-0.5">ج.م</p>
          </div>
          <div className="bg-blue-50 rounded-xl px-2.5 py-2 text-center">
            <p className="font-black text-blue-700 text-xs">{customer.orders}</p>
            <p className="text-gray-400 text-xs mt-0.5">فاتورة</p>
          </div>
          <div className={`rounded-xl px-2.5 py-2 text-center ${customer.overdueBalance > 0 ? "bg-red-50" : "bg-gray-50"}`}>
            <p className={`font-black text-xs ${customer.overdueBalance > 0 ? "text-red-600" : "text-gray-400"}`}>{customer.overdueBalance > 0 ? customer.overdueBalance.toLocaleString() : "—"}</p>
            <p className="text-gray-400 text-xs mt-0.5">متأخر</p>
          </div>
        </div>

        {customer.overdueBalance > 0 && (
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 mb-3">
            <AlertCircle size={12} className="text-red-500 flex-shrink-0" />
            <span className="text-xs text-red-600 font-bold">رصيد متأخر: {customer.overdueBalance.toLocaleString()} ج.م</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Clock size={11} /><span>آخر زيارة: {customer.lastVisit}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onView} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors shadow-sm">
            <Eye size={13} />البروفايل الكامل
          </button>
          <a href={`https://wa.me/${waPhone}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors flex-shrink-0" title="واتساب">
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(() => getStoredCustomers());
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState<"الكل" | "VIP" | "عادي" | "متأخر">("الكل");
  const [showAdd, setShowAdd]     = useState(false);

  const handleAdd = (c: typeof CUSTOMERS_DATA[0]) => {
    const updated = [c, ...customers];
    setCustomers(updated);
    saveStoredCustomers(updated);
  };

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "الكل" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const counts = {
    الكل:   customers.length,
    VIP:    customers.filter(c => c.type === "VIP").length,
    عادي:   customers.filter(c => c.type === "عادي").length,
    متأخر:  customers.filter(c => c.type === "متأخر").length,
  };

  const totalRevenue = customers.reduce((s, c) => s + c.totalPurchases, 0);
  const totalPending = customers.reduce((s, c) => s + c.overdueBalance, 0);
  const totalOrders  = customers.reduce((s, c) => s + c.orders, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <User size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-800">إدارة العملاء</h1>
            <p className="text-gray-400 text-sm mt-0.5">عرض وإدارة بيانات العملاء</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold text-sm shadow-lg shadow-blue-200">
          <UserPlus size={16} />عميل جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: "إجمالي العملاء",  value: customers.length,      sub: "عميل مسجل",     color: "text-blue-600",   bg: "bg-blue-50",   Icon: User },
          { label: "إجمالي الطلبات",  value: totalOrders,           sub: "فاتورة",        color: "text-purple-600", bg: "bg-purple-50", Icon: FileText },
          { label: "إجمالي الإيرادات",value: `${totalRevenue.toLocaleString()} ج.م`, sub: "من كل العملاء", color: "text-green-600",  bg: "bg-green-50",  Icon: TrendingUp },
          { label: "رصيد متأخر",       value: `${totalPending.toLocaleString()} ج.م`, sub: `${counts.متأخر} عملاء`, color: totalPending > 0 ? "text-red-600" : "text-gray-400", bg: totalPending > 0 ? "bg-red-50" : "bg-gray-50", Icon: AlertCircle },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">{card.label}</p>
              <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center`}><card.Icon size={14} className={card.color} /></div>
            </div>
            <p className={`font-black text-xl ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
          <input type="text" placeholder="ابحث بالاسم أو رقم الهاتف أو الكود..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm transition-colors" />
        </div>
        <div className="flex gap-2">
          {(["الكل", "VIP", "عادي", "متأخر"] as const).map(t => {
            const cfg = t !== "الكل" ? TYPE_CFG[t] : null;
            const Icon = cfg?.Icon;
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 whitespace-nowrap ${
                  typeFilter === t
                    ? t === "الكل"   ? "bg-gray-800 text-white border-gray-800"
                    : t === "VIP"    ? "bg-amber-500 text-white border-amber-500 shadow shadow-amber-200"
                    : t === "متأخر" ? "bg-red-500 text-white border-red-500 shadow shadow-red-200"
                    :                  "bg-blue-600 text-white border-blue-600 shadow shadow-blue-200"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"}`}>
                {Icon && <Icon size={13} />}
                {t}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${typeFilter === t ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>{counts[t]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <User size={48} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400">لا يوجد عملاء مطابقون للبحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(customer => (
            <CustomerCard key={customer.id} customer={customer} onView={() => navigate(`/customers/${customer.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}