import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Satoshi (variable) is HubBox's primary typeface. Bold is reserved for hero headings.
export const fontFamily = "Satoshi";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Satoshi-Variable.woff2"),
  weight: "300 900",
});

// HubBox brand guidelines, dark mode palette.
export const PINK = "#EF296A";
export const PINK_LIGHT = "#FF7FA6";
export const PINK_DEEP = "#B8124A";
export const LIGHT_PINK = "#FFEBF1";
export const MIDNIGHT_BLACK = "#0F0B19";
export const MIDNIGHT_NAVY = "#15122A";
export const MIDNIGHT_VIOLET = "#1A1636";
export const WHITE = "#FFFFFF";
export const GREY = "#C6C6C6";

// Tints derived from the Midnights for layered UI surfaces.
export const SURFACE = "#221D44";
export const SURFACE_HI = "#2B2552";
export const LINE = "rgba(255, 255, 255, 0.12)";
export const LINE_SOFT = "rgba(255, 255, 255, 0.06)";

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 60;
export const DURATION_S = 6;
