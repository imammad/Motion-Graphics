import { AbsoluteFill } from "remotion";
import { Backdrop, Theme, fontFamily, ramp } from "./theme";

const backdropImage = (t: Theme, backdrop: Backdrop) => {
  if (backdrop === "grid")
    return {
      backgroundImage: `linear-gradient(${t.line} 1.5px, rgba(0,0,0,0) 1.5px), linear-gradient(90deg, ${t.line} 1.5px, rgba(0,0,0,0) 1.5px)`,
      backgroundSize: "80px 80px",
    };
  if (backdrop === "beam")
    return {
      backgroundImage: `linear-gradient(112deg, rgba(0,0,0,0) 28%, ${t.tint} 50%, rgba(0,0,0,0) 72%)`,
    };
  if (backdrop === "spotlight")
    return {
      backgroundImage: `radial-gradient(60% 75% at 50% -10%, ${t.tint} 0%, rgba(0,0,0,0) 70%)`,
    };
  return {};
};

// Shared ground for every graphic: gradient, dot texture, vignette, optional
// backdrop pattern, the heading block and the source line.
export const Frame: React.FC<{
  t: Theme;
  time: number;
  heading: string;
  kicker: React.ReactNode;
  source: string;
  backdrop?: Backdrop;
  center?: boolean;
  children: React.ReactNode;
}> = ({ t, time, heading, kicker, source, backdrop = "glow", center, children }) => {
  const head = ramp(time, 0, 0.6);
  return (
    <AbsoluteFill style={{ fontFamily, color: t.ink, background: t.base }}>
      <AbsoluteFill style={{ background: t.bg }} />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${t.tex} 1px, rgba(0,0,0,0) 1.6px)`,
          backgroundSize: "5px 5px",
        }}
      />
      <AbsoluteFill style={{ background: t.vig }} />
      <AbsoluteFill style={backdropImage(t, backdrop)} />

      {/* Slow push-in keeps a held chart alive without moving the data. */}
      <AbsoluteFill style={{ scale: 1 + 0.025 * Math.min(1, time / 20) }}>
        {children}
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 150,
          right: center ? 150 : undefined,
          top: 88,
          display: "flex",
          flexDirection: "column",
          alignItems: center ? "center" : "flex-start",
          textAlign: center ? "center" : "left",
          gap: 16,
          opacity: head,
          translate: `0px ${(1 - head) * 24}px`,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.1,
            color: t.head,
            letterSpacing: "-0.01em",
          }}
        >
          {heading}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: t.accentText,
          }}
        >
          <div
            style={{
              width: 30,
              height: 6,
              borderRadius: 4,
              background: t.accent,
              boxShadow: `0 0 12px ${t.glow}`,
            }}
          />
          <div>{kicker}</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 150,
          bottom: 40,
          fontSize: 18,
          color: t.faint,
          opacity: head,
        }}
      >
        {source}
      </div>
    </AbsoluteFill>
  );
};
