import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { SignalMatchExplainerProps } from "./schema";

const dark = "#090812";
const ink = "#F8F6FF";
const muted = "#B6B0CA";

export function SignalMatchExplainer(props: SignalMatchExplainerProps) {
  const frame = useCurrentFrame();
  const { durationInFrames, height, width } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vertical = height > width;
  const edge = vertical ? 72 : Math.max(72, width * 0.065);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark,
        color: ink,
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      <Atmosphere accent={props.accent} />
      <Header accent={props.accent} edge={edge} />

      <Sequence from={0} durationInFrames={270} premountFor={30}>
        <StoryFrame
          eyebrow={props.eyebrow}
          headline={props.hook}
          marker="01"
          accent={props.accent}
          edge={edge}
          vertical={vertical}
        />
      </Sequence>
      {props.beats.map((beat, index) => (
        <Sequence
          key={beat}
          from={270 + index * 360}
          durationInFrames={360}
          premountFor={30}
        >
          <StoryFrame
            eyebrow={`Step ${index + 1} of 3`}
            headline={beat}
            marker={`0${index + 2}`}
            accent={props.accent}
            edge={edge}
            vertical={vertical}
          />
        </Sequence>
      ))}
      <Sequence from={1350} durationInFrames={450} premountFor={30}>
        <EndCard {...props} edge={edge} vertical={vertical} />
      </Sequence>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: `${progress * 100}%`,
          height: 10,
          background: props.accent,
          boxShadow: `0 0 28px ${props.accent}`,
        }}
      />
    </AbsoluteFill>
  );
}

function Header({ accent, edge }: { accent: string; edge: number }) {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        gap: 14,
        left: edge,
        position: "absolute",
        top: edge * 0.7,
        zIndex: 5,
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: accent,
          borderRadius: 12,
          color: dark,
          display: "flex",
          fontSize: 28,
          fontWeight: 900,
          height: 48,
          justifyContent: "center",
          width: 48,
        }}
      >
        S
      </div>
      <span style={{ fontSize: 28, fontWeight: 760, letterSpacing: -0.8 }}>
        SignalMatch
      </span>
    </div>
  );
}

function Atmosphere({ accent }: { accent: string }) {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70) * 45;
  return (
    <AbsoluteFill>
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          inset: 0,
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          position: "absolute",
        }}
      />
      <div
        style={{
          background: accent,
          borderRadius: "50%",
          filter: "blur(150px)",
          height: 520,
          opacity: 0.22,
          position: "absolute",
          right: -180 + drift,
          top: -220 + drift * 0.5,
          width: 520,
        }}
      />
    </AbsoluteFill>
  );
}

function StoryFrame({
  accent,
  edge,
  eyebrow,
  headline,
  marker,
  vertical,
}: {
  accent: string;
  edge: number;
  eyebrow: string;
  headline: string;
  marker: string;
  vertical: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.8 } });
  const exit = interpolate(frame, [300, 345], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visible = Math.min(enter, exit);
  const headlineSize = vertical
    ? Math.min(94, width * 0.082)
    : Math.min(106, width * 0.059);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        opacity: visible,
        padding: `${edge * 1.25}px ${edge}px ${edge}px`,
        transform: `translateY(${(1 - enter) * 70}px)`,
      }}
    >
      <div style={{ maxWidth: vertical ? width - edge * 2 : width * 0.78 }}>
        <div
          style={{
            alignItems: "center",
            color: accent,
            display: "flex",
            fontSize: vertical ? 26 : 30,
            fontWeight: 750,
            gap: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span>{marker}</span>
          <span style={{ background: accent, height: 2, width: 70 }} />
          <span>{eyebrow}</span>
        </div>
        <h1
          style={{
            fontSize: headlineSize,
            fontWeight: 780,
            letterSpacing: -headlineSize * 0.045,
            lineHeight: 1.02,
            margin: `${vertical ? 54 : 42}px 0 0`,
            textWrap: "balance",
          }}
        >
          {headline}
        </h1>
      </div>
      <div
        style={{
          bottom: edge,
          color: muted,
          fontSize: vertical ? 24 : 25,
          left: edge,
          position: "absolute",
        }}
      >
        Performance partnerships, built on evidence.
      </div>
      <div
        style={{
          border: `1px solid ${accent}55`,
          borderRadius: "50%",
          bottom: vertical ? height * 0.16 : -height * 0.2,
          height: vertical ? width * 0.7 : height * 0.78,
          position: "absolute",
          right: vertical ? -width * 0.35 : -height * 0.12,
          width: vertical ? width * 0.7 : height * 0.78,
        }}
      />
    </AbsoluteFill>
  );
}

function EndCard({
  accent,
  cta,
  edge,
  resourceUrl,
  title,
  vertical,
}: SignalMatchExplainerProps & { edge: number; vertical: boolean }) {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.7 } });
  const titleSize = vertical
    ? Math.min(86, width * 0.078)
    : Math.min(92, width * 0.052);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: `${edge * 1.25}px ${edge}px ${edge}px`,
        transform: `scale(${0.94 + enter * 0.06})`,
        opacity: enter,
      }}
    >
      <div style={{ maxWidth: vertical ? "100%" : "82%" }}>
        <div
          style={{
            color: accent,
            fontSize: vertical ? 26 : 30,
            fontWeight: 750,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Free SignalMatch guide
        </div>
        <h1
          style={{
            fontSize: titleSize,
            fontWeight: 780,
            letterSpacing: -titleSize * 0.045,
            lineHeight: 1.03,
            margin: "38px 0 0",
            textWrap: "balance",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            background: accent,
            borderRadius: 18,
            color: dark,
            display: "inline-flex",
            fontSize: vertical ? 32 : 34,
            fontWeight: 800,
            marginTop: 52,
            padding: "20px 30px",
          }}
        >
          {cta} →
        </div>
        <div
          style={{
            color: ink,
            fontSize: vertical ? 27 : 30,
            fontWeight: 600,
            marginTop: 38,
          }}
        >
          {resourceUrl.replace("https://", "")}
        </div>
        <div
          style={{ color: muted, fontSize: vertical ? 20 : 22, marginTop: 20 }}
        >
          Educational resource • verify claims, evidence, and source notes
          before publishing
        </div>
      </div>
    </AbsoluteFill>
  );
}
