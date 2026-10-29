import { AbsoluteFill, Easing, interpolate } from "remotion";
import { THEMES, fontFamily } from "../Inflation/theme";

// Intro visuals: same Forest palette as the charts, but type-led and minimal.
export const T = THEMES.dark;

// Expo-out for entrances (fast start, long soft settle) and a symmetric
// in-out for camera moves and hand-offs between states.
export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const SMOOTH = Easing.bezier(0.65, 0, 0.35, 1);

export const k = (time: number, a: number, b: number, easing = EXPO) =>
  interpolate(time, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const HERO: React.CSSProperties = {
  fontWeight: 800,
  letterSpacing: "-0.035em",
  lineHeight: 1,
  color: T.head,
  whiteSpace: "nowrap",
};

export const LABEL: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: T.muted,
  whiteSpace: "nowrap",
};

// Dark stage: deep green gradient, two slow-drifting glows, fine grain, vignette.
export const Stage: React.FC<{ time: number; children: React.ReactNode }> = ({ time, children }) => {
  const a = Math.sin(time * 0.35);
  const b = Math.cos(time * 0.28);
  return (
    <AbsoluteFill style={{ fontFamily, background: "#041a0f", overflow: "hidden" }}>
      <AbsoluteFill
        style={{ background: "radial-gradient(120% 95% at 50% 42%, #0c3621 0%, #072818 46%, #03130a 100%)" }}
      />
      <div
        style={{
          position: "absolute",
          left: 280 + 90 * a,
          top: 120 + 50 * b,
          width: 1100,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(67,224,151,0.13), rgba(67,224,151,0))",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 160 - 80 * b,
          bottom: -260 + 60 * a,
          width: 1000,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(1,87,42,0.35), rgba(1,87,42,0))",
        }}
      />
      <AbsoluteFill
        style={{ backgroundImage: `radial-gradient(${T.tex} 1px, rgba(0,0,0,0) 1.6px)`, backgroundSize: "5px 5px" }}
      />
      <AbsoluteFill style={{ background: T.vig }} />
      {children}
    </AbsoluteFill>
  );
};

// Masked line reveal: the text rises from behind its own baseline and, if
// `out` is given, leaves upward the same way.
export const Reveal: React.FC<{
  time: number;
  at: number;
  out?: number;
  dur?: number;
  // Font size of the line, so the mask's padding (in em) clears its descenders.
  size?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ time, at, out, dur = 0.9, size, style, children }) => {
  const i = k(time, at, at + dur);
  const o = out === undefined ? 0 : k(time, out, out + 0.6, SMOOTH);
  return (
    <div style={{ display: "inline-block", overflow: "hidden", fontSize: size, padding: "0.06em 0.04em 0.24em", ...style }}>
      <div style={{ translate: `0 ${(1 - i) * 105 - o * 105}%`, opacity: Math.min(1, i * 1.6) * (1 - o) }}>{children}</div>
    </div>
  );
};
