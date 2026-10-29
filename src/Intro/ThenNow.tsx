import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../Inflation/Sfx";
import { HERO, LABEL, Reveal, SMOOTH, Stage, T, k, mix } from "./common";

// "…do you ever look back to what you were earning in 2021, five years ago,
// and think to yourself, I don't feel any better off today than I did back then."
// Cue times are seconds into public/audio/I1.wav (C0080 0:02.9 → 0:11.75).
export const THEN_NOW_SECONDS = 9.4;
const CUE = {
  dot: 0.2,
  lookBack: 0.84, // "look back"
  year: 2.3, // "2021"
  ago: 3.3, // "five years ago"
  travel: [4.2, 7.0], // camera runs along the five years to "today"
  better: 6.34, // "better off"
  today: 6.96, // "today"
  backThen: 8.24, // "back then"
} as const;

// World positions: the camera starts on 2021 and pulls back to frame both ends.
const X21 = 960;
const XT = 2460;
const LINE_Y = 640;
const YEAR_Y = 470;
const TICKS = [2022, 2023, 2024, 2025];

export const ThenNow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const travel = k(time, CUE.travel[0], CUE.travel[1], SMOOTH);
  const camX = mix(X21, (X21 + XT) / 2, travel);
  const scale = mix(1, 0.587, travel);
  const sx = (x: number) => 960 + (x - camX) * scale;
  // Drop the camera as it pulls back so the final framing sits on the optical centre.
  const sy = (y: number) => 540 + (y - 540) * scale + 110 * travel;

  const dot = k(time, CUE.dot, CUE.dot + 0.7);
  const ring = k(time, CUE.dot + 0.1, CUE.dot + 1.6, SMOOTH);
  const trail = k(time, CUE.lookBack, CUE.lookBack + 1.2);
  const draw = k(time, CUE.travel[0] + 0.1, CUE.travel[1], SMOOTH);
  const endDot = k(time, CUE.today - 0.1, CUE.today + 0.5);
  const sweep = k(time, CUE.backThen, CUE.backThen + 1.0, SMOOTH);
  const flat = k(time, CUE.backThen + 0.2, CUE.backThen + 0.8);
  const lineEnd = mix(X21, XT, draw);
  const yearSize = 300 * scale;

  return (
    <Stage time={time}>
      <Audio src={staticFile("audio/I1.wav")} />
      <Sfx name="whoosh-soft" at={CUE.dot} volume={0.35} />
      <Sfx name="swoosh" at={CUE.lookBack} volume={0.35} />
      <Sfx name="impact" at={CUE.year} volume={0.5} />
      <Sfx name="draw" at={CUE.travel[0]} volume={0.4} />
      <Sfx name="pop" at={CUE.today} volume={0.45} />
      <Sfx name="tick" at={CUE.better} volume={0.4} />
      <Sfx name="whoosh-soft" at={CUE.backThen} volume={0.3} />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="i1-sweep" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(94,232,166,0)" />
            <stop offset="0.5" stopColor="rgba(220,255,236,0.95)" />
            <stop offset="1" stopColor="rgba(94,232,166,0)" />
          </linearGradient>
        </defs>
        {/* "Look back": a short streak pulls left out of the dot, like rewinding. */}
        <line
          x1={sx(X21)}
          y1={sy(LINE_Y)}
          x2={sx(X21 - 520 * trail)}
          y2={sy(LINE_Y)}
          stroke={T.accent}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={(1 - k(time, CUE.year, CUE.year + 0.8)) * 0.7}
        />
        <line
          x1={sx(X21)}
          y1={sy(LINE_Y)}
          x2={sx(lineEnd)}
          y2={sy(LINE_Y)}
          stroke={T.accent}
          strokeWidth={5}
          strokeLinecap="round"
          opacity={draw > 0 ? 1 : 0}
          style={{ filter: `drop-shadow(0 0 10px ${T.glow})` }}
        />
        {/* "Back then": a light runs from today back to 2021 along the flat line. */}
        <rect
          x={mix(sx(XT), sx(X21), sweep) - 120}
          y={sy(LINE_Y) - 3}
          width={240}
          height={6}
          rx={3}
          fill="url(#i1-sweep)"
          opacity={sweep > 0 && sweep < 1 ? 1 : 0}
        />
        {TICKS.map((y, i) => {
          const x = mix(X21, XT, (i + 1) / 5);
          const on = k(time, CUE.travel[0] + (i + 1) * 0.5, CUE.travel[0] + (i + 1) * 0.5 + 0.5);
          return (
            <line
              key={y}
              x1={sx(x)}
              x2={sx(x)}
              y1={sy(LINE_Y) - 14 * on}
              y2={sy(LINE_Y) + 14 * on}
              stroke={T.muted}
              strokeWidth={2}
              opacity={on}
            />
          );
        })}
        <circle
          cx={sx(X21)}
          cy={sy(LINE_Y)}
          r={(22 + 120 * ring) * scale}
          fill="none"
          stroke={T.accent}
          strokeWidth={2}
          opacity={(1 - ring) * 0.8}
        />
        <circle cx={sx(X21)} cy={sy(LINE_Y)} r={12 * dot} fill={T.accent} style={{ filter: `drop-shadow(0 0 12px ${T.glow})` }} />
        <circle cx={sx(XT)} cy={sy(LINE_Y)} r={12 * endDot} fill={T.accent} style={{ filter: `drop-shadow(0 0 12px ${T.glow})` }} />
      </svg>

      {TICKS.map((y, i) => {
        const x = mix(X21, XT, (i + 1) / 5);
        const on = k(time, CUE.travel[0] + (i + 1) * 0.5, CUE.travel[0] + (i + 1) * 0.5 + 0.6);
        return (
          <div
            key={y}
            style={{
              ...LABEL,
              position: "absolute",
              left: sx(x),
              top: sy(LINE_Y) + 34,
              translate: "-50% 0",
              fontSize: 22,
              letterSpacing: "0.08em",
              opacity: on * 0.75,
            }}
          >
            {y}
          </div>
        );
      })}

      <div style={{ position: "absolute", left: sx(X21), top: sy(YEAR_Y), translate: "-50% -50%" }}>
        <Reveal time={time} at={CUE.year} dur={1.1} size={yearSize}>
          <div style={{ ...HERO, fontSize: yearSize }}>2021</div>
        </Reveal>
      </div>
      <div
        style={{
          ...LABEL,
          position: "absolute",
          left: sx(X21),
          top: sy(LINE_Y) + 34,
          translate: "-50% 0",
          opacity: k(time, CUE.ago, CUE.ago + 0.6) * (1 - k(time, CUE.travel[0], CUE.travel[0] + 0.6)),
        }}
      >
        Five years ago
      </div>

      <div style={{ position: "absolute", left: sx(XT), top: sy(YEAR_Y), translate: "-50% -50%" }}>
        <Reveal time={time} at={CUE.today - 0.15} dur={1.0} size={yearSize}>
          <div style={{ ...HERO, fontSize: yearSize, color: T.accentText, textShadow: T.textGlow }}>Today</div>
        </Reveal>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
        <Reveal time={time} at={CUE.better - 0.1} dur={1.0} size={112}>
          <div style={{ ...HERO, fontSize: 112 }}>Better off?</div>
        </Reveal>
      </div>

      {/* The verdict: one small "no change" mark at the middle of the flat line. */}
      <div
        style={{
          position: "absolute",
          left: sx((X21 + XT) / 2),
          top: sy(LINE_Y),
          translate: "-50% -50%",
          scale: mix(0.6, 1, flat),
          opacity: flat,
          padding: "8px 22px",
          borderRadius: 999,
          background: T.badgeBg,
          border: `2px solid ${T.accent}`,
          ...LABEL,
          fontSize: 22,
          color: T.accentText,
        }}
      >
        No change
      </div>
    </Stage>
  );
};
