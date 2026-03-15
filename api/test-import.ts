import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  try {
    // Test step by step
    const steps: string[] = [];
    
    steps.push("1. Starting import test");
    
    const types = await import("./_lib/types");
    steps.push("2. types.ts imported OK");
    
    const seed = await import("./_lib/seed");
    steps.push(`3. seed.ts imported OK, SEED_DATE=${seed.SEED_DATE}`);
    
    const storage = await import("./_lib/blob-storage");
    steps.push("4. blob-storage.ts imported OK");
    
    const dates = await storage.listDigestDates();
    steps.push(`5. listDigestDates returned: ${JSON.stringify(dates)}`);
    
    return res.json({ success: true, steps });
  } catch (err: any) {
    return res.status(500).json({ 
      error: err.message, 
      name: err.name,
      stack: err.stack?.split("\n").slice(0, 8)
    });
  }
}
