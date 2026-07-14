<div align="center">

# 🔧 Auto Parts Management System
# نظام إدارة قطع الغيار

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
</p>

**A complete Arabic-first management system for auto parts stores and warehouses**  
**نظام إدارة متكامل لمحلات ومستودعات قطع غيار السيارات**

Full Arabic UI · RTL Support · No Server Required · Runs Entirely in the Browser  
واجهة عربية كاملة · دعم RTL · بدون خادم · يعمل في المتصفح مباشرة

</div>

---

## 🌐 Language / اللغة

- [English](#english)
- [العربية](#arabic)

---

<a name="english"></a>

# 📖 English Documentation

## Overview

**Auto Parts MS** is a professional web application built with React and TypeScript, designed specifically for auto parts store and warehouse owners. It provides comprehensive tools for inventory management, invoicing, customer tracking, and performance analysis — all through a fully Arabic RTL interface.

> No server or external database required. All data is stored locally in the browser via `localStorage`.

---

## Pages & Features

### 🏠 Dashboard
The main page displaying a complete business overview:
- Total sales, invoice count, inventory value, and customer receivables
- Monthly revenue bar chart
- Top-selling parts list
- Recent orders and latest invoices
- Skeleton loading on first render

### 📦 Inventory Management
Full warehouse management for auto parts:
- View all parts with quantity, price, and stock status
- Search and filter by category and status
- Inline editing for quantities and prices
- Automatic low-stock alerts based on minimum thresholds
- Delete with confirmation (AlertDialog)
- Import and export data as CSV

### ➕ Add New Part
Form to register new parts in inventory:
- Part name, code, category, and supplier
- Cost price, selling price, and quantity
- Minimum stock threshold for automatic alerts
- Auto-calculates status: Available / Low / Critical

### 🧾 Invoices
Complete record of all issued invoices:
- View invoices with status (Paid / Pending / Cancelled)
- Search by customer name or invoice number
- Filter by status and date
- Expand invoice to view full item details
- Create new invoices directly from this section

### 📝 Create Invoice
Full-featured invoice editor:
- Search for existing customers or add a new one on the spot
- Search parts from inventory and add them to the invoice cart
- Apply percentage or fixed-value discounts
- Set payment status: Paid / Partial / Pending
- Preview invoice before saving
- Print a professional invoice ready for delivery
- Auto-save draft to resume later

### 💳 Invoice Settlement
Dedicated interface for settling customer balances:
- Search a customer and view all their invoices
- Clear display of pending vs. settled invoices
- Full or partial payment with remaining balance tracking
- Confirm payment with option to print a payment receipt
- Instant update of customer balance and invoice status

### 👥 Customers
Customer database:
- View all customers with their classification (VIP / Regular / Overdue)
- Total purchases and overdue balance per customer
- Search and filter by type and name
- Quick-add new customers

### 👤 Customer Profile
Detailed page for each customer:
- Full contact details and registration date
- All invoices with expandable item details
- Purchase statistics: total sales, paid, and overdue
- Monthly purchase chart
- Pre-filled WhatsApp message with account statement

### 📊 Reports
Performance analytics and statistics:
- Monthly revenue bar chart
- Sales distribution by category (pie chart)
- Top-selling parts ranking
- Full financial summary: revenue, costs, net profit
- Inventory status report

### ⚙️ Settings
System customization:
- Store name, address, phone, and text logo
- Data appears on all printed invoices
- Reset all application data

---

## Technical Features

| Feature | Details |
|---------|---------|
| **Dark Mode** | Instant toggle between light and dark themes, preference saved |
| **Global Search** | `Ctrl+K` searches all parts, invoices, and customers |
| **Notifications** | Auto-alerts for low stock and overdue invoices |
| **Skeleton Loading** | Professional loading screens before data appears |
| **Empty States** | Clear messages when no data is available |
| **Delete Confirmation** | AlertDialog before any delete operation |
| **Breadcrumb Navigation** | Location path shown on every page |
| **CSV Import / Export** | Inventory backup and report export |
| **Invoice Printing** | Professional print template via browser |
| **Draft Auto-Save** | Resume unfinished invoices |
| **Cairo Font** | Modern Arabic typeface for excellent readability |

---

## Tech Stack

```
Frontend Framework    React 18 + TypeScript
Build Tool            Vite 6
Styling               Tailwind CSS 4
UI Components         Radix UI (Dialog, Popover, AlertDialog, Tabs…)
Charts                Recharts
Icons                 Lucide React
Animation             Motion (Framer Motion)
Routing               React Router 6
Data Storage          localStorage (browser-native)
Font                  Google Fonts – Cairo
```

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── Inventory.tsx           # Inventory management
│   │   ├── AddPart.tsx             # Add new part
│   │   ├── Invoices.tsx            # Invoice list
│   │   ├── CreateInvoice.tsx       # Invoice editor
│   │   ├── InvoiceSettlement.tsx   # Payment settlement
│   │   ├── Customers.tsx           # Customer list
│   │   ├── CustomerProfile.tsx     # Customer detail page
│   │   ├── Reports.tsx             # Analytics & reports
│   │   ├── Settings.tsx            # System settings
│   │   ├── GlobalSearch.tsx        # Global search modal
│   │   ├── PrintInvoice.tsx        # Print invoice template
│   │   ├── Layout.tsx              # App shell (Sidebar + Header)
│   │   └── ui/                     # Radix UI / Shadcn components
│   ├── context/
│   │   ├── PartsContext.tsx         # Global inventory state
│   │   └── SettingsContext.tsx      # Store settings state
│   ├── hooks/
│   │   ├── useLocalStorage.ts      # Persistent local storage
│   │   ├── useNotifications.ts     # Notification system
│   │   └── useTheme.ts             # Dark mode manager
│   ├── App.tsx                     # Application entry point
│   └── routes.tsx                  # Route definitions
├── styles/
│   ├── fonts.css                   # Cairo font import
│   ├── theme.css                   # Color tokens & design system
│   └── index.css                   # Tailwind base
└── types/
    └── database.types.ts           # Shared TypeScript interfaces
```

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/auto-parts-ms.git
cd auto-parts-ms

# 2. Install dependencies
pnpm install
# or: npm install

# 3. Start the development server
pnpm dev
# or: npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## Important Notes

- **Local storage only:** All data is saved in the browser's `localStorage`. Clearing browser data will erase everything — use the CSV export feature for regular backups.
- **Single-user system:** Designed for individual use on one device. No authentication or multi-user support.
- **Printing:** Uses the browser's built-in `window.print()`. Ensure your browser and printer support Arabic text rendering.

---

## Roadmap

- [ ] Migrate storage to **SQLite + Electron** for a desktop app experience
- [ ] **Multi-user support** with role-based permissions
- [ ] **Automatic cloud backup**
- [ ] **Mobile app** via React Native

---

<a name="arabic"></a>

---

# 📖 التوثيق بالعربية

## نظرة عامة

**Auto Parts MS** هو تطبيق ويب احترافي مبني بـ React و TypeScript، مصمم خصيصاً لأصحاب محلات ومستودعات قطع غيار السيارات. يوفر النظام أدوات شاملة لإدارة المخزون، إصدار الفواتير، متابعة العملاء، وتحليل الأداء — كل ذلك من خلال واجهة عربية كاملة تدعم الاتجاه من اليمين لليسار (RTL).

> لا يحتاج النظام إلى خادم أو قاعدة بيانات خارجية — جميع البيانات محفوظة محلياً في المتصفح عبر `localStorage`.

---

## الأقسام والصفحات

### 🏠 لوحة التحكم
الصفحة الرئيسية التي تعرض ملخصاً شاملاً لحالة النشاط التجاري:
- إجمالي المبيعات، عدد الفواتير، قيمة المخزون، ومستحقات العملاء
- مخطط بياني للإيرادات الشهرية
- قائمة أكثر القطع مبيعاً
- آخر الطلبات والفواتير الحديثة
- Skeleton Loading عند أول تحميل للبيانات

### 📦 إدارة المخزون
إدارة كاملة لمستودع قطع الغيار:
- عرض جميع القطع مع الكمية والسعر والحالة
- بحث وفلترة حسب التصنيف والحالة
- تعديل الكميات والأسعار مباشرة
- تنبيهات تلقائية للقطع المنخفضة عن الحد الأدنى
- حذف القطع مع تأكيد عبر AlertDialog
- استيراد وتصدير البيانات بصيغة CSV

### ➕ إضافة قطعة جديدة
نموذج إضافة قطع الغيار للمخزون:
- اسم القطعة، الكود، التصنيف، المورد
- سعر التكلفة وسعر البيع والكمية
- تحديد الحد الأدنى للمخزون لتفعيل التنبيهات
- حساب تلقائي للحالة: متوفر / منخفض / ينفذ

### 🧾 الفواتير
سجل شامل لجميع الفواتير:
- عرض الفواتير مع الحالة (مدفوع / معلق / ملغي)
- بحث حسب اسم العميل أو رقم الفاتورة
- فلترة حسب الحالة والتاريخ
- توسيع أي فاتورة لعرض تفاصيل الأصناف والكميات
- إنشاء فواتير جديدة من داخل القسم

### 📝 إنشاء فاتورة
محرر متكامل لإصدار الفواتير:
- البحث عن عميل موجود أو إضافة عميل جديد فوراً
- البحث عن قطع الغيار من المخزون وإضافتها للفاتورة
- تطبيق خصم بالنسبة المئوية أو بالقيمة الثابتة
- تحديد حالة الدفع: مدفوع / جزئي / معلق
- معاينة الفاتورة قبل الحفظ النهائي
- طباعة فاتورة احترافية جاهزة للتسليم
- حفظ مسودة تلقائي لاسترجاعها لاحقاً

### 💳 تسديد الفواتير
واجهة متخصصة لتسوية مستحقات العملاء:
- البحث عن عميل واستعراض جميع فواتيره
- عرض واضح للفواتير المعلقة والمسددة
- دفع كامل أو جزئي مع تتبع الرصيد المتبقي
- تأكيد التسديد مع خيار طباعة إيصال الدفع
- تحديث فوري لرصيد العميل وحالة الفاتورة

### 👥 إدارة العملاء
قاعدة بيانات العملاء:
- عرض جميع العملاء مع تصنيفهم: VIP / عادي / متأخر الدفع
- إجمالي المشتريات والرصيد المتأخر لكل عميل
- بحث وفلترة حسب النوع والاسم
- إضافة عملاء جدد بسرعة

### 👤 ملف العميل
صفحة تفصيلية لكل عميل:
- بيانات الاتصال الكاملة وتاريخ التسجيل
- جميع الفواتير مع إمكانية توسيع كل فاتورة لعرض تفاصيلها
- إحصائيات الشراء: إجمالي المبيعات، المدفوع، المتأخر
- مخطط شهري لمشتريات العميل
- إرسال رسالة واتساب جاهزة بكشف الحساب

### 📊 التقارير
تحليلات وإحصائيات الأداء:
- مخطط الإيرادات الشهرية
- توزيع المبيعات حسب التصنيف (مخطط دائري)
- أكثر القطع مبيعاً
- ملخص مالي شامل: إيرادات، تكاليف، صافي الربح
- تقرير حالة المخزون

### ⚙️ الإعدادات
تخصيص النظام:
- اسم المحل، العنوان، رقم الهاتف، الشعار النصي
- هذه البيانات تظهر في جميع قوالب الطباعة
- إعادة تعيين جميع بيانات التطبيق

---

## الميزات التقنية

| الميزة | التفاصيل |
|--------|---------|
| **Dark Mode** | تبديل فوري بين الوضع الفاتح والداكن مع حفظ التفضيل |
| **بحث عام** | `Ctrl+K` للبحث في القطع والفواتير والعملاء |
| **نظام إشعارات** | تنبيهات تلقائية للمخزون المنخفض والفواتير المتأخرة |
| **Skeleton Loading** | شاشات تحميل احترافية قبل ظهور البيانات |
| **Empty States** | رسائل واضحة عند غياب البيانات |
| **تأكيد الحذف** | AlertDialog قبل أي عملية حذف |
| **Breadcrumb** | مسار التنقل في كل صفحة |
| **استيراد/تصدير CSV** | نسخ احتياطي وتصدير التقارير |
| **طباعة الفواتير** | قالب طباعة احترافي مباشر من المتصفح |
| **حفظ المسودات** | استرجاع الفواتير غير المكتملة |
| **خط Cairo** | خط عربي عصري لتجربة قراءة ممتازة |

---

## التقنيات المستخدمة

```
إطار العمل        React 18 + TypeScript
أداة البناء       Vite 6
التنسيق           Tailwind CSS 4
مكونات الواجهة    Radix UI (Dialog, Popover, AlertDialog, Tabs…)
الرسوم البيانية   Recharts
الأيقونات         Lucide React
الحركة            Motion (Framer Motion)
التوجيه           React Router 6
تخزين البيانات    localStorage
الخط              Google Fonts – Cairo
```

---

## تشغيل المشروع محلياً

```bash
# 1. نسخ المستودع
git clone https://github.com/your-username/auto-parts-ms.git
cd auto-parts-ms

# 2. تثبيت الحزم
pnpm install
# أو: npm install

# 3. تشغيل بيئة التطوير
pnpm dev
# أو: npm run dev

# 4. فتح المتصفح على
# http://localhost:5173
```

---

## ملاحظات مهمة

- **تخزين محلي فقط:** البيانات محفوظة في `localStorage` داخل المتصفح. مسح بيانات المتصفح يعني فقدان كل البيانات — يُنصح بالتصدير الدوري عبر CSV.
- **نظام مستخدم واحد:** مصمم للاستخدام الفردي على جهاز واحد بدون نظام تسجيل دخول.
- **الطباعة:** تعمل عبر `window.print()` المدمج في المتصفح.

---

## خارطة التطوير المستقبلي

- [ ] تحويل التخزين إلى **SQLite + Electron** للاستخدام كتطبيق سطح مكتب
- [ ] نظام **متعدد المستخدمين** مع صلاحيات مختلفة
- [ ] **نسخ احتياطي تلقائي** على السحابة
- [ ] **تطبيق موبايل** عبر React Native

---

## الترخيص · License

This project is available for free personal and commercial use.  
هذا المشروع متاح للاستخدام الشخصي والتجاري بحرية.

---

<div align="center">

Made with ❤️ for Arabic auto parts store owners  
صُنع بـ ❤️ لخدمة أصحاب محلات قطع الغيار العرب

</div>
