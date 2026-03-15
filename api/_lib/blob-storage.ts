import { put, list, head } from "@vercel/blob";
import type { DigestData, SearchResult } from "./types";
import { seedDigest, SEED_DATE } from "./seed";

const DIGEST_PREFIX = "digests/";

function hasBlobToken(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function getDigest(date: string): Promise<{ date: string; data: DigestData } | null> {
  if (hasBlobToken()) {
    const key = `${DIGEST_PREFIX}${date}.json`;
    try {
      const blob = await head(key);
      const res = await fetch(blob.url);
      const data = (await res.json()) as DigestData;
      return { date, data };
    } catch {
      // Blob not found — fall through to seed check
    }
  }
  // Fall back to seed data
  if (date === SEED_DATE) {
    return { date, data: seedDigest };
  }
  return null;
}

export async function saveDigest(date: string, data: DigestData): Promise<void> {
  const key = `${DIGEST_PREFIX}${date}.json`;
  await put(key, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function listDigestDates(): Promise<string[]> {
  const dates = new Set<string>();

  if (hasBlobToken()) {
    try {
      let cursor: string | undefined;
      do {
        const result = await list({ prefix: DIGEST_PREFIX, cursor });
        for (const blob of result.blobs) {
          // key looks like "digests/2026-03-14.json"
          const name = blob.pathname.replace(DIGEST_PREFIX, "").replace(".json", "");
          if (name) dates.add(name);
        }
        cursor = result.hasMore ? result.cursor : undefined;
      } while (cursor);
    } catch (err) {
      console.error("Blob list error:", err);
    }
  }

  // Always include the seed date
  dates.add(SEED_DATE);

  return Array.from(dates).sort().reverse();
}

export async function searchAllDigests(query: string): Promise<SearchResult[]> {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  const dates = await listDigestDates();

  for (const date of dates) {
    const digest = await getDigest(date);
    if (!digest) continue;
    const data = digest.data;
    const dateLabel = data.dateLabel || date;

    for (const story of data.topStories || []) {
      if (matches(q, story.title, story.summary, story.source)) {
        results.push({ date, dateLabel, section: "Top Stories", title: story.title, snippet: story.summary, url: story.url, category: story.category });
      }
    }

    for (const dev of data.aiDevelopments || []) {
      if (matches(q, dev.title, dev.detail, dev.tag)) {
        results.push({ date, dateLabel, section: "AI Developments", title: dev.title, snippet: dev.detail, url: dev.url, category: dev.tag });
      }
    }

    for (const nl of data.newsletters || []) {
      if (matches(q, nl.from, nl.subject, nl.tag)) {
        results.push({ date, dateLabel, section: "Newsletters", title: nl.subject, snippet: `From: ${nl.from}`, url: nl.url, category: nl.tag });
      }
    }

    for (const item of data.worldNews || []) {
      if (matches(q, item.title, item.summary, item.source, item.category)) {
        results.push({ date, dateLabel, section: "World News", title: item.title, snippet: item.summary, url: item.url, category: item.category });
      }
    }

    for (const event of data.upcomingEvents || []) {
      if (matches(q, event.title, event.description, event.category)) {
        results.push({ date, dateLabel, section: "Upcoming Events", title: event.title, snippet: event.description, url: event.url, category: event.category });
      }
    }

    for (const stock of data.marketPulse || []) {
      if (matches(q, stock.ticker, stock.name, stock.change)) {
        results.push({ date, dateLabel, section: "Market Pulse", title: `${stock.ticker} — ${stock.name}`, snippet: `${stock.price} (${stock.change})`, url: stock.url });
      }
    }

    for (const comp of data.competitiveLandscape || []) {
      if (matches(q, comp.name, comp.move, comp.sentiment)) {
        results.push({ date, dateLabel, section: "Competitive Landscape", title: comp.name, snippet: comp.move, url: comp.url, category: comp.sentiment });
      }
    }

    for (const m of data.industryMetrics || []) {
      if (matches(q, m.metric, m.value, m.change)) {
        results.push({ date, dateLabel, section: "Industry Metrics", title: m.metric, snippet: `${m.value} — ${m.change}`, url: m.url });
      }
    }
  }

  results.sort((a, b) => b.date.localeCompare(a.date));
  return results;
}

export async function getMediaUrl(date: string, filename: string): Promise<string | null> {
  if (!hasBlobToken()) return null;
  const key = `media/${date}/${filename}`;
  try {
    const blob = await head(key);
    return blob.url;
  } catch {
    return null;
  }
}

function matches(query: string, ...fields: (string | undefined)[]): boolean {
  for (const field of fields) {
    if (field && field.toLowerCase().includes(query)) return true;
  }
  return false;
}
