/*
Scene: Booked the events · full screen · 4s · style: brand
Message: answer #1, "they booked the events".
Category: object-centric
Focal (centre): an event ticket
Supporting: the person who said it (chip on the ticket corner), a mini October calendar
Depth: faint tickets at the edges
Beats: 0.1s headline · 0.2s ticket pops · 0.8s person chip · 1.1s calendar · 2.1s snap: BOOKED stamp · hold
Camera: tracks down from the headline to the ticket (y +30 → −10), 1.06 → 1.0
*/
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Card, Headline, MicroLabel, progress } from "../MGKit";
import { BRAND } from "./brand";
import { Avatar, DepthItem, Enter, Float, Scene } from "./parts";

const SNAP = 62;
const NOTCH = "#F6F9FF";

const Ticket: React.FC<{ stamp?: number }> = ({ stamp = 0 }) => (
  <div style={{ display: "flex", width: 980, height: 330, position: "relative" }}>
    <div style={{ flex: 1, padding: "40px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <MicroLabel>Admit one · Field event</MicroLabel>
      <div
        style={{
          fontFamily: BRAND.sansFont,
          fontWeight: 700,
          fontSize: 60,
          color: BRAND.ink,
          letterSpacing: "-0.02em",
        }}
      >
        Industry Summit
      </div>
      <div style={{ display: "flex", gap: 56 }}>
        {[
          ["Date", "Oct 14"],
          ["Time", "9:00 AM"],
          ["Venue", "Hall B"],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <MicroLabel style={{ fontSize: 15 }}>{k}</MicroLabel>
            <div style={{ fontFamily: BRAND.sansFont, fontWeight: 600, fontSize: 28, color: BRAND.ink }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ width: 0, borderLeft: "3px dashed rgba(61,138,252,0.25)", margin: "26px 0" }} />
    <div
      style={{
        width: 230,
        background: BRAND.accentGradient,
        borderTopRightRadius: 36,
        borderBottomRightRadius: 36,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
      }}
    >
      <MicroLabel style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>No. 0041</MicroLabel>
      <div style={{ display: "flex", gap: 4, height: 120, alignItems: "stretch" }}>
        {[3, 1, 2, 4, 1, 3, 1, 2, 1, 4, 2, 1, 3].map((w, i) => (
          <div key={i} style={{ width: w * 2.5, background: "rgba(255,255,255,0.9)", borderRadius: 1 }} />
        ))}
      </div>
    </div>
    {[0, 1].map((b) => (
      <div
        key={b}
        style={{
          position: "absolute",
          right: 230 - 22,
          [b ? "bottom" : "top"]: -22,
          width: 44,
          height: 44,
          borderRadius: 44,
          background: NOTCH,
        }}
      />
    ))}
    <div
      style={{
        position: "absolute",
        left: 500,
        top: 50,
        padding: "10px 30px",
        border: `6px solid ${BRAND.accent}`,
        borderRadius: 18,
        color: BRAND.accent,
        fontFamily: BRAND.sansFont,
        fontWeight: 800,
        fontSize: 58,
        letterSpacing: 8,
        rotate: "-10deg",
        opacity: stamp,
        scale: interpolate(stamp, [0, 1], [1.7, 1]),
        background: "rgba(255,255,255,0.75)",
      }}
    >
      BOOKED
    </div>
  </div>
);

export const EventsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = progress(frame, SNAP, 8);

  return (
    <Scene cam={[{ at: 0, scale: 1.06, y: 30 }, { at: 120, scale: 1, y: -10 }]} focusY={60}>
      {[
        [170, 900, -14, 0],
        [1770, 260, 12, 2],
      ].map(([x, y, r, ph], i) => (
        <DepthItem key={i} x={x} y={y} rotate={r} scale={0.42} at={8} phase={ph} blur={4} opacity={0.4}>
          <div style={{ background: BRAND.card, borderRadius: 36, boxShadow: BRAND.cardShadow }}>
            <Ticket />
          </div>
        </DepthItem>
      ))}

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 86 }}>
        <Headline rows={["One person will tell you", "they *booked the events*"]} at={2} sansSize={60} displaySize={120} />
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 960, top: 640, translate: "-50% -50%" }}>
        <Float amp={5}>
          <Card at={6} radius={36}>
            <Ticket stamp={stamp} />
          </Card>
        </Float>
      </div>

      <div style={{ position: "absolute", left: 400, top: 420 }}>
        <Float amp={7} phase={1.4}>
          <Enter at={24}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 28px 14px 14px",
                borderRadius: 999,
                background: BRAND.card,
                boxShadow: BRAND.cardShadow,
                border: `1px solid ${BRAND.cardBorder}`,
              }}
            >
              <Avatar size={56} />
              <div>
                <MicroLabel style={{ fontSize: 14 }}>Person #1</MicroLabel>
                <div style={{ fontFamily: BRAND.sansFont, fontWeight: 600, fontSize: 24, color: BRAND.ink }}>Sales</div>
              </div>
            </div>
          </Enter>
        </Float>
      </div>

      <div style={{ position: "absolute", left: 1290, top: 740 }}>
        <Float amp={6} phase={2.6}>
          <Card at={34} radius={26} style={{ padding: "20px 24px", rotate: "4deg" }}>
            <MicroLabel style={{ fontSize: 14 }}>October</MicroLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 30px)", gap: 6, marginTop: 12 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 30,
                    borderRadius: 8,
                    background: i === 13 ? BRAND.accent : "#EEF2F8",
                    boxShadow: i === 13 ? `0 6px 14px ${BRAND.accentGlow}` : undefined,
                    scale: i === 13 ? 1 + Math.sin(progress(frame, SNAP, 10) * Math.PI) * 0.25 : 1,
                  }}
                />
              ))}
            </div>
          </Card>
        </Float>
      </div>
    </Scene>
  );
};
