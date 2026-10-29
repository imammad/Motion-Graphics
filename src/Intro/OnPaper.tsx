import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../Inflation/Sfx";
import { HERO, LABEL, Reveal, SMOOTH, Stage, T, k, mix } from "./common";

// "You may have progressed in your career. You may have changed jobs. You may have
// had several pay rises. So on paper… you're doing everything well. But when you look
// at what's left in your bank account at the end of each month, you feel like you've
// not actually made much progress."
// Cue times are seconds into public/audio/I2.wav (C0080 0:11.6 → 0:25.55).
export const ON_PAPER_SECONDS = 14.6;
const CUE = {
  steps: [1.24, 2.36, 4.06], // "career", "jobs", "pay rises"
  paper: 5.88, // "on paper"
  but: 8.12, // "But"
  bank: 10.0, // "bank account"
  month: 11.08, // "end of each month"
  progress: 12.76, // "not … made much progress"
} as const;

const STEPS = [
  { label: "Career", icon: "trend", x: 480, h: 200 },
  { label: "New job", icon: "case", x: 820, h: 330 },
  { label: "Pay rise", icon: "pound", x: 1160, h: 460 },
];
const W = 280;
const BOTTOM = 860;
const ARROW = [
  [590, 610],
  [930, 480],
  [1270, 350],
  [1620, 205],
];

const Icon: React.FC<{ kind: string }> = ({ kind }) => (
  <svg width={30} height={30} viewBox="0 0 30 30">
    {kind === "trend" ? (
      <path d="M4 22 L12 14 L17 19 L26 9 M19 9 H26 V16" fill="none" stroke={T.chipInk} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    ) : kind === "case" ? (
      <g fill="none" stroke={T.chipInk} strokeWidth={2.6} strokeLinejoin="round">
        <rect x={4} y={10} width={22} height={15} rx={3} />
        <path d="M11 10 V7 H19 V10" />
      </g>
    ) : (
      <text x={15} y={23} textAnchor="middle" fontSize={22} fontWeight={800} fill={T.chipInk} fontFamily="Poppins">
        £
      </text>
    )}
  </svg>
);

export const OnPaper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  // The climb shrinks into the left half when he says "But".
  const split = k(time, CUE.but, CUE.but + 1.1, SMOOTH);
  const s = mix(1, 0.55, split);
  const dx = mix(0, -48, split);
  const dy = mix(0, 310, split);

  const arrowLen = ARROW.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - ARROW[i][0], p[1] - ARROW[i][1]), 0);
  const arrow = k(time, CUE.paper - 0.1, CUE.paper + 1.0, SMOOTH);
  const head = k(time, CUE.paper + 0.8, CUE.paper + 1.2);

  const divider = k(time, CUE.but + 0.4, CUE.but + 1.3, SMOOTH);
  const flatDraw = k(time, CUE.bank - 0.3, CUE.bank + 1.2, SMOOTH);
  const months = k(time, CUE.month, CUE.month + 0.8);
  const ghost = k(time, CUE.progress, CUE.progress + 0.9, SMOOTH);
  // "Not much progress": the balance tries to lift, then sinks back to flat.
  const bump = interpolate(time, [CUE.progress + 0.2, CUE.progress + 0.6, CUE.progress + 1.3], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SMOOTH,
  });
  const FX0 = 1120;
  const FX1 = 1780;
  const FY = 640;
  const dotX = mix(FX0, FX1, flatDraw);

  return (
    <Stage time={time}>
      <Audio src={staticFile("audio/I2.wav")} />
      {CUE.steps.map((at, i) => (
        <Sfx key={i} name={(["blip2", "blip3", "blip5"] as const)[i]} at={at} volume={0.45} />
      ))}
      <Sfx name="riser" at={CUE.paper - 0.3} volume={0.3} />
      <Sfx name="pop-high" at={CUE.paper + 0.9} volume={0.4} />
      <Sfx name="whoosh" at={CUE.but} volume={0.4} />
      <Sfx name="draw" at={CUE.bank - 0.3} volume={0.35} />
      <Sfx name="tick" at={CUE.month} volume={0.4} />
      <Sfx name="blip-low" at={CUE.progress + 0.6} volume={0.45} />

      {/* Phase A: the climb. Scales into the left half on "But". */}
      <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", translate: `${dx}px ${dy}px`, scale: s }}>
        {STEPS.map((st, i) => {
          const p = k(time, CUE.steps[i] - 0.15, CUE.steps[i] + 0.8);
          return (
            <div
              key={st.label}
              style={{
                position: "absolute",
                left: st.x,
                top: BOTTOM - st.h,
                width: W,
                height: st.h,
                transformOrigin: "50% 100%",
                scale: `1 ${p}`,
                borderRadius: 28,
                background: "linear-gradient(180deg, rgba(67,224,151,0.30) 0%, rgba(67,224,151,0.06) 100%)",
                border: `1.5px solid rgba(67,224,151,${0.25 + 0.35 * p})`,
                boxShadow: "0 0 40px rgba(67,224,151,0.12)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  top: 24,
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: T.chipBg,
                  border: `1.5px solid ${T.chipBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: k(time, CUE.steps[i] + 0.3, CUE.steps[i] + 0.7),
                }}
              >
                <Icon kind={st.icon} />
              </div>
              <div
                style={{
                  ...LABEL,
                  position: "absolute",
                  left: 26,
                  bottom: 24,
                  fontSize: 22,
                  color: T.ink,
                  opacity: k(time, CUE.steps[i] + 0.35, CUE.steps[i] + 0.8),
                }}
              >
                {st.label}
              </div>
            </div>
          );
        })}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <polyline
            points={ARROW.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke={T.accent}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${arrowLen} ${arrowLen}`}
            strokeDashoffset={arrowLen * (1 - arrow)}
            opacity={arrow > 0 ? 1 : 0}
            style={{ filter: `drop-shadow(0 0 12px ${T.glow})` }}
          />
          <path
            d="M-26 -16 L0 0 L-26 16"
            transform={`translate(${ARROW[3][0]} ${ARROW[3][1]}) rotate(-22) scale(${head})`}
            fill="none"
            stroke={T.accent}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Big "On paper" hands over to a small matching label once the frame splits. */}
      <div style={{ position: "absolute", left: 150, top: 150 }}>
        <Reveal time={time} at={CUE.paper} out={CUE.but} dur={1.0} size={128}>
          <div style={{ ...HERO, fontSize: 128 }}>On paper</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: 480, top: 250, translate: "-50% 0" }}>
        <Reveal time={time} at={CUE.but + 0.6} size={72}>
          <div style={{ ...HERO, fontSize: 72 }}>On paper</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: 1450, top: 250, translate: "-50% 0" }}>
        <Reveal time={time} at={CUE.bank - 0.2} size={72}>
          <div style={{ ...HERO, fontSize: 72, color: T.accentText }}>In the bank</div>
        </Reveal>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={960} x2={960} y1={540 - 330 * divider} y2={540 + 330 * divider} stroke={T.axis} strokeWidth={1.5} opacity={divider} />

        {/* The climb you'd expect, as a faint ghost… */}
        <line
          x1={FX0}
          y1={FY}
          x2={mix(FX0, FX1, ghost)}
          y2={mix(FY, FY - 300, ghost)}
          stroke={T.muted}
          strokeWidth={3}
          strokeDasharray="10 12"
          opacity={ghost * 0.55}
        />
        {/* …and the balance that actually stays flat. */}
        <line x1={FX0} y1={FY} x2={dotX} y2={FY} stroke={T.accent} strokeWidth={6} strokeLinecap="round" opacity={flatDraw > 0 ? 1 : 0} style={{ filter: `drop-shadow(0 0 10px ${T.glow})` }} />
        {Array.from({ length: 12 }, (_, i) => {
          const x = mix(FX0, FX1, (i + 0.5) / 12);
          const on = k(time, CUE.month + i * 0.04, CUE.month + i * 0.04 + 0.4);
          return <line key={i} x1={x} x2={x} y1={FY + 26} y2={FY + 26 + 12 * on} stroke={T.muted} strokeWidth={2} opacity={on * 0.7} />;
        })}
        <circle cx={dotX} cy={FY - 70 * bump} r={13 * (flatDraw > 0 ? 1 : 0)} fill={T.accent} style={{ filter: `drop-shadow(0 0 14px ${T.glow})` }} />
      </svg>
      <div
        style={{
          ...LABEL,
          position: "absolute",
          left: (FX0 + FX1) / 2,
          top: FY + 58,
          translate: "-50% 0",
          fontSize: 20,
          opacity: months * 0.8,
        }}
      >
        Left at the end of each month
      </div>
    </Stage>
  );
};
