// PRODUCT: a price on an item. A pack whose size the table prints (e.g. "200 ml") is a clear, label-free bottle that
// slides along the counter and stops; a pack with no printed size is a dashed outline (never a sized twin). The price
// tag on its neck flips over on the narrator's word. An earlier priced item in the story stands beside it with its
// tag. The sub (e.g. an older price) is a small kraft note from the lock.
import React from "react";
import {fitCss, fitFont, fitLines} from "../shared/fit";
import {type Cam, project} from "./camera";
import {assertContrast, rgba} from "./materials";
import {ease, inOut} from "./motion";
import {Bottle, Pack, bottleGeom} from "./objects";
import {LABEL_Y, SAFE, ShelfLabel} from "./props";
import {KickerSign, World, type Ctx} from "./scene";
import {HeroTag} from "./piles";
import {STAGE} from "./surfaces";

export const productFrame = (_ctx: Ctx) => ({objH: 420, focus: [600, STAGE.base - 220] as [number, number]});

export const Product: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b, L, P} = ctx;
  const big = b.big!;
  // an earlier priced item of the story (its tag already said), standing at the left
  const prev = L.beats.slice(0, b.i).reverse().find((x, k) => P.beats[b.i - 1 - k].dev === "product" && x.big);
  const prevP = prev ? P.beats[prev.i] : null;
  const cx = prev ? 650 : 560;
  const slide = ease(f, b.f0 + 4, b.f0 + 18, inOut);
  const x = cx + (1 - slide) * 520;
  const sized = !!p.size;
  const SC = prev ? 1.3 : 1.45;
  const bg = bottleGeom(x, STAGE.base, SC);
  const neck: [number, number] = sized ? [x, bg.neckY + 40] : [x, STAGE.base - 420];
  return <>
    <World ctx={ctx} cam={cam}>
      {prev && (prevP?.size ? <Bottle M={M} cx={300} base={STAGE.base} cap={B.c.accent2} seed={`p${prev.i}`} f={f} scale={1.3}/>
        : <Pack M={M} cx={300} base={STAGE.base} w={200} h={420}/>)}
      {sized ? <Bottle M={M} cx={x} base={STAGE.base} cap={B.c.accent2} seed={`p${b.i}`} f={f} scale={SC}/>
        : <Pack M={M} cx={x} base={STAGE.base} w={210} h={430}/>}
    </World>
    <KickerSign ctx={ctx}/>
    <HeroTag ctx={ctx} n={big} anchor={project(cam, neck[0], neck[1])} mode="flip" maxNumW={400}/>
    {/* the earlier item's own price, small, on its shelf label */}
    {prev && <ShelfLabel B={B} M={M} cx={project(cam, 300, 0)[0]} y={LABEL_Y} maxW={300} name={prev.name ?? ""} nameOn num={prev.big} f={f} dim/>}
    <ShelfLabel B={B} M={M} cx={project(cam, cx, 0)[0]} y={LABEL_Y} maxW={330} name={b.name ?? ""} nameOn={!/\d/.test(b.name ?? "") || f >= big.lockF} f={f} hot/>
    {p.sub && f >= p.sub.f + 10 && (() => {
      // the note goes where nothing stands: left of a lone item, or inside an unspecified pack's empty outline
      const font = fitFont(B.f.mono);
      const nw = prev ? 260 : 300;
      const L2 = fitLines(p.sub.text, font, nw - 28, 4, 26, 18);
      const k = ease(f, p.sub.f + 10, p.sub.f + 18);
      const [sx, sy] = prev ? project(cam, x - nw / 2, STAGE.base - 380) : project(cam, SAFE.x0 + 10, STAGE.base - 260);
      return <div style={{position: "absolute", left: Math.max(SAFE.x0, Math.min(sx, SAFE.x1 - nw)), top: sy, width: nw, padding: "10px 14px", background: M.kraft,
        transform: `rotate(${prev ? 4 : -3}deg) translateY(${(1 - k) * 30}px)`, opacity: k, boxShadow: `5px 8px 12px ${rgba(M.shadow, 0.5)}`}}>
        {L2.lines.map((l, i) => <div key={i} style={{...fitCss(font, L2.size), color: assertContrast(B.c.softInk, M.kraft, L2.size, "old price note"), lineHeight: 1.25}}>{l}</div>)}
      </div>;
    })()}
  </>;
};
