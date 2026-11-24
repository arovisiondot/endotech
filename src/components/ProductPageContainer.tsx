"use client";

import React, { useMemo } from "react";
import { useContent, ProductItem } from "@/context/ContentContext";
import ProductDetailClient from "@/components/ProductDetailClient";
import SubcategoryCollectionClient from "@/components/SubcategoryCollectionClient";
import { Product, ProductVariant } from "@/types/database";

interface ProductPageContainerProps {
  slug: string;
  initialProduct?: any;
  initialVariants?: any[];
  initialRelated?: any[];
  isCategorySlug?: boolean;
  categoryData?: {
    slug: string;
    name: string;
    subcategoryName: string;
  };
}

/**
 * Universal Client-Safe Product Detail Page Container
 * Ensures that ANY product (whether pre-existing, dynamically created in Admin, or saved in client state)
 * NEVER throws a 404 "Page Not Found" error!
 */
export default function ProductPageContainer({
  slug,
  initialProduct,
  initialVariants,
  initialRelated,
  isCategorySlug,
  categoryData,
}: ProductPageContainerProps) {
  const { products, content } = useContent();

  // 1. If server detected it is a category slug, render Collection view
  if (isCategorySlug && categoryData) {
    return (
      <SubcategoryCollectionClient
        categorySlug={categoryData.slug}
        categoryName={categoryData.name}
        subcategoryName={categoryData.subcategoryName}
      />
    );
  }

  // 2. Find product in client products list (which includes any newly added products from localStorage!)
  const clientProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");

    return products.find((p) => {
      const pSlug = (p.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const pId = (p.id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const pCode = (p.code || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const pName = (p.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      return (
        pSlug === cleanSlug ||
        pId === cleanSlug ||
        pCode === cleanSlug ||
        pName === cleanSlug ||
        (cleanSlug.length > 3 && (pSlug.includes(cleanSlug) || cleanSlug.includes(pSlug)))
      );
    });
  }, [products, slug]);

  // Use clientProduct if found, otherwise fall back to initialProduct from server
  const rawProduct = clientProduct || initialProduct;

  // 3. If still not found, check if it matches a category in content
  if (!rawProduct) {
    const pageCategories = (content as any)?.productPage?.categories || [];
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchedCat = pageCategories.find(
      (c: any) => c.slug?.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanSlug
    );
    if (matchedCat) {
      return (
        <SubcategoryCollectionClient
          categorySlug={matchedCat.slug}
          categoryName={matchedCat.name}
          subcategoryName={matchedCat.subcategories?.[0] || "Scalpels"}
        />
      );
    }

    // 4. Safe Fallback: Rather than a 404, synthesize clean product data from slug so View Large ALWAYS renders!
    const syntheticName = decodeURIComponent(slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const fallbackProduct: Product = {
      id: "prod-" + slug,
      subcategory_id: "general",
      name: syntheticName,
      slug: slug,
      article_code: "ET-" + slug.toUpperCase().slice(0, 8),
      product_type: "Surgical Instruments",
      pattern: "Standard",
      cup_size: "Standard",
      length: "20 cm",
      description: "High precision surgical instrument manufactured from medical-grade surgical German stainless steel.",
      features: [
        "Surgical Grade German Stainless Steel (AISI 420)",
        "Autoclavable and reusable conforming to ISO 13485:2016",
        "Corrosion-resistant satin finish with non-slip grip",
        "Precision-engineered for professional operating theater performance",
      ],
      image_url: "/images/categories/general-surgery.png",
      is_featured: true,
      gallery: ["/images/categories/general-surgery.png"],
      specs: [],
      sizes_table: [],
      size_options: ["Standard"],
    } as any;

    return (
      <ProductDetailClient
        product={fallbackProduct}
        variants={[
          {
            id: "var-1",
            product_id: fallbackProduct.id,
            article_number: fallbackProduct.article_code,
            pattern: "Standard",
            cup_size: "Standard",
            length: "20 cm",
            is_available: true,
          },
        ]}
        relatedProducts={products.slice(0, 3)}
      />
    );
  }

  // 5. Normalize raw product to standard Product model
  const product: Product = {
    id: rawProduct.id,
    subcategory_id: rawProduct.subcategory_id || rawProduct.subcategory || "general",
    name: rawProduct.name,
    slug: rawProduct.slug || slug,
    article_code: rawProduct.code || rawProduct.article_code || "ETI-001",
    product_type: rawProduct.product_type || rawProduct.category || "Surgical Instruments",
    pattern: rawProduct.pattern || "Standard",
    cup_size: rawProduct.cup_size || (rawProduct.size_options?.[0]) || "Standard",
    length: rawProduct.length || "20 cm",
    description: rawProduct.description || "High precision surgical instrument manufactured from medical-grade surgical German stainless steel.",
    features: rawProduct.features || [
      "Surgical Grade German Stainless Steel (AISI 420)",
      "Autoclavable and reusable conforming to ISO 13485:2016",
      "Corrosion-resistant satin finish with non-slip grip",
      "Precision-engineered for professional operating theater performance",
    ],
    image_url: rawProduct.image || rawProduct.image_url || "/images/categories/general-surgery.png",
    is_featured: rawProduct.isFeatured ?? rawProduct.is_featured ?? true,
    gallery: rawProduct.gallery && rawProduct.gallery.length > 0
      ? rawProduct.gallery
      : [rawProduct.image || rawProduct.image_url || "/images/categories/general-surgery.png"],
    specs: rawProduct.specs || [],
    sizes_table: rawProduct.sizes_table || [],
    size_options: rawProduct.size_options || [],
  } as any;

  // 6. Build variants list
  let variants: ProductVariant[] = [];
  if (rawProduct.sizes_table && Array.isArray(rawProduct.sizes_table) && rawProduct.sizes_table.length > 0) {
    variants = rawProduct.sizes_table.map((row: any, idx: number) => ({
      id: `var-${idx}`,
      product_id: product.id,
      article_number: row.article_number || product.article_code,
      pattern: row.pattern || product.pattern || "Standard",
      cup_size: row.cup_size || row.size || product.cup_size || "Standard",
      length: row.length || product.length || "20 cm",
      is_available: true,
    }));
  } else if (rawProduct.size_options && Array.isArray(rawProduct.size_options) && rawProduct.size_options.length > 0) {
    variants = rawProduct.size_options.map((opt: string, idx: number) => ({
      id: `var-${idx}`,
      product_id: product.id,
      article_number: `${product.article_code}-${idx + 1}`,
      pattern: product.pattern || "Standard",
      cup_size: opt,
      length: product.length || "20 cm",
      is_available: true,
    }));
  } else if (initialVariants && initialVariants.length > 0) {
    variants = initialVariants;
  } else {
    variants = [
      {
        id: "var-1",
        product_id: product.id,
        article_number: product.article_code,
        pattern: product.pattern || "Standard",
        cup_size: product.cup_size || "Standard",
        length: product.length || "20 cm",
        is_available: true,
      },
    ];
  }

  const related = initialRelated || products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <ProductDetailClient
      product={product}
      variants={variants}
      relatedProducts={related}
    />
  );
}
