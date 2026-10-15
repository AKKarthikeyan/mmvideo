// Data Kadai post images for a long-form video (AK, 13 Oct 2026: every video ships with one X post, one Instagram carousel and one map
// with all the data), plus the YouTube thumbnail. Every figure comes from public/datayt/long/<id>/data.json; nothing is typed here.
//   DK-lp-thumb  1280x720   the thumbnail: the cold open's claim and the state map of its lead figure
//   DK-lp-x      1600x900   the X image: the claim, the state map, the highest and lowest five
//   DK-lp-map    1080x1350  one map scene with every state's number, as large as the page allows
//   DK-lp-list   1080x1350  the same figures as a ranked list, every state
//   DK-lp-ig     1080x1350  one carousel slide: the video itself at the frame asked for, fitted to 4:5 (a composition as long as the
//                           video, so a still of frame n shows the video at frame n)
//   DK-lp-end    1080x1350  the carousel's last slide: the question, where to watch, the sources
// Each takes {id, scene?}; scripts/datayt/long_posts.py picks the scenes and frames and scripts/datayt/render_posts.mjs renders them.
import React from "react";
import {AbsoluteFill, Composition, Still} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {P} from "./IndiaShort";
import {BRAND, Mark} from "./Brand";
import {StateMap, MAP_RATIO} from "./StateMap";
import {LongStory, LongData, LScene} from "./LongStory";
import {LONGS} from "./longData";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
type Props = {id: string; scene?: number};
const find = (id: string) => LONGS.find((d) => d.id === id) ?? LONGS[0];
const plain = (s: string) => s.replace(/\*/g, "");
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
const fit = (text: string, max: number, width: number, ratio = 0.5) => Math.min(max, width / (Math.max(1, plain(text).length) * ratio));
const wrapFit = (text: string, sizes: number[], width: number, lines: number, ratio = 0.46) => sizes.find((s) => {
  const per = width / (s * ratio);
  let n = 1, cur = 0;
  for (const w of plain(text).split(" ")) {
    if (cur && cur + 1 + w.length > per) { n++; cur = w.length; } else cur += (cur ? 1 : 0) + w.length;
  }
  return n <= lines;
}) ?? sizes[sizes.length - 1];
const SHORT: Record<string, string> = {"Andaman and Nicobar Islands": "A&N Islands", "Arunachal Pradesh": "Arunachal", "Himachal Pradesh": "Himachal",
  "Dadra and Nagar Haveli and Daman and Diu": "Dadra, Daman and Diu", "Dadra & Nagar Haveli and Daman & Diu": "Dadra, Daman and Diu",
  "Jammu and Kashmir": "J&K", "Jammu & Kashmir": "J&K", "Andaman & Nicobar Islands": "A&N Islands", "NCT of Delhi": "Delhi"};      // as BeatPosts.tsx
const num = (label: string) => { const v = parseFloat(label.replace("−", "-").replace(/[^0-9.\-]/g, "")); return isNaN(v) ? 0 : v; };
type Row = {name: string; full: string; label: string; v: number; bucket: number};
const rowsOf = (s: LScene): Row[] => (s.states ?? []).map((m) => ({name: SHORT[m.name] ?? m.name, full: m.name, label: m.label, v: num(m.label), bucket: m.bucket}))
  .sort((a, b) => b.v - a.v || a.name.localeCompare(b.name));
const maps = (D: LongData) => D.scenes.filter((s) => s.kind === "map");
const mapScene = (D: LongData, i?: number) => (i != null ? D.scenes[i] : maps(D)[0]);
const cold = (D: LongData) => D.scenes.find((s) => s.kind === "cold");
const endScene = (D: LongData) => D.scenes.find((s) => s.kind === "end");

const Ground: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${P.bg2} 0%, ${P.bg} 72%)`}}><VoxFonts/>{children}</AbsoluteFill>
);
const Chip: React.FC<{D: LongData; fs: number; room?: number}> = ({D, fs, room = 1000}) => <div style={{display: "flex", gap: 12, alignItems: "center"}}>
  <div style={{background: D.accent2, color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: fs, letterSpacing: 3, padding: "6px 14px", borderRadius: 8, whiteSpace: "nowrap"}}>{D.chip}</div>
  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: fit(D.sourceShort, fs, room - D.chip.length * fs * 0.84 - 60, 0.56), color: P.mute, whiteSpace: "nowrap"}}>{D.sourceShort}</div>
</div>;
const Brand: React.FC<{fs: number}> = ({fs}) => <div style={{display: "flex", alignItems: "center", gap: fs * 0.3, flexShrink: 0}}>
  <Mark size={fs * 1.3}/>
  <div style={{fontFamily: COND, fontWeight: 700, fontSize: fs, color: P.ink, whiteSpace: "nowrap"}}>{BRAND.name.toUpperCase().split(" ")[0]} <span style={{color: P.gold}}>{BRAND.name.toUpperCase().split(" ")[1]}</span></div>
</div>;
const Bands: React.FC<{D: LongData; s: LScene; fs: number}> = ({D, s, fs}) => s.legend ? <div style={{display: "flex", alignItems: "center", gap: 12}}>
  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: fs, color: P.ink}}>{s.legend.loWord} <span style={{color: P.mute}}>{s.legend.lo}</span></div>
  <div style={{display: "flex"}}>{D.bands.map((c, i) => <div key={i} style={{width: fs * 1.8, height: fs * 0.9, background: c, borderRadius: i === 0 ? "6px 0 0 6px" : i === 4 ? "0 6px 6px 0" : 0}}/>)}</div>
  <div style={{fontFamily: SANS, fontWeight: 700, fontSize: fs, color: P.ink}}><span style={{color: P.mute}}>{s.legend.hi}</span> {s.legend.hiWord}</div>
</div> : null;
const MapBox: React.FC<{D: LongData; s: LScene; h: number; fs: number}> = ({D, s, h, fs}) => (
  <div style={{position: "relative", width: h * MAP_RATIO, height: h, flexShrink: 0}}>
    <StateMap states={s.states ?? []} colors={D.bands} x={0} y={0} h={h} ring={Object.fromEntries((s.ring ?? []).map((n) => [n, P.ink]))} fs={fs}/>
  </div>
);
const List: React.FC<{D: LongData; s: LScene; rows: Row[]; rh: number; w: number; from?: number; cap?: number}> = ({D, s, rows, rh, w, from = 0, cap = 21}) => {
  const ring = s.ring ?? [], fs = Math.min(cap, rh * 0.52);
  return <div style={{width: w}}>
    {rows.map((r, i) => {
      const hot = ring.includes(r.full);
      return <div key={r.full} style={{height: rh, display: "flex", alignItems: "center", gap: 7, background: hot ? `${D.accent}14` : "transparent", borderRadius: 5, padding: "0 5px"}}>
        <div style={{width: fs * 1.25, fontFamily: COND, fontWeight: 700, fontSize: fs, color: P.mute, textAlign: "right"}}>{from + i + 1}</div>
        <div style={{width: fs * 0.62, height: fs * 0.62, borderRadius: 3, background: D.bands[r.bucket] ?? P.empty, border: `1px solid ${P.line}`, flexShrink: 0}}/>
        <div style={{flex: 1, fontFamily: SANS, fontWeight: hot ? 800 : 600, fontSize: fs * 0.88, color: P.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{r.name}</div>
        <div style={{fontFamily: COND, fontWeight: 700, fontSize: fs, color: hot ? D.accent : P.ink, whiteSpace: "nowrap"}}>{r.label}</div>
      </div>;
    })}
  </div>;
};
const Foot: React.FC<{D: LongData; s?: LScene}> = ({D, s}) => <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 30}}>
  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 20, color: P.mute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>Source: {s?.source ?? D.sourceShort}</div>
  <Brand fs={34}/>
</div>;
const MapHead: React.FC<{D: LongData; s: LScene}> = ({D, s}) => <>
  <Chip D={D} fs={21}/>
  <div style={{fontFamily: COND, fontWeight: 700, fontSize: wrapFit(s.title ?? "", [62, 56, 50, 44], 1000, 2), lineHeight: 1.06, color: P.ink, marginTop: 14}}><Rich text={s.title ?? ""} acc={D.accent}/></div>
  {s.sub && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: D.accent2, marginTop: 8}}>{s.sub}</div>}
  <div style={{marginTop: 12}}><Bands D={D} s={s} fs={21}/></div>
</>;

// ---------------------------------------------------------------- the thumbnail: the claim of the cold open, large, and the state map
const Thumb: React.FC<Props> = ({id, scene}) => {
  const D = find(id), c = cold(D), s = mapScene(D, scene), T = (D as unknown as {thumb?: {lines: string[]; sub?: string}}).thumb;
  const lines = T?.lines ?? c?.lines ?? [D.title], size = Math.min(...lines.map((l) => fit(l, 210, 640, 0.47)));
  const quiet = s ? {...s, states: [], ring: []} : undefined;      // a plain outline: the big words name one item, so no state colours a viewer could read as that item's map
  return <Ground>
    <div style={{position: "absolute", left: 56, top: 44}}><Chip D={D} fs={20} room={640}/></div>
    <div style={{position: "absolute", left: 56, top: 110, width: 660}}>
      {lines.map((l, i) => <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.0, color: P.ink, whiteSpace: "nowrap", textTransform: "uppercase"}}><Rich text={l} acc={D.accent}/></div>)}
      {T?.sub && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: fit(T.sub, 44, 640, 0.56), color: D.accent2, marginTop: 18, whiteSpace: "nowrap"}}>{T.sub}</div>}
    </div>
    {quiet && <div style={{position: "absolute", right: 40, top: 30}}><MapBox D={D} s={quiet} h={660} fs={10}/></div>}
    <div style={{position: "absolute", left: 56, bottom: 40}}><Brand fs={40}/></div>
  </Ground>;
};

// ---------------------------------------------------------------- the X image
const XPost: React.FC<Props> = ({id, scene}) => {
  const D = find(id), s = mapScene(D, scene), c = cold(D), rows = s ? rowsOf(s) : [], lines = c?.lines ?? [D.title];
  if (!s) return <Ground><div/></Ground>;
  const head = (t: string) => <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: 3, color: P.mute, marginBottom: 6}}>{t}</div>;
  return <Ground>
    <div style={{position: "absolute", left: 50, right: 50, top: 40, bottom: 34, display: "flex", gap: 50}}>
      <MapBox D={D} s={s} h={826} fs={19}/>
      <div style={{flex: 1, display: "flex", flexDirection: "column", minWidth: 0}}>
        <Chip D={D} fs={21} room={690}/>
        <div style={{marginTop: 20}}>{lines.map((l, i) => <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: Math.min(...lines.map((x) => fit(x, 70, 690))), lineHeight: 1.07, color: P.ink, whiteSpace: "nowrap"}}><Rich text={l} acc={D.accent}/></div>)}</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 25, color: P.ink, marginTop: 24}}>{plain(s.title ?? "")}</div>
        {s.sub && <div style={{fontFamily: SANS, fontSize: 21, color: P.mute, marginTop: 4}}>{s.sub}</div>}
        <div style={{marginTop: 10}}><Bands D={D} s={s} fs={18}/></div>
        <div style={{display: "flex", gap: 30, marginTop: 20}}>
          <div>{head("HIGHEST FIVE")}<List D={D} s={s} rows={rows.slice(0, 5)} rh={40} w={325}/></div>
          <div>{head("LOWEST FIVE")}<List D={D} s={s} rows={rows.slice(-5)} rh={40} w={325} from={rows.length - 5}/></div>
        </div>
        <div style={{flex: 1}}/>
        <div style={{fontFamily: SANS, fontSize: 18, lineHeight: 1.35, color: P.mute, maxHeight: 96, overflow: "hidden"}}>{s.note ?? ""}</div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12}}>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 19, color: P.mute}}>Full video on YouTube: Data Kadai</div>
          <Brand fs={36}/>
        </div>
      </div>
    </div>
  </Ground>;
};

// ---------------------------------------------------------------- the map with all the data, and the same figures as a list
const MapAll: React.FC<Props> = ({id, scene}) => {
  const D = find(id), s = mapScene(D, scene);
  if (!s) return <Ground><div/></Ground>;
  return <Ground>
    <div style={{position: "absolute", left: 36, right: 36, top: 36, bottom: 30, display: "flex", flexDirection: "column"}}>
      <MapHead D={D} s={s}/>
      <div style={{display: "flex", justifyContent: "center", marginTop: 14}}><MapBox D={D} s={s} h={800} fs={24}/></div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 21, lineHeight: 1.3, color: P.ink, marginTop: 12, maxHeight: 84, overflow: "hidden"}}>{s.note}</div>
      <div style={{flex: 1}}/>
      <Foot D={D} s={s}/>
    </div>
  </Ground>;
};
const ListAll: React.FC<Props> = ({id, scene}) => {
  const D = find(id), s = mapScene(D, scene);
  if (!s) return <Ground><div/></Ground>;
  const rows = rowsOf(s), per = Math.ceil(rows.length / 2), rh = Math.min(58, 900 / Math.max(per, 1));
  return <Ground>
    <div style={{position: "absolute", left: 36, right: 36, top: 36, bottom: 30, display: "flex", flexDirection: "column"}}>
      <MapHead D={D} s={s}/>
      <div style={{display: "flex", gap: 28, marginTop: 20}}>
        <List D={D} s={s} rows={rows.slice(0, per)} rh={rh} w={490} cap={28}/>
        <List D={D} s={s} rows={rows.slice(per)} rh={rh} w={490} from={per} cap={28}/>
      </div>
      <div style={{flex: 1}}/>
      <Foot D={D} s={s}/>
    </div>
  </Ground>;
};

// ---------------------------------------------------------------- a carousel slide: the video at frame n, fitted to 4:5 under its chapter
const Ig: React.FC<Props> = ({id, scene}) => {
  const D = find(id), s = scene != null ? D.scenes[scene] : D.scenes[0], ch = D.chapters[s.ch];
  const k = D.chapters.length - 1, W = 1080, scale = W / 1920, h = 1080 * scale;
  return <Ground>
    <div style={{position: "absolute", left: 56, right: 56, top: 60}}>
      <Chip D={D} fs={21} room={968}/>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: D.accent2, marginTop: 40}}>{ch.i && ch.i < k ? `CHAPTER ${String(ch.i).padStart(2, "0")} OF ${String(k - 1).padStart(2, "0")}` : "DATA KADAI · LONG READ"}</div>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: wrapFit(ch.i ? ch.title : D.title, [76, 66, 58, 50], 968, 2), lineHeight: 1.05, color: P.ink, marginTop: 10}}>{ch.i ? ch.title : D.title}</div>
    </div>
    <div style={{position: "absolute", left: 0, top: (1350 - h) / 2 + 90, width: W, height: h, overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.12)"}}>
      <div style={{width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: "0 0"}}><LongStory D={D}/></div>
    </div>
    <div style={{position: "absolute", left: 56, right: 56, bottom: 48, display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: P.mute}}>Full video on YouTube</div>
      <Brand fs={40}/>
    </div>
  </Ground>;
};
const IgEnd: React.FC<Props> = ({id}) => {
  const D = find(id), e = endScene(D), q = e?.q ?? "Which number surprised you?";
  return <Ground>
    <div style={{position: "absolute", left: 70, right: 70, top: 70, bottom: 56, display: "flex", flexDirection: "column"}}>
      <Chip D={D} fs={22}/>
      <div style={{flex: 1}}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: wrapFit(q, [120, 104, 92, 80], 940, 3), lineHeight: 1.04, color: P.ink}}><Rich text={q} acc={D.accent}/></div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: D.accent2, marginTop: 22}}>Comment below. The full video is on our YouTube channel.</div>
      {e?.next && <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: P.ink, marginTop: 18}}>Next: {e.next}</div>}
      <div style={{flex: 1}}/>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: P.mute}}>SOURCES</div>
      {(e?.sources ?? []).map((x, i) => <div key={i} style={{fontFamily: SANS, fontSize: 23, lineHeight: 1.35, color: P.ink, marginTop: 8}}>{x}</div>)}
      <div style={{height: 2, background: P.line, margin: "30px 0 24px"}}/>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: P.ink}}>{BRAND.tagline.split(". ")[0]}.</div>
          <div style={{fontFamily: SANS, fontSize: 23, color: P.mute, marginTop: 4}}>Analysed and animated by Data Kadai; AI narrator.</div></div>
        <Brand fs={48}/>
      </div>
    </div>
  </Ground>;
};

const FIRST = {id: LONGS[0]?.id ?? ""};
const asLong = ({props}: {props: Props}) => ({durationInFrames: Math.ceil(find(props.id).total * 30)});
export const LongPostStills: React.FC = () => <>
  <Still {...({id: "DK-lp-thumb", component: Thumb, defaultProps: FIRST, width: 1280, height: 720} as any)}/>
  <Still {...({id: "DK-lp-x", component: XPost, defaultProps: FIRST, width: 1600, height: 900} as any)}/>
  <Still {...({id: "DK-lp-map", component: MapAll, defaultProps: FIRST, width: 1080, height: 1350} as any)}/>
  <Still {...({id: "DK-lp-list", component: ListAll, defaultProps: FIRST, width: 1080, height: 1350} as any)}/>
  <Composition {...({id: "DK-lp-ig", component: Ig, defaultProps: FIRST, calculateMetadata: asLong, durationInFrames: 1, fps: 30, width: 1080, height: 1350} as any)}/>
  <Still {...({id: "DK-lp-end", component: IgEnd, defaultProps: FIRST, width: 1080, height: 1350} as any)}/>
</>;
