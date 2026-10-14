import { useId } from "react";
import { WHITE } from "./theme";

export type Look = {
  skin: string;
  hair: string;
  hairStyle: "short" | "long" | "bun" | "curly" | "buzz";
  shirt: string;
  glasses?: boolean;
  beard?: boolean;
};

// Illustrated stand-ins for the reference video's portrait photos.
export const PEOPLE = {
  fmm: { skin: "#E9B48F", hair: "#3B2418", hairStyle: "long", shirt: "#2F3A55" },
  finance: { skin: "#F2CDB0", hair: "#B8875A", hairStyle: "bun", shirt: "#E9EEF7", glasses: true },
  sales: { skin: "#9A6440", hair: "#1C1412", hairStyle: "buzz", shirt: "#4A6FA8", beard: true },
  a: { skin: "#F1C7A5", hair: "#5A3A26", hairStyle: "short", shirt: "#1F2433" },
  b: { skin: "#C98E68", hair: "#20160F", hairStyle: "curly", shirt: "#DCE7F8" },
  c: { skin: "#F4D2B8", hair: "#D9B27C", hairStyle: "long", shirt: "#7FA6E0" },
  d: { skin: "#7A4B30", hair: "#120C09", hairStyle: "short", shirt: "#F3F5F9", glasses: true },
  e: { skin: "#EDBE98", hair: "#2A1B12", hairStyle: "bun", shirt: "#3E4A66" },
  f: { skin: "#E2A982", hair: "#4B2F1E", hairStyle: "short", shirt: "#6E8FC4", beard: true },
} satisfies Record<string, Look>;

export const Avatar: React.FC<{ look: Look; size: number; ring?: boolean }> = ({ look, size, ring = true }) => {
  const id = useId().replace(/:/g, "");
  const { skin, hair, hairStyle, shirt, glasses, beard } = look;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        border: ring ? `${Math.max(3, size * 0.035)}px solid ${WHITE}` : "none",
        boxShadow: ring
          ? `0 0 0 ${size * 0.05}px rgba(212,230,252,0.6), 0 ${size * 0.12}px ${size * 0.3}px rgba(84,151,252,0.28)`
          : "none",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: "block" }}>
        <defs>
          <linearGradient id={`bg${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EAF2FF" />
            <stop offset="1" stopColor="#A9C9FA" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#bg${id})`} />
        {hairStyle === "long" ? (
          <path d="M31 47 C29 25 41 20 50 20 C61 20 71 26 69 47 L72 80 C64 83 58 80 56 74 L44 74 C42 80 35 83 28 80 Z" fill={hair} />
        ) : null}
        <path d="M12 102 C14 82 29 72 50 72 C71 72 86 82 88 102 Z" fill={shirt} />
        <rect x="43" y="58" width="14" height="17" rx="6" fill={skin} />
        <rect x="43" y="58" width="14" height="8" rx="4" fill="#000" opacity="0.08" />
        <circle cx="35" cy="47" r="3.6" fill={skin} />
        <circle cx="65" cy="47" r="3.6" fill={skin} />
        <ellipse cx="50" cy="45" rx="15" ry="18" fill={skin} />
        {beard ? <path d="M36 48 C37 62 44 66 50 66 C56 66 63 62 64 48 C61 56 56 57 50 57 C44 57 39 56 36 48 Z" fill={hair} opacity="0.85" /> : null}
        {hairStyle === "short" ? (
          <path d="M34 45 C32 27 42 23 51 23 C61 23 69 28 66 45 C64 35 58 32 50 32 C43 32 37 35 34 45 Z" fill={hair} />
        ) : null}
        {hairStyle === "buzz" ? (
          <path d="M35 41 C35 29 43 26 50 26 C58 26 65 29 65 41 C61 34 56 33 50 33 C44 33 39 34 35 41 Z" fill={hair} />
        ) : null}
        {hairStyle === "long" ? (
          <path d="M35 44 C35 30 43 26 51 26 C59 26 66 31 65 43 C60 35 51 33 45 36 C40 38 37 41 35 44 Z" fill={hair} />
        ) : null}
        {hairStyle === "bun" ? (
          <>
            <circle cx="50" cy="21" r="8" fill={hair} />
            <path d="M34 45 C32 28 42 25 50 25 C59 25 68 28 66 45 C63 35 57 33 50 33 C43 33 37 35 34 45 Z" fill={hair} />
          </>
        ) : null}
        {hairStyle === "curly" ? (
          <g fill={hair}>
            {[
              [36, 38],
              [39, 31],
              [45, 27],
              [52, 26],
              [59, 28],
              [63, 34],
              [65, 41],
              [35, 45],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="6.5" />
            ))}
          </g>
        ) : null}
        <circle cx="44" cy="46" r="1.7" fill="#241A1F" />
        <circle cx="56" cy="46" r="1.7" fill="#241A1F" />
        <path d="M45 53 Q50 57.5 55 53" stroke="#8E4436" strokeWidth="1.7" fill="none" strokeLinecap="round" />
        {glasses ? (
          <g stroke="#2B2B36" strokeWidth="1.3" fill="none">
            <rect x="38.5" y="42" width="10" height="8" rx="3.5" />
            <rect x="51.5" y="42" width="10" height="8" rx="3.5" />
            <path d="M48.5 45.5 H51.5" />
          </g>
        ) : null}
      </svg>
    </div>
  );
};
