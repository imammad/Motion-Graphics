import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";

type Props = Record<string, never>;

// Cross-dissolve through blur, the Wave reference's scene change.
const BlurDissolve: React.FC<TransitionPresentationComponentProps<Props>> = ({
  presentationProgress: p,
  presentationDirection,
  children,
}) => {
  const entering = presentationDirection === "entering";

  return (
    <AbsoluteFill
      style={{
        opacity: entering ? interpolate(p, [0, 0.6], [0, 1], { extrapolateRight: "clamp" }) : interpolate(p, [0.3, 1], [1, 0], { extrapolateLeft: "clamp" }),
        filter: `blur(${entering ? (1 - p) * 24 : p * 24}px)`,
        scale: String(entering ? 1.06 - p * 0.06 : 1 - p * 0.04),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const blurDissolve = (): TransitionPresentation<Props> => ({
  component: BlurDissolve,
  props: {},
});
