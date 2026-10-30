import { spring } from "remotion";
import { EASE_IN_OUT, Letters, MaskLine, MicroLabel, Ruler, Scene, prog, useTime } from "./kit";
import { C, DISPLAY, FPS, MARGIN, VO } from "./theme";

// "Pensions have become really important but a very difficult trade-off."
// Text-centric left column + a balance beam on the right third.
// Snap: the TODAY block lands and the beam rocks to level on "trade-off".

const PIVOT = { x: 1360, y: 700 };
const BEAM_W = 720;

const Block: React.FC<{
  at: number;
  x: number;
  w: number;
  h: number;
  fill: string;
  label: string;
}> = ({ at, x, w, h, fill, label }) => {
  const t = useTime();
  const p = prog(t, at, 0.7);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: -h - 4 - (1 - p) * 220,
        width: w,
        height: h,
        background: fill,
        opacity: Math.min(1, p * 1.8),
        display: "flex",
        alignItems: "flex-end",
        padding: "0 0 14px 16px",
        boxSizing: "border-box",
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: 40,
        lineHeight: 1,
        color: C.onFill,
      }}
    >
      {label}
    </div>
  );
};

export const S1TradeOff: React.FC = () => {
  const t = useTime();
  const f = t * FPS;

  const kick = (at: number) =>
    spring({ frame: f - at * FPS, fps: FPS, config: { damping: 9, stiffness: 70, mass: 1.1 } });
  // tips right when RETIREMENT lands, rocks back to level when TODAY lands
  const angle = 7 * kick(VO.important + 0.45) - 7 * kick(VO.difficult + 0.45);

  const beam = prog(t, 1.9, 0.9, EASE_IN_OUT);
  const fulcrum = prog(t, 1.6, 0.7);

  return (
    <Scene from={0} to={6.0} zoom={[1.05, 1]}>
      <MicroLabel text="Pensions · the trade-off" at={0.25} style={{ left: MARGIN + 4, top: 196 }} />
      <Letters text="PENSIONS" at={VO.pensions - 0.06} size={200} style={{ left: MARGIN - 6, top: 226 }} />
      <MaskLine at={VO.important - 0.12} size={86} style={{ left: MARGIN, top: 430 }}>
        REALLY <span style={{ color: C.mint }}>IMPORTANT</span>
      </MaskLine>
      <MaskLine at={4.45} size={86} color={C.muted} style={{ left: MARGIN, top: 526 }}>
        BUT A DIFFICULT <span style={{ color: C.ink }}>TRADE-OFF</span>
      </MaskLine>

      {/* ground line with ticks under the balance */}
      <Ruler x={PIVOT.x - 420} y={PIVOT.y + 130} w={840} count={12} at={1.4} major={[6]} />

      {/* fulcrum */}
      <svg
        width={140}
        height={130}
        style={{
          position: "absolute",
          left: PIVOT.x - 70,
          top: PIVOT.y,
          opacity: fulcrum,
          transform: `translateY(${(1 - fulcrum) * 30}px)`,
        }}
      >
        <path d="M70 6 L132 128 L8 128 Z" fill={C.muted} />
      </svg>

      {/* beam + blocks rotate together about the pivot */}
      <div
        style={{
          position: "absolute",
          left: PIVOT.x - BEAM_W / 2,
          top: PIVOT.y - 6,
          width: BEAM_W,
          height: 10,
          transformOrigin: "50% 50%",
          transform: `rotate(${angle}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: C.ink,
            transform: `scaleX(${beam})`,
          }}
        />
        <Block at={VO.difficult} x={18} w={210} h={120} fill={C.rust} label="TODAY" />
        <Block at={VO.important} x={BEAM_W - 228} w={210} h={170} fill={C.mint} label="RETIREMENT" />
      </div>

      {/* pivot pin */}
      <div
        style={{
          position: "absolute",
          left: PIVOT.x - 9,
          top: PIVOT.y - 10,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: C.groundMid,
          border: `3px solid ${C.ink}`,
          opacity: beam,
        }}
      />

    </Scene>
  );
};
