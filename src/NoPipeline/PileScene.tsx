import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { Avatar, Look, PEOPLE } from "../Wave/Avatar";
import { TicketIcon } from "../Wave/Icons";
import { BLUE, BLUE_PALE, GREY, HEADER_GRADIENT, INK, WHITE } from "../Wave/theme";
import { Bubble, Camera, Headline, Pill, Reveal } from "../Wave/ui";

const CX = 960;
const CY = 590;
const DROP_AT = 34;
const DROP_GAP = 6;
const NO_CONTEXT_AT = 96;

const BADGES: { name: string; look: Look }[] = [
  { name: "Priya Shah", look: PEOPLE.c },
  { name: "Daniel Kim", look: PEOPLE.a },
  { name: "Ana Ruiz", look: PEOPLE.b },
  { name: "Tom Baker", look: PEOPLE.f },
  { name: "Lena Ward", look: PEOPLE.e },
  { name: "Sam Ortiz", look: PEOPLE.d },
  { name: "Jordan Lee", look: PEOPLE.a },
];

const MiniBadge: React.FC<{ name: string; look: Look }> = ({ name, look }) => (
  <div style={{ width: 230, borderRadius: 24, background: WHITE, overflow: "hidden", boxShadow: "0 24px 50px rgba(84,151,252,0.2), 0 6px 14px rgba(10,10,22,0.08)" }}>
    <div style={{ background: HEADER_GRADIENT, padding: "12px 16px", color: WHITE, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}>
      <TicketIcon size={17} color={WHITE} /> SaaS Connect 2026
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 16px 18px", gap: 4 }}>
      <Avatar look={look} size={78} />
      <div style={{ fontSize: 20, fontWeight: 600, color: INK, marginTop: 6 }}>{name}</div>
      <div style={{ width: "100%", marginTop: 10, fontSize: 13, color: GREY }}>Notes</div>
      <div style={{ width: "100%", height: 38, borderRadius: 10, border: `2px dashed ${BLUE_PALE}` }} />
    </div>
  </div>
);

// "if those conversations come home as a pile of scanned badges with no context"
export const PileScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Camera zoom={[1, 1.06]} origin={`${CX}px ${CY}px`}>
        <Reveal at={0} exitAt={30} x={-30} style={{ position: "absolute", left: 260, top: 330, display: "flex", alignItems: "flex-end", gap: 16 }}>
          <Avatar look={PEOPLE.c} size={90} />
          <Bubble text="Great chat! Send me the deck." size={32} maxWidth={420} />
        </Reveal>
        <Reveal at={8} exitAt={34} x={30} style={{ position: "absolute", right: 260, top: 470, display: "flex", alignItems: "flex-end", gap: 16 }}>
          <Bubble text="Let's talk next week." size={32} tone="blue" tail="right" maxWidth={420} />
          <Avatar look={PEOPLE.a} size={90} />
        </Reveal>

        {BADGES.map((b, i) => {
          const at = DROP_AT + i * DROP_GAP;
          const land = interpolate(frame, [at, at + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.34, 1.3, 0.64, 1),
          });
          const dx = (random(`x-${i}`) - 0.5) * 760;
          const dy = (random(`y-${i}`) - 0.5) * 200;
          const rot = (random(`r-${i}`) - 0.5) * 44;
          return (
            <div
              key={b.name}
              style={{
                position: "absolute",
                left: CX - 115 + dx,
                top: CY - 170 + dy,
                translate: `0px ${(1 - land) * -900}px`,
                rotate: `${rot * land + (1 - land) * rot * 2}deg`,
                scale: "1.4",
                opacity: frame >= at ? 1 : 0,
                filter: `blur(${interpolate(frame, [at, at + 10], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
              }}
            >
              <MiniBadge name={b.name} look={b.look} />
            </div>
          );
        })}

        <Headline at={DROP_AT} style={{ top: 100 }}>
          A pile of scanned badges
        </Headline>

        <Reveal at={NO_CONTEXT_AT} from={0.7} style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center" }}>
          <Pill
            size={32}
            style={{ fontWeight: 600 }}
            icon={
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: BLUE_PALE, color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700 }}>
                ?
              </div>
            }
          >
            No context
          </Pill>
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
