// PRODUCT: a price on an item. A pack whose size the table prints (e.g. "200 ml") is a clear, label-free bottle that
// slides along the counter and stops; a pack with no printed size is a dashed outline (never a sized twin). The price
// tag on its neck flips over on the narrator's word. An earlier priced item in the story stands beside it with its
// tag. The sub (e.g. an older price) is a small kraft note from the lock.
import React from "react";
import {fitCss, fitFont, fitLines} from "../shared/fit";
import {type Cam, project} from "./camera";
import {assertContrast, rgba} from "./materials";
import {ease, inOut} from "./motion";
import {Bottle, Pack, Packet, bottleGeom} from "./objects";
import {SAFE, ShelfLabel, TopTag} from "./props";
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
  const sized = p.pack === "bottle";
  const SC = prev ? 1.3 : 1.45;
  const bg = bottleGeom(x, STAGE.base, SC);
  const neck: [number, number] = sized ? [x, bg.neckY + 40] : [x, STAGE.base - 430];
  const item = (cx0: number, pp: typeof p | null, sc: number, seed: string) => pp?.pack === "bottle"
    ? <Bottle M={M} cx={cx0} base={STAGE.base} cap={B.c.accent2} seed={seed} f={f} scale={sc} liquid={P.liquid}/>
    : pp?.pack === "packet" ? <Packet M={M} cx={cx0} base={STAGE.base} w={220} h={360}/> : <Pack M={M} cx={cx0} base={STAGE.base} w={210} h={430}/>;
  return <>
    <World ctx={ctx} cam={cam}>
      {prev && item(300, prevP, 1.3, `p${prev.i}`)}
      {item(x, p, SC, `p${b.i}`)}
    </World>
    <KickerSign ctx={ctx}/>
    <HeroTag ctx={ctx} n={big} anchor={project(cam, neck[0], neck[1])} mode="flip" maxNumW={400}/>
    {/* the earlier item's own price, on a small tag at its top */}
    {prev?.big && (() => { const [ax, ay] = project(cam, 300, STAGE.base - (prevP?.pack === "bottle" ? 500 : 440)); return <TopTag B={B} M={M} n={prev.big} f={f} ax={ax} ay={ay} size={40} dim at={b.f0 + 6}/>; })()}
    {prev && <ShelfLabel B={B} M={M} cx={project(cam, 300, 0)[0]} maxW={300} name={prev.name ?? ""} nameOn dim/>}
    <ShelfLabel B={B} M={M} cx={project(cam, cx, 0)[0]} maxW={330} name={b.name ?? ""} nameOn={!/\d/.test(b.name ?? "") || f >= big.lockF} hot/>
    {p.sub && f >= p.sub.f + 10 && (() => {
      // the note goes where nothing stands: left of a lone item, or inside an unspecified pack's empty outline
      const font = fitFont(B.f.mono);
      const nw = prev ? 300 : 340;
      const L2 = fitLines(p.sub.text, font, nw - 28, 4, 32, 28);
      const k = ease(f, p.sub.f + 10, p.sub.f + 18);
      const [sx, sy] = prev ? project(cam, x - nw / 2, STAGE.base - 380) : project(cam, SAFE.x0 + 10, STAGE.base - 260);
      return <div style={{position: "absolute", left: Math.max(SAFE.x0, Math.min(sx, SAFE.x1 - nw)), top: sy, width: nw, padding: "10px 14px", background: M.kraft,
        transform: `rotate(${prev ? 4 : -3}deg) translateY(${(1 - k) * 30}px)`, opacity: k, boxShadow: `5px 8px 12px ${rgba(M.shadow, 0.5)}`}}>
        {L2.lines.map((l, i) => <div key={i} style={{...fitCss(font, L2.size), color: assertContrast(B.c.softInk, M.kraft, L2.size, "old price note"), lineHeight: 1.25}}>{l}</div>)}
      </div>;
    })()}
  </>;
};
