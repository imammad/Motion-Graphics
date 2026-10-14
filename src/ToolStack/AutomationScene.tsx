import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, PEOPLE } from "../Wave/Avatar";
import { BoltIcon, ClockIcon, MailIcon, ScanIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, EASE, GREY, INK, WHITE } from "../Wave/theme";
import { Bar, BlueButton, Camera, Card, Check, Connector, Pill, Reveal } from "../Wave/ui";

const Y = 520;
const NODE_W = 370;
const NODE_H = 150;
const NODES = [
  { left: 110, title: "Lead captured", sub: "Badge scanned", Icon: ScanIcon, fires: 26 },
  { left: 560, title: "Wait 1 day", sub: "Then continue", Icon: ClockIcon, fires: 58 },
  { left: 1010, title: "Follow-up email", sub: "Event template", Icon: MailIcon, fires: 90 },
];
const EMAIL_AT = 104;
const EMAIL_LEFT = 1480;

// "There's a marketing automation that fires off for the follow-up."
export const AutomationScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Camera zoom={[1.02, 1.06]}>
        <Reveal at={0} style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
          <Pill icon={<BoltIcon size={32} color={BLUE} />} size={32} style={{ fontWeight: 600 }}>
            Automation · Event follow-up
          </Pill>
        </Reveal>

        {NODES.slice(0, -1).map((n, i) => (
          <Connector key={n.title} x1={n.left + NODE_W} y1={Y} x2={NODES[i + 1].left} y2={Y} at={n.fires + 4} duration={NODES[i + 1].fires - n.fires - 4} />
        ))}
        <Connector x1={NODES[2].left + NODE_W} y1={Y} x2={EMAIL_LEFT} y2={Y} at={NODES[2].fires + 2} duration={EMAIL_AT - NODES[2].fires - 2} />

        {NODES.map((n, i) => {
          const on = interpolate(frame, [n.fires, n.fires + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
          return (
            <Reveal key={n.title} at={4 + i * 8} style={{ position: "absolute", left: n.left, top: Y - NODE_H / 2 }}>
              <Card
                width={NODE_W}
                height={NODE_H}
                radius={32}
                padding={26}
                style={{
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  boxShadow: `0 30px 70px rgba(84,151,252,${0.16 + on * 0.2}), inset 0 0 0 ${1.5 + on * 1.5}px ${on > 0.5 ? BLUE : "rgba(212,230,252,0.9)"}`,
                  scale: String(1 + Math.sin(on * Math.PI) * 0.05),
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: on > 0.5 ? BLUE : BLUE_MIST,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <n.Icon size={36} color={on > 0.5 ? WHITE : BLUE} />
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 600, color: INK }}>{n.title}</div>
                  <div style={{ fontSize: 19, color: GREY, marginTop: 2 }}>{n.sub}</div>
                </div>
              </Card>
            </Reveal>
          );
        })}

        <Reveal at={EMAIL_AT} x={-60} y={0} blur={20} style={{ position: "absolute", left: EMAIL_LEFT, top: Y - 170 }}>
          <Card width={340} height={340} padding={28} style={{ boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar look={PEOPLE.c} size={56} />
              <div>
                <div style={{ fontSize: 18, color: GREY }}>To: Priya Shah</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: INK }}>Great meeting you!</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 26 }}>
              <Bar width={270} height={12} />
              <Bar width={250} height={12} />
              <Bar width={180} height={12} />
            </div>
            <div style={{ marginTop: 30 }}>
              <BlueButton width={284} size={22}>
                Book a demo
              </BlueButton>
            </div>
          </Card>
        </Reveal>
        <Reveal at={EMAIL_AT + 18} y={0} from={0.4} style={{ position: "absolute", left: EMAIL_LEFT + 340 - 30, top: Y - 190 }}>
          <Check size={56} />
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
