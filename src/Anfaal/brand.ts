import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Anfaal Pervaiz · forex/gold reel brand.
// Ink-green dark ground, money-green accent, warm white text. Gold is used only
// for XAUUSD/gold values, red only for "crash/break/loss" meaning.
loadFont({ family: "Inter", url: staticFile("fonts/Inter.woff2"), weight: "100 900" });
loadFont({ family: "Anton", url: staticFile("fonts/Anton.woff2"), weight: "400" });
loadFont({
  family: "Instrument Serif",
  url: staticFile("fonts/InstrumentSerif-Italic.woff2"),
  style: "italic",
  weight: "400",
});
loadFont({ family: "JetBrains Mono", url: staticFile("fonts/JetBrainsMono-Bold.woff2"), weight: "700" });

export const C = {
  ink: "#07100C", // near-black green
  ink2: "#0D1A14",
  panel: "rgba(12,24,18,0.78)",
  line: "rgba(220,255,235,0.10)",
  white: "#F4F5F1",
  muted: "#9BA8A1",
  green: "#2FD27E",
  greenDeep: "#159A55",
  greenGlow: "rgba(47,210,126,0.45)",
  gold: "#D9B66E",
  goldDeep: "#A9823C",
  red: "#FF5A5F",
  redGlow: "rgba(255,90,95,0.45)",
  paper: "#F3F5F1", // light full-screen ground
  paperInk: "#0E1712",
};

export const F = {
  sans: "Inter, sans-serif",
  display: "Anton, sans-serif",
  serif: "'Instrument Serif', serif",
  mono: "'JetBrains Mono', monospace",
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const HANDLE = "@imanfaalpervaiz";
export const COMMUNITY = "Youngest Premium Signals";
