// Motion helpers. Everything is a pure function of time in seconds, so any frame
// (or sub-frame, for motion blur) renders identically.

export const clamp = (v: number, lo = 0, hi = 1) =>
  Math.min(hi, Math.max(lo, v));

// Linear 0..1 progress of t through [start, start + dur].
export const prog = (t: number, start: number, dur: number) =>
  clamp((t - start) / dur);

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const expoOut = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
export const expoIn = (p: number) => (p <= 0 ? 0 : Math.pow(2, 10 * p - 10));
export const expoInOut = (p: number) => {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return p < 0.5
    ? Math.pow(2, 20 * p - 10) / 2
    : (2 - Math.pow(2, -20 * p + 10)) / 2;
};
// Quintic smootherstep: gentle peak velocity (1.875x average) for camera and travel,
// so fast moves stay fluid instead of strobing.
export const smoother = (p: number) => {
  const x = clamp(p);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export const cubicInOut = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

// Under-damped spring from 0 to 1. zeta 0.78 keeps overshoot around 2%.
export const spring = (t: number, start: number, dur = 0.6, zeta = 0.78) => {
  const x = t - start;
  if (x <= 0) return 0;
  // Pick the natural frequency so the spring has settled (~0.5%) by `dur`.
  const w = 5.3 / (zeta * dur);
  const wd = w * Math.sqrt(1 - zeta * zeta);
  const e = Math.exp(-zeta * w * x);
  return 1 - e * (Math.cos(wd * x) + ((zeta * w) / wd) * Math.sin(wd * x));
};

// Expo in-out between keyed values: keys = [[time, value], ...].
export const keyed = (
  t: number,
  keys: [number, number][],
  ease = expoInOut,
) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i];
    const [t0, v0] = keys[i - 1];
    if (t <= t1) return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
  }
  return keys[keys.length - 1][1];
};
