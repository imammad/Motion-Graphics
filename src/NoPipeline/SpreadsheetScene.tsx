import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ClockIcon, GridIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, GREY, INK } from "../Wave/theme";
import { Camera, Pill, Reveal } from "../Wave/ui";
import { AppWindow } from "../ToolStack/tools";

const COLS = [
  { label: "Name", width: 270 },
  { label: "Company", width: 240 },
  { label: "Email", width: 300 },
  { label: "Notes", width: 230 },
  { label: "Follow-up", width: 180 },
];
const ROWS = [
  ["Priya Shah", "Northwind", "priya@northwind.co"],
  ["Daniel Kim", "Harbor Labs", ""],
  ["Ana Ruiz", "Brightline Co.", "ana.ruiz@brightline.io"],
  ["Tom Baker", "", ""],
  ["Lena Ward", "Sunset Media", "lena@sunset.media"],
  ["Sam Ortiz", "Atlas Group", ""],
];
const ROW_H = 66;
const FORGET_AT = 46;

// "sitting in a spreadsheet nobody opens"
export const SpreadsheetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const forget = interpolate(frame, [FORGET_AT, FORGET_AT + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Camera zoom={[1.06, 1]}>
        <Reveal at={0} duration={22} y={50} style={{ position: "absolute", left: 310, top: 250 }}>
          <div style={{ filter: `grayscale(${forget * 0.8}) blur(${forget * 2.5}px)`, opacity: 1 - forget * 0.35 }}>
            <AppWindow tool={{ name: "Sheet", Icon: GridIcon }} title="badges_final_v3.xlsx" width={1300} height={620}>
              <div style={{ position: "absolute", left: 30, top: 120 }}>
                <div style={{ display: "flex", background: BLUE_MIST, borderRadius: 12 }}>
                  {COLS.map((c) => (
                    <div key={c.label} style={{ width: c.width, padding: "14px 18px", fontSize: 20, fontWeight: 600, color: INK, boxSizing: "border-box" }}>
                      {c.label}
                    </div>
                  ))}
                </div>
                {ROWS.map((r, i) => (
                  <div key={i} style={{ display: "flex", height: ROW_H, borderBottom: "2px solid #EEF2F8", alignItems: "center" }}>
                    {COLS.map((c, j) => (
                      <div
                        key={c.label}
                        style={{
                          width: c.width,
                          height: "100%",
                          padding: "0 18px",
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          fontSize: 20,
                          color: j === 0 ? INK : GREY,
                          borderLeft: j === 0 ? "none" : "2px solid #EEF2F8",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {r[j] ?? ""}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </AppWindow>
          </div>
        </Reveal>

        <Reveal at={24} from={0.7} style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
          <Pill icon={<ClockIcon size={32} color={BLUE} />} size={32} style={{ fontWeight: 600 }}>
            Last opened 47 days ago
          </Pill>
        </Reveal>
      </Camera>
    </AbsoluteFill>
  );
};
