import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "../Inflation/Sfx";
import { HERO, LABEL, Reveal, SMOOTH, Stage, T, k, mix } from "./common";

// "…I remember feeling like I had more disposable income back then than I do now,
// which seems really weird. And the reason for this is that in the past five years,
// we've actually experienced a negative period of disposable income."
// Cue times are seconds into public/audio/I3.wav (C0080 0:34.5 → 0:46.9).
export const NEGATIVE_SECONDS = 13.0;
const CUE = {
  title: 1.96, // "disposable income"
  then: 2.78, // "back then"
  now: 3.82, // "now"
  fiveYears: 7.56, // "in the past five years"
  negative: 10.36, // "negative"
  income: 11.6, // "…disposable income"
} as const;

// Phase A circles → phase B chart points.
const THEN = { x: 640, y: 600, r: 230, to: [300, 520] };
const NOW = { x: 1290, y: 600, r: 150, to: [1620, 760] };
const AXIS_Y = 520;
const CURVE = "M300 520 C 640 520, 860 545, 1080 620 S 1460 760, 1620 760";
const AREA = `${CURVE} L 1620 520 Z`;

export const Negative: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const thenIn = k(time, CUE.then - 0.1, CUE.then + 0.9);
  const nowIn = k(time, CUE.now - 0.1, CUE.now + 0.8);
  const squeeze = k(time, CUE.now + 0.8, CUE.now + 1.8, SMOOTH);
  const morph = k(time, CUE.fiveYears, CUE.fiveYears + 1.1, SMOOTH);
  const axis = k(time, CUE.fiveYears + 0.3, CUE.fiveYears + 1.3, SMOOTH);
  const curve = k(time, CUE.fiveYears + 0.9, CUE.negative + 0.2, SMOOTH);
  const area = k(time, CUE.negative, CUE.negative + 0.9);
  const labels = k(time, CUE.then + 0.3, CUE.then + 0.9) * (1 - k(time, CUE.fiveYears - 0.1, CUE.fiveYears + 0.4));

  const circle = (c: typeof THEN, appear: number, rScale: number) => ({
    cx: mix(c.x, c.to[0], morph),
    cy: mix(c.y, c.to[1], morph),
    r: mix(c.r * rScale, 12, morph) * appear,
  });
  const a = circle(THEN, thenIn, 1);
  const b = circle(NOW, nowIn, mix(1, 0.8, squeeze));
  const nowColor = morph > 0.5 ? T.alert : T.accent;

  return (
    <Stage time={time}>
      <Audio src={staticFile("audio/I3.wav")} />
      <Sfx name="tick" at={CUE.title} volume={0.4} />
      <Sfx name="impact" at={CUE.then} volume={0.45} />
      <Sfx name="pop" at={CUE.now} volume={0.4} />
      <Sfx name="blip-low" at={CUE.now + 0.9} volume={0.35} />
      <Sfx name="whoosh" at={CUE.fiveYears} volume={0.4} />
      <Sfx name="draw" at={CUE.fiveYears + 0.9} volume={0.35} />
      <Sfx name="impact" at={CUE.negative} volume={0.55} />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="i3-fill" cx="50%" cy="40%" r="65%">
            <stop offset="0" stopColor="rgba(94,232,166,0.55)" />
            <stop offset="1" stopColor="rgba(1,87,42,0.25)" />
          </radialGradient>
          <linearGradient id="i3-neg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(255,143,99,0.05)" />
            <stop offset="1" stopColor="rgba(255,143,99,0.35)" />
          </linearGradient>
        </defs>

        <line x1={260} x2={mix(260, 1700, axis)} y1={AXIS_Y} y2={AXIS_Y} stroke={T.axis} strokeWidth={2} opacity={axis} />
        <path d={AREA} fill="url(#i3-neg)" opacity={area} />
        <path
          d={CURVE}
          fill="none"
          stroke={T.alert}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - curve}
          opacity={curve > 0 ? 1 : 0}
          style={{ filter: `drop-shadow(0 0 12px ${T.alertGlow})` }}
        />

        <circle {...a} fill="url(#i3-fill)" stroke={T.accent} strokeWidth={2} style={{ filter: "drop-shadow(0 0 40px rgba(67,224,151,0.25))" }} />
        <circle
          {...b}
          fill={morph > 0.5 ? T.alert : "url(#i3-fill)"}
          stroke={nowColor}
          strokeWidth={2}
          opacity={mix(0.75, 1, morph)}
          style={{ filter: `drop-shadow(0 0 30px ${morph > 0.5 ? T.alertGlow : "rgba(67,224,151,0.18)"})` }}
        />
      </svg>

      <div style={{ ...LABEL, position: "absolute", left: THEN.x, top: THEN.y + THEN.r + 40, translate: "-50% 0", fontSize: 30, color: T.ink, opacity: labels }}>
        Then
      </div>
      <div
        style={{
          ...LABEL,
          position: "absolute",
          left: NOW.x,
          top: NOW.y + NOW.r + 40,
          translate: "-50% 0",
          fontSize: 30,
          color: T.ink,
          opacity: labels * k(time, CUE.now + 0.2, CUE.now + 0.7),
        }}
      >
        Now
      </div>
      <div style={{ ...LABEL, position: "absolute", left: 1700, top: AXIS_Y - 20, translate: "-100% -100%", fontSize: 20, opacity: axis * 0.75 }}>
        Past five years
      </div>
      <div style={{ ...LABEL, position: "absolute", left: 226, top: AXIS_Y, translate: "-100% -50%", fontSize: 22, opacity: axis * 0.75 }}>
        0
      </div>

      {/* Title: centred hero first, then a quiet label once the chart takes over. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 140, textAlign: "center" }}>
        <Reveal time={time} at={CUE.title} out={CUE.fiveYears} size={96}>
          <div style={{ ...HERO, fontSize: 96 }}>Disposable income</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: 260, top: 150 }}>
        <Reveal time={time} at={CUE.fiveYears + 0.5} size={28}>
          <div style={{ ...LABEL, fontSize: 28, color: T.accentText }}>Disposable income</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", left: 252, top: 190 }}>
        <Reveal time={time} at={CUE.negative - 0.1} dur={1.0} size={210}>
          <div style={{ ...HERO, fontSize: 210, color: T.alertText }}>Negative</div>
        </Reveal>
      </div>
    </Stage>
  );
};
