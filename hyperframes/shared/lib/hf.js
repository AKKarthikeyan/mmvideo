/* One linear GSAP clock per sample: every frame is render(t), so any seek is exact.
   Samples call HF.setup(duration), register host.tl on window.__timelines.main, set host.render and call host.ready(). */
window.HF = (function () {
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const ease = {
    o2: (x) => 1 - Math.pow(1 - clamp01(x), 2),
    o3: (x) => 1 - Math.pow(1 - clamp01(x), 3),
    io2: (x) => { x = clamp01(x); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; },
    io3: (x) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; },
    back: (x, s = 1.7) => { x = clamp01(x) - 1; return 1 + (s + 1) * x * x * x + s * x * x; },
  };
  // fade(t, in, out, d): 0 before `in`, 1 after in+d, back to 0 over d from `out` (out optional)
  const fade = (t, a, b = Infinity, d = 0.4) => clamp01((t - a) / d) * (1 - clamp01((t - b) / d));
  const lerp = (a, b, u) => a + (b - a) * u;
  function setup(D) {
    const clock = { t: 0 };
    const host = { D, clock, render: null };
    window.__hf = window.__hf || {};
    window.__hf.buildReady = window.__hf.buildReady || {};
    window.__hf.buildReady.main = new Promise((res) => { host.ready = () => { host.frame(clock.t); res(); }; });
    const grain = () => document.getElementById("grain");
    host.frame = (t) => {
      const g = grain();
      if (g) { const f = Math.round(t * 30); g.style.transform = `translate(${(f * 53) % 64}px, ${(f * 97) % 64}px)`; }
      if (host.render) host.render(t);
    };
    const tl = gsap.timeline({ paused: true });
    tl.to(clock, { t: D, duration: D, ease: "none", onUpdate: () => host.frame(clock.t) }, 0);
    host.tl = tl;
    // each page registers it inline (window.__timelines.main = host.tl) so the HyperFrames linter can see it
    window.__timelines = window.__timelines || {};
    return host;
  }
  return { setup, ease, fade, lerp, clamp01 };
})();
