import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { POP, SceneProps, THEMES, fmt, ramp } from "./theme";
import { Sfx } from "./Sfx";

// "What they really mean is that prices are just increasing at a slower rate…
// So if it was 10% before and it's now 5%, actually over the course of the period
// it's risen by 15.5%. It's not gone up by 10% and back down by 5%. It's now
// growing and the old price is now bedded in."
// Cue times are seconds into public/audio/T3.wav (C0080 02:55.1 → 03:11.5).
export const STAIRCASE_SECONDS = 17.5;
const CUE = {
  step1: 0.9, // "prices are just increasing"
  step2: 4.4, // "10% before"
  step3: 5.4, // "now 5%"
  total: 8.3, // "risen by 15.5%"
  myth: 10.0, // "not gone up by 10% and back down by 5%"
  mythOut: 12.0,
  punch: 12.3, // "It's now growing"
  settle: 15.2, // "the old price is now bedded in"
} as const;

const VALUES = [100, 110, 115.5];
const LABELS = ["Start", "Year 1 · 10% inflation", "Year 2 · 5% inflation"];
const X0 = 260;
const X1 = 1500;
const Y0 = 420;
const Y1 = 820;
const FLOOR = 100 - 15.5 * 1.4;
const STEP_W = (X1 - X0) / VALUES.length;
const py = (v: number) => Y1 - ((Y1 - Y0) * (v - FLOOR)) / (115.5 - FLOOR);
const MYTH = 104.5;

export const Staircase: React.FC<SceneProps> = ({ theme }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const starts = [CUE.step1, CUE.step2, CUE.step3];
  const rise = starts.map((s) => ramp(time, s, s + 0.7));
  const pop = starts.map((s) => ramp(time, s + 0.45, s + 0.85, POP));

  // Staircase outline grows piece by piece with each step.
  const pieces = VALUES.map((v, i) => (i === 0 ? STEP_W : Math.abs(py(VALUES[i - 1]) - py(v)) + STEP_W));
  const total = pieces.reduce((a, b) => a + b, 0);
  const drawn = pieces.reduce((acc, len, i) => acc + len * rise[i], 0);
  let d = `M${X0} ${py(VALUES[0])}`;
  VALUES.forEach((v, i) => {
    if (i > 0) d += ` V${py(v)}`;
    d += ` H${X0 + (i + 1) * STEP_W}`;
  });

  const y0 = py(VALUES[0]);
  const yl = py(VALUES[VALUES.length - 1]);
  const totalIn = ramp(time, CUE.total, CUE.total + 0.6);
  const myth = ramp(time, CUE.myth, CUE.myth + 0.6);
  const mythStrike = ramp(time, CUE.myth + 1.0, CUE.myth + 1.4);
  const mythOut = 1 - ramp(time, CUE.mythOut, CUE.mythOut + 0.5);
  const punch = ramp(time, CUE.punch, CUE.punch + 0.6);
  const settle = ramp(time, CUE.settle, CUE.settle + 0.6);
  const mythX = X0 + 2 * STEP_W;
  const mythY = py(MYTH) - 70 * (1 - myth);

  return (
    <Frame
      t={t}
      time={time}
      heading="What ‘inflation is falling’ really means"
      kicker="PRICE OF A £100 BASKET"
      source="Illustrative example: 10% inflation, then 5%"
    >
      <Audio src={staticFile("audio/T3.wav")} />
      <Sfx name="blip1" at={CUE.step1 + 0.45} volume={0.45} />
      <Sfx name="blip3" at={CUE.step2 + 0.45} volume={0.45} />
      <Sfx name="blip5" at={CUE.step3 + 0.45} volume={0.45} />
      <Sfx name="ding" at={CUE.total} volume={0.35} />
      <Sfx name="blip-low" at={CUE.myth} volume={0.4} />
      <Sfx name="strike" at={CUE.myth + 1.0} volume={0.45} />
      <Sfx name="impact" at={CUE.punch} volume={0.55} />
      <Sfx name="whoosh-soft" at={CUE.settle} volume={0.3} />
      {VALUES.map((v, i) => (
        <div key={`b${i}`}>
          <div
            style={{
              position: "absolute",
              left: X0 + i * STEP_W,
              top: py(v),
              width: STEP_W,
              height: Y1 - py(v),
              transformOrigin: "50% 100%",
              scale: `1 ${rise[i]}`,
              background: t.block,
              borderLeft: `1.5px solid ${i === 0 ? "rgba(0,0,0,0)" : t.edge}`,
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: X0 + i * STEP_W + STEP_W / 2,
              top: 846,
              width: STEP_W,
              translate: "-50% 0",
              textAlign: "center",
              fontSize: 22,
              color: t.muted,
              opacity: rise[i],
            }}
          >
            {LABELS[i]}
          </div>
          <div
            style={{
              position: "absolute",
              left: X0 + i * STEP_W + STEP_W / 2,
              top: py(v),
              translate: "-50% -130%",
              transformOrigin: "50% 100%",
              scale: pop[i],
              padding: i === 2 ? "10px 22px" : 0,
              borderRadius: 14,
              background: i === 2 ? t.chipBg : "rgba(0,0,0,0)",
              border: i === 2 ? `2px solid ${t.chipBorder}` : "none",
              boxShadow: i === 2 ? t.chipGlow : "none",
              fontSize: i === 2 ? 46 : 38,
              fontWeight: 700,
              color: i === 2 ? t.chipInk : t.ink,
              textShadow: i === 2 ? t.textGlow : "none",
              whiteSpace: "nowrap",
            }}
          >
            {fmt(v, "£", "", i === 2 ? 2 : 0)}
          </div>
        </div>
      ))}

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={X0 - 20} x2={X1 + 20} y1={Y1} y2={Y1} stroke={t.axis} strokeWidth={2} opacity={rise[0]} />
        <line
          x1={X0}
          x2={X1}
          y1={y0}
          y2={y0}
          stroke={t.muted}
          strokeWidth={2.5}
          strokeDasharray="10 10"
          opacity={totalIn}
        />
        <path
          d={d}
          fill="none"
          stroke={t.accent}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${total + 2} ${total + 2}`}
          strokeDashoffset={total - drawn}
          style={{ filter: `drop-shadow(0 0 ${10 + 14 * settle}px ${t.glow})` }}
        />
        <path
          d={`M${X1 + 24} ${y0} h14 V${y0 + (yl - y0) * totalIn} h-14`}
          fill="none"
          stroke={t.accent}
          strokeWidth={3}
          opacity={totalIn}
        />
        <g opacity={myth * mythOut}>
          <line
            x1={mythX}
            x2={mythX + STEP_W}
            y1={mythY}
            y2={mythY}
            stroke={t.alert}
            strokeWidth={4}
            strokeDasharray="14 10"
          />
        </g>
      </svg>

      {/* Inflation badges on each riser; the smaller 5% still pushes prices up. */}
      {[1, 2].map((i) => {
        const r = ((VALUES[i] / VALUES[i - 1] - 1) * 100).toFixed(0);
        const b = ramp(time, starts[i] + 0.1, starts[i] + 0.45, POP);
        return (
          <div
            key={`r${i}`}
            style={{
              position: "absolute",
              left: X0 + i * STEP_W,
              top: (py(VALUES[i - 1]) + py(VALUES[i])) / 2 - 64,
              translate: "-50% -50%",
              scale: b,
              padding: "8px 18px",
              borderRadius: 999,
              background: t.badgeBg,
              border: `2px solid ${t.accent}`,
              color: t.accentText,
              fontSize: i === 1 ? 34 : 26,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            +{r}%
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: X0 + 24,
          top: y0 + 18,
          width: STEP_W - 60,
          fontSize: 20,
          fontWeight: 600,
          lineHeight: 1.35,
          color: t.muted,
          opacity: totalIn,
        }}
      >
        Starting price — it never comes back
      </div>

      <div
        style={{
          position: "absolute",
          left: 1560,
          top: (y0 + yl) / 2,
          translate: "0 -50%",
          opacity: totalIn,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, color: t.accentText, textShadow: t.textGlow }}>+15.5%</div>
        <div style={{ fontSize: 20, color: t.muted }}>higher, for good</div>
      </div>

      {/* The myth: "up 10%, then back down 5%" — shown, then struck out. */}
      <div
        style={{
          position: "absolute",
          left: mythX + STEP_W / 2,
          top: mythY - 50,
          translate: "-50% 0",
          opacity: myth * mythOut,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 26,
          fontWeight: 700,
          color: t.alert,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ position: "relative" }}>
          Back down to £104.50?
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "52%",
              height: 4,
              width: "100%",
              background: t.alert,
              transformOrigin: "0 50%",
              scale: `${mythStrike} 1`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          display: "flex",
          justifyContent: "center",
          opacity: punch,
          translate: `0px ${(1 - punch) * 30}px`,
        }}
      >
        <div
          style={{
            padding: "14px 34px",
            borderRadius: 14,
            background: t.chipBg,
            border: `2px solid ${t.chipBorder}`,
            boxShadow: t.chipGlow,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: "0.04em",
            color: t.chipInk,
            whiteSpace: "nowrap",
          }}
        >
          LOWER INFLATION DOES NOT MEAN LOWER PRICES
        </div>
      </div>
    </Frame>
  );
};
