import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export interface Part {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  sellPrice: number;
  supplier: string;
  status: string;
  location?: string;
  description?: string;
  minQuantity?: number;
  partCode?: string;
}

interface PartsContextType {
  parts: Part[];
  addPart: (part: Omit<Part, "id" | "status">) => void;
  deletePart: (id: string) => void;
  updatePart: (id: string, part: Partial<Part>) => void;
  categories: string[];
  addCategory: (category: string) => void;
}

const PartsContext = createContext<PartsContextType | undefined>(undefined);

// Initial default data
const initialCategories = [
  "فلاتر",
  "فرامل",
  "كهرباء",
  "إطارات",
  "زيوت",
  "محرك",
  "إكسسوارات",
];

const initialParts: Part[] = [
    {
      id: "P001",
      name: "فلتر زيت تويوتا كورولا",
      category: "فلاتر",
      quantity: 45,
      unitPrice: 80,
      costPrice: 60,
      sellPrice: 80,
      supplier: "شركة النجاح",
      status: "متوفر",
    },
    {
      id: "P002",
      name: "فرامل أمامية هيونداي",
      category: "فرامل",
      quantity: 12,
      unitPrice: 200,
      costPrice: 150,
      sellPrice: 200,
      supplier: "الشرق الأوسط",
      status: "منخفض",
    },
    {
      id: "P003",
      name: "بطارية 70 أمبير",
      category: "كهرباء",
      quantity: 28,
      unitPrice: 300,
      costPrice: 250,
      sellPrice: 300,
      supplier: "شركة النجاح",
      status: "متوفر",
    },
    {
      id: "P004",
      name: "إطار ميشلان 185/65 R15",
      category: "إطارات",
      quantity: 8,
      unitPrice: 500,
      costPrice: 400,
      sellPrice: 500,
      supplier: "عالم الإطارات",
      status: "منخفض",
    },
    {
      id: "P005",
      name: "زيت موتور 5W30 شل",
      category: "زيوت",
      quantity: 67,
      unitPrice: 200,
      costPrice: 150,
      sellPrice: 200,
      supplier: "شل للزيوت",
      status: "متوفر",
    },
    {
      id: "P006",
      name: "شمعات إشعال نيسان",
      category: "محرك",
      quantity: 3,
      unitPrice: 45,
      costPrice: 30,
      sellPrice: 45,
      supplier: "الشرق الأوسط",
      status: "ينفذ",
    },
    {
      id: "P007",
      name: "مساحات زجاج بوش",
      category: "إكسسوارات",
      quantity: 34,
      unitPrice: 65,
      costPrice: 45,
      sellPrice: 65,
      supplier: "بوش",
      status: "متوفر",
    },
    {
      id: "P008",
      name: "سير مكيف هوندا",
      category: "محرك",
      quantity: 15,
      unitPrice: 120,
      costPrice: 90,
      sellPrice: 120,
      supplier: "شركة النجاح",
      status: "متوفر",
    },
  ];

export function PartsProvider({ children }: { children: ReactNode }) {
  // Use localStorage with fallback to initial data
  const [categories, setCategories] = useLocalStorage<string[]>("categories", initialCategories);
  const [parts, setParts] = useLocalStorage<Part[]>("parts", initialParts);

  const addPart = (partData: Omit<Part, "id" | "status">) => {
    // Calculate status based on quantity
    let status = "متوفر";
    const minQty = partData.minQuantity || 5;

    if (partData.quantity <= minQty) {
      status = "ينفذ";
    } else if (partData.quantity <= minQty * 3) {
      status = "منخفض";
    }

    // Generate unique ID based on existing parts
    const maxId = parts.reduce((max, part) => {
      const num = parseInt(part.id.replace('P', ''));
      return num > max ? num : max;
    }, 0);

    const newPart: Part = {
      ...partData,
      id: `P${String(maxId + 1).padStart(3, "0")}`,
      status,
    };

    setParts([newPart, ...parts]);
  };

  const deletePart = (id: string) => {
    setParts(parts.filter((part) => part.id !== id));
  };

  const updatePart = (id: string, partData: Partial<Part>) => {
    setParts(
      parts.map((part) => (part.id === id ? { ...part, ...partData } : part))
    );
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  return (
    <PartsContext.Provider value={{ parts, addPart, deletePart, updatePart, categories, addCategory }}>
      {children}
    </PartsContext.Provider>
  );
}

export function useParts() {
  const context = useContext(PartsContext);
  if (context === undefined) {
    throw new Error("useParts must be used within a PartsProvider");
  }
  return context;
}