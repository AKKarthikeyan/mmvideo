// P02 antimatter trap: STYLE SAMPLE for AK (27 Oct 2026). Three stills in a "flat vector, deep night, glowing light" look
// (a Kurzgesagt-inspired genre look, our own palette and shapes, no borrowed characters), to compare with the current paper-and-ink kit.
// Separate entry (sample_index.ts) so it can't touch the episode bundle. Fonts and SAFE box come from ../kit.
// Render: npx remotion still src/gadget/antimattertrap/sample_index.ts SAMPLE-b01 out/gadget/antimattertrap/sample_b01.png
import React from "react";
import {AbsoluteFill, Still} from "remotion";
import {H, HEAD, MONO, SERIF, W, Safe, useGKFonts} from "../kit";

// Own palette: navy night, brand cobalt, lamp amber (the desk lamp), cyan for fields, paper cream for text cards.
const K = {
  n0: "#0A1128", n1: "#142252", n2: "#1D3377", cobalt: "#2348E0", cobalt2: "#1B38B4", cyan: "#52D9F2", amber: "#FFB43B",
  hot: "#FF7A2F", coral: "#FF5C7A", steel: "#93A5D4", steelD: "#3B4C86", cream: "#F2EEE7", ink: "#121A3A", mute: "#8896C2",
};

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="pglow"><stop offset="0" stopColor={K.amber} stopOpacity="0.55"/><stop offset="1" stopColor={K.amber} stopOpacity="0"/></radialGradient>
    <radialGradient id="pcore" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#FFF3C4"/><stop offset="0.45" stopColor={K.amber}/><stop offset="1" stopColor={K.hot}/></radialGradient>
    <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2C3C78"/><stop offset="0.5" stopColor="#4A5E9F"/><stop offset="1" stopColor="#26356B"/></linearGradient>
    <linearGradient id="coil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A6BFF"/><stop offset="1" stopColor={K.cobalt2}/></linearGradient>
    <linearGradient id="step" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A78FF"/><stop offset="1" stopColor={K.cobalt2}/></linearGradient>
    <linearGradient id="fieldfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.cyan} stopOpacity="0"/><stop offset="0.5" stopColor={K.cyan} stopOpacity="0.5"/><stop offset="1" stopColor={K.cyan} stopOpacity="0"/></linearGradient>
  </defs>
);

const Bg: React.FC<{glowY: number}> = ({glowY}) => {
  const dots = Array.from({length: 70}, (_, k) => {
    const r = Math.abs(Math.sin(k * 91.7)), q = Math.abs(Math.sin(k * 53.3)), s = Math.abs(Math.sin(k * 17.1));
    return <circle key={k} cx={r * W} cy={q * H * 0.8} r={1.6 + 3.2 * s} fill={k % 5 === 0 ? K.amber : K.cyan} opacity={0.1 + 0.32 * s}/>;
  });
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${K.n0} 0%, ${K.n1} 55%, ${K.n2} 100%)`}}>
      <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
        <defs><radialGradient id="bgglow"><stop offset="0" stopColor={K.cobalt} stopOpacity="0.5"/><stop offset="1" stopColor={K.cobalt} stopOpacity="0"/></radialGradient></defs>
        <circle cx={540} cy={glowY} r={640} fill="url(#bgglow)"/>
        <circle cx={-90} cy={430} r={330} fill="#16296B" opacity={0.5}/>
        <circle cx={1160} cy={1160} r={430} fill="#112259" opacity={0.55}/>
        {dots}
      </svg>
    </AbsoluteFill>
  );
};

/** The brand's desk, drawn flat: dusky tabletop with a lit edge, and the desk lamp (the channel mark) casting a warm cone. Frame coordinates. */
const Desk: React.FC<{top: number}> = ({top}) => (
  <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
    <defs>
      <linearGradient id="deskg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B4468"/><stop offset="1" stopColor="#2A1A44"/></linearGradient>
      <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={K.amber} stopOpacity="0.32"/><stop offset="1" stopColor={K.amber} stopOpacity="0"/></linearGradient>
    </defs>
    <polygon points={`776,${top - 176} 832,${top - 130} 905,${top + 130} 470,${top + 130}`} fill="url(#cone)"/>
    <rect x={0} y={top} width={W} height={H - top} fill="url(#deskg)"/>
    <rect x={0} y={top} width={W} height={9} fill={K.amber} opacity={0.8}/>
    <ellipse cx={940} cy={top + 4} rx={78} ry={13} fill="#1B1233"/>
    <path d={`M 940 ${top} L 912 ${top - 118} L 862 ${top - 214}`} stroke="#C9CFE6" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx={912} cy={top - 118} r={13} fill="#E7EAF6"/>
    <polygon points={`872,${top - 262} 916,${top - 222} 832,${top - 130} 776,${top - 176}`} fill={K.cream}/>
    <polygon points={`776,${top - 176} 832,${top - 130} 822,${top - 120} 764,${top - 168}`} fill={K.amber}/>
    <circle cx={796} cy={top - 150} r={26} fill={K.amber} opacity={0.55}/>
  </svg>
);

const Bar: React.FC<{p: number; t: string}> = ({p, t}) => (
  <div style={{position: "absolute", left: 64, right: 64, top: 86, fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: K.cream, textTransform: "uppercase"}}>
    <div style={{display: "flex", alignItems: "center", gap: 16}}>
      <span style={{background: K.cobalt, color: "#fff", padding: "4px 12px", borderRadius: 6, fontWeight: 600}}>CC P02</span>
      <span style={{fontWeight: 500}}>Claim check · antimatter trap</span>
      <span style={{marginLeft: "auto", color: K.mute}}>{t}</span>
    </div>
    <div style={{marginTop: 18, height: 4, background: "#26335F", borderRadius: 2}}>
      <div style={{width: `${p * 100}%`, height: 4, background: K.amber, borderRadius: 2}}/>
    </div>
  </div>
);

const Source: React.FC<{text: string}> = ({text}) => (
  <div style={{position: "absolute", left: 64, right: 64, top: 1590, fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: K.cream, opacity: 0.8, textTransform: "uppercase"}}>{text}</div>
);

/** headline in page coordinates (inside Safe); {braces} mark amber words */
const Head: React.FC<{lines: string[]; y: number; size?: number; x?: number}> = ({lines, y, size = 104, x = 44}) => (
  <div style={{position: "absolute", left: x, top: y, fontFamily: HEAD, fontSize: size, lineHeight: 0.96, letterSpacing: -1, color: "#fff", textTransform: "uppercase", textShadow: "0 6px 0 rgba(5,10,40,0.45)"}}>
    {lines.map((ln, i) => (
      <div key={i} style={{whiteSpace: "nowrap"}}>
        {ln.split(" ").map((w, j) => {
          const hot = w.startsWith("{");
          return <span key={j} style={{color: hot ? K.amber : undefined, marginRight: "0.22em"}}>{w.replace(/[{}]/g, "")}</span>;
        })}
      </div>
    ))}
  </div>
);

const Positron: React.FC<{x: number; y: number; r?: number; ghost?: boolean}> = ({x, y, r = 26, ghost}) => (
  <g transform={`translate(${x},${y})`} opacity={ghost ? 0.4 : 1}>
    <circle r={r * 3.4} fill="url(#pglow)"/>
    <circle r={r * 1.9} fill={K.amber} opacity={0.2}/>
    <circle r={r} fill="url(#pcore)"/>
    <circle cx={-r * 0.32} cy={-r * 0.36} r={r * 0.27} fill="#fff" opacity={0.85}/>
    <path d={`M ${-r * 0.42} ${r * 0.1} H ${r * 0.42} M 0 ${-r * 0.32} V ${r * 0.52}`} stroke="#7A3300" strokeWidth={r * 0.17} strokeLinecap="round" opacity={0.7}/>
  </g>
);

/** the trap, flat: steel vessel, two cobalt coils, a dark chamber, cyan field lines, caps. Local coordinates (centre 0,0), 500 x 760. */
const Trap: React.FC<{cx: number; cy: number; s: number; children?: React.ReactNode}> = ({cx, cy, s, children}) => (
  <g transform={`translate(${cx},${cy}) scale(${s})`}>
    <ellipse cx={0} cy={396} rx={300} ry={24} fill="#000" opacity={0.38}/>
    <rect x={-250} y={-380} width={500} height={760} rx={120} fill="url(#steel)"/>
    <rect x={-270} y={-150} width={540} height={74} rx={37} fill="url(#coil)"/>
    <rect x={-270} y={76} width={540} height={74} rx={37} fill="url(#coil)"/>
    <rect x={-190} y={-322} width={380} height={644} rx={84} fill="#060B1F"/>
    <clipPath id="chamber"><rect x={-190} y={-322} width={380} height={644} rx={84}/></clipPath>
    <g clipPath="url(#chamber)">
      {[-140, -70, 0, 70, 140].map((x0) => (
        <path key={x0} d={`M ${x0} -330 C ${x0 * 1.3} -120 ${x0 * 1.3} 120 ${x0} 330`} stroke="url(#fieldfade)" strokeWidth={5} fill="none"/>
      ))}
      <polygon points="-175,-300 -118,-300 -175,-110" fill="#fff" opacity={0.06}/>
    </g>
    <rect x={-190} y={-322} width={380} height={644} rx={84} fill="none" stroke={K.cyan} strokeOpacity={0.45} strokeWidth={5}/>
    <rect x={-120} y={-304} width={240} height={32} rx={16} fill={K.steel}/>
    <rect x={-120} y={272} width={240} height={32} rx={16} fill={K.steel}/>
    {children}
  </g>
);

/** small up/down arrows beside the dot: it bobs along the axis */
const Bob: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x},${y})`} fill={K.cream} opacity={0.65}>
    <polygon points="0,-88 14,-66 -14,-66"/>
    <polygon points="0,88 14,66 -14,66"/>
  </g>
);

const Pill: React.FC<{x: number; y: number; w?: number; text: string; bg?: string; color?: string; size?: number; dashed?: boolean; rot?: number}> = ({x, y, w, text, bg = K.cream, color = K.ink, size = 26, dashed, rot = 0}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, boxSizing: "border-box", transform: `rotate(${rot}deg)`, transformOrigin: "left center", background: dashed ? "transparent" : bg, color, border: dashed ? `4px dashed ${color}` : undefined,
    fontFamily: MONO, fontWeight: 600, fontSize: size, letterSpacing: 2, padding: `${size * 0.32}px ${size * 0.8}px`, borderRadius: 999, textTransform: "uppercase", whiteSpace: "nowrap", textAlign: "center", boxShadow: dashed ? undefined : "0 10px 24px rgba(3,8,30,0.4)"}}>{text}</div>
);

// ------------------------------------------------------------------ b01 hook
export const SampleB01: React.FC = () => {
  useGKFonts();
  const cx = 540, cy = 1020;
  return (
    <AbsoluteFill>
      <Bg glowY={1000}/>
      <Desk top={1385}/>
      <Bar p={0.03} t="00:01"/>
      <Safe>
        <Head lines={["It {vanishes}", "if it touches", "anything."]} y={64}/>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
          <Defs/>
          <Trap cx={cx} cy={cy} s={1}>
            <Bob x={0} y={0}/>
            <Positron x={0} y={0} r={30}/>
          </Trap>
          <path d={`M 292 1015 L 480 1020`} stroke={K.cream} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" opacity={0.8}/>
        </svg>
        <Pill x={36} y={982} text="One positron" bg={K.amber} color={K.ink} size={28}/>
        {/* calendar card: the months counter */}
        <div style={{position: "absolute", left: 704, top: 410, width: 290, transform: "rotate(4deg)", borderRadius: 26, overflow: "hidden", background: K.cream, boxShadow: "0 18px 36px rgba(3,8,30,0.5)"}}>
          <div style={{background: K.coral, color: "#fff", fontFamily: MONO, fontWeight: 600, fontSize: 34, letterSpacing: 6, padding: "12px 0", textAlign: "center"}}>OCT</div>
          <div style={{fontFamily: HEAD, fontSize: 96, color: K.ink, textAlign: "center", lineHeight: 1.12, letterSpacing: -2}}>2026</div>
          <div style={{background: "#E3DCCF", color: K.cobalt2, fontFamily: MONO, fontWeight: 600, fontSize: 26, letterSpacing: 4, padding: "10px 0", textAlign: "center"}}>MONTHS ▸▸▸</div>
        </div>
      </Safe>
      <Source text="Myers et al., Phys. Rev. Lett. 137, 173001 (2026)"/>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ b05 the turn: Priscilla
export const SampleB05: React.FC = () => {
  useGKFonts();
  const cx = 330, cy = 1100, s = 0.8;
  return (
    <AbsoluteFill>
      <Bg glowY={1060}/>
      <Desk top={1385}/>
      <Bar p={0.52} t="00:30"/>
      <Safe>
        <Head lines={["But it’s", "{not} a first."]} y={64} size={116}/>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
          <Defs/>
          <Trap cx={cx} cy={cy} s={s}>
            {/* a passing twin drifts through the field and is gone; it never swaps places with her */}
            <path d="M -190 -230 C -150 -190 -110 -170 -70 -150" stroke={K.amber} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" fill="none" opacity={0.55}/>
            <Positron x={-60} y={-142} r={20} ghost/>
            {/* ballet: little arcs around her */}
            <path d="M -62 -20 A 70 70 0 0 1 62 -20" stroke={K.cream} strokeWidth={4} strokeDasharray="3 12" strokeLinecap="round" fill="none" opacity={0.6}/>
            <path d="M 62 40 A 70 70 0 0 1 -62 40" stroke={K.cream} strokeWidth={4} strokeDasharray="3 12" strokeLinecap="round" fill="none" opacity={0.6}/>
            <Positron x={0} y={10} r={30}/>
            {/* pet-style name tag on a short string */}
            <path d="M 0 40 C 6 70 -4 90 0 110" stroke={K.cream} strokeWidth={4} fill="none"/>
            <circle cx={0} cy={112} r={9} fill="none" stroke={K.cream} strokeWidth={4}/>
            <rect x={-132} y={120} width={264} height={78} rx={39} fill={K.cream}/>
            <rect x={-122} y={130} width={244} height={58} rx={29} fill="none" stroke={K.coral} strokeWidth={3} strokeDasharray="6 8"/>
            <text x={0} y={170} textAnchor="middle" fontFamily={HEAD} fontSize={36} fill={K.ink} letterSpacing={2}>PRISCILLA</text>
          </Trap>
        </svg>
        <div style={{position: "absolute", left: 100, top: 744, fontFamily: MONO, fontWeight: 500, fontSize: 24, letterSpacing: 3, color: K.cream, opacity: 0.8, textTransform: "uppercase"}}>a passing twin</div>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}><path d="M 230 786 L 268 962" stroke={K.cream} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" opacity={0.7}/></svg>
        <Pill x={578} y={318} text="Seattle · Sep 15, 1984" bg={K.amber} color={K.ink} size={27}/>
        <div style={{position: "absolute", left: 578, top: 420, width: 440, boxSizing: "border-box", background: K.cream, borderRadius: 30, padding: "22px 30px 24px", boxShadow: "0 18px 36px rgba(3,8,30,0.5)"}}>
          <div style={{fontFamily: HEAD, fontSize: 86, lineHeight: 0.7, color: K.amber, height: 44}}>“</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 37, lineHeight: 1.08, color: K.ink}}>
            Here, right now, in the center of our Penning trap resides positron Priscilla … executing simple spontaneous <span style={{color: K.cobalt2}}>ballet routines</span> for the last 3 months!
          </div>
          <div style={{marginTop: 14, fontFamily: MONO, fontWeight: 500, fontSize: 19, letterSpacing: 2, color: "#5D678F", textTransform: "uppercase"}}>Dehmelt, quoting the lab, 1988</div>
        </div>
        <div style={{position: "absolute", left: 578, top: 900, fontFamily: HEAD, color: K.amber, lineHeight: 0.8, textShadow: "0 6px 0 rgba(5,10,40,0.45)"}}>
          <span style={{fontSize: 230}}>3</span>
          <span style={{fontFamily: HEAD, fontSize: 70, color: "#fff", marginLeft: 20, textTransform: "uppercase"}}>months</span>
          <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 30, letterSpacing: 4, color: K.cream, marginTop: 22, textTransform: "uppercase", textShadow: "none"}}>in the trap</div>
        </div>
      </Safe>
      <Source text="Dehmelt, Physica Scripta T22 (1988)"/>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ b07 stamp + the staircase
export const SampleB07: React.FC = () => {
  useGKFonts();
  const rungs: [string, "done" | "lit" | "off"][] = [["✓ Claimed", "done"], ["Published", "lit"], ["Repeated", "off"], ["On sale", "off"]];
  const steps = [0, 1, 2, 3];
  return (
    <AbsoluteFill>
      <Bg glowY={900}/>
      <Bar p={0.9} t="00:51"/>
      <Safe>
        {/* the stamp */}
        <div style={{position: "absolute", left: 96, top: 112, transform: "rotate(-5deg)"}}>
          <div style={{background: K.cobalt, borderRadius: 30, padding: "14px 44px 22px", boxShadow: "0 22px 44px rgba(3,8,30,0.55)", border: `10px solid ${K.cream}`, outline: `6px solid ${K.cobalt}`}}>
            <div style={{fontFamily: HEAD, fontSize: 134, letterSpacing: 4, color: "#fff", lineHeight: 1.05}}>PUBLISHED</div>
          </div>
        </div>
        {/* the ladder: where the claim stands */}
        {rungs.map(([t, st], i) => (
          <Pill key={t} x={30 + i * 252} y={392} w={238} text={t} size={22}
            bg={st === "lit" ? K.cyan : K.cream} color={st === "lit" ? K.ink : st === "done" ? "#6E7CB0" : K.mute} dashed={st === "off"}/>
        ))}
        <div style={{position: "absolute", left: 34, top: 472, fontFamily: MONO, fontWeight: 500, fontSize: 22, letterSpacing: 3, color: K.mute, textTransform: "uppercase"}}>Peer-reviewed device paper · Oct 2026</div>
        {/* the energy staircase */}
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0}}>
          <Defs/>
          {steps.map((i) => (
            <g key={i}>
              <ellipse cx={190 + i * 218} cy={1240 - i * 150 + 26} rx={104} ry={14} fill={K.cobalt} opacity={0.28}/>
              <rect x={90 + i * 218} y={1230 - i * 150} width={200} height={30} rx={15} fill="url(#step)"/>
              <rect x={90 + i * 218} y={1230 - i * 150} width={200} height={8} rx={4} fill="#9DB1FF"/>
            </g>
          ))}
          <path d="M 262 1124 C 286 1076 322 1044 358 1032" stroke={K.cyan} strokeWidth={6} strokeDasharray="4 14" strokeLinecap="round" fill="none"/>
          <polygon points="372,1028 346,1010 342,1040" fill={K.cyan}/>
          <path d="M 250 1010 q 14 -26 28 0 t 28 0 t 28 0" stroke={K.cyan} strokeWidth={6} fill="none" strokeLinecap="round"/>
          <Positron x={190} y={1184} r={32}/>
          <Positron x={408} y={1034} r={26} ghost/>
        </svg>
        <div style={{position: "absolute", left: 90, top: 1290, fontFamily: MONO, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: K.cream, textTransform: "uppercase"}}>lowest state</div>
        <Pill x={44} y={700} text="156 GHz microwave · one step" bg={K.cobalt} color="#fff" size={22}/>
        <Pill x={44} y={782} text="0.3 K" bg={K.cyan} color={K.ink} size={30}/>
        <Pill x={44} y={1440} w={950} text="Positron vs electron: not measured yet" color={K.amber} size={28} dashed/>
      </Safe>
      <Source text="Myers et al., Phys. Rev. Lett. 137, 173001 (2026)"/>
    </AbsoluteFill>
  );
};

export const SampleRoot: React.FC = () => (
  <>
    <Still id="SAMPLE-b01" component={SampleB01} width={W} height={H}/>
    <Still id="SAMPLE-b05" component={SampleB05} width={W} height={H}/>
    <Still id="SAMPLE-b07" component={SampleB07} width={W} height={H}/>
  </>
);
