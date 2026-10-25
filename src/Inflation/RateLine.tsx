import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { Backdrop, POP, ThemeName, THEMES, ramp } from "./theme";

// Line chart (T1, straight segments) for a rate series: the line draws to its
// low point, the low is tagged, a near-zero band and the long fall are called
// out, then the last segment rises to today as a dashed line.
export type RateLineProps = {
  theme: ThemeName;
  audio: string;
  heading: string;
  kicker: string;
  source: string;
  backdrop: Backdrop;
  yTitle: string;
  labels: string[];
  values: number[];
  yMax: number;
  lowText: string;
  bandText: string;
  fallText: string;
  todayText: string;
  cue: { grid: number; draw: [number, number]; low: number; band: number; fall: number; today: number };
};

const X0 = 260;
const X1 = 1560;
const Y0 = 330;
const Y1 = 860;

const pctText = (v: number) => `${Number(v.toFixed(2))}%`;

export const RateLine: React.FC<RateLineProps> = (p) => {
  const t = THEMES[p.theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const { cue } = p;

  const n = p.values.length;
  const px = (i: number) => X0 + ((X1 - X0) * i) / (n - 1);
  const py = (v: number) => Y1 - ((Y1 - Y0) * v) / p.yMax;
  const ticks = Array.from({ length: 5 }, (_, k) => (p.yMax * k) / 4);
  const low = p.values.indexOf(Math.min(...p.values.slice(0, n - 1)));
  const pts = p.values.slice(0, low + 1).map((v, i) => [px(i), py(v)]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = cum[cum.length - 1];
  const d = pts.map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");

  const grid = ramp(time, cue.grid, cue.grid + 0.8);
  const q = ramp(time, cue.draw[0], cue.draw[1]);
  const target = len * q;
  let seg = 1;
  while (seg < cum.length - 1 && cum[seg] < target) seg++;
  const u = (target - cum[seg - 1]) / (cum[seg] - cum[seg - 1] || 1);
  const hx = pts[seg - 1][0] + (pts[seg][0] - pts[seg - 1][0]) * u;
  const hy = pts[seg - 1][1] + (pts[seg][1] - pts[seg - 1][1]) * u;
  const live = p.values[seg - 1] + (p.values[seg] - p.values[seg - 1]) * u;

  const lowPop = ramp(time, cue.low, cue.low + 0.45, POP);
  const ring = ramp(time, cue.low, cue.low + 1.2);
  const band = ramp(time, cue.band, cue.band + 0.8);
  const fall = ramp(time, cue.fall, cue.fall + 1.4);
  const fallTag = ramp(time, cue.fall + 0.8, cue.fall + 1.25, POP);
  const first = ramp(time, cue.fall + 1.6, cue.fall + 2.2);
  const today = ramp(time, cue.today, cue.today + 1.0);
  const todayTag = ramp(time, cue.today + 0.8, cue.today + 1.25, POP);
  const lx = px(low);
  const ly = py(p.values[low]);
  const tx = px(n - 1);
  const ty = py(p.values[n - 1]);
  const bandTop = py(1);
  const fx0 = pts[0][0];
  const fy0 = pts[0][1] - 40;
  // The long-fall arrow runs from above the first peak to above the start of the near-zero years.
  const fx1 = px(low - 2);
  const fy1 = py(p.values[low - 2]) - 90;
  const fallAt = (x: number) => fy0 + ((fy1 - fy0) * (x - fx0)) / (fx1 - fx0);
  const fallTagX = fx0 + (fx1 - fx0) * 0.8;

  return (
    <Frame t={t} time={time} heading={p.heading} kicker={p.kicker} source={p.source} backdrop={p.backdrop}>
      <Audio src={staticFile(p.audio)} />
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
        {p.yTitle}
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id={`rate-area-${p.theme}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.area0} />
            <stop offset="100%" stopColor={t.area1} />
          </linearGradient>
          <clipPath id={`rate-clip-${p.theme}`}>
            <rect x={X0 - 10} y={0} width={hx - X0 + 10} height={1080} />
          </clipPath>
        </defs>
        <g opacity={grid}>
          {ticks.map((v) => (
            <line key={v} x1={X0} x2={X1 + 60} y1={py(v)} y2={py(v)} stroke={t.grid} strokeWidth={1.5} />
          ))}
          {p.labels.map((l, i) => (
            <line key={l} x1={px(i)} x2={px(i)} y1={Y0 - 20} y2={Y1} stroke={t.grid} strokeWidth={1.5} />
          ))}
          <line x1={X0} x2={X1 + 60} y1={Y1} y2={Y1} stroke={t.axis} strokeWidth={2} />
        </g>

        {/* Near-zero band: the years of "very, very cheap" money. */}
        <rect
          x={px(low - 2)}
          y={bandTop}
          width={(lx - px(low - 2)) * band}
          height={Y1 - bandTop}
          fill={t.accentSoft}
          stroke={t.accent}
          strokeDasharray="6 8"
          strokeWidth={1.5}
          opacity={band}
        />

        <path
          d={`${d} L${lx} ${Y1} L${X0} ${Y1} Z`}
          fill={`url(#rate-area-${p.theme})`}
          clipPath={`url(#rate-clip-${p.theme})`}
          opacity={grid}
        />
        <path
          d={d}
          fill="none"
          stroke={t.accent}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${len + 2} ${len + 2}`}
          strokeDashoffset={len * (1 - q)}
          style={{ filter: `drop-shadow(0 0 10px ${t.glow})` }}
        />
        {pts.map((pt, i) => (
          <circle
            key={i}
            cx={pt[0]}
            cy={pt[1]}
            r={6}
            fill={t.dotRing}
            stroke={t.accent}
            strokeWidth={3}
            opacity={target >= cum[i] - 0.5 && i > 0 && i < low ? 1 : 0}
          />
        ))}

        {/* The long fall: a straight arrow from the 1980 peak to the low. */}
        <line
          x1={fx0}
          y1={fy0}
          x2={fx0 + (fx1 - fx0) * fall}
          y2={fy0 + (fy1 - fy0) * fall}
          stroke={t.muted}
          strokeWidth={3}
          strokeDasharray="12 10"
          opacity={fall > 0 ? 1 : 0}
        />

        <path
          d={`M${lx} ${ly} L${lx + (tx - lx) * today} ${ly + (ty - ly) * today}`}
          fill="none"
          stroke={t.accent}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="4 14"
          opacity={today > 0 ? 0.9 : 0}
        />
        <circle cx={tx} cy={ty} r={10 * todayTag} fill={t.accent} />

        <circle cx={lx} cy={ly} r={14 + 46 * ring} fill="none" stroke={t.accent} strokeWidth={3} opacity={ring > 0 && ring < 1 ? 1 - ring : 0} />
        <circle cx={lx} cy={ly} r={12 * lowPop} fill={t.accent} stroke={t.dotRing} strokeWidth={4} />
        <circle cx={pts[0][0]} cy={pts[0][1]} r={9 * grid} fill={t.accent} />
        <circle
          cx={hx}
          cy={hy}
          r={11}
          fill={t.accent}
          stroke={t.dotRing}
          strokeWidth={4}
          opacity={q > 0.001 && q < 0.999 ? 1 : 0}
          style={{ filter: `drop-shadow(0 0 14px ${t.glow})` }}
        />
      </svg>

      {ticks.map((v) => (
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
          {pctText(v)}
        </div>
      ))}
      {p.labels.map((l, i) => (
        <div
          key={l}
          style={{
            position: "absolute",
            left: px(i),
            top: 892,
            translate: "-50% 0",
            fontSize: 20,
            fontWeight: i === 0 && first > 0 ? 700 : 400,
            color: i === 0 && first > 0.5 ? t.accentText : t.muted,
            opacity: grid,
          }}
        >
          {l}
        </div>
      ))}

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
        {live.toFixed(1)}%
      </div>

      <div
        style={{
          position: "absolute",
          left: lx - 26,
          top: ly - 80,
          translate: "-100% -100%",
          transformOrigin: "100% 100%",
          scale: lowPop,
          opacity: Math.min(1, lowPop * 3),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "10px 22px",
          borderRadius: 16,
          background: t.chipBg,
          border: `2px solid ${t.chipBorder}`,
          boxShadow: t.chipGlow,
          color: t.chipInk,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1, textShadow: t.textGlow }}>{pctText(p.values[low])}</div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "0.08em" }}>{p.lowText}</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: px(low - 2) + 12,
          top: bandTop - 10,
          translate: "0 -100%",
          fontSize: 22,
          fontWeight: 600,
          color: t.accentText,
          whiteSpace: "nowrap",
          opacity: band,
        }}
      >
        {p.bandText}
      </div>

      <div
        style={{
          position: "absolute",
          left: fallTagX,
          top: fallAt(fallTagX) - 150,
          translate: "-50% -50%",
          scale: fallTag,
          opacity: Math.min(1, fallTag * 3),
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 22px",
          borderRadius: 999,
          border: `2px solid ${t.accent}`,
          background: t.badgeBg,
          color: t.accentText,
          fontSize: 28,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        <svg width={18} height={16}>
          <path d="M0 0 L18 0 L9 16 Z" fill={t.accent} />
        </svg>
        {p.fallText}
      </div>

      <div
        style={{
          position: "absolute",
          left: tx + 24,
          top: ty,
          translate: "0 -50%",
          transformOrigin: "0 50%",
          scale: todayTag,
          opacity: Math.min(1, todayTag * 3),
          padding: "8px 18px",
          borderRadius: 12,
          border: `2px solid ${t.accent}`,
          background: t.badgeBg,
          color: t.accentText,
          fontSize: 26,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {pctText(p.values[n - 1])} {p.todayText}
      </div>
    </Frame>
  );
};
