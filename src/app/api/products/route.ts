import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import initialProducts from "@/data/products.json";

const runtimeProductsPath = path.join(process.cwd(), "data/products.json");
const fallbackProductsPath = path.join(process.cwd(), "src/data/products.json");
const tmpProductsPath = path.join("/tmp", "products.json");

declare global {
  var __vercelProductsMemory: any[] | undefined;
}

function loadProducts(): any[] {
  if (Array.isArray(global.__vercelProductsMemory)) {
    return global.__vercelProductsMemory;
  }

  try {
    if (fs.existsSync(tmpProductsPath)) {
      const parsed = JSON.parse(fs.readFileSync(tmpProductsPath, "utf-8"));
      if (Array.isArray(parsed)) {
        global.__vercelProductsMemory = parsed;
        return parsed;
      }
    }
  } catch {}

  try {
    if (fs.existsSync(runtimeProductsPath)) {
      const parsed = JSON.parse(fs.readFileSync(runtimeProductsPath, "utf-8"));
      if (Array.isArray(parsed)) {
        global.__vercelProductsMemory = parsed;
        return parsed;
      }
    }
  } catch {}

  try {
    if (fs.existsSync(fallbackProductsPath)) {
      const parsed = JSON.parse(fs.readFileSync(fallbackProductsPath, "utf-8"));
      if (Array.isArray(parsed)) {
        global.__vercelProductsMemory = parsed;
        return parsed;
      }
    }
  } catch {}

  global.__vercelProductsMemory = Array.isArray(initialProducts) ? [...initialProducts] : [];
  return global.__vercelProductsMemory;
}

function saveProducts(products: any[]) {
  global.__vercelProductsMemory = products;

  try {
    fs.writeFileSync(tmpProductsPath, JSON.stringify(products), "utf-8");
  } catch {}

  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(runtimeProductsPath, JSON.stringify(products, null, 2), "utf-8");
    fs.writeFileSync(fallbackProductsPath, JSON.stringify(products, null, 2), "utf-8");
  } catch {}
}

export async function GET() {
  const products = loadProducts();
  return NextResponse.json(products, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    if (!product.id || !product.name) {
      return NextResponse.json({ error: "id and name are required" }, { status: 400 });
    }

    const current = loadProducts();
    const updated = [product, ...current.filter((p: any) => p.id !== product.id)];
    saveProducts(updated);

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("Products POST error:", err);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const product = await request.json();
    if (!product.id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const current = loadProducts();
    const idx = current.findIndex((p: any) => p.id === product.id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...product };
    } else {
      current.unshift(product);
    }
    saveProducts(current);

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("Products PUT error:", err);
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

    const current = loadProducts();
    const updated = current.filter((p: any) => p.id !== id);
    saveProducts(updated);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Products DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
