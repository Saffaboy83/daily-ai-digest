import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Filename, X-Date, X-Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const filename = req.headers["x-filename"] as string;
  const date = req.headers["x-date"] as string;
  const contentType = (req.headers["x-content-type"] as string) || "application/octet-stream";

  if (!filename || !date) {
    return res.status(400).json({ error: "x-filename and x-date headers required" });
  }

  try {
    // req.body is the raw buffer when content-type is application/octet-stream
    const key = `media/${date}/${filename}`;
    const blob = await put(key, req.body as Buffer, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });

    return res.json({ success: true, filename, url: blob.url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
