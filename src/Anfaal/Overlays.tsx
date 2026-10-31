import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "./brand";
import { MicroLabel, Pill, enter, inOut, mix, prog } from "./kit";
import { captionTopFull } from "./Speaker";

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
  const strike = 0;
  const end = 136; // gone before "toh tum kabhi bhi" (50.2 s)
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
      <div style={{ position: "absolute", top: captionTopFull(45.6 + f / 30), left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        {row("Bara move?", "#3B7BEA", 0, -2)}
        {row("Bari lot?", "#C9702E", 58, 2)}
      </div>
    </AbsoluteFill>
  );
};

/**
 * "Fed ka naya chairman aaya" (8.4–10.0 s): glass card above the head.
 * Drop the official portrait at public/anfaal/fed_chair.jpg and set FED_PHOTO = true.
 */
export const FED_PHOTO = false;
export const FedChairCard: React.FC = () => {
  const f = useCurrentFrame();
  const dur = 48;
  const out = prog(f, dur - 8, 8);
  const ring = prog(f, 6, 22);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: captionTopFull(8.4 + f / 30) - 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: 1 - out,
          filter: `blur(${out * 8}px)`,
        }}
      >
        <div
          style={{
            ...enter(f, 0, 14, 30),
            display: "flex",
            alignItems: "center",
            gap: 26,
            padding: "22px 40px 22px 22px",
            borderRadius: 999,
            background: "linear-gradient(180deg, rgba(22,40,31,0.9), rgba(10,20,15,0.9))",
            border: "1px solid rgba(220,255,235,0.14)",
            boxShadow: "0 30px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06)",
          }}
        >
          <div style={{ position: "relative", width: 132, height: 132 }}>
            <svg width={132} height={132} style={{ position: "absolute", inset: 0 }}>
              <circle cx={66} cy={66} r={62} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray={390} strokeDashoffset={390 * (1 - ring)} transform="rotate(-90 66 66)" />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 10,
                borderRadius: "50%",
                overflow: "hidden",
                background: "linear-gradient(160deg, #2A3A31, #0F1A14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {FED_PHOTO ? (
                <Img src={staticFile("anfaal/fed_chair.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 56, color: C.gold }}>KW</span>
              )}
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={enter(f, 6, 12, 14)}>
              <MicroLabel color={C.green} style={{ fontSize: 20 }}>
                new fed chair
              </MicroLabel>
            </div>
            <div style={{ ...enter(f, 9, 12, 14), fontFamily: F.sans, fontWeight: 800, fontSize: 52, color: C.white, letterSpacing: -1, marginTop: 4 }}>
              Kevin Warsh
            </div>
            <div style={{ ...enter(f, 13, 12, 14), fontFamily: F.sans, fontWeight: 500, fontSize: 26, color: C.muted, marginTop: 2 }}>
              17th Chair · since May 2026
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
