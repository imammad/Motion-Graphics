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

export const UsersIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M9 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm7.5 1.5a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4ZM2 19c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5v1H2v-1Zm15.2-4.9c2.8.3 4.8 2 4.8 4.4V20h-4.2v-1c0-1.9-.2-3.4-.6-4.9Z" fill={color} />
  </Svg>
);

export const BoltIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M13.5 2 4 13.5h6.5L9.5 22 20 9.5h-6.6L13.5 2Z" fill={color} />
  </Svg>
);

export const GridIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M4.5 3h15A1.5 1.5 0 0 1 21 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3ZM5 5v4h4V5H5Zm6 0v4h8V5h-8Zm-6 6v8h4v-8H5Zm6 0v3.5h8V11h-8Zm0 5.5V19h8v-2.5h-8Z" fill={color} />
  </Svg>
);

export const ScanIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M3 8V5a2 2 0 0 1 2-2h3v2H5v3H3Zm13-5h3a2 2 0 0 1 2 2v3h-2V5h-3V3ZM3 16h2v3h3v2H5a2 2 0 0 1-2-2v-3Zm16 0h2v3a2 2 0 0 1-2 2h-3v-2h3v-3ZM6 11h12v2H6v-2Z" fill={color} />
  </Svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19Zm-1 4.5v6l5 3 1-1.7-4-2.4V7h-2Z" fill={color} />
  </Svg>
);

export const LockIcon: React.FC<IconProps> = ({ size, color = INK }) => (
  <Svg size={size}>
    <path d="M7 10V7.5a5 5 0 0 1 10 0V10h1a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 6 10h1Zm2 0h6V7.5a3 3 0 0 0-6 0V10Z" fill={color} />
  </Svg>
);
