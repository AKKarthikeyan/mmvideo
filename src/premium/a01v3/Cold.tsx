// A01 v3 "A Soda, a Razor, a Plane: What Is a Moat?" — stage 1: the cold open (beats c01-c04 of script.md v3.1).
// Premium B look: MiniMax-painted plates (plate_log.md) + code-drawn motion, numbers, water and characters on top.
// Cue frames come from MiniMax's own sentence timings and the pauses measured in each narration file (see CUES below).
import React from "react";
import {AbsoluteFill, Audio, Easing, Img, Sequence, random, useCurrentFrame} from "remotion";
import {FONT, Grain, MBlur, Vignette, inOut, particles, spr} from "../common";
import {Chip, Coin, CoinStream, Kinetic, KitDefs, Layer, P, Plate, BrassKey, Soldier, StackCoin, Svg, camAt, clamp01, ease, fmtInt} from "./kit";
import WATER from "./water_points.json";

export const COLD_TOTAL = 1470;
// Narration starts (frames) and the cue frames measured from the audio (beat start + offset of the spoken words).
export const VO = {c01: 4, c02: 480, c03: 815, c04: 1074};
export const CUES = {
  soda: 9, razor: 42, plane: 71, which: 104, company: 177, madeAll: 234, yearsLater: 280, paid: 310, count: 341, oneYear: 433,
  c02Plane: 488, stopped: 575, why: 617, sameCo: 663, y1988: 729, y1989: 763,
  c03Answer: 821, castles: 874, deepWater: 966, moat: 1043,
  byTheEnd: 1080, test: 1106, street: 1157, cPlane: 1244, mistake: 1265, money: 1333, how: 1398,
};
const VOICE: [number, number][] = [[VO.c01, VO.c01 + 468], [VO.c02, VO.c02 + 319], [VO.c03, VO.c03 + 245], [VO.c04, VO.c04 + 344]];
const quartOut = (t: number) => 1 - Math.pow(1 - t, 4);
const outCubic = Easing.out(Easing.cubic);

// ======================= PLINTH ROOM (c01, c02) =======================
const PC = {x: 928, y: 774, rx: 560, ry: 62};
const A0 = [2.25, Math.PI / 2, 0.89];                   // soda, razor, plane on the turntable (radians; PI/2 = front centre)
const turn = (f: number) => 0.0005 * Math.min(f, 660) + Math.PI * 2 * ease(f, 276, 314, inOut);   // slow turn + one carousel spin ("Years later")
const objPos = (i: number, f: number) => {
  const a = A0[i] + turn(f);
  return {x: PC.x + PC.rx * Math.cos(a), y: PC.y + PC.ry * Math.sin(a), d: 0.9 + 0.1 * Math.sin(a), a};
};
const DROP = [CUES.soda - 5, CUES.razor - 5, CUES.plane - 5];
const drop = (f: number, st: number) => {          // fall from above, land, squash and settle (#011)
  const t = (f - st) / 12;
  if (t < 0) return null;
  if (t < 1) return {dy: -820 * (1 - t * t), sx: 1, sy: 1.04};
  const k = f - st - 12, sq = 0.16 * Math.exp(-k / 4) * Math.cos(k * 0.95);
  return {dy: 0, sx: 1 + sq * 0.6, sy: 1 - sq};
};
const FLICK = [0.55, 0.1, 0.85, 0.25, 1, 0.65, 1, 1];
const flick = (f: number, at: number) => (f < at ? 0 : f < at + 8 ? FLICK[f - at] : 1);
const DIE = [1, 0.35, 0.9, 0.15, 0.7, 0.05, 0.45, 0, 0.25, 0, 0, 0.12, 0];
const lightLevel = (i: number, f: number) => {
  let l = flick(f, DROP[i] + 12);
  const scan = CUES.which + i * 6;                                     // "Which ...?" each light blinks in turn
  if (f >= scan && f < scan + 6) l *= 0.3;
  if (i === 2) {
    if (f >= CUES.c02Plane && f < CUES.c02Plane + 8) l *= FLICK[f - CUES.c02Plane];
    if (f >= CUES.stopped + 4) l = f - CUES.stopped - 4 < DIE.length ? DIE[f - CUES.stopped - 4] : 0;   // the plane's light dies
  }
  return l;
};
const SPR = [{src: "sprites/soda.png", h: 330, ar: 350 / 729}, {src: "sprites/razor.png", h: 360, ar: 318 / 686}, {src: "sprites/plane.png", h: 200, ar: 824 / 351}];

const Calendar: React.FC<{f: number}> = ({f}) => {
  // a flip calendar hanging on the curtain; pages flip on the spoken years (no other year is ever shown)
  const flip1 = ease(f, CUES.y1988 - 9, CUES.y1988, Easing.in(Easing.quad)), flip2 = ease(f, CUES.y1989 - 8, CUES.y1989, Easing.in(Easing.quad));
  const Page: React.FC<{year?: string; rot?: number}> = ({year, rot = 0}) => (
    <div style={{position: "absolute", left: 0, top: 46, width: 300, height: 250, background: "#FFF6E4", borderRadius: "0 0 14px 14px",
      transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${rot}deg)`, backfaceVisibility: "hidden", boxShadow: "inset 0 -10px 18px rgba(120,80,40,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center"}}>
      {year ? <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 112, color: "#5A2E12", letterSpacing: -2, fontVariantNumeric: "tabular-nums"}}>{year}</div> :
        <svg width={240} height={170}>{Array.from({length: 20}).map((_, k) => <rect key={k} x={(k % 5) * 48 + 6} y={Math.floor(k / 5) * 42 + 6} width={36} height={30} rx={5} fill="#EBDDC2"/>)}</svg>}
    </div>
  );
  return (
    <div style={{position: "absolute", left: PC.x - 150, top: 120, width: 300, height: 300}}>
      <div style={{position: "absolute", left: 0, top: 0, width: 300, height: 56, background: "linear-gradient(#C9452F, #A8341F)", borderRadius: "14px 14px 0 0"}}/>
      {[70, 230].map((x) => <div key={x} style={{position: "absolute", left: x - 9, top: -14, width: 18, height: 34, borderRadius: 9, border: "5px solid #8D8D8D"}}/>)}
      <Page year="1989"/>
      {flip2 < 1 ? <Page year="1988" rot={-178 * flip2}/> : null}
      {flip1 < 1 ? <Page rot={-178 * flip1}/> : null}
    </div>
  );
};

const PlinthScene: React.FC<{f: number}> = ({f}) => {
  const cam = camAt(f, [
    [0, 1.0, 960, 540], [300, 1.1, 940, 585], [310, 1.1, 940, 585], [340, 1.42, 680, 610],
    [466, 1.46, 680, 600], [484, 1.46, 1180, 590, (t) => inOut(t)], [600, 1.55, 1180, 580], [612, 1.55, 1180, 580],
    [640, 1.0, 960, 540, outCubic], [660, 1.0, 960, 540], [790, 1.07, 940, 506],
  ]);
  const pos = [0, 1, 2].map((i) => objPos(i, f));
  const warm = ease(f, CUES.paid, CUES.paid + 20);
  const lv = [0, 1, 2].map((i) => lightLevel(i, f));
  const calL = ease(f, CUES.sameCo - 6, CUES.sameCo + 14);
  const sceneBlur = 7 * ease(f, CUES.sameCo - 4, CUES.sameCo + 20), calBlur = 5 * (1 - ease(f, CUES.sameCo - 4, CUES.sameCo + 20));
  const dark = f < 4 ? 1 : 0.9;
  const order = [0, 1, 2].sort((a, b) => pos[a].y - pos[b].y);
  const plane = pos[2];
  const sag = ease(f, CUES.stopped, CUES.stopped + 26);
  const motes = particles("pmote", 90);
  const thr = ease(f, CUES.madeAll - 6, CUES.madeAll + 10), thrOut = 1 - ease(f, 268, 284);
  const tops = pos.map((p, i) => ({x: p.x, y: p.y - SPR[i].h * p.d * (i === 2 ? 1.6 : 0.55)}));
  return (
    <AbsoluteFill>
      <Layer cam={cam}>
        <AbsoluteFill style={{filter: sceneBlur > 0.2 ? `blur(${sceneBlur}px)` : undefined}}>
          <Plate src="plates/plinth.jpg" style={{filter: "saturate(0.9)"}}/>
          {/* turning plinth: a light sheen sweeps round its top */}
          <Svg>
            <ellipse cx={PC.x + Math.cos(f * 0.02) * 380} cy={PC.y + Math.sin(f * 0.02) * 40} rx={150} ry={22} fill="#FFF0C8" opacity={0.18}/>
            {/* contact shadows */}
            {pos.map((p, i) => drop(f, DROP[i]) ? <ellipse key={i} cx={p.x} cy={p.y + 4} rx={(i === 2 ? 170 : 95) * p.d} ry={18 * p.d}
              fill="url(#k-shadow)" opacity={i === 2 ? 0.5 * (1 - sag * 0.3) : 0.9}/> : null)}
          </Svg>
          {order.map((i) => {
            const p = pos[i], dr = drop(f, DROP[i]);
            if (!dr) return null;
            const s = SPR[i], h = s.h * p.d, w = h * s.ar;
            const hover = i === 2 ? -150 - 12 * Math.sin(f * 0.07) + sag * 40 : 0;
            const rot = i === 2 ? -3 + 2 * Math.sin(f * 0.05) + 9 * sag : 0;
            const dim = i === 2 ? 1 - 0.45 * sag : 1;
            return <Img key={i} src={P(s.src)} style={{position: "absolute", left: p.x - w / 2, top: p.y - h + dr.dy + hover, width: w, height: h,
              transform: `rotate(${rot}deg) scale(${dr.sx}, ${dr.sy})`, transformOrigin: "50% 100%", filter: `brightness(${dim}) ${i === 2 && sag > 0 ? `saturate(${1 - sag * 0.6})` : ""}`}}/>;
          })}
          {/* darkness with one spotlight hole per object (+ the calendar later) */}
          <Svg>
            <defs>
              <mask id="pl-dark">
                <rect x={-800} y={-800} width={3600} height={2800} fill="#fff"/>
                {pos.map((p, i) => <ellipse key={i} cx={p.x} cy={p.y - 150} rx={250 + (i === 0 ? 90 * warm : 0)} ry={360} fill="url(#k-hole)" opacity={lv[i]}/>)}
                <ellipse cx={PC.x} cy={290} rx={260} ry={250} fill="url(#k-hole)" opacity={calL}/>
                <ellipse cx={PC.x} cy={PC.y + 40} rx={720} ry={170} fill="url(#k-hole)" opacity={0.35 * ease(f, 20, 90)}/>
              </mask>
            </defs>
            <rect x={-800} y={-800} width={3600} height={2800} fill="#0A0503" opacity={dark} mask="url(#pl-dark)"/>
          </Svg>
          {/* spotlight beams and dust in them (screen blend) */}
          <Svg style={{mixBlendMode: "screen"}}>
            {pos.map((p, i) => {
              const gold = i === 0 ? warm : 0;
              return <g key={i} opacity={lv[i] * 0.3}>
                <polygon points={`${p.x - 34},-80 ${p.x + 34},-80 ${p.x + 210},${p.y + 20} ${p.x - 210},${p.y + 20}`} fill={gold > 0.5 ? "url(#k-beamGold)" : "url(#k-beam)"}/>
              </g>;
            })}
            {motes.map((m, k) => {
              const i = k % 3, p = pos[i], yy = ((m.y * 900 + f * (0.4 + m.s * 0.8)) % 900) - 60, half = 34 + (176 * (yy + 80)) / (p.y + 100);
              const xx = p.x + (m.x - 0.5) * 2 * half * 0.9 + Math.sin(f * 0.03 + m.p) * 8;
              return <circle key={k} cx={xx} cy={yy} r={1.5 + m.r * 2.6} fill="#FFF3D2" opacity={lv[i] * (0.25 + 0.5 * Math.abs(Math.sin(f * 0.05 + m.p)))}/>;
            })}
            {warm > 0 ? <circle cx={pos[0].x} cy={pos[0].y - 150} r={300} fill="url(#k-glow)" opacity={0.75 * warm}/> : null}
          </Svg>
          {/* gold thread between the three ("One company ... made all three") */}
          {thr > 0 && thrOut > 0 ? (() => {
            const d = `M ${tops[0].x} ${tops[0].y} Q ${(tops[0].x + tops[1].x) / 2} ${tops[0].y - 60} ${tops[1].x} ${tops[1].y} Q ${(tops[1].x + tops[2].x) / 2} ${tops[1].y - 60} ${tops[2].x} ${tops[2].y}`;
            const snap = Math.exp(-Math.max(0, f - CUES.madeAll - 10) / 5);
            return <Svg><g opacity={thrOut}>
              <path d={d} stroke="#FFD66B" strokeWidth={10 + 16 * snap} fill="none" opacity={0.25} pathLength={1} strokeDasharray={`${thr} 1`} strokeLinecap="round"/>
              <path d={d} stroke="#FFE9A8" strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${thr} 1`} strokeLinecap="round"/>
              {tops.map((t, k) => <circle key={k} cx={t.x} cy={t.y} r={10 + 14 * snap} fill="#FFF3C4" opacity={thr * (0.5 + 0.5 * snap)}/>)}
            </g></Svg>;
          })() : null}
          {/* coin river from the soda ("the soda paid it") */}
          {f >= CUES.paid + 6 ? <Svg>
            <CoinStream f={f} a={CUES.paid + 6} b={812} rate={1.2} x0={pos[0].x - 50} y0={pos[0].y - 30} seed="riv" vx={[-11, -3]} vy={[-9, -4]} g={0.75} r={[11, 19]} life={75}/>
            <CoinStream f={f} a={CUES.count} b={CUES.oneYear + 4} rate={1.6} x0={pos[0].x - 40} y0={pos[0].y - 120} seed="burst" vx={[-15, -5]} vy={[-14, -6]} g={0.8} r={[12, 22]} life={70}/>
          </Svg> : null}
          {/* the plane's thin stream drips, then stops */}
          {f >= 496 && f < CUES.stopped + 40 ? <Svg>
            <CoinStream f={f} a={496} b={CUES.stopped - 2} rate={0.2} x0={plane.x} y0={plane.y - 150} seed="drip" vx={[-0.6, 0.6]} vy={[0, 1]} g={0.7} r={[9, 13]} life={40}/>
          </Svg> : null}
          {/* red $0 drops in above the plane */}
          {f >= CUES.stopped + 17 && f < 720 ? (() => {
            const s = spr(f, CUES.stopped + 17, 9, 180), o = 1 - ease(f, 700, 716);
            return <div style={{position: "absolute", left: plane.x + 150, top: plane.y - 400 - (1 - s) * 160, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * s})`, opacity: o * clamp01(s * 2),
              fontFamily: FONT, fontWeight: 800, fontSize: 130, color: "#E5533F", textShadow: "0 6px 0 rgba(70,10,4,0.6), 0 0 40px rgba(229,83,63,0.45)"}}>$0</div>;
          })() : null}
        </AbsoluteFill>
        <AbsoluteFill style={{filter: calBlur > 0.2 ? `blur(${calBlur}px)` : undefined, opacity: calL}}>
          <Calendar f={f}/>
        </AbsoluteFill>
      </Layer>
      {/* ---- screen-space numbers and words ---- */}
      <Kinetic f={f} at={CUES.which} out={192} text="WHICH BROKE?" x={960} y={150} size={120}/>
      {f >= CUES.count && f < 474 ? (() => {
        const draw = (t: number) => {
          if (t < CUES.count) return null;
          const v = 816000000 * quartOut(ease(t, CUES.count, CUES.count + 38, (x) => x));
          const landed = t >= CUES.count + 38, s = spr(t, CUES.count, 12, 150);
          const shake = t >= CUES.oneYear ? 12 * Math.exp(-(t - CUES.oneYear) / 4) * Math.sin((t - CUES.oneYear) * 2.4) : 0;
          return <div style={{position: "absolute", left: 960 + shake, top: 150, transform: `translate(-50%, -50%) scale(${0.65 + 0.35 * s})`, opacity: clamp01(s * 2) * (1 - ease(t, 458, 470)),
            fontFamily: FONT, fontWeight: 800, fontSize: 150, letterSpacing: -3, fontVariantNumeric: "tabular-nums", color: landed ? "#FFE7A0" : "#F2C14E", whiteSpace: "nowrap",
            textShadow: `0 7px 0 rgba(90,50,10,0.7), 0 0 ${landed ? 60 : 30}px rgba(255,200,90,0.55)`}}>${fmtInt(v)}</div>;
        };
        return f < CUES.count + 40 ? <MBlur f={f} render={draw} samples={5} shutter={1.2}/> : draw(f);
      })() : null}
      {f >= CUES.oneYear && f < 474 ? (() => {
        const k = ease(f, CUES.oneYear, CUES.oneYear + 7, outCubic);
        return <div style={{position: "absolute", left: 960, top: 322, transform: `translate(-50%, -50%) scale(${2.3 - 1.3 * k}) rotate(${-4 * k}deg)`, opacity: clamp01(k * 3) * (1 - ease(f, 458, 470)),
          fontFamily: FONT, fontWeight: 800, fontSize: 58, letterSpacing: 3, color: "#3A1E08", background: "#FFD66B", padding: "10px 30px", borderRadius: 14,
          boxShadow: "0 8px 0 #A8741F, 0 20px 40px rgba(0,0,0,0.45)"}}>1 YEAR</div>;
      })() : null}
      <Kinetic f={f} at={CUES.why} out={CUES.sameCo - 4} text="WHY?" x={960} y={200} size={230} stagger={2}/>
      <Chip f={f} at={CUES.count + 2} until={462} text="BERKSHIRE LETTER · 2025"/>
      <Chip f={f} at={CUES.c02Plane + 30} until={780} text="BUFFETT'S LETTERS · 1989, 1994"/>
    </AbsoluteFill>
  );
};

// The whole room splits along a crack into a gold half and a grey half, which slide apart onto the fork in the path.
const SPLIT_L = "polygon(0 0, 1165px 0, 990px 1080px, 0 1080px)", SPLIT_R = "polygon(1165px 0, 1920px 0, 1920px 1080px, 990px 1080px)";
const PlinthWithSplit: React.FC<{f: number}> = ({f}) => {
  const whip = f >= 466 && f <= 486;
  const scene = whip ? <MBlur f={f} samples={5} shutter={1.6} render={(t) => <PlinthScene f={t}/>}/> : <PlinthScene f={f}/>;
  if (f < 786) return scene;
  const crack = ease(f, 786, 796), apart = ease(f, 796, 830, Easing.in(Easing.cubic));
  const tint = crack;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: SPLIT_L, transform: `translateX(${-1250 * apart}px) rotate(${-5 * apart}deg)`, transformOrigin: "0 100%"}}>
        <PlinthScene f={f}/>
        <AbsoluteFill style={{background: "linear-gradient(100deg, rgba(255,196,70,0.0), rgba(255,196,70,0.55))", mixBlendMode: "screen", opacity: tint}}/>
      </AbsoluteFill>
      <AbsoluteFill style={{clipPath: SPLIT_R, transform: `translateX(${1250 * apart}px) rotate(${5 * apart}deg)`, transformOrigin: "100% 100%", filter: `grayscale(${tint}) brightness(${1 - 0.25 * tint})`}}>
        <PlinthScene f={f}/>
      </AbsoluteFill>
      {apart < 0.6 ? <Svg>
        <line x1={990} y1={1080} x2={990 + 175 * crack} y2={1080 - 1080 * crack} stroke="#FFF1C8" strokeWidth={10} strokeLinecap="round" opacity={1 - apart * 1.6}/>
        <line x1={990} y1={1080} x2={990 + 175 * crack} y2={1080 - 1080 * crack} stroke="#FFD66B" strokeWidth={34} strokeLinecap="round" opacity={0.35 * (1 - apart * 1.6)}/>
      </Svg> : null}
    </AbsoluteFill>
  );
};

// ======================= FORK (end of c02) =======================
const ForkScene: React.FC<{f: number}> = ({f}) => {
  const cam = camAt(f, [[796, 1.12, 900, 590], [852, 2.8, 1090, 300, Easing.in(Easing.cubic)]]);
  const motes = particles("fork", 50);
  return (
    <AbsoluteFill>
      <Layer cam={cam}><Plate src="plates/fork.jpg"/>
        <Svg style={{mixBlendMode: "screen"}}>
          {motes.map((m, i) => <circle key={i} cx={200 + m.x * 1000} cy={1000 - ((m.y * 900 + f * (2 + m.s * 3)) % 900)} r={2 + m.r * 4} fill="#FFE9A8" opacity={0.6}/>)}
          <circle cx={1090} cy={180} r={420} fill="url(#k-glow)" opacity={0.5 + 0.4 * ease(f, 820, 850)}/>
        </Svg>
      </Layer>
    </AbsoluteFill>
  );
};

// ======================= CASTLE (c03) =======================
const INLETS = [[150, 690], [1745, 690]];
const RIGHT_PATH = [[1668, 400], [1462, 522]], LEFT_PATH = [[-80, 650], [214, 616]];
const CastleScene: React.FC<{f: number}> = ({f}) => {
  const cam = camAt(f, [[846, 1.62, 960, 336], [935, 1.12, 945, 596], [1058, 1.17, 945, 616], [1074, 1.2, 950, 452, Easing.in(Easing.quad)]]);
  const fill = ease(f, CUES.deepWater - 8, CUES.deepWater + 38, Easing.inOut(Easing.quad));
  const R = 30 + 1180 * fill;
  const mask = fill >= 1 ? undefined : INLETS.map(([x, y]) => `radial-gradient(ellipse ${R}px ${R * 0.45}px at ${x}px ${y}px, #000 88%, rgba(0,0,0,0) 100%)`).join(", ");
  const glints = (WATER as number[][]).slice(0, 110);
  const clouds = [[200, 120, 260], [900, 70, 340], [1500, 150, 280], [2200, 100, 300]];
  // soldiers: march to the bank, bump the water, hop back
  const march = ease(f, 976, 1012, (t) => t), back = ease(f, 1012, 1026, outCubic), retreat = ease(f, 1034, 1074, (t) => t);
  const soldiers = (path: number[][], n: number, s: number, dir: 1 | -1, seed: string) => Array.from({length: n}).map((_, k) => {
    const lag = k * 0.16, t = clamp01(march * (1 + lag) - lag);
    const [[x0, y0], [x1, y1]] = path;
    const bx = (x1 - x0), by = (y1 - y0), L = Math.hypot(bx, by);
    const hop = f >= 1012 ? -Math.sin(Math.PI * back) * 26 * s : 0;
    const off = (t - back * (40 / L) - retreat * 0.5) - k * (60 / L);
    const x = x0 + bx * off, y = y0 + by * off + hop;
    const facing: 1 | -1 = retreat > 0 ? (dir === 1 ? -1 : 1) : dir;
    return <Soldier key={seed + k} x={x} y={y} s={s} dir={facing} phase={f * 0.45 + k} o={clamp01((f - 970) / 6)}/>;
  });
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.55}><Plate src="plates/castle_wet.jpg"/>
        <Svg>{clouds.map(([x, y, w], i) => <ellipse key={i} cx={((x + (f - 846) * 1.8) % 2400) - 200} cy={y} rx={w} ry={w * 0.22} fill="#FFF3DA" opacity={0.35} style={{filter: "blur(18px)"}}/>)}
          {[0, 1, 2].map((i) => { const x = 300 + (f - 846) * 2.2 + i * 46, y = 170 + (i % 2) * 22, w = Math.sin(f * 0.45 + i) * 8;
            return <path key={i} d={`M ${x - 15} ${y + w * 0.6} Q ${x - 6} ${y - 4} ${x} ${y + 3} Q ${x + 6} ${y - 4} ${x + 15} ${y + w * 0.6}`} stroke="#5B4632" strokeWidth={3} fill="none" opacity={0.6}/>; })}
        </Svg>
      </Layer>
      <Layer cam={cam}>
        <Plate src="plates/castle_mid_dry.png"/>
        {fill > 0 ? <Img src={P("plates/castle_water.png")} style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, WebkitMaskImage: mask, maskImage: mask}}/> : null}
        <Svg>
          {/* foam along the moving water front */}
          {fill > 0 && fill < 1 ? (WATER as number[][]).map(([x, y], i) => {
            const near = Math.min(...INLETS.map(([ix, iy]) => Math.abs(Math.hypot((x - ix) / R, (y - iy) / (R * 0.45)) - 0.94)));
            return near < 0.07 ? <circle key={i} cx={x} cy={y} r={3 + 4 * random("fo" + i)} fill="#FFFFFF" opacity={0.85 * (1 - near / 0.07)}/> : null;
          }) : null}
          {/* splashes at the two inlets */}
          {f >= CUES.deepWater - 8 && f < CUES.deepWater + 30 ? INLETS.map(([ix, iy], j) => particles("spl" + j, 26).map((q, i) => {
            const age = f - (CUES.deepWater - 8) - q.s * 10; if (age < 0) return null;
            const vx = (q.x - 0.5) * 9 + (j === 0 ? 5 : -5), vy = -6 - q.y * 8;
            return <circle key={j + "-" + i} cx={ix + vx * age} cy={iy + vy * age + 0.45 * age * age} r={3 + q.r * 5} fill="#E8FBF6" opacity={clamp01(1 - age / 28)}/>;
          })) : null}
          {/* glints once full */}
          {fill > 0.6 ? glints.map(([x, y], i) => {
            const s = Math.max(0, Math.sin(f * 0.13 + i * 2.1)) ** 4;
            return s > 0.05 ? <g key={i} transform={`translate(${x} ${y})`} opacity={s * (fill - 0.6) * 2.5}><path d="M 0 -9 Q 1 -1 9 0 Q 1 1 0 9 Q -1 1 -9 0 Q -1 -1 0 -9 Z" fill="#FFFDF0"/></g> : null;
          }) : null}
          {/* little grey attackers */}
          {f >= 1012 && f < 1030 ? [[1462, 526], [214, 618]].map(([x, y], j) => particles("bump" + j, 10).map((q, i) => {
            const age = f - 1012; return <circle key={j + "b" + i} cx={x + (q.x - 0.5) * 6 * age} cy={y - 6 * age * q.y + 0.4 * age * age} r={2 + q.r * 3} fill="#E8FBF6" opacity={1 - age / 18}/>;
          })) : null}
          {/* ripples under MOAT */}
          {f >= CUES.moat - 20 ? [0, 1, 2].map((i) => { const k = ((f - CUES.moat + 20) / 36 + i / 3) % 1;
            return <ellipse key={i} cx={945} cy={866} rx={120 + 240 * k} ry={16 + 30 * k} fill="none" stroke="#FFFDF0" strokeWidth={3} opacity={(1 - k) * 0.7}/>; }) : null}
        </Svg>
        {f >= CUES.moat - 20 ? <div style={{position: "absolute", left: 945, top: 826, transform: "translate(-50%, -50%)", display: "flex", gap: 6}}>
          {"MOAT".split("").map((ch, i) => { const s = spr(f, CUES.moat - 20 + i * 4, 9, 140), bob = Math.sin(f * 0.12 + i) * 4;
            return <span key={i} style={{display: "inline-block", fontFamily: FONT, fontWeight: 800, fontSize: 132, color: "#FFF6E2", letterSpacing: 10,
              transform: `translateY(${(1 - s) * 90 + bob}px) rotate(${(1 - s) * (i % 2 ? 9 : -9)}deg)`, opacity: clamp01(s * 1.8),
              textShadow: "0 5px 0 #24707A, 0 14px 30px rgba(10,40,45,0.55)"}}>{ch}</span>; })}
        </div> : null}
      </Layer>
      <Layer cam={cam} depth={1.35}><Plate src="plates/castle_fg.png"/></Layer>
      {f >= 970 ? <Layer cam={cam}><Svg>{soldiers(RIGHT_PATH, 3, 0.85, -1, "r")}{soldiers(LEFT_PATH, 3, 1.15, 1, "l")}</Svg></Layer> : null}
      <AbsoluteFill>
        <Svg>{particles("pollen", 26).map((m, i) => <circle key={i} cx={(m.x * 2100 + (f - 846) * (1.2 + m.s * 2)) % 2100 - 90} cy={100 + m.y * 760 + Math.sin(f * 0.05 + m.p) * 20}
          r={2 + m.r * 5} fill="#FFF3C8" opacity={0.35 + 0.4 * Math.abs(Math.sin(f * 0.05 + m.p))}/>)}</Svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================= STREET (c04) =======================
const WINDOWS = [[210, 655, 115, 110], [465, 660, 150, 95], [785, 660, 80, 50], [1240, 665, 70, 60], [1560, 660, 165, 115]];
const BULBS = [[580, 30], [800, 85], [990, 115], [1170, 115], [790, 215], [878, 258], [960, 290], [1180, 282], [1240, 240], [935, 325], [1035, 328], [1133, 323], [672, 288], [1300, 200]];
const KEY_T = [CUES.test + 10, CUES.test + 20, CUES.test + 30];
const StreetScene: React.FC<{f: number}> = ({f}) => {
  const cam = camAt(f, [[1074, 3.16, 955, 400], [1116, 1.0, 960, 540, Easing.inOut(Easing.cubic)], [1236, 1.05, 930, 535], [1258, 1.16, 1085, 600], [1330, 1.2, 1115, 620], [1352, 1.12, 1060, 590], [1392, 1.14, 1075, 600], [1414, 1.06, 1010, 520], [1470, 1.1, 1045, 500]]);
  const lit = (i: number) => ease(f, CUES.street + i * 9, CUES.street + i * 9 + 10);
  const bright = 0.6 + 0.3 * ease(f, CUES.street, CUES.street + 50);
  const winMask = WINDOWS.map(([x, y, rx, ry], i) => `radial-gradient(ellipse ${rx * 1.25}px ${ry * 1.25}px at ${x}px ${y}px, rgba(0,0,0,${lit(i).toFixed(3)}) 60%, rgba(0,0,0,0) 100%)`).join(", ");
  const k = 0.38, castleO = 1 - ease(f, 1084, 1104);
  // keys
  const ring = {x: 820, y: 112}, leave = ease(f, 1230, 1248, Easing.in(Easing.cubic));
  // plane card
  const cardIn = spr(f, CUES.cPlane, 12, 150), crack = ease(f, CUES.mistake, CUES.mistake + 18), flip = ease(f, CUES.how - 2, CUES.how + 12, inOut);
  const toBoard = ease(f, CUES.how + 18, CUES.how + 48, inOut);
  const board = ease(f, CUES.how - 8, CUES.how + 10, outCubic);
  const cx = 1180 + (1690 - 1180) * toBoard, cy = 560 + (178 - 560) * toBoard, cs = (0.6 + 0.4 * cardIn) * (1 - 0.7 * toBoard);
  const coinsO = 1 - ease(f, CUES.how + 20, CUES.how + 40);
  return (
    <AbsoluteFill>
      <Layer cam={cam}>
        <Plate src="plates/street.jpg" style={{filter: `brightness(${bright}) saturate(${0.8 + 0.2 * bright})`}}/>
        <Img src={P("plates/street.jpg")} style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, filter: "brightness(1.15) saturate(1.1)", WebkitMaskImage: winMask, maskImage: winMask}}/>
        <Svg style={{mixBlendMode: "screen"}}>
          {WINDOWS.map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx * 1.6} ry={ry * 1.5} fill="url(#k-glow)" opacity={0.55 * lit(i) * (0.92 + 0.08 * Math.sin(f * 0.2 + i))}/>)}
          {BULBS.map(([x, y], i) => { const on = ease(f, CUES.street + 4 + i * 3, CUES.street + 8 + i * 3); return on > 0 ?
            <g key={i}><circle cx={x} cy={y + 6} r={34} fill="url(#k-glow)" opacity={on * (0.8 + 0.2 * Math.sin(f * 0.3 + i * 1.7))}/><circle cx={x} cy={y + 6} r={6} fill="#FFF8E0" opacity={on}/></g> : null; })}
        </Svg>
        {castleO > 0 ? <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0",
          transform: `translate(${955 - 950 * k}px, ${400 - 452 * k}px) scale(${k})`, opacity: castleO,
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 38%, #000 25%, rgba(0,0,0,0) 100%)", maskImage: "radial-gradient(ellipse 50% 50% at 50% 38%, #000 25%, rgba(0,0,0,0) 100%)"}}>
          <Plate src="plates/castle_wet.jpg"/>
        </div> : null}
      </Layer>
      <Layer cam={cam} depth={1.3}><Plate src="plates/street_fg.png" style={{filter: `brightness(${bright})`}}/></Layer>
      {/* three brass keys spin onto a ring: the three-question test */}
      {f >= KEY_T[0] - 14 && leave < 1 ? <Svg style={{transform: `translateY(${-420 * leave}px)`}}>
        <circle cx={ring.x} cy={ring.y} r={48} fill="none" stroke="url(#k-brass)" strokeWidth={9} opacity={ease(f, KEY_T[0] - 14, KEY_T[0] - 6)}/>
        {KEY_T.map((st, i) => {
          if (f < st - 14) return null;
          const t = ease(f, st - 14, st, Easing.out(Easing.quad)), ang = (i - 1) * 28;
          const hx = ring.x + 48 * Math.sin((ang * Math.PI) / 180), hy = ring.y + 48 * Math.cos((ang * Math.PI) / 180);
          const x = 2080 + (hx - 2080) * t, y = 620 + (hy - 620) * t - Math.sin(Math.PI * t) * 160;
          const pop = f >= st ? 1 + 0.18 * Math.exp(-(f - st) / 3) * Math.cos((f - st) * 1.3) : 1;
          return <BrassKey key={i} x={x} y={y} rot={-ang + Math.sin(f * 0.08 + i) * 3 * t} spinX={Math.cos((1 - t) * Math.PI * 4)} s={0.85 * pop}/>;
        })}
      </Svg> : null}
      {f >= KEY_T[2] + 2 && leave < 1 ? <div style={{transform: `translateY(${-420 * leave}px)`, position: "absolute", left: 0, top: 0}}>
        <Kinetic f={f} at={KEY_T[2] + 2} text="3 QUESTIONS" x={1180} y={176} size={66} stagger={2}/>
      </div> : null}
      {/* the plane card: cracks on "a mistake", flips to a glowing ? on "How?", then pins to the loop board */}
      {board > 0 ? <div style={{position: "absolute", left: 1690 - 175, top: 168 - 120 - (1 - board) * 320, width: 350, height: 240, borderRadius: 18,
        background: "radial-gradient(circle at 30% 30%, #D9A86C, #B88148)", border: "10px solid #6B4423", boxShadow: "0 18px 40px rgba(0,0,0,0.45)"}}>
        <Svg style={{width: 330, height: 220}}>{particles("cork", 70).map((q, i) => <circle key={i} cx={q.x * 330} cy={q.y * 220} r={1 + q.r * 2.2} fill="#8E5E2E" opacity={0.5}/>)}</Svg>
      </div> : null}
      {f >= CUES.cPlane ? <div style={{position: "absolute", left: cx, top: cy, width: 520, height: 340, transform: `translate(-50%, -50%) scale(${cs}) rotate(${-3 * (1 - toBoard) + 4 * toBoard + (f >= CUES.mistake && f < CUES.mistake + 14 ? 2.5 * Math.exp(-(f - CUES.mistake) / 4) * Math.sin((f - CUES.mistake) * 2.6) : 0)}deg)`, opacity: clamp01(cardIn * 2)}}>
        <div style={{position: "absolute", inset: 0, transform: `perspective(1400px) rotateY(${180 * flip}deg)`, transformStyle: "preserve-3d"}}>
          <div style={{position: "absolute", inset: 0, borderRadius: 24, overflow: "hidden", backfaceVisibility: "hidden", background: "linear-gradient(#EAF0EE, #FFF6E6)",
            border: "8px solid #FFF8EA", boxShadow: "0 24px 50px rgba(20,10,0,0.5)", filter: `grayscale(${0.65 * crack}) brightness(${1 - 0.15 * crack})`}}>
            <Img src={P("sprites/plane.png")} style={{position: "absolute", left: 60, top: 70 + Math.sin(f * 0.07) * 6, width: 390}}/>
            <Svg style={{width: 504, height: 324}}>
              <path d="M 0 0 L 120 110 L 92 168 L 240 196 L 300 280 L 430 268 L 504 324" fill="none" stroke="#3A2A1C" strokeWidth={11} pathLength={1} strokeDasharray={`${crack} 1`} strokeLinejoin="round" strokeLinecap="round"/>
              <path d="M 0 0 L 120 110 L 92 168 L 240 196 L 300 280 L 430 268 L 504 324" fill="none" stroke="#FFFFFF" strokeWidth={3} pathLength={1} strokeDasharray={`${crack} 1`} transform="translate(5 5)" opacity={0.8}/>
            </Svg>
          </div>
          <div style={{position: "absolute", inset: 0, borderRadius: 24, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "radial-gradient(circle at 50% 45%, #6B3A16, #3A1E0A)",
            border: "8px solid #FFF8EA", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(20,10,0,0.5)"}}>
            <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 230, color: "#FFE39A", lineHeight: 1,
              textShadow: `0 0 ${40 + 25 * Math.sin(f * 0.18)}px rgba(255,210,100,0.95), 0 0 90px rgba(255,180,60,0.6)`}}>?</div>
          </div>
        </div>
        {toBoard >= 1 ? <div style={{position: "absolute", left: 260 - 22, top: -26, width: 44, height: 44, borderRadius: 22, background: "radial-gradient(circle at 35% 35%, #FF8A70, #C33A24)",
          transform: `scale(${2.6 * spr(f, CUES.how + 48, 9, 200)})`, boxShadow: "0 4px 8px rgba(0,0,0,0.4)"}}/> : null}
      </div> : null}
      {/* "did not lose Berkshire's money": coins drop onto a stack that stays whole */}
      {f >= CUES.money && coinsO > 0 ? <Svg style={{opacity: coinsO}}>
        {Array.from({length: 7}).map((_, i) => {
          const st = CUES.money + i * 5, t = ease(f, st, st + 9, Easing.in(Easing.quad));
          if (f < st) return null;
          const y = 812 - i * 13 - (1 - t) * 420;
          return <StackCoin key={i} x={1540} y={y} r={44}/>;
        })}
        {f > CUES.money + 40 ? <rect x={1470 + ((f - CUES.money - 40) * 9) % 260 - 60} y={690} width={34} height={150} fill="#FFFBEA" opacity={0.35} transform="skewX(-20)"/> : null}
      </Svg> : null}
      <Chip f={f} at={CUES.test + 6} until={1236} text="OUR TEST"/>
      <Chip f={f} at={CUES.mistake} until={1480} text="BUFFETT'S LETTERS · 1994, 2007"/>
    </AbsoluteFill>
  );
};

// ======================= SOUND =======================
const near = (f: number) => {
  let d = 1e9;
  for (const [a, b] of VOICE) { if (f >= a && f <= b) return 0; d = Math.min(d, Math.abs(f - a), Math.abs(f - b)); }
  return d;
};
// bed ~-30 LUFS under the voice, +6 dB in gaps of 1.5 s or more (the ramp needs 15 frames of gap to open)
const musicVol = (f: number) => {
  const gap = near(f), open = clamp01((gap - 8) / 18);
  const v = 0.2 + 0.2 * open;
  return v * clamp01(f / 18) * (1 - ease(f, COLD_TOTAL - 30, COLD_TOTAL));
};
const SFX: [number, string, number][] = [
  [DROP[0] + 12, "sfx_pop_conarb13", 0.22], [DROP[1] + 12, "sfx_pop_conarb13", 0.22], [DROP[2] + 12, "sfx_pop_bubble_mafon2", 0.2],
  [CUES.paid + 8, "sfx_coin_pickup_davidsraba", 0.28], [CUES.oneYear, "sfx_coin_ding_greenvwbeetle", 0.38], [466, "sfx_whoosh_cartoony_branrainey", 0.35],
  [784, "sfx_whoosh_deep_kinoton", 0.45], [CUES.deepWater - 10, "sfx_splash_audiosmedia", 0.4], [1010, "sfx_splash_small_alegemaate", 0.18],
  [1072, "sfx_whoosh_cartoony_branrainey", 0.3], [KEY_T[2], "sfx_coin_pickup_davidsraba", 0.22], [CUES.money + 4, "sfx_coin_pickup_davidsraba", 0.25],
  [CUES.how, "sfx_pop_bubble_mafon2", 0.28],
];
const Sound: React.FC<{bed: string}> = ({bed}) => (
  <>
    <Audio src={P(bed)} volume={musicVol}/>
    {(["c01", "c02", "c03", "c04"] as const).map((b) => <Sequence key={b} from={VO[b]}><Audio src={P(`vo/${b}_n.wav`)}/></Sequence>)}
    {SFX.map(([at, n, v], i) => <Sequence key={i} from={at}><Audio src={P(`audio/${n}.wav`)} volume={v}/></Sequence>)}
  </>
);

// `bed` picks the music bed (props), so music options render identically except for the bed.
export const A01v3Cold: React.FC<{bed?: string}> = ({bed = "audio/music_01_bed.wav"}) => {
  const f = useCurrentFrame();
  const flash = Math.min(ease(f, 834, 848), 1 - ease(f, 848, 866));
  return (
    <AbsoluteFill style={{background: "#000", overflow: "hidden"}}>
      <KitDefs/>
      {f >= 796 && f < 852 ? <ForkScene f={f}/> : null}
      {f < 832 ? <PlinthWithSplit f={f}/> : null}
      {f >= 846 && f < 1080 ? <CastleScene f={f}/> : null}
      {f >= 1074 ? <StreetScene f={f}/> : null}
      {flash > 0 ? <AbsoluteFill style={{background: "radial-gradient(circle at 55% 30%, #FFFBEA, #FFE3A0 60%, #F6C66E)", opacity: flash}}/> : null}
      <Vignette strength={0.32} color="40,22,8"/>
      <Grain f={f} opacity={0.07} blend="soft-light"/>
      <Sound bed={bed}/>
    </AbsoluteFill>
  );
};
