import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const runtimeFilePath = path.join(process.cwd(), "data/site-content.json");
const fallbackFilePath = path.join(process.cwd(), "src/data/site-content.json");

// In-memory cache
declare global {
  var __inMemoryContentCache: any | undefined;
  var __inMemoryContentCacheTime: number | undefined;
}

const CACHE_TTL_MS = 5000; // 5 seconds cache

function getLocalContent(): any {
  // Check /tmp if running on Vercel
  try {
    const tmpPath = path.join("/tmp", "site-content.json");
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, "utf-8");
      return JSON.parse(raw);
    }
  } catch {}

  // Check data/site-content.json
  if (fs.existsSync(runtimeFilePath)) {
    try {
      const data = fs.readFileSync(runtimeFilePath, "utf-8");
      return JSON.parse(data);
    } catch {}
  }

  // Check fallback template file
  if (fs.existsSync(fallbackFilePath)) {
    try {
      const data = fs.readFileSync(fallbackFilePath, "utf-8");
      return JSON.parse(data);
    } catch {}
  }

  return null;
}

function saveLocalContent(content: any) {
  try {
    const tmpPath = path.join("/tmp", "site-content.json");
    fs.writeFileSync(tmpPath, JSON.stringify(content, null, 2), "utf-8");
  } catch {}

  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(runtimeFilePath, JSON.stringify(content, null, 2), "utf-8");
    try {
      fs.writeFileSync(fallbackFilePath, JSON.stringify(content, null, 2), "utf-8");
    } catch {}
  } catch {}
}

export async function GET() {
  try {
    const now = Date.now();
    // 1. In-memory cache
    if (
      global.__inMemoryContentCache &&
      global.__inMemoryContentCacheTime &&
      now - global.__inMemoryContentCacheTime < CACHE_TTL_MS
    ) {
      return NextResponse.json(global.__inMemoryContentCache, {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
        },
      });
    }

    // 2. Fetch from Supabase Central Database
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("content")
          .eq("id", "main")
          .single();

        if (!error && data?.content) {
          global.__inMemoryContentCache = data.content;
          global.__inMemoryContentCacheTime = now;

          return NextResponse.json(data.content, {
            headers: {
              "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
            },
          });
        }
      } catch (dbErr) {
        console.warn("Supabase content GET warning, using local fallback:", dbErr);
      }
    }

    // 3. Fallback to local files
    const local = getLocalContent();
    if (local) {
      global.__inMemoryContentCache = local;
      global.__inMemoryContentCacheTime = now;
      return NextResponse.json(local, {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
        },
      });
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

    // 1. Sync to Supabase Central Database
    if (isSupabaseConfigured()) {
      try {
        await supabase.from("site_content").upsert({
          id: "main",
          content: updatedContent,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Supabase content POST warning:", err);
      }
    }

    // 2. Update local fallback storage
    saveLocalContent(updatedContent);

    // Invalidate in-memory cache
    global.__inMemoryContentCache = updatedContent;
    global.__inMemoryContentCacheTime = Date.now();

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
