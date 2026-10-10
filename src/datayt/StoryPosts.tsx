// Data Kadai chart posts for the story Shorts: two stills per state story, each in Instagram 4:5 (1080x1350) and X 16:9 (1600x900).
//   map   the finished map with every state's number
//   list  the full ranked list, every state, for people who want to find their own
import React from "react";
import {AbsoluteFill, Still} from "remotion";
import {COND, VoxFonts} from "../voxkit";
import {P} from "./IndiaShort";
import {Mark} from "./Brand";
import {StateMap, MAP_RATIO} from "./StateMap";
import type {StoryData} from "./DataStory";
import {STORIES} from "./storyData";

const SANS = "Inter, 'Helvetica Neue', Arial, sans-serif";
const Rich: React.FC<{text: string; acc: string}> = ({text, acc}) => <>{text.split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
const Ground: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${P.bg2} 0%, ${P.bg} 72%)`}}><VoxFonts/>{children}</AbsoluteFill>
);
const Head: React.FC<{D: StoryData; size: number; oneLine?: boolean}> = ({D, size, oneLine}) => <div>
  <div style={{display: "flex", gap: 12, alignItems: "center"}}>
    <div style={{background: D.accent2, color: P.bg, fontFamily: SANS, fontWeight: 800, fontSize: size * 0.36, letterSpacing: 3, padding: "6px 14px", borderRadius: 8}}>{D.chip}</div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: size * 0.36, color: P.mute}}>{D.sourceShort}</div>
  </div>
  <div style={{fontFamily: COND, fontWeight: 700, fontSize: size, lineHeight: 1.06, color: P.ink, marginTop: 12}}>
    {oneLine ? <Rich text={D.headline.join(" ")} acc={D.accent}/> : D.headline.map((l, i) => <div key={i}><Rich text={l} acc={D.accent}/></div>)}</div>
  <div style={{fontFamily: SANS, fontSize: size * 0.4, color: P.mute, marginTop: 6}}>{D.sub}</div>
</div>;
const Foot: React.FC<{D: StoryData; fs: number}> = ({D, fs}) => <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 30}}>
  <div style={{fontFamily: SANS, fontSize: fs, lineHeight: 1.3, color: P.mute, flex: 1}}>Source: {D.source}{D.nodata?.length ? ` Not ranked: ${D.nodata.map((n) => n.replace("NCT of ", "")).join(", ")}.` : ""}</div>
  <div style={{display: "flex", alignItems: "center", gap: 10, flexShrink: 0}}><Mark size={fs * 2.2}/>
    <div style={{fontFamily: COND, fontWeight: 700, fontSize: fs * 1.7, color: P.ink}}>DATA <span style={{color: P.gold}}>KADAI</span></div></div>
</div>;
const Legend: React.FC<{D: StoryData; fs: number; vertical?: boolean}> = ({D, fs, vertical}) => (
  <div style={{display: "flex", flexDirection: vertical ? "column" : "row", gap: vertical ? 8 : 8}}>
    {(D.mapBands ?? []).map((b, i) => <div key={i} style={{flex: vertical ? "none" : 1, display: vertical ? "flex" : "block", alignItems: "center", gap: 12}}>
      <div style={{height: fs * 0.9, width: vertical ? fs * 2.4 : undefined, background: b.color, border: `1.5px solid ${P.ink}55`, borderRadius: 4}}/>
      <div style={{fontFamily: SANS, fontSize: fs, color: P.ink, marginTop: vertical ? 0 : 5, whiteSpace: "nowrap"}}>{b.label}</div>
    </div>)}
  </div>
);
const what = (D: StoryData) => D.type === "change" ? `Rise in percentage points, ${D.aName} to ${D.bName}` :
  D.type === "faceoff" ? `Gap in percentage points, ${D.aName} vs ${D.bName}${(D.map ?? []).some((s) => s.alt) ? `. Outlined: ${D.aName} ahead` : ""}` : "";

const MapPost: React.FC<{D: StoryData; land: boolean}> = ({D, land}) => {
  const ring: Record<string, string> = D.myth && D.truth ? {[D.myth.geo]: P.ink, [D.truth.geo]: P.ink} : {};
  (D.map ?? []).filter((s) => s.alt).forEach((s) => { ring[s.name] = P.ink; });
  if (land) {
    const h = 800;
    return <Ground>
      <StateMap states={D.map ?? []} colors={D.bands} x={70} y={50} h={h} ring={ring} fs={19}/>
      <div style={{position: "absolute", left: 70 + h * MAP_RATIO + 60, right: 60, top: 60, bottom: 40, display: "flex", flexDirection: "column"}}>
        <Head D={D} size={64}/>
        {what(D) && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, color: P.ink, marginTop: 18}}>{what(D)}</div>}
        <div style={{marginTop: 22}}><Legend D={D} fs={22} vertical/></div>
        <div style={{marginTop: 26, fontFamily: SANS, fontSize: 26, color: P.ink, lineHeight: 1.5}}>
          {(D.top5 ?? []).slice(0, 3).map((r, i) => <div key={r.name}><b>{i + 1}. {r.name}</b> <span style={{fontFamily: COND, fontWeight: 700, color: D.accent}}>{r.label}</span></div>)}
          {D.indiaRow && <div style={{color: P.mute}}>India {D.indiaRow.label}</div>}
        </div>
        <div style={{flex: 1}}/>
        <Foot D={D} fs={17}/>
      </div>
    </Ground>;
  }
  const h = 800;
  return <Ground>
    <div style={{position: "absolute", left: 60, right: 60, top: 44}}><Head D={D} size={58}/>
      {what(D) && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, color: P.ink, marginTop: 4}}>{what(D)}</div>}</div>
    <StateMap states={D.map ?? []} colors={D.bands} x={(1080 - h * MAP_RATIO) / 2} y={300} h={h} ring={ring} fs={20}/>
    <div style={{position: "absolute", left: 60, right: 60, top: 1130}}><Legend D={D} fs={20}/></div>
    <div style={{position: "absolute", left: 60, right: 60, bottom: 40}}><Foot D={D} fs={17}/></div>
  </Ground>;
};

const ListPost: React.FC<{D: StoryData; land: boolean}> = ({D, land}) => {
  const rows = D.rows ?? [];
  const cols = land ? 3 : 2;
  const per = Math.ceil(rows.length / cols);
  const W = land ? 1600 : 1080, top = land ? 210 : 310, bottom = land ? 90 : 120;
  const rh = Math.min(land ? 52 : 50, ((land ? 900 : 1350) - top - bottom) / per);
  const cw = (W - 120 - (cols - 1) * 34) / cols;
  const ranked = D.type === "ranking" || D.type === "myth";
  const max = ranked ? (D.max ?? 1) : Math.max(...rows.map((r) => Math.abs(r.d ?? 0)));
  const fs = rh * 0.44;
  return <Ground>
    <div style={{position: "absolute", left: 60, right: 60, top: land ? 40 : 44}}><Head D={D} size={land ? 58 : 58} oneLine={land}/>
      {what(D) && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, color: P.ink, marginTop: 4}}>{what(D)}</div>}</div>
    {rows.map((r, i) => {
      const c = Math.floor(i / per), k = i % per;
      const v = ranked ? (r.v ?? 0) : Math.abs(r.d ?? 0);
      const isTop = i === 0, isMyth = D.myth?.name === r.name;
      const col = isTop ? D.accent : isMyth ? D.accent2 : D.bands[Math.max(0, 4 - Math.floor((i * 5) / rows.length))];
      const label = ranked ? r.label : D.type === "change" ? `${(r.d ?? 0) >= 0 ? "+" : ""}${(r.d ?? 0).toFixed(1)}` : Math.abs(r.d ?? 0).toFixed(1);
      return <div key={r.name} style={{position: "absolute", left: 60 + c * (cw + 34), top: top + k * rh, width: cw, height: rh - 5, display: "flex", alignItems: "center",
        background: isTop || isMyth ? `${col}16` : "transparent", borderRadius: 6}}>
        <div style={{width: 40, fontFamily: COND, fontWeight: 700, fontSize: fs, color: P.mute, textAlign: "right", paddingRight: 10}}>{i + 1}</div>
        <div style={{width: 178, fontFamily: SANS, fontWeight: isTop || isMyth ? 800 : 600, fontSize: fs * 0.86, color: P.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{r.name}</div>
        <div style={{flex: 1, height: rh * 0.42, position: "relative"}}>
          <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(v / max) * 100}%`, minWidth: 3, background: col, borderRadius: 4}}/></div>
        {!ranked && <div style={{width: 118, fontFamily: SANS, fontSize: fs * 0.62, color: P.mute, textAlign: "right", whiteSpace: "nowrap"}}>{r.la?.replace("%", "")} · {r.lb}</div>}
        <div style={{width: 84, fontFamily: COND, fontWeight: 700, fontSize: fs, color: isTop ? D.accent : P.ink, textAlign: "right"}}>{label}</div>
      </div>;
    })}
    {!ranked && <div style={{position: "absolute", right: 60, top: top - 30, fontFamily: SANS, fontSize: 18, color: P.mute}}>{D.aName} · {D.bName} · {D.type === "change" ? "rise" : "gap"}</div>}
    <div style={{position: "absolute", left: 60, right: 60, bottom: land ? 28 : 40}}><Foot D={D} fs={land ? 16 : 17}/></div>
  </Ground>;
};

export const StoryPostStills: React.FC = () => <>
  {STORIES.filter((d) => d.type !== "breakdown").map((d) => <React.Fragment key={d.id}>
    <Still {...({id: `DK-story-${d.id}-map-ig`, component: MapPost, defaultProps: {D: d, land: false}, width: 1080, height: 1350} as any)}/>
    <Still {...({id: `DK-story-${d.id}-map-x`, component: MapPost, defaultProps: {D: d, land: true}, width: 1600, height: 900} as any)}/>
    <Still {...({id: `DK-story-${d.id}-list-ig`, component: ListPost, defaultProps: {D: d, land: false}, width: 1080, height: 1350} as any)}/>
    <Still {...({id: `DK-story-${d.id}-list-x`, component: ListPost, defaultProps: {D: d, land: true}, width: 1600, height: 900} as any)}/>
  </React.Fragment>)}
</>;
