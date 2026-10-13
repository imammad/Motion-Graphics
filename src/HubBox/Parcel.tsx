import { LIGHT_PINK, PINK, PINK_DEEP, PINK_LIGHT } from "./theme";

// The through-line: an isometric pink parcel. Its outline is a hexagon, the same
// silhouette as the HubBox logomark.
export const PARCEL_EDGE = 54;

const hexPoints = (a: number) => {
  const h = a * 0.866;
  return {
    top: [0, -a],
    tr: [h, -a / 2],
    br: [h, a / 2],
    bottom: [0, a],
    bl: [-h, a / 2],
    tl: [-h, -a / 2],
    c: [0, 0],
  } as const;
};

const poly = (...pts: readonly (readonly number[])[]) =>
  pts.map((p) => p.join(",")).join(" ");

export const ParcelSvg: React.FC<{ edge?: number; id: string }> = ({
  edge = PARCEL_EDGE,
  id,
}) => {
  const a = edge;
  const p = hexPoints(a);
  const hx = a * 0.866;
  const w = hx * 2 + 8;
  const h = a * 2 + 8;
  const tape = a * 0.11;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}
      style={{
        position: "absolute",
        left: -w / 2,
        top: -h / 2,
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient
          id={`${id}-top`}
          x1="0"
          y1="-1"
          x2="0"
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#FFA3BF" />
          <stop offset="1" stopColor={PINK_LIGHT} />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F64A80" />
          <stop offset="1" stopColor={PINK} />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D41A58" />
          <stop offset="1" stopColor={PINK_DEEP} />
        </linearGradient>
      </defs>
      <g strokeLinejoin="round" strokeWidth={a * 0.09}>
        <polygon
          points={poly(p.top, p.tr, p.c, p.tl)}
          fill={`url(#${id}-top)`}
          stroke="#FF95B5"
        />
        <polygon
          points={poly(p.tl, p.c, p.bottom, p.bl)}
          fill={`url(#${id}-left)`}
          stroke="#F64A80"
        />
        <polygon
          points={poly(p.c, p.tr, p.br, p.bottom)}
          fill={`url(#${id}-right)`}
          stroke="#C8174F"
        />
        {/* tape: across the top face, then down the right face */}
        <polygon
          points={poly(
            [-hx / 2 - 0.866 * tape, (-3 * a) / 4 + 0.5 * tape],
            [-hx / 2 + 0.866 * tape, (-3 * a) / 4 - 0.5 * tape],
            [hx / 2 + 0.866 * tape, -a / 4 - 0.5 * tape],
            [hx / 2 - 0.866 * tape, -a / 4 + 0.5 * tape],
          )}
          fill={LIGHT_PINK}
          opacity={0.85}
          stroke="none"
        />
        <polygon
          points={poly(
            [hx / 2 - 0.866 * tape, -a / 4 + 0.5 * tape],
            [hx / 2 + 0.866 * tape, -a / 4 - 0.5 * tape],
            [hx / 2 + 0.866 * tape, (3 * a) / 4 - 0.5 * tape],
            [hx / 2 - 0.866 * tape, (3 * a) / 4 + 0.5 * tape],
          )}
          fill={LIGHT_PINK}
          opacity={0.38}
          stroke="none"
        />
      </g>
    </svg>
  );
};
