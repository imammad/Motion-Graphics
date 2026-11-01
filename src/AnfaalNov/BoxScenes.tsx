import React from "react";
import { useCurrentFrame } from "remotion";
import { C, F, HANDLE } from "./brand";
import { Glass, MicroLabel, Pill, easeIn, easeInOut, enter, mix, prog, rnd, springIn } from "./kit";
import { BOX } from "./timeline";

// Every graphic sits in the client's box (x 150–930, y 222–~500), above the caption line.

const W = BOX.x1 - BOX.x0;

/** Card slot inside the box: springs in, eases out (blur + lift). */
const Slot: React.FC<{ dur: number; children: React.ReactNode; h?: number }> = ({ dur, children, h = 270 }) => {
  const f = useCurrentFrame();
  const s = springIn(f, 0, 14);
  const o = prog(f, 0, 8);
  const out = prog(f, dur - 9, 9, easeIn);
  return (
    <div
      style={{
        position: "absolute",
        left: BOX.x0,
        top: BOX.y0 + 6,
        width: W,
        height: h,
        opacity: o * (1 - out),
        transform: `translateY(${(1 - s) * 26 - out * 18}px) scale(${mix(s, 0.92, 1) * mix(out, 1, 0.96)})`,
        filter: `blur(${(1 - o) * 8 + out * 8}px)`,
        transformOrigin: "50% 100%",
      }}
    >
      {children}
    </div>
  );
};

const card: React.CSSProperties = { width: "100%", height: "100%", borderRadius: 34, padding: "26px 34px", boxSizing: "border-box" };

/* 1 · Hook ticker: 4000 → 3872 ------------------------------------- */
export const TickerBox: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = prog(f, 4, 48, easeInOut);
  const price = Math.round(mix(t, 4000, 3872));
  const snap = prog(f, 52, 10);
  const pts = Array.from({ length: 24 }, (_, i) => {
    const x = (i / 23) * 300;
    const y = 18 + (i / 23) ** 1.6 * 100 + Math.sin(i * 1.3) * 7;
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const L = 420;
  return (
    <Slot dur={dur}>
      <Glass style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <MicroLabel color={C.gold}>xauusd · gold</MicroLabel>
          <div style={{ fontFamily: F.mono, fontSize: 112, color: C.white, lineHeight: 1.05, marginTop: 6 }}>{price}</div>
          <div style={{ marginTop: 8, opacity: snap, transform: `scale(${mix(snap, 1.4, 1)})`, transformOrigin: "0% 50%" }}>
            <Pill color={C.red} icon="↓" size={32}>
              −128
            </Pill>
          </div>
        </div>
        <svg width={300} height={150}>
          <path d={pts} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - t)} style={{ filter: `drop-shadow(0 0 10px ${C.redGlow})` }} />
        </svg>
      </Glass>
    </Slot>
  );
};

/* 2 · "Break kahan?" ------------------------------------------------ */
export const BreakQBox: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Slot dur={dur} h={200}>
      <Glass style={{ ...card, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <span style={{ fontFamily: F.display, fontSize: 108, color: C.white, lineHeight: 1 }}>BREAK</span>
        <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 92, color: C.green, ...enter(f, 8, 12, 16) }}>kahan?</span>
      </Glass>
    </Slot>
  );
};

/* 3 · Reversal zone 3800 → break ------------------------------------- */
export const ZoneBox: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); // 0 = 12.9 s
  const tag = prog(f, 123, 10); // 17.0 s "3800 ki support"
  const brk = prog(f, 192, 10); // 19.3 s "break"
  const down = prog(f, 270, 30, easeInOut); // 21.9 s "aur down"
  const w = W - 68;
  const h = 196;
  const yOf = (v: number) => mix((v - 3680) / 400, h - 6, 6); // 3680..4080
  const seq = [4060, 4040, 3990, 4005, 3960, 3930, 3945, 3900, 3870, 3880, 3845, 3825, 3830, 3808, 3812, 3804];
  const after = [3790, 3772, 3760, 3740, 3725];
  const shown = Math.floor(interpolateClamp(f, [0, 110], [4, seq.length]));
  const shownAfter = Math.floor(interpolateClamp(f, [195, 300], [0, after.length]));
  const all = [...seq.slice(0, shown), ...(brk > 0 ? after.slice(0, shownAfter) : [])];
  const step = w / (seq.length + after.length + 1);
  const bandTop = yOf(3830);
  const bandBot = yOf(3790);
  const bandCol = brk > 0.5 ? "rgba(255,90,95,0.18)" : "rgba(47,210,126,0.16)";
  return (
    <Slot dur={dur}>
      <Glass style={{ ...card, padding: "20px 34px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <MicroLabel color={C.gold}>xauusd · gold</MicroLabel>
          <MicroLabel color={brk > 0.5 ? C.red : C.green}>{brk > 0.5 ? "zone broken" : "reversal zone"}</MicroLabel>
        </div>
        <svg width={w} height={h} style={{ marginTop: 6, overflow: "visible" }}>
          <rect x={0} y={bandTop} width={w * prog(f, 0, 20, easeInOut)} height={bandBot - bandTop} fill={bandCol} stroke={brk > 0.5 ? C.red : C.green} strokeOpacity={0.5} rx={8} />
          {all.map((c, i) => {
            const o = i === 0 ? 4080 : all[i - 1];
            const up = c > o;
            const x = step * (i + 0.6);
            const col = up ? C.green : C.red;
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={yOf(Math.max(o, c) + 14 + rnd(i) * 10)} y2={yOf(Math.min(o, c) - 14 - rnd(i + 3) * 10)} stroke={col} strokeWidth={3} />
                <rect x={x - step * 0.3} y={yOf(Math.max(o, c))} width={step * 0.6} height={Math.max(5, yOf(Math.min(o, c)) - yOf(Math.max(o, c)))} fill={col} rx={3} />
              </g>
            );
          })}
          {down > 0 ? (
            <path d={`M ${step * (seq.length + after.length)} ${yOf(3730)} l 0 ${40 * down}`} stroke={C.red} strokeWidth={5} markerEnd="" />
          ) : null}
        </svg>
        <div style={{ position: "absolute", right: 30, top: 24 + 6 + bandTop - 22, opacity: tag, transform: `translateX(${(1 - tag) * 30}px)` }}>
          <div style={{ padding: "8px 16px", borderRadius: 12, background: brk > 0.5 ? C.red : C.gold, color: C.ink, fontFamily: F.mono, fontSize: 30 }}>3800</div>
        </div>
        <div style={{ position: "absolute", left: 360, top: 66, opacity: brk, transform: `scale(${mix(brk, 1.5, 1)})`, filter: `blur(${(1 - brk) * 8}px)` }}>
          <Pill color={C.red} icon="↓" size={36}>
            BREAK
          </Pill>
        </div>
      </Glass>
    </Slot>
  );
};
const interpolateClamp = (f: number, i: [number, number], o: [number, number]) =>
  Math.max(Math.min(o[0], o[1]), Math.min(Math.max(o[0], o[1]), o[0] + ((f - i[0]) / (i[1] - i[0])) * (o[1] - o[0])));

/* 4 · Pressure: war · elections · fundamentals ------------------------ */
export const PressureBox: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); // 0 = 23.8 s
  const chips = [
    { t: "US–Iran war", at: 27 },
    { t: "Elections", at: 102 },
    { t: "Fundamentals", at: 141 },
  ];
  const hit = prog(f, 213, 12); // 30.9 s "pressure"
  return (
    <Slot dur={dur}>
      <Glass style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "nowrap" }}>
          {chips.map((c) => (
            <div key={c.t} style={enter(f, c.at, 12, 20)}>
              <div style={{ padding: "12px 18px", borderRadius: 999, background: "rgba(255,90,95,.12)", border: "1px solid rgba(255,90,95,.45)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", flexShrink: 0 }}>
                <div style={{ width: 11, height: 11, borderRadius: 6, background: C.red }} />
                <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 28, color: C.white }}>{c.t}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, opacity: hit, transform: `scale(${mix(springIn(f, 213, 12), 0.8, 1)})`, filter: `blur(${(1 - hit) * 8}px)` }}>
          <span style={{ fontFamily: F.display, fontSize: 96, color: C.gold, lineHeight: 1 }}>GOLD</span>
          <span style={{ fontFamily: F.display, fontSize: 96, color: C.red, lineHeight: 1 }}>↓</span>
          <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 76, color: C.white }}>pressure</span>
        </div>
      </Glass>
    </Slot>
  );
};

/* 5 · Two scenarios for a reversal ----------------------------------- */
export const ScenariosBox: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); // 0 = 32.55 s
  const items = [
    { n: "01", t: "Zone se bounce", at: 25 },
    { n: "02", t: "Fundamentals + USD weak", at: 110 },
  ];
  const done = prog(f, 247, 12); // 40.8 s
  return (
    <Slot dur={dur}>
      <div style={{ display: "flex", gap: 18, height: "100%" }}>
        {items.map((it, i) => {
          const t = prog(f, it.at + 6, 24, easeInOut);
          return (
            <div key={it.n} style={{ flex: 1, ...enter(f, it.at, 14, 26) }}>
              <Glass style={{ ...card, height: "100%", padding: "22px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <MicroLabel color={C.green}>scenario {it.n}</MicroLabel>
                  <svg width={40} height={40} viewBox="0 0 44 44" style={{ opacity: done }}>
                    <circle cx={22} cy={22} r={19} fill="rgba(47,210,126,.18)" stroke={C.green} strokeWidth={3} />
                    <path d="M13 22.5 L19.5 29 L31 16" fill="none" stroke={C.green} strokeWidth={3.4} strokeLinecap="round" strokeDasharray={30} strokeDashoffset={30 * (1 - done)} />
                  </svg>
                </div>
                <svg width={300} height={90}>
                  <path
                    d={i === 0 ? "M0 30 C 60 40, 90 80, 130 78 S 220 20, 300 8" : "M0 70 C 70 70, 120 60, 170 45 S 250 15, 300 6"}
                    fill="none"
                    stroke={C.green}
                    strokeWidth={6}
                    strokeLinecap="round"
                    strokeDasharray={360}
                    strokeDashoffset={360 * (1 - t)}
                    style={{ filter: `drop-shadow(0 0 8px ${C.greenGlow})` }}
                  />
                </svg>
                <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: C.white, lineHeight: 1.15 }}>{it.t}</div>
              </Glass>
            </div>
          );
        })}
      </div>
    </Slot>
  );
};

/* 6 · 01 NOV update --------------------------------------------------- */
export const DateBox: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <Slot dur={dur} h={220}>
      <Glass style={{ ...card, display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ width: 160, height: 160, borderRadius: 30, background: "linear-gradient(180deg,#F4F5F1,#DDE3DE)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...enter(f, 2, 12, 20) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 28, color: C.red, letterSpacing: 4 }}>NOV</div>
          <div style={{ fontFamily: F.display, fontSize: 92, color: C.paperInk, lineHeight: 1 }}>01</div>
        </div>
        <div style={enter(f, 8, 12, 20)}>
          <MicroLabel color={C.gold}>xauusd</MicroLabel>
          <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 60, color: C.white, letterSpacing: -1 }}>Gold update</div>
        </div>
      </Glass>
    </Slot>
  );
};

/* 7 · CTA: setups · pips · join --------------------------------------- */
export const CtaBox: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame(); // 0 = 45.3 s
  const joinAt = 222; // 52.7 s
  const click = prog(f, joinAt + 26, 8);
  const ripple = prog(f, joinAt + 28, 20);
  const cur = prog(f, joinAt + 8, 18, easeInOut);
  return (
    <Slot dur={dur + 20}>
      <Glass style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {[
            { t: "1–2 setups / din", at: 40 },
            { t: "100–150 pips", at: 90 },
          ].map((c) => (
            <div key={c.t} style={enter(f, c.at, 12, 20)}>
              <div style={{ padding: "14px 24px", borderRadius: 999, background: "rgba(47,210,126,.12)", border: "1px solid rgba(47,210,126,.5)" }}>
                <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: C.white, whiteSpace: "nowrap" }}>{c.t}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "relative", ...enter(f, joinAt, 14, 24) }}>
          <div
            style={{
              padding: "20px 50px",
              borderRadius: 999,
              background: `linear-gradient(180deg, #4BE394, ${C.greenDeep})`,
              color: "#04130B",
              fontFamily: F.sans,
              fontWeight: 800,
              fontSize: 38,
              boxShadow: `0 16px 40px ${C.greenGlow}, inset 0 1px 0 rgba(255,255,255,.5)`,
              transform: `scale(${1 - click * 0.05 + ripple * 0.05})`,
            }}
          >
            Join Community ↑
          </div>
          {ripple > 0 && ripple < 1 ? <div style={{ position: "absolute", inset: -20 * ripple, borderRadius: 999, border: `3px solid ${C.green}`, opacity: 1 - ripple }} /> : null}
          <svg width={40} height={50} viewBox="0 0 22 27" style={{ position: "absolute", left: mix(cur, 420, 300), top: mix(cur, 90, 40), opacity: prog(f, joinAt + 8, 6), transform: `scale(${1 - click * 0.15})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.5))" }}>
            <path d="M1 1 L1 21 L6 16.5 L9.5 25 L13 23.5 L9.5 15.5 L16 15.5 Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ ...enter(f, joinAt + 10, 12, 10), marginTop: -8 }}>
          <MicroLabel color={C.muted} style={{ fontSize: 24 }}>
            {HANDLE} · link in bio
          </MicroLabel>
        </div>
      </Glass>
    </Slot>
  );
};
