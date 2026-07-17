function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function readAttribute(tag: string, name: string) {
  const match = tag.match(
    new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );

  return decodeHtml(match?.[1] ?? match?.[2] ?? match?.[3] ?? "").trim() || null;
}

function readMeta(html: string, names: string[]) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = (readAttribute(tag, "property") ?? readAttribute(tag, "name"))?.toLowerCase();
    if (key && names.includes(key)) {
      return readAttribute(tag, "content");
    }
  }

  return null;
}

function safeAssetUrl(value: string | null, baseUrl: string) {
  if (!value) {
    return null;
  }

  try {
    const resolved = new URL(value, baseUrl);
    return resolved.protocol === "https:" || resolved.protocol === "http:"
      ? resolved.toString()
      : null;
  } catch {
    return null;
  }
}

export function normalizePublicProductUrl(value: string) {
  const trimmed = value.trim();
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(candidate);

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Product URL must use HTTP or HTTPS");
  }

  return url.toString();
}

export function extractProductEvidenceFromHtml(html: string, pageUrl: string) {
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch?.[1]
    ? decodeHtml(titleMatch[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim())
    : readMeta(html, ["og:title", "twitter:title"]);
  const description = readMeta(html, [
    "og:description",
    "twitter:description",
    "description",
  ]);
  const image = readMeta(html, ["og:image", "og:image:url", "twitter:image"]);

  return {
    title: title || null,
    description,
    imageUrl: safeAssetUrl(image, pageUrl),
  };
}
