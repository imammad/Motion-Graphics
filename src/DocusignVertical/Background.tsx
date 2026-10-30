import { AbsoluteFill } from "remotion";
import { BG_CENTER, BG_EDGE, BG_MID } from "./theme";

// Deep purple field with a soft lift in the middle, plus optional extra glow.
export const Background: React.FC<{
  glow?: string;
  glowY?: number;
  glowSize?: number;
}> = ({ glow, glowY = 960, glowSize = 1300 }) => (
  <AbsoluteFill
    style={{
      backgroundColor: BG_EDGE,
      backgroundImage: `radial-gradient(ellipse 95% 60% at 50% 50%, ${BG_CENTER} 0%, ${BG_MID} 45%, ${BG_EDGE} 100%)`,
      overflow: "hidden",
    }}
  >
    {glow ? (
      <div
        style={{
          position: "absolute",
          left: 540 - glowSize / 2,
          top: glowY - glowSize / 2,
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 68%)`,
        }}
      />
    ) : null}
  </AbsoluteFill>
);
