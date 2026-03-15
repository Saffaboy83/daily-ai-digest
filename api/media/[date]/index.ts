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
    // Normalize filenames: strip Vercel Blob random suffixes (e.g. "podcast-AbCdEf123.mp3" -> "podcast.mp3")
    const files = result.blobs.map((b) => {
      let name = b.pathname.replace(prefix, "");
      // Strip random suffix pattern: name-<randomChars>.ext -> name.ext
      name = name.replace(/^(.+?)-[A-Za-z0-9]{20,}(\.[^.]+)$/, "$1$2");
      return name;
    });
    // Deduplicate (in case both clean and suffixed versions exist)
    const unique = [...new Set(files)];
    return res.json({ files: unique });
  } catch {
    return res.json({ files: [] });
  }
}
