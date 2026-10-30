import { Easing, interpolate, spring } from "remotion";

// "Fast then slow": the house easing for everything that enters.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
// Smooth in-out for camera moves.
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 over `duration` frames starting at `start`, with the house easing. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing = easeOut,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Soft pop for cards and objects: no visible bounce, just a confident settle. */
export const pop = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 140, mass: 0.9 } });

/** Map a 0..1 value to a range. */
export const mix = (t: number, from: number, to: number) => from + (to - from) * t;

/** Seconds → frames. */
export const sec = (s: number, fps: number) => Math.round(s * fps);
