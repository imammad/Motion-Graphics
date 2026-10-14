import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, PEOPLE } from "./Avatar";
import { CalendarIcon } from "./Icons";
import { BLUE, BLUE_MIST, BLUE_PALE, EASE, EASE_IN_OUT, GREY, INK, WHITE } from "./theme";
import { Bar, Camera, Card, Check, Cursor, Defocus, Headline, Reveal } from "./ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["9:00", "10:00", "11:00", "2:00"];
const TAKEN = new Set(["0-1", "1-3", "2-0", "4-2", "1-1"]);
const PICK = { col: 3, row: 1 };

const PAD = 36;
const SLOT_W = 114;
const SLOT_H = 80;
const GAP = 14;
const GRID_TOP = 200;
const CLICK = 44;

const BOOKINGS = [
  { who: PEOPLE.a, line: "Thu · 10:00 · Northwind" },
  { who: PEOPLE.c, line: "Fri · 11:00 · Brightline Co." },
  { who: PEOPLE.f, line: "Mon · 2:00 · Sunset Media" },
];

// "demos that got booked"
export const DemosScene: React.FC = () => {
  const frame = useCurrentFrame();
  const slotX = PAD + PICK.col * (SLOT_W + GAP);
  const slotY = GRID_TOP + PICK.row * (SLOT_H + GAP);
  const picked = frame >= CLICK;
  const press = interpolate(frame, [CLICK - 3, CLICK, CLICK + 6], [1, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Camera zoom={[1.02, 1.07]} pan={[-20, 0]}>
        <Defocus left={1700} top={70} blur={12} drift={[-20, 30]}>
          <Avatar look={PEOPLE.b} size={140} />
        </Defocus>

        <Headline at={0} style={{ top: 100 }}>
          Demos that got booked
        </Headline>

        <Reveal at={6} duration={24} x={-40} style={{ position: "absolute", left: 230, top: 280, perspective: 2200 }}>
          <div style={{ rotate: "y 12deg", transformStyle: "preserve-3d" }}>
            <Card width={700} height={600} style={{ rotate: "x 3deg" }}>
              <div style={{ padding: `${PAD}px ${PAD}px 0`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 600, color: INK }}>
                  <CalendarIcon size={36} color={BLUE} />
                  Book a demo
                </div>
                <div style={{ fontSize: 24, color: GREY }}>September</div>
              </div>
              <div style={{ position: "absolute", left: PAD, top: 140, display: "flex", gap: GAP }}>
                {DAYS.map((d) => (
                  <div key={d} style={{ width: SLOT_W, textAlign: "center", fontSize: 22, color: GREY }}>
                    {d}
                  </div>
                ))}
              </div>
              {DAYS.map((d, col) =>
                TIMES.map((t, row) => {
                  const key = `${col}-${row}`;
                  const isPick = col === PICK.col && row === PICK.row;
                  const active = isPick && picked;
                  return (
                    <div
                      key={key}
                      style={{
                        position: "absolute",
                        left: PAD + col * (SLOT_W + GAP),
                        top: GRID_TOP + row * (SLOT_H + GAP),
                        width: SLOT_W,
                        height: SLOT_H,
                        borderRadius: 20,
                        background: active ? BLUE : TAKEN.has(key) ? BLUE_MIST : WHITE,
                        boxShadow: active
                          ? "0 14px 30px rgba(84,151,252,0.45)"
                          : "inset 0 0 0 2px #E6ECF5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        fontSize: 22,
                        fontWeight: 500,
                        color: active ? WHITE : TAKEN.has(key) ? "transparent" : INK,
                        scale: String(isPick ? press : 1),
                      }}
                    >
                      {TAKEN.has(key) ? <Bar width={60} height={10} /> : t}
                    </div>
                  );
                }),
              )}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  translate: `${interpolate(frame, [14, CLICK - 4], [760, slotX + SLOT_W * 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT })}px ${interpolate(frame, [14, CLICK - 4], [640, slotY + SLOT_H * 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT })}px`,
                  opacity: interpolate(frame, [12, 18, 70, 80], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  scale: String(press),
                }}
              >
                <Cursor />
              </div>
            </Card>
          </div>
        </Reveal>

        {BOOKINGS.map((b, i) => (
          <Reveal key={b.line} at={CLICK + 6 + i * 12} x={60} style={{ position: "absolute", left: 1080, top: 330 + i * 170 }}>
            <Card width={620} height={136} radius={32} padding={26} style={{ display: "flex", alignItems: "center", gap: 24, boxSizing: "border-box" }}>
              <Avatar look={b.who} size={84} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 30, fontWeight: 600, color: INK }}>Demo booked</div>
                <div style={{ fontSize: 22, color: GREY, marginTop: 4 }}>{b.line}</div>
              </div>
              <div
                style={{
                  scale: String(interpolate(frame, [CLICK + 14 + i * 12, CLICK + 26 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE })),
                }}
              >
                <Check size={46} />
              </div>
            </Card>
          </Reveal>
        ))}

        <Defocus left={1240} top={880} blur={10} drift={[0, -30]} opacity={0.6}>
          <Card width={420} height={120} radius={30} padding={26} style={{ display: "flex", alignItems: "center", gap: 20, boxSizing: "border-box", background: BLUE_PALE }}>
            <Bar width={240} height={14} color={WHITE} />
          </Card>
        </Defocus>
      </Camera>
    </AbsoluteFill>
  );
};
