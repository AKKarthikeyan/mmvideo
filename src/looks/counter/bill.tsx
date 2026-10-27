// THE KADAI BILL (say beats): a thermal bill feeding out on the counter, seen from above. It prints the story's facts as
// line items (each one said earlier, so locked), a dashed rule, the takeaway lines with their emphasis, and the say's
// number as the TOTAL in the hero face, printed on the narrator's word; the caution note is the footer. A provenance
// stamp lands on the corner when the story's source label applies.
// PROOF (an "over N×" say): before the bill, N copies of the small value drop into a stack beside the big pile at the same
// scale; the stack falls visibly short of the big one, and the card slams on the word.
import React from "react";
import {AbsoluteFill} from "remotion";
import {fitCss, fitFont, fitLines, fitSize, measure, wrap} from "../shared/fit";
import {shown} from "../shared/lock";
import {plain} from "../shared/text";
import type {LookNum} from "../shared/types";
import {type Cam, project} from "./camera";
import {assertContrast, rgba} from "./materials";
import {clamp01, ease, on2, slam} from "./motion";
import {Pile} from "./objects";
import {Card, GatedLine, LABEL_Y, Num, SAFE, ShelfLabel, Stamp, W_SAFE} from "./props";
import {World, type Ctx} from "./scene";
import {STAGE, TopDown} from "./surfaces";

const BX0 = SAFE.x0 + 20, BW = W_SAFE - 40;

// When the bill starts feeding: at the beat start, or (with a proof) on the last bar line.
export const billStart = (ctx: Ctx) => ctx.p.proof ? Math.round(ctx.b.f0 + 2 * ctx.L.barF) : ctx.b.f0;

export const Bill: React.FC<{ctx: Ctx}> = ({ctx}) => {
  const {f, B, M, b, L, P} = ctx;
  const t0 = billStart(ctx);
  const mono = fitFont(B.f.mono), heroF = fitFont(B.f.hero);
  const paper = M.thermal;
  const ink = assertContrast(B.c.ink, paper, 26, "bill"), acc = assertContrast(B.c.accent, paper, 30, "bill emphasis");
  const soft = assertContrast(B.c.softInk, paper, 24, "bill note");
  // items: the facts, said earlier
  const items = L.beats.filter((x) => x.kind === "fact" && x.big && x.i < b.i).slice(-4).map((x) => ({name: (x.kicker ?? x.name ?? "").split(" · ")[0], n: x.big as LookNum}));
  const lines = b.lines ?? [];
  const hero = b.hero;
  const step = Math.max(3, Math.min(6, Math.floor((b.f1 - t0 - 40) / (items.length + lines.length + 3))));
  let row = 0;
  const at = () => t0 + 12 + (row++) * step;
  const vis = (a: number) => (on2(f) >= a ? 1 : 0);
  const blocks: React.ReactNode[] = [];
  const head = B.name.toUpperCase();
  const hs = fitSize(head, fitFont(B.f.mono, 0.18), BW - 80, 40, 24);
  blocks.push(<div key="h" style={{textAlign: "center", ...fitCss(fitFont(B.f.mono, 0.18), hs), color: ink, lineHeight: 1.2}}>{head}</div>);
  blocks.push(<div key="c" style={{textAlign: "center", ...fitCss(mono, 22), color: soft, lineHeight: 1.4, marginBottom: 6}}>{L.chip.toUpperCase()}</div>);
  blocks.push(<div key="r1" style={{borderTop: `3px dashed ${ink}`, margin: "10px 0 12px", opacity: 0.8}}/>);
  for (const it of items) {
    const a = at();
    const nameS = fitSize(it.name, mono, BW - 80 - measure(it.n.text, mono, 30) - 24, 28, 18);
    blocks.push(<div key={`i${a}`} style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: vis(a), marginBottom: 6}}>
      <span style={{...fitCss(mono, nameS), color: ink}}>{it.name}</span>
      <Num n={it.n} f={f} font={mono} size={30} color={ink} blank={rgba(B.c.ink, 0.15)} where="bill item"/>
    </div>);
  }
  blocks.push(<div key="r2" style={{borderTop: `3px dashed ${ink}`, margin: "12px 0 14px", opacity: 0.8}}/>);
  // the takeaway: the line holding the hero is split around it; the hero is the TOTAL
  const nums = [...b.tokens.map((t) => t.num).filter((n): n is LookNum => !!n && n !== hero), ...b.lineNums];
  for (const l of lines) {
    const a = at();
    const p = plain(l);
    if (hero && p.includes(hero.text)) {
      const i = p.indexOf(hero.text);
      const pre = p.slice(0, i).trim(), post = p.slice(i + hero.text.length).trim();
      // the lead word(s) of the hero's own line ("AT") sit on the hero's row; the hero prints in the hero face
      const lead = pre && measure(pre.toUpperCase(), mono, 34) < 220 ? pre.toUpperCase() : "";
      if (pre && !lead) blocks.push(<div key={`p${a}`} style={{opacity: vis(a)}}><GatedLine line={pre.toUpperCase()} nums={nums} f={f} font={mono} size={34} ink={ink} acc={acc} blank={rgba(B.c.ink, 0.15)} lh={1.25}/></div>);
      const room = BW - 80 - (lead ? measure(lead, mono, 34) + 18 : 0);
      const size = fitSize(hero.text, heroF, room, 210, 80);
      blocks.push(<div key={`hero${a}`} style={{display: "flex", alignItems: "flex-end", gap: 18, margin: "4px 0 2px", height: size * 0.92, opacity: vis(a)}}>
        {lead && <span style={{...fitCss(mono, 34), color: ink, paddingBottom: size * 0.08}}>{lead}</span>}
        {shown(hero, f) ? <span style={{transform: `scale(${1 + 0.25 * Math.exp(-(f - hero.lockF) / 3)})`, transformOrigin: "0 100%", display: "inline-block", lineHeight: 0.92}}>
          <Num n={hero} f={f} font={heroF} size={size} color={acc} blank="" where="bill total" qualSize={hero.qual ? Math.round(size * 0.3) : undefined}/></span>
          : <span style={{display: "inline-block", width: Math.min(room, measure(hero.text, heroF, size)), height: 10, background: rgba(B.c.ink, 0.12), marginBottom: size * 0.1}}/>}
      </div>);
      if (post && /\w/.test(post)) blocks.push(<div key={`q${a}`} style={{opacity: vis(a)}}><GatedLine line={post.toUpperCase()} nums={nums} f={f} font={mono} size={34} ink={ink} acc={acc} blank={rgba(B.c.ink, 0.15)} lh={1.25}/></div>);
    } else {
      const wrapped = wrap(p.toUpperCase(), mono, 34, BW - 80);
      const starredUpper = l.toUpperCase();
      // keep the *emphasis* of the script on the wrapped bill lines
      let k = 0;
      const words = starredUpper.split(/\s+/);
      for (const wl of wrapped) {
        const n = wl.split(/\s+/).length;
        const part = words.slice(k, k + n).join(" "); k += n;
        blocks.push(<div key={`l${a}-${k}`} style={{opacity: vis(a)}}><GatedLine line={balance(part)} nums={nums} f={f} font={mono} size={34} ink={ink} acc={acc} blank={rgba(B.c.ink, 0.15)} lh={1.25}/></div>);
      }
    }
  }
  if (b.note) {
    const a = Math.max(at(), hero ? hero.lockF + 8 : 0);
    const N = fitLines(b.note, mono, BW - 80, 4, 24, 18);
    blocks.push(<div key="r3" style={{borderTop: `2px dashed ${soft}`, margin: "14px 0 10px", opacity: vis(a) * 0.7}}/>);
    blocks.push(<div key="note" style={{opacity: vis(a)}}>{N.lines.map((x, i) => <div key={i} style={{...fitCss(mono, N.size), color: soft, lineHeight: 1.3}}>{x}</div>)}</div>);
  }
  const feed = ease(on2(f), t0, t0 + 24);
  const maxH = 1404 - 290;
  const stampAt = (hero ? hero.lockF : t0 + 30) + 14;
  if (L.sourceLabel && b.src.includes(L.sourceLabel)) {
    blocks.push(<div key="st" style={{position: "relative", height: 70, marginTop: 8}}>
      {f >= stampAt && <Stamp B={B} text={L.sourceLabel} x={BW - 80 - 260} y={4} rot={-5} k={clamp01((f - stampAt) / 5)} maxW={240}/>}
    </div>);
  }
  const zig = "0 0, " + Array.from({length: 31}, (_, k) => 30 - k).map((i) => `${((i / 30) * 100).toFixed(2)}% ${i % 2 ? 14 : 0}px`).join(", ");
  return <AbsoluteFill>
    <TopDown M={M} surface={P.surface} seed={L.seed}/>
    <div style={{position: "absolute", left: BX0, top: 290, width: BW, maxHeight: maxH * (0.3 + 0.7 * feed), overflow: "hidden", transform: "rotate(-1.2deg)",
      filter: `drop-shadow(14px 22px 18px ${rgba(M.shadow, 0.5)})`}}>
      <div style={{position: "relative", background: paper, padding: "30px 40px 26px"}}>
        <div style={{position: "absolute", inset: 0, background: `linear-gradient(180deg, ${rgba(M.shadow, 0.07)}, ${rgba(M.shadow, 0)} 10%, ${rgba(M.shadow, 0)} 88%, ${rgba(M.shadow, 0.06)})`}}/>
        <div style={{position: "relative"}}>{blocks}</div>
      </div>
      <div style={{height: 14, background: paper, clipPath: `polygon(${zig})`}}/>
    </div>
  </AbsoluteFill>;
};

// re-balance *stars* on a slice of words (a starred phrase can be cut by the wrap)
const balance = (s: string) => ((s.match(/\*/g) ?? []).length % 2 ? (s.trim().startsWith("*") ? s + "*" : "*" + s) : s);

// ---------------------------------------------------------------- PROOF
export const proofFrame = (ctx: Ctx) => {
  const pr = ctx.p.proof!;
  return {objH: Math.max(pr.big, pr.small * pr.n) * pr.fam.layer, focus: [540, STAGE.base - pr.big * pr.fam.layer * 0.8] as [number, number]};
};

export const Proof: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b} = ctx;
  const pr = p.proof!;
  const fam = pr.fam;
  const xa = 290, xc = 640, w = 250;
  const hero = b.hero!;
  const t0 = b.f0 + 4, gap = Math.max(1, Math.min(2, Math.floor((hero.lockF - 6 - t0) / pr.n)));
  const card = slam(f, hero.lockF);
  const heroF = fitFont(B.f.hero), disp = fitFont(B.f.display);
  // the small pieces arrive in pairs on twos
  const landed = Math.max(0, Math.min(pr.n, Math.floor((on2(f) - t0) / gap) + 1));
  const stackH = landed * pr.small * fam.layer;
  const lines = (b.lines ?? []).map(plain);
  const size = fitSize(hero.text, heroF, 470, 200, 90);
  const cw = measure(hero.text, heroF, size) + 80, ch = size * 0.96 + 56;
  return <>
    <World ctx={ctx} cam={cam}>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <rect x={xa - w / 2} y={STAGE.base - pr.big * fam.layer} width={w} height={pr.big * fam.layer} fill={rgba(M.paper, 0.04)} stroke={M.paper} strokeWidth={3} strokeDasharray="12 9" opacity={0.7}/>
      </svg>
      <Pile kind={fam.obj} M={M} cx={xa} base={STAGE.base} w={w} layer={fam.layer} v={pr.big} f={f} seed={`${b.i}-pa`} settled/>
      {Array.from({length: landed}, (_, j) => {
        const at = t0 + j * gap;
        const fall = clamp01((on2(f) - (at - 6)) / 6);
        const y = j === landed - 1 ? -(1 - fall * fall) * 160 : 0;
        return <div key={j} style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${y}px)`}}>
          <Pile kind={fam.obj} M={M} cx={xc} base={STAGE.base - j * pr.small * fam.layer} w={w} layer={fam.layer} v={pr.small} f={f} seed={`${b.i}-s${j}`} settled shadow={j === 0}/>
        </div>;
      })}
      {f >= hero.lockF + 8 && <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={xa - w / 2} x2={xc + w / 2 + 10} y1={STAGE.base - pr.big * fam.layer} y2={STAGE.base - pr.big * fam.layer} stroke={M.paper} strokeWidth={3} strokeDasharray="10 8" opacity={ease(f, hero.lockF + 8, hero.lockF + 16)}/>
      </svg>}
    </World>
    {/* the takeaway words above, the hero card on the word */}
    <div style={{position: "absolute", left: SAFE.x0, top: 292, width: W_SAFE}}>
      {lines.filter((l) => !l.includes(hero.text)).slice(0, 1).map((l, i) => <div key={i} style={{...fitCss(disp, fitSize(l, disp, W_SAFE, 74, 40)), color: assertContrast(B.c.paper, M.wall, 60, "proof line"), lineHeight: 1.05}}>{l}</div>)}
    </div>
    {card.vis > 0 && <Card M={M} x={SAFE.x0} y={392} w={cw} h={ch} rot={-3} scale={card.s} bg={B.c.paper} origin="4% 50%">
      <div style={{position: "absolute", left: 40, top: 24}}><Num n={hero} f={f} font={heroF} size={size} color={assertContrast(B.c.accent, B.c.paper, size, "proof card")} blank={rgba(B.c.ink, 0.1)} where="proof card"/></div>
    </Card>}
    {card.vis > 0 && (() => {
      const rest = lines.filter((l) => !l.includes(hero.text)).slice(1).join(" ");
      if (!rest) return null;
      const x = SAFE.x0 + cw + 30, ww = SAFE.x1 - x;
      const L2 = fitLines(rest, disp, ww, 3, 54, 34);
      return <div style={{position: "absolute", left: x, top: 410, width: ww}}>{L2.lines.map((l, i) => <div key={i} style={{...fitCss(disp, L2.size), color: B.c.paper, lineHeight: 1.05, opacity: ease(f, hero.lockF + 2, hero.lockF + 8)}}>{l}</div>)}</div>;
    })()}
    <ShelfLabel B={B} M={M} cx={project(cam, xa, 0)[0]} y={LABEL_Y} maxW={320} name={pr.bigName} nameOn f={f} dim/>
    <ShelfLabel B={B} M={M} cx={project(cam, xc, 0)[0]} y={LABEL_Y} maxW={320} name={f >= hero.lockF ? `${pr.smallName} × ${pr.n}` : pr.smallName} nameOn f={f} hot/>
    {void stackH}
  </>;
};
