import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ─── GET: سب products لاؤ ───────────────────────────────────────────────────
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET products error:", error.message);
      return NextResponse.json([], { status: 200 });
    }

    const formatted = (data || []).map((row: any) => ({
      id: row.id,
      code: row.code || "",
      name: row.name || "",
      slug: row.slug || "",
      category: row.category || "general-instrumentation",
      subcategory: row.subcategory || "",
      product_type: row.product_type || "",
      pattern: row.pattern || "",
      cup_size: row.cup_size || "",
      length: row.length || "",
      material: row.material || "",
      stock: row.stock || "In Stock",
      description: row.description || "",
      image: row.image || "",
      gallery: row.gallery || [],
      size_options: row.size_options || [],
      isFeatured: row.is_featured ?? true,
      specs: row.specs || [],
      sizes_table: row.sizes_table || [],
      ...(row.data || {}),
    }));

    return NextResponse.json(formatted, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Products GET fatal error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

// ─── POST: نئی product شامل کرو ─────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const product = await request.json();

    if (!product.id || !product.name) {
      return NextResponse.json({ error: "id اور name ضروری ہیں" }, { status: 400 });
    }

    const { error } = await supabase.from("products").upsert({
      id: product.id,
      code: product.code || "",
      name: product.name || "",
      slug: product.slug || product.id,
      category: product.category || "general-instrumentation",
      subcategory: product.subcategory || "",
      product_type: product.product_type || "",
      pattern: product.pattern || "",
      cup_size: product.cup_size || "",
      length: product.length || "",
      material: product.material || "",
      stock: product.stock || "In Stock",
      description: product.description || "",
      image: product.image || "",
      gallery: product.gallery || [],
      size_options: product.size_options || [],
      specs: product.specs || [],
      sizes_table: product.sizes_table || [],
      is_featured: product.isFeatured ?? true,
      data: product,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("POST product error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("Products POST fatal error:", err);
    return NextResponse.json({ error: "Product شامل کرنے میں ناکامی" }, { status: 500 });
  }
}

// ─── PUT: product update کرو ─────────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    const product = await request.json();

    if (!product.id) {
      return NextResponse.json({ error: "Product ID ضروری ہے" }, { status: 400 });
    }

    const { error } = await supabase.from("products").upsert({
      id: product.id,
      code: product.code || "",
      name: product.name || "",
      slug: product.slug || product.id,
      category: product.category || "general-instrumentation",
      subcategory: product.subcategory || "",
      product_type: product.product_type || "",
      pattern: product.pattern || "",
      cup_size: product.cup_size || "",
      length: product.length || "",
      material: product.material || "",
      stock: product.stock || "In Stock",
      description: product.description || "",
      image: product.image || "",
      gallery: product.gallery || [],
      size_options: product.size_options || [],
      specs: product.specs || [],
      sizes_table: product.sizes_table || [],
      is_featured: product.isFeatured ?? true,
      data: product,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("PUT product error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("Products PUT fatal error:", err);
    return NextResponse.json({ error: "Product update میں ناکامی" }, { status: 500 });
  }
}

// ─── DELETE: product حذف کرو ─────────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID ضروری ہے" }, { status: 400 });
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("DELETE product error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product حذف ہو گئی" });
  } catch (err) {
    console.error("Products DELETE fatal error:", err);
    return NextResponse.json({ error: "Product حذف کرنے میں ناکامی" }, { status: 500 });
  }
}
