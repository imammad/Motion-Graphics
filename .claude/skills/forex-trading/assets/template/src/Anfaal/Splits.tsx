import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, COMMUNITY, F, HANDLE } from "./brand";
import { DarkGround, Glass, MicroLabel, Pill, easeInOut, enter, mix, prog, rnd } from "./kit";

// All split panels are 1080×960. Content lives in y 230–900 (top 220 px is
// Instagram UI) and x 70–1010.

const Header: React.FC<{ label: string; at?: number; right?: string }> = ({ label, at = 4, right }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 236,
        left: 80,
        right: 80,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        ...enter(f, at, 12, 16),
      }}
    >
      <MicroLabel color={C.green}>{label}</MicroLabel>
      {right ? <MicroLabel color={C.muted}>{right}</MicroLabel> : null}
    </div>
  );
};

const drawPath = (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
const pathLen = (pts: [number, number][]) =>
  pts.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);

/* ------------------------------------------------------------------ */
/* Rate path (10.0–15.52): expected cuts (dashed, down) vs new reality */
/* (rates can go UP). Snap: the up-path draws and the badge pops.      */
/* ------------------------------------------------------------------ */
export const RateSplit: React.FC = () => {
  const f = useCurrentFrame();
  const X0 = 110;
  const NOWX = 520;
  const X1 = 960;
  const base = 640;
  const hist: [number, number][] = [
    [X0, 470],
    [200, 470],
    [260, 500],
    [340, 500],
    [400, 540],
    [460, 540],
    [NOWX, 570],
  ];
  const cuts: [number, number][] = [
    [NOWX, 570],
    [620, 570],
    [680, 640],
    [780, 640],
    [840, 710],
    [X1, 710],
  ];
  const hikes: [number, number][] = [
    [NOWX, 570],
    [640, 570],
    [700, 490],
    [800, 490],
    [860, 410],
    [X1, 410],
  ];
  const hL = pathLen(hist);
  const kL = pathLen(hikes);
  const hT = prog(f, 8, 26, easeInOut);
  const cT = prog(f, 40, 30, easeInOut); // "rate cuts" ~11.3 s
  const kT = prog(f, 88, 34, easeInOut); // "scenario" ~12.95 s
  const snap = prog(f, 137, 10); // "barhaye" ~14.55 s
  const camY = mix(prog(f, 80, 40, easeInOut), 0, -10);
  return (
    <DarkGround glowY={60}>
      <Header label="Fed · interest rate path" right="2026" />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${camY}px)` }}>
        <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
          {[410, 490, 570, 640, 710].map((y, i) => (
            <line key={i} x1={X0} x2={X1} y1={y} y2={y} stroke={C.line} strokeWidth={2} />
          ))}
          <line x1={NOWX} x2={NOWX} y1={340} y2={base + 120} stroke="rgba(255,255,255,.25)" strokeDasharray="6 10" strokeWidth={2} opacity={hT} />
          <path d={drawPath(hist)} fill="none" stroke={C.white} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={hL} strokeDashoffset={hL * (1 - hT)} />
          <path
            d={drawPath(cuts)}
            fill="none"
            stroke={C.muted}
            strokeWidth={6}
            strokeDasharray={`14 14`}
            strokeLinejoin="round"
            opacity={(cT > 0 ? 1 : 0) * mix(kT, 1, 0.35)}
            style={{ clipPath: `inset(0 ${(1 - cT) * 100}% 0 0)` }}
          />
          <path
            d={drawPath(hikes)}
            fill="none"
            stroke={C.green}
            strokeWidth={9}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={kL}
            strokeDashoffset={kL * (1 - kT)}
            style={{ filter: `drop-shadow(0 0 14px ${C.greenGlow})` }}
          />
          {kT > 0.98 ? <circle cx={X1} cy={410} r={14 + Math.sin(f / 5) * 2} fill={C.green} /> : null}
        </svg>
        <div style={{ position: "absolute", left: NOWX - 60, top: base + 130, width: 120, textAlign: "center", ...enter(f, 20, 12, 10) }}>
          <MicroLabel color={C.muted} style={{ fontSize: 20 }}>
            now
          </MicroLabel>
        </div>
        <div style={{ position: "absolute", left: 560, top: 740, ...enter(f, 52) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 32, color: C.muted, opacity: mix(kT, 1, 0.5), textDecoration: kT > 0.6 ? "line-through" : "none" }}>
            Expected: rate cuts
          </div>
        </div>
        <div style={{ position: "absolute", left: 600, top: 300, ...enter(f, 110) }}>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: C.white }}>
            Now: <span style={{ color: C.green }}>hikes possible</span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 330,
            opacity: snap,
            transform: `scale(${mix(snap, 1.5, 1)})`,
            filter: `blur(${(1 - snap) * 8}px)`,
          }}
        >
          <Pill color={C.greenDeep} icon="↑" size={44}>
            RATES
          </Pill>
        </div>
      </div>
    </DarkGround>
  );
};

/* ------------------------------------------------------------------ */
/* Odds (16.25–20.75): 36% rate-hike chance gauge, then "2× a year".   */
/* ------------------------------------------------------------------ */
export const OddsSplit: React.FC = () => {
  const f = useCurrentFrame();
  const t = prog(f, 4, 40, easeInOut);
  const val = 36 * t;
  const R = 250;
  const cx = 540;
  const cy = 700;
  const arc = Math.PI * R;
  const chipsAt = 82; // 19.0 s "saal mein do dafa"
  return (
    <DarkGround glowY={70}>
      <Header label="Rate hike probability" right="FOMC" />
      <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={46} strokeLinecap="round" />
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke={C.green}
          strokeWidth={46}
          strokeLinecap="round"
          strokeDasharray={arc}
          strokeDashoffset={arc * (1 - val / 100)}
          style={{ filter: `drop-shadow(0 0 18px ${C.greenGlow})` }}
        />
        {Array.from({ length: 11 }, (_, i) => {
          const a = Math.PI * (1 - i / 10);
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * (R - 46)}
              y1={cy - Math.sin(a) * (R - 46)}
              x2={cx + Math.cos(a) * (R - 62)}
              y2={cy - Math.sin(a) * (R - 62)}
              stroke="rgba(255,255,255,.3)"
              strokeWidth={3}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - 200, textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontSize: 200, color: C.white, lineHeight: 1, letterSpacing: 2 }}>
          {Math.round(val)}
          <span style={{ color: C.green }}>%</span>
        </div>
        <MicroLabel color={C.muted} style={{ marginTop: 6 }}>
          chance of a rate hike
        </MicroLabel>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 70, display: "flex", justifyContent: "center", gap: 22 }}>
        {["Hike 1", "Hike 2"].map((h, i) => (
          <div key={h} style={enter(f, chipsAt + i * 7)}>
            <Glass style={{ padding: "18px 30px", borderRadius: 26, display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontFamily: F.display, fontSize: 40, color: C.green }}>↑</span>
              <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: C.white }}>{h}</span>
            </Glass>
          </div>
        ))}
        <div style={{ ...enter(f, chipsAt + 16), alignSelf: "center" }}>
          <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 54, color: C.white }}>
            saal mein <span style={{ color: C.green }}>do dafa</span>
          </span>
        </div>
      </div>
    </DarkGround>
  );
};

/* ------------------------------------------------------------------ */
/* XAUUSD chart: range (27.55–33.16) and support test/break (35.5–44.14)*/
/* ------------------------------------------------------------------ */
type Candle = { o: number; c: number; h: number; l: number };
const RANGE_CANDLES: Candle[] = (() => {
  const out: Candle[] = [];
  let p = 4080;
  for (let i = 0; i < 26; i++) {
    const target = i % 8 < 4 ? 4180 : 4020;
    const c = p + (target - p) * 0.35 + (rnd(i) - 0.5) * 40;
    const o = p;
    out.push({ o, c, h: Math.max(o, c) + 8 + rnd(i + 5) * 18, l: Math.min(o, c) - 8 - rnd(i + 7) * 18 });
    p = c;
  }
  return out;
})();
const DROP_CANDLES: Candle[] = (() => {
  const seq = [4040, 3990, 3950, 3900, 3860, 3815, 3802, 3850, 3880, 3845, 3812, 3808, 3770, 3720, 3680];
  const out: Candle[] = [];
  let p = RANGE_CANDLES[RANGE_CANDLES.length - 1].c;
  seq.forEach((c, i) => {
    const o = p;
    out.push({ o, c, h: Math.max(o, c) + 6 + rnd(i + 40) * 14, l: Math.min(o, c) - 6 - rnd(i + 50) * 14 });
    p = c;
  });
  return out;
})();

const PriceChart: React.FC<{ mode: "range" | "support" }> = ({ mode }) => {
  const f = useCurrentFrame();
  const left = 90;
  const right = 860;
  const top = 320;
  const bottom = 880;
  const lo = mode === "range" ? 3940 : 3640;
  const hi = mode === "range" ? 4260 : 4260;
  const y = (v: number) => interpolate(v, [lo, hi], [bottom, top]);

  const all = mode === "range" ? RANGE_CANDLES : [...RANGE_CANDLES, ...DROP_CANDLES];
  const n = all.length;
  const step = (right - left) / (mode === "range" ? 26 : n);
  // candles reveal over time
  let shown: number;
  if (mode === "range") shown = interpolate(f, [0, 120], [8, 26], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  else {
    // 0–27: fall to 3800 (tap at "tap kar de" 36.4 s); 27–200 chop on support; 216+: break
    shown = interpolate(f, [0, 27, 120, 200, 216, 250], [26, 32, 34, 37, 38, 41], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  const camShift = mode === "support" ? 0 : 0;

  // lines
  const l4000 = prog(f, 18, 20, easeInOut);
  const l4200 = prog(f, 68, 20, easeInOut);
  const box = prog(f, 106, 18);
  const sLine = mode === "support" ? prog(f, 0, 20, easeInOut) : 0;
  const tap = mode === "support" ? prog(f, 27, 20) : 0;
  const warn = mode === "support" ? prog(f, 122, 12) : 0;
  const brk = mode === "support" ? prog(f, 216, 10) : 0;
  const shake = brk > 0 && brk < 1 ? Math.sin(f * 2.1) * 8 * (1 - brk) : 0;

  const sY = y(3800);
  const supportColor = brk > 0.5 ? C.red : C.gold;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${shake + camShift}px, 0)` }}>
      <svg width={1080} height={960} style={{ position: "absolute", inset: 0 }}>
        {/* range box */}
        {mode === "range" ? (
          <rect
            x={left}
            y={y(4200)}
            width={(right - left) * box}
            height={y(4000) - y(4200)}
            fill="rgba(47,210,126,0.10)"
            stroke="rgba(47,210,126,0.5)"
            strokeWidth={2}
            rx={10}
          />
        ) : (
          <rect x={left} y={y(4200)} width={step * 26} height={y(4000) - y(4200)} fill="rgba(47,210,126,0.07)" rx={8} />
        )}
        {mode === "range" ? (
          <>
            <line x1={left} x2={left + (right - left) * l4000} y1={y(4000)} y2={y(4000)} stroke={C.gold} strokeWidth={3} strokeDasharray="10 10" />
            <line x1={left} x2={left + (right - left) * l4200} y1={y(4200)} y2={y(4200)} stroke={C.gold} strokeWidth={3} strokeDasharray="10 10" />
          </>
        ) : (
          <line x1={left} x2={left + (right - left) * sLine} y1={sY} y2={sY} stroke={supportColor} strokeWidth={4} strokeDasharray="12 10" style={{ filter: `drop-shadow(0 0 10px ${brk > 0.5 ? C.redGlow : "rgba(217,182,110,.5)"})` }} />
        )}
        {all.slice(0, Math.floor(shown)).map((c, i) => {
          const isLast = i === Math.floor(shown) - 1;
          const grow = isLast ? shown - Math.floor(shown) || 1 : 1;
          const up = c.c >= c.o;
          const col = up ? C.green : C.red;
          const cxp = left + step * (i + 0.5);
          const bt = y(Math.max(c.o, c.c));
          const bb = y(Math.min(c.o, c.c));
          return (
            <g key={i} opacity={mode === "support" && i < 26 ? 0.55 : 1}>
              <line x1={cxp} x2={cxp} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={3} />
              <rect x={cxp - step * 0.32} y={bt} width={step * 0.64} height={Math.max(4, (bb - bt) * grow)} fill={col} rx={3} />
            </g>
          );
        })}
        {tap > 0 && tap < 1 ? (
          <circle cx={left + step * 31.5} cy={sY} r={20 + tap * 70} fill="none" stroke={C.gold} strokeWidth={4} opacity={1 - tap} />
        ) : null}
      </svg>
      {/* price labels (right axis) */}
      {mode === "range" ? (
        <>
          <PriceTag v="4200" yv={y(4200)} t={l4200} />
          <PriceTag v="4000" yv={y(4000)} t={l4000} />
          <div style={{ position: "absolute", left: left + 24, top: y(4200) + 16, ...enter(f, 108, 12, 12) }}>
            <MicroLabel color={C.green} style={{ fontSize: 24 }}>
              consolidation
            </MicroLabel>
          </div>
        </>
      ) : (
        <>
          <PriceTag v="3800" yv={sY} t={sLine} color={supportColor} />
          <div style={{ position: "absolute", left: left + 20, top: sY + 18, ...enter(f, 6, 12, 12) }}>
            <MicroLabel color={supportColor} style={{ fontSize: 24 }}>
              {brk > 0.5 ? "support broken" : "last support"}
            </MicroLabel>
          </div>
          <div style={{ position: "absolute", left: 480, top: 340, opacity: warn * (1 - brk), transform: `scale(${mix(warn, 1.3, 1)})` }}>
            <Pill color="#C98A2E" icon="⚠" size={34}>
              maamlaat kharab?
            </Pill>
          </div>
          <div
            style={{
              position: "absolute",
              left: 560,
              top: 340,
              opacity: brk,
              transform: `scale(${mix(brk, 1.6, 1)})`,
              filter: `blur(${(1 - brk) * 10}px)`,
            }}
          >
            <Pill color={C.red} icon="↓" size={44}>
              BREAK
            </Pill>
          </div>
        </>
      )}
    </div>
  );
};

const PriceTag: React.FC<{ v: string; yv: number; t: number; color?: string }> = ({ v, yv, t, color = C.gold }) => (
  <div
    style={{
      position: "absolute",
      left: 878,
      top: yv - 26,
      padding: "8px 14px",
      borderRadius: 12,
      background: color,
      color: C.ink,
      fontFamily: F.mono,
      fontSize: 30,
      opacity: t,
      transform: `translateX(${(1 - t) * 30}px)`,
    }}
  >
    {v}
  </div>
);

export const RangeSplit: React.FC = () => (
  <DarkGround glowY={60}>
    <Header label="XAUUSD · gold" right="4H" />
    <PriceChart mode="range" />
  </DarkGround>
);

export const SupportSplit: React.FC = () => (
  <DarkGround glowY={70}>
    <Header label="XAUUSD · gold" right="4H" />
    <PriceChart mode="support" />
  </DarkGround>
);

/* ------------------------------------------------------------------ */
/* CTA (51.73–60.3): signals chat + P&L proof, link in bio, join.      */
/* ------------------------------------------------------------------ */
export const CtaSplit: React.FC = () => {
  const f = useCurrentFrame();
  const pnl = prog(f, 40, 50, easeInOut);
  const bioAt = 116; // 55.6 s
  const joinAt = 170; // 57.4 s
  const click = prog(f, joinAt + 22, 8);
  const ripple = prog(f, joinAt + 24, 20);
  const shotsUp = prog(f, bioAt - 8, 18, easeInOut); // shots shrink up to make room
  const shot = (src: string, x: number, rot: number, at: number, w: number, crop: number) => {
    const t = prog(f, at, 16);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: mix(shotsUp, 300, 292),
          width: w,
          height: mix(shotsUp, 470, 300),
          borderRadius: 28,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.14)",
          boxShadow: "0 30px 60px rgba(0,0,0,.55)",
          opacity: t,
          transform: `translateY(${(1 - t) * 60 + Math.sin((f + at) / 24) * 5}px) rotate(${rot * t}deg) scale(${mix(t, 0.85, 1)})`,
          filter: `blur(${(1 - t) * 8}px)`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", position: "absolute", top: -crop }} />
      </div>
    );
  };
  return (
    <DarkGround glowY={55}>
      <Header label={COMMUNITY} right="community" />
      {shot("anfaal/signals.png", 110, -4, 4, 400, 120)}
      {shot("anfaal/pnl.png", 570, 4, 18, 400, 0)}
      {/* P&L badge */}
      <div style={{ position: "absolute", left: 600, top: mix(shotsUp, 690, 520), ...enter(f, 40) }}>
        <Glass style={{ padding: "16px 26px", borderRadius: 24 }}>
          <MicroLabel color={C.muted} style={{ fontSize: 18 }}>
            xauusd · profit
          </MicroLabel>
          <div style={{ fontFamily: F.mono, fontSize: 50, color: C.green, marginTop: 4 }}>
            +${Math.round(5303 * pnl).toLocaleString("en-US")}
          </div>
        </Glass>
      </div>
      {/* link in bio */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", ...enter(f, bioAt) }}>
        <Glass style={{ padding: "18px 30px", borderRadius: 999, display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: C.green }}>↑</span>
          <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: C.white }}>{HANDLE}</span>
          <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 38, color: C.muted }}>link in bio</span>
        </Glass>
      </div>
      {/* join button */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, display: "flex", justifyContent: "center", ...enter(f, joinAt) }}>
        <div style={{ position: "relative", transform: `scale(${1 - click * 0.05 + ripple * 0.05})` }}>
          <div
            style={{
              padding: "24px 56px",
              borderRadius: 999,
              background: `linear-gradient(180deg, #4BE394, ${C.greenDeep})`,
              color: "#04130B",
              fontFamily: F.sans,
              fontWeight: 800,
              fontSize: 40,
              boxShadow: `0 20px 50px ${C.greenGlow}, inset 0 1px 0 rgba(255,255,255,.5)`,
            }}
          >
            Join Community
          </div>
          {ripple > 0 && ripple < 1 ? (
            <div
              style={{
                position: "absolute",
                inset: -20 * ripple,
                borderRadius: 999,
                border: `3px solid ${C.green}`,
                opacity: 1 - ripple,
              }}
            />
          ) : null}
          {/* cursor */}
          <div
            style={{
              position: "absolute",
              left: mix(prog(f, joinAt + 6, 16, easeInOut), 420, 300),
              top: mix(prog(f, joinAt + 6, 16, easeInOut), 140, 50),
              fontSize: 54,
              opacity: prog(f, joinAt + 6, 6),
              transform: `scale(${1 - click * 0.15})`,
              filter: "drop-shadow(0 6px 10px rgba(0,0,0,.5))",
            }}
          >
            <svg width={44} height={54} viewBox="0 0 22 27">
              <path d="M1 1 L1 21 L6 16.5 L9.5 25 L13 23.5 L9.5 15.5 L16 15.5 Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </DarkGround>
  );
};

