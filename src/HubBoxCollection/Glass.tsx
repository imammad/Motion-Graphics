import React from "react";
import { lerp } from "./theme";

/** Mask + leading-edge light for the gradient reveal used on every shape. */
export const gradientReveal = (p: number, angle: number, soft = 30) => {
  const e = lerp(-soft - 5, 100 + soft + 5, p);
  const mask = `linear-gradient(${angle}deg, #000 ${e - soft}%, transparent ${e}%)`;
  const edge = `linear-gradient(${angle}deg, transparent ${e - soft - 8}%, rgba(255,150,190,0.55) ${e - soft * 0.55}%, rgba(255,255,255,0.0) ${e}%)`;
  return { mask, edge, edgeAlpha: Math.sin(Math.PI * Math.min(1, Math.max(0, p))) };
};

export const GLASS_STYLE: React.CSSProperties = {
  background:
    "linear-gradient(150deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0.08) 100%)",
  backdropFilter: "blur(36px) saturate(165%)",
  WebkitBackdropFilter: "blur(36px) saturate(165%)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  boxShadow:
    "0 40px 90px rgba(6,4,14,0.55), inset 0 1.5px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(255,255,255,0.06)",
};

/**
 * Frosted glass shape. Enters with a gradient wipe + focus pull, exits with
 * blur and an upward drift. Masks and filters live on this element itself so
 * the backdrop blur still sees the scene behind it.
 */
export const GlassPanel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
  p: number;
  exit?: number;
  angle?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, radius, p, exit = 0, angle = 160, children }) => {
  if (p <= 0.001 || exit >= 0.999) return null;
  const r = gradientReveal(p, angle);
  const blur = (1 - p) * 12 + exit * 14;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        overflow: "hidden",
        ...GLASS_STYLE,
        opacity: 1 - exit,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        transform: `translateY(${(1 - p) * 26 - exit * 70}px) scale(${lerp(1.035, 1, p)})`,
        maskImage: p < 0.999 ? r.mask : undefined,
        WebkitMaskImage: p < 0.999 ? r.mask : undefined,
      }}
    >
      {/* top sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 38%)",
        }}
      />
      {children}
      {p < 0.999 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: r.edge,
            opacity: r.edgeAlpha,
            mixBlendMode: "screen",
          }}
        />
      ) : null}
    </div>
  );
};

/**
 * An icon that can live inside the hero card (no circle), in the dock or on
 * the map (glass circle). `scale` carries the bounce, `glow` the pink light.
 */
export const Badge: React.FC<{
  x: number;
  y: number;
  circle: number;
  circleP: number;
  glyph: number;
  scale: number;
  glow: number;
  wipe: number;
  children: React.ReactNode;
}> = ({ x, y, circle, circleP, glyph, scale, glow, wipe, children }) => {
  if (wipe <= 0.001) return null;
  const r = gradientReveal(wipe, 0, 34);
  return (
    <>
      <GlassPanel
        x={x - circle / 2}
        y={y - circle / 2}
        w={circle}
        h={circle}
        radius={circle / 2}
        p={circleP}
        angle={0}
      />
      <div
        style={{
          position: "absolute",
          left: x - glyph / 2,
          top: y - glyph / 2,
          width: glyph,
          height: glyph,
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 0 ${Math.max(14, glyph * 0.09) * glow}px rgba(239,41,106,${0.95 * glow})) drop-shadow(0 0 ${Math.max(4, glyph * 0.025) * glow}px rgba(255,150,190,${0.9 * glow}))`,
        }}
      >
        {/* mask on an inner layer: masking the filtered layer itself
            punches a hole in the glass behind it */}
        <div
          style={{
            width: "100%",
            height: "100%",
            maskImage: wipe < 0.999 ? r.mask : undefined,
            WebkitMaskImage: wipe < 0.999 ? r.mask : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};
