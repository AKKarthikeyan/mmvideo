// Short 4/5 | A crowd: "Does more customers make Jio better?" (~39 s). Screen (SHORTS_and_SOCIAL.md): "A CROWD?" card; commuters photo with
// 51.76 crore tagged TRAI · WIRELESS SUBSCRIBERS | 30 JUN 2026; two phones on different networks joined by a call line (illustration);
// ₹119 vs ₹154 bars (vertical) with the ~₹35 bracket, "different business scopes", "our calculation"; verdict stamp.
// Sources: TRAI QPIR Table 1.11 (51.76 crore, 30 Jun 2026); Jio RHP p.34, p.131 (RJIL EBITDA, customers); Airtel Annual Report p.180; ledger jioscale.csv.
import React from "react";
import {random} from "remotion";
import {PhotoPrint, StickerLabel} from "../kit/Collage";
import {SCue} from "../kit/A01V4Cold";
import {Shot, SP, Stamp} from "../kit/A01V4Parts";
import {MarkerCircle} from "../kit/Marker";
import {C, F, clamp01, ease, inOut, outCubic, outQuint, spr, useTicks} from "../kit/tokens";
import {ENTITY, EntityTag} from "../devices";
import {H0, PU, S, W, useAt} from "./cue";
import {VFrame, VSource} from "./frame";

const serif = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({fontFamily: F.serif, fontWeight: 400, fontSize: size, ...extra});

// 1. "A CROWD?" card (4 of 5): visible at once
const Card: React.FC<{f: number; x?: number; y?: number; s?: number}> = ({f, x = 540, y = 760, s = 1}) => {
  const p = spr(f, -6, 13, 160);
  return (
    <div style={{position: "absolute", left: x, top: y, width: 880, transform: `translate(-50%, -50%) scale(${s * (0.94 + 0.06 * p)}) rotate(-1.2deg)`, opacity: clamp01(p * 3 + 0.5), background: C.white,
      padding: "70px 40px 60px", textAlign: "center", boxShadow: "0 4px 6px rgba(30,20,10,0.18), 0 28px 50px rgba(30,20,10,0.28)"}}>
      <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.rust}}>KIND 4 OF 5</div>
      <div style={serif(210, {color: C.ink, lineHeight: 1, marginTop: 24})}>A CROWD?</div>
      <div style={{display: "flex", justifyContent: "center", gap: 22, marginTop: 44}}>
        {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{width: 44, height: 44, borderRadius: 22, background: i === 4 ? C.highlight : "transparent", border: `4px solid ${C.ink}`, boxSizing: "border-box"}}/>)}
      </div>
    </div>
  );
};
const s1: React.FC<SP> = ({d}) => {
  const f = useTicks();
  return <VFrame f={f} d={d} z={[1.0, 1.05]}><Card f={f}/></VFrame>;
};

// 2. "Some businesses get better for everyone as more people join, like a marketplace": dots join and link (illustration)
const DOTS = Array.from({length: 46}, (_, i) => [140 + random("cd-x" + i) * 800, 520 + random("cd-y" + i) * 780] as [number, number]);
const s2: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt("sh4", s0);
  const mk = a("marketplace");
  const n = Math.round(8 + 38 * ease(f, a("more"), a("join,") + 20, outCubic));
  return (
    <VFrame f={f} d={d} z={[1.0, 1.05]}>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
        {DOTS.slice(0, n).map((p, i) => {
          if (i === 0) return null;
          let best = 0, bd = 1e9;
          for (let j = 0; j < i; j++) { const dd = Math.hypot(p[0] - DOTS[j][0], p[1] - DOTS[j][1]); if (dd < bd) { bd = dd; best = j; } }
          return <line key={"l" + i} x1={DOTS[best][0]} y1={DOTS[best][1]} x2={p[0]} y2={p[1]} stroke={C.teal} strokeWidth={4} opacity={0.6}/>;
        })}
        {DOTS.slice(0, n).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i < 8 ? 18 : 15} fill={i % 3 ? C.rust : C.ink} opacity={0.92}/>)}
      </svg>
      <div style={{position: "absolute", left: 60, right: 60, top: 220, textAlign: "center", ...serif(84, {color: C.ink, lineHeight: 1.05}), opacity: ease(f, 0, 8)}}>More people join,<br/>better for everyone</div>
      <StickerLabel f={f} text="Marketplace" x={540} y={1330} size={56} rot={-2} dark enter={{at: mk, mode: "pop", rot0: -8}}/>
      <VSource text="Illustration · not real data"/>
    </VFrame>
  );
};

// 3a. India's largest crowd: the commuters photo
const PHOTO = "jio/media/crowd_dumdum_platform_print.jpg";
const s3: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt("sh4", s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.05]}>
      <PhotoPrint f={f} src={PHOTO} x={540} y={800} w={960} h={1080} rot={-1} border={16} halftone={0.08} crop={{s0: 1.0, s1: 1.14, fx: 0.5, fy: 0.4, dur: d}}/>
      <StickerLabel f={f} text="India's largest crowd" x={540} y={1340} size={50} rot={-2} dark enter={{at: a("largest"), mode: "pop", rot0: -8}}/>
      <VSource text="Photo: Projjalm, CC0, Wikimedia Commons"/>
    </VFrame>
  );
};
// 3b. 51.76 crore, tagged
const s3b: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt("sh4", s0);
  const t0 = a("fifty"), v = 51.76 * ease(f, t0, t0 + 36, outCubic), p = spr(f, t0 - 2, 11, 180);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.04]}>
      <PhotoPrint f={f} src={PHOTO} x={540} y={500} w={960} h={520} rot={-1} border={14} halftone={0.08} darken={0.25} crop={{s0: 1.14, s1: 1.2, fx: 0.5, fy: 0.4, dur: d}}/>
      <div style={{position: "absolute", left: 540, top: 990, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p})`, opacity: clamp01(p * 2), textAlign: "center", whiteSpace: "nowrap"}}>
        <div style={serif(270, {color: C.teal, lineHeight: 1, letterSpacing: -4})}>{v.toFixed(2)}</div>
        <div style={serif(110, {color: C.ink, lineHeight: 1, marginTop: 6})}>crore</div>
      </div>
      <EntityTag f={f} at={t0 + 20} text={ENTITY.trai} period="30 JUN 2026" x={540} y={1280} anchor="center" size={34}/>
      <VSource text="TRAI QPIR · Table 1.11 · Photo: Projjalm, CC0"/>
    </VFrame>
  );
};

// 4a. a phone network is not a marketplace
const s4: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt("sh4", s0);
  const e = spr(f, -4, 12, 170), ne = ease(f, a("doesn't"), a("doesn't") + 8, outQuint);
  return (
    <VFrame f={f} d={d} tone="ink" z={[1.0, 1.05]}>
      <div style={{position: "absolute", left: 60, right: 60, top: 520, textAlign: "center", transform: `scale(${0.92 + 0.08 * e})`, opacity: clamp01(e * 2)}}>
        <div style={serif(120, {color: C.white, lineHeight: 1.05})}>A phone network</div>
        <div style={serif(220, {color: C.rust, lineHeight: 1, opacity: 0.25 + 0.75 * ne, transform: `scale(${0.85 + 0.15 * ne})`})}>≠</div>
        <div style={serif(128, {color: C.highlightPrint, lineHeight: 1.05})}>a marketplace</div>
      </div>
    </VFrame>
  );
};

// 4b. two phones on different networks joined by a call line (illustration)
const Phone: React.FC<{x: number; y: number; label: string; col: string; rot: number; e: number}> = ({x, y, label, col, rot, e}) => (
  <div style={{position: "absolute", left: x, top: y, width: 300, height: 560, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${0.85 + 0.15 * e})`, opacity: clamp01(e * 2)}}>
    <div style={{position: "absolute", inset: 0, borderRadius: 54, background: "linear-gradient(160deg, #3A3733, #1C1A18)", boxShadow: "0 8px 10px rgba(0,0,0,0.25), 0 36px 60px rgba(0,0,0,0.35)"}}/>
    <div style={{position: "absolute", left: 16, top: 16, right: 16, bottom: 16, borderRadius: 40, background: C.white, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 130, background: col}}/>
      <div style={{position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.white, letterSpacing: 2}}>{" "}</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 42, textAlign: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 36, color: C.white, letterSpacing: 2}}>{label}</div>
      <div style={{position: "absolute", left: "50%", top: 300, width: 130, height: 130, borderRadius: 65, transform: "translate(-50%, -50%)", background: C.paperDeep}}/>
      <div style={{position: "absolute", left: 40, right: 40, bottom: 56, height: 76, borderRadius: 38, background: col}}/>
    </div>
  </div>
);
const s5: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt("sh4", s0);
  const e1 = spr(f, -4, 12, 170), e2 = spr(f, 2, 12, 170);
  const call = ease(f, a("call"), a("call") + 28, inOut), net = ease(f, a("any network"), a("any network") + 10, outQuint);
  const x1 = 250, x2 = 830, y = 800;
  const path = `M ${x1 + 60} ${y - 330} Q 540 ${y - 640} ${x2 - 60} ${y - 330}`;
  const mx = (1 - call) * (1 - call) * (x1 + 60) + 2 * (1 - call) * call * 540 + call * call * (x2 - 60);
  const my = (1 - call) * (1 - call) * (y - 330) + 2 * (1 - call) * call * (y - 640) + call * call * (y - 330);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.04]}>
      <Phone x={x1} y={y} label="JIO NETWORK" col={C.teal} rot={-4} e={e1}/>
      <Phone x={x2} y={y} label="ANOTHER NETWORK" col={C.ink} rot={4} e={e2}/>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        {call > 0.01 ? <path d={path} fill="none" stroke={C.rust} strokeWidth={10} strokeLinecap="round" strokeDasharray="22 16" pathLength={1} style={{strokeDasharray: `${call} 1`}}/> : null}
      </svg>
      {call > 0.02 ? <div style={{position: "absolute", left: mx, top: my, width: 92, height: 92, borderRadius: 46, transform: "translate(-50%, -50%)", background: C.rust, boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.sans, fontWeight: 800, fontSize: 24, color: C.white, letterSpacing: 1}}>CALL</div> : null}
      <div style={{position: "absolute", left: 540, top: 1260, transform: `translate(-50%, -50%) translateY(${(1 - net) * 20}px)`, opacity: net, ...serif(88, {color: C.ink}), whiteSpace: "nowrap"}}>Any network</div>
      <VSource text="Illustration · two networks, one call"/>
    </VFrame>
  );
};

// 5. ₹119 vs ₹154 EBITDA per customer per month, vertical bars (our calculation; different business scopes)
const BXJ = 250, BXA = 600, BWV = 240, BB = 1060, KV = 3.6;
const Chart: React.FC<{f: number; jioAt: number; airAt: number; diffAt: number; braceAt: number; ring?: number}> = ({f, jioAt, airAt, diffAt, braceAt, ring = 1e6}) => {
  const jp = ease(f, jioAt, jioAt + 26, outQuint), ap = ease(f, airAt, airAt + 26, outQuint);
  const yJ = BB - 119 * KV, yA = BB - 154 * KV, bx = BXA + BWV / 2 + 36;
  const dp = ease(f, diffAt, diffAt + 12, outCubic), bp = ease(f, braceAt, braceAt + 12, outCubic);
  const cp = ease(f, ring, ring + 8);
  return (
    <>
      <div style={{position: "absolute", left: 0, right: 0, top: 215, textAlign: "center"}}>
        <div style={serif(58, {color: C.ink, letterSpacing: 1})}>EBITDA / CUSTOMER / MONTH</div>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: C.inkSoft, marginTop: 6, letterSpacing: 1}}>ESTIMATED · FY26 · OUR CALCULATION</div>
      </div>
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
        <line x1={70} x2={1010} y1={BB} y2={BB} stroke={C.ink} strokeWidth={4}/>
        <text x={60} y={BB - 10} textAnchor="start" fontFamily={F.sans} fontWeight={800} fontSize={26} fill={C.inkSoft}>₹0</text>
        <rect x={BXJ - BWV / 2} y={BB - 119 * KV * jp} width={BWV} height={119 * KV * jp} fill={C.teal}/>
        <rect x={BXA - BWV / 2} y={BB - 154 * KV * ap} width={BWV} height={154 * KV * ap} fill={C.ink}/>
        {jp > 0.02 ? <text x={BXJ} y={BB - 119 * KV * jp - 20} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={130} fill={C.teal} opacity={clamp01(jp * 3)}>₹{Math.round(119 * jp)}</text> : null}
        {ap > 0.02 ? <text x={BXA} y={BB - 154 * KV * ap - 20} textAnchor="middle" fontFamily={F.serif} fontWeight={400} fontSize={130} fill={C.ink} opacity={clamp01(ap * 3)}>₹{Math.round(154 * ap)}</text> : null}
        {dp > 0 ? <line x1={BXJ + BWV / 2} x2={BXJ + BWV / 2 + (bx - BXJ - BWV / 2) * dp} y1={yJ} y2={yJ} stroke={C.rust} strokeWidth={4} strokeDasharray="12 9"/> : null}
        {bp > 0 ? <>
          <path d={`M ${bx - 14} ${yJ} H ${bx} V ${yJ + (yA - yJ) * bp} H ${bx - 14}`} fill="none" stroke={C.rust} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"/>
          <text x={bx + 20} y={(yJ + yA) / 2 + 30} fontFamily={F.serif} fontWeight={400} fontSize={92} fill={C.rust} opacity={clamp01((bp - 0.4) * 2)}>~₹35</text>
        </> : null}
        {cp > 0 ? <>
          <MarkerCircle f={f} at={ring} rect={[56, 1128, 670, 56]} dur={16} seed="cj" width={7} padX={0.04} padY={0.2}/>
          <MarkerCircle f={f} at={ring + 8} rect={[350, 1186, 670, 56]} dur={16} seed="ca" width={7} padX={0.04} padY={0.2}/>
        </> : null}
      </svg>
      <EntityTag f={f} at={-30} text={ENTITY.rjil} period="FY26" x={60} y={1156} size={30}/>
      <EntityTag f={f} at={airAt - 8} text={ENTITY.airtelMob} period="FY26" x={1020} y={1214} size={30} anchor="right"/>
      <div style={{position: "absolute", left: 540, top: 1284, transform: "translate(-50%, -50%)", whiteSpace: "nowrap", fontFamily: F.sans, fontWeight: 800, fontSize: 36, letterSpacing: 1,
        padding: "8px 28px 6px", background: C.white, color: C.rust, border: `4px solid ${C.rust}`, boxShadow: "0 4px 10px rgba(0,0,0,0.12)"}}>Different business scopes</div>
    </>
  );
};
const s6: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt("sh4", s0);
  return (
    <VFrame f={f} d={d} z={[1.0, 1.02]} cy={800}>
      <Chart f={f} jioAt={a("estimates,") - 6} airAt={a("Airtel")} diffAt={a("thirty")} braceAt={a("thirty five")}/>
      <VSource text="Jio RHP p.34, p.131 · Airtel AR p.180 · our calculation"/>
    </VFrame>
  );
};
// 5b. "a bigger crowd hasn't meant more earned per customer"
const s7: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt("sh4", s0);
  const t = ease(f, a("bigger"), a("bigger") + 10, outQuint);
  return (
    <VFrame f={f} d={d} z={[1.02, 1.0]} cy={800}>
      <Chart f={f} jioAt={-200} airAt={-200} diffAt={-100} braceAt={-100} ring={a("earned")}/>
      <div style={{position: "absolute", left: 60, right: 60, top: 1330, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 14}px)`, ...serif(46, {color: C.ink}), whiteSpace: "nowrap"}}>Bigger crowd ≠ more earned per customer</div>
      <VSource text="Jio RHP p.34, p.131 · Airtel AR p.180 · our calculation"/>
    </VFrame>
  );
};

// 6. verdict
const s8: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt("sh4", s0);
  const sc = spr(f, a("scale."), 12, 170), st = a("But not");
  return (
    <VFrame f={f} d={d} z={[1.0, 1.03]}>
      <Card f={f} x={540} y={560} s={0.62}/>
      <div style={{position: "absolute", left: 540, top: 960, transform: "translate(-50%, -50%)", textAlign: "center", whiteSpace: "nowrap"}}>
        <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.inkSoft}}>VERDICT</div>
        <div style={{...serif(210, {color: C.teal, lineHeight: 1, marginTop: 8}), opacity: clamp01(sc * 2) , transform: `scale(${0.8 + 0.2 * sc})`}}>Scale</div>
      </div>
      <Stamp f={f} at={st} text="SCALE, NOT A CROWD MOAT" x={540} y={1210} size={60} rot={-4}/>
    </VFrame>
  );
};

export const SHOTS_SH4: Shot[] = [
  S("sh4", 0, H0, s1, "sh4-card"),
  S("sh4", "Some|-0.1", H0, s2, "sh4-join"),
  S("sh4", "Jio has|-0.1", H0, s3, "sh4-photo"),
  S("sh4", "fifty|-0.15", H0, s3b, "sh4-number"),
  S("sh4", "But a phone|-0.1", PU, s4, "sh4-not-marketplace"),
  S("sh4", "A Jio customer|-0.1", H0, s5, "sh4-call"),
  S("sh4", "And on our|-0.1", H0, s6, "sh4-bars"),
  S("sh4", "A bigger crowd|-0.1", H0, s7, "sh4-bigger"),
  S("sh4", "Verdict|-0.1", H0, s8, "sh4-verdict"),
];
export const CUES_SH4: SCue[] = [
  [W("sh4", "Jio has"), "click", 0.5],
  [W("sh4", "estimates,"), "pop", 0.4],
  [W("sh4", "But not"), "stamp", 0.7],
];
