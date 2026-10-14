import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, PEOPLE } from "../Wave/Avatar";
import { BriefcaseIcon } from "../Wave/Icons";
import { BLUE, BLUE_PALE, EASE } from "../Wave/theme";
import { Camera, Defocus, Pill, Reveal, Rings } from "../Wave/ui";
import { TOOLS, ToolTile } from "./tools";

const CX = 960;
const CY = 500;
const HERO = 260;
const RX = 560;
const RY = 320;
const ANGLES = [215, 325, 35, 145];
const TILE = 130;
const TILE_AT = 44;

// "And to answer for all of that, the field marketing manager lives inside"
export const LivesInsideScene: React.FC = () => {
  const frame = useCurrentFrame();
  const spin = frame * 0.12;
  const orbit = interpolate(frame, [26, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

  return (
    <AbsoluteFill>
      <Camera zoom={[1, 1.06]} origin={`${CX}px ${CY}px`}>
        <Defocus left={60} top={820} blur={14} drift={[30, -30]} opacity={0.7}>
          <Avatar look={PEOPLE.b} size={150} />
        </Defocus>
        <Defocus left={1700} top={60} blur={12} drift={[-30, 20]} opacity={0.7}>
          <Avatar look={PEOPLE.e} size={130} />
        </Defocus>

        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: orbit }}>
          <ellipse
            cx={CX}
            cy={CY}
            rx={RX * (0.8 + orbit * 0.2)}
            ry={RY * (0.8 + orbit * 0.2)}
            fill="none"
            stroke={BLUE_PALE}
            strokeWidth={3}
          />
        </svg>

        <Reveal at={0} duration={26} from={0.85} style={{ position: "absolute", left: CX - HERO / 2, top: CY - HERO / 2, width: HERO, height: HERO }}>
          <Rings size={HERO} />
          <div style={{ position: "relative" }}>
            <Avatar look={PEOPLE.fmm} size={HERO} />
          </div>
        </Reveal>

        <Reveal at={14} style={{ position: "absolute", left: 0, right: 0, top: CY + HERO / 2 + 70, display: "flex", justifyContent: "center" }}>
          <Pill icon={<BriefcaseIcon size={34} color={BLUE} />} size={34} style={{ fontWeight: 600 }}>
            Field Marketing Manager
          </Pill>
        </Reveal>

        {TOOLS.map((tool, i) => {
          const a = ((ANGLES[i] + spin) * Math.PI) / 180;
          return (
            <div
              key={tool.name}
              style={{
                position: "absolute",
                left: CX + RX * Math.cos(a) - TILE / 2,
                top: CY + RY * Math.sin(a) - TILE / 2,
              }}
            >
              <Reveal at={TILE_AT + i * 10} y={0} from={0.6}>
                <ToolTile tool={tool} size={TILE} />
              </Reveal>
            </div>
          );
        })}
      </Camera>
    </AbsoluteFill>
  );
};
