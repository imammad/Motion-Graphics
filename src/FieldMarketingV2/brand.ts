import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import type { Style } from "../MGKit";

// Brand style profile (mgskill): white ground, #3D8AFC accent, deep-navy ink.
// Sans = Inter (regular words), display = Instrument Serif Italic (special words).
loadFont({ family: "Inter", url: staticFile("fonts/Inter.woff2"), weight: "100 900" });
loadFont({
  family: "Instrument Serif",
  url: staticFile("fonts/InstrumentSerif-Italic.woff2"),
  style: "italic",
  weight: "400",
});

export const BRAND: Style = {
  name: "brand-white-blue",
  dark: false,
  ground: "radial-gradient(120% 95% at 50% 40%, #FFFFFF 0%, #F8FAFF 55%, #E9F1FE 100%)",
  grid: "rgba(61,138,252,0.07)",
  gridSize: 64,
  castShadow: false,
  glow: "rgba(61,138,252,0.13)",
  ink: "#0F1B33",
  inkMuted: "#7F8BA3",
  accent: "#3D8AFC",
  accentGlow: "rgba(61,138,252,0.35)",
  accentGradient: "linear-gradient(140deg, #8DBBFF 0%, #3D8AFC 48%, #1F5FD6 100%)",
  sansFont: "Inter",
  displayFont: "Instrument Serif",
  displayStyle: "italic",
  displayWeight: 400,
  captionColor: "#FFFFFF",
  card: "linear-gradient(180deg, #FFFFFF 0%, #F6F9FF 100%)",
  cardBorder: "rgba(61,138,252,0.10)",
  cardShadow:
    "0 30px 60px rgba(30,60,120,.12), 0 6px 14px rgba(30,60,120,.07), inset 0 -4px 10px rgba(61,138,252,.05)",
  uiGlass: "rgba(15,27,51,0.72)",
  energy: "medium",
};

// Muted tint used for "wrong" states (a tint of ink, not a fourth hue).
export const FADED = "#C3CBDA";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
