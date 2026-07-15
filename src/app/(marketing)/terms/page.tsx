import type { Metadata } from "next";
import Link from "next/link";

import { getMarketingMetadata } from "@/lib/marketing-metadata";

import styles from "../resources/editorial.module.css";

export const metadata: Metadata = getMarketingMetadata("/terms");

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav className={styles.nav}>
          <Link className={styles.brand} href="/">
            SignalMatch
          </Link>
          <div className={styles.navLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>

        <article className={styles.legal}>
          <p className={styles.eyebrow}>Marketplace agreement</p>
          <h1>Terms of Service</h1>
          <p>
            These terms govern access to SignalMatch, a marketplace where
            product builders can offer performance-based campaigns and creators
            can earn payouts for eligible, approved conversions. By creating an
            account or using the service, you agree to these terms and the{" "}
            <Link href="/privacy">Privacy Policy</Link>. If you use SignalMatch
            for a company, you represent that you can bind that company.
          </p>
          <p>
            <strong>Effective and last reviewed:</strong> July 15, 2026. These
            terms are a launch draft and should receive qualified legal review
            before SignalMatch accepts commercial transactions.
          </p>

          <h2>Eligibility and accounts</h2>
          <p>
            You must be at least 18, legally able to enter a contract, and
            permitted to use the service where you live. Provide accurate
            information, keep credentials secure, and promptly update account
            and payment details. You are responsible for activity under your
            account and for users you authorize. Notify us at
            <a href="mailto:msanchezgrice@gmail.com">
              {" "}
              msanchezgrice@gmail.com
            </a>{" "}
            if you suspect unauthorized access.
          </p>
          <p>
            SignalMatch may require identity, business, tax, sanctions, fraud,
            or payment verification. Our authentication and payment service
            providers may impose additional terms. We may refuse or limit an
            account when verification is incomplete or when access would create
            legal, security, financial, or marketplace risk.
          </p>

          <h2>Roles and marketplace relationship</h2>
          <p>
            A <strong>builder</strong> lists a product, creates and funds
            campaigns, invites or accepts creators, defines an eligible
            conversion, and reviews results. A <strong>creator</strong>{" "}
            maintains a truthful profile, chooses whether to accept a campaign,
            produces independent content, follows disclosure and campaign
            requirements, and may earn a payout for approved conversions.
          </p>
          <p>
            Builders and creators are independent parties, not employees,
            agents, partners, or representatives of SignalMatch or one another.
            SignalMatch provides marketplace, attribution, workflow, and payment
            administration tools. Unless expressly stated, SignalMatch does not
            endorse a user or guarantee a product, creator, campaign, audience,
            conversion volume, approval, earnings, or business result.
          </p>

          <h2>Campaign terms</h2>
          <p>
            Before inviting or accepting a creator, each campaign should clearly
            state:
          </p>
          <ul>
            <li>
              the product, intended audience, content expectations, and
              prohibited claims or channels;
            </li>
            <li>
              the exact conversion event, eligibility criteria, attribution
              window, and source of truth;
            </li>
            <li>
              the CPA payout, currency, campaign budget, cap, funding status,
              and any payment prerequisites;
            </li>
            <li>
              the approval method, review deadline, rejection reasons, reversal
              window, and dispute process;
            </li>
            <li>
              required sponsorship disclosures, evidence boundaries, and
              applicable platform policies;
            </li>
            <li>
              ownership and permitted use of content, including whether paid
              reuse requires separate permission.
            </li>
          </ul>
          <p>
            Accepting an invitation forms a direct campaign agreement between
            the builder and creator that includes these terms and the displayed
            campaign terms. If campaign terms conflict with these service terms,
            these service terms govern use of SignalMatch, while the more
            specific lawful campaign term governs the builder-creator commercial
            obligation. A party should not change a material campaign term
            retroactively.
          </p>

          <h2>Conversions, attribution, and approval</h2>
          <p>
            An event is payable only if it satisfies the campaign&apos;s
            eligible conversion definition, arrives through the supported
            attribution workflow, and is approved under the stated policy.
            Referral and idempotency identifiers help create a reviewable record
            but cannot guarantee attribution across every device, channel, or
            customer journey. The campaign terms should explain treatment of
            multiple touchpoints, existing users, duplicates, test activity,
            events outside the window, refunds, and fraud.
          </p>
          <p>
            Builders must report conversion events accurately, use stable
            external identifiers, avoid unnecessary personal information, review
            pending events within the displayed period, and provide a meaningful
            reason for rejection or reversal. Creators must not fabricate,
            duplicate, purchase, conceal, or manipulate events. SignalMatch may
            hold an event for security or integrity review and may correct a
            status when records show a processing error, subject to applicable
            law and the campaign agreement.
          </p>

          <h2>Funding, payouts, fees, refunds, and reversals</h2>
          <p>
            Builders must fund sufficient campaign budget before SignalMatch
            treats a campaign as funded. Payment processing is provided by
            Stripe or another identified provider. Provider processing times,
            identity checks, account restrictions, fees, reserves, and supported
            countries may affect funding and payout. SignalMatch will display
            applicable marketplace fees before charging them when fees are
            introduced.
          </p>
          <p>
            A creator earns the displayed amount when an eligible conversion is
            approved and any stated payout prerequisites are satisfied. Transfer
            timing may depend on the approval policy, reversal period,
            payment-provider availability, and creator onboarding. A database
            status or notification is not a bank guarantee; provider records
            determine whether a transfer settled.
          </p>
          <p>
            Campaign funding is not a purchase of guaranteed conversions. Unused
            builder funds may be eligible for refund according to the displayed
            funding flow, provider limitations, outstanding approved amounts,
            chargebacks, fees, and applicable law. Approved conversions may be
            reversed only under the written campaign policy, such as a timely
            refund, duplicate, ineligible customer, confirmed abuse, or
            processing error. A builder may not reverse a valid result merely
            because a campaign underperformed overall.
          </p>

          <h2>Creator content and disclosures</h2>
          <p>
            Creators retain ownership of their original content except for
            rights expressly granted in a campaign agreement. A standard
            campaign does not automatically grant perpetual, editable,
            sublicensable, or paid advertising rights. Builders retain their
            product names, trademarks, documentation, and supplied assets and
            grant creators a limited right to use them for an accepted campaign.
          </p>
          <p>
            Creators must disclose material connections clearly and
            conspicuously, make truthful claims grounded in actual experience,
            and follow applicable endorsement, advertising, platform,
            intellectual-property, and privacy rules. Builders must not require
            a positive opinion, fabricated testimonial, hidden sponsorship,
            unsupported performance claim, or omission of a material limitation.
            Both parties should preserve the final publication and disclosure
            evidence.
          </p>

          <h2>Prohibited conduct</h2>
          <p>You may not use SignalMatch to:</p>
          <ul>
            <li>
              break the law, sanctions, platform rules, or another person&apos;s
              rights;
            </li>
            <li>
              submit false profiles, campaigns, metrics, conversions, claims,
              reviews, or payment information;
            </li>
            <li>
              generate self-referrals, automated signups, duplicate events,
              incentivized actions, or prohibited traffic;
            </li>
            <li>
              evade attribution, approval, campaign limits, security controls,
              suspension, or payment obligations;
            </li>
            <li>
              scrape, probe, reverse engineer, overload, disrupt, or introduce
              malicious code into the service;
            </li>
            <li>
              collect or transmit passwords, payment credentials, government
              identifiers, health data, or other unnecessary sensitive
              information;
            </li>
            <li>
              harass, discriminate, impersonate, deceive, or publish unlawful,
              infringing, or harmful content;
            </li>
            <li>
              use another participant&apos;s confidential information outside
              the accepted campaign.
            </li>
          </ul>

          <h2>Taxes, records, and compliance</h2>
          <p>
            Each user is responsible for taxes, registrations, disclosures,
            permits, and records applicable to their business and payments.
            SignalMatch or a payment provider may collect tax information,
            report payments, or withhold amounts when required. Marketplace
            guidance and resources are educational and are not legal, tax,
            accounting, advertising, financial, or regulatory advice.
          </p>

          <h2>Disputes between users</h2>
          <p>
            First use the campaign evidence and contact the other party in good
            faith. A dispute notice should name the campaign and event, identify
            the challenged decision, and provide non-sensitive supporting
            records. SignalMatch may facilitate review of its own logs or
            payment status but is not required to decide every underlying
            commercial, content, or customer disagreement. We may hold a
            disputed amount when reasonably necessary and permitted, but we do
            not guarantee recovery from another user.
          </p>

          <h2>Suspension and termination</h2>
          <p>
            You may stop using SignalMatch and request account closure, subject
            to pending campaigns, payouts, disputes, legal holds, and required
            records. We may suspend or terminate access, pause a campaign, hold
            a transaction for review, or remove content when we reasonably
            believe there is fraud, abuse, security risk, nonpayment, legal
            exposure, repeated policy violations, or harm to marketplace
            participants. Where appropriate, we will provide notice and an
            opportunity to appeal.
          </p>
          <p>
            Termination does not erase obligations already incurred. Payment,
            intellectual-property, confidentiality, dispute, disclaimer,
            limitation, and record-retention provisions survive as needed to
            give them effect.
          </p>

          <h2>Service changes and availability</h2>
          <p>
            SignalMatch is an evolving service. We may add, remove, or change
            features and may perform maintenance. We aim to communicate material
            changes and protect pending commercial records, but we do not
            promise uninterrupted or error-free operation. Preview, beta,
            analyzer, recommendation, and matching features may be incomplete
            and should be independently reviewed before consequential use.
          </p>

          <h2>Disclaimer and limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, SignalMatch and its
            resources are provided “as is” and “as available.” We disclaim
            implied warranties of merchantability, fitness for a particular
            purpose, non-infringement, and any warranty arising from course of
            dealing. We do not guarantee participants, content, attribution,
            conversions, approvals, payouts, earnings, compliance, or results.
            Some jurisdictions do not allow certain disclaimers, so they may not
            apply to you.
          </p>
          <p>
            To the maximum extent permitted by law, SignalMatch will not be
            liable for indirect, incidental, special, consequential, exemplary,
            or punitive damages, or for lost profits, revenue, data, goodwill,
            opportunities, or business interruption arising from the service or
            another user. Any monetary cap and mandatory consumer rights should
            be finalized with counsel for the operating entity and governing
            jurisdiction before commercial launch.
          </p>

          <h2>Changes and contact</h2>
          <p>
            We may update these terms. We will change the review date and
            provide additional notice when required for a material change.
            Continued use after the effective date means you accept the updated
            terms to the extent permitted by law. Questions, notices, and
            support requests may be sent to{" "}
            <a href="mailto:msanchezgrice@gmail.com">msanchezgrice@gmail.com</a>
            . A final legal entity name, business address, governing-law
            provision, and dispute forum must be added after counsel confirms
            the operating structure.
          </p>
        </article>
      </div>
    </main>
  );
}
