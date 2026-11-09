// ECO-16 Part 3, builder G1: `part-wrap` (b19), the finale of the series. Three panels fade in in a row: Part 1 the money bar (cash a thin slice, deposits the rest; widths from table e16_m3),
// Part 2 the ledger with a new block growing (heights from table e16_p2), Part 3 the two fields of Salim and Swapna (names read from the ss label) over a balance that tips between RISK and SUPPORT (rs).
// Keys: p1, p2, p3, ss, rs. The panels carry no figures of their own: every size comes from a table.
import React from "react";
import {SANS, SERIF, W, H, clamp} from "../kit";
import {fig} from "../../cartoon/long/figs";
import {GDefs, E1Defs, F1Defs, ShoeBox, Sign, Badge, Bundle, P2Card, elabs, ez, sm, pop, mixn, type AP} from "./analogy_g1_kit";

const PN = [{x: 100, w: 520}, {x: 650, w: 520}, {x: 1200, w: 620}], PYT = 262, PHH = 500;
const v = (t: string, s: string) => fig({t, state: "India", s}).value;

const Panel: React.FC<{i: number; a: number; dark?: boolean; children: React.ReactNode}> = ({i, a, dark, children}) => {
  const {x, w} = PN[i], id = `g1wp-${i}`;
  if (a <= 0.003) return null;
  return (
    <g opacity={clamp(a * 1.4)} transform={`translate(0 ${(1 - a) * 36})`}>
      <rect x={x - 4} y={PYT + 14} width={w + 8} height={PHH} rx={24} fill="#1c1006" opacity={0.28} filter="url(#ak-blur22)"/>
      <defs><clipPath id={id}><rect x={x} y={PYT} width={w} height={PHH} rx={20}/></clipPath></defs>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={PYT} width={w} height={PHH} fill={dark ? "url(#g1-navy)" : "url(#g1-wall)"}/>
        {children}
      </g>
      <rect x={x} y={PYT} width={w} height={PHH} rx={20} fill="none" stroke="url(#f1-brass)" strokeWidth={9}/>
      <rect x={x + 7} y={PYT + 7} width={w - 14} height={PHH - 14} rx={14} fill="none" stroke="#fff3b8" strokeWidth={1.6} opacity={0.55}/>
    </g>
  );
};

const MiniSalim: React.FC<{x: number; y: number; w: number; h: number; f: number}> = ({x, y, w, h, f}) => (
  <g transform={`translate(${x} ${y})`}>
    <clipPath id="g1ms"><rect x={0} y={0} width={w} height={h} rx={12}/></clipPath>
    <g clipPath="url(#g1ms)">
      <rect x={0} y={0} width={w} height={h} fill="url(#g1-wall)"/><rect x={0} y={h - 56} width={w} height={56} fill="url(#g1-floor)"/>
      {[[56, h - 66], [124, h - 66], [90, h - 110], [56, h - 154], [124, h - 154]].map(([bx, by], i) => <ShoeBox key={i} x={bx} y={by} w={84} stripe={["#c0543a", "#2f78b8", "#d9a23a"][i % 3]}/>)}
      <g transform={`translate(${w - 66} ${h - 80})`}><rect x={-56} y={-70} width={112} height={92} rx={8} fill="url(#g1-van)" stroke="#8a826e" strokeWidth={2}/><rect x={-46} y={-60} width={92} height={72} rx={7} fill="#201a14"/>
        {[[-22, -6], [18, -6], [-2, -34]].map(([bx, by], i) => <ShoeBox key={i} x={bx} y={by} w={40} stripe="#c0543a"/>)}</g>
      <rect x={0} y={0} width={w} height={h} fill="#ff9a3c" opacity={0.06}/>
    </g>
    <rect x={0} y={0} width={w} height={h} rx={12} fill="none" stroke="#b58a52" strokeWidth={2.4}/>
  </g>
);

const MiniSwapna: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
  <g transform={`translate(${x} ${y})`}>
    <clipPath id="g1mw"><rect x={0} y={0} width={w} height={h} rx={12}/></clipPath>
    <g clipPath="url(#g1mw)">
      <rect x={0} y={0} width={w} height={h} fill="url(#g1-skydry)"/>
      <rect x={0} y={h * 0.42} width={w} height={h * 0.6} fill="url(#g1-soildry)"/>
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => { const px = 40 + c * 74 + (r % 2) * 20, py = h * 0.58 + r * 38; return (
        <g key={`${r}${c}`} transform={`translate(${px} ${py})`}>
          <ellipse cx={0} cy={2} rx={18} ry={4.5} fill="#2a1808" opacity={0.2}/>
          {[-1, 0, 1].map((k) => <path key={k} d={`M0,0 Q${k * 8},${-8 + r * -2} ${k * 14},${-4}`} stroke="#8a7a3a" strokeWidth={3.4} fill="none" strokeLinecap="round"/>)}
          {[-1, 0, 1].map((k) => <ellipse key={`l${k}`} cx={k * 14} cy={-2} rx={7} ry={3.6} fill="#b09a4a" transform={`rotate(${k * 24} ${k * 14} -2)`}/>)}
        </g>); }))}
      <g transform={`translate(${w - 64} ${h * 0.5})`}><rect x={-46} y={-30} width={92} height={62} rx={8} fill="url(#g1-soildry)" stroke="#c9962c" strokeWidth={4}/><text x={0} y={10} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={22} letterSpacing="0.08em" fill="#5a3c0a">LAND</text></g>
    </g>
    <rect x={0} y={0} width={w} height={h} rx={12} fill="none" stroke="#b58a52" strokeWidth={2.4}/>
  </g>
);

export const WrapArt: React.FC<AP> = (p) => {
  const {f, at} = p, L = elabs(p), p1 = at("p1"), p2 = at("p2"), p3 = at("p3"), ss = at("ss"), rs = at("rs");
  const a1 = ez(f, p1, 24), a2 = ez(f, p2, 24), a3 = ez(f, p3, 24);
  // panel 1: the money bar, widths from the table
  const cash = v("e16_m3", "cash"), dep = v("e16_m3", "dep"), tot = cash + dep, BW = 440;
  const grow1 = ez(f, p1 + 6, 36);
  // panel 2: the ledger, heights from the table
  const dpv = v("e16_p2", "dep"), lnv = v("e16_p2", "loan"), k2 = 1.2;
  const grow2 = ez(f, p2 + 8, 40), newB = ez(f, p2 + 24, 44);
  // panel 3: the two fields and the balance
  const nm = L.ss.text.split("·").map((t) => t.trim());
  const ssA = pop(f, ss, 16);
  const tip = (() => {
    const down = sm(f, rs + 4, 26), back = sm(f, rs + 46, 34);
    return down * (1 - back) * -10;                                 // beam angle: left (RISK) dips first, then support arrives and it settles level
  })();
  const sup = sm(f, rs + 44, 26);
  const PX = PN[2].x + PN[2].w / 2, BY = PYT + 326, beam = 218, rad = (tip * Math.PI) / 180;
  const lY = BY + Math.sin(-rad) * beam, rY = BY - Math.sin(-rad) * beam;
  return (
    <g>
      <GDefs/><E1Defs/><F1Defs/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="#e9dcbd"/>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#g1-wall)" opacity={0.7}/>
      {Array.from({length: 10}, (_, i) => <rect key={i} x={-30 + i * 200} y={-20} width={100} height={H} fill="#f6ecd0" opacity={0.2}/>)}
      <rect x={-60} y={PYT + PHH + 30} width={W + 120} height={H} fill="url(#g1-floor)" opacity={0.9}/>

      {/* ---- Part 1: the money bar ---- */}
      <Panel i={0} a={a1} dark>
        <rect x={PN[0].x} y={PYT} width={PN[0].w} height={PHH} fill="#fff" opacity={0.03}/>
        <ellipse cx={PN[0].x + PN[0].w / 2} cy={PYT + 250} rx={280} ry={190} fill="#7ec0f0" opacity={0.08}/>
        <g transform={`translate(${PN[0].x + 60} ${PYT + 250})`}>
          <rect x={-8} y={-96} width={BW + 16} height={192} rx={14} fill="#10182c" stroke="#6f808b" strokeWidth={3}/>
          {/* deposits (the long block) then cash (the thin slice) */}
          <rect x={BW * (cash / tot)} y={-88} width={BW * (dep / tot) * grow1} height={176} rx={6} fill="#2f78b8" stroke="#173b66" strokeWidth={2}/>
          {Array.from({length: 6}, (_, i) => <rect key={i} x={BW * (cash / tot) + 16 + i * ((BW * (dep / tot) - 32 - 30) / 5)} y={-56} width={30} height={92} fill="#e8f1fa" opacity={0.5 * grow1} stroke="#9fc0e0" strokeWidth={1.4}/>)}
          <rect x={BW * (cash / tot)} y={-88} width={BW * (dep / tot) * grow1} height={26} fill="#e8f1fa" opacity={0.4}/>
          <rect x={0} y={-88} width={BW * (cash / tot) * grow1} height={176} rx={6} fill="#e8a23a" stroke="#a86a14" strokeWidth={2}/>
          <g opacity={grow1}><circle cx={BW * (cash / tot) / 2} cy={-36} r={9} fill="#fff0a8" stroke="#a8740e" strokeWidth={1.6}/><rect x={BW * (cash / tot) / 2 - 15} y={4} width={30} height={16} rx={2} fill="#6aa078" stroke="#2c4a3a" strokeWidth={1.4}/></g>
          <text x={BW * (cash / tot) / 2} y={128} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.14em" fill="#f6e3a8" opacity={grow1}>CASH</text>
          <text x={BW * (cash / tot) + (BW * (dep / tot)) / 2} y={128} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.14em" fill="#cfe8ff" opacity={grow1}>DEPOSITS</text>
        </g>
      </Panel>

      {/* ---- Part 2: the ledger with a new block ---- */}
      <Panel i={1} a={a2}>
        <g transform={`translate(${PN[1].x + PN[1].w / 2} ${PYT + 400})`}>
          <ellipse cx={0} cy={36} rx={236} ry={16} fill="#2a1808" opacity={0.3}/>
          <path d="M-230,34 L-214,-300 L-6,-286 L-6,34 Z" fill="url(#f2-page)" stroke="#b8a074" strokeWidth={2.4}/>
          <path d="M230,34 L214,-300 L6,-286 L6,34 Z" fill="url(#f2-pageR)" stroke="#b8a074" strokeWidth={2.4}/>
          <path d="M-236,38 L236,38 L222,52 L-222,52 Z" fill="url(#f2-leather)" stroke="#4a1a12" strokeWidth={2}/>
          <path d="M0,-286 V36" stroke="#b8a074" strokeWidth={3}/>
          {[-1, 1].map((sd) => <text key={sd} x={sd * 108} y={-252} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.2em" fill="#8a6a3a">{sd < 0 ? "ASSETS" : "LIABILITIES"}</text>)}
          {/* left: reserves and a loan block; right: the deposit and a new deposit block grows */}
          <rect x={-190} y={16 - dpv * k2 * grow2} width={150} height={dpv * k2 * grow2} rx={5} fill="#2a8a7c" stroke="#145a50" strokeWidth={2.4}/>
          <text x={-115} y={16 - dpv * k2 * 0.5 * grow2 + 6} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={16} letterSpacing="0.14em" fill="#e8fff8" opacity={grow2}>RESERVES</text>
          <rect x={-190} y={16 - dpv * k2 * grow2 - lnv * k2 * newB} width={150} height={lnv * k2 * newB} rx={5} fill="#e8a23a" stroke="#a86a14" strokeWidth={2.4} opacity={newB > 0.02 ? 1 : 0}/>
          <text x={-115} y={16 - dpv * k2 * grow2 - lnv * k2 * 0.5 * newB + 6} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={16} letterSpacing="0.14em" fill="#3a2408" opacity={newB}>LOANS</text>
          <rect x={40} y={16 - dpv * k2 * grow2} width={150} height={dpv * k2 * grow2} rx={5} fill="#2f78b8" stroke="#173b66" strokeWidth={2.4}/>
          <text x={115} y={16 - dpv * k2 * 0.5 * grow2 + 6} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={16} letterSpacing="0.14em" fill="#eaf4ff" opacity={grow2}>DEPOSITS</text>
          <rect x={40} y={16 - dpv * k2 * grow2 - lnv * k2 * newB} width={150} height={lnv * k2 * newB} rx={5} fill="#e8a23a" stroke="#a86a14" strokeWidth={2.4} opacity={newB > 0.02 ? 1 : 0}/>
          <text x={115} y={16 - dpv * k2 * grow2 - lnv * k2 * 0.5 * newB + 6} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={16} letterSpacing="0.14em" fill="#3a2408" opacity={newB}>NEW</text>
        </g>
      </Panel>

      {/* ---- Part 3: the two fields and the balance ---- */}
      <Panel i={2} a={a3}>
        <MiniSalim x={PN[2].x + 22} y={PYT + 24} w={270} h={190} f={f}/>
        <MiniSwapna x={PN[2].x + 328} y={PYT + 24} w={270} h={190}/>
        <Sign x={PN[2].x + 22 + 135} y={PYT + 236} text={(nm[0] ?? "").toUpperCase()} a={ssA} size={22} w={(nm[0] ?? "").length * 17 + 56}/>
        <Sign x={PN[2].x + 328 + 135} y={PYT + 236} text={(nm[1] ?? "").toUpperCase()} a={ssA} size={22} w={(nm[1] ?? "").length * 17 + 56}/>
        {/* the balance */}
        <g>
          <rect x={PX - 8} y={BY} width={16} height={112} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2}/>
          <ellipse cx={PX} cy={BY + 116} rx={74} ry={12} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2}/>
          <g transform={`rotate(${tip} ${PX} ${BY})`}><rect x={PX - beam - 12} y={BY - 9} width={beam * 2 + 24} height={18} rx={9} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2.4}/></g>
          <circle cx={PX} cy={BY} r={14} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2.4}/>
          {[[PX - Math.cos(rad) * beam, lY], [PX + Math.cos(rad) * beam, rY]].map(([qx, qy], i) => (
            <g key={i}>
              <path d={`M${qx},${qy} L${qx - 52},${qy + 56} M${qx},${qy} L${qx + 52},${qy + 56}`} stroke="#6a4a10" strokeWidth={3}/>
              <path d={`M${qx - 70},${qy + 56} Q${qx},${qy + 92} ${qx + 70},${qy + 56} Z`} fill="url(#f1-brass)" stroke="#5a3c0a" strokeWidth={2.4}/>
              {i === 0 && <g transform={`translate(${qx} ${qy + 54})`}>{[0, 1, 2].map((k) => <g key={k} transform={`translate(${(k - 1) * 22} ${-k % 2 * 6})`}><ellipse cx={0} cy={0} rx={11} ry={5.6} fill="#c63f2f" stroke="#7a1a12" strokeWidth={1.4}/><ellipse cx={0} cy={-5} rx={11} ry={5.6} fill="#e8604a" stroke="#7a1a12" strokeWidth={1.4}/></g>)}
                <text x={0} y={60} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.16em" fill="#7a1a12">RISK</text></g>}
              {i === 1 && <g transform={`translate(${qx} ${qy + 54})`}>
                <g opacity={sup} transform={`translate(0 ${-(1 - sup) * 60})`}><path d="M0,-44 Q32,-34 36,-6 Q34,24 0,36 Q-34,24 -36,-6 Q-32,-34 0,-44 Z" fill="#2f9a5a" stroke="#1a6a30" strokeWidth={3}/><path d="M-14,-4 L-4,8 L16,-18" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>
                <text x={0} y={60} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={20} letterSpacing="0.16em" fill="#14502a">SUPPORT</text></g>}
            </g>
          ))}
        </g>
      </Panel>
    </g>
  );
};

export const WrapLabels: React.FC<AP> = (p) => {
  const L = elabs(p), {f} = p;
  return (
    <>
      <P2Card cx={360} y={130} text={L.p1.text} f={f} at={L.p1.at} size={28} maxW={500} upper={false}/>
      <P2Card cx={910} y={130} text={L.p2.text} f={f} at={L.p2.at} size={28} maxW={500} upper={false}/>
      <P2Card cx={1510} y={130} text={L.p3.text} f={f} at={L.p3.at} size={28} maxW={560} upper={false} tone="green"/>
      <P2Card cx={1510} y={796} text={L.rs.text} f={f} at={L.rs.at} size={30} maxW={600} upper={false} tone="cool"/>
    </>
  );
};
