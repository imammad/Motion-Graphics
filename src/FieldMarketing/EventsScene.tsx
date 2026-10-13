import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { Cursor } from "./Cursor";
import { Quote } from "./Quote";
import { Window } from "./Window";
import { BLUE, BLUE_GRADIENT, BLUE_TINT, INK, MUTED, WHITE, fontFamily } from "./theme";

const EVENTS: Record<number, string> = { 8: "Summit", 16: "Roadshow", 23: "Expo" };
const CLICK_AT = 84;

// "One person will tell you they booked the events."
export const EventsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const win = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 110 } });
  const booked = frame >= CLICK_AT;
  const press = interpolate(frame, [CLICK_AT - 4, CLICK_AT, CLICK_AT + 6], [1, 0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 140px",
        }}
      >
        <Quote
          label="ONE PERSON SAYS"
          segments={[{ text: "“They booked" }, { text: "the events.”", accent: true }]}
        />

        <Window
          title="Events · October"
          width={860}
          height={720}
          style={{
            opacity: win,
            translate: `${interpolate(win, [0, 1], [120, 0])}px 0px`,
            rotate: `${interpolate(win, [0, 1], [4, 0])}deg`,
          }}
        >
          <div style={{ padding: 28 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 8,
                marginBottom: 8,
              }}
            >
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} style={{ fontSize: 20, fontWeight: 700, color: MUTED, textAlign: "center" }}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
              {new Array(35).fill(0).map((_, i) => {
                const day = i + 1;
                const label = EVENTS[day];
                const idx = label ? Object.keys(EVENTS).indexOf(String(day)) : 0;
                const chip = label
                  ? spring({ frame: frame - 30 - idx * 8, fps, config: { damping: 12, stiffness: 170 } })
                  : 0;
                return (
                  <div
                    key={i}
                    style={{
                      height: 84,
                      borderRadius: 14,
                      background: day > 31 ? "transparent" : label && chip > 0.1 ? BLUE_TINT : "#F6F9FE",
                      padding: "8px 10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: 600, color: day > 31 ? "transparent" : INK }}>
                      {day}
                    </div>
                    {label ? (
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: WHITE,
                          background: BLUE,
                          borderRadius: 6,
                          padding: "3px 6px",
                          scale: chip,
                          transformOrigin: "left center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {label}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 28,
              bottom: 28,
              fontSize: 22,
              fontWeight: 600,
              color: MUTED,
            }}
          >
            3 events this month
          </div>
          <div
            style={{
              position: "absolute",
              right: 28,
              bottom: 22,
              width: 300,
              height: 76,
              borderRadius: 18,
              background: booked ? BLUE_GRADIENT : INK,
              color: WHITE,
              fontSize: 28,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              scale: press,
              boxShadow: booked ? "0 18px 40px rgba(61,138,252,0.45)" : "none",
            }}
          >
            {booked ? "Booked ✓" : "Book events"}
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translate: `${interpolate(frame, [40, CLICK_AT - 6], [900, 690], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.45, 0, 0.2, 1),
              })}px ${interpolate(frame, [40, CLICK_AT - 6], [300, 594], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.45, 0, 0.2, 1),
              })}px`,
              scale: press,
            }}
          >
            <Cursor />
          </div>
        </Window>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
