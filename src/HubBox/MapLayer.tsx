import { PinkGradient } from "./Icons";
import { lerp, prog, spring } from "./motion";
import {
  LINE_SOFT,
  MIDNIGHT_NAVY,
  MIDNIGHT_VIOLET,
  PINK,
  WHITE,
} from "./theme";
import { BLOCK, LOCATIONS, STEP, T } from "./timeline";

// The ground the whole piece sits on: map blocks with roads between them. At full zoom
// a block reads as a card behind each location; the final pull-out reveals the map.

const COLS = [-2, -1, 0, 1, 2, 3, 4];
const ROWS = [-3, -2, -1, 0, 1, 2, 3];

const PAD = 4000;
const VIEW = { x: -PAD, y: -PAD, w: PAD * 2 + STEP * 2, h: PAD * 2 };

export const MapGround: React.FC = () => (
  <svg
    width={VIEW.w}
    height={VIEW.h}
    viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
    style={{ position: "absolute", left: VIEW.x, top: VIEW.y }}
  >
    {/* Road centre lines */}
    <g
      stroke="rgba(255,255,255,0.04)"
      strokeWidth={5}
      strokeDasharray="26 30"
      strokeLinecap="round"
    >
      {COLS.map((c) => (
        <line
          key={`v${c}`}
          x1={c * STEP + STEP / 2}
          y1={-PAD}
          x2={c * STEP + STEP / 2}
          y2={PAD}
        />
      ))}
      {ROWS.map((r) => (
        <line
          key={`h${r}`}
          x1={-PAD}
          y1={r * STEP + STEP / 2}
          x2={PAD + STEP * 2}
          y2={r * STEP + STEP / 2}
        />
      ))}
    </g>
    {COLS.flatMap((c) =>
      ROWS.map((r) => {
        const cx = c * STEP;
        const cy = r * STEP;
        return (
          <rect
            key={`${c},${r}`}
            x={cx - BLOCK / 2}
            y={cy - BLOCK / 2}
            width={BLOCK}
            height={BLOCK}
            rx={56}
            fill={MIDNIGHT_NAVY}
            stroke={LINE_SOFT}
            strokeWidth={2}
          />
        );
      }),
    )}
  </svg>
);

// ---------------------------------------------------------------- pins

const pinPath = (R: number) =>
  `M 0 0 C ${-R * 0.35} ${-R * 0.5} ${-R} ${-R * 1.05} ${-R} ${-R * 1.75} ` +
  `A ${R} ${R} 0 1 1 ${R} ${-R * 1.75} C ${R} ${-R * 1.05} ${R * 0.35} ${-R * 0.5} 0 0 Z`;

export const HUB_R = 150;
export const HUB_TIP = { x: LOCATIONS.hub.x, y: LOCATIONS.hub.y + 190 };
export const HUB_HEAD = { x: HUB_TIP.x, y: HUB_TIP.y - HUB_R * 1.75 };

// Other collection locations, spread over the surrounding blocks.
const OTHER_PINS: [number, number][] = [
  [-150, 1010],
  [210, 1230],
  [2030, 980],
  [2340, 1250],
  [-60, 2080],
  [1290, 2140],
  [880, 2020],
  [2260, 2120],
  [130, -880],
  [2090, -920],
  [-380, 330],
  [2590, 380],
];

const WAVE_SPEED = 2600; // world px per second

const Pin: React.FC<{ x: number; y: number; grow: number }> = ({
  x,
  y,
  grow,
}) => {
  const R = 52;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse
        cx={0}
        cy={4}
        rx={R * 0.7 * Math.min(1, grow)}
        ry={R * 0.18 * Math.min(1, grow)}
        fill="rgba(0,0,0,0.45)"
      />
      <g transform={`scale(${Math.max(0, grow)})`}>
        <path d={pinPath(R)} fill={WHITE} />
        <circle cx={0} cy={-R * 1.75} r={R * 0.42} fill={MIDNIGHT_VIOLET} />
      </g>
    </g>
  );
};

export const Pins: React.FC<{ t: number }> = ({ t }) => {
  const hub = spring(t, T.zoomOut + T.zoomDur - 0.26, 0.6);
  const wave = prog(t, T.pinWave, 1.4);
  const ringR = lerp(HUB_R, 2400, 1 - Math.pow(1 - wave, 2.2));
  return (
    <svg
      width={VIEW.w}
      height={VIEW.h}
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      style={{
        position: "absolute",
        left: VIEW.x,
        top: VIEW.y,
        overflow: "visible",
      }}
    >
      <defs>
        <PinkGradient id="hub-grad" />
      </defs>
      {wave > 0 && wave < 1 ? (
        <circle
          cx={HUB_HEAD.x}
          cy={HUB_HEAD.y}
          r={ringR}
          fill="none"
          stroke={PINK}
          strokeWidth={5}
          opacity={0.45 * (1 - wave)}
        />
      ) : null}
      {OTHER_PINS.map(([x, y], i) => {
        const d = Math.hypot(x - HUB_HEAD.x, y - HUB_HEAD.y);
        return (
          <Pin
            key={i}
            x={x}
            y={y}
            grow={spring(t, T.pinWave + d / WAVE_SPEED, 0.55)}
          />
        );
      })}
      <g transform={`translate(${HUB_TIP.x} ${HUB_TIP.y})`}>
        <ellipse
          cx={0}
          cy={6}
          rx={HUB_R * 0.75 * Math.min(1, hub)}
          ry={HUB_R * 0.2 * Math.min(1, hub)}
          fill="rgba(0,0,0,0.5)"
        />
        <g transform={`scale(${Math.max(0, hub)})`}>
          <path d={pinPath(HUB_R)} fill="url(#hub-grad)" />
          <circle cx={0} cy={-HUB_R * 1.75} r={HUB_R * 0.74} fill={WHITE} />
        </g>
      </g>
    </svg>
  );
};
