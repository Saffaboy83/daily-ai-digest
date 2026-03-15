import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DigestData } from "@shared/schema";
import {
  ArrowRight,
  Cpu,
  Globe,
  Mail,
  TrendingUp,
  Zap,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  LayoutDashboard,
  X,
  Lightbulb,
  Timer,
  Wrench,
  Palette,
  Briefcase,
  HeartHandshake,
  BookOpen,
} from "lucide-react";

const API_BASE = "__PORT_5000__".startsWith("__") ? "" : "__PORT_5000__";

function ExtLink({ href, className, children, ...rest }: { href: string; className?: string; children: React.ReactNode; [key: string]: any }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`cursor-pointer ${className || ""}`} {...rest}>
      {children}
    </a>
  );
}

const iconMap: Record<string, any> = {
  cpu: Cpu, zap: Zap, sparkles: Sparkles, alert: Zap, rocket: Zap, building: TrendingUp,
};

/* ── Inline Audio Player ── */
function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);
    setProgress(dur > 0 ? (cur / dur) * 100 : 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0 shadow-lg"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div
          className="h-1.5 bg-white/20 rounded-full cursor-pointer group relative"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-white rounded-full relative transition-all"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-white/50 tabular-nums">{fmt(currentTime)}</span>
          <span className="text-[10px] text-white/50 tabular-nums">{duration > 0 ? fmt(duration) : "--:--"}</span>
        </div>
      </div>
      <button
        onClick={() => {
          if (audioRef.current) audioRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
        }}
        className="p-1.5 text-white/60 hover:text-white transition-colors shrink-0"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function Landing() {
  const [, navigate] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [expandedImg, setExpandedImg] = useState<string | null>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (expandedImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [expandedImg]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", !isDark);
  };

  // Fetch available dates to get the latest
  const { data: datesData } = useQuery<{ dates: string[] }>({
    queryKey: ["/api/digests"],
  });
  const latestDate = datesData?.dates?.[0];

  // Fetch the latest digest
  const { data: digestResponse, isLoading } = useQuery<{ date: string; data: DigestData }>({
    queryKey: ["/api/digest", latestDate || "latest"],
    enabled: !!latestDate,
  });
  const digest = digestResponse?.data;
  const dateStr = latestDate || new Date().toISOString().split("T")[0];

  // Media URLs
  const overviewUrl = `${API_BASE}/api/media/${dateStr}/overview.png`;
  const worldNewsUrl = `${API_BASE}/api/media/${dateStr}/world-news.png`;
  const newslettersUrl = `${API_BASE}/api/media/${dateStr}/newsletters.png`;
  const podcastUrl = `${API_BASE}/api/media/${dateStr}/podcast.mp3`;

  // Check which media files exist
  const { data: mediaData } = useQuery<{ files: string[] }>({
    queryKey: [`/api/media/${dateStr}`],
    enabled: !!dateStr,
  });
  const files = mediaData?.files || [];
  const hasOverview = files.includes("overview.png");
  const hasWorldNews = files.includes("world-news.png");
  const hasNewsletters = files.includes("newsletters.png");
  const hasPodcast = files.includes("podcast.mp3");

  const goToDashboard = () => navigate("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div className="absolute inset-0">
          <img
            src="/koda-hero.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        </div>

        {/* Nav bar */}
        <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Koda Logo SVG */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="Koda logo">
              <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15" />
              <circle cx="18" cy="18" r="10" stroke="white" strokeWidth="1.5" />
              <circle cx="18" cy="18" r="5" fill="white" fillOpacity="0.3" />
              <circle cx="18" cy="14" r="1.5" fill="white" />
              <circle cx="22" cy="18" r="1.5" fill="white" />
              <circle cx="14" cy="18" r="1.5" fill="white" />
              <circle cx="18" cy="22" r="1.5" fill="white" />
              <line x1="18" y1="14" x2="22" y2="18" stroke="white" strokeWidth="0.8" opacity="0.6" />
              <line x1="22" y1="18" x2="18" y2="22" stroke="white" strokeWidth="0.8" opacity="0.6" />
              <line x1="18" y1="22" x2="14" y2="18" stroke="white" strokeWidth="0.8" opacity="0.6" />
              <line x1="14" y1="18" x2="18" y2="14" stroke="white" strokeWidth="0.8" opacity="0.6" />
            </svg>
            <span className="text-white text-lg font-bold tracking-tight">Koda</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={goToDashboard}
              className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1"
            >
              Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-28 max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/10 text-white/90 border-white/20 hover:bg-white/15 text-xs backdrop-blur-sm">
              {digest?.dateLabel || "Daily AI Intelligence"}
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-4 tracking-tight">
              Your daily AI<br />intelligence briefing
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
              Curated AI news, world events, newsletter summaries, and market intelligence - delivered daily with podcast, infographics, and social media content.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={goToDashboard}
                className="px-6 py-2.5 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Open Dashboard
              </button>
            </div>

            {/* Inline podcast player */}
            {hasPodcast && (
              <div className="mt-6 max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="w-4 h-4 text-white/70" />
                  <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Today's Podcast</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/15">
                  <AudioPlayer src={podcastUrl} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KPI ticker */}
        {digest && (
          <div className="relative z-10 px-4 sm:px-8 pb-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "AI Stories", value: digest.kpis.aiStories, icon: Cpu },
                { label: "World News", value: digest.kpis.worldNews, icon: Globe },
                { label: "Newsletters", value: digest.kpis.newsletters, icon: Mail },
                { label: "Developments", value: digest.kpis.keyDevelopments, icon: TrendingUp },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <kpi.icon className="w-3.5 h-3.5 text-white/50" />
                    <span className="text-[11px] text-white/50 uppercase tracking-wider">{kpi.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{kpi.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Today's Headlines ── */}
      {digest && (
        <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Today's Top Stories</h2>
              <p className="text-sm text-muted-foreground mt-1">The most important AI and tech developments</p>
            </div>
            <button
              onClick={goToDashboard}
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {digest.topStories.slice(0, 6).map((story) => {
              const Icon = iconMap[story.iconType] || Zap;
              return (
                <Card key={story.id} className="border-border/50 bg-card p-4 hover:bg-accent/30 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {story.importance === "high" && (
                          <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">HOT</Badge>
                        )}
                      </div>
                      {story.url ? (
                        <ExtLink href={story.url} className="hover:text-primary transition-colors">
                          <h3 className="text-sm font-semibold leading-snug mb-1 flex items-center gap-1">
                            {story.title}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                          </h3>
                        </ExtLink>
                      ) : (
                        <h3 className="text-sm font-semibold leading-snug mb-1">{story.title}</h3>
                      )}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{story.summary}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground/60">{story.source}</span>
                        <span className="text-[10px] text-muted-foreground/40">-</span>
                        <span className="text-[10px] text-muted-foreground/60 tabular-nums">{story.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Infographics Section ── */}
      {(hasOverview || hasWorldNews || hasNewsletters) && (
        <section className="py-12 sm:py-16 bg-muted/30" style={{ margin: "0 calc(-50vw + 50%)", padding: "3rem calc(50vw - 50%)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold">Daily Infographics</h2>
              <p className="text-sm text-muted-foreground mt-1">Visual intelligence summaries for {digest?.dateLabel || "today"} - click to expand</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
              {hasOverview && (
                <div
                  className="group cursor-pointer rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  onClick={() => setExpandedImg(overviewUrl)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={overviewUrl} alt="AI Tech Overview" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <ArrowRight className="w-4 h-4 text-gray-900 rotate-[-45deg]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold">AI Tech Overview</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Key AI developments and benchmarks</p>
                  </div>
                </div>
              )}
              {hasWorldNews && (
                <div
                  className="group cursor-pointer rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  onClick={() => setExpandedImg(worldNewsUrl)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={worldNewsUrl} alt="World News" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <ArrowRight className="w-4 h-4 text-gray-900 rotate-[-45deg]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold">World News</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Global events and geopolitical updates</p>
                  </div>
                </div>
              )}
              {hasNewsletters && (
                <div
                  className="group cursor-pointer rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  onClick={() => setExpandedImg(newslettersUrl)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={newslettersUrl} alt="Daily Overview" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <ArrowRight className="w-4 h-4 text-gray-900 rotate-[-45deg]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold">Daily Overview</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Newsletter highlights and market pulse</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── AI Tools & Tutorials Preview ── */}
      {digest && digest.aiToolGuides && digest.aiToolGuides.length > 0 && (
        <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-7xl mx-auto border-t border-border/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">AI Tools & Tutorials</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Practical step-by-step guides to level up your workflow</p>
              </div>
            </div>
            <button
              onClick={() => { navigate("/dashboard"); setTimeout(() => { const tab = document.querySelector('[data-testid="tab-tools"]') as HTMLElement; if (tab) tab.click(); }, 300); }}
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {digest.aiToolGuides.slice(0, 3).map((guide) => {
              const catColors: Record<string, string> = {
                productivity: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                creative: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                business: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                personal: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
              };
              const platformLabel: Record<string, string> = { youtube: "YouTube", reddit: "Reddit", substack: "Substack", other: "Web" };
              return (
                <Card key={guide.id} className="border-border/50 bg-card p-4 hover:bg-accent/30 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl shrink-0">{guide.iconEmoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <Badge className={`text-[9px] px-1.5 py-0 h-4 border-0 ${catColors[guide.category] || catColors.productivity}`}>
                          {guide.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground/60 flex items-center gap-0.5">
                          <Timer className="w-2.5 h-2.5" />
                          {guide.timeToComplete}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold leading-snug mb-1">{guide.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{guide.tagline}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground/60">{platformLabel[guide.source.platform] || "Web"}</span>
                        <span className="text-[10px] text-muted-foreground/40">-</span>
                        <span className="text-[10px] text-muted-foreground/60">{guide.steps.length} steps</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Key Takeaways (AI Developments) ── */}
      {digest && (
        <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Key Developments</h2>
              <p className="text-sm text-muted-foreground mt-1">What's moving the AI industry right now</p>
            </div>
            <button
              onClick={goToDashboard}
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Deep dive <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {digest.aiDevelopments.map((dev, i) => (
              <Card key={i} className="border-border/50 bg-card p-4 hover:bg-accent/30 transition-colors group">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[10px] px-2 py-0.5 ${dev.colorClass}`}>{dev.tag}</Badge>
                </div>
                {dev.url ? (
                  <ExtLink href={dev.url} className="hover:text-primary transition-colors">
                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                      {dev.title}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                    </h3>
                  </ExtLink>
                ) : (
                  <h3 className="text-sm font-semibold mb-1">{dev.title}</h3>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed">{dev.detail}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── World News ── */}
      {digest && digest.worldNews.length > 0 && (
        <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-7xl mx-auto border-t border-border/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">World News</h2>
              <p className="text-sm text-muted-foreground mt-1">Global headlines shaping markets and policy</p>
            </div>
            <button
              onClick={goToDashboard}
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              Full coverage <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {digest.worldNews.slice(0, 6).map((item, i) => (
              <Card key={i} className="border-border/50 bg-card p-4 hover:bg-accent/30 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border/60">{item.category}</Badge>
                      {item.importance === "high" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                    {item.url ? (
                      <ExtLink href={item.url} className="hover:text-primary transition-colors">
                        <h3 className="text-sm font-semibold leading-snug mb-1 flex items-center gap-1">
                          {item.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                        </h3>
                      </ExtLink>
                    ) : (
                      <h3 className="text-sm font-semibold leading-snug mb-1">{item.title}</h3>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.summary}</p>
                    <span className="text-[10px] text-muted-foreground/50 mt-1.5 inline-block">{item.source} - {item.timestamp}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Market Pulse ── */}
      {digest && digest.marketPulse.length > 0 && (
        <section className="px-4 sm:px-8 py-12 sm:py-16 max-w-7xl mx-auto border-t border-border/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Market Pulse</h2>
              <p className="text-sm text-muted-foreground mt-1">Key stock movements in AI and tech</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {digest.marketPulse.map((stock) => (
              <ExtLink key={stock.ticker} href={stock.url || "#"} className="block">
                <Card className="border-border/50 bg-card p-4 hover:bg-accent/30 transition-colors text-center">
                  <div className="text-xs font-bold">{stock.ticker}</div>
                  <div className="text-[11px] text-muted-foreground">{stock.name}</div>
                  <div className="text-lg font-bold mt-1">{stock.price}</div>
                  <div className={`text-xs mt-0.5 ${stock.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {stock.change}
                  </div>
                </Card>
              </ExtLink>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Footer ── */}
      <section className="px-4 sm:px-8 py-16 sm:py-24 text-center border-t border-border/30">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Explore the full dashboard</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Search across all digests, listen to AI podcasts, view social media content packs, and navigate prior days.
        </p>
        <button
          onClick={goToDashboard}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          Open Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="px-4 sm:px-8 py-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/50">
            Koda Community - Daily AI Intelligence
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Home
            </button>
            <button
              onClick={goToDashboard}
              className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </footer>

      {/* ── Lightbox overlay for infographic expansion ── */}
      {expandedImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 overflow-auto"
          onClick={() => setExpandedImg(null)}
        >
          <div className="relative max-w-4xl w-full mt-4 sm:mt-8 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setExpandedImg(null)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-foreground hover:bg-accent z-10 shadow-lg transition-colors"
              aria-label="Close expanded image"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={expandedImg} alt="Expanded infographic" className="w-full h-auto rounded-lg shadow-2xl" />
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && !digest && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading today's briefing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
