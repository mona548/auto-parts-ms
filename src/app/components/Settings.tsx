import { useState } from "react";
import { Trash2, Download, Upload, AlertCircle, CheckCircle, Save, Store, Package, FileText } from "lucide-react";
import { clearAllAppData, exportAppData, importAppData } from "../hooks/useLocalStorage";
import { useSettings } from "../context/SettingsContext";

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Local state for form
  const [formData, setFormData] = useState(settings);

  const handleSaveSettings = () => {
    updateSettings(formData);
    setNotification({ type: 'success', message: 'تم حفظ الإعدادات بنجاح!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResetSettings = () => {
    resetSettings();
    setFormData(settings);
    setNotification({ type: 'success', message: 'تم إعادة تعيين الإعدادات!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleClearData = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearData = () => {
    clearAllAppData();
    setShowConfirmDialog(false);
  };

  const handleExportData = () => {
    const data = exportAppData();
    if (data) {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `parts-system-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setNotification({ type: 'success', message: 'تم تصدير البيانات بنجاح!' });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ type: 'error', message: 'فشل تصدير البيانات!' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const success = importAppData(data);

        if (success) {
          setNotification({ type: 'success', message: 'تم استيراد البيانات بنجاح!' });
        } else {
          setNotification({ type: 'error', message: 'فشل استيراد البيانات!' });
        }
      } catch (error) {
        setNotification({ type: 'error', message: 'ملف غير صالح!' });
        setTimeout(() => setNotification(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">الإعدادات</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">إدارة إعدادات النظام والبيانات</p>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          notification.type === 'success'
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="text-green-600" size={24} />
          ) : (
            <AlertCircle className="text-red-600" size={24} />
          )}
          <p className={`font-medium ${
            notification.type === 'success' ? 'text-green-700' : 'text-red-700'
          }`}>
            {notification.message}
          </p>
        </div>
      )}

      <div className="max-w-4xl space-y-6">
        {/* القسم الأول: معلومات المتجر */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Store className="text-blue-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">معلومات المتجر</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المتجر
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => handleInputChange('shopName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="ورشة الأمانة لقطع الغيار"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="0500000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="الرياض، المملكة العربية السعودية"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>ملاحظة:</strong> هذه المعلومات تظهر في رأس الفواتير المطبوعة
              </p>
            </div>
          </div>
        </div>

        {/* القسم الثاني: إعدادات المخزون */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="text-purple-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">إعدادات المخزون</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأدنى الافتراضي للتنبيه
              </label>
              <input
                type="number"
                min="1"
                value={formData.defaultMinQuantity}
                onChange={(e) => handleInputChange('defaultMinQuantity', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <p className="text-sm text-gray-500 mt-2">
                عندما تصل الكمية إلى هذا الرقم أو أقل، سيتم عرض تنبيه "ينفذ"
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">تفعيل تنبيهات المخزون المنخفض</h3>
                <p className="text-sm text-gray-600">
                  إظهار تنبيهات عندما تنخفض كمية القطع
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableLowStockAlerts}
                  onChange={(e) => handleInputChange('enableLowStockAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* القسم الثالث: إعدادات الفواتير */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="text-green-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">إعدادات الفواتير</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العملة
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="ريال">ريال</option>
                  <option value="جنيه">جنيه</option>
                  <option value="دينار">دينار</option>
                  <option value="درهم">درهم</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم بداية الفواتير
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.invoiceStartNumber}
                  onChange={(e) => handleInputChange('invoiceStartNumber', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="1000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظة افتراضية في الفواتير
              </label>
              <textarea
                value={formData.defaultInvoiceNote}
                onChange={(e) => handleInputChange('defaultInvoiceNote', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 resize-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                placeholder="شكراً لتعاملكم معنا"
              />
              <p className="text-sm text-gray-500 mt-2">
                هذه الملاحظة ستظهر تلقائياً في نهاية كل فاتورة
              </p>
            </div>
          </div>
        </div>

        {/* زر حفظ الإعدادات */}
        <div className="flex gap-4">
          <button
            onClick={handleSaveSettings}
            className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 font-semibold"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <Save size={20} />
            حفظ الإعدادات
          </button>
          <button
            onClick={handleResetSettings}
            className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
          >
            إعادة تعيين
          </button>
        </div>

        {/* القسم الرابع: إدارة البيانات */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">إدارة البيانات</h2>

          <div className="space-y-4">
            {/* Export Data */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">تصدير البيانات</h3>
                <p className="text-sm text-gray-600">
                  احفظ نسخة احتياطية من جميع البيانات بصيغة JSON
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 font-semibold"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <Download size={20} />
                تصدير
              </button>
            </div>

            {/* Import Data */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">استيراد البيانات</h3>
                <p className="text-sm text-gray-600">
                  استعد نسخة احتياطية سابقة من ملف JSON
                </p>
              </div>
              <label className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 font-semibold cursor-pointer"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <Upload size={20} />
                استيراد
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>

            {/* Clear Data */}
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-red-900 mb-1">مسح جميع البيانات</h3>
                <p className="text-sm text-red-600">
                  حذف جميع البيانات المحفوظة والعودة للبيانات الافتراضية
                </p>
              </div>
              <button
                onClick={handleClearData}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 font-semibold"
              >
                <Trash2 size={20} />
                مسح البيانات
              </button>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات التخزين</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">موقع حفظ البيانات</span>
              <span className="text-gray-600">المتصفح (Local Storage)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">الحفظ التلقائي</span>
              <span className="text-green-600 font-semibold">مفعّل</span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>ملاحظة:</strong> جميع البيانات والإعدادات يتم حفظها تلقائياً في المتصفح.
                لا تُحذف البيانات إلا عند مسح بيانات المتصفح أو استخدام زر "مسح البيانات" أعلاه.
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">عن النظام</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>النسخة:</strong> 1.0.0</p>
            <p><strong>التاريخ:</strong> أبريل 2026</p>
            <p><strong>الوصف:</strong> نظام إدارة قطع غيار متكامل</p>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirmDialog(false)}
          />
          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl p-8 w-full max-w-md mx-4"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            <div className="flex flex-col items-center gap-4">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-500" />
              </div>

              <h2 className="text-xl font-bold text-gray-900">تأكيد مسح البيانات</h2>

              <p className="text-gray-600 text-center">
                هل أنت متأكد من مسح جميع البيانات؟
                <br />
                <span className="text-red-600 font-semibold">
                  سيتم حذف جميع القطع، الفواتير، والعملاء بشكل دائم!
                </span>
              </p>

              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmClearData}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold"
                >
                  تأكيد المسح
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
