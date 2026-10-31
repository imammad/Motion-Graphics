/*
Scene: Booth and pens · full screen · 4.7s · style: brand
Message: answer #2, "they ordered the booth and the branded pens".
Category: object-centric
Focal (centre): a glossy branded pen swinging in
Supporting: a 10×10 booth card (left), an "Order placed" toast (bottom right)
Depth: small blurred pens scattered at the edges
Beats: 0.1s headline · 0.2s pen swings in · 0.7s booth card · 1.3s to 2.3s pen count runs 1 → 500 ·
       2.4s snap: "× 500" pops · 2.9s toast · hold
Camera: slow zoom-out 1.08 → 1.0 with a small drift left
*/
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Headline, MicroLabel, easeInOut, pop, progress } from "../MGKit";
import { BRAND } from "./brand";
import { DepthItem, Enter, Float, Scene } from "./parts";
import { Pen } from "./Pen";

const SNAP = 72;

const Booth: React.FC = () => (
  <div style={{ position: "relative", width: 250, height: 170 }}>
    <div style={{ position: "absolute", left: 10, right: 10, top: 0, height: 120, borderRadius: 12, background: BRAND.accentGradient }} />
    <div style={{ position: "absolute", left: 10, right: 10, top: 0, height: 30, borderRadius: "12px 12px 0 0", background: "rgba(255,255,255,0.35)" }} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 50, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.85)" }} />
    <div style={{ position: "absolute", left: 50, right: 50, top: 100, height: 70, borderRadius: 10, background: "#FFFFFF", boxShadow: "0 10px 20px rgba(30,60,120,.15)" }} />
    <div style={{ position: "absolute", left: 50, right: 50, top: 100, height: 10, borderRadius: "10px 10px 0 0", background: BRAND.accent }} />
  </div>
);

export const BoothScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const swing = progress(frame, 6, 26);
  const count = Math.round(interpolate(progress(frame, 40, 30, easeInOut), [0, 1], [1, 500]));
  const snap = pop(frame, fps, SNAP);

  return (
    <Scene cam={[{ at: 0, scale: 1.08, x: 20 }, { at: 140, scale: 1, x: -20 }]} focusY={62}>
      {[
        [150, 300, -30, 0],
        [1790, 200, 20, 1],
        [120, 960, 15, 2],
        [1800, 980, -25, 3],
      ].map(([x, y, r, ph], i) => (
        <DepthItem key={i} x={x} y={y} rotate={r} scale={0.3} at={12 + i * 4} phase={ph} blur={4} opacity={0.4}>
          <Pen />
        </DepthItem>
      ))}

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 86 }}>
        <Headline
          rows={["Another will say they ordered the booth", "and the *branded pens*"]}
          at={2}
          sansSize={58}
          displaySize={120}
        />
      </AbsoluteFill>

      {/* Focal: the pen */}
      <div
        style={{
          position: "absolute",
          left: 1000,
          top: 650,
          translate: `calc(-50% + ${interpolate(swing, [0, 1], [700, 0])}px) -50%`,
          rotate: `${interpolate(swing, [0, 1], [-28, -7])}deg`,
          opacity: Math.min(1, swing * 2),
        }}
      >
        <Float amp={6}>
          <div style={{ filter: "drop-shadow(0 40px 40px rgba(30,60,120,.22))" }}>
            <Pen />
          </div>
        </Float>
        <div
          style={{
            position: "absolute",
            right: -30,
            top: -150,
            padding: "14px 30px",
            borderRadius: 999,
            background: BRAND.accentGradient,
            color: "#FFFFFF",
            fontFamily: BRAND.sansFont,
            fontWeight: 800,
            fontSize: 48,
            boxShadow: `0 18px 40px ${BRAND.accentGlow}`,
            rotate: "7deg",
            opacity: progress(frame, 34, 8),
            scale: frame >= SNAP ? 1 + (1 - Math.min(snap, 1)) * 0.35 : 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          × {count}
        </div>
      </div>

      {/* Supporting: booth */}
      <div style={{ position: "absolute", left: 170, top: 470 }}>
        <Float amp={7} phase={1}>
          <Card at={20} radius={30} style={{ padding: 26, rotate: "-5deg", display: "flex", flexDirection: "column", gap: 16 }}>
            <Booth />
            <div>
              <MicroLabel style={{ fontSize: 15 }}>10×10 booth</MicroLabel>
              <div style={{ fontFamily: BRAND.sansFont, fontWeight: 600, fontSize: 24, color: BRAND.ink, marginTop: 4 }}>Qty 1</div>
            </div>
          </Card>
        </Float>
      </div>

      {/* Supporting: order toast */}
      <div style={{ position: "absolute", left: 1290, top: 860 }}>
        <Enter at={88} rise={40}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "18px 30px 18px 18px",
              borderRadius: 26,
              background: BRAND.card,
              boxShadow: BRAND.cardShadow,
              border: `1px solid ${BRAND.cardBorder}`,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 52,
                background: BRAND.accentGradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={28} height={28} viewBox="0 0 24 24">
                <path
                  d="M5 12.5 L10 17 L19 7"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={24}
                  strokeDashoffset={24 * (1 - progress(frame, 96, 10))}
                />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: BRAND.sansFont, fontWeight: 700, fontSize: 26, color: BRAND.ink }}>Order placed</div>
              <MicroLabel style={{ fontSize: 14, letterSpacing: 2, marginTop: 4 }}>Booth + 500 pens</MicroLabel>
            </div>
          </div>
        </Enter>
      </div>
    </Scene>
  );
};
