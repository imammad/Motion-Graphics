import { BLUE, BLUE_DARK, BLUE_LIGHT, BLUE_TINT, MUTED } from "./theme";

type Props = {
  size: number;
  variant?: "blue" | "light" | "muted";
};

// Minimal head-and-shoulders avatar.
export const Person: React.FC<Props> = ({ size, variant = "blue" }) => {
  const fill =
    variant === "blue"
      ? `linear-gradient(160deg, ${BLUE_LIGHT}, ${BLUE} 55%, ${BLUE_DARK})`
      : variant === "light"
        ? `linear-gradient(160deg, #FFFFFF, ${BLUE_TINT})`
        : `linear-gradient(160deg, #E7EBF2, #CBD3E0)`;
  const figure = variant === "light" ? BLUE : variant === "muted" ? MUTED : "#FFFFFF";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: fill,
        position: "relative",
        overflow: "hidden",
        boxShadow:
          variant === "blue"
            ? `0 ${size * 0.12}px ${size * 0.3}px rgba(61,138,252,0.35)`
            : `0 ${size * 0.08}px ${size * 0.2}px rgba(14,27,51,0.08)`,
        border: variant === "light" ? `2px solid ${BLUE_TINT}` : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: "50%",
          background: figure,
          left: size * 0.32,
          top: size * 0.2,
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.7,
          height: size * 0.6,
          borderRadius: "50%",
          background: figure,
          left: size * 0.15,
          top: size * 0.64,
          opacity: 0.95,
        }}
      />
    </div>
  );
};
