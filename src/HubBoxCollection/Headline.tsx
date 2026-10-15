import React from "react";
import { gradientReveal } from "./Glass";
import { HEADING_FONT, PINK_GRADIENT, WHITE, lerp } from "./theme";

/** Satoshi Bold hero heading: gradient wipe in, blur + drift out. */
export const Headline: React.FC<{
  lines: string[];
  accentLast?: boolean;
  y: number;
  enter: number;
  exit: number;
  size?: number;
}> = ({ lines, accentLast, y, enter, exit, size = 112 }) => {
  if (enter <= 0.001 || exit >= 0.999) return null;
  const r = gradientReveal(enter, 90, 26);
  const blur = (1 - enter) * 10 + exit * 16;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: "100%",
        top: y,
        transform: `translateY(calc(-50% + ${(1 - enter) * 22 - exit * 60}px))`,
        textAlign: "center",
        fontFamily: HEADING_FONT,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -size * 0.025,
        color: WHITE,
        opacity: 1 - exit,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        maskImage: enter < 0.999 ? r.mask : undefined,
        WebkitMaskImage: enter < 0.999 ? r.mask : undefined,
      }}
    >
      {lines.map((l, i) => {
        const accent = accentLast && i === lines.length - 1;
        return (
          <div
            key={l}
            style={
              accent
                ? {
                    background: PINK_GRADIENT,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    // keep the second line a beat behind the first
                    transform: `translateY(${lerp(14, 0, enter)}px)`,
                  }
                : undefined
            }
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};
