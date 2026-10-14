import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, PEOPLE } from "../Wave/Avatar";
import { BriefcaseIcon } from "../Wave/Icons";
import { BLUE, EASE_IN_OUT } from "../Wave/theme";
import { Bubble, Camera, Connector, Pill, Reveal, Rings } from "../Wave/ui";

const HERO = 300;
const CX = 960;
const CY = 470;
const SIDE = 170;
const LOOK_AT = 40;
const FOCUS_AT = 92;

// "and both of them are looking at the same person for an answer"
export const SamePersonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const focus = interpolate(frame, [FOCUS_AT, FOCUS_AT + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
  const sideStyle: React.CSSProperties = { filter: `blur(${focus * 6}px)`, opacity: 1 - focus * 0.35 };

  return (
    <AbsoluteFill>
      <Camera zoom={[1, 1.14]} origin={`${CX}px ${CY + 60}px`}>
        <div style={sideStyle}>
          <Connector x1={390} y1={CY} x2={CX - HERO / 2 - 40} y2={CY} at={LOOK_AT} duration={28} bend={-50} />
          <Connector x1={1530} y1={CY} x2={CX + HERO / 2 + 40} y2={CY} at={LOOK_AT + 6} duration={28} bend={-50} />

          <Reveal at={6} x={-40} style={{ position: "absolute", left: 285 - SIDE / 2, top: CY - SIDE / 2 }}>
            <Avatar look={PEOPLE.finance} size={SIDE} />
          </Reveal>
          <Reveal at={18} y={20} style={{ position: "absolute", left: 120, top: 190 }}>
            <Bubble text="What did it return?" size={30} maxWidth={420} />
          </Reveal>

          <Reveal at={10} x={40} style={{ position: "absolute", left: 1635 - SIDE / 2, top: CY - SIDE / 2 }}>
            <Avatar look={PEOPLE.sales} size={SIDE} />
          </Reveal>
          <Reveal at={24} y={20} style={{ position: "absolute", right: 120, top: 190 }}>
            <Bubble text="Where are the leads?" size={30} tone="blue" tail="right" maxWidth={420} />
          </Reveal>
        </div>

        <Reveal at={0} duration={26} from={0.85} style={{ position: "absolute", left: CX - HERO / 2, top: CY - HERO / 2, width: HERO, height: HERO }}>
          <Rings size={HERO} />
          <div style={{ position: "relative" }}>
            <Avatar look={PEOPLE.fmm} size={HERO} />
          </div>
        </Reveal>

        <Reveal at={LOOK_AT + 26} style={{ position: "absolute", left: 0, right: 0, top: CY + HERO / 2 + 60, display: "flex", justifyContent: "center" }}>
          <Pill icon={<BriefcaseIcon size={34} color={BLUE} />} size={34} style={{ fontWeight: 600 }}>
            Field Marketing Manager
          </Pill>
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
