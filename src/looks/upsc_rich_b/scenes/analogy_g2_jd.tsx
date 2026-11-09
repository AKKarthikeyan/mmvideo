// ECO-16 Part 3, builder G2: `jan-dhan` (b10; ref e16_jd). A row of passbooks that grows into a wall (the number of blocks is illustrative: the `ac` card says how many accounts there are), and two split bars:
// the women's share of account holders (value `women`) and the rural and semi-urban share of accounts (value `rural`). Fills are read from the table. No flags, no leaders, no faces: pictograms only.
import React from "react";
import {Hall, F3Defs, G2Defs, FCard, Pictogram, Tag, Shade, E, Z, pop, pulse, fv, ft, elabs, SANS, SERIF} from "./analogy_g2_kit";
import {House} from "./analogy_f1_kit";
import type {AP} from "./analogy_kit";

const COLS = 12, ROWS = 6, BW = 62, BH = 84, GX = 70, GY = 92, X0 = 128, BASE = 786;
const CARD = {x: 1060, y: 196, w: 750, h: 596};
const BAR = {x: 1112, w: 646, h: 84};

const TONES: [string, string, string][] = [["#4f86c6", "#2a5a96", "#f0d78c"], ["#2fa3a8", "#176a7c", "#f6e6b0"], ["#a8506a", "#6e2a44", "#f6dca0"], ["#7f9a4a", "#4b6428", "#f2e2a8"]];

const Book: React.FC<{x: number; y: number; k: number; tone: number; glow: number}> = ({x, y, k, tone, glow}) => {
  if (k <= 0.002) return null;
  const T = TONES[tone % 4], d = 8;
  return (
    <g transform={`translate(${x} ${y - (1 - k) * 46}) scale(${0.7 + 0.3 * k})`} opacity={Math.min(1, k * 2.2)}>
      <rect x={-BW / 2 + 3} y={-BH + 5} width={BW} height={BH} rx={4} fill="#2a1808" opacity={0.28}/>
      <polygon points={`${BW / 2},${-BH} ${BW / 2 + d},${-BH - d * 0.6} ${BW / 2 + d},${-d * 0.6} ${BW / 2},0`} fill={T[1]} opacity={0.9}/>
      <polygon points={`${-BW / 2},${-BH} ${BW / 2},${-BH} ${BW / 2 + d},${-BH - d * 0.6} ${-BW / 2 + d},${-BH - d * 0.6}`} fill="#f6efe0" stroke={T[1]} strokeWidth={1.2}/>
      <rect x={-BW / 2} y={-BH} width={BW} height={BH} rx={4} fill={T[0]} stroke={T[1]} strokeWidth={2}/>
      <rect x={-BW / 2} y={-BH} width={BW * 0.1} height={BH} fill="#000" opacity={0.22}/>
      <rect x={-BW / 2 + BW * 0.2} y={-BH + 12} width={BW * 0.62} height={20} rx={3} fill={T[2]} opacity={0.9}/>
      <path d={`M${-BW / 2 + BW * 0.2},${-BH + 44} h${BW * 0.62} M${-BW / 2 + BW * 0.2},${-BH + 54} h${BW * 0.4}`} stroke={T[2]} strokeWidth={3} strokeLinecap="round" opacity={0.7}/>
      <path d={`M${-BW / 2 + 6},${-BH + 4} L${BW / 2 - 6},${-BH + 4}`} stroke="#fff" strokeWidth={2} opacity={0.35}/>
      {glow > 0.01 && <rect x={-BW / 2} y={-BH} width={BW} height={BH} rx={4} fill="#fff1b0" opacity={0.5 * glow}/>}
    </g>
  );
};

const SplitBar: React.FC<{id: string; y: number; value: number; a: number; fill: string; edge: string; unit: string; text: string; icons: React.ReactNode; f: number; start: number; restIcons: React.ReactNode}> =
  ({id, y, value, a, fill, edge, unit, text, icons, f, start, restIcons}) => {
  const k = E(f, start, 44), wF = (BAR.w * value) / 100 * k;
  const gx = BAR.x;
  return (
    <g opacity={a} transform={`translate(0 ${(1 - a) * 24})`}>
      <ellipse cx={gx + BAR.w / 2} cy={y + BAR.h + 14} rx={BAR.w * 0.52} ry={11} fill="#2a1808" opacity={0.26} filter="url(#ak-blur8)"/>
      <rect x={gx} y={y} width={BAR.w} height={BAR.h} rx={14} fill="#efe4c8" stroke="#a8864c" strokeWidth={2.4}/>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={fill}/><stop offset="1" stopColor={edge}/></linearGradient>
        <clipPath id={`${id}-c`}><rect x={gx} y={y} width={BAR.w} height={BAR.h} rx={14}/></clipPath>
      </defs>
      <g clipPath={`url(#${id}-c)`}>
        <rect x={gx} y={y} width={Math.max(0.1, wF)} height={BAR.h} fill={`url(#${id}-g)`}/>
        <rect x={gx} y={y} width={Math.max(0.1, wF)} height={BAR.h * 0.22} fill="#fff" opacity={0.22}/>
        {wF > 4 && <path d={`M${gx + wF},${y} V${y + BAR.h}`} stroke="#fff" strokeWidth={3} opacity={0.8}/>}
      </g>
      {Array.from({length: 11}, (_, i) => <path key={i} d={`M${gx + (BAR.w * i) / 10},${y + BAR.h} v${i % 5 === 0 ? 14 : 8}`} stroke="#6a5538" strokeWidth={i % 5 === 0 ? 3 : 2} strokeLinecap="round" opacity={0.65}/>)}
      <rect x={gx} y={y} width={BAR.w} height={BAR.h} rx={14} fill="none" stroke={edge} strokeWidth={2.4} opacity={0.8}/>
      {k > 0.5 && <text x={gx + Math.max(120, wF / 2)} y={y + BAR.h / 2 + 22} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={66} fill="#fffaf0" stroke={edge} strokeWidth={2} paintOrder="stroke" opacity={Math.min(1, (k - 0.5) * 4)}>{text}{unit}</text>}
      {/* pictograms above the filled part and above the rest */}
      <g opacity={Math.min(1, k * 3)}>
        <g transform={`translate(${gx + Math.max(60, wF / 2)} ${y - 10})`}>{icons}</g>
        <g transform={`translate(${gx + wF + Math.max(0, (BAR.w - wF) / 2)} ${y - 10})`} opacity={wF > 4 ? 1 : 0}>{restIcons}</g>
      </g>
    </g>
  );
};

export const JanDhanArt: React.FC<AP> = (p) => {
  const {f} = p, L = elabs(p);
  const women = fv("e16_jd", "women"), rural = fv("e16_jd", "rural");
  const a0 = Z(f, 0, 30), cardA = Z(f, L.pm.at - 10, 26);
  // the wall: bottom row first, left to right; done a little after the accounts card
  const N = COLS * ROWS, t0 = 22, t1 = Math.max(t0 + 60, L.ac.at + 6);
  const sweep = Z(f, L.ac.at, 40) * (1 - Z(f, L.ac.at + 40, 40));
  const books = Array.from({length: N}, (_, i) => {
    const r = Math.floor(i / COLS), c = i % COLS, st = t0 + ((t1 - t0 - 14) * i) / N, k = pop(f, st, 14);
    const gl = sweep * Math.max(0, 1 - Math.abs((c / COLS) * 1 - Z(f, L.ac.at, 50) * 1.2 + 0.1) * 3);
    return <Book key={i} x={X0 + c * GX + (r % 2) * 6} y={BASE - r * GY} k={k} tone={(c * 3 + r * 5 + ((i * 7) % 3)) % 4} glow={gl}/>;
  });
  const pulseK = 1 + 0.01 * pulse(f, L.ac.at, 30);
  return (
    <g>
      <F3Defs/><G2Defs/>
      <Hall f={f} deskY={790} id="g2jd" tone="warm" winX={[330, 1210, 1700]}/>
      {/* the wall of passbooks on the counter */}
      <g opacity={a0}>
        <ellipse cx={X0 + (COLS * GX) / 2} cy={BASE + 10} rx={COLS * GX * 0.56} ry={16} fill="#2a1808" opacity={0.34} filter="url(#ak-blur8)"/>
        <g transform={`translate(${X0 + (COLS * GX) / 2} ${BASE}) scale(${pulseK}) translate(${-(X0 + (COLS * GX) / 2)} ${-BASE})`}>{books}</g>
      </g>
      {/* the two split bars on a paper board */}
      <g opacity={cardA} transform={`translate(0 ${(1 - cardA) * 40})`}>
        <rect x={CARD.x + 14} y={CARD.y + 26} width={CARD.w} height={CARD.h} rx={16} fill="#2a1808" opacity={0.34} filter="url(#e3-glow)"/>
        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={CARD.h} rx={16} fill="url(#g2-sheet)" stroke="#bda46c" strokeWidth={2.4}/>
        <rect x={CARD.x} y={CARD.y} width={CARD.w} height={14} rx={7} fill="#2fa3a8" opacity={0.9}/>
        {Array.from({length: 6}, (_, i) => <path key={i} d={`M${CARD.x + 20},${CARD.y + 60 + i * 96} H${CARD.x + CARD.w - 20}`} stroke="#9cb6c8" strokeWidth={1.2} opacity={0.3}/>)}
      </g>
      <SplitBar id="g2jw" y={304} value={women} a={cardA} fill="#c28ad2" edge="#6a3a80" unit="%" text={ft("e16_jd", "women", 1)} f={f} start={L.wm.at + 4}
        icons={<><Pictogram x={-34} y={0} h={74} fill="#a8506a" woman/><Pictogram x={34} y={0} h={74} fill="#a8506a" woman/></>}
        restIcons={<><Pictogram x={0} y={0} h={74} fill="#9aa6b2"/></>}/>
      <SplitBar id="g2jr" y={612} value={rural} a={cardA} fill="#8fcf7a" edge="#3f7a32" unit="%" text={ft("e16_jd", "rural", 1)} f={f} start={L.ru.at + 4}
        icons={<><g transform="translate(-52 0)"><House x={-44} y={0} w={56} h={38} wall="#e8cf9f" roof="#b4562e"/></g><g transform="translate(24 0)"><House x={-16} y={0} w={50} h={34} wall="#d9b08a" roof="#9a4228"/></g></>}
        restIcons={<g>{[[-30, 52, "#8aa0c0"], [8, 70, "#6c86ae"], [44, 46, "#9fb2cf"]].map(([dx, h, c], i) => <rect key={i} x={Number(dx) - 12} y={-Number(h) * 0.9} width={24} height={Number(h) * 0.9} fill={String(c)} stroke="#3f5a82" strokeWidth={1.6}/>)}</g>}/>
      <Tag x={X0 + COLS * GX - 150} y={216} text="BLOCKS ARE ILLUSTRATIVE" a={Z(f, L.ac.at + 20, 20)} size={20} fill="#fff7e4" ink="#7a5a20" edge="#b58a52"/>
    </g>
  );
};

export const JanDhanLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <FCard cx={960} y={62} text={L.pm.text} f={p.f} at={L.pm.at} size={40} maxW={1300} tone="dark"/>
      <FCard cx={X0 + (COLS * GX) / 2} y={800} text={L.ac.text} f={p.f} at={L.ac.at} size={36} maxW={800} upper={false}/>
      <FCard cx={CARD.x + CARD.w / 2} y={406} text={L.wm.text} f={p.f} at={L.wm.at} size={28} maxW={690} upper={false}/>
      <FCard cx={CARD.x + CARD.w / 2} y={702} text={L.ru.text} f={p.f} at={L.ru.at} size={28} maxW={690} upper={false} tone="green"/>
      <FCard cx={CARD.x + CARD.w / 2} y={818} text={L.mf.text} f={p.f} at={L.mf.at} size={24} maxW={700} upper={false} tone="cool"/>
    </>
  );
};
export {Shade, SANS};
