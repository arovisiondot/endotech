import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import initialSiteContent from "@/data/site-content.json";

const runtimeFilePath = path.join(process.cwd(), "data/site-content.json");
const fallbackFilePath = path.join(process.cwd(), "src/data/site-content.json");
const tmpFilePath = path.join("/tmp", "site-content.json");

declare global {
  var __vercelContentMemory: any | undefined;
}

function loadContent(): any {
  if (global.__vercelContentMemory) {
    return global.__vercelContentMemory;
  }

  try {
    if (fs.existsSync(tmpFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(tmpFilePath, "utf-8"));
      global.__vercelContentMemory = parsed;
      return parsed;
    }
  } catch {}

  try {
    if (fs.existsSync(runtimeFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(runtimeFilePath, "utf-8"));
      global.__vercelContentMemory = parsed;
      return parsed;
    }
  } catch {}

  try {
    if (fs.existsSync(fallbackFilePath)) {
      const parsed = JSON.parse(fs.readFileSync(fallbackFilePath, "utf-8"));
      global.__vercelContentMemory = parsed;
      return parsed;
    }
  } catch {}

  global.__vercelContentMemory = initialSiteContent;
  return initialSiteContent;
}

function saveContent(content: any) {
  global.__vercelContentMemory = content;

  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(content, null, 2), "utf-8");
  } catch {}

  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(runtimeFilePath, JSON.stringify(content, null, 2), "utf-8");
    fs.writeFileSync(fallbackFilePath, JSON.stringify(content, null, 2), "utf-8");
  } catch {}
}

export async function GET() {
  const content = loadContent();
  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  try {
    const updatedContent = await request.json();
    saveContent(updatedContent);

    return NextResponse.json({
      success: true,
      message: "Site content saved successfully!",
      content: updatedContent,
    });
  } catch (err) {
    console.error("API Content POST Error:", err);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
