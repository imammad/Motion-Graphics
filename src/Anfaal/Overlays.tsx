import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, F } from "./brand";
import { Pill, inOut, mix, prog } from "./kit";

/** Hook (0–3.55 s): "↓ Crash  vs  ↑ All-time high" chips in the lower third. */
export const HookPills: React.FC = () => {
  const f = useCurrentFrame();
  const end = 104;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 1450, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
        <div style={inOut(f, 26, end)}>
          <Pill color={C.red} icon="↓" size={40}>
            Crash
          </Pill>
        </div>
        <div
          style={{
            ...inOut(f, 52, end),
            width: 70,
            height: 70,
            borderRadius: 35,
            background: "rgba(10,16,13,.85)",
            border: "1px solid rgba(255,255,255,.15)",
            color: C.white,
            fontFamily: F.sans,
            fontWeight: 700,
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          vs
        </div>
        <div style={inOut(f, 58, end)}>
          <Pill color={C.greenDeep} icon="↑" size={40}>
            All-time high
          </Pill>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Lesson (45.6–51.7 s): greedy thoughts stack up, then get struck through. */
export const LessonPills: React.FC = () => {
  const f = useCurrentFrame(); // local 0 = 45.6 s
  const strike = prog(f, 158, 10); // 50.85 s "profit nahi"
  const end = 162;
  const row = (text: string, color: string, at: number, tilt: number) => (
    <div style={{ ...inOut(f, at, end), transform: `${inOut(f, at, end).transform} rotate(${tilt}deg)` }}>
      <div style={{ position: "relative" }}>
        <Pill color={color} size={38} style={{ opacity: mix(strike, 1, 0.55) }}>
          {text}
        </Pill>
        <div
          style={{
            position: "absolute",
            left: -10,
            top: "50%",
            height: 6,
            borderRadius: 3,
            width: `calc(${strike * 100}% + 20px)`,
            background: C.red,
            boxShadow: `0 0 14px ${C.redGlow}`,
          }}
        />
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 1460, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        {row("Bara move?", "#3B7BEA", 0, -2)}
        {row("Bari lot?", "#C9702E", 58, 2)}
      </div>
    </AbsoluteFill>
  );
};
