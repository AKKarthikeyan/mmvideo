// FLIP STAND (the no-object fallback: durations, rules, single amounts, a hook number with no object): a wooden stand of
// ring-bound flip cards, one card per digit. Before the word the cards are blank and riffle (glyph-free); on the word
// they fall open left to right, the first exactly on the lock frame. Static glyphs (₹, a sign, separators ride on the
// digit before them) never spin. The unit is a paper plate beside the cards.
// TALLY ("9 of 11"): beads on a brass abacus rod; on the word the counted beads slide across one every two frames.
import React from "react";
import {fitCss, fitFont, fitSize, measure} from "../shared/fit";
import {assertLocked, shown} from "../shared/lock";
import type {LookNum} from "../shared/types";
import {type Cam, project} from "./camera";
import {assertContrast, rgba} from "./materials";
import {clamp01, ease, on2, slam} from "./motion";
import {Abacus} from "./objects";
import {Card, Num, SAFE, W_SAFE} from "./props";
import {KickerSign, SubNote, TextStrip, World, type Ctx} from "./scene";
import {STAGE} from "./surfaces";

// The cards of a printed number: [static prefix and sign], then one card per digit with its following separator.
const cardsOf = (n: LookNum) => {
  const out: {t: string; digit: boolean}[] = [];
  const head = n.sign + n.prefix;
  if (head) out.push({t: head, digit: false});
  for (const ch of n.digits) {
    if (/\d/.test(ch)) out.push({t: ch, digit: true});
    else if (out.length) out[out.length - 1].t += ch;
  }
  return out;
};

export const flipFrame = (_ctx: Ctx) => ({objH: 520, focus: [540, 900] as [number, number]});

export const FlipStand: React.FC<{ctx: Ctx; cam: Cam; n: LookNum | null; top?: number; showText?: boolean}> = ({ctx, cam, n, top = 640, showText = true}) => {
  const {f, B, M, b, hook} = ctx;
  if (!n) return <World ctx={ctx} cam={cam}/>;
  const cards = cardsOf(n);
  const heroF = fitFont(B.f.hero), mono = fitFont(B.f.mono);
  const unit = n.unit.trim();
  const maxW = W_SAFE - 40;
  const cw = Math.min(150, Math.floor((maxW - (cards.length - 1) * 10) / cards.length));
  const ch = Math.round(cw * 1.45);
  const gs = Math.round(Math.min(cw * 1.28, ch * 0.8));
  const total = cards.length * cw + (cards.length - 1) * 10;
  const x0 = SAFE.x0 + (W_SAFE - total) / 2;
  const unitS = unit ? fitSize(unit, fitFont(B.f.display), W_SAFE - 60, 84, 40) : 0;
  const ink = assertContrast(B.c.ink, B.c.paper, gs, "flip card");
  const isOn = shown(n, f);
  const [, standBase] = project(cam, 0, STAGE.base);
  return <>
    <World ctx={ctx} cam={cam}/>
    {/* the stand: two wooden legs and a top bar with rings */}
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <defs><linearGradient id="fl-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={M.teakDark}/><stop offset="0.5" stopColor={M.teakLight}/><stop offset="1" stopColor={M.teakDark}/></linearGradient></defs>
      <rect x={x0 - 34} y={top - 26} width={total + 68} height={30} rx={8} fill="url(#fl-wood)"/>
      <path d={`M${x0 - 10},${top} L${x0 - 70},${standBase} M${x0 + total + 10},${top} L${x0 + total + 70},${standBase}`} stroke={M.teakDark} strokeWidth={22} strokeLinecap="round"/>
      <path d={`M${x0 - 10},${top} L${x0 - 70},${standBase} M${x0 + total + 10},${top} L${x0 + total + 70},${standBase}`} stroke={M.teakLight} strokeWidth={6} strokeLinecap="round" opacity={0.5}/>
      <ellipse cx={540} cy={standBase + 4} rx={total * 0.6} ry={16} fill={M.shadow} opacity={0.4}/>
    </svg>
    {cards.map((c, i) => {
      const x = x0 + i * (cw + 10);
      const at = n.lockF + i * 2;
      const open = c.digit ? f >= at : true;
      // before the word: blank cards riffle (a glyph-free flap every 4 frames)
      const riffle = !open && c.digit ? ((on2(f) + i * 2) % 8) / 8 : 1;
      const fall = c.digit ? clamp01((f - at) / 4) : 1;
      const showGlyph = c.digit ? open && isOn : true;
      if (showGlyph && c.digit) assertLocked(n, f, "flip card");
      return <div key={i} style={{position: "absolute", left: x, top, width: cw, height: ch, perspective: 900}}>
        {[0, 1].map((ring) => <div key={ring} style={{position: "absolute", left: cw * (ring ? 0.68 : 0.22), top: -16, width: 12, height: 30, borderRadius: 6,
          border: `3px solid ${M.brassLight}`, zIndex: 3}}/>)}
        <div style={{position: "absolute", inset: 0, background: B.c.paper, borderRadius: 8, boxShadow: `6px 10px 14px ${rgba(M.shadow, 0.5)}`, overflow: "hidden"}}>
          {showGlyph && <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...fitCss(heroF, gs), color: ink, lineHeight: 1}}>{c.t}</div>}
          <div style={{position: "absolute", left: 0, right: 0, top: ch / 2 - 1, height: 2, background: rgba(B.c.ink, 0.25)}}/>
        </div>
        {/* the falling flap */}
        {c.digit && fall < 1 && <div style={{position: "absolute", left: 0, top: 0, width: cw, height: ch / 2, background: B.c.paper, borderRadius: "8px 8px 0 0",
          transformOrigin: "50% 100%", transform: `rotateX(${-180 * (open ? fall : riffle)}deg)`, boxShadow: `0 4px 8px ${rgba(M.shadow, 0.3)}`, opacity: 0.98}}/>}
      </div>;
    })}
    {unit && isOn && <div style={{position: "absolute", left: SAFE.x0, width: W_SAFE, top: top + ch + 26, textAlign: "center", opacity: ease(f, n.lockF + 2, n.lockF + 8)}}>
      <span style={{display: "inline-block", padding: "6px 22px 10px", background: M.kraft, transform: "rotate(-1.5deg)", boxShadow: `5px 8px 12px ${rgba(M.shadow, 0.45)}`,
        ...fitCss(fitFont(B.f.display), unitS), color: assertContrast(B.c.ink, M.kraft, unitS, "flip unit"), lineHeight: 1.05}}>{unit}</span>
    </div>}
    {!hook && <KickerSign ctx={ctx}/>}
    {!hook && showText && b.text && <div style={{position: "absolute", left: SAFE.x0, top: 392, width: W_SAFE, padding: "12px 18px", background: B.c.paper,
      transform: "rotate(-1deg)", boxShadow: `6px 10px 14px ${rgba(M.shadow, 0.45)}`, opacity: ease(f, Math.max(n.lockF, ...b.textNums.map((x) => x.lockF)) + 4, Math.max(n.lockF, ...b.textNums.map((x) => x.lockF)) + 10)}}>
      <div style={{position: "relative", height: 84}}><TextStrip ctx={ctx} x={0} y={0} w={W_SAFE - 36} at={Math.max(n.lockF, ...b.textNums.map((x) => x.lockF))} size={36}/></div>
    </div>}
    {!hook && <SubNote ctx={ctx} x={SAFE.x0} y={showText && b.text ? 510 : 392} w={W_SAFE}/>}
    {void mono}
  </>;
};

// ---------------------------------------------------------------- TALLY
export const tallyFrame = (_ctx: Ctx) => ({objH: 340, focus: [540, 1080] as [number, number]});

export const Tally: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {p, f, B, M, b, hook} = ctx;
  const t = p.tally ?? {k: 0, n: 0};
  const n = hook ? b.hero : b.big;
  const lockF = n?.lockF ?? b.lockF;
  const x0 = 200, x1 = 750, y = 1080, r = Math.min(44, (x1 - x0) / (t.n * 1.32));
  const pitch = r * 1.3;
  const pos: number[] = [], hot: boolean[] = [];
  for (let i = 0; i < t.n; i++) {
    const rest = x1 - (t.n - 1 - i) * pitch;            // all beads parked at the right
    const counted = x0 + i * pitch;                      // counted beads at the left, in order
    const at = lockF + i * 2;
    const k = i < t.k ? ease(on2(f), at, at + 6) : 0;
    pos.push(rest + (counted - rest) * k);
    hot.push(i < t.k && f >= at + 3);
  }
  const heroF = fitFont(B.f.hero);
  const card = slam(f, lockF);
  return <>
    <World ctx={ctx} cam={cam}>
      <Abacus M={M} x0={x0} x1={x1} y={y} n={t.n} pos={pos} hot={hot} r={r} base={STAGE.base}/>
    </World>
    {!hook && <KickerSign ctx={ctx}/>}
    {!hook && n && card.vis > 0 && (() => {
      const s = fitSize(n.text, heroF, 600, 180, 80);
      const w = measure(n.text, heroF, s) + 80, h = s * 0.96 + 56;
      return <Card M={M} x={SAFE.x0} y={404} w={w} h={h} rot={-2.5} scale={card.s} bg={B.c.paper} origin="4% 50%">
        <div style={{position: "absolute", left: 40, top: 24}}><Num n={n} f={f} font={heroF} size={s} color={assertContrast(B.c.ink, B.c.paper, s, "tally card")} blank={rgba(B.c.ink, 0.1)} where="tally card"/></div>
      </Card>;
    })()}
    {!hook && <SubNote ctx={ctx} x={SAFE.x0} y={780} w={W_SAFE}/>}
    {!hook && b.text && <div style={{position: "absolute", left: SAFE.x0, top: 660, width: W_SAFE}}>
      <TextStrip ctx={ctx} bg={M.wall} x={0} y={0} w={W_SAFE} at={Math.max(lockF + 6, ...b.textNums.map((x) => x.lockF))} size={40}/>
    </div>}
  </>;
};
