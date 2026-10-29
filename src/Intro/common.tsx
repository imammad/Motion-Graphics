import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, interpolate, staticFile } from "remotion";

// Editorial infographic system for the intro: flat colour, condensed display
// type, wide-tracked labels, hairline rules. Forest palette from the charts.
for (const weight of [600, 700, 800]) {
  loadFont({ family: "Barlow Condensed", url: staticFile(`fonts/BarlowCondensed-${weight}.woff2`), weight: String(weight) });
}
for (const weight of [400, 500, 600]) {
  loadFont({ family: "Inter", url: staticFile(`fonts/Inter-${weight}.woff2`), weight: String(weight) });
}

export const C = {
  bg: "#072818",
  ink: "#dddddd",
  muted: "rgba(221,221,221,0.56)",
  faint: "rgba(221,221,221,0.22)",
  rule: "rgba(221,221,221,0.42)",
  mint: "#43e097",
  brand: "#01572a",
  alert: "#ff8f63",
};

// Layout grid: 160px margins, rule-of-thirds lines at x 640/1280 and y 360/720.
export const G = { left: 160, right: 1760, x1: 640, x2: 1280, y1: 360, y2: 720 };

export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const SMOOTH = Easing.bezier(0.65, 0, 0.35, 1);

export const k = (time: number, a: number, b: number, easing = EXPO) =>
  interpolate(time, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Eases through a list of keyframes, one curve per segment, so a value can
// move in steps that each land on a voice cue.
export const steps = (time: number, times: number[], values: number[], easing = SMOOTH) => {
  if (time <= times[0]) return values[0];
  for (let i = 1; i < times.length; i++) {
    if (time <= times[i]) return mix(values[i - 1], values[i], easing((time - times[i - 1]) / (times[i] - times[i - 1])));
  }
  return values[values.length - 1];
};

export const DISPLAY: React.CSSProperties = {
  fontFamily: "Barlow Condensed",
  fontWeight: 800,
  textTransform: "uppercase",
  lineHeight: 0.84,
  letterSpacing: "-0.005em",
  color: C.ink,
  whiteSpace: "nowrap",
};

export const LABEL: React.CSSProperties = {
  fontFamily: "Inter",
  fontWeight: 500,
  fontSize: 20,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: C.muted,
  whiteSpace: "nowrap",
};

// Flat forest ground with one very soft light pool for depth; no texture or glow.
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(90% 80% at 30% 30%, rgba(221,221,221,0.035), rgba(0,0,0,0) 70%)" }} />
    {children}
  </AbsoluteFill>
);

// Masked reveal: content rises from behind its own baseline and, if `out` is
// given, leaves upward the same way.
export const Reveal: React.FC<{
  time: number;
  at: number;
  out?: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ time, at, out, dur = 0.9, style, children }) => {
  const i = k(time, at, at + dur);
  const o = out === undefined ? 0 : k(time, out, out + 0.6, SMOOTH);
  return (
    <div style={{ display: "inline-block", overflow: "hidden", padding: "6px 4px", ...style }}>
      <div style={{ translate: `0 ${(1 - i) * 110 - o * 110}%` }}>{children}</div>
    </div>
  );
};

// Thin editorial arrow (like the "8% ↑" mark), pointing at `angle` degrees
// (0 = right, -90 = up, 90 = down), drawn on with `p`.
export const Arrow: React.FC<{ size: number; angle: number; p: number; color: string; stroke?: number }> = ({
  size,
  angle,
  p,
  color,
  stroke = 12,
}) => {
  const len = size * 0.9;
  const head = size * 0.28;
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} style={{ overflow: "visible" }}>
      <g transform={`rotate(${angle})`} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="square">
        <line x1={-len / 2} y1={0} x2={-len / 2 + len * p} y2={0} />
        <path
          d={`M${len / 2 - head} ${-head} L${len / 2} 0 L${len / 2 - head} ${head}`}
          strokeLinejoin="miter"
          opacity={p > 0.85 ? 1 : 0}
        />
      </g>
    </svg>
  );
};
