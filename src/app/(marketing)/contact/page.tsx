import type { Metadata } from "next";
import Link from "next/link";

import { getMarketingMetadata } from "@/lib/marketing-metadata";

import styles from "../resources/editorial.module.css";

export const metadata: Metadata = getMarketingMetadata("/contact");

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.nav}>
          <Link className={styles.brand} href="/">
            SignalMatch
          </Link>
          <div className={styles.navLinks}>
            <Link href="/resources">Resources</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </nav>
        <article className={styles.legal}>
          <p className={styles.eyebrow}>Contact SignalMatch</p>
          <h1>Tell us what you are trying to launch or resolve.</h1>
          <p>
            Email{" "}
            <a href="mailto:msanchezgrice@gmail.com">msanchezgrice@gmail.com</a>{" "}
            and include “SignalMatch” plus the topic in the subject line. Do not
            send passwords, payment credentials, government identifiers, private
            customer records, or other unnecessary sensitive information.
          </p>
          <h2>Product and partnership support</h2>
          <p>
            Include your account role, campaign name, what you expected, what
            occurred, and the approximate time. For a conversion or payout
            question, include the SignalMatch campaign or event identifier—not a
            customer&apos;s private information.
          </p>
          <h2>Privacy and security</h2>
          <p>
            Use “SignalMatch privacy” for an access, correction, deletion, or
            other privacy request. Use “SignalMatch security” for a suspected
            vulnerability or unauthorized account activity. Please allow us to
            confirm receipt before publicly sharing details that could put users
            at risk.
          </p>
          <h2>Editorial corrections</h2>
          <p>
            Send the resource URL, the statement at issue, and a current primary
            source when possible. We review corrections and update dates when
            evidence changes. Product feedback, design-partner requests, and
            suggestions for new creator performance marketing resources are also
            welcome.
          </p>
          <p>Last reviewed July 15, 2026.</p>
        </article>
      </div>
    </main>
  );
}
