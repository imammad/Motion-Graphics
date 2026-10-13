import { interpolate, useCurrentFrame } from "remotion";
import { Headline, Segment } from "./Headline";
import { BLUE, BLUE_TINT, fontFamily } from "./theme";

type Props = {
  label: string;
  segments: Segment[];
  start?: number;
};

// Small eyebrow label + large left-aligned statement.
export const Quote: React.FC<Props> = ({ label, segments, start = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 34, fontFamily }}>
      <div
        style={{
          alignSelf: "flex-start",
          padding: "12px 26px",
          borderRadius: 999,
          background: BLUE_TINT,
          color: BLUE,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.06em",
          opacity: interpolate(frame, [start, start + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {label}
      </div>
      <Headline
        start={start + 4}
        stagger={3}
        fontSize={92}
        align="left"
        maxWidth={760}
        segments={segments}
      />
    </div>
  );
};
