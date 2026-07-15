import Link from "next/link";
import Image from "next/image";
import {
  BadgeDollarSign,
  BrainCircuit,
  CircleDollarSign,
  Link2,
  Mic2,
  RadioTower,
  Rocket,
  SearchCheck,
  Settings2,
  ShieldCheck,
  Target,
} from "lucide-react";

import styles from "./landing-exact.module.css";

const steps = [
  {
    num: "STEP 01",
    icon: Target,
    title: "Define success",
    desc: "Choose signup or activation as your conversion event, set your CPA rate, and cap your total campaign budget before anything goes live.",
  },
  {
    num: "STEP 02",
    icon: SearchCheck,
    title: "Invite aligned creators",
    desc: "Filter by niche, audience tags, and channel quality metrics to recruit creators whose audiences match your ideal customer profile.",
  },
  {
    num: "STEP 03",
    icon: RadioTower,
    title: "Track every conversion",
    desc: "Referral codes and idempotent conversion events ensure every approved user has a clear, auditable source.",
  },
  {
    num: "STEP 04",
    icon: CircleDollarSign,
    title: "Pay only for outcomes",
    desc: "Review each conversion manually or auto-approve. Payouts release from your funded budget only after you greenlight the result.",
  },
];

const whyCards = [
  {
    icon: Link2,
    title: "Reviewable attribution",
    desc: "Referral codes and idempotent conversion events create a shared evidence trail. They reduce duplicate credit but do not make every attribution question disappear.",
  },
  {
    icon: ShieldCheck,
    title: "Full quality control",
    desc: "Enable manual approvals when you need tighter oversight, or switch to auto-approve as you build trust with top-performing creators.",
  },
  {
    icon: BadgeDollarSign,
    title: "Outcomes-first payouts",
    desc: "Your budget is only consumed when you approve a conversion. No vanity metrics, no upfront creator fees, no wasted spend.",
  },
  {
    icon: Settings2,
    title: "Guided campaign setup",
    desc: "Define the event, CPA, budget, attribution window, approval policy, and creator evidence before sending the first invite.",
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
    a: "Timing depends on event instrumentation, terms, funding, approval policy, and creator review. Complete those checks before sending an invite.",
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
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <nav className={styles.nav} aria-label="Primary navigation">
        <Link href="/" className={styles.navLogo}>
          <Image src="/brand/signalmatch-mark.png" alt="" width={28} height={28} priority />
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
          <li>
            <Link href="/resources">Resources</Link>
          </li>
        </ul>
        <div className={styles.navCta}>
          <Link href="/creators" className={`${styles.btn} ${styles.btnGhost}`}>
            For creators
          </Link>
          <Link
            href="/builders/sign-up"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Find creators →
          </Link>
        </div>
      </nav>

      <main id="main-content">
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            Builder-first marketplace · CPA-based growth
          </div>
          <h1 className={styles.heroTitle}>
            Find users for
            <br />
            your product with
            <br />
            <span>trusted creators.</span>
          </h1>
          <p className={styles.heroSub}>
            Launch creator partnerships with CPA terms, reliable attribution,
            and quality controls built for growth teams. Pay only for real
            conversions.
          </p>

          <div className={styles.heroCta}>
            <Link
              href="/builders/sign-up"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}
            >
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
            <Link
              href="/explore/creators"
              className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}
            >
              Explore creator directory
            </Link>
          </div>

          <div className={styles.heroSocialProof}>
            <span className={styles.signalStatus} aria-hidden="true" />
            <span>
              Public beta: directory and campaign availability changes as
              verified participants join
            </span>
          </div>

          <div
            className={styles.signalPanel}
            aria-label="SignalMatch attribution path"
          >
            <div className={styles.signalPanelHeader}>
              <span>One evidence trail</span>
              <span>From recommendation to payout</span>
            </div>
            <div className={styles.signalTrack}>
              <div className={styles.signalNode}>
                <span className={styles.signalNodeIndex}>01</span>
                <strong>Referral click</strong>
                <small>Creator code attached</small>
              </div>
              <span className={styles.signalConnector} aria-hidden="true" />
              <div className={styles.signalNode}>
                <span className={styles.signalNodeIndex}>02</span>
                <strong>Conversion event</strong>
                <small>Idempotent event received</small>
              </div>
              <span className={styles.signalConnector} aria-hidden="true" />
              <div className={styles.signalNode}>
                <span className={styles.signalNodeIndex}>03</span>
                <strong>Builder review</strong>
                <small>Outcome approved</small>
              </div>
              <span className={styles.signalConnector} aria-hidden="true" />
              <div className={styles.signalNode}>
                <span className={styles.signalNodeIndex}>04</span>
                <strong>Payout release</strong>
                <small>Creator gets paid</small>
              </div>
            </div>
          </div>

          <div className={styles.exampleSection}>
            <div className={styles.exampleLabel}>
              Illustrative campaign structures — not live performance claims
            </div>
            <div className={styles.exampleTable}>
              <div className={styles.exampleTableHead}>
                <span>Product</span>
                <span className={styles.exampleAudienceCol}>
                  Target audience
                </span>
                <span>CPA</span>
              </div>
              <div className={styles.exampleRow}>
                <div>
                  <div className={styles.exampleProduct}>AI Note Assistant</div>
                  <div className={styles.exampleEvent}>
                    Signup + first workflow created
                  </div>
                </div>
                <div
                  className={`${styles.exampleAudience} ${styles.exampleAudienceCol}`}
                >
                  Startup operators & founders
                </div>
                <div>
                  <span className={styles.cpaPill}>$8.00</span>
                </div>
              </div>
              <div className={styles.exampleRow}>
                <div>
                  <div className={styles.exampleProduct}>
                    Sales Call Copilot
                  </div>
                  <div className={styles.exampleEvent}>
                    Trial activated with CRM connected
                  </div>
                </div>
                <div
                  className={`${styles.exampleAudience} ${styles.exampleAudienceCol}`}
                >
                  Sales creators & RevOps
                </div>
                <div>
                  <span className={styles.cpaPill}>$15.00</span>
                </div>
              </div>
              <div className={styles.exampleRow}>
                <div>
                  <div className={styles.exampleProduct}>Support QA Agent</div>
                  <div className={styles.exampleEvent}>
                    Activation after first QA report
                  </div>
                </div>
                <div
                  className={`${styles.exampleAudience} ${styles.exampleAudienceCol}`}
                >
                  CX & support leaders
                </div>
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
            <div
              className={`${styles.stepsHeader} ${styles.fadeUp}`}
              data-fade="up"
            >
              <div className={styles.sectionLabel}>How it works</div>
              <h2 className={styles.sectionTitle}>
                Launch a clearly scoped campaign
                <br />
                with a reviewable conversion event
              </h2>
              <p className={styles.sectionSub}>
                Four steps from setup to your first verified conversion.
              </p>
            </div>
            <div
              className={`${styles.stepsGrid} ${styles.fadeUp}`}
              data-fade="up"
            >
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className={styles.stepCard}>
                    <div className={styles.stepNum}>{step.num}</div>
                    <Icon className={styles.stepIcon} aria-hidden="true" />
                    <div className={styles.stepTitle}>{step.title}</div>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className={styles.gradientDivider} />

        <section className={styles.section} id="why">
          <div className={styles.container}>
            <div className={styles.fadeUp} data-fade="up">
              <div className={styles.sectionLabel}>
                Why builders use SignalMatch
              </div>
              <h2 className={styles.sectionTitle}>
                Built for growth teams
                <br />
                who hate wasted spend
              </h2>
              <p className={styles.sectionSub} style={{ marginBottom: "3rem" }}>
                Every feature exists to give builders more signal and less
                noise.
              </p>
            </div>

            <div className={styles.whyGrid}>
              <div
                className={`${styles.whyCard} ${styles.featured} ${styles.fadeUp}`}
                data-fade="up"
              >
                <div>
                  <BrainCircuit
                    className={styles.whyCardIcon}
                    aria-hidden="true"
                  />
                  <div className={styles.whyCardTitle}>
                    Creator profiles with explicit evidence fields
                  </div>
                  <p className={styles.whyCardDesc}>
                    Profiles can include niches, audience tags, and
                    participant-provided channel evidence. Builders should
                    verify fit before inviting or funding a campaign.
                  </p>
                </div>
                <div className={styles.featuredVisual}>
                  <div className={styles.miniStat}>
                    <span className={styles.miniStatLabel}>
                      Example match rubric
                    </span>
                    <span className={styles.miniStatValue}>Illustrative</span>
                  </div>
                  <div className={styles.miniStat}>
                    <span className={styles.miniStatLabel}>
                      Conversion quality
                    </span>
                    <span className={styles.miniStatValue}>
                      Review required
                    </span>
                  </div>
                  <div className={styles.miniStat}>
                    <span className={styles.miniStatLabel}>
                      Attribution confidence
                    </span>
                    <span className={styles.miniStatValue}>Evidence-based</span>
                  </div>
                </div>
              </div>

              {whyCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`${styles.whyCard} ${styles.fadeUp}`}
                    data-fade="up"
                  >
                    <Icon className={styles.whyCardIcon} aria-hidden="true" />
                    <div className={styles.whyCardTitle}>{card.title}</div>
                    <p className={styles.whyCardDesc}>{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className={styles.gradientDivider} />

        <section className={`${styles.section} ${styles.faqSection}`} id="faq">
          <div className={styles.container}>
            <div
              className={styles.fadeUp}
              data-fade="up"
              style={{ textAlign: "center" }}
            >
              <div className={styles.sectionLabel}>FAQ</div>
              <h2 className={styles.sectionTitle}>Common questions</h2>
            </div>
            <div className={styles.faqGrid}>
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className={`${styles.faqItem} ${styles.fadeUp}`}
                  data-fade="up"
                >
                  <summary className={styles.faqQ}>{faq.q}</summary>
                  <p className={styles.faqA}>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.dualCta}>
          <div className={styles.container}>
            <div className={styles.fadeUp} data-fade="up">
              <div className={styles.sectionLabel}>Get started today</div>
              <h2 className={styles.sectionTitle}>
                For builders. For creators.
              </h2>
              <p className={styles.sectionSub} style={{ margin: "0 auto" }}>
                Join a growing marketplace where products and creators grow
                together.
              </p>
            </div>
            <div
              className={`${styles.dualCtaGrid} ${styles.fadeUp}`}
              data-fade="up"
            >
              <div className={`${styles.ctaCard} ${styles.primaryCard}`}>
                <Rocket className={styles.ctaCardIcon} aria-hidden="true" />
                <div className={styles.ctaCardTitle}>I&apos;m a builder</div>
                <p className={styles.ctaCardDesc}>
                  Set up a CPA campaign, find aligned creators, and start
                  getting quality users.
                </p>
                <Link
                  href="/builders/sign-up"
                  className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Start as a builder →
                </Link>
              </div>
              <div className={styles.ctaCard}>
                <Mic2 className={styles.ctaCardIcon} aria-hidden="true" />
                <div className={styles.ctaCardTitle}>I&apos;m a creator</div>
                <p className={styles.ctaCardDesc}>
                  Browse open campaigns and get paid per verified conversion you
                  drive.
                </p>
                <Link
                  href="/creators"
                  className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    color: "var(--text)",
                  }}
                >
                  Join as a creator →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link href="/" className={styles.navLogo}>
            <Image src="/brand/signalmatch-mark.png" alt="" width={28} height={28} />
            SignalMatch
          </Link>
          <span>
            © {new Date().getFullYear()} SignalMatch. Builder-first creator
            marketplace.
          </span>
          <div className={styles.footerLinks}>
            <Link href="/resources">Resources</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
