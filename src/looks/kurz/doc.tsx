// KURZ look, "doc" scene (cards builder, 29 Oct 2026): {org, doc, quote, quoteKey, credit, creditKey?, label}.
// A drawn page hovers over a desk in a dim office; morning light falls through a window in a slow beam with dust. The quote line sits on the
// page in type; at at(quoteKey) a marker pen sweeps it with a glowing highlight, line by line. The credit pill appears at at(creditKey)
// (default: just after the sweep). The honesty label ("DRAWING, NOT THE ORDER'S PAGE") is visible from the first frame.
import React from "react";
import {AbsoluteFill} from "remotion";
import type {SceneProps} from "../cartoon/long/contract";
import type {DocSpec} from "../cartoon/long/scenes/nk_kit";
import {K, ROUND, SANS, easeIO} from "./kit";
import {Grain, Tag, clamp, drift, popIn, rng, wrapWords} from "./cards_kit";

const QPX = 62, PAGE = {x: 790, y: 172, w: 820, h: 630};

const Room: React.FC<{f: number}> = ({f}) => {
  const d = drift(f, 3), r = rng(77);
  const motes = Array.from({length: 40}, () => [r(), r(), r() * 6.28, 1.2 + r() * 2.4] as const);
  return <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
    <defs>
      <linearGradient id="kd-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={K.mid}/><stop offset="0.6" stopColor={K.deep}/><stop offset="1" stopColor={K.night}/></linearGradient>
      <linearGradient id="kd-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={K.yellowL} stopOpacity={0.28}/><stop offset="1" stopColor={K.yellowL} stopOpacity={0}/></linearGradient>
      <linearGradient id="kd-desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A4FB0"/><stop offset="1" stopColor={K.deep}/></linearGradient>
      <clipPath id="kd-bc"><path d="M 150 120 L 560 120 L 1500 1080 L 380 1080 Z"/></clipPath>
    </defs>
    <rect width={1920} height={1080} fill="url(#kd-wall)"/>
    {/* wall panels with a straight lit/shade cut */}
    <g transform={`translate(${d.x * 0.2} 0)`} opacity={0.5}>
      {[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={-40 + i * 420} y={-20} width={380} height={760} fill={K.deep} opacity={0.45}/>
        <path d={`M ${280 + i * 420} -20 L ${340 + i * 420} -20 L ${340 + i * 420} 740 L ${260 + i * 420} 740 Z`} fill={K.night} opacity={0.4}/></g>)}
    </g>
    {/* the window: frame, glow, bars */}
    <g transform={`translate(${d.x * 0.3} ${d.y * 0.3})`}>
      <rect x={150} y={120} width={410} height={330} rx={14} fill={K.orangeL} opacity={0.9}/>
      <rect x={150} y={120} width={410} height={330} rx={14} fill={K.yellowL} opacity={0.4 + 0.05 * Math.sin(f / 50)}/>
      <path d="M 150 340 Q 260 300 360 330 T 560 320 L 560 450 L 150 450 Z" fill={K.pink} opacity={0.5}/>
      <rect x={345} y={120} width={20} height={330} fill={K.deep}/><rect x={150} y={275} width={410} height={20} fill={K.deep}/>
      <rect x={136} y={106} width={438} height={358} rx={20} fill="none" stroke={K.deep} strokeWidth={22}/>
      <rect x={120} y={458} width={470} height={26} rx={8} fill={K.soft}/>
    </g>
    {/* the beam with dust */}
    <path d="M 150 120 L 560 120 L 1500 1080 L 380 1080 Z" fill="url(#kd-beam)"/>
    <g clipPath="url(#kd-bc)">
      {motes.map(([u, v, ph, rad], i) => { const x = 160 + u * 1300 + Math.sin(f / 40 + ph) * 20, y = 140 + ((v * 940 + f * (0.2 + u * 0.3)) % 940);
        return <circle key={i} cx={x} cy={y} r={rad} fill={K.yellowL} opacity={0.5 * (0.5 + 0.5 * Math.sin(f / 24 + ph)) * Math.sin(((y - 140) / 940) * Math.PI)}/>; })}
    </g>
    {/* the desk */}
    <path d="M -40 760 L 1960 740 L 1960 1080 L -40 1080 Z" fill="url(#kd-desk)"/>
    <path d="M -40 760 L 1960 740 L 1960 756 L -40 776 Z" fill={K.haze}/>
    <path d="M 380 1080 L 900 760 L 1180 757 L 1500 1080 Z" fill={K.yellowL} opacity={0.07}/>
    {/* desk props: folders, a glass of tea with steam */}
    <g transform={`translate(${d.x * 0.8} 0)`}>
      {/* a potted plant whose leaves sway */}
      <g transform="translate(150 768)">
        <ellipse cx={0} cy={4} rx={60} ry={10} fill="#000" opacity={0.3}/>
        {[-60, -35, -12, 10, 32, 58].map((a, i) => <g key={i} transform={`rotate(${a + Math.sin(f / 30 + i) * 4} 0 -70)`}>
          <path d="M 0 -70 Q -26 -150 0 -220 Q 26 -150 0 -70 Z" fill={i % 2 ? K.teal : K.tealD}/><path d="M 0 -70 Q 26 -150 0 -220 Z" fill={K.tealD} opacity={0.6}/></g>)}
        <path d="M -50 -76 L 50 -76 L 38 0 L -38 0 Z" fill={K.orange}/><path d="M 6 -76 L 50 -76 L 38 0 L 4 0 Z" fill={K.orangeD}/>
        <rect x={-56} y={-90} width={112} height={18} rx={6} fill={K.orangeL}/>
      </g>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(250 ${730 - i * 30})`}>
        <rect x={i * 8} y={0} width={330} height={34} rx={8} fill={[K.pink, K.yellow, K.purple][i]}/>
        <rect x={i * 8 + 200} y={0} width={130} height={34} rx={8} fill={[K.pinkD, K.orange, K.purpleD][i]}/>
        <rect x={i * 8 + 20} y={10} width={120} height={12} rx={6} fill={K.cream} opacity={0.75}/>
      </g>)}
      <g transform="translate(690 772)">
        <ellipse cx={0} cy={6} rx={44} ry={9} fill="#000" opacity={0.3}/>
        <path d="M -36 -100 L 36 -100 L 28 0 L -28 0 Z" fill={K.tealL} opacity={0.35}/>
        <path d="M -33 -70 L 33 -70 L 28 0 L -28 0 Z" fill={K.orangeD}/><path d="M 6 -70 L 33 -70 L 28 0 L 4 0 Z" fill="#9E520A"/>
        {[0, 1, 2].map((i) => { const k = ((f / 70 + i / 3) % 1), y = -110 - k * 120, o = Math.sin(k * Math.PI) * 0.45;
          return <path key={i} d={`M ${-14 + i * 14} ${y + 40} q ${12 + Math.sin(f / 20 + i) * 8} -20 0 -40`} fill="none" stroke={K.white} strokeWidth={6} strokeLinecap="round" opacity={o}/>; })}
      </g>
    </g>
  </svg>;
};

export const Scene: React.FC<SceneProps<DocSpec>> = ({f, dur, spec, at}) => {
  const qa = at(spec.quoteKey), d = drift(f, 1), t0 = popIn(f, 0, 80, 14);
  const lines = wrapWords(spec.quote, QPX, PAGE.w - 150, 0.56), per = 16;
  const sweepEnd = qa + per * lines.length;
  const ca = spec.creditKey ? at(spec.creditKey) : sweepEnd + 8, cT = popIn(f, ca, 140);
  const float = Math.sin(f / 34) * 7, lift = 1 + 0.025 * easeIO(f, qa - 10, qa + 30);
  const push = 1 + 0.05 * easeIO(f, 0, Math.max(dur, 150));
  const glow = clamp((f - sweepEnd) / 20, 0, 1);
  return <AbsoluteFill style={{background: K.night, overflow: "hidden"}}>
    <div style={{position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "58% 60%"}}>
      <Room f={f}/>
      {/* the page's shadow on the desk */}
      <div style={{position: "absolute", left: PAGE.x + 60, top: 770, width: PAGE.w - 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.35)", filter: "blur(16px)",
        transform: `scaleX(${0.9 - float / 200})`}}/>
      <div style={{position: "absolute", left: PAGE.x + d.x * 0.5, top: PAGE.y + d.y * 0.5, width: PAGE.w, height: PAGE.h,
        transform: `translateY(${(1 - t0) * 240 + float}px) rotate(${-2.2 + Math.sin(f / 60) * 0.4}deg) scale(${lift})`, opacity: Math.min(1, t0 * 1.4)}}>
        <div style={{position: "absolute", inset: 0, borderRadius: 24, background: K.cream, boxShadow: `30px 40px 0 rgba(0,0,0,0.22), 0 0 ${60 + glow * 50}px ${K.yellowL}${glow > 0 ? "44" : "22"}`, overflow: "hidden"}}>
          <div style={{position: "absolute", right: -60, top: -40, bottom: -40, width: 300, background: K.creamD, opacity: 0.45, transform: "skewX(-8deg)"}}/>
          <div style={{position: "absolute", left: 0, top: 0, right: 0, height: 12, background: K.deep}}/>
        </div>
        <div style={{position: "relative", padding: "50px 64px 0 70px"}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 38, color: K.deep, letterSpacing: 1.5, lineHeight: 1.1}}>{spec.org.toUpperCase()}</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: K.soft, marginTop: 10, lineHeight: 1.15}}>{spec.doc}</div>
          <div style={{height: 6, background: K.deep, margin: "24px 0 26px", borderRadius: 3, opacity: 0.8}}/>
          {[0, 1, 2].map((i) => <div key={i} style={{height: 14, width: `${92 - i * 9}%`, background: "#D9C29A", borderRadius: 7, marginBottom: 20}}/>)}
          <div style={{margin: "16px 0 26px"}}>
            {lines.map((ln, i) => { const u = clamp((f - qa - i * per) / per, 0, 1), e = u < 1 ? 1 - (1 - u) ** 2 : 1, active = u > 0 && u < 1;
              return <div key={i} style={{lineHeight: 1.2}}>
                <span style={{position: "relative", display: "inline-block", fontFamily: ROUND, fontWeight: 800, fontSize: QPX, color: K.deep, padding: "0 6px"}}>
                  <span style={{position: "absolute", left: -6, top: "8%", height: "88%", width: `calc(${e * 100}% + 12px)`, background: K.yellow, borderRadius: 10,
                    boxShadow: e > 0 ? `0 0 ${24 + 20 * glow}px ${K.yellow}` : undefined, opacity: e > 0 ? 0.95 : 0}}/>
                  <span style={{position: "relative"}}>{i === 0 ? "“" : ""}{ln}{i === lines.length - 1 ? "”" : ""}</span>
                  {active && <svg width={70} height={150} style={{position: "absolute", left: `calc(${e * 100}% - 10px)`, top: -90, overflow: "visible"}}>
                    <g transform="rotate(28 10 140)"><rect x={-6} y={40} width={34} height={100} rx={8} fill={K.orange}/><rect x={-6} y={40} width={34} height={22} rx={6} fill={K.orangeD}/>
                      <path d="M -2 140 L 24 140 L 18 156 L 4 156 Z" fill={K.yellow}/><rect x={14} y={60} width={14} height={80} fill={K.orangeD} opacity={0.6}/></g>
                  </svg>}
                </span>
              </div>; })}
          </div>
          {[3, 4, 5].map((i) => <div key={i} style={{height: 14, width: `${94 - (i * 17) % 30}%`, background: "#D9C29A", borderRadius: 7, marginBottom: 20}}/>)}
        </div>
        {/* a round seal with no emblem, and a signature stroke */}
        <svg width={PAGE.w} height={PAGE.h} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <g transform={`translate(${PAGE.w - 140} ${PAGE.h - 110}) rotate(-12)`} opacity={0.75}>
            <circle r={58} fill="none" stroke={K.pink} strokeWidth={7}/><circle r={44} fill="none" stroke={K.pink} strokeWidth={3} strokeDasharray="5 6"/>
            <path d="M -20 0 L 20 0 M 0 -20 L 0 20" stroke={K.pink} strokeWidth={6} strokeLinecap="round"/>
          </g>
          <path d={`M 80 ${PAGE.h - 80} q 30 -40 50 -6 t 50 -4 t 60 -10 q 20 -10 40 4`} fill="none" stroke={K.soft} strokeWidth={5} strokeLinecap="round" opacity={0.7}/>
        </svg>
      </div>
    </div>
    <div style={{position: "absolute", left: 96, top: 72}}><Tag text={spec.label} color={K.orange} size={34}/></div>
    <div style={{position: "absolute", left: 96, top: 842, opacity: Math.min(1, cT * 1.3), transform: `translateX(${(1 - cT) * -30}px)`}}>
      {cT > 0.001 && <Tag text={spec.credit} color={K.teal} size={34}/>}
    </div>
    <Grain id="kdc"/>
  </AbsoluteFill>;
};
