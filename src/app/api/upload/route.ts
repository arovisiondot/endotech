import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try saving to public/uploads (works on local dev and writable servers)
    try {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir, { recursive: true });
      }

      // Clean safe filename
      const safeName = Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const destPath = path.join(uploadsDir, safeName);
      await fs.promises.writeFile(destPath, buffer);

      const publicUrl = `/uploads/${safeName}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filePath: publicUrl,
      });
    } catch (fsErr) {
      // 2. Serverless fallback (Vercel has read-only filesystem): return base64 data URI
      console.warn("Server filesystem read-only (Vercel), returning base64 data URI", fsErr);
      const mimeType = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const dataUri = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUri,
        filePath: dataUri,
      });
    }
  } catch (err: unknown) {
    console.error("Upload Error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
