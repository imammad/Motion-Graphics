import React from "react";
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Camera,
  CamKey,
  Ground,
  MicroLabel,
  StyleProvider,
  mix,
  pop,
  progress,
  useMGStyle,
} from "../MGKit";
import { BRAND, FADED } from "./brand";

/** Brand ground + camera. Every V2 scene renders inside this. */
export const Scene: React.FC<{ cam: CamKey[]; focusY?: number; children: React.ReactNode }> = ({
  cam,
  focusY = 50,
  children,
}) => (
  <StyleProvider value={BRAND}>
    <Ground focusY={focusY}>
      <Camera keys={cam}>{children}</Camera>
    </Ground>
  </StyleProvider>
);

/** Fast-then-slow entrance (mgskill §6): rise, fade, de-blur, 0.85 → 1. */
export const Enter: React.FC<{
  at: number;
  dur?: number;
  rise?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, dur = 12, rise = 30, children, style }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, dur);
  return (
    <div
      style={{
        opacity: p,
        translate: `0px ${(1 - p) * rise}px`,
        scale: mix(p, 0.85, 1),
        filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Quick blur-out exit (6 frames). */
export const Exit: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const p = progress(useCurrentFrame(), at, 6);
  return (
    <div style={{ opacity: 1 - p, filter: p > 0 ? `blur(${p * 10}px)` : undefined, ...style }}>
      {children}
    </div>
  );
};

/** Idle float so nothing is fully still. */
export const Float: React.FC<{ amp?: number; speed?: number; phase?: number; children: React.ReactNode }> = ({
  amp = 6,
  speed = 22,
  phase = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  return <div style={{ translate: `0px ${Math.sin(frame / speed + phase) * amp}px` }}>{children}</div>;
};

export type Tone = "accent" | "light" | "faded";

export const Avatar: React.FC<{ size: number; tone?: Tone }> = ({ size, tone = "accent" }) => {
  const s = useMGStyle();
  const bg =
    tone === "accent" ? s.accentGradient : tone === "light" ? "linear-gradient(180deg,#FFFFFF,#EEF4FF)" : "#E6EAF1";
  const fg = tone === "accent" ? "#FFFFFF" : tone === "light" ? s.accent : FADED;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: bg,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow:
          tone === "accent"
            ? `0 ${size * 0.14}px ${size * 0.34}px ${s.accentGlow}`
            : `0 ${size * 0.08}px ${size * 0.2}px rgba(30,60,120,.08)`,
        border: tone === "light" ? `2px solid rgba(61,138,252,0.18)` : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: size,
          background: fg,
          left: size * 0.32,
          top: size * 0.2,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.72,
          height: size * 0.6,
          borderRadius: size,
          background: fg,
          left: size * 0.14,
          top: size * 0.64,
        }}
      />
    </div>
  );
};

export type DotState = "empty" | "asked" | "wrong" | "shrug";
export type DotEvent = { at: number; state: DotState };

/** The hook UI: 10 people. It returns at the end as the payoff. */
export const Tracker: React.FC<{ dots: DotEvent[][]; label: React.ReactNode; size?: number }> = ({
  dots,
  label,
  size = 64,
}) => {
  const s = useMGStyle();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ display: "flex", gap: size * 0.32 }}>
        {dots.map((events, i) => {
          const current = [...events].reverse().find((e) => e.at <= frame) ?? { at: -999, state: "empty" };
          const p = pop(frame, fps, current.at);
          const state = current.state;
          return (
            <div key={i} style={{ position: "relative", width: size, height: size }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: size,
                  border: `2px dashed rgba(61,138,252,0.28)`,
                  opacity: state === "empty" ? 1 : 0,
                }}
              />
              {state !== "empty" ? (
                <div style={{ position: "absolute", inset: 0, scale: mix(Math.min(p, 1.05), 0.6, 1) }}>
                  <Avatar size={size} tone={state === "asked" ? "accent" : state === "shrug" ? "light" : "faded"} />
                </div>
              ) : null}
              {state === "wrong" || state === "shrug" ? (
                <div
                  style={{
                    position: "absolute",
                    right: -size * 0.12,
                    top: -size * 0.12,
                    width: size * 0.42,
                    height: size * 0.42,
                    borderRadius: size,
                    background: state === "wrong" ? s.inkMuted : s.accent,
                    color: "#FFFFFF",
                    fontFamily: s.sansFont,
                    fontWeight: 800,
                    fontSize: size * 0.24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid #FFFFFF",
                    scale: Math.min(p, 1.1),
                  }}
                >
                  {state === "wrong" ? "✕" : "?"}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <MicroLabel style={{ fontSize: 22, letterSpacing: 5 }}>{label}</MicroLabel>
    </div>
  );
};

/** An answer chip. `wrongAt` strikes it through and fades it to a muted tint. */
export const AnswerPill: React.FC<{
  text: string;
  at: number;
  wrongAt?: number;
  shrug?: boolean;
  size?: number;
}> = ({ text, at, wrongAt, shrug, size = 28 }) => {
  const s = useMGStyle();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at);
  const w = wrongAt === undefined ? 0 : progress(frame, wrongAt, 8);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.5,
        padding: `${size * 0.42}px ${size * 0.9}px ${size * 0.42}px ${size * 0.42}px`,
        borderRadius: 999,
        background: s.card,
        border: shrug ? `2px solid rgba(61,138,252,0.35)` : `1px solid ${s.cardBorder}`,
        boxShadow: s.cardShadow,
        whiteSpace: "nowrap",
        opacity: Math.min(1, p * 1.5) * mix(w, 1, 0.8),
        scale: mix(Math.min(p, 1.04), 0.7, 1),
        filter: p < 0.9 ? `blur(${(1 - Math.min(p, 1)) * 8}px)` : undefined,
        translate: `0px ${w * 14}px`,
      }}
    >
      <Avatar size={size * 1.55} tone={w > 0.5 ? "faded" : shrug ? "light" : "accent"} />
      <span
        style={{
          fontFamily: s.sansFont,
          fontWeight: 500,
          fontSize: size,
          color: interpolateColors(w, [0, 1], [s.ink, FADED]),
          backgroundImage: `linear-gradient(${s.inkMuted}, ${s.inkMuted})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 56%",
          backgroundSize: `${w * 100}% 3px`,
        }}
      >
        {text}
      </span>
    </div>
  );
};

/** Faint, blurred element at the frame edge (depth layer). */
export const DepthItem: React.FC<{
  x: number;
  y: number;
  blur?: number;
  opacity?: number;
  scale?: number;
  rotate?: number;
  at?: number;
  phase?: number;
  children: React.ReactNode;
}> = ({ x, y, blur = 3, opacity = 0.45, scale = 1, rotate = 0, at = 0, phase = 0, children }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, 20);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% calc(-50% + ${Math.sin(frame / 26 + phase) * 8}px)`,
        opacity: p * opacity,
        filter: `blur(${blur}px)`,
        scale,
        rotate: `${rotate}deg`,
      }}
    >
      {children}
    </div>
  );
};

export const fadeIn = (frame: number, at: number, dur = 10) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
