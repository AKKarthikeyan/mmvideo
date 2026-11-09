// ECO-16 Part 3, builder G1: `upi-chain` (b14). Top left: a shop with a QR code card and a customer with a phone; top right: the code itself (qr). Along the bottom a four-box chain:
// PAYER'S APP -> PAYER'S BANK -> NPCI (a lock for the PIN check, nc) -> RECEIVER'S BANK, with a coin flowing along it. pa, pb, nc, rb light their box at their own key; the coin follows the
// boxes in chain order (keys sorted so the coin never jumps back). up is the title card, np a badge, qr the code. Generic card and bank icons only.
import React from "react";
import {SANS, SERIF, W, H, clamp, eio} from "../kit";
import {Adult, GDefs, E1Defs, F1Defs, Phone, QRCard, Coin, Awning, BankIcon, Badge, P2Card, elabs, armTo, handPos, ez, sm, pop, pulse, arcP, mixn, type Look, type Arms, type AP} from "./analogy_g1_kit";

const KEEPER: Look = {kind: "saree", accent: "#b8323f", shirt: ["#e8b84a", "#a5782e"], hair: "#1a120d", skin: 1, female: true};
const SHOPPER: Look = {kind: "plain", shirt: ["#6c8fb5", "#41607f"], pants: "#31405a", hair: "#1a120d", skin: 2, stache: true};
const half = (t: string): [string, string] => { const m = Math.floor(t.length / 2); let k = t.lastIndexOf(" ", m + 4); if (k < 3) k = t.indexOf(" ", m); return k > 0 ? [t.slice(0, k), t.slice(k + 1)] : [t, ""]; };
const BX = [175, 585, 995, 1405], BY = 668, BW = 340, BH = 222;

const Hub: React.FC<{lit: number; f: number}> = ({lit, f}) => (
  <g>
    {lit > 0.01 && <circle r={86} fill="url(#g1-spot)" opacity={lit * 0.8}/>}
    {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`rotate(${i * 60 + 18})`}><path d="M0,0 L60,0" stroke="#7d8da0" strokeWidth={4} opacity={0.8}/><circle cx={60} cy={0} r={9} fill="#dfe8f2" stroke="#5a6a80" strokeWidth={2.4}/></g>)}
    <circle r={30} fill="url(#g1-navy)" stroke="#10182c" strokeWidth={3}/><circle r={20} fill="none" stroke="#7ec0f0" strokeWidth={2} opacity={0.7}/>
  </g>
);

const Lock: React.FC<{closed: number; click: number}> = ({closed, click}) => (
  <g transform={`scale(${1 + click * 0.12})`}>
    <path d={`M-14,-12 V${-26 - (1 - closed) * 12} Q-14,${-44 - (1 - closed) * 12} 0,${-44 - (1 - closed) * 12} Q14,${-44 - (1 - closed) * 12} 14,${-26 - (1 - closed) * 12} V${-12 + (1 - closed) * -6}`} fill="none" stroke="#b9bfc8" strokeWidth={7} strokeLinecap="round"/>
    <rect x={-24} y={-14} width={48} height={38} rx={7} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2.4}/>
    <circle cx={0} cy={2} r={5.5} fill="#3d2a08"/><rect x={-2} y={4} width={4} height={11} rx={2} fill="#3d2a08"/>
    <rect x={-20} y={-10} width={14} height={4} rx={2} fill="#fff" opacity={0.4}/>
  </g>
);

export const UpiArt: React.FC<AP> = (p) => {
  const {f, dur, at} = p, L = elabs(p);
  const up = at("up"), qr = at("qr"), keys = ["pa", "pb", "nc", "rb"] as const;
  const raw = keys.map((k) => at(k));
  const t: number[] = [];
  raw.forEach((r, i) => t.push(i === 0 ? r : Math.max(r, t[i - 1] + 16)));
  const lit = raw.map((r) => ez(f, r, 20));
  // the coin follows the chain in order
  const ctr = BX.map((x) => [x + BW / 2, BY + 84] as [number, number]);
  let coin: [number, number] | null = null;
  if (f >= t[0] - 6) {
    coin = ctr[0];
    for (let i = 1; i < 4; i++) { const a = t[i] - 30, u = sm(f, a, 28); if (u > 0) coin = arcP(ctr[i - 1], ctr[i], 34, u); }
  }
  const coinGlow = coin ? 1 : 0;
  // arrows between boxes light with the next box
  const arrowLit = (i: number) => ez(f, t[i + 1] - 30, 20);
  // the shop: the customer lifts the phone to the code at qr
  const SXk = 410, CXk = 860, FY = 650;
  const lift = sm(f, qr - 20, 26), scan = ez(f, qr, 30);
  const cArms: Arms = {R: armTo(CXk, FY, 350, "R", [CXk - 104, 430], lift), L: [6, 14]};
  const ph = handPos(CXk, FY, 350, cArms, "R");
  const tap = pulse(f, qr + 30, 34);
  const nc = lit[2], lockClosed = ez(f, at("nc") + 6, 14), dots = clamp((f - (at("nc") + 10)) / 40), click = pulse(f, at("nc") + 18, 14);
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g1-wallcool)"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g1-wall)" opacity={0.55}/>
      {Array.from({length: 10}, (_, i) => <rect key={i} x={-30 + i * 200} y={-20} width={100} height={H} fill="#f6ecd0" opacity={0.2}/>)}
      {/* the market stall on the left */}
      <g>
        <rect x={70} y={258} width={11} height={392} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/><rect x={760} y={258} width={11} height={392} fill="#6a4a2c" stroke="#3a2412" strokeWidth={1.4}/>
        <Awning x={52} y={222} w={740} h={52} c1="#2a6fb8" c2="#fff4e0" n={10} f={f}/>
        <rect x={81} y={274} width={680} height={290} fill="#4a3320" opacity={0.18}/>
        {Array.from({length: 7}, (_, i) => <rect key={i} x={110 + i * 92} y={330 + (i % 2) * 8} width={60} height={46} rx={5} fill={["#e8b84a", "#c0603d", "#7fa58a", "#e8dcc4"][i % 4]} opacity={0.85}/>)}
        <rect x={81} y={380} width={680} height={8} fill="#8a5a30"/>
        <Adult x={SXk} y={FY + 18} h={360} f={f} seed={111} look={KEEPER} arms={{R: [8, 16], L: [10, 18]}} hands={{R: "open"}} lookX={0.6} smile={0.7}/>
        <rect x={60} y={560} width={720} height={24} rx={5} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2.4}/><rect x={60} y={560} width={720} height={5} fill="#fff" opacity={0.3}/>
        <rect x={70} y={584} width={700} height={FY - 584 + 18} fill="url(#e1-wood)" stroke="#3a2412" strokeWidth={2}/>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={86 + i * 172} y={596} width={150} height={40} rx={5} fill="none" stroke="#d9a468" strokeWidth={1.6} opacity={0.4}/>)}
        {/* the QR card standing on the counter */}
        <g transform="translate(612 420) scale(1.0)" filter="url(#g1-sh-s)">
          {scan > 0.01 && <rect x={-16} y={-14} width={146} height={186} rx={20} fill="#9fe0ff" opacity={0.5 * scan * (0.6 + 0.4 * Math.sin(f / 5))} filter="url(#ak-blur8)"/>}
          <QRCard w={110} seed={9}/><path d="M30,142 L22,160 M80,142 L88,160" stroke="#6a4a2c" strokeWidth={5} strokeLinecap="round"/>
        </g>
        <Adult x={CXk} y={FY} h={350} f={f} seed={112} look={SHOPPER} arms={cArms} hands={{R: "fist"}} lookX={-0.6} smile={0.5}
          held={{R: <g transform="translate(-1 -3) rotate(14)"><Phone s={0.15} screen={scan > 0.5 ? "pay" : "idle"} glow={tap}/></g>}}/>
        {tap > 0.02 && <g transform={`translate(${ph[0] - 40} ${ph[1] - 14})`}><circle r={16 + 70 * (1 - tap)} fill="none" stroke="#9fe0ff" strokeWidth={4} opacity={0.7 * tap}/></g>}
      </g>
      {/* the code, large, with a phone-number chip, on the right */}
      {qr - 1 < f && (
        <g opacity={ez(f, qr, 16)} transform={`translate(0 ${(1 - ez(f, qr, 16)) * 24})`}>
          <g transform="translate(1330 224) scale(1.7)" filter="url(#g1-sh)"><QRCard w={110} seed={9}/></g>
          <g transform="translate(1690 330)">
            <g filter="url(#g1-sh-s)"><rect x={-70} y={-120} width={140} height={240} rx={20} fill="#1e222a" stroke="#4b5566" strokeWidth={3}/><rect x={-61} y={-108} width={122} height={216} rx={12} fill="#f4f7fb"/></g>
            {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-40 + c * 28} y={-30 + r * 28} width={22} height={22} rx={6} fill="#dfe8f2" stroke="#9fb2c6" strokeWidth={1.4}/>))}
            <path d="M-40,-60 h80" stroke="#9fb2c6" strokeWidth={4} strokeDasharray="14 8" strokeLinecap="round"/>
            <path d="M-26,-76 h52" stroke="#9fb2c6" strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round"/>
          </g>
        </g>
      )}
      {/* the chain */}
      {BX.map((x, i) => i < 3 && (
        <g key={`a${i}`} opacity={0.35 + 0.65 * arrowLit(i)}>
          <path d={`M${x + BW + 8},${BY + 84} H${BX[i + 1] - 10}`} stroke={arrowLit(i) > 0.5 ? "#d8682a" : "#8a7a58"} strokeWidth={7} strokeLinecap="round" strokeDasharray={arrowLit(i) > 0.5 ? undefined : "4 12"}/>
          <path d={`M${BX[i + 1] - 8},${BY + 84} l-20,-14 v28 z`} fill={arrowLit(i) > 0.5 ? "#d8682a" : "#8a7a58"}/>
        </g>
      ))}
      {BX.map((x, i) => {
        const a = 0.42 + 0.58 * lit[i];
        const title = i === 0 ? L.pa.text : i === 1 ? L.pb.text : i === 2 ? "NPCI" : L.rb.text;
        return (
          <g key={i} transform={`translate(${x} ${BY - lit[i] * 8})`}>
            <rect x={-2} y={14} width={BW + 4} height={BH} rx={22} fill="#1c1006" opacity={0.26 * a} filter="url(#ak-blur22)"/>
            <rect x={0} y={0} width={BW} height={BH} rx={20} fill="url(#f1-paper)" stroke="url(#f1-brass)" strokeWidth={6} opacity={a}/>
            {lit[i] > 0.01 && <rect x={0} y={0} width={BW} height={BH} rx={20} fill="none" stroke="#ffd37a" strokeWidth={4} opacity={lit[i] * (0.6 + 0.4 * Math.sin(f / 8))}/>}
            <g transform={`translate(${BW / 2} 96)`} opacity={a}>
              {i === 0 && <g transform="scale(1.5)"><Phone s={1} screen="pay" glow={lit[0] * 0.5}/></g>}
              {(i === 1 || i === 3) && <g transform="translate(0 36)"><BankIcon x={0} y={0} w={150} lit={lit[i] * 0.7} tone={i === 1 ? "#dccfb3" : "#d8e4d0"}/></g>}
              {i === 2 && <g><Hub lit={nc * 0.7} f={f}/><g transform="translate(0 4)"><Lock closed={lockClosed} click={click}/></g></g>}
            </g>
            <text x={BW / 2} y={BH - 24} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={title.length > 14 ? 25 : 30} letterSpacing="0.1em" fill="#5e2a0e" opacity={a}>{title.toUpperCase()}</text>
          </g>
        );
      })}
      {/* NPCI: PIN dots and the tick */}
      {raw[2] - 1 < f && (
        <g transform={`translate(${BX[2] + 62} ${BY + 34})`}>
          {[0, 1, 2, 3].map((i) => <circle key={i} cx={-33 + i * 20} cy={0} r={5.5} fill={dots * 4.01 > i ? "#173b66" : "none"} stroke="#173b66" strokeWidth={2}/>)}
          <Badge x={BW - 124} y={0} ok s={0.5} a={ez(f, at("nc") + 50, 12)}/>
        </g>
      )}
      {/* the coin */}
      {coin && <g transform={`translate(${coin[0]} ${coin[1] - 34})`} opacity={clamp((f - (t[0] - 6)) / 10)}><Coin s={0.7} f={f} glow={0.6}/></g>}
      {/* the NPCI check as a caption tag above its box */}
      {f > raw[2] && (
        <g transform={`translate(${BX[2] + BW / 2} ${BY - 40 - (1 - lit[2]) * 10})`} opacity={lit[2]} filter="url(#g1-sh-s)">
          <rect x={-190} y={-34} width={380} height={64} rx={14} fill="#fff7e4" stroke="#b58a52" strokeWidth={2}/>
          <path d="M-12,30 L0,44 L12,30 Z" fill="#fff7e4" stroke="#b58a52" strokeWidth={2}/><rect x={-14} y={28} width={28} height={4} fill="#fff7e4"/>
          <text x={0} y={-6} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={22} fill="#5e2a0e">{half(L.nc.text)[0]}</text>
          <text x={0} y={20} textAnchor="middle" fontFamily={SERIF} fontWeight={600} fontSize={22} fill="#5e2a0e">{half(L.nc.text)[1]}</text>
        </g>
      )}
    </g>
  );
};

export const UpiLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p;
  return (
    <>
      <P2Card cx={520} y={118} text={L.up.text} f={f} at={L.up.at} size={42} maxW={820} upper={false}/>
      <P2Card cx={1330} y={118} text={L.np.text} f={f} at={L.np.at} size={32} maxW={520} upper={false} tone="cool"/>
      <P2Card cx={1560} y={534} text={L.qr.text} f={f} at={L.qr.at} size={28} maxW={480} upper={false} tone="green"/>
    </>
  );
};
