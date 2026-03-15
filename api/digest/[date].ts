import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDigest, saveDigest } from "../_lib/blob-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const { date } = req.query;
  const dateStr = Array.isArray(date) ? date[0] : date;
  if (!dateStr) {
    return res.status(400).json({ error: "date parameter required" });
  }

  if (req.method === "GET") {
    const digest = await getDigest(dateStr);
    if (!digest) {
      return res.status(404).json({ error: "No digest found for this date" });
    }
    return res.json(digest);
  }

  if (req.method === "POST") {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "data required in body" });
    }
    await saveDigest(dateStr, data);
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
