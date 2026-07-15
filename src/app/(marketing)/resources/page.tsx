import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { editorialPosts } from "@/lib/editorial";
import {
  getMarketingMetadata,
  marketingMetadata,
} from "@/lib/marketing-metadata";
import styles from "./editorial.module.css";

export const metadata: Metadata = getMarketingMetadata("/resources");

export default function ResourcesPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SignalMatch creator performance marketing resources",
    description: marketingMetadata["/resources"].description,
    url: "https://www.signalmatch.me/resources",
    isPartOf: {
      "@type": "WebSite",
      name: "SignalMatch",
      url: "https://www.signalmatch.me",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: editorialPosts.length,
      itemListElement: editorialPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `https://www.signalmatch.me/resources/${post.slug}`,
      })),
    },
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className={styles.shell}>
        <nav className={styles.nav}>
          <Link className={styles.brand} href="/">
            <Image className={styles.brandMark} src="/brand/signalmatch-mark.png" alt="" width={28} height={28} />
            SignalMatch
          </Link>
          <div className={styles.navLinks}>
            <Link href="/resources">Resources</Link>
            <Link
              className={styles.button}
              href="/explore/campaigns?utm_source=resources&utm_medium=content&utm_campaign=wave2"
            >
              Explore outcome-based partnerships
            </Link>
          </div>
        </nav>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>
            Creator performance marketing resources
          </p>
          <h1>
            Build CPA partnerships that creators and builders can inspect.
          </h1>
          <p>
            Learn creator campaign economics, matching, attribution, conversion
            approval, disclosure, fraud controls, and fair payouts. Every
            SignalMatch guide includes a repeatable workflow, explicit limits,
            primary sources, related reading, and a concrete next step.
          </p>
        </header>
        <section className={styles.grid} aria-label="All resources">
          {editorialPosts.map((post) => (
            <Link
              className={`${styles.card} ${post.pillar ? styles.pillar : ""}`}
              href={`/resources/${post.slug}`}
              key={post.slug}
            >
              <div className={styles.meta}>
                <span className={styles.pill}>
                  {post.pillar
                    ? "Deep guide"
                    : `${post.readingMinutes} minute guide`}
                </span>
                {post.tags.slice(0, 2).map((tag) => (
                  <span className={styles.pill} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </Link>
          ))}
        </section>
        <footer className={styles.footer}>
          Updated July 15, 2026 · Sources are linked at the claim they support ·{" "}
          <Link href="/about">About SignalMatch</Link> ·{" "}
          <Link href="/privacy">Privacy</Link> ·{" "}
          <Link href="/terms">Terms</Link>
        </footer>
      </div>
    </main>
  );
}
