// The Katha film engine (21 Oct 2026): a long-form story film in the Katha look. Beats dissolve into each other, the
// narration is captioned in Cormorant (Krishna's and Arjuna's quoted lines in gold, with the speaker named), a row of
// eighteen lamps lights up chapter by chapter, the tanpura bed runs underneath with a bell at each chapter.
// Data: public/katha/<id>/data.json, built by scripts/katha/build_film.py from the script (scripts/katha/<id>.json).
// 22 Oct 2026 (engine pass): a film-level overlay over every beat, outside the scene and its camera push:
//  - the attribution plate (scene.plate) under the captions, so every quoted line plays with its chapter, verse and
//    translator (house rule 1; a verse card carries its own source line, so it gets no plate);
//  - the OUR NOTE tag (scene.kicker on a non-title beat), boxed in saffron so our own reading never passes for the text;
//  - the cited Devanagari (scene.label, which the builder parses from the script's scene.overlay) through stage.tsx Label;
//  - the end card's disclosure strips (scene.strips), each lit as the narrator reaches it; on the end beat the captions
//    shrink and sit low so the credits stay clear while the disclosure is still captioned in full.
// 22 Oct 2026 (engine pass 2): a quoted speaker is named at the head of the attribution row (KRISHNA · BHAGAVAD GITA
// 2.47 · AFTER ...), not above the line, so the caption block stays under y 940 and off the scene's subject; captions of
// consecutive beats never overlap in a dissolve; the lamps row and the chapter line switch to deep indigo ink while the
// frame behind them is blazing white (the thousand suns), as the cited Devanagari already does.
import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {K, W, H, FPS, EN, CAPS, KathaFonts} from "./look";
import {KATHA_SCENES} from "./scenes";
import {Label} from "./stage";

export type KBeat = {key: string; chapter: number; movement: string; speaker: string; say: string; cap?: string; sec: number; audio?: string; scene: any; music?: string; ref?: string | null};
export type KData = {id: string; title: string; beats: KBeat[]; music?: string; bell?: string; captions?: boolean};
export const XF = 14;   // dissolve between beats, in frames
export const beatLen = (b: KBeat) => Math.ceil((b.sec + (b.scene?.type === "title" ? 1.0 : 0.6)) * FPS);
export const filmLayout = (D: KData) => {
  const frames = D.beats.map(beatLen), starts: number[] = [];
  frames.forEach((n, i) => starts.push(i ? starts[i - 1] + frames[i - 1] : 0));
  return {frames, starts, total: frames.reduce((a, b) => a + b, 0) + XF};
};
const ease = (f: number, a: number, d: number) => interpolate(f, [a, a + d], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
// The bottom of the frame, from the bottom up: the plate's baseline 46 px up (inside title-safe), the captions above it.
const PLATE_BOTTOM = 40, CAP_BOTTOM = 86;
const QUOTED = ["KRISHNA", "ARJUNA", "DHRITARASHTRA"];
// The attribution row is read on a phone and across a room, so 26 px at 0.9 and tags at 22 px (style guide, section 4).
// A row too long for one line (13.34's plate, with its 700-verse number) breaks at the plate's first " · " onto two
// lines, and the caption above lifts by one plate line. CAPS_ADV is Cinzel's average capital advance per em, measured on
// a render (24 Oct 2026: 44 capitals at 26 px, letter-spacing 3, took 746 px).
const PLATE_PX = 26, PLATE_LS = 3, TAG_PX = 22, PLATE_LINE = 34, CAPS_ADV = 0.55, ROW_MAX = 1760;
const plateLines = (b: KBeat): string[] => {
  const s = b.scene || {};
  const p = s.plate ? String(s.plate).toUpperCase() : "";
  if (!p || s.type === "verse" || s.type === "title" || s.type === "end") return p ? [p] : [];
  const extra = (QUOTED.includes(b.speaker) ? b.speaker.length + 3 : 0) + (s.kicker ? String(s.kicker).length + 4 : 0);
  const cut = p.indexOf(" · ");
  if (cut < 0 || (p.length + extra) * (PLATE_PX * CAPS_ADV + PLATE_LS) <= ROW_MAX) return [p];
  return [p.slice(0, cut), p.slice(cut + 3)];
};
// A clause longer than one caption line (~80 characters at 44 px) is halved where it reads best: at a comma, else before
// a conjunction or a dash, else at the space nearest the middle; so a cue never wraps to a second line over the shot.
const CUE_MAX = 80, CONJ = /^(and|but|or|nor|yet|so|that|which|who|when|where|while|as|if|though|until|because)\s/;
const halve = (p: string): string[] => {
  if (p.length <= CUE_MAX) return [p];
  const mid = p.length / 2, cand: [number, number][] = [];
  for (const m of p.matchAll(/,\s|\s—\s|\s/g)) {
    const comma = m[0].startsWith(","), i = (m.index ?? 0) + (comma ? 1 : 0);
    if (i <= 12 || p.length - i <= 12) continue;
    const joint = m[0].includes("—") || CONJ.test(p.slice(i + 1));      // before "and", "but", "when", a dash...
    cand.push([Math.abs(i - mid) / p.length + (comma ? -0.06 : joint ? 0.08 : 0.22), i]);
  }
  if (!cand.length) return [p];
  const i = cand.sort((a, b) => a[0] - b[0])[0][1];
  return [...halve(p.slice(0, i).trim()), ...halve(p.slice(i).trim())];
};
// Split a line into caption cues: its sentences (and clauses after ; or :), each long one halved, short neighbours
// joined up to ~72 characters, so no cue is a stranded word ("Purity,") and none wraps.
const sentences = (t: string): string[] => {            // split after . ! ? ; : but never inside a quotation
  const out: string[] = []; let cur = "", q = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t[i]; cur += c;
    if (c === "\u201C") q++; else if (c === "\u201D") q = Math.max(0, q - 1);
    if (!q && /[.!?;:]/.test(c) && t[i + 1] === " " && !/[\u201D"]/.test(t[i + 1])) { out.push(cur.trim()); cur = ""; }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};
export const cues = (text: string): string[] => {
  const parts = sentences(String(text).replace(/\s+/g, " ").trim()).flatMap(halve), out: string[] = [];
  let cur = "";
  for (const p of parts) { if ((cur + " " + p).trim().length > 72 && cur) { out.push(cur.trim()); cur = p; } else cur = (cur + " " + p).trim(); }
  if (cur) out.push(cur.trim());
  return out;
};
// When the narration reaches character i of the line (the captions' clock: cues advance by their share of the text).
const speechAt = (text: string, i: number, n: number) => XF + (Math.max(0, i) / Math.max(1, String(text).length)) * (n - XF - 10);
const Caption: React.FC<{b: KBeat; n: number; on: boolean}> = ({b, n, on}) => {
  const f = useCurrentFrame();
  if (!on || b.scene?.type === "verse" || b.scene?.type === "title" || b.scene?.captions === false) return null;
  const cs = cues(b.cap || b.say), tot = cs.reduce((a, c) => a + c.length, 0), span = n - XF - 10;
  let acc = 0, idx = 0;
  for (let i = 0; i < cs.length; i++) { const s0 = XF + (acc / tot) * span; if (f >= s0) idx = i; acc += cs[i].length; }
  const quote = QUOTED.includes(b.speaker);
  const tag = quote && !b.scene?.plate;    // with a plate the speaker heads the attribution row instead (Plate)
  const end = b.scene?.type === "end";     // the end card's credits fill the lower middle: a smaller line, lower down
  // in at XF - 2, out by n - 2: the next beat's caption starts at its XF - 2 (= this beat's n - 2), so two never overlap
  const a = ease(f, XF - 2, 12) * (1 - ease(f, n - 12, 10));
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: end ? 52 : CAP_BOTTOM + (plateLines(b).length > 1 ? PLATE_LINE : 0), display: "flex", flexDirection: "column", alignItems: "center", opacity: a}}>
      {tag ? <div style={{fontFamily: CAPS, fontSize: TAG_PX, letterSpacing: 5, color: K.gold, marginBottom: 10, textShadow: "0 0 12px rgba(0,0,0,.9)"}}>{b.speaker}</div> : null}
      <div style={{fontFamily: EN, fontStyle: quote ? "italic" : "normal", fontWeight: 500, fontSize: end ? 32 : 44, lineHeight: 1.2, color: quote ? "#F6D99A" : end ? "#E9DCC2" : K.cream, maxWidth: end ? 1600 : 1500, textAlign: "center",
        textShadow: "0 0 18px rgba(0,0,0,.95), 0 2px 4px rgba(0,0,0,.9)"}}>{cs[idx]}</div>
    </div>
  );
};
// A soft dark breath under the captions and the plate (a gradient, no band edge), so a close shot's wheel or rails never
// cross the words; not on cards or the end, which are dark already.
const Scrim: React.FC<{b: KBeat; n: number}> = ({b, n}) => {
  const f = useCurrentFrame();
  const t = b.scene?.type;
  if (t === "verse" || t === "title" || t === "end") return null;
  const a = ease(f, XF - 4, 14) * (1 - ease(f, n - 10, 10));
  // the breath deepens towards the words' rows (y 940-1050); in a close shot (zoom 1.3 and more) the wheel and the
  // horses' legs reach the bottom edge, so a soft pool centred under the words dims their rims a little more
  const close = (b.scene?.zoomFrom ?? 1) >= 1.3;
  return <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 330, opacity: a,
    background: (close ? "radial-gradient(ellipse 52% 58% at 50% 100%, rgba(7,5,15,.5) 0%, rgba(7,5,15,.3) 50%, rgba(7,5,15,0) 100%), " : "") +
      "linear-gradient(to bottom, rgba(7,5,15,0) 0%, rgba(7,5,15,.16) 35%, rgba(7,5,15,.4) 62%, rgba(7,5,15,.6) 100%)"}}/>;
};
// A small lotus bud, the mark of the OUR NOTE tag.
const Bud: React.FC<{c: string}> = ({c}) => (
  <svg width={14} height={16} viewBox="-7 -9 14 16" style={{display: "block"}}>
    <path d="M 0 -8 C 4 -4 4 1 0 4 C -4 1 -4 -4 0 -8 Z" fill={c}/>
    <path d="M 0 4 C 3 1 5 0 7 1 C 5 4 3 5 0 4 Z M 0 4 C -3 1 -5 0 -7 1 C -5 4 -3 5 0 4 Z" fill={c} opacity={0.75}/>
  </svg>
);
// The attribution row and the OUR NOTE tag: one place under the captions, small letter-spaced Cinzel, fading in as the
// line begins and out after the voice ends (the next beat's row comes in after its dissolve, so two never overlap). A
// quoted speaker (Krishna, Arjuna, Dhritarashtra) heads the row: KRISHNA · BHAGAVAD GITA 2.47 · AFTER SHRI PUROHIT
// SWAMI, 1935. Never on a verse card (its source line is on the card), a title or the end.
const Plate: React.FC<{b: KBeat; n: number}> = ({b, n}) => {
  const f = useCurrentFrame();
  const s = b.scene || {};
  if (s.type === "verse" || s.type === "title" || s.type === "end") return null;
  const plate = s.plate ? String(s.plate) : "", note = s.kicker ? String(s.kicker) : "";
  if (!plate && !note) return null;
  const who = plate && QUOTED.includes(b.speaker) ? b.speaker : "";
  const a = ease(f, XF + 2, 16) * (1 - ease(f, n - 18, 12));
  const shadow = "0 0 10px rgba(7,5,15,.95), 0 1px 3px rgba(7,5,15,.9)";
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: PLATE_BOTTOM, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, opacity: a}}>
      {note ? <div style={{display: "flex", alignItems: "center", gap: 9, padding: "5px 14px 4px 11px", border: "1px solid rgba(240,160,75,.8)", borderRadius: 3,
        background: "rgba(42,18,30,.62)", boxShadow: "0 0 14px rgba(240,160,75,.18)"}}>
        <Bud c={K.saffron}/>
        <span style={{fontFamily: CAPS, fontWeight: 600, fontSize: TAG_PX, letterSpacing: 4, color: "#FFC98A", lineHeight: 1}}>{note.toUpperCase()}</span>
      </div> : null}
      {who ? <div style={{display: "flex", alignItems: "center", gap: 16}}>
        <span style={{fontFamily: CAPS, fontWeight: 600, fontSize: TAG_PX, letterSpacing: 4, color: K.gold, textShadow: shadow, whiteSpace: "nowrap", lineHeight: 1}}>{who}</span>
        <span style={{width: 6, height: 6, transform: "rotate(45deg)", background: K.gold, opacity: 0.6}}/>
      </div> : null}
      {plate ? <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: PLATE_LINE - PLATE_PX}}>
        {plateLines(b).map((t, i) => <div key={i} style={{fontFamily: CAPS, fontSize: PLATE_PX, letterSpacing: PLATE_LS, color: "#E8C27A", opacity: 0.9, textShadow: shadow, whiteSpace: "nowrap", lineHeight: 1}}>{t}</div>)}
      </div> : null}
    </div>
  );
};
// The cited Devanagari of a non-card beat, by the one Label rule; it writes itself in just after the dissolve.
const BeatLabel: React.FC<{b: KBeat; n: number}> = ({b, n}) => {
  const f = useCurrentFrame();
  const s = b.scene || {}, L = s.label;
  if (!L || s.type === "verse" || s.type === "title") return null;
  const ink = s.type === "light" && (s.variant || "full") === "full" && !(s.tone > 0.5) ? "dark" : "light";
  return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", left: 0, top: 0}}><Label sa={L.sa} en={L.en} hl={L.hl} f={f} at={XF + 16} until={n - XF} ink={ink}/></svg>;
};
// The end card's disclosure strips, in one row above the low captions; each lights when the narrator says it.
const EndStrips: React.FC<{b: KBeat; n: number}> = ({b, n}) => {
  const f = useCurrentFrame();
  const strips: string[] = Array.isArray(b.scene?.strips) ? b.scene.strips.map(String) : [];
  if (b.scene?.type !== "end" || !strips.length) return null;
  const say = String(b.say || "").toLowerCase(), out = 1 - ease(f, n - 46, 26);
  // a strip's cue: the first of its words (4+ letters) the narration speaks, else evenly through the line
  const at = strips.map((t, i) => {
    const w = (t.toLowerCase().match(/[a-z]{4,}/g) || []).find((x) => say.includes(x));
    return w ? speechAt(say, say.indexOf(w), n) : XF + ((i + 0.5) / strips.length) * (n - XF - 40);
  });
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: 122, display: "flex", justifyContent: "center", alignItems: "center", gap: 0, opacity: out}}>
      {strips.map((t, i) => {
        const a = ease(f, at[i] - 4, 16);
        return <React.Fragment key={i}>
          {i ? <div style={{width: 5, height: 5, margin: "0 14px", transform: "rotate(45deg)", background: K.gold, opacity: 0.55 * Math.min(a, ease(f, at[i - 1] - 4, 16))}}/> : null}
          <div style={{fontFamily: CAPS, fontSize: TAG_PX, letterSpacing: 2, color: "#E8C27A", opacity: 0.9 * a, transform: `translateY(${(1 - a) * 6}px)`, whiteSpace: "nowrap", textShadow: "0 0 10px rgba(7,5,15,.9)"}}>{t}</div>
        </React.Fragment>;
      })}
    </div>
  );
};
// How white the top of the frame is behind the lamps row (0..1). The thousand suns ("light", full) blaze to the edges;
// "fade" starts there and gathers back to a point (cosmos.tsx LightScene); measured on renders, the top goes dark at about
// a third of the beat, so the ink turns there.
const glare = (b: KBeat | undefined, lf: number, n: number) => {
  const s = b?.scene || {};
  if (s.type !== "light") return 0;
  const v = s.variant || "full";
  if (v === "full") return 1;
  if (v !== "fade") return 0;
  const u = Math.min(1, Math.max(0, (lf / Math.max(1, n)) * 1.08)), e = u * u * (3 - 2 * u);
  const w = Math.min(1, Math.max(0, (Math.pow(1 - e, 1.4) - 0.5) / 0.32));
  return w * w * (3 - 2 * w);
};
// The two inks of the film's top furniture: warm gold on the night, deep indigo over a white blaze (g = glare).
const LAMP_INK = [{lit: K.gold, flame: "#FFD38A", unlit: "#7A6A55", halo: 0.25, text: "rgba(232,182,90,.55)"},
                  {lit: "#5A3418", flame: "#A8521C", unlit: "#3A2E52", halo: 0, text: "rgba(42,32,88,.62)"}];
// Eighteen small lamps across the top: unlit, lit for chapters done, the current one flickering.
const Lamps: React.FC<{chapter: number; f: number; g?: number}> = ({chapter, f, g = 0}) => {
  if (!chapter || chapter > 18) return null;
  const row = (ink: typeof LAMP_INK[0], op: number) => op <= 0.001 ? null : <g opacity={op}>
    {Array.from({length: 18}, (_, i) => {
      const x = W / 2 + (i - 8.5) * 34, lit = i + 1 < chapter ? 1 : i + 1 === chapter ? 0.8 + 0.2 * Math.sin(f / 3 + i) : 0;
      return <g key={i} transform={`translate(${x} 34)`} opacity={lit ? 0.95 : ink.halo ? 0.35 : 0.5}>
        {lit && ink.halo ? <circle cx={0} cy={-6} r={9} fill={ink.flame} opacity={ink.halo * lit}/> : null}
        {lit ? <path d={`M 0 -14 Q 4 -8 2 -4 Q 0 -2 -2 -4 Q -4 -8 0 -14 Z`} fill={ink.flame} transform={`scale(${0.8 + 0.25 * lit})`}/> : null}
        <path d="M -7 -2 Q -5 5 0 5 Q 5 5 7 -2 Z" fill={lit ? ink.lit : ink.unlit}/>
      </g>;
    })}
  </g>;
  return <svg width={W} height={70} style={{position: "absolute", top: 26, left: 0}}>{row(LAMP_INK[0], 1 - g)}{row(LAMP_INK[1], g)}</svg>;
};
// The chapter line under the lamps (text: "Chapter 2 · The Yoga of Knowledge"; o: its opacity).
const Chapter: React.FC<{text: string; g?: number; o?: number}> = ({text, g = 0, o = 1}) => {
  if (!text || o <= 0.001) return null;
  const st: React.CSSProperties = {position: "absolute", top: 92, left: 0, right: 0, textAlign: "center", fontFamily: CAPS, fontSize: 16, letterSpacing: 7};
  return <>
    {g < 0.999 ? <div style={{...st, color: LAMP_INK[0].text, opacity: (1 - g) * o}}>{text.toUpperCase()}</div> : null}
    {g > 0.001 ? <div style={{...st, color: LAMP_INK[1].text, opacity: g * o}}>{text.toUpperCase()}</div> : null}
  </>;
};
// A beat's chapter line: none on a title or a verse card (their own header names the chapter) or outside chapters 1-18.
const lineOf = (b?: KBeat) => (b && b.movement && b.scene?.type !== "title" && b.scene?.type !== "verse" ? b.movement : "");
export const KathaFilm: React.FC<{D: KData}> = ({D}) => {
  const f = useCurrentFrame();
  const {frames, starts, total} = filmLayout(D);
  const cur = starts.reduce((a, s, i) => (f >= s ? i : a), 0), b = D.beats[cur];
  // the ink of the top furniture follows the glare behind it, crossing over during the dissolve
  const lf = f - starts[cur], k = ease(lf, 0, XF);
  const g = Math.max(glare(b, lf, frames[cur] + XF) * k, cur ? glare(D.beats[cur - 1], f - starts[cur - 1], frames[cur - 1] + XF) * (1 - k) : 0);
  const line = lineOf(b), was = cur ? lineOf(D.beats[cur - 1]) : "";   // a changed line crosses over with the dissolve
  const bed = D.beats.some((x) => x.audio) ? 0.17 : 0.3;   // the tanpura sits lower under a voiced film
  return (
    <AbsoluteFill style={{background: K.night}}>
      <KathaFonts/>
      {D.beats.map((bt, i) => {
        const S = KATHA_SCENES[bt.scene?.type] || KATHA_SCENES.field, n = frames[i] + XF;
        return (
          <Sequence key={bt.key} from={starts[i]} durationInFrames={n} name={`${bt.key} ${bt.scene?.type}`}>
            <Fade tx={transitionFor(D.beats[i - 1], bt)} seed={i}>
              <S s={bt.scene} n={n}/>
              <BeatLabel b={bt} n={n}/>
              <EndStrips b={bt} n={n}/>
              <Scrim b={bt} n={n}/>
              <Plate b={bt} n={n}/>
              <Caption b={bt} n={n} on={D.captions !== false}/>
            </Fade>
            {bt.audio ? <Sequence from={XF}><Audio src={staticFile(bt.audio)}/></Sequence> : null}
            {bt.scene?.type === "title" && D.bell !== "" ? <Audio src={staticFile(D.bell || "dharma/bell.wav")} volume={0.45}/> : null}
            {cue(bt.music, i) ? <Audio src={staticFile(cue(bt.music, i) as string)} volume={CUE_VOL[String(bt.music).split(/[ ,]/)[0]] ?? 0.4}/> : null}
          </Sequence>
        );
      })}
      <Lamps chapter={b?.chapter || 0} f={f} g={g}/>
      {line === was ? <Chapter text={line} g={g}/> : <><Chapter text={was} g={g} o={1 - k}/><Chapter text={line} g={g} o={k}/></>}
      {D.music !== "" ? <Audio src={staticFile(D.music || "dharma/tanpura.wav")} loop volume={(fr) => interpolate(fr, [0, 60, total - 90, total], [0, bed, bed, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}/> : null}
    </AbsoluteFill>
  );
};
// Sound cues by the beat's music field (scripts/katha/sounds.py writes them): conch, flute (four phrases in turn), swell, bell.
const CUE_VOL: Record<string, number> = {conch: 0.55, flute: 0.32, swell: 0.4, bell: 0.45};
const cue = (m: string | undefined, i: number): string | null => {
  const k = String(m || "").toLowerCase();
  if (k.includes("conch")) return "katha/sfx/conch.wav";
  if (k.includes("flute")) return `katha/sfx/flute${(i % 4) + 1}.wav`;
  if (k.includes("swell")) return "katha/sfx/swell.wav";
  if (k.includes("bell")) return "dharma/bell.wav";
  return null;
};
// Beat transitions (the art director: no translucent ghosts of solid shapes; light flashes and mist wipes instead):
//  "wipe"  scene to scene: the new shot comes in behind a soft edge of warm mist that sweeps across the frame;
//  "flash" into a shot of pure light (the cosmic form, the sun-world, the flame that climbs to the sun): a gold-white
//          bloom swells over the cut and the new shot is there when it clears;
//  "dip"   to or from a card (verse, title, end): through the night, never a double exposure of a scene and a card.
export type Tx = "first" | "wipe" | "flash" | "dip";
const LIGHTS = ["light", "sun-world", "flame-sun"];
const isCard = (b?: KBeat) => ["verse", "title", "end"].includes(b?.scene?.type);
const isLight = (b?: KBeat) => b?.scene?.type === "light" || (b?.scene?.type === "metaphor" && LIGHTS.includes(b?.scene?.kind));
export const transitionFor = (prev: KBeat | undefined, cur: KBeat): Tx => !prev ? "first" : isLight(cur) && !isLight(prev) ? "flash" : isCard(cur) || isCard(prev) ? "dip" : "wipe";
const Fade: React.FC<{tx: Tx; seed: number; children: React.ReactNode}> = ({tx, seed, children}) => {
  const f = useCurrentFrame();
  if (tx === "first") return <AbsoluteFill style={{opacity: ease(f, 0, 20)}}>{children}</AbsoluteFill>;
  if (f >= XF) return <AbsoluteFill>{children}</AbsoluteFill>;
  const u = f / XF;
  if (tx === "dip") {   // out to the night in the first half, up from it in the second
    return <AbsoluteFill style={{opacity: Math.min(1, u * 2)}}>{children}<AbsoluteFill style={{background: K.night, opacity: 1 - ease(f, XF / 2, XF / 2)}}/></AbsoluteFill>;
  }
  if (tx === "flash") { // the bloom fills the frame at the middle and the shots swap under it in two frames (no double exposure)
    const b = Math.pow(Math.sin(Math.PI * Math.min(1, u)), 0.7);
    return <AbsoluteFill>
      <AbsoluteFill style={{opacity: ease(f, XF * 0.43, XF * 0.14)}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{background: "radial-gradient(ellipse 80% 80% at 50% 45%, rgba(255,249,232,1) 0%, rgba(255,228,176,.98) 40%, rgba(248,192,118,.94) 75%, rgba(230,152,92,.9) 100%)", opacity: b}}/>
    </AbsoluteFill>;
  }
  // wipe: a soft diagonal edge (left to right, or right to left on alternate beats) with a band of lit mist riding it.
  // The edge is kept narrow and the mist dense over it, so the two shots meet inside the mist instead of showing as a
  // wide double exposure (no translucent ghosts of the outgoing shapes).
  const dir = seed % 2 ? -1 : 1, e = u * u * (3 - 2 * u), p = -24 + 148 * e, soft = 20;
  const ang = dir > 0 ? 104 : 256;
  const mask = `linear-gradient(${ang}deg, #000 ${p - soft}%, rgba(0,0,0,.5) ${p - soft / 2}%, transparent ${p}%)`;
  const mist = `linear-gradient(${ang}deg, rgba(232,190,140,0) ${p - soft - 10}%, rgba(236,196,150,.2) ${p - soft * 0.85}%, rgba(240,204,160,.42) ${p - soft / 2}%, rgba(214,166,182,.24) ${p - 3}%, rgba(200,150,170,0) ${p + 9}%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{WebkitMaskImage: mask, maskImage: mask}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{background: mist, opacity: Math.sin(Math.PI * u)}}/>
    </AbsoluteFill>
  );
};
