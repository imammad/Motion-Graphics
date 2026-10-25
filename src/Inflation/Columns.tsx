import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { Backdrop, OUT, POP, ThemeName, THEMES, ramp } from "./theme";

// Column chart (T5): bars grow on their own cues; negatives hang below zero in
// the alert colour; callout chips point at the bars that matter.
export type ColumnsProps = {
  theme: ThemeName;
  audio: string;
  heading: string;
  kicker: string;
  source: string;
  backdrop: Backdrop;
  align: "left" | "center";
  labels: string[];
  values: number[];
  // 0-based indices drawn hot; the rest are dimmed.
  highlight: number[];
  prefix: string;
  suffix: string;
  decimals: number;
  showSign: boolean;
  barCues: number[];
  // `top` pins the chip at that height with a stem down to the bar.
  callouts: { index: number; text: string; at: number; top?: number }[];
  cue: { grid: number };
};

const X0 = 260;
const X1 = 1640;
const Y0 = 320;
const Y1 = 860;

const nice = (lo: number, hi: number, count: number) => {
  const span = hi - lo || Math.abs(hi) || 1;
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const r = raw / mag;
  const step = (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * mag;
  const a = Math.floor(lo / step) * step;
  const b = Math.ceil(hi / step) * step;
  const ticks: number[] = [];
  for (let v = a; v <= b + step * 0.5; v += step) ticks.push(Math.round(v / step) * step);
  return { lo: a, hi: b, step, ticks };
};

const num = (v: number, pre: string, suf: string, dec: number, sign: boolean) =>
  (v < -1e-9 ? "−" : sign && v > 1e-9 ? "+" : "") +
  pre +
  Math.abs(v).toLocaleString("en-GB", { minimumFractionDigits: dec, maximumFractionDigits: dec }) +
  suf;

export const Columns: React.FC<ColumnsProps> = (p) => {
  const t = THEMES[p.theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const n = p.values.length;
  const mn = Math.min(0, ...p.values);
  const mx = Math.max(0, ...p.values);
  const rng = mx - mn || 1;
  const ns = nice(mn < 0 ? mn - rng * 0.12 : 0, mx > 0 ? mx + rng * 0.14 : 0, 5);
  const py = (v: number) => Y1 - ((Y1 - Y0) * (v - ns.lo)) / (ns.hi - ns.lo || 1);
  const y0 = py(0);
  const slot = (X1 - X0) / n;
  const bw = Math.min(230, slot * 0.58);
  const small = n > 7;
  const grid = ramp(time, p.cue.grid, p.cue.grid + 0.8);
  const tickDec = ns.step >= 1 ? 0 : ns.step >= 0.1 ? 1 : 2;

  const bars = p.values.map((v, i) => {
    const at = p.barCues[i] ?? p.cue.grid + 0.5;
    const g = ramp(time, at, at + (small ? 0.6 : 1.1));
    const pos = v >= 0;
    const hot = p.highlight.includes(i) || p.highlight.length === 0;
    const cx = X0 + slot * (i + 0.5);
    const yv = py(v);
    return { v, i, g, pos, hot, cx, yv, at };
  });

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
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={grid}>
          {ns.ticks.map((v) => (
            <line key={v} x1={X0} x2={X1 + 40} y1={py(v)} y2={py(v)} stroke={t.grid} strokeWidth={1.5} />
          ))}
          <line x1={X0 - 10} x2={X1 + 40} y1={y0} y2={y0} stroke={t.axis} strokeWidth={2.5} />
        </g>
      </svg>
      {ns.ticks.map((v) => (
        <div
          key={v}
          style={{
            position: "absolute",
            left: 0,
            width: 236,
            top: py(v),
            translate: "0 -50%",
            textAlign: "right",
            fontSize: 20,
            color: t.muted,
            opacity: grid,
          }}
        >
          {num(v, p.prefix, p.suffix, tickDec, false)}
        </div>
      ))}

      {bars.map((b) => {
        const fill = !b.pos ? t.alert : b.hot ? t.barHot : t.barDim;
        const cnt = ramp(time, b.at, b.at + (small ? 0.7 : 1.2), OUT);
        const valO = ramp(time, b.at + 0.2, b.at + 0.6);
        return (
          <div key={b.i}>
            <div
              style={{
                position: "absolute",
                left: b.cx - bw / 2,
                top: b.pos ? b.yv : y0,
                width: bw,
                height: Math.max(2, Math.abs(b.yv - y0)),
                transformOrigin: b.pos ? "50% 100%" : "50% 0%",
                scale: `1 ${b.g}`,
                borderRadius: b.pos ? "10px 10px 0 0" : "0 0 10px 10px",
                background: fill,
                boxShadow: b.hot && b.pos ? t.barHotGlow : !b.pos ? `0 0 22px ${t.alertGlow}` : "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: b.cx,
                top: b.pos ? b.yv - 12 : b.yv + 12,
                translate: `-50% ${b.pos ? "-100%" : "0%"}`,
                fontSize: small ? 19 : 44,
                fontWeight: 800,
                color: !b.pos ? t.alertText : b.hot ? t.accentText : t.ink,
                textShadow: b.hot && b.pos ? t.textGlow : "none",
                whiteSpace: "nowrap",
                opacity: valO,
              }}
            >
              {num(b.v * cnt, p.prefix, p.suffix, p.decimals, p.showSign)}
            </div>
            <div
              style={{
                position: "absolute",
                left: b.cx,
                top: 884,
                width: Math.max(60, slot - 10),
                translate: "-50% 0",
                textAlign: "center",
                fontSize: small ? 17 : 26,
                fontWeight: b.hot && !small ? 700 : 500,
                lineHeight: 1.25,
                color: b.hot && !small ? t.accentText : t.muted,
                opacity: grid,
              }}
            >
              {p.labels[b.i] ?? ""}
            </div>
          </div>
        );
      })}

      {p.callouts.map((c) => {
        const b = bars[c.index];
        if (!b) return null;
        const pop = ramp(time, c.at, c.at + 0.45, POP);
        const alert = !b.pos;
        const anchor = b.pos ? b.yv - (small ? 44 : 72) : y0 - 10;
        const chipBottom = c.top === undefined ? anchor - 34 : c.top + 62;
        return (
          <div key={c.index}>
            <div
              style={{
                position: "absolute",
                left: b.cx - 1,
                top: chipBottom,
                width: 2,
                height: Math.max(0, anchor - chipBottom),
                background: alert ? t.alert : t.chipBorder,
                transformOrigin: "50% 0",
                scale: `1 ${ramp(time, c.at + 0.2, c.at + 0.6)}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: b.cx,
                top: chipBottom,
                translate: "-50% -100%",
                transformOrigin: "50% 100%",
                scale: pop,
                opacity: Math.min(1, pop * 3),
                padding: "10px 22px",
                borderRadius: 14,
                background: alert ? t.badgeBg : t.chipBg,
                border: `2px solid ${alert ? t.alert : t.chipBorder}`,
                boxShadow: alert ? `0 0 26px ${t.alertGlow}` : t.chipGlow,
                color: alert ? t.alertText : t.chipInk,
                fontSize: 26,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {c.text}
            </div>
          </div>
        );
      })}
    </Frame>
  );
};
