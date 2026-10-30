import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { Doc, DOC_RATIO } from "./Doc";
import { LOGO_H, LOGO_IAM_W, Logo, MARK_W } from "./Logo";
import { CORAL, EASE, EASE_OUT, VIOLET } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const CY = 960;
const DOC_W = 230;
const DOC_H = DOC_W * DOC_RATIO;

// --- Scrolling wall of documents (local 0-48) -----------------------------

const COLS = [180, 540, 900];
const COL_OFFSET = [-150, 0, 150];
const ROW_PITCH = 440;

const DocWall: React.FC<{ frame: number }> = ({ frame }) => {
  const scroll = interpolate(frame, [0, 42], [1, 0], {
    ...clamp,
    easing: EASE_OUT,
  });
  const speed = interpolate(frame, [0, 20], [1, 0], clamp);
  const fade = interpolate(frame, [44, 48], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{ filter: speed > 0.05 ? `blur(${speed * 6}px)` : undefined }}
    >
      {COLS.map((x, c) =>
        [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((r) => {
          const y =
            CY -
            DOC_H / 2 +
            r * ROW_PITCH +
            COL_OFFSET[c] +
            scroll * (2200 + c * 260);
          if (y < -DOC_H - 50 || y > 1970) return null;
          const center = c === 1 && r === 0;
          return (
            <div
              key={`${c}-${r}`}
              style={{
                position: "absolute",
                left: x - DOC_W / 2,
                top: y,
                opacity: center ? 1 : fade,
              }}
            >
              <Doc width={DOC_W} />
            </div>
          );
        }),
      )}
    </AbsoluteFill>
  );
};

// --- Ring of gradient orbs around the page (local 52-96) ------------------

const ORBS = 8;
const RING_R = 360;
const ORB_R = 88;

const Orbs: React.FC<{ frame: number }> = ({ frame }) => {
  const spin = Math.max(0, frame - 70) * 0.9;
  const collapse = interpolate(frame, [90, 96], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const gather = { x: 430, y: 820 };

  return (
    <>
      {new Array(ORBS).fill(0).map((_, i) => {
        const p = interpolate(frame, [52 + i * 1.6, 68 + i * 1.6], [0, 1], {
          ...clamp,
          easing: EASE_OUT,
        });
        if (p <= 0) return null;
        const a0 = -62;
        const af = a0 + (ORBS - i) * (360 / ORBS) + spin;
        const a = ((a0 + (af - a0) * p) * Math.PI) / 180;
        const r = RING_R + 420 * (1 - p) * (1 - p);
        let x = CX + Math.cos(a) * r;
        let y = CY + Math.sin(a) * r;
        x += (gather.x - x) * collapse;
        y += (gather.y - y) * collapse;
        const size = ORB_R * (1 - collapse * 0.8) * Math.min(1, p * 4);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size,
              top: y - size,
              width: size * 2,
              height: size * 2,
              borderRadius: "50%",
              background: `linear-gradient(${(a * 180) / Math.PI + 140}deg, ${VIOLET} 15%, #b52ac0 55%, ${CORAL} 100%)`,
              opacity: frame > 96 ? 0 : 1,
            }}
          />
        );
      })}
    </>
  );
};

// Doc wall -> single page orbited by the brand orbs -> logo resolve
// (original 37.36s to the end).
export const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();

  const docScale = interpolate(frame, [88, 96], [1, 0], {
    ...clamp,
    easing: EASE,
  });
  // The orbs gather into one dot that drifts to centre and becomes the mark.
  const dotT = interpolate(frame, [96, 104], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const dotX = 430 + (CX - 430) * dotT;
  const dotY = 820 + (CY - 820) * dotT;
  const markIn = interpolate(frame, [104, 110], [0, 1], {
    ...clamp,
    easing: EASE_OUT,
  });

  const s = 860 / LOGO_IAM_W;
  const reveal = interpolate(frame, [123, 139], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const iam = interpolate(frame, [132, 142], [0, 1], {
    ...clamp,
    easing: EASE,
  });
  const left = interpolate(
    reveal,
    [0, 1],
    [CX - (MARK_W * s) / 2, (1080 - LOGO_IAM_W * s) / 2],
  );
  const fadeOut = interpolate(frame, [190, 202], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <Background />
        {frame < 48 ? <DocWall frame={frame} /> : null}
        {frame >= 48 && docScale > 0 ? (
          <div
            style={{
              position: "absolute",
              left: CX - DOC_W / 2,
              top: CY - DOC_H / 2,
              transform: `scale(${docScale})`,
            }}
          >
            <Doc width={DOC_W} />
          </div>
        ) : null}
        <Orbs frame={frame} />
        {frame >= 96 && markIn < 1 ? (
          <div
            style={{
              position: "absolute",
              left: dotX - 18,
              top: dotY - 18,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `linear-gradient(140deg, ${VIOLET}, ${CORAL})`,
              transform: `scale(${1 - markIn})`,
            }}
          />
        ) : null}
        {markIn > 0 ? (
          <div
            style={{
              position: "absolute",
              left,
              top: CY - (LOGO_H * s) / 2,
              transform: `scale(${0.4 + 0.6 * markIn})`,
              transformOrigin: `${(MARK_W * s) / 2}px ${(LOGO_H * s) / 2}px`,
              opacity: Math.min(1, markIn * 2),
            }}
          >
            <Logo scale={s} reveal={reveal} iam={iam} />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
