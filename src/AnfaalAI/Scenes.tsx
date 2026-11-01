import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F } from "./brand";
import { DarkGround, Glass, LightGround, MicroLabel, Pill, easeIn, easeInOut, enter, inOut, mix, prog, rnd } from "./kit";
import { captionTopFull } from "./Speaker";

const Header: React.FC<{ label: string; right?: string; color?: string; dot?: boolean }> = ({ label, right, color = C.green, dot }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 236, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {dot ? (
          <div style={{ width: 16, height: 16, borderRadius: 8, background: color, boxShadow: `0 0 ${10 + 8 * Math.sin(f / 4)}px ${color}` }} />
        ) : null}
        <MicroLabel color={color}>{label}</MicroLabel>
      </div>
      {right ? <MicroLabel color={C.muted}>{right}</MicroLabel> : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* HOOK (0–5.5 s, split, open at frame 0)                              */
/* "AI bubble burst" → bubble pops · "stocks crash" → index line dives */
/* red · "gold bhi crash" → gold chip drops in.                        */
/* ------------------------------------------------------------------ */
const TICKERS = [
  { t: "NVDA", a: 0.3 },
  { t: "MSFT", a: 2.2 },
  { t: "META", a: 4.1 },
];
export const HookSplit: React.FC = () => {
  const f = useCurrentFrame();
  const BURST = 30; // "burst" ≈ 1.0 s
  const cx = 540;
  const cy = 560;
  const inflate = mix(prog(f, 0, BURST, easeInOut), 0.86, 1.04) * (1 + Math.sin(f / 3) * 0.012);
  const gone = prog(f, BURST, 6, easeIn);
  const ring = prog(f, BURST, 26);
  const flash = Math.max(0, 1 - Math.abs(f - BURST - 1) / 4);
  const burstTxt = prog(f, BURST + 2, 10);
  const burstOut = prog(f, 54, 8, easeIn);
  // stocks line
  const chartIn = prog(f, 56, 12);
  const draw = prog(f, 60, 26, easeInOut);
  const dive = prog(f, 86, 22, easeIn); // "crash" ≈ 2.95 s
  const crashBadge = prog(f, 90, 10);
  const goldIn = prog(f, 134, 12); // "gold bhi crash" ≈ 4.5 s
  const shake = f >= 88 && f < 104 ? Math.sin(f * 2.4) * 6 * (1 - (f - 88) / 16) : 0;

  const pts: [number, number][] = [];
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const x = 110 + (i / N) * 860;
    const up = 520 - i * 4 - Math.sin(i / 2.2) * 26;
    const cut = i > 26 ? (i - 26) / 14 : 0;
    const y = up + cut * cut * 330 * dive;
    pts.push([x, y]);
  }
  const shown = Math.max(2, Math.round(N * draw) + 1);
  const d = pts
    .slice(0, shown)
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const tail = pts[shown - 1];

  return (
    <DarkGround glowY={55} glow={`rgba(${f < 56 ? "47,210,126" : "255,90,95"},0.18)`}>
      <Header label="market alert" right="live" color={C.red} dot />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
        {/* AI bubble */}
        {gone < 1 ? (
          <div
            style={{
              position: "absolute",
              left: cx - 230,
              top: cy - 230,
              width: 460,
              height: 460,
              borderRadius: "50%",
              transform: `scale(${inflate * (1 + gone * 0.2)})`,
              opacity: 1 - gone,
              background:
                "radial-gradient(circle at 35% 30%, rgba(255,255,255,.55) 0%, rgba(255,255,255,.08) 18%, rgba(47,210,126,.10) 45%, rgba(47,210,126,.28) 78%, rgba(120,255,190,.55) 100%)",
              boxShadow: `0 0 80px ${C.greenGlow}, inset 0 0 60px rgba(47,210,126,.35)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ fontFamily: F.display, fontSize: 170, color: C.white, lineHeight: 1, textShadow: `0 0 40px ${C.greenGlow}` }}>AI</div>
            <MicroLabel color={C.white} style={{ marginTop: 6 }}>
              bubble
            </MicroLabel>
          </div>
        ) : null}
        {/* orbiting tickers (fly away on burst) */}
        {TICKERS.map((tk, i) => {
          const ang = tk.a + f / 30;
          const r = 300 + gone * 500;
          return (
            <div
              key={tk.t}
              style={{
                position: "absolute",
                left: cx + Math.cos(ang) * r - 70,
                top: cy + Math.sin(ang) * r * 0.55 - 26,
                opacity: (1 - gone) * prog(f, i * 4, 10),
                fontFamily: F.mono,
                fontSize: 30,
                color: C.white,
                padding: "8px 18px",
                borderRadius: 14,
                background: "rgba(14,28,20,.85)",
                border: "1px solid rgba(220,255,235,.14)",
              }}
            >
              {tk.t}
            </div>
          );
        })}
        {/* burst: flash, shock ring, shards */}
        {f >= BURST ? (
          <>
            <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.35 }} />
            <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
              <circle cx={cx} cy={cy} r={230 + ring * 260} fill="none" stroke={C.green} strokeWidth={6 * (1 - ring)} opacity={1 - ring} />
              {Array.from({ length: 26 }, (_, i) => {
                const a = (i / 26) * Math.PI * 2 + rnd(i) * 0.3;
                const dist = 230 + prog(f, BURST, 30) * (180 + rnd(i + 4) * 260);
                const o = 1 - prog(f, BURST + 8, 26);
                return (
                  <circle
                    key={i}
                    cx={cx + Math.cos(a) * dist}
                    cy={cy + Math.sin(a) * dist}
                    r={4 + rnd(i + 2) * 8}
                    fill={i % 3 ? "rgba(120,255,190,.9)" : "#fff"}
                    opacity={o}
                  />
                );
              })}
            </svg>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: cy - 120,
                textAlign: "center",
                fontFamily: F.display,
                fontSize: 230,
                color: C.red,
                letterSpacing: 6,
                opacity: burstTxt * (1 - burstOut),
                transform: `scale(${mix(burstTxt, 1.6, 1) * mix(burstOut, 1, 0.9)})`,
                filter: `blur(${(1 - burstTxt) * 14 + burstOut * 10}px)`,
                textShadow: `0 0 60px ${C.redGlow}, 0 20px 50px rgba(0,0,0,.6)`,
              }}
            >
              BURST
            </div>
          </>
        ) : null}
        {/* US stocks line */}
        <div style={{ position: "absolute", inset: 0, opacity: chartIn * mix(goldIn, 1, 0.55) }}>
          <div style={{ position: "absolute", left: 110, top: 316 }}>
            <MicroLabel color={C.muted}>US stocks · S&amp;P 500</MicroLabel>
          </div>
          <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
            {[420, 540, 660, 780].map((y) => (
              <line key={y} x1={110} x2={970} y1={y} y2={y} stroke={C.line} strokeWidth={2} />
            ))}
            <path
              d={d}
              fill="none"
              stroke={dive > 0.05 ? C.red : C.white}
              strokeWidth={8}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 12px ${dive > 0.05 ? C.redGlow : "rgba(255,255,255,.3)"})` }}
            />
            {tail ? <circle cx={tail[0]} cy={tail[1]} r={12} fill={dive > 0.05 ? C.red : C.white} /> : null}
          </svg>
          <div style={{ position: "absolute", left: 610, top: 330, opacity: crashBadge, transform: `scale(${mix(crashBadge, 1.6, 1)})`, filter: `blur(${(1 - crashBadge) * 10}px)` }}>
            <Pill color={C.red} icon="↓" size={46}>
              CRASH
            </Pill>
          </div>
        </div>
        {/* gold drops in */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", ...enter(f, 134, 12, 40) }}>
          <Glass style={{ padding: "22px 34px", borderRadius: 30, display: "flex", alignItems: "center", gap: 22, opacity: goldIn }}>
            <span style={{ fontFamily: F.display, fontSize: 84, color: C.gold, lineHeight: 1 }}>GOLD</span>
            <span style={{ fontFamily: F.display, fontSize: 84, color: C.red, lineHeight: 1 }}>↓</span>
            <div style={{ textAlign: "left" }}>
              <MicroLabel color={C.muted} style={{ fontSize: 24 }}>
                xauusd
              </MicroLabel>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 32, color: C.white }}>bhi crash</div>
            </div>
          </Glass>
        </div>
      </div>
    </DarkGround>
  );
};

/* ------------------------------------------------------------------ */
/* CASH IN HAND (9.75–14.95 s, light full screen)                      */
/* ------------------------------------------------------------------ */
export const CashScene: React.FC = () => {
  const f = useCurrentFrame();
  const noInvest = prog(f, 33, 12); // 10.85 s
  const cashAt = 87; // 12.65 s
  const zoom = mix(prog(f, 0, 156, easeInOut), 1.06, 1.0);
  const tiles = [
    { t: "STOCKS", c: C.paperInk },
    { t: "GOLD", c: C.goldDeep },
    { t: "CRYPTO", c: C.paperInk },
  ];
  return (
    <LightGround>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center" }}>
          <div style={enter(f, 2)}>
            <MicroLabel color="#6F7E76">investors abhi</MicroLabel>
          </div>
          <div style={{ ...enter(f, 6, 14, 40), marginTop: 6 }}>
            <span style={{ fontFamily: F.display, fontSize: 150, color: C.paperInk, letterSpacing: 2 }}>CASH </span>
            <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 140, color: C.greenDeep }}>in hand</span>
          </div>
        </div>
        {/* investments switched off */}
        <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26 }}>
          {tiles.map((tl, i) => (
            <div key={tl.t} style={{ ...enter(f, 10 + i * 5, 12, 30) }}>
              <div
                style={{
                  position: "relative",
                  width: 280,
                  padding: "28px 0",
                  borderRadius: 30,
                  textAlign: "center",
                  background: "linear-gradient(180deg,#FFFFFF,#F4F7F4)",
                  boxShadow: "0 26px 50px rgba(20,40,30,.13), 0 5px 12px rgba(20,40,30,.08)",
                  opacity: mix(noInvest, 1, 0.5),
                  filter: `grayscale(${noInvest})`,
                }}
              >
                <MicroLabel color="#7B8A82" style={{ fontSize: 24 }}>
                  invest
                </MicroLabel>
                <div style={{ fontFamily: F.display, fontSize: 64, color: tl.c, marginTop: 4 }}>{tl.t}</div>
              </div>
              <div
                style={{
                  position: "absolute",
                  marginTop: -78,
                  marginLeft: 196,
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: C.red,
                  color: "#fff",
                  fontFamily: F.sans,
                  fontWeight: 800,
                  fontSize: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 10px 24px ${C.redGlow}`,
                  opacity: prog(f, 33 + i * 4, 8),
                  transform: `scale(${mix(prog(f, 33 + i * 4, 8), 1.6, 1)})`,
                }}
              >
                ✕
              </div>
            </div>
          ))}
        </div>
        {/* cash stack grows */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 460, height: 420 }}>
            {Array.from({ length: 9 }, (_, i) => {
              const t = prog(f, cashAt + i * 3, 10);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 40 + (rnd(i) - 0.5) * 16,
                    bottom: 20 + i * 30,
                    width: 380,
                    height: 120,
                    borderRadius: 20,
                    background: `linear-gradient(180deg, #5BE7A0 0%, ${C.green} 40%, ${C.greenDeep} 100%)`,
                    border: "3px solid rgba(255,255,255,.55)",
                    boxShadow: "0 14px 26px rgba(20,60,40,.25)",
                    opacity: t,
                    transform: `translateY(${(1 - t) * -160}px) rotate(${(rnd(i + 3) - 0.5) * 6}deg)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: F.display,
                    fontSize: 64,
                    color: "rgba(255,255,255,.85)",
                  }}
                >
                  $
                </div>
              );
            })}
            <div style={{ position: "absolute", right: -40, top: 20, ...enter(f, cashAt + 28) }}>
              <div style={{ padding: "14px 26px", borderRadius: 24, background: C.paperInk, color: "#fff", fontFamily: F.sans, fontWeight: 800, fontSize: 32 }}>
                CASH <span style={{ color: C.green }}>↑</span>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </LightGround>
  );
};

/* ------------------------------------------------------------------ */
/* OIL (15.0–21.5 s, split): war · elections · pressure → $105/barrel */
/* ------------------------------------------------------------------ */
export const OilSplit: React.FC = () => {
  const f = useCurrentFrame();
  const chips = [
    { t: "US–Iran war", at: 3 },
    { t: "Elections", at: 42 },
    { t: "Pressure", at: 78 },
  ];
  const fill = prog(f, 84, 57, easeInOut);
  const price = Math.round(mix(fill, 62, 105));
  const snap = prog(f, 141, 10); // "$105" ≈ 19.7 s
  const bx = 660;
  const by = 330;
  const bw = 300;
  const bh = 500;
  return (
    <DarkGround glowY={60} glow={`rgba(255,90,95,${0.08 + snap * 0.12})`}>
      <Header label="oil · per barrel" right="usd" />
      {/* drivers */}
      <div style={{ position: "absolute", left: 90, top: 380, display: "flex", flexDirection: "column", gap: 26 }}>
        {chips.map((c) => (
          <div key={c.t} style={enter(f, c.at, 12, 24)}>
            <Glass style={{ padding: "20px 28px", borderRadius: 24, display: "flex", alignItems: "center", gap: 16, width: 400 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: C.red, boxShadow: `0 0 12px ${C.redGlow}` }} />
              <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 38, color: C.white }}>{c.t}</span>
            </Glass>
          </div>
        ))}
      </div>
      {/* arrows into the barrel */}
      <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
        {chips.map((c, i) => {
          const t = prog(f, c.at + 10, 16, easeInOut);
          const y0 = 425 + i * 114;
          const x1 = 500 + t * (bx - 520);
          return <line key={i} x1={500} y1={y0} x2={x1} y2={mix(t, y0, by + bh * 0.55)} stroke="rgba(255,90,95,.55)" strokeWidth={3} strokeDasharray="8 8" />;
        })}
      </svg>
      {/* barrel */}
      <div style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, ...enter(f, 6, 14, 30) }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 50,
            overflow: "hidden",
            background: "linear-gradient(90deg, #1A2A22, #0E1813 50%, #1A2A22)",
            border: "2px solid rgba(220,255,235,.18)",
            boxShadow: "0 30px 60px rgba(0,0,0,.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: `${mix(fill, 0.18, 0.86) * 100}%`,
              background: "linear-gradient(90deg, #050505, #2A2A2A 45%, #050505)",
              borderTop: `3px solid ${snap > 0.5 ? C.red : "#6B6B6B"}`,
            }}
          />
          {[0.22, 0.5, 0.78].map((p) => (
            <div key={p} style={{ position: "absolute", left: 0, right: 0, top: `${p * 100}%`, height: 10, background: "rgba(220,255,235,.12)" }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: bh * 0.36, textAlign: "center" }}>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 92,
              color: snap > 0.5 ? C.red : C.white,
              textShadow: snap > 0.5 ? `0 0 30px ${C.redGlow}` : "0 4px 20px rgba(0,0,0,.6)",
              transform: `scale(${mix(snap, 1.25, 1)})`,
            }}
          >
            ${price}
          </div>
          <MicroLabel color={C.muted} style={{ fontSize: 24 }}>
            per barrel
          </MicroLabel>
        </div>
      </div>
      <div style={{ position: "absolute", left: 470, top: 860, opacity: snap, transform: `scale(${mix(snap, 1.5, 1)})`, filter: `blur(${(1 - snap) * 8}px)` }}>
        <Pill color={C.red} icon="!" size={36}>
          buri situation
        </Pill>
      </div>
    </DarkGround>
  );
};

/* ------------------------------------------------------------------ */
/* TRADE PLAN (24.7–29.25 s, split)                                    */
/* ------------------------------------------------------------------ */
export const PlanSplit: React.FC = () => {
  const f = useCurrentFrame();
  const rows = ["Entry zone", "Stop loss", "Take profit 1 · 2", "Risk per trade 1–2%"];
  const ready = prog(f, 93, 10); // "trade plan" ≈ 27.8 s
  return (
    <DarkGround glowY={58}>
      <Header label="safe trade plan" right="xauusd" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 310, display: "flex", justifyContent: "center", ...enter(f, 4, 14, 40) }}>
        <Glass style={{ width: 800, padding: "36px 44px", borderRadius: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width={64} height={72} viewBox="0 0 32 36">
              <path d="M16 2 L29 7 V17 C29 26 22 32 16 34 C10 32 3 26 3 17 V7 Z" fill="rgba(47,210,126,.15)" stroke={C.green} strokeWidth={2.2} />
              <path d="M10 18 L14.5 22.5 L22.5 13.5" fill="none" stroke={C.green} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={20} strokeDashoffset={20 * (1 - ready)} />
            </svg>
            <div>
              <div style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 50, color: C.white, letterSpacing: -1 }}>Trade Plan</div>
              <MicroLabel color={C.muted} style={{ fontSize: 24 }}>
                proper · safe · step by step
              </MicroLabel>
            </div>
          </div>
          <div style={{ height: 1, background: C.line, margin: "26px 0 14px" }} />
          {rows.map((r, i) => {
            const t = prog(f, 26 + i * 14, 12);
            return (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0", opacity: mix(t, 0.35, 1) }}>
                <svg width={44} height={44} viewBox="0 0 44 44">
                  <circle cx={22} cy={22} r={19} fill={t > 0.5 ? "rgba(47,210,126,.18)" : "none"} stroke={t > 0.05 ? C.green : "rgba(255,255,255,.25)"} strokeWidth={3} />
                  <path d="M13 22.5 L19.5 29 L31 16" fill="none" stroke={C.green} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={30} strokeDashoffset={30 * (1 - t)} />
                </svg>
                <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 38, color: C.white }}>{r}</span>
              </div>
            );
          })}
        </Glass>
      </div>
      <div style={{ position: "absolute", right: 120, top: 790, opacity: ready, transform: `scale(${mix(ready, 1.5, 1)})`, filter: `blur(${(1 - ready) * 8}px)` }}>
        <Pill color={C.greenDeep} icon="✓" size={36}>
          plan ready
        </Pill>
      </div>
    </DarkGround>
  );
};

/* ------------------------------------------------------------------ */
/* "America ke liye bhi, gold ke liye bhi" pills above the head        */
/* ------------------------------------------------------------------ */
export const MarketPills: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 22.8 s
  const end = 55;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: captionTopFull(22.8 + f / 30), left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        <div style={inOut(f, 0, end)}>
          <Pill color={C.red} icon="↓" size={40}>
            America
          </Pill>
        </div>
        <div style={inOut(f, 26, end)}>
          <Pill color={C.goldDeep} icon="↓" size={40}>
            Gold
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};
