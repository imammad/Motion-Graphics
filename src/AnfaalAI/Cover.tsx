import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F, HANDLE } from "./brand";
import { MicroLabel, rnd } from "./kit";

// Instagram cover for the "AI bubble burst" reel, 1080×1920, Forex Trading brand.
// Text stays inside the 3:4 grid crop (y 240–1680) and off the face.
// Layers: graded frame → brand shading → faint red candles → CRASH → head cut-out
// (CRASH sits behind the hair) → chest gradient → headline.

const FACE = { x: 552, y: 917 }; // face centre in the 24.0 s frame
const S = 1.28;
const FACE_TO = 820;

const candles = Array.from({ length: 22 }, (_, i) => {
  const base = 520 + i * 9 + Math.sin(i / 2.5) * 50; // drifting down = crash
  const up = rnd(i) > 0.62;
  const body = 40 + rnd(i + 3) * 70;
  return { x: 40 + i * 48, y: base, h: body, up, wick: body + 40 + rnd(i + 9) * 50 };
});

const Framed: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <AbsoluteFill
    style={{
      transformOrigin: `${FACE.x}px ${FACE.y}px`,
      transform: `translate(${540 - FACE.x}px, ${FACE_TO - FACE.y}px) scale(${S})`,
    }}
  >
    <Img src={staticFile(src)} style={{ width: 1080, height: 1920, ...style }} />
  </AbsoluteFill>
);

const Chip: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: 14,
      padding: "14px 26px",
      borderRadius: 999,
      background: "linear-gradient(180deg, rgba(22,40,31,.92), rgba(10,20,15,.92))",
      border: "1px solid rgba(220,255,235,.14)",
      boxShadow: "0 16px 36px rgba(0,0,0,.45)",
    }}
  >
    <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: C.white }}>{label}</span>
    <span style={{ fontFamily: F.mono, fontSize: 38, color }}>{value}</span>
  </div>
);

export const AnfaalAICover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Framed src="anfaal2/cover_frame.png" />
      {/* brand shading: darken the busy wall, face untouched */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 24% at 50% ${(FACE_TO / 1920) * 100}%, transparent 45%, rgba(7,18,12,.82) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: "rgba(10,40,24,0.22)", mixBlendMode: "multiply" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
        {candles.map((c, i) => (
          <g key={i}>
            <line x1={c.x + 14} x2={c.x + 14} y1={c.y - c.wick / 2} y2={c.y + c.wick / 2} stroke={c.up ? C.green : C.red} strokeWidth={3} />
            <rect x={c.x} y={c.y - c.h / 2} width={28} height={c.h} rx={4} fill={c.up ? C.green : C.red} />
          </g>
        ))}
      </svg>

      {/* CRASH behind the head */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 232,
            fontFamily: F.display,
            fontSize: 345,
            lineHeight: 1.05,
            letterSpacing: -1,
            backgroundImage: "linear-gradient(180deg, #FFD6D7 0%, #FF6B70 50%, #C9343A 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 24px 50px rgba(0,0,0,.55))",
          }}
        >
          CRASH
        </div>
      </AbsoluteFill>

      <Framed src="anfaal2/cover_head.png" />

      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(7,16,12,0) 58%, rgba(7,16,12,.84) 66%, #07100C 80%)" }}
      />

      {/* headline on the chest */}
      <div style={{ position: "absolute", top: 1190, left: 60, right: 60, textAlign: "center" }}>
        <MicroLabel color={C.green} style={{ fontSize: 24, letterSpacing: 9 }}>
          US stocks · gold · oil
        </MicroLabel>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, marginTop: 10 }}>
          <span style={{ fontFamily: F.display, fontSize: 150, color: C.white, lineHeight: 1 }}>AI BUBBLE</span>
        </div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 120, color: C.red, lineHeight: 1, textShadow: `0 0 40px ${C.redGlow}` }}>
          burst?
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 28 }}>
          <Chip label="Gold" value="3872" color={C.gold} />
          <Chip label="Oil" value="$105" color={C.red} />
        </div>
      </div>

      <div style={{ position: "absolute", top: 1704, left: 0, right: 0, textAlign: "center" }}>
        <MicroLabel color={C.muted} style={{ fontSize: 22 }}>
          {HANDLE}
        </MicroLabel>
      </div>
    </AbsoluteFill>
  );
};
