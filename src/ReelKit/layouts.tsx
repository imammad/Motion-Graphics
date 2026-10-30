import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { easeInOut, easeOut, progress } from "./motion";
import { Paper } from "./Paper";
import { Speaker, ZoomKey } from "./Speaker";

/**
 * The four scene types from the planning page:
 *   captions     → <Speaker/> + <Caption/>
 *   captions_ui  → <Speaker focusUI/> + <Caption/> + <LowerThird>…</LowerThird>
 *   half         → <HalfScreen top={animation} …/>
 *   full         → <FullScreen>…</FullScreen>
 */

/** Animation on the top half (paper world), speaker on the bottom half. */
export const HalfScreen: React.FC<{
  top: React.ReactNode;
  bottom?: React.ReactNode; // captions over the speaker half
  speakerSrc?: string;
  speakerStartFrom?: number;
  split?: number; // 0..1 height of the top half
  zooms?: ZoomKey[];
}> = ({ top, bottom, speakerSrc, speakerStartFrom, split = 0.5, zooms }) => {
  const { height } = useVideoConfig();
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 12);
  const topH = height * split;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: topH, bottom: 0, overflow: "hidden" }}>
        <Speaker muted src={speakerSrc} startFrom={speakerStartFrom} zooms={zooms ?? [{ at: 0, scale: 1.25, y: -200 }]} />
        {bottom}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: topH,
          overflow: "hidden",
          // Panel slides down from the top edge.
          transform: `translateY(${(1 - enter) * -topH}px)`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
        }}
      >
        <Paper>{top}</Paper>
      </div>
    </AbsoluteFill>
  );
};

export type CameraKey = { at: number; scale: number; x?: number; y?: number; rotate?: number };

/**
 * Full-screen scene on paper, with a camera that can track the action:
 * slow zoom-out, snap to a new angle, slow push-ins. Children are laid out on a
 * 1080×1920 canvas and the camera transforms that canvas.
 */
export const FullScreen: React.FC<{
  children: React.ReactNode;
  camera?: CameraKey[];
  reveal?: "circle" | "square" | "none";
  revealFrames?: number;
}> = ({ children, camera, reveal = "circle", revealFrames = 14 }) => {
  const frame = useCurrentFrame();
  const keys = camera ?? [
    { at: 0, scale: 1.08 },
    { at: 240, scale: 1.0 },
  ];
  let c = { scale: keys[0].scale, x: keys[0].x ?? 0, y: keys[0].y ?? 0, rotate: keys[0].rotate ?? 0 };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame >= a.at) {
      const t = progress(frame, a.at, Math.max(1, b.at - a.at), easeInOut);
      c = {
        scale: a.scale + (b.scale - a.scale) * t,
        x: (a.x ?? 0) + ((b.x ?? 0) - (a.x ?? 0)) * t,
        y: (a.y ?? 0) + ((b.y ?? 0) - (a.y ?? 0)) * t,
        rotate: (a.rotate ?? 0) + ((b.rotate ?? 0) - (a.rotate ?? 0)) * t,
      };
    }
  }
  const r = reveal === "none" ? 1 : progress(frame, 0, revealFrames, easeOut);
  const clip =
    reveal === "circle"
      ? `circle(${r * 120}% at 50% 50%)`
      : reveal === "square"
        ? `inset(${(1 - r) * 45}% ${(1 - r) * 45}% ${(1 - r) * 45}% ${(1 - r) * 45}% round ${(1 - r) * 60}px)`
        : undefined;
  return (
    <AbsoluteFill style={{ clipPath: clip }}>
      <Paper>
        <AbsoluteFill
          style={{
            transform: `translate(${c.x}px, ${c.y}px) scale(${c.scale}) rotate(${c.rotate}deg)`,
          }}
        >
          {children}
        </AbsoluteFill>
      </Paper>
    </AbsoluteFill>
  );
};
