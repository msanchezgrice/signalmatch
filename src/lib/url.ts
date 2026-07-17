export function normalizeWebsiteUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
  const candidate = trimmed.startsWith("//")
    ? `https:${trimmed}`
    : hasScheme
      ? trimmed
      : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return trimmed;
    }

    if (parsed.pathname === "/" && !parsed.search && !parsed.hash) {
      return parsed.origin;
    }

    return parsed.toString();
  } catch {
    return trimmed;
  }
}

export function isHttpWebsiteUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
