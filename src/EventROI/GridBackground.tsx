import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// The client's grid background, with a very slow drift so it never feels frozen.
export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#EEF1F8", overflow: "hidden" }}>
      <Img
        src={staticFile("backgrounds/grid-background.webp")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(interpolate(frame, [0, durationInFrames], [1.02, 1.08])),
        }}
      />
    </AbsoluteFill>
  );
};

// Wraps a single scene with the background so it previews on its own.
export const withBackground = (Scene: React.FC): React.FC => {
  const Wrapped: React.FC = () => (
    <AbsoluteFill>
      <GridBackground />
      <Scene />
    </AbsoluteFill>
  );
  return Wrapped;
};
