import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

export const fontFamily = "Inter";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Inter.woff2"),
  weight: "100 900",
});

// The horizontal master (3840x2160, 25fps). Footage and audio are taken from it
// frame-for-frame, so the vertical timeline matches the original 1:1.
export const SOURCE = staticFile("source/horizontal.mp4");
export const SRC_W = 3840;
export const SRC_H = 2160;

export const FPS = 25;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL_DURATION = 1137;

// Cut points of the original edit, in frames.
export const CUTS = {
  talk1: 0,
  typing: 82,
  docUi: 120,
  talk2: 164,
  docs: 261,
  split: 415,
  meeting: 545,
  cards: 602,
  talk3: 695,
  berlin: 902,
  finale: 934,
  end: TOTAL_DURATION,
};

// Palette sampled from the original.
export const BG_EDGE = "#150a35";
export const BG_MID = "#1f1050";
export const BG_CENTER = "#2a1663";
export const LAVENDER = "#d1c8fc";
export const LAVENDER_DARK = "#bba9fc";
export const OFF_WHITE = "#f3eff6";
export const FOLD = "#4430f4";
export const LINE = "#4c2ff0";
export const CORAL = "#f6566a";
export const VIOLET = "#7a0cf0";
export const BRAND_RED = "#ff5e5f";
export const BRAND_BLUE = "#5210ff";
export const LOWER_THIRD = "#22115c";

export const BRAND_GRADIENT = `linear-gradient(90deg, ${VIOLET} 0%, #b02cc4 55%, ${CORAL} 100%)`;

export const EASE = Easing.bezier(0.45, 0, 0.2, 1);
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 0.9, 0.4);
