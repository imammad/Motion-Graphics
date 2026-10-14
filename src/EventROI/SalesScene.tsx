import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Avatar, PEOPLE } from "../Wave/Avatar";
import { SearchIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, BLUE_PALE, GREY, INK } from "../Wave/theme";
import { Bar, Bubble, Camera, Card, Defocus, Reveal } from "../Wave/ui";

const ASK = 22;

// "and sales asks where the leads are"
export const SalesScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Camera zoom={[1.03, 1.08]} pan={[30, 0]}>
        <Defocus left={1620} top={60} blur={14} drift={[-20, 30]} opacity={0.7}>
          <Avatar look={PEOPLE.b} size={140} />
        </Defocus>

        <Reveal at={0} duration={22} x={-60} style={{ position: "absolute", left: 210, top: 210 }}>
          <Card width={680} height={640} padding={44} style={{ boxSizing: "border-box" }}>
            <div style={{ fontSize: 36, fontWeight: 600, color: INK }}>Leads</div>
            <div style={{ fontSize: 22, color: GREY, marginTop: 4 }}>From SaaS Connect 2026</div>
            <div
              style={{
                marginTop: 28,
                height: 64,
                borderRadius: 999,
                background: BLUE_MIST,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 24px",
              }}
            >
              <SearchIcon size={28} color={BLUE} />
              <Bar width={200} height={12} color={BLUE_PALE} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 56 }}>
              <div
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  background: BLUE_MIST,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: String(1 + Math.sin(frame / 8) * 0.03),
                }}
              >
                <SearchIcon size={64} color={BLUE} />
              </div>
              <div style={{ fontSize: 34, fontWeight: 600, color: INK, marginTop: 26 }}>No leads yet</div>
              <div style={{ fontSize: 24, color: GREY, marginTop: 6 }}>0 handed to sales</div>
            </div>
          </Card>
        </Reveal>

        <Reveal at={8} x={40} style={{ position: "absolute", left: 1520, top: 250 }}>
          <Avatar look={PEOPLE.sales} size={180} />
        </Reveal>
        <Reveal at={ASK} x={30} style={{ position: "absolute", right: 210, top: 470, display: "flex", justifyContent: "flex-end" }}>
          <Bubble name="Marcus · Sales" text="And where are the leads?" size={40} tone="blue" tail="right" maxWidth={640} />
        </Reveal>

      </Camera>
    </AbsoluteFill>
  );
};
