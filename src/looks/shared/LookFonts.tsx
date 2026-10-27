// Loads a look's fonts with the FontFace API and holds the render (delayRender) until they are in, then checks that
// each face really draws its probe characters (₹ − × % and the digits for number faces): a glyph that would come from a
// fallback face fails the render instead of shipping a wrong ₹ or a hyphen-minus.
import React, {useEffect, useState} from "react";
import {cancelRender, continueRender, delayRender, staticFile} from "remotion";
import type {FontFaceSpec} from "../brands/types";
import {markFontLoaded, measure} from "./fit";

const loads = new Map<string, Promise<void>>();

const loadFace = (face: FontFaceSpec) => {
  const key = `${face.family}|${face.file}`;
  let p = loads.get(key);
  if (!p) {
    const weight = Array.isArray(face.weight) ? `${face.weight[0]} ${face.weight[1]}` : `${face.weight}`;
    const ff = new FontFace(face.family, `url("${staticFile(face.file)}") format("${face.format}")`,
      {weight, ...(face.stretch ? {stretch: `${face.stretch[0]}% ${face.stretch[1]}%`} : {}), display: "block"});
    p = ff.load().then((f) => { (document.fonts as unknown as {add: (x: FontFace) => void}).add(f); markFontLoaded(face.family); });
    loads.set(key, p);
  }
  return p;
};

// A character the face lacks is drawn by the fallback, so it measures differently against two unlike fallbacks.
export const missingGlyphs = (face: FontFaceSpec) => {
  const w = Array.isArray(face.weight) ? face.weight[1] : face.weight;
  return [...face.probe].filter((ch) => {
    const a = measure(ch, {family: `'${face.family}', monospace`, weight: w, tnum: false}, 100);
    const b = measure(ch, {family: `'${face.family}', serif`, weight: w, tnum: false}, 100);
    return Math.abs(a - b) > 0.01;
  });
};

export const useLookFonts = (faces: FontFaceSpec[]) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender(`look fonts: ${faces.map((f) => f.family).join(", ")}`, {timeoutInMilliseconds: 60000}));
  useEffect(() => {
    let alive = true;
    Promise.all(faces.map(loadFace)).then(() => {
      for (const f of faces) {
        const miss = missingGlyphs(f);
        if (miss.length) throw new Error(`${f.family} (${f.file}) does not draw ${miss.map((c) => `"${c}" U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`).join(", ")}`);
      }
      if (alive) setReady(true);
      continueRender(handle);
    }).catch((e) => cancelRender(e));
    return () => { alive = false; };
  }, []);      // eslint-disable-line react-hooks/exhaustive-deps
  return ready;
};

// Renders children only once the fonts are loaded and checked, so every measurement sees the real faces.
export const LookFonts: React.FC<{faces: FontFaceSpec[]; children: React.ReactNode}> = ({faces, children}) => {
  const ready = useLookFonts(faces);
  return ready ? <>{children}</> : null;
};
