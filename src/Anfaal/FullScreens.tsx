import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F } from "./brand";
import { DarkGround, LightGround, MicroLabel, easeInOut, enter, mix, prog, rnd } from "./kit";

/* ------------------------------------------------------------------ */
/* Rumours (3.55–7.54 s): fake headlines flood in, then PANIC snaps.   */
/* Message: the FOMC "crash / ATH" talk is just rumour and panic.      */
/* ------------------------------------------------------------------ */
const RUMOURS = [
  { t: "GOLD WILL CRASH AFTER FOMC 🚨", src: "@market_alerts", x: -130, y: 520, r: -5 },
  { t: "Gold to $5,000 this week?!", src: "Telegram · VIP", x: 150, y: 700, r: 4 },
  { t: "SELL EVERYTHING NOW 📉", src: "@fx_guru", x: -110, y: 880, r: -3 },
  { t: "Breaking: all-time high incoming", src: "Twitter / X", x: 120, y: 1060, r: 5 },
  { t: "FOMC = market dump", src: "WhatsApp fwd", x: -60, y: 1240, r: -4 },
];

export const RumoursScene: React.FC = () => {
  const f = useCurrentFrame();
  const panic = 84; // "panic" is spoken at 6.35 s → local frame ~84
  const pt = prog(f, panic, 10);
  const shake = f >= panic ? Math.sin(f * 2.3) * 6 * (1 - prog(f, panic, 24)) : 0;
  const zoom = mix(prog(f, 0, 110, easeInOut), 1.06, 1.0) * mix(pt, 1, 1.04);
  return (
    <DarkGround glowY={45} glow={pt > 0 ? `rgba(255,90,95,${0.12 + 0.12 * pt})` : undefined}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translateX(${shake}px)` }}>
        {/* headline, top third */}
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center" }}>
          <div style={enter(f, 2)}>
            <MicroLabel color={C.muted}>FOMC week · your feed</MicroLabel>
          </div>
          <div
            style={{
              ...enter(f, 8, 14, 40),
              fontFamily: F.serif,
              fontStyle: "italic",
              fontSize: 120,
              color: C.white,
              marginTop: 6,
              opacity: (enter(f, 8).opacity as number) * (1 - pt * 0.7),
            }}
          >
            sirf <span style={{ color: C.green }}>afwaahein</span>
          </div>
        </div>
        {/* rumour notifications */}
        {RUMOURS.map((r, i) => {
          const at = 14 + i * 9;
          const t = prog(f, at, 14);
          const drift = Math.sin((f + i * 30) / 26) * 6;
          const red = pt * (0.6 + 0.4 * rnd(i));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540 - 380 + r.x,
                top: r.y + drift,
                width: 760,
                opacity: t * (1 - pt * 0.45),
                transform: `translateY(${(1 - t) * 80}px) rotate(${r.r * t}deg) scale(${mix(t, 0.8, 1)})`,
                filter: `blur(${(1 - t) * 10 + pt * 3}px)`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 22,
                  alignItems: "center",
                  padding: "26px 30px",
                  borderRadius: 30,
                  background: `linear-gradient(180deg, rgba(30,${46 - red * 20},${38 - red * 20},.95), rgba(14,22,18,.95))`,
                  border: `1px solid rgba(${red > 0.1 ? "255,90,95" : "220,255,235"},${0.12 + red * 0.4})`,
                  boxShadow: "0 30px 60px rgba(0,0,0,.5)",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    background: red > 0.1 ? C.red : C.greenDeep,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    color: "#fff",
                    fontFamily: F.sans,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  !
                </div>
                <div style={{ fontFamily: F.sans }}>
                  <div style={{ color: C.muted, fontSize: 22, fontWeight: 600, letterSpacing: 1 }}>{r.src}</div>
                  <div style={{ color: C.white, fontSize: 36, fontWeight: 700, letterSpacing: -0.5, marginTop: 4 }}>{r.t}</div>
                </div>
              </div>
            </div>
          );
        })}
        {/* PANIC snap */}
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: F.display,
              fontSize: 330,
              letterSpacing: 4,
              color: C.red,
              opacity: pt,
              transform: `scale(${mix(pt, 1.5, 1)})`,
              filter: `blur(${(1 - pt) * 16}px)`,
              textShadow: `0 0 60px ${C.redGlow}, 0 20px 60px rgba(0,0,0,.6)`,
              marginTop: -40,
            }}
          >
            PANIC
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </DarkGround>
  );
};

/* ------------------------------------------------------------------ */
/* Liquidity (22.55–27.1 s, light): rates up → market liquidity drains */
/* → no money into gold, no money into crypto.                        */
/* ------------------------------------------------------------------ */
export const LiquidityScene: React.FC = () => {
  const f = useCurrentFrame();
  const drain = prog(f, 14, 50, easeInOut);
  const level = mix(drain, 0.82, 0.16);
  const goldAt = 62; // 24.6 s
  const cryptoAt = 96; // 25.75 s
  const zoom = mix(prog(f, 0, 136, easeInOut), 1.07, 1.0);
  const vesselW = 420;
  const vesselH = 520;
  const tile = (label: string, color: string, at: number, x: number) => {
    const t = prog(f, at, 12);
    const x2 = prog(f, at + 12, 10);
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: 1170,
          width: 340,
          padding: "30px 28px",
          borderRadius: 34,
          background: "linear-gradient(180deg,#FFFFFF,#F4F7F4)",
          boxShadow: "0 30px 60px rgba(20,40,30,.14), 0 6px 14px rgba(20,40,30,.08)",
          opacity: t,
          transform: `translateY(${(1 - t) * 40}px) scale(${mix(t, 0.88, 1)})`,
          filter: `blur(${(1 - t) * 8}px)`,
          textAlign: "left",
        }}
      >
        <MicroLabel color="#7B8A82" style={{ fontSize: 20 }}>
          inflow
        </MicroLabel>
        <div style={{ fontFamily: F.display, fontSize: 84, color, lineHeight: 1.05, marginTop: 6 }}>{label}</div>
        <div
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: F.mono,
            fontSize: 30,
            color: C.red,
            opacity: x2,
            transform: `scale(${mix(x2, 1.4, 1)})`,
          }}
        >
          ✕ $0
        </div>
      </div>
    );
  };
  return (
    <LightGround>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div style={{ position: "absolute", top: 240, left: 0, right: 0, textAlign: "center" }}>
          <div style={enter(f, 2)}>
            <MicroLabel color="#6F7E76">jab interest rate ↑</MicroLabel>
          </div>
          <div style={{ ...enter(f, 6, 14, 40), marginTop: 8 }}>
            <span style={{ fontFamily: F.display, fontSize: 132, color: C.paperInk, letterSpacing: 1 }}>LIQUIDITY </span>
            <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 130, color: C.red }}>khatam</span>
          </div>
        </div>
        {/* vessel */}
        <div
          style={{
            position: "absolute",
            left: 540 - vesselW / 2,
            top: 520,
            width: vesselW,
            height: vesselH,
            borderRadius: 60,
            background: "linear-gradient(180deg, rgba(255,255,255,.9), rgba(236,242,238,.9))",
            boxShadow: "0 40px 80px rgba(20,40,30,.16), inset 0 0 0 2px rgba(20,60,40,.08)",
            overflow: "hidden",
            ...enter(f, 4, 14, 40),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: `${level * 100}%`,
              background: `linear-gradient(180deg, #5BE7A0 0%, ${C.green} 30%, ${C.greenDeep} 100%)`,
            }}
          >
            <svg width={vesselW} height={30} style={{ position: "absolute", top: -14, left: 0 }}>
              <path
                d={`M0 15 ${Array.from({ length: 9 }, (_, i) => `Q ${i * 50 + 25} ${15 + Math.sin(f / 6 + i) * 9} ${(i + 1) * 50} 15`).join(" ")} V30 H0 Z`}
                fill="#5BE7A0"
              />
            </svg>
          </div>
          <div style={{ position: "absolute", top: 34, left: 0, right: 0, textAlign: "center" }}>
            <MicroLabel color="#5E6E66">market</MicroLabel>
            <div style={{ fontFamily: F.mono, fontSize: 56, color: C.paperInk, marginTop: 6 }}>
              {Math.round(level * 100)}%
            </div>
          </div>
        </div>
        {/* money particles leaving through the bottom */}
        {Array.from({ length: 16 }, (_, i) => {
          const life = ((f - 18 - i * 3) % 40) / 40;
          if (f < 18 + i * 3 || f > 70) return null;
          const x = 540 + (rnd(i) - 0.5) * 220 + life * (rnd(i + 9) - 0.5) * 500;
          const y = 1050 + life * 130;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                fontFamily: F.mono,
                fontSize: 30,
                color: C.greenDeep,
                opacity: (1 - life) * 0.8,
                transform: `rotate(${(rnd(i + 3) - 0.5) * 60}deg)`,
              }}
            >
              $
            </div>
          );
        })}
        {/* rate badge */}
        <div
          style={{
            position: "absolute",
            left: 540 + vesselW / 2 - 60,
            top: 470,
            padding: "14px 24px",
            borderRadius: 24,
            background: C.paperInk,
            color: "#fff",
            fontFamily: F.sans,
            fontWeight: 800,
            fontSize: 30,
            boxShadow: "0 18px 36px rgba(0,0,0,.2)",
            ...enter(f, 10),
          }}
        >
          RATES <span style={{ color: C.green }}>↑</span>
        </div>
        {tile("GOLD", C.goldDeep, goldAt, 140)}
        {tile("CRYPTO", C.paperInk, cryptoAt, 600)}
      </AbsoluteFill>
    </LightGround>
  );
};

