import { expoIn, expoOut, prog } from "./motion";
import { PINK, WHITE, fontFamily } from "./theme";
import { HEROES } from "./timeline";

// Hero headings (Satoshi Bold). Letters rise through a mask one by one; the whole line
// leaves upward before the next heading starts, so words never overlap.
const LETTER_STAGGER = 0.022;
const IN_DUR = 0.62;
const OUT_DUR = 0.3;

export const Hero: React.FC<{ t: number; top: number }> = ({ t, top }) => (
  <>
    {HEROES.map((h, hi) => {
      if (t < h.in - 0.01 || t > h.out + OUT_DUR + 0.01) return null;
      const out = expoIn(prog(t, h.out, OUT_DUR));
      const size = h.lines.length > 1 ? 104 : 116;
      return (
        <div
          key={hi}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {h.lines.map((line, li) => {
            const lineStart = h.in + li * 0.12;
            return (
              <div
                key={li}
                style={{
                  overflow: "hidden",
                  paddingBottom: "0.16em",
                  marginBottom: "-0.2em",
                  lineHeight: 1.08,
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontWeight: 700,
                    fontSize: size,
                    letterSpacing: "-0.035em",
                    color: line.accent ? PINK : WHITE,
                    whiteSpace: "pre",
                    transform: `translateY(${-out * 125}%)`,
                  }}
                >
                  {line.text.split("").map((ch, ci) => {
                    const p = expoOut(
                      prog(t, lineStart + ci * LETTER_STAGGER, IN_DUR),
                    );
                    return (
                      <span
                        key={ci}
                        style={{
                          display: "inline-block",
                          transform: `translateY(${(1 - p) * 118}%)`,
                        }}
                      >
                        {ch === " " ? " " : ch}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    })}
  </>
);
