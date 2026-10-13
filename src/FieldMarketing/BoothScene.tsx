import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { Cursor } from "./Cursor";
import { Quote } from "./Quote";
import { Window } from "./Window";
import { BLUE, BLUE_GRADIENT, BLUE_TINT, INK, MUTED, WHITE, fontFamily } from "./theme";

const CLICK_AT = 92;

const BoothIcon = () => (
  <svg width={56} height={56} viewBox="0 0 56 56">
    <path d="M8 18 L28 8 L48 18 Z" fill={WHITE} />
    <rect x={10} y={20} width={36} height={6} rx={2} fill={WHITE} opacity={0.85} />
    <rect x={12} y={28} width={4} height={20} rx={2} fill={WHITE} />
    <rect x={40} y={28} width={4} height={20} rx={2} fill={WHITE} />
    <rect x={18} y={36} width={20} height={12} rx={3} fill={WHITE} opacity={0.85} />
  </svg>
);

const PenIcon = () => (
  <svg width={56} height={56} viewBox="0 0 56 56">
    <g transform="rotate(-40 28 28)">
      <rect x={24} y={6} width={9} height={36} rx={4} fill={WHITE} />
      <path d="M24 42 L28.5 52 L33 42 Z" fill={WHITE} opacity={0.85} />
      <rect x={31} y={10} width={3} height={14} rx={1.5} fill={WHITE} opacity={0.7} />
    </g>
  </svg>
);

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

// "Another will say they ordered the booth and the branded pens."
export const BoothScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const win = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 110 } });
  const pens = interpolate(frame, [40, 70], [0, 500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const progress = interpolate(frame, [CLICK_AT, CLICK_AT + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const done = progress >= 1;
  const press = interpolate(frame, [CLICK_AT - 4, CLICK_AT, CLICK_AT + 6], [1, 0.93, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const items = [
    { icon: <BoothIcon />, name: "10×10 Trade Show Booth", qty: "Qty 1", price: 4800, delay: 18 },
    {
      icon: <PenIcon />,
      name: "Branded Pens",
      qty: `Qty ${Math.round(pens)}`,
      price: pens * 0.7,
      delay: 30,
    },
  ];

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Background />
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 140px",
        }}
      >
        <Window
          title="Checkout · Order #4021"
          width={860}
          height={720}
          style={{
            opacity: win,
            translate: `${interpolate(win, [0, 1], [-120, 0])}px 0px`,
            rotate: `${interpolate(win, [0, 1], [-4, 0])}deg`,
          }}
        >
          <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: 20 }}>
            {items.map((it, i) => {
              const s = spring({ frame: frame - it.delay, fps, config: { damping: 15, stiffness: 140 } });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    padding: 22,
                    borderRadius: 22,
                    background: "#F6F9FE",
                    border: `1.5px solid ${BLUE_TINT}`,
                    opacity: s,
                    translate: `0px ${interpolate(s, [0, 1], [40, 0])}px`,
                  }}
                >
                  <div
                    style={{
                      width: 92,
                      height: 92,
                      borderRadius: 24,
                      background: BLUE_GRADIENT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 12px 26px rgba(61,138,252,0.35)",
                    }}
                  >
                    {it.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: INK }}>{it.name}</div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: MUTED, marginTop: 6 }}>{it.qty}</div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: INK }}>{money(it.price)}</div>
                </div>
              );
            })}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "18px 6px 0",
                borderTop: `1.5px dashed ${BLUE_TINT}`,
                marginTop: 8,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 600, color: MUTED }}>Total</div>
              <div style={{ fontSize: 56, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>
                {money(4800 + pens * 0.7)}
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 36,
              right: 36,
              bottom: 32,
              height: 84,
              borderRadius: 20,
              background: done ? BLUE_GRADIENT : INK,
              overflow: "hidden",
              scale: press,
              boxShadow: done ? "0 18px 40px rgba(61,138,252,0.45)" : "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${progress * 100}%`,
                background: BLUE,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: WHITE,
                fontSize: 30,
                fontWeight: 700,
              }}
            >
              {done ? "Ordered ✓" : progress > 0 ? "Placing order…" : "Place order"}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translate: `${interpolate(frame, [50, CLICK_AT - 6], [-80, 470], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.45, 0, 0.2, 1),
              })}px ${interpolate(frame, [50, CLICK_AT - 6], [380, 590], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.45, 0, 0.2, 1),
              })}px`,
              scale: press,
            }}
          >
            <Cursor />
          </div>
        </Window>

        <Quote
          label="ANOTHER SAYS"
          start={6}
          segments={[
            { text: "“They ordered the" },
            { text: "booth", accent: true },
            { text: "and the" },
            { text: "branded pens.”", accent: true },
          ]}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
