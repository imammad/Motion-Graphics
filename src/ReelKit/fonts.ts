import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled locally so renders work offline.
// Sans: Inter stands in for Creato Display. Script: EB Garamond Bold Italic
// stands in for Apple Garamond Bold Italic (both are open-licensed).
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter.woff2"),
  weight: "100 900",
});
loadFont({
  family: "EB Garamond",
  url: staticFile("fonts/EBGaramond-BoldItalic.woff2"),
  weight: "700",
  style: "italic",
});
