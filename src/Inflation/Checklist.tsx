import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { Backdrop, ThemeName, THEMES, ramp } from "./theme";
import { Sfx } from "./Sfx";

// Checklist (T8). List: each step slides in on `at`, its badge fills and the
// tick draws on `tickAt`. Grid: cards land on `at`, the detail lands on `tickAt`.
export type ChecklistProps = {
  theme: ThemeName;
  audio: string;
  heading: string;
  kicker: string;
  source: string;
  backdrop: Backdrop;
  align: "left" | "center";
  layout: "list" | "grid";
  items: { title: string; detail: string; at: number; tickAt: number }[];
};

const TOP = 300;

export const Checklist: React.FC<ChecklistProps> = (p) => {
  const t = THEMES[p.theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const n = p.items.length || 1;
  const grid = p.layout === "grid";
  const cols = n <= 3 ? n : 2;
  const gap = 40;
  const cw = (1620 - gap * (cols - 1)) / cols;
  const gRows = Math.ceil(n / cols);
  const ch = Math.min(500, (640 - (gRows - 1) * 30) / gRows);
  const h = Math.min(150, 650 / n);

  return (
    <Frame
      t={t}
      time={time}
      heading={p.heading}
      kicker={p.kicker}
      source={p.source}
      backdrop={p.backdrop}
      center={p.align === "center"}
    >
      <Audio src={staticFile(p.audio)} />
      {p.items.map((it, i) => (
        <span key={`sfx${i}`}>
          <Sfx name="whoosh" at={it.at} volume={0.35} />
          <Sfx name={grid ? "pop" : "ding"} at={it.tickAt} volume={grid ? 0.45 : 0.4} />
        </span>
      ))}
      {p.items.map((it, i) => {
        const inP = ramp(time, it.at, it.at + 0.6);
        const tk = ramp(time, it.tickAt, it.tickAt + 0.5);
        const done = tk > 0.5;
        const badge = (
          <div
            style={{
              flex: "0 0 auto",
              width: 76,
              height: 76,
              borderRadius: "50%",
              boxSizing: "border-box",
              border: `2.5px solid ${done ? t.accent : t.badgeOffBorder}`,
              background: done ? t.badgeOn : "rgba(0,0,0,0)",
              boxShadow: done ? t.badgeOnGlow : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
              color: done ? t.badgeOnInk : t.ink,
            }}
          >
            {i + 1}
          </div>
        );

        if (grid) {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 150 + (i % cols) * (cw + gap),
                top: TOP + 40 + Math.floor(i / cols) * (ch + 30),
                width: cw,
                height: ch,
                boxSizing: "border-box",
                padding: "44px 40px",
                borderRadius: 24,
                background: t.panel,
                border: `1.5px solid ${done ? t.accent : t.panelBorder}`,
                boxShadow: done ? t.itemGlow : t.panelShadow,
                display: "flex",
                flexDirection: "column",
                gap: 26,
                opacity: inP,
                translate: `0px ${(1 - inP) * 40}px`,
              }}
            >
              {badge}
              <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.15, color: t.ink }}>{it.title}</div>
              <div
                style={{
                  width: 60 + 140 * tk,
                  height: 5,
                  borderRadius: 4,
                  background: done ? t.accent : t.axis,
                  boxShadow: done ? `0 0 12px ${t.glow}` : "none",
                }}
              />
              <div
                style={{
                  fontSize: 30,
                  lineHeight: 1.4,
                  color: t.muted,
                  opacity: tk,
                  translate: `0px ${(1 - tk) * 16}px`,
                }}
              >
                {it.detail}
              </div>
            </div>
          );
        }

        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: 150,
                top: TOP + i * h,
                width: 1620,
                height: h,
                display: "flex",
                alignItems: "center",
                gap: 36,
                opacity: inP,
                translate: `${(1 - inP) * 40}px 0px`,
              }}
            >
              {badge}
              <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: n > 4 ? 32 : 40, fontWeight: 700, lineHeight: 1.15, color: t.ink }}>{it.title}</div>
                <div style={{ fontSize: 24, lineHeight: 1.35, color: t.muted }}>{it.detail}</div>
              </div>
              <svg width={60} height={60} style={{ flex: "0 0 auto" }}>
                <circle cx={30} cy={30} r={27} fill="none" stroke={tk > 0 ? t.accent : t.ringOff} strokeWidth={2.5} />
                <path
                  d="M17 31 L26 40 L43 21"
                  fill="none"
                  stroke={t.accent}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="40 40"
                  strokeDashoffset={40 * (1 - tk)}
                />
              </svg>
            </div>
            <div
              style={{
                position: "absolute",
                left: 150,
                top: TOP + (i + 1) * h - 1,
                width: 1620,
                height: 1.5,
                background: t.grid,
                transformOrigin: "0 50%",
                scale: `${inP} 1`,
              }}
            />
          </div>
        );
      })}
    </Frame>
  );
};
