// Renders every composition whose id matches a pattern, skipping finished files.
// Run from the Remotion project root:
//   node <skill>/scripts/render_videos.mjs "<id regex>" <outDir> [scale]
// scale 1 = composition size (1080p), 2 = 4K. No audio codec change needed:
// the voice clip inside the composition is muxed as AAC.
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const [pattern, out, scaleArg] = process.argv.slice(2);
if (!pattern || !out) {
  console.error('usage: render_videos.mjs "<id regex>" <outDir> [scale]');
  process.exit(1);
}
const scale = Number(scaleArg || 1);
const browserExecutable = process.env.CHROMIUM || undefined;
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const re = new RegExp(pattern);
const comps = (await getCompositions(serveUrl, { browserExecutable })).filter((c) => re.test(c.id));
for (const c of comps) {
  const file = path.join(out, `${c.id}${scale === 2 ? "-4K" : ""}.mp4`);
  if (fs.existsSync(file)) {
    console.log("skip", c.id);
    continue;
  }
  const composition = await selectComposition({ serveUrl, id: c.id, browserExecutable });
  const t0 = Date.now();
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    audioCodec: "aac",
    audioBitrate: "320k",
    outputLocation: file + ".part.mp4",
    browserExecutable,
    concurrency: Math.min(4, os.cpus().length),
    scale,
    crf: 16,
    jpegQuality: 95,
  });
  fs.renameSync(file + ".part.mp4", file);
  console.log("rendered", c.id, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
console.log("ALL DONE", comps.length);
