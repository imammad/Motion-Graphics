import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, FPS } from "./brand";
import { easeIn, prog, sec } from "./kit";
import { camScale, chinY, splitAmount } from "./Speaker";
import { CAPTIONS, SCENES } from "./timeline";

type Tok = { w: string; kind: "plain" | "green" | "red" | "gold" };

const parse = (text: string): Tok[] => {
  const out: Tok[] = [];
  const re = /\*([^*]+)\*|!([^!]+)!|\^([^^]+)\^|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m[1]) m[1].split(" ").forEach((w) => out.push({ w, kind: "green" }));
    else if (m[2]) m[2].split(" ").forEach((w) => out.push({ w, kind: "red" }));
    else if (m[3]) m[3].split(" ").forEach((w) => out.push({ w, kind: "gold" }));
    else out.push({ w: m[4], kind: "plain" });
  }
  return out;
};

const kindColor = { plain: C.white, green: C.green, red: C.red, gold: C.gold };
const kindGlow = { plain: "transparent", green: C.greenGlow, red: C.redGlow, gold: "rgba(217,182,110,.45)" };

// Full screens carry their own headline, so captions step aside there.
const FULL = [SCENES.rumours, SCENES.liquidity, { from: 0.85, to: 3.55 }, { from: 45.55, to: 50.8 }];

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let idx = -1;
  for (let i = 0; i < CAPTIONS.length; i++) if (CAPTIONS[i].t <= t) idx = i;
  if (idx < 0) return null;
  const cap = CAPTIONS[idx];
  const next = CAPTIONS[idx + 1]?.t ?? 60.3;
  const start = sec(cap.t);
  const end = sec(next);
  const toks = parse(cap.text);

  const sp = splitAmount(frame);
  // full: lower-third line (y≈1290). split: just under the seam, inside safe zone.
  const yFull = Math.min(1500, Math.max(1440, chinY(camScale(t)) + 35));
  const y = yFull * (1 - sp) + 1040 * sp;
  const light = false;
  const hide = Math.max(
    ...FULL.map((s) => prog(frame, sec(s.from), 6) * (1 - prog(frame, sec(s.to) - 6, 6))),
  );
  const exit = Math.max(prog(frame, end - 4, 4, easeIn), hide);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: y,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 16,
          rowGap: 4,
          opacity: 1 - exit,
          filter: `blur(${exit * 6}px)`,
        }}
      >
        {toks.map((tk, i) => {
          const p = prog(frame, start + i * 2, 8);
          const key = tk.kind !== "plain";
          return (
            <span
              key={i}
              style={{
                fontFamily: F.sans,
                fontWeight: key ? 800 : 600,
                fontSize: key ? 66 : 58,
                letterSpacing: -1,
                lineHeight: 1.15,
                color: light && !key ? C.paperInk : kindColor[tk.kind],
                textShadow: light
                  ? "none"
                  : key
                    ? `0 0 26px ${kindGlow[tk.kind]}, 0 4px 14px rgba(0,0,0,.55)`
                    : "0 3px 12px rgba(0,0,0,.6), 0 1px 2px rgba(0,0,0,.5)",
                opacity: p,
                transform: `translateY(${(1 - p) * 16}px) scale(${key ? 0.85 + 0.15 * p : 1})`,
                filter: `blur(${(1 - p) * 6}px)`,
                display: "inline-block",
              }}
            >
              {tk.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
