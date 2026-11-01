// Render one still per scene (and chosen frames) from a single bundle.  node scripts/sivakasi/stills.mjs Name:frame[:dur] ...
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import path from "node:path";
const entry = path.resolve("src/sivakasi/index.ts");
const bundled = await bundle({entryPoint: entry, webpackOverride: (c) => c});
const jobs = process.argv.slice(2).map((a) => { const [n, f, d] = a.split(":"); return {n, f: +(f ?? 300), d: +(d ?? 600)}; });
for (const j of jobs) {
  const inputProps = {name: j.n, dur: j.d};
  const comp = await selectComposition({serveUrl: bundled, id: "SV-scene", inputProps});
  const out = `out/sivakasi/test/${j.n}_${j.f}.png`;
  try { await renderStill({composition: comp, serveUrl: bundled, output: out, frame: j.f, inputProps, logLevel: "error"}); console.log("ok", out); }
  catch (e) { console.log("FAIL", j.n, String(e).split("\n")[0]); }
}
