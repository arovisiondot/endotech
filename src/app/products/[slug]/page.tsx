import React from "react";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { initialProducts, initialVariants } from "@/data/mockData";
import ProductDetailClient from "@/components/ProductDetailClient";
import SubcategoryCollectionClient from "@/components/SubcategoryCollectionClient";
import { Product, ProductVariant } from "@/types/database";

export const dynamic = "force-dynamic";

function getProductsFromJson(): any[] {
  try {
    const runtimePath = path.join(process.cwd(), "data/products.json");
    if (fs.existsSync(runtimePath)) {
      const raw = fs.readFileSync(runtimePath, "utf-8");
      return JSON.parse(raw);
    }
    const fallbackPath = path.join(process.cwd(), "src/data/products.json");
    if (fs.existsSync(fallbackPath)) {
      const raw = fs.readFileSync(fallbackPath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Could not read products.json", err);
  }
  return [];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const jsonProducts = getProductsFromJson();

  // Search in products.json first (Admin live database)
  let rawProduct = jsonProducts.find((p) => p.slug === slug || p.id === slug);

  // Fallback to mockData if not in products.json
  if (!rawProduct) {
    rawProduct = initialProducts.find((p) => p.slug === slug || p.id === slug);
  }

  // If not a product in database, check if it's a main category slug
  // Otherwise, synthesize a complete pristine product object so the Large View page ALWAYS displays
  if (!rawProduct) {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const siteContentPath = path.join(process.cwd(), "src/data/site-content.json");
    let contentCategories: any[] = [];
    try {
      if (fs.existsSync(siteContentPath)) {
        const cData = JSON.parse(fs.readFileSync(siteContentPath, "utf-8"));
        contentCategories = cData.productPage?.categories || [];
      }
    } catch {}

    const isMainCat = contentCategories.some(
      (c) => c.slug?.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanSlug
    );

    // Only if it's a main category slug, render SubcategoryCollectionClient
    if (isMainCat) {
      const matched = contentCategories.find(
        (c) => c.slug?.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanSlug
      );
      return (
        <SubcategoryCollectionClient
          categorySlug={matched?.slug || "general-instrumentation"}
          categoryName={matched?.name || "General Instrumentation"}
          subcategoryName={matched?.subcategories?.[0] || "Scalpels"}
        />
      );
    }

    // Product does not exist in database and is not a category slug -> return 404
    notFound();
  }

  // Normalize Product to standard structure
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
    image_url: rawProduct.image || rawProduct.image_url || "/images/image 438.svg",
    is_featured: rawProduct.isFeatured ?? rawProduct.is_featured ?? true,
    gallery: rawProduct.gallery || [rawProduct.image || rawProduct.image_url || "/images/image 438.svg"],
    specs: rawProduct.specs || [],
    sizes_table: rawProduct.sizes_table || [],
    size_options: rawProduct.size_options || [],
  } as any;

  // Build variants from sizes_table or size_options or initialVariants
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
  } else if (initialVariants[product.id]) {
    variants = initialVariants[product.id];
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

  // Related products
  const related = jsonProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <ProductDetailClient
      product={product}
      variants={variants}
      relatedProducts={related}
    />
  );
}
