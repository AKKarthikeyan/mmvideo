// a02gates dev/QA stills (copy of marutiq2_stills.mjs): one bundle, many frames. node scripts/voxplus/eternalq2_stills.mjs COMP OUTDIR SCALE sec1 sec2 ...
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [comp, out, scale, ...secs] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve("src/voxplus/A02Index.ts")});
const composition = await selectComposition({serveUrl, id: comp});
for (const s of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(parseFloat(s) * composition.fps));
  const o = path.join(out, `t${parseFloat(s).toFixed(1).padStart(6, "0")}.jpg`);
  await renderStill({composition, serveUrl, output: o, frame, scale: parseFloat(scale), imageFormat: "jpeg", jpegQuality: 70});
  console.log(o);
}
