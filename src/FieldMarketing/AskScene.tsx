import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { Headline } from "./Headline";
import { Person } from "./Person";
import { BLUE, BLUE_TINT, MUTED, fontFamily } from "./theme";

// "Ask 10 people at your company..."
export const AskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Background />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 110 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 30px",
            borderRadius: 999,
            background: BLUE_TINT,
            color: BLUE,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.02em",
            opacity: interpolate(frame, [0, 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0px ${interpolate(frame, [0, 20], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}px`,
            marginBottom: -70,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, background: BLUE }} />
          QUICK EXPERIMENT
        </div>

        <Headline
          start={6}
          stagger={4}
          fontSize={128}
          segments={[
            { text: "Ask" },
            { text: "10 people", accent: true },
            { text: "at your company" },
          ]}
        />

        <div style={{ display: "flex", gap: 34, alignItems: "flex-end" }}>
          {new Array(10).fill(0).map((_, i) => {
            const pop = spring({
              frame: frame - 30 - i * 4,
              fps,
              config: { damping: 12, stiffness: 170 },
            });
            const bob = Math.sin((frame - i * 6) / 9) * 6;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  scale: pop,
                  opacity: Math.min(1, pop * 1.5),
                  translate: `0px ${(1 - pop) * 60 + bob}px`,
                }}
              >
                <Person size={118} variant={i % 3 === 1 ? "light" : "blue"} />
                <div style={{ fontSize: 24, fontWeight: 700, color: MUTED }}>
                  #{i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
