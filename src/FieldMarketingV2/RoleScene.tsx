/*
Scene: The role · full screen · 3.7s · style: brand
Message: nobody knows what this role actually does.
Category: object-centric
Focal (centre): the Field Marketing Manager ID badge, dropping in on its lanyard
Supporting: a blank JOB DESCRIPTION card (left), a "?" tag (right)
Depth: faint display-font question marks at the edges
Beats: 0.1s headline · 0.3s badge drops in · 1.2s JD card · 2.3s snap: "What they do" field stamps "???" · hold
Camera: slow push-in 1.0 → 1.06 towards the badge
*/
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, Headline, MicroLabel, pop, progress } from "../MGKit";
import { BRAND } from "./brand";
import { Avatar, DepthItem, Float, Scene } from "./parts";

const SNAP = 68;

const Bar: React.FC<{ w: number; tint?: boolean }> = ({ w, tint }) => (
  <div style={{ width: w, height: 14, borderRadius: 7, background: tint ? "#E3ECFC" : "#EEF2F8" }} />
);

export const RoleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drop = progress(frame, 8, 22);
  const swing = Math.sin((frame - 8) / 6) * 4 * Math.exp(-(Math.max(0, frame - 8)) / 18) * (frame > 8 ? 1 : 0);
  const stamp = progress(frame, SNAP, 8);
  const tag = pop(frame, fps, SNAP + 4);
  const caret = Math.floor(frame / 12) % 2 === 0 ? 1 : 0;

  return (
    <Scene cam={[{ at: 0, scale: 1 }, { at: 110, scale: 1.06, y: -20 }]} focusY={62}>
      {[
        [210, 330, 0.9, -12],
        [1720, 280, 1.2, 10],
        [140, 880, 1.1, 8],
        [1790, 860, 0.8, -8],
      ].map(([x, y, sc, r], i) => (
        <DepthItem key={i} x={x} y={y} scale={sc} rotate={r} at={10 + i * 5} phase={i * 1.7} opacity={0.22} blur={3}>
          <div style={{ fontFamily: BRAND.displayFont, fontStyle: "italic", fontSize: 220, color: BRAND.accent }}>?</div>
        </DepthItem>
      ))}

      {/* Focal: ID badge on a lanyard */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: -300,
          transformOrigin: "50% 0%",
          rotate: `${swing}deg`,
          translate: `-50% ${interpolate(drop, [0, 1], [-560, 0])}px`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              width: 46,
              height: 600,
              background: BRAND.accentGradient,
              maskImage: "linear-gradient(180deg, transparent 0%, transparent 93%, black 99%)",
              WebkitMaskImage: "linear-gradient(180deg, transparent 0%, transparent 93%, black 99%)",
            }}
          />
          <div style={{ width: 70, height: 34, borderRadius: 10, background: "#D5DDEA", marginTop: -4 }} />
          <div
            style={{
              width: 400,
              marginTop: -6,
              borderRadius: 34,
              background: BRAND.card,
              boxShadow: "0 40px 80px rgba(30,60,120,.18), 0 8px 18px rgba(30,60,120,.08)",
              border: `1px solid ${BRAND.cardBorder}`,
              overflow: "hidden",
            }}
          >
            <div style={{ height: 96, background: BRAND.accentGradient, display: "flex", justifyContent: "center", paddingTop: 22 }}>
              <div style={{ width: 90, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.55)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 36px 34px", gap: 14 }}>
              <div style={{ marginTop: -56, borderRadius: 200, border: "6px solid #FFFFFF" }}>
                <Avatar size={108} />
              </div>
              <Bar w={170} />
              <div
                style={{
                  fontFamily: BRAND.sansFont,
                  fontWeight: 700,
                  fontSize: 30,
                  color: BRAND.ink,
                  textAlign: "center",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                Field Marketing
                <br />
                Manager
              </div>
              <div style={{ width: "100%", height: 1, background: BRAND.cardBorder, margin: "6px 0" }} />
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <MicroLabel style={{ fontSize: 16 }}>Team</MicroLabel>
                <div style={{ fontFamily: BRAND.sansFont, fontWeight: 600, fontSize: 22, color: BRAND.ink }}>Marketing</div>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", height: 40 }}>
                <MicroLabel style={{ fontSize: 16 }}>What they do</MicroLabel>
                <div style={{ position: "relative", width: 150, height: 40, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <div style={{ opacity: 1 - stamp }}>
                    <Bar w={130} tint />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      padding: "4px 18px",
                      borderRadius: 999,
                      background: BRAND.accent,
                      color: "#FFFFFF",
                      fontFamily: BRAND.sansFont,
                      fontWeight: 800,
                      fontSize: 24,
                      letterSpacing: 2,
                      opacity: stamp,
                      scale: interpolate(stamp, [0, 1], [1.8, 1]),
                      boxShadow: `0 10px 24px ${BRAND.accentGlow}`,
                    }}
                  >
                    ???
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 92 }}>
        <Headline rows={["what the Field Marketing Manager", "*actually* does"]} at={2} sansSize={64} displaySize={128} />
      </AbsoluteFill>

      {/* Supporting: blank job description */}
      <div style={{ position: "absolute", left: 380, top: 560 }}>
        <Float amp={6} phase={1}>
          <Card at={30} radius={28} style={{ width: 360, padding: "26px 30px", rotate: "-4deg" }}>
            <MicroLabel style={{ fontSize: 16 }}>Job description</MicroLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 20 }}>
              <Bar w={280} />
              <Bar w={230} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Bar w={120} />
                <div style={{ width: 3, height: 26, background: BRAND.accent, opacity: caret }} />
              </div>
            </div>
            <MicroLabel style={{ fontSize: 14, marginTop: 20, letterSpacing: 2 }}>0 responsibilities listed</MicroLabel>
          </Card>
        </Float>
      </div>

      {/* Supporting: "?" tag, pops on the snap */}
      <div style={{ position: "absolute", left: 1250, top: 600 }}>
        <Float amp={8} phase={2}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 34,
              background: BRAND.accentGradient,
              boxShadow: `0 24px 50px ${BRAND.accentGlow}`,
              color: "#FFFFFF",
              fontFamily: BRAND.displayFont,
              fontStyle: "italic",
              fontSize: 110,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: tag,
              rotate: `${interpolate(tag, [0, 1], [-30, 8], { easing: Easing.out(Easing.cubic) })}deg`,
            }}
          >
            ?
          </div>
        </Float>
      </div>
    </Scene>
  );
};
