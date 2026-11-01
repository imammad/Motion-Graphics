import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F, FPS } from "./brand";
import { easeIn, prog, sec } from "./kit";
import { splitAmount } from "./Speaker";
import { BEHIND, CAPTIONS, CAPTION_Y, DURATION_S, FULLS, PILLS } from "./timeline";

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

// Full screens carry their own headline, so captions step aside there.
// Also steps aside for the hook/lesson pills and while a behind-head keyword is up.
const FULL = [...FULLS, PILLS, ...BEHIND];

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let idx = -1;
  for (let i = 0; i < CAPTIONS.length; i++) if (CAPTIONS[i].t <= t) idx = i;
  if (idx < 0) return null;
  const cap = CAPTIONS[idx];
  const next = CAPTIONS[idx + 1]?.t ?? DURATION_S;
  const start = sec(cap.t);
  const end = sec(next);
  const toks = parse(cap.text);
  // long lines shrink to stay on ONE line (a second line would drift toward the face)
  const fit = Math.min(1, 24 / cap.text.replace(/[*!^]/g, "").length);

  const sp = splitAmount(frame);
  // full: above the head on the roof. split: just under the seam, over hair only.
  const y = CAPTION_Y; // inside the client's box over the ceiling
  const light = false;
  const hide = Math.max(
    ...FULL.map((s) => prog(frame, sec(s.from), 6) * (1 - prog(frame, sec(s.to) - 6, 6))),
  );
  // while the layout moves between full and split, the caption steps out (it would cross the face)
  const moving = Math.min(1, Math.max(0, Math.min(sp, 1 - sp) * 6));
  const exit = Math.max(prog(frame, end - 4, 4, easeIn), hide, moving);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: y,
          flexWrap: "nowrap",
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
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
                fontSize: (key ? 74 : 64) * fit,
                letterSpacing: -1,
                lineHeight: 1.15,
                color: light && !key ? C.paperInk : kindColor[tk.kind],
                textShadow: "0 3px 8px rgba(0,0,0,.32)",
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
