import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  const tokenPrefix = hasToken ? process.env.BLOB_READ_WRITE_TOKEN!.substring(0, 10) + "..." : "NOT SET";
  
  return res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    blobToken: tokenPrefix,
    nodeVersion: process.version,
  });
}
