import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { date, files } = req.body;
  if (!date || !files || !Array.isArray(files)) {
    return res.status(400).json({ error: "date and files[] required. Each file: { filename, base64, contentType }" });
  }

  const mimeTypes: Record<string, string> = {
    ".mp3": "audio/mpeg",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".pdf": "application/pdf",
  };

  const uploaded: Array<{ filename: string; url: string }> = [];

  for (const file of files) {
    const { filename, base64, contentType } = file;
    if (!filename || !base64) {
      continue;
    }

    const buffer = Buffer.from(base64, "base64");
    const ext = filename.includes(".") ? `.${filename.split(".").pop()}` : "";
    const ct = contentType || mimeTypes[ext.toLowerCase()] || "application/octet-stream";
    const key = `media/${date}/${filename}`;

    const blob = await put(key, buffer, {
      access: "public",
      contentType: ct,
      addRandomSuffix: false,
    });

    uploaded.push({ filename, url: blob.url });
  }

  return res.json({ success: true, uploaded });
}
