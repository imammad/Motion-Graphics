import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BLUE, BLUE_TINT, WHITE } from "./theme";

// Soft white canvas with a dotted grid and two drifting blue glows.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: WHITE, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${BLUE_TINT} 2px, transparent 2px)`,
          backgroundSize: "40px 40px",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          left: -380,
          top: -520,
          background: `radial-gradient(circle, ${BLUE}33 0%, transparent 65%)`,
          translate: `${interpolate(frame, [0, 600], [0, 140])}px ${interpolate(frame, [0, 600], [0, 80])}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          right: -460,
          bottom: -620,
          background: `radial-gradient(circle, ${BLUE}2b 0%, transparent 65%)`,
          translate: `${interpolate(frame, [0, 600], [0, -160])}px ${interpolate(frame, [0, 600], [0, -60])}px`,
        }}
      />
    </AbsoluteFill>
  );
};
