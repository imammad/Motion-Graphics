import { createContext, useContext } from "react";

/**
 * A StyleProfile is everything that stays constant for one client / one look.
 * Swap the profile and every ReelKit component re-skins itself.
 * New clients get a new profile in `src/ReelKit/styles/`.
 */
export type StyleProfile = {
  id: string;
  name: string;
  // Fonts (family names registered in fonts.ts)
  sansFont: string;
  scriptFont: string;
  sansWeight: number;
  // Caption colours
  captionColor: string; // "white" for regular words, slightly warm
  accent: string; // special / script words
  accentGlow: string; // rgba used for the glow behind special words
  // Full-screen / explainer world
  paper: string; // background base
  paperShade: string; // darker edge of the background gradient
  gridColor: string;
  gridSize: number; // px
  castShadow: boolean; // soft window-light shadow overlay
  ink: string; // text colour on paper
  inkMuted: string;
  card: string; // white cards on paper
  cardShadow: string;
  // On-screen (lower-third) UI
  glass: string;
  glassBorder: string;
  glassText: string;
  glassMuted: string;
  // Speaker footage treatment
  speakerDarken: number; // 0..1 darkness of the bottom gradient when UI is shown
  speakerBlur: number; // px blur behind on-screen UI
  // Motion
  captionMaxSeconds: number; // a caption line never takes longer than this to animate in
  uiScale: number; // on-screen UI is kept small (0.75 = 75%)
};

export const BLUE_MINIMAL: StyleProfile = {
  id: "blue-minimal",
  name: "Blue Minimal (reference reel)",
  sansFont: "Inter",
  scriptFont: "EB Garamond",
  sansWeight: 500,
  captionColor: "#F3F3F3",
  accent: "#3A7BFF",
  accentGlow: "rgba(58, 123, 255, 0.55)",
  paper: "#F4F2EE",
  paperShade: "#E6E3DE",
  gridColor: "rgba(20, 20, 20, 0.08)",
  gridSize: 54,
  castShadow: true,
  ink: "#141414",
  inkMuted: "#8B8883",
  card: "#FFFFFF",
  cardShadow:
    "0 30px 60px rgba(40, 36, 30, 0.14), 0 6px 14px rgba(40, 36, 30, 0.08), inset 0 -4px 10px rgba(0,0,0,0.04)",
  glass: "rgba(18, 18, 22, 0.72)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glassText: "#F3F3F3",
  glassMuted: "rgba(243, 243, 243, 0.55)",
  speakerDarken: 0.7,
  speakerBlur: 14,
  captionMaxSeconds: 1.5,
  uiScale: 0.75,
};

export const StyleContext = createContext<StyleProfile>(BLUE_MINIMAL);
export const useStyle = () => useContext(StyleContext);

export const REEL = { width: 1080, height: 1920, fps: 30 };
