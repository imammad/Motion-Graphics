import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, Look, PEOPLE } from "../Wave/Avatar";
import { LockIcon } from "../Wave/Icons";
import { BLUE_MIST, BLUE_PALE, EASE, GREY } from "../Wave/theme";
import { Bar, Camera, Headline, Pill, Reveal } from "../Wave/ui";
import { AppWindow, TOOLS } from "./tools";

const W = 760;
const H = 460;
const CX = 960;
const FRONT_TOP = 380;
const STEP = 72;
const DROP_AT = 12;
const DROP_GAP = 12;
const PEOPLE_AT = 92;

const COLLEAGUES: { look: Look; left: number; top: number }[] = [
  { look: PEOPLE.a, left: 170, top: 330 },
  { look: PEOPLE.c, left: 260, top: 680 },
  { look: PEOPLE.d, left: 1620, top: 330 },
  { look: PEOPLE.f, left: 1530, top: 680 },
];

// Placeholder rows so each window reads as a real app at a glance.
const Rows: React.FC<{ count: number }> = ({ count }) => (
  <div style={{ padding: "28px 34px", display: "flex", flexDirection: "column", gap: 22 }}>
    {new Array(count).fill(0).map((_, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: BLUE_MIST }} />
        <Bar width={220 - (i % 3) * 40} height={14} />
        <div style={{ flex: 1 }} />
        <Bar width={110} height={14} color="#EEF2F8" />
      </div>
    ))}
  </div>
);

// "a stack of tools most people on the company never opens"
export const StackScene: React.FC = () => {
  const frame = useCurrentFrame();
  // Back to front: lead capture lands first, CRM ends on top.
  const order = [3, 2, 1, 0];

  return (
    <AbsoluteFill>
      <Camera zoom={[1.02, 1.07]}>
        <Headline at={0} style={{ top: 70 }}>
          A stack of tools
        </Headline>

        <div style={{ position: "absolute", inset: 0, perspective: 2600 }}>
          {order.map((toolIndex, k) => {
            const depth = toolIndex;
            const at = DROP_AT + k * DROP_GAP;
            const settle = interpolate(frame, [at, at + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
            return (
              <div
                key={toolIndex}
                style={{
                  position: "absolute",
                  left: CX - W / 2,
                  top: FRONT_TOP - depth * STEP,
                  rotate: "x 14deg",
                  scale: String(1 - depth * 0.06),
                  translate: `0px ${(1 - settle) * -160}px`,
                  opacity: settle,
                  filter: `blur(${(1 - settle) * 16 + depth * 0.6}px)`,
                }}
              >
                <AppWindow tool={TOOLS[toolIndex]} width={W} height={H}>
                  <Rows count={5} />
                </AppWindow>
              </div>
            );
          })}
        </div>

        {COLLEAGUES.map((c, i) => (
          <Reveal
            key={i}
            at={PEOPLE_AT + i * 9}
            x={c.left < CX ? -30 : 30}
            style={{ position: "absolute", left: c.left, top: c.top, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}
          >
            <div style={{ filter: "grayscale(0.55)", opacity: 0.85 }}>
              <Avatar look={c.look} size={130} />
            </div>
            <Pill icon={<LockIcon size={22} color={GREY} />} size={22} color={GREY} style={{ boxShadow: `0 10px 24px ${BLUE_PALE}` }}>
              Never opened
            </Pill>
          </Reveal>
        ))}
      </Camera>
    </AbsoluteFill>
  );
};
