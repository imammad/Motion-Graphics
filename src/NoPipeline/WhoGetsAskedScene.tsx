import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, Look, PEOPLE } from "../Wave/Avatar";
import { BriefcaseIcon } from "../Wave/Icons";
import { BLUE, EASE_IN_OUT } from "../Wave/theme";
import { Bubble, Camera, Connector, Pill, Reveal, Rings } from "../Wave/ui";

const CX = 960;
const CY = 480;
const HERO = 280;
const SIDE = 140;
const FOCUS_AT = 96;

const ASKERS: { look: Look; x: number; y: number; ask: string; right: boolean }[] = [
  { look: PEOPLE.finance, x: 330, y: 300, ask: "Why no pipeline?", right: false },
  { look: PEOPLE.sales, x: 1590, y: 300, ask: "Where are the leads?", right: true },
  { look: PEOPLE.d, x: 390, y: 760, ask: "What happened?", right: false },
  { look: PEOPLE.e, x: 1530, y: 760, ask: "Why?", right: true },
];

// "And the person who gets asked why is the field marketing manager."
export const WhoGetsAskedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = interpolate(frame, [FOCUS_AT, FOCUS_AT + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT });

  return (
    <AbsoluteFill>
      <Camera zoom={[1, 1.14]} origin={`${CX}px ${CY + 60}px`}>
        <div style={{ filter: `blur(${focus * 6}px)`, opacity: 1 - focus * 0.35 }}>
          {ASKERS.map((a, i) => {
            const toX = a.x < CX ? CX - HERO / 2 - 30 : CX + HERO / 2 + 30;
            return (
              <Connector
                key={`c-${i}`}
                x1={a.x + (a.x < CX ? SIDE / 2 + 10 : -SIDE / 2 - 10)}
                y1={a.y}
                x2={toX}
                y2={CY + (a.y < CY ? -40 : 40)}
                at={30 + i * 6}
                duration={26}
                bend={a.y < CY ? -30 : 30}
              />
            );
          })}
          {ASKERS.map((a, i) => (
            <div key={i} style={{ position: "absolute", left: a.x - SIDE / 2, top: a.y - SIDE / 2 }}>
              <Reveal at={4 + i * 5} x={a.x < CX ? -40 : 40}>
                <Avatar look={a.look} size={SIDE} />
              </Reveal>
              <Reveal
                at={14 + i * 6}
                y={16}
                from={0.7}
                style={{
                  position: "absolute",
                  top: -86,
                  width: "max-content",
                  ...(a.right ? { right: -20 } : { left: -20 }),
                }}
              >
                <Bubble text={a.ask} size={28} tone={a.right ? "blue" : "white"} tail={a.right ? "right" : "left"} maxWidth={400} />
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal at={0} duration={26} from={0.85} style={{ position: "absolute", left: CX - HERO / 2, top: CY - HERO / 2, width: HERO, height: HERO }}>
          <Rings size={HERO} />
          <div style={{ position: "relative" }}>
            <Avatar look={PEOPLE.fmm} size={HERO} />
          </div>
        </Reveal>

        <Reveal at={80} style={{ position: "absolute", left: 0, right: 0, top: CY + HERO / 2 + 60, display: "flex", justifyContent: "center" }}>
          <Pill icon={<BriefcaseIcon size={36} color={BLUE} />} size={36} style={{ fontWeight: 600 }}>
            Field Marketing Manager
          </Pill>
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
