import { loadFont } from "@remotion/fonts";
import { Easing, getStaticFiles, staticFile } from "remotion";

// Hero headings use Satoshi Bold. Drop `public/fonts/Satoshi-Bold.woff2`
// into the project and it is picked up automatically; until then Plus
// Jakarta Sans Bold stands in (Satoshi can't be fetched in CI).
const hasSatoshi = getStaticFiles().some(
  (f) => f.name === "fonts/Satoshi-Bold.woff2",
);
if (hasSatoshi) {
  loadFont({
    family: "Satoshi",
    url: staticFile("fonts/Satoshi-Bold.woff2"),
    weight: "700",
  });
}
loadFont({
  family: "Plus Jakarta Sans",
  url: staticFile("fonts/PlusJakartaSans-Bold.woff2"),
  weight: "700",
});
export const HEADING_FONT = `${hasSatoshi ? "Satoshi, " : ""}"Plus Jakarta Sans", sans-serif`;

// HubBox brand palette (Brand Guidelines, dark mode)
export const PINK = "#EF296A";
export const LIGHT_PINK = "#FFEBF1";
export const MIDNIGHT_BLACK = "#0F0B19";
export const MIDNIGHT_NAVY = "#15122A";
export const MIDNIGHT_VIOLET = "#1A1636";
export const WHITE = "#FFFFFF";
export const GREY = "#C6C6C6";

export const PINK_GRADIENT = "linear-gradient(160deg, #FF7AA3 0%, #EF296A 55%, #C4144F 100%)";

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 5.5 * FPS;

// Natural ease for reveals, morph ease for travels and exits.
export const NATURAL = Easing.bezier(0.42, 0, 0.18, 1);
export const MORPH = Easing.bezier(0.6, 0, 0.2, 1);
export const LAND = Easing.bezier(0.16, 1, 0.3, 1);

// Smooth single-overshoot bounce used for every icon (damping ratio ~0.58).
export const BOUNCE = { damping: 14, stiffness: 170, mass: 0.9 };

/**
 * VO beat table, seconds from 0:06.00 of MAIN_1.AAC (measured onsets from the
 * HubBox Collection Points Board):
 *   0.36 locker · 0.84 pickup point · 1.41 supermarket · 2.06 or other
 *   2.72 collection · 3.27 location · VO ends 4.03, hold to 5.5
 * Each reveal starts ~0.15s before its word so it is resolving as the word
 * lands; the "Location" line and the network pulse land on the word itself.
 */
export const T = {
  card: 0.0,
  locker: 0.36,
  lockerDoor: 0.5,
  pickup: 0.84,
  pickupPin: 1.02,
  supermarket: 1.41,
  supermarketParcel: 1.6,
  other: 2.06,
  hub: 2.42,
  others: [2.6, 2.75, 2.9],
  location: 3.27,
  end: 5.5,
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
/** Eased 0..1 progress of `t` through the window [a, b]. */
export const prog = (
  t: number,
  a: number,
  b: number,
  ease: (x: number) => number = NATURAL,
) => ease(clamp((t - a) / (b - a)));
