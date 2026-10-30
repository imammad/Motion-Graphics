import { EASE_IN_OUT, Letters, MaskLine, MicroLabel, Scene, mix, prog, useTime } from "./kit";
import { C, DISPLAY, MARGIN, VO } from "./theme";

// "But what you are doing is you are giving up all of that money."
// Object row: ten £ tokens of take-home pay arc one by one into a dashed PENSION box,
// leaving dashed ghosts behind. Snap: the box fills on "all of that money".

const N = 10;
const TOKEN = 84;
const GAP = 18;
const ROW_Y = 720;
const BOX = { x: 1300, y: 600, w: 468, h: 250 };
const IN_TOKEN = 70;

const rowPos = (i: number) => ({ x: MARGIN + i * (TOKEN + GAP), y: ROW_Y });
const boxPos = (i: number) => {
  const col = i % 5;
  const row = Math.floor(i / 5);
  const gx = (BOX.w - 5 * IN_TOKEN - 4 * 16) / 2;
  return { x: BOX.x + gx + col * (IN_TOKEN + 16), y: BOX.y + 42 + row * (IN_TOKEN + 22) };
};

export const S4GivingUp: React.FC = () => {
  const t = useTime();
  const box = prog(t, 19.9, 0.8, EASE_IN_OUT);
  const PER = BOX.w * 2 + BOX.h * 2;

  return (
    <Scene from={19.4} to={23.05} zoom={[1.04, 1]}>
      <MicroLabel text="The catch" at={19.72} style={{ left: MARGIN + 4, top: 196 }} />
      <Letters text="GIVING UP" at={VO.givingUp - 0.05} size={200} style={{ left: MARGIN - 6, top: 226 }} />
      <MaskLine at={VO.allMoney - 0.05} size={86} color={C.muted} style={{ left: MARGIN, top: 430 }}>
        ALL OF THAT <span style={{ color: C.ink }}>MONEY</span>
      </MaskLine>

      <MicroLabel text="Take-home pay" at={19.75} style={{ left: MARGIN + 4, top: ROW_Y - 44 }} />
      <MicroLabel text="Pension" at={20.1} color={C.mint} style={{ left: BOX.x + 4, top: BOX.y - 44 }} />

      {/* dashed pension box, drawn on */}
      <svg
        width={BOX.w + 4}
        height={BOX.h + 4}
        style={{ position: "absolute", left: BOX.x - 2, top: BOX.y - 2 }}
      >
        <rect
          x={2}
          y={2}
          width={BOX.w}
          height={BOX.h}
          fill={`rgba(47,219,157,${0.06 * box})`}
          stroke={C.mint}
          strokeWidth={2}
          strokeDasharray={`${PER * box} ${PER}`}
        />
      </svg>

      {Array.from({ length: N }).map((_, i) => {
        const appear = prog(t, 19.72 + i * 0.06, 0.6);
        const move = prog(t, VO.givingUp + 0.1 + i * 0.11, 0.85, EASE_IN_OUT);
        const a = rowPos(i);
        const b = boxPos(i);
        const size = mix(TOKEN, IN_TOKEN, move);
        const x = mix(a.x, b.x, move);
        const y = mix(a.y, b.y, move) - Math.sin(move * Math.PI) * 140;
        return (
          <div key={i}>
            {/* ghost left behind */}
            <div
              style={{
                position: "absolute",
                left: a.x,
                top: a.y,
                width: TOKEN,
                height: TOKEN,
                borderRadius: TOKEN / 2,
                border: `2px dashed ${C.tick}`,
                boxSizing: "border-box",
                opacity: move,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: x,
                top: y + (1 - appear) * 30,
                width: size,
                height: size,
                borderRadius: size / 2,
                border: `3px solid ${move > 0.5 ? C.mint : C.ink}`,
                background: move > 0.5 ? C.mint : "transparent",
                boxSizing: "border-box",
                opacity: appear,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: size * 0.55,
                lineHeight: 1,
                color: move > 0.5 ? C.onFill : C.ink,
              }}
            >
              £
            </div>
          </div>
        );
      })}
    </Scene>
  );
};
