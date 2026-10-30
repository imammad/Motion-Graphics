import { interpolate, useCurrentFrame } from "remotion";
import { EASE, fontFamily, LOWER_THIRD } from "./theme";

const TOP = 1518;
const HEIGHT = 190;
const ACCENT_X = 64;
const ACCENT_W = 9;
const FULL_R = 880;

// Block edges per frame: a sliver appears, opens into a bar, then retracts to
// the accent line and uncovers the name, as in the original.
const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 17];
const LEFT = [126, 124, 100, 60, 20, 0, 0, 0, 0, 0, ACCENT_X];
const RIGHT = [
  134,
  136,
  160,
  200,
  320,
  560,
  820,
  FULL_R,
  FULL_R,
  300,
  ACCENT_X + ACCENT_W,
];

export const LowerThird: React.FC<{
  name: string;
  title: string;
}> = ({ name, title }) => {
  const frame = useCurrentFrame();
  if (frame < 1) return null;

  const opts = {
    easing: EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  const left = interpolate(frame, KEYS, LEFT, opts);
  const right = interpolate(frame, KEYS, RIGHT, opts);
  const textClip = frame < 9 ? 1080 : right;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: ACCENT_X + ACCENT_W + 22,
          top: TOP,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 10,
          fontFamily,
          color: "#ffffff",
          whiteSpace: "nowrap",
          clipPath: `inset(-20px -20px -20px ${textClip - (ACCENT_X + ACCENT_W + 22)}px)`,
          textShadow: "0 2px 18px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            fontSize: 70,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {name}
        </div>
        <div
          style={{ fontSize: 31, fontWeight: 450, letterSpacing: "0.005em" }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left,
          top: TOP,
          width: Math.max(0, right - left),
          height: HEIGHT,
          background: LOWER_THIRD,
        }}
      />
    </>
  );
};
