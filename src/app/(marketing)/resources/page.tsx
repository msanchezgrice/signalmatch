import type { Metadata } from "next";
import Link from "next/link";
import { editorialPosts } from "@/lib/editorial";
import styles from "./editorial.module.css";

export const metadata: Metadata = {
  title: "Resources | SignalMatch",
  description: "Practical, compliant guides for creator CPA economics, attribution, qualification, and proof.",
  alternates: { canonical: "/resources" },
  openGraph: { title: "Resources | SignalMatch", description: "Practical, compliant guides for creator CPA economics, attribution, qualification, and proof.", url: "/resources", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};

export default function ResourcesPage() {
  return <main className={styles.page}>
    <div className={styles.shell}>
      <nav className={styles.nav}><Link className={styles.brand} href="/">SignalMatch</Link><div className={styles.navLinks}><Link href="/resources">Resources</Link><Link className={styles.button} href="/explore/campaigns?utm_source=resources&utm_medium=content&utm_campaign=wave2">Explore outcome-based partnerships</Link></div></nav>
      <header className={styles.hero}><p className={styles.eyebrow}>Practical, source-linked field guides</p><h1>Make the next decision with evidence.</h1><p>Practical, compliant guides for creator CPA economics, attribution, qualification, and proof. Every guide includes a repeatable workflow, explicit limits, primary sources, internal links, and a real next step.</p></header>
      <section className={styles.grid} aria-label="All resources">{editorialPosts.map((post) => <Link className={`${styles.card} ${post.pillar ? styles.pillar : ""}`} href={`/resources/${post.slug}`} key={post.slug}><div className={styles.meta}><span className={styles.pill}>{post.pillar ? "Deep guide" : `${post.readingMinutes} minute guide`}</span>{post.tags.slice(0,2).map((tag)=><span className={styles.pill} key={tag}>{tag}</span>)}</div><h2>{post.title}</h2><p>{post.description}</p></Link>)}</section>
      <footer className={styles.footer}>Updated July 13, 2026 · Sources are linked at the claim they support · Independent experts can also build a privacy-bounded opportunity page with <a href="https://oportuna.me/resources">Oportuna</a>.</footer>
    </div>
  </main>;
}
