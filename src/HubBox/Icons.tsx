import { LIGHT_PINK, PINK, PINK_LIGHT, WHITE } from "./theme";

// Icon language from the HubBox reference cards: a pink gradient glyph on a white tile.

export const PinkGradient: React.FC<{ id: string }> = ({ id }) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor={PINK_LIGHT} />
    <stop offset="1" stopColor={PINK} />
  </linearGradient>
);

// A white rounded tile with a glyph, centred on (0, 0). `grow` 0..1 scales it up from its base.
export const IconTile: React.FC<{
  x: number;
  y: number;
  size: number;
  grow: number;
  children: React.ReactNode;
}> = ({ x, y, size, grow, children }) => {
  const s = Math.max(0, grow);
  return (
    <g
      transform={`translate(${x} ${y + size / 2}) scale(${s}) translate(0 ${-size / 2})`}
    >
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        rx={size * 0.28}
        fill={WHITE}
      />
      <rect
        x={-size / 2 + 3}
        y={-size / 2 + 3}
        width={size - 6}
        height={size - 6}
        rx={size * 0.26}
        fill="none"
        stroke={LIGHT_PINK}
        strokeWidth={2}
      />
      <g transform={`scale(${size / 100})`}>{children}</g>
    </g>
  );
};

// Glyphs drawn in a 100x100 box centred on (0, 0).
export const PinGlyph: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs>
      <PinkGradient id={id} />
    </defs>
    <ellipse cx={0} cy={33} rx={22} ry={6} fill={LIGHT_PINK} />
    <path
      d="M0 34 C -6 24 -26 6 -26 -10 A 26 26 0 1 1 26 -10 C 26 6 6 24 0 34 Z"
      fill={`url(#${id})`}
    />
    <circle cx={0} cy={-10} r={10} fill={WHITE} />
  </g>
);

export const TrolleyGlyph: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs>
      <PinkGradient id={id} />
    </defs>
    <path
      d="M -34 -26 L -24 -26 L -14 14 L 24 14"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M -20 -16 L 32 -16 L 25 6 L -15 6 Z"
      fill={`url(#${id})`}
      strokeLinejoin="round"
    />
    <circle cx={-10} cy={26} r={6.5} fill={PINK} />
    <circle cx={20} cy={26} r={6.5} fill={PINK} />
  </g>
);

// Pink tick badge, as on the reference cards. `grow` 0..1.
export const CheckBadge: React.FC<{ x: number; y: number; grow: number }> = ({
  x,
  y,
  grow,
}) => {
  const s = Math.max(0, grow);
  // The tick draws on slightly after the disc lands.
  const draw = Math.min(1, Math.max(0, (grow - 0.35) / 0.6));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={27} fill={PINK} stroke={LIGHT_PINK} strokeWidth={3.5} />
      <path
        d="M -10 0 L -3 7 L 11 -8"
        fill="none"
        stroke={WHITE}
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
    </g>
  );
};
