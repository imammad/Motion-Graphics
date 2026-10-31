// All times in seconds on the CUT timeline (public/anfaal/cut.mp4, 60.4 s).
// Source → cut mapping (from the raw 2:03 take):
//   0.10–7.64 → 0.00   hook (rumours)
//  24.10–32.08 → 7.54  new Fed chair, rate cuts → hikes
//  40.96–46.19 → 15.52 36% hike chance, twice a year
//  46.41–52.76 → 20.75 rates up = money leaves gold & crypto
//  59.30–65.36 → 27.10 4000–4200 consolidation
//  69.10–78.60 → 33.16 3800 last support
//  79.10–80.58 → 42.66 could break it
// 108.66–116.25 → 44.14 lesson: big move / big lot = no profit
//  81.08–89.65 → 51.73 CTA: community, link in bio

export const DURATION_S = 60.3;
export const CUTS = [7.54, 15.52, 20.75, 27.1, 33.16, 42.66, 44.14, 51.73];

// Roman Urdu captions. *word* = accent keyword (green), !word! = alert keyword (red),
// ^word^ = gold keyword. Each line shows until the next line's start.
export type Cap = { t: number; text: string };
export const CAPTIONS: Cap[] = [
  { t: 0.02, text: "*FOMC* mein gold" },
  { t: 0.9, text: "!crash! karne wala hai" },
  { t: 1.95, text: "gold *all-time high*" },
  { t: 2.9, text: "jaane wala hai" },
  { t: 3.6, text: "aisi baatein kar ke" },
  { t: 4.4, text: "sirf logon ko" },
  { t: 5.0, text: "*afwaahein* phailaayi ja rahi hain" },
  { t: 6.35, text: "aur !panic! karaya ja raha hai" },
  { t: 7.56, text: "lekin is ke baad" },
  { t: 8.45, text: "*Fed* ka naya chairman aaya" },
  { t: 10.05, text: "aur possibility yeh thi" },
  { t: 11.3, text: "ke *rate cuts* ho jayenge" },
  { t: 12.95, text: "yahan jo scenario hai" },
  { t: 13.85, text: "woh yeh ke rates" },
  { t: 14.55, text: "*barhaye* ja sakte hain" },
  { t: 15.54, text: "humare paas" },
  { t: 16.3, text: "*36%* rate hike" },
  { t: 17.8, text: "hone ke chances hain" },
  { t: 19.0, text: "woh bhi saal mein *do dafa*" },
  { t: 20.77, text: "dekho, jab *interest rate*" },
  { t: 22.0, text: "barhta hai" },
  { t: 22.6, text: "toh market mein se" },
  { t: 23.35, text: "paisa !khatam! ho jata hai" },
  { t: 24.6, text: "na ^gold^ mein paisa aata hai" },
  { t: 25.75, text: "na *crypto* mein paisa aata hai" },
  { t: 27.12, text: "aap dekh sakte ho" },
  { t: 28.2, text: "^4000^ ke level se" },
  { t: 29.87, text: "^4200^ ke level tak" },
  { t: 31.1, text: "*consolidate* kar raha hai price" },
  { t: 33.18, text: "aur possibility yeh hai" },
  { t: 34.3, text: "ke gold ki last *support*" },
  { t: 35.62, text: "^3800^ tak" },
  { t: 36.4, text: "woh usko bhi tap kar de" },
  { t: 38.1, text: "aur agar mazeed" },
  { t: 39.57, text: "maamlaat !kharab! hote hain" },
  { t: 40.9, text: "toh yeh bhi possibility hai" },
  { t: 42.0, text: "ke woh us" },
  { t: 42.7, text: "support ko bhi !break! kar de" },
  { t: 44.16, text: "agar tum yeh sochte rahoge" },
  { t: 45.6, text: "ke aaj itna *bara move*" },
  { t: 46.7, text: "aa jayega" },
  { t: 47.53, text: "aaj itni *bari lot* ke saath" },
  { t: 49.0, text: "enter ho jayenge" },
  { t: 50.2, text: "toh tum kabhi bhi" },
  { t: 50.85, text: "!profit nahi! kar sakte" },
  { t: 51.76, text: "agar tum chahte ho" },
  { t: 52.75, text: "trade karna *gold* mein" },
  { t: 54.73, text: "*FOMC* ke upar" },
  { t: 55.6, text: "toh link *bio* mein hai" },
  { t: 57.4, text: "aa ke *community* join kar lo" },
  { t: 59.5, text: "main *trade* karwaunga" },
];

// Scene windows (seconds). split = infographic top half, speaker bottom half.
// Fed chair card window (replaces the caption above the head)
export const FED_CARD = { from: 8.4, to: 10.0 };

export const SCENES = {
  rumours: { from: 3.55, to: 7.54 }, // full screen
  rateSplit: { from: 10.0, to: 15.52 }, // split
  oddsSplit: { from: 16.25, to: 20.75 }, // split
  liquidity: { from: 22.55, to: 27.1 }, // full screen (light)
  rangeSplit: { from: 27.55, to: 33.16 }, // split
  supportSplit: { from: 35.5, to: 44.14 }, // split
  ctaSplit: { from: 51.73, to: 60.3 }, // split
};

// Big words behind the head (person cut-out sits above them).
export type Behind = { from: number; to: number; word: string; tone: "white" | "gold" | "red" | "green" };
export const BEHIND: Behind[] = [
  { from: 0.0, to: 3.55, word: "GOLD", tone: "gold" },
  { from: 20.77, to: 22.2, word: "RATES", tone: "white" },
  { from: 34.25, to: 35.5, word: "SUPPORT", tone: "white" },
  { from: 50.85, to: 51.73, word: "NO PROFIT", tone: "red" },
];

// Speaker camera: scale keys (seconds). Cuts change scale (hides the jump cut),
// in between it eases slowly; emphasis zooms are 0.5 s in-out moves.
export type CamKey = { t: number; s: number; y?: number; hold?: boolean };
export const CAM: CamKey[] = [
  { t: 0, s: 1.1, hold: true },
  { t: 0.7, s: 1.0 }, // hook pull-out
  { t: 1.9, s: 1.0, hold: true },
  { t: 2.4, s: 1.05 }, // all-time high push
  { t: 3.55, s: 1.06 },
  { t: 7.54, s: 1.0, hold: true },
  { t: 8.4, s: 1.0, hold: true },
  { t: 8.9, s: 1.1 },
  { t: 10.0, s: 1.12 },
  { t: 15.52, s: 1.06, hold: true },
  { t: 16.25, s: 1.1 },
  { t: 20.75, s: 1.02, hold: true },
  { t: 21.6, s: 1.02, hold: true },
  { t: 22.1, s: 1.12 },
  { t: 27.1, s: 1.05, hold: true },
  { t: 33.16, s: 1.1, hold: true },
  { t: 35.5, s: 1.12 },
  { t: 44.14, s: 1.0, hold: true },
  { t: 45.4, s: 1.0, hold: true },
  { t: 45.9, s: 1.05 },
  { t: 47.3, s: 1.05, hold: true },
  { t: 47.8, s: 1.1 },
  { t: 50.6, s: 1.1, hold: true },
  { t: 50.95, s: 1.15 }, // "profit nahi" punch (smooth)
  { t: 51.73, s: 1.06, hold: true },
  { t: 60.3, s: 1.12 },
];

// Tracked face per clip (median of scripts/anfaal/face_track.py, source px):
// centre x/y and face-box height (box bottom ≈ chin, hair top ≈ cy − 0.85·h).
export type FaceSeg = { from: number; cx: number; cy: number; h: number };
export const FACE_SEG: FaceSeg[] = [
  { from: 0, cx: 526, cy: 1055, h: 694 },
  { from: 7.54, cx: 481, cy: 1182, h: 700 },
  { from: 15.52, cx: 491, cy: 1192, h: 706 },
  { from: 20.75, cx: 442, cy: 1192, h: 696 },
  { from: 27.1, cx: 430, cy: 1193, h: 683 },
  { from: 33.16, cx: 473, cy: 1183, h: 736 },
  { from: 42.66, cx: 581, cy: 1162, h: 676 },
  { from: 44.14, cx: 459, cy: 1170, h: 704 },
  { from: 51.73, cx: 572, cy: 1163, h: 706 },
];
export const faceAt = (t: number) => [...FACE_SEG].reverse().find((f) => f.from <= t) ?? FACE_SEG[0];
