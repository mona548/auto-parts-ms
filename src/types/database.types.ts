export interface Part {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  sellPrice: number;
  supplier: string;
  status: 'متوفر' | 'منخفض' | 'ينفذ';
  location?: string;
  description?: string;
  minQuantity?: number;
  partCode?: string;
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  createdAt?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: InvoiceItem[];
  total: number;
  paid: number;
  remaining: number;
  discount?: number;
  status: 'مدفوعة' | 'جزئية' | 'غير مدفوعة';
  notes?: string;
  createdAt: string;
}

export interface ShopSettings {
  shopName: string;
  phone: string;
  address: string;
  currency: 'ج.م' | 'ريال' | 'دينار' | 'درهم';
  defaultNote: string;
  minQuantityAlert: number;
  invoiceStartNumber: number;
}
