import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { Backdrop, OUT, POP, ThemeName, THEMES, Timed, fmt, ramp } from "./theme";

// Compare bars (T6): paired bars per row, A (e.g. frozen) over B (e.g. what it
// should be), with the hatched gap between them called out.
export type CompareBarsProps = {
  theme: ThemeName;
  audio: string;
  heading: string;
  legendA: string;
  legendB: string;
  source: string;
  backdrop: Backdrop;
  scale: "row" | "shared";
  prefix: string;
  suffix: string;
  decimals: number;
  // "{d}" is replaced by the size of the gap.
  gapText: string;
  rows: { label: string; a: number; b: number; aAt: number; bAt: number; gapAt: number }[];
  stamp: Timed;
};

const W = 960;
const TOP = 330;
const BX = 620;

export const CompareBars: React.FC<CompareBarsProps> = (p) => {
  const t = THEMES[p.theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const n = p.rows.length || 1;
  const rowH = Math.min(250, 590 / n);
  const gmax = Math.max(1, ...p.rows.map((r) => Math.max(Math.abs(r.a), Math.abs(r.b))));
  const f = (v: number) => fmt(v, p.prefix, p.suffix, p.decimals);
  const stamp = ramp(time, p.stamp.at, p.stamp.at + 0.45, POP);

  const legend = (
    <div style={{ display: "flex", gap: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: t.ink }}>
        <div style={{ width: 30, height: 14, borderRadius: 4, background: t.barA }} />
        {p.legendA}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: t.accentText }}>
        <div style={{ width: 30, height: 14, borderRadius: 4, background: t.barB, boxShadow: `0 0 12px ${t.glow}` }} />
        {p.legendB}
      </div>
    </div>
  );

  return (
    <Frame t={t} time={time} heading={p.heading} kicker={legend} source={p.source} backdrop={p.backdrop}>
      <Audio src={staticFile(p.audio)} />
      {p.rows.map((r, i) => {
        const mx = p.scale === "shared" ? gmax : Math.max(Math.abs(r.a), Math.abs(r.b)) || 1;
        const aW = (W * Math.abs(r.a)) / mx;
        const bW = (W * Math.abs(r.b)) / mx;
        const mid = TOP + rowH * i + rowH / 2;
        const labO = ramp(time, r.aAt - 0.4, r.aAt + 0.2);
        const aG = ramp(time, r.aAt, r.aAt + 0.9);
        const cntA = ramp(time, r.aAt, r.aAt + 1.0, OUT);
        const bG = ramp(time, r.bAt, r.bAt + 0.9);
        const cntB = ramp(time, r.bAt, r.bAt + 1.0, OUT);
        const bValO = ramp(time, r.bAt + 0.1, r.bAt + 0.5);
        const gO = ramp(time, r.gapAt, r.gapAt + 0.6);
        const gl = Math.min(aW, bW);
        const gw = Math.abs(bW - aW);
        const gapLabel = p.gapText.replace("{d}", f(Math.abs(r.b - r.a)));
        const inside = gw >= gapLabel.length * 13 + 24;
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: 150,
                top: mid,
                width: 420,
                translate: `${(1 - labO) * -20}px -50%`,
                fontSize: 32,
                fontWeight: 700,
                lineHeight: 1.2,
                color: t.ink,
                opacity: labO,
              }}
            >
              {r.label}
            </div>
            <div
              style={{ position: "absolute", left: BX, top: mid - 58, width: W, height: 52, borderRadius: 10, background: t.track, opacity: labO }}
            />
            <div
              style={{
                position: "absolute",
                left: BX + gl,
                top: mid - 58,
                width: gw * gO,
                height: 52,
                boxSizing: "border-box",
                border: `2px dashed ${t.alert}`,
                borderLeft: 0,
                borderRadius: "0 10px 10px 0",
                background: t.hatch,
                opacity: gO,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: BX,
                top: mid - 58,
                width: aW,
                height: 52,
                borderRadius: 10,
                background: t.barA,
                transformOrigin: "0 50%",
                scale: `${aG} 1`,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 16,
                boxSizing: "border-box",
                fontSize: 26,
                fontWeight: 700,
                color: t.aInk,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {aW > 140 ? f(r.a * cntA) : ""}
            </div>
            {aW <= 140 ? (
              <div
                style={{
                  position: "absolute",
                  left: BX + aW + 14,
                  top: mid - 58,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 26,
                  fontWeight: 700,
                  color: t.ink,
                  opacity: aG * (1 - gO),
                }}
              >
                {f(r.a * cntA)}
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                left: BX + gl + gw / 2,
                top: inside ? mid - 32 : mid - 64,
                translate: `-50% ${inside ? "-50%" : "-100%"}`,
                fontSize: 23,
                fontWeight: 700,
                color: t.alertText,
                whiteSpace: "nowrap",
                opacity: gO,
              }}
            >
              {gapLabel}
            </div>
            <div
              style={{
                position: "absolute",
                left: BX,
                top: mid + 6,
                width: bW,
                height: 52,
                borderRadius: 10,
                background: t.barB,
                boxShadow: t.bGlow,
                transformOrigin: "0 50%",
                scale: `${bG} 1`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: BX + bW * bG,
                top: mid + 6,
                height: 52,
                display: "flex",
                alignItems: "center",
                paddingLeft: 18,
                fontSize: 30,
                fontWeight: 800,
                color: t.accentText,
                textShadow: t.textGlow,
                whiteSpace: "nowrap",
                opacity: bValO,
              }}
            >
              {f(r.b * cntB)}
            </div>
          </div>
        );
      })}

      {p.stamp.text ? (
        <div
          style={{
            position: "absolute",
            left: BX,
            top: TOP + rowH * n + 20,
            transformOrigin: "0 50%",
            scale: stamp,
            opacity: Math.min(1, stamp * 3),
            padding: "12px 28px",
            borderRadius: 14,
            background: t.chipBg,
            border: `2px solid ${t.chipBorder}`,
            boxShadow: t.chipGlow,
            color: t.chipInk,
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {p.stamp.text}
        </div>
      ) : null}
    </Frame>
  );
};
