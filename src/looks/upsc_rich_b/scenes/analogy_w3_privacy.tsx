// POL-03 Part 2, builder W3: `privacy-search`. A search box is typed with the word "privacy" over the Constitution's pages and finds nothing; then nine empty chairs rise on a bench
// (the nine judges). Motion follows f and at(key) only. The typed word is the scene's one word; no figure is typed here (counts come from the labels).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio, rng} from "../kit";
import {prog, type AP} from "./analogy_kit";
import {P2Card, rlabs} from "./analogy_p2b_kit";
import {W3Defs, Motes, Chair} from "./analogy_w3_kit";

const WORD = "privacy";

export const PrivacyArt: React.FC<AP> = (p) => {
  const {f} = p, T = (k: string) => { try { return p.at(k); } catch { return 1e9; } };
  const z = T("z"), nj = T("nj");
  const typed = Math.floor(clamp((f - 14) / Math.max(20, z - 40)) * (WORD.length + 0.99));
  const word = WORD.slice(0, Math.min(WORD.length, typed)), caret = f % 30 < 18 && typed < WORD.length + 1;
  const res = eo(prog(f, z - 8, 22)), shake = Math.sin(Math.max(0, f - z) * 1.1) * 4 * (1 - eo(prog(f, z, 20)));
  const rise = eio(prog(f, nj - 60, 50));
  const bk = 1 - 0.0 * rise;
  const sweep = ((f * 2.2) % 900) - 100;
  const scan = f > 40 && f < z ? 1 : 0;
  return (
    <g>
      <W3Defs/>
      <defs><linearGradient id="w3-lib3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eadcc0"/><stop offset="1" stopColor="#d2bb8f"/></linearGradient></defs>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w3-lib3)"/>
      <Motes f={f} x0={100} x1={1800} y0={160} y1={900} n={26} seed={4}/>
      {/* the Constitution: an open book of dense text */}
      <g transform="translate(960 190)">
        <ellipse cx={0} cy={406} rx={620} ry={16} fill="#1a0e04" opacity={0.25}/>
        <rect x={-600} y={30} width={1200} height={372} rx={10} fill="url(#w3-leather)" stroke="#3a1008" strokeWidth={3}/>
        <path d="M-576,382 V40 Q-290,18 0,48 Q290,18 576,40 V382 Q290,360 0,386 Q-290,360 -576,382 Z" fill="url(#w3-paper)" stroke="#a88a58" strokeWidth={2}/>
        <path d="M0,48 V386" stroke="#8a6a38" strokeWidth={4} opacity={0.6}/>
        {[-1, 1].map((sd) => Array.from({length: 17}, (_, i) => { const g = rng(i * 11 + (sd > 0 ? 5 : 2)); return <rect key={`${sd}${i}`} x={sd > 0 ? 36 : -534} y={78 + i * 17} width={500 * (0.78 + g() * 0.22)} height={6} rx={3} fill="#b8a882" opacity={0.85}/>; }))}
        <rect x={36} y={66} width={260} height={8} rx={4} fill="#8a6a38" opacity={0.0}/>
        {scan > 0 && <rect x={-576 + sweep} y={40} width={90} height={344} fill="#fff6d0" opacity={0.28}/>}
      </g>
      {/* the search box */}
      <g transform={`translate(${960 + shake} 302)`} opacity={bk}>
        <rect x={-380} y={-40} width={760} height={80} rx={40} fill="#fff" stroke="#2d7fd2" strokeWidth={4} style={{filter: "drop-shadow(0 12px 14px rgba(40,22,8,.35))"}}/>
        <g transform="translate(-336 0)"><circle cx={0} cy={-3} r={15} fill="none" stroke="#2d7fd2" strokeWidth={6}/><path d="M11,8 L26,23" stroke="#2d7fd2" strokeWidth={7} strokeLinecap="round"/></g>
        <text x={-290} y={14} fontFamily={SANS} fontWeight={600} fontSize={44} fill="#222831" letterSpacing="0.02em">{word}{caret ? "|" : ""}</text>
      </g>
      {/* an empty results panel: a magnifier with nothing in it */}
      {res > 0.01 && (
        <g transform={`translate(960 ${392 + (1 - res) * 18})`} opacity={res}>
          <rect x={-380} y={0} width={760} height={150} rx={18} fill="#fffaf0" stroke="#b8a074" strokeWidth={2.4} style={{filter: "drop-shadow(0 14px 16px rgba(40,22,8,.3))"}}/>
          <g transform="translate(0 70)"><circle r={36} fill="#fffdf6" stroke="#9aa0ab" strokeWidth={7}/><path d="M26,28 L52,54" stroke="#9aa0ab" strokeWidth={9} strokeLinecap="round"/><path d="M-14,-6 H14 M-14,8 H6" stroke="#cfc6b2" strokeWidth={5} strokeLinecap="round"/></g>
          {[-280, 280].map((x) => <g key={x}>{[0, 1].map((r) => <rect key={r} x={x - 70} y={46 + r * 28} width={140 - r * 40} height={9} rx={4.5} fill="#e3dac4"/>)}</g>)}
        </g>
      )}
      {/* the bench of nine empty chairs rises from below */}
      {rise > 0.01 && (
        <g transform={`translate(0 ${(1 - rise) * 240})`} opacity={rise}>
          <rect x={250} y={868} width={1060} height={22} rx={8} fill="url(#w3-wood)" stroke="#4e2f18" strokeWidth={3}/>
          <rect x={250} y={868} width={1060} height={6} fill="#f2d49a" opacity={0.55}/>
          {Array.from({length: 9}, (_, i) => <Chair key={i} x={310 + i * 117} y={868} s={0.76} glow={eo(prog(f, nj - 30 + i * 5, 22)) * 0.5 * (0.7 + 0.3 * Math.sin(f / 11 + i))}/>)}
        </g>
      )}
    </g>
  );
};

export const PrivacyLabels: React.FC<AP> = (p) => {
  const L = rlabs(p);
  return (
    <>
      {L[2] && <P2Card cx={960} y={70} text={L[2].text} f={p.f} at={L[2].at} size={42} maxW={1400}/>}
      {L[0] && <P2Card cx={960} y={556} text={L[0].text} f={p.f} at={L[0].at} size={36} maxW={900} upper={false}/>}
      {L[1] && <P2Card cx={1600} y={720} text={L[1].text} f={p.f} at={L[1].at} size={30} maxW={420} upper={false}/>}
    </>
  );
};
