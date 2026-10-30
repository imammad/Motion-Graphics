import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Style taken from the client reference frame ("OVER £100K / 62% / 38%"):
// dark forest-green radial ground, off-white condensed display type,
// one mint accent, rust for tax, wide-tracked micro labels, ruler ticks.

export const DISPLAY = "Big Shoulders Display";
export const SANS = "Inter";

loadFont({
  family: DISPLAY,
  url: staticFile("fonts/BigShouldersDisplay-800.woff2"),
  weight: "800",
});
loadFont({
  family: DISPLAY,
  url: staticFile("fonts/BigShouldersDisplay-900.woff2"),
  weight: "900",
});
loadFont({
  family: SANS,
  url: staticFile("fonts/Inter.woff2"),
  weight: "100 900",
});

export const C = {
  groundCore: "#00321D",
  groundMid: "#001B0B",
  groundEdge: "#000D04",
  ink: "#EFEFEF",
  muted: "#587068",
  label: "#779186",
  tick: "#49655A",
  mint: "#2FDB9D",
  mintDeep: "#23B07E",
  mintDeeper: "#1A8862",
  rust: "#6D311F",
  onFill: "#0B1F14",
};

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION_S = 36;

// Layout grid (matches the reference: ~152 px side margins)
export const MARGIN = 152;
export const CONTENT_W = WIDTH - MARGIN * 2;

// Voice-over word times (seconds), measured from the audio.
export const VO = {
  pensions: 1.22,
  important: 3.28,
  difficult: 5.18,
  tradeOff: 5.7,
  contribution: 6.6,
  reduce: 7.8,
  netIncome: 8.5,
  somebody: 9.9,
  couldMean: 10.85,
  incomeBack: 11.6,
  below: 12.7,
  hundredK: 13.05,
  receive: 15.9,
  childcare: 16.66,
  allowances: 17.3,
  notTaxed: 17.95,
  taxed62: 18.85,
  but: 19.38,
  givingUp: 20.95,
  allMoney: 21.72,
  even: 23.28,
  over100k: 24.4,
  taxedAt: 25.85,
  sixtyTwo: 26.35,
  mightNeed: 27.5,
  extra38: 28.7,
  inThePound: 29.72,
  justToPay: 30.62,
  costOfLiving: 31.55,
  childcareExp: 32.95,
  allThose: 34.15,
};
