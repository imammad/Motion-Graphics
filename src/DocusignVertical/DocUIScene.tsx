import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import { CORAL, EASE, fontFamily, VIOLET } from "./theme";

// Laid out on the original's 1600x900 stage coordinates, then scaled up and
// centred on the vertical canvas so the arrangement matches the original.
const STAGE_CX = 784;
const STAGE_CY = 438;
const K = 1.45;

type Box = { x: number; y: number; w: number; h: number };
type Tag = {
  label: string;
  icon: "plus" | "pen" | "gear";
  from: { icon: Box; label: Box };
  to: { icon: Box; label: Box; panel: Box };
  start: number;
};

const TAGS: Tag[] = [
  {
    label: "Erstellen",
    icon: "plus",
    from: {
      icon: { x: 850, y: 210, w: 65, h: 65 },
      label: { x: 925, y: 212, w: 194, h: 63 },
    },
    to: {
      icon: { x: 936, y: 193, w: 29, h: 29 },
      label: { x: 970, y: 193, w: 88, h: 29 },
      panel: { x: 936, y: 228, w: 122, h: 160 },
    },
    start: 8,
  },
  {
    label: "Zustimmen",
    icon: "pen",
    from: {
      icon: { x: 455, y: 440, w: 65, h: 65 },
      label: { x: 532, y: 441, w: 194, h: 63 },
    },
    to: {
      icon: { x: 522, y: 454, w: 29, h: 29 },
      label: { x: 556, y: 454, w: 174, h: 29 },
      panel: { x: 522, y: 488, w: 208, h: 77 },
    },
    start: 12,
  },
  {
    label: "Verwalten",
    icon: "gear",
    from: {
      icon: { x: 815, y: 512, w: 65, h: 65 },
      label: { x: 890, y: 512, w: 188, h: 63 },
    },
    to: {
      icon: { x: 879, y: 520, w: 29, h: 29 },
      label: { x: 913, y: 520, w: 84, h: 29 },
      panel: { x: 879, y: 554, w: 118, h: 138 },
    },
    start: 16,
  },
];

const mix = (a: Box, b: Box, t: number): Box => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
});

const abs = (b: Box): React.CSSProperties => ({
  position: "absolute",
  left: b.x,
  top: b.y,
  width: b.w,
  height: b.h,
});

const Icon: React.FC<{ kind: Tag["icon"]; size: number }> = ({
  kind,
  size,
}) => (
  <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
    {kind === "plus" ? (
      <path
        d="M12 3v18M3 12h18"
        stroke="#3a3550"
        strokeWidth={2}
        strokeLinecap="round"
      />
    ) : kind === "pen" ? (
      <path d="M5 19 L8 12 L17 3 L21 7 L12 16 Z" fill="#2b2540" />
    ) : (
      <g fill="#2b2540">
        <circle cx="12" cy="12" r="7" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <rect
            key={a}
            x="10"
            y="1"
            width="4"
            height="6"
            rx="1"
            transform={`rotate(${a} 12 12)`}
          />
        ))}
        <circle cx="12" cy="12" r="3.2" fill="#fff" />
      </g>
    )}
  </svg>
);

const Bar: React.FC<{ b: Box; dashed?: boolean }> = ({ b, dashed }) => (
  <div
    style={{
      ...abs(b),
      borderRadius: b.h / 2,
      background: dashed ? "transparent" : "rgba(255,255,255,0.35)",
      border: dashed
        ? "1.5px dashed rgba(60,50,90,0.55)"
        : "1.5px solid rgba(255,255,255,0.7)",
    }}
  />
);

const Page: React.FC = () => (
  <>
    <div
      style={{
        ...abs({ x: 632, y: 236, w: 333, h: 404 }),
        borderRadius: 26,
        background: "rgba(220,205,255,0.13)",
        boxShadow: "0 0 80px rgba(170,90,255,0.35)",
      }}
    />
    <div
      style={{
        ...abs({ x: 648, y: 250, w: 304, h: 375 }),
        borderRadius: 12,
        clipPath: "polygon(0 0, 240px 0, 304px 68px, 304px 375px, 0 375px)",
        background:
          "linear-gradient(160deg, #f1edf7 0%, #cfc8de 55%, #b9b1cb 100%)",
      }}
    />
    <Bar b={{ x: 683, y: 290, w: 62, h: 28 }} />
    <Bar b={{ x: 683, y: 360, w: 236, h: 14 }} />
    <Bar b={{ x: 683, y: 393, w: 53, h: 14 }} />
    <Bar b={{ x: 750, y: 391, w: 153, h: 18 }} dashed />
    <Bar b={{ x: 683, y: 426, w: 234, h: 14 }} />
    <Bar b={{ x: 730, y: 458, w: 66, h: 14 }} />
    <Bar b={{ x: 810, y: 458, w: 100, h: 14 }} />
    <Bar b={{ x: 730, y: 490, w: 183, h: 14 }} />
    <Bar b={{ x: 683, y: 523, w: 98, h: 14 }} />
    <div
      style={{
        ...abs({ x: 683, y: 573, w: 200, h: 2 }),
        borderTop: "2px dotted rgba(40,30,70,0.7)",
      }}
    />
  </>
);

const Panel: React.FC<{ tag: Tag; t: number }> = ({ tag, t }) => {
  const p = tag.to.panel;
  const reveal = `inset(0 0 ${(1 - t) * 100}% 0 round 4px)`;
  const common: React.CSSProperties = {
    ...abs(p),
    clipPath: reveal,
    background: "#e9e5ef",
    borderRadius: 4,
    boxShadow: "0 8px 30px rgba(20,0,60,0.35)",
    opacity: Math.min(1, t * 3),
  };

  if (tag.icon === "plus") {
    return (
      <div style={common}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: 7,
                top: 10 + i * 25,
                width: 16,
                height: 16,
                borderRadius: 3,
                border: i === 1 ? "1.5px solid #6d5cf0" : "1.5px solid #d4cfe0",
                background: "#f4f2f8",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 37,
                top: 11 + i * 25,
                width: 78,
                height: 14,
                borderRadius: 2,
                background: "#8b85a0",
              }}
            />
          </div>
        ))}
      </div>
    );
  }
  if (tag.icon === "pen") {
    return (
      <div style={common}>
        <div
          style={{
            position: "absolute",
            left: 5,
            top: 6,
            width: 198,
            height: 52,
            border: "1.5px solid #b9b3c8",
            background: "#fbfaff",
          }}
        />
        <svg
          style={{ position: "absolute", left: 20, top: 10 }}
          width={160}
          height={46}
          viewBox="0 0 160 46"
        >
          <path
            d="M18 20 C 4 26, 6 42, 22 38 C 34 35, 40 18, 30 14 C 22 12, 20 30, 34 30 C 46 30, 52 18, 58 20 C 64 22, 56 34, 66 32 C 76 30, 78 18, 86 22 C 92 26, 84 34, 92 32 C 100 30, 104 16, 112 10 C 116 6, 110 30, 118 28 C 128 26, 140 24, 150 26"
            fill="none"
            stroke="#2a1660"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={1}
            pathLength={1}
            strokeDashoffset={1 - Math.max(0, Math.min(1, t * 1.4 - 0.3))}
          />
        </svg>
        {["#2a1660", "#6d5cf0", CORAL].map((c, i) => (
          <div
            key={c}
            style={{
              position: "absolute",
              left: 176 + i * 9,
              top: 64,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: c,
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div style={common}>
      {[0, 1].map((i) => (
        <div key={i}>
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 15 + i * 23,
              width: 6,
              height: 6,
              borderRadius: 3,
              background: "#9a94ad",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 26,
              top: 10 + i * 23,
              width: 82,
              height: 16,
              borderRadius: 3,
              border: "1.5px solid #c8c2d6",
              background: "#fbfaff",
            }}
          />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 58,
          width: 82,
          height: 72,
          border: "1.5px solid #c8c2d6",
          background: "#f6f4fa",
        }}
      />
      <svg
        style={{ position: "absolute", left: 33, top: 66 }}
        width={56}
        height={56}
        viewBox="0 0 56 56"
      >
        <circle
          cx="28"
          cy="28"
          r="18"
          fill="none"
          stroke="#d9cffd"
          strokeWidth={11}
        />
        <circle
          cx="28"
          cy="28"
          r="18"
          fill="none"
          stroke="#7d4cf2"
          strokeWidth={11}
          pathLength={1}
          strokeDasharray={`${0.62 * t} 1`}
          transform="rotate(-90 28 28)"
        />
      </svg>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 96,
            top: 80 + i * 11,
            width: 5,
            height: 5,
            borderRadius: 3,
            background: i === 2 ? "#c9c1ef" : "#5b3df0",
          }}
        />
      ))}
    </div>
  );
};

const TagView: React.FC<{ tag: Tag; t: number }> = ({ tag, t }) => {
  const icon = mix(tag.from.icon, tag.to.icon, t);
  const label = mix(tag.from.label, tag.to.label, t);
  const fontSize = 20 - 9 * t;
  return (
    <>
      <div
        style={{
          ...abs(icon),
          borderRadius: 6 - 3 * t,
          background: "#f6f4fa",
          boxShadow: `0 0 ${24 - 16 * t}px rgba(255,255,255,0.55)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon kind={tag.icon} size={icon.w} />
      </div>
      <div
        style={{
          ...abs(label),
          borderRadius: 6 - 3 * t,
          padding: 3 - t,
          background: `linear-gradient(90deg, ${CORAL}, ${VIOLET})`,
          boxShadow: `0 0 ${26 - 18 * t}px rgba(220,60,200,${0.55 - 0.35 * t})`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 4 - 2 * t,
            background: "#1d0a48",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontFamily,
            fontWeight: 500,
            fontSize,
            letterSpacing: "0.07em",
            textShadow: `0 0 ${8 - 6 * t}px rgba(255,255,255,0.7)`,
          }}
        >
          {tag.label}
        </div>
      </div>
    </>
  );
};

// "Erstellen / Zustimmen / Verwalten" tags unfolding into product panels.
export const DocUIScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 44], [1.03, 0.97]) * K;

  return (
    <AbsoluteFill>
      <Background glow="rgba(98,24,200,0.55)" glowY={930} glowSize={1500} />
      <div
        style={{
          position: "absolute",
          left: 540 - STAGE_CX,
          top: 930 - STAGE_CY,
          width: 1600,
          height: 900,
          transform: `scale(${scale})`,
          transformOrigin: `${STAGE_CX}px ${STAGE_CY}px`,
        }}
      >
        <Page />
        {TAGS.map((tag) => {
          const t = interpolate(frame, [tag.start, tag.start + 10], [0, 1], {
            easing: EASE,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const p = interpolate(
            frame,
            [tag.start + 4, tag.start + 14],
            [0, 1],
            {
              easing: EASE,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );
          return (
            <div key={tag.label}>
              {p > 0 ? <Panel tag={tag} t={p} /> : null}
              <TagView tag={tag} t={t} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
