import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  try {
    const { list } = await import("@vercel/blob");
    const result = await list({ prefix: "digests/" });
    return res.json({ 
      success: true, 
      blobCount: result.blobs.length,
      hasMore: result.hasMore,
      blobs: result.blobs.map(b => b.pathname)
    });
  } catch (err: any) {
    return res.status(500).json({ 
      error: err.message, 
      name: err.name,
      stack: err.stack?.split("\n").slice(0, 5)
    });
  }
}
