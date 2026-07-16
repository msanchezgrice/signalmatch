import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FreeToolsWorkbench } from "@/components/marketing/free-tools-workbench";
import { freeTools } from "@/lib/free-tools";
import {
  getMarketingMetadata,
  marketingMetadata,
} from "@/lib/marketing-metadata";

import styles from "../resources/editorial.module.css";

export const metadata: Metadata = getMarketingMetadata("/tools");

export default function ToolsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "SignalMatch free creator campaign tools",
      description: marketingMetadata["/tools"].description,
      url: "https://www.signalmatch.me/tools",
      isPartOf: {
        "@type": "WebSite",
        name: "SignalMatch",
        url: "https://www.signalmatch.me",
      },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: freeTools.length,
        itemListElement: freeTools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.title,
          description: tool.description,
          url: `https://www.signalmatch.me/tools#${tool.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "SignalMatch free campaign tools",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
            <Image
              alt=""
              className={styles.brandMark}
              height={28}
              src="/brand/signalmatch-mark.png"
              width={28}
            />
            SignalMatch
          </Link>
          <div className={styles.navLinks}>
            <Link href="/resources">Resources</Link>
            <Link
              className={styles.button}
              href="/builders/sign-up?utm_source=tools&utm_medium=free_tool&utm_campaign=launch_tools"
            >
              Launch a campaign
            </Link>
          </div>
        </nav>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Free creator campaign tools</p>
          <h1>Calculate the campaign before you invite the creator.</h1>
          <p>
            Use these free SignalMatch tools to plan creator CPA offers,
            budgets, referral links, attribution windows, campaign briefs, and
            conversion tracking controls. They are lightweight, browser-based,
            and built for launch decisions.
          </p>
        </header>
        <FreeToolsWorkbench />
        <footer className={styles.footer}>
          Free planning tools, not financial, legal, tax, or advertising advice.
          Use actual campaign records before making payout decisions.{" "}
          <Link href="/resources">Read the field guides</Link>.
        </footer>
      </div>
    </main>
  );
}
