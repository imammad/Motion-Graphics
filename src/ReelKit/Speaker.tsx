import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { easeInOut, progress } from "./motion";
import { useStyle } from "./style";

export type ZoomKey = { at: number; scale: number; x?: number; y?: number };

/**
 * The talking-head layer (A-roll).
 * - `src`: file in /public (e.g. "footage/cut.mp4"). Without it a placeholder is drawn.
 * - `startFrom`: frame in the source video to start at (keeps speech in sync when split into Sequences).
 * - `zooms`: camera keyframes, eased in-out. Default is a slow push-in.
 * - `focusUI`: darkens and blurs the lower half so an on-screen UI reads clearly.
 */
export const Speaker: React.FC<{
  src?: string;
  startFrom?: number;
  zooms?: ZoomKey[];
  focusUI?: boolean;
  focusUIAt?: number;
  muted?: boolean;
}> = ({ src, startFrom = 0, zooms, focusUI = false, focusUIAt = 0, muted = false }) => {
  const frame = useCurrentFrame();
  const keys = zooms ?? [
    { at: 0, scale: 1.0 },
    { at: 300, scale: 1.06 },
  ];

  // Interpolate camera between keyframes.
  let scale = keys[0].scale;
  let x = keys[0].x ?? 0;
  let y = keys[0].y ?? 0;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.at) {
      const t = progress(frame, a.at, Math.max(1, b.at - a.at), easeInOut);
      scale = a.scale + (b.scale - a.scale) * t;
      x = (a.x ?? 0) + ((b.x ?? 0) - (a.x ?? 0)) * t;
      y = (a.y ?? 0) + ((b.y ?? 0) - (a.y ?? 0)) * t;
    }
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#07111f" }}>
      <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}>
        {src ? (
          <OffthreadVideo
            src={staticFile(src)}
            startFrom={startFrom}
            muted={muted}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <SpeakerPlaceholder />
        )}
      </AbsoluteFill>
      {/* Bottom vignette that is always there in the reference look */}
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)" }}
      />
      {focusUI ? <UIFocus at={focusUIAt} /> : null}
    </AbsoluteFill>
  );
};

/**
 * Darkens and blurs the lower half of whatever is underneath so an on-screen
 * UI reads clearly. `until` fades it back out.
 */
export const UIFocus: React.FC<{ at?: number; until?: number }> = ({ at = 0, until }) => {
  const frame = useCurrentFrame();
  const s = useStyle();
  const focus = progress(frame, at, 10) * (until === undefined ? 1 : 1 - progress(frame, until, 8));
  if (focus <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${focus * s.speakerBlur}px)`,
        WebkitMaskImage: "linear-gradient(180deg, transparent 38%, black 62%)",
        maskImage: "linear-gradient(180deg, transparent 38%, black 62%)",
        background: `linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,${focus * s.speakerDarken}) 70%, rgba(0,0,0,${
          focus * (s.speakerDarken + 0.15)
        }) 100%)`,
      }}
    />
  );
};

/** Stand-in for footage: studio-blue backdrop and a soft silhouette. */
const SpeakerPlaceholder: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = interpolate(Math.sin(frame / 18), [-1, 1], [0, 6]);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(90% 60% at 50% 30%, #1d4f86 0%, #0e2a4d 45%, #07111f 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 520 - breathe,
          width: 300,
          height: 360,
          marginLeft: -150,
          borderRadius: "48% 48% 44% 44%",
          background: "linear-gradient(180deg, #c99a7d, #8a5f49)",
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 860 - breathe,
          width: 760,
          height: 1100,
          marginLeft: -380,
          borderRadius: "46% 46% 0 0",
          background: "linear-gradient(180deg, #4a3326, #20160f)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120,
          textAlign: "center",
          color: "rgba(255,255,255,0.35)",
          fontFamily: "Inter",
          fontSize: 26,
          letterSpacing: 6,
        }}
      >
        SPEAKER FOOTAGE
      </div>
    </AbsoluteFill>
  );
};
