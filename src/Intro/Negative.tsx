import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow, C, DISPLAY, G, LABEL, Reveal, SMOOTH, Stage, k, mix } from "./common";

// "…I remember feeling like I had more disposable income back then than I do now,
// which seems really weird. And the reason for this is that in the past five years,
// we've actually experienced a negative period of disposable income."
// Cue times are seconds into public/audio/I3.wav (C0080 0:34.5 → 0:46.9).
export const NEGATIVE_SECONDS = 13.0;
const CUE = {
  ruler: 0.3,
  title: 1.96, // "disposable income"
  then: 2.78, // "back then"
  now: 3.82, // "now"
  fiveYears: 7.56, // "in the past five years"
  negative: 10.36, // "negative"
} as const;

const BASE = 820;
const RULER_TOP = 430;
const W = 380;
const BARS = [
  { x: 280, label: "Then", color: C.ink },
  { x: 720, label: "Now", color: C.mint },
  { x: 1160, label: "Change", color: C.alert },
];

export const Negative: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const ruler = k(time, CUE.ruler, CUE.ruler + 1.4, SMOOTH);
  const thenH = 330 * k(time, CUE.then - 0.1, CUE.then + 1.0);
  // "Now" lands, then settles lower: the squeeze.
  const nowH = mix(220, 170, k(time, CUE.now + 0.9, CUE.now + 2.0, SMOOTH)) * k(time, CUE.now - 0.1, CUE.now + 0.9);
  const changeH = 130 * k(time, CUE.fiveYears, CUE.fiveYears + 1.2, SMOOTH);
  const heights = [thenH, nowH, -changeH];
  const ticks = Math.floor((BASE - RULER_TOP) / 26);

  return (
    <Stage time={time}>
      <Audio src={staticFile("audio/I3.wav")} />

      {/* Upper third: the subject, then the verdict. */}
      <div style={{ position: "absolute", left: G.left - 4, top: G.y1, translate: "0 -100%" }}>
        <Reveal time={time} at={CUE.title} out={CUE.negative - 0.5} dur={1.0}>
          <div style={{ ...DISPLAY, fontSize: 150 }}>Disposable income</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: G.left - 4, top: G.y1, translate: "0 -100%" }}>
        <Reveal time={time} at={CUE.negative - 0.05} dur={1.0}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ ...DISPLAY, fontSize: 150, color: C.alert }}>Negative</div>
            <Arrow size={120} angle={90} p={k(time, CUE.negative + 0.35, CUE.negative + 1.1)} color={C.alert} stroke={13} />
          </div>
        </Reveal>
      </div>
      <div
        style={{
          ...LABEL,
          fontSize: 18,
          position: "absolute",
          right: 1920 - G.right,
          top: G.y1 - 24,
          opacity: k(time, CUE.negative + 0.3, CUE.negative + 0.9),
        }}
      >
        Disposable income
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* Ruler down the left edge and a baseline, as in the report reference. */}
        <line x1={G.left} x2={G.left} y1={BASE} y2={mix(BASE, RULER_TOP, ruler)} stroke={C.rule} strokeWidth={2} />
        {Array.from({ length: ticks + 1 }, (_, i) => {
          if (i % 5 !== 0) return null;
          const y = BASE - i * 26;
          return (
            <line
              key={i}
              x1={G.left}
              x2={G.left + (i % 5 === 0 ? 34 : 18)}
              y1={y}
              y2={y}
              stroke={i % 5 === 0 ? C.rule : C.faint}
              strokeWidth={2}
              opacity={ruler * (BASE - RULER_TOP) >= i * 26 ? 1 : 0}
            />
          );
        })}
        <line x1={G.left} x2={mix(G.left, G.right, ruler)} y1={BASE} y2={BASE} stroke={C.ink} strokeWidth={3} />
        {BARS.map((b, i) => {
          const h = heights[i];
          return (
            <rect
              key={b.label}
              x={b.x}
              y={h >= 0 ? BASE - h : BASE + 1.5}
              width={W}
              height={Math.abs(h)}
              fill={b.color}
            />
          );
        })}
      </svg>

      {/* Bar labels sit inside each bar: name top-left, spec bottom-left. */}
      {BARS.map((b, i) => {
        const h = heights[i];
        const full = [330, 170, 130][i];
        const show = k(time, [CUE.then, CUE.now, CUE.fiveYears][i] + 0.5, [CUE.then, CUE.now, CUE.fiveYears][i] + 1.0);
        const top = h >= 0 ? BASE - h : BASE;
        return (
          <div
            key={b.label}
            style={{
              position: "absolute",
              left: b.x + 24,
              top: top + 18,
              height: Math.max(0, Math.abs(h) - 36),
              width: W - 48,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              opacity: Math.abs(h) > full * 0.6 ? show : 0,
            }}
          >
            <div style={{ ...DISPLAY, fontSize: 58, color: C.bg }}>{b.label}</div>
          </div>
        );
      })}
    </Stage>
  );
};
