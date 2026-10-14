import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Poppins (latin subset) bundled locally so renders work offline.
export const fontFamily = "Poppins";
for (const weight of ["400", "500", "600", "700"]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/Poppins-${weight}.woff2`),
    weight,
  });
}

// Palette sampled from the Wave reference video (see docs/wave-style-guide.md).
export const BLUE = "#5497FC";
export const BLUE_LIGHT = "#76ACFD";
export const BLUE_PALE = "#D4E6FC";
export const BLUE_MIST = "#EEF4FE";
export const INK = "#0A0A16";
export const GREY = "#7B7C7F";
export const LINE = "#E6ECF5";
export const WHITE = "#FFFFFF";
export const GREEN = "#3CC77A";

export const BUTTON_GRADIENT = `linear-gradient(180deg, ${BLUE_LIGHT} 0%, ${BLUE} 100%)`;
export const HEADER_GRADIENT = `linear-gradient(180deg, ${BLUE} 0%, ${BLUE_LIGHT} 55%, ${BLUE_PALE} 100%)`;

export const CARD_SHADOW =
  "0 40px 90px rgba(84, 151, 252, 0.16), 0 10px 24px rgba(10, 10, 22, 0.05)";
export const PILL_SHADOW =
  "0 18px 40px rgba(84, 151, 252, 0.14), 0 4px 10px rgba(10, 10, 22, 0.04)";

// Smooth, premium ease used for nearly every move.
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
