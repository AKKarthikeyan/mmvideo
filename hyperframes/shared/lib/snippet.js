/* Moat Snippets scaffold (A3 onwards; A1 and A2 inline the same code). The page holds #root (data-duration), #cam and its
   scenes (.sc); it loads gsap, hf.js and assets/timing.js (scripts/moat_snippets/voice.py) before this file, then:
     const S = SNIP.start({ sources: "Visa", wipe2: "#e0a93a" }); window.__timelines.main = S.tl;   // the checker wants this line in the page
     const A = S.anchors({ hook: "why can't", ... });            // word start times, searched in script order
     S.scenes([["s1", 0, A.x], ..., ["s6", A.y, S.END]]);
     S.cap(210, ["A *language*"], t0, tOut, "sm");                // *mint* !red! ~gold~ spans
     S.render((t, u) => { ... });                                 // u = eased progress through the current scene
   The end card (Moat Atlas, disclaimer, sources) follows the voice by 0.5 s and holds 4 s. */
(function () {
  const css = `
    html, body { width: 1080px; height: 1920px; }
    #root { width: 1080px; height: 1920px; --ink: #12301f; --mint: #2f9e7a; --red: #d9483b; --gold: #e0a93a; --cream: #f4f0e8;
      background: radial-gradient(900px 1100px at 50% 40%, #f3f0ea 0%, #dcd7ce 58%, #b9b4aa 100%); }
    #vig { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(1000px 1300px at 50% 50%, transparent 48%, rgba(10, 30, 20, 0.5) 100%); }
    #cam { position: absolute; inset: 0; transform-origin: 50% 50%; }
    .abs { position: absolute; } .sc { position: absolute; inset: 0; }
    #pegs { position: absolute; inset: -60px; opacity: .5; background-image: radial-gradient(circle, rgba(18,48,31,.22) 3px, transparent 3.5px); background-size: 54px 54px; }
    .blob { position: absolute; border-radius: 50%; }
    .cp { position: absolute; left: 90px; width: 900px; font: 700 100px/1.02 Playfair, serif; color: var(--ink); text-shadow: 0 2px 0 rgba(255,255,255,.4); }
    .cp .ln { white-space: nowrap; } .cp .w { display: inline-block; white-space: pre; }
    .cp .ac { font-style: italic; color: #0f5a40; } .cp .rd { font-style: italic; color: #9a2616; } .cp .gd { font-style: italic; color: #5e3f02; }
    .cp.sm { font-size: 84px; } .cp.xs { font-size: 70px; }
    .tag2 { position: absolute; left: 90px; top: 80px; font: 700 28px/1 Oswald, sans-serif; letter-spacing: .16em; color: var(--ink); border: 3px solid currentColor; padding: 10px 16px; background: rgba(244,240,232,.92); }
    .ill { position: absolute; right: 90px; top: 88px; font: 700 28px/1 Oswald, sans-serif; letter-spacing: .14em; color: var(--ink); border: 2px dashed currentColor; padding: 8px 12px; background: rgba(244,240,232,.92); }
    .srcl { position: absolute; left: 90px; right: 90px; bottom: 70px; font: 28px/1.3 Plex, monospace; color: #12301f; background: rgba(244,240,232,.92); padding: 12px 18px; border-radius: 10px; }
    .num { position: absolute; left: 0; right: 0; text-align: center; font: 700 220px/1 Playfair, serif; color: var(--ink); text-shadow: 0 6px 0 rgba(255,255,255,.45); font-variant-numeric: tabular-nums; }
    .lab { position: absolute; left: 0; right: 0; text-align: center; font: 700 40px/1 Oswald, sans-serif; letter-spacing: .16em; color: #12301f; }
    .rowlab { position: absolute; font: 700 36px/1 Oswald, sans-serif; letter-spacing: .12em; color: var(--ink); text-align: center; }
    .town { position: absolute; font: 700 34px/1 Oswald, sans-serif; letter-spacing: .14em; color: var(--ink); text-align: center; background: rgba(244,240,232,.92); padding: 8px 14px; border-radius: 10px; }
    .bubble { position: absolute; background: var(--cream); border: 5px solid var(--ink); border-radius: 30px; padding: 14px 24px; font: 700 40px/1.1 Oswald, sans-serif; color: var(--ink); box-shadow: 0 10px 20px rgba(0,0,0,.25); white-space: nowrap; }
    .stamp { position: absolute; font: 700 64px/1.05 Oswald, sans-serif; letter-spacing: .08em; color: var(--red); border: 9px solid var(--red); border-radius: 14px;
      padding: 12px 24px; text-align: center; background: rgba(244,240,232,.92); transform-origin: 50% 50%; box-shadow: 0 14px 30px rgba(0,0,0,.3); white-space: nowrap; }
    .wipe { position: absolute; top: 0; width: 1080px; height: 1920px; }
    #endcard { position: absolute; left: 0; right: 0; top: 700px; text-align: center; }
    #endcard b { display: block; font: 700 130px/1 Oswald; letter-spacing: .12em; color: var(--ink); }
    #endcard i { display: block; font: italic 700 72px/1.15 Playfair; color: #146147; margin-top: 26px; }
    #endcard span { display: block; font: 28px/1.4 Plex; color: #12301f; margin-top: 56px; padding: 0 60px; }`;
  function start(o) {
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    const $ = (id) => document.getElementById(id), root = $("root"), cam = $("cam");
    const TM = window.TIMING, W = TM.words, VD = TM.duration, TAIL = 4.0, END = VD + 0.5;
    const H = HF.setup(VD + 0.5 + TAIL), E = HF.ease, F = HF.fade, L = HF.lerp, C = HF.clamp01;
    window.__timelines.main = H.tl;
    const sp = (x) => (x <= 0 ? 0 : 1 - Math.exp(-7 * x) * Math.cos(12 * x));
    const rnd = (i, k = 1) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };
    const pop = (t, t0, d = 0.6) => { const u = sp((t - t0) / d); return { o: C(u * 3), s: 0.3 + 0.7 * Math.min(u, 1.15), u }; };
    // layers the page doesn't draw
    cam.insertAdjacentHTML("afterbegin", '<div id="pegs" data-layout-ignore></div><div id="blobs" data-layout-ignore></div>');
    cam.insertAdjacentHTML("beforeend", `<div id="endcard"><b>MOAT ATLAS</b><i>Moat Snippets</i><span>Educational research, not investment advice<br />Not SEBI-registered<br />Sources: ${o.sources} · moatmarginresearch.com</span></div>`);
    root.insertAdjacentHTML("beforeend", `<div class="wipe" id="w1" style="background:#12301f"></div><div class="wipe" id="w2" style="background:${o.wipe2 || "#2f9e7a"}"></div><div id="vig" data-layout-ignore></div><div id="grain" data-layout-ignore></div>`);
    const blobs = []; for (let i = 0; i < 16; i++) { const d = document.createElement("div"); d.className = "blob"; const s = 140 + rnd(i) * 320; d.style.width = d.style.height = s + "px"; d.style.background = i % 3 === 0 ? "#e0a93a" : "#2f9e7a"; d.style.opacity = 0.07 + rnd(i, 2) * 0.1; $("blobs").appendChild(d); blobs.push({ d, x: rnd(i, 3) * 1300, y: rnd(i, 4) * 2000, v: 10 + rnd(i, 5) * 26 }); }
    // word anchors, searched in script order (same rule as scripts/moat_snippets/sfx.py)
    const nz = (s) => s.toLowerCase().replace(/[^a-z0-9.%$]/g, "").replace(/\.$/, "");
    let cur = 0;
    const T = (phrase) => { const p = phrase.split(" ").map(nz); for (let i = cur; i <= W.length - p.length; i++) if (p.every((x, k) => nz(W[i + k].w) === x)) { cur = i; return W[i].t0; } console.warn("no anchor: " + phrase); return W[Math.min(cur, W.length - 1)].t0; };
    const anchors = (m) => { const A = {}; for (const k in m) A[k] = T(m[k]); return A; };
    let SC = [];
    const caps = [];
    const cap = (top, lines, t0, tOut, cls = "", step = 0.16) => { let mode = ""; const el = document.createElement("div"); el.className = "cp " + cls; el.style.top = top + "px"; const words = [];
      lines.forEach((ln, i) => { const d = document.createElement("div"); d.className = "ln"; d.style.marginLeft = i * 56 + "px";
        ln.split(" ").forEach((w) => { const s = document.createElement("span"); s.className = "w"; const m = { "*": "ac", "!": "rd", "~": "gd" };
          if (m[w[0]]) { mode = m[w[0]]; w = w.slice(1); } const end = Object.keys(m).find((k) => m[k] === mode && w.endsWith(k)); if (end) w = w.slice(0, -1);
          if (mode) s.classList.add(mode); if (end) mode = ""; s.textContent = w + " "; d.appendChild(s); words.push(s); }); el.appendChild(d); });
      cam.appendChild(el); caps.push({ el, words, t0, step, tOut }); };
    const S = { $, T, anchors, cap, pop, sp, rnd, E, F, L, C, END, VD, tl: H.tl,
      scenes: (list) => { SC = list; },
      render: (fn) => {
        H.render = (t) => {
          let c = SC[0]; SC.forEach((s) => { const on = t >= s[1] && t < s[2]; $(s[0]).style.opacity = on ? 1 : 0; if (on) c = s; });
          const u = E.io2((t - c[1]) / Math.max(0.5, c[2] - c[1]));
          cam.style.transform = `scale(${1 + 0.05 * u})`;
          $("endcard").style.opacity = F(t, END + 0.15, 99, 0.5);
          [["w1", 0], ["w2", 0.1]].forEach(([id, d]) => { let x = -1200; SC.slice(1).forEach((s) => { const k = (t - (s[1] - 0.3 + d)) / 0.6; if (k > 0 && k < 1) x = -1080 + 2160 * E.io2(k); }); const ek = (t - (END - 0.2 + d)) / 0.6; if (ek > 0 && ek < 1) x = -1080 + 2160 * E.io2(ek); $(id).style.transform = `translateX(${x}px)`; });
          $("pegs").style.transform = `translate(${-t * 6}px, ${-t * 14}px)`;
          blobs.forEach((b) => { b.d.style.left = ((b.x + b.v * t) % 1500) - 200 + "px"; b.d.style.top = ((b.y - b.v * 0.7 * t + 4000) % 2300) - 200 + "px"; });
          caps.forEach((k) => { k.words.forEach((w, i) => { const x = (t - k.t0 - i * k.step) / 0.7, v = sp(x); w.style.opacity = C(x * 4); w.style.transform = `translateY(${(1 - v) * 70}px) scale(${0.85 + 0.15 * Math.min(v, 1.2)})`; }); k.el.style.opacity = 1 - C((t - k.tOut) / 0.25); });
          fn(t, u);
        };
        document.fonts.ready.then(() => H.ready());
      } };
    return S;
  }
  window.SNIP = { start };
})();
