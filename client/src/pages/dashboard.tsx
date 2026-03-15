import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// Attribution removed
import type { DigestData, SocialMediaContent } from "@shared/schema";

interface SearchResult {
  date: string;
  dateLabel: string;
  section: string;
  title: string;
  snippet: string;
  url?: string;
  category?: string;
}
import { apiRequest } from "@/lib/queryClient";
import {
  Brain,
  Mail,
  Newspaper,
  Calendar,
  TrendingUp,
  Cpu,
  Zap,
  Clock,
  ExternalLink,
  Sun,
  Moon,
  Sparkles,
  AlertTriangle,
  Rocket,
  Building2,
  Globe,
  ChevronLeft,
  ChevronRight,
  MailOpen,
  Shield,
  Landmark,
  DollarSign,
  Heart,
  Users,
  Headphones,
  Play,
  Pause,
  ImageIcon,
  Download,
  Volume2,
  Linkedin,
  Twitter,
  Youtube,
  Copy,
  Check,
  Hash,
  MessageSquare,
  Share2,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Home,
} from "lucide-react";

/** API base for media URLs — mirrors queryClient.ts pattern */
const API_BASE = "__PORT_5000__".startsWith("__") ? "" : "__PORT_5000__";

/**
 * Reusable link component that always opens URLs in a new tab.
 */
function ExtLink({ href, className, children, ...rest }: { href: string; className?: string; children: React.ReactNode; [key: string]: any }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`cursor-pointer ${className || ""}`}
      {...rest}
    >
      {children}
    </a>
  );
}

const ICON_MAP: Record<string, React.ElementType> = {
  cpu: Cpu,
  building: Building2,
  alert: AlertTriangle,
  rocket: Rocket,
  zap: Zap,
  sparkles: Sparkles,
};

function formatDateForApi(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDateDisplay(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function TagBadge({ tag }: { tag: string }) {
  const colorMap: Record<string, string> = {
    AI: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "AI Tools": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "AI/Robotics": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    Finance: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Fintech: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    Dev: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    DevTools: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    Data: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    Tools: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    Tech: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    Marketing: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    Business: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    Mindset: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  };
  return (
    <Badge className={`text-[10px] px-1.5 py-0 border-0 shrink-0 ${colorMap[tag] || "bg-muted text-muted-foreground"}`}>
      {tag}
    </Badge>
  );
}

// ─── Search Section Map ─────────────────────────────────────────────────────

const SECTION_META: Record<string, { icon: React.ElementType; color: string }> = {
  "Top Stories": { icon: Newspaper, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  "AI Developments": { icon: Brain, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  "Newsletters": { icon: Mail, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  "World News": { icon: Globe, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  "Upcoming Events": { icon: Calendar, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  "Market Pulse": { icon: TrendingUp, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  "Competitive Landscape": { icon: Building2, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  "Industry Metrics": { icon: Zap, color: "bg-lime-500/10 text-lime-600 dark:text-lime-400" },
};

// ─── Global Search ──────────────────────────────────────────────────────────

function GlobalSearch({
  onNavigate,
}: {
  onNavigate: (date: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the query by 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const { data: searchData, isLoading: searchLoading } = useQuery<{ results: SearchResult[]; query: string }>({
    queryKey: ["/api/search", debouncedQuery],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
      return res.json();
    },
    enabled: debouncedQuery.length >= 2,
  });

  const results = searchData?.results || [];

  // Group results by date
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.date]) acc[r.date] = [];
    acc[r.date].push(r);
    return acc;
  }, {});

  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      window.open(result.url, "_blank");
    }
  };

  const handleGoToDate = (date: string) => {
    onNavigate(date);
    setOpen(false);
    setQuery("");
  };

  // Highlight matching text
  const highlight = (text: string) => {
    if (!debouncedQuery || debouncedQuery.length < 2) return text;
    const regex = new RegExp(`(${debouncedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
        data-testid="button-search"
        aria-label="Search digests"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-[10px] ml-1 px-1 py-0.5 rounded bg-muted border border-border/60 font-mono">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh]" data-testid="search-overlay">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => { setOpen(false); setQuery(""); }}
      />

      {/* Search panel */}
      <div className="relative w-full max-w-2xl mx-4 bg-background rounded-xl border border-border shadow-2xl overflow-hidden" style={{ maxHeight: "70vh" }}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all digests... (e.g. NVIDIA, Meta, Iran)"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            data-testid="input-search"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded hover:bg-accent transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          <button
            onClick={() => { setOpen(false); setQuery(""); }}
            className="text-[10px] px-1.5 py-0.5 rounded bg-muted border border-border/60 text-muted-foreground font-mono hover:bg-accent transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 52px)" }}>
          {debouncedQuery.length < 2 ? (
            <div className="px-4 py-8 text-center">
              <Search className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Type at least 2 characters to search across all your digests</p>
            </div>
          ) : searchLoading ? (
            <div className="px-4 py-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No results found for "{debouncedQuery}"</p>
            </div>
          ) : (
            <div className="py-2">
              <div className="px-4 py-1.5">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {results.length} result{results.length !== 1 ? "s" : ""} across {Object.keys(grouped).length} day{Object.keys(grouped).length !== 1 ? "s" : ""}
                </span>
              </div>
              {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                  {/* Date header */}
                  <div className="px-4 py-1.5 bg-muted/30 flex items-center justify-between sticky top-0">
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {items[0].dateLabel}
                    </span>
                    <button
                      onClick={() => handleGoToDate(date)}
                      className="text-[10px] text-primary font-medium hover:underline"
                      data-testid={`search-goto-${date}`}
                    >
                      Go to this day →
                    </button>
                  </div>
                  {/* Items */}
                  {items.map((result, i) => {
                    const meta = SECTION_META[result.section] || SECTION_META["Top Stories"];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={`${date}-${i}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-accent/50 transition-colors cursor-pointer"
                        data-testid={`search-result-${date}-${i}`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${meta.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-xs font-semibold truncate">{highlight(result.title)}</h4>
                            {result.url && <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/40 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{highlight(result.snippet)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-[9px] px-1 py-0 border-0 ${meta.color}`}>{result.section}</Badge>
                            {result.category && (
                              <span className="text-[9px] text-muted-foreground/60">{result.category}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 14)); // Mar 14, 2026

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const dateStr = formatDateForApi(currentDate);

  // Fetch available dates
  const { data: datesData } = useQuery<{ dates: string[] }>({
    queryKey: ["/api/digests"],
  });
  const availableDates = datesData?.dates || [];

  // Fetch digest for current date
  const { data: digestResponse, isLoading, error } = useQuery<{ date: string; data: DigestData }>({
    queryKey: ["/api/digest", dateStr],
  });
  const digest = digestResponse?.data;

  const goToPrevious = () => {
    const idx = availableDates.indexOf(dateStr);
    if (idx < availableDates.length - 1) {
      setCurrentDate(new Date(availableDates[idx + 1] + "T12:00:00"));
    }
  };

  const goToNext = () => {
    const idx = availableDates.indexOf(dateStr);
    if (idx > 0) {
      setCurrentDate(new Date(availableDates[idx - 1] + "T12:00:00"));
    }
  };

  const hasPrevious = availableDates.indexOf(dateStr) < availableDates.length - 1;
  const hasNext = availableDates.indexOf(dateStr) > 0;
  const isLatest = !hasNext || availableDates[0] === dateStr;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="Daily Digest" className="shrink-0">
              <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
              <path d="M8 10h16M8 16h12M8 22h8" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="24" cy="8" r="4" fill="hsl(var(--chart-2))" />
            </svg>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold tracking-tight leading-none" data-testid="text-title">
                Daily Digest
              </h1>
              <p className="text-[11px] text-muted-foreground leading-none mt-0.5 flex items-center gap-1.5 truncate">
                {isLatest && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot inline-block shrink-0" />}
                <span className="hidden sm:inline">{digest?.dateLabel || formatDateDisplay(currentDate)}</span>
                <span className="sm:hidden">{currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </p>
            </div>
          </div>

          {/* Search + Date Navigation */}
          <div className="flex items-center gap-1 shrink-0">
            <GlobalSearch onNavigate={(d) => setCurrentDate(new Date(d + "T12:00:00"))} />
            <div className="w-px h-5 bg-border/50 mx-0.5 sm:mx-1 hidden sm:block" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={goToPrevious}
              disabled={!hasPrevious}
              data-testid="button-prev-day"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Date selector */}
            <div className="relative hidden sm:block">
              <select
                value={dateStr}
                onChange={(e) => setCurrentDate(new Date(e.target.value + "T12:00:00"))}
                className="appearance-none bg-muted/50 border border-border/50 rounded-md px-3 py-1 text-xs font-medium text-foreground cursor-pointer pr-6 focus:outline-none focus:ring-1 focus:ring-primary"
                data-testid="select-date"
              >
                {availableDates.length > 0 ? (
                  availableDates.map((d) => (
                    <option key={d} value={d}>
                      {new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </option>
                  ))
                ) : (
                  <option value={dateStr}>
                    {currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </option>
                )}
              </select>
              <ChevronRight className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" style={{ transform: "translateY(-50%) rotate(90deg)" }} />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={goToNext}
              disabled={!hasNext}
              data-testid="button-next-day"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="w-px h-5 bg-border/50 mx-0.5 sm:mx-1" />

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="w-px h-5 bg-border/50 mx-0.5 sm:mx-1" />

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Go to homepage"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error || !digest ? (
          <EmptyState date={formatDateDisplay(currentDate)} />
        ) : (
          <DigestContent digest={digest} activeTab={activeTab} setActiveTab={setActiveTab} dateStr={dateStr} />
        )}

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-border/30 pb-6">
          <p className="text-[10px] text-muted-foreground/50">
            {digest
              ? `Generated from ${digest.kpis.newsletters} newsletters, ${digest.kpis.aiStories} AI stories, and live web research. ${digest.dateLabel}.`
              : "No digest available for this date."}
          </p>
        </footer>
      </main>
    </div>
  );
}

// ─── Digest Content ─────────────────────────────────────────────────────────

function DigestContent({
  digest,
  activeTab,
  setActiveTab,
  dateStr,
}: {
  digest: DigestData;
  activeTab: string;
  setActiveTab: (v: string) => void;
  dateStr: string;
}) {
  return (
    <>
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {[
          { label: "Newsletters", value: digest.kpis.newsletters, delta: "Last 2 days", icon: Mail },
          { label: "AI Stories", value: digest.kpis.aiStories, delta: "High relevance", icon: Brain },
          { label: "World News", value: digest.kpis.worldNews || 0, delta: "Today's headlines", icon: Globe },
          { label: "Upcoming Events", value: digest.kpis.upcomingEvents, delta: "Next 7 days", icon: Calendar },
          { label: "Key Developments", value: digest.kpis.keyDevelopments, delta: "Breaking now", icon: TrendingUp },
        ].map((kpi) => (
          <Card key={kpi.label} className="p-3.5 border-border/50 bg-card" data-testid={`card-kpi-${kpi.label.toLowerCase()}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground font-medium">{kpi.label}</span>
              <kpi.icon className="w-3.5 h-3.5 text-muted-foreground/60" />
            </div>
            <div className="text-xl font-bold tabular-nums tracking-tight">{kpi.value}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.delta}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide">
          <TabsList className="bg-muted/50 p-0.5 h-9 w-max sm:w-auto">
            <TabsTrigger value="overview" className="text-xs h-8 px-2.5 sm:px-3" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="world" className="text-xs h-8 px-2.5 sm:px-3" data-testid="tab-world">World</TabsTrigger>
            <TabsTrigger value="newsletters" className="text-xs h-8 px-2.5 sm:px-3" data-testid="tab-newsletters">Inbox</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs h-8 px-2.5 sm:px-3" data-testid="tab-ai">AI Intel</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs h-8 px-2.5 sm:px-3" data-testid="tab-upcoming">Events</TabsTrigger>
            <TabsTrigger value="media" className="text-xs h-8 px-2.5 sm:px-3" data-testid="tab-media">Media</TabsTrigger>
            <TabsTrigger value="social" className="text-xs h-8 px-2.5 sm:px-3" data-testid="tab-social">Social</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-5 mt-4">
          <OverviewTab digest={digest} />
        </TabsContent>

        {/* World News */}
        <TabsContent value="world" className="mt-4">
          <WorldNewsTab digest={digest} />
        </TabsContent>

        {/* Newsletters */}
        <TabsContent value="newsletters" className="mt-4">
          <NewslettersTab digest={digest} />
        </TabsContent>

        {/* AI Intel */}
        <TabsContent value="ai" className="mt-4">
          <AIIntelTab digest={digest} />
        </TabsContent>

        {/* Upcoming */}
        <TabsContent value="upcoming" className="mt-4">
          <UpcomingTab digest={digest} />
        </TabsContent>

        {/* Podcast & Media */}
        <TabsContent value="media" className="mt-4">
          <MediaTab dateStr={dateStr} />
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social" className="mt-4">
          <SocialMediaTab digest={digest} dateStr={dateStr} />
        </TabsContent>
      </Tabs>
    </>
  );
}

// ─── Overview Tab ───────────────────────────────────────────────────────────

function OverviewTab({ digest }: { digest: DigestData }) {
  return (
    <>
      {/* Top Stories */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Newspaper className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Top Stories</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {digest.topStories.map((story) => {
            const Icon = ICON_MAP[story.iconType] || Newspaper;
            return (
              <Card key={story.id} className="p-4 border-border/50 bg-card group hover:border-primary/30 transition-colors" data-testid={`card-story-${story.id}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${story.importance === "high" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug">
                        {story.url ? (
                          <ExtLink href={story.url} className="hover:text-primary transition-colors inline">
                            {story.title}
                            <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
                          </ExtLink>
                        ) : story.title}
                      </h3>
                      {story.importance === "high" && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 bg-red-500/10 text-red-600 dark:text-red-400 border-0">HOT</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{story.summary}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-medium text-muted-foreground/70">{story.source}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-[10px] text-muted-foreground/70">{story.timestamp}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Two Column */}
      <div className="grid gap-5 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">AI Developments</h2>
          </div>
          <div className="space-y-2">
            {digest.aiDevelopments.map((item, i) => (
              <Card key={i} className="p-3.5 border-border/50 bg-card hover:border-primary/30 transition-colors">
                {item.url ? (
                  <ExtLink href={item.url} className="flex items-start gap-3 group w-full">
                    <Badge className={`text-[10px] px-1.5 py-0 border-0 shrink-0 mt-0.5 ${item.colorClass}`}>{item.tag}</Badge>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                        <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
                    </div>
                  </ExtLink>
                ) : (
                  <div className="flex items-start gap-3">
                    <Badge className={`text-[10px] px-1.5 py-0 border-0 shrink-0 mt-0.5 ${item.colorClass}`}>{item.tag}</Badge>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-2 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Market Pulse</h2>
            </div>
            <Card className="border-border/50 bg-card divide-y divide-border/50">
              {digest.marketPulse.map((stock) => {
                const inner = (
                  <>
                    <div>
                      <span className="text-xs font-bold tabular-nums">{stock.ticker}</span>
                      <span className="text-[10px] text-muted-foreground ml-1.5">{stock.name}</span>
                    </div>
                    <div className="text-right flex items-center gap-1.5">
                      <div>
                        <div className="text-xs font-medium tabular-nums">{stock.price}</div>
                        <div className={`text-[10px] ${stock.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{stock.change}</div>
                      </div>
                      {stock.url && <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/40" />}
                    </div>
                  </>
                );
                return stock.url ? (
                  <ExtLink key={stock.ticker} href={stock.url} className="px-3.5 py-2.5 flex items-center justify-between hover:bg-accent/30 transition-colors w-full" data-testid={`stock-${stock.ticker}`}>
                    {inner}
                  </ExtLink>
                ) : (
                  <div key={stock.ticker} className="px-3.5 py-2.5 flex items-center justify-between" data-testid={`stock-${stock.ticker}`}>
                    {inner}
                  </div>
                );
              })}
            </Card>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold">Coming Up</h2>
            </div>
            <div className="space-y-2">
              {digest.upcomingEvents.slice(0, 3).map((event, i) => (
                <Card key={i} className="p-3 border-border/50 bg-card" data-testid={`card-event-${i}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/60">{event.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">{event.date}</span>
                  </div>
                  <h3 className="text-xs font-semibold">
                    {event.url ? (
                      <ExtLink href={event.url} className="hover:text-primary transition-colors inline">
                        {event.title}
                        <ExternalLink className="w-2.5 h-2.5 inline-block ml-1 opacity-60" />
                      </ExtLink>
                    ) : event.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{event.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

// ─── Newsletters Tab ────────────────────────────────────────────────────────

function NewslettersTab({ digest }: { digest: DigestData }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const hasSummaries = digest.newsletters.some(nl => nl.summary && nl.summary.length > 0);

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">Inbox Digest</h2>
        <Badge variant="secondary" className="text-[10px] ml-1 border-0">{digest.newsletters.length} newsletters</Badge>
        {hasSummaries && (
          <Badge variant="outline" className="text-[9px] ml-1 border-primary/30 text-primary">AI Summaries</Badge>
        )}
      </div>
      <Card className="border-border/50 bg-card divide-y divide-border/30">
        {digest.newsletters.map((nl, i) => {
          const isExpanded = expandedIdx === i;
          const hasSummary = nl.summary && nl.summary.length > 0;
          const hasLinks = nl.extractedLinks && nl.extractedLinks.length > 0;
          const isExpandable = hasSummary || hasLinks;

          return (
            <div key={i} data-testid={`newsletter-${i}`}>
              <div
                className={`px-3 sm:px-4 py-3 flex items-start sm:items-center gap-3 sm:gap-4 hover:bg-accent/30 transition-colors group cursor-pointer w-full ${
                  isExpanded ? "bg-accent/20" : ""
                }`}
                onClick={() => isExpandable && setExpandedIdx(isExpanded ? null : i)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-foreground shrink-0">{nl.from}</span>
                    <TagBadge tag={nl.tag} />
                    <span className="text-[10px] text-muted-foreground/60 shrink-0 tabular-nums ml-auto">{nl.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-muted-foreground truncate">{nl.subject}</p>
                    {isExpandable && (
                      isExpanded
                        ? <ChevronUp className="w-3 h-3 text-muted-foreground/40 shrink-0 transition-colors" />
                        : <ChevronDown className="w-3 h-3 text-muted-foreground/40 shrink-0 transition-colors" />
                    )}
                    {!isExpandable && nl.url && (
                      <MailOpen className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded summary + links */}
              {isExpanded && (
                <div className="px-3 sm:px-4 pb-3 pt-0 bg-accent/10 border-t border-border/20">
                  {hasSummary && (
                    <div className="mt-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Key Takeaways</p>
                      <ul className="space-y-1">
                        {nl.summary!.map((bullet, bi) => (
                          <li key={bi} className="text-xs text-foreground/80 leading-relaxed flex gap-2">
                            <span className="text-primary mt-0.5 shrink-0">-</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {hasLinks && (
                    <div className={hasSummary ? "mt-3" : "mt-2"}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Referenced Articles</p>
                      <div className="flex flex-wrap gap-1.5">
                        {nl.extractedLinks!.map((link, li) => (
                          <ExtLink
                            key={li}
                            href={link.url}
                            className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors"
                          >
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-[300px]">{link.title}</span>
                          </ExtLink>
                        ))}
                      </div>
                    </div>
                  )}
                  {nl.url && (
                    <div className="mt-2 pt-2 border-t border-border/20">
                      <ExtLink
                        href={nl.url}
                        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        <MailOpen className="w-3 h-3" />
                        <span>Open in Gmail</span>
                      </ExtLink>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </>
  );
}

// ─── AI Intel Tab ───────────────────────────────────────────────────────────

function AIIntelTab({ digest }: { digest: DigestData }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">AI Intelligence Report</h2>
      </div>

      <Card className="border-border/50 bg-card p-4 mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Competitive Landscape</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {digest.competitiveLandscape.map((company) => {
            const content = (
              <>
                <div className="text-xs font-bold flex items-center gap-1">
                  {company.name}
                  {company.url && <ExternalLink className="w-2.5 h-2.5 opacity-50" />}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{company.move}</p>
                <Badge variant="outline" className="text-[9px] px-1 py-0 mt-1.5 border-border/60">{company.sentiment}</Badge>
              </>
            );
            return company.url ? (
              <ExtLink key={company.name} href={company.url} className={`border-l-2 ${company.colorClass} pl-3 py-1 hover:bg-accent/30 rounded-r transition-colors`}>
                {content}
              </ExtLink>
            ) : (
              <div key={company.name} className={`border-l-2 ${company.colorClass} pl-3 py-1`}>
                {content}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="border-border/50 bg-card p-4 mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Industry Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {digest.industryMetrics.map((m, i) => {
            const content = (
              <>
                <div className="text-lg font-bold tabular-nums text-primary">{m.value}</div>
                <div className="text-[11px] font-medium mt-0.5 flex items-center justify-center gap-1">
                  {m.metric}
                  {m.url && <ExternalLink className="w-2.5 h-2.5 opacity-40" />}
                </div>
                <div className="text-[10px] text-muted-foreground">{m.change}</div>
              </>
            );
            return m.url ? (
              <ExtLink key={i} href={m.url} className="text-center hover:bg-accent/30 rounded-lg p-1 transition-colors">
                {content}
              </ExtLink>
            ) : (
              <div key={i} className="text-center">
                {content}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="space-y-2">
        {digest.aiDevelopments.map((item, i) => (
          <Card key={i} className="p-3.5 border-border/50 bg-card hover:border-primary/30 transition-colors">
            {item.url ? (
              <ExtLink href={item.url} className="flex items-start gap-3 group w-full">
                <Badge className={`text-[10px] px-1.5 py-0 border-0 shrink-0 mt-0.5 ${item.colorClass}`}>{item.tag}</Badge>
                <div>
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                    <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
                </div>
              </ExtLink>
            ) : (
              <div className="flex items-start gap-3">
                <Badge className={`text-[10px] px-1.5 py-0 border-0 shrink-0 mt-0.5 ${item.colorClass}`}>{item.tag}</Badge>
                <div>
                  <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}

// ─── World News Tab ─────────────────────────────────────────────────────────

const WORLD_CATEGORY_MAP: Record<string, { icon: React.ElementType; color: string }> = {
  Conflict: { icon: Shield, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  Politics: { icon: Landmark, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  Economy: { icon: DollarSign, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  Health: { icon: Heart, color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  Society: { icon: Users, color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  Climate: { icon: Globe, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
};

function WorldNewsTab({ digest }: { digest: DigestData }) {
  const news = digest.worldNews || [];
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">World News</h2>
        <Badge variant="secondary" className="text-[10px] ml-1 border-0">{news.length} stories</Badge>
      </div>

      {news.length === 0 ? (
        <Card className="p-8 border-border/50 bg-muted/30 border-dashed text-center">
          <Globe className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No world news for this date.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {news.map((item, i) => {
            const catInfo = WORLD_CATEGORY_MAP[item.category] || WORLD_CATEGORY_MAP.Society;
            const CatIcon = catInfo.icon;
            return (
              <Card key={i} className="p-3 sm:p-4 border-border/50 bg-card hover:border-primary/30 transition-colors" data-testid={`card-world-${i}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 hidden sm:block ${item.importance === "high" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <CatIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <Badge className={`text-[10px] px-1.5 py-0 border-0 ${catInfo.color}`}>{item.category}</Badge>
                      {item.importance === "high" && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-600 dark:text-red-400 border-0">BREAKING</Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold leading-snug">
                      {item.url ? (
                        <ExtLink href={item.url} className="hover:text-primary transition-colors inline">
                          {item.title}
                          <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
                        </ExtLink>
                      ) : item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.summary}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-medium text-muted-foreground/70">{item.source}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-[10px] text-muted-foreground/70">{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Upcoming Tab ───────────────────────────────────────────────────────────

function UpcomingTab({ digest }: { digest: DigestData }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">Upcoming Events & Deadlines</h2>
      </div>
      <div className="space-y-3">
        {digest.upcomingEvents.map((event, i) => (
          <Card key={i} className="p-4 border-border/50 bg-card" data-testid={`card-upcoming-${i}`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                {event.category === "Conference" ? <Globe className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/60">{event.category}</Badge>
                  <span className="text-[11px] text-muted-foreground font-medium tabular-nums">{event.date}</span>
                </div>
                <h3 className="text-sm font-semibold">
                  {event.url ? (
                    <ExtLink href={event.url} className="hover:text-primary transition-colors inline">
                      {event.title}
                      <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
                    </ExtLink>
                  ) : event.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </Card>
        ))}
        <Card className="p-3.5 border-border/50 bg-muted/30 border-dashed">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <p className="text-xs">No personal calendar events scheduled for the next 7 days.</p>
          </div>
        </Card>
      </div>
    </>
  );
}

// ─── Media Tab (Podcast & Infographics) ─────────────────────────────────────

function MediaTab({ dateStr }: { dateStr: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expandedImg, setExpandedImg] = useState<string | null>(null);

  const { data: mediaData } = useQuery<{ files: string[] }>({
    queryKey: ["/api/media", dateStr],
  });

  const files = mediaData?.files || [];
  const hasPodcast = files.includes("podcast.mp3");
  const hasOverview = files.includes("overview.png");
  const hasWorldNews = files.includes("world-news.png");
  const hasNewsletters = files.includes("newsletters.png");

  const podcastUrl = `${API_BASE}/api/media/${dateStr}/podcast.mp3`;
  const overviewUrl = `${API_BASE}/api/media/${dateStr}/overview.png`;
  const worldNewsUrl = `${API_BASE}/api/media/${dateStr}/world-news.png`;
  const newslettersUrl = `${API_BASE}/api/media/${dateStr}/newsletters.png`;

  useEffect(() => {
    if (!audioRef) return;
    const handleTime = () => {
      setProgress(audioRef.currentTime);
      setDuration(audioRef.duration || 0);
    };
    const handleEnd = () => setIsPlaying(false);
    audioRef.addEventListener("timeupdate", handleTime);
    audioRef.addEventListener("ended", handleEnd);
    return () => {
      audioRef.removeEventListener("timeupdate", handleTime);
      audioRef.removeEventListener("ended", handleEnd);
    };
  }, [audioRef]);

  const togglePlay = () => {
    if (!audioRef) {
      const a = new Audio(podcastUrl);
      setAudioRef(a);
      a.play();
      setIsPlaying(true);
    } else if (isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    } else {
      audioRef.play();
      setIsPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.currentTime = pct * duration;
  };

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Podcast Section */}
      <div className="flex items-center gap-2 mb-4">
        <Headphones className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">Daily Podcast</h2>
        <Badge variant="secondary" className="text-[10px] ml-1 border-0">Audio Briefing</Badge>
      </div>

      {hasPodcast ? (
        <Card className="p-5 border-border/50 bg-card mb-6" data-testid="card-podcast">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
              data-testid="button-play-podcast"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 text-primary-foreground" /> : <Play className="w-5 h-5 text-primary-foreground ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold">Daily Digest Briefing</h3>
              <p className="text-xs text-muted-foreground">Two hosts cover today's top AI news, world events, and newsletter highlights</p>
            </div>
            <Volume2 className="w-4 h-4 text-muted-foreground/40 shrink-0" />
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 bg-muted rounded-full cursor-pointer group"
            onClick={seek}
            data-testid="podcast-progress"
          >
            <div
              className="h-full bg-primary rounded-full transition-all relative"
              style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground tabular-nums">{fmtTime(progress)}</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">{duration ? fmtTime(duration) : "--:--"}</span>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-border/50 bg-muted/30 border-dashed mb-6 text-center">
          <Headphones className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No podcast available for this date.</p>
        </Card>
      )}

      {/* Infographics Section */}
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">Daily Infographics</h2>
        <Badge variant="secondary" className="text-[10px] ml-1 border-0">Visual Summaries</Badge>
      </div>

      {(hasOverview || hasWorldNews || hasNewsletters) ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {hasOverview && (
            <Card className="border-border/50 bg-card overflow-hidden group" data-testid="card-infographic-overview">
              <div className="relative cursor-pointer" onClick={() => setExpandedImg(overviewUrl)}>
                <img src={overviewUrl} alt="Daily Overview" className="w-full h-auto" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click to expand</span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold">Daily Overview</h3>
                  <p className="text-[10px] text-muted-foreground">Everything at a glance</p>
                </div>
                <ExtLink href={overviewUrl} className="p-1.5 rounded hover:bg-accent transition-colors">
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                </ExtLink>
              </div>
            </Card>
          )}
          {hasWorldNews && (
            <Card className="border-border/50 bg-card overflow-hidden group" data-testid="card-infographic-world">
              <div className="relative cursor-pointer" onClick={() => setExpandedImg(worldNewsUrl)}>
                <img src={worldNewsUrl} alt="World News" className="w-full h-auto" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click to expand</span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold">World News</h3>
                  <p className="text-[10px] text-muted-foreground">Global headlines</p>
                </div>
                <ExtLink href={worldNewsUrl} className="p-1.5 rounded hover:bg-accent transition-colors">
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                </ExtLink>
              </div>
            </Card>
          )}
          {hasNewsletters && (
            <Card className="border-border/50 bg-card overflow-hidden group" data-testid="card-infographic-newsletters">
              <div className="relative cursor-pointer" onClick={() => setExpandedImg(newslettersUrl)}>
                <img src={newslettersUrl} alt="Newsletters" className="w-full h-auto" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Click to expand</span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold">Inbox Digest</h3>
                  <p className="text-[10px] text-muted-foreground">Newsletter highlights</p>
                </div>
                <ExtLink href={newslettersUrl} className="p-1.5 rounded hover:bg-accent transition-colors">
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                </ExtLink>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-6 border-border/50 bg-muted/30 border-dashed text-center">
          <ImageIcon className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No infographics available for this date.</p>
        </Card>
      )}

      {/* Expanded image overlay */}
      {expandedImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-start justify-center p-2 sm:p-4 overflow-auto"
          onClick={() => setExpandedImg(null)}
          data-testid="overlay-expanded-image"
        >
          <div className="relative max-w-3xl w-full mt-4 sm:mt-8" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setExpandedImg(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-accent z-10"
              aria-label="Close"
            >
              ×
            </button>
            <img src={expandedImg} alt="Expanded infographic" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Social Media Tab ───────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for sandboxed iframes
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-[11px] gap-1.5"
      onClick={handleCopy}
      data-testid={`button-copy-${label || "text"}`}
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function UploadToLinkedInButton({ text, pdfUrl }: { text: string; pdfUrl: string }) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  // 0 = idle, 1 = copied, 2 = pdf downloading, 3 = opening linkedin

  const copyToClipboard = (content: string): Promise<void> => {
    return navigator.clipboard.writeText(content).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = content;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
  };

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    // Step 1: Copy post body to clipboard
    await copyToClipboard(text);
    setStep(1);

    // Step 2: Download carousel PDF
    setTimeout(() => {
      triggerDownload(pdfUrl, "ai-carousel.pdf");
      setStep(2);
    }, 600);

    // Step 3: Open LinkedIn's post composer
    setTimeout(() => {
      setStep(3);
      window.open("https://www.linkedin.com/feed/?shareActive=true", "_blank");
      setTimeout(() => setStep(0), 4000);
    }, 1400);
  };

  const labels = [
    { icon: <ExternalLink className="w-3.5 h-3.5" />, text: "Post to LinkedIn" },
    { icon: <Check className="w-3.5 h-3.5" />, text: "Text copied" },
    { icon: <Download className="w-3.5 h-3.5" />, text: "Downloading PDF..." },
    { icon: <Check className="w-3.5 h-3.5" />, text: "Opening LinkedIn..." },
  ];
  const current = labels[step];

  return (
    <div className="bg-gradient-to-r from-[#0A66C2]/10 via-[#0A66C2]/5 to-transparent dark:from-[#0A66C2]/20 dark:via-[#0A66C2]/10 dark:to-transparent rounded-lg p-3 sm:p-4 border border-[#0A66C2]/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 p-2 rounded-lg bg-[#0A66C2] text-white">
            <Linkedin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold">Post to LinkedIn</h4>
            <p className="text-[10px] text-muted-foreground">Copies text, downloads carousel PDF, opens LinkedIn</p>
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={step > 0}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-xs font-semibold hover:bg-[#094ea0] active:scale-[0.97] transition-all shadow-sm disabled:opacity-70 disabled:cursor-wait w-full sm:w-auto"
          data-testid="button-upload-linkedin"
        >
          {current.icon} {current.text}
        </button>
      </div>
      <div className="mt-3 sm:ml-11 space-y-1">
        <div className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step >= 1 ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>1</span>
          <span className={`text-[10px] ${step >= 1 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>Paste text into LinkedIn composer (Ctrl+V / Cmd+V)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step >= 2 ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>2</span>
          <span className={`text-[10px] ${step >= 2 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>Attach the downloaded carousel PDF</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${step >= 3 ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>3</span>
          <span className={`text-[10px] ${step >= 3 ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-muted-foreground"}`}>Hit Post</span>
        </div>
      </div>
    </div>
  );
}

function SocialMediaTab({ digest, dateStr }: { digest: DigestData; dateStr: string }) {
  const social = digest.socialMedia;
  const [expandedSlides, setExpandedSlides] = useState(false);
  const [expandedThread, setExpandedThread] = useState(false);
  const [expandedScript, setExpandedScript] = useState(false);

  if (!social) {
    return (
      <Card className="p-8 border-border/50 bg-muted/30 border-dashed text-center">
        <Share2 className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">No social media content available for this date.</p>
      </Card>
    );
  }

  const fullLinkedIn = `${social.linkedin.hook}\n\n${social.linkedin.body}\n\n${social.linkedin.cta}\n\n${social.linkedin.hashtags.join(" ")}`;
  const fullTwitterThread = [social.twitter.mainTweet, ...social.twitter.thread].join("\n\n---\n\n");
  const fullYTScript = `Title: ${social.youtubeShort.title}\n\n${social.youtubeShort.script}\n\nCaptions:\n${social.youtubeShort.captions.map((c, i) => `${i + 1}. ${c}`).join("\n")}`;

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">Social Media Content</h2>
        <Badge variant="secondary" className="text-[10px] ml-1 border-0">AI & Tech Focus</Badge>
      </div>

      <div className="space-y-6">
        {/* ── LinkedIn ── */}
        <Card className="border-border/50 bg-card overflow-hidden" data-testid="card-social-linkedin">
          {/* Hero preview banner — downloads the carousel PDF */}
          <ExtLink
            href={`${API_BASE}/api/media/${dateStr}/ai-carousel.pdf`}
            className="block relative overflow-hidden group"
            data-testid="link-carousel-pdf"
          >
            <div className="bg-gradient-to-br from-[#0A0E27] via-[#111632] to-[#1a1050] p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[10px] font-semibold text-[#7B82A8] uppercase tracking-[0.15em]">LinkedIn Carousel · 8 Slides</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white leading-tight mb-1.5" style={{ background: "linear-gradient(135deg, #8B7FFF, #4DD4E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    The AI Race Just Entered a New Chapter
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#7B82A8] leading-relaxed max-w-md">
                    8-slide dark-themed carousel with data cards, KPI badges, and source citations. Download and upload to LinkedIn with your post.
                  </p>
                </div>
                <div className="shrink-0 mt-1 p-2 sm:p-2.5 rounded-lg bg-[#8B7FFF] text-white group-hover:bg-[#8B7FFF]/90 transition-colors">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3">
                {["10×", "$100M", "$50B", "77.1%", "56%"].map((v) => (
                  <span key={v} className="text-xs font-bold" style={{ background: "linear-gradient(135deg, #8B7FFF, #4DD4E8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</span>
                ))}
              </div>
            </div>
          </ExtLink>

          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#0A66C2]/10">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Post Text Content</h3>
                <p className="text-[10px] text-muted-foreground">Carousel format · {social.linkedin.carouselSlides.length} slides · Optimized for engagement</p>
              </div>
            </div>
            <CopyButton text={fullLinkedIn} label="linkedin" />
          </div>

          <div className="p-4 space-y-3">
            {/* Hook */}
            <div className="bg-[#0A66C2]/5 dark:bg-[#0A66C2]/10 rounded-lg p-3 border border-[#0A66C2]/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3 h-3 text-[#0A66C2]" />
                <span className="text-[10px] font-semibold text-[#0A66C2] uppercase tracking-wider">Hook</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">{social.linkedin.hook}</p>
            </div>

            {/* Body preview */}
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Post Body</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">{social.linkedin.body}</p>
            </div>

            {/* CTA */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Call to Action</span>
              </div>
              <p className="text-sm font-medium">{social.linkedin.cta}</p>
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5">
              {social.linkedin.hashtags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 border-[#0A66C2]/30 text-[#0A66C2] dark:text-[#4d9ee0]">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Upload to LinkedIn */}
            <UploadToLinkedInButton text={fullLinkedIn} pdfUrl={`${API_BASE}/api/media/${dateStr}/ai-carousel.pdf`} />

            {/* Carousel Slides */}
            <div>
              <button
                onClick={() => setExpandedSlides(!expandedSlides)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
                data-testid="button-toggle-carousel"
              >
                {expandedSlides ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Carousel Slides ({social.linkedin.carouselSlides.length})
              </button>
              {expandedSlides && (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2">
                  {social.linkedin.carouselSlides.map((slide) => (
                    <div
                      key={slide.slideNumber}
                      className="bg-gradient-to-br from-[#0A66C2]/10 to-[#0A66C2]/5 dark:from-[#0A66C2]/20 dark:to-[#0A66C2]/10 rounded-lg p-3 border border-[#0A66C2]/15 flex flex-col"
                      data-testid={`carousel-slide-${slide.slideNumber}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-muted-foreground font-mono">#{slide.slideNumber}</span>
                        {slide.emoji && <span className="text-base">{slide.emoji}</span>}
                      </div>
                      <h4 className="text-xs font-bold leading-snug mb-1">{slide.headline}</h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed flex-1">{slide.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ── X / Twitter ── */}
        <Card className="border-border/50 bg-card overflow-hidden" data-testid="card-social-twitter">
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-foreground/5">
                <Twitter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">X (Twitter) Thread</h3>
                <p className="text-[10px] text-muted-foreground">E.H.A. framework · {social.twitter.thread.length + 1} tweets · Optimized for reach</p>
              </div>
            </div>
            <CopyButton text={fullTwitterThread} label="twitter" />
          </div>

          <div className="p-4 space-y-3">
            {/* Main tweet */}
            <div className="bg-foreground/[0.03] dark:bg-foreground/[0.06] rounded-lg p-3 border border-border/50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Main Tweet</span>
              </div>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{social.twitter.mainTweet}</p>
            </div>

            {/* Thread */}
            <div>
              <button
                onClick={() => setExpandedThread(!expandedThread)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
                data-testid="button-toggle-thread"
              >
                {expandedThread ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Thread ({social.twitter.thread.length} tweets)
              </button>
              {expandedThread && (
                <div className="space-y-2 ml-3 border-l-2 border-border/50 pl-4">
                  {social.twitter.thread.map((tweet, i) => (
                    <div key={i} className="bg-muted/30 rounded-lg p-3" data-testid={`tweet-${i + 1}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-muted-foreground font-mono">Tweet {i + 2}</span>
                        <CopyButton text={tweet} label={`tweet-${i + 2}`} />
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">{tweet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-1.5">
              {social.twitter.hashtags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 border-border/60">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* ── YouTube Short ── */}
        <Card className="border-border/50 bg-card overflow-hidden" data-testid="card-social-youtube">
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#FF0000]/10">
                <Youtube className="w-4 h-4 text-[#FF0000]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">YouTube Short Script</h3>
                <p className="text-[10px] text-muted-foreground">{social.youtubeShort.duration} · Hook in first 3 sec · Caption-ready</p>
              </div>
            </div>
            <CopyButton text={fullYTScript} label="youtube" />
          </div>

          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="bg-[#FF0000]/5 dark:bg-[#FF0000]/10 rounded-lg p-3 border border-[#FF0000]/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Video className="w-3 h-3 text-[#FF0000]" />
                <span className="text-[10px] font-semibold text-[#FF0000] uppercase tracking-wider">Title</span>
              </div>
              <p className="text-sm font-bold">{social.youtubeShort.title}</p>
            </div>

            {/* Hook */}
            <div className="bg-amber-500/5 dark:bg-amber-500/10 rounded-lg p-3 border border-amber-500/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Hook Line</span>
              </div>
              <p className="text-sm font-semibold">{social.youtubeShort.hookLine}</p>
            </div>

            {/* Script */}
            <div>
              <button
                onClick={() => setExpandedScript(!expandedScript)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
                data-testid="button-toggle-script"
              >
                {expandedScript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Full Script
              </button>
              {expandedScript && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line font-mono">{social.youtubeShort.script}</p>
                </div>
              )}
            </div>

            {/* Captions */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileText className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Caption Overlay Sequence</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {social.youtubeShort.captions.map((caption, i) => (
                  <Badge key={i} className="text-[10px] px-2 py-0.5 border-0 bg-foreground/5 dark:bg-foreground/10 text-foreground/80">
                    {i + 1}. {caption}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Call to Action</span>
              </div>
              <p className="text-xs font-medium">{social.youtubeShort.cta}</p>
            </div>
          </div>
        </Card>

        {/* Tips card */}
        <Card className="border-border/50 bg-muted/20 p-4" data-testid="card-social-tips">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-semibold">Platform Best Practices Applied</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground block mb-0.5">LinkedIn</span>
              Strong hook on slide 1, one idea per slide, carousel format for 3x engagement, CTA drives comments.
            </div>
            <div className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground block mb-0.5">X / Twitter</span>
              E.H.A. framework (Emotional trigger + Hook + Action), thread format, link in final tweet not main.
            </div>
            <div className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground block mb-0.5">YouTube Short</span>
              Hook in first 3 seconds, 30-sec duration, caption overlays for silent viewers, loop-friendly ending.
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

// ─── Loading & Empty States ─────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-3.5 border-border/50 bg-card">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-6 w-10 mb-2" />
            <Skeleton className="h-2.5 w-16" />
          </Card>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 border-border/50 bg-card">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-2/3" />
          </Card>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ date }: { date: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 rounded-2xl bg-muted/50 mb-4">
        <Newspaper className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <h2 className="text-sm font-semibold text-foreground mb-1">No digest for {date}</h2>
      <p className="text-xs text-muted-foreground max-w-xs">
        Digests are generated daily at 7:00 AM CDT. Select a different date from the navigation above.
      </p>
    </div>
  );
}
