import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { C, F, FPS, H, W } from "./brand";
import { easeInOut, easeOut, prog, sec } from "./kit";
import { BEHIND, CAM, CUTS, DURATION_S, SPLITS, faceAt } from "./timeline";

/**
 * Framing, driven by the tracked face of the current clip:
 * - full frame: zoom around the face, nudge it toward centre x when the zoom allows.
 *   Captions sit ABOVE the head on the roof (never on the face).
 * - split: speaker in the bottom 960 px, face centre at local y 540, so the caption
 *   at the top of that box only covers hair.
 */
export const framing = (t: number, sp: number) => {
  const face = faceAt(t);
  // smooth cuts: every jump cut lands slightly zoomed and settles in over 0.45 s
  const settle = 1 + 0.04 * (1 - cutSettle(t));
  const cam = camScale(t) * settle;
  const s = cam * (1 - sp) + 1.0 * sp * settle;
  // horizontal centring limited by what the zoom can cover
  const tx = Math.min(face.cx * s, Math.max(W - (W - face.cx) * s, 540));
  const dx = (tx - face.cx) * (1 - sp);
  const ty = sp * (540 - face.cy);
  return { face, s, dx, ty };
};

/** 0 right at a cut → 1 once settled (0.45 s, ease-out). */
export const cutSettle = (t: number) => {
  const c = CUTS.filter((x) => x <= t).pop();
  if (c === undefined) return 1;
  return interpolate(t - c, [0, 0.45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
};

/** Top y of the full-frame caption line: 140 px above the hair, inside the safe area. */
export const captionTopFull = (t: number) => {
  const { face, s } = framing(t, 0);
  const hairTop = face.cy - 0.85 * face.h * s;
  return Math.max(270, Math.min(560, hairTop - 140));
};

/** Full-frame caption line BELOW the chin (this footage: black tee, face high in frame). */
export const captionYFull = (t: number) => {
  const { face, s } = framing(t, 0);
  const chin = face.cy + 0.58 * face.h * s;
  return Math.max(1165, Math.min(1400, chin + 36));
};

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


/** 0 = full-frame speaker, 1 = speaker in bottom half. Merges adjacent splits. */
export const splitAmount = (frame: number) => {
  let v = 0;
  for (const s of SPLITS) {
    const a = sec(s.from);
    const b = sec(s.to);
    const inT = s.from === 0 ? 1 : prog(frame, a, 20, easeInOut); // hook opens already split
    const outT = s.to >= DURATION_S - 0.1 ? 0 : prog(frame, b - 18, 18, easeInOut);
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

const BehindWord: React.FC<{ word: string; tone: string; dur: number; at: number }> = ({ word, tone, dur, at }) => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 16);
  const o = prog(f, dur - 8, 8);
  const size = Math.min(400, 1720 / Math.max(3, word.length));
  const face = faceAt(at);
  const centre = face.cy - 0.78 * face.h - 95;
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          top: centre - size * 0.62,
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
          filter: `blur(${(1 - t) * 14 + o * 10}px) drop-shadow(0 8px 22px rgba(0,0,0,.28))`,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

const CutDissolve: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const o = 1 - prog(f, 0, 7, easeInOut);
  return <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: o }} />;
};

export const Speaker: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const sp = splitAmount(frame);
  const { face, s, dx, ty } = framing(t, sp);
  const top = sp * 960;
  const boxH = H - top;

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
            transformOrigin: `${face.cx}px ${face.cy}px`,
            transform: `translate(${dx}px, ${ty}px) scale(${s})`,
            filter: `blur(${(1 - Math.min(1, cutSettle(t) * 3)) * 5}px)`,
          }}
        >
          {video("anfaal3/cut.mp4")}
          {/* smooth jump cuts: the outgoing shot's last frame dissolves over the incoming one */}
          {CUTS.map((c) => (
            <Sequence key={c} from={sec(c)} durationInFrames={7} layout="none">
              <CutDissolve src={`anfaal3/cut_${c.toFixed(2)}.png`} />
            </Sequence>
          ))}
          {/* tame the bright marble above the head so words/pills read */}
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,12,8,.42) 0%, rgba(5,12,8,.22) 30%, rgba(5,12,8,0) 50%)" }} />
          {BEHIND.map((b) => {
            const from = sec(b.from);
            const dur = sec(b.to) - from;
            return (
              <Sequence key={b.word + b.from} from={from} durationInFrames={dur} layout="none">
                <AbsoluteFill>
                  <BehindWord word={b.word} tone={b.tone} dur={dur} at={b.from} />
                </AbsoluteFill>
                <AbsoluteFill>
                  <OffthreadVideo
                    src={staticFile("anfaal3/person.webm")}
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
        {/* soft grade finish: light vignette only */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(130% 85% at 50% 42%, transparent 62%, rgba(0,0,0,.22) 100%)",
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
  const inT = from === 0 ? 1 : prog(frame, 0, 20, easeInOut);
  const last = to >= DURATION_S - 0.1;
  const outT = last ? 0 : prog(frame, dur - 18, 18, easeInOut);
  const y = -(1 - inT) * 960 - outT * 960;
  // content lags the panel a touch and settles with a soft spring (follow-through)
  const settle = from === 0 ? 1 : spring({ frame, fps: 30, config: { damping: 16, mass: 0.9, stiffness: 110 } });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: 960, overflow: "hidden", transform: `translateY(${y}px)` }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - settle) * -40}px) scale(${1.03 - 0.03 * settle})`, transformOrigin: "50% 0%" }}>
        {children}
      </div>
    </div>
  );
};

/** Full-screen container: circle reveal from the face, quick scale/blur exit. */
export const FullScreen: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const rv = spring({ frame, fps: 30, config: { damping: 20, mass: 1, stiffness: 90 } });
  const r = Math.min(1, rv) * 130;
  const out = prog(frame, dur - 12, 12, easeInOut);
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${r}% at 50% 36%)`,
        opacity: 1 - out,
        transform: `scale(${1 + out * 0.05})`,
        filter: `blur(${out * 10}px)`,
      }}
    >
      <AbsoluteFill style={{ transform: `scale(${1.08 - 0.08 * rv})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
