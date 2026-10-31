/*
Scene: Shrug · full screen · 4.3s · style: brand
Message: the rest don't even have an answer.
Category: text-centric with a hero object
Focal (centre): a glossy accent tile with ¯\_(ツ)_/¯ that actually shrugs
Supporting: the hook's 10-person tracker returns, now complete: 8 wrong, 2 shrugs
Depth: faint display-font question marks
Beats: 0.1s headline · 0.3s tile pops · 0.8s tracker resolves the wrong answers ·
       1.5s snap: first shrug, the 2 shrug dots pop · 2.5s second shrug · hold to the end
Camera: slow push-in 1.0 → 1.05
*/
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline, pop } from "../MGKit";
import { BRAND } from "./brand";
import { DepthItem, DotEvent, Float, Scene, Tracker } from "./parts";

const SHRUGS = [44, 76];
const SHRUG_DOTS = [3, 8];

const lift = (frame: number) =>
  SHRUGS.reduce(
    (acc, at) =>
      acc +
      interpolate(frame, [at, at + 6, at + 14, at + 20], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      }),
    0,
  );

export const ShrugScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tile = pop(frame, fps, 8);
  const l = lift(frame);

  let wrongOrder = 0;
  const dots: DotEvent[][] = Array.from({ length: 10 }, (_, i) =>
    SHRUG_DOTS.includes(i)
      ? [
          { at: -100, state: "asked" },
          { at: SHRUGS[0] + 2, state: "shrug" },
        ]
      : [
          { at: -100, state: "asked" },
          { at: 24 + wrongOrder++ * 3, state: "wrong" },
        ],
  );
  const wrongCount = Math.min(8, Math.max(0, Math.floor((frame - 24) / 3) + 1));
  const shrugCount = frame >= SHRUGS[0] + 2 ? 2 : 0;

  const piece = { display: "inline-block" } as const;

  return (
    <Scene cam={[{ at: 0, scale: 1 }, { at: 130, scale: 1.05, y: -10 }]} focusY={52}>
      {[
        [230, 300, 1, -12],
        [1700, 330, 1.2, 10],
        [260, 800, 0.8, 8],
        [1660, 760, 0.9, -8],
      ].map(([x, y, sc, r], i) => (
        <DepthItem key={i} x={x} y={y} scale={sc} rotate={r} at={6 + i * 4} phase={i * 1.3} opacity={0.2} blur={3}>
          <div style={{ fontFamily: BRAND.displayFont, fontStyle: "italic", fontSize: 220, color: BRAND.accent }}>?</div>
        </DepthItem>
      ))}

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 80 }}>
        <Headline rows={["And a couple will just", "*shrug*"]} at={2} sansSize={64} displaySize={150} />
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 960, top: 600, translate: "-50% -50%" }}>
        <Float amp={5}>
          <div
            style={{
              padding: "44px 70px",
              borderRadius: 64,
              background: BRAND.accentGradient,
              boxShadow: `0 40px 80px ${BRAND.accentGlow}, inset 0 2px 0 rgba(255,255,255,.35)`,
              color: "#FFFFFF",
              fontFamily: BRAND.sansFont,
              fontWeight: 600,
              fontSize: 110,
              lineHeight: 1,
              whiteSpace: "nowrap",
              opacity: Math.min(1, tile * 1.5),
              scale: interpolate(Math.min(tile, 1.03), [0, 1], [0.7, 1]),
            }}
          >
            <span style={{ ...piece, translate: `0px ${-l * 22}px`, rotate: `${-l * 8}deg`, transformOrigin: "100% 100%" }}>¯\_</span>
            <span style={{ ...piece, translate: `0px ${-l * 8}px` }}>(ツ)</span>
            <span style={{ ...piece, translate: `0px ${-l * 22}px`, rotate: `${l * 8}deg`, transformOrigin: "0% 100%" }}>_/¯</span>
          </div>
        </Float>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 850, display: "flex", justifyContent: "center" }}>
        <Tracker
          dots={dots}
          size={58}
          label={
            <span>
              10 asked · <span style={{ color: BRAND.inkMuted }}>{wrongCount} wrong</span> ·{" "}
              <span style={{ color: shrugCount ? BRAND.accent : BRAND.inkMuted }}>{shrugCount} shrugs</span>
            </span>
          }
        />
      </div>
    </Scene>
  );
};
