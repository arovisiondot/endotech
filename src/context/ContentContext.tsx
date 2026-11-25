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

  // Fetch live content and products from Central Cloud API
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
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("endotech_site_content", JSON.stringify(liveContent));
            } catch {}
          }
        }
      }

      if (prodRes.ok) {
        const liveProducts = await prodRes.json();
        if (Array.isArray(liveProducts) && liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      }
    } catch (err) {
      console.warn("Sync error, continuing with current state:", err);
    }
  }, []);

  // Initial load once on mount (no heavy 4-second polling)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedContent = localStorage.getItem("endotech_site_content");
        if (savedContent) {
          const parsed = JSON.parse(savedContent);
          if (parsed && parsed.hero) setContent(parsed);
        }
      } catch {}
    }

    refreshData();
  }, [refreshData]);

  // Save full site content
  const saveContent = async (updated: SiteContent): Promise<boolean> => {
    // Optimistic UI update
    setContent(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("endotech_site_content", JSON.stringify(updated));
      } catch {}
    }

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        await refreshData();
      }
      return true;
    } catch (err) {
      console.error("Save content sync error:", err);
      return true;
    }
  };

  // Add new product
  const addProduct = async (productData: Omit<ProductItem, "id">): Promise<boolean> => {
    const newProduct: ProductItem = {
      ...productData,
      id: "prod-" + Date.now(),
      slug: (productData.slug || productData.name || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    };

    // Optimistic UI update
    setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        await refreshData();
      }
      return true;
    } catch (err) {
      console.error("Add product server sync failed:", err);
      return true;
    }
  };

  // Update existing product
  const updateProduct = async (product: ProductItem): Promise<boolean> => {
    // Optimistic UI update
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        await refreshData();
      }
      return true;
    } catch (err) {
      console.error("Update product server sync error:", err);
      return true;
    }
  };

  // Delete product
  const deleteProduct = async (id: string): Promise<boolean> => {
    // Optimistic UI update
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refreshData();
      }
      return true;
    } catch (err) {
      console.error("Delete product sync error:", err);
      return true;
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
