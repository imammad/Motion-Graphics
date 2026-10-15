import React from "react";
import { clamp, lerp } from "./theme";

// Custom line glyphs on a 120×120 grid, stroked with a pink gradient.
// `a` (0..1) drives each icon's own micro-moment after it lands.

const Grad: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="120" y2="120">
      <stop offset="0" stopColor="#FF9CBC" />
      <stop offset="0.5" stopColor="#EF296A" />
      <stop offset="1" stopColor="#D11657" />
    </linearGradient>
  </defs>
);

const line = (id: string) => ({
  fill: "none",
  stroke: `url(#${id})`,
  strokeWidth: 6.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const Parcel: React.FC<{ x: number; y: number; s: number; id: string }> = ({ x, y, s, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-12} y={-11} width={24} height={22} rx={3.5} fill={`url(#${id})`} />
    <path d="M-12 -3 H12 M0 -11 V-3" stroke="rgba(255,255,255,0.85)" strokeWidth={2.4} strokeLinecap="round" />
  </g>
);

export const LockerIcon: React.FC<{ id: string; a: number }> = ({ id, a }) => {
  const open = clamp(a);
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: "visible" }}>
      <Grad id={id} />
      {/* parcel waiting behind the highlighted door */}
      <g opacity={clamp(open * 1.6)}>
        <Parcel x={82} y={60} s={lerp(0.7, 1, open)} id={id} />
      </g>
      <rect x={16} y={12} width={88} height={96} rx={12} {...line(id)} />
      <path d="M60 12 V108 M16 44 H104 M16 76 H104" {...line(id)} />
      {[28, 92].map((cy) => (
        <React.Fragment key={cy}>
          <circle cx={51} cy={cy} r={3.6} fill={`url(#${id})`} />
          <circle cx={69} cy={cy} r={3.6} fill={`url(#${id})`} />
        </React.Fragment>
      ))}
      <circle cx={51} cy={60} r={3.6} fill={`url(#${id})`} />
      {/* door swings open on its right hinge */}
      <g transform={`translate(104 0) scale(${lerp(1, 0.18, open)} 1) translate(-104 0)`}>
        <rect x={60} y={44} width={44} height={32} fill={`rgba(239,41,106,${lerp(0.32, 0.5, open)})`} />
        <circle cx={69} cy={60} r={3.6} fill="#FFFFFF" opacity={1 - open} />
      </g>
      <path d="M104 44 V76" {...line(id)} />
    </svg>
  );
};

export const PickupPointIcon: React.FC<{ id: string; a: number; pin: number }> = ({ id, pin }) => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: "visible" }}>
    <Grad id={id} />
    {/* awning */}
    <path d="M24 36 H96 L106 56 H14 Z" {...line(id)} />
    <path d="M42 36 L38 56 M60 36 V56 M78 36 L82 56" {...line(id)} />
    <path d="M14 56 q11.5 11 23 0 q11.5 11 23 0 q11.5 11 23 0 q11.5 11 23 0" {...line(id)} />
    {/* storefront */}
    <path d="M20 66 V108 M100 66 V108 M10 108 H110" {...line(id)} />
    <rect x={49} y={80} width={22} height={28} rx={3} {...line(id)} />
    <rect x={28} y={74} width={13} height={13} rx={3} {...line(id)} />
    <rect x={79} y={74} width={13} height={13} rx={3} {...line(id)} />
    {/* location pin drops onto the roof */}
    <g
      opacity={clamp(pin * 3)}
      transform={`translate(0 ${lerp(-34, 0, pin)})`}
    >
      <path
        d="M60 32 C52 23 48.5 19.5 48.5 13.5 A11.5 11.5 0 1 1 71.5 13.5 C71.5 19.5 68 23 60 32 Z"
        fill={`url(#${id})`}
      />
      <circle cx={60} cy={13.5} r={4.2} fill="#FFFFFF" />
    </g>
  </svg>
);

export const SupermarketIcon: React.FC<{ id: string; a: number; drop: number }> = ({ id, drop }) => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: "visible" }}>
    <Grad id={id} />
    {/* parcel drops into the basket */}
    <g opacity={clamp(drop * 3)}>
      <Parcel x={66} y={lerp(4, 47, drop)} s={1.05} id={id} />
    </g>
    <path d="M8 20 H22 L35 80 H94" {...line(id)} />
    <path d="M26 34 H106 L97 66 H32" {...line(id)} />
    <circle cx={42} cy={96} r={7.5} {...line(id)} />
    <circle cx={88} cy={96} r={7.5} {...line(id)} />
  </svg>
);

/** Generic collection location: map pin holding a parcel. */
export const PinIcon: React.FC<{ id: string }> = ({ id }) => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: "visible" }}>
    <Grad id={id} />
    <path
      d="M60 110 C38 84 22 68 22 46 A38 38 0 1 1 98 46 C98 68 82 84 60 110 Z"
      {...line(id)}
    />
    <Parcel x={60} y={46} s={1.25} id={id} />
  </svg>
);
