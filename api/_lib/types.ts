// Types copied from shared/schema.ts for use in Vercel serverless functions.
// Only interfaces — no drizzle/pg dependencies.

export interface DigestData {
  generatedAt: string;
  dateLabel: string;
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
  iconType: string;
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
  url?: string;
  emailId?: string;
  summary?: string[];
  extractedLinks?: ExtractedLink[];
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
  category: string;
  url?: string;
  timestamp: string;
  importance: "high" | "medium" | "low";
}

export interface AIToolGuide {
  id: string;
  toolName: string;
  title: string;
  category: "productivity" | "creative" | "business" | "personal";
  tagline: string;
  whatItIs: string;
  useCase: string;
  whyItMatters: string;
  steps: TutorialStep[];
  proTips?: string[];
  source: ToolSource;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeToComplete: string;
  toolUrl?: string;
  iconEmoji: string;
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  detail: string;
  tip?: string;
}

export interface ToolSource {
  platform: "youtube" | "reddit" | "substack" | "other";
  author: string;
  url: string;
  title: string;
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

export interface SearchResult {
  date: string;
  dateLabel: string;
  section: string;
  title: string;
  snippet: string;
  url?: string;
  category?: string;
}
