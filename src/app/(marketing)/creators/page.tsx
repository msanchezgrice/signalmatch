"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import styles from "./creators-exact.module.css";

type AnalyzerPlatform = "li" | "x";

type AnalyzerResponse = {
  prefill?: {
    audience_tags?: string[];
    niches?: string[];
    tool_stack?: string[];
  };
};

const steps = [
  {
    title: "Create your profile with niches and audience tags",
    desc: "Tell builders who your audience is and what products they respond to.",
  },
  {
    title: "Connect channel stats so builders can evaluate fit",
    desc: "Link YouTube, newsletter, LinkedIn, or X stats for quality-based matching.",
  },
  {
    title: "Accept partnerships with clear CPA terms",
    desc: "Every campaign shows exactly what the conversion event is and what you earn.",
  },
  {
    title: "Share your referral links and drive high-intent actions",
    desc: "Use your unique campaign link across posts, video, or newsletter content.",
  },
  {
    title: "Receive payouts on approved conversions",
    desc: "Approved conversions are queued automatically from pre-funded campaign budgets.",
  },
];

const perks = [
  {
    icon: "🎯",
    title: "Products worth promoting",
    desc: "Every campaign is run by a product team with a real CPA and clear conversion terms.",
  },
  {
    icon: "🔍",
    title: "Full conversion visibility",
    desc: "See clicks, conversions, and payouts in your dashboard with no black-box reporting.",
  },
  {
    icon: "⚡",
    title: "Fast, reliable payouts",
    desc: "Once approved, payouts queue quickly from pre-funded campaign budgets.",
  },
  {
    icon: "🤝",
    title: "Direct builder relationships",
    desc: "Builders invite creators based on audience fit for long-term partnerships.",
  },
  {
    icon: "📊",
    title: "Performance insights",
    desc: "Track what content drives outcomes and iterate based on conversion data.",
  },
  {
    icon: "🆓",
    title: "Always free for creators",
    desc: "No subscription and no commission cut from creator earnings.",
  },
];

const faqs = [
  {
    q: "Do I need a minimum follower count?",
    a: "No. Audience quality and niche relevance matter more than raw follower volume.",
  },
  {
    q: "How do I get paid?",
    a: "Approved conversions queue payouts automatically from the builder's funded budget.",
  },
  {
    q: "Can I promote multiple campaigns at once?",
    a: "Yes. You can run multiple campaigns at the same time when audience fit is strong.",
  },
  {
    q: "What if a builder rejects my conversion?",
    a: "You will see the rejection reason in your dashboard when manual approvals are enabled.",
  },
  {
    q: "How does attribution work?",
    a: "Every campaign gives you a unique referral link tied to idempotent conversion events.",
  },
  {
    q: "Is there a fee to join?",
    a: "No. Joining SignalMatch as a creator is free.",
  },
];

export default function CreatorsPage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<AnalyzerPlatform>("li");
  const [profileInput, setProfileInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzerResponse["prefill"] | null>(null);

  const [reach, setReach] = useState(5000);
  const [convRate, setConvRate] = useState(2);
  const [cpa, setCpa] = useState(11);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    const nodes = document.querySelectorAll('[data-fade="up"]');
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  const placeholder =
    platform === "li" ? "linkedin.com/in/yourname or @yourhandle" : "@yourhandle or x.com/yourname";

  const conversions = useMemo(() => Math.round(reach * (convRate / 100)), [reach, convRate]);
  const earnings = useMemo(() => Math.round(conversions * cpa), [conversions, cpa]);

  const suggested = useMemo(() => {
    const audienceLabel = analysis?.audience_tags?.[0]?.replaceAll("-", " ") ?? "your audience";
    const nicheLabel = analysis?.niches?.[0]?.replaceAll("-", " ") ?? "operators";
    const stackLabel = analysis?.tool_stack?.[0] ?? "technical readers";

    return [
      { text: `Sales Call Copilot — perfect for ${audienceLabel}`, cpaLabel: "$15/conv" },
      { text: `AI Note Assistant — matches your ${nicheLabel} followers`, cpaLabel: "$8/conv" },
      { text: `Dev Docs AI — strong overlap with ${stackLabel}`, cpaLabel: "$12/conv" },
    ];
  }, [analysis]);

  async function runAnalyze() {
    const value = profileInput.trim();
    if (!value) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/public/creator-profile-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: value,
          platform: platform === "li" ? "linkedin" : "x",
        }),
      });
      const json = (await res.json()) as AnalyzerResponse & { ok?: boolean; error?: string };

      if (!res.ok || !json?.prefill) {
        throw new Error(json?.error || "Could not analyze profile");
      }

      setAnalysis(json.prefill);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not analyze profile");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleJoin() {
    router.push("/creators/sign-up");
  }

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
            <a href="#earnings">Earnings</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
        <div className={styles.navCta}>
          <Link href="/" className={`${styles.btn} ${styles.btnGhost}`}>
            For builders
          </Link>
          <button className={`${styles.btn} ${styles.btnCreator}`} onClick={handleJoin}>
            Create creator account →
          </button>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroEyebrow}>
          <div className={styles.heroEyebrowDot} />
          For creators
        </div>

        <h1 className={styles.heroTitle}>
          Make money sharing
          <br />
          products you love.
        </h1>

        <p className={styles.heroSub}>
          Partner with products you already trust, share them with your followers, and get paid for approved
          outcomes.
        </p>

        <div className={styles.heroCta}>
          <button className={`${styles.btn} ${styles.btnCreator} ${styles.btnLg}`} onClick={handleJoin}>
            Create creator account
          </button>
          <Link href="/explore/campaigns" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
            Browse campaigns
          </Link>
        </div>

        <div className={styles.heroTrust}>
          <div className={styles.heroTrustItem}>Free to join</div>
          <div className={styles.heroTrustItem}>No followers minimum</div>
          <div className={styles.heroTrustItem}>Pay on approved outcomes only</div>
        </div>

        <div className={styles.analyzerSection}>
          <div className={styles.analyzerLabel}>Find your niche, get started</div>
          <div className={styles.analyzerCard}>
            <div className={styles.analyzerHeader}>
              <div className={styles.analyzerTitle}>Get tailored campaign ideas</div>
              <p className={styles.analyzerDesc}>
                Drop your LinkedIn or X profile and we&apos;ll suggest campaigns you can genuinely promote.
              </p>
              <div className={styles.analyzerTabs}>
                <button
                  className={`${styles.analyzerTab} ${platform === "li" ? styles.analyzerTabActive : ""}`}
                  onClick={() => setPlatform("li")}
                  type="button"
                >
                  💼 LinkedIn
                </button>
                <button
                  className={`${styles.analyzerTab} ${platform === "x" ? styles.analyzerTabActive : ""}`}
                  onClick={() => setPlatform("x")}
                  type="button"
                >
                  𝕏 X (Twitter)
                </button>
              </div>
            </div>
            <div className={styles.analyzerBody}>
              <div className={styles.analyzerInputRow}>
                <input
                  className={styles.analyzerInput}
                  type="text"
                  value={profileInput}
                  onChange={(event) => setProfileInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void runAnalyze();
                    }
                  }}
                  placeholder={placeholder}
                />
                <button className={styles.analyzeBtn} type="button" onClick={runAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Analyze profile →"}
                </button>
              </div>
              <p className={styles.analyzerHint}>Paste a full URL, www... link, or just a handle like @yourname</p>

              {analysis ? (
                <div className={styles.analyzerResult}>
                  <div className={styles.resultLabel}>Suggested campaigns for your audience</div>
                  {suggested.map((item) => (
                    <div key={item.text} className={styles.resultRow}>
                      <div className={styles.resultDot} />
                      <div className={styles.resultText}>{item.text}</div>
                      <div className={styles.resultCpa}>{item.cpaLabel}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.gradientDivider} />

      <section className={styles.section} id="how-it-works">
        <div className={styles.container}>
          <div className={`${styles.stepsHeader} ${styles.fadeUp}`} data-fade="up">
            <div className={styles.sectionLabel}>How it works</div>
            <h2 className={styles.sectionTitle}>Five steps to your first payout</h2>
            <p className={styles.sectionSub}>From profile creation to getting paid, here is exactly how it works.</p>
          </div>

          <div className={`${styles.stepsTimeline} ${styles.fadeUp}`} data-fade="up">
            {steps.map((step, index) => (
              <div key={step.title} className={styles.stepItem}>
                <div className={styles.stepNumCircle}>{index + 1}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.gradientDivider} />

      <section className={`${styles.section} ${styles.perksSection}`} id="campaigns">
        <div className={styles.container}>
          <div className={styles.fadeUp} data-fade="up">
            <div className={styles.sectionLabel}>Why creators choose SignalMatch</div>
            <h2 className={styles.sectionTitle}>
              Performance-based. Transparent.
              <br />
              Built for your growth.
            </h2>
            <p className={styles.sectionSub}>Everything creators need from a partnership program.</p>
          </div>

          <div className={`${styles.perksGrid} ${styles.fadeUp}`} data-fade="up">
            {perks.map((perk) => (
              <div key={perk.title} className={styles.perkCard}>
                <div className={styles.perkIcon}>{perk.icon}</div>
                <div className={styles.perkTitle}>{perk.title}</div>
                <p className={styles.perkDesc}>{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.gradientDivider} />

      <section className={styles.section} id="earnings">
        <div className={styles.container}>
          <div className={styles.fadeUp} data-fade="up" style={{ textAlign: "center" }}>
            <div className={styles.sectionLabel}>Earnings calculator</div>
            <h2 className={styles.sectionTitle}>See what you could earn</h2>
            <p className={styles.sectionSub} style={{ margin: "0 auto" }}>
              Adjust monthly reach, conversion rate, and average CPA.
            </p>
          </div>

          <div className={`${styles.calcBox} ${styles.fadeUp}`} data-fade="up">
            <div className={styles.calcTitle}>Monthly earnings estimate</div>
            <div className={styles.calcRow}>
              <div className={styles.calcInputGroup}>
                <label>Monthly reach</label>
                <input
                  className={styles.calcInput}
                  type="number"
                  min={100}
                  step={500}
                  value={reach}
                  onChange={(event) => setReach(Number(event.target.value) || 0)}
                />
              </div>
              <div className={styles.calcInputGroup}>
                <label>Conv. rate (%)</label>
                <input
                  className={styles.calcInput}
                  type="number"
                  min={0.1}
                  max={20}
                  step={0.5}
                  value={convRate}
                  onChange={(event) => setConvRate(Number(event.target.value) || 0)}
                />
              </div>
              <div className={styles.calcInputGroup}>
                <label>Avg CPA ($)</label>
                <input
                  className={styles.calcInput}
                  type="number"
                  min={1}
                  step={1}
                  value={cpa}
                  onChange={(event) => setCpa(Number(event.target.value) || 0)}
                />
              </div>
            </div>
            <div className={styles.calcResult}>
              <div>
                <div className={styles.calcResultLabel}>Estimated monthly earnings</div>
                <div className={styles.calcResultSub}>Based on {conversions.toLocaleString()} conversions/mo</div>
              </div>
              <div className={styles.calcResultValue}>${earnings.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.gradientDivider} />

      <section className={`${styles.section} ${styles.faqSection}`} id="faq">
        <div className={styles.container}>
          <div className={styles.fadeUp} data-fade="up" style={{ textAlign: "center" }}>
            <div className={styles.sectionLabel}>FAQ</div>
            <h2 className={styles.sectionTitle}>Your questions, answered</h2>
          </div>
          <div className={`${styles.faqGrid} ${styles.fadeUp}`} data-fade="up">
            {faqs.map((faq) => (
              <div key={faq.q} className={styles.faqItem}>
                <div className={styles.faqQ}>{faq.q}</div>
                <p className={styles.faqA}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta} id="join">
        <div className={styles.fadeUp} data-fade="up">
          <h2 className={styles.finalCtaTitle}>
            Ready to get paid for
            <br />
            what you already do?
          </h2>
          <p className={styles.finalCtaSub}>Join creators earning CPA payouts by sharing products their audiences love.</p>
          <div className={styles.finalCtaActions}>
            <button className={`${styles.btn} ${styles.btnCreator} ${styles.btnLg}`} onClick={handleJoin}>
              Create your creator account
            </button>
            <Link href="/explore/campaigns" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
              Browse campaigns first
            </Link>
          </div>
          <div className={styles.finalCtaTrust}>
            <span>Free to join</span>
            <span>No followers minimum</span>
            <span>Payouts within 24h</span>
            <span>No commission cuts</span>
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
