import { describe, expect, it } from "vitest";

import {
  extractProductEvidenceFromHtml,
  normalizePublicProductUrl,
} from "@/server/lib/product-evidence";

describe("product evidence", () => {
  it("normalizes a product domain and resolves first-party social images", () => {
    const url = normalizePublicProductUrl("myforeversongs.com");
    const evidence = extractProductEvidenceFromHtml(
      `<title>Custom Songs | My Forever Songs</title>
       <meta property="og:description" content="Hear a personalized song before you buy." />
       <meta property="og:image" content="/opengraph.jpg" />`,
      url,
    );

    expect(url).toBe("https://myforeversongs.com/");
    expect(evidence).toEqual({
      title: "Custom Songs | My Forever Songs",
      description: "Hear a personalized song before you buy.",
      imageUrl: "https://myforeversongs.com/opengraph.jpg",
    });
  });

  it("rejects non-http product URLs and unsafe image protocols", () => {
    expect(() => normalizePublicProductUrl("javascript:alert(1)")).toThrow();

    const evidence = extractProductEvidenceFromHtml(
      `<meta property="og:image" content="data:image/svg+xml,unsafe" />`,
      "https://example.com/",
    );

    expect(evidence.imageUrl).toBeNull();
  });
});
