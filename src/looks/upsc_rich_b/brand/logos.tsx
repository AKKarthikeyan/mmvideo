import React from "react";
import {AbsoluteFill} from "remotion";
import {Fonts, SERIF, SANS} from "../kit";
import {C, Relief, ReliefDefs, Cloud, Pencil, Grain} from "./art";

const Disc: React.FC<{id: string; a?: string; b?: string}> = ({id, a = "#fffaf0", b = "#f0dcb2"}) => (
  <>
    <defs><radialGradient id={`${id}-bg`} cx="38%" cy="30%" r="85%"><stop offset="0" stopColor={a}/><stop offset="1" stopColor={b}/></radialGradient></defs>
    <rect width={800} height={800} fill={`url(#${id}-bg)`}/>
  </>
);

/** LOGO 1 artwork: open notebook, right page a small atlas relief with a cloud, a pencil across. 800 x 800 box. */
export const Logo1Art: React.FC<{id: string}> = ({id}) => {
  const L = "M128,262 C230,238 330,252 392,292 L392,614 C330,576 230,566 128,586Z";
  const R = "M408,292 C470,252 570,238 672,262 L672,586 C570,566 470,576 408,614Z";
  return (
    <g>
      <defs>
        <clipPath id={`${id}-cr`}><path d={R}/></clipPath>
        <ReliefDefs id={`${id}-m`}/>
        <linearGradient id={`${id}-pg`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f4e6c6"/><stop offset=".85" stopColor="#fffaf0"/><stop offset="1" stopColor="#e9d6ad"/></linearGradient>
        <linearGradient id={`${id}-pg2`} x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#f4e6c6"/><stop offset=".85" stopColor="#fffaf0"/><stop offset="1" stopColor="#e9d6ad"/></linearGradient>
      </defs>
      <ellipse cx={400} cy={650} rx={300} ry={34} fill="#3a2412" opacity={0.2}/>
      {/* cover */}
      <path d="M104,282 C220,252 330,266 400,312 C470,266 580,252 696,282 L696,610 C580,582 470,596 400,640 C330,596 220,582 104,610Z" fill={C.teal} stroke={C.tealD} strokeWidth={6} strokeLinejoin="round"/>
      <path d="M104,610 C220,582 330,596 400,640 C470,596 580,582 696,610 L696,626 C580,598 470,612 400,656 C330,612 220,598 104,626Z" fill={C.tealD}/>
      {/* page stack edge */}
      <path d="M118,578 C230,558 330,568 392,606 L392,620 C330,584 230,574 118,594Z" fill="#e8d5aa" stroke="#b9a070" strokeWidth={2}/>
      <path d="M682,578 C570,558 470,568 408,606 L408,620 C470,584 570,574 682,594Z" fill="#e8d5aa" stroke="#b9a070" strokeWidth={2}/>
      {/* left page, ruled */}
      <path d={L} fill={`url(#${id}-pg)`} stroke="#b08a52" strokeWidth={3}/>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M162,${318 + i * 42} C240,${300 + i * 42} 320,${314 + i * 42} 372,${346 + i * 42}`} stroke={C.tealL} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.75}/>
      ))}
      <path d="M150,276 L150,582" stroke={C.brick} strokeWidth={4} opacity={0.5}/>
      {/* right page: relief */}
      <path d={R} fill={`url(#${id}-pg2)`} stroke="#b08a52" strokeWidth={3}/>
      <g clipPath={`url(#${id}-cr)`}>
        <Relief id={`${id}-m`} x={400} y={236} w={290} h={400} seed={9} detail={1.8}/>
        <Cloud id={`${id}-c`} x={548} y={340} s={0.7} rain/>
      </g>
      <path d={R} fill="none" stroke="#b08a52" strokeWidth={3}/>
      {/* spine shadow */}
      <path d="M392,292 L408,292 L408,614 L392,614Z" fill="#3a2412" opacity={0.25}/>
      {/* pencil */}
      <Pencil x={250} y={706} rot={-17} len={250} th={38}/>
    </g>
  );
};

export const Logo1: React.FC = () => (
  <Fonts><AbsoluteFill style={{background: C.cream}}>
    <svg width={800} height={800} viewBox="0 0 800 800" style={{position: "absolute"}}>
      <Disc id="l1"/>
      <circle cx={400} cy={400} r={372} fill="none" stroke={C.teal} strokeWidth={10} opacity={0.9}/>
      <circle cx={400} cy={400} r={354} fill="none" stroke={C.brick} strokeWidth={3} opacity={0.7}/>
      <g transform="translate(400,414) scale(1.02) translate(-400,-440)"><Logo1Art id="l1a"/></g>
    </svg>
    <Grain w={800} h={800} id="g1" k={0.4} vignette={0.2}/>
  </AbsoluteFill></Fonts>
);

/** LOGO 2: serif monogram on cream paper, compass-rose ring */
export const Logo2Art: React.FC<{id: string; mono?: boolean}> = ({id, mono = true}) => {
  const ticks = Array.from({length: 48}, (_, i) => i);
  const star = (len: number, w: number, rot: number, col: string, op = 1) => (
    <g transform={`rotate(${rot} 400 400)`} opacity={op}>
      <path d={`M400,${400 - len} L${400 + w},400 L400,${400 + len} L${400 - w},400Z`} fill={col}/>
    </g>
  );
  return (
    <g>
      <circle cx={400} cy={400} r={368} fill="none" stroke={C.teal} strokeWidth={14}/>
      <circle cx={400} cy={400} r={340} fill="none" stroke={C.teal} strokeWidth={3}/>
      {ticks.map((i) => {
        const a = (i / 48) * Math.PI * 2, major = i % 6 === 0, len = major ? 30 : 16;
        return <line key={i} x1={400 + Math.sin(a) * 338} y1={400 - Math.cos(a) * 338} x2={400 + Math.sin(a) * (338 - len)} y2={400 - Math.cos(a) * (338 - len)} stroke={C.teal} strokeWidth={major ? 6 : 3} strokeLinecap="round"/>;
      })}
      <circle cx={400} cy={400} r={294} fill="none" stroke={C.brick} strokeWidth={2.5} opacity={0.65}/>
      {/* rose behind letters */}
      {star(290, 40, 0, C.tealL, 0.28)}{star(290, 40, 90, C.tealL, 0.28)}
      {/* north point, brick red, breaking the ring */}
      <path d="M400,28 L424,92 L376,92Z" fill={C.brick} stroke={C.brickD} strokeWidth={3} strokeLinejoin="round"/>
      {mono && (
        <>
          <text x={400} y={474} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={272} letterSpacing={2} fill={C.teal} stroke={C.tealD} strokeWidth={2}>UM</text>
        </>
      )}
      <path d="M300,520 L500,520" stroke={C.brick} strokeWidth={6} strokeLinecap="round"/>
      <circle cx={400} cy={520} r={9} fill={C.brick} stroke="#fffaf0" strokeWidth={3}/>
    </g>
  );
};
export const Logo2: React.FC = () => (
  <Fonts><AbsoluteFill style={{background: C.cream}}>
    <svg width={800} height={800} viewBox="0 0 800 800" style={{position: "absolute"}}>
      <Disc id="l2" a="#fffbf0" b="#f2e1bb"/>
      <Logo2Art id="l2a"/>
    </svg>
    <Grain w={800} h={800} id="g2" k={0.4} vignette={0.2}/>
  </AbsoluteFill></Fonts>
);

/** LOGO 3: a lamp over an open book, warm light on deep teal */
export const Logo3: React.FC = () => (
  <Fonts><AbsoluteFill style={{background: C.tealD}}>
    <svg width={800} height={800} viewBox="0 0 800 800" style={{position: "absolute"}}>
      <defs>
        <radialGradient id="l3bg" cx="50%" cy="38%" r="80%"><stop offset="0" stopColor="#2c7480"/><stop offset=".6" stopColor="#1b5560"/><stop offset="1" stopColor="#0f343c"/></radialGradient>
        <linearGradient id="l3cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe9a8" stopOpacity=".95"/><stop offset="1" stopColor="#fff0c0" stopOpacity=".62"/></linearGradient>
        <radialGradient id="l3glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffe9a8" stopOpacity=".8"/><stop offset="1" stopColor="#ffe9a8" stopOpacity="0"/></radialGradient>
        <linearGradient id="l3shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={C.brickD}/><stop offset=".4" stopColor="#d65a40"/><stop offset="1" stopColor={C.brickD}/></linearGradient>
        <linearGradient id="l3pg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f6e6c0"/><stop offset=".85" stopColor="#fffbe8"/><stop offset="1" stopColor="#ebd7a8"/></linearGradient>
        <linearGradient id="l3pg2" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stopColor="#f6e6c0"/><stop offset=".85" stopColor="#fffbe8"/><stop offset="1" stopColor="#ebd7a8"/></linearGradient>
      </defs>
      <rect width={800} height={800} fill="url(#l3bg)"/>
      <circle cx={400} cy={400} r={372} fill="none" stroke="#e6c27a" strokeWidth={8}/>
      <circle cx={400} cy={400} r={354} fill="none" stroke="#e6c27a" strokeWidth={2.5} opacity={0.6}/>
      {/* light cone */}
      <path d="M330,250 L470,250 L640,590 L160,590Z" fill="url(#l3cone)"/>
      <ellipse cx={400} cy={600} rx={250} ry={30} fill="#ffe9a8" opacity={0.28}/>
      {/* cord + lamp */}
      <line x1={400} y1={36} x2={400} y2={118} stroke="#e6c27a" strokeWidth={8} strokeLinecap="round"/>
      <circle cx={400} cy={236} r={92} fill="url(#l3glow)"/>
      <circle cx={400} cy={246} r={30} fill="#fff4c8"/>
      <path d="M310,250 C310,168 350,122 400,118 C450,122 490,168 490,250Z" fill="url(#l3shade)" stroke="#6e2214" strokeWidth={5} strokeLinejoin="round"/>
      <path d="M338,222 C342,176 366,146 392,138" fill="none" stroke="#ffd8b8" strokeWidth={9} strokeLinecap="round" opacity={0.7}/>
      <rect x={296} y={246} width={208} height={18} rx={9} fill="#e6c27a" stroke="#9a7a38" strokeWidth={4}/>
      {/* book */}
      <ellipse cx={400} cy={652} rx={290} ry={30} fill="#06222a" opacity={0.5}/>
      <path d="M118,570 C230,545 335,552 400,596 C465,552 570,545 682,570 L682,636 C570,612 465,620 400,664 C335,620 230,612 118,636Z" fill="#c25a3c" stroke="#7a2a18" strokeWidth={5} strokeLinejoin="round"/>
      <path d="M140,540 C240,514 335,522 392,562 L392,632 C335,594 240,588 140,610Z" fill="url(#l3pg)" stroke="#b08a52" strokeWidth={3}/>
      <path d="M660,540 C560,514 465,522 408,562 L408,632 C465,594 560,588 660,610Z" fill="url(#l3pg2)" stroke="#b08a52" strokeWidth={3}/>
      {[0, 1, 2].map((i) => (<g key={i}>
        <path d={`M172,${562 + i * 17} C240,${548 + i * 17} 318,${556 + i * 17} 372,${584 + i * 17}`} stroke={C.tealL} strokeWidth={5} fill="none" strokeLinecap="round"/>
        <path d={`M628,${562 + i * 17} C560,${548 + i * 17} 482,${556 + i * 17} 428,${584 + i * 17}`} stroke={C.tealL} strokeWidth={5} fill="none" strokeLinecap="round"/>
      </g>))}
      <path d="M392,562 L408,562 L408,632 L392,632Z" fill="#3a2412" opacity={0.28}/>
      {/* rising sparks of ideas */}
      {[[330, 470, 7], [470, 440, 6], [400, 400, 8], [300, 410, 5], [510, 490, 5]].map(([x, y, r], i) => (<circle key={i} cx={x} cy={y} r={r} fill="#fff4c8" opacity={0.85}/>))}
    </svg>
    <Grain w={800} h={800} id="g3" k={0.35} vignette={0.25}/>
  </AbsoluteFill></Fonts>
);
