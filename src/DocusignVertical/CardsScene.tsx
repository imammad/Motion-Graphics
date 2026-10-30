import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import {
  BRAND_GRADIENT,
  EASE,
  EASE_OUT,
  fontFamily,
  LAVENDER,
  LAVENDER_DARK,
  OFF_WHITE,
  VIOLET,
} from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BACK = { x: 200, y: 470, w: 800, h: 540 };
const FRONT = { x: 70, y: 890, w: 740, h: 540 };

const card = (b: typeof BACK): React.CSSProperties => ({
  position: "absolute",
  left: b.x,
  top: b.y,
  width: b.w,
  height: b.h,
  borderRadius: 24,
  background: LAVENDER,
  boxShadow: "0 0 70px rgba(190,170,255,0.28), 0 30px 60px rgba(10,0,40,0.35)",
  overflow: "hidden",
});

const bar = (
  x: number,
  y: number,
  w: number,
  h: number,
  color = OFF_WHITE,
): React.CSSProperties => ({
  position: "absolute",
  left: x,
  top: y,
  width: w,
  height: h,
  borderRadius: h / 2,
  background: color,
});

const BackCard: React.FC = () => (
  <div style={card(BACK)}>
    <div style={bar(38, 42, 533, 29)} />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 95,
        width: BACK.w,
        height: 2,
        background: "#e6e0ff",
      }}
    />
    {[40, 290, 540].map((x) => (
      <div
        key={x}
        style={{
          position: "absolute",
          left: x,
          top: 140,
          width: 220,
          height: 134,
          borderRadius: 20,
          background: OFF_WHITE,
        }}
      >
        <div style={bar(22, 24, 176, 44, LAVENDER)} />
        <div style={{ ...bar(22, 18, 120, 6, LAVENDER_DARK), opacity: 0.6 }} />
        <div style={bar(100, 98, 98, 12, LAVENDER)} />
      </div>
    ))}
    <div style={bar(40, 330, 552, 26)} />
    <div style={bar(40, 386, 478, 26)} />
    <div style={bar(40, 442, 380, 26)} />
  </div>
);

// Area chart from the original front card, in card-local pixels.
const CHART: [number, number][] = [
  [101, 367],
  [184, 284],
  [266, 276],
  [348, 221],
  [438, 303],
  [500, 276],
  [530, 197],
  [611, 169],
];
const CHART_BASE = 420;

const FrontCard: React.FC<{ draw: number }> = ({ draw }) => {
  const line = CHART.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${CHART[0][0]},${CHART_BASE} ${line} ${CHART[CHART.length - 1][0]},${CHART_BASE}`;
  const clipW =
    CHART[0][0] + (CHART[CHART.length - 1][0] - CHART[0][0] + 10) * draw;

  return (
    <div style={card(FRONT)}>
      <div style={bar(40, 58, 546, 33)} />
      <svg
        width={FRONT.w}
        height={FRONT.h}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`v${i}`}
            x1={101 + i * 85}
            y1={130}
            x2={101 + i * 85}
            y2={CHART_BASE}
            stroke="#c3b8fb"
            strokeWidth={1.5}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`h${i}`}
            x1={56}
            y1={160 + i * 86}
            x2={660}
            y2={160 + i * 86}
            stroke="#c3b8fb"
            strokeWidth={1.5}
          />
        ))}
        <defs>
          <clipPath id="chart-draw">
            <rect x={0} y={0} width={clipW} height={FRONT.h} />
          </clipPath>
        </defs>
        <g clipPath="url(#chart-draw)">
          <polygon points={area} fill={LAVENDER_DARK} opacity={0.95} />
          <polyline
            points={line}
            fill="none"
            stroke="#9a83f6"
            strokeWidth={3}
          />
          {CHART.map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={6} fill="#4d1fe0" />
          ))}
        </g>
      </svg>
      <div style={bar(419, 465, 295, 31)} />
    </div>
  );
};

const PillIcon: React.FC<{ kind: number }> = ({ kind }) => (
  <svg width={44} height={44} viewBox="0 0 24 24">
    {kind === 0 ? (
      <g fill="none" stroke={VIOLET} strokeWidth={1.6}>
        <circle cx="12" cy="12" r="4.5" />
        <path d="M10.2 12.2 l1.3 1.3 2.6-2.8" strokeLinecap="round" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <g key={a} transform={`rotate(${a} 12 12)`}>
            <path d="M12 7.5 V4" />
            <circle cx="12" cy="3" r="1.2" fill={VIOLET} />
          </g>
        ))}
      </g>
    ) : kind === 1 ? (
      <g fill="none" stroke={VIOLET} strokeWidth={1.6}>
        <circle cx="12" cy="12" r="6.5" />
        <circle cx="12" cy="12" r="2.6" fill={VIOLET} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path
            key={a}
            d="M12 3.5 V5.5"
            transform={`rotate(${a} 12 12)`}
            strokeLinecap="round"
          />
        ))}
      </g>
    ) : (
      <g fill="none" stroke={VIOLET} strokeWidth={1.6} strokeLinejoin="round">
        <path d="M4 19 L9 7 L12 13 L15 7 L20 19 Z" />
        <path d="M12 4 V6 M7 4.5 L8 6 M17 4.5 L16 6" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

type Pill = {
  label: string;
  x: number;
  y: number;
  from: [number, number];
  start: number;
};

const PILLS: Pill[] = [
  {
    label: "Intelligente Workflows",
    x: 26,
    y: 1040,
    from: [-700, 0],
    start: 4,
  },
  {
    label: "Betriebliche Effizienz",
    x: 360,
    y: 1384,
    from: [0, 600],
    start: 28,
  },
  { label: "Geringeres Risiko", x: 555, y: 600, from: [700, 0], start: 58 },
];

const PillView: React.FC<{ pill: Pill; frame: number; kind: number }> = ({
  pill,
  frame,
  kind,
}) => {
  const t = interpolate(frame, [pill.start, pill.start + 9], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });
  if (t <= 0) return null;
  const speed =
    1 - interpolate(frame, [pill.start, pill.start + 6], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: pill.x + pill.from[0] * (1 - t),
        top: pill.y + pill.from[1] * (1 - t),
        height: 100,
        padding: "0 44px 0 14px",
        borderRadius: 50,
        background: BRAND_GRADIENT,
        display: "flex",
        alignItems: "center",
        gap: 18,
        boxShadow:
          "0 16px 40px rgba(20,0,50,0.45), 0 0 30px rgba(200,60,200,0.25)",
        filter: speed > 0.05 ? `blur(${speed * 10}px)` : undefined,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PillIcon kind={kind} />
      </div>
      <div
        style={{
          fontFamily,
          fontWeight: 600,
          fontSize: 38,
          letterSpacing: "-0.015em",
          color: "#ffffff",
          textShadow: "0 0 10px rgba(255,255,255,0.35)",
        }}
      >
        {pill.label}
      </div>
    </div>
  );
};

// Two product cards with the three benefit pills (original 24.08s-27.8s).
export const CardsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 93], [1.04, 0.97], { easing: EASE });
  const draw = interpolate(frame, [1, 13], [0, 1], { ...clamp, easing: EASE });

  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <BackCard />
        <FrontCard draw={draw} />
        {PILLS.map((p, i) => (
          <PillView key={p.label} pill={p} frame={frame} kind={i} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
