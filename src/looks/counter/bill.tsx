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
import {Card, GatedLine, Num, SAFE, ShelfLabel, Stamp, W_SAFE} from "./props";
import {itemName} from "./plan";
import {qualFor} from "./locks";
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
  const NW = BW - 80;
  // items: the facts, said earlier
  // the line name is what the big is the value of (a bar printing the same value, else the kicker), never a group the
  // big is only one member of ("COCONUT −29.5%" was coconut oil); the source's printed qualifier rides with the value
  const items = L.beats.filter((x) => x.kind === "fact" && x.big && x.i < b.i).slice(-4).map((x) => ({name: itemName(x).toUpperCase(), n: x.big as LookNum, q: qualFor(L, x.big)}));
  const lines = b.lines ?? [];
  const hero = b.hero;
  const maxH = 1340 - 280;
  const N = b.note ? fitLines(b.note, mono, NW, 5, 32, 28) : null;
  // the takeaway takes the largest size (40-58 px) at which the whole bill still fits the paper, so the paper is never
  // half empty; the facts above it follow at 0.8 of that size
  const heroRow = (tk: number) => {
    if (!hero) return {size: 0, lead: "", pre: "", post: ""};
    const p = plain(lines.find((l) => plain(l).includes(hero.text)) ?? hero.text);
    const i = p.indexOf(hero.text);
    const pre = p.slice(0, i).trim(), post = p.slice(i + hero.text.length).trim();
    const lead = pre && measure(pre.toUpperCase(), mono, tk) < 240 ? pre.toUpperCase() : "";
    const room = NW - (lead ? measure(lead, mono, tk) + 18 : 0);
    return {size: fitSize(hero.text, heroF, room, 210, 80), lead, pre: lead ? "" : pre, post};
  };
  const needH = (tk: number) => {
    const iv = Math.round(tk * 0.8);
    let h = 170 + items.length * iv * 1.5 + 56;
    for (const l of lines) {
      const p = plain(l);
      if (hero && p.includes(hero.text)) { const r = heroRow(tk); h += r.size * 0.92 + 14 + (r.pre ? tk * 1.25 : 0) + (r.post && /\w/.test(r.post) ? wrap(r.post.toUpperCase(), mono, tk, NW).length * tk * 1.25 : 0); }
      else h += wrap(p.toUpperCase(), mono, tk, NW).length * tk * 1.25;
    }
    if (N) h += N.lines.length * N.size * 1.3 + 60;
    return h;
  };
  // no takeaway line is left to wrap with an orphan word: the size is capped by the longest line
  let tk = Math.min(58, ...lines.filter((l) => !(hero && plain(l).includes(hero.text))).map((l) => fitSize(plain(l).toUpperCase(), mono, NW, 58, 40)));
  while (tk > 40 && needH(tk) > maxH - 70) tk -= 2;
  const iv = Math.round(tk * 0.8);
  const step = Math.max(3, Math.min(6, Math.floor((b.f1 - t0 - 40) / (items.length + lines.length + 3))));
  let row = 0;
  const at = () => t0 + 12 + (row++) * step;
  const vis = (a: number) => (on2(f) >= a ? 1 : 0);
  const head: React.ReactNode[] = [], facts: React.ReactNode[] = [], take: React.ReactNode[] = [], foot: React.ReactNode[] = [];
  const title = B.name.toUpperCase();
  const hs = fitSize(title, fitFont(B.f.mono, 0.18), NW - 10, 46, 32);
  head.push(<div key="h" style={{textAlign: "center", ...fitCss(fitFont(B.f.mono, 0.18), hs), color: ink, lineHeight: 1.2}}>{title}</div>);
  head.push(<div key="c" style={{textAlign: "center", ...fitCss(mono, 30), color: soft, lineHeight: 1.4, marginBottom: 6}}>{L.chip.toUpperCase()}</div>);
  head.push(<div key="r1" style={{borderTop: `3px dashed ${ink}`, margin: "10px 0 0", opacity: 0.8}}/>);
  for (const it of items) {
    const a = at();
    const val = (it.q ? it.q.toUpperCase() + " " : "") + it.n.text;
    const vw = measure(val, mono, iv);
    const nameS = fitSize(it.name, mono, NW - vw - 24, Math.round(iv * 0.8), 26);
    const twoLines = measure(it.name, mono, nameS) > NW - vw - 24;
    facts.push(<div key={`i${a}`} style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: vis(a), marginBottom: 12, flexWrap: twoLines ? "wrap" : "nowrap"}}>
      <span style={{...fitCss(mono, nameS), color: ink}}>{it.name}</span>
      <span style={{whiteSpace: "nowrap", marginLeft: "auto"}}>{it.q && <span style={{...fitCss(mono, 28), color: acc}}>{it.q.toUpperCase()} </span>}<Num n={it.n} f={f} font={mono} size={iv} color={ink} blank={rgba(B.c.ink, 0.15)} where="bill item"/></span>
    </div>);
  }
  facts.push(<div key="r2" style={{borderTop: `3px dashed ${ink}`, margin: "4px 0 0", opacity: 0.8}}/>);
  // the takeaway: the line holding the hero is split around it; the hero is the TOTAL
  const nums = [...b.tokens.map((t) => t.num).filter((n): n is LookNum => !!n && n !== hero), ...b.lineNums];
  for (const l of lines) {
    const a = at();
    const p = plain(l);
    if (hero && p.includes(hero.text)) {
      const r = heroRow(tk);
      const room = NW - (r.lead ? measure(r.lead, mono, tk) + 18 : 0);
      const size = r.size;
      if (r.pre) take.push(<div key={`p${a}`} style={{opacity: vis(a)}}><GatedLine line={r.pre.toUpperCase()} nums={nums} f={f} font={mono} size={tk} ink={ink} acc={acc} blank={rgba(B.c.ink, 0.15)} lh={1.25}/></div>);
      take.push(<div key={`hero${a}`} style={{display: "flex", alignItems: "flex-end", gap: 18, margin: "4px 0 2px", height: size * 0.92, opacity: vis(a)}}>
        {r.lead && <span style={{...fitCss(mono, tk), color: ink, paddingBottom: size * 0.08}}>{r.lead}</span>}
        {shown(hero, f) ? <span style={{transform: `scale(${1 + 0.25 * Math.exp(-(f - hero.lockF) / 3)})`, transformOrigin: "0 100%", display: "inline-block", lineHeight: 0.92}}>
          <Num n={hero} f={f} font={heroF} size={size} color={acc} blank="" where="bill total" qualSize={hero.qual ? Math.round(size * 0.3) : undefined}/></span>
          : <span style={{display: "inline-block", width: Math.min(room, measure(hero.text, heroF, size)), height: 10, background: rgba(B.c.ink, 0.12), marginBottom: size * 0.1}}/>}
      </div>);
      if (r.post && /\w/.test(r.post)) take.push(<div key={`q${a}`} style={{opacity: vis(a)}}><GatedLine line={r.post.toUpperCase()} nums={nums} f={f} font={mono} size={tk} ink={ink} acc={acc} blank={rgba(B.c.ink, 0.15)} lh={1.25}/></div>);
    } else {
      const wrapped = wrap(p.toUpperCase(), mono, tk, NW);
      const starredUpper = l.toUpperCase();
      // keep the *emphasis* of the script on the wrapped bill lines
      let k = 0;
      const words = starredUpper.split(/\s+/);
      for (const wl of wrapped) {
        const n = wl.split(/\s+/).length;
        const part = words.slice(k, k + n).join(" "); k += n;
        take.push(<div key={`l${a}-${k}`} style={{opacity: vis(a)}}><GatedLine line={balance(part)} nums={nums} f={f} font={mono} size={tk} ink={ink} acc={acc} blank={rgba(B.c.ink, 0.15)} lh={1.25}/></div>);
      }
    }
  }
  if (N) {
    const a = Math.max(at(), hero ? hero.lockF + 8 : 0);
    foot.push(<div key="r3" style={{borderTop: `2px dashed ${soft}`, margin: "0 0 12px", opacity: vis(a) * 0.7}}/>);
    foot.push(<div key="note" style={{opacity: vis(a)}}>{N.lines.map((x, i) => <div key={i} style={{...fitCss(mono, N.size), color: soft, lineHeight: 1.3}}>{x}</div>)}</div>);
  }
  const feed = ease(on2(f), t0, t0 + 24);
  const stampAt = (hero ? hero.lockF : t0 + 30) + 14;
  if (L.sourceLabel && b.src.includes(L.sourceLabel)) {
    foot.push(<div key="st" style={{position: "relative", height: 70, marginTop: 8}}>
      {f >= stampAt && <Stamp B={B} text={L.sourceLabel} x={NW - 330} y={4} rot={-5} k={clamp01((f - stampAt) / 5)} maxW={300}/>}
    </div>);
  }
  const zig = "0 0, " + Array.from({length: 31}, (_, k) => 30 - k).map((i) => `${((i / 30) * 100).toFixed(2)}% ${i % 2 ? 14 : 0}px`).join(", ");
  return <AbsoluteFill>
    <TopDown M={M} surface={P.surface} seed={L.seed}/>
    <div style={{position: "absolute", left: BX0, top: 280, width: BW, maxHeight: maxH * (0.3 + 0.7 * feed), overflow: "hidden", transform: "rotate(-1.2deg)",
      filter: `drop-shadow(14px 22px 18px ${rgba(M.shadow, 0.5)})`}}>
      <div style={{position: "relative", background: paper, padding: "30px 40px 26px", minHeight: maxH - 14, boxSizing: "border-box", display: "flex", flexDirection: "column"}}>
        <div style={{position: "absolute", inset: 0, background: `linear-gradient(180deg, ${rgba(M.shadow, 0.07)}, ${rgba(M.shadow, 0)} 10%, ${rgba(M.shadow, 0)} 88%, ${rgba(M.shadow, 0.06)})`}}/>
        {/* the sections share the paper's height evenly, so no stretch of it is left blank */}
        <div style={{position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
          <div>{head}</div>
          {facts.length > 1 && <div>{facts}</div>}
          <div>{take}</div>
          {foot.length > 0 && <div>{foot}</div>}
        </div>
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
    <ShelfLabel B={B} M={M} cx={project(cam, xa, 0)[0]} maxW={320} name={pr.bigName} nameOn dim/>
    <ShelfLabel B={B} M={M} cx={project(cam, xc, 0)[0]} maxW={320} name={pr.smallName} nameOn hot/>
    {void stackH}
  </>;
};
