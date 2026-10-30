import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { easeInOut, mix, pop, progress } from "./motion";
import { useStyle } from "./style";

/* ------------------------------------------------------------------ */
/* On-screen (lower-third) UI: dark glass, small, sits under captions */
/* ------------------------------------------------------------------ */

export const GlassCard: React.FC<{
  children: React.ReactNode;
  at?: number;
  style?: React.CSSProperties;
}> = ({ children, at = 0, style }) => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at);
  return (
    <div
      style={{
        background: s.glass,
        border: `1px solid ${s.glassBorder}`,
        borderRadius: 26,
        padding: "22px 30px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
        backdropFilter: "blur(18px)",
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 30}px) scale(${mix(p, 0.92, 1)})`,
        filter: `blur(${(1 - Math.min(1, p)) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Places an on-screen UI in the lower third at the profile's UI scale. */
export const LowerThird: React.FC<{ children: React.ReactNode; top?: number }> = ({
  children,
  top = 1180,
}) => {
  const s = useStyle();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        display: "flex",
        justifyContent: "center",
        transform: `scale(${s.uiScale})`,
        transformOrigin: "50% 0%",
      }}
    >
      {children}
    </div>
  );
};

/**
 * Chapter tracker: numbered circles joined by lines. `active` = how many are
 * filled; `fillAt` = frame when the latest one fills. `tone` "accent" colours
 * the outline (hook state), "neutral" is the white chapter state.
 */
export const StepTracker: React.FC<{
  count?: number;
  active: number;
  fillAt?: number;
  tone?: "accent" | "neutral" | "alert";
}> = ({ count = 3, active, fillAt = 0, tone = "neutral" }) => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const outline = tone === "alert" ? "#FF4D4D" : tone === "accent" ? s.accent : "rgba(255,255,255,0.45)";
  const fillP = progress(frame, fillAt, 10);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const n = i + 1;
        const done = n < active;
        const current = n === active;
        const fill = done ? 1 : current ? fillP : 0;
        return (
          <React.Fragment key={n}>
            {i > 0 ? (
              <div
                style={{
                  width: 70,
                  height: 3,
                  background: `linear-gradient(90deg, ${s.glassText} ${
                    (n <= active ? (n === active ? fillP : 1) : 0) * 100
                  }%, rgba(255,255,255,0.18) 0%)`,
                }}
              />
            ) : null}
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                border: `3px solid ${fill > 0 ? s.glassText : outline}`,
                background: `rgba(243,243,243,${fill})`,
                color: fill > 0.5 ? "#111" : tone === "neutral" ? s.glassMuted : outline,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: s.sansFont,
                fontWeight: 600,
                fontSize: 24,
                transform: `scale(${current ? mix(fillP, 0.85, 1) : 1})`,
                boxShadow: current && fillP > 0 ? `0 0 ${18 * fillP}px rgba(255,255,255,0.35)` : "none",
              }}
            >
              {n}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Two-label slider (e.g. Beginner → Professional) with an optional cursor drag. */
export const SliderUI: React.FC<{
  left: string;
  right: string;
  from?: number;
  to?: number;
  dragAt?: number;
  dragFrames?: number;
  width?: number;
}> = ({ left, right, from = 0.04, to = 0.96, dragAt = 10, dragFrames = 40, width = 640 }) => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const t = progress(frame, dragAt, dragFrames, easeInOut);
  const v = mix(t, from, to);
  const knobX = v * width;
  return (
    <div style={{ width, fontFamily: s.sansFont }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
        <span style={{ color: t < 0.98 ? s.glassText : s.glassMuted, fontSize: 24 }}>{left}</span>
        <span style={{ color: t > 0.98 ? s.accent : s.glassMuted, fontSize: 24 }}>{right}</span>
      </div>
      <div style={{ position: "relative", height: 14, borderRadius: 7, background: "rgba(255,255,255,0.12)" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: knobX,
            borderRadius: 7,
            background: `linear-gradient(90deg, rgba(58,123,255,0.4), ${s.accent})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: knobX - 20,
            top: -13,
            width: 40,
            height: 40,
            borderRadius: 20,
            background: "#fff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          }}
        />
        <Cursor x={knobX + 6} y={22} pressed={t > 0 && t < 1} />
      </div>
    </div>
  );
};

/** macOS-style arrow cursor. */
export const Cursor: React.FC<{ x: number; y: number; pressed?: boolean; size?: number }> = ({
  x,
  y,
  pressed = false,
  size = 34,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${pressed ? 0.88 : 1})`,
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
    }}
  >
    <path d="M3 2 L3 19 L7.5 15 L10.5 22 L13.5 20.7 L10.6 14 L17 14 Z" fill="#fff" stroke="#111" strokeWidth="1.3" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Paper-world elements: white cards, pills, badges                   */
/* ------------------------------------------------------------------ */

export const WhiteCard: React.FC<{
  children?: React.ReactNode;
  at?: number;
  radius?: number;
  style?: React.CSSProperties;
}> = ({ children, at = 0, radius = 36, style }) => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at);
  return (
    <div
      style={{
        background: `linear-gradient(180deg, #FFFFFF 0%, #F7F6F3 100%)`,
        borderRadius: radius,
        boxShadow: s.cardShadow,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 40}px) scale(${mix(p, 0.85, 1)})`,
        filter: `blur(${(1 - Math.min(1, p)) * 8}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Small label pill (brand logos, tags, chips). */
export const Pill: React.FC<{
  children: React.ReactNode;
  at?: number;
  style?: React.CSSProperties;
}> = ({ children, at = 0, style }) => (
  <WhiteCard at={at} radius={18} style={{ padding: "18px 26px", display: "inline-block", ...style }}>
    {children}
  </WhiteCard>
);

/** Accent badge (e.g. "-25%"). */
export const Badge: React.FC<{ children: React.ReactNode; at?: number; style?: React.CSSProperties }> = ({
  children,
  at = 0,
  style,
}) => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at);
  return (
    <div
      style={{
        position: "absolute",
        background: s.accent,
        color: "#fff",
        fontFamily: s.sansFont,
        fontWeight: 600,
        fontSize: 30,
        padding: "8px 18px",
        borderRadius: 16,
        boxShadow: `0 8px 24px ${s.accentGlow}`,
        transform: `scale(${p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Wide-tracked micro label used on cards ("EFFECT USAGE", "TIMELINE"). */
export const MicroLabel: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color,
  style,
}) => {
  const s = useStyle();
  return (
    <div
      style={{
        fontFamily: s.sansFont,
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: color ?? s.inkMuted,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Burst of small accent/ink particles around a point (depth element). */
export const Confetti: React.FC<{ at: number; cx: number; cy: number; radius?: number; count?: number }> = ({
  at,
  cx,
  cy,
  radius = 360,
  count = 36,
}) => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const t = progress(frame, at, 40);
  if (frame < at) return null;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        // Deterministic pseudo-random per particle.
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const r2 = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
        const ang = (i / count) * Math.PI * 2 + r1;
        const dist = radius * (0.55 + r2 * 0.6) * t;
        const sizeP = 6 + r1 * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(ang) * dist,
              top: cy + Math.sin(ang) * dist,
              width: i % 3 === 0 ? sizeP * 1.8 : sizeP,
              height: sizeP * (i % 3 === 0 ? 0.5 : 1),
              borderRadius: i % 3 === 0 ? 2 : sizeP,
              background: i % 4 === 0 ? s.ink : s.accent,
              opacity: interpolate(t, [0, 0.2, 0.85, 1], [0, 1, 0.9, 0.5]),
              transform: `rotate(${ang * 57}deg)`,
            }}
          />
        );
      })}
    </>
  );
};
