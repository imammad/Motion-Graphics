import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { Doc, DOC_RATIO } from "./Doc";
import { CORAL, EASE, EASE_OUT, FOLD, LAVENDER, VIOLET } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const CY = 900;
const DOC_W = 320;

// --- Stack of documents flying in (local 0-60) -----------------------------

type Flyer = {
  // Resting top-left offset from the stack centre, in doc widths.
  rest: [number, number];
  from: [number, number];
  rot: number;
  start: number;
  end: number;
};

const FLYERS: Flyer[] = [
  { rest: [-0.83, -0.77], from: [-900, -1300], rot: -38, start: 3, end: 11 },
  { rest: [-0.17, -0.71], from: [-700, -1150], rot: -28, start: 5, end: 12 },
  { rest: [-0.48, -0.57], from: [-1050, -150], rot: -32, start: 9, end: 17 },
];

const Stack: React.FC<{ frame: number }> = ({ frame }) => {
  const settle = interpolate(frame, [17, 56], [1, 0.95], clamp);
  const merge = interpolate(frame, [55, 60], [0, 1], {
    ...clamp,
    easing: EASE,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: CX,
        top: CY,
        transform: `scale(${settle})`,
      }}
    >
      {FLYERS.map((f, i) => {
        const t = interpolate(frame, [f.start, f.end], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        const restX = f.rest[0] * DOC_W;
        const restY = f.rest[1] * DOC_W;
        // Collapse onto the front document before it tears.
        const target = FLYERS[2];
        const x =
          (f.from[0] + (restX - f.from[0]) * t) * (1 - merge) +
          target.rest[0] * DOC_W * merge;
        const y =
          (f.from[1] + (restY - f.from[1]) * t) * (1 - merge) +
          target.rest[1] * DOC_W * merge;
        const flip = Math.cos((1 - t) * Math.PI * 0.45);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: frame < f.start ? 0 : 1,
              transform: `rotate(${f.rot * (1 - t)}deg) scaleX(${flip})`,
              transformOrigin: "50% 50%",
            }}
          >
            <Doc width={DOC_W} />
          </div>
        );
      })}
    </div>
  );
};

// --- Torn document + circuit network (local 60-130) -----------------------

// Tear line across the page, in a 100-wide page space.
const TEAR = "40,0 55,19 36,68 57,100";

const TornDoc: React.FC<{ split: number; gradient: number; width: number }> = ({
  split,
  gradient,
  width,
}) => {
  const w = 100;
  const h = w * DOC_RATIO;
  const fold = 22.5;
  const tear = TEAR.split(" ").map((p) => {
    const [x, y] = p.split(",").map(Number);
    return [x, (y / 100) * h];
  });
  const tearPath = tear.map(([x, y]) => `${x},${y}`).join(" ");
  const left = `0,0 ${tearPath} 0,${h}`;
  const right = `${tearPath} ${w},${h} ${w},${fold} ${w - fold},0`;
  const gap = split * 3.2;

  if (split <= 0) {
    return <Doc width={width} gradient={gradient} />;
  }
  return (
    <svg
      width={width}
      height={width * DOC_RATIO}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        display: "block",
        overflow: "visible",
        filter: "drop-shadow(0 0 18px rgba(200,190,255,0.28))",
      }}
    >
      <polygon
        points={left}
        fill={LAVENDER}
        transform={`translate(${-gap} ${gap * 0.15}) rotate(${-1.8 * split} 0 ${h})`}
      />
      <g
        transform={`translate(${gap} ${-gap * 0.1}) rotate(${1.5 * split} ${w} ${h})`}
      >
        <polygon points={right} fill={LAVENDER} />
        <path d={`M${w - fold} 0 L${w} ${fold} H${w - fold} Z`} fill={FOLD} />
      </g>
    </svg>
  );
};

type Pt = [number, number];
type Wire = { pts: Pt[]; nodes: number[]; delay: number; fromEdge?: boolean };

// Portrait version of the original's network: same language (right-angle
// runs with rounded corners, coral near the page fading to violet), re-routed
// to fill a 9:16 frame.
const WIRES: Wire[] = [
  {
    pts: [
      [380, 860],
      [150, 860],
      [150, 600],
      [-20, 600],
    ],
    nodes: [0.42, 0.86],
    delay: 0,
  },
  {
    pts: [
      [300, 860],
      [300, 360],
      [470, 360],
      [470, -20],
    ],
    nodes: [0.28, 0.83],
    delay: 3,
  },
  {
    pts: [
      [700, 860],
      [960, 860],
      [960, 470],
      [1100, 470],
    ],
    nodes: [0.25, 0.7],
    delay: 0,
  },
  {
    pts: [
      [880, 860],
      [880, 250],
      [760, 250],
      [760, -20],
    ],
    nodes: [0.5, 0.92],
    delay: 4,
  },
  {
    pts: [
      [960, 860],
      [1100, 860],
    ],
    nodes: [0.55],
    delay: 6,
  },
  {
    pts: [
      [600, 1120],
      [600, 1290],
      [340, 1290],
      [340, 1560],
      [130, 1560],
      [130, 1940],
    ],
    nodes: [0.08, 0.38, 0.8],
    delay: 2,
  },
  {
    pts: [
      [820, 860],
      [820, 1400],
      [990, 1400],
      [990, 1940],
    ],
    nodes: [0.5, 0.82],
    delay: 3,
  },
  {
    pts: [
      [-20, 1130],
      [210, 1130],
      [210, 1380],
      [80, 1380],
    ],
    nodes: [0.2, 0.62],
    delay: 6,
    fromEdge: true,
  },
  {
    pts: [
      [-20, 1770],
      [300, 1770],
    ],
    nodes: [0.45],
    delay: 7,
    fromEdge: true,
  },
  {
    pts: [
      [1100, 1090],
      [990, 1090],
      [990, 1260],
    ],
    nodes: [0.62],
    delay: 8,
    fromEdge: true,
  },
];

const segLengths = (pts: Pt[]) =>
  pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));

const pointAt = (pts: Pt[], u: number): Pt => {
  const lens = segLengths(pts);
  const total = lens.reduce((a, b) => a + b, 0);
  let d = u * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const t = d / lens[i];
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t,
      ];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
};

const roundedPath = (pts: Pt[], r = 46) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py);
    const l2 = Math.hypot(nx - cx, ny - cy);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = cx - ((cx - px) / l1) * rr;
    const ay = cy - ((cy - py) / l1) * rr;
    const bx = cx + ((nx - cx) / l2) * rr;
    const by = cy + ((ny - cy) / l2) * rr;
    d += ` L${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last[0]} ${last[1]}`;
};

const Circuit: React.FC<{ frame: number }> = ({ frame }) => (
  <svg
    width={1080}
    height={1920}
    style={{ position: "absolute", left: 0, top: 0 }}
  >
    <defs>
      {WIRES.map((w, i) => {
        const a = w.fromEdge ? w.pts[w.pts.length - 1] : w.pts[0];
        const b = w.fromEdge ? w.pts[0] : w.pts[w.pts.length - 1];
        return (
          <linearGradient
            key={i}
            id={`wire${i}`}
            gradientUnits="userSpaceOnUse"
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
          >
            <stop offset="0" stopColor={CORAL} />
            <stop offset="1" stopColor={VIOLET} />
          </linearGradient>
        );
      })}
    </defs>
    {WIRES.map((w, i) => {
      const grow = interpolate(frame, [62 + w.delay, 80 + w.delay], [0, 1], {
        ...clamp,
        easing: EASE,
      });
      const shrink = interpolate(
        frame,
        [108 + w.delay / 2, 124 + w.delay / 2],
        [1, 0],
        { ...clamp, easing: EASE },
      );
      const p = Math.min(grow, shrink);
      if (p <= 0) return null;
      const drift = interpolate(frame, [80, 108], [0, 0.04], clamp);
      return (
        <g key={i}>
          <path
            d={roundedPath(w.pts)}
            fill="none"
            stroke={`url(#wire${i})`}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${p} 1`}
            style={{ filter: "drop-shadow(0 0 6px rgba(240,80,140,0.45))" }}
          />
          {w.nodes.map((u, j) => {
            const uu = Math.min(1, u + drift * (j % 2 === 0 ? 1 : -1));
            const on = interpolate(p, [u - 0.06, u + 0.02], [0, 1], clamp);
            if (on <= 0) return null;
            const [x, y] = pointAt(w.pts, uu);
            return (
              <circle
                key={j}
                cx={x}
                cy={y}
                r={40 * on}
                fill={LAVENDER}
                style={{
                  filter: "drop-shadow(0 0 14px rgba(210,200,255,0.45))",
                }}
              />
            );
          })}
        </g>
      );
    })}
  </svg>
);

// Docs fly into a stack, tear, sprout a network, heal and turn into the
// gradient page (original 10.44s-16.6s).
export const DocsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const split = Math.min(
    interpolate(frame, [59, 64], [0, 1], { ...clamp, easing: EASE_OUT }),
    interpolate(frame, [126, 130], [1, 0], { ...clamp, easing: EASE }),
  );
  const gradient = interpolate(frame, [130, 137], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const sheen = interpolate(frame, [138, 148], [-0.6, 1.6], {
    ...clamp,
    easing: EASE,
  });
  const singleW = 340;

  return (
    <AbsoluteFill>
      <Background />
      {frame < 60 ? <Stack frame={frame} /> : null}
      {frame >= 60 ? (
        <>
          <Circuit frame={frame} />
          <div
            style={{
              position: "absolute",
              left: CX - singleW / 2,
              top: CY - (singleW * DOC_RATIO) / 2 + 20,
              overflow: "visible",
            }}
          >
            <TornDoc split={split} gradient={gradient} width={singleW} />
            {gradient > 0 ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `polygon(0 0, 77.5% 0, 100% ${(22.5 / (100 * DOC_RATIO)) * 100}%, 100% 100%, 0 100%)`,
                  background: `linear-gradient(115deg, transparent ${sheen * 100 - 18}%, rgba(255,255,255,0.35) ${sheen * 100}%, transparent ${sheen * 100 + 18}%)`,
                  mixBlendMode: "screen",
                }}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
