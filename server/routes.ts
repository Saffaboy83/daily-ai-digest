import type { Express } from "express";
import type { Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";

export async function registerRoutes(server: Server, app: Express) {
  // Search across all digests
  app.get("/api/search", async (req, res) => {
    const q = (req.query.q as string || "").trim();
    if (!q || q.length < 2) {
      return res.json({ results: [], query: q });
    }
    const results = await storage.searchAllDigests(q);
    res.json({ results, query: q });
  });

  // Get a specific digest by date
  app.get("/api/digest/:date", async (req, res) => {
    const { date } = req.params;
    const digest = await storage.getDigest(date);
    if (!digest) {
      return res.status(404).json({ error: "No digest found for this date" });
    }
    res.json(digest);
  });

  // List all available digest dates
  app.get("/api/digests", async (_req, res) => {
    const dates = await storage.listDigestDates();
    res.json({ dates });
  });

  // Save a new digest (used by the cron job)
  app.post("/api/digest", async (req, res) => {
    const { date, data } = req.body;
    if (!date || !data) {
      return res.status(400).json({ error: "date and data required" });
    }
    await storage.saveDigest(date, data);
    res.json({ success: true });
  });

  // Serve media files (podcast audio, infographics)
  app.get("/api/media/:date/:file", (req, res) => {
    const { date, file } = req.params;
    // Sanitize to prevent path traversal
    const safeName = path.basename(file);
    const mediaDir = path.resolve(process.cwd(), "media", date);
    const filePath = path.join(mediaDir, safeName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Media not found" });
    }

    const ext = path.extname(safeName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".mp3": "audio/mpeg",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
    };
    res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=86400");
    fs.createReadStream(filePath).pipe(res);
  });

  // Check which media files exist for a date
  app.get("/api/media/:date", (req, res) => {
    const { date } = req.params;
    const mediaDir = path.resolve(process.cwd(), "media", date);
    if (!fs.existsSync(mediaDir)) {
      return res.json({ files: [] });
    }
    const files = fs.readdirSync(mediaDir);
    res.json({ files });
  });
}
