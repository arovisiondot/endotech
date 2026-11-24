import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

const runtimeProductsPath = path.join(process.cwd(), "data/products.json");
const fallbackProductsPath = path.join(process.cwd(), "src/data/products.json");

// In-memory cache across serverless warm lambdas
declare global {
  var __inMemoryProducts: any[] | undefined;
}

function readProducts(): any[] {
  // 1. Check in-memory cache first if populated
  if (global.__inMemoryProducts && Array.isArray(global.__inMemoryProducts) && global.__inMemoryProducts.length > 0) {
    return global.__inMemoryProducts;
  }

  // 2. Check /tmp if running on Vercel serverless
  try {
    const tmpPath = path.join("/tmp", "products.json");
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__inMemoryProducts = parsed;
        return parsed;
      }
    }
  } catch {}

  // 3. Check data/products.json
  if (fs.existsSync(runtimeProductsPath)) {
    try {
      const raw = fs.readFileSync(runtimeProductsPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__inMemoryProducts = parsed;
        return parsed;
      }
    } catch {}
  }

  // 4. Check src/data/products.json
  if (fs.existsSync(fallbackProductsPath)) {
    try {
      const raw = fs.readFileSync(fallbackProductsPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        global.__inMemoryProducts = parsed;
        return parsed;
      }
    } catch {}
  }
  return [];
}

function writeProducts(products: any[]) {
  // Update in-memory cache immediately
  global.__inMemoryProducts = products;

  // Try writing to /tmp for Vercel lambdas
  try {
    const tmpPath = path.join("/tmp", "products.json");
    fs.writeFileSync(tmpPath, JSON.stringify(products, null, 2), "utf-8");
  } catch {}

  // Try writing to workspace files if filesystem is writable (local dev / persistent servers)
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

export async function GET() {
  try {
    const products = readProducts();
    return NextResponse.json(products);
  } catch (err: unknown) {
    console.error("Products GET Error:", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    const products = readProducts();

    if (!newProduct.id) {
      newProduct.id = "prod-" + Date.now();
    }
    if (!newProduct.slug && newProduct.name) {
      newProduct.slug = newProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    products.unshift(newProduct);
    writeProducts(products);

    // Sync to Supabase in background
    try {
      await supabase.from("products").upsert({
        id: newProduct.id,
        code: newProduct.code,
        name: newProduct.name,
        slug: newProduct.slug,
        category: newProduct.category,
        description: newProduct.description,
        image_url: newProduct.image,
        is_featured: newProduct.isFeatured ?? true,
      });
    } catch {
      // Supabase is optional
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    console.error("Products POST Error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();
    const products = readProducts();

    const index = products.findIndex((p: { id: string }) => p.id === updatedProduct.id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    products[index] = { ...products[index], ...updatedProduct };
    writeProducts(products);

    // Sync to Supabase in background
    try {
      await supabase.from("products").upsert({
        id: updatedProduct.id,
        code: updatedProduct.code,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        category: updatedProduct.category,
        description: updatedProduct.description,
        image_url: updatedProduct.image,
        is_featured: updatedProduct.isFeatured,
      });
    } catch {
      // Supabase optional
    }

    return NextResponse.json({ success: true, product: products[index] });
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

    let products = readProducts();
    products = products.filter((p: { id: string }) => p.id !== id);
    writeProducts(products);

    // Sync to Supabase in background
    try {
      await supabase.from("products").delete().eq("id", id);
    } catch {
      // Supabase optional
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err: unknown) {
    console.error("Products DELETE Error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

