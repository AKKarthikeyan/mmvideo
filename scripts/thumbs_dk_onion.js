// Cover thumbnails for the dk-onion Short, rendered from the Short's own paper craft scene.
// usage: node thumbs_dk_onion.js <hyperframes/shorts/dk-onion/index.html> <out_dir>   (NODE_PATH must reach playwright)
// Important text stays inside the centre 1080 x 1350 (y 285-1635), which feed grids crop to.
const { chromium } = require("playwright");
(async () => {
  const [html, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto("file://" + html);
  await p.waitForFunction(() => !!(window.__hf && window.__hf.buildReady && window.__timelines && window.__timelines.main), null, { timeout: 60000 });
  await p.evaluate(() => window.__hf.buildReady.main.then(() => 1));
  const css = `#capband, .src, #vig { display: none !important; } #hook { top: 330px !important; }
    .tx { position: absolute; left: 0; width: 1080px; text-align: center; font: 700 132px/0.98 Oswald, sans-serif; color: #fffaf0;
      -webkit-text-stroke: 14px rgba(29, 26, 22, 0.94); paint-order: stroke fill; text-shadow: 0 8px 26px rgba(0,0,0,.45); letter-spacing: 0.01em; }
    .tx em { font-style: normal; color: #51bea3; }
    .big2 { position: absolute; font: 700 120px/0.9 Oswald, sans-serif; -webkit-text-stroke: 12px rgba(29, 26, 22, 0.94); paint-order: stroke fill; white-space: nowrap; }
    .big2 small { display: block; font: 700 46px/1.1 Oswald, sans-serif; letter-spacing: 0.08em; color: #fffaf0; -webkit-text-stroke: 8px rgba(29,26,22,.94); paint-order: stroke fill; }`;
  const shot = async (t, setup, name) => {
    await p.evaluate((t) => { window.__timelines.main.seek(t, false); return 1; }, t);
    await p.evaluate(({ css, setup }) => {
      document.querySelectorAll(".thumbx").forEach((e) => e.remove());
      const s = document.createElement("style"); s.className = "thumbx"; s.textContent = css; document.head.appendChild(s);
      const root = document.getElementById("root");
      for (const [cls, style, htmlx] of setup) { const d = document.createElement("div"); d.className = cls + " thumbx"; d.setAttribute("style", style); d.innerHTML = htmlx; root.appendChild(d); }
      return 1;
    }, { css, setup });
    await p.screenshot({ path: `${out}/${name}.png` });
  };
  const S = await p.evaluate(() => window.STORY);
  const by = Object.fromEntries(S.beats.map((x) => [x.id, x]));
  const end = (id) => by[id].t0 + by[id].sec;
  // A: the swollen onion, the cheaper potato, one line
  await p.evaluate(() => { ["tGar", "tGin", "tCau", "tPot"].forEach((id) => { document.getElementById(id).style.visibility = "hidden"; }); return 1; });
  await shot(end("b5") - 0.05, [
    ["big2", "left:40px; top:868px; color:#51bea3; font-size:104px;", "−14%<small>POTATO</small>"],
    ["tx", "top:1370px;", "SAME BASKET.<br><em>OPPOSITE</em> PRICES."],
  ], "thumb-A");
  // B: the ruler, the line it crossed
  await p.evaluate(() => { ["tGar", "tGin", "tCau", "tPot"].forEach((id) => { document.getElementById(id).style.visibility = ""; }); return 1; });
  await shot(end("b8") - 0.05, [
    ["tx", "top:1380px; font-size:116px;", "INFLATION <em>6.09%</em><br>BUT ONIONS +116%"],
  ], "thumb-B");
  await b.close();
})();
