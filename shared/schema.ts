import { pgTable, text, serial, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Daily digest stored as a single JSON blob per day
export const digests = pgTable("digests", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(), // "2026-03-14"
  data: jsonb("data").notNull(),
});

export const insertDigestSchema = createInsertSchema(digests).omit({ id: true });
export type InsertDigest = z.infer<typeof insertDigestSchema>;
export type Digest = typeof digests.$inferSelect;

// Shape of the data JSON blob
export interface DigestData {
  generatedAt: string;
  dateLabel: string; // "Saturday, March 14, 2026"
  kpis: {
    newsletters: number;
    aiStories: number;
    upcomingEvents: number;
    keyDevelopments: number;
    worldNews: number;
  };
  topStories: TopStory[];
  aiDevelopments: AIDevelopment[];
  newsletters: Newsletter[];
  upcomingEvents: UpcomingEvent[];
  marketPulse: MarketItem[];
  competitiveLandscape: CompetitorEntry[];
  industryMetrics: MetricEntry[];
  worldNews: WorldNewsItem[];
  socialMedia?: SocialMediaContent;
  aiToolGuides?: AIToolGuide[];
}

export interface TopStory {
  id: string;
  title: string;
  source: string;
  category: string;
  summary: string;
  url?: string;
  timestamp: string;
  importance: "high" | "medium" | "low";
  iconType: string; // "cpu" | "building" | "alert" | "rocket" | "zap" | "sparkles"
}

export interface AIDevelopment {
  title: string;
  detail: string;
  tag: string;
  colorClass: string;
  url?: string;
}

export interface Newsletter {
  from: string;
  subject: string;
  date: string;
  tag: string;
  url?: string; // Gmail web link
  emailId?: string;
  summary?: string[]; // 2-3 bullet point summary of the newsletter content
  extractedLinks?: ExtractedLink[]; // Key article links found inside the newsletter
}

export interface ExtractedLink {
  title: string;
  url: string;
}

export interface UpcomingEvent {
  title: string;
  date: string;
  category: string;
  description: string;
  url?: string;
}

export interface MarketItem {
  ticker: string;
  name: string;
  price: string;
  change: string;
  positive: boolean;
  url?: string;
}

export interface CompetitorEntry {
  name: string;
  move: string;
  sentiment: string;
  colorClass: string;
  url?: string;
}

export interface MetricEntry {
  metric: string;
  value: string;
  change: string;
  url?: string;
}

export interface WorldNewsItem {
  title: string;
  summary: string;
  source: string;
  category: string; // "Conflict", "Politics", "Economy", "Climate", "Health", "Society"
  url?: string;
  timestamp: string;
  importance: "high" | "medium" | "low";
}

export interface AIToolGuide {
  id: string;
  toolName: string;           // Name of the AI tool (e.g., "Cursor", "NotebookLM")
  title: string;              // Catchy headline for the guide
  category: "productivity" | "creative" | "business" | "personal";
  tagline: string;            // One-line value proposition
  whatItIs: string;           // 2-3 sentence description of the tool
  useCase: string;            // Specific real-world scenario
  whyItMatters: string;       // How it makes things better for the user
  steps: TutorialStep[];      // Step-by-step walkthrough
  proTips?: string[];         // Optional power-user tips
  source: ToolSource;         // Where this was discovered
  difficulty: "beginner" | "intermediate" | "advanced";
  timeToComplete: string;     // e.g., "10 minutes", "30 minutes"
  toolUrl?: string;           // Link to the tool itself
  iconEmoji: string;          // Emoji for visual identity
}

export interface TutorialStep {
  stepNumber: number;
  title: string;              // Short action title
  detail: string;             // Explanation of what to do
  tip?: string;               // Optional helpful note
}

export interface ToolSource {
  platform: "youtube" | "reddit" | "substack" | "other";
  author: string;
  url: string;
  title: string;              // Original content title
}

export interface SocialMediaContent {
  linkedin: LinkedInPost;
  twitter: TwitterPost;
  youtubeShort: YouTubeShortScript;
}

export interface LinkedInPost {
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  carouselSlides: CarouselSlide[];
}

export interface CarouselSlide {
  slideNumber: number;
  headline: string;
  body: string;
  emoji?: string;
}

export interface TwitterPost {
  mainTweet: string;
  thread: string[];
  hashtags: string[];
}

export interface YouTubeShortScript {
  title: string;
  hookLine: string;
  script: string;
  duration: string;
  captions: string[];
  cta: string;
}
