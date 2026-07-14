import { useState, useRef, useEffect } from "react";
import {
  Search, Phone, FileText, Calendar, Package, CheckCircle2, AlertCircle,
  ChevronDown, ChevronUp, X, Hash, User, Crown, BadgeAlert,
  CircleDollarSign, Banknote, ReceiptText, MapPin, Clock,
  Printer, Check, TrendingUp, Wallet,
} from "lucide-react";
import { getStoredCustomers, saveStoredCustomers, CustomerData } from "./CustomerProfile";

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
type Customer = CustomerData;
type Invoice  = Customer["invoices"][0];

interface ConfirmDialog {
  invoiceId: string;
  amount: number;
}

/* ══════════════════════════════════════════════
   TYPE CONFIG
══════════════════════════════════════════════ */
const TYPE_CFG = {
  VIP:   { bg: "bg-amber-100",  text: "text-amber-800",  Icon: Crown,      grad: "from-amber-400 to-yellow-400" },
  عادي:  { bg: "bg-blue-100",   text: "text-blue-700",   Icon: User,       grad: "from-blue-500 to-indigo-500"  },
  متأخر: { bg: "bg-red-100",    text: "text-red-700",    Icon: BadgeAlert, grad: "from-red-500 to-rose-500"    },
};

/* ══════════════════════════════════════════════
   RECEIPT PRINT
══════════════════════════════════════════════ */
function printReceipt(customer: Customer, inv: Invoice, amountPaid: number, previousPaid: number, remaining: number) {
  const win = window.open("", "_blank", "width=700,height=750");
  if (!win) return;
  const itemRows = inv.items.map(item =>
    `<tr>
      <td style="padding:8px 14px;border-bottom:1px solid #f0f0f0">${item.name}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #f0f0f0;text-align:center">${item.qty}</td>
      <td style="padding:8px 14px;border-bottom:1px solid #f0f0f0;text-align:center">${item.price.toLocaleString()} ج.م</td>
      <td style="padding:8px 14px;border-bottom:1px solid #f0f0f0;text-align:left;font-weight:bold">${(item.qty * item.price).toLocaleString()} ج.م</td>
    </tr>`
  ).join("");
  win.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>إيصال تسديد ${inv.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a2e; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
    .badge { background: #2563eb; color: #fff; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: bold; }
    .section { background: #f8faff; border-radius: 10px; padding: 16px; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #2563eb; color: #fff; }
    th { padding: 10px 14px; text-align: right; font-size: 13px; }
    .total-row { font-size: 18px; font-weight: 900; color: #2563eb; }
    .paid { color: #16a34a; font-weight: bold; }
    .remaining { color: ${remaining > 0 ? "#ef4444" : "#16a34a"}; font-weight: bold; }
    .footer { margin-top: 40px; text-align: center; color: #ccc; font-size: 12px; border-top: 1px solid #eee; padding-top: 16px; }
  </style></head>
  <body>
    <div class="header">
      <div>
        <h1 style="margin:0;color:#2563eb;font-size:22px">إيصال تسديد فاتورة</h1>
        <p style="color:#888;margin:4px 0;font-size:13px">رقم الفاتورة: <strong>${inv.id}</strong> &nbsp;|&nbsp; التاريخ: <strong>${new Date().toISOString().slice(0,10)}</strong></p>
      </div>
      <span class="badge">${remaining <= 0 ? "✓ مسدد بالكامل" : "دفع جزئي"}</span>
    </div>
    <div class="section" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div><small style="color:#888">اسم العميل</small><br><strong style="font-size:15px">${customer.name}</strong></div>
      <div><small style="color:#888">رقم الهاتف</small><br><strong>${customer.phone}</strong></div>
      <div><small style="color:#888">تاريخ الفاتورة الأصلية</small><br><strong>${inv.date}</strong></div>
      <div><small style="color:#888">تصنيف العميل</small><br><strong>${customer.type}</strong></div>
    </div>
    <table>
      <thead><tr><th>الصنف</th><th style="text-align:center">الكمية</th><th style="text-align:center">السعر</th><th style="text-align:left">الإجمالي</th></tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div class="section" style="margin-top:20px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#888">إجمالي الفاتورة</span><strong>${inv.total.toLocaleString()} ج.م</strong></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="color:#888">المدفوع سابقاً</span><strong class="paid">${previousPaid.toLocaleString()} ج.م</strong></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:17px"><span style="color:#888">المسدد الآن</span><strong class="paid">+ ${amountPaid.toLocaleString()} ج.م</strong></div>
      <div style="display:flex;justify-content:space-between;border-top:2px solid #e5e7eb;padding-top:10px;margin-top:4px"><span class="total-row">المتبقي بعد التسديد</span><span class="remaining">${remaining > 0 ? remaining.toLocaleString() + " ج.م" : "صفر — مسدد بالكامل ✓"}</span></div>
    </div>
    <div class="footer">نظام إدارة قطع الغيار — شكراً لثقتكم</div>
    <script>window.onload=()=>{window.print();window.close();}</script>
  </body></html>`);
  win.document.close();
}

/* ══════════════════════════════════════════════
   CONFIRM DIALOG
══════════════════════════════════════════════ */
function ConfirmPaymentDialog({ customer, inv, amount, currentPaid, onConfirm, onCancel }: {
  customer: Customer;
  inv: Invoice;
  amount: number;
  currentPaid: number;
  onConfirm: (printReceipt: boolean) => void;
  onCancel: () => void;
}) {
  const remaining = inv.total - currentPaid - amount;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Top */}
        <div className="bg-gradient-to-l from-blue-700 to-blue-600 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <CircleDollarSign size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg">تأكيد التسديد</h3>
              <p className="text-blue-200 text-sm">{inv.id} — {customer.name}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Amount highlight */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-5 py-4 text-center mb-5">
            <p className="text-sm text-gray-500 mb-1">البلغ المُسدَّد</p>
            <p className="font-black text-green-700 text-4xl">{amount.toLocaleString()}<span className="text-xl mr-1">ج.م</span></p>
            {remaining <= 0
              ? <p className="text-green-600 text-sm mt-2 font-bold flex items-center justify-center gap-1"><CheckCircle2 size={14} />سيتم تسديد الفاتورة بالكامل</p>
              : <p className="text-orange-500 text-sm mt-2 font-medium">سيتبقى {remaining.toLocaleString()} ج.م بعد التسديد</p>}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">إجمالي الفاتورة</span>
              <span className="font-bold text-gray-700">{inv.total.toLocaleString()} ج.م</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">المدفوع مسبقاً</span>
              <span className="font-bold text-gray-600">{currentPaid.toLocaleString()} ج.م</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-400">الباقي قبل التسديد</span>
              <span className="font-bold text-red-600">{(inv.total - currentPaid).toLocaleString()} ج.م</span>
            </div>
          </div>

          {/* Question */}
          <p className="text-center text-sm font-bold text-gray-700 mb-4">هل تريد إنشاء إيصال تسديد مطبوع؟</p>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => onConfirm(false)}
              className="py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Check size={15} />بدون إيصال
            </button>
            <button onClick={() => onConfirm(true)}
              className="py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-200">
              <Printer size={15} />نعم، اطبع إيصال
            </button>
          </div>
          <button onClick={onCancel} className="w-full mt-2.5 py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors">إلغاء</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   INVOICE ROW (styled like Invoices section)
══════════════════════════════════════════════ */
function InvoiceRow({ inv, paidOverride, onSettle }: {
  inv: Invoice;
  paidOverride?: number;
  onSettle: (amount: number) => void;
}) {
  const [expanded, setExpanded]   = useState(false);
  const [inputVal, setInputVal]   = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const paidSoFar  = paidOverride ?? inv.paid;
  const remaining  = Math.max(0, inv.total - paidSoFar);
  const isPaid     = remaining <= 0;
  const payNum     = parseFloat(inputVal) || 0;
  const afterPay   = Math.max(0, remaining - payNum);
  const isValid    = payNum > 0 && payNum <= remaining;

  const handleExpand = () => {
    setExpanded(e => !e);
    if (!expanded && !isPaid) setTimeout(() => inputRef.current?.focus(), 150);
  };

  return (
    <div className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
      isPaid
        ? "border-green-200 bg-white"
        : expanded
          ? "border-red-400 shadow-lg shadow-red-100"
          : "border-red-200 bg-red-50/40 hover:border-red-400 hover:shadow-md hover:shadow-red-50 cursor-pointer"
    }`}>

      {/* ── ROW HEADER ── */}
      <div className="flex items-center gap-3 px-5 py-4" onClick={handleExpand}>

        {/* Status icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPaid ? "bg-green-100" : "bg-red-100"}`}>
          {isPaid
            ? <CheckCircle2 size={20} className="text-green-600" />
            : <AlertCircle size={20} className="text-red-500" />}
        </div>

        {/* Invoice ID + date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-gray-800">{inv.id}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isPaid ? "مسدد" : "��ير مسدد"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10} />{inv.date}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1"><Package size={10} />{inv.items.length} أصناف</span>
          </div>
        </div>

        {/* Amounts */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-left hidden sm:block">
            <p className="text-xs text-gray-400">إجمالي الفاتورة</p>
            <p className="font-black text-gray-800">{inv.total.toLocaleString()} ج.م</p>
          </div>
          {!isPaid && (
            <div className="text-left">
              <p className="text-xs text-red-400">الباقي</p>
              <p className="font-black text-red-600">{remaining.toLocaleString()} ج.م</p>
            </div>
          )}
          {isPaid && (
            <div className="text-left">
              <p className="text-xs text-green-500 font-bold flex items-center gap-1"><CheckCircle2 size={11} />مسدد بالكامل</p>
            </div>
          )}
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            {expanded ? <ChevronUp size={15} className="text-gray-500" /> : <ChevronDown size={15} className="text-gray-500" />}
          </button>
        </div>
      </div>

      {/* ── EXPANDED ── */}
      {expanded && (
        <div className="border-t border-gray-100">

          {/* Items table */}
          <div className="px-5 py-4 bg-gray-50/60">
            <p className="text-xs font-black text-gray-500 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
              <Package size={12} />تفاصيل الأصناف
            </p>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-xs text-gray-500">
                    <th className="px-4 py-2.5 text-right font-bold">اسم الصنف</th>
                    <th className="px-4 py-2.5 text-center font-bold">الكمية</th>
                    <th className="px-4 py-2.5 text-center font-bold">سعر القطعة</th>
                    <th className="px-4 py-2.5 text-left font-bold">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {inv.items.map((item, i) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package size={11} className="text-blue-500" />
                          </div>
                          <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg">{item.qty}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{item.price.toLocaleString()} ج.م</td>
                      <td className="px-4 py-3 text-left">
                        <span className="font-black text-blue-700 text-sm">{(item.qty * item.price).toLocaleString()} ج.م</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-600">
                    <td colSpan={3} className="px-4 py-2.5 text-right text-white font-bold text-sm">إجمالي الفاتورة</td>
                    <td className="px-4 py-2.5 text-left text-white font-black">{inv.total.toLocaleString()} ج.م</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Balance summary */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="bg-white rounded-xl border-2 border-gray-200 px-3 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">سعر الفاتورة</p>
                <p className="font-black text-gray-800 text-xl">{inv.total.toLocaleString()}</p>
                <p className="text-xs font-bold text-gray-400">ج.م</p>
              </div>
              <div className="bg-green-50 rounded-xl border-2 border-green-200 px-3 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">دُفع</p>
                <p className="font-black text-green-600 text-xl">{paidSoFar.toLocaleString()}</p>
                <p className="text-xs font-bold text-green-400">ج.م</p>
              </div>
              <div className={`rounded-xl border-2 px-3 py-3 text-center ${isPaid ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
                <p className="text-xs text-gray-400 mb-1">الباقي</p>
                <p className={`font-black text-xl ${isPaid ? "text-green-600" : "text-red-600"}`}>{remaining.toLocaleString()}</p>
                <p className={`text-xs font-bold ${isPaid ? "text-green-400" : "text-red-400"}`}>ج.م</p>
              </div>
            </div>
          </div>

          {/* Payment input */}
          {!isPaid && (
            <div className="px-5 py-4 bg-white border-t border-red-100">
              <p className="text-xs font-black text-gray-600 mb-3 flex items-center gap-1.5">
                <Banknote size={13} className="text-green-500" />أدخل مبلغ التسديد
              </p>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">ج.م</span>
                    <input
                      ref={inputRef}
                      type="number"
                      min="1"
                      max={remaining}
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      placeholder={`أقصى مبلغ ${remaining.toLocaleString()}`}
                      className={`w-full pr-12 pl-4 py-3 border-2 rounded-xl text-lg font-black outline-none transition-all ${
                        inputVal && !isValid
                          ? "border-red-400 bg-red-50 text-red-700"
                          : isValid
                            ? "border-green-400 bg-green-50 text-green-800"
                            : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                  </div>
                  {/* Live feedback */}
                  {isValid && (
                    <p className={`mt-1.5 text-xs font-bold flex items-center gap-1 ${afterPay === 0 ? "text-green-600" : "text-orange-500"}`}>
                      {afterPay === 0
                        ? <><CheckCircle2 size={12} />سيتم تسديد الفاتورة بالكامل</>
                        : <><Clock size={12} />سيتبقى {afterPay.toLocaleString()} ج.م بعد التسديد</>}
                    </p>
                  )}
                  {inputVal && !isValid && payNum > 0 && (
                    <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />المبلغ أكبر من الباقي ({remaining.toLocaleString()} ج.م)
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setInputVal(String(remaining))}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-colors whitespace-nowrap">
                    تسديد كامل
                  </button>
                </div>
              </div>
              <button
                onClick={() => isValid && onSettle(payNum)}
                disabled={!isValid}
                className={`w-full mt-3 py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all ${
                  isValid
                    ? "bg-gradient-to-l from-green-600 to-emerald-500 text-white shadow-lg shadow-green-200 hover:shadow-xl active:scale-[0.98]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <CircleDollarSign size={18} />
                {isValid ? `تأكيد تسديد ${payNum.toLocaleString()} ج.م` : "أدخل المبلغ للتسديد"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════��═════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function InvoiceSettlement() {
  const [query, setQuery]           = useState("");
  const [dropOpen, setDropOpen]     = useState(false);
  const [allCustomers, setAllCustomers] = useState<Customer[]>(() => getStoredCustomers());
  const [customer, setCustomer]     = useState<Customer | null>(null);
  const [paidMap, setPaidMap]       = useState<Record<string, number>>({});
  const [confirmData, setConfirmData] = useState<ConfirmDialog | null>(null);
  const [successId, setSuccessId]   = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectCustomer = (c: Customer) => {
    setCustomer(c);
    setQuery(c.name);
    setDropOpen(false);
    setPaidMap({});
    setSuccessId(null);
    setConfirmData(null);
  };

  const clearCustomer = () => {
    setCustomer(null); setQuery(""); setPaidMap({}); setSuccessId(null);
  };

  const results = allCustomers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query)
  );

  /* get live paid amount for an invoice */
  const getPaid = (inv: Invoice) => paidMap[inv.id] ?? inv.paid;

  /* called when user presses the green settle button */
  const handleSettleClick = (invId: string, amount: number) => {
    setConfirmData({ invoiceId: invId, amount });
  };

  /* called after confirm dialog */
  const handleConfirm = (shouldPrint: boolean) => {
    if (!confirmData || !customer) return;
    const inv     = customer.invoices.find(i => i.id === confirmData.invoiceId)!;
    const oldPaid = getPaid(inv);
    const newPaid = Math.min(oldPaid + confirmData.amount, inv.total);
    const remaining = inv.total - newPaid;

    // 1. Update paidMap for immediate UI feedback
    setPaidMap(p => ({ ...p, [confirmData.invoiceId]: newPaid }));

    // 2. Persist settlement to localStorage so all other pages reflect it
    const updatedCustomers = allCustomers.map(c => {
      if (c.id !== customer.id) return c;
      const updatedInvoices = c.invoices.map(i => {
        if (i.id !== confirmData.invoiceId) return i;
        return {
          ...i,
          paid: newPaid,
          status: newPaid >= i.total ? ("مدفوع" as const) : ("معلق" as const),
        };
      });
      const totalDebt = updatedInvoices.reduce((s, i) => s + Math.max(0, i.total - i.paid), 0);
      return {
        ...c,
        invoices: updatedInvoices,
        overdueBalance: totalDebt,
        type: totalDebt > 0 && c.type !== "VIP" ? ("متأخر" as const) : c.type,
      };
    });
    setAllCustomers(updatedCustomers);
    saveStoredCustomers(updatedCustomers);

    // 3. Update the selected customer reference so sidebar totals refresh
    const refreshed = updatedCustomers.find(c => c.id === customer.id) ?? customer;
    setCustomer(refreshed);

    setSuccessId(confirmData.invoiceId);
    if (shouldPrint) printReceipt(customer, inv, confirmData.amount, oldPaid, remaining);
    setConfirmData(null);
    setTimeout(() => setSuccessId(null), 3000);
  };

  /* derived */
  const invoices     = customer ? customer.invoices.map(inv => ({ ...inv, currentPaid: getPaid(inv) })) : [];
  const pending      = invoices.filter(i => (i.total - i.currentPaid) > 0);
  const settled      = invoices.filter(i => (i.total - i.currentPaid) <= 0);
  const totalDebt    = pending.reduce((s, i) => s + (i.total - i.currentPaid), 0);
  const cfg          = customer ? TYPE_CFG[customer.type] : null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">

      {/* Confirm dialog */}
      {confirmData && customer && (() => {
        const inv = customer.invoices.find(i => i.id === confirmData.invoiceId)!;
        return (
          <ConfirmPaymentDialog
            customer={customer} inv={inv} amount={confirmData.amount}
            currentPaid={getPaid(inv)}
            onConfirm={handleConfirm} onCancel={() => setConfirmData(null)}
          />
        );
      })()}

      {/* ── HEADER ── */}
      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
          <ReceiptText size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-800">تسديد الفواتير</h1>
          <p className="text-gray-400 text-sm mt-0.5">ابحث عن عميل لعرض فواتيره وتسديد المستحقات</p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div ref={searchRef} className="relative mb-6 max-w-2xl">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="ابحث باسم العميل أو رقم هاتفه..."
            value={query}
            onChange={e => { setQuery(e.target.value); setDropOpen(true); if (!e.target.value) clearCustomer(); }}
            onFocus={() => !customer && setDropOpen(true)}
            className="w-full pr-12 pl-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 outline-none font-medium transition-colors bg-white shadow-sm text-gray-800"
          />
          {query && (
            <button onClick={clearCustomer} className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
              <X size={13} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {dropOpen && query.length >= 1 && !customer && (
          <div className="absolute z-40 w-full mt-2 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
            {results.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400">لا يوجد عميل بهذا الاسم أو الرقم</div>
            ) : results.map(c => {
              const ccfg  = TYPE_CFG[c.type];
              const CIcon = ccfg.Icon;
              const debt  = c.invoices.reduce((s, i) => s + Math.max(0, i.total - i.paid), 0);
              return (
                <button key={c.id} onClick={() => selectCustomer(c)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-green-50 transition-colors text-right border-b border-gray-50 last:border-0">
                  <div className={`w-11 h-11 bg-gradient-to-br ${ccfg.grad} rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-800">{c.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${ccfg.bg} ${ccfg.text} flex items-center gap-1`}>
                        <CIcon size={10} />{c.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone size={10} />{c.phone}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {debt > 0
                      ? <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <AlertCircle size={11} />{debt.toLocaleString()} ج.م متأخر
                        </span>
                      : <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <CheckCircle2 size={11} />لا توجد مستحقات
                        </span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── EMPTY STATE ── */}
      {!customer && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-20 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-gray-300" />
          </div>
          <p className="font-bold text-gray-400 text-lg">ابحث عن عميل</p>
          <p className="text-sm text-gray-300 mt-1">اكتب الاسم أو رقم الهاتف في حقل البحث أعلاه</p>
        </div>
      )}

      {/* ── CUSTOMER SELECTED ── */}
      {customer && cfg && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">

          {/* ══ SIDEBAR ══ */}
          <div className="xl:col-span-1 flex flex-col gap-4">

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${cfg.grad}`} />
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${cfg.grad} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow`}>
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-gray-800">{customer.name}</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold mt-1 ${cfg.bg} ${cfg.text}`}>
                      <cfg.Icon size={11} />{customer.type}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Phone size={13} className="text-blue-400 flex-shrink-0" />{customer.phone}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={13} className="text-blue-400 flex-shrink-0" />{customer.address}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500"><Hash size={13} className="text-blue-400 flex-shrink-0" />{customer.id}</div>
                </div>
              </div>
            </div>

            {/* Financial summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-700 text-sm mb-3 flex items-center gap-2"><Wallet size={14} className="text-blue-500" />الملخص المالي</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between"><span className="text-xs text-gray-400">إجمالي الفواتير</span><span className="font-black text-sm text-gray-700">{invoices.reduce((s,i)=>s+i.total,0).toLocaleString()} ج.م</span></div>
                <div className="flex justify-between"><span className="text-xs text-gray-400">إجمالي المدفوع</span><span className="font-black text-sm text-green-600">{invoices.reduce((s,i)=>s+i.currentPaid,0).toLocaleString()} ج.م</span></div>
                <div className="flex justify-between border-t pt-2"><span className="text-xs text-red-400 font-bold">إجمالي المتأخر</span><span className={`font-black text-sm ${totalDebt > 0 ? "text-red-600" : "text-gray-400"}`}>{totalDebt.toLocaleString()} ج.م</span></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-red-100 p-3 text-center shadow-sm">
                <p className="text-xs text-gray-400 mb-1">معلقة</p>
                <p className="font-black text-red-600 text-3xl">{pending.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-green-100 p-3 text-center shadow-sm">
                <p className="text-xs text-gray-400 mb-1">مسددة</p>
                <p className="font-black text-green-600 text-3xl">{settled.length}</p>
              </div>
            </div>
          </div>

          {/* ══ INVOICES ══ */}
          <div className="xl:col-span-3 flex flex-col gap-5">

            {/* Success toast */}
            {successId && (
              <div className="flex items-center gap-3 bg-green-500 text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-green-200 animate-pulse">
                <CheckCircle2 size={20} />
                <span className="font-bold">تم تسديد الفاتورة {successId} بنجاح! ✓</span>
              </div>
            )}

            {/* Pending invoices */}
            {pending.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-red-500" />
                  <h3 className="font-black text-gray-800">الفواتير غير المسددة</h3>
                  <span className="bg-red-100 text-red-700 text-xs font-black px-2.5 py-0.5 rounded-full">{pending.length}</span>
                  <span className="mr-auto font-black text-red-600 text-sm">{totalDebt.toLocaleString()} ج.م</span>
                </div>
                <div className="flex flex-col gap-3">
                  {pending.map(inv => (
                    <InvoiceRow
                      key={inv.id}
                      inv={inv}
                      paidOverride={paidMap[inv.id]}
                      onSettle={amount => handleSettleClick(inv.id, amount)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Settled invoices */}
            {settled.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <h3 className="font-bold text-gray-500">الفواتير المسددة</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-black px-2.5 py-0.5 rounded-full">{settled.length}</span>
                </div>
                <div className="flex flex-col gap-3">
                  {settled.map(inv => (
                    <InvoiceRow
                      key={inv.id}
                      inv={inv}
                      paidOverride={paidMap[inv.id]}
                      onSettle={() => {}}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All clear */}
            {pending.length === 0 && settled.length > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-10 text-center mt-2">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <CheckCircle2 size={30} className="text-green-500" />
                </div>
                <p className="font-black text-green-700 text-lg">جميع الفواتير مسددة! 🎉</p>
                <p className="text-sm text-green-500 mt-1">لا توجد أي مستحقات على هذا العميل</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}