/**
 * "Obsessively designed — down to the detail that converts"
 * Rebuild of 01.mp4 with real HubBox assets: the map (from the HubBox widget recording) and real-style
 * location rows. Headings in Satoshi Bold, labels in Commit Mono. Timing follows the original clip:
 *   0.10 headline focus-in · 0.25 card in · 0.55 map · 0.75/0.85 rows · 0.95 button
 *   2.00 spacing guides · 3.20 subline · 3.60 magnifier on the selected radio · 4.30 cursor
 *   4.75 click · 4.90 "Pickup confirmed" · 5.15 check badge · hold to 7.0
 */
import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

loadFont({ family: "Satoshi", url: staticFile("fonts/Satoshi-Bold.woff2"), weight: "700" });
loadFont({ family: "Satoshi", url: staticFile("fonts/Satoshi-Medium.woff2"), weight: "500" });
loadFont({ family: "Commit Mono", url: staticFile("fonts/CommitMono-500.woff2"), weight: "500" });

const SANS = "Satoshi, sans-serif";
const MONO = "'Commit Mono', monospace";
const PINK = "#EF296A";
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IO = Easing.bezier(0.42, 0, 0.18, 1);

// layout (px, 1080 x 1920)
const CARD = { x: 200, y: 600, w: 680, r: 30 };
const PAD = 36;
const IN_X = CARD.x + PAD;
const IN_W = CARD.w - PAD * 2;
const HEAD_H = 80;
const MAP = { y: CARD.y + HEAD_H + 32, h: 274 };
const ROW_H = 107;
const ROW1_Y = MAP.y + MAP.h + 26;
const ROW2_Y = ROW1_Y + ROW_H + 16;
const BTN_Y = ROW2_Y + ROW_H + 36;
const BTN_H = 90;
const CARD_H = BTN_Y + BTN_H + PAD - CARD.y;
const RADIO = { x: IN_X + IN_W - 46, y: ROW1_Y + ROW_H / 2 };

const p = (f: number, a: number, b: number, e = OUT) =>
  interpolate(f, [a * 60, b * 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

const rise = (q: number, dist = 26, blur = 12): React.CSSProperties => ({
  opacity: q,
  transform: `translateY(${(1 - q) * dist}px)`,
  filter: q < 0.999 ? `blur(${(1 - q) * blur}px)` : undefined,
});

const glass: React.CSSProperties = {
  background: "linear-gradient(160deg, rgba(255,255,255,0.075), rgba(255,255,255,0.03))",
  border: "1.5px solid rgba(255,255,255,0.12)",
};

const LockerGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M12 3v18M3 9.5h9M12 9.5h9M3 15.5h9" />
    <circle cx="9" cy="6.3" r="0.6" fill="#fff" />
    <circle cx="15" cy="6.3" r="0.6" fill="#fff" />
  </svg>
);
const ShopGlyph = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9l1.5-5h13L20 9" />
    <path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
    <path d="M5.5 11.5V20h13v-8.5M10 20v-5h4v5" />
  </svg>
);
const PinGlyph = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const Radio: React.FC<{ on: boolean; scale?: number }> = ({ on, scale = 1 }) => (
  <div
    style={{
      width: 30 * scale,
      height: 30 * scale,
      borderRadius: "50%",
      border: `${2.5 * scale}px solid ${on ? PINK : "rgba(255,255,255,0.45)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: on ? `0 0 ${12 * scale}px rgba(239,41,106,0.55)` : undefined,
    }}
  >
    {on ? <div style={{ width: 14 * scale, height: 14 * scale, borderRadius: "50%", background: PINK }} /> : null}
  </div>
);

const Row: React.FC<{ y: number; title: string; meta: string; sel: boolean; icon: React.ReactNode; q: number }> = ({ y, title, meta, sel, icon, q }) => (
  <div
    style={{
      position: "absolute",
      left: IN_X,
      top: y,
      width: IN_W,
      height: ROW_H,
      borderRadius: 18,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 22,
      ...(sel
        ? { background: "linear-gradient(90deg, rgba(239,41,106,0.22), rgba(239,41,106,0.08))", border: `2px solid ${PINK}`, boxShadow: "0 0 24px rgba(239,41,106,0.18)" }
        : glass),
      ...rise(q),
    }}
  >
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: sel ? "linear-gradient(160deg, #FF5E8E, #E5245F)" : "rgba(255,255,255,0.14)",
        border: sel ? undefined : "1.5px solid rgba(255,255,255,0.16)",
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#fff", letterSpacing: -0.4, whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 17, color: "rgba(255,255,255,0.55)", letterSpacing: 2.2, marginTop: 6, whiteSpace: "nowrap" }}>{meta}</div>
    </div>
    <Radio on={sel} />
  </div>
);

// dashed spacing guides with size labels (design-spec overlay)
const Guide: React.FC<{ x: number; y: number; w: number; h: number; q: number }> = ({ x, y, w, h, q }) => {
  const per = 2 * (w + h);
  return (
    <svg style={{ position: "absolute", left: x - 6, top: y - 6, overflow: "visible" }} width={w + 12} height={h + 12}>
      <rect x={6} y={6} width={w} height={h} fill="none" stroke={PINK} strokeWidth={2} strokeDasharray="7 6"
        style={{ clipPath: `inset(0 ${(1 - q) * 100}% 0 0)` }} opacity={0.9} />
      {[[0, 0], [w, 0], [0, h], [w, h], [0, h / 2], [w, h / 2]].map(([cx, cy], i) => (
        <rect key={i} x={6 + cx - 4} y={6 + cy - 4} width={8} height={8} fill={PINK} opacity={Math.min(1, q * 3)} />
      ))}
      <title>{per}</title>
    </svg>
  );
};
const Tag: React.FC<{ x: number; y: number; text: string; q: number }> = ({ x, y, text, q }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * q})`,
      opacity: q,
      background: PINK,
      color: "#fff",
      fontFamily: MONO,
      fontSize: 17,
      fontWeight: 500,
      padding: "2px 8px",
      borderRadius: 6,
    }}
  >
    {text}
  </div>
);
const Gap: React.FC<{ x: number; y0: number; y1: number; q: number; text: string }> = ({ x, y0, y1, q, text }) => (
  <>
    <div style={{ position: "absolute", left: x, top: y0, width: 2, height: (y1 - y0) * q, background: PINK }} />
    <div style={{ position: "absolute", left: x - 8, top: y0, width: 18, height: 2, background: PINK, opacity: q }} />
    <div style={{ position: "absolute", left: x - 8, top: y1 - 2, width: 18, height: 2, background: PINK, opacity: q }} />
    <Tag x={x + 34} y={(y0 + y1) / 2} text={text} q={q} />
  </>
);

const Cursor = () => (
  <svg width="44" height="48" viewBox="0 0 24 26">
    <path d="M4 2.5v17l4.6-4.1 3 6.6 3-1.3-2.9-6.5H18z" fill="#fff" stroke="#15122A" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const ObsessivelyDesigned: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  // entrance
  const head = p(f, 0.08, 0.75);
  const sub = p(f, 3.15, 3.75);
  const card = p(f, 0.22, 0.95);
  const mapQ = p(f, 0.5, 1.15);
  const r1 = p(f, 0.7, 1.3);
  const r2 = p(f, 0.82, 1.42);
  const btn = p(f, 0.95, 1.55);
  const header = p(f, 0.4, 1.0);

  // guides: on 2.0 -> off 4.25
  const gOut = 1 - p(f, 4.2, 4.6, IO);
  const g1 = p(f, 2.0, 2.55, IO) * gOut;
  const g2 = p(f, 2.12, 2.67, IO) * gOut;
  const g3 = p(f, 2.24, 2.79, IO) * gOut;
  const tag1 = p(f, 2.55, 2.85) * gOut;
  const tag2 = p(f, 2.67, 2.97) * gOut;
  const tag3 = p(f, 2.79, 3.09) * gOut;
  const grid = (p(f, 2.0, 2.5) * gOut) * 0.5;

  // magnifier on the selected radio
  const magIn = p(f, 3.55, 3.95);
  const magOut = p(f, 4.15, 4.45, IO);
  const mag = magIn * (1 - magOut);
  const MAG_R = 118;
  const magCx = RADIO.x + 16 + 150 * (1 - magOut) * 0.0;

  // cursor: in from lower right 4.3, lands on the button 4.72, press 4.75-4.85
  const curIn = p(f, 4.25, 4.45);
  const curMove = p(f, 4.3, 4.72, IO);
  const curOut = p(f, 5.5, 5.8, IO);
  const cx = interpolate(curMove, [0, 1], [880, 560]);
  const cy = interpolate(curMove, [0, 1], [BTN_Y + 230, BTN_Y + BTN_H * 0.55]);
  const press = interpolate(f, [4.72 * 60, 4.78 * 60, 4.9 * 60], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ripple = p(f, 4.75, 5.3);
  const confirmed = p(f, 4.85, 5.15);
  const badge = spring({ frame: f - 5.1 * 60, fps, config: { damping: 13, stiffness: 160 } });

  const drift = 1 + t * 0.003;

  return (
    <AbsoluteFill style={{ background: "#120f24", overflow: "hidden" }}>
      <Img src={staticFile("obsessive/bg.png")} style={{ position: "absolute", width: 1080, height: 1920, transform: `scale(${drift})` }} />

      {/* headline */}
      <div style={{ position: "absolute", top: 384, width: 1080, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 74, letterSpacing: -1.6, color: "#fff", ...rise(head, 22, 14) }}>
        Obsessively designed
      </div>
      <div style={{ position: "absolute", top: 484, width: 1080, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 33, color: "rgba(255,255,255,0.72)", ...rise(sub, 14, 8) }}>
        down to the detail that converts
      </div>

      {/* card */}
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD_H,
          borderRadius: CARD.r,
          overflow: "hidden",
          background: "linear-gradient(165deg, rgba(150,130,200,0.30), rgba(70,50,110,0.22) 45%, rgba(60,30,80,0.26))",
          border: "1.5px solid rgba(255,255,255,0.16)",
          boxShadow: "0 40px 90px rgba(6,4,14,0.55), inset 0 1.5px 0 rgba(255,255,255,0.18)",
          backdropFilter: "blur(30px)",
          ...rise(card, 40, 16),
        }}
      >
        {/* faint layout grid while the guides are up */}
        <div style={{ position: "absolute", inset: 0, opacity: grid, background: "repeating-linear-gradient(90deg, rgba(239,41,106,0.22) 0 1px, transparent 1px 57px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: HEAD_H, height: 1.5, background: "rgba(255,255,255,0.12)", opacity: header }} />
        <div style={{ position: "absolute", left: PAD, right: PAD, top: 0, height: HEAD_H, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, letterSpacing: 3.5, color: "rgba(255,255,255,0.55)", opacity: header }}>
          <span>CHECKOUT</span>
          <span>PICKUP</span>
        </div>
      </div>

      {/* HubBox map (from the widget recording) */}
      <div
        style={{
          position: "absolute",
          left: IN_X,
          top: MAP.y,
          width: IN_W,
          height: MAP.h,
          borderRadius: 18,
          overflow: "hidden",
          border: "1.5px solid rgba(255,255,255,0.18)",
          boxShadow: "0 14px 30px rgba(6,4,14,0.35)",
          ...rise(mapQ, 22, 12),
        }}
      >
        <Img src={staticFile("obsessive/map.png")} style={{ width: IN_W, height: (IN_W / 623) * 280, display: "block", transform: `scale(${1.06 - 0.06 * mapQ})`, transformOrigin: "50% 50%" }} />
        <div style={{ position: "absolute", left: "50%", top: 12, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, padding: "8px 14px 8px 10px", whiteSpace: "nowrap", borderRadius: 12, background: "rgba(21,18,42,0.82)", backdropFilter: "blur(8px)" }}>
          <PinGlyph size={20} />
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "#fff" }}>London</span>
          <span style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: "rgba(255,255,255,0.6)", marginLeft: 8 }}>12 NEARBY</span>
        </div>
      </div>

      {/* location rows */}
      <Row y={ROW1_Y} title="InPost Locker" meta="0.2 MI · OPEN 24/7" sel icon={<LockerGlyph />} q={r1} />
      <Row y={ROW2_Y} title="Post Office Moorgate" meta="0.4 MI · 45 LONDON WALL" sel={false} icon={<ShopGlyph />} q={r2} />

      {/* button */}
      <div
        style={{
          position: "absolute",
          left: IN_X,
          top: BTN_Y,
          width: IN_W,
          height: BTN_H,
          borderRadius: 18,
          overflow: "hidden",
          background: "linear-gradient(90deg, #E5245F, #F0457A 55%, #FF6A97)",
          boxShadow: "0 16px 36px rgba(239,41,106,0.35), inset 0 1.5px 0 rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...rise(btn, 22, 10),
          transform: `translateY(${(1 - btn) * 22}px) scale(${1 - press * 0.04})`,
        }}
      >
        <div style={{ position: "absolute", left: 560 - IN_X, top: BTN_H * 0.55, width: 0, height: 0 }}>
          <div style={{ position: "absolute", left: -260, top: -260, width: 520, height: 520, borderRadius: "50%", background: "rgba(255,255,255,0.35)", transform: `scale(${ripple})`, opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0 }} />
        </div>
        <div style={{ position: "absolute", fontFamily: SANS, fontWeight: 700, fontSize: 34, color: "#fff", opacity: 1 - confirmed, transform: `translateY(${-confirmed * 14}px)` }}>Confirm pickup</div>
        <div style={{ position: "absolute", display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 700, fontSize: 34, color: "#fff", opacity: confirmed, transform: `translateY(${(1 - confirmed) * 14}px)` }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 12.5l5 5 10-11" strokeDasharray="30" strokeDashoffset={30 * (1 - confirmed)} />
          </svg>
          Pickup confirmed
        </div>
      </div>

      {/* spacing guides */}
      <Guide x={IN_X - 8} y={MAP.y - 8} w={IN_W + 16} h={MAP.h + 16} q={g1} />
      <Guide x={IN_X - 8} y={ROW1_Y - 8} w={IN_W + 16} h={ROW_H * 2 + 16 + 16} q={g2} />
      <Guide x={IN_X - 8} y={BTN_Y - 8} w={IN_W + 16} h={BTN_H + 16} q={g3} />
      <Gap x={IN_X + IN_W - 150} y0={MAP.y + MAP.h} y1={ROW1_Y} q={tag1} text="26" />
      <Gap x={IN_X + IN_W - 150} y0={ROW1_Y + ROW_H} y1={ROW2_Y} q={tag2} text="16" />
      <div style={{ position: "absolute", left: CARD.x, top: BTN_Y + BTN_H + 20, width: PAD * tag3, height: 2, background: PINK }} />
      <Tag x={CARD.x + 18} y={BTN_Y + BTN_H + 2} text="36" q={tag3} />

      {/* magnifier on the selected radio */}
      {mag > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: magCx - MAG_R,
            top: RADIO.y - MAG_R,
            width: MAG_R * 2,
            height: MAG_R * 2,
            borderRadius: "50%",
            overflow: "hidden",
            border: "6px solid #fff",
            boxSizing: "border-box",
            background: "radial-gradient(circle at 50% 50%, rgba(120,40,90,0.95), rgba(60,26,70,0.97))",
            boxShadow: `0 0 0 3px ${PINK}, 0 24px 60px rgba(6,4,14,0.6)`,
            transform: `scale(${0.35 + 0.65 * mag})`,
            opacity: Math.min(1, mag * 1.6),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", right: 34, top: 0, bottom: 0, width: 6, background: PINK, opacity: 0.85 }} />
          <Radio on scale={2.6} />
        </div>
      ) : null}

      {/* check badge on the card corner */}
      <div
        style={{
          position: "absolute",
          left: CARD.x + CARD.w - 34,
          top: CARD.y - 34,
          width: 68,
          height: 68,
          borderRadius: "50%",
          background: "linear-gradient(160deg, #FF5E8E, #E5245F)",
          boxShadow: "0 12px 28px rgba(239,41,106,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${Math.max(0, badge)})`,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 12.5l5 5 10-11" />
        </svg>
      </div>

      {/* cursor */}
      <div style={{ position: "absolute", left: cx, top: cy, opacity: curIn * (1 - curOut), transform: `scale(${1 - press * 0.12})`, transformOrigin: "4px 2px" }}>
        <Cursor />
      </div>
    </AbsoluteFill>
  );
};
