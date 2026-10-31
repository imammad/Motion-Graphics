import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, F, FPS, H, W } from "./brand";
import { easeInOut, easeOut, prog, sec } from "./kit";
import { BEHIND, CAM, CUTS, SCENES } from "./timeline";

const FACE_X = 540;
const FACE_Y = 990; // face centre in source footage

/** Chin y on screen (full-frame) for a camera scale; captions stay below it. */
// Full-frame framing: face raised to y=860 with a 1.14 base scale (covers the frame),
// camera keys add up to ~12% on top. Chin sits ~460 px below the face centre in source.
const FULL_FACE_Y = 860;
export const fullScale = (cam: number) => 1.14 + (cam - 1) * 0.8;
export const chinY = (cam: number) => FULL_FACE_Y + 460 * fullScale(cam);

/** Camera scale at time t (seconds): eased between keys, hard jumps on `hold` keys. */
export const camScale = (t: number) => {
  let k = 0;
  while (k < CAM.length - 1 && CAM[k + 1].t <= t) k++;
  const a = CAM[k];
  const b = CAM[k + 1];
  let s = a.s;
  if (b && !b.hold) {
    s = interpolate(t, [a.t, b.t], [a.s, b.s], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeInOut,
    });
  }
  // idle push-in since the last cut so the frame never sits still
  const lastCut = [0, ...CUTS].filter((c) => c <= t).pop() ?? 0;
  return s * (1 + 0.003 * (t - lastCut));
};

const SPLITS = [SCENES.rateSplit, SCENES.oddsSplit, SCENES.rangeSplit, SCENES.supportSplit, SCENES.ctaSplit];

/** 0 = full-frame speaker, 1 = speaker in bottom half. Merges adjacent splits. */
export const splitAmount = (frame: number) => {
  let v = 0;
  for (const s of SPLITS) {
    const a = sec(s.from);
    const b = sec(s.to);
    const inT = prog(frame, a, 16, easeInOut);
    const outT = b >= sec(60) ? 0 : prog(frame, b - 14, 14, easeInOut);
    v = Math.max(v, inT * (1 - outT));
  }
  return v;
};

const toneFill: Record<string, string> = {
  white: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 45%, #C9CFCB 100%)",
  gold: "linear-gradient(180deg, #FFF1CF 0%, #E2BF77 45%, #A07A35 100%)",
  red: "linear-gradient(180deg, #FFD6D7 0%, #FF6B70 50%, #C9343A 100%)",
  green: "linear-gradient(180deg, #DFFFEC 0%, #4BE394 50%, #149A54 100%)",
};

const BehindWord: React.FC<{ word: string; tone: string; dur: number }> = ({ word, tone, dur }) => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 16);
  const o = prog(f, dur - 8, 8);
  const size = Math.min(400, 1720 / Math.max(3, word.length));
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 660 - size * 0.62,
          fontFamily: F.display,
          fontSize: size,
          lineHeight: 1.1,
          letterSpacing: -2 + (1 - t) * 30,
          whiteSpace: "nowrap",
          backgroundImage: toneFill[tone],
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          opacity: t * (1 - o),
          transform: `translateY(${(1 - t) * 60}px) scale(${0.92 + 0.08 * t + 0.03 * (f / dur)})`,
          filter: `blur(${(1 - t) * 14 + o * 10}px) drop-shadow(0 18px 40px rgba(0,0,0,.35))`,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

export const Speaker: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sp = splitAmount(frame);
  // in split, frame wider so the caption above the speaker sits on hair/roof, never the face
  const s = fullScale(camScale(t)) * (1 - sp) + 1.0 * sp;
  const top = sp * 960;
  // keep the face centred in whatever box the speaker occupies
  const boxH = H - top;
  const faceTarget = interpolate(sp, [0, 1], [FULL_FACE_Y, boxH * 0.5]);
  const ty = faceTarget - FACE_Y;

  const video = (src: string, transparent = false) => (
    <OffthreadVideo src={staticFile(src)} transparent={transparent} muted style={{ width: W, height: H }} />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <div style={{ position: "absolute", left: 0, top, width: W, height: boxH, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: W,
            height: H,
            transformOrigin: `${FACE_X}px ${FACE_Y}px`,
            transform: `translateY(${ty}px) scale(${s})`,
          }}
        >
          {video("anfaal/cut.mp4")}
          {BEHIND.map((b) => {
            const from = sec(b.from);
            const dur = sec(b.to) - from;
            return (
              <Sequence key={b.word + b.from} from={from} durationInFrames={dur} layout="none">
                <AbsoluteFill>
                  <BehindWord word={b.word} tone={b.tone} dur={dur} />
                </AbsoluteFill>
                <AbsoluteFill>
                  <OffthreadVideo
                    src={staticFile("anfaal/person.webm")}
                    transparent
                    muted
                    trimBefore={from}
                    style={{ width: W, height: H }}
                  />
                </AbsoluteFill>
              </Sequence>
            );
          })}
        </div>
        {/* soft grade finish: vignette + bottom shade for caption legibility */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(120% 75% at 50% 40%, transparent 55%, rgba(0,0,0,.35) 100%), linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.28) 100%)",
          }}
        />
        {/* split seam: thin green line on the top edge of the speaker box */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`,
            opacity: sp,
            boxShadow: `0 0 18px ${C.greenGlow}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Split panel container: slides down from the top while the split opens. */
export const SplitPanel: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame(); // local to the Sequence
  const dur = sec(to) - sec(from);
  const inT = prog(frame, 0, 16, easeInOut);
  const last = to >= 60;
  const outT = last ? 0 : prog(frame, dur - 14, 14, easeInOut);
  const y = -(1 - inT) * 960 - outT * 960;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 960, overflow: "hidden", transform: `translateY(${y}px)` }}>
      {children}
    </div>
  );
};

/** Full-screen container: circle reveal from the face, quick scale/blur exit. */
export const FullScreen: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const r = prog(frame, 0, 15, easeOut) * 130;
  const out = prog(frame, dur - 9, 9, easeInOut);
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${r}% at 50% 36%)`,
        opacity: 1 - out,
        transform: `scale(${1 + out * 0.06})`,
        filter: `blur(${out * 10}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
