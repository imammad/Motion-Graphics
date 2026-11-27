/**
 * "Smart filtering — the right pickup point, first"
 * Rebuild of 03.mp4 with the real HubBox map (EC2N 4AY, Liverpool Street). As each filter switches on, a
 * dashed search radius tightens around the shopper and the list re-sorts; pin 1 ends as the best match.
 * Satoshi Bold headings, Commit Mono labels. Timing follows the original clip:
 *   0.25 headline · 0.45 card · 1.0 rows · 1.4/1.95/2.45/2.95 filters · 4.3 subline · 4.55 best match
 *   6.55 "Less drop-off" · 7.45 "More orders" · hold to 10.2
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
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IO = Easing.bezier(0.42, 0, 0.18, 1);

const CARD = { x: 140, y: 591, w: 800, r: 34 };
const IX = 169;
const IW = 742;
const MAP = { y: 691, h: 300 };
const SRC = { w: 770, h: 311 };
const k = IW / SRC.w; // map source px -> screen px
const ME = { x: 502, y: 265 }; // shopper (blue dot) in map source px
const BEST = { x: 643, y: 256 }; // pin 1 tip
const CHIP_Y = MAP.y + MAP.h + 20;
const CHIP_H = 63;
const ROW_Y = CHIP_Y + CHIP_H + 21;
const ROW_H = 82;
const PITCH = 92;
const CARD_H = ROW_Y + PITCH * 3 + ROW_H + 27 - CARD.y;
const STAT_Y = CARD.y + CARD_H + 28;

const p = (f: number, a: number, b: number, e = OUT) =>
  interpolate(f, [a * 60, b * 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });
const rise = (q: number, dist = 24, blur = 12): React.CSSProperties => ({
  opacity: q,
  transform: `translateY(${(1 - q) * dist}px)`,
  filter: q < 0.999 ? `blur(${(1 - q) * blur}px)` : undefined,
});

type RowId = "parcel" | "super" | "corner" | "post";
const ROWS: Record<RowId, { title: string; meta: string; icon: string }> = {
  parcel: { title: "Parcel locker", meta: "0.2 MI · OPEN 24/7 · DPD", icon: "locker" },
  super: { title: "Supermarket", meta: "2.4 MI · TILL 10PM · INPOST", icon: "cart" },
  corner: { title: "Corner shop", meta: "1.2 MI · TILL 6PM · EVRI", icon: "shop" },
  post: { title: "Post office", meta: "0.8 MI · CLOSES 5PM · ROYAL MAIL", icon: "post" },
};
// list order after each filter switches on (Distance, Hours, Carrier, Type)
const ORDERS: { t: number; order: RowId[] }[] = [
  { t: 0, order: ["corner", "post", "super", "parcel"] },
  { t: 1.45, order: ["parcel", "post", "corner", "super"] },
  { t: 2.0, order: ["parcel", "corner", "super", "post"] },
  { t: 2.5, order: ["parcel", "super", "corner", "post"] },
];
const DIM_AT: Partial<Record<RowId, number>> = { post: 2.05, corner: 2.55, super: 3.05 };
const FILTERS = [
  { label: "Distance", t: 1.4 },
  { label: "Hours", t: 1.95 },
  { label: "Carrier", t: 2.45 },
  { label: "Type", t: 2.95 },
];
// search radius around the shopper (map source px), tightening with each filter
const RADIUS = { t: [1.4, 1.95, 2.45, 2.95, 3.5], r: [560, 400, 320, 260, 225] };

const Icon: React.FC<{ kind: string; c?: string }> = ({ kind, c = "#fff" }) => {
  const s = { fill: "none", stroke: c, strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "locker") return (<svg width="26" height="26" viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M12 3v18M3 9.5h9M12 9.5h9M3 15.5h9" /></svg>);
  if (kind === "cart") return (<svg width="26" height="26" viewBox="0 0 24 24" {...s}><path d="M3 4h2.5l2.2 10.5h10.5L20.5 7H7" /><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></svg>);
  if (kind === "shop") return (<svg width="26" height="26" viewBox="0 0 24 24" {...s}><path d="M4 9l1.5-5h13L20 9" /><path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" /><path d="M5.5 11.5V20h13v-8.5M10 20v-5h4v5" /></svg>);
  return (<svg width="26" height="26" viewBox="0 0 24 24" {...s}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6l8.5 7 8.5-7" /></svg>);
};
const ChipIcon: React.FC<{ i: number }> = ({ i }) => {
  const s = { fill: "#fff" };
  if (i === 0) return (<svg width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M3 11L21 3l-8 18-2-8z" /></svg>);
  if (i === 1) return (<svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#fff" /><path d="M12 7v5.5l3.5 2" stroke={PINK} strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>);
  if (i === 2) return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinejoin="round"><path d="M2 6h12v10H2zM14 9.5h4.5l3.5 3.5V16h-8z" /><circle cx="6" cy="17.5" r="1.8" fill="#fff" /><circle cx="17.5" cy="17.5" r="1.8" fill="#fff" /></svg>);
  return (<svg width="20" height="20" viewBox="0 0 24 24" {...s}><path d="M3 4h8v16H3zM13 4h8v16h-8z" /></svg>);
};

const Stat: React.FC<{ x: number; title: string; sub: string; up: boolean; q: number }> = ({ x, title, sub, up, q }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: STAT_Y,
      width: 389,
      height: 90,
      boxSizing: "border-box",
      borderRadius: 22,
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      gap: 18,
      background: "linear-gradient(160deg, rgba(150,130,200,0.30), rgba(60,40,100,0.30))",
      border: "1.5px solid rgba(255,255,255,0.16)",
      boxShadow: "0 24px 50px rgba(6,4,14,0.45), inset 0 1.5px 0 rgba(255,255,255,0.16)",
      opacity: q,
      transform: `translate(${(1 - q) * 120}px, ${(1 - q) * 40}px) rotate(${(1 - q) * -8}deg) scale(${0.8 + 0.2 * q})`,
      filter: q < 0.999 ? `blur(${(1 - q) * 10}px)` : undefined,
    }}
  >
    <div style={{ width: 54, height: 54, borderRadius: 14, background: "linear-gradient(160deg, #FF5E8E, #E5245F)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {up ? <path d="M3 17l6-6 4 4 8-8M15 7h6v6" /> : <path d="M3 7l6 6 4-4 8 8M15 17h6v-6" />}
      </svg>
    </div>
    <div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#fff", whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 2.4, color: "rgba(255,255,255,0.55)", marginTop: 4, whiteSpace: "nowrap" }}>{sub}</div>
    </div>
  </div>
);

export const SmartFiltering: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 60;

  const head = p(f, 0.25, 0.9);
  const sub = p(f, 4.25, 4.85);
  const card = p(f, 0.4, 1.1);
  const mapQ = p(f, 0.6, 1.3);
  const best = p(f, 4.5, 5.0);
  const route = p(f, 4.6, 5.2, IO);
  const headerSwap = p(f, 4.45, 4.75);

  // radius (source px) and its sweep
  const R = interpolate(t, RADIUS.t, RADIUS.r, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: IO });
  const radiusOn = p(f, 1.35, 1.75);

  // row slot (fractional) over time
  const slotOf = (id: RowId) => {
    let s = ORDERS[0].order.indexOf(id);
    for (let i = 1; i < ORDERS.length; i++) {
      const q = p(f, ORDERS[i].t, ORDERS[i].t + 0.5, IO);
      s = s + (ORDERS[i].order.indexOf(id) - s) * q;
    }
    return s;
  };

  return (
    <AbsoluteFill style={{ background: "#120f24", overflow: "hidden" }}>
      <Img src={staticFile("filtering/bg.png")} style={{ position: "absolute", width: 1080, height: 1920, transform: `scale(${1 + t * 0.003})` }} />

      <div style={{ position: "absolute", top: 352, width: 1080, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 84, letterSpacing: -1.8, color: "#fff", ...rise(head, 22, 14) }}>
        Smart filtering
      </div>
      <div style={{ position: "absolute", top: 466, width: 1080, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 34, color: "rgba(255,255,255,0.75)", ...rise(sub, 14, 8) }}>
        the right pickup point, first
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
          ...rise(card, 40, 16),
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, top: 76, height: 1.5, background: "rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", left: 36, right: 36, top: 0, height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: MONO, fontSize: 21, letterSpacing: 4, color: "rgba(255,255,255,0.6)" }}>
          <span>PICKUP POINTS</span>
          <span style={{ position: "relative", width: 260, height: 30, textAlign: "right" }}>
            <span style={{ position: "absolute", right: 0, opacity: 1 - headerSwap }}>4 NEARBY</span>
            <span style={{ position: "absolute", right: 0, opacity: headerSwap, color: PINK }}>1 BEST MATCH</span>
          </span>
        </div>
      </div>

      {/* HubBox map */}
      <div style={{ position: "absolute", left: IX, top: MAP.y, width: IW, height: MAP.h, borderRadius: 18, overflow: "hidden", border: "1.5px solid rgba(255,255,255,0.18)", ...rise(mapQ, 22, 12) }}>
        <Img src={staticFile("filtering/map.png")} style={{ width: IW, height: SRC.h * k, display: "block", transform: `scale(${1.06 - 0.06 * mapQ})` }} />
        {/* outside the search radius: dimmed */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: radiusOn * 0.62,
            background: `radial-gradient(circle ${R * k}px at ${ME.x * k}px ${ME.y * k}px, transparent ${R * k - 1}px, rgba(21,18,42,0.85) ${R * k + 1}px)`,
          }}
        />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={IW} height={MAP.h}>
          <circle cx={ME.x * k} cy={ME.y * k} r={R * k} fill="none" stroke={PINK} strokeWidth={2.5} strokeDasharray="6 7" opacity={radiusOn} />
          {/* route to the best match */}
          <path
            d={`M ${ME.x * k} ${ME.y * k - 8} Q ${(ME.x + BEST.x) / 2 * k} ${ME.y * k - 60}, ${BEST.x * k} ${BEST.y * k}`}
            fill="none"
            stroke={PINK}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray="0.1 12"
            pathLength={1}
            style={{ strokeDasharray: `${route} 1`, filter: "drop-shadow(0 0 4px rgba(239,41,106,0.8))" }}
          />
          <ellipse cx={BEST.x * k} cy={BEST.y * k} rx={46 * best} ry={13 * best} fill="none" stroke={PINK} strokeWidth={3.5} opacity={best} />
          <circle cx={BEST.x * k} cy={(BEST.y - 50) * k} r={(40 + 5 * Math.sin(t * 5)) * best} fill="none" stroke={PINK} strokeWidth={3} opacity={best * 0.8} />
        </svg>
      </div>

      {/* filter chips */}
      {FILTERS.map((c, i) => {
        const w = (IW - 3 * 12) / 4;
        const on = p(f, c.t, c.t + 0.3, IO);
        const inQ = p(f, 0.85 + i * 0.06, 1.4 + i * 0.06);
        return (
          <div
            key={c.label}
            style={{
              position: "absolute",
              left: IX + i * (w + 12),
              top: CHIP_Y,
              width: w,
              height: CHIP_H,
              borderRadius: 32,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 25,
              color: "#fff",
              border: `1.5px solid rgba(255,255,255,${0.22 * (1 - on) + 0.25 * on})`,
              background: `linear-gradient(90deg, rgba(229,36,95,${on}), rgba(255,106,151,${on}))`,
              boxShadow: on > 0.5 ? "0 10px 24px rgba(239,41,106,0.35)" : undefined,
              transform: `scale(${1 + 0.06 * Math.sin(Math.PI * on)})`,
              ...{ opacity: inQ, filter: inQ < 0.999 ? `blur(${(1 - inQ) * 8}px)` : undefined },
            }}
          >
            <ChipIcon i={i} />
            {c.label}
          </div>
        );
      })}

      {/* rows */}
      {(Object.keys(ROWS) as RowId[]).map((id, idx) => {
        const r = ROWS[id];
        const y = ROW_Y + slotOf(id) * PITCH;
        const inQ = p(f, 1.0 + idx * 0.08, 1.55 + idx * 0.08);
        const dim = DIM_AT[id] !== undefined ? p(f, DIM_AT[id] as number, (DIM_AT[id] as number) + 0.4, IO) : 0;
        const b = id === "parcel" ? best : 0;
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: IX - 14 * b,
              top: y - 4 * b,
              width: IW + 28 * b,
              height: ROW_H + 8 * b,
              boxSizing: "border-box",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "0 22px",
              border: `1.5px solid rgba(255,255,255,${0.14 * (1 - b)})`,
              background:
                b > 0
                  ? `linear-gradient(90deg, rgba(229,36,95,${b}), rgba(255,106,151,${b})), #3a3062`
                  : "linear-gradient(160deg, #3d3366, #31284f)",
              boxShadow: b > 0 ? `0 18px 40px rgba(239,41,106,${0.35 * b})` : undefined,
              opacity: inQ * (1 - 0.55 * dim),
              filter: `blur(${(1 - inQ) * 8 + dim * 1.2}px)`,
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.14)", border: "1.5px solid rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon kind={r.icon} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 31, color: "#fff", whiteSpace: "nowrap" }}>{r.title}</div>
              <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 2.4, color: "rgba(255,255,255,0.62)", marginTop: 4, whiteSpace: "nowrap" }}>{r.meta}</div>
            </div>
            {id === "parcel" ? (
              <div style={{ opacity: b, transform: `scale(${0.7 + 0.3 * b})`, background: "#fff", color: PINK, fontFamily: MONO, fontSize: 15, letterSpacing: 2.6, padding: "10px 18px", borderRadius: 22, whiteSpace: "nowrap" }}>BEST MATCH</div>
            ) : (
              <div style={{ opacity: dim, fontFamily: MONO, fontSize: 15, letterSpacing: 2.6, color: "rgba(255,255,255,0.7)" }}>FILTERED</div>
            )}
          </div>
        );
      })}

      <Stat x={CARD.x} title="Less drop-off" sub="AT CHECKOUT" up={false} q={p(f, 6.5, 7.2)} />
      <Stat x={CARD.x + CARD.w - 389} title="More orders" sub="COMPLETED" up q={p(f, 7.4, 8.1)} />
    </AbsoluteFill>
  );
};
