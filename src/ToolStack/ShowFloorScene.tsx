import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Avatar, Look, PEOPLE } from "../Wave/Avatar";
import { ScanIcon, TicketIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, EASE, GREY, HEADER_GRADIENT, INK, WHITE } from "../Wave/theme";
import { BlueButton, Camera, Card, Check, Defocus, Pill, Reveal } from "../Wave/ui";

const PHONE_LEFT = 740;
const PHONE_TOP = 120;
const PHONE_W = 420;
const PHONE_H = 840;
const VIEW_TOP = 150;
const VIEW_H = 470;
const SCAN_START = 22;
const SCAN_END = 56;
const CAPTURED = 60;
const LIST_AT = 92;
const LIST_GAP = 18;

const CAPTURES: { name: string; company: string; look: Look }[] = [
  { name: "Priya Shah", company: "Northwind", look: PEOPLE.c },
  { name: "Daniel Kim", company: "Harbor Labs", look: PEOPLE.a },
  { name: "Ana Ruiz", company: "Brightline Co.", look: PEOPLE.b },
];

const CROWD: { look: Look; left: number; top: number; size: number; blur: number }[] = [
  { look: PEOPLE.d, left: 90, top: 140, size: 150, blur: 10 },
  { look: PEOPLE.e, left: 380, top: 330, size: 120, blur: 4 },
  { look: PEOPLE.f, left: 150, top: 560, size: 170, blur: 8 },
  { look: PEOPLE.a, left: 470, top: 720, size: 110, blur: 3 },
  { look: PEOPLE.b, left: 60, top: 870, size: 130, blur: 14 },
];

// Deterministic QR-like pattern for the badge, with the three corner finder squares.
const QR_N = 11;
const isFinder = (r: number, c: number) =>
  [
    [0, 0],
    [0, QR_N - 3],
    [QR_N - 3, 0],
  ].some(([fr, fc]) => r >= fr && r < fr + 3 && c >= fc && c < fc + 3);
const QR = new Array(QR_N * QR_N).fill(0).map((_, i) => {
  const r = Math.floor(i / QR_N);
  const c = i % QR_N;
  return isFinder(r, c) || random(`qr-${i}`) > 0.5;
});

const Badge: React.FC = () => (
  <div style={{ width: 250, borderRadius: 26, background: WHITE, overflow: "hidden", boxShadow: "0 18px 40px rgba(10,10,22,0.12)" }}>
    <div style={{ background: HEADER_GRADIENT, padding: "16px 18px", color: WHITE, fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
      <TicketIcon size={20} color={WHITE} /> SaaS Connect 2026
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 16px 20px", gap: 6 }}>
      <Avatar look={PEOPLE.c} size={96} />
      <div style={{ fontSize: 22, fontWeight: 600, color: INK, marginTop: 8 }}>Priya Shah</div>
      <div style={{ fontSize: 15, color: GREY }}>VP Marketing · Northwind</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${QR_N}, 7px)`, gap: 1, marginTop: 10 }}>
        {QR.map((on, i) => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: 1.5, background: on ? INK : "transparent" }} />
        ))}
      </div>
    </div>
  </div>
);

// "And there's whatever they're carrying on the show floor to capture the people they meet."
export const ShowFloorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scanY = interpolate(frame, [SCAN_START, (SCAN_START + SCAN_END) / 2, SCAN_END], [40, VIEW_H - 40, 40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scanning = frame >= SCAN_START && frame < SCAN_END;
  const flash = interpolate(frame, [CAPTURED - 2, CAPTURED, CAPTURED + 10], [0, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sheet = interpolate(frame, [CAPTURED + 4, CAPTURED + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });
  const count = 34 + CAPTURES.filter((_, i) => frame >= LIST_AT + i * LIST_GAP).length;

  return (
    <AbsoluteFill>
      <Camera zoom={[1, 1.06]} origin="55% 50%">
        {CROWD.map((p, i) => (
          <Defocus key={i} left={p.left} top={p.top} blur={p.blur} drift={[i % 2 ? 30 : -20, -30]} opacity={0.85}>
            <Avatar look={p.look} size={p.size} />
          </Defocus>
        ))}

        <Reveal at={4} x={-30} style={{ position: "absolute", left: 130, top: 60 }}>
          <Pill icon={<TicketIcon size={28} color={BLUE} />} size={28} style={{ fontWeight: 600 }}>
            On the show floor
          </Pill>
        </Reveal>

        <Reveal at={0} duration={26} y={80} style={{ position: "absolute", left: PHONE_LEFT, top: PHONE_TOP, perspective: 2000 }}>
          <div
            style={{
              width: PHONE_W,
              height: PHONE_H,
              borderRadius: 64,
              background: WHITE,
              boxShadow: "0 50px 110px rgba(84,151,252,0.25), 0 12px 30px rgba(10,10,22,0.08), inset 0 0 0 10px #F2F6FD",
              overflow: "hidden",
              position: "relative",
              rotate: "y -8deg",
            }}
          >
            <div style={{ position: "absolute", left: PHONE_W / 2 - 60, top: 22, width: 120, height: 30, borderRadius: 20, background: "#E9EEF7" }} />
            <div style={{ position: "absolute", left: 40, top: 76, display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 600, color: INK }}>
              <ScanIcon size={30} color={BLUE} /> Scan badge
            </div>

            <div
              style={{
                position: "absolute",
                left: 30,
                right: 30,
                top: VIEW_TOP,
                height: VIEW_H,
                borderRadius: 36,
                background: "linear-gradient(180deg, #EAF1FD, #DCE8FB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <div style={{ rotate: `${interpolate(frame, [0, SCAN_END], [-6, -2], { extrapolateRight: "clamp" })}deg` }}>
                <Badge />
              </div>
              {[
                { left: 24, top: 24, r: 0 },
                { right: 24, top: 24, r: 90 },
                { right: 24, bottom: 24, r: 180 },
                { left: 24, bottom: 24, r: 270 },
              ].map(({ r, ...pos }) => (
                <svg key={r} width={56} height={56} viewBox="0 0 56 56" style={{ position: "absolute", ...pos, rotate: `${r}deg` }}>
                  <path d="M4 30 V14 A10 10 0 0 1 14 4 H30" stroke={BLUE} strokeWidth={7} fill="none" strokeLinecap="round" />
                </svg>
              ))}
              {scanning ? (
                <div
                  style={{
                    position: "absolute",
                    left: 30,
                    right: 30,
                    top: scanY,
                    height: 4,
                    borderRadius: 4,
                    background: BLUE,
                    boxShadow: "0 0 30px 6px rgba(84,151,252,0.6)",
                  }}
                />
              ) : null}
              <div style={{ position: "absolute", inset: 0, background: WHITE, opacity: flash }} />
            </div>

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 300,
                borderTopLeftRadius: 44,
                borderTopRightRadius: 44,
                background: WHITE,
                boxShadow: "0 -20px 50px rgba(84,151,252,0.18)",
                padding: "30px 40px",
                boxSizing: "border-box",
                translate: `0px ${(1 - sheet) * 320}px`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Check size={44} />
                <div style={{ fontSize: 30, fontWeight: 600, color: INK }}>Lead captured</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22 }}>
                <Avatar look={PEOPLE.c} size={64} />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: INK }}>Priya Shah</div>
                  <div style={{ fontSize: 18, color: GREY }}>Northwind</div>
                </div>
              </div>
              <div style={{ marginTop: 26 }}>
                <BlueButton width={340} size={22}>
                  Save to CRM
                </BlueButton>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal at={LIST_AT - 12} x={40} style={{ position: "absolute", left: 1260, top: 230 }}>
          <div style={{ fontSize: 24, color: GREY }}>Captured today</div>
          <div style={{ fontSize: 64, fontWeight: 600, color: INK }}>{count}</div>
        </Reveal>

        {CAPTURES.map((c, i) => (
          <Reveal key={c.name} at={LIST_AT + i * LIST_GAP} x={-60} style={{ position: "absolute", left: 1260, top: 380 + i * 160 }}>
            <Card width={480} height={130} radius={30} padding={24} style={{ display: "flex", alignItems: "center", gap: 20, boxSizing: "border-box" }}>
              <Avatar look={c.look} size={80} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 26, fontWeight: 600, color: INK }}>{c.name}</div>
                <div style={{ fontSize: 20, color: GREY }}>{c.company}</div>
              </div>
              <div style={{ fontSize: 18, color: BLUE, background: BLUE_MIST, borderRadius: 999, padding: "8px 14px", fontWeight: 500 }}>New lead</div>
            </Card>
          </Reveal>
        ))}
      </Camera>
    </AbsoluteFill>
  );
};
