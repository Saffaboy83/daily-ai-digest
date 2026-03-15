import type { VercelRequest, VercelResponse } from "@vercel/node";
import { listDigestDates } from "./_lib/blob-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const allDates = await listDigestDates();
    // Filter: only valid YYYY-MM-DD format, no future dates, no test entries
    const today = new Date().toISOString().split("T")[0];
    const dates = allDates.filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= today);
    return res.json({ dates });
  } catch (err: any) {
    console.error("listDigestDates error:", err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
