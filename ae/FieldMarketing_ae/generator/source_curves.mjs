// Samples every animated channel of EventsScene with Remotion's OWN spring/interpolate/Easing,
// so the AE keys are fitted to (and verified against) exactly what the Remotion render does.
//   node ae/FieldMarketing_ae/generator/source_curves.mjs > ae/FieldMarketing_ae/generator/source_curves.json
// Values are per scene frame; STEP = 1/8 frame (motion between frames is checked too).
import { Easing, interpolate, spring } from "remotion";

const FPS = 30, END = 135, STEP = 1 / 8;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const channels = {
  // window entrance: spring({ frame: frame - 6, damping 18, stiffness 110 }) drives opacity, x and rotation
  win: (f) => spring({ frame: f - 6, fps: FPS, config: { damping: 18, stiffness: 110 } }),
  // first event chip (Summit); Roadshow and Expo are the same spring 8 and 16 frames later
  chip: (f) => spring({ frame: f - 30, fps: FPS, config: { damping: 12, stiffness: 170 } }),
  // cursor travel progress (x 900 -> 690, y 300 -> 594 share it)
  cursor: (f) => interpolate(f, [40, 78], [0, 1], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) }),
  // button + cursor press scale (1 -> 0.92 -> 1)
  press: (f) => interpolate(f, [80, 84, 90], [1, 0.92, 1], clamp),
  // headline word 1 (start 4); the other words are the same curves 3, 6 and 9 frames later
  wordOpacity: (f) => interpolate(f - 4, [0, 12], [0, 1], clamp),
  wordRise: (f) => interpolate(f - 4, [0, 18], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
  wordBlur: (f) => interpolate(f - 4, [0, 14], [10, 0], clamp),
  // eyebrow pill fade
  labelOpacity: (f) => interpolate(f, [0, 10], [0, 1], clamp),
};

const out = { fps: FPS, step: STEP, frames: [], channels: {} };
for (let f = 0; f <= END + 1e-9; f += STEP) out.frames.push(+f.toFixed(4));
for (const [name, fn] of Object.entries(channels)) out.channels[name] = out.frames.map((f) => fn(f));
console.log(JSON.stringify(out));
