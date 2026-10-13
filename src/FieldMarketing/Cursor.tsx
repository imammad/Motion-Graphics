import { INK } from "./theme";

export const Cursor: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ filter: "drop-shadow(0 6px 10px rgba(14,27,51,0.25))" }}
  >
    <path
      d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.7 L11.7 14.2 L18 14.2 Z"
      fill={INK}
      stroke="#FFFFFF"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);
