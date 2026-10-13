import {
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { INK, TEXT_GRADIENT, fontFamily } from "./theme";

export type Segment = { text: string; accent?: boolean };

type Props = {
  segments: Segment[];
  start?: number;
  stagger?: number;
  fontSize?: number;
  color?: string;
  accentColor?: string;
  align?: "left" | "center";
  maxWidth?: number;
};

// Word-by-word rise + blur reveal. Accent words get the blue gradient.
export const Headline: React.FC<Props> = ({
  segments,
  start = 0,
  stagger = 3,
  fontSize = 104,
  color = INK,
  accentColor,
  align = "center",
  maxWidth = 1600,
}) => {
  const frame = useCurrentFrame();
  const words = segments.flatMap((s) =>
    s.text
      .split(" ")
      .filter(Boolean)
      .map((w) => ({ w, accent: s.accent })),
  );

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight: 800,
        letterSpacing: "-0.035em",
        lineHeight: 1.08,
        color,
        textAlign: align,
        maxWidth,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: "0.24em",
      }}
    >
      {words.map(({ w, accent }, i) => {
        const t = frame - start - i * stagger;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              paddingBottom: "0.08em",
              opacity: interpolate(t, [0, 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: `0px ${interpolate(t, [0, 18], [fontSize * 0.45, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })}px`,
              filter: `blur(${interpolate(t, [0, 14], [10, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px)`,
              ...(accent
                ? accentColor
                  ? { color: accentColor }
                  : {
                      backgroundImage: TEXT_GRADIENT,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }
                : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
