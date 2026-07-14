import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export interface ShopSettings {
  // معلومات المتجر
  shopName: string;
  phoneNumber: string;
  address: string;

  // إعدادات المخزون
  defaultMinQuantity: number;
  enableLowStockAlerts: boolean;

  // إعدادات الفواتير
  currency: "ريال" | "جنيه" | "دينار" | "درهم";
  defaultInvoiceNote: string;
  invoiceStartNumber: number;
}

interface SettingsContextType {
  settings: ShopSettings;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// الإعدادات الافتراضية
const defaultSettings: ShopSettings = {
  // معلومات المتجر
  shopName: "ورشة الأمانة لقطع الغيار",
  phoneNumber: "01000000000",
  address: "القاهرة، مصر",

  // إعدادات المخزون
  defaultMinQuantity: 5,
  enableLowStockAlerts: true,

  // إعدادات الفواتير
  currency: "جنيه",
  defaultInvoiceNote: "شكراً لتعاملكم معنا",
  invoiceStartNumber: 1000,
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<ShopSettings>("shopSettings", defaultSettings);

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
