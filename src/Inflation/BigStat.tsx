import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { Backdrop, OUT, ThemeName, THEMES, Timed, fmt, ramp } from "./theme";

// Big stat (T7): one large number with caption and sublines, optionally beside
// a progress ring or a 10×10 dot grid. All cue times are seconds into `audio`.
export type BigStatProps = {
  theme: ThemeName;
  audio: string;
  heading: string;
  kicker: string;
  source: string;
  backdrop: Backdrop;
  align: "left" | "center";
  mode: "number" | "ring" | "dots";
  tone: "accent" | "alert";
  flip: boolean;
  prefix: string;
  suffix: string;
  decimals: number;
  // The number rolls to each stage's value on its cue; a stage may swap the caption.
  stages: { at: number; value: number; caption: string }[];
  subs: Timed[];
  percent: number;
  ringInner: string;
  ringLabel: string;
  restLabel: string;
  cue: { vis: number; fill: number; inner: number; label: number; rest: number; pulse: number };
};

const CY = 580;
const R = 240;
const CIRC = 2 * Math.PI * R;

export const BigStat: React.FC<BigStatProps> = (p) => {
  const t = THEMES[p.theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const alert = p.tone === "alert";
  const single = p.mode === "number";
  const flip = p.flip && !single;
  const vx = flip ? 540 : 1380;
  const fill = alert ? t.alert : t.accent;
  const fillGlow = alert ? t.alertGlow : t.glow;
  const fillText = alert ? t.alertText : t.accentText;

  let value = 0;
  for (const s of p.stages) value += (s.value - value) * ramp(time, s.at - 0.15, s.at + 1.0, OUT);
  const first = p.stages[0]?.at ?? 0;
  const numIn = ramp(time, first - 0.3, first + 0.35);
  const pulse = interpolate(time, [p.cue.pulse, p.cue.pulse + 0.25, p.cue.pulse + 0.8], [1, 1.07, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const longest = Math.max(...p.stages.map((s) => fmt(s.value, p.prefix, p.suffix, p.decimals).length), 2);
  const boxW = single ? 1620 : 760;
  const fs = Math.min(single ? 260 : 220, Math.floor(boxW / (longest * 0.62)));

  const vis = ramp(time, p.cue.vis, p.cue.vis + 0.6);
  const fillP = ramp(time, p.cue.fill, p.cue.fill + 1.1);
  const inner = ramp(time, p.cue.inner, p.cue.inner + 0.5);
  const label = ramp(time, p.cue.label, p.cue.label + 0.5);
  const pct = Math.round(p.percent * fillP);

  return (
    <Frame t={t} time={time} heading={p.heading} kicker={p.kicker} source={p.source} backdrop={p.backdrop} center={p.align === "center"}>
      <Audio src={staticFile(p.audio)} />
      <div
        style={{
          position: "absolute",
          left: flip ? 1010 : 150,
          top: 600,
          width: boxW,
          translate: "0 -50%",
          display: "flex",
          flexDirection: "column",
          alignItems: single ? "center" : "flex-start",
          textAlign: single ? "center" : "left",
          gap: 18,
        }}
      >
        <div
          style={{
            fontSize: fs,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: fillText,
            textShadow: alert ? "none" : t.textGlow,
            whiteSpace: "nowrap",
            opacity: numIn,
            translate: `0px ${(1 - numIn) * 30}px`,
            scale: pulse,
          }}
        >
          {fmt(value, p.prefix, p.suffix, p.decimals)}
        </div>
        <div style={{ display: "grid" }}>
          {p.stages.map((s, i) => {
            const next = p.stages[i + 1];
            const o = ramp(time, s.at + 0.2, s.at + 0.7) * (next ? 1 - ramp(time, next.at, next.at + 0.4) : 1);
            return (
              <div
                key={i}
                style={{
                  gridArea: "1 / 1",
                  fontSize: 36,
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: t.ink,
                  maxWidth: boxW,
                  opacity: o,
                  translate: `0px ${(1 - Math.min(1, o * 1.5)) * 14}px`,
                }}
              >
                {s.caption}
              </div>
            );
          })}
        </div>
        {p.subs.map((s, i) => {
          const o = ramp(time, s.at, s.at + 0.5);
          return (
            <div
              key={i}
              style={{
                fontSize: 26,
                lineHeight: 1.4,
                color: t.muted,
                maxWidth: boxW,
                opacity: o,
                translate: `0px ${(1 - o) * 14}px`,
              }}
            >
              {s.text}
            </div>
          );
        })}
      </div>

      {p.mode === "ring" ? (
        <>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <circle cx={vx} cy={CY} r={R} fill="none" stroke={t.ringTrack} strokeWidth={34} opacity={vis} />
            <circle
              cx={vx}
              cy={CY}
              r={R}
              fill="none"
              stroke={fill}
              strokeWidth={34}
              strokeLinecap="round"
              transform={`rotate(-90 ${vx} ${CY})`}
              strokeDasharray={`${CIRC} ${CIRC}`}
              strokeDashoffset={CIRC * (1 - (p.percent / 100) * fillP)}
              opacity={fillP > 0 ? 1 : 0}
              style={{ filter: `drop-shadow(0 0 14px ${fillGlow})` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: vx,
              top: CY,
              translate: "-50% -50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              textAlign: "center",
              opacity: vis,
            }}
          >
            <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1, color: fillText, textShadow: t.textGlow }}>
              {pct}%
            </div>
            <div style={{ fontSize: 22, fontWeight: 500, color: t.muted, maxWidth: 330, lineHeight: 1.35, opacity: inner }}>
              {p.ringInner}
            </div>
          </div>
          {p.ringLabel ? (
            <div
              style={{
                position: "absolute",
                left: vx,
                top: 862,
                translate: "-50% 0",
                fontSize: 26,
                fontWeight: 600,
                color: t.ink,
                whiteSpace: "nowrap",
                opacity: label,
              }}
            >
              {p.ringLabel}
            </div>
          ) : null}
        </>
      ) : null}

      {p.mode === "dots" ? <Dots {...p} vx={vx} time={time} fillP={fillP} vis={vis} label={label} pct={pct} /> : null}
    </Frame>
  );
};

const Dots: React.FC<
  BigStatProps & { vx: number; time: number; fillP: number; vis: number; label: number; pct: number }
> = ({ theme, tone, percent, ringInner, restLabel, cue, vx, time, fillP, vis, label, pct }) => {
  const t = THEMES[theme];
  const alert = tone === "alert";
  const fill = alert ? t.alert : t.accent;
  const fillGlow = alert ? t.alertGlow : t.glow;
  const on = Math.round(percent);
  const lit = on * fillP;
  const rest = ramp(time, cue.rest, cue.rest + 0.5);
  return (
    <>
      {Array.from({ length: 100 }, (_, k) => {
        const row = Math.floor(k / 10);
        const col = k % 10;
        const now = k < lit;
        const isOn = k < on;
        const r = isOn ? 0 : ramp(time, cue.rest + (k - on) * 0.018, cue.rest + 0.35 + (k - on) * 0.018);
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: vx - 238 + col * 48,
              top: CY - 238 + row * 48,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: now ? fill : t.dotOff,
              boxShadow: now ? `0 0 14px ${fillGlow}` : "none",
              scale: isOn ? (now ? 1 : 0.86) : 0.86 * vis,
              opacity: isOn ? Math.max(vis, now ? 1 : 0) : 1,
            }}
          >
            {!isOn ? (
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: t.alert, opacity: r * 0.7 }} />
            ) : null}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: vx,
          top: 836,
          translate: "-50% 0",
          fontSize: 30,
          fontWeight: 700,
          color: alert ? t.alertText : t.accentText,
          whiteSpace: "nowrap",
          opacity: label,
        }}
      >
        {pct}% {ringInner}
      </div>
      {restLabel ? (
        <div
          style={{
            position: "absolute",
            left: vx,
            top: 884,
            translate: "-50% 0",
            fontSize: 24,
            fontWeight: 600,
            color: t.alertText,
            whiteSpace: "nowrap",
            opacity: rest,
          }}
        >
          {restLabel}
        </div>
      ) : null}
    </>
  );
};
