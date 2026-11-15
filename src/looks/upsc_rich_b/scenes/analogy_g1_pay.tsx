// ECO-16 Part 3, builder G1: `payment-modes` (b13). A bank hall wall of four framed stations that light in turn: a counter with a withdrawal slip and notes, an ATM with a debit card (both `ca`),
// a cheque on a clipboard with a clock beside it (`ch`), a PoS machine, a laptop and a phone with a QR code (`el`). `hm` is the title card. Generic cards and notes only (no logos).
import React from "react";
import {SANS, SERIF, W, H, clamp, eio} from "../kit";
import {Adult, GDefs, E1Defs, F1Defs, Phone, QRCard, Note, Bundle, BankIcon, Badge, P2Card, elabs, ez, sm, pop, pulse, arcP, mixn, type Look, type Arms, type AP} from "./analogy_g1_kit";

const CLERK: Look = {kind: "plain", female: true, shirt: ["#6c8fb5", "#41607f"], pants: "#3d4658", hair: "#1a120d", skin: 3};
const PY = 262, PH = 468;                                   // panel top and height
const PANELS = [{x: 124, w: 340}, {x: 488, w: 340}, {x: 852, w: 400}, {x: 1276, w: 520}];
const seg = (f: number, a: number, d: number) => clamp((f - a) / Math.max(1, d));

const Panel: React.FC<{i: number; lit: number; children: React.ReactNode; tone?: "warm" | "cool"}> = ({i, lit, children, tone = "warm"}) => {
  const {x, w} = PANELS[i], id = `g1pp-${i}`;
  return (
    <g>
      <rect x={x - 4} y={PY + 14} width={w + 8} height={PH} rx={24} fill="#1c1006" opacity={0.26} filter="url(#ak-blur22)"/>
      <defs><clipPath id={id}><rect x={x} y={PY} width={w} height={PH} rx={20}/></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={PY} width={w} height={PH} fill={tone === "cool" ? "url(#g1-wallcool)" : "url(#g1-wall)"}/>
        <rect x={x} y={PY + PH - 70} width={w} height={70} fill="url(#g1-floor)"/>
        <rect x={x} y={PY + PH - 72} width={w} height={6} fill="#e8c58a" opacity={0.5}/>
        {children}
        <rect x={x} y={PY} width={w} height={PH} fill="#efe3c8" opacity={(1 - lit) * 0.58}/>
        {lit > 0.02 && <ellipse cx={x + w / 2} cy={PY + PH * 0.4} rx={w * 0.6} ry={PH * 0.46} fill="url(#g1-spot)" opacity={lit * 0.45}/>}
      </g>
      <rect x={x} y={PY} width={w} height={PH} rx={20} fill="none" stroke="url(#f1-brass)" strokeWidth={9}/>
      <rect x={x + 7} y={PY + 7} width={w - 14} height={PH - 14} rx={14} fill="none" stroke="#fff3b8" strokeWidth={1.6} opacity={0.55}/>
    </g>
  );
};

const Slip: React.FC<{x: number; y: number; rot?: number; s?: number}> = ({x, y, rot = 0, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-46} y={-28} width={92} height={56} rx={3} fill="url(#f1-paper)" stroke="#b8a074" strokeWidth={1.8} filter="url(#g1-sh-s)"/>
    <rect x={-46} y={-28} width={92} height={14} rx={3} fill="#2a6fb8"/>
    <text x={0} y={-17} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={8.5} letterSpacing="0.1em" fill="#fff6e4">WITHDRAWAL</text>
    <path d="M-36,-2 H36 M-36,8 H36 M-36,18 H8" stroke="#8a7a58" strokeWidth={1.8} opacity={0.7}/>
    <path d="M10,20 q6,-8 12,0 q6,6 14,-4" stroke="#1f3a78" strokeWidth={1.8} fill="none"/>
  </g>
);

/** a plain debit card: no logo, no network mark */
const Card: React.FC<{x: number; y: number; rot?: number; s?: number; glow?: number}> = ({x, y, rot = 0, s = 1, glow = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {glow > 0.01 && <ellipse rx={74} ry={50} fill="url(#g1-cool)" opacity={glow}/>}
    <rect x={-48} y={-30} width={96} height={60} rx={7} fill="url(#g1-vanblue)" stroke="#173b66" strokeWidth={2} filter="url(#g1-sh-s)"/>
    <rect x={-38} y={-18} width={20} height={16} rx={3} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1}/>
    <path d="M-38,-10 H-18 M-28,-18 V-2" stroke="#6a4a10" strokeWidth={0.8}/>
    <path d="M-38,8 H20 M-38,16 H4" stroke="#cfe0f2" strokeWidth={2} opacity={0.7}/>
    <path d="M-44,-26 Q-20,-30 14,-28" stroke="#fff" strokeWidth={2} opacity={0.4} fill="none"/>
  </g>
);

export const PayArt: React.FC<AP> = (p) => {
  const {f, dur, at} = p, ca = at("ca"), ch = at("ch"), el = at("el");
  const D1 = Math.max(60, (ch - ca) * 0.5), caB = ca + D1;
  const D3 = Math.max(80, dur - el - 20);
  const lit0 = ez(f, ca, 20), lit1 = ez(f, caB, 20), lit2 = ez(f, ch, 20), lit3 = ez(f, el, 20);
  // --- counter
  const c = seg(f, ca, D1), slipU = sm(f, ca + 6, D1 * 0.3), notesU = sm(f, ca + D1 * 0.5, D1 * 0.3);
  const P1 = PANELS[0], cTop = PY + 320;
  const clerkArms: Arms = {R: [20 - 6 * Math.sin(f / 6) * (c > 0 && c < 0.45 ? 1 : 0), 52], L: [14, 40]};
  // --- ATM
  const a = seg(f, caB, D1), cardU = sm(f, caB + 4, D1 * 0.28), dots = clamp((f - (caB + D1 * 0.32)) / (D1 * 0.2)), cash = sm(f, caB + D1 * 0.62, D1 * 0.3);
  const P2 = PANELS[1], ax = P2.x + P2.w / 2;
  // --- cheque and clock
  const P3 = PANELS[2], chU = seg(f, ch, 60), clockA = (f - ch) * 1.1, chSlide = sm(f, ch + 70, Math.max(60, (el - ch) * 0.6));
  // --- electronic
  const P4 = PANELS[3], e1 = seg(f, el, D3 * 0.3), e2 = seg(f, el + D3 * 0.32, D3 * 0.3), e3 = seg(f, el + D3 * 0.64, D3 * 0.3);
  const posTap = sm(f, el + 6, 20) * (1 - sm(f, el + 30, 18));
  const scan = e3 > 0 ? (f * 0.05) % 1 : 0;
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#e6d6b0"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g1-wall)" opacity={0.8}/>
      {Array.from({length: 10}, (_, i) => <rect key={i} x={-30 + i * 200} y={-20} width={100} height={H} fill="#f0dcb4" opacity={0.22}/>)}
      <rect x={-60} y={PY + PH + 20} width={W + 120} height={H - PY - PH} fill="url(#g1-floor)"/>
      {Array.from({length: 4}, (_, i) => <path key={i} d={`M-60,${PY + PH + 50 + i * 30} H${W + 60}`} stroke="#3a2412" strokeWidth={1.4} opacity={0.22}/>)}

      {/* ---- station 1: a counter, a withdrawal slip and notes ---- */}
      <Panel i={0} lit={lit0}>
        <path d={`M${P1.x + 40},${PY + 300} V${PY + 110} A${(P1.w - 80) / 2},${(P1.w - 80) / 2} 0 0 1 ${P1.x + P1.w - 40},${PY + 110} V${PY + 300} Z`} fill="url(#f2-win)" stroke="#a9895a" strokeWidth={7} opacity={0.9}/>
        <Adult x={P1.x + P1.w / 2} y={PY + 420} h={330} f={f} seed={101} look={CLERK} arms={clerkArms} hands={{R: "relax", L: "relax"}} lookX={0.5} legsHidden smile={0.5}/>
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${P1.x + 40 + i * 43},${PY + 190} V${cTop - 4}`} stroke="url(#f1-brass)" strokeWidth={4} opacity={0.85}/>)}
        <rect x={P1.x + 34} y={PY + 182} width={P1.w - 68} height={9} rx={3} fill="url(#f1-brass)" stroke="#6a4a10" strokeWidth={1.2}/>
        <rect x={P1.x + 14} y={cTop} width={P1.w - 28} height={20} rx={4} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.2}/><rect x={P1.x + 14} y={cTop} width={P1.w - 28} height={4} fill="#fff" opacity={0.3}/>
        <rect x={P1.x + 20} y={cTop + 20} width={P1.w - 40} height={PY + PH - cTop - 14} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
        {[0, 1].map((i) => <rect key={i} x={P1.x + 34 + i * 142} y={cTop + 38} width={124} height={PH - 120} rx={5} fill="none" stroke="#d9a468" strokeWidth={1.8} opacity={0.4}/>)}
        {slipU < 1 && <Slip x={mixn(P1.x + P1.w - 70, P1.x + P1.w / 2 + 8, slipU)} y={cTop - 8 - Math.sin(Math.PI * slipU) * 14} rot={mixn(-8, 3, slipU)} s={0.78} />}
        {notesU > 0.01 && <Bundle x={mixn(P1.x + P1.w / 2 + 8, P1.x + P1.w - 74, notesU)} y={cTop - 14} s={0.9} n={3} rot={-4} op={clamp(notesU * 4)}/>}
        {c > 0.01 && c <= 1 && <Badge x={P1.x + 48} y={PY + 52} ok s={0.9} a={ez(f, ca + D1 * 0.8, 12)}/>}
      </Panel>

      {/* ---- station 2: an ATM with a debit card ---- */}
      <Panel i={1} lit={lit1} tone="cool">
        <path d={`M${P2.x + 30},${PY + 300} V${PY + 130} A${(P2.w - 60) / 2},${(P2.w - 60) / 2} 0 0 1 ${P2.x + P2.w - 30},${PY + 130} V${PY + 300} Z`} fill="#dbe6ee" opacity={0.5} stroke="#a9b6c2" strokeWidth={5}/>
        <g transform={`translate(${ax} 0)`}>
          <ellipse cx={0} cy={PY + PH - 36} rx={130} ry={14} fill="#2a1808" opacity={0.3}/>
          <rect x={-104} y={PY + 38} width={208} height={PH - 76} rx={14} fill="url(#g1-navy)" stroke="#10182c" strokeWidth={3}/>
          <rect x={-104} y={PY + 38} width={60} height={PH - 76} rx={14} fill="#fff" opacity={0.08}/>
          <rect x={-84} y={PY + 58} width={168} height={118} rx={8} fill="#10151c" stroke="#6f808b" strokeWidth={3}/>
          <rect x={-78} y={PY + 64} width={156} height={106} rx={5} fill="url(#g1-screen)"/>
          <text x={0} y={PY + 98} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={15} letterSpacing="0.14em" fill="#e8f4ff">ENTER PIN</text>
          {[0, 1, 2, 3].map((i) => <circle key={i} cx={-33 + i * 22} cy={PY + 130} r={7} fill={i < Math.floor(dots * 4.01) ? "#fff" : "none"} stroke="#cfe8ff" strokeWidth={2}/>)}
          {/* keypad */}
          {Array.from({length: 12}, (_, i) => <rect key={i} x={-48 + (i % 3) * 34} y={PY + 192 + Math.floor(i / 3) * 24} width={28} height={18} rx={4} fill="url(#f2-steel)" stroke="#4c5b66" strokeWidth={1.4}/>)}
          {/* card slot and cash slot */}
          <rect x={-60} y={PY + 304} width={74} height={12} rx={3} fill="#0a0d12" stroke="#6f808b" strokeWidth={2}/>
          <rect x={22} y={PY + 296} width={58} height={26} rx={4} fill="#0a0d12" stroke="#6f808b" strokeWidth={2}/>
          <rect x={-80} y={PY + 340} width={160} height={14} rx={3} fill="#0a0d12" stroke="#6f808b" strokeWidth={2}/>
          <circle cx={90} cy={PY + 56} r={5} fill={dots > 0.1 ? "#3fd07a" : "#8a93a0"}/>
        </g>
        {cardU < 1 && <Card x={mixn(ax + 86, ax - 22, cardU)} y={mixn(PY + 250, PY + 312, cardU)} rot={mixn(-14, 0, cardU)} s={0.9 - 0.18 * cardU}/>}
        {cardU >= 1 && cash < 0.02 && <Card x={ax - 22} y={PY + 312} s={0.52}/>}
        {cash > 0.01 && <g transform={`translate(${ax + 51} ${mixn(PY + 304, PY + 372, cash)})`} opacity={clamp(cash * 3)}><Note s={0.42}/></g>}
        {a > 0.01 && <Badge x={P2.x + 296} y={PY + 52} ok s={0.9} a={ez(f, caB + D1 * 0.85, 12)}/>}
      </Panel>

      {/* ---- station 3: a cheque on a clipboard, a clock beside it ---- */}
      <Panel i={2} lit={lit2}>
        <g transform={`translate(${P3.x + 118} ${PY + 192})`}>
          <g filter="url(#g1-sh)">
            <rect x={-92} y={-120} width={184} height={236} rx={8} fill="#6a4a2c" stroke="#3a2412" strokeWidth={2.4}/>
            <rect x={-30} y={-134} width={60} height={26} rx={5} fill="#a8a8a0" stroke="#5a5a56" strokeWidth={2}/>
            <rect x={-78} y={-98} width={156} height={198} rx={3} fill="#fffaf0"/>
          </g>
          <g transform={`translate(0 ${-6}) rotate(${mixn(-4, -1, chU)})`} opacity={clamp(chU * 4)}>
            <rect x={-72} y={-62} width={144} height={92} rx={3} fill="#eaf3e4" stroke="#7a9a78" strokeWidth={1.8}/>
            <rect x={-72} y={-62} width={144} height={18} fill="#2f7a56"/>
            <text x={-64} y={-49} fontFamily={SANS} fontWeight={800} fontSize={10} letterSpacing="0.14em" fill="#e8fff0">CHEQUE</text>
            <text x={-64} y={-26} fontFamily={SANS} fontWeight={700} fontSize={8.5} letterSpacing="0.1em" fill="#5a7a58">PAY</text>
            <path d="M-46,-24 H62 M-64,-6 H62" stroke="#7a9a78" strokeWidth={1.6}/>
            <path d={`M-20,${20} q8,-12 16,0 q8,8 14,-6 q8,-10 18,2`} stroke="#1f3a78" strokeWidth={2} fill="none" strokeDasharray={`${150 * chU} 200`}/>
            <path d="M-64,18 H-24" stroke="#7a9a78" strokeWidth={1.4}/>
          </g>
          <path d="M-60,50 H60 M-60,66 H44 M-60,82 H52" stroke="#c8baa0" strokeWidth={1.6}/>
        </g>
        {/* a clock beside it; the hands keep turning */}
        <g transform={`translate(${P3.x + 300} ${PY + 130})`}>
          <circle r={68} fill="#2a1a0c" opacity={0.2} transform="translate(4 8)"/>
          <circle r={64} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={3}/><circle r={54} fill="#fffaf0" stroke="#8a6a3a" strokeWidth={2}/>
          {Array.from({length: 12}, (_, i) => <path key={i} d={`M0,-48 V${i % 3 ? -42 : -38}`} stroke="#4a2f0a" strokeWidth={i % 3 ? 2 : 3.4} transform={`rotate(${i * 30})`}/>)}
          <path d="M0,4 V-34" stroke="#2a1a0c" strokeWidth={5} strokeLinecap="round" transform={`rotate(${clockA / 12})`}/>
          <path d="M0,6 V-46" stroke="#b32d24" strokeWidth={3} strokeLinecap="round" transform={`rotate(${clockA})`}/>
          <circle r={5} fill="#5a3c0a"/>
        </g>
        {/* the cheque's slow road to a bank */}
        <g transform={`translate(${P3.x + 300} ${PY + 330})`}>
          <BankIcon x={0} y={90} w={110} lit={chSlide * 0.6}/>
          <path d="M-150,-10 Q-80,-60 -20,20" stroke="#8a7a58" strokeWidth={3} strokeDasharray="4 10" fill="none" opacity={0.5}/>
          {chSlide > 0.01 && (() => { const q = arcP([-150, -10], [-14, 26], 44, chSlide); return <g transform={`translate(${q[0]} ${q[1]}) rotate(${-6 + chSlide * 12})`} opacity={clamp(1 - Math.max(0, chSlide - 0.9) * 10)}><rect x={-26} y={-16} width={52} height={32} rx={2} fill="#eaf3e4" stroke="#7a9a78" strokeWidth={1.6}/><rect x={-26} y={-16} width={52} height={8} fill="#2f7a56"/><path d="M-18,0 H18 M-18,8 H10" stroke="#7a9a78" strokeWidth={1.2}/></g>; })()}
        </g>
      </Panel>

      {/* ---- station 4: a PoS machine, a laptop for net banking, a phone with a QR code ---- */}
      <Panel i={3} lit={lit3} tone="cool">
        {/* PoS machine on a counter */}
        <rect x={P4.x + 12} y={PY + 330} width={P4.w - 24} height={18} rx={4} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.2}/>
        <rect x={P4.x + 18} y={PY + 348} width={P4.w - 36} height={PH - 360} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
        <g transform={`translate(${P4.x + 92} ${PY + 330})`}>
          <ellipse cx={0} cy={2} rx={58} ry={7} fill="#2a1808" opacity={0.3}/>
          <path d="M-46,0 L-38,-96 L38,-96 L46,0 Z" fill="#2e3541" stroke="#10151c" strokeWidth={2.4}/>
          <rect x={-32} y={-86} width={64} height={34} rx={4} fill={e1 > 0.05 ? "#1f9a5a" : "#10151c"} stroke="#6f808b" strokeWidth={1.6}/>
          {e1 > 0.4 && <path d="M-9,-69 L-2,-61 L11,-79" stroke="#eafff2" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>}
          {Array.from({length: 9}, (_, i) => <rect key={i} x={-28 + (i % 3) * 20} y={-44 + Math.floor(i / 3) * 13} width={16} height={9} rx={2} fill="#8a93a0"/>)}
          {posTap > 0.01 && <ellipse cx={0} cy={-100} rx={56} ry={34} fill="url(#g1-cool)" opacity={posTap}/>}
        </g>
        <Card x={P4.x + 92 + mixn(86, 6, posTap)} y={PY + 330 - 118 + mixn(30, 0, posTap)} rot={mixn(-24, -6, posTap)} s={0.74}/>
        {/* laptop: net banking */}
        <g transform={`translate(${P4.x + 262} ${PY + 330})`}>
          <ellipse cx={0} cy={2} rx={84} ry={8} fill="#2a1808" opacity={0.3}/>
          <path d="M-70,0 L-62,-12 L62,-12 L70,0 Z" fill="url(#f2-steel)" stroke="#6f808b" strokeWidth={2}/>
          <rect x={-58} y={-112} width={116} height={100} rx={7} fill="#2e3541" stroke="#10151c" strokeWidth={2.4}/>
          <rect x={-52} y={-106} width={104} height={88} rx={3} fill={e2 > 0.05 ? "url(#g1-screen)" : "#10151c"}/>
          {e2 > 0.05 && <g opacity={clamp(e2 * 3)}><rect x={-42} y={-96} width={84} height={12} rx={3} fill="#e8f4ff" opacity={0.85}/><rect x={-42} y={-78} width={50} height={8} rx={3} fill="#cfe8ff" opacity={0.7}/><rect x={-42} y={-64} width={84} height={26} rx={4} fill="#2f9a5a" opacity={0.9}/><path d="M-12,-50 L-4,-42 L12,-60" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={clamp((e2 - 0.4) * 3)}/></g>}
        </g>
        {/* phone with a QR code on its screen */}
        <g transform={`translate(${P4.x + 420} ${PY + 236}) rotate(-5)`}>
          <ellipse cx={0} cy={140} rx={64} ry={9} fill="#2a1808" opacity={0.22}/>
          {e3 > 0.02 && <ellipse cx={0} cy={0} rx={110} ry={140} fill="url(#g1-cool)" opacity={0.6 * Math.min(1, e3 * 3)}/>}
          <rect x={-62} y={-128} width={124} height={256} rx={18} fill="#1e222a" stroke="#4b5566" strokeWidth={3} filter="url(#g1-sh-s)"/>
          <rect x={-54} y={-118} width={108} height={236} rx={11} fill="#f4f7fb"/>
          <g transform="translate(-47 -100) scale(0.86)"><QRCard w={110} seed={5}/></g>
          <rect x={-40} y={80} width={80} height={12} rx={6} fill="#2f9a5a" opacity={0.9}/>
          {e3 > 0.02 && <rect x={-48} y={-100 + scan * 190} width={96} height={5} rx={2.5} fill="#3fd0ff" opacity={0.85}/>}
          <circle cx={0} cy={-122} r={2.4} fill="#0a0d12"/>
        </g>
        {e3 > 0.8 && <Badge x={P4.x + 470} y={PY + 52} ok s={0.9} a={ez(f, el + D3 * 0.9, 12)}/>}
      </Panel>
    </g>
  );
};

export const PayLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p;
  return (
    <>
      <P2Card cx={960} y={122} text={L.hm.text} f={f} at={L.hm.at} size={46} maxW={900}/>
      <P2Card cx={476} y={752} text={L.ca.text} f={f} at={L.ca.at} size={28} maxW={700} upper={false}/>
      <P2Card cx={1052} y={752} text={L.ch.text} f={f} at={L.ch.at} size={28} maxW={380} upper={false} tone="cool"/>
      <P2Card cx={1536} y={752} text={L.el.text} f={f} at={L.el.at} size={26} maxW={500} upper={false} tone="green"/>
    </>
  );
};
