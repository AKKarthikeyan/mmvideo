// Bundle the 60 FPS entry once and render stills for chosen beats: node /tmp/v60_stills.mjs <compId> <outDir> <frac> [keys...]
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import fs from "fs"; import path from "path";
const [comp, out, frac, ...keys] = process.argv.slice(2);
const root = "/Volumes/DarwinSSD/MMVideo";
const D = JSON.parse(fs.readFileSync(`${root}/public/vx/jioipo/data.json`));
const fr = D.beats.map(b => Math.ceil((b.sec + (b.scene.type === "title" ? 1.1 : 0.5)) * 30));
const st = []; fr.reduce((a, n, i) => (st[i] = a, a + n), 0);
const serveUrl = await bundle({entryPoint: `${root}/src/v60/index.ts`, publicDir: `${root}/public`});
const composition = await selectComposition({serveUrl, id: comp});
fs.mkdirSync(out, {recursive: true});
for (let i = 0; i < D.beats.length; i++) {
  const b = D.beats[i]; if (keys.length && !keys.includes(b.key)) continue;
  const f = Math.round((st[i] + fr[i] * Number(frac)) * 2);
  await renderStill({serveUrl, composition, frame: f, output: path.join(out, `${String(i).padStart(2, "0")}_${b.key}_${b.scene.type}.jpeg`), imageFormat: "jpeg", jpegQuality: 70, scale: 0.5});
  console.log("still", b.key, b.scene.type, f);
}
