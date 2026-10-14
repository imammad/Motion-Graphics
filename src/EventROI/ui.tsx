import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BLUE,
  BLUE_PALE,
  BUTTON_GRADIENT,
  CARD_SHADOW,
  EASE,
  EASE_IN_OUT,
  fontFamily,
  GREY,
  INK,
  PILL_SHADOW,
  WHITE,
} from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The Wave signature entrance: blur to sharp, fade up, soft scale and lift.
export const Reveal: React.FC<{
  at: number;
  duration?: number;
  y?: number;
  x?: number;
  blur?: number;
  from?: number;
  exitAt?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, duration = 20, y = 30, x = 0, blur = 18, from = 0.92, exitAt, style, children }) => {
  const frame = useCurrentFrame();
  const out =
    exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 16], [0, 1], { ...clamp, easing: EASE_IN_OUT });

  return (
    <div
      style={{
        ...style,
        opacity: interpolate(frame, [at, at + duration * 0.7], [0, 1], clamp) * (1 - out),
        filter: `blur(${interpolate(frame, [at, at + duration], [blur, 0], { ...clamp, easing: EASE }) + out * blur}px)`,
        scale: String(interpolate(frame, [at, at + duration], [from, 1], { ...clamp, easing: EASE })),
        translate: `${interpolate(frame, [at, at + duration], [x, 0], { ...clamp, easing: EASE })}px ${interpolate(frame, [at, at + duration], [y, 0], { ...clamp, easing: EASE })}px`,
      }}
    >
      {children}
    </div>
  );
};

// Slow camera push across the whole scene.
export const Camera: React.FC<{
  zoom?: [number, number];
  pan?: [number, number];
  origin?: string;
  children: React.ReactNode;
}> = ({ zoom = [1, 1.05], pan = [0, 0], origin = "50% 50%", children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: EASE_IN_OUT });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: origin,
        scale: String(zoom[0] + (zoom[1] - zoom[0]) * t),
        translate: `${pan[0] * t}px ${pan[1] * t}px`,
        fontFamily,
      }}
    >
      {children}
    </div>
  );
};

// Out-of-focus layer for the depth-of-field look.
export const Defocus: React.FC<{
  left: number;
  top: number;
  blur: number;
  drift?: [number, number];
  opacity?: number;
  children: React.ReactNode;
}> = ({ left, top, blur, drift = [0, -40], opacity = 0.8, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        filter: `blur(${blur}px)`,
        opacity: interpolate(frame, [0, 15], [0, opacity], clamp),
        translate: `${interpolate(frame, [0, durationInFrames], [0, drift[0]])}px ${interpolate(frame, [0, durationInFrames], [0, drift[1]])}px`,
      }}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<{
  width: number;
  height?: number;
  radius?: number;
  padding?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ width, height, radius = 36, padding = 0, style, children }) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius,
      padding,
      background: WHITE,
      boxShadow: `${CARD_SHADOW}, inset 0 0 0 1.5px rgba(212, 230, 252, 0.9)`,
      overflow: "hidden",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{
  icon?: React.ReactNode;
  size?: number;
  color?: string;
  background?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ icon, size = 28, color = INK, background = WHITE, style, children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.45,
      padding: `${size * 0.6}px ${size * 1.1}px`,
      borderRadius: 999,
      background,
      boxShadow: PILL_SHADOW,
      fontSize: size,
      fontWeight: 500,
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {icon}
    {children}
  </div>
);

export const BlueButton: React.FC<{ width: number; size?: number; children: React.ReactNode }> = ({
  width,
  size = 26,
  children,
}) => (
  <div
    style={{
      width,
      padding: `${size * 0.7}px 0`,
      borderRadius: 999,
      background: BUTTON_GRADIENT,
      color: WHITE,
      fontSize: size,
      fontWeight: 500,
      textAlign: "center",
      boxShadow: `0 14px 30px rgba(84,151,252,0.35), inset 0 2px 0 rgba(255,255,255,0.35)`,
    }}
  >
    {children}
  </div>
);

// Rounded pale-blue bar that stands in for text.
export const Bar: React.FC<{ width: number; height?: number; color?: string }> = ({
  width,
  height = 14,
  color = BLUE_PALE,
}) => <div style={{ width, height, borderRadius: height, background: color }} />;

export const Headline: React.FC<{ at: number; size?: number; children: string; style?: React.CSSProperties }> = ({
  at,
  size = 88,
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      gap: size * 0.26,
      fontSize: size,
      fontWeight: 600,
      color: INK,
      letterSpacing: -1,
      ...style,
    }}
  >
    {children.split(" ").map((word, i) => (
      <Reveal key={i} at={at + i * 4} duration={18} y={24} blur={14}>
        {word}
      </Reveal>
    ))}
  </div>
);

export const Bubble: React.FC<{
  text: React.ReactNode;
  name?: string;
  size?: number;
  tone?: "white" | "blue";
  tail?: "left" | "right";
  maxWidth?: number;
}> = ({ text, name, size = 34, tone = "white", tail = "left", maxWidth = 620 }) => (
  <div
    style={{
      maxWidth,
      padding: `${size * 0.75}px ${size * 0.95}px`,
      borderRadius: size * 0.9,
      borderBottomLeftRadius: tail === "left" ? size * 0.25 : size * 0.9,
      borderBottomRightRadius: tail === "right" ? size * 0.25 : size * 0.9,
      background: tone === "blue" ? `linear-gradient(180deg, #E3EEFF, ${BLUE_PALE})` : WHITE,
      boxShadow: PILL_SHADOW,
      color: INK,
      fontSize: size,
      fontWeight: 500,
      lineHeight: 1.35,
    }}
  >
    {name ? <div style={{ fontSize: size * 0.62, color: GREY, fontWeight: 400, marginBottom: 6 }}>{name}</div> : null}
    {text}
  </div>
);

export const Cursor: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ filter: "drop-shadow(0 8px 12px rgba(10,10,22,0.25))" }}
  >
    <path
      d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.7 L11.7 14.2 L18 14.2 Z"
      fill={INK}
      stroke={WHITE}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);

// Soft concentric rings behind a hero element.
export const Rings: React.FC<{ size: number; count?: number }> = ({ size, count = 3 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const s = size * (1 + (i + 1) * 0.42) + Math.sin((frame + i * 20) / 24) * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: s,
              height: s,
              marginLeft: -s / 2,
              marginTop: -s / 2,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,255,255,${0.55 - i * 0.12}) 55%, rgba(212,230,252,${0.35 - i * 0.08}) 100%)`,
              boxShadow: `0 20px 60px rgba(84,151,252,${0.08 - i * 0.02})`,
            }}
          />
        );
      })}
    </>
  );
};

// Animated dashed connector drawn from (x1,y1) towards (x2,y2).
export const Connector: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  duration?: number;
  bend?: number;
}> = ({ x1, y1, x2, y2, at, duration = 24, bend = 0 }) => {
  const frame = useCurrentFrame();
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + bend;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const length = Math.hypot(x2 - x1, y2 - y1) * 1.15;
  const p = interpolate(frame, [at, at + duration], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  // Point along the quadratic curve for the travelling dot.
  const q = (a: number, b: number, c: number) => (1 - p) * (1 - p) * a + 2 * (1 - p) * p * b + p * p * c;

  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <mask id={`m-${x1}-${y1}`}>
          <path d={d} stroke="white" strokeWidth={8} fill="none" strokeDasharray={length} strokeDashoffset={length * (1 - p)} />
        </mask>
      </defs>
      <path
        d={d}
        stroke={BLUE}
        strokeOpacity={0.85}
        strokeWidth={4}
        strokeDasharray="2 11"
        strokeLinecap="round"
        fill="none"
        mask={`url(#m-${x1}-${y1})`}
      />
      {p > 0 && p < 1 ? (
        <circle cx={q(x1, mx, x2)} cy={q(y1, my, y2)} r={8} fill={BLUE} style={{ filter: "drop-shadow(0 0 8px rgba(84,151,252,0.8))" }} />
      ) : null}
    </svg>
  );
};

export const Check: React.FC<{ size?: number; color?: string }> = ({ size = 36, color = BLUE }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 6px 14px ${color}55`,
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24">
      <path d="M5 12.5 L10 17.5 L19 7" stroke={WHITE} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);
