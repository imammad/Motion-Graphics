// Samples every animated channel of src/HubBoxCollection/CollectionVideo.tsx with Remotion's OWN
// spring / Easing, so the AE keys are fitted to (and verified against) exactly what the render does.
//   node ae/HubBoxCollection_ae/generator/source_curves.mjs > ae/HubBoxCollection_ae/generator/source_curves.json
// Times in seconds, STEP = 1/8 frame at 60 fps. Breathing glows and the dock bob are NOT in here: they are
// loops, rebuilt in AE as expressions with controls (see build_body.jsx).
import { Easing, spring } from "remotion";

const FPS = 60, END = 5.5, STEP = 1 / (FPS * 8);
const NATURAL = Easing.bezier(0.42, 0, 0.18, 1);
const MORPH = Easing.bezier(0.6, 0, 0.2, 1);
const LAND = Easing.bezier(0.16, 1, 0.3, 1);
const BOUNCE = { damping: 14, stiffness: 170, mass: 0.9 };
const T = { card: 0, locker: 0.36, lockerDoor: 0.5, pickup: 0.84, pickupPin: 1.02, supermarket: 1.41, supermarketParcel: 1.6,
  other: 2.06, hub: 2.42, others: [2.6, 2.75, 2.9], location: 3.27 };

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, p) => a + (b - a) * p;
const prog = (t, a, b, ease = NATURAL) => ease(clamp((t - a) / (b - a)));
const bump = (t, c, w = 0.5) => Math.exp(-(((t - c) / w) ** 2));
const kick = (t, t0, amp = 0.07) => { const dt = t - t0; return dt <= 0 ? 0 : Math.sin(dt * 13) * Math.exp(-dt * 6.5) * amp; };
const sp = (t, start) => spring({ frame: Math.round(t * FPS * 8) / 8 - start * FPS, fps: FPS, config: BOUNCE });

const HERO = { x: 540, y: 930, glyph: 330 };
const DOCK = [330, 540, 750].map((x) => ({ x, y: 1520 }));
const DOCK_C = 150, DOCK_G = 84, MAP_C = 128, MAP_G = 70;
const HUB = { x: 540, y: 1070 };
const MAP = { locker: { x: 300, y: 810 }, pickup: { x: 790, y: 770 }, supermarket: { x: 770, y: 1340 } };
const OTHERS = [{ x: 250, y: 1160 }, { x: 500, y: 1450 }, { x: 850, y: 1060 }];
const ICON = 360;   // the AE icon precomps draw the 120-unit glyph at 3x: layer scale % = glyph px / 360 * 100
const fly = (a, b, p, arc) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) - Math.sin(Math.PI * p) * arc });

function at(t) {
  const ch = {};
  const morph = prog(t, T.other - 0.06, T.other + 0.84, MORPH);
  ch.card_reveal = prog(t, T.card, T.card + 0.6) * 100;
  ch.card_morph = morph * 100;
  ch.card_edge = Math.sin(Math.PI * clamp(prog(t, T.card, T.card + 0.6))) * 55;   // leading-edge light, peak 55 %

  const enterOf = (E) => ({ wipe: prog(t, E - 0.14, E + 0.26), bounce: lerp(0.45, 1, sp(t, E - 0.16)), glowIn: bump(t, E + 0.18, 0.35) });
  const leave = (next) => prog(t, next - 0.18, next + 0.57, LAND);
  const lE = enterOf(T.locker), pE = enterOf(T.pickup), sE = enterOf(T.supermarket);
  const lDock = leave(T.pickup), pDock = leave(T.supermarket);
  const lMap = prog(t, T.other + 0.04, T.other + 0.84, LAND), pMap = prog(t, T.other + 0.1, T.other + 0.9, LAND), sMap = prog(t, T.other - 0.04, T.other + 0.8, LAND);
  const pulseAt = (p) => bump(t, T.location + Math.hypot(p.x - HUB.x, p.y - HUB.y) / 900, 0.22);

  const heroGlow = clamp(lE.wipe) * (1 - lDock) + clamp(pE.wipe) * (1 - pDock) + clamp(sE.wipe) * (1 - sMap);
  const heroPulse = bump(t, T.locker + 0.18, 0.3) + bump(t, T.pickup + 0.18, 0.3) + bump(t, T.supermarket + 0.18, 0.3);
  ch.hero_glow = clamp(heroGlow * (0.75 + 0.35 * heroPulse)) * (1 - morph) * 100;

  const rip = [T.locker + 0.14, T.pickup + 0.14, T.supermarket + 0.14];
  rip.forEach((rt, k) => [0, 0.18].forEach((off, j) => {
    const rp = clamp((t - rt - off) / 1.1), n = k * 2 + j;
    ch[`ripple${n}_size`] = 2 * lerp(150, 380, LAND(rp));
    ch[`ripple${n}_op`] = (rp <= 0 || rp >= 1 ? 0 : (1 - rp) * 0.5 * (1 - morph)) * 100;
  }));

  const named = [
    ["locker", lE, lDock, lMap, MAP.locker, DOCK[0], kick(t, T.pickup + 0.3) + kick(t, T.other + 0.6),
      0.4 * bump(t, T.pickup + 0.4, 0.35) + 0.4 * bump(t, T.other + 0.7, 0.35), prog(t, T.pickup - 0.05, T.pickup + 0.5)],
    ["pickup", pE, pDock, pMap, MAP.pickup, DOCK[1], kick(t, T.supermarket + 0.3) + kick(t, T.other + 0.65),
      0.4 * bump(t, T.supermarket + 0.4, 0.35) + 0.4 * bump(t, T.other + 0.75, 0.35), prog(t, T.supermarket - 0.05, T.supermarket + 0.5)],
  ];
  for (const [n, E, toDock, toMap, mapPt, dockPt, kicks, glowExtra, circleP] of named) {
    const pos = toMap > 0 ? fly(dockPt, mapPt, toMap, 90) : fly(HERO, dockPt, toDock, 40);
    const glyph = toMap > 0 ? lerp(DOCK_G, MAP_G, toMap) : lerp(HERO.glyph, DOCK_G, toDock);
    ch[`${n}_x`] = pos.x; ch[`${n}_y`] = pos.y;
    ch[`${n}_docked`] = toDock * (1 - toMap) * 100;
    ch[`${n}_scale`] = glyph / ICON * 100 * (E.bounce + kicks);
    ch[`${n}_circle`] = lerp(DOCK_C, MAP_C, toMap);
    ch[`${n}_circlep`] = circleP * 100;
    ch[`${n}_wipe`] = E.wipe * 100;
    ch[`${n}_glow`] = (0.6 + 0.6 * E.glowIn + glowExtra + 0.6 * pulseAt(mapPt)) * 100;
  }
  {
    const pos = fly(HERO, MAP.supermarket, sMap, 30);
    ch.super_x = pos.x; ch.super_y = pos.y; ch.super_docked = 0;
    ch.super_scale = lerp(HERO.glyph, MAP_G, sMap) / ICON * 100 * (sE.bounce + kick(t, T.other + 0.55));
    ch.super_circle = lerp(HERO.glyph, MAP_C, sMap);
    ch.super_circlep = prog(t, T.other + 0.25, T.other + 0.8) * 100;
    ch.super_wipe = sE.wipe * 100;
    ch.super_glow = (0.6 + 0.6 * sE.glowIn + 0.4 * bump(t, T.other + 0.65, 0.35) + 0.6 * pulseAt(MAP.supermarket)) * 100;
  }
  OTHERS.forEach((p, i) => {
    const E = T.others[i];
    ch[`other${i}_scale`] = MAP_G / ICON * 100 * lerp(0.45, 1, sp(t, E - 0.1));
    ch[`other${i}_circlep`] = prog(t, E - 0.1, E + 0.4) * 100;
    ch[`other${i}_wipe`] = prog(t, E - 0.1, E + 0.25) * 100;
    ch[`other${i}_glow`] = (0.6 + 0.6 * bump(t, E + 0.2, 0.35) + 0.6 * pulseAt(p)) * 100;
  });

  // icon micro-moments (inside the icon precomps, 120-unit glyph drawn at 3x)
  const door = prog(t, T.lockerDoor, T.lockerDoor + 0.45);
  ch.door_scalex = lerp(1, 0.18, door) * 100;
  ch.door_fill = lerp(0.32, 0.5, door) * 100;
  ch.door_handle = (1 - door) * 100;
  ch.parcel_op = clamp(door * 1.6) * 100;
  ch.parcel_scale = lerp(0.7, 1, door) * 100;
  const pin = sp(t, T.pickupPin);
  ch.pin_y = lerp(-34, 0, pin) * 3;
  ch.pin_op = clamp(pin * 3) * 100;
  const drop = sp(t, T.supermarketParcel);
  ch.drop_y = lerp(4, 47, drop) * 3;
  ch.drop_op = clamp(drop * 3) * 100;

  // hub, its ripples, connectors, the "location" pulse
  const hubIn = prog(t, T.hub - 0.05, T.hub + 0.3);
  ch.hub_scale = sp(t, T.hub) * 50;          // hub PNG is drawn at 2x
  ch.hub_op = hubIn * 100;
  [0, 0.9, 1.8, 2.7].forEach((off, j) => {
    const s = T.hub + off, ph = clamp((t - s) / 1.8);
    ch[`hubring${j}_scale`] = lerp(0.18, 1, LAND(ph)) * 100;
    ch[`hubring${j}_op`] = (t < s || ph >= 1 ? 0 : (1 - ph) * 0.6 * hubIn) * 100;
  });
  const targets = [MAP.locker, MAP.pickup, MAP.supermarket, ...OTHERS];
  targets.forEach((p, i) => {
    const cs = i < 3 ? T.hub + 0.08 + i * 0.08 : T.others[i - 3] - 0.08;
    const cp = prog(t, cs, cs + 0.6), pp = prog(t, cs + 0.45, cs + 1.1);
    const L = Math.hypot(p.x - HUB.x, p.y - HUB.y), ux = (p.x - HUB.x) / L, uy = (p.y - HUB.y) / L;
    const a = { x: HUB.x + ux * 34, y: HUB.y + uy * 34 }, b = { x: p.x - ux * (MAP_C / 2 + 12), y: p.y - uy * (MAP_C / 2 + 12) };
    ch[`conn${i}_end`] = cp * 100;
    ch[`conn${i}_dot`] = clamp((cp - 0.85) / 0.15) * 100;
    ch[`conn${i}_px`] = lerp(a.x, b.x, pp);
    ch[`conn${i}_py`] = lerp(a.y, b.y, pp);
    ch[`conn${i}_pop`] = (pp > 0 && pp < 1 ? Math.sin(Math.PI * pp) : 0) * 100;
  });
  [0, 0.12].forEach((off, j) => {
    const lp = clamp((t - T.location + 0.06 - off) / 1.1);
    ch[`loc${j}_size`] = 2 * lerp(30, 640, LAND(lp));
    ch[`loc${j}_op`] = (lp <= 0 || lp >= 1 ? 0 : (1 - lp) * (j ? 0.4 : 0.75)) * 100;
  });
  ch.map_reveal = prog(t, T.other + 0.2, T.other + 1.0) * 100;

  const heads = [[T.locker - 0.16, T.pickup - 0.22], [T.pickup - 0.04, T.supermarket - 0.22], [T.supermarket - 0.04, T.other - 0.2],
    [T.other + 0.06, 99], [T.location - 0.14, 99]];
  heads.forEach(([i, o], k) => { ch[`head${k}_in`] = prog(t, i, i + 0.5) * 100; ch[`head${k}_out`] = prog(t, o, o + 0.32, MORPH) * 100; });
  return ch;
}

const out = { fps: FPS, step: STEP, times: [], channels: {} };
for (let n = 0; n * STEP <= END + 1e-9; n++) {
  const t = n * STEP; out.times.push(+t.toFixed(6));
  const ch = at(t);
  for (const k in ch) (out.channels[k] = out.channels[k] || []).push(+ch[k].toFixed(5));
}
console.log(JSON.stringify(out));
