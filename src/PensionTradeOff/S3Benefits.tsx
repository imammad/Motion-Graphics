import { EASE_IN_OUT, Letters, MaskLine, MicroLabel, Scene, prog, useTime } from "./kit";
import { C, DISPLAY, MARGIN, VO } from "./theme";

// "That means you receive your childcare allowances and you're not being taxed at 62%."
// Two columns split by a hairline: what you keep (mint check) | what you avoid (62% struck).
// Snap: the rust strike cuts through 62% on "62".

const SPLIT = 960;

export const S3Benefits: React.FC = () => {
  const t = useTime();

  const ring = prog(t, VO.receive - 0.1, 0.8, EASE_IN_OUT);
  const tick = prog(t, VO.receive + 0.45, 0.45, EASE_IN_OUT);
  const divider = prog(t, 14.65, 1, EASE_IN_OUT);
  const strike = prog(t, VO.taxed62 - 0.1, 0.35, EASE_IN_OUT);
  const reveal62 = prog(t, VO.notTaxed + 0.25, 0.8);

  const R = 58;
  const CIRC = 2 * Math.PI * R;

  return (
    <Scene from={14.2} to={19.35} zoom={[1.04, 1]}>
      <MicroLabel text="Back under £100K" at={14.55} style={{ left: MARGIN + 4, top: 196 }} />

      {/* left: what you get back */}
      <svg
        width={140}
        height={140}
        style={{ position: "absolute", left: MARGIN - 6, top: 300 }}
      >
        <circle
          cx={70}
          cy={70}
          r={R}
          fill="none"
          stroke={C.mint}
          strokeWidth={5}
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - ring)}
          transform="rotate(-90 70 70)"
        />
        <path
          d="M44 72 L62 90 L98 52"
          fill="none"
          stroke={C.mint}
          strokeWidth={7}
          strokeLinecap="square"
          strokeDasharray={90}
          strokeDashoffset={90 * (1 - tick)}
        />
      </svg>
      <MicroLabel text="You receive" at={VO.receive} style={{ left: MARGIN + 170, top: 358 }} />
      <Letters text="CHILDCARE" at={VO.childcare - 0.08} size={176} style={{ left: MARGIN - 6, top: 470 }} />
      <MaskLine at={VO.allowances - 0.05} size={96} color={C.mint} style={{ left: MARGIN, top: 640 }}>
        ALLOWANCES
      </MaskLine>

      {/* hairline split */}
      <div
        style={{
          position: "absolute",
          left: SPLIT,
          top: 300,
          width: 2,
          height: 560 * divider,
          background: C.tick,
        }}
      />

      {/* right: what you avoid */}
      <MicroLabel text="No longer taxed at" at={VO.notTaxed} style={{ left: SPLIT + 110, top: 358 }} />
      <div
        style={{
          position: "absolute",
          left: SPLIT + 100,
          top: 420,
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 340,
          lineHeight: 0.86,
          color: C.muted,
          overflow: "hidden",
          paddingTop: 20,
        }}
      >
        <div
          style={{
            transform: `translateY(${(1 - reveal62) * 105}%)`,
            opacity: 1 - strike * 0.45,
          }}
        >
          62%
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: SPLIT + 70,
          top: 590,
          width: 640,
          height: 26,
          background: C.rust,
          transformOrigin: "0% 50%",
          transform: `rotate(-9deg) scaleX(${strike})`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      />
    </Scene>
  );
};
