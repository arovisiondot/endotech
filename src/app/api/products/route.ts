import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const runtimeProductsPath = path.join(process.cwd(), "data/products.json");
const fallbackProductsPath = path.join(process.cwd(), "src/data/products.json");

// Caching layer across serverless invocations
declare global {
  var __inMemoryProductsCache: any[] | undefined;
  var __inMemoryProductsCacheTime: number | undefined;
}

const CACHE_TTL_MS = 4000; // 4 seconds hot cache

function getLocalProducts(): any[] {
  // Check /tmp first (Vercel lambdas)
  try {
    const tmpPath = path.join("/tmp", "products.json");
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  // Check data/products.json
  if (fs.existsSync(runtimeProductsPath)) {
    try {
      const raw = fs.readFileSync(runtimeProductsPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }

  // Check src/data/products.json
  if (fs.existsSync(fallbackProductsPath)) {
    try {
      const raw = fs.readFileSync(fallbackProductsPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }

  return [];
}

function saveLocalProducts(products: any[]) {
  try {
    const tmpPath = path.join("/tmp", "products.json");
    fs.writeFileSync(tmpPath, JSON.stringify(products, null, 2), "utf-8");
  } catch {}

  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(runtimeProductsPath, JSON.stringify(products, null, 2), "utf-8");
    try {
      fs.writeFileSync(fallbackProductsPath, JSON.stringify(products, null, 2), "utf-8");
    } catch {}
  } catch {}
}

function invalidateCache() {
  global.__inMemoryProductsCache = undefined;
  global.__inMemoryProductsCacheTime = undefined;
}

export async function GET() {
  try {
    const now = Date.now();
    // 1. Return in-memory cache if within TTL
    if (
      global.__inMemoryProductsCache &&
      global.__inMemoryProductsCacheTime &&
      now - global.__inMemoryProductsCacheTime < CACHE_TTL_MS
    ) {
      return NextResponse.json(global.__inMemoryProductsCache, {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
        },
      });
    }

    // 2. Fetch from Supabase Central Database
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((row) => ({
            ...(row.data || {}),
            id: row.id,
            code: row.code,
            name: row.name,
            slug: row.slug,
            category: row.category,
            subcategory: row.subcategory,
            product_type: row.product_type,
            pattern: row.pattern,
            cup_size: row.cup_size,
            length: row.length,
            material: row.material,
            stock: row.stock || "In Stock",
            description: row.description,
            image: row.image,
            gallery: row.gallery || (row.data?.gallery ?? []),
            size_options: row.size_options || (row.data?.size_options ?? []),
            isFeatured: row.is_featured ?? row.data?.isFeatured ?? true,
            specs: row.specs || (row.data?.specs ?? []),
            sizes_table: row.sizes_table || (row.data?.sizes_table ?? []),
          }));

          global.__inMemoryProductsCache = formatted;
          global.__inMemoryProductsCacheTime = now;

          return NextResponse.json(formatted, {
            headers: {
              "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
            },
          });
        }
      } catch (dbErr) {
        console.warn("Supabase fetch warning, using local fallback:", dbErr);
      }
    }

    // 3. Fallback to local storage if Supabase is offline
    const localList = getLocalProducts();
    global.__inMemoryProductsCache = localList;
    global.__inMemoryProductsCacheTime = now;

    return NextResponse.json(localList, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
      },
    });
  } catch (err: unknown) {
    console.error("Products GET Error:", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();

    if (!newProduct.id) {
      newProduct.id = "prod-" + Date.now();
    }
    if (!newProduct.slug && newProduct.name) {
      newProduct.slug = newProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // 1. Sync to Supabase Central Cloud Database
    if (isSupabaseConfigured()) {
      try {
        const { error: sbErr } = await supabase.from("products").upsert({
          id: newProduct.id,
          code: newProduct.code || "",
          name: newProduct.name || "",
          slug: newProduct.slug || "",
          category: newProduct.category || "general-instrumentation",
          subcategory: newProduct.subcategory || "",
          product_type: newProduct.product_type || "",
          pattern: newProduct.pattern || "",
          cup_size: newProduct.cup_size || "",
          length: newProduct.length || "",
          material: newProduct.material || "AISI 420 Surgical Stainless Steel",
          stock: newProduct.stock || "In Stock",
          description: newProduct.description || "",
          image: newProduct.image || "",
          gallery: newProduct.gallery || [],
          size_options: newProduct.size_options || [],
          specs: newProduct.specs || [],
          sizes_table: newProduct.sizes_table || [],
          is_featured: newProduct.isFeatured ?? true,
          data: newProduct,
          updated_at: new Date().toISOString(),
        });

        if (sbErr) {
          console.warn("Supabase upsert error:", sbErr);
        }
      } catch (err) {
        console.warn("Supabase error during product POST:", err);
      }
    }

    // 2. Also update local cache & file storage
    const local = getLocalProducts();
    const updated = [newProduct, ...local.filter((p: any) => p.id !== newProduct.id)];
    saveLocalProducts(updated);

    // Invalidate in-memory cache so all upcoming requests receive fresh data
    invalidateCache();

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    console.error("Products POST Error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();

    if (!updatedProduct.id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // 1. Sync to Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase.from("products").upsert({
          id: updatedProduct.id,
          code: updatedProduct.code || "",
          name: updatedProduct.name || "",
          slug: updatedProduct.slug || "",
          category: updatedProduct.category || "general-instrumentation",
          subcategory: updatedProduct.subcategory || "",
          product_type: updatedProduct.product_type || "",
          pattern: updatedProduct.pattern || "",
          cup_size: updatedProduct.cup_size || "",
          length: updatedProduct.length || "",
          material: updatedProduct.material || "",
          stock: updatedProduct.stock || "In Stock",
          description: updatedProduct.description || "",
          image: updatedProduct.image || "",
          gallery: updatedProduct.gallery || [],
          size_options: updatedProduct.size_options || [],
          specs: updatedProduct.specs || [],
          sizes_table: updatedProduct.sizes_table || [],
          is_featured: updatedProduct.isFeatured ?? true,
          data: updatedProduct,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase PUT error:", err);
      }
    }

    // 2. Update local fallback
    const local = getLocalProducts();
    const idx = local.findIndex((p: any) => p.id === updatedProduct.id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updatedProduct };
      saveLocalProducts(local);
    }

    invalidateCache();

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: unknown) {
    console.error("Products PUT Error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // 1. Delete from Supabase
    if (isSupabaseConfigured()) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase DELETE error:", err);
      }
    }

    // 2. Delete from local fallback
    let local = getLocalProducts();
    local = local.filter((p: any) => p.id !== id);
    saveLocalProducts(local);

    invalidateCache();

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: unknown) {
    console.error("Products DELETE Error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
