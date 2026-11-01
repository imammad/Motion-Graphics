import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, F, FPS } from "./brand";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const sec = (s: number) => Math.round(s * FPS);

/** 0→1 progress from frame `start` over `dur` frames with an easing. */
export const prog = (frame: number, start: number, dur: number, ease = easeOut) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const mix = (t: number, a: number, b: number) => a + (b - a) * t;

/** Standard entrance: rise + fade + de-blur + slight scale. Returns style. */
export const enter = (frame: number, at: number, dur = 12, rise = 30): React.CSSProperties => {
  const t = prog(frame, at, dur);
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * rise}px) scale(${mix(t, 0.9, 1)})`,
    filter: `blur(${(1 - t) * 8}px)`,
  };
};

/** Entrance + quicker exit. */
export const inOut = (frame: number, at: number, end: number, dur = 12, rise = 30): React.CSSProperties => {
  const t = prog(frame, at, dur);
  const o = prog(frame, end - 7, 7, easeIn);
  return {
    opacity: t * (1 - o),
    transform: `translateY(${(1 - t) * rise - o * 10}px) scale(${mix(t, 0.9, 1) * mix(o, 1, 0.96)})`,
    filter: `blur(${(1 - t) * 8 + o * 8}px)`,
  };
};

export const MicroLabel: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.muted,
  style,
}) => (
  <div
    style={{
      fontFamily: F.sans,
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: 5,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Dark ground with grid + soft glow, for split panels and dark full screens. */
export const DarkGround: React.FC<{ glowY?: number; glow?: string; children?: React.ReactNode }> = ({
  glowY = 50,
  glow = "rgba(47,210,126,0.16)",
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% ${glowY}%, #10241A 0%, ${C.ink} 70%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          backgroundPosition: `0 ${(frame * 0.4) % 72}px`,
          opacity: 0.5,
          maskImage: "radial-gradient(80% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(80% 70% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 30% at 50% ${glowY}%, ${glow} 0%, transparent 100%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

/** Light ground for light full screens (premium, contrasts the car footage). */
export const LightGround: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(110% 80% at 50% 42%, #FFFFFF 0%, ${C.paper} 55%, #E3E9E4 100%)` }}>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            border: `60px solid rgba(47,210,126,0.13)`,
            filter: "blur(30px)",
            left: i ? 720 : -260,
            top: i ? -180 + Math.sin(frame / 40) * 14 : 1500 + Math.cos(frame / 40) * 14,
          }}
        />
      ))}
      {children}
    </AbsoluteFill>
  );
};

/** Glass card on dark grounds. */
export const Glass: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: "linear-gradient(180deg, rgba(22,40,31,0.92) 0%, rgba(11,22,16,0.92) 100%)",
      border: "1px solid rgba(220,255,235,0.12)",
      borderRadius: 32,
      boxShadow: "0 30px 70px rgba(0,0,0,.45), 0 6px 16px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rounded pill, like the breakout/fakeout chips. */
export const Pill: React.FC<{
  color: string;
  icon?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  size?: number;
}> = ({ color, icon, children, style, size = 40 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: size * 0.55,
      background: `linear-gradient(180deg, ${color} 0%, ${shade(color)} 100%)`,
      color: "#fff",
      fontFamily: F.sans,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: -0.5,
      boxShadow: `0 18px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.35)`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {icon ? <span style={{ fontSize: size * 0.95, lineHeight: 1 }}>{icon}</span> : null}
    {children}
  </div>
);

const shade = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * 0.72);
  const g = Math.round(((n >> 8) & 255) * 0.72);
  const b = Math.round((n & 255) * 0.72);
  return `rgb(${r},${g},${b})`;
};

/** Deterministic pseudo random 0..1 */
export const rnd = (i: number) => Math.abs(Math.sin(i * 12.9898 + 78.233) * 43758.5453) % 1;
