import { AbsoluteFill } from "remotion";
import { mix, prog, useTime, EASE_IN_OUT } from "./kit";
import { C } from "./theme";

// Glow positions per beat; the light glides between them so the ground
// is never still and each beat gets a slightly different key light.
const LIGHT: [number, number, number][] = [
  // [time s, x %, y %]
  [0, 30, 34],
  [6.2, 46, 40],
  [14.3, 28, 38],
  [19.5, 62, 44],
  [23.2, 44, 38],
  [30.6, 50, 48],
];

const lightAt = (t: number) => {
  let [, x, y] = LIGHT[0];
  for (let i = 1; i < LIGHT.length; i++) {
    const p = prog(t, LIGHT[i][0] - 0.4, 1.6, EASE_IN_OUT);
    x = mix(x, LIGHT[i][1], p);
    y = mix(y, LIGHT[i][2], p);
  }
  return { x, y };
};

export const Ground: React.FC = () => {
  const t = useTime();
  const { x, y } = lightAt(t);
  const breathe = Math.sin(t * 0.6) * 3;
  return (
    <AbsoluteFill style={{ background: C.groundEdge }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${72 + breathe}% ${80 + breathe}% at ${x}% ${y}%, ${C.groundCore} 0%, ${C.groundMid} 52%, ${C.groundEdge} 100%)`,
        }}
      />
      {/* faint dot grid for depth, faded out toward the edges */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(239,239,239,0.055) 1.2px, transparent 1.4px)",
          backgroundSize: "48px 48px",
          backgroundPosition: `${-t * 3}px 0px`,
          maskImage: `radial-gradient(ellipse 60% 65% at ${x}% ${y}%, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(ellipse 60% 65% at ${x}% ${y}%, black 0%, transparent 100%)`,
        }}
      />
      {/* grain */}
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed={Math.floor(t * 12) % 8}
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 55%, rgba(0,6,2,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
