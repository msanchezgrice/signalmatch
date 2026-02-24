const blockedXPaths = new Set([
  "home",
  "explore",
  "notifications",
  "messages",
  "settings",
  "search",
  "i",
  "share",
  "intent",
  "tos",
  "privacy",
]);

function normalizeHost(hostname: string) {
  return hostname.toLowerCase().replace(/^(www|m|mobile)\./, "");
}

function sanitizeHandle(value: string) {
  return decodeURIComponent(value).replace(/^@+/, "").trim();
}

function normalizeInputUrl(raw: string) {
  const input = raw.trim();
  if (!input) {
    return null;
  }

  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;

  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

function isValidHandle(handle: string) {
  return /^[A-Za-z0-9._-]{2,100}$/.test(handle);
}

export type InferredSocialProfile = {
  normalizedUrl: string;
  platform: string;
  handle: string;
  analysisPlatform?: "linkedin" | "x";
};

export function inferSocialProfileFromUrl(raw: string): InferredSocialProfile | null {
  const parsed = normalizeInputUrl(raw);
  if (!parsed) {
    return null;
  }

  const hostname = normalizeHost(parsed.hostname);
  const segments = parsed.pathname.split("/").filter(Boolean).map(sanitizeHandle);

  if (hostname === "linkedin.com") {
    const handle =
      segments[0]?.toLowerCase() === "in" && segments[1] ? segments[1] : segments[0] ?? "";
    if (!isValidHandle(handle)) {
      return null;
    }

    return {
      normalizedUrl: `https://www.linkedin.com/in/${handle}`,
      platform: "linkedin",
      handle,
      analysisPlatform: "linkedin",
    };
  }

  if (hostname === "x.com" || hostname === "twitter.com") {
    const first = segments[0] ?? "";
    if (!first || blockedXPaths.has(first.toLowerCase()) || !isValidHandle(first)) {
      return null;
    }

    return {
      normalizedUrl: `https://x.com/${first}`,
      platform: "x",
      handle: first,
      analysisPlatform: "x",
    };
  }

  if (hostname === "tiktok.com") {
    const first = segments[0] ?? "";
    const handle = sanitizeHandle(first.replace(/^@/, ""));
    if (!isValidHandle(handle)) {
      return null;
    }

    return {
      normalizedUrl: `https://www.tiktok.com/@${handle}`,
      platform: "tiktok",
      handle,
    };
  }

  if (hostname === "instagram.com") {
    const handle = segments[0] ?? "";
    if (!isValidHandle(handle)) {
      return null;
    }

    return {
      normalizedUrl: `https://www.instagram.com/${handle}`,
      platform: "instagram",
      handle,
    };
  }

  if (hostname === "youtube.com" || hostname === "youtu.be") {
    let handle = "";

    if (segments[0]?.startsWith("@")) {
      handle = sanitizeHandle(segments[0]);
    } else if (segments[0] && ["c", "channel", "user"].includes(segments[0].toLowerCase()) && segments[1]) {
      handle = sanitizeHandle(segments[1]);
    } else if (segments[0]) {
      handle = sanitizeHandle(segments[0]);
    }

    if (!isValidHandle(handle)) {
      return null;
    }

    return {
      normalizedUrl: `https://www.youtube.com/@${handle}`,
      platform: "youtube",
      handle,
    };
  }

  return null;
}
