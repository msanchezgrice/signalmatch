"use client";

import Link from "next/link";
import { useEffect } from "react";

import styles from "./landing-exact.module.css";

const steps = [
  {
    num: "STEP 01",
    icon: "🎯",
    title: "Define success",
    desc: "Choose signup or activation as your conversion event, set your CPA rate, and cap your total campaign budget before anything goes live.",
  },
  {
    num: "STEP 02",
    icon: "🔍",
    title: "Invite aligned creators",
    desc: "Filter by niche, audience tags, and channel quality metrics to recruit creators whose audiences match your ideal customer profile.",
  },
  {
    num: "STEP 03",
    icon: "📡",
    title: "Track every conversion",
    desc: "Referral codes and idempotent conversion events ensure every approved user has a clear, auditable source.",
  },
  {
    num: "STEP 04",
    icon: "💸",
    title: "Pay only for outcomes",
    desc: "Review each conversion manually or auto-approve. Payouts release from your funded budget only after you greenlight the result.",
  },
];

const whyCards = [
  {
    icon: "🔗",
    title: "Clean attribution, always",
    desc: "Referral codes combined with a conversion API make attribution airtight. Every payout has a clear conversion event behind it.",
  },
  {
    icon: "🛡️",
    title: "Full quality control",
    desc: "Enable manual approvals when you need tighter oversight, or switch to auto-approve as you build trust with top-performing creators.",
  },
  {
    icon: "💰",
    title: "Outcomes-first payouts",
    desc: "Your budget is only consumed when you approve a conversion. No vanity metrics, no upfront creator fees, no wasted spend.",
  },
  {
    icon: "⚡",
    title: "Launch in < 1 hour",
    desc: "From account creation to first creator invite, most teams are fully live in under an hour.",
  },
];

const faqs = [
  {
    q: "Do I pay creators before seeing results?",
    a: "No. Your campaign budget is only consumed when you approve a conversion.",
  },
  {
    q: "Can I review each conversion manually?",
    a: "Yes. Enable manual approval mode on any campaign for tighter quality control.",
  },
  {
    q: "How quickly can we launch?",
    a: "Most teams can set up their account, configure a campaign, and send creator invites in under one hour.",
  },
  {
    q: "How does attribution work?",
    a: "Each creator gets a unique referral code. Conversion events are matched idempotently through the API.",
  },
  {
    q: "What counts as a conversion?",
    a: "You define it: signup, activation, or a meaningful in-product action. You set CPA before launch.",
  },
  {
    q: "Can creators join on their own?",
    a: "Yes. Creators can apply independently and browse open campaigns.",
  },
];

export default function HomePage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    const nodes = document.querySelectorAll('[data-fade="up"]');
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.navLogoMark}>SM</div>
          SignalMatch
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <a href="#how-it-works">How it works</a>
          </li>
          <li>
            <a href="#why">Why builders use it</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
        <div className={styles.navCta}>
          <Link href="/creators" className={`${styles.btn} ${styles.btnGhost}`}>
            For creators
          </Link>
          <Link href="/builders/sign-up" className={`${styles.btn} ${styles.btnPrimary}`}>
            Find creators →
          </Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroBadge}>Builder-first marketplace · CPA-based growth</div>
        <h1 className={styles.heroTitle}>
          Find users for
          <br />
          your product with
          <br />
          trusted creators.
        </h1>
        <p className={styles.heroSub}>
          Launch creator partnerships with CPA terms, reliable attribution, and quality controls built for growth teams.
          Pay only for real conversions.
        </p>

        <div className={styles.heroCta}>
          <Link href="/builders/sign-up" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
            Find creators now
            <svg className={styles.arrow} viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7h12M8 3l5 4-5 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link href="/explore/creators" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
            Explore creator directory
          </Link>
        </div>

        <div className={styles.heroSocialProof}>
          <div className={styles.avatars}>
            <div className={styles.avatar}>JM</div>
            <div className={styles.avatar}>SK</div>
            <div className={styles.avatar}>AL</div>
            <div className={styles.avatar}>PR</div>
          </div>
          <span>Trusted by 200+ growth teams shipping with creator CPA</span>
        </div>

        <div className={styles.exampleSection}>
          <div className={styles.exampleLabel}>Example campaigns live on SignalMatch</div>
          <div className={styles.exampleTable}>
            <div className={styles.exampleTableHead}>
              <span>Product</span>
              <span className={styles.exampleAudienceCol}>Target audience</span>
              <span>CPA</span>
            </div>
            <div className={styles.exampleRow}>
              <div>
                <div className={styles.exampleProduct}>AI Note Assistant</div>
                <div className={styles.exampleEvent}>Signup + first workflow created</div>
              </div>
              <div className={`${styles.exampleAudience} ${styles.exampleAudienceCol}`}>Startup operators & founders</div>
              <div>
                <span className={styles.cpaPill}>$8.00</span>
              </div>
            </div>
            <div className={styles.exampleRow}>
              <div>
                <div className={styles.exampleProduct}>Sales Call Copilot</div>
                <div className={styles.exampleEvent}>Trial activated with CRM connected</div>
              </div>
              <div className={`${styles.exampleAudience} ${styles.exampleAudienceCol}`}>Sales creators & RevOps</div>
              <div>
                <span className={styles.cpaPill}>$15.00</span>
              </div>
            </div>
            <div className={styles.exampleRow}>
              <div>
                <div className={styles.exampleProduct}>Support QA Agent</div>
                <div className={styles.exampleEvent}>Activation after first QA report</div>
              </div>
              <div className={`${styles.exampleAudience} ${styles.exampleAudienceCol}`}>CX & support leaders</div>
              <div>
                <span className={styles.cpaPill}>$11.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.gradientDivider} />

      <section className={styles.section} id="how-it-works">
        <div className={styles.container}>
          <div className={`${styles.stepsHeader} ${styles.fadeUp}`} data-fade="up">
            <div className={styles.sectionLabel}>How it works</div>
            <h2 className={styles.sectionTitle}>
              Launch your first campaign
              <br />
              in under an hour
            </h2>
            <p className={styles.sectionSub}>Four steps from setup to your first verified conversion.</p>
          </div>
          <div className={`${styles.stepsGrid} ${styles.fadeUp}`} data-fade="up">
            {steps.map((step) => (
              <div key={step.title} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.gradientDivider} />

      <section className={styles.section} id="why">
        <div className={styles.container}>
          <div className={styles.fadeUp} data-fade="up">
            <div className={styles.sectionLabel}>Why builders use SignalMatch</div>
            <h2 className={styles.sectionTitle}>
              Built for growth teams
              <br />
              who hate wasted spend
            </h2>
            <p className={styles.sectionSub} style={{ marginBottom: "3rem" }}>
              Every feature exists to give builders more signal and less noise.
            </p>
          </div>

          <div className={styles.whyGrid}>
            <div className={`${styles.whyCard} ${styles.featured} ${styles.fadeUp}`} data-fade="up">
              <div>
                <div className={styles.whyCardIcon}>🧠</div>
                <div className={styles.whyCardTitle}>Qualified creator profiles</div>
                <p className={styles.whyCardDesc}>
                  Every creator profile includes verified niches, audience demographic tags, and channel performance data.
                  You are choosing with confidence.
                </p>
              </div>
              <div className={styles.featuredVisual}>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Creator match score</span>
                  <span className={styles.miniStatValue}>94%</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Avg. conversion quality</span>
                  <span className={styles.miniStatValue}>High</span>
                </div>
                <div className={styles.miniStat}>
                  <span className={styles.miniStatLabel}>Attribution confidence</span>
                  <span className={styles.miniStatValue}>100%</span>
                </div>
              </div>
            </div>

            {whyCards.map((card) => (
              <div key={card.title} className={`${styles.whyCard} ${styles.fadeUp}`} data-fade="up">
                <div className={styles.whyCardIcon}>{card.icon}</div>
                <div className={styles.whyCardTitle}>{card.title}</div>
                <p className={styles.whyCardDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.gradientDivider} />

      <section className={`${styles.section} ${styles.faqSection}`} id="faq">
        <div className={styles.container}>
          <div className={styles.fadeUp} data-fade="up" style={{ textAlign: "center" }}>
            <div className={styles.sectionLabel}>FAQ</div>
            <h2 className={styles.sectionTitle}>Common questions</h2>
          </div>
          <div className={styles.faqGrid}>
            {faqs.map((faq) => (
              <div key={faq.q} className={`${styles.faqItem} ${styles.fadeUp}`} data-fade="up">
                <div className={styles.faqQ}>{faq.q}</div>
                <p className={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.dualCta}>
        <div className={styles.container}>
          <div className={styles.fadeUp} data-fade="up">
            <div className={styles.sectionLabel}>Get started today</div>
            <h2 className={styles.sectionTitle}>For builders. For creators.</h2>
            <p className={styles.sectionSub} style={{ margin: "0 auto" }}>
              Join a growing marketplace where products and creators grow together.
            </p>
          </div>
          <div className={`${styles.dualCtaGrid} ${styles.fadeUp}`} data-fade="up">
            <div className={`${styles.ctaCard} ${styles.primaryCard}`}>
              <div className={styles.ctaCardEmoji}>🚀</div>
              <div className={styles.ctaCardTitle}>I&apos;m a builder</div>
              <p className={styles.ctaCardDesc}>
                Set up a CPA campaign, find aligned creators, and start getting quality users.
              </p>
              <Link href="/builders/sign-up" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`} style={{ width: "100%", justifyContent: "center" }}>
                Start as a builder →
              </Link>
            </div>
            <div className={styles.ctaCard}>
              <div className={styles.ctaCardEmoji}>🎙️</div>
              <div className={styles.ctaCardTitle}>I&apos;m a creator</div>
              <p className={styles.ctaCardDesc}>
                Browse open campaigns and get paid per verified conversion you drive.
              </p>
              <Link href="/creators" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`} style={{ width: "100%", justifyContent: "center", color: "var(--text)" }}>
                Join as a creator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link href="/" className={styles.navLogo}>
            <div className={styles.navLogoMark}>SM</div>
            SignalMatch
          </Link>
          <span>© {new Date().getFullYear()} SignalMatch. Builder-first creator marketplace.</span>
          <div className={styles.footerLinks}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
