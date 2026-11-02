// GoldMoves reel (74 s): approved storyboard. Typography C (tracked caps lead + Anton keyword),
// centred. 4 full-screen motion scenes in the reference language, linked to the speaker with
// fog/light dissolves (no hard cuts). Speaker jump cuts dissolve from the outgoing frame.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CandleRain, Coin, FogWipe, GoldBar, Glass, K, TwoTier, World, clamp, easeIn, easeInOut, mix, p, rnd, spr } from "./design";

const FPS = 30;
export const GM_DURATION = 73.9;
export const GM_FRAMES = Math.round(GM_DURATION * FPS);
const s = (t: number) => Math.round(t * FPS);
const V = "C" as const;

// Full-screen windows (seconds)
export const FS = {
  hook: { from: 0, to: 6.0 },
  drop: { from: 10.1, to: 19.05 },
  week: { from: 27.95, to: 48.75 },
  cta: { from: 62.0, to: 72.0 },
};
const CUTS = [4.08, 13.71, 19.17, 41.21, 59.1, 70.0];

// Speaker captions (lead · keyword · tone), centred above the head.
type Cap = { t: number; lead: string; key: string; tone?: "hue" | "gold" | "red" | "white" };
const CAPS: Cap[] = [
  { t: 6.05, lead: "follow karna", key: "mat bhooliyega" },
  { t: 8.4, lead: "aur is video ko", key: "share karna" },
  { t: 19.2, lead: "har ek dip se aap", key: "buy kar sakte ho" },
  { t: 22.1, lead: "bilkul chhoti", key: "small investment" },
  { t: 25.15, lead: "mazeed move kaise", key: "dekhne ko milega?" },
  { t: 48.8, lead: "market ka trend", key: "abhi bearish", tone: "red" },
  { t: 52.8, lead: "koi bhi fundamental", key: "updates" },
  { t: 55.2, lead: "aap ko isi", key: "page pe milengi" },
  { t: 57.6, lead: "humara proper", key: "trade plan" },
  { t: 59.8, lead: "tayyar", key: "ho raha hai" },
  { t: 72.05, lead: "apna", key: "khayal rakhein" },
];

/** 0..1 fog amount at frame f (peaks on every full-screen boundary). */
const fogAt = (f: number) =>
  Math.max(
    0,
    ...Object.values(FS)
      .flatMap((w) => [w.from, w.to])
      .filter((x) => x > 0)
      .map((x) => interpolate(f, [s(x) - 10, s(x), s(x) + 10], [0, 1, 0], { ...clamp, easing: easeInOut })),
  );

/* ------------------------------------------------------------------ speaker */
const camScale = (t: number) => {
  const last = [0, ...CUTS].filter((c) => c <= t).pop() ?? 0;
  const settle = interpolate(t - last, [0, 0.5], [1.04, 1], { ...clamp, easing: easeInOut });
  return (1.0 + 0.004 * (t - last)) * settle;
};
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
      {/* settle the foam behind the caption band so the type reads clean */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,10,6,.62) 0%, rgba(3,10,6,.32) 22%, rgba(3,10,6,0) 34%)" }} />
    </AbsoluteFill>
  );
};
const CutDissolve: React.FC<{ c: number }> = ({ c }) => {
  const f = useCurrentFrame();
  return <Img src={staticFile(`gm/cut_${c.toFixed(2)}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - p(f, 0, 8, easeInOut) }} />;
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const inFS = Object.values(FS).some((w) => t >= w.from - 0.1 && t < w.to + 0.25);
  if (inFS) return null;
  let idx = -1;
  CAPS.forEach((c, i) => {
    if (c.t <= t) idx = i;
  });
  if (idx < 0) return null;
  const c = CAPS[idx];
  const next = CAPS[idx + 1]?.t ?? GM_DURATION;
  const fsStart = Object.values(FS).map((w) => w.from).find((x) => x > c.t) ?? 999;
  const end = Math.min(next, fsStart);
  if (t >= end) return null;
  return (
    <Sequence from={s(c.t)} durationInFrames={Math.max(1, s(end) - s(c.t))} layout="none">
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
        <TwoTier lead={c.lead} keyword={c.key} at={0} out={s(end) - s(c.t)} variant={V} tone={c.tone ?? "hue"} scale={0.78} />
      </div>
    </Sequence>
  );
};

/* ------------------------------------------------------------------ FS helpers */
/** Text beat inside a full screen (absolute seconds), centred at y. */
const Beat: React.FC<{ from: number; to: number; base: number; lead: string; keyword: string; y: number; tone?: "hue" | "gold" | "red" | "white"; sc?: number }> = ({
  from,
  to,
  base,
  lead,
  keyword,
  y,
  tone = "hue",
  sc = 0.9,
}) => (
  <Sequence from={s(from - base)} durationInFrames={s(to - from)} layout="none">
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <TwoTier lead={lead} keyword={keyword} at={0} out={s(to - from)} variant={V} tone={tone} scale={sc} />
    </div>
  </Sequence>
);

/* ================================================================== HOOK 0–6 */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const push = mix(p(f, 0, 180, easeInOut), 1.0, 1.12);
  const surge = p(f, 128, 40, easeIn);
  const barUp = spr(f, 8, 70, 13);
  const coins = [
    { x: 240, y: 600, s: 190, at: 0, spin: 1 },
    { x: 840, y: 540, s: 150, at: 4, spin: -1 },
    { x: 770, y: 990, s: 120, at: 8, spin: 1 },
    { x: 300, y: 1010, s: 105, at: 12, spin: -1 },
  ];
  return (
    <World focusY={44}>
      <CandleRain speed={1 + surge * 5} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 140, top: 520, width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(50% 50% at 50% 50%, rgba(232,199,127,.3), rgba(232,199,127,0))", filter: "blur(20px)" }} />
        {coins.map((c, i) => {
          const sp = spr(f, c.at, 60, 11, 1);
          const y = mix(sp, -300, c.y) - surge * (1000 + i * 220) + Math.sin((f + i * 20) / 18) * 10;
          return (
            <div key={i} style={{ position: "absolute", left: c.x - c.s / 2, top: y - c.s / 2 }}>
              <Coin size={c.s} rx={20 + Math.sin(f / 20 + i) * 18} ry={c.spin * (f * 3 + i * 40)} rz={c.spin * 8} blur={(i >= 2 ? 3 : 0) + surge * 8} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 540 - 230 + 55, top: mix(barUp, 1150, 720) + Math.sin(f / 22) * 6, transform: `scale(${mix(Math.min(barUp, 1.05), 0.7, 1)})`, transformOrigin: "50% 50%" }}>
          <GoldBar w={460} rx={-28 + Math.sin(f / 30) * 3} ry={24 + f * 0.25} />
          <div style={{ position: "absolute", left: 40, right: 40, top: 300, height: 60, borderRadius: "50%", background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.55), rgba(0,0,0,0))", filter: "blur(8px)" }} />
        </div>
      </AbsoluteFill>
      <Beat from={0.25} to={3.0} base={0} lead="agar aap gold mein" keyword="trade karte ho" y={1220} tone="white" />
      <Beat from={3.0} to={6.0} base={0} lead="toh abhi" keyword="aur moves baaki" y={1220} tone="gold" />
    </World>
  );
};

/* ================================================================== DROP 10.1–19.05 */
const Drop: React.FC = () => {
  const f = useCurrentFrame(); // 0 = 10.1 s
  const B = FS.drop.from;
  const steps = 6;
  const stepAt = (i: number) => 22 + i * 24;
  let ci = 0;
  for (let i = 0; i < steps; i++) if (f >= stepAt(i)) ci = i;
  const local = f - stepAt(ci);
  const k = Math.min(1, local / 24);
  const hop = Math.sin(k * Math.PI) * (70 - ci * 6);
  const cx = 250 + ci * 110 + k * 110;
  const cy = 470 + ci * 80 - hop;
  const buy = s(16.4 - B); // "buying opportunities"
  const camY = mix(p(f, 0, 190, easeInOut), 30, -30);
  return (
    <World focusY={48}>
      <CandleRain speed={0.6} tint={K.red} count={10} />
      <AbsoluteFill style={{ transform: `translateY(${camY}px) scale(${mix(p(f, buy, 40, easeInOut), 1, 0.92)})`, transformOrigin: "50% 40%" }}>
        <AbsoluteFill style={{ perspective: 1600 }}>
          <div style={{ position: "absolute", inset: 0, transform: "rotateX(14deg)", transformStyle: "preserve-3d" }}>
            {Array.from({ length: steps }, (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 200 + i * 110,
                  top: 560 + i * 80,
                  width: 96,
                  height: 300 - i * 28,
                  borderRadius: 14,
                  background: `linear-gradient(90deg, #C9434A, ${K.red} 45%, #FF9DA1 55%, #C9434A)`,
                  boxShadow: "0 0 30px rgba(255,95,102,.35), inset 0 2px 0 rgba(255,255,255,.4)",
                  opacity: p(f, i * 4, 14) * mix(p(f, buy, 30), 1, 0.45),
                  transform: `translateY(${(1 - spr(f, i * 4, 110, 14)) * 120}px)`,
                }}
              />
            ))}
          </div>
        </AbsoluteFill>
        <div style={{ position: "absolute", left: cx - 80, top: cy - 80 }}>
          <Coin size={160} rx={10} ry={f * 6} />
        </div>
        <div style={{ position: "absolute", left: 150, top: 330, opacity: p(f, 4, 10) * (1 - p(f, 60, 30)), transform: `translateY(${-p(f, 60, 30) * 40}px)` }}>
          <Glass style={{ padding: "14px 28px", borderRadius: 24 }}>
            <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 44, color: K.gold }}>4000</span>
          </Glass>
        </div>
        {/* buying opportunities: coins drop and stack at the bottom of the stairs */}
        {Array.from({ length: 7 }, (_, i) => {
          const sp = spr(f, buy + 6 + i * 5, 120, 12);
          return (
            <div key={i} style={{ position: "absolute", left: 860 + (rnd(i) - 0.5) * 10, top: mix(sp, -200, 1010 - i * 26), opacity: p(f, buy + 6 + i * 5, 4) }}>
              <Coin size={130} rx={72} ry={0} rz={rnd(i + 2) * 20} />
            </div>
          );
        })}
      </AbsoluteFill>
      <Beat from={10.15} to={14.2} base={B} lead="4000 ke level se" keyword="jo drop aaya" y={1300} tone="red" />
      <Beat from={14.2} to={16.45} base={B} lead="woh mazeed" keyword="continuation" y={1300} tone="red" />
      <Beat from={16.45} to={19.05} base={B} lead="lekin abhi" keyword="buying chance" y={1300} tone="hue" />
    </World>
  );
};

/* ================================================================== WEEK 27.95–48.75 */
const DayCard: React.FC<{ day: string; title: string; note: string; at: number; y: number; tilt: number; hot?: boolean; dim?: number }> = ({ day, title, note, at, y, tilt, hot, dim = 0 }) => {
  const f = useCurrentFrame();
  const sp = spr(f, at, 90, 12, 1);
  return (
    <div style={{ position: "absolute", left: 140, top: mix(sp, -520, y), width: 800, transform: `rotate(${mix(sp, tilt * 4, tilt)}deg)`, opacity: p(f, at, 6) * (1 - dim * 0.45), filter: `blur(${dim * 2}px)` }}>
      <Glass style={{ padding: "30px 36px", display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ width: 150, height: 150, borderRadius: 34, background: "linear-gradient(180deg,#F6FBF8,#CFE3D7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(0,0,0,.35)" }}>
          <span style={{ fontFamily: "Anton", fontSize: 50, color: hot ? "#C9434A" : K.hueDeep, letterSpacing: 1 }}>{day}</span>
        </div>
        <div>
          <div style={{ fontFamily: "Anton", fontSize: 72, color: K.white, letterSpacing: 1, lineHeight: 1.05, textTransform: "uppercase" }}>{title}</div>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 26, color: K.soft, letterSpacing: 6, textTransform: "uppercase", marginTop: 6 }}>{note}</div>
        </div>
      </Glass>
    </div>
  );
};
const Week: React.FC = () => {
  const f = useCurrentFrame(); // 0 = 27.95 s
  const B = FS.week.from;
  const ism = s(38.7 - B);
  const nfp = s(43.1 - B);
  const imp = s(46.5 - B);
  const camY = interpolate(f, [0, ism, nfp, s(48.75 - B)], [120, 0, -110, -150], { ...clamp, easing: easeInOut });
  return (
    <World focusY={42}>
      <CandleRain speed={0.5} count={9} />
      <AbsoluteFill style={{ transform: `translateY(${camY}px)` }}>
        <DayCard day="KAL" title="US Elections" note="result early morning" at={6} y={420} tilt={-3} dim={p(f, ism, 20)} />
        <DayCard day="AAJ" title="ISM PMI" note="manufacturing" at={ism} y={650} tilt={2} dim={p(f, nfp, 20)} />
        <DayCard day="FRI" title="NFP Data" note="high impact" at={nfp} y={880} tilt={-1.5} hot />
        <div style={{ position: "absolute", left: 240, top: 1140, width: 600, opacity: p(f, imp, 10) }}>
          <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 24, color: K.soft, letterSpacing: 6, textAlign: "center", marginBottom: 14 }}>MARKET IMPACT</div>
          <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
            <div style={{ width: `${p(f, imp, 40, easeInOut) * 92}%`, height: "100%", borderRadius: 11, background: `linear-gradient(90deg, ${K.hue}, ${K.gold}, ${K.red})`, boxShadow: `0 0 20px ${K.glow}` }} />
          </div>
        </div>
      </AbsoluteFill>
      <Beat from={28.0} to={33.0} base={B} lead="kal US mein" keyword="elections" y={1330} />
      <Beat from={33.0} to={36.2} base={B} lead="yeh bhi market pe" keyword="impact dega" y={1330} />
      <Beat from={36.2} to={38.7} base={B} lead="is week ki" keyword="calendar news" y={1330} />
      <Beat from={38.7} to={43.1} base={B} lead="aaj" keyword="ISM PMI" y={1330} />
      <Beat from={43.1} to={46.5} base={B} lead="friday ko" keyword="NFP data" y={1330} tone="red" />
      <Beat from={46.5} to={48.75} base={B} lead="bohot hi" keyword="impactful" y={1330} tone="gold" />
    </World>
  );
};

/* ================================================================== CTA 62–72 */
const Cta: React.FC = () => {
  const f = useCurrentFrame(); // 0 = 62 s
  const B = FS.cta.from;
  const setups = s(64.7 - B);
  const join = s(69.9 - B);
  const click = p(f, join + 30, 8);
  const ripple = p(f, join + 32, 20);
  return (
    <World focusY={40}>
      <CandleRain speed={0.4} count={8} />
      <div style={{ position: "absolute", left: 540 - 260, top: 360, width: 520, height: 520, transform: `scale(${mix(p(f, join - 10, 30, easeInOut), 1, 0.82)})` }}>
        <svg width={520} height={520}>
          {[240, 180, 120].map((r, i) => (
            <circle key={r} cx={260} cy={260} r={r} fill="none" stroke={i === 2 ? K.hue : "rgba(156,255,201,.35)"} strokeWidth={i === 2 ? 14 : 6} strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - p(f, 4 + i * 6, 34, easeInOut))} transform="rotate(-90 260 260)" style={{ filter: i === 2 ? `drop-shadow(0 0 16px ${K.glow})` : undefined }} />
          ))}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 205, textAlign: "center", fontFamily: "Anton", fontSize: 92, color: K.white, letterSpacing: 2, opacity: p(f, 30, 12), textShadow: `0 0 20px ${K.glow}` }}>
          100–150
        </div>
        {/* arrows hitting the target */}
        {[0, 1].map((i) => {
          const a = p(f, setups + i * 12, 14, easeIn);
          return <div key={i} style={{ position: "absolute", left: mix(a, -400, 200 + i * 40), top: mix(a, -200, 210 + i * 30), width: 120, height: 6, borderRadius: 3, background: K.gold, transform: "rotate(28deg)", opacity: f > setups + i * 12 ? 1 : 0, boxShadow: "0 0 12px rgba(232,199,127,.7)" }} />;
        })}
      </div>
      <Beat from={62.05} to={64.7} base={B} lead="har setup mein" keyword="100–150 pips" y={1010} />
      <Beat from={64.7} to={67.9} base={B} lead="easily" keyword="1–2 setups" y={1010} tone="gold" />
      <Beat from={67.9} to={72.0} base={B} lead="safely trade karna hai?" keyword="community join" y={1010} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center", opacity: p(f, join, 10), transform: `translateY(${(1 - spr(f, join, 120, 14)) * 40}px)` }}>
        <div style={{ position: "relative", transform: `scale(${1 - click * 0.05 + ripple * 0.05})` }}>
          <div style={{ padding: "28px 64px", borderRadius: 999, background: `linear-gradient(180deg, #6BF0AC, ${K.hueDeep})`, color: "#03140B", fontFamily: "Anton", fontSize: 54, letterSpacing: 2, boxShadow: `0 20px 50px ${K.glow}, inset 0 2px 0 rgba(255,255,255,.5)` }}>
            JOIN COMMUNITY ↑
          </div>
          {ripple > 0 && ripple < 1 ? <div style={{ position: "absolute", inset: -24 * ripple, borderRadius: 999, border: `3px solid ${K.hue}`, opacity: 1 - ripple }} /> : null}
          <svg width={44} height={54} viewBox="0 0 22 27" style={{ position: "absolute", left: mix(p(f, join + 12, 18, easeInOut), 520, 380), top: mix(p(f, join + 12, 18, easeInOut), 150, 60), opacity: p(f, join + 12, 6), filter: "drop-shadow(0 6px 10px rgba(0,0,0,.5))" }}>
            <path d="M1 1 L1 21 L6 16.5 L9.5 25 L13 23.5 L9.5 15.5 L16 15.5 Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", opacity: p(f, join + 10, 12), fontFamily: "Inter", fontWeight: 600, fontSize: 26, color: K.soft, letterSpacing: 6 }}>
        @IMANFAALPERVAIZ · LINK IN BIO
      </div>
    </World>
  );
};

/* ------------------------------------------------------------------ assembly */
const Full: React.FC<{ w: { from: number; to: number }; children: React.ReactNode }> = ({ w, children }) => {
  const dur = s(w.to) - s(w.from);
  return (
    <Sequence from={s(w.from)} durationInFrames={dur}>
      <FullFade dur={dur} first={w.from === 0}>
        {children}
      </FullFade>
    </Sequence>
  );
};
const FullFade: React.FC<{ dur: number; first: boolean; children: React.ReactNode }> = ({ dur, first, children }) => {
  const f = useCurrentFrame();
  const o = (first ? 1 : p(f, 0, 9)) * (1 - p(f, dur - 9, 9));
  const fog = Math.max(first ? 0 : interpolate(f, [0, 10], [1, 0], clamp), interpolate(f, [dur - 10, dur], [0, 1], clamp));
  return <AbsoluteFill style={{ opacity: o, filter: `blur(${fog * 18}px)`, transform: `scale(${1 + fog * 0.04})` }}>{children}</AbsoluteFill>;
};

const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 1 }) => (
  <Sequence from={Math.max(0, s(at))} durationInFrames={30} layout="none">
    <Audio src={staticFile(`gm/sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

export const GoldMovesReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: K.void }}>
    <Audio src={staticFile("gm/cut.mp4")} />
    <Audio src={staticFile("gm/music.wav")} volume={(f) => Math.min(1, f / 4) * Math.min(1, (GM_FRAMES - f) / 30)} />
    <Speaker />
    <Captions />
    <Full w={FS.hook}>
      <Hook />
    </Full>
    <Full w={FS.drop}>
      <Drop />
    </Full>
    <Full w={FS.week}>
      <Week />
    </Full>
    <Full w={FS.cta}>
      <Cta />
    </Full>
    {/* fog/light dissolves at every scene change (peak = the switch) */}
    {Object.values(FS).map((w) => (
      <React.Fragment key={w.from}>
        {w.from > 0 ? <FogWipe at={s(w.from) - 9} dur={18} /> : null}
        <FogWipe at={s(w.to) - 9} dur={18} />
      </React.Fragment>
    ))}
    {Object.values(FS).flatMap((w) => [w.from, w.to]).filter((x) => x > 0).map((x) => (
      <Sfx key={x} at={x - 0.3} src="whoosh" vol={0.16} />
    ))}
    <Sfx at={0.3} src="thud" vol={0.3} />
    <Sfx at={3.0} src="pop" vol={0.28} />
    <Sfx at={16.6} src="pop" vol={0.28} />
    <Sfx at={28.2} src="pop" vol={0.25} />
    <Sfx at={38.7} src="pop" vol={0.25} />
    <Sfx at={43.1} src="pop" vol={0.25} />
    <Sfx at={46.5} src="thud" vol={0.28} />
    <Sfx at={63.0} src="pop" vol={0.25} />
    <Sfx at={71.0} src="pop" vol={0.3} />
  </AbsoluteFill>
);
