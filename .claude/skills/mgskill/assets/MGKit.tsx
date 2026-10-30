// MGKit: a single-file, dependency-free (only `remotion`) motion graphics kit.
// Copy into any Remotion project (e.g. src/MGKit.tsx). Every visual value comes
// from a `Style` object, so the same scene renders in any style.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/* ----------------------------- style ----------------------------- */

export type Style = {
  name: string;
  dark: boolean; // dark ground → glass cards, light ground → paper cards
  ground: string; // CSS background for full/half screens
  grid?: string; // grid line colour, omit for none
  gridSize?: number;
  castShadow?: boolean;
  glow?: string; // soft light behind the focal point (dark styles)
  ink: string;
  inkMuted: string;
  accent: string;
  accentGlow: string;
  sansFont: string;
  displayFont: string; // rendered italic bold by default
  displayStyle?: "italic" | "normal";
  captionColor: string;
  card: string; // card background
  cardBorder: string;
  cardShadow: string;
  uiGlass: string;
  energy: "calm" | "medium" | "high";
};

export const BLUE_MINIMAL: Style = {
  name: "blue-minimal",
  dark: false,
  ground: "radial-gradient(120% 80% at 50% 40%, #F4F2EE 0%, #F4F2EE 45%, #E6E3DE 100%)",
  grid: "rgba(20,20,20,0.08)",
  gridSize: 54,
  castShadow: true,
  ink: "#141414",
  inkMuted: "#8B8883",
  accent: "#3A7BFF",
  accentGlow: "rgba(58,123,255,0.55)",
  sansFont: "Inter",
  displayFont: "EB Garamond",
  captionColor: "#F3F3F3",
  card: "linear-gradient(180deg,#FFFFFF 0%,#F7F6F3 100%)",
  cardBorder: "transparent",
  cardShadow: "0 30px 60px rgba(40,36,30,.14), 0 6px 14px rgba(40,36,30,.08), inset 0 -4px 10px rgba(0,0,0,.04)",
  uiGlass: "rgba(18,18,22,0.72)",
  energy: "medium",
};

export const DARK_SAAS: Style = {
  name: "dark-saas",
  dark: true,
  ground: "radial-gradient(110% 70% at 50% 45%, #121a33 0%, #0B0F1A 45%, #05070D 100%)",
  grid: "rgba(255,255,255,0.04)",
  gridSize: 60,
  castShadow: false,
  glow: "rgba(108,123,255,0.35)",
  ink: "#EDEFF5",
  inkMuted: "#7D8597",
  accent: "#6C7BFF",
  accentGlow: "rgba(108,123,255,0.5)",
  sansFont: "Inter",
  displayFont: "EB Garamond",
  captionColor: "#F3F3F3",
  card: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
  cardBorder: "rgba(255,255,255,0.12)",
  cardShadow: "0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.12)",
  uiGlass: "rgba(10,12,20,0.75)",
  energy: "medium",
};

const StyleCtx = createContext<Style>(BLUE_MINIMAL);
export const StyleProvider = StyleCtx.Provider;
export const useMGStyle = () => useContext(StyleCtx);

/* ----------------------------- motion ---------------------------- */

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const progress = (f: number, start: number, dur: number, easing = easeOut) =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
export const pop = (f: number, fps: number, delay = 0) =>
  spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 140, mass: 0.9 } });
export const mix = (t: number, a: number, b: number) => a + (b - a) * t;
const staggerScale = { calm: 1.4, medium: 1, high: 0.7 };
/** Delay scaled by the style's energy. */
export const useBeat = () => staggerScale[useMGStyle().energy];

/* ----------------------------- ground ---------------------------- */

export const Ground: React.FC<{ children?: React.ReactNode; focusY?: number }> = ({ children, focusY = 50 }) => {
  const s = useMGStyle();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: s.ground, overflow: "hidden" }}>
      {s.glow ? (
        <AbsoluteFill style={{ background: `radial-gradient(45% 30% at 50% ${focusY}%, ${s.glow}, transparent 70%)` }} />
      ) : null}
      {s.grid ? (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${s.grid} 1px, transparent 1px), linear-gradient(90deg, ${s.grid} 1px, transparent 1px)`,
            backgroundSize: `${s.gridSize ?? 54}px ${s.gridSize ?? 54}px`,
            backgroundPosition: "center",
          }}
        />
      ) : null}
      {s.castShadow ? (
        <AbsoluteFill style={{ filter: "blur(38px)", opacity: 0.5, mixBlendMode: "multiply" }}>
          <div
            style={{
              position: "absolute",
              inset: "-40%",
              transform: `rotate(-32deg) translateX(${frame * 0.15}px)`,
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(90,80,70,.2) 0, rgba(90,80,70,.2) 70px, transparent 70px, transparent 420px)",
            }}
          />
        </AbsoluteFill>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};

/* ----------------------------- elements -------------------------- */

export const Card: React.FC<{ children?: React.ReactNode; at?: number; radius?: number; style?: React.CSSProperties }> = ({
  children,
  at = 0,
  radius = 36,
  style,
}) => {
  const s = useMGStyle();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, fps, at);
  return (
    <div
      style={{
        background: s.card,
        border: `1px solid ${s.cardBorder}`,
        borderRadius: radius,
        boxShadow: s.cardShadow,
        backdropFilter: s.dark ? "blur(20px)" : undefined,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 40}px) scale(${mix(p, 0.85, 1)})`,
        filter: `blur(${(1 - Math.min(1, p)) * 8}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const MicroLabel: React.FC<{ children: React.ReactNode; accent?: boolean; style?: React.CSSProperties }> = ({
  children,
  accent,
  style,
}) => {
  const s = useMGStyle();
  return (
    <div
      style={{
        fontFamily: s.sansFont,
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: accent ? s.accent : s.inkMuted,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Two-font headline. Mark the special phrase with *asterisks*. */
export const Headline: React.FC<{
  rows: string[];
  at?: number;
  sansSize?: number;
  displaySize?: number;
  color?: string; // defaults to ink (on ground); pass captionColor on footage
  align?: "center" | "left";
}> = ({ rows, at = 0, sansSize = 40, displaySize = 86, color, align = "center" }) => {
  const s = useMGStyle();
  const frame = useCurrentFrame();
  const beat = useBeat();
  let i = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start" }}>
      {rows.map((row, r) => (
        <div key={r} style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start" }}>
          {row
            .split(/(\*[^*]+\*)/g)
            .filter(Boolean)
            .flatMap((part) => {
              const special = part.startsWith("*");
              const words = (special ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean);
              return words.map((w) => {
                const t0 = at + i++ * 3 * beat;
                if (!special) {
                  const p = progress(frame, t0, 9);
                  return (
                    <span
                      key={`${r}-${i}`}
                      style={{
                        fontFamily: s.sansFont,
                        fontWeight: 500,
                        fontSize: sansSize,
                        color: color ?? s.ink,
                        marginRight: sansSize * 0.26,
                        display: "inline-block",
                        opacity: p,
                        transform: `translateY(${(1 - p) * 14}px)`,
                        filter: `blur(${(1 - p) * 6}px)`,
                      }}
                    >
                      {w}
                    </span>
                  );
                }
                return (
                  <span key={`${r}-${i}`} style={{ display: "inline-block", marginRight: displaySize * 0.22, whiteSpace: "nowrap" }}>
                    {[...w].map((ch, j) => {
                      const p = progress(frame, t0 + j * 1.2, 10);
                      return (
                        <span
                          key={j}
                          style={{
                            display: "inline-block",
                            fontFamily: s.displayFont,
                            fontStyle: s.displayStyle ?? "italic",
                            fontWeight: 700,
                            fontSize: displaySize,
                            lineHeight: 0.95,
                            color: s.accent,
                            textShadow: `0 0 28px ${s.accentGlow}`,
                            opacity: p,
                            transform: `translateY(${(1 - p) * 20}px)`,
                            filter: `blur(${(1 - p) * 9}px)`,
                          }}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                );
              });
            })}
        </div>
      ))}
    </div>
  );
};

/* ----------------------------- camera / reveal ------------------- */

export type CamKey = { at: number; scale: number; x?: number; y?: number; rotate?: number };

export const Camera: React.FC<{ keys: CamKey[]; children: React.ReactNode }> = ({ keys, children }) => {
  const frame = useCurrentFrame();
  let c = { scale: keys[0].scale, x: keys[0].x ?? 0, y: keys[0].y ?? 0, r: keys[0].rotate ?? 0 };
  for (let k = 0; k < keys.length - 1; k++) {
    const a = keys[k];
    const b = keys[k + 1];
    if (frame >= a.at) {
      const t = progress(frame, a.at, Math.max(1, b.at - a.at), easeInOut);
      c = {
        scale: mix(t, a.scale, b.scale),
        x: mix(t, a.x ?? 0, b.x ?? 0),
        y: mix(t, a.y ?? 0, b.y ?? 0),
        r: mix(t, a.rotate ?? 0, b.rotate ?? 0),
      };
    }
  }
  return (
    <AbsoluteFill style={{ transform: `translate(${c.x}px, ${c.y}px) scale(${c.scale}) rotate(${c.r}deg)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Reveal: React.FC<{ kind?: "circle" | "square"; frames?: number; children: React.ReactNode }> = ({
  kind = "circle",
  frames = 14,
  children,
}) => {
  const r = progress(useCurrentFrame(), 0, frames);
  const clip =
    kind === "circle"
      ? `circle(${r * 120}% at 50% 50%)`
      : `inset(${(1 - r) * 45}% round ${(1 - r) * 60}px)`;
  return <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>;
};

/** Deterministic particle burst (depth element). */
export const Burst: React.FC<{ at: number; cx: number; cy: number; radius?: number; count?: number }> = ({
  at,
  cx,
  cy,
  radius = 360,
  count = 32,
}) => {
  const s = useMGStyle();
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = progress(frame, at, 40);
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const ang = (i / count) * Math.PI * 2 + r1;
        const d = radius * (0.55 + r1 * 0.6) * t;
        const size = 5 + r1 * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + Math.cos(ang) * d,
              top: cy + Math.sin(ang) * d,
              width: size,
              height: size,
              borderRadius: size,
              background: i % 4 === 0 ? s.ink : s.accent,
              opacity: interpolate(t, [0, 0.2, 1], [0, 1, 0.5]),
            }}
          />
        );
      })}
    </>
  );
};
