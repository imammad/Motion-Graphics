import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter (variable, latin subset) bundled locally so renders work offline.
export const fontFamily = "Inter";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Inter.woff2"),
  weight: "100 900",
});

export const BLUE = "#3D8AFC";
export const BLUE_DARK = "#1F5FD6";
export const BLUE_LIGHT = "#8DBBFF";
export const BLUE_TINT = "#EAF2FF";
export const INK = "#0E1B33";
export const MUTED = "#8A97AD";
export const WHITE = "#FFFFFF";

export const BLUE_GRADIENT = `linear-gradient(135deg, ${BLUE_LIGHT} 0%, ${BLUE} 45%, ${BLUE_DARK} 100%)`;
export const TEXT_GRADIENT = `linear-gradient(90deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`;

export const CARD_SHADOW =
  "0 30px 80px rgba(61, 138, 252, 0.18), 0 6px 18px rgba(14, 27, 51, 0.06)";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
