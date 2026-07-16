"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  ClipboardList,
  FileText,
  LinkIcon,
  SlidersHorizontal,
  Target,
  TimerReset,
  WalletCards,
} from "lucide-react";

import { freeTools } from "@/lib/free-tools";

import styles from "./free-tools-workbench.module.css";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const scoreLabels = ["Weak", "Usable", "Strong", "Excellent"] as const;

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function Field({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <div className={styles.inputWrap}>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {suffix ? <em>{suffix}</em> : null}
      </div>
    </label>
  );
}

function ScoreField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.scoreField}>
      <span>{label}</span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <strong>{value}/5</strong>
    </label>
  );
}

function Result({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className={styles.result}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  );
}

export function FreeToolsWorkbench() {
  const [active, setActive] = useState(freeTools[0]?.slug ?? "");

  const [productPrice, setProductPrice] = useState(49);
  const [grossMargin, setGrossMargin] = useState(82);
  const [targetPayback, setTargetPayback] = useState(1);
  const [targetProfit, setTargetProfit] = useState(20);

  const [traffic, setTraffic] = useState(12000);
  const [ctr, setCtr] = useState(2.8);
  const [conversionRate, setConversionRate] = useState(4.5);
  const [approvalRate, setApprovalRate] = useState(84);
  const [campaignCpa, setCampaignCpa] = useState(35);
  const [budget, setBudget] = useState(5000);

  const [creatorViews, setCreatorViews] = useState(25000);
  const [creatorClickRate, setCreatorClickRate] = useState(1.9);
  const [creatorConversionRate, setCreatorConversionRate] = useState(5.2);
  const [creatorApprovalRate, setCreatorApprovalRate] = useState(80);
  const [creatorCpa, setCreatorCpa] = useState(42);
  const [creatorReversalRate, setCreatorReversalRate] = useState(6);

  const [landingUrl, setLandingUrl] = useState("https://signalmatch.me");
  const [creatorCode, setCreatorCode] = useState("CREATOR42");
  const [utmCampaign, setUtmCampaign] = useState("ai-launch");
  const [utmSource, setUtmSource] = useState("youtube");
  const [utmContent, setUtmContent] = useState("product-review");

  const [fitScores, setFitScores] = useState([4, 4, 3, 4, 3, 4]);

  const [considerationDays, setConsiderationDays] = useState(14);
  const [pricePoint, setPricePoint] = useState(99);
  const [salesTouches, setSalesTouches] = useState(2);
  const [refundRisk, setRefundRisk] = useState(8);

  const [briefProduct, setBriefProduct] = useState("SignalMatch");
  const [briefAudience, setBriefAudience] = useState(
    "AI builders and product marketers",
  );
  const [briefConversion, setBriefConversion] = useState(
    "approved builder signup with a verified work email",
  );
  const [briefPayout, setBriefPayout] = useState(40);
  const [briefWindow, setBriefWindow] = useState(30);

  const breakEven = useMemo(() => {
    const marginRevenue = productPrice * (grossMargin / 100) * targetPayback;
    const maxCpa = Math.max(0, marginRevenue - targetProfit);
    return { marginRevenue, maxCpa };
  }, [grossMargin, productPrice, targetPayback, targetProfit]);

  const forecast = useMemo(() => {
    const clicks = traffic * (ctr / 100);
    const conversions = clicks * (conversionRate / 100);
    const approved = conversions * (approvalRate / 100);
    const spend = Math.min(approved * campaignCpa, budget);
    const cappedApproved = campaignCpa > 0 ? spend / campaignCpa : 0;
    const revenue = cappedApproved * productPrice;
    return { clicks, conversions, approved: cappedApproved, spend, revenue };
  }, [
    approvalRate,
    budget,
    campaignCpa,
    conversionRate,
    ctr,
    productPrice,
    traffic,
  ]);

  const earnings = useMemo(() => {
    const clicks = creatorViews * (creatorClickRate / 100);
    const conversions = clicks * (creatorConversionRate / 100);
    const approved = conversions * (creatorApprovalRate / 100);
    const settled = approved * (1 - creatorReversalRate / 100);
    return { clicks, approved, settled, payout: settled * creatorCpa };
  }, [
    creatorApprovalRate,
    creatorClickRate,
    creatorConversionRate,
    creatorCpa,
    creatorReversalRate,
    creatorViews,
  ]);

  const trackingUrl = useMemo(() => {
    try {
      const url = new URL(landingUrl);
      url.searchParams.set("utm_source", utmSource.trim() || "creator");
      url.searchParams.set("utm_medium", "creator");
      url.searchParams.set("utm_campaign", utmCampaign.trim() || "campaign");
      url.searchParams.set("utm_content", utmContent.trim() || "post");
      url.searchParams.set("ref", creatorCode.trim() || "CREATOR");
      return url.toString();
    } catch {
      return "Enter a valid URL to generate a tracking link.";
    }
  }, [creatorCode, landingUrl, utmCampaign, utmContent, utmSource]);

  const fitScore = useMemo(() => {
    const total = fitScores.reduce((sum, value) => sum + value, 0);
    const percent = Math.round((total / 30) * 100);
    const label =
      scoreLabels[
        clampNumber(Math.floor(percent / 25), 0, scoreLabels.length - 1)
      ];
    return { total, percent, label };
  }, [fitScores]);

  const attribution = useMemo(() => {
    const base = considerationDays + salesTouches * 4;
    const priceAdjustment = pricePoint >= 500 ? 14 : pricePoint >= 100 ? 7 : 0;
    const refundAdjustment = refundRisk >= 15 ? -7 : 0;
    const days = clampNumber(base + priceAdjustment + refundAdjustment, 7, 60);
    return {
      days,
      reviewWindow: clampNumber(Math.round(days / 3), 3, 21),
    };
  }, [considerationDays, pricePoint, refundRisk, salesTouches]);

  const brief = useMemo(
    () => `Campaign brief

Product: ${briefProduct}
Audience: ${briefAudience}
Qualified conversion: ${briefConversion}
Creator payout: ${money.format(briefPayout)} per approved conversion
Attribution window: ${briefWindow} days from first click

Creator direction:
- Explain the product from firsthand evaluation.
- Use a clear material-connection disclosure near the recommendation.
- Send traffic through the assigned SignalMatch referral link only.
- Avoid claims about guaranteed income, guaranteed results, medical outcomes, legal outcomes, or unsupported comparisons.

Approval policy:
- Builder reviews pending conversions against the written conversion definition.
- Rejections should name the reason: duplicate, test event, existing customer, outside attribution window, refund, fraud signal, or missing eligibility.
- Valid approved conversions should not be reversed because the campaign underperformed overall.`,
    [briefAudience, briefConversion, briefPayout, briefProduct, briefWindow],
  );

  const checklist = [
    "Campaign has one written qualified conversion definition.",
    "Every conversion sends a stable external event id for idempotency.",
    "Referral code, campaign id, and creator id are captured together.",
    "Approval, rejection, and reversal reasons are visible to both sides.",
    "Builder funding is confirmed before the public listing goes active.",
    "Creator payout onboarding is complete before transfer attempts.",
    "Disclosures and prohibited claims are written in the campaign brief.",
    "Test conversions are excluded from payout reporting.",
  ];

  return (
    <section className={styles.workbench} aria-label="SignalMatch free tools">
      <div className={styles.tabs} role="tablist" aria-label="Free tools">
        {freeTools.map((tool, index) => {
          const Icon =
            [
              Calculator,
              Target,
              WalletCards,
              LinkIcon,
              SlidersHorizontal,
              TimerReset,
              FileText,
              ClipboardList,
            ][index] ?? Calculator;
          return (
            <button
              aria-controls={tool.slug}
              aria-selected={active === tool.slug}
              className={active === tool.slug ? styles.activeTab : ""}
              id={`${tool.slug}-tab`}
              key={tool.slug}
              onClick={() => setActive(tool.slug)}
              role="tab"
              type="button"
            >
              <Icon aria-hidden="true" size={17} />
              <span>{tool.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {active === "creator-cpa-break-even-calculator" ? (
        <article
          aria-labelledby="creator-cpa-break-even-calculator-tab"
          className={styles.panel}
          id="creator-cpa-break-even-calculator"
          role="tabpanel"
        >
          <ToolIntro index={0} />
          <div className={styles.formGrid}>
            <Field
              label="Product price"
              value={productPrice}
              onChange={setProductPrice}
              suffix="$"
            />
            <Field
              label="Gross margin"
              value={grossMargin}
              onChange={setGrossMargin}
              max={100}
              suffix="%"
            />
            <Field
              label="Payback purchases counted"
              value={targetPayback}
              onChange={setTargetPayback}
              step={0.25}
            />
            <Field
              label="Target profit left after CPA"
              value={targetProfit}
              onChange={setTargetProfit}
              suffix="$"
            />
          </div>
          <div className={styles.resultsGrid}>
            <Result
              label="Margin available"
              value={money.format(breakEven.marginRevenue)}
              detail="Revenue after gross margin across the payback period."
            />
            <Result
              label="Suggested max CPA"
              value={money.format(breakEven.maxCpa)}
              detail="Offer at or below this if the campaign must clear the target profit."
            />
          </div>
        </article>
      ) : null}

      {active === "campaign-budget-forecast" ? (
        <article
          aria-labelledby="campaign-budget-forecast-tab"
          className={styles.panel}
          id="campaign-budget-forecast"
          role="tabpanel"
        >
          <ToolIntro index={1} />
          <div className={styles.formGrid}>
            <Field
              label="Creator impressions"
              value={traffic}
              onChange={setTraffic}
            />
            <Field
              label="Click-through rate"
              value={ctr}
              onChange={setCtr}
              step={0.1}
              suffix="%"
            />
            <Field
              label="Conversion rate"
              value={conversionRate}
              onChange={setConversionRate}
              step={0.1}
              suffix="%"
            />
            <Field
              label="Approval rate"
              value={approvalRate}
              onChange={setApprovalRate}
              max={100}
              suffix="%"
            />
            <Field
              label="CPA payout"
              value={campaignCpa}
              onChange={setCampaignCpa}
              suffix="$"
            />
            <Field
              label="Campaign budget"
              value={budget}
              onChange={setBudget}
              suffix="$"
            />
          </div>
          <div className={styles.resultsGrid}>
            <Result
              label="Expected clicks"
              value={Math.round(forecast.clicks).toLocaleString()}
              detail="Traffic that reaches the product page."
            />
            <Result
              label="Approved conversions"
              value={Math.round(forecast.approved).toLocaleString()}
              detail="Capped by available budget."
            />
            <Result
              label="Forecast spend"
              value={money.format(forecast.spend)}
              detail="Maximum creator payout liability in this scenario."
            />
            <Result
              label="Revenue at product price"
              value={money.format(forecast.revenue)}
              detail="Gross revenue before margin, refunds, and fees."
            />
          </div>
        </article>
      ) : null}

      {active === "creator-earnings-calculator" ? (
        <article
          aria-labelledby="creator-earnings-calculator-tab"
          className={styles.panel}
          id="creator-earnings-calculator"
          role="tabpanel"
        >
          <ToolIntro index={2} />
          <div className={styles.formGrid}>
            <Field
              label="Expected views"
              value={creatorViews}
              onChange={setCreatorViews}
            />
            <Field
              label="Click rate"
              value={creatorClickRate}
              onChange={setCreatorClickRate}
              step={0.1}
              suffix="%"
            />
            <Field
              label="Conversion rate"
              value={creatorConversionRate}
              onChange={setCreatorConversionRate}
              step={0.1}
              suffix="%"
            />
            <Field
              label="Approval rate"
              value={creatorApprovalRate}
              onChange={setCreatorApprovalRate}
              max={100}
              suffix="%"
            />
            <Field
              label="Creator CPA"
              value={creatorCpa}
              onChange={setCreatorCpa}
              suffix="$"
            />
            <Field
              label="Reversal rate"
              value={creatorReversalRate}
              onChange={setCreatorReversalRate}
              max={100}
              suffix="%"
            />
          </div>
          <div className={styles.resultsGrid}>
            <Result
              label="Expected clicks"
              value={Math.round(earnings.clicks).toLocaleString()}
              detail="Estimated referred visits."
            />
            <Result
              label="Approved before reversals"
              value={Math.round(earnings.approved).toLocaleString()}
              detail="Conversions expected to pass review."
            />
            <Result
              label="Settled conversions"
              value={Math.round(earnings.settled).toLocaleString()}
              detail="Approved conversions after reversal assumption."
            />
            <Result
              label="Estimated payout"
              value={money.format(earnings.payout)}
              detail="Creator earnings before taxes or platform/payment constraints."
            />
          </div>
        </article>
      ) : null}

      {active === "utm-referral-link-builder" ? (
        <article
          aria-labelledby="utm-referral-link-builder-tab"
          className={styles.panel}
          id="utm-referral-link-builder"
          role="tabpanel"
        >
          <ToolIntro index={3} />
          <div className={styles.textGrid}>
            <label>
              <span>Landing page URL</span>
              <input
                value={landingUrl}
                onChange={(event) => setLandingUrl(event.target.value)}
              />
            </label>
            <label>
              <span>Creator referral code</span>
              <input
                value={creatorCode}
                onChange={(event) => setCreatorCode(event.target.value)}
              />
            </label>
            <label>
              <span>UTM source</span>
              <input
                value={utmSource}
                onChange={(event) => setUtmSource(event.target.value)}
              />
            </label>
            <label>
              <span>UTM campaign</span>
              <input
                value={utmCampaign}
                onChange={(event) => setUtmCampaign(event.target.value)}
              />
            </label>
            <label>
              <span>UTM content</span>
              <input
                value={utmContent}
                onChange={(event) => setUtmContent(event.target.value)}
              />
            </label>
          </div>
          <output className={styles.output}>{trackingUrl}</output>
        </article>
      ) : null}

      {active === "creator-fit-scorecard" ? (
        <article
          aria-labelledby="creator-fit-scorecard-tab"
          className={styles.panel}
          id="creator-fit-scorecard"
          role="tabpanel"
        >
          <ToolIntro index={4} />
          <div className={styles.scoreGrid}>
            {[
              "Audience alignment",
              "Audience trust",
              "Creative match",
              "Channel fit",
              "Compliance risk control",
              "Evidence quality",
            ].map((label, index) => (
              <ScoreField
                key={label}
                label={label}
                value={fitScores[index] ?? 0}
                onChange={(value) =>
                  setFitScores((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? value : item,
                    ),
                  )
                }
              />
            ))}
          </div>
          <div className={styles.resultsGrid}>
            <Result
              label="Fit score"
              value={`${fitScore.percent}/100`}
              detail={`${fitScore.label} match based on six weighted launch-readiness signals.`}
            />
            <Result
              label="Raw rubric"
              value={`${fitScore.total}/30`}
              detail="Use this score to compare creators before sending invites."
            />
          </div>
        </article>
      ) : null}

      {active === "attribution-window-planner" ? (
        <article
          aria-labelledby="attribution-window-planner-tab"
          className={styles.panel}
          id="attribution-window-planner"
          role="tabpanel"
        >
          <ToolIntro index={5} />
          <div className={styles.formGrid}>
            <Field
              label="Typical consideration time"
              value={considerationDays}
              onChange={setConsiderationDays}
              suffix="days"
            />
            <Field
              label="Product price"
              value={pricePoint}
              onChange={setPricePoint}
              suffix="$"
            />
            <Field
              label="Sales touches before purchase"
              value={salesTouches}
              onChange={setSalesTouches}
            />
            <Field
              label="Refund or reversal risk"
              value={refundRisk}
              onChange={setRefundRisk}
              max={100}
              suffix="%"
            />
          </div>
          <div className={styles.resultsGrid}>
            <Result
              label="Suggested attribution window"
              value={`${attribution.days} days`}
              detail="Long enough for the purchase path, short enough to keep credit inspectable."
            />
            <Result
              label="Suggested review window"
              value={`${attribution.reviewWindow} days`}
              detail="Time for builders to approve, reject, or flag conversions."
            />
          </div>
        </article>
      ) : null}

      {active === "campaign-brief-generator" ? (
        <article
          aria-labelledby="campaign-brief-generator-tab"
          className={styles.panel}
          id="campaign-brief-generator"
          role="tabpanel"
        >
          <ToolIntro index={6} />
          <div className={styles.textGrid}>
            <label>
              <span>Product</span>
              <input
                value={briefProduct}
                onChange={(event) => setBriefProduct(event.target.value)}
              />
            </label>
            <label>
              <span>Audience</span>
              <input
                value={briefAudience}
                onChange={(event) => setBriefAudience(event.target.value)}
              />
            </label>
            <label>
              <span>Qualified conversion</span>
              <input
                value={briefConversion}
                onChange={(event) => setBriefConversion(event.target.value)}
              />
            </label>
            <Field
              label="Creator payout"
              value={briefPayout}
              onChange={setBriefPayout}
              suffix="$"
            />
            <Field
              label="Attribution window"
              value={briefWindow}
              onChange={setBriefWindow}
              suffix="days"
            />
          </div>
          <textarea className={styles.briefOutput} readOnly value={brief} />
        </article>
      ) : null}

      {active === "conversion-tracking-checklist" ? (
        <article
          aria-labelledby="conversion-tracking-checklist-tab"
          className={styles.panel}
          id="conversion-tracking-checklist"
          role="tabpanel"
        >
          <ToolIntro index={7} />
          <div className={styles.checklist}>
            {checklist.map((item) => (
              <label key={item}>
                <input type="checkbox" />
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </article>
      ) : null}
    </section>
  );
}

function ToolIntro({ index }: { index: number }) {
  const tool = freeTools[index];
  if (!tool) return null;
  return (
    <header className={styles.toolIntro}>
      <p>{tool.title}</p>
      <h2>{tool.outcome}</h2>
      <span>{tool.description}</span>
    </header>
  );
}
