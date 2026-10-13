// Beat-by-beat timing (seconds). One place to retime against the voiceover:
// "A locker, pickup point, supermarket or other collection location"

export const T = {
  // 01 Locker
  lockerIn: 0.0,
  parcelIntoLocker: 0.22, // parcel flies in, lands ~0.8
  lockerCheck: 0.82,

  // 02 Pickup point (camera pans right)
  pan1: 1.0,
  panDur: 0.75,
  pickupCheck: 1.86,

  // 03 Supermarket (camera pans right)
  pan2: 2.15,
  marketDoorsOpen: 2.55,
  marketCheck: 3.04,

  // 04 Or other collection location (camera pulls out to the map)
  zoomOut: 3.4,
  zoomDur: 1.05,
  pinWave: 4.32,

  end: 6.0,
};

// Hero headings: [in, out]. Outgoing and incoming words never share the mask.
export const HEROES: {
  lines: { text: string; accent?: boolean }[];
  in: number;
  out: number;
}[] = [
  { lines: [{ text: "Locker" }], in: 0.06, out: 1.0 },
  { lines: [{ text: "Pickup Point" }], in: 1.28, out: 2.14 },
  { lines: [{ text: "Supermarket" }], in: 2.42, out: 3.3 },
  {
    lines: [
      { text: "Or Any Other" },
      { text: "Collection Point", accent: true },
    ],
    in: 3.72,
    out: 99,
  },
];

// World layout. Each location sits on a 720px map block; blocks repeat every 1100px,
// leaving roads between them that the pull-out reveals as a map.
export const BLOCK = 720;
export const STEP = 1100;
export const LOCATIONS = {
  locker: { x: 0, y: 0 },
  pickup: { x: STEP, y: 0 },
  market: { x: STEP * 2, y: 0 },
  hub: { x: STEP, y: STEP },
};
