import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

const runtimeFilePath = path.join(process.cwd(), "data/site-content.json");
const fallbackFilePath = path.join(process.cwd(), "src/data/site-content.json");

export async function GET() {
  try {
    // 1. Try reading from runtime persistent storage first
    if (fs.existsSync(runtimeFilePath)) {
      const data = fs.readFileSync(runtimeFilePath, "utf-8");
      return NextResponse.json(JSON.parse(data));
    }

    // 2. Try reading from fallback template file
    if (fs.existsSync(fallbackFilePath)) {
      const data = fs.readFileSync(fallbackFilePath, "utf-8");
      return NextResponse.json(JSON.parse(data));
    }

    // 3. Fallback to Supabase if available
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("id", "main")
      .single();

    if (!error && data?.content) {
      return NextResponse.json(data.content);
    }

    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  } catch (err: unknown) {
    console.error("API Content GET Error:", err);
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedContent = await request.json();

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 1. Write to runtime storage outside of watched src/ directory to prevent unwanted dev server page reloads
    fs.writeFileSync(runtimeFilePath, JSON.stringify(updatedContent, null, 2), "utf-8");

    // Also sync to fallback template file so both runtime and source files stay 100% identical
    if (fs.existsSync(path.dirname(fallbackFilePath))) {
      try {
        fs.writeFileSync(fallbackFilePath, JSON.stringify(updatedContent, null, 2), "utf-8");
      } catch (e) {
        console.warn("Could not write fallback template file", e);
      }
    }

    // 2. Optionally sync to Supabase if available
    try {
      await supabase.from("site_content").upsert({
        id: "main",
        content: updatedContent,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Supabase is optional fallback
    }

    return NextResponse.json({
      success: true,
      message: "Site content saved and live successfully!",
      content: updatedContent,
    });
  } catch (err: unknown) {
    console.error("API Content POST Error:", err);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
