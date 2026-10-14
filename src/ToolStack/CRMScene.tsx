import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Avatar, Look, PEOPLE } from "../Wave/Avatar";
import { TicketIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, GREY, INK } from "../Wave/theme";
import { Bar, Camera, Card, Check, Defocus, Reveal } from "../Wave/ui";
import { AppWindow, TOOLS } from "./tools";

const WIN_LEFT = 150;
const WIN_TOP = 170;
const ROW_TOP = 176;
const ROW_H = 108;
const COL_EVENT = 470;
const COL_REP = 800;
const LAND_AT = 14;
const LAND_GAP = 14;
const EVENT_AT = 92;
const REP_AT = 136;
const TAG_GAP = 9;

const MARCUS = PEOPLE.sales;
const DANA = PEOPLE.e;

const LEADS: { name: string; company: string; look: Look; rep: string; repLook: Look }[] = [
  { name: "Priya Shah", company: "Northwind", look: PEOPLE.c, rep: "Marcus R.", repLook: MARCUS },
  { name: "Daniel Kim", company: "Harbor Labs", look: PEOPLE.a, rep: "Dana C.", repLook: DANA },
  { name: "Ana Ruiz", company: "Brightline Co.", look: PEOPLE.b, rep: "Marcus R.", repLook: MARCUS },
  { name: "Tom Baker", company: "Sunset Media", look: PEOPLE.f, rep: "Dana C.", repLook: DANA },
];

// "There's the CRM where every lead has to land and get tied back to the right event and the right rep."
export const CRMScene: React.FC = () => {
  const frame = useCurrentFrame();
  const landed = LEADS.filter((_, i) => frame >= LAND_AT + i * LAND_GAP + 10).length;

  return (
    <AbsoluteFill>
      <Camera zoom={[1.02, 1.07]} origin="40% 50%">
        <Defocus left={1660} top={880} blur={14} drift={[-30, -30]} opacity={0.7}>
          <Card width={320} height={120} radius={30} />
        </Defocus>

        <Reveal at={0} duration={24} y={50} style={{ position: "absolute", left: WIN_LEFT, top: WIN_TOP }}>
          <AppWindow
            tool={TOOLS[0]}
            title="CRM · Leads"
            width={1100}
            height={760}
            right={
              <div style={{ fontSize: 22, color: BLUE, background: BLUE_MIST, borderRadius: 999, padding: "8px 18px", fontWeight: 500 }}>
                {landed} new
              </div>
            }
          >
            <div style={{ position: "absolute", top: 118, left: 40, right: 40, display: "flex", fontSize: 20, color: GREY, letterSpacing: 1 }}>
              <div style={{ width: COL_EVENT - 40 }}>LEAD</div>
              <div style={{ width: COL_REP - COL_EVENT }}>EVENT</div>
              <div>REP</div>
            </div>

            {LEADS.map((lead, i) => (
              <div
                key={lead.name}
                style={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  top: ROW_TOP + i * ROW_H,
                  height: ROW_H - 12,
                  borderBottom: "2px solid #EEF2F8",
                }}
              >
                <Reveal at={LAND_AT + i * LAND_GAP} x={420} y={-30} blur={20} style={{ position: "absolute", left: 16, top: 12, display: "flex", alignItems: "center", gap: 18 }}>
                  <Avatar look={lead.look} size={66} />
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 600, color: INK }}>{lead.name}</div>
                    <div style={{ fontSize: 20, color: GREY }}>{lead.company}</div>
                  </div>
                </Reveal>

                <Reveal at={EVENT_AT + i * TAG_GAP} y={0} x={-20} from={0.8} style={{ position: "absolute", left: COL_EVENT - 24, top: 26 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: BLUE_MIST, color: BLUE, borderRadius: 999, padding: "10px 18px", fontSize: 21, fontWeight: 500 }}>
                    <TicketIcon size={22} color={BLUE} />
                    SaaS Connect 2026
                  </div>
                </Reveal>

                <Reveal at={REP_AT + i * TAG_GAP} y={0} x={-20} from={0.8} style={{ position: "absolute", left: COL_REP - 24, top: 18, display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar look={lead.repLook} size={58} />
                  <div style={{ fontSize: 22, fontWeight: 500, color: INK }}>{lead.rep}</div>
                  <Check size={30} />
                </Reveal>
              </div>
            ))}

            <div style={{ position: "absolute", left: 40, top: ROW_TOP + 4 * ROW_H + 24, display: "flex", alignItems: "center", gap: 18, opacity: 0.6 }}>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: BLUE_MIST }} />
              <Bar width={200} height={14} />
            </div>
          </AppWindow>
        </Reveal>

        <Reveal at={EVENT_AT - 10} x={40} style={{ position: "absolute", left: 1330, top: 250 }}>
          <Card width={440} height={220} padding={34} style={{ boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 22, color: GREY }}>Right event</div>
              <Check size={36} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 600, color: INK, marginTop: 18 }}>
              <TicketIcon size={32} color={BLUE} />
              SaaS Connect 2026
            </div>
            <div style={{ fontSize: 22, color: GREY, marginTop: 8 }}>Booth 214 · Austin, TX</div>
          </Card>
        </Reveal>

        <Reveal at={REP_AT - 10} x={40} style={{ position: "absolute", left: 1330, top: 530 }}>
          <Card width={440} height={220} padding={34} style={{ boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 22, color: GREY }}>Right rep</div>
              <Check size={36} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
              <Avatar look={MARCUS} size={76} />
              <div>
                <div style={{ fontSize: 28, fontWeight: 600, color: INK }}>Marcus Reed</div>
                <div style={{ fontSize: 20, color: GREY }}>Account Exec · West</div>
              </div>
            </div>
          </Card>
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
