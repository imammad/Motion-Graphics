// "AI bubble burst · gold 3872 · oil $105" reel. Times in seconds on public/anfaal2/cut.mp4
// (the client's own 38.5 s cut, graded + voice-cleaned; jump cuts at 6.75, 9.63 and 21.5).

export const DURATION_S = 38.45;
export const CUTS = [6.75, 9.63, 21.5];

// Roman Urdu captions. *word* = green keyword, !word! = red alert, ^word^ = gold (gold price only).
export type Cap = { t: number; text: string };
export const CAPTIONS: Cap[] = [
  { t: 0.1, text: "*AI bubble* burst ho raha hai" },
  { t: 1.74, text: "American *stocks* market" },
  { t: 2.78, text: "!crash! ho rahi hain" },
  { t: 3.74, text: "saath hi saath" },
  { t: 4.52, text: "^gold^ bhi !crash! ho raha hai" },
  { t: 5.56, text: "^4000^ ke level se" },
  { t: 6.94, text: "^3872^ ke level pe" },
  { t: 8.05, text: "aa chuka hai" },
  { t: 9.69, text: "is ka matlab abhi log" },
  { t: 10.74, text: "kahin bhi *invest* nahi kar rahe" },
  { t: 12.57, text: "*cash in hand* rakh rahe hain" },
  { t: 13.95, text: "jabke abhi is waqt" },
  { t: 15.09, text: "!US–Iran war!" },
  { t: 16.38, text: "elections aur in sab ke" },
  { t: 17.62, text: "pressure ki wajah se" },
  { t: 18.67, text: "*oil* humein" },
  { t: 19.58, text: "!$105! per barrel" },
  { t: 20.52, text: "pe dikh raha hai" },
  { t: 21.56, text: "jo ke bohot !buri situation! hai" },
  { t: 22.77, text: "America ke liye bhi" },
  { t: 23.75, text: "aur ^gold^ ke liye bhi" },
  { t: 24.53, text: "agar aap *safe trade*" },
  { t: 25.86, text: "karna chahte ho" },
  { t: 27.01, text: "toh main aap ko" },
  { t: 27.72, text: "proper *trade plan* doonga" },
  { t: 29.23, text: "aur woh waqt bhi door nahi" },
  { t: 30.79, text: "jis se aap *long-term*" },
  { t: 31.76, text: "investment se" },
  { t: 32.84, text: "*profit* bana sakein" },
  { t: 33.83, text: "aur agar aap ko" },
  { t: 34.68, text: "*trade with me* karna hai" },
  { t: 36.16, text: "toh *community* link bio mein hai" },
  { t: 37.19, text: "join kar lo" },
];

// Scene windows. Splits = infographic top 960 px, speaker below.
export const SCENES = {
  hookSplit: { from: 0, to: 5.5 }, // AI bubble bursts → stocks crash → gold drops (open at frame 0)
  cash: { from: 9.75, to: 14.95 }, // full screen, light: cash in hand
  oilSplit: { from: 15.0, to: 21.5 }, // war / elections / pressure → oil $105
  planSplit: { from: 24.7, to: 29.25 }, // safe trade plan checklist
  ctaSplit: { from: 32.86, to: 38.45 }, // community CTA
};
export const SPLITS = [SCENES.hookSplit, SCENES.oilSplit, SCENES.planSplit, SCENES.ctaSplit];
export const FULLS = [SCENES.cash];

// "America ↓ · Gold ↓" pills above the head (caption steps aside)
export const PILLS = { from: 22.8, to: 24.65 };

export type Behind = { from: number; to: number; word: string; tone: "white" | "gold" | "red" | "green" };
export const BEHIND: Behind[] = [
  { from: 7.0, to: 9.0, word: "3872", tone: "gold" },
  { from: 30.7, to: 32.75, word: "LONG TERM", tone: "green" },
];

// Camera (seconds). hold = hard change at a cut; others ease in-out.
export type CamKey = { t: number; s: number; hold?: boolean };
export const CAM: CamKey[] = [
  { t: 0, s: 1.0, hold: true },
  { t: 5.5, s: 1.0 },
  { t: 6.8, s: 1.0, hold: true },
  { t: 7.3, s: 1.1 }, // 3872 push
  { t: 9.63, s: 1.1 },
  { t: 9.63, s: 1.02, hold: true },
  { t: 14.95, s: 1.04 },
  { t: 21.5, s: 1.04 },
  { t: 21.5, s: 1.0, hold: true },
  { t: 22.0, s: 1.0, hold: true },
  { t: 22.6, s: 1.08 }, // "buri situation"
  { t: 24.7, s: 1.1 },
  { t: 29.25, s: 1.02, hold: true },
  { t: 30.4, s: 1.02, hold: true },
  { t: 30.9, s: 1.1 }, // long term
  { t: 32.86, s: 1.12 },
  { t: 38.45, s: 1.14 },
];

// Tracked face per clip (median from scripts/anfaal/face_track.py, source px).
// Box bottom ≈ chin, hair top ≈ cy − 0.85·h.
export type FaceSeg = { from: number; cx: number; cy: number; h: number };
export const FACE_SEG: FaceSeg[] = [
  { from: 0, cx: 536, cy: 964, h: 390 },
  { from: 9.63, cx: 531, cy: 956, h: 400 },
  { from: 21.5, cx: 552, cy: 917, h: 378 },
];
export const faceAt = (t: number) => [...FACE_SEG].reverse().find((f) => f.from <= t) ?? FACE_SEG[0];
