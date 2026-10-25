import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { POP, SceneProps, THEMES, fmt, ramp } from "./theme";

// "…over the five years from 2021 until 2026, the overall price index rose by
// around 27%. So something that cost £100 in 2021, it now costs about £127 today."
// Cue times are seconds into public/audio/T1.wav (C0080 01:24.0 → 01:36.6).
export const PRICE_LINE_SECONDS = 14;
const CUE = {
  grid: [0.2, 1.0],
  start: 1.3, // "2021"
  draw: [2.4, 5.6], // "until 2026 … rose by around 27%"
  delta: 5.7, // "27%"
  guide: 7.9, // "£100"
  end: 11.1, // "£127"
} as const;

const VALUES = [100, 109.1, 117.1, 120.0, 124.1, 127.6];
const LABELS = ["2021", "2022", "2023", "2024", "2025", "2026"];
const X0 = 260;
const X1 = 1440;
const Y0 = 300;
const Y1 = 870;
const LO = 90;
const HI = 135;
const TICKS = [90, 100, 110, 120, 130];

const px = (i: number) => X0 + ((X1 - X0) * i) / (VALUES.length - 1);
const py = (v: number) => Y1 - ((Y1 - Y0) * (v - LO)) / (HI - LO);

// Catmull-Rom through the points, sampled so the draw-on and the live value
// tag can follow the curve by arc length.
const build = () => {
  const pts = VALUES.map((v, i) => [px(i), py(v)]);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  const s: number[][] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
    for (let k = 1; k <= 24; k++) {
      const u = k / 24;
      const m = 1 - u;
      s.push([
        m * m * m * p1[0] + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u * u * u * p2[0],
        m * m * m * p1[1] + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u * u * u * p2[1],
      ]);
    }
  }
  const cum = [0];
  for (let j = 1; j < s.length; j++)
    cum.push(cum[j - 1] + Math.hypot(s[j][0] - s[j - 1][0], s[j][1] - s[j - 1][1]));
  return { d, s, cum, len: cum[cum.length - 1] };
};
const PATH = build();

const pointAt = (q: number) => {
  const target = PATH.len * q;
  for (let i = 1; i < PATH.s.length; i++) {
    if (PATH.cum[i] >= target) {
      const u = (target - PATH.cum[i - 1]) / (PATH.cum[i] - PATH.cum[i - 1] || 1);
      return [
        PATH.s[i - 1][0] + (PATH.s[i][0] - PATH.s[i - 1][0]) * u,
        PATH.s[i - 1][1] + (PATH.s[i][1] - PATH.s[i - 1][1]) * u,
      ];
    }
  }
  return PATH.s[PATH.s.length - 1];
};

export const PriceLine: React.FC<SceneProps> = ({ theme }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const grid = ramp(time, CUE.grid[0], CUE.grid[1]);
  const q = ramp(time, CUE.draw[0], CUE.draw[1]);
  const [hx, hy] = pointAt(q);
  const fi = Math.min(VALUES.length - 1, ((hx - X0) / (X1 - X0)) * (VALUES.length - 1));
  const ii = Math.min(VALUES.length - 2, Math.floor(fi));
  const live = VALUES[ii] + (VALUES[ii + 1] - VALUES[ii]) * (fi - ii);
  const sx = px(0);
  const sy = py(VALUES[0]);
  const ex = px(VALUES.length - 1);
  const ey = py(VALUES[VALUES.length - 1]);
  const startIn = ramp(time, CUE.start, CUE.start + 0.4, POP);
  const pulse = interpolate(time, [CUE.guide, CUE.guide + 0.35, CUE.guide + 1], [1, 1.3, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const guide = ramp(time, CUE.guide, CUE.guide + 0.9);
  const bracket = ramp(time, CUE.end - 0.2, CUE.end + 0.4);
  const tag = ramp(time, CUE.end, CUE.end + 0.45, POP);
  const delta = ramp(time, CUE.delta, CUE.delta + 0.45, POP);

  return (
    <Frame
      t={t}
      time={time}
      heading="What £100 of shopping costs today"
      kicker="OVERALL PRICE INDEX · 2021–2026"
      source="Source: ONS CPI, rebased 2021 = £100 (intermediate years illustrative)"
    >
      <Audio src={staticFile("audio/T1.wav")} />
      <div
        style={{
          position: "absolute",
          left: 92,
          top: (Y0 + Y1) / 2,
          translate: "-50% -50%",
          rotate: "-90deg",
          whiteSpace: "nowrap",
          fontSize: 20,
          color: t.muted,
          opacity: grid,
        }}
      >
        Cost of the same basket (£)
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id={`area-${theme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.area0} />
            <stop offset="100%" stopColor={t.area1} />
          </linearGradient>
        </defs>
        <g opacity={grid}>
          {TICKS.map((v) => (
            <line key={v} x1={X0} x2={X1 + 70} y1={py(v)} y2={py(v)} stroke={t.grid} strokeWidth={1.5} />
          ))}
          {LABELS.map((l, i) => (
            <line key={l} x1={px(i)} x2={px(i)} y1={Y0 - 30} y2={Y1} stroke={t.grid} strokeWidth={1.5} />
          ))}
          <line x1={X0} x2={X1 + 70} y1={Y1} y2={Y1} stroke={t.axis} strokeWidth={2} />
        </g>
        <path
          d={`${PATH.d} L${X1} ${Y1} L${X0} ${Y1} Z`}
          fill={`url(#area-${theme})`}
          opacity={ramp(time, CUE.draw[0] + 1.5, CUE.draw[1] + 0.8)}
        />
        <line
          x1={sx}
          x2={ex}
          y1={sy}
          y2={sy}
          stroke={t.muted}
          strokeWidth={2.5}
          strokeDasharray="10 10"
          opacity={guide}
          strokeDashoffset={(1 - guide) * 200}
        />
        <path
          d={`M${ex + 70} ${sy} H${ex + 84} V${sy + (ey - sy) * bracket} H${ex + 70}`}
          fill="none"
          stroke={t.accent}
          strokeWidth={3}
          opacity={bracket}
        />
        <path
          d={PATH.d}
          fill="none"
          stroke={t.accent}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${PATH.len + 2} ${PATH.len + 2}`}
          strokeDashoffset={PATH.len * (1 - q)}
          style={{ filter: `drop-shadow(0 0 10px ${t.glow})` }}
        />
        <circle cx={sx} cy={sy} r={9 * startIn} fill={t.accent} />
        <circle
          cx={hx}
          cy={hy}
          r={11}
          fill={t.accent}
          stroke={t.dotRing}
          strokeWidth={4}
          opacity={q > 0.001 ? 1 : 0}
          style={{ filter: `drop-shadow(0 0 14px ${t.glow})` }}
        />
      </svg>

      {TICKS.map((v) => (
        <div
          key={v}
          style={{
            position: "absolute",
            left: 0,
            width: 236,
            top: py(v),
            translate: "0 -50%",
            textAlign: "right",
            fontSize: 20,
            color: t.muted,
            opacity: grid,
          }}
        >
          {fmt(v)}
        </div>
      ))}
      {LABELS.map((l, i) => (
        <div
          key={l}
          style={{
            position: "absolute",
            left: px(i),
            top: 892,
            translate: "-50% 0",
            fontSize: 20,
            color: t.muted,
            opacity: grid,
          }}
        >
          {l}
        </div>
      ))}

      {/* £100 start value: lands on "2021", pulses on "£100". */}
      <div
        style={{
          position: "absolute",
          left: sx,
          top: sy - 62,
          translate: "-50% -50%",
          scale: startIn * pulse,
          padding: "6px 16px",
          borderRadius: 12,
          background: `rgba(0,0,0,0)`,
          border: `2px solid ${guide > 0 ? t.accent : "rgba(0,0,0,0)"}`,
          fontSize: 32,
          fontWeight: 700,
          color: t.accentText,
          textShadow: t.textGlow,
          whiteSpace: "nowrap",
        }}
      >
        £100
      </div>

      <div
        style={{
          position: "absolute",
          left: hx,
          top: hy,
          translate: "-50% -175%",
          padding: "6px 14px",
          borderRadius: 10,
          background: t.chipBg,
          border: `1.5px solid ${t.chipBorder}`,
          color: t.chipInk,
          fontSize: 24,
          fontWeight: 600,
          whiteSpace: "nowrap",
          opacity: q > 0.02 && q < 0.999 ? 1 : 0,
        }}
      >
        {fmt(live, "£", "", 2)}
      </div>

      <div
        style={{
          position: "absolute",
          left: ex + 34,
          top: ey - 150,
          transformOrigin: "0 100%",
          scale: delta,
          opacity: Math.min(1, delta * 3),
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 18px",
          borderRadius: 999,
          border: `2px solid ${t.accent}`,
          color: t.accentText,
          fontSize: 28,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        <svg width={18} height={16}>
          <path d="M9 0 L18 16 L0 16 Z" fill={t.accent} />
        </svg>
        +27.6%
      </div>

      {/* £127.60 tag pops on "£127". */}
      <div
        style={{
          position: "absolute",
          left: ex + 104,
          top: ey,
          translate: "0 -50%",
          transformOrigin: "0 50%",
          scale: tag,
          opacity: Math.min(1, tag * 3),
          padding: "12px 24px",
          borderRadius: 16,
          background: t.chipBg,
          border: `2px solid ${t.chipBorder}`,
          boxShadow: t.chipGlow,
          color: t.chipInk,
          fontSize: 46,
          fontWeight: 700,
          whiteSpace: "nowrap",
          textShadow: t.textGlow,
        }}
      >
        £127.60
      </div>
    </Frame>
  );
};
