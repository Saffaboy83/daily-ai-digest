import type { VercelRequest, VercelResponse } from "@vercel/node";
import { searchAllDigests } from "./_lib/blob-storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const q = (typeof req.query.q === "string" ? req.query.q : "").trim();
  if (!q || q.length < 2) {
    return res.json({ results: [], query: q });
  }

  const results = await searchAllDigests(q);
  return res.json({ results, query: q });
}
