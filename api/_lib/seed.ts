import type { DigestData } from "./types.js";

export const seedDigest: DigestData = {
  generatedAt: "2026-03-14T12:35:00-05:00",
  dateLabel: "Saturday, March 14, 2026",
  kpis: {
    newsletters: 31,
    aiStories: 18,
    upcomingEvents: 4,
    keyDevelopments: 6,
    worldNews: 8,
  },
  topStories: [
    {
      id: "1",
      title: "NVIDIA GTC 2026 Kicks Off Monday",
      source: "NVIDIA / Yahoo Finance",
      category: "ai",
      summary: "Jensen Huang to unveil Vera Rubin architecture, Blackwell Ultra B300, and laptop CPUs (N1/N1X). 30,000 attendees from 190 countries. Keynote at 11am PT, March 16.",
      url: "https://finance.yahoo.com/news/nvidia-gtc-2026-what-to-expect-from-nvidias-biggest-event-of-the-year-132234592.html",
      timestamp: "Mar 16",
      importance: "high",
      iconType: "cpu",
    },
    {
      id: "2",
      title: "Anthropic Commits $100M to Claude Partner Network",
      source: "Anthropic",
      category: "ai",
      summary: "Accenture, Deloitte, Cognizant, Infosys as anchor partners. New Claude Certified Architect certification. Code Modernization starter kit launched.",
      url: "https://www.anthropic.com/news/claude-partner-network",
      timestamp: "Mar 12",
      importance: "high",
      iconType: "building",
    },
    {
      id: "3",
      title: "Meta Delays 'Avocado' AI Model",
      source: "NYT / TLDR",
      category: "ai",
      summary: "Failed internal tests for reasoning, coding, and writing. Release pushed from March to at least May. Questions about whether scale spending equals leadership.",
      url: "https://www.nytimes.com/2026/03/12/technology/meta-avocado-ai-model-delayed.html",
      timestamp: "Mar 12",
      importance: "high",
      iconType: "alert",
    },
    {
      id: "4",
      title: "Dify Raises $30M Series Pre-A",
      source: "Dify",
      category: "tools",
      summary: "New funding to keep building. Shipped Human Input Node, Template Marketplace, and more since February.",
      url: "https://dify.ai/blog/dify-raises-30m-pre-a",
      timestamp: "Mar 14",
      importance: "high",
      iconType: "rocket",
    },
    {
      id: "5",
      title: "Cursor Eyes $50B Valuation; xAI Poaches Cursor Leads",
      source: "TLDR AI",
      category: "ai",
      summary: "The AI code editor race intensifies. xAI aggressively recruiting Cursor's leadership. Signals the value of developer tools in the AI era.",
      url: "https://tldr.tech/ai/2026-03-13",
      timestamp: "Mar 12-13",
      importance: "high",
      iconType: "zap",
    },
    {
      id: "6",
      title: "Replit Agent 4 Launches",
      source: "TLDR AI",
      category: "tools",
      summary: "Infinite design canvas with parallel AI agents that build backends and frontends simultaneously. Major upgrade to no-code AI development.",
      url: "https://blog.replit.com/agent-4",
      timestamp: "Mar 12",
      importance: "medium",
      iconType: "sparkles",
    },
  ],
  aiDevelopments: [
    {
      title: "GPT-5.4 in Production",
      detail: "Native agency capabilities, 'Thinking' and 'Pro' modes redefining professional workflows. 56% of citations now link to brand sites.",
      tag: "OpenAI",
      colorClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      url: "https://openai.com/index/gpt-5-4/",
    },
    {
      title: "Gemini 3.1 Pro Scores 77.1% on ARC-AGI-2",
      detail: "More than doubled previous version performance. 'Deep Think' architecture for structured reasoning and complex tool use.",
      tag: "Google",
      colorClass: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
      url: "https://blog.google/technology/ai/gemini-3-1-pro/",
    },
    {
      title: "Claude Visuals (Beta)",
      detail: "Imagine with Claude coming to Claude Chat. Custom charts, diagrams, and interactive visualizations directly in conversations.",
      tag: "Anthropic",
      colorClass: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
      url: "https://www.anthropic.com/news/claude-visuals",
    },
    {
      title: "Vera Rubin Architecture Preview",
      detail: "NVIDIA's next-gen platform: HBM4 (384GB), 336B transistors on 3nm, 10x lower inference cost for MoE. First systems H2 2026.",
      tag: "NVIDIA",
      colorClass: "bg-lime-500/15 text-lime-700 dark:text-lime-400",
      url: "https://www.nvidia.com/en-us/data-center/vera-rubin/",
    },
    {
      title: "Enterprise Agent Adoption at 68.1%",
      detail: "The shift from generative AI to agentic AI is accelerating. SQL/DevOps use cases leading adoption.",
      tag: "Industry",
      colorClass: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
      url: "https://tldr.tech/ai/2026-03-12",
    },
    {
      title: "Langfuse Major Speed Upgrade",
      detail: "Faster UI, faster API workflows, faster everything. Direct relevance for RAG/agent observability stacks.",
      tag: "DevTools",
      colorClass: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
      url: "https://langfuse.com/changelog",
    },
  ],
  newsletters: [
    { from: "Superhuman", subject: "Chinese robot gets 'arrested'", date: "Mar 14", tag: "AI/Robotics", emailId: "19ced17eae132fd4", url: "https://mail.google.com/mail/u/0/#inbox/19ced17eae132fd4",
      summary: ["A humanoid robot in China was detained by police after wandering unsupervised through a shopping district, sparking debate about robot autonomy regulations", "Google's Gemini 3.1 scored 77.1% on ARC-AGI-2, more than doubling its previous benchmark", "Anthropic's Claude now generates interactive charts and diagrams directly in conversations"],
      extractedLinks: [{title: "Chinese Robot Detained by Police", url: "https://www.theverge.com/2026/3/14/chinese-robot-detained"}, {title: "Gemini 3.1 Pro Benchmarks", url: "https://blog.google/technology/ai/gemini-3-1-pro/"}]
    },
    { from: "Dify", subject: "Dify Raises $30M, Human Input Node, Template Marketplace", date: "Mar 14", tag: "AI Tools", emailId: "19ceb0b283b6145b", url: "https://mail.google.com/mail/u/0/#inbox/19ceb0b283b6145b" },
    { from: "TLDR AI", subject: "Claude Visuals, xAI poaches Cursor leads, CursorBench", date: "Mar 13", tag: "AI", emailId: "19ce771c44d1aada", url: "https://mail.google.com/mail/u/0/#inbox/19ce771c44d1aada",
      summary: ["Anthropic launches Claude Visuals (beta) - generate custom charts, diagrams, and interactive visualizations in chat", "xAI is aggressively recruiting Cursor's leadership team as Cursor eyes a $50B valuation", "CursorBench released as a benchmark for AI code editors, testing real-world development tasks"],
      extractedLinks: [{title: "Claude Visuals Announcement", url: "https://www.anthropic.com/news/claude-visuals"}, {title: "Cursor $50B Valuation", url: "https://tldr.tech/ai/2026-03-13"}, {title: "CursorBench", url: "https://cursorbench.com"}]
    },
    { from: "Superhuman", subject: "Claude builds interactive charts & diagrams", date: "Mar 13", tag: "AI", emailId: "19ce7522183d415f", url: "https://mail.google.com/mail/u/0/#inbox/19ce7522183d415f" },
    { from: "The Rundown AI", subject: "Google brings Gemini to the road", date: "Mar 13", tag: "AI", emailId: "19ce6af32e3fb084", url: "https://mail.google.com/mail/u/0/#inbox/19ce6af32e3fb084",
      summary: ["Google integrating Gemini AI into Android Auto and Google Maps for conversational driving assistance", "NVIDIA GTC 2026 preview - Jensen Huang expected to unveil Vera Rubin architecture on Monday", "Enterprise AI agent adoption reaches 68.1%, with SQL and DevOps use cases leading"],
      extractedLinks: [{title: "Gemini in Android Auto", url: "https://blog.google/products/android/gemini-android-auto/"}, {title: "NVIDIA GTC 2026 Preview", url: "https://www.nvidia.com/gtc/"}]
    },
    { from: "TLDR", subject: "Meta's AI flop, Google Maps redesign, Perplexity Agent API", date: "Mar 13", tag: "Tech", emailId: "19ce6bc754a1f6e0", url: "https://mail.google.com/mail/u/0/#inbox/19ce6bc754a1f6e0",
      summary: ["Meta's 'Avocado' AI model failed internal tests for reasoning, coding, and writing - release delayed from March to at least May", "Google Maps getting a major AI-powered redesign with new 'Ask Maps' natural language feature", "Perplexity launches Agent API enabling developers to build autonomous research workflows"],
      extractedLinks: [{title: "Meta Avocado Delayed", url: "https://www.nytimes.com/2026/03/12/technology/meta-avocado-ai-model-delayed.html"}, {title: "Google Maps Redesign", url: "https://blog.google/products/maps/google-maps-redesign-2026/"}]
    },
    { from: "TAAFT", subject: "Alexa Now Curses and Roasts You", date: "Mar 13", tag: "AI", emailId: "19ce8e8c5d6e5bcc", url: "https://mail.google.com/mail/u/0/#inbox/19ce8e8c5d6e5bcc" },
    { from: "Langfuse", subject: "Product Update: Langfuse just got faster!", date: "Mar 13", tag: "DevTools", emailId: "19ce81569bfc16ff", url: "https://mail.google.com/mail/u/0/#inbox/19ce81569bfc16ff" },
    { from: "TLDR Dev", subject: "Vimeo's subtitle trick, AI for better code, teachable AI agents", date: "Mar 13", tag: "Dev", emailId: "19ce6e5a1d311045", url: "https://mail.google.com/mail/u/0/#inbox/19ce6e5a1d311045" },
    { from: "TLDR Marketing", subject: "GPT-5.4 vs 5.3 brand citations, CTA A/B test win", date: "Mar 13", tag: "Marketing", emailId: "19ce6e18aafdad33", url: "https://mail.google.com/mail/u/0/#inbox/19ce6e18aafdad33" },
    { from: "Barchart Brief", subject: "Amazon's $200B question", date: "Mar 14", tag: "Finance", emailId: "19cecaf914099bf1", url: "https://mail.google.com/mail/u/0/#inbox/19cecaf914099bf1" },
    { from: "TAAFT", subject: "Anthropic Makes TIME Cover", date: "Mar 12", tag: "AI", emailId: "19ce3c6724bf4ce4", url: "https://mail.google.com/mail/u/0/#inbox/19ce3c6724bf4ce4" },
    { from: "The Rundown Tech", subject: "Apple's foldable iPhone leaks", date: "Mar 13", tag: "Tech", emailId: "19ce79cbf0d7e2af", url: "https://mail.google.com/mail/u/0/#inbox/19ce79cbf0d7e2af" },
    { from: "TLDR AI", subject: "Replit Agent 4, Cursor eyes $50B valuation, Meta AI chips", date: "Mar 12", tag: "AI", emailId: "19ce2374c0f7ea45", url: "https://mail.google.com/mail/u/0/#inbox/19ce2374c0f7ea45" },
    { from: "TLDR Fintech", subject: "Nasdaq + Kraken, Revolut gets UK license, X Money April launch", date: "Mar 12", tag: "Fintech", emailId: "19ce22ccbc64d62f", url: "https://mail.google.com/mail/u/0/#inbox/19ce22ccbc64d62f" },
    { from: "Make", subject: "If-Else & Merge, new AI models, Agent templates & more", date: "Mar 12", tag: "Tools", emailId: "19ce2bbf85f48b2f", url: "https://mail.google.com/mail/u/0/#inbox/19ce2bbf85f48b2f" },
    { from: "Perplexity", subject: "Perplexity Computer is now available for all Ask-Ora users", date: "Mar 12", tag: "AI", emailId: "19ce33cfecb3b1d1", url: "https://mail.google.com/mail/u/0/#inbox/19ce33cfecb3b1d1" },
    { from: "Zapier", subject: "Agents that can use your computer, safely (OpenClaw x Claude)", date: "Mar 12", tag: "Tools", emailId: "19ce37a0a4f6084e", url: "https://mail.google.com/mail/u/0/#inbox/19ce37a0a4f6084e" },
    { from: "The Hustle", subject: "RIP resumes", date: "Mar 13", tag: "Business", emailId: "19ce6c938caecc36", url: "https://mail.google.com/mail/u/0/#inbox/19ce6c938caecc36" },
    { from: "Dan Martell", subject: "two weeks to live", date: "Mar 13", tag: "Mindset", emailId: "19ce7c04414164b1", url: "https://mail.google.com/mail/u/0/#inbox/19ce7c04414164b1" },
    { from: "Emergent", subject: "[Webinar] Vibecoding an AI-native edtech, live", date: "Mar 14", tag: "AI Tools", emailId: "19ceca08e22279cc", url: "https://mail.google.com/mail/u/0/#inbox/19ceca08e22279cc" },
    { from: "TLDR Data", subject: "DuckDB 1.5 Released, Critical Looker Security Bugs, BigQuery Anomaly Detection", date: "Mar 12", tag: "Data", emailId: "19ce1864ea660cde", url: "https://mail.google.com/mail/u/0/#inbox/19ce1864ea660cde" },
    { from: "Barchart Brief", subject: "'A whole variety of problems'", date: "Mar 13", tag: "Finance", emailId: "19ce86ef0bc3baa1", url: "https://mail.google.com/mail/u/0/#inbox/19ce86ef0bc3baa1" },
    { from: "The Rundown", subject: "Could I get your feedback?", date: "Mar 14", tag: "AI", emailId: "19cecbd4a927a1e2", url: "https://mail.google.com/mail/u/0/#inbox/19cecbd4a927a1e2" },
  ],
  upcomingEvents: [
    {
      title: "NVIDIA GTC 2026",
      date: "Mar 16-19",
      category: "Conference",
      description: "Jensen Huang keynote Mon 11am PT. Vera Rubin architecture, Blackwell Ultra, AI factory buildout.",
      url: "https://www.nvidia.com/gtc/",
    },
    {
      title: "Emergent Webinar: Vibecoding AI-native Edtech",
      date: "Mar 14",
      category: "Webinar",
      description: "Live vibecoding session building an AI-native edtech product.",
      url: "https://www.emergentai.com/webinars",
    },
    {
      title: "BrickLink Designer Program Series 10 Reveal",
      date: "Next Week",
      category: "Community",
      description: "YouTube Live with CPA-fol and Brick Master Harri.",
      url: "https://www.bricklink.com/v3/designer-program/",
    },
    {
      title: "Barchart Market Madness Brackets Lock",
      date: "Mar 15",
      category: "Finance",
      description: "$2M prize pool. Draft 5-stock team, pick a winning coach.",
      url: "https://www.barchart.com/market-madness",
    },
  ],
  marketPulse: [
    { ticker: "NVDA", name: "NVIDIA", price: "$185.52", change: "+1.37%", positive: true, url: "https://finance.yahoo.com/quote/NVDA/" },
    { ticker: "META", name: "Meta", price: "--", change: "Avocado delayed", positive: false, url: "https://finance.yahoo.com/quote/META/" },
    { ticker: "GOOGL", name: "Google", price: "--", change: "Gemini 3.1 momentum", positive: true, url: "https://finance.yahoo.com/quote/GOOGL/" },
    { ticker: "MSFT", name: "Microsoft", price: "--", change: "Copilot Health launch", positive: true, url: "https://finance.yahoo.com/quote/MSFT/" },
  ],
  competitiveLandscape: [
    { name: "OpenAI", move: "GPT-5.4 released, DoW deal backlash (#QuitGPT)", sentiment: "Polarized", colorClass: "border-l-emerald-500", url: "https://openai.com/index/gpt-5-4/" },
    { name: "Anthropic", move: "$100M Partner Network, TIME cover, #1 App Store", sentiment: "Positive", colorClass: "border-l-blue-500", url: "https://www.anthropic.com/news/claude-partner-network" },
    { name: "Google", move: "Gemini 3.1 Pro (77.1% ARC-AGI-2), Ask Maps", sentiment: "Rebounding", colorClass: "border-l-yellow-500", url: "https://blog.google/technology/ai/gemini-3-1-pro/" },
    { name: "Meta", move: "Avocado delayed, pivoting to open-source", sentiment: "Skeptical", colorClass: "border-l-red-500", url: "https://www.nytimes.com/2026/03/12/technology/meta-avocado-ai-model-delayed.html" },
  ],
  industryMetrics: [
    { metric: "Datacenter Lease Volume", value: "$700B+", change: "+340% YoY", url: "https://www.reuters.com/technology/datacenter-lease-volume-2026/" },
    { metric: "Enterprise Agent Adoption", value: "68.1%", change: "SQL/DevOps leading", url: "https://tldr.tech/ai/2026-03-12" },
    { metric: "Zero-Click Search", value: "~60%", change: "of all queries", url: "https://sparktoro.com/blog/zero-click-search-2026" },
    { metric: "GPU Perf/Watt", value: "5x", change: "Rubin vs Blackwell", url: "https://www.nvidia.com/en-us/data-center/vera-rubin/" },
  ],
  socialMedia: {
    linkedin: {
      hook: "The AI race just entered a new chapter this week — and if you're not paying attention, you're already behind.",
      body: `Here are 6 developments reshaping the AI landscape RIGHT NOW:

1️⃣ NVIDIA GTC 2026 kicks off Monday
Jensen Huang is unveiling Vera Rubin — 384GB HBM4, 336B transistors, 10x lower inference cost. This isn't incremental. It's generational.
https://finance.yahoo.com/news/nvidia-gtc-2026

2️⃣ Anthropic bets $100M on Claude Partner Network
Accenture, Deloitte, Cognizant, and Infosys are anchor partners. A new Claude Certified Architect certification signals enterprise AI is going mainstream.

3️⃣ Meta's "Avocado" AI model delayed
Failed internal tests for reasoning, coding, and writing. Pushed from March to at least May. A $65B AI budget doesn't guarantee results.

4️⃣ Cursor eyes $50B valuation — xAI poaches its leads
The AI code editor war is heating up. Developer tools are the new battleground.

5️⃣ GPT-5.4 is live in production
Native agency, "Thinking" and "Pro" modes. 56% of citations now link to brand sites — this changes SEO forever.
https://openai.com/index/gpt-5-4/

6️⃣ Gemini 3.1 Pro scores 77.1% on ARC-AGI-2
More than doubled previous performance. Google's "Deep Think" architecture is no joke.

The pattern is clear: AI isn't slowing down. The companies investing in agents, reasoning, and developer tools are pulling ahead.

The question isn't whether AI will transform your industry — it's whether you'll be ready when it does.

📎 Swipe through the carousel for a visual breakdown of all 6 developments.`,
      cta: "Which development surprised you the most? Drop your thoughts below 👇",
      hashtags: ["#AI", "#ArtificialIntelligence", "#NVIDIAGTC", "#GPT5", "#TechNews", "#FutureOfWork", "#AIAgents"],
      carouselSlides: [
        { slideNumber: 1, headline: "6 AI Developments You Can't Ignore This Week", body: "The AI race just entered a new chapter.", emoji: "🚀" },
        { slideNumber: 2, headline: "NVIDIA Vera Rubin Architecture", body: "384GB HBM4 · 336B transistors · 10x lower inference cost. GTC 2026 keynote: Monday 11am PT.", emoji: "💎" },
        { slideNumber: 3, headline: "Anthropic: $100M Claude Partner Network", body: "Accenture, Deloitte, Cognizant, Infosys as anchors. New Claude Certified Architect cert.", emoji: "🤝" },
        { slideNumber: 4, headline: "Meta's AI Model Delayed", body: "\"Avocado\" failed reasoning, coding, and writing tests. $65B budget ≠ guaranteed results.", emoji: "⚠️" },
        { slideNumber: 5, headline: "Cursor: $50B Valuation", body: "xAI aggressively poaching Cursor leads. Developer tools are the new AI battleground.", emoji: "⚡" },
        { slideNumber: 6, headline: "GPT-5.4 + Gemini 3.1 Pro", body: "Native agency in GPT-5.4. Gemini 3.1 scores 77.1% on ARC-AGI-2 (2x previous). The reasoning wars are here.", emoji: "🧠" },
        { slideNumber: 7, headline: "What This Means for You", body: "AI agents are accelerating. Developer tools are king. Enterprise adoption at 68%. The question isn't if — it's when.", emoji: "🎯" },
        { slideNumber: 8, headline: "Which one surprised you most?", body: "Follow for daily AI intelligence. Like & repost to share with your network.", emoji: "👇" },
      ],
    },
    twitter: {
      mainTweet: "The AI landscape shifted dramatically this week.\n\n6 developments you need to know about 🧵👇",
      thread: [
        "1/ NVIDIA GTC 2026 starts Monday\n\nJensen Huang unveils Vera Rubin:\n→ 384GB HBM4\n→ 336B transistors on 3nm\n→ 10x lower inference cost for MoE\n\nThis is generational, not incremental.",
        "2/ Anthropic commits $100M to Claude Partner Network\n\nAnchor partners: Accenture, Deloitte, Cognizant, Infosys\n\nNew: Claude Certified Architect certification\n\nEnterprise AI just went mainstream.",
        "3/ Meta delays \"Avocado\" AI model\n\nFailed internal tests for:\n• Reasoning\n• Coding\n• Writing\n\nPushed from March → May (at least)\n\n$65B AI budget ≠ guaranteed results.",
        "4/ Cursor eyes $50B valuation\n\nMeanwhile, xAI is aggressively poaching Cursor's leadership team.\n\nDeveloper tools are the new AI battleground. The talent war is real.",
        "5/ GPT-5.4 is now live in production\n\n• Native agency capabilities\n• \"Thinking\" and \"Pro\" modes\n• 56% of citations link to brand sites\n\nThis changes SEO and how businesses interact with AI forever.",
        "6/ Google Gemini 3.1 Pro scores 77.1% on ARC-AGI-2\n\nMore than doubled previous version.\n\n\"Deep Think\" architecture for structured reasoning + complex tool use.\n\nGoogle is not out of the race.",
        "The pattern is unmistakable:\n\n→ Agents > chatbots\n→ Developer tools = king\n→ Enterprise adoption at 68.1%\n→ Hardware is the bottleneck\n→ Scale alone doesn't win\n\nThe companies building for reasoning + agency are pulling ahead.",
        "Follow for daily AI intelligence.\n\nLike this thread? ♻️ Repost to share.\n\nFull daily digest with podcast + infographics: https://www.koda.community",
      ],
      hashtags: ["#AI", "#NVIDIAGTC", "#GPT5", "#Gemini", "#TechNews"],
    },
    youtubeShort: {
      title: "6 AI Developments That Changed Everything This Week",
      hookLine: "The AI race just changed forever — here's what happened in 30 seconds.",
      script: `[HOOK - 0-3 sec]
"The AI race just changed forever."

[BODY - 3-25 sec]
"NVIDIA just announced Vera Rubin — 10x cheaper inference.

Anthropic is spending $100 million on enterprise AI partners.

Meta's new AI model? Failed its own tests. Delayed.

Cursor is now worth $50 billion — and xAI is poaching their team.

GPT-5.4 is live with native AI agents.

And Gemini 3.1 just doubled its intelligence score."

[CTA - 25-30 sec]
"Follow for daily AI updates in 30 seconds. Which one shocked you most? Comment below."`,
      duration: "30 seconds",
      captions: [
        "The AI race just changed forever.",
        "NVIDIA: Vera Rubin — 10x cheaper inference",
        "Anthropic: $100M enterprise AI partners",
        "Meta's new AI model FAILED its own tests",
        "Cursor: $50 BILLION valuation",
        "GPT-5.4: Native AI agents are here",
        "Gemini 3.1: Doubled its intelligence score",
        "Follow for daily AI updates 👇",
      ],
      cta: "Follow for daily AI updates in 30 seconds. Which one shocked you most? Comment below.",
    },
  },
  worldNews: [
    {
      title: "Iran Threatens UAE Ports as War Enters Third Week",
      summary: "Iran warns citizens to evacuate three major UAE ports, claiming they are legitimate targets due to US military use. Shipping through the Strait of Hormuz has effectively ground to a halt.",
      source: "AP / CNN",
      category: "Conflict",
      url: "https://www.cnn.com/world/live-news/iran-war-us-israel-trump-03-14-26",
      timestamp: "Mar 14",
      importance: "high",
    },
    {
      title: "US Strikes Iran's Kharg Island Oil Export Hub",
      summary: "Smoke rising from major oil hub after US bombs Kharg Island military sites. Iran vows retaliation as oil prices surge past $100/barrel.",
      source: "CNN / Reuters",
      category: "Conflict",
      url: "https://www.cnn.com/world/live-news/iran-war-us-israel-trump-03-14-26",
      timestamp: "Mar 14",
      importance: "high",
    },
    {
      title: "Six US Airmen Killed in Iraq Plane Crash",
      summary: "Refueling aircraft went down over western Iraq, raising total US military deaths in the Iran operation to 13. Pentagon says crash was not due to hostile fire.",
      source: "ABC News / PBS",
      category: "Conflict",
      url: "https://www.pbs.org/newshour/show/march-13-2026-pbs-news-hour-full-episode",
      timestamp: "Mar 13",
      importance: "high",
    },
    {
      title: "Trump Lifts Russian Oil Sanctions to Lower Energy Prices",
      summary: "US eases sanctions on Russian oil as Strait of Hormuz closure chokes global supply. EU leaders and Ukraine condemn the move as fueling Russia's war effort.",
      source: "Euronews / Global News",
      category: "Economy",
      url: "https://www.euronews.com/video/2026/03/14/latest-news-bulletin-march-14th-2026-morning",
      timestamp: "Mar 14",
      importance: "high",
    },
    {
      title: "Israel Deepens Lebanon Operations; 826 Killed",
      summary: "Israel's war against Hezbollah escalates with strikes on southern Beirut and Sidon. Over 850,000 displaced. UN Secretary-General calls for diplomatic solution.",
      source: "AP / Euronews",
      category: "Conflict",
      url: "https://www.ksat.com/news/2026/03/14/the-latest-trump-threatens-irans-oil-infrastructure-after-us-bombs-island-military-sites/",
      timestamp: "Mar 14",
      importance: "high",
    },
    {
      title: "Michigan Synagogue Attack: FBI Investigation Deepens",
      summary: "New video shows suspect buying $2,000 of fireworks days before ramming truck into Temple Israel. FBI calls it a targeted act of violence against the Jewish community.",
      source: "ABC News / PBS",
      category: "Society",
      url: "https://www.pbs.org/newshour/show/march-13-2026-pbs-news-hour-full-episode",
      timestamp: "Mar 13",
      importance: "high",
    },
    {
      title: "Canada Sheds 84,000 Jobs in February",
      summary: "Worst monthly job losses in four years. Youth unemployment hits 14.1%. US trade war and rising energy costs from Iran conflict cited as key factors.",
      source: "Global News",
      category: "Economy",
      url: "https://www.youtube.com/watch?v=gXN61qs4i9Y",
      timestamp: "Mar 14",
      importance: "medium",
    },
    {
      title: "Pakistan Introduces Austerity Measures Amid Oil Shock",
      summary: "Schools shift to online classes for 2 weeks, public sector workweek shortened. Fuel prices up 20% as oil surges past $100/barrel due to Strait of Hormuz disruption.",
      source: "Global Pulse",
      category: "Economy",
      url: "https://www.youtube.com/watch?v=wse6fYk5Zh0",
      timestamp: "Mar 14",
      importance: "medium",
    },
  ],
};

export const SEED_DATE = "2026-03-14";
