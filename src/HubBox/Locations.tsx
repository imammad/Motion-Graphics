import { CheckBadge, IconTile, PinGlyph, TrolleyGlyph } from "./Icons";
import { expoInOut, expoOut, lerp, prog, smoother, spring } from "./motion";
import {
  LIGHT_PINK,
  LINE,
  MIDNIGHT_BLACK,
  MIDNIGHT_VIOLET,
  PINK,
  SURFACE,
  SURFACE_HI,
} from "./theme";
import { T } from "./timeline";

// Each location is drawn in a 720x720 local box centred on (0, 0), split into a back
// layer (under the parcel) and a front layer (over it).
export type Layer = "back" | "front";

// Where the parcel's centre rests in each location (local coordinates).
export const SLOTS = {
  locker: { x: 0, y: -20 },
  pickup: { x: -84, y: 92 },
  market: { x: 0, y: 112 },
};

// Tick badge sits up and to the right of the parcel.
const badgeAt = (slot: { x: number; y: number }) => ({
  x: slot.x + 64,
  y: slot.y - 74,
});

const GLASS = "rgba(255, 255, 255, 0.04)";
const GLASS_EDGE = "rgba(255, 255, 255, 0.16)";
const HANDLE = "rgba(255, 255, 255, 0.28)";

// ---------------------------------------------------------------- 01 Locker

const L = {
  left: -214,
  right: 214,
  top: -276,
  bottom: 256,
  pad: 22,
  gap: 12,
  head: 44,
};
const colW = (L.right - L.left - L.pad * 2 - L.gap * 2) / 3;
const innerTop = L.top + L.head + 10;
const innerH = L.bottom - L.pad - innerTop;
const colX = (i: number) => L.left + L.pad + i * (colW + L.gap);

// Door stacks per column (heights fill innerH with gaps).
const stack = (heights: number[]) => {
  const total =
    heights.reduce((a, b) => a + b, 0) + L.gap * (heights.length - 1);
  const k = innerH / total;
  let y = innerTop;
  return heights.map((h) => {
    const hh = h * k;
    const r = { y, h: hh };
    y += hh + L.gap * k;
    return r;
  });
};
const LEFT_DOORS = stack([100, 100, 100, 100]);
const RIGHT_DOORS = stack([150, 120, 140]);
const MID = stack([92, 156, 160]); // [screen, target compartment, door]

const Door: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  reveal: number;
}> = ({ x, y, w, h, reveal }) => (
  // Doors unfold downward from their top edge.
  <g
    transform={`translate(0 ${y}) scale(1 ${Math.max(0, reveal)}) translate(0 ${-y})`}
  >
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={10}
      fill={SURFACE}
      stroke={LINE}
      strokeWidth={2}
    />
    <rect
      x={x + w - 18}
      y={y + h / 2 - 13}
      width={5}
      height={26}
      rx={2.5}
      fill={HANDLE}
    />
    <circle cx={x + 14} cy={y + 14} r={3.5} fill="rgba(255,255,255,0.16)" />
  </g>
);

export const Locker: React.FC<{ t: number; layer: Layer }> = ({ t, layer }) => {
  const body = expoOut(prog(t, T.lockerIn, 0.55));
  const doorReveal = (i: number) =>
    expoOut(prog(t, T.lockerIn + 0.12 + i * 0.035, 0.42));
  const target = MID[1];
  const tx = colX(1);

  // Target door: swings open (scaleX through 0 to show its back), then closes once
  // the parcel has left for the next location.
  const open =
    smoother(prog(t, 0.34, 0.34)) - smoother(prog(t, T.pan1 + 0.16, 0.4));
  const sx = lerp(1, -0.3, open);
  const loaded = expoInOut(prog(t, 0.72, 0.4));

  if (layer === "front") {
    return (
      <g>
        <g transform={`translate(${tx} 0) scale(${sx} 1) translate(${-tx} 0)`}>
          <g
            transform={`translate(0 ${target.y}) scale(1 ${Math.max(0, doorReveal(5))}) translate(0 ${-target.y})`}
          >
            <rect
              x={tx}
              y={target.y}
              width={colW}
              height={target.h}
              rx={10}
              fill={sx < 0 ? SURFACE_HI : SURFACE}
              stroke={LINE}
              strokeWidth={2}
            />
            {sx > 0 ? (
              <rect
                x={tx + colW - 18}
                y={target.y + target.h / 2 - 13}
                width={5}
                height={26}
                rx={2.5}
                fill={HANDLE}
              />
            ) : null}
          </g>
        </g>
        <CheckBadge
          {...badgeAt(SLOTS.locker)}
          grow={spring(t, T.lockerCheck, 0.5)}
        />
      </g>
    );
  }

  // Unit rises from its base.
  return (
    <g
      transform={`translate(0 ${L.bottom}) scale(1 ${body}) translate(0 ${-L.bottom})`}
    >
      <ellipse
        cx={0}
        cy={L.bottom + 8}
        rx={250}
        ry={14}
        fill="rgba(0,0,0,0.35)"
      />
      <rect
        x={L.left + 26}
        y={L.bottom - 6}
        width={34}
        height={20}
        rx={5}
        fill={SURFACE}
      />
      <rect
        x={L.right - 60}
        y={L.bottom - 6}
        width={34}
        height={20}
        rx={5}
        fill={SURFACE}
      />
      <rect
        x={L.left}
        y={L.top}
        width={L.right - L.left}
        height={L.bottom - L.top}
        rx={26}
        fill={MIDNIGHT_VIOLET}
        stroke={LINE}
        strokeWidth={2.5}
      />
      <rect
        x={L.left + 12}
        y={L.top + 12}
        width={L.right - L.left - 24}
        height={L.head - 12}
        rx={12}
        fill={SURFACE}
      />

      {LEFT_DOORS.map((d, i) => (
        <Door
          key={`l${i}`}
          x={colX(0)}
          y={d.y}
          w={colW}
          h={d.h}
          reveal={doorReveal(i)}
        />
      ))}
      {RIGHT_DOORS.map((d, i) => (
        <Door
          key={`r${i}`}
          x={colX(2)}
          y={d.y}
          w={colW}
          h={d.h}
          reveal={doorReveal(i + 1)}
        />
      ))}

      {/* Screen: its progress bar fills as the parcel is stored. */}
      <g
        transform={`translate(0 ${MID[0].y}) scale(1 ${Math.max(0, doorReveal(2))}) translate(0 ${-MID[0].y})`}
      >
        <rect
          x={tx}
          y={MID[0].y}
          width={colW}
          height={MID[0].h}
          rx={10}
          fill={MIDNIGHT_BLACK}
          stroke={LINE}
          strokeWidth={2}
        />
        <rect
          x={tx + 16}
          y={MID[0].y + 22}
          width={colW * 0.42}
          height={8}
          rx={4}
          fill="rgba(255,255,255,0.22)"
        />
        <rect
          x={tx + 16}
          y={MID[0].y + 40}
          width={colW * 0.62}
          height={8}
          rx={4}
          fill="rgba(255,255,255,0.1)"
        />
        <rect
          x={tx + 16}
          y={MID[0].y + MID[0].h - 24}
          width={colW - 32}
          height={8}
          rx={4}
          fill="rgba(255,255,255,0.08)"
        />
        <rect
          x={tx + 16}
          y={MID[0].y + MID[0].h - 24}
          width={(colW - 32) * loaded}
          height={8}
          rx={4}
          fill={PINK}
        />
      </g>

      {/* Open compartment behind the target door. */}
      <rect
        x={tx}
        y={target.y}
        width={colW}
        height={target.h}
        rx={10}
        fill={MIDNIGHT_BLACK}
        stroke={LINE}
        strokeWidth={2}
      />
      <rect
        x={tx + 8}
        y={target.y + target.h - 14}
        width={colW - 16}
        height={6}
        rx={3}
        fill="rgba(255,255,255,0.06)"
      />

      <Door x={tx} y={MID[2].y} w={colW} h={MID[2].h} reveal={doorReveal(6)} />
    </g>
  );
};

// ---------------------------------------------------------------- 02 Pickup point

const P = { left: -244, right: 244, top: -150, bottom: 256 };
const AWNING = { left: -262, right: 262, top: -150, depth: 86, stripes: 8 };

const Awning: React.FC<{ unroll: number }> = ({ unroll }) => {
  const w = (AWNING.right - AWNING.left) / AWNING.stripes;
  const r = w / 2;
  const bottom = AWNING.top + AWNING.depth;
  return (
    <g>
      <g
        transform={`translate(0 ${AWNING.top}) scale(1 ${Math.max(0.0001, unroll)}) translate(0 ${-AWNING.top})`}
      >
        {new Array(AWNING.stripes).fill(0).map((_, i) => {
          const x = AWNING.left + i * w;
          return (
            <path
              key={i}
              d={`M ${x} ${AWNING.top} L ${x + w} ${AWNING.top} L ${x + w} ${bottom} A ${r} ${r} 0 0 1 ${x} ${bottom} Z`}
              fill={i % 2 === 0 ? PINK : LIGHT_PINK}
            />
          );
        })}
      </g>
      {/* The rolled-up awning bar. */}
      <rect
        x={AWNING.left - 6}
        y={AWNING.top - 12}
        width={AWNING.right - AWNING.left + 12}
        height={18}
        rx={9}
        fill={SURFACE_HI}
      />
    </g>
  );
};

export const PickupPoint: React.FC<{ t: number; layer: Layer }> = ({
  t,
  layer,
}) => {
  const arrive = T.pan1;
  if (layer === "front") {
    return (
      <CheckBadge
        {...badgeAt(SLOTS.pickup)}
        grow={spring(t, T.pickupCheck, 0.5)}
      />
    );
  }
  const unroll = spring(t, arrive + 0.28, 0.55, 0.82);
  const sign = spring(t, arrive + 0.36, 0.55);
  const shelf = (i: number) => expoOut(prog(t, arrive + 0.3 + i * 0.05, 0.4));
  const counterY = SLOTS.pickup.y + 58;

  return (
    <g>
      <ellipse
        cx={0}
        cy={P.bottom + 8}
        rx={290}
        ry={14}
        fill="rgba(0,0,0,0.35)"
      />
      <rect
        x={P.left}
        y={P.top}
        width={P.right - P.left}
        height={P.bottom - P.top}
        rx={18}
        fill={MIDNIGHT_VIOLET}
        stroke={LINE}
        strokeWidth={2.5}
      />
      <rect
        x={P.left - 18}
        y={P.top - 52}
        width={P.right - P.left + 36}
        height={44}
        rx={14}
        fill={SURFACE}
        stroke={LINE}
        strokeWidth={2}
      />

      {/* Shop window with a counter and a shelf of parcels waiting for collection. */}
      <rect
        x={-214}
        y={-30}
        width={262}
        height={240}
        rx={12}
        fill={GLASS}
        stroke={GLASS_EDGE}
        strokeWidth={2}
      />
      <rect x={-200} y={30} width={234} height={6} rx={3} fill={SURFACE_HI} />
      {[
        [-188, 34, 28],
        [-150, 30, 34],
        [-110, 38, 24],
      ].map(([x, w, h], i) => (
        <g
          key={i}
          transform={`translate(0 30) scale(1 ${shelf(i)}) translate(0 -30)`}
        >
          <rect
            x={x}
            y={30 - h}
            width={w}
            height={h}
            rx={5}
            fill={SURFACE_HI}
            stroke={LINE}
            strokeWidth={1.5}
          />
        </g>
      ))}
      <rect
        x={-214}
        y={counterY}
        width={262}
        height={16}
        rx={6}
        fill={SURFACE_HI}
      />
      <rect
        x={-206}
        y={counterY + 16}
        width={246}
        height={210 - (counterY + 16) + 0}
        rx={4}
        fill={SURFACE}
      />

      {/* Door */}
      <rect
        x={86}
        y={-20}
        width={128}
        height={P.bottom - -20}
        rx={10}
        fill={SURFACE}
        stroke={LINE}
        strokeWidth={2}
      />
      <rect
        x={102}
        y={-4}
        width={96}
        height={150}
        rx={8}
        fill={GLASS}
        stroke={GLASS_EDGE}
        strokeWidth={1.5}
      />
      <rect x={104} y={170} width={6} height={36} rx={3} fill={HANDLE} />

      <rect
        x={P.left - 16}
        y={P.bottom - 4}
        width={P.right - P.left + 32}
        height={14}
        rx={6}
        fill={SURFACE}
      />

      <Awning unroll={unroll} />
      <IconTile x={0} y={-262} size={104} grow={sign}>
        <PinGlyph id="pickup-pin" />
      </IconTile>
    </g>
  );
};

// ---------------------------------------------------------------- 03 Supermarket

const M = { left: -304, right: 304, top: -150, bottom: 256 };
const ENTRANCE = { left: -104, right: 104, top: -96 };

const SHELF_ROWS = [-40, 50, 140];
const PRODUCTS = [
  [6, 26, 34],
  [36, 22, 26],
  [62, 30, 40],
  [96, 20, 22],
  [120, 30, 32],
];
const productFill = (i: number, row: number) => {
  const k = (i * 7 + row * 3) % 5;
  return [
    "#3A3366",
    SURFACE_HI,
    "rgba(255,235,241,0.28)",
    "#332D5E",
    "rgba(255,255,255,0.14)",
  ][k];
};

const Shelves: React.FC<{ x: number; t: number; start: number }> = ({
  x,
  t,
  start,
}) => (
  <g>
    {SHELF_ROWS.map((y, row) => (
      <g key={row}>
        <rect x={x + 6} y={y} width={146} height={6} rx={3} fill={SURFACE_HI} />
        {PRODUCTS.map(([px, w, h], i) => {
          const g = expoOut(prog(t, start + row * 0.05 + i * 0.03, 0.4));
          return (
            <g
              key={i}
              transform={`translate(0 ${y}) scale(1 ${g}) translate(0 ${-y})`}
            >
              <rect
                x={x + 6 + px}
                y={y - h}
                width={w}
                height={h}
                rx={4}
                fill={productFill(i, row)}
              />
            </g>
          );
        })}
      </g>
    ))}
  </g>
);

export const Supermarket: React.FC<{ t: number; layer: Layer }> = ({
  t,
  layer,
}) => {
  const arrive = T.pan2;
  const doors = smoother(prog(t, T.marketDoorsOpen, 0.36));
  const slide = doors * 94;

  if (layer === "front") {
    const doorW = (ENTRANCE.right - ENTRANCE.left) / 2;
    const h = M.bottom - ENTRANCE.top - 4;
    return (
      <g>
        <clipPath id="market-doors">
          <rect
            x={ENTRANCE.left - 100}
            y={ENTRANCE.top}
            width={ENTRANCE.right - ENTRANCE.left + 200}
            height={h + 4}
          />
        </clipPath>
        <g clipPath="url(#market-doors)">
          <rect
            x={ENTRANCE.left - slide}
            y={ENTRANCE.top + 2}
            width={doorW}
            height={h}
            rx={6}
            fill="rgba(255,255,255,0.07)"
            stroke={GLASS_EDGE}
            strokeWidth={2}
          />
          <rect
            x={ENTRANCE.left + doorW + slide}
            y={ENTRANCE.top + 2}
            width={doorW}
            height={h}
            rx={6}
            fill="rgba(255,255,255,0.07)"
            stroke={GLASS_EDGE}
            strokeWidth={2}
          />
          <rect
            x={-8 - slide}
            y={60}
            width={5}
            height={50}
            rx={2.5}
            fill={HANDLE}
          />
          <rect
            x={3 + slide}
            y={60}
            width={5}
            height={50}
            rx={2.5}
            fill={HANDLE}
          />
        </g>
        <CheckBadge
          {...badgeAt(SLOTS.market)}
          grow={spring(t, T.marketCheck, 0.5)}
        />
      </g>
    );
  }

  const sign = spring(t, arrive + 0.34, 0.55);
  const deskY = SLOTS.market.y + 58;
  return (
    <g>
      <ellipse
        cx={0}
        cy={M.bottom + 8}
        rx={350}
        ry={14}
        fill="rgba(0,0,0,0.35)"
      />
      <rect
        x={M.left}
        y={M.top}
        width={M.right - M.left}
        height={M.bottom - M.top}
        rx={18}
        fill={MIDNIGHT_VIOLET}
        stroke={LINE}
        strokeWidth={2.5}
      />
      <rect
        x={M.left - 18}
        y={M.top - 56}
        width={M.right - M.left + 36}
        height={60}
        rx={16}
        fill={SURFACE}
        stroke={LINE}
        strokeWidth={2}
      />
      <rect
        x={M.left - 6}
        y={M.top + 4}
        width={M.right - M.left + 12}
        height={10}
        rx={5}
        fill={PINK}
        opacity={0.9}
      />

      {/* Windows with stocked shelves */}
      {[-282, 124].map((x, i) => (
        <g key={x}>
          <rect
            x={x}
            y={-100}
            width={158}
            height={300}
            rx={12}
            fill={GLASS}
            stroke={GLASS_EDGE}
            strokeWidth={2}
          />
          <Shelves x={x} t={t} start={arrive + 0.26 + i * 0.08} />
        </g>
      ))}

      {/* Entrance: dark interior with the click & collect desk. */}
      <rect
        x={ENTRANCE.left}
        y={ENTRANCE.top}
        width={ENTRANCE.right - ENTRANCE.left}
        height={M.bottom - ENTRANCE.top}
        rx={8}
        fill={MIDNIGHT_BLACK}
        stroke={LINE}
        strokeWidth={2}
      />
      <rect
        x={-78}
        y={deskY}
        width={156}
        height={14}
        rx={6}
        fill={SURFACE_HI}
      />
      <rect
        x={-70}
        y={deskY + 14}
        width={140}
        height={M.bottom - deskY - 18}
        rx={4}
        fill={SURFACE}
      />

      <rect
        x={M.left - 16}
        y={M.bottom - 4}
        width={M.right - M.left + 32}
        height={14}
        rx={6}
        fill={SURFACE}
      />

      <IconTile x={0} y={-272} size={104} grow={sign}>
        <TrolleyGlyph id="market-trolley" />
      </IconTile>
    </g>
  );
};
