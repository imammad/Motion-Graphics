import { EASE_IN_OUT, Letters, MaskLine, MicroLabel, Ruler, Scene, mix, prog, useTime } from "./kit";
import { CONTENT_W, C, DISPLAY, MARGIN, VO } from "./theme";

// Part 1 (the client's reference frame): "Even for somebody earning over £100,000 and being
// taxed at 62%, they might need that extra 38p in the pound"
//   OVER £100K · 62% (muted) vs 38% (mint) · TAX bar 62 / 38 on a ruler.
// Part 2: "just to pay for the additional cost of living, the additional childcare
// expenses and all those sorts of things."
//   Everything but the mint 38p slice clears; the slice grows to full width and splits
//   into three costs on their words. Ends on a hold.

const BAR = { x: MARGIN, y: 773, h: 100 };
const TAX = 0.62;
const SPLITS = [0.42, 0.76];

export const S5OverHundredK: React.FC = () => {
  const t = useTime();

  const taxFill = prog(t, VO.taxedAt + 0.1, 1.1, EASE_IN_OUT);
  const keepFill = prog(t, VO.extra38, 0.8, EASE_IN_OUT);
  const pound = prog(t, VO.inThePound, 0.4);
  const glow = Math.sin(pound * Math.PI);

  // part 2: clear the stage, morph the mint slice into the full-width bar
  const clear = prog(t, VO.justToPay - 0.1, 0.4, EASE_IN_OUT);
  const morph = prog(t, VO.justToPay, 1, EASE_IN_OUT);
  const part1 = { opacity: 1 - clear, filter: clear > 0 ? `blur(${clear * 12}px)` : undefined };

  const tax62 = Math.round(62 * prog(t, VO.sixtyTwo - 0.3, 0.9, EASE_IN_OUT));
  const keep38 = Math.round(38 * keepFill);

  const mintFrom = { x: BAR.x + CONTENT_W * TAX, y: BAR.y, w: CONTENT_W * (1 - TAX), h: BAR.h };
  const mintTo = { x: MARGIN, y: 600, w: CONTENT_W, h: 150 };
  const mint = {
    x: mix(mintFrom.x, mintTo.x, morph),
    y: mix(mintFrom.y, mintTo.y, morph),
    w: mix(mintFrom.w, mintTo.w, morph),
    h: mix(mintFrom.h, mintTo.h, morph),
  };

  const segs = [
    { at: VO.costOfLiving, from: 0, to: SPLITS[0], label: "COST OF LIVING", fill: C.mint },
    { at: VO.childcareExp, from: SPLITS[0], to: SPLITS[1], label: "CHILDCARE", fill: C.mintDeep },
    { at: VO.allThose, from: SPLITS[1], to: 1, label: "EVERYTHING ELSE", fill: C.mintDeeper },
  ];

  return (
    <Scene from={23.2} to={40} zoom={[1.05, 1]}>
      {/* ---------- part 1 ---------- */}
      <div style={{ position: "absolute", inset: 0, ...part1 }}>
        <MicroLabel text="Even for higher earners" at={23.35} style={{ left: MARGIN + 4, top: 196 }} />
        <Letters text="OVER £100K" at={VO.over100k - 0.08} size={152} style={{ left: MARGIN - 4, top: 226 }} />
        <MicroLabel
          text="Each extra £1"
          at={VO.taxedAt}
          style={{ right: MARGIN, top: 340, textAlign: "right" }}
        />

        {/* 62% */}
        <div
          style={{
            position: "absolute",
            left: MARGIN - 8,
            top: 448,
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 316,
            lineHeight: 0.86,
            color: C.muted,
            overflow: "hidden",
            paddingTop: 16,
          }}
        >
          <div style={{ transform: `translateY(${(1 - prog(t, VO.sixtyTwo - 0.35, 0.8)) * 105}%)` }}>
            {tax62}%
          </div>
        </div>

        {/* tax slice */}
        <div
          style={{
            position: "absolute",
            left: BAR.x,
            top: BAR.y,
            width: CONTENT_W * TAX * taxFill,
            height: BAR.h,
            background: C.rust,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 18,
              bottom: 14,
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1,
              color: "#2A120A",
              opacity: prog(t, VO.taxedAt + 0.4, 0.5),
            }}
          >
            TAX
          </div>
        </div>
        <Ruler x={BAR.x} y={BAR.y + BAR.h} w={CONTENT_W} count={10} at={VO.taxedAt - 0.2} major={[5]} />
      </div>

      {/* 38% (stays in part 1 layer but fades with it) */}
      <div
        style={{
          position: "absolute",
          right: MARGIN - 6,
          top: 448,
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 316,
          lineHeight: 0.86,
          color: C.mint,
          overflow: "hidden",
          paddingTop: 16,
          ...part1,
        }}
      >
        <div
          style={{
            transform: `translateY(${(1 - prog(t, VO.extra38 - 0.05, 0.8)) * 105}%)`,
            textShadow: `0 0 ${50 * glow}px rgba(47,219,157,${0.45 * glow})`,
          }}
        >
          {keep38}%
        </div>
      </div>

      {/* ---------- the mint 38p slice (bridges both parts) ---------- */}
      <div
        style={{
          position: "absolute",
          left: mint.x,
          top: mint.y,
          width: mint.w,
          height: mint.h,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: C.mint,
            transformOrigin: "0% 50%",
            transform: `scaleX(${keepFill})`,
            boxShadow: `0 0 40px rgba(47,219,157,${0.5 * glow})`,
            opacity: morph > 0 ? mix(1, 0.22, prog(t, VO.costOfLiving - 0.05, 0.5)) : 1,
          }}
        />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: C.groundMid, opacity: 1 - morph }} />
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 14,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 46,
            lineHeight: 1,
            color: C.onFill,
            transform: `translateY(${(1 - pound) * 60}px)`,
            opacity: 1 - clear,
          }}
        >
          38P OF EVERY £1
        </div>

        {/* part 2: three costs fill in on their words */}
        {segs.map((s, i) => {
          const p = prog(t, s.at - 0.05, 0.7, EASE_IN_OUT);
          const lab = prog(t, s.at + 0.15, 0.7);
          const left = s.from * mint.w;
          const w = (s.to - s.from) * mint.w;
          return (
            <div key={i} style={{ position: "absolute", left, top: 0, width: w, height: "100%" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: s.fill,
                  transformOrigin: "0% 50%",
                  transform: `scaleX(${p})`,
                }}
              />
              {i > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: -5,
                    top: 0,
                    width: 10,
                    height: `${100 * prog(t, s.at - 0.15, 0.4, EASE_IN_OUT)}%`,
                    background: C.groundMid,
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  left: i > 0 ? 24 : 20,
                  bottom: 18,
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 54,
                  lineHeight: 1,
                  color: C.onFill,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <div style={{ transform: `translateY(${(1 - lab) * 110}%)` }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- part 2 text + ruler ---------- */}
      <MicroLabel text="Where the 38p goes" at={VO.justToPay + 0.1} style={{ left: MARGIN + 4, top: 196 }} />
      <MaskLine at={VO.justToPay + 0.05} size={152} weight={900} style={{ left: MARGIN - 4, top: 226 }}>
        JUST TO PAY FOR
      </MaskLine>
      <MaskLine
        at={VO.justToPay + 0.3}
        size={152}
        weight={900}
        color={C.mint}
        style={{ right: MARGIN - 4, top: 226 }}
      >
        38P
      </MaskLine>
      {segs.map((s, i) => (
        <MicroLabel
          key={i}
          text={`0${i + 1}`}
          at={s.at}
          style={{ left: MARGIN + s.from * CONTENT_W + (i > 0 ? 6 : 2), top: mintTo.y - 40 }}
        />
      ))}
      {morph > 0 && (
        <Ruler x={MARGIN} y={mintTo.y + mintTo.h} w={CONTENT_W} count={10} at={VO.justToPay + 0.6} major={[5]} />
      )}
    </Scene>
  );
};
