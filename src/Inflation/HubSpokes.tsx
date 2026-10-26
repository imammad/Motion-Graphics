import { Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Frame } from "./Frame";
import { OUT, POP, SceneProps, THEMES, ramp } from "./theme";
import { Sfx } from "./Sfx";

// "…that headline figure of 27% is a national average… Your personal experience
// will depend heavily on what you consume. So for example gas prices, car
// insurance, mortgage interest, they all rose faster than that headline number of 27%."
// Cue times are seconds into public/audio/T4.wav (C0080 03:15.0 → 03:35.0).
export const HUB_SECONDS = 21;
const CUE = {
  center: 1.0, // "27%"
  average: 2.4, // "national average"
  caption: 8.0, // "depend heavily on what you consume"
  captionOut: 12.6,
  items: { Gas: 13.3, "Car insurance": 14.2, "Mortgage interest": 15.0 } as Record<string, number>, // on each word
  faster: 16.7, // "rose faster"
  echo: 18.8, // "…of 27%"
} as const;

const CENTER = 27.6;
const ITEMS = [
  { label: "Gas", v: 63 },
  { label: "Car insurance", v: 72 },
  { label: "Mortgage interest", v: 152 },
];
const CX = 960;
const CY = 520;
const CR = 155;

// Balanced triangle in the order he says them: gas left, car insurance below,
// mortgage interest (the climax) right. Circle size grows with the rise.
const SPOTS: Record<string, [number, number]> = {
  Gas: [430, 520],
  "Car insurance": [960, 870],
  "Mortgage interest": [1490, 520],
};
const layout = () => {
  const pos = ITEMS.map((s) => {
    const ratio = s.v / CENTER;
    const [x, y] = SPOTS[s.label];
    return { ...s, ratio, x, y, r: Math.max(92, Math.min(140, 80 * Math.sqrt(ratio))) };
  });
  return pos.map((p) => {
    const dx = p.x - CX;
    const dy = p.y - CY;
    const L = Math.hypot(dx, dy) || 1;
    return {
      ...p,
      sx: CX + (dx / L) * (CR + 14),
      sy: CY + (dy / L) * (CR + 14),
      ex: p.x - (dx / L) * (p.r + 14),
      ey: p.y - (dy / L) * (p.r + 14),
    };
  });
};
const POS = layout();

const pct = (v: number) => "+" + (Math.abs(v) >= 100 || v % 1 === 0 ? Math.round(v).toString() : v.toFixed(1)) + "%";

export const HubSpokes: React.FC<SceneProps> = ({ theme }) => {
  const t = THEMES[theme];
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const center = ramp(time, CUE.center, CUE.center + 0.45, POP);
  const count = ramp(time, CUE.center, CUE.center + 1.2, OUT);
  const echo = interpolate(time, [CUE.echo, CUE.echo + 0.3, CUE.echo + 0.9], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringP = ramp(time, CUE.average, CUE.average + 1.4);
  const caption = ramp(time, CUE.caption, CUE.caption + 0.6) * (1 - ramp(time, CUE.captionOut, CUE.captionOut + 0.5));
  const faster = ramp(time, CUE.faster, CUE.faster + 0.6);

  return (
    <Frame
      t={t}
      time={time}
      heading="The average hides the bills that hurt"
      kicker="PRICE RISES 2021–2026"
      source="Figures from client brief · confirm sources (ONS CPI components)"
    >
      <Audio src={staticFile("audio/T4.wav")} />
      <Sfx name="impact" at={CUE.center} volume={0.55} />
      <Sfx name="whoosh" at={CUE.average} volume={0.35} />
      <Sfx name="tick" at={CUE.caption} volume={0.45} />
      {ITEMS.map((it, i) => (
        <Sfx key={it.label} name={(["blip2", "blip3", "blip5"] as const)[i]} at={CUE.items[it.label]} volume={0.45} />
      ))}
      <Sfx name="whoosh-soft" at={CUE.faster} volume={0.35} />
      <Sfx name="impact" at={CUE.echo} volume={0.4} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle
          cx={CX}
          cy={CY}
          r={CR + 10 + 110 * ringP}
          fill="none"
          stroke={t.accent}
          strokeWidth={2}
          opacity={ringP > 0 && ringP < 1 ? (1 - ringP) * 0.8 : 0}
        />
        {POS.map((p) => {
          const s = CUE.items[p.label];
          const len = Math.hypot(p.ex - p.sx, p.ey - p.sy);
          const draw = ramp(time, s - 0.35, s + 0.15);
          return (
            <line
              key={p.label}
              x1={p.sx}
              y1={p.sy}
              x2={p.ex}
              y2={p.ey}
              stroke={t.spoke}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${len} ${len}`}
              strokeDashoffset={len * (1 - draw)}
              opacity={draw > 0 ? 1 : 0}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          width: CR * 2,
          height: CR * 2,
          translate: "-50% -50%",
          scale: center * echo,
          borderRadius: "50%",
          background: t.chipBg,
          border: `3px solid ${t.chipBorder}`,
          boxShadow: t.chipGlow,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: t.chipInk,
            opacity: 0.86,
            maxWidth: 240,
            lineHeight: 1.3,
          }}
        >
          AVERAGE PRICE RISE
        </div>
        <div style={{ fontSize: 70, fontWeight: 800, lineHeight: 1, color: t.chipInk, textShadow: t.textGlow }}>
          {pct(CENTER * count)}
        </div>
      </div>

      {POS.map((p) => {
        const s = CUE.items[p.label];
        const pop = ramp(time, s, s + 0.45, POP);
        const cnt = ramp(time, s, s + 1.0, OUT);
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.r * 2,
              height: p.r * 2,
              translate: "-50% -50%",
              scale: pop,
              borderRadius: "50%",
              background: t.itemHot,
              border: `2.5px solid ${t.accent}`,
              boxShadow: faster > 0 ? t.itemGlow : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 21, fontWeight: 600, color: t.ink, maxWidth: p.r * 2 - 40, lineHeight: 1.2 }}>
              {p.label}
            </div>
            <div
              style={{
                fontSize: Math.round(38 + (16 * (p.r - 92)) / 48),
                fontWeight: 800,
                lineHeight: 1.05,
                color: t.accentText,
                textShadow: t.textGlow,
              }}
            >
              {pct(p.v * cnt)}
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, color: t.muted, opacity: faster }}>
              {p.ratio.toFixed(1)}× the average
            </div>
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 900,
          display: "flex",
          justifyContent: "center",
          opacity: caption,
          translate: `0px ${(1 - caption) * 20}px`,
        }}
      >
        <div
          style={{
            padding: "12px 30px",
            borderRadius: 999,
            border: `2px solid ${t.accent}`,
            fontSize: 32,
            fontWeight: 600,
            color: t.accentText,
            whiteSpace: "nowrap",
          }}
        >
          …but your inflation depends on what you buy
        </div>
      </div>
    </Frame>
  );
};
