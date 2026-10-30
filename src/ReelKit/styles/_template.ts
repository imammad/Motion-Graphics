import { BLUE_MINIMAL, StyleProfile } from "../style";

// Copy this file to styles/<client-name>.ts and change only what the
// Client Style Brief says. Everything else inherits the house look.
export const CLIENT_TEMPLATE: StyleProfile = {
  ...BLUE_MINIMAL,
  id: "client-name",
  name: "Client Name",
  accent: "#3A7BFF",
  accentGlow: "rgba(58, 123, 255, 0.55)",
  // sansFont / scriptFont: register new fonts in fonts.ts first.
  // paper / paperShade / gridColor / castShadow: the full-screen world.
};
