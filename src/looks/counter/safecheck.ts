// An opt-in QA check for the Counter look (look_opts.counterSafeCheck = true, e.g. through a props override in a still
// job): after the frame renders, every visible text glyph run in the look is measured in the DOM (Range bounds include
// rotation and scale) and the render fails if any lies outside the safe box (x 95-850, y 210-1480 at 1080x1920), so
// the still harness catches a word under the YouTube or Instagram overlays. Texture and objects may bleed; words may not.
import {useEffect, useState} from "react";
import {cancelRender, continueRender, delayRender} from "remotion";

const TOL = 2;

export const useSafeCheck = (on: boolean, root: React.RefObject<HTMLDivElement | null>, safe: {x0: number; x1: number; y0: number; y1: number}, frame: number) => {
  const [handle] = useState(() => (on ? delayRender("counter safe-box check") : null));
  useEffect(() => {
    if (!on || handle === null) return;
    const el = root.current;
    if (!el) { continueRender(handle); return; }
    const box = el.getBoundingClientRect();
    const k = box.width / 1080 || 1;            // the composition may be displayed scaled
    const bad: string[] = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = (n.textContent ?? "").trim();
      if (!t) continue;
      const p = n.parentElement;
      if (!p) continue;
      // skip text that is not drawn (fully transparent along its ancestry)
      let op = 1;
      for (let a: HTMLElement | null = p; a && a !== el; a = a.parentElement) op *= parseFloat(getComputedStyle(a).opacity || "1");
      if (op < 0.05) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      const b = r.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      const x0 = (b.left - box.left) / k, x1 = (b.right - box.left) / k, y0 = (b.top - box.top) / k, y1 = (b.bottom - box.top) / k;
      if (x0 < safe.x0 - TOL || x1 > safe.x1 + TOL || y0 < safe.y0 - TOL || y1 > safe.y1 + TOL) {
        bad.push(`"${t.slice(0, 40)}" at x ${x0.toFixed(0)}-${x1.toFixed(0)}, y ${y0.toFixed(0)}-${y1.toFixed(0)}`);
      }
    }
    if (bad.length) cancelRender(new Error(`counter safe-box check, frame ${frame}: ${bad.length} text run(s) outside x ${safe.x0}-${safe.x1}, y ${safe.y0}-${safe.y1}: ${bad.slice(0, 6).join("; ")}`));
    else continueRender(handle);
  }, [on, handle, root, safe, frame]);
};
