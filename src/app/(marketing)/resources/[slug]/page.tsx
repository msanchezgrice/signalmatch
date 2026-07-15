import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { editorialPosts, getEditorialPost } from "@/lib/editorial";
import styles from "../editorial.module.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return editorialPosts.map((post) => ({ slug: post.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getEditorialPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | SignalMatch`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/resources/${post.slug}` },
    openGraph: {
      title: `${post.title} | SignalMatch`,
      description: post.description,
      type: "article",
      url: `/resources/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        { url: "/opengraph-image", width: 1200, height: 630, alt: post.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | SignalMatch`,
      description: post.description,
      images: ["/opengraph-image"],
    },
  };
}
export default async function ResourceArticle({ params }: Props) {
  const post = getEditorialPost((await params).slug);
  if (!post) notFound();
  const related = post.relatedSlugs
    .map(getEditorialPost)
    .filter((value): value is NonNullable<typeof value> => Boolean(value));
  const canonical = `https://www.signalmatch.me/resources/${post.slug}`;
  const reviewedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${post.updatedAt}T00:00:00Z`));
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      wordCount: post.wordCount,
      timeRequired: `PT${post.readingMinutes}M`,
      mainEntityOfPage: canonical,
      url: canonical,
      image: "https://www.signalmatch.me/opengraph-image",
      articleSection: "Creator performance marketing",
      isPartOf: {
        "@type": "Blog",
        name: "SignalMatch Resources",
        url: "https://www.signalmatch.me/resources",
      },
      author: {
        "@type": "Organization",
        name: "SignalMatch",
        url: "https://www.signalmatch.me/about",
      },
      publisher: {
        "@type": "Organization",
        name: "SignalMatch",
        url: "https://www.signalmatch.me",
        logo: {
          "@type": "ImageObject",
          url: "https://www.signalmatch.me/opengraph-image",
        },
      },
      keywords: post.tags.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "SignalMatch",
          item: "https://www.signalmatch.me",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Resources",
          item: "https://www.signalmatch.me/resources",
        },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  ];
  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className={styles.shell}>
        <nav className={styles.nav}>
          <Link className={styles.brand} href="/">
            <Image className={styles.brandMark} src="/brand/signalmatch-mark.png" alt="" width={28} height={28} />
            SignalMatch
          </Link>
          <div className={styles.navLinks}>
            <Link href="/resources">All resources</Link>
            <Link
              className={styles.button}
              href="/explore/campaigns?utm_source=resources&utm_medium=content&utm_campaign=wave2"
            >
              Explore outcome-based partnerships
            </Link>
          </div>
        </nav>
        <header className={styles.articleHero}>
          <p className={styles.eyebrow}>
            {post.pillar ? "Deep guide" : "Field guide"}
          </p>
          <h1>{post.title}</h1>
          <p>{post.description}</p>
          <div className={styles.articleMeta}>
            <span>{post.readingMinutes} minute read</span>
            <span>Reviewed {reviewedAt}</span>
          </div>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span className={styles.pill} key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div className={styles.articleLayout}>
          <article
            className={styles.article}
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />
          <aside className={styles.sidebar}>
            <h2>Related guides</h2>
            {related.map((item) => (
              <Link href={`/resources/${item.slug}`} key={item.slug}>
                {item.title}
              </Link>
            ))}
            <p className={styles.sourceNote}>
              Sources were checked on {reviewedAt}. Follow each publisher for
              the newest revision.
            </p>
          </aside>
        </div>
        <footer className={styles.footer}>
          Educational information, not individualized legal, medical, financial,
          or safety advice.
        </footer>
      </div>
    </main>
  );
}
