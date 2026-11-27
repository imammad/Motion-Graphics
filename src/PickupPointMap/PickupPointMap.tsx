/**
 * Rebuild of 02.mp4 with real HubBox assets: the photo carousel becomes the HubBox map (from the widget
 * recording), the location is the dpd Local Pickup at Snappy Snaps, 21 Garrick Street (from the checkout
 * screenshot). Headings in Satoshi Bold, labels in Commit Mono. Timing follows the original clip:
 *   0.05 phone in · 0.85 side cards + "Live map" chip · 1.5 map settles · 2.0 "AI-written" chip + box
 *   4.3-6.6 description types · 6.6 ring + zoom on the selected pin · 7.6 cursor · 8.1 click · 8.35 confirmed
 */
import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

loadFont({ family: "Satoshi", url: staticFile("fonts/Satoshi-Bold.woff2"), weight: "700" });
loadFont({ family: "Satoshi", url: staticFile("fonts/Satoshi-Medium.woff2"), weight: "500" });
loadFont({ family: "Commit Mono", url: staticFile("fonts/CommitMono-500.woff2"), weight: "500" });

const SANS = "Satoshi, sans-serif";
const MONO = "'Commit Mono', monospace";
const PINK = "#EF296A";
const INK = "#16132B";
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IO = Easing.bezier(0.42, 0, 0.18, 1);

// phone and screen layout (px, 1080 x 1920, measured from the original)
const PH = { x: 263, y: 387, w: 554, h: 1134, r: 92 };
const SX = 305; // content left
const SW = 470; // content width
const MAP = { y: 573, h: 320 };
const MAP_SRC = { w: 540, h: 367 };
const PIN = { x: 378, y: 290 }; // selected pin (dpd 1) in map-source px
const FOCUS = { x: 412, y: 296 }; // between the selected pin and the KFC next to it (map-source px)
const pinX0 = SX + (PIN.x / MAP_SRC.w) * SW;
const pinY0 = MAP.y + (PIN.y / MAP_SRC.h) * MAP.h;
const focX = SX + (FOCUS.x / MAP_SRC.w) * SW;
const focY = MAP.y + (FOCUS.y / MAP_SRC.h) * MAP.h;

const DESC = "On Garrick Street, 2 min from Covent Garden station. Look for the Snappy Snaps sign.";

const p = (f: number, a: number, b: number, e = OUT) =>
  interpolate(f, [a * 60, b * 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const rise = (q: number, dist = 24, blur = 12): React.CSSProperties => ({
  opacity: q,
  transform: `translateY(${(1 - q) * dist}px)`,
  filter: q < 0.999 ? `blur(${(1 - q) * blur}px)` : undefined,
});

const Chip: React.FC<{ x: number; y: number; icon: React.ReactNode; text: string; q: number; from: number }> = ({ x, y, icon, text, q, from }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      height: 96,
      padding: "0 30px 0 18px",
      display: "flex",
      alignItems: "center",
      gap: 18,
      borderRadius: 22,
      background: "linear-gradient(160deg, rgba(110,90,170,0.78), rgba(50,36,90,0.82))",
      border: "1.5px solid rgba(255,255,255,0.18)",
      boxShadow: "0 24px 50px rgba(6,4,14,0.45), inset 0 1.5px 0 rgba(255,255,255,0.2)",
      backdropFilter: "blur(18px)",
      opacity: q,
      transform: `translateX(${(1 - q) * from}px) scale(${0.9 + 0.1 * q})`,
      filter: q < 0.999 ? `blur(${(1 - q) * 10}px)` : undefined,
    }}
  >
    <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(160deg, #FF5E8E, #E5245F)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
    <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 33, color: "#fff", whiteSpace: "nowrap" }}>{text}</span>
  </div>
);

const MapIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 4L3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5z" />
    <path d="M9 4v13.5M15 6.5V20" />
  </svg>
);
const Sparkle = ({ c = "#fff", s = 32 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={c}>
    <path d="M10 3l1.7 4.8L16.5 9.5l-4.8 1.7L10 16l-1.7-4.8L3.5 9.5l4.8-1.7zM18 13l.9 2.3 2.3.9-2.3.9L18 19.4l-.9-2.3-2.3-.9 2.3-.9z" />
  </svg>
);
const Walk = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13" cy="4" r="1.8" fill={PINK} stroke="none" />
    <path d="M10 21l2-6 2.5 2.5V21M8.5 11l2.5-3.5 3 2 2.5 2.5M11 7.5L9.5 14" />
  </svg>
);
const Cursor = () => (
  <svg width="48" height="52" viewBox="0 0 24 26">
    <path d="M4 2.5v17l4.6-4.1 3 6.6 3-1.3-2.9-6.5H18z" fill="#fff" stroke="#15122A" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const PickupPointMap: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 60;

  const phone = p(f, 0.05, 0.9);
  const side = p(f, 0.75, 1.35);
  const sideOut = p(f, 1.35, 1.9, IO);
  const mapQ = p(f, 1.25, 2.0);
  const chip1 = p(f, 0.95, 1.55);
  const chip2 = p(f, 2.0, 2.6);
  const box = p(f, 2.1, 2.7);
  const bars = 1 - p(f, 4.15, 4.4, IO);
  const typed = Math.round(DESC.length * interpolate(f, [4.3 * 60, 6.6 * 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const caret = t > 4.2 && Math.floor(t * 2.2) % 2 === 0 ? 1 : 0;

  // focus on the selected pin: map pushes in, ring + zoom bubble
  const push = p(f, 6.5, 7.3, IO);
  const ring = p(f, 6.7, 7.2);
  const bubble = p(f, 6.85, 7.4);
  const line = p(f, 7.0, 7.4, IO);
  const mapScale = 1 + 0.55 * push;
  const pinX = focX + (pinX0 - focX) * mapScale; // the pin as it sits after the push-in
  const pinY = focY + (pinY0 - focY) * mapScale;

  // cursor + click
  const curIn = p(f, 7.55, 7.75);
  const curMove = p(f, 7.6, 8.05, IO);
  const cx = interpolate(curMove, [0, 1], [700, 560]);
  const cy = interpolate(curMove, [0, 1], [1560, 1365]);
  const press = interpolate(f, [8.05 * 60, 8.12 * 60, 8.25 * 60], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ripple = p(f, 8.1, 8.6);
  const confirmed = p(f, 8.2, 8.5);
  const curOut = p(f, 9.0, 9.3, IO);

  const BUB = { cx: 846, cy: 450, r: 92 };

  return (
    <AbsoluteFill style={{ background: "#120f24", overflow: "hidden" }}>
      <Img src={staticFile("pickup/bg.png")} style={{ position: "absolute", width: 1080, height: 1920, transform: `scale(${1 + t * 0.003})` }} />

      {/* side map cards that fly into the phone (as the photo cards did) */}
      {[-1, 1].map((s) => (
        <div
          key={s}
          style={{
            position: "absolute",
            left: s < 0 ? 40 : 800,
            top: 560,
            width: 260,
            height: 177,
            borderRadius: 16,
            overflow: "hidden",
            border: "4px solid #fff",
            boxShadow: "0 24px 50px rgba(6,4,14,0.5)",
            opacity: side * (1 - sideOut),
            transform: `translate(${(1 - side) * s * 60 + sideOut * -s * 220}px, ${sideOut * 70}px) rotate(${s * -8 * (1 - sideOut)}deg) scale(${1 - 0.25 * sideOut})`,
            filter: `blur(${(1 - side) * 10 + sideOut * 6}px)`,
          }}
        >
          <Img src={staticFile("pickup/map.png")} style={{ width: 260 * 1.6, height: 177 * 1.6, transform: `translate(${s < 0 ? 0 : -150}px, -60px)` }} />
        </div>
      ))}

      {/* phone */}
      <div style={{ position: "absolute", left: PH.x, top: PH.y, width: PH.w, height: PH.h, ...rise(phone, 70, 16) }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: PH.r,
            background: "linear-gradient(160deg, #5a5478, #23203a 40%, #3b3658)",
            boxShadow: "0 50px 110px rgba(6,4,14,0.6), inset 0 2px 0 rgba(255,255,255,0.35)",
          }}
        />
        <div style={{ position: "absolute", inset: 10, borderRadius: PH.r - 10, background: "#0d0b18" }} />
        <div style={{ position: "absolute", inset: 18, borderRadius: PH.r - 18, background: "#fff", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 66, top: 40, fontFamily: SANS, fontWeight: 700, fontSize: 31, color: INK }}>9:41</div>
          <div style={{ position: "absolute", left: (PH.w - 36) / 2 - 75, top: 26, width: 150, height: 44, borderRadius: 22, background: "#0d0b18" }} />
          <div style={{ position: "absolute", left: 40, top: 118, display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 700, fontSize: 36, color: INK }}>
            <svg width="22" height="30" viewBox="0 0 12 20" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L2 10l8 8" /></svg>
            Collection point
          </div>
        </div>
      </div>

      {/* map in the phone */}
      <div
        style={{
          position: "absolute",
          left: SX,
          top: MAP.y,
          width: SW,
          height: MAP.h,
          borderRadius: 22,
          overflow: "hidden",
          background: "#e9e8ee",
          ...rise(phone, 70, 16),
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: mapQ, filter: mapQ < 0.999 ? `blur(${(1 - mapQ) * 10}px)` : undefined }}>
          <Img
            src={staticFile("pickup/map.png")}
            style={{
              width: SW,
              height: MAP.h,
              transform: `scale(${(1.08 - 0.08 * mapQ) * mapScale})`,
              transformOrigin: `${(FOCUS.x / MAP_SRC.w) * 100}% ${(FOCUS.y / MAP_SRC.h) * 100}%`,
            }}
          />
        </div>
        {/* focus ring on the selected pin */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={SW} height={MAP.h}>
          <ellipse cx={pinX - SX} cy={pinY - MAP.y} rx={84 * ring} ry={70 * ring} fill="none" stroke={PINK} strokeWidth={5} opacity={ring} />
          <circle cx={pinX - SX} cy={pinY - MAP.y} r={6} fill={PINK} opacity={line} />
        </svg>
      </div>
      {/* carousel dots */}
      <div style={{ position: "absolute", left: SX + SW / 2 - 30, top: MAP.y + MAP.h + 18, display: "flex", gap: 10, opacity: phone }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: i === 0 ? PINK : "#d6d3df" }} />
        ))}
      </div>

      {/* location details (dpd Local Pickup, from the HubBox checkout) */}
      <div style={{ position: "absolute", left: SX, top: 925, width: SW, display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(phone, 70, 16) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <Img src={staticFile("pickup/dpd.png")} style={{ height: 26 }} />
          <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 31, color: INK, whiteSpace: "nowrap" }}>Snappy Snaps</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: SANS, fontWeight: 700, fontSize: 24, color: PINK, whiteSpace: "nowrap", flexShrink: 0 }}>
          0.1 mi <Walk /> 2 min
        </div>
      </div>
      <div style={{ position: "absolute", left: SX, top: 980, whiteSpace: "nowrap", fontFamily: MONO, fontSize: 18, letterSpacing: 2.6, color: "#8b879c", ...rise(phone, 70, 16) }}>
        21 GARRICK STREET · WC2E 9AX
      </div>

      {/* AI description */}
      <div
        style={{
          position: "absolute",
          left: SX,
          top: 1036,
          width: SW,
          height: 244,
          boxSizing: "border-box",
          borderRadius: 22,
          border: `3px solid ${PINK}`,
          background: "linear-gradient(160deg, #FFF1F5, #FFF8FA)",
          padding: "30px 26px",
          ...rise(box, 18, 10),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 19, letterSpacing: 3, color: PINK }}>
          <Sparkle c={PINK} s={26} /> AI DESCRIPTION
        </div>
        <div style={{ position: "absolute", left: 26, right: 26, top: 92, opacity: bars }}>
          {[0.92, 0.75, 0.45].map((w, i) => (
            <div key={i} style={{ height: 16, width: `${w * 100}%`, borderRadius: 8, background: "#F9D4E0", marginBottom: 24 }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 26, right: 22, top: 84, fontFamily: SANS, fontWeight: 500, fontSize: 30, lineHeight: 1.36, color: INK }}>
          {DESC.slice(0, typed)}
          <span style={{ display: "inline-block", width: 3, height: 34, marginLeft: 2, verticalAlign: "-6px", background: PINK, opacity: t > 4.2 ? caret : 0 }} />
        </div>
      </div>

      {/* button */}
      <div
        style={{
          position: "absolute",
          left: SX,
          top: 1320,
          width: SW,
          height: 74,
          borderRadius: 18,
          overflow: "hidden",
          background: confirmed > 0 ? `linear-gradient(90deg, rgba(229,36,95,${confirmed}), rgba(255,106,151,${confirmed})), ${INK}` : INK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: phone,
          transform: `scale(${1 - press * 0.04})`,
        }}
      >
        <div style={{ position: "absolute", left: 560 - SX, top: 37, width: 0, height: 0 }}>
          <div style={{ position: "absolute", left: -240, top: -240, width: 480, height: 480, borderRadius: "50%", background: "rgba(255,255,255,0.3)", transform: `scale(${ripple})`, opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0 }} />
        </div>
        <span style={{ position: "absolute", fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#fff", opacity: 1 - confirmed }}>Confirm pickup</span>
        <span style={{ position: "absolute", display: "flex", alignItems: "center", gap: 10, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#fff", opacity: confirmed }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 12.5l5 5 10-11" strokeDasharray="30" strokeDashoffset={30 * (1 - confirmed)} />
          </svg>
          Pickup confirmed
        </span>
      </div>

      {/* dotted leader from the pin to the zoom bubble */}
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={1920}>
        <line x1={pinX} y1={pinY} x2={pinX + (BUB.cx - BUB.r * 0.7 - pinX) * line} y2={pinY + (BUB.cy + BUB.r * 0.7 - pinY) * line} stroke={PINK} strokeWidth={3} strokeDasharray="4 7" strokeLinecap="round" opacity={line} />
      </svg>

      {/* zoom bubble on the selected pin */}
      {bubble > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: BUB.cx - BUB.r,
            top: BUB.cy - BUB.r,
            width: BUB.r * 2,
            height: BUB.r * 2,
            borderRadius: "50%",
            overflow: "hidden",
            border: "6px solid #fff",
            boxSizing: "border-box",
            boxShadow: `0 0 0 3px ${PINK}, 0 24px 50px rgba(6,4,14,0.55)`,
            transform: `scale(${0.4 + 0.6 * bubble})`,
            opacity: Math.min(1, bubble * 1.6),
          }}
        >
          <Img
            src={staticFile("pickup/map.png")}
            style={{
              position: "absolute",
              width: MAP_SRC.w * 1.05,
              height: MAP_SRC.h * 1.05,
              left: BUB.r - 6 - FOCUS.x * 1.05,
              top: BUB.r - 6 - (FOCUS.y - 22) * 1.05,
            }}
          />
        </div>
      ) : null}

      {/* chips */}
      <Chip x={30} y={787} icon={<MapIcon />} text="Live map" q={chip1} from={-60} />
      <Chip x={690} y={1017} icon={<Sparkle />} text="AI-written" q={chip2} from={60} />

      {/* cursor */}
      <div style={{ position: "absolute", left: cx, top: cy, opacity: curIn * (1 - curOut), transform: `scale(${1 - press * 0.12})`, transformOrigin: "4px 2px" }}>
        <Cursor />
      </div>
    </AbsoluteFill>
  );
};
