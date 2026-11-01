// "Gold 1st November update" reel. Times in seconds on public/anfaal3/cut.mp4
// (client's 55 s take, graded + voice-cleaned; jump cuts at 9.75, 42.21, 44.88).
// All captions and on-screen graphics live in the client's box over the ceiling:
// x 165–942, y 217–606 (graphics in the upper part, the caption line at the bottom).

export const DURATION_S = 55.05;
export const CUTS = [9.75, 42.21, 44.88];

export const BOX = { x0: 150, x1: 930, y0: 222, y1: 606 };
export const CAPTION_Y = 528; // caption line inside the box (bottom)

// Roman Urdu captions. *green* keyword, !red! alert, ^gold^ gold price only.
export type Cap = { t: number; text: string };
export const CAPTIONS: Cap[] = [
  { t: 0.16, text: "^4000^ ke level se ^3872^" },
  { t: 2.59, text: "ka safar" },
  { t: 3.27, text: "gold !ruk nahi raha!" },
  { t: 4.62, text: "aur abhi aap logon ki" },
  { t: 5.85, text: "samajh se bahar" },
  { t: 6.7, text: "chal raha hoga" },
  { t: 7.58, text: "ke kahan pe aa ke" },
  { t: 8.33, text: "*break* lega" },
  { t: 10.23, text: "toh ab main aap logon ko" },
  { t: 11.48, text: "ek chhota sa *overview*" },
  { t: 12.35, text: "deta hoon" },
  { t: 12.97, text: "ek *zone* hai jahan se" },
  { t: 14.31, text: "*reversal* ki possibility" },
  { t: 15.34, text: "aa sakti hai" },
  { t: 16.1, text: "gold ke andar" },
  { t: 16.97, text: "woh hai ^3800^ ki *support*" },
  { t: 18.79, text: "agar yeh bhi !break! hoti hai" },
  { t: 20.67, text: "toh humein gold ki prices" },
  { t: 21.84, text: "aur !down! jaate hue" },
  { t: 22.8, text: "dikh sakti hain" },
  { t: 23.79, text: "aur is ke baad" },
  { t: 24.66, text: "!US–Iran war! ki tension hai" },
  { t: 27.29, text: "elections ki tension hai" },
  { t: 28.54, text: "bohot si fundamental" },
  { t: 29.7, text: "aisi newses aa rahi hain" },
  { t: 30.86, text: "jo gold ko !pressure!" },
  { t: 31.75, text: "mein daal rahi hain" },
  { t: 32.64, text: "ya toh agar yeh" },
  { t: 33.41, text: "is zone se *urr* jaye" },
  { t: 35.59, text: "ya toh koi aisi" },
  { t: 36.11, text: "*fundamental updates*" },
  { t: 37.5, text: "aa jayein" },
  { t: 38.57, text: "jis ki wajah se gold ko" },
  { t: 39.58, text: "*support* achha mil jaye" },
  { t: 40.79, text: "aur *USD weak* ho jaye" },
  { t: 41.93, text: "toh yeh gold ki" },
  { t: 42.65, text: "*1st November* ki update thi" },
  { t: 44.39, text: "agar aap ko" },
  { t: 45.27, text: "*safely* trade karni hai" },
  { t: 46.31, text: "din ke ek do *setups*" },
  { t: 48.33, text: "*100–150 pips* ke" },
  { t: 50.97, text: "*daily* setups" },
  { t: 51.9, text: "chahiye hain" },
  { t: 52.75, text: "toh upar *community* ka link" },
  { t: 54.03, text: "join kar lo" },
];

// On-screen graphic windows (all inside BOX, above the caption line).
export const G = {
  ticker: { from: 0.0, to: 2.7 }, // 4000 → 3872 count-down (hook)
  breakQ: { from: 7.6, to: 10.0 }, // "Break kahan?"
  zone: { from: 12.9, to: 23.8 }, // mini chart: reversal zone 3800 → break
  pressure: { from: 23.8, to: 32.5 }, // war · elections · fundamentals → pressure
  scenarios: { from: 32.55, to: 41.9 }, // bounce ↑ / USD weak ↑
  date: { from: 42.0, to: 45.2 }, // 01 NOV update
  cta: { from: 45.3, to: 55.05 }, // setups · pips · join
};

// No split screens or full screens in this reel (the face fills the frame);
// kept for the shared Speaker/Captions code.
export const SCENES = {};
export const SPLITS: { from: number; to: number }[] = [];
export const FULLS: { from: number; to: number }[] = [];
export const PILLS = { from: -10, to: -9 };

export type Behind = { from: number; to: number; word: string; tone: "white" | "gold" | "red" | "green" };
export const BEHIND: Behind[] = [];

// Camera: gentle (face is very close). hold = change at a cut.
export type CamKey = { t: number; s: number; hold?: boolean };
export const CAM: CamKey[] = [
  { t: 0, s: 1.05, hold: true },
  { t: 1.2, s: 1.0 }, // hook settle
  { t: 9.75, s: 1.03 },
  { t: 9.75, s: 1.0, hold: true },
  { t: 17.0, s: 1.04 }, // 3800 support
  { t: 23.8, s: 1.02 },
  { t: 31.0, s: 1.05 }, // pressure
  { t: 42.21, s: 1.04 },
  { t: 42.21, s: 1.0, hold: true },
  { t: 44.88, s: 1.0 },
  { t: 44.88, s: 1.03, hold: true },
  { t: 55.05, s: 1.06 },
];

export type FaceSeg = { from: number; cx: number; cy: number; h: number };
export const FACE_SEG: FaceSeg[] = [{ from: 0, cx: 560, cy: 1330, h: 650 }];
export const faceAt = (t: number) => [...FACE_SEG].reverse().find((f) => f.from <= t) ?? FACE_SEG[0];
