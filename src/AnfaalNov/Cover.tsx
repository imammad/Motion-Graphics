import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F, HANDLE } from "./brand";
import { MicroLabel, rnd } from "./kit";

// Instagram cover, "Gold 1st November update". Clean brand ground (no restaurant
// background): gold glow + falling XAUUSD chart onto a glowing 3800 support line,
// big gold 3800 behind the cap, bright cut-out, bold headline on the chest.
// Text stays inside the 3:4 grid crop (y 240–1680) and off the face.

const FACE = { x: 470, y: 1256 }; // face centre in the 43.25 s frame
const S = 0.6;
const FACE_TO = 860;
const SUPPORT_Y = 1035;

// stylised price path falling into 3800 (behind the person)
const PATH: [number, number][] = [];
for (let i = 0; i <= 26; i++) {
  const x = -20 + i * 44;
  const y = 380 + i * 25 + Math.sin(i * 1.15) * 38;
  PATH.push([x, Math.min(y, SUPPORT_Y - 8 + Math.sin(i) * 6)]);
}
const candles = PATH.slice(0, -1).map((p, i) => {
  const o = p[1];
  const c = PATH[i + 1][1];
  const up = c < o;
  return { x: p[0] + 14, top: Math.min(o, c), h: Math.max(10, Math.abs(c - o)), up, wick: 24 + rnd(i) * 30 };
});

const Chip: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: 14,
      padding: "16px 30px",
      borderRadius: 999,
      background: "linear-gradient(180deg, rgba(26,46,36,.95), rgba(12,22,17,.95))",
      border: "1px solid rgba(220,255,235,.16)",
      boxShadow: "0 14px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)",
    }}
  >
    <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 36, color: C.white }}>{label}</span>
    <span style={{ fontFamily: F.mono, fontSize: 40, color }}>{value}</span>
  </div>
);

export const AnfaalNovCover: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(85% 60% at 50% 40%, #16301F 0%, #0B1712 55%, ${C.ink} 100%)` }}>
    {/* grid */}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
        backgroundSize: "72px 72px",
        opacity: 0.45,
        maskImage: "radial-gradient(70% 55% at 50% 45%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(70% 55% at 50% 45%, black 30%, transparent 100%)",
      }}
    />
    {/* gold glow behind the head */}
    <AbsoluteFill style={{ background: "radial-gradient(30% 18% at 50% 44%, rgba(217,182,110,.4) 0%, rgba(217,182,110,0) 100%)" }} />

    {/* falling chart onto 3800 */}
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {candles.map((c, i) => (
        <g key={i} opacity={0.55}>
          <line x1={c.x + 8} x2={c.x + 8} y1={c.top - c.wick / 2} y2={c.top + c.h + c.wick / 2} stroke={c.up ? C.green : C.red} strokeWidth={4} />
          <rect x={c.x} y={c.top} width={16} height={c.h} rx={4} fill={c.up ? C.green : C.red} />
        </g>
      ))}
      <line x1={0} x2={1080} y1={SUPPORT_Y} y2={SUPPORT_Y} stroke={C.gold} strokeWidth={5} strokeDasharray="18 14" style={{ filter: "drop-shadow(0 0 12px rgba(217,182,110,.8))" }} />
    </svg>
    <div style={{ position: "absolute", right: 46, top: SUPPORT_Y - 30, padding: "8px 18px", borderRadius: 14, background: C.gold, color: C.ink, fontFamily: F.mono, fontSize: 34 }}>
      3800
    </div>

    {/* big 3800 behind the cap */}
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 255,
          fontFamily: F.display,
          fontSize: 400,
          lineHeight: 1.05,
          letterSpacing: 2,
          backgroundImage: "linear-gradient(180deg, #FFF3D6 0%, #E8C77F 42%, #A9823C 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 12px 30px rgba(0,0,0,.35))",
        }}
      >
        3800
      </div>
    </AbsoluteFill>

    {/* bright cut-out with a soft gold rim */}
    <AbsoluteFill
      style={{
        transformOrigin: `${FACE.x}px ${FACE.y}px`,
        transform: `translate(${540 - FACE.x}px, ${FACE_TO - FACE.y}px) scale(${S})`,
      }}
    >
      <Img
        src={staticFile("anfaal3/cover_head.png")}
        style={{
          width: 1080,
          height: 1920,
          filter:
            "brightness(1.02) contrast(1.03) drop-shadow(0 0 22px rgba(217,182,110,.35)) drop-shadow(0 30px 50px rgba(0,0,0,.55))",
        }}
      />
    </AbsoluteFill>

    {/* soft shadow from the lower-left hides the table edge by the shoulder */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 930,
        width: 1080,
        height: 420,
        background: `linear-gradient(90deg, ${C.ink} 0%, rgba(7,16,12,.9) 26%, rgba(7,16,12,.55) 38%, rgba(7,16,12,0) 50%)`,
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 35%)",
        maskImage: "linear-gradient(180deg, transparent 0%, black 35%)",
      }}
    />
    {/* chest shade for the headline */}
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(7,16,12,0) 58%, rgba(7,16,12,.6) 64%, ${C.ink} 74%)` }} />

    <div style={{ position: "absolute", top: 1235, left: 50, right: 50, textAlign: "center" }}>
      <MicroLabel color={C.green} style={{ fontSize: 26, letterSpacing: 10 }}>
        xauusd · 01 nov update
      </MicroLabel>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 24, marginTop: 12 }}>
        <span style={{ fontFamily: F.display, fontSize: 176, color: C.white, lineHeight: 1 }}>GOLD</span>
        <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 128, color: C.gold, lineHeight: 1 }}>ab kahan?</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 32 }}>
        <Chip label="Support" value="3800" color={C.gold} />
        <Chip label="Break?" value="↓" color={C.red} />
      </div>
    </div>

    <div style={{ position: "absolute", top: 1712, left: 0, right: 0, textAlign: "center" }}>
      <MicroLabel color={C.muted} style={{ fontSize: 22 }}>
        {HANDLE}
      </MicroLabel>
    </div>
  </AbsoluteFill>
);
