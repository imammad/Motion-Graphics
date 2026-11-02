// GoldMoves v2 (74 s), revised after client feedback:
// - hook is the speaker (no motion-graphic hook), with a real-looking chart card above the head
// - normal full-sentence captions all the way through (word highlight, centred, glass pill)
// - real community screenshots + TradingView-style XAUUSD charts as on-screen cards
// - icons on the news cards; all shapes glide (ease in/out), no falling / bouncing / tumbling
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CandleRain, FogWipe, K, TwoTier, World, clamp, easeIn, easeInOut, easeOut, mix, p, rnd } from "./design";

const FPS = 30;
export const GM2_DURATION = 73.9;
export const GM2_FRAMES = Math.round(GM2_DURATION * FPS);
const s = (t: number) => Math.round(t * FPS);
const V = "C" as const;

export const FS = {
  drop: { from: 10.1, to: 19.05 },
  week: { from: 27.95, to: 48.75 },
  cta: { from: 62.0, to: 72.0 },
};
const CUTS = [4.08, 13.71, 19.17, 41.21, 59.1, 70.0];

/* ---------------------------------------------------------------- transcript */
// Full Roman Urdu transcript by speech chunk (start, end, text).
const SPEECH: [number, number, string][] = [
  [0.15, 3.06, "agar aap gold ke andar trade karte hain toh abhi mazeed"],
  [3.06, 6.06, "moves dekhne baaki hain. aap trade karte hain gold mein"],
  [6.06, 8.42, "toh follow karna mat bhooliyega aur is video ko"],
  [8.42, 9.95, "share karna bilkul bhi mat bhooliyega"],
  [10.1, 12.17, "agar hum dekhein 4000 ke level se"],
  [12.17, 14.21, "jo drop humein dekhne ko mila hai"],
  [14.21, 16.49, "woh mazeed continuation mein jaa raha hai"],
  [16.49, 19.0, "lekin abhi buying opportunities baaki hain"],
  [19.16, 22.15, "har ek dip se aap buy kar sakte ho bilkul"],
  [22.15, 25.19, "chhoti small investment ke saath. ab baat karte hain"],
  [25.19, 27.74, "ke mazeed move kaise dekhne ko mil sakta hai"],
  [27.96, 30.72, "kyunke kal US ke andar elections hain aur humein"],
  [30.72, 33.0, "is ka result early morning dekhne ko milega"],
  [33.0, 36.21, "aur yeh cheez bhi market mein impact degi"],
  [36.21, 38.36, "baat karein is week ke calendar news ki"],
  [38.68, 41.27, "aaj ISM PMI manufacturing hai"],
  [41.27, 43.15, "aur is ke baad friday wale din"],
  [43.15, 46.54, "NFP ka data aane wala hai jo ke bohot"],
  [46.54, 48.8, "impactful ho sakta hai is market ke liye"],
  [48.8, 51.09, "lekin abhi baat karein market ke trend ki"],
  [51.09, 52.73, "toh trend abhi bearish dikh raha hai"],
  [52.82, 55.71, "mazeed koi fundamental updates aayengi toh inshallah"],
  [55.71, 57.63, "aap ko isi page ke upar milengi"],
  [59.79, 61.92, "humara proper trade plan tayyar ho raha hai"],
  [62.01, 64.7, "jis mein 100 se 150 pips ke targets book kar sakte hain"],
  [64.7, 67.92, "easily 1-2 setups mein. agar aap chahte hain"],
  [67.92, 69.92, "aisi trades karna, safely trade karna"],
  [69.92, 72.05, "toh upar community ka link join karna mat bhooliyega"],
  [72.05, 73.9, "apna khayal rakhiyega"],
];
const HOT = new Set(["gold", "moves", "follow", "share", "4000", "drop", "continuation", "buying", "opportunities", "dip", "buy", "small", "investment", "elections", "result", "impact", "ISM", "PMI", "friday", "NFP", "impactful", "bearish", "updates", "trade", "plan", "100", "150", "pips", "1-2", "setups", "safely", "community", "join"]);

type Word = { w: string; t0: number; t1: number };
type Line = { words: Word[]; t0: number; t1: number };
// split each chunk into display lines; word times proportional to length
const LINES: Line[] = SPEECH.flatMap(([a, b, text]) => {
  const ws = text.split(" ");
  const total = ws.reduce((n, w) => n + w.length + 1, 0);
  let acc = a;
  const timed: Word[] = ws.map((w) => {
    const d = ((w.length + 1) / total) * (b - a);
    const o = { w, t0: acc, t1: acc + d };
    acc += d;
    return o;
  });
  // balanced lines of at most 4 words (no orphan single words)
  const out: Line[] = [];
  const nLines = Math.max(1, Math.ceil(timed.length / 4));
  const per = Math.ceil(timed.length / nLines);
  for (let i = 0; i < timed.length; i += per) {
    const chunk = timed.slice(i, i + per);
    out.push({ words: chunk, t0: chunk[0].t0, t1: chunk[chunk.length - 1].t1 });
  }
  return out;
});

/** Normal captions: full sentence, centred, word-by-word highlight, soft glass pill. */
const NormalCaptions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const i = LINES.findIndex((l, k) => t >= l.t0 - 0.05 && t < (LINES[k + 1]?.t0 ?? l.t1 + 0.6) && t < l.t1 + 0.6);
  if (i < 0) return null;
  const line = LINES[i];
  const inT = p(f, s(line.t0) - 2, 6);
  const end = Math.min(LINES[i + 1]?.t0 ?? line.t1 + 0.6, line.t1 + 0.6);
  const outT = p(f, s(end) - 4, 4, easeIn);
  const inFS = Object.values(FS).some((w) => t >= w.from && t < w.to);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: inFS ? 1470 : 1420, display: "flex", justifyContent: "center", opacity: inT * (1 - outT) }}>
      <div
        style={{
          padding: "16px 30px",
          borderRadius: 22,
          background: "rgba(6,18,12,.62)",
          border: "1px solid rgba(156,255,201,.12)",
          boxShadow: "0 12px 30px rgba(0,0,0,.25)",
          transform: `translateY(${(1 - inT) * 10}px)`,
          display: "flex",
          gap: 12,
          maxWidth: 940,
          flexWrap: "nowrap",
        }}
      >
        {line.words.map((w, k) => {
          const on = t >= w.t0;
          const hot = HOT.has(w.w.replace(/[.,?]/g, ""));
          return (
            <span
              key={k}
              style={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: 46,
                letterSpacing: -0.5,
                whiteSpace: "nowrap",
                color: on ? (hot ? K.hue : K.white) : "rgba(243,247,244,.45)",
                transition: "none",
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- keyword captions (speaker) */
type Cap = { t: number; to: number; lead: string; key: string; tone?: "hue" | "gold" | "red" | "white" };
const CAPS: Cap[] = [
  { t: 6.05, to: 8.4, lead: "follow karna", key: "mat bhooliyega" },
  { t: 8.4, to: 10.1, lead: "aur is video ko", key: "share karna" },
  { t: 19.2, to: 22.1, lead: "har ek dip se", key: "buy kar sakte ho" },
  { t: 22.1, to: 25.15, lead: "bilkul chhoti", key: "small investment" },
  { t: 25.15, to: 27.95, lead: "mazeed move kaise", key: "dekhne ko milega?" },
  { t: 52.8, to: 55.2, lead: "koi bhi fundamental", key: "updates" },
  { t: 55.2, to: 57.6, lead: "aap ko isi", key: "page pe milengi" },
  { t: 57.6, to: 62.0, lead: "humara proper", key: "trade plan" },
  { t: 72.05, to: 73.9, lead: "apna", key: "khayal rakhein" },
];
const KeywordCaptions: React.FC = () => (
  <>
    {CAPS.map((c) => (
      <Sequence key={c.t} from={s(c.t)} durationInFrames={s(c.to) - s(c.t)} layout="none">
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
          <TwoTier lead={c.lead} keyword={c.key} at={0} out={s(c.to) - s(c.t)} variant={V} tone={c.tone ?? "hue"} scale={0.78} />
        </div>
      </Sequence>
    ))}
  </>
);

/* ---------------------------------------------------------------- realistic chart */
type ChartOpts = { from: number; to: number; n: number; seed: number; draw: number; levels?: { v: number; label: string; color: string }[]; zone?: { lo: number; hi: number; on: number; color: string; label: string }; w: number; h: number; tf?: string };
const genSeries = (from: number, to: number, n: number, seed: number) => {
  const out: { o: number; h: number; l: number; c: number }[] = [];
  let pr = from;
  for (let i = 0; i < n; i++) {
    const target = from + ((to - from) * (i + 1)) / n;
    const noise = (rnd(i * 3 + seed) - 0.5) * 34;
    const c = pr + (target - pr) * 0.55 + noise;
    const o = pr;
    out.push({ o, c, h: Math.max(o, c) + 4 + rnd(i + seed + 9) * 14, l: Math.min(o, c) - 4 - rnd(i + seed + 5) * 14 });
    pr = c;
  }
  return out;
};
/** TradingView-style dark chart: grid, right price axis, candles, level lines, live price tag. */
const MarketChart: React.FC<ChartOpts> = ({ from, to, n, seed, draw, levels = [], zone, w, h, tf = "1H" }) => {
  const data = React.useMemo(() => genSeries(from, to, n, seed), [from, to, n, seed]);
  const axisW = 120;
  const pw = w - axisW;
  const lo = Math.min(...data.map((d) => d.l), ...(zone ? [zone.lo] : []), ...levels.map((l) => l.v)) - 12;
  const hi = Math.max(...data.map((d) => d.h), ...levels.map((l) => l.v)) + 12;
  const y = (v: number) => h - 30 - ((v - lo) / (hi - lo)) * (h - 70);
  const step = pw / n;
  const shown = Math.max(1, Math.floor(n * draw));
  const last = data[shown - 1];
  const ticks = Array.from({ length: 6 }, (_, i) => lo + ((hi - lo) * i) / 5);
  return (
    <div style={{ position: "relative", width: w, height: h, background: "#0E1512", borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)" }}>
      <div style={{ position: "absolute", left: 18, top: 12, fontFamily: "Inter", fontWeight: 700, fontSize: 24, color: "#DCE5E0" }}>
        XAUUSD <span style={{ color: "#7D8A84", fontWeight: 500 }}>· {tf} · Gold Spot / U.S. Dollar</span>
      </div>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {ticks.map((v, i) => (
          <g key={i}>
            <line x1={0} x2={pw} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,.06)" />
            <text x={pw + 12} y={y(v) + 7} fontFamily="Inter" fontSize={20} fill="#7D8A84">
              {v.toFixed(0)}
            </text>
          </g>
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={(pw / 6) * i} x2={(pw / 6) * i} y1={44} y2={h - 30} stroke="rgba(255,255,255,.04)" />
        ))}
        {zone ? (
          <g opacity={zone.on}>
            <rect x={0} y={y(zone.hi)} width={pw} height={y(zone.lo) - y(zone.hi)} fill={zone.color} opacity={0.16} />
            <text x={14} y={y(zone.lo) - 10} fontFamily="Inter" fontWeight={700} fontSize={22} fill={zone.color}>
              {zone.label}
            </text>
          </g>
        ) : null}
        {levels.map((l) => (
          <g key={l.label}>
            <line x1={0} x2={pw} y1={y(l.v)} y2={y(l.v)} stroke={l.color} strokeDasharray="8 6" strokeWidth={2} />
            <rect x={pw} y={y(l.v) - 15} width={axisW} height={30} fill={l.color} />
            <text x={pw + 10} y={y(l.v) + 7} fontFamily="Inter" fontWeight={700} fontSize={20} fill="#0E1512">
              {l.label}
            </text>
          </g>
        ))}
        {data.slice(0, shown).map((d, i) => {
          const up = d.c >= d.o;
          const col = up ? "#26A69A" : "#EF5350";
          const x = step * (i + 0.5);
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={y(d.h)} y2={y(d.l)} stroke={col} strokeWidth={2} />
              <rect x={x - step * 0.33} y={y(Math.max(d.o, d.c))} width={step * 0.66} height={Math.max(2, Math.abs(y(d.o) - y(d.c)))} fill={col} />
            </g>
          );
        })}
        {last ? (
          <g>
            <line x1={0} x2={pw} y1={y(last.c)} y2={y(last.c)} stroke="#EF5350" strokeDasharray="2 4" strokeWidth={1.5} />
            <rect x={pw} y={y(last.c) - 15} width={axisW} height={30} fill="#EF5350" />
            <text x={pw + 10} y={y(last.c) + 7} fontFamily="Inter" fontWeight={700} fontSize={20} fill="#fff">
              {last.c.toFixed(2)}
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
};

/** On-screen card above the head: glides in (ease), drifts, glides out. */
const OnScreen: React.FC<{ from: number; to: number; children: React.ReactNode; top?: number }> = ({ from, to, children, top = 250 }) => (
  <Sequence from={s(from)} durationInFrames={s(to) - s(from)} layout="none">
    <Glide dur={s(to) - s(from)} top={top}>
      {children}
    </Glide>
  </Sequence>
);
const Glide: React.FC<{ dur: number; top: number; children: React.ReactNode }> = ({ dur, top, children }) => {
  const f = useCurrentFrame();
  const a = p(f, 0, 18, easeOut);
  const b = p(f, dur - 14, 14, easeIn);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: a * (1 - b), transform: `translateY(${(1 - a) * 40 - b * 30 + Math.sin(f / 40) * 4}px) scale(${mix(a, 0.96, 1) * mix(b, 1, 0.97)})`, filter: `blur(${(1 - a) * 8 + b * 8}px)` }}>
      <div style={{ boxShadow: "0 30px 70px rgba(0,0,0,.45)", borderRadius: 22 }}>{children}</div>
    </div>
  );
};
const ChartLive: React.FC<Omit<ChartOpts, "draw"> & { at: number; dur: number }> = (props) => {
  const f = useCurrentFrame();
  return <MarketChart {...props} draw={p(f, props.at, props.dur, easeInOut)} />;
};

/* ---------------------------------------------------------------- speaker */
const camScale = (t: number) => {
  const last = [0, ...CUTS].filter((c) => c <= t).pop() ?? 0;
  const settle = interpolate(t - last, [0, 0.5], [1.04, 1], { ...clamp, easing: easeInOut });
  return (1.0 + 0.004 * (t - last)) * settle;
};
const fogAt = (f: number) =>
  Math.max(0, ...Object.values(FS).flatMap((w) => [w.from, w.to]).map((x) => interpolate(f, [s(x) - 10, s(x), s(x) + 10], [0, 1, 0], { ...clamp, easing: easeInOut })));
const Speaker: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: K.void, filter: `blur(${fogAt(f) * 26}px)` }}>
      <AbsoluteFill style={{ transform: `scale(${camScale(t) * (1 + fogAt(f) * 0.04)})`, transformOrigin: "540px 1000px" }}>
        <OffthreadVideo src={staticFile("gm/cut.mp4")} muted style={{ width: 1080, height: 1920 }} />
        {CUTS.map((c) => (
          <Sequence key={c} from={s(c)} durationInFrames={8} layout="none">
            <CutDissolve c={c} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,10,6,.62) 0%, rgba(3,10,6,.32) 22%, rgba(3,10,6,0) 34%)" }} />
    </AbsoluteFill>
  );
};
const CutDissolve: React.FC<{ c: number }> = ({ c }) => {
  const f = useCurrentFrame();
  return <Img src={staticFile(`gm/cut_${c.toFixed(2)}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - p(f, 0, 8, easeInOut) }} />;
};

/* ---------------------------------------------------------------- full screens */
const Beat: React.FC<{ from: number; to: number; base: number; lead: string; keyword: string; y: number; tone?: "hue" | "gold" | "red" | "white"; sc?: number }> = ({ from, to, base, lead, keyword, y, tone = "hue", sc = 0.9 }) => (
  <Sequence from={s(from - base)} durationInFrames={s(to - from)} layout="none">
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <TwoTier lead={lead} keyword={keyword} at={0} out={s(to - from)} variant={V} tone={tone} scale={sc} />
    </div>
  </Sequence>
);

/** 10.1–19.05: the real-looking 4000 drop chart draws in; buying zone highlights. */
const Drop: React.FC = () => {
  const f = useCurrentFrame();
  const B = FS.drop.from;
  const buy = s(16.45 - B);
  const camS = mix(p(f, 0, s(19.05 - B), easeInOut), 1.0, 1.06);
  return (
    <World focusY={44}>
      <CandleRain speed={0.25} count={7} />
      <div style={{ position: "absolute", left: 60, top: 300, transform: `scale(${camS})`, transformOrigin: "50% 50%", opacity: p(f, 0, 14), filter: `blur(${(1 - p(f, 0, 14)) * 8}px)` }}>
        <div style={{ boxShadow: "0 40px 90px rgba(0,0,0,.55)", borderRadius: 22 }}>
          <MarketChart
            from={4085}
            to={3870}
            n={46}
            seed={7}
            w={960}
            h={760}
            draw={p(f, 6, s(14.2 - B), easeInOut)}
            levels={[{ v: 4000, label: "4000", color: K.gold }]}
            zone={{ lo: 3850, hi: 3885, on: p(f, buy, 18), color: K.hue, label: "BUYING ZONE" }}
          />
        </div>
      </div>
      <Beat from={10.15} to={14.2} base={B} lead="4000 ke level se" keyword="jo drop aaya" y={1150} tone="red" />
      <Beat from={14.2} to={16.45} base={B} lead="woh mazeed" keyword="continuation" y={1150} tone="red" />
      <Beat from={16.45} to={19.05} base={B} lead="lekin abhi" keyword="buying chance" y={1150} tone="hue" />
    </World>
  );
};

/* icons (simple line glyphs) */
const Icon: React.FC<{ kind: "ballot" | "factory" | "jobs"; color: string }> = ({ kind, color }) => (
  <svg width={84} height={84} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    {kind === "ballot" ? (
      <>
        <rect x={8} y={22} width={32} height={20} rx={3} />
        <line x1={16} y1={30} x2={32} y2={30} />
        <path d="M18 22 L18 8 L30 8 L30 22" />
        <path d="M21 14 L24 17 L28 11" />
      </>
    ) : kind === "factory" ? (
      <>
        <path d="M6 42 V22 L16 28 V22 L26 28 V22 L36 28 V10 H42 V42 Z" />
        <line x1={12} y1={36} x2={16} y2={36} />
        <line x1={22} y1={36} x2={26} y2={36} />
        <line x1={32} y1={36} x2={36} y2={36} />
      </>
    ) : (
      <>
        <rect x={6} y={16} width={36} height={24} rx={4} />
        <path d="M18 16 V11 H30 V16" />
        <line x1={6} y1={27} x2={42} y2={27} />
        <line x1={24} y1={25} x2={24} y2={30} />
      </>
    )}
  </svg>
);
const NewsCard: React.FC<{ icon: "ballot" | "factory" | "jobs"; day: string; title: string; note: string; at: number; y: number; hot?: boolean; dim?: number }> = ({ icon, day, title, note, at, y, hot, dim = 0 }) => {
  const f = useCurrentFrame();
  const a = p(f, at, 20, easeOut);
  const col = hot ? K.red : K.hue;
  return (
    <div style={{ position: "absolute", left: 120, top: y, width: 840, opacity: a * (1 - dim * 0.5), transform: `translateX(${(1 - a) * 160}px)`, filter: `blur(${(1 - a) * 8 + dim * 1.5}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "28px 34px", borderRadius: 40, background: "linear-gradient(160deg, rgba(60,140,100,.28), rgba(10,30,20,.55))", border: "1.5px solid rgba(156,255,201,.2)", boxShadow: "0 30px 70px rgba(0,0,0,.45)" }}>
        <div style={{ width: 140, height: 140, borderRadius: 34, background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.12), rgba(255,255,255,.03))`, border: `2px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${hot ? "rgba(255,95,102,.3)" : K.glow}` }}>
          <Icon kind={icon} color={col} />
        </div>
        <div>
          <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 26, letterSpacing: 6, color: col }}>{day}</div>
          <div style={{ fontFamily: "Anton", fontSize: 76, color: K.white, letterSpacing: 1, lineHeight: 1.05, textTransform: "uppercase" }}>{title}</div>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 24, color: K.soft, letterSpacing: 6, textTransform: "uppercase" }}>{note}</div>
        </div>
      </div>
    </div>
  );
};
const Week: React.FC = () => {
  const f = useCurrentFrame();
  const B = FS.week.from;
  const ism = s(38.7 - B);
  const nfp = s(43.1 - B);
  const imp = s(46.5 - B);
  const camY = interpolate(f, [0, ism, nfp, s(48.75 - B)], [140, 30, -80, -110], { ...clamp, easing: easeInOut });
  return (
    <World focusY={42}>
      <CandleRain speed={0.25} count={7} />
      <AbsoluteFill style={{ transform: `translateY(${camY}px)` }}>
        <NewsCard icon="ballot" day="KAL · TUESDAY" title="US Elections" note="result early morning" at={6} y={380} dim={p(f, ism, 24)} />
        <NewsCard icon="factory" day="AAJ" title="ISM PMI" note="manufacturing" at={ism} y={630} dim={p(f, nfp, 24)} />
        <NewsCard icon="jobs" day="FRIDAY" title="NFP Data" note="high impact" at={nfp} y={880} hot />
        <div style={{ position: "absolute", left: 240, top: 1150, width: 600, opacity: p(f, imp, 14) }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 24, color: K.soft, letterSpacing: 6, textAlign: "center", marginBottom: 14 }}>MARKET IMPACT</div>
          <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
            <div style={{ width: `${p(f, imp, 45, easeInOut) * 92}%`, height: "100%", borderRadius: 11, background: `linear-gradient(90deg, ${K.hue}, ${K.gold}, ${K.red})` }} />
          </div>
        </div>
      </AbsoluteFill>
      <Beat from={28.0} to={33.0} base={B} lead="kal US mein" keyword="elections" y={1300} />
      <Beat from={33.0} to={36.2} base={B} lead="yeh bhi market pe" keyword="impact dega" y={1300} />
      <Beat from={36.2} to={38.7} base={B} lead="is week ki" keyword="calendar news" y={1300} />
      <Beat from={38.7} to={43.1} base={B} lead="aaj" keyword="ISM PMI" y={1300} />
      <Beat from={43.1} to={46.5} base={B} lead="friday ko" keyword="NFP data" y={1300} tone="red" />
      <Beat from={46.5} to={48.75} base={B} lead="bohot hi" keyword="impactful" y={1300} tone="gold" />
    </World>
  );
};

/** 62–72: real community screenshots + targets + join. */
const Shot: React.FC<{ src: string; at: number; x: number; rot: number; w: number; h: number; crop?: number }> = ({ src, at, x, rot, w, h, crop = 0 }) => {
  const f = useCurrentFrame();
  const a = p(f, at, 22, easeOut);
  return (
    <div style={{ position: "absolute", left: x, top: 300, width: w, height: h, borderRadius: 30, overflow: "hidden", border: "2px solid rgba(255,255,255,.14)", boxShadow: "0 40px 80px rgba(0,0,0,.55)", opacity: a, transform: `translateY(${(1 - a) * 90 + Math.sin((f + at) / 40) * 5}px) rotate(${rot}deg)`, filter: `blur(${(1 - a) * 8}px)` }}>
      <Img src={staticFile(src)} style={{ width: "100%", position: "absolute", top: -crop }} />
    </div>
  );
};
const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const B = FS.cta.from;
  const join = s(69.9 - B);
  const click = p(f, join + 30, 8);
  return (
    <World focusY={40}>
      <CandleRain speed={0.2} count={6} />
      <Shot src="gm/signals.png" at={4} x={90} rot={-4} w={440} h={640} crop={60} />
      <Shot src="gm/pnl.png" at={16} x={560} rot={4} w={430} h={580} />
      <Beat from={62.05} to={64.7} base={B} lead="har setup mein" keyword="100–150 pips" y={1010} />
      <Beat from={64.7} to={67.9} base={B} lead="easily" keyword="1–2 setups" y={1010} tone="gold" />
      <Beat from={67.9} to={72.0} base={B} lead="safely trade karna hai?" keyword="community join" y={1010} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", opacity: p(f, join, 14), transform: `translateY(${(1 - p(f, join, 18)) * 30}px)` }}>
        <div style={{ position: "relative", transform: `scale(${1 - click * 0.04})` }}>
          <div style={{ padding: "26px 60px", borderRadius: 999, background: `linear-gradient(180deg, #6BF0AC, ${K.hueDeep})`, color: "#03140B", fontFamily: "Anton", fontSize: 50, letterSpacing: 2, boxShadow: `0 20px 50px ${K.glow}, inset 0 2px 0 rgba(255,255,255,.5)` }}>JOIN COMMUNITY ↑</div>
          <svg width={44} height={54} viewBox="0 0 22 27" style={{ position: "absolute", left: mix(p(f, join + 12, 18, easeInOut), 500, 360), top: mix(p(f, join + 12, 18, easeInOut), 140, 56), opacity: p(f, join + 12, 6), filter: "drop-shadow(0 6px 10px rgba(0,0,0,.5))" }}>
            <path d="M1 1 L1 21 L6 16.5 L9.5 25 L13 23.5 L9.5 15.5 L16 15.5 Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </World>
  );
};

/* ---------------------------------------------------------------- assembly */
const Full: React.FC<{ w: { from: number; to: number }; children: React.ReactNode }> = ({ w, children }) => {
  const dur = s(w.to) - s(w.from);
  return (
    <Sequence from={s(w.from)} durationInFrames={dur}>
      <FullFade dur={dur}>{children}</FullFade>
    </Sequence>
  );
};
const FullFade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = p(f, 0, 9) * (1 - p(f, dur - 9, 9));
  const fog = Math.max(interpolate(f, [0, 10], [1, 0], clamp), interpolate(f, [dur - 10, dur], [0, 1], clamp));
  return <AbsoluteFill style={{ opacity: o, filter: `blur(${fog * 18}px)`, transform: `scale(${1 + fog * 0.04})` }}>{children}</AbsoluteFill>;
};
const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 1 }) => (
  <Sequence from={Math.max(0, s(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`gm/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

export const GoldMovesReel2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: K.void }}>
    <Audio src={staticFile("gm/cut.mp4")} />
    <Audio src={staticFile("gm/music.wav")} volume={(f) => Math.min(1, f / 4) * Math.min(1, (GM2_FRAMES - f) / 30)} />
    <Speaker />
    {/* hook: on camera, real-looking chart card above the head */}
    <OnScreen from={0.2} to={6.0}>
      <ChartLive from={4090} to={3872} n={34} seed={3} w={760} h={340} at={4} dur={110} levels={[{ v: 4000, label: "4000", color: K.gold }]} />
    </OnScreen>
    {/* bearish trend card */}
    <OnScreen from={48.85} to={52.75}>
      <ChartLive from={3990} to={3865} n={30} seed={11} w={760} h={340} at={2} dur={70} tf="4H" />
    </OnScreen>
    <KeywordCaptions />
    <Full w={FS.drop}>
      <Drop />
    </Full>
    <Full w={FS.week}>
      <Week />
    </Full>
    <Full w={FS.cta}>
      <Cta />
    </Full>
    {Object.values(FS).map((w) => (
      <React.Fragment key={w.from}>
        <FogWipe at={s(w.from) - 9} dur={18} />
        <FogWipe at={s(w.to) - 9} dur={18} />
      </React.Fragment>
    ))}
    <NormalCaptions />
    {Object.values(FS).flatMap((w) => [w.from, w.to]).map((x) => (
      <Sfx key={x} at={x - 0.3} src="whoosh" vol={0.14} />
    ))}
    <Sfx at={16.6} src="pop" vol={0.25} />
    <Sfx at={28.2} src="pop" vol={0.22} />
    <Sfx at={38.7} src="pop" vol={0.22} />
    <Sfx at={43.1} src="pop" vol={0.22} />
    <Sfx at={63.0} src="pop" vol={0.22} />
    <Sfx at={71.0} src="pop" vol={0.28} />
  </AbsoluteFill>
);
