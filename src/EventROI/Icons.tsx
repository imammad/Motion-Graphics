import { INK } from "./theme";

type IconProps = { size?: number; color?: string };

const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 28, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {children}
  </svg>
);

export const PinIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" fill={color} />
  </Svg>
);

export const MailIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm2 .9V8l7 4.6L19 8v-.6l-7 4.4-7-4.4Z" fill={color} />
  </Svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M9 4h6a1.5 1.5 0 0 1 1.5 1.5V7H20a1.5 1.5 0 0 1 1.5 1.5V12h-19V8.5A1.5 1.5 0 0 1 4 7h3.5V5.5A1.5 1.5 0 0 1 9 4Zm.5 3h5V6h-5v1ZM2.5 13.5h19v5A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5v-5Z" fill={color} />
  </Svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M7 2.5h2V4h6V2.5h2V4h2.5A1.5 1.5 0 0 1 21 5.5v14a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-14A1.5 1.5 0 0 1 4.5 4H7V2.5ZM5 9v10h14V9H5Z" fill={color} />
  </Svg>
);

export const TicketIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5V10a2 2 0 0 0 0 4v3.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5V14a2 2 0 0 0 0-4V6.5Zm11 1.5v2h1.5V8H14Zm0 3v2h1.5v-2H14Zm0 3v2h1.5v-2H14Z" fill={color} />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M10.5 3a7.5 7.5 0 0 1 6 12l4.3 4.3-1.5 1.5-4.3-4.3A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill={color} />
  </Svg>
);

export const ChartIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M4 20V10h3.5v10H4Zm6.25 0V4h3.5v16h-3.5Zm6.25 0v-7H20v7h-3.5Z" fill={color} />
  </Svg>
);

export const ChevronIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M9 5.5 15.5 12 9 18.5" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
