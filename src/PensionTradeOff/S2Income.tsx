import { EASE_IN_OUT, MicroLabel, Ruler, Scene, formatGBP, mix, prog, useTime } from "./kit";
import { CONTENT_W, C, DISPLAY, MARGIN, SANS, VO } from "./theme";

// "Because a pension contribution can reduce your adjusted net income.
//  And for somebody that could mean getting your income back below the £100,000 mark."
// Graphic-centric: an income bar on a £0-£120K scale.
// Beats: bar fills to £110K -> last £12K turns mint (pension) -> it drops out,
// income counts down to £98K -> £100K threshold drops in -> snap: below the mark.

const SCALE = 120_000;
const px = (v: number) => MARGIN + (v / SCALE) * CONTENT_W;
const BAR_Y = 690;
const BAR_H = 100;
const LANE_Y = 890;

export const S2Income: React.FC = () => {
  const t = useTime();

  const fill = prog(t, 6.36, 0.85);
  const reduce = prog(t, VO.reduce, 1.3, EASE_IN_OUT);
  const income = mix(0, 110_000, fill) - 12_000 * reduce;

  const tint = prog(t, VO.contribution + 0.2, 0.6, EASE_IN_OUT);
  const drop = prog(t, VO.reduce, 0.9, EASE_IN_OUT);

  const line = prog(t, VO.couldMean, 0.7, EASE_IN_OUT);
  const snap = prog(t, VO.hundredK, 0.35);
  const pop = 1 + Math.sin(snap * Math.PI) * 0.035;

  // camera tracks to the threshold as the speaker gets there
  const track = prog(t, VO.incomeBack - 0.3, 1.6, EASE_IN_OUT);

  const segX = px(98_000);
  const segW = px(110_000) - segX;

  return (
    <Scene from={6.25} to={14.15} zoom={[1.03, 1]}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `${px(100_000)}px ${BAR_Y}px`,
          transform: `scale(${mix(1, 1.07, track)}) translateX(${-track * 40}px)`,
        }}
      >
        <MicroLabel text="Adjusted net income" at={6.36} style={{ left: MARGIN + 4, top: 196 }} />
        <div
          style={{
            position: "absolute",
            left: MARGIN - 6,
            top: 226,
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 250,
            lineHeight: 0.86,
            color: snap > 0 ? C.mint : C.ink,
            transform: `scale(${pop})`,
            transformOrigin: "0% 50%",
            opacity: prog(t, 6.32, 0.3),
            textShadow: snap > 0 ? `0 0 ${40 * (1 - snap * 0.5)}px rgba(47,219,157,${0.35 * snap})` : undefined,
          }}
        >
          {formatGBP(Math.round(income / 100) * 100)}
        </div>

        {/* income bar */}
        <div
          style={{
            position: "absolute",
            left: MARGIN,
            top: BAR_Y,
            width: px(fill < 1 ? income : 98_000) - MARGIN,
            height: BAR_H,
            background: C.muted,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              bottom: 12,
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 44,
              lineHeight: 1,
              color: C.onFill,
              opacity: prog(t, 6.6, 0.5),
            }}
          >
            INCOME
          </div>
        </div>

        {/* pension slice: wipes mint, then drops into its own lane */}
        <div
          style={{
            position: "absolute",
            left: segX,
            top: mix(BAR_Y, LANE_Y, drop),
            width: segW,
            height: mix(BAR_H, 56, drop),
            overflow: "hidden",
            background: C.muted,
            opacity: fill < 1 ? 0 : 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: C.mint,
              transformOrigin: "0% 50%",
              transform: `scaleX(${tint})`,
              boxShadow: `0 0 30px rgba(47,219,157,${0.35 * tint})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderLeft: `3px solid ${C.groundMid}`,
            }}
          />
        </div>
        <MicroLabel
          text="Pension contribution"
          at={VO.contribution + 0.3}
          color={C.mint}
          style={{
            left: mix(segX + segW, segX - 26, drop),
            top: mix(BAR_Y - 40, LANE_Y + 19, drop),
            transform: "translateX(-100%)",
          }}
        />

        <Ruler x={MARGIN} y={BAR_Y + BAR_H} w={CONTENT_W} count={12} at={6.4} major={[5, 10]} />
        {[0, 20, 40, 60, 80, 100, 120].map((k, i) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: px(k * 1000),
              top: BAR_Y + BAR_H + 32,
              transform: "translateX(-50%)",
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: 15,
              letterSpacing: "0.2em",
              color: C.label,
              opacity: prog(t, 6.6 + i * 0.07, 0.5),
            }}
          >
            {k === 0 ? "£0" : `£${k}K`}
          </div>
        ))}

        {/* £100K threshold */}
        <div
          style={{
            position: "absolute",
            left: px(100_000) - 1.5,
            top: BAR_Y - 70,
            width: 3,
            height: (BAR_H + 100) * line,
            backgroundImage: `repeating-linear-gradient(180deg, ${snap > 0 ? C.mint : C.ink} 0 10px, transparent 10px 18px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: px(100_000),
            top: BAR_Y - 150,
            transform: `translateX(-50%) translateY(${(1 - prog(t, VO.couldMean + 0.2, 0.7)) * 24}px)`,
            opacity: prog(t, VO.couldMean + 0.2, 0.7),
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 64,
            lineHeight: 1,
            color: snap > 0 ? C.mint : C.ink,
          }}
        >
          £100K
        </div>
        <MicroLabel
          text="Below the mark"
          at={VO.below}
          color={C.mint}
          style={{ left: px(100_000) - 28, top: BAR_Y - 34, transform: "translateX(-100%)" }}
        />
      </div>
    </Scene>
  );
};
