/*
Scene: Hook · full screen · 3.3s · style: brand (white + #3D8AFC)
Message: we asked 10 different people the same question.
Category: text-centric
Focal (centre): "Ask *10 people*" / "at your company"
Supporting: the 10-person tracker filling up, "ASKED 0/10" counting
Depth: faint department pills drifting at the edges
Beats: 0.1s headline writes on · 0.6s people fill in, one every 4f · 2.1s snap: 10/10 turns accent · hold
Camera: slow zoom-out 1.08 → 1.0
*/
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Headline, MicroLabel, progress } from "../MGKit";
import { BRAND } from "./brand";
import { DepthItem, DotEvent, Scene, Tracker } from "./parts";

const DEPARTMENTS: [string, number, number][] = [
  ["Sales", 260, 190],
  ["Product", 1640, 210],
  ["Finance", 170, 640],
  ["Customer Success", 1700, 700],
  ["Engineering", 420, 930],
  ["Ops", 1480, 940],
];

const ASK_AT = (i: number) => 20 + i * 4;
const SNAP = 62;

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const asked = Math.min(10, Math.max(0, Math.floor((frame - 20) / 4) + 1));
  const dots: DotEvent[][] = Array.from({ length: 10 }, (_, i) => [{ at: ASK_AT(i), state: "asked" }]);
  const snap = progress(frame, SNAP, 8);

  return (
    <Scene cam={[{ at: 0, scale: 1.08 }, { at: 100, scale: 1 }]} focusY={42}>
      {DEPARTMENTS.map(([label, x, y], i) => (
        <DepthItem key={label} x={x} y={y} at={4 + i * 4} phase={i} blur={2.5} opacity={0.55}>
          <div
            style={{
              padding: "14px 26px",
              borderRadius: 999,
              background: BRAND.card,
              boxShadow: BRAND.cardShadow,
              border: `1px solid ${BRAND.cardBorder}`,
            }}
          >
            <MicroLabel style={{ fontSize: 20 }}>{label}</MicroLabel>
          </div>
        </DepthItem>
      ))}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 90, paddingBottom: 20 }}>
        <Headline rows={["Ask *10 people*", "at your company"]} at={3} sansSize={76} displaySize={150} />
        <div style={{ scale: 1 + Math.sin(snap * Math.PI) * 0.04 }}>
          <Tracker
            dots={dots}
            size={70}
            label={
              <span style={{ color: snap > 0.5 ? BRAND.accent : undefined }}>
                Asked {asked} / 10
              </span>
            }
          />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
