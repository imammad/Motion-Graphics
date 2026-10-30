import { CORAL, FOLD, LAVENDER, LINE, VIOLET } from "./theme";

export const DOC_RATIO = 1.352;
const LINES = [
  { y: 0.326, w: 0.66 },
  { y: 0.454, w: 0.59 },
  { y: 0.579, w: 0.515 },
  { y: 0.692, w: 0.635 },
  { y: 0.81, w: 0.73 },
];

type Props = {
  width: number;
  // 0 = lavender page, 1 = the violet-to-coral gradient page.
  gradient?: number;
  lines?: number;
  glow?: boolean;
  style?: React.CSSProperties;
};

// The flat document icon used throughout the original, as SVG.
export const Doc: React.FC<Props> = ({
  width,
  gradient = 0,
  lines = 5,
  glow = true,
  style,
}) => {
  const w = 100;
  const h = w * DOC_RATIO;
  const fold = 22.5;
  const body = `M0 0 H${w - fold} L${w} ${fold} V${h} H0 Z`;
  const id = `g${Math.round(width * 1000)}`;

  return (
    <svg
      width={width}
      height={width * DOC_RATIO}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        display: "block",
        overflow: "visible",
        filter: glow
          ? "drop-shadow(0 0 18px rgba(200,190,255,0.28))"
          : undefined,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0" stopColor={VIOLET} />
          <stop offset="0.55" stopColor="#b42bc0" />
          <stop offset="1" stopColor={CORAL} />
        </linearGradient>
      </defs>
      <path d={body} fill={LAVENDER} />
      {gradient > 0 ? (
        <path d={body} fill={`url(#${id})`} opacity={gradient} />
      ) : null}
      <path
        d={`M${w - fold} 0 L${w} ${fold} H${w - fold} Z`}
        fill={gradient > 0.5 ? "#f2e6ff" : FOLD}
      />
      {LINES.slice(0, lines).map((l) => (
        <rect
          key={l.y}
          x={9}
          y={l.y * h - 0.8}
          width={l.w * w}
          height={1.6}
          fill={gradient > 0.5 ? "#f4e9ff" : LINE}
        />
      ))}
    </svg>
  );
};
