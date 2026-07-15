import type { Metadata } from "next";
import Link from "next/link";

import { getMarketingMetadata } from "@/lib/marketing-metadata";

import styles from "../resources/editorial.module.css";

export const metadata: Metadata = getMarketingMetadata("/about");

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.nav}>
          <Link className={styles.brand} href="/">
            SignalMatch
          </Link>
          <div className={styles.navLinks}>
            <Link href="/resources">Resources</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>
        <article className={styles.legal}>
          <p className={styles.eyebrow}>About SignalMatch</p>
          <h1>Performance partnerships with an inspectable record.</h1>
          <p>
            SignalMatch is a creator performance marketing marketplace for AI
            product builders and the creators whose audiences trust them.
            Builders define an eligible customer outcome and a cost per
            acquisition. Creators choose products that fit their work and earn
            payouts for approved conversions.
          </p>
          <h2>Why we are building it</h2>
          <p>
            Creator partnerships often fail at the handoff between a promising
            post and a business result. Terms are ambiguous, attribution is
            difficult to review, and creators may wait without a clear approval
            or payout status. SignalMatch is designed to make the shared
            operating record clearer: conversion event, referral code, campaign
            budget, decision status, reversal policy, and payout.
          </p>
          <h2>How we approach trust</h2>
          <p>
            Software cannot eliminate attribution uncertainty or guarantee
            campaign performance. We favor explicit definitions, idempotent
            event records, bounded data collection, visible limitations, clear
            sponsorship disclosure, and a human review path for consequential
            decisions. Public campaign examples are labeled when they are
            illustrative rather than real customer results.
          </p>
          <h2>How we publish</h2>
          <p>
            SignalMatch resources answer practical questions about CPA
            economics, creator fit, campaign briefs, disclosure, attribution,
            approvals, fraud controls, and payouts. We link primary sources near
            the claims they support, show review dates, connect related guides,
            and distinguish education from legal, tax, accounting, or financial
            advice. Corrections are welcome through our{" "}
            <Link href="/contact">contact page</Link>.
          </p>
          <p>Last reviewed July 15, 2026.</p>
        </article>
      </div>
    </main>
  );
}
