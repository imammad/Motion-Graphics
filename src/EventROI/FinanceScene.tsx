import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, PEOPLE } from "../Wave/Avatar";
import { TicketIcon } from "../Wave/Icons";
import { BLUE, BLUE_PALE, EASE, GREY, HEADER_GRADIENT, INK, WHITE } from "../Wave/theme";
import { Bar, Bubble, Camera, Card, Defocus, Reveal } from "../Wave/ui";

const COUNT_START = 16;
const COUNT_END = 46;
const ASK = 34;
const RETURN_AT = 70;

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 0", borderBottom: "2px solid #EEF2F8" }}>
    <div style={{ fontSize: 26, color: GREY }}>{label}</div>
    {children}
  </div>
);

// "finance asks what that $40,000 sponsorship actually returned"
export const FinanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const amount = Math.round(
    interpolate(frame, [COUNT_START, COUNT_END], [0, 40000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }),
  );
  const pulse = 1 + Math.max(0, Math.sin((frame - RETURN_AT) / 6)) * 0.08 * (frame > RETURN_AT + 14 ? 1 : 0);

  return (
    <AbsoluteFill>
      <Camera zoom={[1.03, 1.08]} pan={[-30, 0]}>
        <Defocus left={60} top={860} blur={14} drift={[30, -30]} opacity={0.7}>
          <Card width={380} height={130} radius={30} />
        </Defocus>

        <Reveal at={0} duration={24} x={60} style={{ position: "absolute", left: 1010, top: 250 }}>
          <Card width={700} height={560}>
            <div style={{ background: HEADER_GRADIENT, height: 150, padding: "34px 44px", boxSizing: "border-box", color: WHITE }}>
              <div style={{ fontSize: 24, opacity: 0.9 }}>Sponsorship</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 38, fontWeight: 600, marginTop: 4 }}>
                <TicketIcon size={38} color={WHITE} />
                SaaS Connect 2026
              </div>
            </div>
            <div style={{ padding: "10px 44px" }}>
              <Row label="Investment">
                <div style={{ fontSize: 48, fontWeight: 600, color: INK }}>${amount.toLocaleString("en-US")}</div>
              </Row>
              <Row label="Attributed pipeline">
                <Bar width={180} height={16} color={BLUE_PALE} />
              </Row>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 0" }}>
                <div style={{ fontSize: 26, color: GREY }}>Return</div>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: "#EEF4FE",
                    color: BLUE,
                    fontSize: 60,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 30px rgba(84,151,252,0.25)",
                    opacity: interpolate(frame, [RETURN_AT, RETURN_AT + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    scale: String(interpolate(frame, [RETURN_AT, RETURN_AT + 14], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE }) * pulse),
                  }}
                >
                  ?
                </div>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal at={14} x={-40} style={{ position: "absolute", left: 170, top: 250 }}>
          <Avatar look={PEOPLE.finance} size={180} />
        </Reveal>
        <Reveal at={ASK} x={-30} style={{ position: "absolute", left: 170, top: 470 }}>
          <Bubble
            name="Olivia · Finance"
            size={40}
            maxWidth={720}
            text={
              <>
                So what did that <span style={{ color: BLUE, fontWeight: 600 }}>$40,000</span> sponsorship actually return?
              </>
            }
          />
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
