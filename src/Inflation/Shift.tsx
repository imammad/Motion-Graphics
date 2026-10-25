import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { Backdrop, OUT, POP, ThemeName, THEMES, Timed, fmt, ramp } from "./theme";

// Value shift (T2) for any from → to pair, in three layouts: side by side,
// cards, or stacked. A decrease turns the lost slice of the bar alert orange.
export type ShiftProps = {
  theme: ThemeName;
  audio: string;
  heading: string;
  kicker: string;
  source: string;
  backdrop: Backdrop;
  align: "left" | "center";
  layout: "side" | "cards" | "stack";
  from: number;
  to: number;
  prefix: string;
  suffix: string;
  decimals: number;
  fromLabel: string;
  toLabel: string;
  unit: string;
  baseText: string;
  extraText: string;
  deltaText: string;
  // Lines under the bar, each replacing the last on its cue.
  notes: Timed[];
  cue: { from: number; arrow: number; to: number; extra: number };
  countSeconds: number;
};

const W = 1620;

export const Shift: React.FC<ShiftProps> = (p) => {
  const t = THEMES[p.theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const { cue } = p;

  const up = p.to >= p.from;
  const fromIn = ramp(time, cue.from - 0.3, cue.from + 0.3);
  const fromCount = ramp(time, cue.from - 0.2, cue.from + 0.7, OUT);
  const base = ramp(time, cue.from, cue.from + 1.2);
  const arrow = ramp(time, cue.arrow, cue.arrow + 1.0);
  const toIn = ramp(time, cue.to - 0.6, cue.to - 0.1);
  const toCount = ramp(time, cue.to - 0.1, cue.to + p.countSeconds, OUT);
  const chip = ramp(time, cue.to + p.countSeconds * 0.5, cue.to + p.countSeconds * 0.5 + 0.45, POP);
  const extra = ramp(time, cue.extra, cue.extra + 0.8);
  const extraLabel = ramp(time, cue.extra + 0.4, cue.extra + 0.9);

  const f = (v: number) => fmt(v, p.prefix, p.suffix, p.decimals);
  const fromText = f(p.from * fromCount);
  const toText = f(p.from + (p.to - p.from) * toCount);
  const maxLen = Math.max(f(p.from).length, f(p.to).length);
  const cards = p.layout === "cards";
  const fs = cards ? Math.min(124, Math.floor(500 / (maxLen * 0.62))) : Math.min(150, Math.floor(620 / (maxLen * 0.62)));
  const fsBig = Math.min(180, Math.floor(1400 / (maxLen * 0.62)));
  const card = cards
    ? { padding: "36px 44px", background: t.panel, border: `1.5px solid ${t.panelBorder}`, boxShadow: t.panelShadow, borderRadius: 24 }
    : {};

  const big = Math.max(Math.abs(p.from), Math.abs(p.to)) || 1;
  const small = Math.min(Math.abs(p.from), Math.abs(p.to));
  const smallW = (W * small) / big;
  const extraFull = W - smallW;
  const diff = p.to - p.from;
  const pct = p.from !== 0 ? (p.to / p.from - 1) * 100 : 0;
  const deltaLabel = p.deltaText || (pct >= 0 ? "+" : "−") + Math.abs(pct).toFixed(1) + "%";
  const extraText = p.extraText || (diff >= 0 ? "+" : "−") + f(Math.abs(diff)) + " " + p.unit;
  const deltaArrow = up ? "M9 0 L18 16 L0 16 Z" : "M0 0 L18 0 L9 16 Z";

  const chipEl = (size: number) => (
    <div
      style={{
        scale: chip,
        opacity: Math.min(1, chip * 3),
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 22px",
        borderRadius: 999,
        background: up ? t.chipBg : t.alert,
        border: `2px solid ${up ? t.chipBorder : t.alert}`,
        boxShadow: up ? t.chipGlow : `0 0 26px ${t.alertGlow}`,
        color: up ? t.chipInk : "#fff4ee",
        fontSize: size,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      <svg width={18} height={16}>
        <path d={deltaArrow} fill={up ? t.chipInk : "#fff4ee"} />
      </svg>
      {deltaLabel}
    </div>
  );

  return (
    <Frame
      t={t}
      time={time}
      heading={p.heading}
      kicker={p.kicker}
      source={p.source}
      backdrop={p.backdrop}
      center={p.align === "center"}
    >
      <Audio src={staticFile(p.audio)} />
      {p.layout !== "stack" ? (
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
              ...card,
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
              {p.fromLabel}
            </div>
            <div style={{ fontSize: fs, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em", color: t.ink, whiteSpace: "nowrap" }}>
              {fromText}
            </div>
            <div style={{ fontSize: 28, color: t.muted }}>{p.unit}</div>
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
            <div style={{ position: "absolute", left: "50%", top: 18, translate: "-50% 0" }}>{chipEl(30)}</div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 18,
              opacity: toIn,
              translate: `0px ${(1 - toIn) * 30}px`,
              ...card,
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
              {p.toLabel}
            </div>
            <div
              style={{
                fontSize: fs,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: t.accentText,
                textShadow: t.textGlow,
                whiteSpace: "nowrap",
              }}
            >
              {toText}
            </div>
            <div style={{ fontSize: 28, color: t.muted }}>{p.unit}</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 150,
            right: 150,
            top: 250,
            height: 500,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: fromIn, translate: `0px ${(1 - fromIn) * 30}px` }}>
            <div
              style={{
                padding: "6px 18px",
                borderRadius: 999,
                border: `2px solid ${t.axis}`,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: t.muted,
              }}
            >
              {p.fromLabel}
            </div>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1, color: t.muted, whiteSpace: "nowrap" }}>{fromText}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 5,
                height: 56,
                borderRadius: 4,
                background: t.accent,
                boxShadow: `0 0 14px ${t.glow}`,
                transformOrigin: "50% 0",
                scale: `1 ${arrow}`,
              }}
            />
            {chipEl(28)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: toIn, translate: `0px ${(1 - toIn) * 30}px` }}>
            <div
              style={{
                fontSize: fsBig,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: t.accentText,
                whiteSpace: "nowrap",
                textShadow: t.textGlow,
              }}
            >
              {toText}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <div
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  background: t.accentSoft,
                  border: `2px solid ${t.accent}`,
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: t.accentText,
                }}
              >
                {p.toLabel}
              </div>
              <div style={{ fontSize: 26, color: t.muted }}>{p.unit}</div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          // Centred over the extra slice, or right-aligned when the slice is too near the edge.
          left: extraFull > 900 ? 150 + smallW + extraFull / 2 : 150 + W,
          top: 770,
          translate: extraFull > 900 ? "-50% 0" : "-100% 0",
          fontSize: 32,
          fontWeight: 700,
          color: up ? t.accentText : t.alertText,
          whiteSpace: "nowrap",
          opacity: extraLabel,
          textShadow: up ? t.textGlow : "none",
        }}
      >
        {extraText}
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
          opacity: ramp(time, cue.from - 0.3, cue.from),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: (up ? smallW : W) * base,
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
          {p.baseText}
        </div>
        {up ? (
          <div
            style={{
              position: "absolute",
              left: smallW,
              top: 0,
              bottom: 0,
              width: extraFull * extra,
              background: t.accent,
              boxShadow: t.chipGlow,
            }}
          />
        ) : (
          // A fall: the full bar is laid down first, then the lost slice is eaten from the right.
          <div
            style={{
              position: "absolute",
              left: smallW + extraFull * (1 - extra),
              top: 0,
              bottom: 0,
              width: extraFull * extra,
              background: t.alert,
              backgroundImage: t.hatch,
              boxShadow: `0 0 26px ${t.alertGlow}`,
            }}
          />
        )}
      </div>

      <div style={{ position: "absolute", left: 150, right: 150, top: 916, display: "grid" }}>
        {p.notes.map((n, i) => {
          const next = p.notes[i + 1];
          const o = ramp(time, n.at, n.at + 0.5) * (next ? 1 - ramp(time, next.at - 0.3, next.at) : 1);
          return (
            <div
              key={i}
              style={{
                gridArea: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: p.align === "center" ? "center" : "flex-start",
                gap: 14,
                fontSize: 27,
                fontWeight: 600,
                color: t.ink,
                opacity: o,
                translate: `0px ${(1 - o) * 12}px`,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: t.alert, flex: "0 0 auto" }} />
              {n.text}
            </div>
          );
        })}
      </div>
    </Frame>
  );
};
