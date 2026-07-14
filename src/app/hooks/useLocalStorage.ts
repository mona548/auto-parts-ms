import { useState, useEffect } from "react";

/**
 * Custom hook for managing state with localStorage
 * @param key - The localStorage key
 * @param initialValue - The initial value if no data exists in localStorage
 * @returns [storedValue, setValue] - Similar to useState
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Clear all app data from localStorage
 */
export function clearAllAppData() {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove = ["parts", "categories", "invoices", "customers", "shopSettings"];
    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key);
    });

    // Reload the page to reset the app
    window.location.reload();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Export specific data as JSON (for backup)
 */
export function exportAppData() {
  if (typeof window === "undefined") return null;

  try {
    const data = {
      parts: JSON.parse(window.localStorage.getItem("parts") || "[]"),
      categories: JSON.parse(window.localStorage.getItem("categories") || "[]"),
      invoices: JSON.parse(window.localStorage.getItem("invoices") || "[]"),
      customers: JSON.parse(window.localStorage.getItem("customers") || "[]"),
      shopSettings: JSON.parse(window.localStorage.getItem("shopSettings") || "null"),
      exportedAt: new Date().toISOString(),
    };

    return data;
  } catch (error) {
    console.error("Error exporting data:", error);
    return null;
  }
}

/**
 * Import data from JSON (for restore)
 */
export function importAppData(data: any) {
  if (typeof window === "undefined") return false;

  try {
    if (data.parts) {
      window.localStorage.setItem("parts", JSON.stringify(data.parts));
    }
    if (data.categories) {
      window.localStorage.setItem("categories", JSON.stringify(data.categories));
    }
    if (data.invoices) {
      window.localStorage.setItem("invoices", JSON.stringify(data.invoices));
    }
    if (data.customers) {
      window.localStorage.setItem("customers", JSON.stringify(data.customers));
    }
    if (data.shopSettings) {
      window.localStorage.setItem("shopSettings", JSON.stringify(data.shopSettings));
    }

    // Reload the page to apply changes
    window.location.reload();
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}
