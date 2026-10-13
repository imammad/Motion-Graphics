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
import {
  BLUE,
  BLUE_GRADIENT,
  BLUE_TINT,
  CARD_SHADOW,
  INK,
  MUTED,
  WHITE,
  fontFamily,
} from "./theme";

const Skeleton: React.FC<{ width: number; delay: number }> = ({ width, delay }) => {
  const frame = useCurrentFrame();
  const shimmer = ((frame - delay) * 14) % (width + 300);
  return (
    <div
      style={{
        width: interpolate(frame, [delay, delay + 18], [0, width], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        height: 22,
        borderRadius: 11,
        background: BLUE_TINT,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 160,
          left: shimmer - 160,
          background: `linear-gradient(90deg, transparent, ${WHITE}, transparent)`,
        }}
      />
    </div>
  );
};

// "...what the field marketing manager actually does"
export const RoleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card = spring({ frame: frame - 4, fps, config: { damping: 16, stiffness: 120 } });
  const badge = spring({ frame: frame - 48, fps, config: { damping: 9, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 120, gap: 70 }}>
        <Headline
          start={0}
          stagger={3}
          fontSize={92}
          maxWidth={1500}
          segments={[
            { text: "what the" },
            { text: "Field Marketing Manager", accent: true },
            { text: "actually does" },
          ]}
        />

        <div
          style={{
            position: "relative",
            width: 1040,
            padding: "44px 52px",
            borderRadius: 32,
            background: WHITE,
            boxShadow: CARD_SHADOW,
            border: `1.5px solid ${BLUE_TINT}`,
            display: "flex",
            gap: 44,
            scale: interpolate(card, [0, 1], [0.85, 1]),
            opacity: card,
            translate: `0px ${interpolate(card, [0, 1], [80, 0])}px`,
          }}
        >
          <Person size={150} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: MUTED, letterSpacing: "0.08em" }}>
              ROLE PROFILE
            </div>
            <div style={{ fontSize: 50, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>
              Field Marketing Manager
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {["Marketing", "Field", "???"].map((t, i) => (
                <div
                  key={t}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    fontSize: 24,
                    fontWeight: 700,
                    background: i === 2 ? BLUE : BLUE_TINT,
                    color: i === 2 ? WHITE : BLUE,
                    opacity: interpolate(frame, [20 + i * 5, 30 + i * 5], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: MUTED, marginTop: 14, letterSpacing: "0.08em" }}>
              WHAT THEY DO
            </div>
            <Skeleton width={640} delay={24} />
            <Skeleton width={520} delay={30} />
            <Skeleton width={580} delay={36} />
          </div>

          <div
            style={{
              position: "absolute",
              right: -46,
              top: -46,
              width: 132,
              height: 132,
              borderRadius: 40,
              background: BLUE_GRADIENT,
              color: WHITE,
              fontSize: 92,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 50px rgba(61,138,252,0.45)",
              scale: badge,
              rotate: `${interpolate(badge, [0, 1], [-40, 0]) + Math.sin(frame / 7) * 6}deg`,
            }}
          >
            ?
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
