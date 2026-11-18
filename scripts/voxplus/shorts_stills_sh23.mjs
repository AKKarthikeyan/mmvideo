import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import fs from "fs"; import path from "path";
const root = "/Volumes/DarwinSSD/MMVideo";
const [out, ...specs] = process.argv.slice(2);
const START = 0.3;
const serveUrl = await bundle({entryPoint: `${root}/src/voxplus/scale/shorts/index.ts`, publicDir: `${root}/public`});
fs.mkdirSync(out, {recursive: true});
const comps = {};
for (const s of specs) {
  const [k, t] = s.split(":");
  comps[k] ??= await selectComposition({serveUrl, id: `SHORT-${k}`, inputProps: {music: false}});
  const f = Math.min(comps[k].durationInFrames - 1, Math.round((Number(t) + START) * 60));
  const file = path.join(out, `${k}_${t}.jpeg`);
  await renderStill({serveUrl, composition: comps[k], frame: f, output: file, imageFormat: "jpeg", jpegQuality: 75, scale: 0.5, inputProps: {music: false}});
  console.log("still", s, f);
}
