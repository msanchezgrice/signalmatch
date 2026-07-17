import { describe, expect, it } from "vitest";

import { isHttpWebsiteUrl, normalizeWebsiteUrl } from "@/lib/url";

describe("website URL normalization", () => {
  it.each([
    ["launchbuddy.com", "https://launchbuddy.com"],
    ["www.launchbuddy.com", "https://www.launchbuddy.com"],
    ["//launchbuddy.com/pricing", "https://launchbuddy.com/pricing"],
    ["http://launchbuddy.com", "http://launchbuddy.com"],
    [" https://launchbuddy.com/path?q=1 ", "https://launchbuddy.com/path?q=1"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeWebsiteUrl(input)).toBe(expected);
  });

  it("leaves malformed values invalid", () => {
    const normalized = normalizeWebsiteUrl("not a website");
    expect(isHttpWebsiteUrl(normalized)).toBe(false);
  });

  it("rejects non-http protocols", () => {
    expect(isHttpWebsiteUrl(normalizeWebsiteUrl("ftp://example.com"))).toBe(false);
  });
});
