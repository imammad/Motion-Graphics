import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow, C, DISPLAY, G, LABEL, Letters, Reveal, SMOOTH, SOFT, Stage, k, mix } from "./common";

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
const RED = "#ff4b4b";
// Then and Now are centred on the two vertical thirds. Now lands at its full
// height, then a red "Negative" block eats down from its top: the share lost.
const THEN_X = G.x1 - W / 2;
const NOW_X = G.x2 - W / 2;
const THEN_H = 330;
const NOW_H = 280;
const LOSS_H = 110;

export const Negative: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const ruler = k(time, CUE.ruler, CUE.ruler + 1.4, SMOOTH);
  const thenH = THEN_H * k(time, CUE.then - 0.1, CUE.then + 1.0);
  const nowH = NOW_H * k(time, CUE.now - 0.1, CUE.now + 0.9);
  const lossH = LOSS_H * k(time, CUE.fiveYears, CUE.fiveYears + 1.4, SMOOTH);
  const nowTop = BASE - NOW_H;
  const ticks = Math.floor((BASE - RULER_TOP) / 26);

  return (
    <Stage time={time}>
      <Audio src={staticFile("audio/I3.wav")} />

      {/* Upper third: the subject, then the verdict. */}
      <div style={{ position: "absolute", left: G.left - 4, top: G.y1, translate: "0 -100%" }}>
        <Reveal time={time} at={CUE.title} out={CUE.negative - 0.75} dur={1.0}>
          <div style={{ ...DISPLAY, fontSize: 150 }}>Disposable income</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: G.left - 4, top: G.y1, translate: "0 -100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "6px 4px" }}>
          <Letters text="Negative" time={time} at={CUE.negative - 0.1} style={{ ...DISPLAY, fontSize: 150, color: RED }} />
          <div style={{ opacity: k(time, CUE.negative + 0.45, CUE.negative + 0.8) }}>
            <Arrow size={120} angle={90} p={k(time, CUE.negative + 0.45, CUE.negative + 1.35, SOFT)} color={RED} stroke={13} />
          </div>
        </div>
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
        <rect x={THEN_X} y={BASE - thenH} width={W} height={thenH} fill={C.ink} />
        <rect x={NOW_X} y={BASE - nowH} width={W} height={nowH} fill={C.mint} />
        <rect x={NOW_X} y={nowTop} width={W} height={lossH} fill={RED} />
        {/* A hairline seam where the loss meets what's left. */}
        <rect x={NOW_X} y={nowTop + lossH - 1.5} width={W} height={3} fill={C.bg} opacity={lossH > 2 ? 1 : 0} />
      </svg>

      {/* Bar names sit inside each block, top-left. */}
      {[
        { x: THEN_X, top: BASE - thenH, label: "Then", show: k(time, CUE.then + 0.5, CUE.then + 1.0) * (thenH > 200 ? 1 : 0) },
        { x: NOW_X, top: nowTop + lossH, label: "Now", show: k(time, CUE.now + 0.5, CUE.now + 1.0) * (nowH > 170 ? 1 : 0) },
        { x: NOW_X, top: nowTop, label: "Negative", show: lossH > 80 ? k(time, CUE.fiveYears + 0.7, CUE.fiveYears + 1.2) : 0 },
      ].map((l) => (
        <div
          key={l.label}
          style={{ ...DISPLAY, fontSize: 58, color: C.bg, position: "absolute", left: l.x + 24, top: l.top + 20, opacity: l.show }}
        >
          {l.label}
        </div>
      ))}
    </Stage>
  );
};
