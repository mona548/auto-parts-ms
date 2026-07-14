import { useState } from "react";
import { Save, X, Upload, Plus, Home, Package } from "lucide-react";
import { useParts } from "../context/PartsContext";
import { useNavigate, Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function AddPart() {
  const { addPart, categories, addCategory } = useParts();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unitPrice: "",
    costPrice: "",
    sellPrice: "",
    supplier: "",
    minQuantity: "",
    location: "",
    description: "",
    partCode: "",
  });

  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addPart({
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      costPrice: parseFloat(formData.costPrice),
      sellPrice: parseFloat(formData.sellPrice),
      supplier: formData.supplier,
      minQuantity: formData.minQuantity ? parseInt(formData.minQuantity) : 5,
      location: formData.location,
      description: formData.description,
      partCode: formData.partCode,
    });
    
    alert("تم إضافة القطعة بنجاح!");
    
    // Reset form
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unitPrice: "",
      costPrice: "",
      sellPrice: "",
      supplier: "",
      minQuantity: "",
      location: "",
      description: "",
      partCode: "",
    });
    
    // Navigate to inventory
    navigate("/inventory");
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setFormData({ ...formData, category: newCategoryName.trim() });
      setNewCategoryName("");
      alert("تم إضافة الفئة بنجاح!");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Breadcrumb */}
      <div className="mb-6" dir="rtl">
        <Breadcrumb>
          <BreadcrumbList className="flex-row-reverse">
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 dark:text-gray-100">إضافة قطعة جديدة</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/inventory" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 flex items-center gap-1">
                  <Package size={14} />
                  المخزون
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">إضافة قطعة غيار جديدة</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          أدخل تفاصيل القطعة لإضافتها إلى المخزون
        </p>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 transition-colors" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              المعلومات الأساسية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم القطعة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="مثال: فلتر زيت تويوتا كورولا"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Add New Category Section - Always Visible */}
                <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-center text-sm font-medium text-blue-700 mb-3">أو إضافة فئة جديدة</p>

                  <div className="space-y-3">
                    <div className="relative">
                      <Plus className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewCategory();
                          }
                        }}
                        className="w-full pr-12 pl-4 py-3 border-2 border-blue-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-right"
                        placeholder="مثال: مصابيح، مكابح، تعليق..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="flex-1 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md font-medium flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        إضافة الفئة
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCategoryName("")}
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المورد <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="شركة النجاح"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موقع التخزين
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="رف A - صف 3"
                />
              </div>
            </div>
          </div>

          {/* Pricing and Inventory */}
          <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              الأسعار والكمية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد القطع <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سعر القطعة <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="80.00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الإجمالي
                </label>
                <div className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg text-green-700 font-bold text-lg">
                  {formData.quantity && formData.unitPrice
                    ? (parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)
                    : "0.00"} ج.م
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سعر الشراء <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="60.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سعر البيع <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="sellPrice"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="80.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كود المارايه
                </label>
                <input
                  type="text"
                  name="partCode"
                  value={formData.partCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="مثال: MR-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشركة
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="اسم الشركة المورّدة"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              تفاصيل إضافية
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 resize-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="أدخل وصف تفصيلي للقطعة..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة القطعة
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-3" size={40} />
                  <p className="text-gray-600 mb-2 font-medium">
                    اسحب وأفلت الصورة هنا أو انقر للتحميل
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG حتى 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3.5 rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 font-semibold"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <Save size={20} />
              حفظ القطعة وانتقل للمخزون
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  name: "",
                  category: "",
                  quantity: "",
                  unitPrice: "",
                  costPrice: "",
                  sellPrice: "",
                  supplier: "",
                  minQuantity: "",
                  location: "",
                  description: "",
                  partCode: "",
                })
              }
              className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <X size={20} />
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}