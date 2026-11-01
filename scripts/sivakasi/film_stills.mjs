// node scripts/sivakasi/film_stills.mjs paradox 0.4   -> one still per act at the given fraction of the act
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import fs from "node:fs";
const film = process.argv[2], frac = +(process.argv[3] ?? 0.4), only = (process.argv[4] ?? "").split(",").filter(Boolean);
const d = JSON.parse(fs.readFileSync(`src/sivakasi/data/${film}.json`, "utf8"));
const serveUrl = await bundle({entryPoint: "src/sivakasi/index.ts"});
const inputProps = {film, audio: false}, comp = await selectComposition({serveUrl, id: `SV-${film}`, inputProps});
fs.mkdirSync(`out/sivakasi/film_${film}`, {recursive: true});
for (const a of d.acts.filter((x) => !only.length || only.includes(x.id))) { const fr = Math.min(comp.durationInFrames - 1, a.from + Math.round(a.dur * frac)); await renderStill({composition: comp, serveUrl, output: `out/sivakasi/film_${film}/${a.id}_${a.scene}.png`, frame: fr, inputProps, logLevel: "error"}); }
console.log("done", d.acts.length);
