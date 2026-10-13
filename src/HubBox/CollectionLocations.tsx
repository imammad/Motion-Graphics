import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Hero } from "./Hero";
import { Layer, Locker, PickupPoint, SLOTS, Supermarket } from "./Locations";
import { HUB_HEAD, MapGround, Pins } from "./MapLayer";
import {
  clamp,
  expoInOut,
  keyed,
  lerp,
  prog,
  smoother,
  spring,
} from "./motion";
import { ParcelSvg } from "./Parcel";
import { HEIGHT, MIDNIGHT_BLACK, WIDTH } from "./theme";
import { LOCATIONS, STEP, T } from "./timeline";

// "A locker, pickup point, supermarket or other collection location"
//
// Through-line: the pink parcel (its outline is the HubBox hexagon). It lands in a
// locker, on a pickup counter and in a supermarket while the camera glides between
// them, then the camera pulls out to reveal they are blocks on a map, the parcel drops
// into a pin, and the other collection points ripple in around it.

const FOCAL = { x: WIDTH / 2, y: 1160 };
const S_START = 1.24;
const S_PUSH_END = 1.36;
const S_MAP = 0.36;
const S_END = 0.385;
const CY_END = 300;

const camera = (t: number) => {
  const zoomEnd = T.zoomOut + T.zoomDur;
  const cx = keyed(
    t,
    [
      [T.pan1, 0],
      [T.pan1 + T.panDur, STEP],
      [T.pan2, STEP],
      [T.pan2 + T.panDur, STEP * 2],
      [T.zoomOut, STEP * 2],
      [zoomEnd, STEP],
    ],
    smoother,
  );
  const cy = keyed(
    t,
    [
      [T.zoomOut, 0],
      [zoomEnd, CY_END],
    ],
    smoother,
  );
  let s: number;
  if (t < T.zoomOut) {
    // Slow continuous push-in across the three locations.
    s = lerp(S_START, S_PUSH_END, t / T.zoomOut);
  } else if (t < zoomEnd) {
    const p = smoother(prog(t, T.zoomOut, T.zoomDur));
    s = Math.exp(lerp(Math.log(S_PUSH_END), Math.log(S_MAP), p));
  } else {
    s = lerp(S_MAP, S_END, prog(t, zoomEnd, T.end - zoomEnd));
  }
  return { cx, cy, s };
};

const world = (
  loc: { x: number; y: number },
  slot: { x: number; y: number },
) => ({
  x: loc.x + slot.x,
  y: loc.y + slot.y,
});

const START = { x: 780, y: -620 };
const LOCKER = world(LOCATIONS.locker, SLOTS.locker);
const PICKUP = world(LOCATIONS.pickup, SLOTS.pickup);
const MARKET = world(LOCATIONS.market, SLOTS.market);
const HUB_SCALE = 1.5;

type ParcelState = { x: number; y: number; s: number };

const flight = (
  t: number,
  from: { x: number; y: number },
  to: { x: number; y: number },
  start: number,
  dur: number,
  lift: number,
  s0: number,
  s1: number,
): ParcelState => {
  const p = smoother(prog(t, start, dur));
  const arc = Math.sin(Math.PI * p);
  return {
    x: lerp(from.x, to.x, p),
    y: lerp(from.y, to.y, p) - lift * arc,
    s: lerp(s0, s1, p) + 0.12 * arc,
  };
};

const parcelAt = (t: number): ParcelState => {
  if (t < T.pan1 - 0.1) {
    // Delivered into the locker: sweeps in from the upper right, settling on a spring.
    const px = spring(t, T.parcelIntoLocker, 0.66, 0.8);
    const py = spring(t, T.parcelIntoLocker + 0.03, 0.58, 0.8);
    return {
      x: lerp(START.x, LOCKER.x, px),
      y: lerp(START.y, LOCKER.y, py),
      s: lerp(1.45, 1, px),
    };
  }
  if (t < T.pan2 - 0.1) {
    return flight(t, LOCKER, PICKUP, T.pan1 - 0.05, T.panDur + 0.12, 230, 1, 1);
  }
  if (t < T.zoomOut) {
    return flight(
      t,
      PICKUP,
      MARKET,
      T.pan2 - 0.05,
      T.panDur + 0.12,
      230,
      1,
      0.94,
    );
  }
  return flight(
    t,
    MARKET,
    HUB_HEAD,
    T.zoomOut + 0.04,
    T.zoomDur + 0.02,
    520,
    0.94,
    HUB_SCALE,
  );
};

const LocationsLayer: React.FC<{ t: number; layer: Layer }> = ({
  t,
  layer,
}) => (
  <>
    {(
      [
        [LOCATIONS.locker, Locker],
        [LOCATIONS.pickup, PickupPoint],
        [LOCATIONS.market, Supermarket],
      ] as const
    ).map(([loc, Comp], i) => (
      <svg
        key={i}
        width={720}
        height={720}
        viewBox="-360 -360 720 720"
        style={{
          position: "absolute",
          left: loc.x - 360,
          top: loc.y - 360,
          overflow: "visible",
        }}
      >
        <Comp t={t} layer={layer} />
      </svg>
    ))}
  </>
);

export const CollectionLocations: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cam = camera(t);
  const parcel = parcelAt(t);
  // Lean into the direction of travel.
  const dt = 1 / 240;
  const vx = (parcelAt(t + dt).x - parcelAt(t - dt).x) / (2 * dt);
  const lean = clamp(vx * 0.0019, -13, 13);

  // The heading's backdrop fade deepens once the map is revealed behind it.
  const mapReveal = expoInOut(prog(t, T.zoomOut + 0.2, T.zoomDur));
  const fadeSolid = lerp(300, 450, mapReveal);
  const fadeEnd = lerp(700, 860, mapReveal);

  return (
    <AbsoluteFill
      style={{ backgroundColor: MIDNIGHT_BLACK, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transformOrigin: "0 0",
          transform: `translate(${FOCAL.x - cam.cx * cam.s}px, ${FOCAL.y - cam.cy * cam.s}px) scale(${cam.s})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -4400,
            top: -4400,
            width: 4400 * 2 + STEP * 2,
            height: 8800,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.07) 2.2px, transparent 2.8px)",
            backgroundSize: "44px 44px",
            backgroundPosition: "22px 22px",
          }}
        />
        <MapGround />
        <LocationsLayer t={t} layer="back" />
        <Pins t={t} />
        <div
          style={{
            position: "absolute",
            left: parcel.x,
            top: parcel.y,
            transform: `scale(${parcel.s}) rotate(${lean}deg)`,
          }}
        >
          <ParcelSvg id="parcel" />
        </div>
        <LocationsLayer t={t} layer="front" />
      </div>

      {/* Brand ambient gradient rising from the bottom edge, and a fade behind the heading. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 95% 26% at 50% 104%, rgba(239,41,106,0.20) 0%, rgba(239,41,106,0.06) 55%, transparent 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${MIDNIGHT_BLACK} 0px, ${MIDNIGHT_BLACK} ${fadeSolid}px, rgba(15,11,25,0) ${fadeEnd}px)`,
        }}
      />
      <Hero t={t} top={HEIGHT * 0.2} />
    </AbsoluteFill>
  );
};
