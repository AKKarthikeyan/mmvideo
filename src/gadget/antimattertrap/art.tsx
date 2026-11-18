// P02 antimatter trap: one animated scene per beat, in the night look (look.tsx). All positions are page coordinates (inside Safe).
// `fr` is the composition frame, `t` the time in seconds; cue frames come from the aligned narration (Short.tsx).
import React from "react";
import {FPS, HEAD, MONO, SERIF, W, H, ease, lin, usePop} from "../kit";
import {Bob, Electron, K, KHead, NameTag, Pill, Positron, Trap, bob, bump, clampN} from "./look";

const pulse = (t: number) => 0.5 + 0.5 * Math.sin(t * 3);

/** a card that pops in: calendar, quote */
export const Card: React.FC<{x: number; y: number; w: number; f0: number; rot?: number; children: React.ReactNode; from?: "pop" | "right"}> = ({x, y, w, f0, rot = 0, children, from = "pop"}) => {
  const pop = usePop(); const p = pop(f0, 13, 170);
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, boxSizing: "border-box", opacity: Math.min(1, p * 2.4), transformOrigin: "center",
      transform: from === "right" ? `translateX(${(1 - p) * 220}px) rotate(${rot}deg)` : `rotate(${rot + (1 - p) * 6}deg) scale(${0.7 + 0.3 * p})`}}>{children}</div>
  );
};

/** b01 and b08: the trap standing on the desk, the positron bobbing in its field. */
export const TrapScene: React.FC<{fr: number; t: number; calF0?: number; labelF0?: number; tagF0?: number; tagText?: string; tagKey?: number; cx?: number; cy?: number}> = ({fr, t, calF0, labelF0, tagF0, tagText = "", tagKey = 0, cx = 540, cy = 1020}) => {
  const dy = bob(t, 44, 2.6);
  const pop = usePop();
  const drop = tagF0 === undefined ? 0 : pop(tagF0, 11, 120);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <Trap cx={cx} cy={cy} s={1} t={t}>
          <Bob x={0} y={dy}/>
          <Positron x={0} y={dy} r={30} pulse={pulse(t)}/>
          {tagF0 !== undefined && <g transform={`translate(0 ${dy})`}><g transform={`scale(${tagKey ? Math.max(0.02, Math.abs(Math.cos(Math.PI * ease(fr, tagKey - 4, tagKey + 8)))) : 1} 1)`}><NameTag text={tagText} t={t} drop={drop} y={40}/></g></g>}
        </Trap>
        {labelF0 !== undefined && <path d={`M 292 ${cy - 5} L 480 ${cy + dy}`} stroke={K.cream} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" opacity={0.8 * Math.min(1, ease(fr, labelF0, labelF0 + 10))}/>}
      </svg>
      {labelF0 !== undefined && <Pill x={36} y={cy - 38} text="One positron" f0={labelF0} bg={K.amber} color={K.ink} size={28}/>}
      {calF0 !== undefined && (
        <Card x={704} y={410} w={290} f0={calF0} rot={4}>
          <div style={{borderRadius: 26, overflow: "hidden", background: K.cream, boxShadow: "0 18px 36px rgba(3,8,30,0.5)"}}>
            <div style={{background: K.coral, color: "#fff", fontFamily: MONO, fontWeight: 600, fontSize: 34, letterSpacing: 6, padding: "12px 0", textAlign: "center"}}>OCT</div>
            <div style={{fontFamily: HEAD, fontSize: 96, color: K.ink, textAlign: "center", lineHeight: 1.12, letterSpacing: -2}}>2026</div>
            <div style={{background: "#E3DCCF", color: K.cobalt2, fontFamily: MONO, fontWeight: 600, fontSize: 26, letterSpacing: 4, padding: "10px 0", textAlign: "center"}}>
              MONTHS <span style={{opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 6))}}>▸</span><span style={{opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 6 - 1))}}>▸</span><span style={{opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 6 - 2))}}>▸</span>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

/** b02: the container with no walls. Coils glow at "magnetic", caps at "electric", a ring marks "the middle", rings keep the walls away at "touching nothing". */
export const WallsScene: React.FC<{fr: number; t: number; wallsF: number; magF: number; elecF: number; midF: number; nothF: number}> = ({fr, t, wallsF, magF, elecF, midF, nothF}) => {
  const cx = 540, cy = 930, s = 1.18, dy = bob(t, 40, 2.6);
  const m = bump(fr, magF, 6, 26), e = bump(fr, elecF, 6, 26), mid = ease(fr, midF, midF + 10), no = ease(fr, nothF, nothF + 12);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <Trap cx={cx} cy={cy} s={s} t={t}>
          {/* magnetic: the two coils light up */}
          <rect x={-270} y={-150} width={540} height={74} rx={37} fill="none" stroke="#fff" strokeWidth={8} opacity={m * 0.9}/>
          <rect x={-270} y={76} width={540} height={74} rx={37} fill="none" stroke="#fff" strokeWidth={8} opacity={m * 0.9}/>
          {/* electric: the caps light up amber */}
          <rect x={-120} y={-304} width={240} height={32} rx={16} fill={K.amber} opacity={e}/>
          <rect x={-120} y={272} width={240} height={32} rx={16} fill={K.amber} opacity={e}/>
          {/* the middle */}
          <circle cx={0} cy={dy} r={92} fill="none" stroke={K.cream} strokeWidth={4} strokeDasharray="3 10" opacity={0.7 * mid * (1 - no)} transform={`rotate(${t * 20} 0 ${dy})`}/>
          {/* touching nothing: clear space all round */}
          <circle cx={0} cy={dy} r={150} fill="none" stroke={K.cyan} strokeWidth={3} strokeDasharray="2 14" strokeLinecap="round" opacity={0.6 * no}/>
          <Bob x={0} y={dy}/>
          <Positron x={0} y={dy} r={30} pulse={pulse(t)}/>
        </Trap>
      </svg>
      <Pill x={44} y={350} text="Magnet + electric field" f0={magF} bg={K.cobalt} color="#fff" size={24}/>
      <Card x={640} y={470} w={380} f0={wallsF} rot={-3}>
        <div style={{background: K.cream, borderRadius: 24, padding: "16px 24px 18px", boxShadow: "0 16px 32px rgba(3,8,30,0.5)"}}>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 40, lineHeight: 1.05, color: K.ink}}>“a container without walls”</div>
          <div style={{marginTop: 8, fontFamily: MONO, fontWeight: 500, fontSize: 18, letterSpacing: 2, color: "#5D678F", textTransform: "uppercase"}}>Gerald Gabrielse</div>
        </div>
      </Card>
    </>
  );
};

/** b03: Penning's 1936 gauge. A magnet bends the electrons into long loops; a dial reads almost-empty air. */
export const GaugeScene: React.FC<{fr: number; t: number; magF: number; measF: number; airF: number}> = ({fr, t, magF, measF, airF}) => {
  const mag = ease(fr, magF, magF + 14), need = ease(fr, measF, measF + 46, 52, -72);
  const poleT = 620 - 120 * (1 - mag), poleB = 1280 + 80 * (1 - mag);
  const els = Array.from({length: 9}, (_, i) => {
    const ph = i * 0.95, amp = 10 + 82 * mag;
    return [0, 1, 2, 3].map((k) => {
      const tt = t - k * 0.035;
      const yy = 1000 + 150 * Math.sin(1.15 * tt + ph * 1.7), xx = 540 + amp * Math.sin(7 * tt + ph);
      return <circle key={`${i}-${k}`} cx={xx} cy={yy} r={9 - k * 1.6} fill={K.cyan} opacity={(0.95 - k * 0.24)}/>;
    });
  });
  const ticks = Array.from({length: 9}, (_, i) => {
    const a = ((-120 + i * 30) * Math.PI) / 180;
    return <line key={i} x1={190 + 78 * Math.sin(a)} y1={1150 - 78 * Math.cos(a)} x2={190 + 92 * Math.sin(a)} y2={1150 - 92 * Math.cos(a)} stroke={K.ink} strokeWidth={5} strokeLinecap="round"/>;
  });
  return (
    <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
      {/* magnet poles slide in */}
      <rect x={330} y={poleT} width={420} height={100} rx={24} fill={K.coral}/>
      <text x={540} y={poleT + 72} textAnchor="middle" fontFamily={HEAD} fontSize={58} fill="#fff">N</text>
      <rect x={330} y={poleB} width={420} height={100} rx={24} fill={K.cobalt}/>
      <text x={540} y={poleB + 72} textAnchor="middle" fontFamily={HEAD} fontSize={58} fill="#fff">S</text>
      {[400, 540, 680].map((x) => <line key={x} x1={x} y1={724} x2={x} y2={1276} stroke={K.cyan} strokeWidth={4} strokeDasharray="12 18" strokeDashoffset={-t * 60} opacity={0.5 * mag}/>)}
      {/* the glass tube */}
      <rect x={350} y={750} width={380} height={500} rx={60} fill="url(#glass)" stroke={K.cyan} strokeOpacity={0.7} strokeWidth={5}/>
      <rect x={410} y={792} width={260} height={16} rx={8} fill={K.steel}/>
      <rect x={410} y={1192} width={260} height={16} rx={8} fill={K.steel}/>
      <ellipse cx={540} cy={1000} rx={150} ry={30} fill="none" stroke={K.amber} strokeWidth={8}/>
      {els}
      {/* wire and dial */}
      <path d="M 350 1120 C 320 1130 310 1140 292 1150" stroke={K.steel} strokeWidth={6} fill="none" strokeLinecap="round"/>
      <circle cx={190} cy={1150} r={108} fill={K.steelD}/>
      <circle cx={190} cy={1150} r={98} fill={K.cream}/>
      {ticks}
      <line x1={190} y1={1150} x2={190 + 74 * Math.sin((need * Math.PI) / 180)} y2={1150 - 74 * Math.cos((need * Math.PI) / 180)} stroke={K.coral} strokeWidth={7} strokeLinecap="round"/>
      <circle cx={190} cy={1150} r={10} fill={K.ink}/>
      <text x={190} y={1218} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={3} fill={K.cream} opacity={0.9}>PRESSURE</text>
      <text x={190} y={1286} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={26} letterSpacing={3} fill={K.amber} opacity={clampN(ease(fr, airF, airF + 10))}>ALMOST EMPTY</text>
    </svg>
  );
};

/** b04: the blackboard dot, then the electron held in a trap built from the gauge. */
export const BoardScene: React.FC<{fr: number; t: number; boardF: number; typeF: number; moveF: number; nameF: number}> = ({fr, t, boardF, typeF, moveF, nameF}) => {
  const pop = usePop(); const bp = pop(boardF, 13, 150);
  const txt = "Here is an electron…";
  const n = Math.max(0, Math.min(txt.length, Math.floor(((fr - typeF) / FPS) * 14)));
  const u = ease(fr, moveF, moveF + 26);
  const tIn = ease(fr, moveF - 8, moveF + 8);
  const dyT = bob(t, 44, 2.6) * 0.56;
  const P0 = [236, 612], P1 = [520, 700], P2 = [540, 1130 + dyT];
  const ex = (1 - u) * (1 - u) * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0];
  const ey = (1 - u) * (1 - u) * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1];
  const boardUp = ease(fr, moveF + 10, moveF + 30);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <g transform={`translate(0 ${-bp * 0 - boardUp * 40}) scale(${0.85 + 0.15 * bp})`} opacity={Math.min(1, bp * 2) * (1 - boardUp * 0.55)} style={{transformOrigin: "540px 600px"}}>
          <rect x={64} y={420} width={952} height={380} rx={26} fill="#1B3944" stroke="#9B6B3E" strokeWidth={18}/>
          <rect x={78} y={434} width={924} height={352} rx={16} fill="none" stroke="#fff" strokeOpacity={0.07} strokeWidth={3}/>
          <rect x={150} y={792} width={190} height={14} rx={6} fill="#E7DCC8" opacity={0.8}/>
          {fr < moveF && (
            <g>
              <circle cx={236} cy={612} r={34} fill="#fff" opacity={0.08 + 0.04 * Math.sin(t * 4)}/>
              <circle cx={236} cy={612} r={15} fill="#fff"/>
            </g>
          )}
          <text x={300} y={640} fontFamily={SERIF} fontStyle="italic" fontSize={76} fill={K.cream}>{txt.slice(0, n)}</text>
        </g>
        <Trap cx={540} cy={1130} s={0.56} t={t} o={tIn}/>
        {fr >= moveF && <Electron x={ex} y={ey} r={u < 1 ? 17 : 17}/>}
      </svg>
      <div style={{position: "absolute", left: 70, top: 826, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 3, color: K.cream, opacity: 0.75 * Math.min(1, bp * 2) * (1 - boardUp), textTransform: "uppercase"}}>Dehmelt, recalling his teacher</div>
      <Pill x={660} y={1010} text="Penning trap" f0={nameF} bg={K.amber} color={K.ink} size={28}/>
    </>
  );
};

/** b05: Priscilla. The b01 picture again, 42 years earlier, with a name tag. */
export const PriscillaScene: React.FC<{fr: number; t: number; twinF: number; datF: number; quoteF: number; tagF: number; threeF: number}> = ({fr, t, twinF, datF, quoteF, tagF, threeF}) => {
  const pop = usePop(); const drop = pop(tagF, 11, 120);
  const cx = 330, cy = 1100, s = 0.8, dy = bob(t, 30, 2.6);
  const u = lin(fr, twinF, twinF + 70);
  const tx = -170 + u * 300, ty = -260 + 170 * u + 40 * Math.sin(u * 3.1);
  const n = fr < threeF ? 0 : Math.min(3, Math.floor((fr - threeF) / 6) + 1);
  const np = pop(threeF + 6 * Math.max(0, n - 1), 10, 220);
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <Trap cx={cx} cy={cy} s={s} t={t}>
          {u > 0 && u < 1 && <Positron x={tx} y={ty} r={20} ghost/>}
          <path d="M -62 -10 A 70 70 0 0 1 62 -10" stroke={K.cream} strokeWidth={4} strokeDasharray="3 12" strokeLinecap="round" fill="none" opacity={0.6} transform={`rotate(${t * 60} 0 ${dy + 10})`}/>
          <path d="M 62 40 A 70 70 0 0 1 -62 40" stroke={K.cream} strokeWidth={4} strokeDasharray="3 12" strokeLinecap="round" fill="none" opacity={0.6} transform={`rotate(${t * 60} 0 ${dy + 10})`}/>
          <Positron x={0} y={dy + 10} r={30} pulse={pulse(t)}/>
          <g transform={`translate(0 ${dy})`}><NameTag text="PRISCILLA" t={t} drop={drop} y={50}/></g>
        </Trap>
      </svg>
      <Pill x={578} y={318} text="Seattle · Sep 15, 1984" f0={datF} bg={K.amber} color={K.ink} size={27}/>
      <Card x={578} y={420} w={440} f0={quoteF} from="right">
        <div style={{background: K.cream, borderRadius: 30, padding: "22px 30px 24px", boxShadow: "0 18px 36px rgba(3,8,30,0.5)"}}>
          <div style={{fontFamily: HEAD, fontSize: 86, lineHeight: 0.7, color: K.amber, height: 44}}>“</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 37, lineHeight: 1.08, color: K.ink}}>
            Here, right now, in the center of our Penning trap resides positron Priscilla … executing simple spontaneous <span style={{color: K.cobalt2}}>ballet routines</span> for the last 3 months!
          </div>
          <div style={{marginTop: 14, fontFamily: MONO, fontWeight: 500, fontSize: 19, letterSpacing: 2, color: "#5D678F", textTransform: "uppercase"}}>Dehmelt, quoting the lab, 1988</div>
        </div>
      </Card>
      {n > 0 && (
        <div style={{position: "absolute", left: 578, top: 900, fontFamily: HEAD, color: K.amber, lineHeight: 0.8, textShadow: "0 6px 0 rgba(5,10,40,0.45)"}}>
          <span style={{display: "inline-block", fontSize: 230, transform: `scale(${0.8 + 0.2 * np})`, transformOrigin: "left bottom"}}>{n}</span>
          <span style={{fontFamily: HEAD, fontSize: 70, color: "#fff", marginLeft: 20, textTransform: "uppercase", opacity: n >= 3 ? 1 : 0.35}}>months</span>
          <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: K.cream, marginTop: 22, textTransform: "uppercase", textShadow: "none"}}>in the trap</div>
        </div>
      )}
    </>
  );
};

/** b06 and b07: the energy staircase. The positron hops up one step when the microwaves nudge it; frost sparkles mark the cold. */
export const StairsScene: React.FC<{fr: number; t: number; showF: number; coldF: number; nudgeF: number; backF: number; ladderF: number}> = ({fr, t, showF, coldF, nudgeF, backF, ladderF}) => {
  const base = 1130, sx = (i: number) => 90 + i * 218, sy = (i: number) => base - i * 150;
  const q = ease(fr, nudgeF, nudgeF + 12) - ease(fr, backF, backF + 14);
  const hop = 70 * 4 * q * (1 - q);
  const x = sx(0) + 100 + q * 218, y = sy(0) - 50 - q * 150 - hop;
  const wig = bump(fr, nudgeF - 2, 4, 22);
  const frost = ease(fr, coldF, coldF + 12);
  const sparks = Array.from({length: 7}, (_, k) => {
    const a = k * 0.9 + t * 0.4, r = 70 + 18 * Math.sin(t * 2 + k * 2);
    return <path key={k} d="M -9 0 H 9 M 0 -9 V 9" stroke={K.cyan} strokeWidth={4} strokeLinecap="round" opacity={frost * (0.4 + 0.6 * Math.abs(Math.sin(t * 3 + k)))} transform={`translate(${200 + 260 * Math.cos(a) * 0.45},${1010 + 70 * Math.sin(a)})`}/>;
  });
  return (
    <>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} opacity={ease(fr, showF + i * 3, showF + 14 + i * 3)}>
            <ellipse cx={sx(i) + 100} cy={sy(i) + 26} rx={104} ry={14} fill={K.cobalt} opacity={0.28}/>
            <rect x={sx(i)} y={sy(i)} width={200} height={30} rx={15} fill="url(#step)"/>
            <rect x={sx(i)} y={sy(i)} width={200} height={8} rx={4} fill="#9DB1FF"/>
          </g>
        ))}
        {sparks}
        {fr < nudgeF + 6 && <g opacity={ease(fr, showF + 6, showF + 16)}><Positron x={sx(1) + 100} y={sy(1) - 50} r={26} ghost/></g>}
        {wig > 0.02 && <path d={`M ${x - 70} ${y - 74} q 14 -26 28 0 t 28 0 t 28 0`} stroke={K.cyan} strokeWidth={6} fill="none" strokeLinecap="round" opacity={wig} transform={`translate(${Math.sin(t * 30) * 3} 0)`}/>}
        <g opacity={ease(fr, showF - 2, showF + 8)}><Positron x={x} y={y} r={32} pulse={pulse(t)}/></g>
        <text x={sx(0)} y={sy(0) + 62} fontFamily={MONO} fontWeight={600} fontSize={22} letterSpacing={3} fill={K.cream} opacity={ease(fr, coldF + 8, coldF + 18)}>LOWEST STATE</text>
      </svg>
      <Pill x={44} y={700} text="156 GHz microwave · one step" f0={nudgeF} bg={K.cobalt} color="#fff" size={22}/>
      <Pill x={44} y={782} text="0.3 K" f0={coldF} bg={K.cyan} color={K.ink} size={30}/>
      <div style={{position: "absolute", left: 44, top: 868, fontFamily: MONO, fontWeight: 500, fontSize: 20, letterSpacing: 3, color: K.cream, opacity: 0.7 * ease(fr, coldF + 6, coldF + 16), textTransform: "uppercase"}}>almost absolute zero</div>
    </>
  );
};

/** b07: the PUBLISHED stamp slams down, then the ladder shows where the claim stands. */
export const StampScene: React.FC<{fr: number; pubF: number; testF: number; notF: number}> = ({fr, pubF, testF, notF}) => {
  const pop = usePop(); const p = pop(pubF, 9, 260);
  const rungs: [string, "done" | "lit" | "off"][] = [["✓ Claimed", "done"], ["Published", "lit"], ["Repeated", "off"], ["On sale", "off"]];
  const burst = ease(fr, pubF + 2, pubF + 16);
  const shake = notF <= fr && fr < notF + 10 ? 6 * Math.sin((fr - notF) * 2.6) * (1 - (fr - notF) / 10) : 0;
  return (
    <>
      <div style={{position: "absolute", left: 96, top: 112, transform: `rotate(${-5 + (1 - p) * 8}deg) scale(${1.9 - 0.9 * p})`, opacity: Math.min(1, p * 3)}}>
        <div style={{background: K.cobalt, borderRadius: 30, padding: "14px 44px 22px", boxShadow: "0 22px 44px rgba(3,8,30,0.55)", border: `10px solid ${K.cream}`, outline: `6px solid ${K.cobalt}`}}>
          <div style={{fontFamily: HEAD, fontSize: 134, letterSpacing: 4, color: "#fff", lineHeight: 1.05}}>PUBLISHED</div>
        </div>
      </div>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        {Array.from({length: 14}, (_, k) => {
          const a = (k / 14) * Math.PI * 2, r0 = 150 + 330 * burst, r1 = r0 + 40 * (1 - burst);
          return <line key={k} x1={540 + r0 * Math.cos(a) * 1.2} y1={310 + r0 * Math.sin(a) * 0.38} x2={540 + r1 * Math.cos(a) * 1.2} y2={310 + r1 * Math.sin(a) * 0.38} stroke={K.cream} strokeWidth={5} strokeLinecap="round" opacity={(1 - burst) * (burst > 0 ? 1 : 0)}/>;
        })}
      </svg>
      {rungs.map(([tx, st], i) => (
        <Pill key={tx} x={30 + i * 252} y={392} w={238} text={tx} size={22} f0={pubF + 8 + i * 3}
          bg={st === "lit" ? K.cyan : K.cream} color={st === "lit" ? K.ink : st === "done" ? "#6E7CB0" : K.mute} dashed={st === "off"}/>
      ))}
      <div style={{position: "absolute", left: 34, top: 472, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 3, color: K.mute, opacity: ease(fr, pubF + 18, pubF + 28), textTransform: "uppercase"}}>Peer-reviewed device paper · Oct 2026</div>
      <Pill x={44} y={1262} w={760} text="Positron vs electron: not measured yet" f0={notF} color={K.amber} size={28} dashed shake={shake}/>
    </>
  );
};
export {KHead, lin};
