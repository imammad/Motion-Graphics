import { OffthreadVideo, useCurrentFrame } from "remotion";
import { SOURCE, SRC_H, SRC_W } from "./theme";

export type Rect = { x: number; y: number; w: number; h: number };

// Largest rect of the given aspect inside `src`, centred on focus (0-1 of src).
export const coverRect = (
  src: Rect,
  aspect: number,
  fx = 0.5,
  fy = 0.5,
): Rect => {
  if (src.w / src.h > aspect) {
    const w = src.h * aspect;
    const x = Math.min(
      Math.max(src.x + fx * src.w - w / 2, src.x),
      src.x + src.w - w,
    );
    return { x, y: src.y, w, h: src.h };
  }
  const h = src.w / aspect;
  const y = Math.min(
    Math.max(src.y + fy * src.h - h / 2, src.y),
    src.y + src.h - h,
  );
  return { x: src.x, y, w: src.w, h };
};

type Props = {
  // Source frame this window starts at; the local frame advances it 1:1.
  startFrom: number;
  // Region of the 4K source (in source pixels) to show, per local frame.
  window: (frame: number) => Rect;
  // Where the window lands on the vertical canvas (defaults to full frame).
  dest?: (frame: number) => Rect;
  // Where to centre the crop when the window is wider/taller than the dest (0-1).
  focus?: [number, number];
};

const FULL: Rect = { x: 0, y: 0, w: 1080, h: 1920 };

// Shows a region of the original 4K master, scaled to fill a destination rect.
export const SourceWindow: React.FC<Props> = ({
  startFrom,
  window,
  dest,
  focus = [0.5, 0.5],
}) => {
  const frame = useCurrentFrame();
  const d = dest ? dest(frame) : FULL;
  const s = coverRect(window(frame), d.w / d.h, focus[0], focus[1]);
  const k = d.w / s.w;

  return (
    <div
      style={{
        position: "absolute",
        left: d.x,
        top: d.y,
        width: d.w,
        height: d.h,
        overflow: "hidden",
      }}
    >
      <OffthreadVideo
        src={SOURCE}
        startFrom={startFrom}
        muted
        style={{
          position: "absolute",
          left: -s.x * k,
          top: -s.y * k,
          width: SRC_W * k,
          height: SRC_H * k,
          maxWidth: "none",
        }}
      />
    </div>
  );
};
