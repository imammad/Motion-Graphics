import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { OUT, POP, SceneProps, THEMES, fmt, ramp } from "./theme";

// "…let's say your monthly cost £2,000 five years ago, the same basket of goods
// today would cost you around £2,500. So you've got to find an extra £500 a month
// just to pay for the same stuff."
// Cue times are seconds into public/audio/T2.wav (C0080 01:36.8 → 01:51.0).
export const VALUE_SHIFT_SECONDS = 15;
const CUE = {
  from: 4.2, // "£2,000"
  arrow: 6.6, // "the same basket of goods today"
  to: 9.2, // "£2,500"
  extra: 11.6, // "an extra £500 a month"
} as const;

const FROM = 2000;
const TO = 2552;
const W = 1620;
const BASE_W = (W * FROM) / TO;

export const ValueShift: React.FC<SceneProps> = ({ theme }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const fromIn = ramp(time, CUE.from - 0.3, CUE.from + 0.3);
  const fromCount = ramp(time, CUE.from - 0.2, CUE.from + 0.7, OUT);
  const base = ramp(time, CUE.from, CUE.from + 1.2);
  const arrow = ramp(time, CUE.arrow, CUE.arrow + 1.0);
  const toIn = ramp(time, CUE.to - 0.6, CUE.to - 0.1);
  const toCount = ramp(time, CUE.to - 0.1, CUE.to + 1.0, OUT);
  const chip = ramp(time, CUE.to + 0.4, CUE.to + 0.85, POP);
  const extra = ramp(time, CUE.extra, CUE.extra + 0.8);
  const extraLabel = ramp(time, CUE.extra + 0.4, CUE.extra + 0.9);
  const fs = 150;

  return (
    <Frame
      t={t}
      time={time}
      heading="The same monthly shop, five years apart"
      kicker="PRICES +27.6% SINCE 2021"
      source="Illustrative: £2,000 × CPI +27.6% (2021–2026)"
    >
      <Audio src={staticFile("audio/T2.wav")} />
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 330,
          height: 330,
          display: "flex",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            opacity: fromIn,
            translate: `0px ${(1 - fromIn) * 30}px`,
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              padding: "8px 20px",
              borderRadius: 999,
              border: `2px solid ${t.axis}`,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: t.muted,
            }}
          >
            2021
          </div>
          <div style={{ fontSize: fs, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em", color: t.ink }}>
            {fmt(FROM * fromCount)}
          </div>
          <div style={{ fontSize: 28, color: t.muted }}>per month</div>
        </div>

        <div style={{ flex: "1 1 auto", minWidth: 160, position: "relative", height: 200 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 26,
              top: 98,
              height: 5,
              borderRadius: 4,
              background: t.accent,
              boxShadow: `0 0 14px ${t.glow}`,
              transformOrigin: "0 50%",
              scale: `${arrow} 1`,
            }}
          />
          <svg width={34} height={40} style={{ position: "absolute", right: 0, top: 80, opacity: arrow > 0.9 ? 1 : 0 }}>
            <path d="M0 0 L34 20 L0 40 Z" fill={t.accent} />
          </svg>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 18,
              translate: "-50% 0",
              scale: chip,
              opacity: Math.min(1, chip * 3),
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px",
              borderRadius: 999,
              background: t.chipBg,
              border: `2px solid ${t.chipBorder}`,
              boxShadow: t.chipGlow,
              color: t.chipInk,
              fontSize: 30,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            <svg width={18} height={16}>
              <path d="M9 0 L18 16 L0 16 Z" fill={t.chipInk} />
            </svg>
            +27.6%
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 18,
            opacity: toIn,
            translate: `0px ${(1 - toIn) * 30}px`,
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              background: t.accentSoft,
              border: `2px solid ${t.accent}`,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: t.accentText,
            }}
          >
            TODAY
          </div>
          <div
            style={{
              fontSize: fs,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: t.accentText,
              textShadow: t.textGlow,
            }}
          >
            {fmt(FROM + (TO - FROM) * toCount)}
          </div>
          <div style={{ fontSize: 28, color: t.muted }}>per month</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 150 + BASE_W + (W - BASE_W) / 2,
          top: 770,
          translate: "-50% 0",
          fontSize: 32,
          fontWeight: 700,
          color: t.accentText,
          whiteSpace: "nowrap",
          opacity: extraLabel,
          textShadow: t.textGlow,
        }}
      >
        +£552 a month
      </div>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 826,
          width: W,
          height: 64,
          borderRadius: 14,
          background: t.track,
          overflow: "hidden",
          opacity: ramp(time, CUE.from - 0.3, CUE.from),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: BASE_W * base,
            background: t.barBase,
            display: "flex",
            alignItems: "center",
            paddingLeft: 24,
            boxSizing: "border-box",
            fontSize: 22,
            fontWeight: 600,
            color: t.barBaseInk,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          What it cost in 2021
        </div>
        <div
          style={{
            position: "absolute",
            left: BASE_W,
            top: 0,
            bottom: 0,
            width: (W - BASE_W) * extra,
            background: t.accent,
            boxShadow: t.chipGlow,
          }}
        />
      </div>
    </Frame>
  );
};
