import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CalendarIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, BUTTON_GRADIENT, EASE, GREY, INK, WHITE } from "../Wave/theme";
import { Camera, Pill, Reveal } from "../Wave/ui";
import { AppWindow, TOOLS } from "./tools";

const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const WIN_W = 1680;
const WIN_H = 740;
const GRID_LEFT = 40;
const GRID_W = WIN_W - 80;
const MONTH_W = GRID_W / MONTHS.length;
const LANE_TOP = 196;
const LANE_H = 98;
const LANES = 5;
const SWEEP_START = 28;
const SWEEP_END = 150;

// start and length are in months from the start of October.
const EVENTS: { name: string; start: number; length: number; lane: number; solid: boolean }[] = [
  { name: "SaaS Connect", start: 0.2, length: 0.85, lane: 0, solid: true },
  { name: "Webinar series", start: 0.6, length: 2.2, lane: 3, solid: false },
  { name: "DevSummit NYC", start: 1.2, length: 0.75, lane: 1, solid: true },
  { name: "Field Day Chicago", start: 1.85, length: 0.9, lane: 2, solid: true },
  { name: "Booth planning", start: 2.5, length: 1.8, lane: 4, solid: false },
  { name: "RevOps Live", start: 3.1, length: 0.75, lane: 0, solid: true },
  { name: "Partner Expo", start: 3.95, length: 0.8, lane: 1, solid: true },
  { name: "CMO Dinner", start: 4.55, length: 0.7, lane: 2, solid: true },
  { name: "Spring Summit", start: 5.05, length: 0.8, lane: 3, solid: true },
];

const sweepAt = (months: number) => SWEEP_START + (months / MONTHS.length) * (SWEEP_END - SWEEP_START);

// "There's a spreadsheet or the project board where the whole event calendar lives, mapped out six months ahead."
export const CalendarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [SWEEP_START, SWEEP_END], [0, GRID_W], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sweepOpacity = interpolate(frame, [SWEEP_START, SWEEP_START + 8, SWEEP_END - 6, SWEEP_END + 6], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Camera zoom={[1.12, 1]} origin="12% 55%">
        <Reveal at={0} duration={24} y={50} style={{ position: "absolute", left: 120, top: 200 }}>
          <AppWindow
            tool={TOOLS[2]}
            width={WIN_W}
            height={WIN_H}
            right={
              <div style={{ display: "flex", background: BLUE_MIST, borderRadius: 999, padding: 6, fontSize: 20, fontWeight: 500 }}>
                <div style={{ padding: "8px 20px", color: GREY }}>Sheet</div>
                <div style={{ padding: "8px 20px", color: WHITE, background: BLUE, borderRadius: 999 }}>Board</div>
              </div>
            }
          >
            {MONTHS.map((m, i) => (
              <div
                key={m}
                style={{
                  position: "absolute",
                  left: GRID_LEFT + i * MONTH_W,
                  top: 96,
                  width: MONTH_W,
                  bottom: 0,
                  borderLeft: i === 0 ? "none" : "2px solid #EEF2F8",
                }}
              >
                <div style={{ padding: "26px 20px", fontSize: 24, fontWeight: 600, color: INK }}>
                  {m} <span style={{ fontWeight: 400, color: GREY, fontSize: 20 }}>{i < 3 ? "2026" : "2027"}</span>
                </div>
              </div>
            ))}
            {new Array(LANES + 1).fill(0).map((_, r) => (
              <div
                key={r}
                style={{ position: "absolute", left: GRID_LEFT, width: GRID_W, top: LANE_TOP + r * LANE_H - 12, height: 2, background: "#EEF2F8" }}
              />
            ))}

            {EVENTS.map((e) => {
              const at = sweepAt(e.start);
              const grow = interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
              return (
                <div
                  key={e.name}
                  style={{
                    position: "absolute",
                    left: GRID_LEFT + e.start * MONTH_W,
                    top: LANE_TOP + e.lane * LANE_H,
                    width: e.length * MONTH_W * grow,
                    height: 62,
                    borderRadius: 999,
                    background: e.solid ? BUTTON_GRADIENT : BLUE_MIST,
                    boxShadow: e.solid ? "0 12px 26px rgba(84,151,252,0.3), inset 0 2px 0 rgba(255,255,255,0.35)" : "inset 0 0 0 2px #D4E6FC",
                    color: e.solid ? WHITE : BLUE,
                    fontSize: 21,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 22,
                    boxSizing: "border-box",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    opacity: grow > 0 ? 1 : 0,
                    filter: `blur(${(1 - grow) * 6}px)`,
                  }}
                >
                  {e.name}
                </div>
              );
            })}

            <div
              style={{
                position: "absolute",
                left: GRID_LEFT + sweep,
                top: 96,
                bottom: 0,
                width: 4,
                borderRadius: 4,
                background: BLUE,
                opacity: sweepOpacity,
                boxShadow: "0 0 24px rgba(84,151,252,0.8)",
              }}
            />
          </AppWindow>
        </Reveal>

        <Reveal at={SWEEP_END - 4} style={{ position: "absolute", left: 0, right: 0, top: 92, display: "flex", justifyContent: "center" }}>
          <Pill icon={<CalendarIcon size={34} color={BLUE} />} size={34} style={{ fontWeight: 600 }}>
            Mapped out 6 months ahead
          </Pill>
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
