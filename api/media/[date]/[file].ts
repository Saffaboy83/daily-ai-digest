import type { VercelRequest, VercelResponse } from "@vercel/node";
import { head } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const date = req.query.date as string;
  const file = req.query.file as string;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(404).json({ error: "Media not found" });
  }

  const key = `media/${date}/${file}`;
  try {
    const blob = await head(key);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.redirect(302, blob.url);
  } catch {
    return res.status(404).json({ error: "Media not found" });
  }
}
