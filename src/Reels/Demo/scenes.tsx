import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Badge,
  Confetti,
  easeOut,
  GlassCard,
  LowerThird,
  MicroLabel,
  Pill,
  pop,
  progress,
  SceneRegistry,
  SliderUI,
  StepTracker,
  useStyle,
  WhiteCard,
} from "../../ReelKit";

/* captions_ui scenes — rendered inside the lower third over the speaker */

const HookTracker: React.FC = () => (
  <LowerThird top={1150}>
    <GlassCard at={4}>
      <StepTracker active={0} tone="alert" />
    </GlassCard>
  </LowerThird>
);

const Slider: React.FC = () => (
  <LowerThird top={1160}>
    <GlassCard at={2} style={{ padding: "30px 40px 40px" }}>
      <SliderUI left="Cheap" right="Premium" dragAt={14} dragFrames={42} />
    </GlassCard>
  </LowerThird>
);

const Chapter1: React.FC = () => (
  <LowerThird top={1150}>
    <GlassCard at={0}>
      <StepTracker active={1} fillAt={6} />
    </GlassCard>
  </LowerThird>
);

/* full screen — the three-object rule: focal object, supporting, depth */

const Palette: React.FC = () => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const swatches = [
    { c: "#1E2A3A", n: "MIDNIGHT", h: "#1E2A3A" },
    { c: "#E9E4DA", n: "SAND", h: "#E9E4DA" },
    { c: s.accent, n: "ACCENT", h: s.accent.toUpperCase() },
  ];
  const drift = interpolate(frame, [0, 120], [0, -14]);
  return (
    <AbsoluteFill>
      {/* 1. Focal object: centre zone */}
      <div style={{ position: "absolute", left: 140, right: 140, top: 760 }}>
        <WhiteCard at={6} style={{ padding: "34px 36px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 26 }}>
            <MicroLabel>Brand palette</MicroLabel>
            <MicroLabel color={s.accent}>3 / 3</MicroLabel>
          </div>
          <div style={{ display: "flex", gap: 22 }}>
            {swatches.map((sw, i) => {
              const p = pop(frame, 30, 16 + i * 6);
              return (
                <div key={sw.n} style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{
                      height: 190,
                      borderRadius: 26,
                      background: sw.c,
                      boxShadow: "inset 0 -6px 14px rgba(0,0,0,0.12), 0 10px 24px rgba(0,0,0,0.12)",
                      transform: `scale(${p})`,
                    }}
                  />
                  <MicroLabel color={s.ink} style={{ marginTop: 18, opacity: p }}>
                    {sw.n}
                  </MicroLabel>
                  <div style={{ fontFamily: s.sansFont, fontSize: 18, color: s.inkMuted, opacity: p }}>{sw.h}</div>
                </div>
              );
            })}
          </div>
        </WhiteCard>
      </div>
      {/* 2. Supporting elements: on the edges, smaller */}
      <div style={{ position: "absolute", left: 90, top: 640, transform: `translateY(${drift}px)` }}>
        <Pill at={30}>
          <span style={{ fontFamily: s.sansFont, fontSize: 24, color: s.ink }}>No neon</span>
        </Pill>
      </div>
      <div style={{ position: "absolute", right: 90, top: 1270, transform: `translateY(${-drift}px)` }}>
        <Pill at={36}>
          <span style={{ fontFamily: s.sansFont, fontSize: 24, color: s.ink }}>
            Muted <span style={{ color: s.accent }}>●</span> accent
          </span>
        </Pill>
      </div>
      {/* 3. Depth elements: outside the focal zone, faint and blurred */}
      <div style={{ position: "absolute", right: 120, top: 520, filter: "blur(2px)", opacity: 0.6 }}>
        <Pill at={42}>
          <span style={{ fontFamily: s.sansFont, fontSize: 18, color: s.inkMuted }}>#FF0000 ✕</span>
        </Pill>
      </div>
      <div style={{ position: "absolute", left: 150, top: 1420, filter: "blur(3px)", opacity: 0.5 }}>
        <Pill at={48}>
          <span style={{ fontFamily: s.sansFont, fontSize: 18, color: s.inkMuted }}>#000000 ✕</span>
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

/* half screen — top-half animation */

const Shrink: React.FC = () => {
  const s = useStyle();
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const enter = pop(frame, fps, 2);
  // Starts too big, holds, then snaps to 75%.
  const snap = progress(frame, 34, 10, easeOut);
  const scale = enter * interpolate(snap, [0, 1], [1.45, 1]);
  const cx = width / 2;
  const cy = 480;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: cx - 160,
          top: cy - 160,
          width: 320,
          height: 320,
          transform: `scale(${scale})`,
        }}
      >
        <WhiteCard at={0} radius={64} style={{ width: 320, height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 40,
              background: `linear-gradient(180deg, #5A93FF, ${s.accent})`,
              boxShadow: `0 16px 30px ${s.accentGlow}, inset 0 -6px 12px rgba(0,0,0,0.15)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 0, height: 0, borderTop: "34px solid transparent", borderBottom: "34px solid transparent", borderLeft: "56px solid #fff", marginLeft: 12 }} />
          </div>
          <div style={{ width: 170, height: 12, borderRadius: 6, background: "#E8E6E2" }} />
        </WhiteCard>
      </div>
      {/* Dashed outline marks the old size once it snaps */}
      <div
        style={{
          position: "absolute",
          left: cx - 232,
          top: cy - 232,
          width: 464,
          height: 464,
          borderRadius: 80,
          border: `2px dashed ${s.accent}`,
          opacity: snap * 0.6,
        }}
      />
      <Badge at={40} style={{ left: cx + 160, top: cy - 270 }}>
        −25%
      </Badge>
      <Confetti at={36} cx={cx} cy={cy} radius={420} />
    </AbsoluteFill>
  );
};

export const demoScenes: SceneRegistry = {
  hookTracker: HookTracker,
  slider: Slider,
  chapter1: Chapter1,
  palette: Palette,
  shrink: Shrink,
};
