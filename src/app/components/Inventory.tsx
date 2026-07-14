import { useState, useEffect } from "react";
import { Search, Filter, Edit, Trash2, AlertCircle, Save, X, PackageX, Plus, Download, Upload, FileSpreadsheet, CheckCircle } from "lucide-react";
import { useParts } from "../context/PartsContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

function InventorySkeleton() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Import Dialog Component
function ImportDialog({ open, onClose, onImport }: {
  open: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [skippedRows, setSkippedRows] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        alert('الملف فارغ أو غير صالح');
        return;
      }

      // Skip header line
      const dataLines = lines.slice(1);
      const parsed: any[] = [];
      let skipped = 0;

      dataLines.forEach(line => {
        const cols = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));

        // Check if required fields exist (name, category, quantity, etc.)
        if (cols.length >= 7 && cols[1] && cols[2] && cols[3] && cols[4] && cols[5] && cols[6]) {
          parsed.push({
            partCode: cols[0] || '',
            name: cols[1],
            category: cols[2],
            quantity: parseInt(cols[3]) || 0,
            costPrice: parseFloat(cols[4]) || 0,
            sellPrice: parseFloat(cols[5]) || 0,
            supplier: cols[6],
            location: cols[7] || '',
          });
        } else {
          skipped++;
        }
      });

      setPreviewData(parsed);
      setSkippedRows(skipped);
    };

    reader.readAsText(selectedFile);
  };

  const handleConfirmImport = () => {
    onImport(previewData);
    setFile(null);
    setPreviewData([]);
    setSkippedRows(0);
    onClose();
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewData([]);
    setSkippedRows(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Upload size={24} className="text-blue-600" />
            استيراد قطع الغيار
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <FileSpreadsheet size={48} className="mx-auto mb-4 text-gray-400" />
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                اختر ملف CSV
              </span>
            </label>
            {file && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                الملف المحدد: <strong>{file.name}</strong>
              </p>
            )}
          </div>

          {/* Format Guide */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
            <p className="font-bold text-blue-900 dark:text-blue-200 mb-2">تنسيق الملف المطلوب:</p>
            <p className="text-blue-800 dark:text-blue-300">
              الكود، الاسم، الفئة، الكمية، سعر الشراء، سعر البيع، المورد، الموقع
            </p>
          </div>

          {/* Preview */}
          {previewData.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">معاينة البيانات ({previewData.length} صف)</h3>
                {skippedRows > 0 && (
                  <span className="text-sm text-orange-600 dark:text-orange-400">
                    تم تجاهل {skippedRows} صف بسبب بيانات ناقصة
                  </span>
                )}
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-right">الاسم</th>
                      <th className="px-3 py-2 text-right">الفئة</th>
                      <th className="px-3 py-2 text-right">الكمية</th>
                      <th className="px-3 py-2 text-right">سعر الشراء</th>
                      <th className="px-3 py-2 text-right">سعر البيع</th>
                      <th className="px-3 py-2 text-right">المورد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {previewData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-3 py-2">{row.name}</td>
                        <td className="px-3 py-2">{row.category}</td>
                        <td className="px-3 py-2">{row.quantity}</td>
                        <td className="px-3 py-2">{row.costPrice} ج.م</td>
                        <td className="px-3 py-2">{row.sellPrice} ج.م</td>
                        <td className="px-3 py-2">{row.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length > 10 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  معاينة أول 10 صفوف فقط من أصل {previewData.length}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row-reverse gap-2">
          <Button
            onClick={handleConfirmImport}
            disabled={previewData.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle size={16} className="ml-2" />
            تأكيد الاستيراد ({previewData.length})
          </Button>
          <Button onClick={handleCancel} variant="outline">
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Inventory() {
  const { parts, addPart, deletePart, updatePart, categories } = useParts();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("الكل");
  const [loading, setLoading] = useState(true);

  // Delete confirmation modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");

  // Import dialog state
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    category: "",
    quantity: "",
    unitPrice: "",
    costPrice: "",
    sellPrice: "",
    supplier: "",
  });

  // New item form state
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unitPrice: "",
    costPrice: "",
    sellPrice: "",
    supplier: "",
  });

  const filteredParts = parts.filter((part) => {
    const matchesSearch = part.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "الكل" || part.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متوفر":
        return "bg-green-100 text-green-700";
      case "منخفض":
        return "bg-yellow-100 text-yellow-700";
      case "ينفذ":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Calculate total automatically
  const calculateTotal = () => {
    const quantity = parseFloat(newItem.quantity) || 0;
    const unitPrice = parseFloat(newItem.unitPrice) || 0;
    return quantity * unitPrice;
  };

  // Handle adding new item
  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.unitPrice || !newItem.costPrice || !newItem.sellPrice || !newItem.supplier) {
      alert("من فضلك املأ جميع الحقول المطلوبة!");
      return;
    }

    addPart({
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity),
      unitPrice: parseFloat(newItem.unitPrice),
      costPrice: parseFloat(newItem.costPrice),
      sellPrice: parseFloat(newItem.sellPrice),
      supplier: newItem.supplier,
    });

    setNewItem({ name: "", category: "", quantity: "", unitPrice: "", costPrice: "", sellPrice: "", supplier: "" });
    alert("تم إضافة الصنف بنجاح!");
  };

  const handleDeletePart = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      deletePart(deleteTargetId);
      setDeleteTargetId(null);
      setDeleteTargetName("");
      setDeleteDialogOpen(false);
    }
  };

  const handleEditStart = (part: typeof parts[0]) => {
    setEditingId(part.id);
    setEditData({
      name: part.name,
      category: part.category,
      quantity: String(part.quantity),
      unitPrice: String(part.unitPrice),
      costPrice: String(part.costPrice),
      sellPrice: String(part.sellPrice),
      supplier: part.supplier,
    });
  };

  const handleEditSave = (id: string) => {
    updatePart(id, {
      name: editData.name,
      category: editData.category,
      quantity: parseInt(editData.quantity),
      unitPrice: parseFloat(editData.unitPrice),
      costPrice: parseFloat(editData.costPrice),
      sellPrice: parseFloat(editData.sellPrice),
      supplier: editData.supplier,
    });
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const cellInput = (field: keyof typeof editData, type = "text", placeholder = "") => (
    <input
      type={type}
      value={editData[field]}
      onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
      className="w-full px-2 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
      placeholder={placeholder}
      min={type === "number" ? "0" : undefined}
      step={type === "number" ? "0.01" : undefined}
    />
  );

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['الكود', 'الاسم', 'الفئة', 'الكمية', 'سعر الشراء', 'سعر البيع', 'المورد', 'الحالة', 'الموقع'];
    const csvRows = [headers.join(',')];

    parts.forEach(part => {
      const row = [
        part.partCode || part.id,
        `"${part.name}"`,
        `"${part.category}"`,
        part.quantity,
        part.costPrice,
        part.sellPrice,
        `"${part.supplier}"`,
        `"${part.status}"`,
        `"${part.location || ''}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `قطع_الغيار_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import from CSV
  const handleImportData = (data: any[]) => {
    data.forEach(item => {
      addPart({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.sellPrice, // Using sellPrice as unitPrice
        costPrice: item.costPrice,
        sellPrice: item.sellPrice,
        supplier: item.supplier,
        partCode: item.partCode,
        location: item.location,
      });
    });
    alert(`تم استيراد ${data.length} قطعة بنجاح!`);
  };

  if (loading) {
    return <InventorySkeleton />;
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-red-500" size={24} />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف <strong className="text-red-600">{deleteTargetName}</strong>؟
              <br />
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              حذف
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Dialog */}
      <ImportDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImport={handleImportData}
      />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">إدارة المخزون</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            عرض وإدارة جميع قطع الغيار المتوفرة
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
          >
            <Download size={18} />
            تصدير Excel
          </button>
          <button
            onClick={() => setImportDialogOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Upload size={18} />
            استيراد
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث عن قطعة غيار..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="الكل">الكل</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {filteredParts.length}
            </p>
            <p className="text-sm text-gray-600">إجمالي القطع</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {filteredParts.filter((p) => p.status === "متوفر").length}
            </p>
            <p className="text-sm text-gray-600">متوفر</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {filteredParts.filter((p) => p.status === "منخفض").length}
            </p>
            <p className="text-sm text-gray-600">منخفض</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {filteredParts.filter((p) => p.status === "ينفذ").length}
            </p>
            <p className="text-sm text-gray-600">ينفذ</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredParts.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center">
          <PackageX size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">لا توجد قطع غيار</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery || categoryFilter !== "الكل"
              ? "لا توجد نتائج مطابقة للبحث أو الفلتر"
              : "ابدأ بإضافة قطع غيار جديدة من الصف الأول في الجدول"}
          </p>
          {(searchQuery || categoryFilter !== "الكل") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("الكل");
              }}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <X size={20} />
              إزالة الفلتر
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {filteredParts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">اسم الصنف</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">الفئة</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">عدد القطع</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">سعر القطعة</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">الإجمالي</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">سعر الشراء</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">سعر البيع</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">المورد</th>
                <th className="px-4 py-4 text-right text-sm font-bold text-gray-700">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Add New Item Row */}
              <tr className="bg-blue-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="اسم الصنف..."
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.filter(cat => cat !== "الكل").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    placeholder="الكمية"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    min="0"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    placeholder="السعر"
                    value={newItem.unitPrice}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="px-3 py-2 bg-green-100 rounded-lg text-sm font-bold text-green-700 text-center">
                    {calculateTotal().toFixed(2)} ج.م
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    placeholder="الشراء"
                    value={newItem.costPrice}
                    onChange={(e) => setNewItem({ ...newItem, costPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    placeholder="البيع"
                    value={newItem.sellPrice}
                    onChange={(e) => setNewItem({ ...newItem, sellPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="المورد"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={handleAddItem}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Save size={16} />
                    حفظ
                  </button>
                </td>
              </tr>

              {/* Existing Items */}
              {filteredParts.map((part) => {
                const isEditing = editingId === part.id;
                return (
                  <tr
                    key={part.id}
                    className={`transition-colors ${isEditing ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="px-4 py-3">
                      {isEditing ? cellInput("name", "text", "اسم الصنف") : (
                        <div className="flex items-center gap-2">
                          {part.status === "ينفذ" && (
                            <AlertCircle className="text-red-500" size={16} />
                          )}
                          <span className="text-sm text-gray-900">{part.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="w-full px-2 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                          {categories.filter(cat => cat !== "الكل").map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm text-gray-600">{part.category}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? cellInput("quantity", "number", "الكمية") : (
                        <span className="text-sm font-medium text-gray-900">{part.quantity}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? cellInput("unitPrice", "number", "سعر القطعة") : (
                        <span className="text-sm font-bold text-gray-900">{part.unitPrice} ج.م</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="px-2 py-1.5 bg-green-100 rounded-lg text-sm font-bold text-green-700 text-center">
                          {((parseFloat(editData.quantity) || 0) * (parseFloat(editData.unitPrice) || 0)).toFixed(2)} ج.م
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-blue-600">
                          {(part.quantity * part.unitPrice).toFixed(2)} ج.م
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? cellInput("costPrice", "number", "سعر الشراء") : (
                        <span className="text-sm text-gray-900">{part.costPrice} ج.م</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? cellInput("sellPrice", "number", "سعر البيع") : (
                        <span className="text-sm font-bold text-green-600">{part.sellPrice} ج.م</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? cellInput("supplier", "text", "المورد") : (
                        <span className="text-sm text-gray-600">{part.supplier}</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleEditSave(part.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="حفظ التعديل"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                              title="إلغاء"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditStart(part)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeletePart(part.id, part.name)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}