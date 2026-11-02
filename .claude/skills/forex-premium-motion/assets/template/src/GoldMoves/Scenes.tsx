import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CandleRain, Coin, FogWipe, GoldBar, Glass, K, TwoTier, TypeVariant, World, clamp, easeIn, easeInOut, easeOut, mix, p, spr } from "./design";

/* =====================================================================
   HOOK (0–6 s) "Agar aap gold mein trade karte hain — abhi aur moves baaki hain"
   Beats: 0.0 coins tumble in from the dark (physics) · 0.6 gold bar rises to centre,
   camera pushes in · 1.3 lead line · 2.1 keyword lands · 4.6 coins burst upward with
   the candles accelerating (energy for "moves") · 5.4 fog wipe to the speaker.
   ===================================================================== */
export const HookScene: React.FC<{ variant?: TypeVariant }> = ({ variant = "A" }) => {
  const f = useCurrentFrame();
  const push = mix(p(f, 0, 170, easeInOut), 1.0, 1.12);
  const surge = p(f, 138, 30, easeIn);
  const barUp = spr(f, 16, 70, 13);
  const coins = [
    { x: 250, y: 610, s: 190, at: 0, spin: 1 },
    { x: 830, y: 540, s: 150, at: 5, spin: -1 },
    { x: 760, y: 980, s: 120, at: 10, spin: 1 },
    { x: 300, y: 1010, s: 105, at: 14, spin: -1 },
  ];
  return (
    <World focusY={44}>
      <CandleRain speed={1 + surge * 4} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 45%" }}>
        {/* soft light behind the hero */}
        <div style={{ position: "absolute", left: 140, top: 520, width: 800, height: 600, borderRadius: "50%", background: "radial-gradient(50% 50% at 50% 50%, rgba(232,199,127,.28), rgba(232,199,127,0))", filter: "blur(20px)" }} />
        {coins.map((c, i) => {
          const s = spr(f, c.at, 60, 11, 1);
          const y = mix(s, -300, c.y) - surge * (900 + i * 200) + Math.sin((f + i * 20) / 18) * 10;
          const depthBlur = i >= 2 ? 3 : 0;
          return (
            <div key={i} style={{ position: "absolute", left: c.x - c.s / 2, top: y - c.s / 2 }}>
              <Coin size={c.s} rx={20 + Math.sin(f / 20 + i) * 18} ry={c.spin * (f * 3 + i * 40)} rz={c.spin * 8} blur={depthBlur + surge * 6} />
            </div>
          );
        })}
        {/* hero gold bar */}
        <div style={{ position: "absolute", left: 540 - 230, top: mix(barUp, 1100, 720) + Math.sin(f / 22) * 6, transform: `scale(${mix(Math.min(barUp, 1.05), 0.7, 1)})` }}>
          <GoldBar w={460} rx={-28 + Math.sin(f / 30) * 3} ry={24 + f * 0.25} />
          <div style={{ position: "absolute", left: 40, right: 40, top: 300, height: 60, borderRadius: "50%", background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.55), rgba(0,0,0,0))", filter: "blur(8px)" }} />
        </div>
      </AbsoluteFill>
      {/* type: centred, lower third (safe zone) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center" }}>
        <TwoTier lead="Agar aap _gold_ mein trade karte hain" keyword="aur moves baaki" at={36} out={170} variant={variant} tone="gold" />
      </div>
    </World>
  );
};

/* =====================================================================
   DROP (10–19 s) "4000 ke level se drop — continuation, lekin buying opportunities"
   A gold coin rolls down a 3D staircase of glass candles (bounce on each step),
   a 4000 tag floats off; at "buying opportunities" small coins drop into a stack.
   ===================================================================== */
export const DropScene: React.FC<{ variant?: TypeVariant }> = ({ variant = "A" }) => {
  const f = useCurrentFrame();
  const steps = 6;
  const stepAt = (i: number) => 18 + i * 22;
  let ci = 0;
  for (let i = 0; i < steps; i++) if (f >= stepAt(i)) ci = i;
  const local = f - stepAt(ci);
  const hop = Math.max(0, Math.sin(Math.min(1, local / 22) * Math.PI)) * 60;
  const cx = 230 + ci * 110 + Math.min(1, local / 22) * 110;
  const cy = 470 + ci * 80 - hop;
  return (
    <World focusY={50}>
      <CandleRain speed={0.6} tint={K.red} count={10} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(14deg) translateY(${mix(p(f, 0, 150, easeInOut), 30, -20)}px)`, transformStyle: "preserve-3d" }}>
          {Array.from({ length: steps }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 200 + i * 110,
                top: 560 + i * 80,
                width: 96,
                height: 300 - i * 28,
                borderRadius: 14,
                background: `linear-gradient(90deg, #C9434A, ${K.red} 45%, #FF9DA1 55%, #C9434A)`,
                boxShadow: "0 0 30px rgba(255,95,102,.35), inset 0 2px 0 rgba(255,255,255,.4)",
                opacity: p(f, i * 4, 14),
                transform: `translateY(${(1 - spr(f, i * 4, 110, 14)) * 120}px)`,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: cx - 80, top: cy - 80 }}>
        <Coin size={160} rx={10} ry={f * 6} />
      </div>
      <div style={{ position: "absolute", left: 150, top: 330, opacity: 1 - p(f, 40, 30), transform: `translateY(${-p(f, 40, 30) * 40}px)` }}>
        <Glass style={{ padding: "14px 28px", borderRadius: 24 }}>
          <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 44, color: K.gold }}>4000</span>
        </Glass>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center" }}>
        <TwoTier lead="_4000_ ke level se" keyword="drop continue" at={10} variant={variant} tone="red" />
      </div>
    </World>
  );
};

/* =====================================================================
   WEEK (28–48 s) "Kal US elections · aaj ISM PMI · Friday NFP"
   Three glass date cards fall in and stack with physics; an impact meter fills.
   ===================================================================== */
const DayCard: React.FC<{ day: string; title: string; note: string; at: number; y: number; tilt: number; hot?: boolean }> = ({ day, title, note, at, y, tilt, hot }) => {
  const f = useCurrentFrame();
  const s = spr(f, at, 90, 12, 1);
  return (
    <div style={{ position: "absolute", left: 140, top: mix(s, -500, y), width: 800, transform: `rotate(${mix(s, tilt * 3, tilt)}deg)`, opacity: p(f, at, 6) }}>
      <Glass style={{ padding: "30px 36px", display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ width: 150, height: 150, borderRadius: 34, background: "linear-gradient(180deg,#F6FBF8,#CFE3D7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(0,0,0,.35)" }}>
          <span style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 44, color: hot ? "#C9434A" : K.hueDeep }}>{day}</span>
        </div>
        <div>
          <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 62, color: K.white, letterSpacing: -1 }}>{title}</div>
          <div style={{ fontFamily: "Inter", fontWeight: 300, fontStyle: "italic", fontSize: 34, color: K.soft }}>{note}</div>
        </div>
      </Glass>
    </div>
  );
};
export const WeekScene: React.FC<{ variant?: TypeVariant }> = ({ variant = "A" }) => {
  const f = useCurrentFrame();
  const meter = p(f, 110, 40, easeInOut);
  return (
    <World focusY={42}>
      <CandleRain speed={0.5} count={9} />
      <DayCard day="KAL" title="US Elections" note="result early morning" at={6} y={420} tilt={-3} />
      <DayCard day="AAJ" title="ISM PMI" note="manufacturing" at={40} y={640} tilt={2} />
      <DayCard day="FRI" title="NFP data" note="bohot impactful" at={74} y={860} tilt={-1.5} hot />
      <div style={{ position: "absolute", left: 240, top: 1110, width: 600, opacity: p(f, 104, 10) }}>
        <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
          <div style={{ width: `${meter * 92}%`, height: "100%", borderRadius: 11, background: `linear-gradient(90deg, ${K.hue}, ${K.gold}, ${K.red})`, boxShadow: `0 0 20px ${K.glow}` }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center" }}>
        <TwoTier lead="is _week_ ki" keyword="badi news" at={12} variant={variant} />
      </div>
    </World>
  );
};

/* =====================================================================
   SPEAKER view: centred two-tier caption above the head (on the dark foam).
   ===================================================================== */
export const SpeakerCaption: React.FC<{ variant?: TypeVariant; lead: string; keyword: string; tone?: "hue" | "gold" | "red" | "white"; still?: boolean; from?: number }> = ({
  variant = "A",
  lead,
  keyword,
  tone = "hue",
  still,
  from = 20,
}) => (
  <AbsoluteFill style={{ backgroundColor: K.void }}>
    {still ? (
      <Img src={staticFile("gm/frame20.png")} style={{ width: 1080, height: 1920 }} />
    ) : (
      <OffthreadVideo src={staticFile("gm/cut.mp4")} trimBefore={Math.round(from * 30)} muted style={{ width: 1080, height: 1920 }} />
    )}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,10,6,.55) 0%, rgba(3,10,6,.2) 26%, rgba(3,10,6,0) 36%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
      <TwoTier lead={lead} keyword={keyword} at={still ? -60 : 2} variant={variant} tone={tone} scale={0.82} />
    </div>
  </AbsoluteFill>
);

/* =====================================================================
   CTA (62–74 s) "100–150 pips targets · community join"
   ===================================================================== */
export const CtaScene: React.FC<{ variant?: TypeVariant }> = ({ variant = "A" }) => {
  const f = useCurrentFrame();
  return (
    <World focusY={40}>
      <div style={{ position: "absolute", left: 540 - 260, top: 420, width: 520, height: 520 }}>
        <svg width={520} height={520}>
          {[240, 180, 120].map((r, i) => (
            <circle key={r} cx={260} cy={260} r={r} fill="none" stroke={i === 2 ? K.hue : "rgba(156,255,201,.35)"} strokeWidth={i === 2 ? 14 : 6} strokeDasharray={2 * Math.PI * r} strokeDashoffset={2 * Math.PI * r * (1 - p(f, 4 + i * 6, 34, easeInOut))} transform="rotate(-90 260 260)" style={{ filter: i === 2 ? `drop-shadow(0 0 16px ${K.glow})` : undefined }} />
          ))}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 222, textAlign: "center", fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 60, color: K.white, opacity: p(f, 40, 12), textShadow: `0 0 18px ${K.glow}` }}>
          100–150
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center" }}>
        <TwoTier lead="har trade mein" keyword="100–150 pips" at={20} variant={variant} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", opacity: p(f, 70, 12), transform: `translateY(${(1 - spr(f, 70, 120, 14)) * 40}px)` }}>
        <div style={{ padding: "26px 60px", borderRadius: 999, background: `linear-gradient(180deg, #6BF0AC, ${K.hueDeep})`, color: "#03140B", fontFamily: "Nunito", fontWeight: 900, fontSize: 46, boxShadow: `0 20px 50px ${K.glow}, inset 0 2px 0 rgba(255,255,255,.5)` }}>
          Join Community ↑
        </div>
      </div>
    </World>
  );
};

/* =====================================================================
   Typography board: the three candidate type systems on the real footage.
   ===================================================================== */
export const TypeBoard: React.FC = () => {
  const opts: { v: TypeVariant; name: string; note: string }[] = [
    { v: "A", name: "A · Rounded premium", note: "Inter Light Italic + Nunito Black (closest to your reference)" },
    { v: "B", name: "B · Editorial", note: "Instrument Serif Italic + Plus Jakarta ExtraBold" },
    { v: "C", name: "C · Bold condensed", note: "Inter caps label + Anton (current look, refined)" },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b", flexDirection: "row" }}>
      {opts.map((o) => (
        <div key={o.v} style={{ position: "relative", width: 1080, height: 1920, overflow: "hidden" }}>
          <SpeakerCaption still variant={o.v} lead="Agar aap _gold_ mein trade karte hain" keyword="aur moves baaki" tone="hue" />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center" }}>
            <div style={{ display: "inline-block", padding: "18px 34px", borderRadius: 24, background: "rgba(0,0,0,.75)" }}>
              <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 44, color: "#fff" }}>{o.name}</div>
              <div style={{ fontFamily: "Inter", fontWeight: 400, fontSize: 28, color: "#cfd8d3", marginTop: 6 }}>{o.note}</div>
            </div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* =====================================================================
   Motion test: hook → fog wipe → speaker with centred caption (8 s).
   ===================================================================== */
export const HookTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: K.void }}>
      <Sequence from={162} durationInFrames={78}>
        <SpeakerCaption lead="toh _follow_ karna" keyword="mat bhooliyega" from={6.2} />
      </Sequence>
      <Sequence from={0} durationInFrames={172}>
        <AbsoluteFill style={{ opacity: 1 - interpolate(f, [160, 172], [0, 1], { ...clamp, easing: easeOut }) }}>
          <HookScene />
        </AbsoluteFill>
      </Sequence>
      <FogWipe at={154} dur={22} />
    </AbsoluteFill>
  );
};


