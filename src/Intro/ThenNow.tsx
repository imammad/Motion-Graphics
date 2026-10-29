import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY, G, LABEL, Reveal, SMOOTH, Stage, k, mix } from "./common";

// "…do you ever look back to what you were earning in 2021, five years ago,
// and think to yourself, I don't feel any better off today than I did back then."
// Cue times are seconds into public/audio/I1.wav (C0080 0:02.9 → 0:11.75).
export const THEN_NOW_SECONDS = 9.4;
const CUE = {
  ruler: 0.3,
  earning: 1.4, // "what you were earning"
  year: 2.3, // "2021"
  travel: [3.3, 6.9], // "five years ago … today": the marker runs the ruler
  better: 6.34, // "better off"
  today: 6.96, // "today"
  same: 8.24, // "back then"
} as const;

const RULER_Y = 790;
const NUM_SIZE = 380;
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
const yearX = (i: number) => G.left + (i * (G.right - G.left)) / (YEARS.length - 1);

export const ThenNow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const ruler = k(time, CUE.ruler, CUE.ruler + 1.6, SMOOTH);
  const run = k(time, CUE.travel[0], CUE.travel[1], SMOOTH);
  const headX = mix(G.left, G.right, run);
  const minor = Math.floor((G.right - G.left) / 40);

  return (
    <Stage>
      <Audio src={staticFile("audio/I1.wav")} />

      {/* Upper third: the question. */}
      <div style={{ position: "absolute", left: G.left - 4, top: G.y1, translate: "0 -100%" }}>
        <Reveal time={time} at={CUE.better - 0.1} dur={1.0}>
          <div style={{ ...DISPLAY, fontSize: 150 }}>
            Better off<span style={{ color: C.mint }}>?</span>
          </div>
        </Reveal>
      </div>

      {/* Labels sit just under the upper third, numbers stand on the lower third. */}
      <div style={{ ...LABEL, position: "absolute", left: G.left, top: 404, opacity: k(time, CUE.earning, CUE.earning + 0.6) }}>
        What you were earning
      </div>
      <div style={{ ...LABEL, position: "absolute", right: 1920 - G.right, top: 404, opacity: k(time, CUE.today - 0.2, CUE.today + 0.4) }}>
        Today
      </div>
      <div style={{ position: "absolute", left: G.left - 10, top: G.y2 + 10, translate: "0 -100%" }}>
        <Reveal time={time} at={CUE.year} dur={1.1}>
          <div style={{ ...DISPLAY, fontSize: NUM_SIZE }}>2021</div>
        </Reveal>
      </div>
      <div style={{ position: "absolute", right: 1920 - G.right - 10, top: G.y2 + 10, translate: "0 -100%" }}>
        <Reveal time={time} at={CUE.today - 0.15} dur={1.0}>
          <div style={{ ...DISPLAY, fontSize: NUM_SIZE, color: C.mint }}>2026</div>
        </Reveal>
      </div>

      {/* The verdict between them: an equals sign built from two flat bars. */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            // Centred in the gap between the two numbers (2021 ends ~764, 2026 starts ~1090).
            left: 927 - 90,
            top: 560 + i * 62,
            width: 180,
            height: 26,
            background: C.mint,
            transformOrigin: "50% 50%",
            scale: `${k(time, CUE.same + i * 0.12, CUE.same + 0.7 + i * 0.12)} 1`,
          }}
        />
      ))}

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={G.left} x2={mix(G.left, G.right, ruler)} y1={RULER_Y} y2={RULER_Y} stroke={C.rule} strokeWidth={2} />
        {Array.from({ length: minor + 1 }, (_, i) => {
          const x = G.left + i * 40;
          const on = ruler * (G.right - G.left) >= i * 40 ? 1 : 0;
          return <line key={i} x1={x} x2={x} y1={RULER_Y} y2={RULER_Y + 10} stroke={C.faint} strokeWidth={2} opacity={on} />;
        })}
        {YEARS.map((y, i) => (
          <line
            key={y}
            x1={yearX(i)}
            x2={yearX(i)}
            y1={RULER_Y - 14}
            y2={RULER_Y + 26}
            stroke={headX >= yearX(i) - 1 && run > 0 ? C.mint : C.rule}
            strokeWidth={3}
            opacity={ruler * (G.right - G.left) >= yearX(i) - G.left ? 1 : 0}
          />
        ))}
        {/* Five years pass: a flat bar runs the ruler with a marker on its head. */}
        <rect x={G.left} y={RULER_Y - 5} width={headX - G.left} height={10} fill={C.mint} opacity={run > 0 ? 1 : 0} />
        <path d={`M${headX - 11} ${RULER_Y - 34} L${headX + 11} ${RULER_Y - 34} L${headX} ${RULER_Y - 16} Z`} fill={C.mint} opacity={run > 0 && run < 1 ? 1 : 0} />
      </svg>
      {YEARS.map((y, i) => (
        <div
          key={y}
          style={{
            ...LABEL,
            fontSize: 18,
            letterSpacing: "0.16em",
            position: "absolute",
            left: yearX(i),
            top: RULER_Y + 40,
            translate: i === 0 ? "0 0" : i === YEARS.length - 1 ? "-100% 0" : "-50% 0",
            color: headX >= yearX(i) - 1 && (run > 0 || i === 0) ? C.ink : C.muted,
            opacity: k(time, CUE.ruler + 0.2 + i * 0.12, CUE.ruler + 0.8 + i * 0.12),
          }}
        >
          {y}
        </div>
      ))}
    </Stage>
  );
};
