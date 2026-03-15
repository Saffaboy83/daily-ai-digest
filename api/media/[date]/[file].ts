import type { VercelRequest, VercelResponse } from "@vercel/node";
import { head, list } from "@vercel/blob";

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
    // Exact key not found - try to find a blob with a random suffix
    // e.g. "podcast.mp3" -> look for "podcast-<randomChars>.mp3"
    try {
      const extIdx = file.lastIndexOf(".");
      const baseName = extIdx > 0 ? file.substring(0, extIdx) : file;
      const ext = extIdx > 0 ? file.substring(extIdx) : "";
      const prefix = `media/${date}/${baseName}`;
      const result = await list({ prefix });
      const match = result.blobs.find((b) => {
        const bName = b.pathname.replace(`media/${date}/`, "");
        // Match: baseName-<randomSuffix>.ext
        return bName.startsWith(baseName) && bName.endsWith(ext);
      });
      if (match) {
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.redirect(302, match.url);
      }
    } catch {}
    return res.status(404).json({ error: "Media not found" });
  }
}
