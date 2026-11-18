// Prototype result Shorts in twelve story formats (AK, 19 Oct 2026: "i want to rework shorts format ... explore how can we
// present the boring earning to interesting one", then "A use ICICI result?": one rough video per format, all on one result,
// to choose from). Built on the Vox Motion+ look (src/voxplus: paper and ink grounds, serif numbers, yellow highlighter,
// marker stamps, sound effects) in a vertical frame with three layers: the hook pinned at the top, the picture in the
// middle, word-by-word captions at the bottom; a cheat-sheet card ends each one and the last line runs back into the first.
// The Result Engine (resultengine/proto.py) writes every beat's words and scene; this file only draws them. Audio is read
// from <public-dir>/vx/<D.id>/<beat>.mp3; the effects and the music bed from <public-dir>/voxplus/audio/.
import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from "remotion";
import {C, F, V, clamp01, ease, lin, outBack, outQuint, spr} from "../voxplus/tokens";
import {Finish, InkSurface, PaperSurface} from "../voxplus/Texture";
import {SFX, SfxName} from "../voxplus/Sound";
import {useVoxFonts} from "../voxplus/fonts";

export const PFPS = 30;
const PAD = 0.15, GAP = 6;   // seconds of air after each line; frames of the cut between beats
type Scene = {type: string; bg?: "paper" | "ink" | "kraft"; tail?: number; [k: string]: any};
type Beat = {key: string; say: string; cap: string; sec: number; cues?: string[]; scene: Scene};
export type PData = {id: string; beats: Beat[]; hook: string; mark?: string; format: string; music?: string;
  cheat?: {title: string; rows: [string, string][]}};
export const PEMPTY: PData = {id: "p-empty", hook: "", format: "", beats: [{key: "e0", say: "", cap: "", sec: 1, scene: {type: "blank"}}]};
const frames = (b: Beat) => Math.ceil((b.sec + PAD + (b.scene.tail ?? 0)) * PFPS);
export const protoTotal = (D: PData) => D.beats.reduce((a, b) => a + frames(b), 0);

/** The frame of a beat at which a phrase of its voice line starts (a share of the line, as the napkin does). */
const at = (b: Beat, ph?: string | number | null, off = 0): number => {
  if (ph == null) return 0 + off;
  if (typeof ph === "number") return Math.round(b.sec * PFPS * ph) + off;
  const i = b.say.toLowerCase().indexOf(ph.toLowerCase());
  if (i < 0) throw new Error(`phrase not in ${b.key}: ${ph}`);
  return Math.round(b.sec * PFPS * i / Math.max(1, b.say.length)) + off;
};
const num = (t: string) => parseFloat(String(t).replace(/[^0-9.\-]/g, "")) || 0;
const Y = 360, H = 1140;   // the middle layer: y from 360 to 1500

// ---------------------------------------------------------------- shared pieces
const In: React.FC<{f: number; a: number; dy?: number; dx?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, a, dy = 40, dx = 0, children, style}) => {
  if (f < a) return null;
  const s = spr(f, a, 14, 170);
  return <div style={{position: "absolute", opacity: clamp01(s * 2), transform: `translate(${dx * (1 - s)}px, ${dy * (1 - s)}px)`,
    filter: s < 0.7 ? `blur(${((0.7 - s) * 14).toFixed(1)}px)` : undefined, ...style}}>{children}</div>;
};
const Big: React.FC<{f: number; a: number; text: string; size?: number; color?: string; count?: boolean}> = ({f, a, text, size = 190, color = C.ink, count = true}) => {
  if (f < a) return null;
  const s = spr(f, a, 11, 200), v = num(text), p = lin(f, a, a + 26, 0, 1, (t) => 1 - Math.pow(1 - t, 4));
  const dec = (String(text).split(".")[1] || "").replace(/[^0-9]/g, "").length;
  const shown = count && /\d/.test(text) ? text.replace(/[0-9][0-9,]*\.?[0-9]*/, () => (Math.abs(v) * p).toLocaleString("en-IN", {minimumFractionDigits: dec, maximumFractionDigits: dec})) : text;
  return <div style={{fontFamily: F.serif, fontSize: size, color, lineHeight: 1, transform: `scale(${1.4 - 0.4 * s})`, opacity: clamp01(s * 3),
    letterSpacing: -size * 0.02, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums"}}>{shown}</div>;
};
const Label: React.FC<{text: string; size?: number; color?: string; weight?: number; caps?: boolean; style?: React.CSSProperties}> =
  ({text, size = 40, color = C.inkSoft, weight = 700, caps = true, style}) => (
  <div style={{fontFamily: F.sans, fontWeight: weight, fontSize: size, color, letterSpacing: caps ? 2 : 0, textTransform: caps ? "uppercase" : "none", ...style}}>{text}</div>);
const Stamp: React.FC<{f: number; a: number; text: string; color?: string; x?: number; y?: number; rot?: number; size?: number}> =
  ({f, a, text, color = C.markerRed, x = 540, y = 900, rot = -10, size = 92}) => {
  if (f < a) return null;
  const s = spr(f, a, 10, 260);
  return <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${2 - s})`, opacity: clamp01(s * 2),
    border: `10px solid ${color}`, color, fontFamily: F.sans, fontWeight: 900, fontSize: size, padding: "6px 34px", letterSpacing: 4, borderRadius: 14,
    background: "rgba(255,253,248,0.82)", whiteSpace: "nowrap"}}>{text}</div>;
};
const Ground: React.FC<{bg?: string}> = ({bg = "paper"}) => bg === "ink" ? <InkSurface/> : <PaperSurface tone={bg === "kraft" ? "kraft" : "cream"}/>;

// ---------------------------------------------------------------- the scenes (middle layer)
const SceneView: React.FC<{b: Beat; f: number}> = ({b, f}) => {
  const s = b.scene, dark = s.bg === "ink", ink = dark ? C.white : C.ink, soft = dark ? "#BDB6AA" : C.inkSoft;
  const A = (ph: any, off = 0) => at(b, ph, off);
  switch (s.type) {
    case "bignum":
      return <AbsoluteFill style={{top: Y, height: H, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30}}>
        {s.label ? <In f={f} a={A(s.at)} style={{position: "relative"}}><Label text={s.label} size={46} color={soft}/></In> : null}
        <div style={{position: "relative"}}><Big f={f} a={A(s.at, 4)} text={s.big} size={s.size ?? 200} color={s.color === "green" ? "#1E8C4E" : s.color === "red" ? C.markerRed : ink}/></div>
        {s.sub ? <In f={f} a={A(s.sub_at ?? s.at, 14)} style={{position: "relative"}}><Label text={s.sub} size={44} color={soft} caps={false} weight={600}/></In> : null}
        {s.stamp ? <Stamp f={f} a={A(s.stamp.at, 6)} text={s.stamp.text} color={s.stamp.color === "green" ? "#1E8C4E" : C.markerRed} y={s.stamp.y ?? 1300}/> : null}
      </AbsoluteFill>;
    case "question": {
      const c0 = A(s.count_at), rv = A(s.reveal_at);
      const n = f < c0 ? null : Math.max(1, 3 - Math.floor((f - c0) / 18));
      return <AbsoluteFill style={{top: Y, height: H}}>
        <In f={f} a={A(s.at)} style={{left: 70, right: 70, top: 40}}><div style={{fontFamily: F.serif, fontSize: 84, color: ink, lineHeight: 1.08, textAlign: "center"}}>{s.q}</div></In>
        {s.options.map((o: string, i: number) => {
          const win = f >= rv && i === s.answer, lose = f >= rv && i !== s.answer;
          return <In key={i} f={f} a={A(s.at, 10 + i * 6)} style={{left: 90 + i * 470, top: 470, width: 430}}>
            <div style={{height: 230, borderRadius: 26, border: `8px solid ${win ? "#1E8C4E" : ink}`, background: win ? "#1E8C4E" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", opacity: lose ? 0.25 : 1, transform: `scale(${win ? 1 + 0.06 * spr(f, rv, 9, 220) : 1})`}}>
              <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 92, color: win ? C.white : ink, letterSpacing: 3}}>{o}</div></div></In>;
        })}
        {n != null && f < rv ? <div style={{position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: F.serif, fontSize: 260, color: C.markerRed,
          transform: `scale(${1.3 - 0.3 * clamp01(((f - c0) % 18) / 6)})`}}>{n}</div> : null}
        {s.reveal ? <div style={{position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center"}}><Big f={f} a={rv + 4} text={s.reveal} size={210} color="#1E8C4E"/></div> : null}
      </AbsoluteFill>;
    }
    case "suspects":
      return <AbsoluteFill style={{top: Y, height: H}}>
        <In f={f} a={0} style={{left: 0, right: 0, top: 0, textAlign: "center"}}><Label text={s.title} size={46} color={soft}/></In>
        {s.items.map((it: any, i: number) => {
          const col = i % 2, row = Math.floor(i / 2), x = 70 + col * 480, y = 90 + row * 330, a0 = A(it.at ?? 0.05 + 0.12 * i);
          return <In key={i} f={f} a={a0} dy={60} style={{left: x, top: y, width: 460}}>
            <div style={{height: 300, background: C.white, borderRadius: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.18)", padding: 26, transform: `rotate(${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg)`}}>
              <Label text={`suspect ${i + 1}`} size={26} color={C.grey}/>
              <div style={{fontFamily: F.serif, fontSize: 56, color: C.ink, lineHeight: 1.05, marginTop: 10}}>{it.name}</div>
              <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 54, color: it.value.startsWith("-") ? C.markerRed : "#1E8C4E", marginTop: 18}}>{it.value}</div>
              {it.sub ? <Label text={it.sub} size={26} color={C.grey} caps={false} weight={600}/> : null}
            </div>
            {it.verdict ? <Stamp f={f} a={A(it.verdict_at ?? 0.8, i * 4)} text={it.verdict} color={it.verdict === "GUILTY" ? C.markerRed : "#6B6B6B"} x={300} y={250} size={44}/> : null}
          </In>;
        })}
      </AbsoluteFill>;
    case "waterfall": {
      const steps = s.steps as {label: string; value: number; text: string; kind: string; at?: any}[];
      let run = 0; const spans = steps.map((st) => {
        const from = st.kind === "end" || st.kind === "start" ? 0 : run; const to = st.kind === "end" || st.kind === "start" ? st.value : run + st.value;
        run = st.kind === "end" ? st.value : to; return [Math.min(from, to), Math.max(from, to)];
      });
      const lo = s.axis_from ?? 0, hi = Math.max(...spans.map((x) => x[1])) * 1.04;
      const X = (v: number) => 360 + (Math.max(v, lo) - lo) / (hi - lo) * 640;
      const rh = Math.min(140, (H - 160) / steps.length);
      return <AbsoluteFill style={{top: Y, height: H}}>
        <In f={f} a={0} style={{left: 60, right: 60, top: 0}}><Label text={s.title} size={40} color={soft}/></In>
        {steps.map((st, i) => {
          const a0 = A(st.at ?? 0.04 + 0.7 * i / steps.length), g = ease(f, a0, a0 + 14, outQuint), y = 110 + i * rh;
          const [p0, p1] = spans[i], col = st.kind === "minus" ? C.markerRed : st.kind === "plus" ? "#1E8C4E" : (dark ? C.highlightPrint : C.wallBlue);
          const hit = s.culprit === i && f >= A(s.culprit_at ?? 0.85);
          return f < a0 ? null : <div key={i} style={{position: "absolute", left: 0, top: y, width: 1080, height: rh}}>
            <div style={{position: "absolute", left: 60, width: 280, top: rh * 0.18, fontFamily: F.sans, fontWeight: 700, fontSize: 34, color: ink, lineHeight: 1.05}}>{st.label}</div>
            <div style={{position: "absolute", left: X(p0), top: rh * 0.16, height: rh * 0.5, width: Math.max(6, (X(p1) - X(p0)) * g), background: col,
              outline: hit ? `8px solid ${C.highlight}` : undefined, borderRadius: 6}}/>
            <div style={{position: "absolute", left: Math.min(860, X(p1) + 14), top: rh * 0.62, fontFamily: F.sans, fontWeight: 800, fontSize: 34, color: col, opacity: g}}>{st.text}</div>
          </div>;
        })}
        {s.foot ? <div style={{position: "absolute", left: 60, right: 60, top: 120 + steps.length * rh, fontFamily: F.mono, fontSize: 26, color: C.grey}}>{s.foot}</div> : null}
        {s.stamp ? <Stamp f={f} a={A(s.stamp.at, 4)} text={s.stamp.text} y={980} x={600} size={70}/> : null}
      </AbsoluteFill>;
    }
    case "receipt": {
      const lines = s.lines as {label: string; amt: string; was?: string; at?: any; bold?: boolean}[];
      const shown = lines.filter((l, i) => f >= A(l.at ?? 0.06 + 0.12 * i)).length;
      const hgt = 260 + shown * 92 + (f >= A(s.kept_at) ? 200 : 0);
      return <AbsoluteFill style={{top: Y, height: H}}>
        <div style={{position: "absolute", left: 70, width: 940, top: 20, height: Math.min(H - 40, lin(f, 0, 10, 120, hgt * 1.25)), background: "#FFFFFF", overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0,0,0,0.22)", clipPath: "polygon(0 0,100% 0,100% 100%,97% 98.5%,94% 100%,91% 98.5%,88% 100%,85% 98.5%,82% 100%,79% 98.5%,76% 100%,73% 98.5%,70% 100%,67% 98.5%,64% 100%,61% 98.5%,58% 100%,55% 98.5%,52% 100%,49% 98.5%,46% 100%,43% 98.5%,40% 100%,37% 98.5%,34% 100%,31% 98.5%,28% 100%,25% 98.5%,22% 100%,19% 98.5%,16% 100%,13% 98.5%,10% 100%,7% 98.5%,4% 100%,0 98.5%)"}}>
          <div style={{fontFamily: F.mono, color: C.ink, padding: "40px 46px"}}>
            <div style={{fontSize: 54, fontWeight: 700, textAlign: "center"}}>{s.store}</div>
            <div style={{fontSize: 32, textAlign: "center", color: C.grey, marginBottom: 30}}>{s.sub}</div>
            <div style={{display: "flex", fontSize: 30, color: C.grey, borderBottom: "3px dashed #999", paddingBottom: 12}}>
              <div style={{flex: 1}}>ITEM</div><div style={{width: 210, textAlign: "right"}}>NOW</div><div style={{width: 210, textAlign: "right"}}>{s.was_head ?? "YEAR AGO"}</div></div>
            {lines.slice(0, shown).map((l, i) => <div key={i} style={{display: "flex", fontSize: 46, padding: "28px 0", borderBottom: "2px dotted #ccc", fontWeight: l.bold ? 800 : 500}}>
              <div style={{flex: 1}}>{l.label}</div><div style={{width: 210, textAlign: "right"}}>{l.amt}</div><div style={{width: 210, textAlign: "right", color: C.grey}}>{l.was ?? ""}</div></div>)}
            {f >= A(s.kept_at) ? <div style={{marginTop: 34, padding: "22px 0", borderTop: "5px double #333", display: "flex", fontSize: 66, fontWeight: 800}}>
              <div style={{flex: 1, background: C.highlight}}>{s.kept_label}</div><div style={{width: 260, textAlign: "right", background: C.highlight}}>{s.kept}</div></div> : null}
          </div>
        </div>
        {s.foot ? <div style={{position: "absolute", left: 150, right: 150, top: H - 70, fontFamily: F.mono, fontSize: 24, color: C.grey, textAlign: "center"}}>{s.foot}</div> : null}
      </AbsoluteFill>;
    }
    case "counter": {
      const a0 = A(s.at), p = clamp01((f - a0) / Math.max(1, A(s.until ?? 0.8) - a0)), v = Math.round(p * s.to);
      return <AbsoluteFill style={{top: Y, height: H, alignItems: "center"}}>
        <In f={f} a={0} style={{top: 30, position: "absolute"}}><Label text={s.title} size={42} color={soft}/></In>
        <div style={{position: "absolute", top: 150, fontFamily: F.serif, fontSize: 210, color: dark ? C.highlightPrint : C.ink}}>“{s.word}”</div>
        <div style={{position: "absolute", top: 440, fontFamily: F.sans, fontWeight: 900, fontSize: 300, color: ink, fontVariantNumeric: "tabular-nums",
          transform: `scale(${1 + 0.04 * Math.sin(v)})`}}>{f >= a0 ? v : 0}</div>
        <div style={{position: "absolute", top: 790, fontFamily: F.sans, fontWeight: 700, fontSize: 44, color: soft}}>{s.unit}</div>
        {s.sub ? <In f={f} a={A(s.sub_at ?? 0.85)} style={{top: 880, position: "absolute", left: 80, right: 80, textAlign: "center"}}>
          <div style={{fontFamily: F.serif, fontSize: 62, color: ink, lineHeight: 1.1}}>{s.sub}</div></In> : null}
      </AbsoluteFill>;
    }
    case "ticker": {
      const x = -((f * 7) % 2600);
      return <AbsoluteFill style={{top: Y, height: H}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 120, height: 130, background: C.markerRed, transform: `scaleX(${ease(f, 0, 8, outQuint)})`}}>
          <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 92, color: C.white, letterSpacing: 10, padding: "12px 60px"}}>{s.kicker}</div></div>
        <In f={f} a={A(s.at)} style={{left: 60, right: 60, top: 320}}><div style={{fontFamily: F.serif, fontSize: 104, color: ink, lineHeight: 1.05}}>{s.headline}</div></In>
        {s.big ? <In f={f} a={A(s.big_at ?? s.at, 8)} style={{left: 60, top: 720}}><Big f={f} a={A(s.big_at ?? s.at, 8)} text={s.big} size={180} color="#1E8C4E"/></In> : null}
        {s.sub ? <In f={f} a={A(s.sub_at ?? 0.6)} style={{left: 60, right: 60, top: 940}}><Label text={s.sub} size={44} color={soft} caps={false} weight={600}/></In> : null}
        <div style={{position: "absolute", left: 0, right: 0, top: H - 90, height: 80, background: C.ink, overflow: "hidden"}}>
          <div style={{position: "absolute", left: x, top: 14, whiteSpace: "nowrap", fontFamily: F.sans, fontWeight: 700, fontSize: 42, color: C.highlight}}>{(s.crawl + "   ·   ").repeat(4)}</div></div>
      </AbsoluteFill>;
    }
    case "table": {
      const rows = s.rows as {name: string; text: string; v: number; ours?: boolean; at?: any}[];
      const mx = Math.max(...rows.map((r) => Math.abs(r.v)), 1), rh = Math.min(132, (H - 200) / rows.length);
      return <AbsoluteFill style={{top: Y, height: H}}>
        <In f={f} a={0} style={{left: 60, right: 60, top: 0}}><Label text={s.title} size={40} color={soft}/></In>
        {rows.map((r, i) => {
          const a0 = A(r.at ?? 0.04 + 0.55 * i / rows.length), g = ease(f, a0, a0 + 14, outQuint), y = 100 + i * rh;
          return f < a0 ? null : <div key={i} style={{position: "absolute", left: 0, top: y, width: 1080, height: rh, background: r.ours ? "rgba(255,242,0,0.55)" : "transparent"}}>
            <div style={{position: "absolute", left: 50, top: rh * 0.2, fontFamily: F.serif, fontSize: 50, color: C.grey}}>{i + 1}</div>
            <div style={{position: "absolute", left: 120, top: rh * 0.2, fontFamily: F.sans, fontWeight: 800, fontSize: 44, color: ink}}>{r.name}</div>
            <div style={{position: "absolute", left: 120, top: rh * 0.68, height: 14, width: 560 * Math.abs(r.v) / mx * g, background: r.v < 0 ? C.markerRed : ink, borderRadius: 7}}/>
            <div style={{position: "absolute", right: 60, top: rh * 0.2, fontFamily: F.sans, fontWeight: 900, fontSize: 52, color: r.v < 0 ? C.markerRed : ink, opacity: g}}>{r.text}</div>
          </div>;
        })}
        {s.stamp ? <Stamp f={f} a={A(s.stamp.at, 4)} text={s.stamp.text} y={100 + rows.length * rh + 70} x={560} size={52} color={C.wallBlue} rot={-4}/> : null}
      </AbsoluteFill>;
    }
    case "report":
      return <AbsoluteFill style={{top: Y, height: H}}>
        <div style={{position: "absolute", left: 70, right: 70, top: 10, bottom: 40, background: C.white, boxShadow: "0 12px 30px rgba(0,0,0,0.18)", padding: "36px 40px",
          backgroundImage: "repeating-linear-gradient(transparent, transparent 86px, #DCE6F2 86px, #DCE6F2 88px)"}}>
          <div style={{fontFamily: F.serif, fontSize: 64, color: C.ink}}>{s.title}</div>
          <Label text={s.sub} size={26} color={C.grey}/>
          {s.rows.map((r: any, i: number) => {
            const a0 = A(r.at ?? 0.06 + 0.13 * i);
            return <div key={i} style={{position: "relative", height: 150, marginTop: i ? 0 : 30, borderBottom: "2px solid #E3E3E3"}}>
              <div style={{position: "absolute", left: 0, top: 26, fontFamily: F.sans, fontWeight: 800, fontSize: 42, color: C.ink}}>{r.subject}</div>
              <div style={{position: "absolute", left: 0, top: 86, fontFamily: F.sans, fontSize: 30, color: C.grey}}>{r.note}</div>
              {f >= a0 ? <div style={{position: "absolute", right: 30, top: 6, fontFamily: F.marker, fontSize: 116, color: C.markerRed,
                transform: `scale(${1.6 - 0.6 * spr(f, a0, 10, 220)}) rotate(-8deg)`, opacity: clamp01(spr(f, a0) * 2)}}>{r.grade}</div> : null}
            </div>;
          })}
        </div>
      </AbsoluteFill>;
    case "quote":
      return <AbsoluteFill style={{top: Y, height: H}}>
        {s.kicker ? <In f={f} a={0} style={{left: 70, right: 70, top: 10}}><Label text={s.kicker} size={36} color={soft}/></In> : null}
        <In f={f} a={A(s.at ?? 0.02)} style={{left: 70, right: 70, top: 90}}>
          <div style={{background: C.white, padding: "46px 50px", boxShadow: "0 12px 30px rgba(0,0,0,0.18)", transform: "rotate(-1deg)"}}>
            <div style={{fontFamily: F.serif, fontSize: s.text.length > 150 ? 50 : 60, color: C.ink, lineHeight: 1.22}}>“{s.text}”</div>
            <div style={{fontFamily: F.mono, fontSize: 26, color: C.grey, marginTop: 30}}>{s.who}</div>
          </div></In>
        {s.filed ? <In f={f} a={A(s.filed.at)} dy={80} style={{left: 120, right: 120, top: 700}}>
          <div style={{background: C.ink, padding: "34px 44px", transform: "rotate(1.5deg)", boxShadow: "0 14px 30px rgba(0,0,0,0.3)"}}>
            <Label text={s.filed.label} size={30} color={C.highlight}/>
            <div style={{fontFamily: F.serif, fontSize: 120, color: C.white, lineHeight: 1.05, marginTop: 10}}>{s.filed.big}</div>
            <div style={{fontFamily: F.mono, fontSize: 24, color: "#BDB6AA", marginTop: 12}}>{s.filed.sub}</div></div></In> : null}
      </AbsoluteFill>;
    case "chat":
      return <AbsoluteFill style={{top: Y - 20, height: H + 40, background: "#ECE5DD"}}>
        <div style={{height: 110, background: "#075E54", display: "flex", alignItems: "center", padding: "0 40px", gap: 24}}>
          <div style={{width: 70, height: 70, borderRadius: 35, background: "#25D366"}}/>
          <div><div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 40, color: C.white}}>{s.title}</div>
            <div style={{fontFamily: F.sans, fontSize: 26, color: "#CDE9E3"}}>{s.members}</div></div></div>
        <div style={{position: "absolute", left: 30, right: 30, bottom: 30, display: "flex", flexDirection: "column", gap: 18}}>
          {s.msgs.filter((m: any) => f >= A(m.at)).slice(-6).map((m: any, i: number) => {
            const a0 = A(m.at), sc = spr(f, a0, 12, 220);
            return <div key={m.at + i} style={{alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: 780, background: m.me ? "#DCF8C6" : C.white, borderRadius: 22,
              padding: "16px 24px", boxShadow: "0 2px 4px rgba(0,0,0,0.12)", transform: `scale(${0.6 + 0.4 * sc})`, transformOrigin: m.me ? "100% 100%" : "0 100%", opacity: clamp01(sc * 2)}}>
              {!m.me ? <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 28, color: m.color ?? "#C2185B"}}>{m.who}</div> : null}
              <div style={{fontFamily: F.sans, fontSize: 40, color: "#111", lineHeight: 1.25}}>{m.text}</div></div>;
          })}
        </div>
      </AbsoluteFill>;
    case "treemap": {
      const items = s.items as {name: string; a: number; b: number}[];
      const flip = A(s.flip_at), t = ease(f, flip, flip + 24, outQuint);
      const lay = (key: "a" | "b") => squarify(items.map((it) => it[key]), 60, 120, 960, 900);
      const LA = lay("a"), LB = lay("b"), cols = [C.wallBlue, "#1E8C4E", C.markerRed, "#E8A317", C.inkSoft, C.magenta, "#5C6BC0", "#8D6E63"];
      return <AbsoluteFill style={{top: Y, height: H}}>
        <div style={{position: "absolute", left: 60, right: 60, top: 10, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: ink}}>
          <span style={{opacity: 1 - t}}>{s.labelA}</span><span style={{position: "absolute", left: 0, opacity: t}}>{s.labelB}</span></div>
        {items.map((it, i) => {
          const r = LA[i].map((v, k) => v + (LB[i][k] - v) * t), share = it.a + (it.b - it.a) * t, a0 = A(0.03 + 0.04 * i);
          return f < a0 ? null : <div key={i} style={{position: "absolute", left: r[0] + 3, top: r[1] + 3, width: Math.max(0, r[2] - 6), height: Math.max(0, r[3] - 6),
            background: cols[i % cols.length], opacity: clamp01(spr(f, a0) * 1.5), overflow: "hidden", borderRadius: 8, padding: 14}}>
            {r[2] > 150 && r[3] > 90 ? <><div style={{fontFamily: F.sans, fontWeight: 800, fontSize: Math.min(44, r[2] / 7), color: C.white, lineHeight: 1.05}}>{it.name}</div>
              <div style={{fontFamily: F.serif, fontSize: Math.min(90, r[3] / 2.4), color: C.white}}>{share.toFixed(0)}%</div></> : null}
          </div>;
        })}
        {s.foot ? <div style={{position: "absolute", left: 60, right: 60, top: 1050, fontFamily: F.mono, fontSize: 24, color: C.grey}}>{s.foot}</div> : null}
      </AbsoluteFill>;
    }
    case "machine": {
      const st = s.stages as {label: string; big: string; sub?: string; warn?: boolean; at?: any}[], gap = (H - 120) / st.length;
      return <AbsoluteFill style={{top: Y, height: H}}>
        <div style={{position: "absolute", left: 200, top: 80, width: 14, height: gap * (st.length - 1), background: dark ? "#555" : "#C9C2B4"}}/>
        {Array.from({length: 8}, (_, k) => { const y = 80 + (((f * 6) + k * 120) % (gap * (st.length - 1))); return <div key={k} style={{position: "absolute", left: 197, top: y, width: 20, height: 20, borderRadius: 10, background: C.highlight}}/>; })}
        {st.map((x, i) => {
          const a0 = A(x.at ?? 0.04 + 0.75 * i / st.length);
          return <In key={i} f={f} a={a0} dx={-60} dy={0} style={{left: 120, top: 40 + i * gap, width: 880}}>
            <div style={{display: "flex", alignItems: "center", gap: 40}}>
              <div style={{width: 170, height: 110, borderRadius: 18, background: x.warn ? "#E8A317" : (dark ? C.highlightPrint : C.wallBlue), display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: x.warn ? `0 0 ${20 + 10 * Math.sin(f / 4)}px #E8A317` : undefined}}>
                <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 28, color: dark && !x.warn ? C.ink : C.white, textAlign: "center", lineHeight: 1.05, padding: 8}}>{x.label}</div></div>
              <div><div style={{fontFamily: F.serif, fontSize: 78, color: ink, lineHeight: 1}}>{x.big}</div>
                {x.sub ? <div style={{fontFamily: F.sans, fontSize: 30, color: soft, marginTop: 6}}>{x.sub}</div> : null}</div></div></In>;
        })}
      </AbsoluteFill>;
    }
    case "qa":
      return <AbsoluteFill style={{top: Y, height: H}}>
        <In f={f} a={A(s.at ?? 0.02)} style={{left: 60, right: 200, top: 30}}>
          <div style={{background: C.ink, borderRadius: "28px 28px 28px 4px", padding: "30px 38px"}}>
            <Label text={s.asker} size={28} color={C.highlight}/>
            <div style={{fontFamily: F.serif, fontSize: 66, color: C.white, lineHeight: 1.1, marginTop: 8}}>{s.topic}</div></div></In>
        <In f={f} a={A(s.answer_at)} style={{left: 160, right: 60, top: 400}}>
          <div style={{background: C.white, borderRadius: "28px 28px 4px 28px", padding: "36px 40px", boxShadow: "0 12px 30px rgba(0,0,0,0.18)"}}>
            <Label text={s.who} size={28} color={C.grey}/>
            <div style={{fontFamily: F.serif, fontSize: s.answer.length > 150 ? 46 : 54, color: C.ink, lineHeight: 1.22, marginTop: 10}}>“{s.answer}”</div></div></In>
      </AbsoluteFill>;
    case "cheat":
      return <AbsoluteFill style={{top: Y, height: H, alignItems: "center"}}>
        <div style={{position: "absolute", left: 70, right: 70, top: 60, background: C.ink, padding: "40px 46px", borderRadius: 10, transform: `scale(${0.9 + 0.1 * spr(f, 0, 12, 220)})`}}>
          <div style={{fontFamily: F.sans, fontWeight: 900, fontSize: 44, color: C.ink, background: C.highlight, display: "inline-block", padding: "4px 18px"}}>{s.title}</div>
          {s.rows.map((r: [string, string], i: number) => <div key={i} style={{display: "flex", justifyContent: "space-between", borderBottom: "2px solid #333", padding: "24px 0"}}>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 40, color: "#CFC8BC"}}>{r[0]}</div>
            <div style={{fontFamily: F.serif, fontSize: 56, color: C.white}}>{r[1]}</div></div>)}
          <div style={{fontFamily: F.mono, fontSize: 24, color: "#9A948A", marginTop: 22}}>{s.foot}</div>
        </div>
      </AbsoluteFill>;
    default:
      return null;
  }
};

/** Squarified treemap of values in a box: [x, y, w, h] per value, in the given order (largest first works best). */
function squarify(vals: number[], x0: number, y0: number, w0: number, h0: number): number[][] {
  const tot = vals.reduce((a, b) => a + b, 0) || 1, out: number[][] = new Array(vals.length);
  const order = vals.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
  let x = x0, y = y0, w = w0, h = h0, row: number[][] = [], area = w0 * h0;
  const worst = (r: number[][], side: number) => { const s = r.reduce((a, b) => a + b[0], 0); const mx = Math.max(...r.map((q) => q[0])), mn = Math.min(...r.map((q) => q[0]));
    return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn)); };
  const lay = (r: number[][]) => { const s = r.reduce((a, b) => a + b[0], 0);
    if (w >= h) { const cw = s / h; let yy = y; for (const [a, i] of r) { out[i] = [x, yy, cw, a / cw]; yy += a / cw; } x += cw; w -= cw; }
    else { const ch = s / w; let xx = x; for (const [a, i] of r) { out[i] = [xx, y, a / ch, ch]; xx += a / ch; } y += ch; h -= ch; } };
  const items = order.map(([v, i]) => [v / tot * area, i]);
  for (const it of items) { const side = Math.min(w, h); if (!row.length || worst([...row, it], side) <= worst(row, side)) row.push(it); else { lay(row); row = [it]; } }
  if (row.length) lay(row);
  return out;
}

// ---------------------------------------------------------------- the three layers
const HookBanner: React.FC<{text: string; mark?: string}> = ({text, mark}) => {
  const parts = mark && text.includes(mark) ? text.split(mark) : [text];
  return <div style={{position: "absolute", left: 50, right: 50, top: 110, minHeight: 200, background: C.ink, borderRadius: 12, padding: "26px 34px", display: "flex", alignItems: "center"}}>
    <div style={{fontFamily: F.serif, fontSize: text.length > 44 ? 62 : 74, color: C.white, lineHeight: 1.08}}>
      {parts.length === 2 ? <>{parts[0]}<span style={{background: C.highlight, color: C.ink, padding: "0 10px"}}>{mark}</span>{parts[1]}</> : text}</div></div>;
};
const Captions: React.FC<{b: Beat; f: number}> = ({b, f}) => {
  const cues = b.cues ?? [b.cap], n = Math.ceil(b.sec * PFPS);
  const total = cues.reduce((a, s) => a + s.length, 0) || 1;
  let acc = 0, cur = cues[cues.length - 1] ?? "", start = (total - cur.length) / total * n;
  for (const c of cues) {   // the chunk being said now, and where it began
    if (f < (acc + c.length) / total * n) { cur = c; start = acc / total * n; break; }
    acc += c.length;
  }
  if (!cur) return null;
  const words = cur.split(" "), span = cur.length / total * n, k = Math.min(words.length - 1, Math.floor(((f - start) / Math.max(1, span)) * words.length));
  return <div style={{position: "absolute", left: 60, right: 60, top: 1540, textAlign: "center", lineHeight: 1.25}}>
    {words.map((w, i) => <span key={i} style={{fontFamily: F.sans, fontWeight: 900, fontSize: 54, color: i === k ? C.ink : C.white, background: i === k ? C.highlight : "rgba(14,14,14,0.78)",
      padding: "2px 12px", margin: "0 4px", display: "inline-block", marginBottom: 8, borderRadius: 6}}>{w}</span>)}</div>;
};
const sfxFor = (b: Beat): [number, SfxName][] => {
  const s = b.scene, A = (ph: any, o = 0) => at(b, ph, o), out: [number, SfxName][] = [[0, "whoosh"]];
  if (s.type === "bignum") out.push([A(s.at, 4), "ding"]);
  if (s.type === "question") { const c0 = A(s.count_at); out.push([c0, "click"], [c0 + 18, "click"], [c0 + 36, "click"], [A(s.reveal_at), "stamp"]); }
  if (s.type === "chat") for (const m of s.msgs) out.push([A(m.at), "pop"]);
  if (s.type === "receipt") s.lines.forEach((l: any, i: number) => out.push([A(l.at ?? 0.06 + 0.12 * i), "click"]));
  if (s.type === "suspects") s.items.forEach((it: any, i: number) => it.verdict && out.push([A(it.verdict_at ?? 0.8, i * 4), "stamp"]));
  if (s.type === "report") s.rows.forEach((r: any, i: number) => out.push([A(r.at ?? 0.06 + 0.13 * i), "circle"]));
  if (s.stamp) out.push([A(s.stamp.at, 4), "stamp"]);
  if (s.type === "treemap") out.push([A(s.flip_at), "whooshDeep"]);
  return out;
};

export const ProtoShort: React.FC<{D: PData; label: string}> = ({D, label}) => {
  useVoxFonts();
  const total = protoTotal(D);
  let from = 0;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      {D.beats.map((b) => {
        const n = frames(b), el = (
          <Sequence key={b.key} from={from} durationInFrames={n}>
            <BeatView b={b} n={n}/>
            {b.say ? <Audio src={staticFile(`vx/${D.id}/${b.key}.mp3`)}/> : null}
            {sfxFor(b).map(([a, name], i) => <Sequence key={i} from={Math.max(0, a)} durationInFrames={150} layout="none">
              <Audio src={V(SFX[name].file)} volume={SFX[name].vol * 0.9}/></Sequence>)}
          </Sequence>);
        from += n;
        return el;
      })}
      {D.music ? <Audio src={V(D.music)} volume={(f) => 0.07 * clamp01(f / 20) * (1 - clamp01((f - (total - 30)) / 30))}/> : null}
      <AbsoluteFill style={{pointerEvents: "none"}}>
        <HookBanner text={D.hook} mark={D.mark}/>
        <div style={{position: "absolute", left: 50, top: 40, fontFamily: F.sans, fontWeight: 800, fontSize: 30, color: C.ink, background: C.highlight, padding: "6px 16px"}}>{label}</div>
        <div style={{position: "absolute", left: 0, right: 0, top: 1848, textAlign: "center", fontFamily: F.sans, fontWeight: 700, fontSize: 26, color: C.inkSoft}}>Moat &amp; Margin · from the filings</div>
        <div style={{position: "absolute", left: 0, right: 0, top: 1884, textAlign: "center", fontFamily: F.sans, fontSize: 21, color: C.grey}}>Educational research, not investment advice · not SEBI-registered</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BeatView: React.FC<{b: Beat; n: number}> = ({b, n}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, GAP], [0, 1], {extrapolateRight: "clamp"});
  const blur = f < GAP ? (GAP - f) * 3 : 0;
  return <AbsoluteFill>
    <Ground bg={b.scene.bg}/>
    <AbsoluteFill style={{opacity: o, filter: blur ? `blur(${blur}px)` : undefined, transform: `translateY(${(1 - o) * 30}px)`}}><SceneView b={b} f={f}/></AbsoluteFill>
    <Finish f={f} dark={b.scene.bg === "ink"}/>
    <Captions b={b} f={f}/>
  </AbsoluteFill>;
};
