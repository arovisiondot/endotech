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
    // Check localStorage first for instant client persistence
    if (typeof window !== "undefined") {
      try {
        const savedContent = localStorage.getItem("endotech_site_content");
        if (savedContent) {
          const parsed = JSON.parse(savedContent);
          if (parsed && parsed.hero) setContent(parsed);
        }
        const savedProds = localStorage.getItem("endotech_products_list");
        if (savedProds) {
          const parsed = JSON.parse(savedProds);
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
        }
      } catch {}
    }

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
      console.error("Save content failed, kept in local state", err);
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

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("endotech_products_list", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

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
      console.error("Add product server sync failed, kept in local state", err);
      return true;
    }
  };

  // Update existing product
  const updateProduct = async (product: ProductItem): Promise<boolean> => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === product.id ? product : p));
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("endotech_products_list", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

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
      console.error("Update product server sync failed, kept in local state", err);
      return true;
    }
  };

  // Delete product
  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("endotech_products_list", JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

    try {
      await fetch(`/api/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      return true;
    } catch (err) {
      console.error("Delete product failed", err);
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

