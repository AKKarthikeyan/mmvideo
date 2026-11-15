// POL-03 Part 1, builder W2 (c): `mandal-desk`, `vacancy-bar` (modes half / ews), `sc-tree`. Motion depends only on f, dur and at(key).
import React from "react";
import {SANS, SERIF, W, H, clamp, eo, eio} from "../kit";
import {Cloud, Hills, Sun, Person, prog, type AP} from "./analogy_kit";
import {P2Card} from "./analogy_p2b_kit";
import {WDefs, lk, a01, sm, Wall, Desk, Plaque, Sheet, Chair, Cross, Tick} from "./analogy_w2_kit";

// ---- mandal-desk ---------------------------------------------------------------------------------------------------------------
const Report: React.FC<{x: number; y: number; a: number}> = ({x, y, a}) => (
  <g transform={`translate(${x} ${y - (1 - a) * 60}) rotate(-2)`} opacity={clamp(a * 2)} filter="url(#w2-shadow)">
    <rect x={-132} y={-300} width={264} height={300} rx={6} fill="#e8dcc0" stroke="#a8946a" strokeWidth={2}/><rect x={-126} y={-12} width={252} height={12} fill="#cfc09a"/>
    {[0, 1, 2].map((i) => <rect key={i} x={-134 + i * 2} y={-306 + i * 2} width={264} height={300} rx={6} fill="#f6efdc" stroke="#bda57a" strokeWidth={1.2}/>)}
    <rect x={-138} y={-312} width={264} height={306} rx={6} fill="#2f4a7a" stroke="#1b2f54" strokeWidth={3}/>
    <rect x={-138} y={-312} width={26} height={306} fill="#233a63"/>
    <rect x={-92} y={-262} width={190} height={14} rx={3} fill="#f0c860"/><rect x={-92} y={-232} width={150} height={10} rx={3} fill="#f0c860" opacity={0.8}/>
    <rect x={-92} y={-120} width={190} height={5} rx={2} fill="#f0c860" opacity={0.6}/><rect x={-92} y={-104} width={130} height={5} rx={2} fill="#f0c860" opacity={0.6}/>
    <path d="M60,-312 L60,-190 L82,-208 L104,-190 L104,-312 Z" fill="#c0352b" stroke="#7a1c14" strokeWidth={2}/>
    <rect x={-138} y={-312} width={264} height={10} rx={4} fill="#fff" opacity={0.2}/>
  </g>
);
const OrderStamp: React.FC<{x: number; y: number; a: number; f: number; t: number}> = ({x, y, a, f, t}) => {
  const slam = sm(f, t + 2, 20), up = sm(f, t + 24, 22), hand = f < t ? -300 : -300 * (1 - slam) * (1 - up) - 300 * up + 0, ink = clamp((f - t - 20) / 6);
  const sy = f < t ? -400 : (f < t + 22 ? (1 - slam) * -330 : -up * 330 - 0);
  return (
    <g>
      <g transform={`translate(${x} ${y}) rotate(-3)`} opacity={clamp(a * 2)} filter="url(#w2-shadow)">
        <rect x={-150} y={-190} width={300} height={380} rx={5} fill="url(#w2-paper)" stroke="#bda57a" strokeWidth={2}/>
        <rect x={-120} y={-160} width={240} height={26} rx={4} fill="#8c2a1c" opacity={0.9}/>
        {Array.from({length: 9}, (_, i) => <rect key={i} x={-120} y={-100 + i * 22} width={240 * (i % 4 === 3 ? 0.55 : 1)} height={6} rx={3} fill="#8a7a5a" opacity={0.5}/>)}
        <g transform="translate(40 110)" opacity={ink}>
          <circle r={74} fill="none" stroke="#c0352b" strokeWidth={7} opacity={0.82}/><circle r={60} fill="none" stroke="#c0352b" strokeWidth={2.6} opacity={0.82}/>
          <rect x={-46} y={-10} width={92} height={20} fill="#c0352b" opacity={0.78}/>
          <text x={0} y={7} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={19} letterSpacing="0.2em" fill="#fffaf0">ORDER</text>
          <path d="M-40,-38 Q0,-52 40,-38 M-40,38 Q0,52 40,38" stroke="#c0352b" strokeWidth={3} fill="none" opacity={0.8}/>
        </g>
        {/* the stamp, coming down and lifting */}
        {f >= t - 2 && f < t + 52 && (
          <g transform={`translate(40 ${110 + sy})`}>
            <ellipse cx={0} cy={30} rx={68} ry={10} fill="#2a1808" opacity={0.25 * (1 - Math.abs(sy) / 330)}/>
            <rect x={-54} y={-20} width={108} height={28} rx={6} fill="#7a4a24" stroke="#4f2f17" strokeWidth={2.4}/>
            <rect x={-14} y={-130} width={28} height={112} rx={9} fill="#8a5a2a" stroke="#4f2f17" strokeWidth={2.4}/><ellipse cx={0} cy={-136} rx={30} ry={20} fill="#9a6a34" stroke="#4f2f17" strokeWidth={2.4}/>
          </g>
        )}
      </g>
    </g>
  );
};
const Pyramid: React.FC<{x: number; y: number; a: number; f: number; tCl: number}> = ({x, y, a, f, tCl}) => {
  const gray = sm(f, tCl, 24), tiers = [{n: 1, c: ["#e9c04a", "#b8902a"]}, {n: 2, c: ["#7fa58a", "#4d7358"]}, {n: 3, c: ["#6f9fb5", "#3f6e84"]}, {n: 4, c: ["#b8456a", "#7a2240"]}];
  return (
    <g transform={`translate(${x} ${y - (1 - a) * 60})`} opacity={clamp(a * 2)}>
      <g filter="url(#w2-shadow)"><rect x={-190} y={-380} width={380} height={400} rx={12} fill="#fbf3dd" stroke="#b8a074" strokeWidth={3}/></g>
      <rect x={-170} y={-360} width={340} height={14} rx={4} fill="#2f78b8" opacity={0.85}/>
      <path d="M-120,20 L-150,120 M120,20 L150,120" stroke="#6b4a2c" strokeWidth={9} strokeLinecap="round"/>
      {tiers.map((t, i) => {
        const w = 76 + i * 72, ty = -300 + i * 78, topT = i === 0, g = topT ? gray : 0;
        return (
          <g key={i}>
            <rect x={-w / 2} y={ty} width={w} height={70} rx={8} fill={g > 0.01 ? "#b9b4a8" : t.c[0]} stroke={t.c[1]} strokeWidth={3} opacity={g > 0.01 ? 0.5 + 0.5 * (1 - g) : 1}/>
            {Array.from({length: t.n}, (_, k) => <Person key={k} x={(k - (t.n - 1) / 2) * 56} y={ty + 66} h={58} f={f} seed={i * 9 + k + 31} op={topT ? 1 - 0.65 * g : 1}/>)}
            {topT && g > 0.01 && (
              <g opacity={g}>
                <rect x={-w / 2} y={ty} width={w} height={70} rx={8} fill="#6d6a62" opacity={0.45}/>
                {Array.from({length: 7}, (_, k) => <path key={k} d={`M${-w / 2 + k * 14},${ty + 70} L${-w / 2 + k * 14 + 40},${ty}`} stroke="#4a4840" strokeWidth={2.4} opacity={0.5}/>)}
                <rect x={-w / 2 - 6} y={ty - 6} width={w + 12} height={82} rx={11} fill="none" stroke="#c0352b" strokeWidth={4} strokeDasharray="10 8"/>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
const BrassCourt: React.FC<{x: number; y: number; a: number}> = ({x, y, a}) => (
  <g transform={`translate(${x} ${y - (1 - a) * 60})`} opacity={clamp(a * 2)}>
    <ellipse cx={0} cy={6} rx={190} ry={16} fill="#2a1808" opacity={0.3}/>
    <path d="M-170,0 L-150,-70 L150,-70 L170,0 Z" fill="url(#w2-wood)" stroke="#4f2f17" strokeWidth={3}/><rect x={-150} y={-76} width={300} height={10} fill="#ecd09a" opacity={0.7}/>
    <g transform="translate(0 -190)"><Plaque x={0} y={0} w={300} h={100} text="THE COURT" size={30}/></g>
    <rect x={-8} y={-140} width={16} height={70} fill="#7a5a1c"/>
    <g transform="translate(-110 -90) rotate(-20)"><rect x={-4} y={-4} width={86} height={9} rx={4} fill="#8a5a2a" stroke="#4f2f17" strokeWidth={2}/><rect x={-26} y={-18} width={44} height={34} rx={8} fill="#a8703a" stroke="#4f2f17" strokeWidth={2.4}/></g>
  </g>
);
export const MandalDeskArt: React.FC<AP> = (p) => {
  const {f} = p, L = lk(p), tMr = L.mr ? L.mr.at : 20, tC27 = L.c27 ? L.c27.at : 200, tIs = L.is ? L.is.at : 400, tCl = L.cl ? L.cl.at : 560;
  return (
    <g>
      <WDefs/>
      <Wall y1={560}/>
      <Desk y0={560}/>
      <rect x={0} y={560} width={W} height={H - 560} fill="#fff6d8" opacity={0.05}/>
      <Report x={330} y={800} a={a01(f, tMr - 4, 24)}/>
      <OrderStamp x={770} y={620} a={a01(f, tC27 - 4, 22)} f={f} t={tC27 + 14}/>
      <BrassCourt x={1190} y={800} a={a01(f, tIs - 4, 24)}/>
      <Pyramid x={1610} y={760} a={a01(f, tCl - 80, 24)} f={f} tCl={tCl}/>
    </g>
  );
};
export const MandalDeskLabels: React.FC<AP> = (p) => {
  const L = lk(p);
  return (
    <>
      {L.mr && <P2Card cx={330} y={120} text={L.mr.text} f={p.f} at={L.mr.at} size={28} maxW={380}/>}
      {L.c27 && <P2Card cx={750} y={120} text={L.c27.text} f={p.f} at={L.c27.at} size={28} maxW={380} upper={false}/>}
      {L.is && <P2Card cx={1200} y={120} text={L.is.text} f={p.f} at={L.is.at} size={28} maxW={380} upper={false}/>}
      {L.cl && <P2Card cx={1610} y={86} text={L.cl.text} f={p.f} at={L.cl.at} size={28} maxW={340}/>}
    </>
  );
};

// ---- vacancy-bar ---------------------------------------------------------------------------------------------------------------
const BX0 = 160, BW = 1600, BY = 440, BH = 110, HALF = BX0 + BW / 2;
const part = (n: number) => (BW * n) / 100;
const BLOCKS: {n: number; c: [string, string]; t: string}[] = [{n: 15, c: ["#4a90d0", "#1f5a96"], t: "SC"}, {n: 7.5, c: ["#4cb064", "#1f7a3a"], t: "ST"}, {n: 27, c: ["#f0b04a", "#b86e14"], t: "OBC"}];
const Block: React.FC<{x: number; y: number; w: number; h: number; c: [string, string]; t?: string; a?: number; dash?: boolean}> = ({x, y, w, h, c, t, a = 1, dash}) => (
  <g opacity={a}>
    <rect x={x} y={y} width={w} height={h} rx={9} fill={c[0]} stroke={c[1]} strokeWidth={3.4} strokeDasharray={dash ? "10 7" : undefined}/>
    <rect x={x + 4} y={y + 4} width={Math.max(0, w - 8)} height={h * 0.28} rx={6} fill="#fff" opacity={0.28}/>
    {t && w > 70 && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={34} letterSpacing="0.08em" fill="#fffaf0" stroke={c[1]} strokeWidth={0.8}>{t}</text>}
  </g>
);
const Slot: React.FC<{a: number; f: number; hz: number}> = ({a, f, hz}) => (
  <g opacity={a}>
    <g filter="url(#w2-shadow)"><rect x={BX0 - 40} y={BY - 54} width={BW + 80} height={BH + 130} rx={20} fill="#fbf3dd" stroke="#b8a074" strokeWidth={3}/></g>
    <rect x={BX0 - 6} y={BY - 6} width={BW + 12} height={BH + 12} rx={14} fill="#d9c89c" stroke="#a8946a" strokeWidth={2.4}/>
    <rect x={BX0} y={BY} width={BW} height={BH} rx={10} fill="#efe6cc" stroke="#b8a074" strokeWidth={2}/>
    {Array.from({length: 21}, (_, i) => <path key={i} d={`M${BX0 + (BW * i) / 20},${BY + BH + 6} l0,${i % 5 === 0 ? 24 : 12}`} stroke="#8a7a5a" strokeWidth={i % 5 === 0 ? 3 : 1.8} opacity={0.7}/>)}
    {/* the half line */}
    <g filter="url(#w2-glow)" opacity={0.75 + 0.2 * Math.sin(f / 10)}><rect x={HALF - 6} y={BY - 70} width={12} height={BH + 150} fill="#ffd36a"/></g>
    <rect x={HALF - 4} y={BY - 70} width={8} height={BH + 150} rx={4} fill="url(#w2-gold)" stroke="#8a5a14" strokeWidth={1.6}/>
    <g transform={`translate(${HALF} ${BY - 70})`}><path d="M4,0 L108,20 L4,40 Z" fill="#c0352b" stroke="#7a1c14" strokeWidth={2}/><text x={22} y={27} fontFamily={SANS} fontWeight={800} fontSize={19} letterSpacing="0.12em" fill="#fff">HALF</text></g>
    {hz > 0.01 && <g opacity={hz}>
      <rect x={HALF + 4} y={BY} width={BW / 2 - 4} height={BH} rx={8} fill="#c0352b" opacity={0.1}/>
      {Array.from({length: 16}, (_, i) => <path key={i} d={`M${HALF + 20 + i * 50},${BY + BH} l${Math.min(BH, BX0 + BW - HALF - 20 - i * 50)},${-Math.min(BH, BX0 + BW - HALF - 20 - i * 50)}`} stroke="#c0352b" strokeWidth={3} opacity={0.35}/>)}
    </g>}
  </g>
);
export const VacancyBarArt: React.FC<AP> = (p) => {
  const {f} = p, L = lk(p), ews = (p.spec as any).mode === "ews", t0 = (L.r5 ?? L.ew)?.at ?? 20;
  const aS = a01(f, ews ? 2 : t0 - 4, 24);
  const tHf = L.hf ? L.hf.at : t0 + 120, tJp = L.jp ? L.jp.at : tHf + 160;
  const fillT = (i: number) => (ews ? clamp(sm(f, 12 + i * 14, 28)) : sm(f, tHf + i * 26, 34));
  let x = BX0;
  const bl = BLOCKS.map((b, i) => { const full = part(b.n), w = full * fillT(i); const out = {x, w, b}; x += full; return out; });
  const hz = ews ? 0.8 : a01(f, tJp - 30, 30);
  // half mode: a block tries to enter beyond the half, is stopped by the limit zone and bounces away
  const tryT = tJp - 10, u = clamp((f - tryT) / 70), drop = u < 0.38 ? eio(u / 0.38) : 1, rebound = u > 0.38 ? Math.sin(Math.min(1, (u - 0.38) / 0.62) * Math.PI) * 120 : 0;
  const gy = 90 + drop * (BY - 140 - 90) - rebound * (u > 0.38 ? 1 : 0), shake = u > 0.4 && u < 0.7 ? Math.sin(f * 1.6) * 5 : 0;
  // ews: the 10% block settles above the half line, then the five chairs
  const tEw = L.ew ? L.ew.at : t0, tSp = L.sp ? L.sp.at : tEw + 200;
  const ewU = clamp((f - tEw) / 34), ewY = BY - (1 - eo(ewU)) * 260, ewA = clamp(ewU * 4);
  const ewX = BX0 + part(49.5);
  const chairs = [0, 1, 2, 3, 4], ca = (i: number) => a01(f, tSp + i * 7, 16);
  return (
    <g>
      <WDefs/>
      <Wall y1={640} win={ews ? undefined : [1440, 70]}/>
      <Desk y0={640}/>
      <Slot a={aS} f={f} hz={hz}/>
      {bl.map((q, i) => q.w > 2 && <Block key={i} x={q.x} y={BY} w={q.w} h={BH} c={q.b.c} t={q.b.t}/>)}
      {!ews && f >= tryT && u < 1 && (
        <g transform={`translate(${shake} 0)`}><Block x={HALF + 80} y={gy} w={part(10)} h={BH} c={["#e07a6a", "#a8341f"]} a={clamp((f - tryT) / 8) * (1 - clamp((u - 0.8) / 0.2))} dash/>
          {u > 0.36 && u < 0.6 && <g transform={`translate(${HALF + 80 + part(5)} ${BY - 28})`} opacity={1 - (u - 0.36) / 0.24}><Cross x={0} y={0} s={0.6} w={8}/></g>}</g>
      )}
      {ews && ewA > 0.01 && (
        <g><g filter="url(#w2-glow)" opacity={0.5 * ewA}><rect x={ewX} y={ewY} width={part(10)} height={BH} fill="#b890f0"/></g>
          <Block x={ewX} y={ewY} w={part(10)} h={BH} c={["#9a6ad0", "#5a2f94"]} t="EWS" a={ewA}/></g>
      )}
      {ews && (
        <g>
          {chairs.map((i) => {
            const green = i < 3, col: [string, string] = green ? ["#3fb060", "#1b7a3a"] : ["#f0b04a", "#b86e14"];
            return <Chair key={i} x={760 + i * 130} y={900} s={0.75} col={col} a={ca(i)} glow={green ? 0.4 : 0.5 + 0.3 * Math.sin(f / 12 + i)}/>;
          })}
          {f >= tSp + 36 && <path d={`M${760 + 3 * 130 - 48},${908} L${760 + 4 * 130 + 48},${908}`} stroke="#b86e14" strokeWidth={5} strokeLinecap="round" opacity={a01(f, (L.ds?.at ?? tSp + 60), 14)}/>}
        </g>
      )}
    </g>
  );
};
export const VacancyBarLabels: React.FC<AP> = (p) => {
  const L = lk(p), ews = (p.spec as any).mode === "ews";
  return ews ? (
    <>
      {L.ew && <P2Card cx={500} y={92} text={L.ew.text} f={p.f} at={L.ew.at} size={34} maxW={760} upper={false}/>}
      {L.mh && <P2Card cx={1420} y={92} text={L.mh.text} f={p.f} at={L.mh.at} size={30} maxW={700} upper={false} tone="cool"/>}
      {L.ar && <P2Card cx={960} y={636} text={L.ar.text} f={p.f} at={L.ar.at} size={30} maxW={1100} upper={false}/>}
      {L.sp && <P2Card cx={400} y={732} text={L.sp.text} f={p.f} at={L.sp.at} size={32} maxW={300} upper={false} tone="green"/>}
      {L.ds && <P2Card cx={1560} y={732} text={L.ds.text} f={p.f} at={L.ds.at} size={30} maxW={380}/>}
    </>
  ) : (
    <>
      {L.r5 && <P2Card cx={760} y={86} text={L.r5.text} f={p.f} at={L.r5.at} size={44} maxW={960}/>}
      {L.hf && <P2Card cx={960} y={640} text={L.hf.text} f={p.f} at={L.hf.at} size={36} maxW={1200} upper={false}/>}
      {L.jp && <P2Card cx={1330} y={760} text={L.jp.text} f={p.f} at={L.jp.at} size={34} maxW={700} upper={false} tone="cool"/>}
    </>
  );
};

// ---- sc-tree -------------------------------------------------------------------------------------------------------------------
const NODES: {x: number; y: number; bars: number[]; c: [string, string]}[] = [
  {x: 540, y: 400, bars: [0.8, 0.45, 0.6], c: ["#4a90d0", "#1f5a96"]}, {x: 710, y: 270, bars: [0.4, 0.85, 0.55], c: ["#4cb064", "#1f7a3a"]},
  {x: 1010, y: 270, bars: [0.7, 0.35, 0.9], c: ["#f0b04a", "#b86e14"]}, {x: 1180, y: 400, bars: [0.5, 0.75, 0.3], c: ["#b8456a", "#7a2240"]},
];
const TX = 860, TOP = 520;
export const ScTreeArt: React.FC<AP> = (p) => {
  const {f} = p, L = lk(p), tDv = L.dv ? L.dv.at : 20, tS61 = L.s61 ? L.s61.at : 120, tSc = L.sc ? L.sc.at : 250, tGj = L.gj ? L.gj.at : 460, tPr = L.pr ? L.pr.at : 650;
  const aTree = a01(f, 2, 26), grow = sm(f, tSc - 10, 30), sway = Math.sin(f / 22) * 1.2;
  const aGj = a01(f, tGj - 4, 24), aPr = a01(f, tPr - 4, 24);
  return (
    <g>
      <WDefs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#w2-sky)"/>
      <Sun x={1700} y={200} r={40} f={f}/>
      {[0, 1].map((i) => <Cloud key={i} x={120 + i * 900} y={180 + i * 60} s={0.8} f={f} speed={0.12} seed={i + 7} a={0.8}/>)}
      <Hills id="w2t-h1" base={740} amp={90} top="#b4cbe0" bottom="#d4dfdf" seed={1.2}/><Hills id="w2t-h2" base={810} amp={60} top="#8fb59a" bottom="#bdd2a4" seed={4.1} wl={300}/>
      <rect x={-40} y={850} width={W + 80} height={H} fill="#86b070"/><rect x={-40} y={850} width={W + 80} height={12} fill="#a8c882"/>
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M${i * 50 + 12},${880 + (i * 41) % 100} q6,-14 12,0`} stroke="#5f8a4e" strokeWidth={2.4} fill="none" opacity={0.6}/>)}
      {/* tree: branches grow from the trunk card to the groups */}
      <g opacity={aTree}>
        {NODES.map((n, i) => {
          const u = grow, ex = TX + (n.x - TX) * u, ey = TOP + (n.y + 56 - TOP) * u, cx1 = TX + (n.x - TX) * 0.1, cy1 = TOP - 110 * u;
          return <g key={i}><path d={`M${TX},${TOP + 10} C${cx1},${cy1} ${ex},${ey + 90} ${ex},${ey}`} stroke="#3f2a16" strokeWidth={22} fill="none" strokeLinecap="round"/><path d={`M${TX},${TOP + 10} C${cx1},${cy1} ${ex},${ey + 90} ${ex},${ey}`} stroke="#7a5230" strokeWidth={16} fill="none" strokeLinecap="round"/><path d={`M${TX - 4},${TOP + 10} C${cx1 - 4},${cy1} ${ex - 4},${ey + 90} ${ex - 4},${ey}`} stroke="#a47a4a" strokeWidth={3} fill="none" opacity={0.6}/></g>;
        })}
        <ellipse cx={TX + 20} cy={862} rx={130} ry={16} fill="#2a1808" opacity={0.3}/>
        {/* trunk = the list card */}
        <g filter="url(#w2-shadow)"><rect x={TX - 82} y={TOP} width={164} height={340} rx={12} fill="#fffaf0" stroke="#7a5230" strokeWidth={6}/></g>
        <rect x={TX - 66} y={TOP + 16} width={132} height={26} rx={5} fill="#2f78b8"/><text x={TX} y={TOP + 35} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={15} letterSpacing="0.2em" fill="#fff">THE LIST</text>
        {Array.from({length: 11}, (_, i) => <g key={i}><circle cx={TX - 54} cy={TOP + 72 + i * 24} r={4.5} fill="#7a5230"/><rect x={TX - 40} y={TOP + 68 + i * 24} width={100 * (i % 3 === 2 ? 0.6 : i % 3 === 1 ? 0.85 : 1)} height={6} rx={3} fill="#8a7a5a" opacity={0.55}/></g>)}
        {NODES.map((n, i) => {
          const u = clamp((grow - 0.55) / 0.45), s = eo(u);
          return (
            <g key={i} transform={`translate(${n.x} ${n.y + (1 - s) * 40}) scale(${0.3 + 0.7 * s}) rotate(${sway * (i % 2 ? 1 : -1)})`} opacity={s}>
              {[[-70, 10, 70], [60, 0, 66], [-10, -52, 70], [-76, -34, 54], [74, -36, 52]].map(([cx, cy, r], k) => <circle key={k} cx={cx} cy={cy} r={r} fill={k % 2 ? "#5f9a4e" : "#6fae58"} stroke="#3f7a3a" strokeWidth={2}/>)}
              <g filter="url(#w2-shadow)"><rect x={-84} y={-62} width={168} height={128} rx={12} fill="#fffaf0" stroke={n.c[1]} strokeWidth={4}/></g>
              <rect x={-84} y={-62} width={168} height={14} rx={7} fill={n.c[0]}/>
              {n.bars.map((b, k) => <g key={k}><rect x={-60 + k * 44} y={50 - 96 * b * eo(clamp((f - tSc - 30 - i * 8 - k * 6) / 24))} width={32} height={96 * b * eo(clamp((f - tSc - 30 - i * 8 - k * 6) / 24))} rx={4} fill={n.c[0]} stroke={n.c[1]} strokeWidth={2}/></g>)}
              <path d="M-66,52 L66,52" stroke="#8a7a5a" strokeWidth={2.4}/>
            </g>
          );
        })}
      </g>
      {/* court plaque and seven judges' chairs, six together and one apart */}
      <g>
        <g transform={`translate(0 ${(1 - a01(f, tDv - 4, 22)) * -40})`} opacity={a01(f, tDv - 4, 22)}>
          <path d="M120,610 L440,610 L420,520 L140,520 Z" fill="url(#w2-wood)" stroke="#4f2f17" strokeWidth={3}/>
          <Plaque x={280} y={470} w={300} h={90} text="THE COURT" size={28}/>
        </g>
        {Array.from({length: 7}, (_, i) => <Chair key={i} x={128 + i * 52 + (i === 6 ? 14 : 0)} y={730} s={0.27} col={i < 6 ? ["#3fb060", "#1b7a3a"] : ["#f0b04a", "#b86e14"]} a={a01(f, tS61 + i * 4, 14)}/>)}
      </g>
      {/* the separate scroll on a lectern */}
      <g opacity={aGj} transform={`translate(0 ${(1 - aGj) * 40})`}>
        <path d="M1400,860 L1420,730 L1520,730 L1540,860 Z" fill="url(#w2-wood)" stroke="#4f2f17" strokeWidth={3}/><path d="M1350,730 L1610,730 L1580,704 L1380,704 Z" fill="#a8703a" stroke="#4f2f17" strokeWidth={3}/>
        <g filter="url(#w2-shadow)" transform="translate(1470 520) rotate(-2)">
          <rect x={-170} y={-150} width={340} height={290} rx={8} fill="#fff3d0" stroke="#b8975a" strokeWidth={3}/>
          <rect x={-194} y={-164} width={32} height={318} rx={16} fill="#e8d6a8" stroke="#b8975a" strokeWidth={3}/><rect x={162} y={-164} width={32} height={318} rx={16} fill="#e8d6a8" stroke="#b8975a" strokeWidth={3}/>
          <text x={0} y={-96} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={26} letterSpacing="0.1em" fill="#5e2a0e">ONE JUDGE'S</text>
          <text x={0} y={-62} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={26} letterSpacing="0.1em" fill="#5e2a0e">OPINION</text>
          {[0, 1, 2].map((i) => <rect key={i} x={-124} y={-34 + i * 16} width={248 * (i === 2 ? 0.6 : 1)} height={5} rx={2.5} fill="#8a7a5a" opacity={0.5}/>)}
          {[0, 1, 2].map((i) => { const a = a01(f, tGj + 14 + i * 16, 18); return <g key={i} opacity={a}><path d={`M-120,${44 + i * 32} q30,-34 52,0 t52,-6 t58,8`} stroke="#1f3a6a" strokeWidth={3} fill="none" strokeLinecap="round"/><path d="M-124,${54 + i * 32} L40,${54 + i * 32}" stroke="#8a7a5a" strokeWidth={2} opacity={0.6}/></g>; })}
        </g>
      </g>
      {/* promotion ladder */}
      <g opacity={aPr} transform={`translate(0 ${(1 - aPr) * 40})`}>
        <ellipse cx={1740} cy={868} rx={80} ry={12} fill="#2a1808" opacity={0.3}/>
        <path d="M1696,860 L1710,360 M1784,860 L1770,360" stroke="#7a4a24" strokeWidth={12} strokeLinecap="round"/><path d="M1696,860 L1710,360 M1784,860 L1770,360" stroke="#b8803c" strokeWidth={5} strokeLinecap="round"/>
        {Array.from({length: 9}, (_, i) => { const y = 840 - i * 56, k = (840 - y) / 480; return <path key={i} d={`M${1697 + k * 13},${y} L${1783 - k * 13},${y}`} stroke="#7a4a24" strokeWidth={9} strokeLinecap="round"/>; })}
        <g transform={`translate(1740 ${760 - eio(prog(f, tPr + 8, 100)) * 330})`}><path d="M0,-20 L16,4 L5,4 L5,26 L-5,26 L-5,4 L-16,4 Z" fill="#2f9a4a" stroke="#1b6a30" strokeWidth={2.4}/></g>
      </g>
    </g>
  );
};
export const ScTreeLabels: React.FC<AP> = (p) => {
  const L = lk(p);
  return (
    <>
      {L.sc && <P2Card cx={860} y={80} text={L.sc.text} f={p.f} at={L.sc.at} size={32} maxW={700} upper={false}/>}
      {L.dv && <P2Card cx={280} y={250} text={L.dv.text} f={p.f} at={L.dv.at} size={30} maxW={420}/>}
      {L.s61 && <P2Card cx={280} y={760} text={L.s61.text} f={p.f} at={L.s61.at} size={28} maxW={380} upper={false}/>}
      {L.gj && <P2Card cx={1470} y={760} text={L.gj.text} f={p.f} at={L.gj.at} size={24} maxW={560}/>}
      {L.pr && <P2Card cx={1600} y={140} text={L.pr.text} f={p.f} at={L.pr.at} size={24} maxW={420} upper={false}/>}
    </>
  );
};
