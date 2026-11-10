/* Reveal Loop Shorts runtime. A project loads story.js (written by tools/shorts_build.py):
   window.STORY = {dur, beats: [{id, t0, sec, say}], caps: [{t0, t1, html}]}.
   SH.init() sets up the HF clock and the caption band and returns {H, B, E, A}:
   B(id) = start of a beat, E(id) = its end, A(id, "phrase", off) = the moment that phrase is spoken. */
window.SH = (function () {
  function init() {
    const S = window.STORY, H = HF.setup(S.dur), by = {};
    S.beats.forEach((b) => { by[b.id] = b; });
    const B = (id) => by[id].t0, E = (id) => by[id].t0 + by[id].sec;
    const A = (id, phrase, off = 0) => {
      const b = by[id], i = b.say.toLowerCase().indexOf(phrase.toLowerCase());
      if (i < 0) throw new Error("phrase not in " + id + ": " + phrase);
      return b.t0 + b.sec * i / b.say.length + off;
    };
    const band = document.getElementById("capband"), els = [];
    if (band) S.caps.forEach((c) => { const el = document.createElement("div"); el.className = "c"; el.innerHTML = c.html; band.appendChild(el); els.push(el); });
    const caps = (t) => {
      for (let i = 0; i < els.length; i++) {
        const c = S.caps[i], on = t >= c.t0 && t < c.t1;
        els[i].style.opacity = on ? 1 : 0;
        if (on) els[i].style.transform = `scale(${0.9 + 0.1 * HF.ease.o3((t - c.t0) / 0.1)})`;
      }
    };
    return { H, B, E, A, caps, S };
  }
  return { init };
})();
