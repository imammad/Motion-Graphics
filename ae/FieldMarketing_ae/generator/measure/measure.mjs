// Renders the Measure composition at a few frames and saves the logged layout as JSON.
//   node ae/FieldMarketing_ae/generator/measure/measure.mjs <outDir> [browserExecutable]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const outDir = process.argv[2];
const browserExecutable = process.argv[3] || null;
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("ae/FieldMarketing_ae/generator/measure/index.tsx"), rspack: true });
const composition = await selectComposition({ serveUrl, id: "Measure", browserExecutable });
for (const frame of [134, 60]) {
  let json = null;
  await renderStill({
    serveUrl, composition, frame, browserExecutable,
    output: path.join(outDir, `ref_${frame}.png`),
    onBrowserLog: (log) => {
      if (log.text.startsWith("MEASURE_JSON ")) json = log.text.slice(13);
    },
  });
  if (!json) throw new Error("no measurement logged for frame " + frame);
  fs.writeFileSync(path.join(outDir, `layout_${frame}.json`), json);
  console.log("frame", frame, "->", json.length, "bytes");
}
