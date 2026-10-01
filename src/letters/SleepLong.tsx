// Nick Sleep long form, "The Light Bulb Problem" (1920x1080). Fixed fund-letter styles (AK 29 Sep 2026):
// 16 mm documentary (titles + the real letter pages) and kinetic typography (quotes, our notes, lists, numbers).
// Verbatim quotes: italic with quote marks, red emphasis and a source line. Our own words: roman, blue emphasis, "OUR NOTE" label.
// Data: public/letters/sleep_long/data.json from scripts/letters/build_long.py (frames are computed there).
import React from "react";
import {AbsoluteFill, Audio, Composition, Img, Sequence, Still, staticFile, useCurrentFrame, interpolate, Easing} from "remotion";
import {Film} from "./StyleTests";
import data from "../../public/letters/sleep_long/data.json";

const FPS = 30;
const SERIF = "'Iowan Old Style', Charter, Georgia, serif";
const P = {paper: "#F1E9D8", ink: "#1E1A15", blue: "#234E7D", red: "#B3342A", gray: "#7A7266"};
type Beat = {key: string; ch: number; say: string; sec: number; frames: number; scene: any};
const BEATS = (data as any).beats as Beat[];
const TOTAL = (data as any).total as number;
const ease = Easing.inOut(Easing.cubic);
const pr = (f: number, a: number, d: number, e = ease) => interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});
const makeT = (b: Beat) => (x: string | number | undefined, off = 0) => {
  if (x === undefined) return off;
  if (typeof x === "number") return x + off;
  const i = b.say.toLowerCase().indexOf(x.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${x}`);
  return Math.round(b.sec * FPS * i / b.say.length) + off;
};
const perChar = (b: Beat) => (b.sec * FPS) / Math.max(1, b.say.length);

// ---------- kinetic ----------
const Paper: React.FC<{b: Beat; children: React.ReactNode}> = ({b, children}) => {
  const f = useCurrentFrame();
  const z = 1 + 0.03 * (f / b.frames);
  return (
    <AbsoluteFill style={{background: P.paper}}>
      <svg width={1920} height={1080} style={{position: "absolute"}}>
        <filter id="pgrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5"/>
          <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 0.13 0"/></filter>
        <rect width={1920} height={1080} filter="url(#pgrain)"/>
      </svg>
      <AbsoluteFill style={{transform: `scale(${z})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const Source: React.FC<{text?: string; at: number; ours?: boolean}> = ({text, at, ours}) => {
  const f = useCurrentFrame(); const o = pr(f, at, 14);
  if (!text && !ours) return null;
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", opacity: o}}>
      <div style={{width: 110, height: 3, background: ours ? P.blue : P.red, margin: "0 auto 20px", opacity: 0.8}}/>
      {ours ? <div style={{fontFamily: SERIF, fontSize: 26, letterSpacing: 6, color: P.blue}}>OUR NOTE · NOT FROM THE LETTERS</div>
        : <><div style={{fontFamily: SERIF, fontSize: 30, color: P.ink}}>Nick Sleep</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 25, color: P.gray, marginTop: 6}}>{text}</div></>}
    </div>
  );
};

// words spread over the spoken span of `sync`; emphasis words bigger (red for quotes, blue for our notes)
const Kinetic: React.FC<{b: Beat; text: string; sync?: string; em?: string[]; quote: boolean; top?: number; dim?: number; maxSize?: number}> = ({b, text, sync, em = [], quote, top, dim = 1, maxSize = 150}) => {
  const f = useCurrentFrame(); const T = makeT(b);
  const words = text.split(" ");
  const base = Math.min(maxSize, Math.max(66, 2400 / Math.pow(text.length, 0.72)));
  const isEm = (w: string) => em.includes(w);
  const size = (w: string) => isEm(w) ? base * 1.45 : base;
  const start = sync ? T(sync) : 6;
  const span = Math.min(text.length * perChar(b), b.frames - start - 20);
  let acc = 0;
  const times = words.map((w) => { const t = start + span * acc / text.length; acc += w.length + 1; return t; });
  // wrap into lines by estimated width
  const lines: number[][] = []; let cur: number[] = []; let wdt = 0;
  words.forEach((w, i) => {
    const ww = (w.length + 1) * size(w) * 0.5;
    if (wdt + ww > 1560 && cur.length) { lines.push(cur); cur = []; wdt = 0; }
    cur.push(i); wdt += ww;
  });
  if (cur.length) lines.push(cur);
  const col = quote ? P.red : P.blue;
  return (
    <div style={{position: "absolute", left: 180, right: 180, top: top ?? 0, height: top !== undefined ? 250 : undefined, bottom: top !== undefined ? undefined : 150,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", opacity: dim}}>
      {lines.map((ln, li) => (
        <div key={li} style={{display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "nowrap", columnGap: base * 0.3}}>
          {ln.map((i) => {
            const w = words[i]; const p = pr(f, times[i], 9, Easing.out(Easing.back(1.7)));
            const e = isEm(w);
            const txt = (quote && i === 0 ? "“" : "") + w + (quote && i === words.length - 1 ? "”" : "");
            return <span key={i} style={{fontFamily: SERIF, fontSize: size(w), lineHeight: 1.12, opacity: p, display: "inline-block",
              transform: `translateY(${(1 - p) * 36}px)`, color: e ? col : P.ink, fontWeight: e ? 700 : 400,
              fontStyle: quote && !e ? "italic" : "normal"}}>{txt}</span>;
          })}
        </div>))}
    </div>
  );
};

const QuoteScene: React.FC<{b: Beat}> = ({b}) => {
  const s = b.scene; const T = makeT(b); const ours = s.type === "ours";
  const end = (s.sync ? T(s.sync) : 0) + Math.min(s.q.length * perChar(b), b.frames);
  return <Paper b={b}><Kinetic b={b} text={s.q} sync={s.sync} em={s.em} quote={!ours}/><Source text={s.src} at={Math.min(end, b.frames - 40)} ours={ours}/></Paper>;
};

const ListScene: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame(); const s = b.scene; const T = makeT(b);
  const fin = s.finale ? T(s.finale_at) : Infinity;
  const dim = f >= fin ? 0.18 : 1;
  const n = s.items.length; const size = n > 3 ? 84 : 100;
  return (
    <Paper b={b}>
      <div style={{position: "absolute", left: 0, right: 0, top: 540 - (n * size * 1.3) / 2 - 60, opacity: dim}}>
        {s.items.map(([t, at]: [string, string], i: number) => {
          const p = pr(f, T(at), 10, Easing.out(Easing.back(1.6)));
          const last = i === n - 1;
          return <div key={i} style={{textAlign: "center", fontFamily: SERIF, fontSize: size, lineHeight: 1.3, opacity: p,
            transform: `translateX(${(1 - p) * -60}px)`, color: last ? (s.ours ? P.blue : P.red) : P.ink, fontWeight: last ? 700 : 400}}>{t}</div>;
        })}
      </div>
      {s.finale && f >= fin && <Kinetic b={b} text={s.finale} sync={s.finale_at} em={[s.finale]} quote={true}/>}
      <Source text={s.finale ? s.src : undefined} at={s.finale ? fin + 10 : 0} ours={s.ours}/>
      {!s.finale && !s.ours && s.src && <div style={{position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: SERIF, fontStyle: "italic",
        fontSize: 25, color: P.gray, opacity: pr(f, 30, 14)}}>Our arithmetic restating Sleep · {s.src}</div>}
    </Paper>
  );
};

const num = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ""));
const fmt = (s: string, v: number) => {
  const dec = (s.split(".")[1] || "").replace(/[^0-9]/g, "").length;
  const body = v.toLocaleString("en-US", {minimumFractionDigits: dec, maximumFractionDigits: dec});
  return s.replace(/[0-9][0-9,.]*/, body);
};
const StatScene: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame(); const s = b.scene; const T = makeT(b);
  const a = T(s.at, -4); const p = pr(f, a, 34, Easing.out(Easing.cubic));
  const q = s.second ? pr(f, T(s.second_at, -4), 24, Easing.out(Easing.cubic)) : 0;
  return (
    <Paper b={b}>
      {s.lead && <Kinetic b={b} text={s.lead} sync={s.lead_at} quote={!!s.lead_quote} top={130} maxSize={80}/>}
      <div style={{position: "absolute", left: 0, right: 0, top: s.lead ? 450 : 300, textAlign: "center"}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 230, color: P.red, lineHeight: 1, opacity: pr(f, a, 6),
          transform: `scale(${0.9 + 0.1 * p})`}}>{fmt(s.big, num(s.big) * p)}</div>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 38, color: P.ink, marginTop: 18, opacity: pr(f, a + 20, 12)}}>{s.after}</div>
        {s.second && <div style={{marginTop: 50, opacity: q}}>
          <span style={{fontFamily: SERIF, fontWeight: 700, fontSize: 110, color: P.gray}}>{fmt(s.second, num(s.second) * q)}</span>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: P.gray}}>{s.second_label}</div></div>}
      </div>
      <Source text={s.src} at={a + 30}/>
    </Paper>
  );
};

// ---------- 16 mm ----------
const TitleScene: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame(); const s = b.scene;
  const out = 1 - pr(f, b.frames - 10, 10);
  return (
    <Film>
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: out}}>
        <div style={{position: "absolute", inset: 90, border: "3px solid #ddd", opacity: pr(f, 2, 14)}}/>
        <div style={{position: "absolute", inset: 104, border: "1px solid #ddd", opacity: pr(f, 2, 14)}}/>
        <div style={{fontFamily: SERIF, color: "#eee", fontSize: 30, letterSpacing: 14, opacity: pr(f, 4, 16)}}>{s.kicker}</div>
        {s.lines.map((l: string, i: number) => <div key={i} style={{fontFamily: SERIF, color: "#fff", fontSize: 128, marginTop: 26, opacity: pr(f, 14 + i * 8, 18)}}>{l}</div>)}
        {s.sub && <div style={{fontFamily: SERIF, fontStyle: "italic", color: "#ddd", fontSize: 42, marginTop: 26, opacity: pr(f, 34, 18)}}>{s.sub}</div>}
      </AbsoluteFill>
    </Film>
  );
};

const PageScene: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame(); const s = b.scene; const T = makeT(b);
  const ph = 1080 * 1.05, pw = ph * s.aspect;
  const [bx, by, bw, bh] = s.box;
  const cx = (bx + bw / 2) * pw, cy = (by + bh / 2) * ph;
  const zMax = Math.max(1.5, Math.min(3.0, 1250 / (bw * pw)));
  const ring = s.reverse ? 1 : pr(f, T(s.at, -6), 22, Easing.out(Easing.cubic));
  const k = s.reverse ? 1 - pr(f, 20, b.frames - 50) : pr(f, 0, Math.max(40, T(s.at, 10)));
  const z = 1 + (zMax - 1) * k;
  const tx = 960 - (pw / 2 + (cx - pw / 2) * k), ty = 540 - (ph / 2 + (cy - ph / 2) * k);
  const band = s.reverse ? 1 : pr(f, T(s.at, -4), 16, Easing.out(Easing.cubic));
  const place = {position: "absolute" as const, left: 0, top: 0, width: pw, height: ph, transformOrigin: `${cx}px ${cy}px`, transform: `translate(${tx}px, ${ty}px) scale(${z})`};
  const overlay = (
    <div style={place}>
      <div style={{position: "absolute", left: bx * pw - 4, top: by * ph - 1, width: (bw * pw + 8) * band, height: bh * ph + 2,
        background: "#E0A63A", opacity: 0.5, mixBlendMode: "multiply"}}/>
    </div>
  );
  return (
    <Film overlay={overlay}>
      <AbsoluteFill style={{opacity: pr(f, 0, 8)}}>
        <div style={place}>
          <Img src={staticFile(`letters/sleep_long/pages/p${s.page}.png`)} style={{width: pw, height: ph}}/>
        </div>
      </AbsoluteFill>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, padding: "20px 120px", background: "rgba(10,10,8,0.82)", fontFamily: SERIF,
        fontStyle: "italic", color: "#ddd", fontSize: 26, opacity: pr(f, 20, 14)}}>{s.src}</div>
      <Audio src={staticFile("letters/projector.wav")} volume={0.1} loop/>
    </Film>
  );
};

const EndScene: React.FC<{b: Beat}> = ({b}) => {
  const f = useCurrentFrame(); const p = pr(f, 0, 20);
  return (
    <Paper b={b}>
      <div style={{position: "absolute", left: 260, right: 260, top: 280, opacity: p, textAlign: "center"}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 84, color: P.ink}}>Moat &amp; Margin</div>
        <div style={{height: 3, width: 140, background: P.red, margin: "26px auto 36px"}}/>
        <div style={{fontFamily: SERIF, fontSize: 34, lineHeight: 1.5, color: P.ink}}>Every quotation is verbatim from the Nomad Investment Partnership letters (Sleep, Zakaria and Company), with the letter period and page shown. Lines marked “our note” are our own reading. Educational research, not investment advice. No company is scored. Moat &amp; Margin is not a SEBI-registered Research Analyst or Investment Adviser.</div>
      </div>
    </Paper>
  );
};

const SCENES: Record<string, React.FC<{b: Beat}>> = {title: TitleScene, page: PageScene, quote: QuoteScene, ours: QuoteScene, list: ListScene, stat: StatScene, end: EndScene};

export const SleepLong: React.FC = () => {
  let at = 0; let tickEnd = TOTAL;
  const starts = BEATS.map((b) => { const s = at; at += b.frames; if (b.scene.lastTick) tickEnd = at; return s; });
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Sequence from={0} durationInFrames={tickEnd}><Audio src={staticFile("letters/tick.wav")} volume={0.2} loop/></Sequence>
      {BEATS.map((b, i) => {
        const S = SCENES[b.scene.type];
        return (
          <Sequence key={b.key} from={starts[i]} durationInFrames={b.frames}>
            <S b={b}/>
            {b.say && <Audio src={staticFile(`letters/sleep_long/${b.key}.mp3`)}/>}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Thumb: React.FC = () => (
  <Film>
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{fontFamily: SERIF, color: "#eee", fontSize: 26, letterSpacing: 12}}>NICK SLEEP · THE NOMAD LETTERS</div>
      <div style={{fontFamily: SERIF, color: "#fff", fontSize: 120, marginTop: 20}}>The Light Bulb</div>
      <div style={{fontFamily: SERIF, color: "#fff", fontSize: 120, fontStyle: "italic"}}>Problem</div>
      <div style={{fontFamily: SERIF, color: "#ddd", fontSize: 34, marginTop: 24, fontStyle: "italic"}}>“the game is over”</div>
    </AbsoluteFill>
  </Film>
);

export const SleepLongCompositions: React.FC = () => (
  <>
    <Composition id="LR-sleep-long" component={SleepLong} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080}/>
    <Still id="LR-sleep-long-thumb" component={Thumb} width={1920} height={1080}/>
  </>
);
