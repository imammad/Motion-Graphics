import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { Headline } from "./Headline";
import { Person } from "./Person";
import { Window } from "./Window";
import { BLUE, BLUE_TINT, INK, MUTED, WHITE, fontFamily } from "./theme";

const ANSWERS: { text: string; wrong: boolean }[] = [
  { text: "They book the events", wrong: true },
  { text: "They order the booth", wrong: true },
  { text: "Branded pens, right?", wrong: true },
  { text: "Trade show logistics", wrong: true },
  { text: "Party planning?", wrong: true },
  { text: "Swag. Lots of swag.", wrong: true },
  { text: "Something with leads", wrong: true },
  { text: "They travel a lot", wrong: true },
  { text: "¯\\_(ツ)_/¯", wrong: false },
  { text: "¯\\_(ツ)_/¯", wrong: false },
];

// Frame at which "most of them will be wrong" lands.
const WRONG_AT = 96;

// "...you'll get 10 different answers, and most of them will be wrong."
export const AnswersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [14, 14 + 9 * 5], [0, 10], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const wrongCount = ANSWERS.filter(
    (a, i) => a.wrong && frame >= WRONG_AT + 8 + i * 3,
  ).length;

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Background />

      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [WRONG_AT - 10, WRONG_AT], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Headline
          fontSize={92}
          stagger={3}
          segments={[{ text: "You'll get" }, { text: "10 different answers", accent: true }]}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Headline
          fontSize={92}
          stagger={3}
          start={WRONG_AT}
          segments={[{ text: "…and most of them will be" }, { text: "wrong.", accent: true }]}
        />
      </div>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
        <Window
          title="Team poll · What does our Field Marketing Manager do?"
          width={1560}
          style={{
            opacity: interpolate(frame, [0, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: `0px ${interpolate(frame, [0, 24], [60, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}px`,
          }}
        >
          <div style={{ padding: "28px 36px 36px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 26,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 700, color: INK }}>
                {count} <span style={{ color: MUTED, fontWeight: 600 }}>responses</span>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <div
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: BLUE_TINT,
                    color: BLUE,
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {count} unique answers
                </div>
                <div
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: BLUE,
                    color: WHITE,
                    fontSize: 24,
                    fontWeight: 700,
                    opacity: interpolate(frame, [WRONG_AT, WRONG_AT + 8], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  {wrongCount} wrong
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 20,
              }}
            >
              {ANSWERS.map((a, i) => {
                const pop = spring({
                  frame: frame - 14 - i * 5,
                  fps,
                  config: { damping: 13, stiffness: 160 },
                });
                const strikeStart = WRONG_AT + 8 + i * 3;
                const strike = a.wrong
                  ? interpolate(frame, [strikeStart, strikeStart + 10], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.65, 0, 0.35, 1),
                    })
                  : 0;
                const shrug = a.wrong
                  ? 0
                  : Math.max(0, Math.sin((frame - 30 - i * 7) / 5)) * 8;
                return (
                  <div
                    key={i}
                    style={{
                      height: 214,
                      borderRadius: 22,
                      border: `1.5px solid ${BLUE_TINT}`,
                      background: a.wrong ? WHITE : `linear-gradient(160deg, ${WHITE}, ${BLUE_TINT})`,
                      padding: "22px 22px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      scale: interpolate(pop, [0, 1], [0.6, 1]),
                      opacity: Math.min(1, pop * 1.4),
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ translate: `0px ${-shrug}px` }}>
                        <Person
                          size={48}
                          variant={strike > 0.5 ? "muted" : i % 3 === 1 ? "light" : "blue"}
                        />
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: MUTED }}>
                        Person #{i + 1}
                      </div>
                      <div
                        style={{
                          marginLeft: "auto",
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          background: BLUE,
                          color: WHITE,
                          fontSize: 22,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          scale: spring({
                            frame: frame - strikeStart - 6,
                            fps,
                            config: { damping: 10, stiffness: 200 },
                          }) * (a.wrong ? 1 : 0),
                        }}
                      >
                        ✕
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: a.wrong ? 33 : 38,
                        fontWeight: 700,
                        lineHeight: 1.25,
                        color: interpolateColors(strike, [0, 1], [INK, "#B4BFD1"]),
                      }}
                    >
                      <span
                        style={{
                          backgroundImage: `linear-gradient(${BLUE}, ${BLUE})`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "0 58%",
                          backgroundSize: `${strike * 100}% 5px`,
                          WebkitBoxDecorationBreak: "clone",
                          boxDecorationBreak: "clone",
                        }}
                      >
                        {a.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Window>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
