import type { VercelRequest, VercelResponse } from "@vercel/node";
import { saveDigest } from "./_lib/blob-storage.js";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { date, data, mediaUrls } = req.body;
    if (!date || !data) {
      return res.status(400).json({ error: "date and data required" });
    }

    // If mediaUrls are provided, attach them to the data so the frontend can reference them
    if (mediaUrls && typeof mediaUrls === "object") {
      data._mediaUrls = mediaUrls;
    }

    await saveDigest(date, data);
    return res.json({ success: true });
  } catch (err: any) {
    console.error("Digest POST error:", err);
    return res.status(500).json({ error: err.message || "Internal server error", stack: err.stack });
  }
}
