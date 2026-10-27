// Renderer for scripts/datayt/look_stills.py: one bundle (public/ symlinked, not copied), one browser, many stills, then
// one contact sheet per story from those stills. Exits 1 if any still or sheet fails.
// usage (repo root): node scripts/datayt/look_render.mjs <jobs.json>
//   jobs: {"stills": [{"comp", "props", "frame", "out"}], "sheets": [{"out", "title", "cols", "cellW", "cells": [{"png", "label"}]}],
//          "concurrency": 3}
import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {bundle} from "@remotion/bundler";
import {openBrowser, renderStill, selectComposition} from "@remotion/renderer";

const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const comp = path.resolve("node_modules/@remotion/compositor-darwin-arm64");
const t0 = Date.now();
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public"), symlinkPublicDir: true});
console.log(`bundled in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
const browser = await openBrowser("chrome");
const failed = [];
const comps = new Map();
const select = async (id, props) => {
  const key = id + JSON.stringify(props ?? {});
  if (!comps.has(key)) comps.set(key, selectComposition({serveUrl, id, inputProps: props ?? {}, puppeteerInstance: browser}));
  return comps.get(key);
};
const one = async (j) => {
  try {
    fs.mkdirSync(path.dirname(j.out), {recursive: true});
    const composition = await select(j.comp, j.props);
    await renderStill({composition, serveUrl, output: j.out, inputProps: j.props ?? {}, frame: j.frame ?? 0, puppeteerInstance: browser, overwrite: true,
      timeoutInMilliseconds: 120000});
  } catch (e) {
    failed.push(j.out);
    console.log(`FAILED ${j.out}: ${String(e?.stack ?? e).split("\n").slice(0, 4).join(" | ").slice(0, 600)}`);
  }
};
const pool = async (items, n, fn) => {
  let i = 0, done = 0;
  await Promise.all(Array.from({length: Math.max(1, n)}, async () => {
    while (i < items.length) {
      const k = i++;
      await fn(items[k]);
      if (++done % 25 === 0) console.log(`${done} of ${items.length}`);
    }
  }));
};
await pool(jobs.stills ?? [], jobs.concurrency ?? 3, one);
console.log(`stills: ${(jobs.stills ?? []).length - failed.length} rendered, ${failed.length} failed`);

// contact sheets: each still scaled down by Remotion's own ffmpeg to a small JPEG and passed in as a data URI
const thumb = (png, w) => {
  const buf = execFileSync(`${comp}/ffmpeg`, ["-v", "error", "-i", png, "-vf", `scale=${w}:-2`, "-q:v", "4", "-f", "image2pipe", "-vcodec", "mjpeg", "-"],
    {env: {...process.env, DYLD_LIBRARY_PATH: comp}, maxBuffer: 64 << 20});
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
};
let sheetsFailed = 0;
for (const s of jobs.sheets ?? []) {
  try {
    const cells = s.cells.map((c) => ({label: c.label, src: fs.existsSync(c.png) ? thumb(c.png, s.cellW) : ""}));
    const props = {title: s.title, cols: s.cols, cellW: s.cellW, cells};
    const composition = await selectComposition({serveUrl, id: "LOOK-sheet", inputProps: props, puppeteerInstance: browser});
    fs.mkdirSync(path.dirname(s.out), {recursive: true});
    await renderStill({composition, serveUrl, output: s.out, inputProps: props, frame: 0, puppeteerInstance: browser, overwrite: true, imageFormat: "jpeg", jpegQuality: 88});
  } catch (e) {
    sheetsFailed++;
    console.log(`FAILED sheet ${s.out}: ${String(e).slice(0, 400)}`);
  }
}
if ((jobs.sheets ?? []).length) console.log(`sheets: ${jobs.sheets.length - sheetsFailed} rendered, ${sheetsFailed} failed`);
await browser.close({silent: true});
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
process.exit(failed.length || sheetsFailed ? 1 : 0);
