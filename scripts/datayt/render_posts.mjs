// Render many Data Kadai stills from one bundle and one browser (a CLI call per still bundles the project each time).
// usage (repo root): node scripts/datayt/render_posts.mjs <jobs.json>      jobs: [{"comp": "DK-bp-x", "props": {...}, "frame": 0, "out": "path.png"}, ...]
import fs from "node:fs";
import path from "node:path";
import {bundle} from "@remotion/bundler";
import {openBrowser, renderStill, selectComposition} from "@remotion/renderer";

const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public")});
const browser = await openBrowser("chrome");
let done = 0, failed = [];
for (const j of jobs) {
  try {
    fs.mkdirSync(path.dirname(j.out), {recursive: true});
    const composition = await selectComposition({serveUrl, id: j.comp, inputProps: j.props, puppeteerInstance: browser});
    await renderStill({composition, serveUrl, output: j.out, inputProps: j.props, frame: j.frame ?? 0, puppeteerInstance: browser, overwrite: true});
    done++;
    if (done % 25 === 0) console.log(`${done} of ${jobs.length}`);
  } catch (e) {
    failed.push(j.out); console.log(`FAILED ${j.out}: ${String(e).slice(0, 300)}`);
  }
}
await browser.close({silent: true});
console.log(`stills: ${done} rendered, ${failed.length} failed`);
process.exit(failed.length ? 1 : 0);
