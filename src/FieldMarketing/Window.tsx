import { BLUE_TINT, CARD_SHADOW, MUTED, WHITE, fontFamily } from "./theme";

type Props = {
  title: string;
  width: number;
  height?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

// SaaS app window chrome.
export const Window: React.FC<Props> = ({ title, width, height, children, style }) => (
  <div
    style={{
      width,
      height,
      background: WHITE,
      borderRadius: 28,
      boxShadow: CARD_SHADOW,
      border: `1.5px solid ${BLUE_TINT}`,
      overflow: "hidden",
      fontFamily,
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 26px",
        borderBottom: `1.5px solid ${BLUE_TINT}`,
        flexShrink: 0,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{ width: 14, height: 14, borderRadius: 7, background: i === 0 ? "#3D8AFC" : BLUE_TINT }}
        />
      ))}
      <div style={{ marginLeft: 18, fontSize: 24, fontWeight: 600, color: MUTED }}>{title}</div>
    </div>
    <div style={{ flex: 1, position: "relative" }}>{children}</div>
  </div>
);
