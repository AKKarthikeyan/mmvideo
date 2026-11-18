import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import fs from "fs"; import path from "path";
const root = "/Volumes/DarwinSSD/MMVideo";
const [id, out, ...specs] = process.argv.slice(2);   // specs: voice seconds (film = +0.3)
const serveUrl = await bundle({entryPoint: `${root}/src/voxplus/scale/shorts/index.ts`, publicDir: `${root}/public`});
const composition = await selectComposition({serveUrl, id});
fs.mkdirSync(out, {recursive: true});
for (const s of specs) {
  const f = Math.min(composition.durationInFrames - 1, Math.round((Number(s) + 0.3) * 60));
  const file = path.join(out, `${id}_${s}.png`);
  await renderStill({serveUrl, composition, frame: f, output: file, imageFormat: "png", scale: 0.5});
  console.log("still", s, f);
}
