// Renders design keyframes (half-size PNGs) for approval before any video render.
// Run from the Remotion project root:
//   node <skill>/scripts/render_stills.mjs <outDir> <CompId>:<sec>:<sec>... [<CompId>:<sec>...]
// Times are in seconds (converted with each composition's own fps).
// Set CHROMIUM=/path/to/chrome if Remotion can't find a browser by itself.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [out, ...specs] = process.argv.slice(2);
if (!out || !specs.length) {
  console.error("usage: render_stills.mjs <outDir> <CompId>:<sec>[:<sec>...] ...");
  process.exit(1);
}
fs.mkdirSync(out, { recursive: true });
const browserExecutable = process.env.CHROMIUM || undefined;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const spec of specs) {
  const [id, ...secs] = spec.split(":");
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  for (const s of secs) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(s) * composition.fps));
    await renderStill({ composition, serveUrl, frame, output: `${out}/${id}_${s}.png`, browserExecutable, scale: 0.5 });
  }
  console.log("stills", id, secs.join(", "));
}
