import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Poppins (latin subset) bundled locally so renders work offline.
export const fontFamily = "Poppins";
for (const weight of [400, 500, 600, 700, 800]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/Poppins-${weight}.woff2`),
    weight: String(weight),
  });
}

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type ThemeName = "dark" | "light";
export type Backdrop = "glow" | "grid" | "beam" | "spotlight";

// Client palette: brand green #01572A and paper grey #DDDDDD.
// A · Forest (dark) and B · Paper (light), matching the Claude Design templates.
export const THEMES = {
  dark: {
    base: "#072818",
    bg: "radial-gradient(130% 100% at 50% 28%, #0e3d25 0%, #072818 48%, #03140b 100%)",
    tex: "rgba(221,221,221,0.035)",
    vig: "radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
    line: "rgba(221,221,221,0.05)",
    tint: "rgba(67,224,151,0.11)",
    ink: "#dddddd",
    head: "#f0f0f0",
    muted: "rgba(221,221,221,0.74)",
    faint: "rgba(221,221,221,0.64)",
    grid: "rgba(221,221,221,0.09)",
    axis: "rgba(221,221,221,0.30)",
    accent: "#43e097",
    accentText: "#5ee8a6",
    accentSoft: "rgba(67,224,151,0.10)",
    glow: "rgba(67,224,151,0.55)",
    textGlow: "0 0 22px rgba(67,224,151,0.6)",
    dotRing: "#072818",
    area0: "rgba(67,224,151,0.20)",
    area1: "rgba(67,224,151,0)",
    chipBg: "rgba(1,87,42,0.88)",
    chipInk: "#eafff3",
    chipBorder: "rgba(67,224,151,0.80)",
    chipGlow: "0 0 30px rgba(67,224,151,0.45)",
    track: "rgba(221,221,221,0.06)",
    barBase: "rgba(221,221,221,0.22)",
    barBaseInk: "#dddddd",
    block: "linear-gradient(180deg, rgba(67,224,151,0.22) 0%, rgba(67,224,151,0.03) 100%)",
    edge: "rgba(67,224,151,0.25)",
    badgeBg: "#072818",
    spoke: "rgba(221,221,221,0.30)",
    itemBg: "rgba(7,40,24,0.92)",
    itemHot: "rgba(10,52,31,0.95)",
    itemBorder: "rgba(221,221,221,0.30)",
    itemGlow: "0 0 30px rgba(67,224,151,0.30)",
    alert: "#ff8f63",
    alertText: "#ff9d76",
    alertGlow: "rgba(255,143,99,0.50)",
    barHot: "linear-gradient(180deg, #5ee8a6 0%, #2aa86c 100%)",
    barHotGlow: "0 0 36px rgba(67,224,151,0.45)",
    barDim: "linear-gradient(180deg, rgba(221,221,221,0.34) 0%, rgba(221,221,221,0.16) 100%)",
    barA: "#dddddd",
    aInk: "#072818",
    barB: "linear-gradient(90deg, #2aa86c 0%, #5ee8a6 100%)",
    bGlow: "0 0 30px rgba(67,224,151,0.40)",
    hatch:
      "repeating-linear-gradient(135deg, rgba(255,143,99,0.28) 0px, rgba(255,143,99,0.28) 6px, rgba(0,0,0,0) 6px, rgba(0,0,0,0) 14px)",
    badgeOn: "rgba(1,87,42,0.92)",
    badgeOnInk: "#eafff3",
    badgeOnGlow: "0 0 26px rgba(67,224,151,0.45)",
    badgeOffBorder: "rgba(221,221,221,0.35)",
    ringOff: "rgba(221,221,221,0.22)",
    dotOff: "rgba(221,221,221,0.10)",
    ringTrack: "rgba(221,221,221,0.08)",
    panel: "rgba(221,221,221,0.05)",
    panelBorder: "rgba(221,221,221,0.14)",
    panelShadow: "0 24px 50px rgba(0,0,0,0.35)",
  },
  light: {
    base: "#dddddd",
    bg: "radial-gradient(130% 100% at 50% 28%, #ebebeb 0%, #dddddd 52%, #cdcdcd 100%)",
    tex: "rgba(1,87,42,0.055)",
    vig: "radial-gradient(120% 120% at 50% 45%, rgba(0,0,0,0) 60%, rgba(1,40,20,0.10) 100%)",
    line: "rgba(1,87,42,0.07)",
    tint: "rgba(1,87,42,0.10)",
    ink: "#0d2418",
    head: "#01572a",
    muted: "#3f5247",
    faint: "#4d5e54",
    grid: "rgba(1,87,42,0.13)",
    axis: "rgba(1,87,42,0.45)",
    accent: "#01572a",
    accentText: "#01572a",
    accentSoft: "rgba(1,87,42,0.10)",
    glow: "rgba(1,87,42,0.28)",
    textGlow: "none",
    dotRing: "#dddddd",
    area0: "rgba(1,87,42,0.20)",
    area1: "rgba(1,87,42,0)",
    chipBg: "#01572a",
    chipInk: "#dddddd",
    chipBorder: "#01572a",
    chipGlow: "0 12px 30px rgba(1,87,42,0.30)",
    track: "rgba(1,87,42,0.08)",
    barBase: "#9aa59f",
    barBaseInk: "#0d2418",
    block: "linear-gradient(180deg, rgba(1,87,42,0.22) 0%, rgba(1,87,42,0.04) 100%)",
    edge: "rgba(1,87,42,0.25)",
    badgeBg: "#dddddd",
    spoke: "rgba(1,87,42,0.40)",
    itemBg: "#e6e6e6",
    itemHot: "rgba(1,87,42,0.10)",
    itemBorder: "rgba(1,87,42,0.35)",
    itemGlow: "0 10px 26px rgba(1,87,42,0.18)",
    alert: "#b8502a",
    alertText: "#a3431f",
    alertGlow: "rgba(184,80,42,0.30)",
    barHot: "#01572a",
    barHotGlow: "0 14px 34px rgba(1,87,42,0.35)",
    barDim: "#a3ada7",
    barA: "#3f5247",
    aInk: "#eeeeee",
    barB: "#01572a",
    bGlow: "0 10px 26px rgba(1,87,42,0.30)",
    hatch:
      "repeating-linear-gradient(135deg, rgba(184,80,42,0.22) 0px, rgba(184,80,42,0.22) 6px, rgba(0,0,0,0) 6px, rgba(0,0,0,0) 14px)",
    badgeOn: "#01572a",
    badgeOnInk: "#dddddd",
    badgeOnGlow: "0 10px 24px rgba(1,87,42,0.30)",
    badgeOffBorder: "rgba(1,87,42,0.40)",
    ringOff: "rgba(1,87,42,0.25)",
    dotOff: "rgba(1,87,42,0.13)",
    ringTrack: "rgba(1,87,42,0.12)",
    panel: "rgba(255,255,255,0.42)",
    panelBorder: "rgba(1,87,42,0.18)",
    panelShadow: "0 18px 40px rgba(1,40,20,0.10)",
  },
};

export type Theme = (typeof THEMES)["dark"];

export type SceneProps = { theme: ThemeName };

// A line of copy that appears on a voice cue (seconds into the clip).
export type Timed = { text: string; at: number };

// Motion rules from the style board: cubic in-out for moves, quart-out for
// counters, a light back-ease only for chips and tags popping in.
export const EASE = Easing.inOut(Easing.cubic);
export const OUT = Easing.out(Easing.poly(4));
export const POP = Easing.out(Easing.back(1.7));

// 0 → 1 between two cue times (in seconds), clamped.
export const ramp = (t: number, a: number, b: number, easing = EASE) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const fmt = (v: number, prefix = "£", suffix = "", decimals = 0) =>
  (v < 0 ? "−" : "") +
  prefix +
  Math.abs(v).toLocaleString("en-GB", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) +
  suffix;
