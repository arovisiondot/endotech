"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { InquiryItem } from "@/types/database";

interface InquiryContextType {
  items: InquiryItem[];
  addItem: (item: InquiryItem) => void;
  removeItem: (articleCode: string, size?: string) => void;
  updateQuantity: (articleCode: string, quantity: number, size?: string) => void;
  clearInquiry: () => void;
  totalItems: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("endotech_inquiry_items");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("endotech_inquiry_items", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = (newItem: InquiryItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.article_code === newItem.article_code && i.selected_size === newItem.selected_size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (articleCode: string, size?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.article_code === articleCode && i.selected_size === size))
    );
  };

  const updateQuantity = (articleCode: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeItem(articleCode, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.article_code === articleCode && i.selected_size === size) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearInquiry = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <InquiryContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearInquiry,
        totalItems,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error("useInquiry must be used within an InquiryProvider");
  }
  return context;
}
