import { AbsoluteFill } from "remotion";
import { HEIGHT, MIDNIGHT_BLACK, MIDNIGHT_NAVY, MIDNIGHT_VIOLET, WIDTH } from "./theme";

// Brand "ambient gradient" + "geometric cube nodes" patterns, with soft
// colour fields drifting behind the glass so the frosting has light to bend.
const HEX_R = 64;
const HEX_W = Math.sqrt(3) * HEX_R;

const hexPath = (cx: number, cy: number, r: number) => {
  const pts = [...Array(6)].map((_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
};

const Blob: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
}> = ({ x, y, r, color }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
    }}
  />
);

export const Background: React.FC<{ t: number }> = ({ t }) => {
  const d = (speed: number, amp: number, phase = 0) =>
    Math.sin(t * speed + phase) * amp;

  const hexes: string[] = [];
  for (let row = -1; row < HEIGHT / (HEX_R * 1.5) + 2; row++) {
    for (let col = -1; col < WIDTH / HEX_W + 2; col++) {
      const cx = col * HEX_W + (row % 2 ? HEX_W / 2 : 0);
      const cy = row * HEX_R * 1.5;
      hexes.push(hexPath(cx, cy, HEX_R));
    }
  }

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${MIDNIGHT_BLACK} 0%, ${MIDNIGHT_NAVY} 48%, ${MIDNIGHT_VIOLET} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* colour fields */}
      <Blob x={790 + d(0.5, 40)} y={560 + d(0.4, 50, 1)} r={420} color="rgba(239,41,106,0.42)" />
      <Blob x={260 + d(0.45, 50, 2)} y={1020 + d(0.35, 60)} r={460} color="rgba(98,62,214,0.48)" />
      <Blob x={880 + d(0.4, 40, 3)} y={1250 + d(0.5, 40, 2)} r={300} color="rgba(239,41,106,0.22)" />
      <Blob x={180 + d(0.3, 30, 1)} y={380 + d(0.4, 30, 3)} r={320} color="rgba(120,80,220,0.28)" />

      {/* ambient pink arc rising from the bottom edge */}
      <div
        style={{
          position: "absolute",
          left: -260,
          width: WIDTH + 520,
          top: HEIGHT - 520 + d(0.6, 14),
          height: 1100,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(239,41,106,0.38) 0%, rgba(110,26,69,0.22) 38%, transparent 70%)",
        }}
      />

      {/* hex network */}
      <svg
        width={WIDTH}
        height={HEIGHT}
        style={{
          position: "absolute",
          transform: `translateY(${-((t * 14) % (HEX_R * 3))}px)`,
          maskImage:
            "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0.9), transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0.9), transparent 85%)",
        }}
      >
        <path d={hexes.join("")} fill="none" stroke="rgba(239,41,106,0.11)" strokeWidth={1.4} />
      </svg>

      {/* soft vignette to keep the edges calm */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 55%, rgba(10,8,18,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
