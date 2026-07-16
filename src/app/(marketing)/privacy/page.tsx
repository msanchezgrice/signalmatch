import type { Metadata } from "next";
import Link from "next/link";

import { getMarketingMetadata } from "@/lib/marketing-metadata";

import styles from "../resources/editorial.module.css";

export const metadata: Metadata = getMarketingMetadata("/privacy");

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.nav}>
          <Link className={styles.brand} href="/">
            SignalMatch
          </Link>
          <div className={styles.navLinks}>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>

        <article className={styles.legal}>
          <p className={styles.eyebrow}>Trust and transparency</p>
          <h1>Privacy Policy</h1>
          <p>
            This policy explains how SignalMatch collects, uses, shares, and
            protects personal information when builders, creators, visitors, and
            referred customers use our creator performance marketing
            marketplace. It applies to signalmatch.me, SignalMatch accounts,
            campaign and referral workflows, support, and related services. It
            does not govern a builder&apos;s own product or a creator&apos;s
            independent website, channel, or privacy practices.
          </p>
          <p>
            <strong>Effective and last reviewed:</strong> July 15, 2026.
          </p>

          <h2>Personal information we collect</h2>
          <p>Depending on how you use SignalMatch, we may collect:</p>
          <ul>
            <li>
              <strong>Account and identity information:</strong> name, email
              address, account identifier, profile image, role, and
              authentication records provided through our sign-in provider.
            </li>
            <li>
              <strong>Creator profile information:</strong> display name,
              biography, niches, audience tags, channels, public profile links,
              audience and engagement figures, tool stack, and payout onboarding
              status. Information submitted to the public profile analyzer may
              be used to generate a draft that you can review before saving.
            </li>
            <li>
              <strong>Builder and campaign information:</strong> company and
              product details, websites, campaign briefs, target tags,
              conversion definitions, budgets, approval settings, invitations,
              and partnership decisions.
            </li>
            <li>
              <strong>Attribution and transaction information:</strong> referral
              codes, landing and campaign identifiers, external conversion
              identifiers, event times, eligibility and approval status, funding
              events, payout records, reversals, and limited fraud-prevention
              signals. Builders should not send passwords, payment card data,
              government identifiers, health information, or unnecessary
              customer details through conversion events.
            </li>
            <li>
              <strong>Payment information:</strong> our payment provider
              processes payment methods, identity verification, bank details,
              tax information, and transfers. SignalMatch generally receives
              status, account identifiers, amounts, and transaction references
              rather than full card or bank credentials.
            </li>
            <li>
              <strong>Device, usage, and support information:</strong> pages
              viewed, interactions, referral parameters, browser and device
              details, approximate location derived from network information,
              diagnostics, session information, messages, and feedback.
            </li>
          </ul>

          <h2>How we use information</h2>
          <p>We use personal information to:</p>
          <ul>
            <li>
              authenticate accounts, maintain profiles, and provide
              role-specific marketplace features;
            </li>
            <li>
              match creators and campaigns, administer partnerships, and show
              relevant public listings;
            </li>
            <li>
              attribute, review, approve, reject, reverse, reconcile, and pay
              eligible conversions;
            </li>
            <li>process campaign funding and creator payout onboarding;</li>
            <li>
              protect the service, enforce campaign terms, prevent duplicates
              and abuse, and resolve disputes;
            </li>
            <li>
              respond to support, privacy, correction, and product-feedback
              requests;
            </li>
            <li>
              measure reliability and product usage, improve workflows, and
              understand campaign performance;
            </li>
            <li>
              comply with applicable law and protect the rights, safety, and
              integrity of users and SignalMatch.
            </li>
          </ul>

          <h2>Cookies, analytics, and similar technologies</h2>
          <p>
            SignalMatch and our service providers may use cookies, local
            storage, pixels, and similar technologies for authentication,
            security, preferences, attribution, analytics, and—when enabled with
            appropriate notice or consent—advertising measurement. Essential
            technologies keep accounts and marketplace workflows operating.
            Analytics can show which pages and product paths are useful.
            Referral parameters connect an eligible journey to a campaign under
            its stated attribution window.
          </p>
          <p>
            Browser controls may block or delete cookies, but doing so can
            affect sign-in, attribution, and other features. Where applicable,
            SignalMatch will provide a consent or preference control for
            nonessential analytics or advertising technologies. Privacy signals
            and opt-out rights are handled as required by applicable law; their
            effect can vary by technology and jurisdiction.
          </p>

          <h2>How we share information</h2>
          <p>We may share information with:</p>
          <ul>
            <li>
              <strong>Marketplace participants:</strong> relevant builder,
              creator, campaign, partnership, referral, conversion status, and
              payout information needed to operate an accepted partnership. We
              do not intend to expose a referred customer&apos;s unnecessary
              personal information to creators.
            </li>
            <li>
              <strong>Service providers:</strong> vendors that support
              authentication, hosting, database and infrastructure, payments,
              analytics, communications, security, and support. Current core
              providers include Clerk, Vercel, Supabase, Stripe, and PostHog.
              They process information under their own terms and our
              instructions where applicable.
            </li>
            <li>
              <strong>Legal and safety recipients:</strong> authorities,
              advisers, or affected parties when we reasonably believe
              disclosure is necessary to comply with law, protect rights or
              safety, investigate abuse, or enforce agreements.
            </li>
            <li>
              <strong>Business transaction recipients:</strong> advisers and a
              successor in connection with a financing, merger, acquisition,
              reorganization, or sale, subject to appropriate safeguards.
            </li>
          </ul>
          <p>
            Public creator profiles, campaign listings, and resources are
            visible to anyone and may be indexed by search engines. Do not
            publish confidential information in a public field. SignalMatch does
            not sell personal information for money. Some advertising or
            analytics disclosures may be treated as a “sale,” “sharing,” or
            targeted advertising under certain laws; applicable choices will be
            provided when those technologies are enabled.
          </p>

          <h2>Retention</h2>
          <p>
            We retain personal information for as long as reasonably needed to
            provide the service, maintain security and audit records, administer
            payments and disputes, meet tax, accounting, and legal duties, and
            enforce agreements. Retention depends on the record: temporary
            analyzer input and technical logs may be short-lived, while funding,
            payout, approval, and compliance records may need to remain longer.
            We delete or de-identify information when it is no longer needed,
            subject to backups and legal holds.
          </p>

          <h2>Security</h2>
          <p>
            We use administrative, technical, and organizational safeguards
            intended to protect information, including access controls, managed
            authentication and payment providers, transport encryption, and
            event identifiers designed to prevent duplicate processing. No
            internet service is completely secure. Use a strong account
            credential, protect connected accounts, and contact us promptly if
            you suspect unauthorized access. Do not submit secrets or sensitive
            personal information that a workflow does not require.
          </p>

          <h2>Your choices and rights</h2>
          <p>
            You may update many profile and campaign fields through your
            account, choose whether to accept a partnership, and manage browser
            cookies. Depending on your location, you may have rights to request
            access, correction, deletion, portability, restriction, or
            objection; to opt out of certain sale, sharing, or targeted
            advertising; or to appeal a denied request. We may verify your
            identity and retain records where an exception applies. Authorized
            agents may be required to provide proof of authority.
          </p>
          <p>
            To make a privacy request, email{" "}
            <a href="mailto:msanchezgrice@gmail.com">msanchezgrice@gmail.com</a>
            with “SignalMatch privacy” in the subject. We will not discriminate
            against you for exercising an applicable privacy right.
          </p>

          <h2>Children and international use</h2>
          <p>
            SignalMatch is a business marketplace and is not directed to
            children under 18. Do not create an account or submit personal
            information if you are under 18. The service and its providers may
            process information in countries other than your own, where privacy
            laws may differ. We use legally recognized transfer mechanisms where
            required.
          </p>

          <h2>Changes and contact</h2>
          <p>
            We may update this policy as the marketplace, service providers, or
            legal requirements change. We will change the review date and
            provide additional notice when a material change requires it.
            Questions, complaints, or requests can be sent to{" "}
            <a href="mailto:msanchezgrice@gmail.com">msanchezgrice@gmail.com</a>
            . This policy is intended as a clear operational disclosure and
            should be reviewed by qualified counsel before commercial launch.
          </p>
        </article>
      </div>
    </main>
  );
}
