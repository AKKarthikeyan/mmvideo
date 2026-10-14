// Data Kadai post images for every beat Short. AK, 13 Oct 2026: "all the videos should have one X POST, one Insta Carosaul. one MAP with all data."
//   DK-bp-map  1080x1350  the map with every state's number
//   DK-bp-list 1080x1350  the same figures as a ranked list, every state
//   DK-bp-x    1600x900   the X image: the claim, the map, the highest and lowest five
//   DK-bp-ig   1080x1350  one carousel slide: the Short itself at the frame asked for (the end of a beat), trimmed to 4:5
//   DK-bp-end  1080x1350  the carousel's last slide: the question and the source
// Each takes {id}; scripts/datayt/post_assets.py decides the slides and their frames and scripts/datayt/render_posts.mjs renders them.
// DK-bp-ig and DK-bp-x are compositions as long as the Short, so a still of frame n shows the Short at frame n (a <Freeze> inside a
// one-frame Still stayed on frame 0).
import React from "react";
import {AbsoluteFill, Composition, Still} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {P} from "./IndiaShort";
import {BRAND, Mark} from "./Brand";
import {StateMap, MAP_RATIO} from "./StateMap";
import {BeatStory, BeatData} from "./BeatStory";
import {BEATS} from "./beatData";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
type Props = {id: string};
const find = (id: string) => BEATS.find((d) => d.id === id) ?? BEATS[0];
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
const plain = (s: string) => s.replace(/\*/g, "");
const fit = (text: string, max: number, width: number, ratio = 0.5) => Math.min(max, width / (Math.max(1, plain(text).length) * ratio));
// the largest of the given sizes at which a heading wraps into at most `lines` lines
const wrapFit = (text: string, sizes: number[], width: number, lines: number, ratio = 0.44) => sizes.find((s) => {
  const per = width / (s * ratio);
  let n = 1, cur = 0;
  for (const w of plain(text).split(" ")) {
    if (cur && cur + 1 + w.length > per) { n++; cur = w.length; } else cur += (cur ? 1 : 0) + w.length;
  }
  return n <= lines;
}) ?? sizes[sizes.length - 1];

const SHORT: Record<string, string> = {"Andaman and Nicobar Islands": "A&N Islands", "Arunachal Pradesh": "Arunachal", "Himachal Pradesh": "Himachal",
  "Dadra and Nagar Haveli and Daman and Diu": "Dadra, Daman and Diu", "Dadra & Nagar Haveli and Daman & Diu": "Dadra, Daman and Diu",
  "Jammu and Kashmir": "J&K", "Jammu & Kashmir": "J&K", "Andaman & Nicobar Islands": "A&N Islands", "NCT of Delhi": "Delhi"};
// A map label as a number, to rank the list ("<0.1" sorts just under 0.1, "−1.0" is negative).
const num = (label: string) => {
  const v = parseFloat(label.replace("−", "-").replace(/[^0-9.\-]/g, ""));
  return (isNaN(v) ? 0 : v) - (label.includes("<") ? 1e-6 : 0);
};
type Row = {name: string; full: string; label: string; v: number; bucket: number};
const rowsOf = (D: BeatData): Row[] => (D.map ?? []).map((m) => ({name: SHORT[m.name] ?? m.name, full: m.name, label: m.label, v: num(m.label), bucket: m.bucket}))
  .sort((a, b) => b.v - a.v);
const mapBeat = (D: BeatData) => D.beats.find((b) => b.kind === "map");
const hookLines = (D: BeatData) => D.beats[0].lines?.length ? D.beats[0].lines! : [(D as any).ytTitle as string];

const Ground: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${P.bg2} 0%, ${P.bg} 72%)`}}><VoxFonts/>{children}</AbsoluteFill>
);
const Chip: React.FC<{D: BeatData; fs: number; room?: number}> = ({D, fs, room = 1000}) => <div style={{display: "flex", gap: 12, alignItems: "center"}}>
  <div style={{background: D.accent2, color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: fs, letterSpacing: 3, padding: "6px 14px", borderRadius: 8, whiteSpace: "nowrap"}}>{D.chip}</div>
  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: fit(D.sourceShort, fs, room - D.chip.length * fs * 0.84 - 60, 0.56), color: P.mute, whiteSpace: "nowrap"}}>{D.sourceShort}</div>
</div>;
const Brand: React.FC<{fs: number}> = ({fs}) => <div style={{display: "flex", alignItems: "center", gap: fs * 0.3, flexShrink: 0}}>
  <Mark size={fs * 1.3}/>
  <div style={{fontFamily: COND, fontWeight: 700, fontSize: fs, color: P.ink, whiteSpace: "nowrap"}}>{BRAND.name.toUpperCase().split(" ")[0]} <span style={{color: P.gold}}>{BRAND.name.toUpperCase().split(" ")[1]}</span></div>
</div>;
const Legend: React.FC<{items?: {color: string; label: string}[]; fs: number}> = ({items, fs}) => items?.length ? <div style={{display: "flex", gap: 26, alignItems: "center"}}>
  {items.map((k) => <div key={k.label} style={{display: "flex", alignItems: "center", gap: 8}}>
    <div style={{width: fs, height: fs, borderRadius: 5, background: k.color, border: `1.5px solid ${P.line}`}}/>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: fs, color: P.ink}}>{k.label}</div></div>)}
</div> : null;
// The map on its own box, so the text around it is laid out by the page and can never sit on it.
const MapBox: React.FC<{D: BeatData; h: number; fs: number}> = ({D, h, fs}) => {
  const ring = Object.fromEntries((mapBeat(D)?.ring ?? []).map((n) => [n, P.ink]));
  return <div style={{position: "relative", width: h * MAP_RATIO, height: h, flexShrink: 0}}>
    <StateMap states={D.map ?? []} colors={D.bands} x={0} y={0} h={h} ring={ring} fs={fs}/>
  </div>;
};
const List: React.FC<{D: BeatData; rows: Row[]; rh: number; w: number; from?: number; cap?: number}> = ({D, rows, rh, w, from = 0, cap = 21}) => {
  const ring = mapBeat(D)?.ring ?? [];
  const fs = Math.min(cap, rh * 0.52);
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

// The map with all the data: every state's number on the map, as large as the page allows. The same figures as a ranked list are
// the next image (the first version put both on one page and the list was too small to read on a phone).
const Foot: React.FC<{D: BeatData}> = ({D}) => <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 30}}>
  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 20, color: P.mute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>Source: {D.sourceShort}</div>
  <Brand fs={34}/>
</div>;
const MapHead: React.FC<{D: BeatData}> = ({D}) => {
  const m = mapBeat(D)!, title = m.title ?? "";
  return <>
    <Chip D={D} fs={21}/>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: wrapFit(title, [62, 56, 50, 44], 1000, 2), lineHeight: 1.06, color: P.ink, marginTop: 14}}><Rich text={title} acc={D.accent}/></div>
    <div style={{fontFamily: SANS, fontSize: 24, color: P.mute, marginTop: 8}}>{m.sub}</div>
    {m.legend?.length ? <div style={{marginTop: 10}}><Legend items={m.legend} fs={20}/></div> : null}
  </>;
};
const MapAll: React.FC<Props> = ({id}) => {
  const D = find(id), m = mapBeat(D);
  if (!m) return <Ground><div/></Ground>;
  return <Ground>
    <div style={{position: "absolute", left: 36, right: 36, top: 36, bottom: 30, display: "flex", flexDirection: "column"}}>
      <MapHead D={D}/>
      <div style={{display: "flex", justifyContent: "center", marginTop: 14}}><MapBox D={D} h={m.legend?.length ? 800 : 830} fs={25}/></div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 21, lineHeight: 1.3, color: P.ink, marginTop: 12, maxHeight: 84, overflow: "hidden"}}>{m.note}</div>
      <div style={{flex: 1}}/>
      <Foot D={D}/>
    </div>
  </Ground>;
};

// The same figures as a ranked list, every state, in type a phone can read.
const ListAll: React.FC<Props> = ({id}) => {
  const D = find(id), m = mapBeat(D), rows = rowsOf(D);
  if (!m) return <Ground><div/></Ground>;
  const per = Math.ceil(rows.length / 2), rh = Math.min(58, 940 / Math.max(per, 1));
  return <Ground>
    <div style={{position: "absolute", left: 36, right: 36, top: 36, bottom: 30, display: "flex", flexDirection: "column"}}>
      <MapHead D={D}/>
      <div style={{display: "flex", gap: 28, marginTop: 20}}>
        <List D={D} rows={rows.slice(0, per)} rh={rh} w={490} cap={28}/>
        <List D={D} rows={rows.slice(per)} rh={rh} w={490} from={per} cap={28}/>
      </div>
      <div style={{flex: 1}}/>
      <Foot D={D}/>
    </div>
  </Ground>;
};

// The Short at the current frame, inside a frame of another shape.
const Frame: React.FC<{D: BeatData; scale: number; crop: number; w: number; h: number}> = ({D, scale, crop, w, h}) => (
  <div style={{width: w, height: h, overflow: "hidden", position: "relative", flexShrink: 0}}>
    <div style={{position: "absolute", left: (w - 1080 * scale) / 2, top: -crop * scale, width: 1080, height: 1920, transform: `scale(${scale})`, transformOrigin: "0 0"}}>
      <BeatStory D={D}/>
    </div>
  </div>
);

const XPost: React.FC<Props> = ({id}) => {
  const D = find(id), m = mapBeat(D), rows = rowsOf(D), lines = hookLines(D);
  const few = rows.length <= 12;
  const head = (c: string) => <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 18, letterSpacing: 3, color: P.mute, marginBottom: 6}}>{c}</div>;
  return <Ground>
    <div style={{position: "absolute", left: 50, right: 50, top: 40, bottom: 34, display: "flex", gap: 50}}>
      {m ? <MapBox D={D} h={826} fs={20}/> : <Frame D={D} scale={826 / 1700} crop={20} w={520} h={826}/>}
      <div style={{flex: 1, display: "flex", flexDirection: "column", minWidth: 0}}>
        <Chip D={D} fs={21} room={m ? 690 : 930}/>
        <div style={{marginTop: 20}}>{lines.map((l, i) => <div key={i} style={{fontFamily: COND, fontWeight: 700, fontSize: fit(l, 70, 690), lineHeight: 1.07, color: P.ink, whiteSpace: "nowrap"}}><Rich text={l} acc={D.accent}/></div>)}</div>
        {m && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 25, color: P.ink, marginTop: 24}}>{plain(m.title ?? "")}</div>}
        {m && <div style={{fontFamily: SANS, fontSize: 21, color: P.mute, marginTop: 4}}>{m.sub}</div>}
        {m && <div style={{marginTop: 10}}><Legend items={m.legend} fs={19}/></div>}
        {m && <div style={{display: "flex", gap: 30, marginTop: 20}}>
          {few ? <><div>{head(`ALL ${rows.length} STATES SHOWN`)}<List D={D} rows={rows.slice(0, Math.ceil(rows.length / 2))} rh={38} w={325}/></div>
                   <div>{head(" ")}<List D={D} rows={rows.slice(Math.ceil(rows.length / 2))} rh={38} w={325} from={Math.ceil(rows.length / 2)}/></div></>
               : <><div>{head("HIGHEST FIVE")}<List D={D} rows={rows.slice(0, 5)} rh={40} w={325}/></div>
                   <div>{head("LOWEST FIVE")}<List D={D} rows={rows.slice(-5)} rh={40} w={325} from={rows.length - 5}/></div></>}
        </div>}
        {!m && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, lineHeight: 1.3, color: P.ink, marginTop: 30}}>{(D as any).ytTitle}</div>}
        <div style={{flex: 1}}/>
        <div style={{fontFamily: SANS, fontSize: 17, lineHeight: 1.35, color: P.mute, maxHeight: 96, overflow: "hidden"}}>{m?.note ?? D.beats[D.beats.length - 1].note ?? ""}</div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12}}>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 19, color: P.mute}}>Source: {D.sourceShort}</div>
          <Brand fs={36}/>
        </div>
      </div>
    </div>
  </Ground>;
};

// One carousel slide: the whole frame of the Short fitted to the slide's height (a card with four bars reaches down to y = 1830,
// so nothing below the progress bar is trimmed). The frame carries the channel name itself.
const IgBeat: React.FC<Props> = ({id}) => {
  const D = find(id);
  return <AbsoluteFill style={{background: P.bg}}>
    <VoxFonts/>
    <Frame D={D} scale={1350 / 1860} crop={16} w={1080} h={1350}/>
  </AbsoluteFill>;
};

const IgEnd: React.FC<Props> = ({id}) => {
  const D = find(id), last = D.beats[D.beats.length - 1];
  const q = last.q ?? "Where does *your* state rank?";
  return <Ground>
    <div style={{position: "absolute", left: 70, right: 70, top: 70, bottom: 56, display: "flex", flexDirection: "column"}}>
      <Chip D={D} fs={22}/>
      <div style={{flex: 1}}/>
      <div style={{fontFamily: COND, fontWeight: 700, fontSize: wrapFit(q, [120, 104, 92, 80], 940, 3), lineHeight: 1.04, color: P.ink}}><Rich text={q} acc={D.accent}/></div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: D.accent2, marginTop: 22}}>{last.sub || "Comment below."}</div>
      <div style={{flex: 1}}/>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 20, letterSpacing: 3, color: P.mute}}>SOURCE</div>
      <div style={{fontFamily: SANS, fontSize: 23, lineHeight: 1.38, color: P.ink, marginTop: 8}}>{D.source}</div>
      <div style={{height: 2, background: P.line, margin: "34px 0 26px"}}/>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: P.ink}}>{BRAND.tagline.split(". ")[0]}.</div>
          <div style={{fontFamily: SANS, fontSize: 23, color: P.mute, marginTop: 4}}>Follow for a new number every day.</div></div>
        <Brand fs={48}/>
      </div>
    </div>
  </Ground>;
};

const FIRST = {id: BEATS[0]?.id ?? ""};
const asLong = ({props}: {props: Props}) => ({durationInFrames: Math.ceil(find(props.id).total * 30)});
export const BeatPostStills: React.FC = () => <>
  <Still {...({id: "DK-bp-map", component: MapAll, defaultProps: FIRST, width: 1080, height: 1350} as any)}/>
  <Still {...({id: "DK-bp-list", component: ListAll, defaultProps: FIRST, width: 1080, height: 1350} as any)}/>
  <Composition {...({id: "DK-bp-x", component: XPost, defaultProps: FIRST, calculateMetadata: asLong, durationInFrames: 1, fps: 30, width: 1600, height: 900} as any)}/>
  <Composition {...({id: "DK-bp-ig", component: IgBeat, defaultProps: FIRST, calculateMetadata: asLong, durationInFrames: 1, fps: 30, width: 1080, height: 1350} as any)}/>
  <Still {...({id: "DK-bp-end", component: IgEnd, defaultProps: FIRST, width: 1080, height: 1350} as any)}/>
</>;
