import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Headline } from "./Headline";
import { Person } from "./Person";
import { BLUE, BLUE_DARK, BLUE_LIGHT, WHITE, fontFamily } from "./theme";

// Two quick shoulder lifts starting at `at`.
const shrugOffset = (frame: number, at: number) =>
  interpolate(
    frame,
    [at, at + 6, at + 12, at + 18, at + 24, at + 30],
    [0, -26, 0, -26, 0, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

// "...and a couple will just shrug."
export const ShrugScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        background: `radial-gradient(120% 90% at 50% 0%, ${BLUE_LIGHT} 0%, ${BLUE} 45%, ${BLUE_DARK} 100%)`,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 2px, transparent 2px)",
          backgroundSize: "40px 40px",
        }}
      />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 160 + i * 300,
            top: 140 + ((i * 173) % 640),
            fontSize: 60 + (i % 3) * 30,
            fontWeight: 800,
            color: WHITE,
            opacity: 0.12,
            translate: `0px ${Math.sin((frame + i * 20) / 18) * 18}px`,
            rotate: `${(i % 2 ? 1 : -1) * 14}deg`,
          }}
        >
          ?
        </div>
      ))}

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 90 }}>
        <Headline
          fontSize={120}
          color={WHITE}
          accentColor={WHITE}
          stagger={4}
          segments={[{ text: "And a couple will just" }, { text: "shrug.", accent: true }]}
        />

        <div style={{ display: "flex", gap: 260, alignItems: "flex-end" }}>
          {[0, 1].map((i) => {
            const pop = spring({ frame: frame - 18 - i * 6, fps, config: { damping: 12, stiffness: 150 } });
            const bubble = spring({ frame: frame - 34 - i * 8, fps, config: { damping: 10, stiffness: 170 } });
            const shrug = shrugOffset(frame, 46 + i * 8);
            return (
              <div
                key={i}
                style={{
                  scale: pop,
                  opacity: Math.min(1, pop * 1.4),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 36,
                }}
              >
                <div
                  style={{
                    whiteSpace: "nowrap",
                    padding: "20px 34px",
                    borderRadius: 30,
                    background: WHITE,
                    color: BLUE_DARK,
                    fontSize: 54,
                    fontWeight: 800,
                    boxShadow: "0 24px 60px rgba(9, 37, 94, 0.35)",
                    scale: bubble,
                    transformOrigin: "bottom center",
                    translate: `0px ${shrug * 0.6}px`,
                  }}
                >
                  ¯\_(ツ)_/¯
                </div>
                <div style={{ translate: `0px ${shrug}px` }}>
                  <Person size={210} variant="light" />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
