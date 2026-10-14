import { BoltIcon, GridIcon, ScanIcon, UsersIcon } from "../Wave/Icons";
import { BLUE, BLUE_MIST, BLUE_PALE, CARD_SHADOW, GREY, INK, WHITE } from "../Wave/theme";

type Tool = { name: string; Icon: React.FC<{ size?: number; color?: string }> };

// The four tools the script walks through, in order.
export const TOOLS: Tool[] = [
  { name: "CRM", Icon: UsersIcon },
  { name: "Automation", Icon: BoltIcon },
  { name: "Event calendar", Icon: GridIcon },
  { name: "Lead capture", Icon: ScanIcon },
];

export const ToolTile: React.FC<{ tool: Tool; size?: number }> = ({ tool, size = 130 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: WHITE,
        boxShadow: `${CARD_SHADOW}, inset 0 0 0 1.5px ${BLUE_PALE}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: size * 0.62,
          height: size * 0.62,
          borderRadius: "50%",
          background: BLUE_MIST,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <tool.Icon size={size * 0.36} color={BLUE} />
      </div>
    </div>
    <div style={{ fontSize: size * 0.2, fontWeight: 500, color: INK, whiteSpace: "nowrap" }}>{tool.name}</div>
  </div>
);

// App window chrome: three dots, icon and title, then content.
export const AppWindow: React.FC<{
  tool: Tool;
  title?: string;
  width: number;
  height: number;
  right?: React.ReactNode;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ tool, title, width, height, right, style, children }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 32,
      background: WHITE,
      boxShadow: `${CARD_SHADOW}, inset 0 0 0 1.5px rgba(212, 230, 252, 0.9)`,
      overflow: "hidden",
      position: "relative",
      ...style,
    }}
  >
    <div style={{ height: 96, padding: "0 32px", display: "flex", alignItems: "center", gap: 22, borderBottom: "2px solid #EEF2F8" }}>
      <div style={{ display: "flex", gap: 9 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: BLUE_PALE }} />
        ))}
      </div>
      <tool.Icon size={32} color={BLUE} />
      <div style={{ fontSize: 30, fontWeight: 600, color: INK }}>{title ?? tool.name}</div>
      <div style={{ flex: 1 }} />
      {right ?? <div style={{ fontSize: 20, color: GREY }} />}
    </div>
    {children}
  </div>
);
