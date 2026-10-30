import {
  AbsoluteFill,
  Freeze,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Background } from "./Background";
import { Rect, SourceWindow } from "./SourceWindow";
import { SPLIT_TRACK } from "./splitTrack";
import { EASE, SRC_H, SRC_W } from "./theme";

// Below the burned-in corner logo of the master, so it never enters a b-roll crop.
export const CLEAN_SRC: Rect = { x: 0, y: 280, w: SRC_W, h: SRC_H - 280 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
});

// Full-height 9:16 window centred on the speaker (cx = face centre, 0-1).
export const TalkingHead: React.FC<{ startFrom: number; cx: number }> = ({
  startFrom,
  cx,
}) => {
  const w = (SRC_H * 9) / 16;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <SourceWindow
        startFrom={startFrom}
        window={() => ({ x: cx * SRC_W - w / 2, y: 0, w, h: SRC_H })}
      />
    </AbsoluteFill>
  );
};

// Opening shot, pre-cropped with the old lower third painted out
// (scripts/prepare-footage.sh) so the vertical lower third can replace it.
export const OpeningTalkingHead: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo src={staticFile("footage/th1.mp4")} muted />
  </AbsoluteFill>
);

// B-roll reframed to 9:16 with an eased pan from focus `from` to `to` (0-1).
export const BRoll: React.FC<{
  startFrom: number;
  duration: number;
  from: number;
  to: number;
}> = ({ startFrom, duration, from, to }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <SourceWindow
      startFrom={startFrom}
      window={(f) => {
        const fx = interpolate(f, [0, duration - 1], [from, to], {
          easing: EASE,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const w = (CLEAN_SRC.h * 9) / 16;
        return { x: fx * SRC_W - w / 2, y: CLEAN_SRC.y, w, h: CLEAN_SRC.h };
      }}
    />
  </AbsoluteFill>
);

// Pen signing -> pen card + office card -> office full screen. The cards only
// ever show the footage region the original cards showed (tracked per frame).
const SPLIT_START = 415;
const FULL: Rect = { x: 0, y: 0, w: 1080, h: 1920 };
const PEN_CARD: Rect = { x: 150, y: 300, w: 520, h: 609 };
const OFFICE_CARD: Rect = { x: 410, y: 1030, w: 560, h: 560 };
const OFFICE_BASE: Rect = { x: 1916, y: 496, w: 1172, h: 1172 };
const PEN_FREEZE = 497 - SPLIT_START;
const OFFICE_FOCUS = 0.62;

export const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const row = SPLIT_TRACK[Math.min(frame, SPLIT_TRACK.length - 1)];
  const officeVisible = frame >= 436 - SPLIT_START;
  const officeFull = row.grow >= 1;

  const penDest = (f: number): Rect => {
    const r = SPLIT_TRACK[Math.min(f, SPLIT_TRACK.length - 1)];
    const target = { ...PEN_CARD, y: PEN_CARD.y + 150 * r.d };
    return lerpRect(FULL, target, r.q);
  };
  const officeDest = (f: number): Rect => {
    const r = SPLIT_TRACK[Math.min(f, SPLIT_TRACK.length - 1)];
    const card = { ...OFFICE_CARD, y: OFFICE_CARD.y + 480 * r.slide };
    return lerpRect(card, FULL, r.grow);
  };
  const officeWindow = (f: number): Rect => {
    const r = SPLIT_TRACK[Math.min(f, SPLIT_TRACK.length - 1)];
    if (r.grow > 0 || !r.office) {
      return lerpRect(OFFICE_BASE, CLEAN_SRC, r.grow);
    }
    return r.office;
  };

  const pen = (
    <SourceWindow
      startFrom={SPLIT_START}
      window={(f) => SPLIT_TRACK[Math.min(f, PEN_FREEZE)].pen}
      dest={penDest}
      focus={[0.45, 0.5]}
    />
  );

  // Doc-shaped mask: the top-right corner folds in as the card shrinks.
  const pd = penDest(frame);
  const cut = row.q * 0.27 * pd.w;
  const penClip = `polygon(0 0, ${pd.w - cut}px 0, ${pd.w}px ${cut}px, ${pd.w}px ${pd.h}px, 0 ${pd.h}px)`;

  // "D" mask for the office card, relaxing to a full rectangle as it grows.
  const od = officeDest(frame);
  const big = (1 - row.grow) * od.w * 0.46;
  const officeRadius = `${(1 - row.grow) * 22}px ${big}px ${big}px ${(1 - row.grow) * od.w * 0.4}px`;

  // Pan across the office once it is full screen, as the original keeps moving.
  const officePan = interpolate(
    frame,
    [505 - SPLIT_START, 544 - SPLIT_START],
    [OFFICE_FOCUS, 0.3],
    {
      easing: EASE,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill>
      <Background />
      <div
        style={{
          position: "absolute",
          clipPath: penClip,
          left: pd.x,
          top: pd.y,
          width: pd.w,
          height: pd.h,
          borderRadius: 14 * row.q,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -pd.x,
            top: -pd.y,
            width: 1080,
            height: 1920,
          }}
        >
          {frame > PEN_FREEZE ? <Freeze frame={PEN_FREEZE}>{pen}</Freeze> : pen}
        </div>
      </div>
      {officeVisible ? (
        <div
          style={{
            position: "absolute",
            left: od.x,
            top: od.y,
            width: od.w,
            height: od.h,
            borderRadius: officeRadius,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -od.x,
              top: -od.y,
              width: 1080,
              height: 1920,
            }}
          >
            {officeFull ? (
              <SourceWindow
                startFrom={SPLIT_START}
                window={() => {
                  const w = (CLEAN_SRC.h * 9) / 16;
                  return {
                    x: officePan * SRC_W - w / 2,
                    y: CLEAN_SRC.y,
                    w,
                    h: CLEAN_SRC.h,
                  };
                }}
              />
            ) : (
              <SourceWindow
                startFrom={SPLIT_START}
                window={officeWindow}
                dest={officeDest}
                focus={[OFFICE_FOCUS, 0.5]}
              />
            )}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
