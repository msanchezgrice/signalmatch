import "server-only";

const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "you",
  "are",
  "our",
  "into",
  "about",
  "their",
  "have",
  "has",
  "was",
  "were",
  "will",
  "not",
  "can",
  "all",
  "more",
  "free",
]);

type PersonaRule = {
  name: string;
  rationale: string;
  keywords: string[];
};

const personaRules: PersonaRule[] = [
  {
    name: "Startup founders",
    rationale: "Messaging emphasizes growth, GTM, and business outcomes.",
    keywords: ["startup", "founder", "growth", "revenue", "saas", "go-to-market"],
  },
  {
    name: "Developers and engineers",
    rationale: "Product language references APIs, automation, or engineering workflows.",
    keywords: ["api", "developer", "engineering", "code", "automation", "sdk", "devtools"],
  },
  {
    name: "Marketers and growth teams",
    rationale: "Copy focuses on campaign execution, acquisition, and analytics.",
    keywords: ["marketing", "campaign", "attribution", "ads", "growth", "funnel"],
  },
  {
    name: "Sales and RevOps teams",
    rationale: "Product use cases call out pipeline, outbound, and conversion.",
    keywords: ["sales", "pipeline", "outbound", "lead", "prospect", "revops"],
  },
  {
    name: "Creators and educators",
    rationale: "Product value speaks to audiences, content, and creator workflows.",
    keywords: ["creator", "audience", "content", "newsletter", "community", "education"],
  },
];

function decodeEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function stripTags(value: string) {
  return decodeEntities(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractFirstMatch(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  if (!match?.[1]) {
    return null;
  }
  return stripTags(match[1]);
}

function extractMany(html: string, pattern: RegExp, maxItems = 6) {
  const values: string[] = [];
  for (const match of html.matchAll(pattern)) {
    const value = stripTags(match[1] ?? "");
    if (value && !values.includes(value)) {
      values.push(value);
    }
    if (values.length >= maxItems) {
      break;
    }
  }
  return values;
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function topKeywords(text: string, max = 6) {
  const counts = new Map<string, number>();
  for (const token of tokenize(text)) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([token]) => token);
}

function inferPersonas(corpus: string) {
  const tokens = new Set(tokenize(corpus));
  const matches = personaRules
    .map((rule) => {
      const overlap = rule.keywords.filter((keyword) => tokens.has(keyword)).length;
      return { rule, overlap };
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((item) => ({
      name: item.rule.name,
      rationale: item.rule.rationale,
    }));

  if (matches.length > 0) {
    return matches;
  }

  return [
    {
      name: "General business users",
      rationale: "No strong niche keywords found; broad messaging likely.",
    },
  ];
}

export type SiteAnalysis = {
  input_url: string;
  final_url: string;
  source: "direct" | "fallback";
  title: string | null;
  summary: string | null;
  key_points: string[];
  category_tags: string[];
  target_personas: Array<{ name: string; rationale: string }>;
};

async function tryFetch(url: string, headers?: Record<string, string>) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
    headers,
  });

  if (!response.ok) {
    throw new Error(`Could not fetch website (${response.status})`);
  }

  return {
    finalUrl: response.url,
    body: await response.text(),
  };
}

async function fetchWebsiteContent(inputUrl: string) {
  const url = new URL(inputUrl);
  const httpUrl =
    url.protocol === "https:" ? `http://${url.host}${url.pathname}${url.search}` : inputUrl;
  const jinaUrl = `https://r.jina.ai/http://${url.host}${url.pathname}${url.search}`;

  const directHeaders = {
    "user-agent": "SignalMatchAnalyzer/1.0 (+https://www.signalmatch.me)",
    accept: "text/html,application/xhtml+xml",
  };

  const attempts: Array<{
    url: string;
    source: "direct" | "fallback";
    headers?: Record<string, string>;
  }> = [
    { url: inputUrl, source: "direct", headers: directHeaders },
    { url: inputUrl, source: "direct" },
  ];

  if (httpUrl !== inputUrl) {
    attempts.push({ url: httpUrl, source: "direct", headers: directHeaders });
    attempts.push({ url: httpUrl, source: "direct" });
  }

  attempts.push({ url: jinaUrl, source: "fallback" });

  let lastError: Error | null = null;
  for (const attempt of attempts) {
    try {
      const result = await tryFetch(attempt.url, attempt.headers);
      return {
        ...result,
        source: attempt.source,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Fetch failed");
    }
  }

  throw lastError ?? new Error("Could not fetch website");
}

function parsePlainTextFallback(body: string) {
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const title =
    lines.find((line) => line.startsWith("Title:"))?.replace(/^Title:\s*/, "") ??
    lines[0] ??
    null;

  const summaryCandidate = lines.find(
    (line) =>
      !line.startsWith("Title:") &&
      !line.startsWith("URL Source:") &&
      !line.startsWith("Markdown Content:") &&
      line.length > 40,
  );

  const keyPoints = lines
    .filter((line) => line.length > 20)
    .slice(0, 6);

  return {
    title,
    summary: summaryCandidate ?? null,
    keyPoints,
    corpus: [title, summaryCandidate, ...keyPoints].filter(Boolean).join(" "),
  };
}

export async function analyzeSite(url: string): Promise<SiteAnalysis> {
  const { body, finalUrl, source } = await fetchWebsiteContent(url);
  const looksLikeHtml = /<html|<title|<h1|<meta/i.test(body);
  const fallback = looksLikeHtml ? null : parsePlainTextFallback(body);

  const title = looksLikeHtml
    ? extractFirstMatch(body, /<title[^>]*>([\s\S]*?)<\/title>/i)
    : fallback?.title ?? null;

  const description = looksLikeHtml
    ? extractFirstMatch(
        body,
        /<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
      ) ??
      extractFirstMatch(
        body,
        /<meta[^>]+property=["']og:description["'][^>]+content=["']([\s\S]*?)["'][^>]*>/i,
      )
    : fallback?.summary ?? null;

  const headings = looksLikeHtml ? extractMany(body, /<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi, 6) : [];
  const listItems = looksLikeHtml ? extractMany(body, /<li[^>]*>([\s\S]*?)<\/li>/gi, 8) : [];

  const keyPoints = looksLikeHtml
    ? [...headings, ...listItems]
        .map((value) => value.trim())
        .filter((value) => value.length >= 8)
        .slice(0, 6)
    : fallback?.keyPoints ?? [];

  const corpus = looksLikeHtml
    ? [title, description, ...headings, ...listItems].filter(Boolean).join(" ")
    : fallback?.corpus ?? "";

  return {
    input_url: url,
    final_url: finalUrl,
    source,
    title,
    summary: description ?? null,
    key_points: keyPoints,
    category_tags: topKeywords(corpus),
    target_personas: inferPersonas(corpus),
  };
}
