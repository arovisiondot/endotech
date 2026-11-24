import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

const runtimeProductsPath = path.join(process.cwd(), "data/products.json");
const fallbackProductsPath = path.join(process.cwd(), "src/data/products.json");

function readProducts() {
  // Check /tmp first if running on Vercel serverless
  try {
    const tmpPath = path.join("/tmp", "products.json");
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}

  if (fs.existsSync(runtimeProductsPath)) {
    try {
      const raw = fs.readFileSync(runtimeProductsPath, "utf-8");
      return JSON.parse(raw);
    } catch {}
  }
  if (fs.existsSync(fallbackProductsPath)) {
    try {
      const raw = fs.readFileSync(fallbackProductsPath, "utf-8");
      return JSON.parse(raw);
    } catch {}
  }
  return [];
}

function writeProducts(products: unknown[]) {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(runtimeProductsPath, JSON.stringify(products, null, 2), "utf-8");
    try {
      fs.writeFileSync(fallbackProductsPath, JSON.stringify(products, null, 2), "utf-8");
    } catch (e) {
      console.warn("Could not write fallback products file", e);
    }
  } catch (err) {
    console.warn("Filesystem read-only (Vercel), writing to /tmp:", err);
    try {
      const tmpPath = path.join("/tmp", "products.json");
      fs.writeFileSync(tmpPath, JSON.stringify(products, null, 2), "utf-8");
    } catch {}
  }
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

