"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import initialSiteContent from "@/data/site-content.json";
import initialProductsData from "@/data/products.json";

export type SiteContent = typeof initialSiteContent & {
  aboutPage?: any;
  resourcesPage?: any;
  sustainabilityPage?: any;
  contactPage?: any;
  departmentsPage?: any;
};

export interface ProductItem {
  id: string;
  code: string;
  name: string;
  slug?: string;
  category: string;
  subcategory?: string;
  product_type?: string;
  pattern?: string;
  cup_size?: string;
  length?: string;
  description: string;
  image: string;
  gallery?: string[];
  size_options?: string[];
  isFeatured?: boolean;
  material?: string;
  stock?: string;
  specs?: { label: string; value: string }[];
  sizes_table?: { article_number: string; pattern?: string; cup_size?: string; length?: string }[];
}

interface ContentContextType {
  content: SiteContent;
  products: ProductItem[];
  loading: boolean;
  saveContent: (updated: SiteContent) => Promise<boolean>;
  addProduct: (product: Omit<ProductItem, "id">) => Promise<boolean>;
  updateProduct: (product: ProductItem) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(initialSiteContent);
  const [products, setProducts] = useState<ProductItem[]>(initialProductsData);
  const [loading, setLoading] = useState(false);

  // Fetch live content and products from API
  const refreshData = useCallback(async () => {
    try {
      const [contentRes, prodRes] = await Promise.all([
        fetch("/api/content", { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" }),
      ]);

      if (contentRes.ok) {
        const liveContent = await contentRes.json();
        if (liveContent && liveContent.hero) {
          setContent(liveContent);
        }
      }

      if (prodRes.ok) {
        const liveProducts = await prodRes.json();
        if (Array.isArray(liveProducts) && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      }
    } catch (err) {
      console.warn("Could not sync from API, using cached state", err);
    }
  }, []);

  // Initial load + periodic polling for multi-device sync
  useEffect(() => {
    refreshData();

    // Cross-device sync: poll every 5 seconds so changes on device A appear on device B
    const interval = setInterval(() => {
      refreshData();
    }, 5000);

    // Refresh when user returns to tab
    const onFocus = () => refreshData();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshData]);

  // Save full site content
  const saveContent = async (updated: SiteContent): Promise<boolean> => {
    setContent(updated);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Save content failed", err);
      return false;
    }
  };

  // Add new product
  const addProduct = async (productData: Omit<ProductItem, "id">): Promise<boolean> => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Add product failed", err);
      return false;
    }
  };

  // Update existing product
  const updateProduct = async (product: ProductItem): Promise<boolean> => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Update product failed", err);
      return false;
    }
  };

  // Delete product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Delete product failed", err);
      return false;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        products,
        loading,
        saveContent,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshData,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return ctx;
}

