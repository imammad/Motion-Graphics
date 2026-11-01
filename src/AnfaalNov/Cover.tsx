import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, F, HANDLE } from "./brand";
import { MicroLabel, rnd } from "./kit";

// Instagram cover for the "Gold 1st November update" reel, Forex Trading brand.
// The face fills the source frame, so the frame is scaled down over a blurred extension
// of itself. Text inside the 3:4 grid crop (y 240–1680), never on the face.

const FACE = { x: 470, y: 1256 }; // face centre in the 43.25 s frame (soft smile)
const S = 0.62;
const FACE_TO = 880;

const candles = Array.from({ length: 22 }, (_, i) => {
  const base = 560 + i * 8 + Math.sin(i / 2.5) * 40;
  const up = rnd(i) > 0.6;
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
      boxShadow: "0 12px 28px rgba(0,0,0,.35)",
    }}
  >
    <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: C.white }}>{label}</span>
    <span style={{ fontFamily: F.mono, fontSize: 38, color }}>{value}</span>
  </div>
);

export const AnfaalNovCover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    {/* blurred extension fills the frame; the sharp frame sits on top, feathered */}
    <AbsoluteFill style={{ transform: "scale(1.4)", filter: "blur(30px) brightness(0.45)" }}>
      <Img src={staticFile("anfaal3/cover_frame.png")} style={{ width: 1080, height: 1920 }} />
    </AbsoluteFill>
    <Framed
      src="anfaal3/cover_frame.png"
      style={{
        WebkitMaskImage: "radial-gradient(46% 42% at 50% 58%, black 40%, transparent 100%)",
        maskImage: "radial-gradient(46% 42% at 50% 58%, black 40%, transparent 100%)",
      }}
    />
    <AbsoluteFill
      style={{ background: `radial-gradient(40% 24% at 50% ${(FACE_TO / 1920) * 100}%, transparent 45%, rgba(7,18,12,.72) 100%)` }}
    />
    <AbsoluteFill style={{ background: "rgba(10,40,24,0.2)", mixBlendMode: "multiply" }} />
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.26 }}>
      {candles.map((c, i) => (
        <g key={i}>
          <line x1={c.x + 14} x2={c.x + 14} y1={c.y - c.wick / 2} y2={c.y + c.wick / 2} stroke={c.up ? C.green : C.red} strokeWidth={3} />
          <rect x={c.x} y={c.y - c.h / 2} width={28} height={c.h} rx={4} fill={c.up ? C.green : C.red} />
        </g>
      ))}
    </svg>

    {/* 3800 behind the cap */}
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 200,
          fontFamily: F.display,
          fontSize: 380,
          lineHeight: 1.05,
          backgroundImage: "linear-gradient(180deg, #FFF1CF 0%, #E2BF77 45%, #A07A35 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 10px 26px rgba(0,0,0,.3))",
        }}
      >
        3800
      </div>
    </AbsoluteFill>

    <Framed src="anfaal3/cover_head.png" />

    <AbsoluteFill
      style={{ background: "linear-gradient(180deg, rgba(7,16,12,0) 54%, rgba(7,16,12,.35) 61%, rgba(7,16,12,.7) 68%, rgba(7,16,12,.88) 78%, rgba(7,16,12,.94) 100%)" }}
    />

    <div style={{ position: "absolute", top: 1220, left: 60, right: 60, textAlign: "center" }}>
      <MicroLabel color={C.green} style={{ fontSize: 24, letterSpacing: 9 }}>
        xauusd · gold update
      </MicroLabel>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 22, marginTop: 10 }}>
        <span style={{ fontFamily: F.display, fontSize: 160, color: C.gold, lineHeight: 1 }}>GOLD</span>
        <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 120, color: C.white, lineHeight: 1 }}>ab kahan?</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 30 }}>
        <Chip label="Support" value="3800" color={C.gold} />
        <Chip label="Update" value="01 NOV" color={C.green} />
      </div>
    </div>

    <div style={{ position: "absolute", top: 1704, left: 0, right: 0, textAlign: "center" }}>
      <MicroLabel color={C.muted} style={{ fontSize: 22 }}>
        {HANDLE}
      </MicroLabel>
    </div>
  </AbsoluteFill>
);
