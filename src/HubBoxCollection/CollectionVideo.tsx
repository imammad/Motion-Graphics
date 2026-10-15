/**
 * "A locker, pickup point, supermarket or other collection location"
 *
 * Flow (one continuous move, no cuts), seconds from VO 0:06.00:
 *  0.00  Glass hero card gradient-reveals over the brand ground.
 *  0.36  LOCKER icon bounces in with a pink glow; a door swings open.
 *  0.84  Locker drops into the dock; PICKUP POINT bounces in, pin drops.
 *  1.41  Pickup point docks; SUPERMARKET bounces in, a parcel drops in the cart.
 *  2.06  "or other": the card opens out into a map and all three fly onto it.
 *  2.42  A shopper hub appears, connectors draw out, and on "collection"
 *        three more pins bounce in.
 *  3.27  "location": one pulse rings across the network. Hold to 5.5s.
 */
import React from "react";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { Badge, GlassPanel, gradientReveal } from "./Glass";
import { Headline } from "./Headline";
import { LockerIcon, PickupPointIcon, PinIcon, SupermarketIcon } from "./Icons";
import { BOUNCE, FPS, LAND, MORPH, PINK, T, clamp, lerp, prog } from "./theme";

type Pt = { x: number; y: number };

const HERO: Pt & { glyph: number } = { x: 540, y: 930, glyph: 330 };
const CARD0 = { x: 180, y: 570, w: 720, h: 720, r: 64 };
const CARD1 = { x: 110, y: 580, w: 860, h: 1000, r: 56 };
const DOCK: Pt[] = [330, 540, 750].map((x) => ({ x, y: 1520 }));
const DOCK_C = 150;
const DOCK_G = 84;
const MAP_C = 128;
const MAP_G = 70;
const HUB: Pt = { x: 540, y: 1070 };
const MAP: Record<"locker" | "pickup" | "supermarket", Pt> = {
  locker: { x: 300, y: 810 },
  pickup: { x: 790, y: 770 },
  supermarket: { x: 770, y: 1340 },
};
const OTHERS: Pt[] = [
  { x: 250, y: 1160 },
  { x: 500, y: 1450 },
  { x: 850, y: 1060 },
];

/** Straight travel with a gentle arc so flights read as one natural throw. */
const fly = (a: Pt, b: Pt, p: number, arc = 70): Pt => ({
  x: lerp(a.x, b.x, p),
  y: lerp(a.y, b.y, p) - Math.sin(Math.PI * p) * arc,
});

/** Soft gaussian bump, used for glow peaks on landing. */
const bump = (t: number, c: number, w = 0.5) => Math.exp(-(((t - c) / w) ** 2));

/** Damped kick that starts at 0, so a landing squash never jumps. */
const kick = (t: number, t0: number, amp = 0.07) => {
  const dt = t - t0;
  if (dt <= 0) return 0;
  return Math.sin(dt * 13) * Math.exp(-dt * 6.5) * amp;
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sp = (start: number) =>
    spring({ frame: frame - start * FPS, fps: FPS, config: BOUNCE });
  const breathe = (i: number) => Math.sin(t * 2.2 + i * 1.7) * 0.07;

  // ---- hero card -> map card -------------------------------------------
  const cardIn = prog(t, T.card, T.card + 0.6);
  const morph = prog(t, T.other - 0.06, T.other + 0.84, MORPH);
  const card = {
    x: lerp(CARD0.x, CARD1.x, morph),
    y: lerp(CARD0.y, CARD1.y, morph),
    w: lerp(CARD0.w, CARD1.w, morph),
    h: lerp(CARD0.h, CARD1.h, morph),
    r: lerp(CARD0.r, CARD1.r, morph),
  };
  const mapIn = prog(t, T.other + 0.2, T.other + 1.0);

  // ---- the three named locations ----------------------------------------
  // Each bounces into the hero card on its word, then drops into the dock as
  // the next word starts, and finally flies onto the map on "or other".
  const enterOf = (E: number) => ({
    wipe: prog(t, E - 0.14, E + 0.26),
    bounce: lerp(0.45, 1, sp(E - 0.16)),
    glowIn: bump(t, E + 0.18, 0.35),
  });
  const leave = (next: number) => prog(t, next - 0.18, next + 0.57, LAND);

  const lockerE = enterOf(T.locker);
  const lockerToDock = leave(T.pickup);
  const lockerToMap = prog(t, T.other + 0.04, T.other + 0.84, LAND);
  const pickupE = enterOf(T.pickup);
  const pickupToDock = leave(T.supermarket);
  const pickupToMap = prog(t, T.other + 0.1, T.other + 0.9, LAND);
  const superE = enterOf(T.supermarket);
  const superToMap = prog(t, T.other - 0.04, T.other + 0.8, LAND);

  const docked = (i: number, inP: number, outP: number) =>
    Math.sin(t * 1.8 + i * 1.3) * 5 * inP * (1 - outP);

  const lockerPos =
    lockerToMap > 0
      ? fly(DOCK[0], MAP.locker, lockerToMap, 90)
      : fly(HERO, DOCK[0], lockerToDock, 40);
  const pickupPos =
    pickupToMap > 0
      ? fly(DOCK[1], MAP.pickup, pickupToMap, 90)
      : fly(HERO, DOCK[1], pickupToDock, 40);
  const superPos = fly(HERO, MAP.supermarket, superToMap, 30);

  const glyphSize = (toDock: number, toMap: number) =>
    toMap > 0 ? lerp(DOCK_G, MAP_G, toMap) : lerp(HERO.glyph, DOCK_G, toDock);
  const circleSize = (toMap: number) => lerp(DOCK_C, MAP_C, toMap);

  // "location" pulse rings out from the hub and lights each pin as it passes
  const pulseAt = (p: Pt) => bump(t, T.location + Math.hypot(p.x - HUB.x, p.y - HUB.y) / 900, 0.22);

  // landing kicks (bounce on arrival) + glow pulses
  const lockerScale =
    lockerE.bounce + kick(t, T.pickup + 0.3) + kick(t, T.other + 0.6);
  const pickupScale =
    pickupE.bounce + kick(t, T.supermarket + 0.3) + kick(t, T.other + 0.65);
  const superScale = superE.bounce + kick(t, T.other + 0.55);

  const lockerGlow =
    0.6 + 0.6 * lockerE.glowIn + 0.4 * bump(t, T.pickup + 0.4, 0.35) + 0.4 * bump(t, T.other + 0.7, 0.35) + 0.6 * pulseAt(MAP.locker) + breathe(0);
  const pickupGlow =
    0.6 + 0.6 * pickupE.glowIn + 0.4 * bump(t, T.supermarket + 0.4, 0.35) + 0.4 * bump(t, T.other + 0.75, 0.35) + 0.6 * pulseAt(MAP.pickup) + breathe(1);
  const superGlow =
    0.6 + 0.6 * superE.glowIn + 0.4 * bump(t, T.other + 0.65, 0.35) + 0.6 * pulseAt(MAP.supermarket) + breathe(2);

  // hero-card inner glow follows whichever icon is centre stage
  const heroGlow =
    clamp(lockerE.wipe) * (1 - lockerToDock) +
    clamp(pickupE.wipe) * (1 - pickupToDock) +
    clamp(superE.wipe) * (1 - superToMap);
  const heroPulse =
    bump(t, T.locker + 0.18, 0.3) + bump(t, T.pickup + 0.18, 0.3) + bump(t, T.supermarket + 0.18, 0.3);

  // ---- map finale ----------------------------------------------------------
  const hubS = sp(T.hub);
  const hubIn = prog(t, T.hub - 0.05, T.hub + 0.3);
  const targets: Pt[] = [MAP.locker, MAP.pickup, MAP.supermarket, ...OTHERS];
  const connStart = (i: number) => (i < 3 ? T.hub + 0.08 + i * 0.08 : T.others[i - 3] - 0.08);

  const headlines = [
    { lines: ["Locker"], in: T.locker - 0.16, out: T.pickup - 0.22, y: 380 },
    { lines: ["Pickup Point"], in: T.pickup - 0.04, out: T.supermarket - 0.22, y: 380 },
    { lines: ["Supermarket"], in: T.supermarket - 0.04, out: T.other - 0.2, y: 380 },
    { lines: ["Any Collection"], in: T.other + 0.06, out: 99, y: 340 },
    { lines: ["Location"], in: T.location - 0.14, out: 99, y: 461, accentLast: true },
  ];

  const rippleTimes = [T.locker + 0.14, T.pickup + 0.14, T.supermarket + 0.14];

  return (
    <AbsoluteFill>
      <Background t={t} />

      {/* hero / map glass card */}
      <GlassPanel x={card.x} y={card.y} w={card.w} h={card.h} radius={card.r} p={cardIn}>
        {/* soft pink light behind the centre-stage icon */}
        <div
          style={{
            position: "absolute",
            left: HERO.x - card.x - 330,
            top: HERO.y - card.y - 330,
            width: 660,
            height: 660,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(239,41,106,0.42) 0%, rgba(239,41,106,0.10) 40%, transparent 68%)",
            opacity: clamp(heroGlow * (0.75 + 0.35 * heroPulse)) * (1 - morph),
          }}
        />
        {/* landing ripples */}
        <svg
          width={card.w}
          height={card.h}
          style={{ position: "absolute", left: 0, top: 0, opacity: 1 - morph }}
        >
          {rippleTimes.flatMap((rt, k) =>
            [0, 0.18].map((off) => {
              const rp = clamp((t - rt - off) / 1.1);
              if (rp <= 0 || rp >= 1) return null;
              return (
                <circle
                  key={`${k}-${off}`}
                  cx={HERO.x - card.x}
                  cy={HERO.y - card.y}
                  r={lerp(150, 380, LAND(rp))}
                  fill="none"
                  stroke={PINK}
                  strokeWidth={2.5}
                  opacity={(1 - rp) * 0.5}
                />
              );
            }),
          )}
        </svg>
        {/* map streets, pinned to stage space while the card grows */}
        {mapIn > 0 ? (
          <MapStreets
            p={mapIn}
            left={CARD1.x - card.x}
            top={CARD1.y - card.y}
          />
        ) : null}
      </GlassPanel>

      {/* connectors from the shopper hub to every collection point */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="conn" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1080" y2="1920">
            <stop offset="0" stopColor="#FF8AB0" />
            <stop offset="1" stopColor={PINK} />
          </linearGradient>
        </defs>
        {targets.map((p, i) => {
          const cp = prog(t, connStart(i), connStart(i) + 0.6);
          if (cp <= 0) return null;
          const dx = p.x - HUB.x;
          const dy = p.y - HUB.y;
          const L = Math.hypot(dx, dy);
          const ux = dx / L;
          const uy = dy / L;
          const a = { x: HUB.x + ux * 34, y: HUB.y + uy * 34 };
          const b = { x: p.x - ux * (MAP_C / 2 + 12), y: p.y - uy * (MAP_C / 2 + 12) };
          const tip = { x: lerp(a.x, b.x, cp), y: lerp(a.y, b.y, cp) };
          // a glowing pulse rides out along each line once
          const pp = prog(t, connStart(i) + 0.45, connStart(i) + 1.1);
          const dot = { x: lerp(a.x, b.x, pp), y: lerp(a.y, b.y, pp) };
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={tip.x}
                y2={tip.y}
                stroke="url(#conn)"
                strokeWidth={3.5}
                strokeDasharray="2 12"
                strokeLinecap="round"
                opacity={0.85}
              />
              <circle cx={b.x} cy={b.y} r={5} fill={PINK} opacity={clamp((cp - 0.85) / 0.15)} />
              {pp > 0 && pp < 1 ? (
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={7}
                  fill="#FFD1E0"
                  opacity={Math.sin(Math.PI * pp)}
                  style={{ filter: "drop-shadow(0 0 10px rgba(239,41,106,1))" }}
                />
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* "location": one pulse rings out across the whole network */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="mapClip">
            <rect x={CARD1.x} y={CARD1.y} width={CARD1.w} height={CARD1.h} rx={CARD1.r} />
          </clipPath>
        </defs>
        <g clipPath="url(#mapClip)">
          {[0, 0.12].map((off) => {
            const lp = clamp((t - T.location + 0.06 - off) / 1.1);
            if (lp <= 0 || lp >= 1) return null;
            return (
              <circle
                key={off}
                cx={HUB.x}
                cy={HUB.y}
                r={lerp(30, 640, LAND(lp))}
                fill="none"
                stroke={PINK}
                strokeWidth={off ? 2 : 4}
                opacity={(1 - lp) * (off ? 0.4 : 0.75)}
                style={{ filter: "drop-shadow(0 0 12px rgba(239,41,106,0.9))" }}
              />
            );
          })}
        </g>
      </svg>

      {/* shopper hub */}
      {hubIn > 0 ? (
        <Hub t={t} start={T.hub} scale={hubS} p={hubIn} />
      ) : null}

      {/* the three named locations */}
      <Badge
        {...lockerPos}
        y={lockerPos.y + docked(0, lockerToDock, lockerToMap)}
        circle={circleSize(lockerToMap)}
        circleP={prog(t, T.pickup - 0.05, T.pickup + 0.5)}
        glyph={glyphSize(lockerToDock, lockerToMap)}
        scale={lockerScale}
        glow={lockerGlow}
        wipe={lockerE.wipe}
      >
        <LockerIcon id="g-locker" a={prog(t, T.lockerDoor, T.lockerDoor + 0.45)} />
      </Badge>
      <Badge
        {...pickupPos}
        y={pickupPos.y + docked(1, pickupToDock, pickupToMap)}
        circle={circleSize(pickupToMap)}
        circleP={prog(t, T.supermarket - 0.05, T.supermarket + 0.5)}
        glyph={glyphSize(pickupToDock, pickupToMap)}
        scale={pickupScale}
        glow={pickupGlow}
        wipe={pickupE.wipe}
      >
        <PickupPointIcon id="g-pickup" a={0} pin={sp(T.pickupPin)} />
      </Badge>
      <Badge
        {...superPos}
        circle={lerp(HERO.glyph, MAP_C, superToMap)}
        circleP={prog(t, T.other + 0.25, T.other + 0.8)}
        glyph={lerp(HERO.glyph, MAP_G, superToMap)}
        scale={superScale}
        glow={superGlow}
        wipe={superE.wipe}
      >
        <SupermarketIcon id="g-super" a={0} drop={sp(T.supermarketParcel)} />
      </Badge>

      {/* other collection locations */}
      {OTHERS.map((p, i) => {
        const E = T.others[i];
        return (
          <Badge
            key={i}
            {...p}
            circle={MAP_C}
            circleP={prog(t, E - 0.1, E + 0.4)}
            glyph={MAP_G}
            scale={lerp(0.45, 1, sp(E - 0.1))}
            glow={0.6 + 0.6 * bump(t, E + 0.2, 0.35) + 0.6 * pulseAt(p) + breathe(3 + i)}
            wipe={prog(t, E - 0.1, E + 0.25)}
          >
            <PinIcon id={`g-pin-${i}`} />
          </Badge>
        );
      })}

      {headlines.map((h) => (
        <Headline
          key={h.lines.join()}
          lines={h.lines}
          accentLast={h.accentLast}
          y={h.y}
          enter={prog(t, h.in, h.in + 0.5)}
          exit={prog(t, h.out, h.out + 0.32, MORPH)}
        />
      ))}
    </AbsoluteFill>
  );
};

// 180° shutter, 6 sub-frames: fast flights stay smooth, holds stay crisp.
export const CollectionVideo: React.FC = () => (
  <CameraMotionBlur shutterAngle={180} samples={6}>
    <Scene />
  </CameraMotionBlur>
);

const MapStreets: React.FC<{ p: number; left: number; top: number }> = ({ p, left, top }) => {
  const r = gradientReveal(p, 160, 34);
  const road = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg
      width={CARD1.w}
      height={CARD1.h}
      viewBox={`0 0 ${CARD1.w} ${CARD1.h}`}
      style={{
        position: "absolute",
        left,
        top,
        maskImage: p < 0.999 ? r.mask : undefined,
        WebkitMaskImage: p < 0.999 ? r.mask : undefined,
      }}
    >
      {/* park + water blocks */}
      <rect x={560} y={560} width={240} height={150} rx={28} fill="rgba(255,255,255,0.035)" />
      <rect x={70} y={90} width={200} height={130} rx={28} fill="rgba(255,255,255,0.035)" />
      <path d="M-20 820 C 200 760, 360 900, 560 860 S 820 760, 900 800" stroke="rgba(120,90,230,0.20)" strokeWidth={46} {...road} />
      {/* main roads */}
      <g stroke="rgba(255,255,255,0.09)" strokeWidth={22} {...road}>
        <path d="M-20 300 C 220 280, 420 380, 880 330" />
        <path d="M300 -20 C 330 300, 380 600, 520 980" />
        <path d="M-20 640 C 260 600, 520 520, 880 560" />
      </g>
      {/* side streets */}
      <g stroke="rgba(255,255,255,0.06)" strokeWidth={8} {...road}>
        <path d="M640 -20 C 620 200, 690 420, 660 980" />
        <path d="M-20 470 H 880" />
        <path d="M120 300 V 980" />
        <path d="M-20 930 C 300 900, 600 960, 880 920" />
      </g>
    </svg>
  );
};

const Hub: React.FC<{ t: number; start: number; scale: number; p: number }> = ({ t, start, scale, p }) => (
  <div style={{ position: "absolute", left: HUB.x, top: HUB.y, opacity: p }}>
    {[0, 0.9].map((off) => {
      const ph = ((t - start - off) % 1.8) / 1.8;
      if (t - start - off < 0) return null;
      return (
        <div
          key={off}
          style={{
            position: "absolute",
            left: -110,
            top: -110,
            width: 220,
            height: 220,
            borderRadius: "50%",
            border: `2.5px solid ${PINK}`,
            transform: `scale(${lerp(0.18, 1, LAND(ph))})`,
            opacity: (1 - ph) * 0.6,
          }}
        />
      );
    })}
    <div
      style={{
        position: "absolute",
        left: -26,
        top: -26,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #FF9CBC, #EF296A 60%, #C4144F)",
        border: "5px solid rgba(255,255,255,0.95)",
        boxShadow: "0 0 40px rgba(239,41,106,0.9), 0 0 12px rgba(255,150,190,0.9)",
        transform: `scale(${scale})`,
      }}
    />
  </div>
);
