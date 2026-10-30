import { Img, staticFile } from "remotion";
import { BRAND_BLUE, BRAND_RED } from "./theme";

// Layout in the units of the original 4K end card (1 unit = 1 source pixel).
export const LOGO_H = 314;
export const MARK_W = 244;
const WORD_X = 288;
const WORD_W = 1180;
const IAM_X = 1538;
const IAM_W = 446;
export const LOGO_W = WORD_X + WORD_W;
export const LOGO_IAM_W = IAM_X + IAM_W;

export const Mark: React.FC<{ size: number; style?: React.CSSProperties }> = ({
  size,
  style,
}) => (
  <svg
    width={size}
    height={(size * 246) / 244}
    viewBox="0 0 244 246"
    style={{ display: "block", overflow: "visible", ...style }}
  >
    <path
      d="M74 0 H181 A63 63 0 0 1 244 63 V111 A63 63 0 0 1 181 174 H74 A4 4 0 0 1 70 170 V4 A4 4 0 0 1 74 0 Z"
      fill={BRAND_RED}
    />
    <rect x={0} y={70} width={174} height={176} rx={5} fill={BRAND_BLUE} />
    <path
      d="M70 70 H137 L174 107 V174 H74 A4 4 0 0 1 70 170 Z"
      fill="#ffffff"
    />
  </svg>
);

type Props = {
  scale: number;
  // 0 = wordmark hidden behind the mark, 1 = fully revealed.
  reveal?: number;
  iam?: number;
  glow?: boolean;
};

export const Logo: React.FC<Props> = ({
  scale,
  reveal = 1,
  iam = 0,
  glow = true,
}) => {
  const shadow = glow
    ? "drop-shadow(0 0 10px rgba(255,255,255,0.35))"
    : undefined;
  const wordShift = (1 - reveal) * -WORD_W * 0.9;

  return (
    <div
      style={{
        position: "relative",
        width: LOGO_IAM_W * scale,
        height: LOGO_H * scale,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: WORD_X * scale,
          top: 0,
          width: (WORD_W + IAM_W + 200) * scale,
          height: LOGO_H * scale,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("brand/wordmark.png")}
          style={{
            position: "absolute",
            left: wordShift * scale,
            top: 0,
            width: WORD_W * scale,
            height: LOGO_H * scale,
            opacity: Math.min(1, reveal * 3),
            filter: shadow,
          }}
        />
        <Img
          src={staticFile("brand/iam.png")}
          style={{
            position: "absolute",
            left: (IAM_X - WORD_X) * scale,
            top: 0,
            width: IAM_W * scale,
            height: LOGO_H * scale,
            opacity: iam,
            filter: shadow,
          }}
        />
      </div>
      <Mark
        size={MARK_W * scale}
        style={{ position: "absolute", left: 0, top: 0, filter: shadow }}
      />
    </div>
  );
};

// The corner bug that sits on every shot of the original until the finale.
export const CornerLogo: React.FC = () => (
  <div style={{ position: "absolute", left: 64, top: 128 }}>
    <Logo scale={0.2} />
  </div>
);
