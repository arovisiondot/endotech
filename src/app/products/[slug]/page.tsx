import React from "react";
import fs from "fs";
import path from "path";
import { initialProducts, initialVariants } from "@/data/mockData";
import ProductPageContainer from "@/components/ProductPageContainer";
import { ProductVariant } from "@/types/database";

export const dynamic = "force-dynamic";

function getProductsFromJson(): any[] {
  // Check /tmp first if on Vercel serverless
  try {
    const tmpPath = path.join("/tmp", "products.json");
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

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

  // Check if it's a main category slug
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  const siteContentPath = path.join(process.cwd(), "src/data/site-content.json");
  let contentCategories: any[] = [];
  try {
    if (fs.existsSync(siteContentPath)) {
      const cData = JSON.parse(fs.readFileSync(siteContentPath, "utf-8"));
      contentCategories = cData.productPage?.categories || [];
    }
  } catch {}

  const matchedCategory = contentCategories.find(
    (c) => c.slug?.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanSlug
  );

  let initialVariantsList: ProductVariant[] | undefined;
  if (rawProduct) {
    if (rawProduct.sizes_table && Array.isArray(rawProduct.sizes_table) && rawProduct.sizes_table.length > 0) {
      initialVariantsList = rawProduct.sizes_table.map((row: any, idx: number) => ({
        id: `var-${idx}`,
        product_id: rawProduct.id,
        article_number: row.article_number || rawProduct.article_code || rawProduct.code,
        pattern: row.pattern || rawProduct.pattern || "Standard",
        cup_size: row.cup_size || row.size || rawProduct.cup_size || "Standard",
        length: row.length || rawProduct.length || "20 cm",
        is_available: true,
      }));
    } else if (rawProduct.size_options && Array.isArray(rawProduct.size_options) && rawProduct.size_options.length > 0) {
      initialVariantsList = rawProduct.size_options.map((opt: string, idx: number) => ({
        id: `var-${idx}`,
        product_id: rawProduct.id,
        article_number: `${rawProduct.article_code || rawProduct.code}-${idx + 1}`,
        pattern: rawProduct.pattern || "Standard",
        cup_size: opt,
        length: rawProduct.length || "20 cm",
        is_available: true,
      }));
    } else if (initialVariants[rawProduct.id]) {
      initialVariantsList = initialVariants[rawProduct.id];
    }
  }

  const related = jsonProducts.filter((p) => p.id !== rawProduct?.id).slice(0, 3);

  return (
    <ProductPageContainer
      slug={slug}
      initialProduct={rawProduct}
      initialVariants={initialVariantsList}
      initialRelated={related}
      isCategorySlug={Boolean(matchedCategory)}
      categoryData={
        matchedCategory
          ? {
              slug: matchedCategory.slug || "general-instrumentation",
              name: matchedCategory.name || "General Instrumentation",
              subcategoryName: matchedCategory.subcategories?.[0] || "Scalpels",
            }
          : undefined
      }
    />
  );
}
