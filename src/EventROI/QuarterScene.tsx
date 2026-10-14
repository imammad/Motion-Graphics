import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CalendarIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, BUTTON_GRADIENT, EASE, EASE_IN_OUT, GREY, INK, WHITE } from "../Wave/theme";
import { Camera, Card, Check, Headline, Pill, Reveal } from "../Wave/ui";

const FILL_START = 14;
const FILL_END = 46;
const CLOSED = 48;

// "So when the quarter closes"
export const QuarterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [FILL_START, FILL_END], [0.72, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
  const daysLeft = Math.round((1 - progress) * 92);

  return (
    <AbsoluteFill>
      <Camera zoom={[1.04, 1]}>
        <Headline at={0} style={{ top: 190 }}>
          When the quarter closes
        </Headline>

        <Reveal at={6} duration={22} style={{ position: "absolute", left: 560, top: 420 }}>
          <Card width={800} height={300} padding={44} style={{ boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 600, color: INK }}>
                <CalendarIcon size={42} color={BLUE} />
                Q3 2026
              </div>
              <div style={{ fontSize: 26, color: GREY }}>
                <span style={{ fontWeight: 600, color: INK }}>{daysLeft}</span> days left
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, fontSize: 22, color: GREY, padding: "0 4px" }}>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
            <div style={{ marginTop: 14, height: 28, borderRadius: 28, background: BLUE_MIST, overflow: "hidden" }}>
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: "100%",
                  borderRadius: 28,
                  background: BUTTON_GRADIENT,
                  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.35)",
                }}
              />
            </div>
          </Card>
        </Reveal>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 790,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [CLOSED, CLOSED + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: String(interpolate(frame, [CLOSED, CLOSED + 14], [1.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE })),
            filter: `blur(${interpolate(frame, [CLOSED, CLOSED + 10], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}
        >
          <Pill icon={<Check size={40} />} size={32} style={{ fontWeight: 600 }} background={WHITE}>
            Quarter closed
          </Pill>
        </div>
      </Camera>
    </AbsoluteFill>
  );
};
