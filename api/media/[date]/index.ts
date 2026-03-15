import type { VercelRequest, VercelResponse } from "@vercel/node";
import { list } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const date = req.query.date as string;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.json({ files: [] });
  }
  try {
    const prefix = `media/${date}/`;
    const result = await list({ prefix });
    const files = result.blobs.map((b) => b.pathname.replace(prefix, ""));
    return res.json({ files });
  } catch {
    return res.json({ files: [] });
  }
}
