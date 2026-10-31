import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F, HANDLE } from "./brand";
import { MicroLabel, rnd } from "./kit";

// Instagram cover, 1080×1920, same brand as the reel.
// Text stays inside the 3:4 profile-grid crop (y 240–1680) and never on the face.
// Layers: graded frame → faint XAUUSD candles → GOLD → head cut-out (GOLD sits behind
// the hair) → brand shading → headline on the chest.

const FACE = { x: 540, y: 1180 }; // face centre in the 9.5 s frame
const S = 0.88;
const FACE_TO = 960; // face high enough that the chest is free for the headline

const candles = Array.from({ length: 22 }, (_, i) => {
  const base = 760 - Math.sin(i / 3) * 110 - i * 5;
  const up = rnd(i) > 0.45;
  const body = 40 + rnd(i + 3) * 70;
  return { x: 40 + i * 48, y: base, h: body, up, wick: body + 40 + rnd(i + 9) * 50 };
});

const Framed: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <AbsoluteFill
    style={{
      transformOrigin: `${FACE.x}px ${FACE.y}px`,
      transform: `translateY(${FACE_TO - FACE.y}px) scale(${S})`,
    }}
  >
    <Img src={staticFile(src)} style={{ width: 1080, height: 1920, ...style }} />
  </AbsoluteFill>
);

export const AnfaalCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      {/* blurred extension fills the sides, sharp frame on top with feathered edges */}
      <AbsoluteFill style={{ transform: "scale(1.35)", filter: "blur(28px) brightness(0.5)" }}>
        <Img src={staticFile("anfaal/cover_frame.png")} style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      <Framed
        src="anfaal/cover_frame.png"
        style={{
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      />
      {/* brand shading: green-black vignette, face left untouched */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(42% 26% at 50% ${(FACE_TO / 1920) * 100}%, transparent 45%, rgba(7,18,12,.78) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: "rgba(10,40,24,0.18)", mixBlendMode: "multiply" }} />
      {/* faint gold-chart texture on the roof */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.28 }}>
        {candles.map((c, i) => (
          <g key={i}>
            <line x1={c.x + 14} x2={c.x + 14} y1={c.y - c.wick / 2} y2={c.y + c.wick / 2} stroke={c.up ? C.green : C.red} strokeWidth={3} />
            <rect x={c.x} y={c.y - c.h / 2} width={28} height={c.h} rx={4} fill={c.up ? C.green : C.red} />
          </g>
        ))}
      </svg>

      {/* GOLD behind the head */}
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 215,
            fontFamily: F.display,
            fontSize: 410,
            lineHeight: 1.05,
            letterSpacing: -2,
            backgroundImage: "linear-gradient(180deg, #FFF1CF 0%, #E2BF77 45%, #A07A35 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 24px 50px rgba(0,0,0,.55))",
          }}
        >
          GOLD
        </div>
      </AbsoluteFill>

      {/* head cut-out (same framing), slightly brighter than the graded ground */}
      <Framed src="anfaal/cover_head.png" />

      {/* shade the chest so the headline reads; stays below the chin (~1300) */}
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(7,16,12,0) 64%, rgba(7,16,12,.82) 71%, #07100C 82%)" }}
      />

      {/* headline */}
      <div style={{ position: "absolute", top: 1300, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 20 }}>
          <span style={{ fontFamily: F.display, fontSize: 132, color: C.red, lineHeight: 1, textShadow: `0 0 40px ${C.redGlow}` }}>
            CRASH
          </span>
          <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 84, color: C.white }}>ya</span>
        </div>
        <div style={{ fontFamily: F.display, fontSize: 120, color: C.green, lineHeight: 1.02, marginTop: 2, textShadow: `0 0 40px ${C.greenGlow}` }}>
          ALL-TIME HIGH?
        </div>
        <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 54, color: C.white, marginTop: 4 }}>
          FOMC pe sirf <span style={{ color: C.gold }}>facts</span>, no panic
        </div>
      </div>

      <div style={{ position: "absolute", top: 1700, left: 0, right: 0, textAlign: "center" }}>
        <MicroLabel color={C.muted} style={{ fontSize: 22 }}>
          {HANDLE}
        </MicroLabel>
      </div>
    </AbsoluteFill>
  );
};
