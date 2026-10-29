import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow, C, DISPLAY, G, LABEL, Reveal, SMOOTH, Stage, k, mix, steps } from "./common";

// "You may have progressed in your career. You may have changed jobs. You may have
// had several pay rises. So on paper… you're doing everything well. But when you look
// at what's left in your bank account at the end of each month, you feel like you've
// not actually made much progress."
// Cue times are seconds into public/audio/I2.wav (C0080 0:11.6 → 0:25.55).
export const ON_PAPER_SECONDS = 14.6;
const CUE = {
  axis: 0.2,
  events: [1.24, 2.36, 4.06], // "career", "jobs", "pay rises"
  paper: 5.88, // "on paper"
  but: 8.12, // "But"
  bank: 10.0, // "bank account"
  progress: 12.76, // "not … much progress"
} as const;

const BASE = 850;
const TOP = 450;
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
const px = (t: number) => mix(G.left, G.right, t);
const py = (v: number) => BASE - (BASE - TOP) * v;

// Pay climbs in three steps; what's left each month barely moves.
const PAY: [number, number][] = [
  [0, 0.3],
  [0.17, 0.3],
  [0.21, 0.46],
  [0.42, 0.46],
  [0.46, 0.66],
  [0.69, 0.66],
  [0.73, 0.86],
  [1, 0.9],
];
const EVENTS = [
  { t: 0.21, v: 0.46, label: "Career" },
  { t: 0.46, v: 0.66, label: "New job" },
  { t: 0.73, v: 0.86, label: "Pay rise" },
];
const BANK: [number, number][] = [
  [0, 0.12],
  [0.2, 0.13],
  [0.45, 0.11],
  [0.72, 0.13],
  [1, 0.12],
];

const line = (pts: [number, number][]) => pts.map(([t, v], i) => `${i ? "L" : "M"}${px(t)} ${py(v)}`).join(" ");
const area = (pts: [number, number][]) => `${line(pts)} L${px(1)} ${BASE} L${px(0)} ${BASE} Z`;

export const OnPaper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const axis = k(time, CUE.axis, CUE.axis + 1.2, SMOOTH);
  // The pay line is revealed a step at a time, landing on each spoken event.
  const reveal = steps(
    time,
    [0.5, CUE.events[0] + 0.25, CUE.events[1] + 0.25, CUE.events[2] + 0.25, CUE.paper],
    [0, 0.21, 0.46, 0.73, 1],
  );
  const dim = k(time, CUE.but, CUE.but + 0.8, SMOOTH);
  const bank = k(time, CUE.bank - 0.2, CUE.bank + 1.3, SMOOTH);
  const gap = k(time, CUE.progress, CUE.progress + 0.9, SMOOTH);
  const payEnd = py(PAY[PAY.length - 1][1]);
  const bankEnd = py(BANK[BANK.length - 1][1]);

  const chart = (mirror: boolean) => (
    <g transform={mirror ? `translate(0 ${2 * BASE}) scale(1 -1)` : undefined}>
      <path d={area(PAY)} fill={C.mint} opacity={mix(0.2, 0.08, dim)} clipPath="url(#i2-pay)" />
      <path d={area(BANK)} fill={C.ink} opacity={0.94} clipPath="url(#i2-bank)" />
      {!mirror && (
        <path
          d={line(PAY)}
          fill="none"
          stroke={C.mint}
          strokeWidth={4}
          strokeLinejoin="round"
          opacity={mix(1, 0.4, dim)}
          clipPath="url(#i2-pay)"
        />
      )}
    </g>
  );

  return (
    <Stage>
      <Audio src={staticFile("audio/I2.wav")} />

      {/* Upper third: the hero swaps from "On paper ↗" to "In the bank →". */}
      <div style={{ position: "absolute", left: G.left - 4, top: G.y1, translate: "0 -100%" }}>
        <Reveal time={time} at={CUE.paper} out={CUE.but} dur={1.0}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ ...DISPLAY, fontSize: 150 }}>On paper</div>
            <Arrow size={110} angle={-35} p={k(time, CUE.paper + 0.3, CUE.paper + 1.1)} color={C.mint} />
          </div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: G.left - 4, top: G.y1, translate: "0 -100%" }}>
        <Reveal time={time} at={CUE.bank} dur={1.0}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ ...DISPLAY, fontSize: 150 }}>In the bank</div>
            <Arrow size={110} angle={0} p={k(time, CUE.bank + 0.3, CUE.bank + 1.1)} color={C.ink} />
          </div>
        </Reveal>
      </div>

      {/* Legend, right-aligned on the upper-third line. */}
      <div
        style={{
          ...LABEL,
          fontSize: 18,
          position: "absolute",
          right: 1920 - G.right,
          top: G.y1 - 24,
          display: "flex",
          gap: 40,
          opacity: k(time, CUE.axis + 0.3, CUE.axis + 0.9),
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 12, opacity: mix(1, 0.5, dim) }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: C.mint }} />
          Pay
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12, opacity: k(time, CUE.bank - 0.2, CUE.bank + 0.4) }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: C.ink }} />
          Left each month
        </span>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="i2-pay">
            <rect x={0} y={0} width={px(reveal)} height={2000} />
          </clipPath>
          <clipPath id="i2-bank">
            <rect x={0} y={0} width={px(bank)} height={2000} />
          </clipPath>
          <linearGradient id="i2-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0.12} />
            <stop offset="0.35" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id="i2-reflect">
            <rect x={0} y={BASE} width={1920} height={1080 - BASE} fill="url(#i2-fade)" />
          </mask>
        </defs>

        {/* Soft reflection under the baseline, as in the reference charts. */}
        <g mask="url(#i2-reflect)">{chart(true)}</g>
        {chart(false)}

        <line x1={G.left} x2={mix(G.left, G.right, axis)} y1={BASE} y2={BASE} stroke={C.rule} strokeWidth={2} />

        {EVENTS.map((e, i) => {
          const on = k(time, CUE.events[i] + 0.15, CUE.events[i] + 0.6);
          return (
            <g key={e.label} opacity={mix(1, 0.45, dim)}>
              <circle cx={px(e.t)} cy={py(e.v)} r={10 * on} fill={C.bg} stroke={C.mint} strokeWidth={4} />
            </g>
          );
        })}

        {/* "Not much progress": a dimension line measures the gap at the end. */}
        <g stroke={C.alert} strokeWidth={3} opacity={gap}>
          <line x1={G.right + 40} x2={G.right + 40} y1={bankEnd} y2={mix(bankEnd, payEnd, gap)} />
          <line x1={G.right + 28} x2={G.right + 52} y1={bankEnd} y2={bankEnd} />
          <line x1={G.right + 28} x2={G.right + 52} y1={payEnd} y2={payEnd} opacity={gap > 0.95 ? 1 : 0} />
        </g>
      </svg>

      {EVENTS.map((e, i) => (
        <div
          key={e.label}
          style={{
            ...LABEL,
            fontSize: 16,
            letterSpacing: "0.22em",
            color: C.ink,
            position: "absolute",
            left: px(e.t),
            top: py(e.v) - 48,
            translate: "-50% 0",
            opacity: k(time, CUE.events[i] + 0.25, CUE.events[i] + 0.7) * mix(1, 0.45, dim),
          }}
        >
          {e.label}
        </div>
      ))}
      {YEARS.map((y, i) => (
        <div
          key={y}
          style={{
            ...LABEL,
            fontSize: 18,
            letterSpacing: "0.16em",
            position: "absolute",
            left: px(i / (YEARS.length - 1)),
            top: BASE + 22,
            translate: i === 0 ? "0 0" : i === YEARS.length - 1 ? "-100% 0" : "-50% 0",
            opacity: k(time, CUE.axis + 0.2 + i * 0.1, CUE.axis + 0.8 + i * 0.1),
          }}
        >
          {y}
        </div>
      ))}
    </Stage>
  );
};
