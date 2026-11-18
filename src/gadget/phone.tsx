// A generic slab phone drawn in code (no product photos): back, front, side and bottom views, driven by keyframes so the
// same phone stays on screen and morphs between beats. Proportions: 400 x 870 units ~ 77 x 168 mm.
import React from "react";
import {Easing, interpolate} from "remotion";
import {C, HEAD, MONO} from "./kit";

export type Tone = {light: string; mid: string; dark: string; name: string};
export type View = "back" | "front" | "side" | "bottom";
export type Screen = "home" | "off" | "charge" | "grid";
export type PState = {x: number; y: number; s: number; r: number; view: View; tone: Tone; o: number; screen: Screen; level?: number; tilt?: number};

const PW = 400, PH = 870, THICK = 47.5, RX = 58;

const Back: React.FC<{t: Tone; id: string}> = ({t, id}) => (
  <svg viewBox={`0 0 ${PW} ${PH}`} width={PW} height={PH} style={{overflow: "visible"}}>
    <defs>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={t.light}/><stop offset="0.55" stopColor={t.mid}/><stop offset="1" stopColor={t.dark}/></linearGradient>
      <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0.6"><stop offset="0" stopColor="#fff" stopOpacity="0.45"/><stop offset="0.35" stopColor="#fff" stopOpacity="0.06"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
      <radialGradient id={`${id}l`} cx="0.38" cy="0.35" r="0.75"><stop offset="0" stopColor="#3B4A6E"/><stop offset="0.45" stopColor="#0E1220"/><stop offset="1" stopColor="#020203"/></radialGradient>
    </defs>
    <rect x="0" y="0" width={PW} height={PH} rx={RX} fill={`url(#${id}b)`}/>
    <rect x="0" y="0" width={PW} height={PH} rx={RX} fill={`url(#${id}g)`}/>
    <rect x="3" y="3" width={PW - 6} height={PH - 6} rx={RX - 3} fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="4"/>
    <rect x="34" y="34" width="150" height="262" rx="75" fill={t.mid} stroke="#fff" strokeOpacity="0.5" strokeWidth="5"/>
    <rect x="34" y="34" width="150" height="262" rx="75" fill={`url(#${id}g)`}/>
    {[109, 221].map((cy) => (
      <g key={cy}>
        <circle cx="109" cy={cy} r="58" fill="#1B1C1F" stroke="#C9CDD3" strokeWidth="6"/>
        <circle cx="109" cy={cy} r="40" fill={`url(#${id}l)`}/>
        <circle cx="109" cy={cy} r="20" fill="none" stroke="#5C6B92" strokeOpacity="0.5" strokeWidth="3"/>
        <ellipse cx="96" cy={cy - 14} rx="10" ry="6" fill="#fff" opacity="0.55"/>
      </g>
    ))}
    <rect x="204" y="78" width="34" height="58" rx="17" fill="#F4EFD8" stroke="#C9C2A8" strokeWidth="3"/>
  </svg>
);

const HomeScreen: React.FC<{t: Tone; id: string}> = ({t, id}) => (
  <g>
    <defs>
      <linearGradient id={`${id}w`} x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor={t.light}/><stop offset="1" stopColor="#FBF8F3"/></linearGradient>
    </defs>
    <rect x="0" y="0" width={PW} height={PH} fill={`url(#${id}w)`}/>
    <text x="34" y="44" fontFamily={MONO} fontSize="18" fill={C.ink} fontWeight="600">10:30</text>
    <rect x="318" y="30" width="38" height="17" rx="4" fill="none" stroke={C.ink} strokeWidth="2.5"/><rect x="321" y="33" width="26" height="11" rx="2" fill={C.ink}/>
    <text x={PW / 2} y="230" textAnchor="middle" fontFamily={HEAD} fontSize="104" fill={C.ink}>10:30</text>
    <text x={PW / 2} y="272" textAnchor="middle" fontFamily={MONO} fontSize="20" letterSpacing="3" fill={C.ink2}>WED, 21 OCT</text>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={46 + i * 82} y="690" width="62" height="62" rx="20" fill="#fff" stroke={C.ink} strokeOpacity="0.12" strokeWidth="2"/>
    ))}
    {[0, 1, 2, 3].map((i) => (
      <circle key={"c" + i} cx={77 + i * 82} cy="721" r="13" fill={[t.dark, C.accent, t.mid, C.ink2][i]} opacity="0.85"/>
    ))}
    <rect x="46" y="780" width="308" height="50" rx="25" fill="#fff" stroke={C.ink} strokeOpacity="0.12" strokeWidth="2"/>
  </g>
);

const Front: React.FC<{t: Tone; id: string; screen: Screen; level: number}> = ({t, id, screen, level}) => (
  <svg viewBox={`0 0 ${PW} ${PH}`} width={PW} height={PH} style={{overflow: "visible"}}>
    <defs><clipPath id={`${id}c`}><rect x="16" y="16" width={PW - 32} height={PH - 32} rx="44"/></clipPath></defs>
    <rect x="0" y="0" width={PW} height={PH} rx={RX} fill="#0E0E10" stroke={t.mid} strokeWidth="6"/>
    <g clipPath={`url(#${id}c)`}>
      <g transform={`translate(0,0)`}>
        {screen === "home" && <HomeScreen t={t} id={id}/>}
        {screen === "off" && <rect width={PW} height={PH} fill="#09090B"/>}
        {screen === "charge" && (
          <g>
            <rect width={PW} height={PH} fill="#0B0C10"/>
            <rect x="120" y="330" width="160" height="290" rx="26" fill="none" stroke="#E9E4DC" strokeWidth="8"/>
            <rect x="170" y="312" width="60" height="22" rx="6" fill="#E9E4DC"/>
            <rect x="134" y={344 + 262 * (1 - level)} width="132" height={262 * level} rx="16" fill={C.accent}/>
            <text x={PW / 2} y="700" textAnchor="middle" fontFamily={HEAD} fontSize="56" fill="#E9E4DC">{Math.round(level * 100)}%</text>
          </g>
        )}
        {screen === "grid" && <HomeScreen t={t} id={id}/>}
      </g>
      <polygon points={`16,16 ${PW * 0.55},16 16,${PH * 0.45}`} fill="#fff" opacity="0.06"/>
    </g>
    <path d={`M ${PW / 2 - 34} 16 Q ${PW / 2 - 16} 16 ${PW / 2 - 14} 30 A 14 14 0 0 0 ${PW / 2 + 14} 30 Q ${PW / 2 + 16} 16 ${PW / 2 + 34} 16 Z`} fill="#0E0E10"/>
  </svg>
);

const Side: React.FC<{t: Tone; id: string}> = ({t, id}) => (
  <svg viewBox={`0 0 ${THICK + 12} ${PH}`} width={THICK + 12} height={PH} style={{overflow: "visible"}}>
    <defs><linearGradient id={`${id}s`} x1="0" x2="1"><stop offset="0" stopColor={t.dark}/><stop offset="0.45" stopColor={t.light}/><stop offset="1" stopColor={t.dark}/></linearGradient></defs>
    <rect x="0" y="0" width={THICK} height={PH} rx="22" fill={`url(#${id}s)`}/>
    <rect x={THICK - 2} y="210" width="8" height="130" rx="4" fill={t.mid}/>
    <rect x={THICK - 2} y="380" width="9" height="86" rx="4" fill={t.dark}/>
  </svg>
);

const Bottom: React.FC<{t: Tone; id: string}> = ({t, id}) => (
  <svg viewBox={`0 0 ${PW} ${THICK}`} width={PW} height={THICK} style={{overflow: "visible"}}>
    <defs><linearGradient id={`${id}e`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={t.dark}/><stop offset="0.45" stopColor={t.light}/><stop offset="1" stopColor={t.dark}/></linearGradient></defs>
    <rect x="0" y="0" width={PW} height={THICK} rx="22" fill={`url(#${id}e)`}/>
    <circle cx="74" cy={THICK / 2} r="11" fill="#131315" stroke="#2A2A2E" strokeWidth="3"/>
    <circle cx="130" cy={THICK / 2} r="3" fill="#131315"/>
    <rect x="172" y={THICK / 2 - 8} width="56" height="16" rx="8" fill="#131315"/>
    {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={268 + i * 13} cy={THICK / 2} r="4" fill="#131315"/>)}
  </svg>
);

export const Phone: React.FC<{st: PState; id?: string}> = ({st, id = "ph"}) => {
  if (st.o <= 0.001) return null;
  const sizes = {back: [PW, PH], front: [PW, PH], side: [THICK + 12, PH], bottom: [PW, THICK]} as const;
  const [w, h] = sizes[st.view];
  return (
    <div style={{position: "absolute", left: st.x - w / 2, top: st.y - h / 2, width: w, height: h, opacity: st.o,
      transform: `rotate(${st.r}deg) scale(${st.s}) scaleX(${st.tilt ?? 1})`, filter: "drop-shadow(0 40px 46px rgba(40,30,20,0.28)) drop-shadow(0 8px 10px rgba(40,30,20,0.18))"}}>
      {st.view === "back" && <Back t={st.tone} id={id}/>}
      {st.view === "front" && <Front t={st.tone} id={id} screen={st.screen} level={st.level ?? 0}/>}
      {st.view === "side" && <Side t={st.tone} id={id}/>}
      {st.view === "bottom" && <Bottom t={st.tone} id={id}/>}
    </div>
  );
};
export const PHONE = {PW, PH, THICK};

/** keyframed phone: each key holds from its frame on; moving to it takes `d` frames. A change of view flips the phone
 * (scaleX through zero) halfway through the move. */
export type Key = Partial<PState> & {f: number; d?: number};
export const phoneAt = (keys: Key[], fr: number, base: PState): PState => {
  const ks = [...keys].sort((a, b) => a.f - b.f);
  let cur: PState = {...base};
  for (let i = 0; i < ks.length; i++) {
    const k = ks[i]; if (fr < k.f) break;
    const d = k.d ?? 14; const p = interpolate(fr, [k.f, k.f + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.65, 0, 0.35, 1)});
    const prev = cur; const tgt: PState = {...prev, ...k} as PState;
    const mix = (a: number, b: number) => a + (b - a) * p;
    const flip = tgt.view !== prev.view || tgt.tone.name !== prev.tone.name;
    cur = {...tgt, x: mix(prev.x, tgt.x), y: mix(prev.y, tgt.y), s: mix(prev.s, tgt.s), r: mix(prev.r, tgt.r), o: mix(prev.o, tgt.o),
      level: mix(prev.level ?? 0, tgt.level ?? 0),
      view: flip && p < 0.5 ? prev.view : tgt.view, tone: flip && p < 0.5 ? prev.tone : tgt.tone, screen: p < 0.5 ? prev.screen : tgt.screen,
      tilt: flip ? Math.abs(Math.cos(p * Math.PI)) : 1};
  }
  return cur;
};
