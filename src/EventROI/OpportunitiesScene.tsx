import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Avatar, Look, PEOPLE } from "../Wave/Avatar";
import { CalendarIcon, PinIcon, TicketIcon } from "../Wave/Icons";
import { BLUE, BLUE_PALE, GREY, HEADER_GRADIENT, INK, WHITE } from "../Wave/theme";
import { Bar, Camera, Card, Connector, Defocus, Headline, Pill, Reveal } from "../Wave/ui";

const OPPORTUNITIES: { company: string; amount: number; look: Look; left: number; top: number; anchor: [number, number]; target: [number, number] }[] = [
  { company: "Northwind", amount: 48, look: PEOPLE.a, left: 150, top: 300, anchor: [570, 375], target: [690, 560] },
  { company: "Brightline Co.", amount: 62, look: PEOPLE.c, left: 150, top: 720, anchor: [570, 795], target: [690, 700] },
  { company: "Harbor Labs", amount: 36, look: PEOPLE.d, left: 1350, top: 300, anchor: [1350, 375], target: [1230, 560] },
  { company: "Sunset Media", amount: 68, look: PEOPLE.f, left: 1350, top: 720, anchor: [1350, 795], target: [1230, 700] },
];
const CARD_AT = 34;
const STAGGER = 12;
const LINE_DELAY = 10;
const LINE_DURATION = 26;

// "Real opportunities that trace back to the event"
export const OpportunitiesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const landed = OPPORTUNITIES.filter((_, i) => frame >= CARD_AT + i * STAGGER + LINE_DELAY + LINE_DURATION);
  const pipeline = landed.reduce((sum, o) => sum + o.amount, 0);

  return (
    <AbsoluteFill>
      <Camera zoom={[1, 1.06]}>
        <Defocus left={40} top={60} blur={12} drift={[20, -30]}>
          <Avatar look={PEOPLE.e} size={150} />
        </Defocus>
        <Defocus left={1580} top={960} blur={14} drift={[-30, -40]} opacity={0.7}>
          <Card width={360} height={140} radius={30} />
        </Defocus>

        <Headline at={0} style={{ top: 110 }}>
          Real opportunities
        </Headline>

        {OPPORTUNITIES.map((o, i) => (
          <Connector
            key={o.company}
            x1={o.anchor[0]}
            y1={o.anchor[1]}
            x2={o.target[0]}
            y2={o.target[1]}
            at={CARD_AT + i * STAGGER + LINE_DELAY}
            duration={LINE_DURATION}
            bend={i % 2 === 0 ? 60 : -60}
          />
        ))}

        <Reveal at={12} duration={24} style={{ position: "absolute", left: 680, top: 450 }}>
          <Card width={560} height={360}>
            <div style={{ background: HEADER_GRADIENT, height: 170, padding: "30px 36px", boxSizing: "border-box", color: WHITE }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 40, fontWeight: 600 }}>
                <TicketIcon size={40} color={WHITE} />
                SaaS Connect 2026
              </div>
              <div style={{ display: "flex", gap: 26, marginTop: 14, fontSize: 24, opacity: 0.95 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CalendarIcon size={24} color={WHITE} /> Sep 18–20
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PinIcon size={24} color={WHITE} /> Austin, TX
                </span>
              </div>
            </div>
            <div style={{ padding: "28px 36px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 22, color: GREY }}>Opportunities</div>
                <div style={{ fontSize: 52, fontWeight: 600, color: INK }}>{landed.length}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, color: GREY }}>Pipeline</div>
                <div style={{ fontSize: 52, fontWeight: 600, color: BLUE }}>${pipeline}K</div>
              </div>
            </div>
          </Card>
        </Reveal>

        {OPPORTUNITIES.map((o, i) => (
          <Reveal
            key={o.company}
            at={CARD_AT + i * STAGGER}
            x={o.left < 960 ? -40 : 40}
            style={{ position: "absolute", left: o.left, top: o.top }}
          >
            <Card width={420} height={150} radius={30} padding={24} style={{ display: "flex", alignItems: "center", gap: 22, boxSizing: "border-box" }}>
              <Avatar look={o.look} size={92} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 600, color: INK }}>{o.company}</div>
                <div style={{ fontSize: 22, color: GREY }}>${o.amount},000 · Opportunity</div>
                <Bar width={150} height={10} color={BLUE_PALE} />
              </div>
            </Card>
          </Reveal>
        ))}

        <Reveal at={CARD_AT + 3 * STAGGER + LINE_DELAY + 12} style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}>
          <Pill icon={<TicketIcon size={28} color={BLUE} />}>Traced back to the event</Pill>
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
