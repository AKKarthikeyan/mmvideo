// LOOK-kit: one frame showing the shared pieces working together in a brand (grain, vignette, every editor's mark,
// the brand bug on dark and light, fitted type in every font role, the grid). A reference for the look builders and a
// render test for code no placeholder uses. npx remotion still src/index.ts LOOK-kit out/looks/kit.png --frame=40
// (--props '{"brand":"indicaatlas","look":"dispatch"}').
import React, {useMemo} from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {facesFor, getBrand, lookBrand} from "../brands";
import type {FontRole, LookBrand, LookId} from "../brands/types";
import {BrandBug} from "./BrandBug";
import {fitCss, fitFont, fitSize} from "./fit";
import {Grain, Vignette} from "./Grain";
import {BAR_F, BEAT_F} from "./grid";
import {LookFonts} from "./LookFonts";
import {EditorMark, markSeed, type MarkKind} from "./Marks";

const ROLES: FontRole[] = ["display", "hero", "mono", "serif", "body", "wordmark"];
const MARKS: MarkKind[] = ["underline", "circle", "highlight", "crossed-off", "strike-through", "bracket", "box"];
const SAMPLE = "₹2,00,000 · −0.63% · 3× · 25,000 t";

const Body: React.FC<{B: LookBrand}> = ({B}) => {
  const f = useCurrentFrame();
  const W = B.safe.x1 - B.safe.x0;
  return <>
    <AbsoluteFill style={{background: B.c.ground}}/>
    <Grain seed={7}/>
    <Vignette color={B.c.deep}/>
    <div style={{position: "absolute", left: B.safe.x0, top: B.safe.y0, width: W}}>
      {ROLES.map((r) => {
        const ff = fitFont(B.f[r]);
        const text = r === "wordmark" ? B.wordmark.parts.join(" ") : SAMPLE;      // the wordmark face carries letters only
        const size = fitSize(text, ff, W, 64, 16);
        return <div key={r} style={{marginBottom: 14}}>
          <div style={{...fitCss(fitFont(B.f.mono), 22), color: B.c.accent2}}>{r}: {B.f[r].face.family} {B.f[r].weight}{B.f[r].tnum ? " tnum" : ""}</div>
          <div style={{...fitCss(ff, size), color: B.c.paper}}>{text}</div>
        </div>;
      })}
      <div style={{display: "flex", flexWrap: "wrap", gap: 34, marginTop: 30}}>
        {MARKS.map((k, i) => <EditorMark key={k} kind={k} at={4 + i * 3} dur={14} seed={markSeed(11, i)} color={B.c.accent2}
          strokeWidth={6} padding={6}><span style={{...fitCss(fitFont(B.f.body), 40), color: B.c.paper}}>{k}</span></EditorMark>)}
      </div>
      <div style={{...fitCss(fitFont(B.f.mono), 22), color: B.c.paper, marginTop: 30}}>bar {BAR_F.toFixed(2)} f · beat {BEAT_F.toFixed(2)} f · frame {f}</div>
    </div>
    <div style={{position: "absolute", left: B.safe.x0, top: 1240, width: W, height: 150, background: B.c.paper, borderRadius: 8}}/>
    <BrandBug B={B} on="light" y={1380} x={B.safe.x1 - 20}/>
    <BrandBug B={B} on="dark"/>
    <div style={{position: "absolute", left: B.safe.x0 - 1, top: B.safe.y0 - 1, width: W, height: B.safe.y1 - B.safe.y0, border: `1px dashed ${B.c.accent2}`}}/>
  </>;
};

export const KitSheet: React.FC<{brand?: string; look?: LookId}> = ({brand, look = "slab"}) => {
  const B = useMemo(() => lookBrand(getBrand(brand), look), [brand, look]);
  const faces = useMemo(() => facesFor(getBrand(brand), look), [brand, look]);
  return <AbsoluteFill><LookFonts faces={faces}><Body B={B}/></LookFonts></AbsoluteFill>;
};
