import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ChartIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, BLUE_PALE, EASE, GREY, INK } from "../Wave/theme";
import { Camera, Card, Reveal } from "../Wave/ui";

const WEEKS = 8;
const CHART_H = 300;
const BAR_W = 70;
const EXPECTED = [0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95];
const GHOST_AT = 14;
const SINK_AT = 48;

// "then the pipeline never shows up"
export const PipelineScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Camera zoom={[1, 1.05]}>
        <Reveal at={0} duration={22} y={50} style={{ position: "absolute", left: 410, top: 200 }}>
          <Card width={1100} height={680} padding={50} style={{ boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600, color: INK }}>
                  <ChartIcon size={34} color={BLUE} />
                  Event-sourced pipeline
                </div>
                <div style={{ fontSize: 22, color: GREY, marginTop: 6 }}>SaaS Connect 2026 · last 8 weeks</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 88, fontWeight: 600, color: INK, lineHeight: 1 }}>$0</div>
                <div style={{ fontSize: 22, color: GREY, marginTop: 8 }}>of $250K target</div>
              </div>
            </div>

            <div style={{ position: "absolute", left: 50, right: 50, bottom: 90, height: CHART_H }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, borderTop: `3px dashed ${BLUE_PALE}` }} />
              <div style={{ position: "absolute", right: 0, top: -34, fontSize: 18, color: GREY }}>Target</div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: "#E6ECF5" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 20px" }}>
                {EXPECTED.map((h, i) => {
                  const ghost = interpolate(frame, [GHOST_AT + i * 3, GHOST_AT + i * 3 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
                  const actual = interpolate(frame, [GHOST_AT + i * 3, GHOST_AT + i * 3 + 12, SINK_AT + i * 2, SINK_AT + i * 2 + 14], [0, 0.12, 0.12, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE,
                  });
                  return (
                    <div key={i} style={{ position: "relative", width: BAR_W, height: CHART_H }}>
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          width: BAR_W,
                          height: CHART_H * h * ghost,
                          borderRadius: 18,
                          border: `3px dashed ${BLUE_PALE}`,
                          boxSizing: "border-box",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          width: BAR_W,
                          height: Math.max(6, CHART_H * h * actual),
                          borderRadius: 18,
                          background: actual > 0.01 ? BLUE : BLUE_MIST,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ position: "absolute", left: 70, right: 70, bottom: 44, display: "flex", justifyContent: "space-between", fontSize: 18, color: GREY }}>
              {new Array(WEEKS).fill(0).map((_, i) => (
                <div key={i} style={{ width: BAR_W, textAlign: "center" }}>
                  Wk {i + 1}
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
