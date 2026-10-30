import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useStyle } from "./style";

/**
 * The full-screen "explainer world": warm off-white, a thin grey grid and a
 * soft casted window shadow drifting slowly across it.
 * Build order from the guide: 1) gradient  2) grid  3) casted shadow.
 */
export const Paper: React.FC<{ children?: React.ReactNode; grid?: boolean; shadow?: boolean }> = ({
  children,
  grid = true,
  shadow,
}) => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const showShadow = shadow ?? s.castShadow;
  const drift = frame * 0.15;

  return (
    <AbsoluteFill style={{ background: s.paper, overflow: "hidden" }}>
      {/* 1. Gradient: lighter centre, slightly greyer edges */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 80% at 50% 40%, ${s.paper} 0%, ${s.paper} 45%, ${s.paperShade} 100%)`,
        }}
      />
      {/* 2. Thin grid */}
      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${s.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${s.gridColor} 1px, transparent 1px)`,
            backgroundSize: `${s.gridSize}px ${s.gridSize}px`,
            backgroundPosition: "center center",
          }}
        />
      ) : null}
      {/* 3. Casted window shadow: blurred diagonal panes */}
      {showShadow ? (
        <AbsoluteFill style={{ filter: "blur(38px)", opacity: 0.5, mixBlendMode: "multiply" }}>
          <div
            style={{
              position: "absolute",
              inset: "-40%",
              transform: `rotate(-32deg) translateX(${drift}px)`,
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(90,80,70,0.20) 0px, rgba(90,80,70,0.20) 70px, transparent 70px, transparent 420px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: "-40%",
              transform: `rotate(58deg) translateX(${-drift * 0.6}px)`,
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(90,80,70,0.12) 0px, rgba(90,80,70,0.12) 40px, transparent 40px, transparent 640px)",
            }}
          />
        </AbsoluteFill>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};
