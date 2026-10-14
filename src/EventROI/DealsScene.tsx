import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, Look, PEOPLE } from "../Wave/Avatar";
import { ChartIcon, TicketIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, EASE, EASE_IN_OUT, GREY, INK } from "../Wave/theme";
import { Bubble, Camera, Card, Cursor, Defocus, Pill, Reveal } from "../Wave/ui";

const DEALS: { name: string; company: string; amount: string; stage: string; look: Look }[] = [
  { name: "Platform rollout", company: "Northwind", amount: "$48,000", stage: "Discovery", look: PEOPLE.a },
  { name: "Team licences", company: "Harbor Labs", amount: "$36,000", stage: "Demo", look: PEOPLE.d },
  { name: "Annual plan", company: "Keystone", amount: "$22,000", stage: "Proposal", look: PEOPLE.e },
  { name: "Enterprise deal", company: "Brightline Co.", amount: "$86,000", stage: "Negotiation", look: PEOPLE.c },
  { name: "Pilot expansion", company: "Sunset Media", amount: "$68,000", stage: "Proposal", look: PEOPLE.f },
  { name: "Renewal", company: "Atlas Group", amount: "$31,000", stage: "Discovery", look: PEOPLE.b },
  { name: "New workspace", company: "Orbit Studio", amount: "$27,000", stage: "Demo", look: PEOPLE.a },
];
const STAR = 3;
const ROW_H = 100;
const HEADER_H = 130;
const CARD_LEFT = 540;
const CARD_TOP = 170;
const HIGHLIGHT = 64;

// "deals that sales can point and say, that one started at the show"
export const DealsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [0, 60], [90, -10], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT });
  const focus = interpolate(frame, [HIGHLIGHT, HIGHLIGHT + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const starY = CARD_TOP + HEADER_H + STAR * ROW_H + scroll + ROW_H / 2;

  return (
    <AbsoluteFill>
      <Camera zoom={[1, 1.05]}>
        <Defocus left={1640} top={820} blur={14} drift={[-20, -40]} opacity={0.7}>
          <Avatar look={PEOPLE.d} size={160} />
        </Defocus>

        <Reveal at={0} duration={24} y={60} style={{ position: "absolute", left: CARD_LEFT, top: CARD_TOP, perspective: 2400 }}>
          <Card width={760} height={820} style={{ rotate: "x 8deg" }}>
            <div
              style={{
                height: HEADER_H,
                padding: "40px 40px 0",
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                position: "relative",
                zIndex: 2,
                background: "white",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 600, color: INK }}>
                <ChartIcon size={36} color={BLUE} />
                Pipeline
              </div>
              <div style={{ fontSize: 22, color: BLUE, background: BLUE_MIST, borderRadius: 999, padding: "8px 18px", fontWeight: 500 }}>
                Q3 · 7 deals
              </div>
            </div>
            {DEALS.map((d, i) => {
              const isStar = i === STAR;
              return (
                <div
                  key={d.company}
                  style={{
                    position: "absolute",
                    left: 24,
                    right: 24,
                    top: HEADER_H + i * ROW_H + scroll,
                    height: ROW_H - 12,
                    padding: "0 20px",
                    borderRadius: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    background: "white",
                    boxShadow: isStar ? `0 20px 50px rgba(84,151,252,${0.3 * focus}), inset 0 0 0 ${3 * focus}px ${BLUE}` : "none",
                    borderBottom: isStar ? "none" : "2px solid #EEF2F8",
                    scale: String(isStar ? 1 + focus * 0.06 : 1),
                    opacity: isStar ? 1 : 1 - focus * 0.5,
                    filter: `blur(${isStar ? 0 : focus * 2.5}px)`,
                    zIndex: isStar ? 1 : 0,
                  }}
                >
                  <Avatar look={d.look} size={64} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 26, fontWeight: 600, color: INK }}>{d.company}</div>
                    <div style={{ fontSize: 20, color: GREY }}>{d.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 26, fontWeight: 600, color: INK }}>{d.amount}</div>
                    <div style={{ fontSize: 18, color: BLUE }}>{d.stage}</div>
                  </div>
                </div>
              );
            })}
          </Card>
        </Reveal>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            translate: `${interpolate(frame, [40, HIGHLIGHT - 2], [1460, 1120], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT })}px ${interpolate(frame, [40, HIGHLIGHT - 2], [1000, starY], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT })}px`,
            opacity: interpolate(frame, [40, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <Cursor size={64} />
        </div>

        <Reveal at={HIGHLIGHT + 16} x={-30} style={{ position: "absolute", left: 1340, top: starY - 46 }}>
          <Pill icon={<TicketIcon size={30} color={BLUE} />} size={28}>
            Source: SaaS Connect 2026
          </Pill>
        </Reveal>

        <Reveal at={HIGHLIGHT + 38} x={-40} style={{ position: "absolute", left: 130, top: 300, display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
          <Avatar look={PEOPLE.sales} size={130} />
          <Bubble text="That one started at the show." name="Marcus · Sales" tone="blue" maxWidth={440} size={34} />
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
