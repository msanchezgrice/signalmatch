import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { editorialPosts } from "@/lib/editorial";
import { marketingMetadata } from "@/lib/marketing-metadata";

const textFromHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .trim();

const wordCount = (html: string) =>
  textFromHtml(html).split(/\s+/).filter(Boolean).length;

const substantialParagraphs = (html: string) =>
  [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((match) => textFromHtml(match[1]).replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph.split(/\s+/).length >= 20);

describe("editorial launch requirements", () => {
  it("publishes at least ten substantial guides and a 2,000-word tentpole", () => {
    expect(editorialPosts.length).toBeGreaterThanOrEqual(11);

    for (const post of editorialPosts) {
      expect(wordCount(post.bodyHtml), post.slug).toBeGreaterThanOrEqual(1_200);
      expect(post.wordCount, post.slug).toBe(wordCount(post.bodyHtml));
      expect(post.relatedSlugs.length, post.slug).toBeGreaterThanOrEqual(2);
    }

    expect(
      editorialPosts.some(
        (post) => post.pillar && wordCount(post.bodyHtml) >= 2_000,
      ),
    ).toBe(true);
  });

  it("uses unique, indexable metadata for every primary marketing route", () => {
    const entries = Object.entries(marketingMetadata);
    expect(entries.length).toBeGreaterThanOrEqual(9);

    const titles = entries.map(([, value]) => value.title);
    const canonicals = entries.map(([, value]) => value.canonical);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(canonicals).size).toBe(canonicals.length);

    for (const [route, value] of entries) {
      expect(value.canonical, route).toBe(route);
      expect(value.description.length, route).toBeGreaterThanOrEqual(90);
      expect(value.description.length, route).toBeLessThanOrEqual(170);
      expect(value.title, route).toContain("SignalMatch");
    }
  });

  it("includes every guide once in the XML sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);

    for (const post of editorialPosts) {
      expect(urls).toContain(`https://www.signalmatch.me/resources/${post.slug}`);
    }
  });

  it("does not reuse substantial paragraphs across separate guides", () => {
    const owners = new Map<string, string[]>();

    for (const post of editorialPosts) {
      for (const paragraph of substantialParagraphs(post.bodyHtml)) {
        owners.set(paragraph, [...(owners.get(paragraph) ?? []), post.slug]);
      }
    }

    const reused = [...owners.entries()].filter(
      ([, slugs]) => new Set(slugs).size > 1,
    );
    expect(reused).toEqual([]);
  });

  it("publishes marketplace-specific privacy and terms coverage", () => {
    const privacy = readFileSync(
      new URL("../../src/app/(marketing)/privacy/page.tsx", import.meta.url),
      "utf8",
    );
    const terms = readFileSync(
      new URL("../../src/app/(marketing)/terms/page.tsx", import.meta.url),
      "utf8",
    );

    for (const phrase of [
      "personal information",
      "service providers",
      "cookies",
      "retention",
      "security",
      "your choices",
      "contact",
    ]) {
      expect(privacy.toLowerCase()).toContain(phrase);
    }

    for (const phrase of [
      "eligibility",
      "campaign",
      "conversion",
      "payout",
      "refund",
      "dispute",
      "creator",
      "builder",
      "prohibited",
      "termination",
      "disclaimer",
    ]) {
      expect(terms.toLowerCase()).toContain(phrase);
    }
  });
});
