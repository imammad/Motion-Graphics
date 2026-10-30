import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, DISPLAY, FPS, SANS } from "./theme";

// Shared motion vocabulary. Every time is in seconds of the voice-over.

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const useTime = () => useCurrentFrame() / FPS;

export const prog = (
  t: number,
  start: number,
  dur: number,
  easing: (n: number) => number = EASE_OUT,
) =>
  interpolate(t, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

// A scene mounts just before `from`, leaves at `to` with a fast blur-up exit,
// and drifts on a slow camera move for its whole life.
export const Scene: React.FC<{
  from: number;
  to: number;
  zoom?: [number, number];
  origin?: string;
  children: React.ReactNode;
}> = ({ from, to, zoom = [1.035, 1], origin = "50% 50%", children }) => {
  const t = useTime();
  if (t < from - 0.05 || t > to + 0.4) return null;
  const exit = prog(t, to, 0.32, EASE_IN_OUT);
  const scale = mix(zoom[0], zoom[1], prog(t, from, to - from + 0.3, EASE_IN_OUT));
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        filter: exit > 0 ? `blur(${exit * 14}px)` : undefined,
        transform: `translateY(${-exit * 28}px) scale(${scale})`,
        transformOrigin: origin,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Tiny uppercase label with wide tracking; tracks in as it fades up.
export const MicroLabel: React.FC<{
  text: string;
  at: number;
  style?: React.CSSProperties;
  color?: string;
  size?: number;
}> = ({ text, at, style, color = C.label, size = 17 }) => {
  const t = useTime();
  const p = prog(t, at, 0.9);
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: `${mix(0.7, 0.42, p)}em`,
        textTransform: "uppercase",
        color,
        whiteSpace: "nowrap",
        opacity: p,
        filter: `blur(${(1 - p) * 4}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Display word(s) revealed letter by letter, each rising out of a mask.
export const Letters: React.FC<{
  text: string;
  at: number;
  size: number;
  color?: string;
  weight?: 800 | 900;
  stagger?: number;
  dur?: number;
  colors?: Record<number, string>;
  style?: React.CSSProperties;
}> = ({
  text,
  at,
  size,
  color = C.ink,
  weight = 900,
  stagger = 0.032,
  dur = 0.75,
  colors,
  style,
}) => {
  const t = useTime();
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: DISPLAY,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 0.86,
        letterSpacing: "0.005em",
        color,
        whiteSpace: "pre",
        overflow: "hidden",
        paddingTop: size * 0.06,
        paddingBottom: size * 0.04,
        ...style,
      }}
    >
      {text.split("").map((ch, i) => {
        const p = prog(t, at + i * stagger, dur);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - p) * 105}%)`,
              opacity: Math.min(1, p * 2.2),
              color: colors?.[i],
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// A whole line rising out of a mask (for secondary display lines).
export const MaskLine: React.FC<{
  at: number;
  size: number;
  dur?: number;
  weight?: 800 | 900;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, size, dur = 0.8, weight = 800, color = C.ink, style, children }) => {
  const t = useTime();
  const p = prog(t, at, dur);
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: DISPLAY,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 0.9,
        color,
        whiteSpace: "nowrap",
        overflow: "hidden",
        paddingTop: size * 0.05,
        paddingBottom: size * 0.05,
        ...style,
      }}
    >
      <div
        style={{
          transform: `translateY(${(1 - p) * 110}%)`,
          filter: `blur(${(1 - p) * 6}px)`,
          opacity: Math.min(1, p * 2.2),
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Ruler ticks that draw on left to right.
export const Ruler: React.FC<{
  x: number;
  y: number;
  w: number;
  count: number;
  at: number;
  major?: number[];
  color?: string;
}> = ({ x, y, w, count, at, major = [], color = C.tick }) => {
  const t = useTime();
  const line = prog(t, at, 0.9, EASE_IN_OUT);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w * line,
          height: 2,
          background: color,
        }}
      />
      {Array.from({ length: count + 1 }).map((_, i) => {
        const p = prog(t, at + 0.1 + (i / count) * 0.7, 0.4);
        const isMajor = major.includes(i) || i === 0 || i === count;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + (w * i) / count - 1,
              top: y,
              width: 2,
              height: (isMajor ? 20 : 11) * p,
              background: color,
            }}
          />
        );
      })}
    </>
  );
};

export const formatGBP = (n: number) =>
  "£" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
