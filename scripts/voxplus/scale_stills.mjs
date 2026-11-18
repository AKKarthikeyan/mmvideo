// Preview stills of the Jio size-advantage film. Bundles once, renders each requested moment at half size (30 fps comp).
//   node scripts/voxplus/scale_stills.mjs OUTDIR s03p2@1.5 s03p2@Airtel 123.4 ...   (beat@seconds, beat@phrase-prefix, or film seconds)
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import fs from "fs"; import path from "path";
const root = "/Volumes/DarwinSSD/MMVideo";
const [out, ...specs] = process.argv.slice(2);
const ts = fs.readFileSync(`${root}/src/voxplus/scale/scaleTiming.ts`, "utf8");
const grab = (n) => JSON.parse(ts.match(new RegExp(`export const ${n}[^=]*= (.*);`))[1]);
const BEAT = grab("BEAT"), WORDS = grab("WORDS");
const norm = (s) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const sec = (s) => {
  if (!s.includes("@")) return Number(s);
  const [k, x] = s.split("@");
  if (!isNaN(Number(x))) return BEAT[k] + Number(x);
  const t = norm(x).split(" ")[0], w = (WORDS[k] || []).find((w) => norm(w[0]) === t);
  return BEAT[k] + (w ? w[1] : 0);
};
const serveUrl = await bundle({entryPoint: `${root}/src/voxplus/scale/index.ts`, publicDir: `${root}/public`});
const composition = await selectComposition({serveUrl, id: "SCALE-film30", inputProps: {music: false}});
fs.mkdirSync(out, {recursive: true});
for (const s of specs) {
  const f = Math.min(composition.durationInFrames - 1, Math.round(sec(s) * 30));
  const file = path.join(out, `${s.replace(/[^a-z0-9@.]+/gi, "_")}.jpeg`);
  await renderStill({serveUrl, composition, frame: f, output: file, imageFormat: "jpeg", jpegQuality: 75, scale: 0.5, inputProps: {music: false}});
  console.log("still", s, f, file);
}
