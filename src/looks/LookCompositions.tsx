// Preview compositions for the looks, registered from src/datayt/DataVideos.tsx:
//   DATA-<id>-look-<look>   every national story (scope.ts) in every look, same length, size and fps as DATA-<id>. The props
//                           force the look, so a preview needs no config edit; add --props '{"brand":"indicaatlas"}' to
//                           see another channel's tokens on the same story.
//   LOOK-sheet              a contact sheet still for scripts/datayt/look_stills.py (cells are small data-URI images).
//   LOOK-data               a review still of one story's LookData: lock frames, parsed numbers, sources, plate, timing
//                           (--props '{"id":"gd01"}').
//   LOOK-kit                the shared pieces (grain, vignette, editor's marks, bug, every font role) in one brand + look.
import React from "react";
import {AbsoluteFill, Composition, Img} from "remotion";
import type {BeatData} from "../datayt/BeatStory";
import {BEATS} from "../datayt/beatData";
import {LOOK_IDS, type LookId} from "./brands/types";
import {LookStory} from "./LookStory";
import {LOOK_SCOPE} from "./scope";
import {LOOK_STORIES} from "./shared/registry";
import {toLookData} from "./shared/useLookData";
import {KitSheet} from "./shared/KitSheet";

type PreviewProps = {D: BeatData; look: LookId; brand?: string};
const Preview: React.FC<PreviewProps> = ({D, look, brand}) => <LookStory D={D} look={look} brand={brand}/>;

type Cell = {src: string; label: string};
type SheetProps = {title: string; cols: number; cellW: number; cells: Cell[]};
const SHEET_FONT = "'Helvetica Neue', Arial, sans-serif";      // the sheet is a review tool, never posted
const CAP = 46, HEAD = 70, GAP = 10;
const sheetSize = (p: SheetProps) => {
  const cellH = Math.round(p.cellW * 1920 / 1080);
  const rows = Math.max(1, Math.ceil(p.cells.length / p.cols));
  return {width: p.cols * (p.cellW + GAP) + GAP, height: HEAD + rows * (cellH + CAP + GAP) + GAP};
};
const ContactSheet: React.FC<SheetProps> = (p) => {
  const cellH = Math.round(p.cellW * 1920 / 1080);
  return <AbsoluteFill style={{background: "#202020", fontFamily: SHEET_FONT, color: "#EEEEEE"}}>
    <div style={{position: "absolute", left: GAP, top: 16, fontSize: 34, fontWeight: 700}}>{p.title}</div>
    {p.cells.map((c, i) => {
      const x = GAP + (i % p.cols) * (p.cellW + GAP), y = HEAD + Math.floor(i / p.cols) * (cellH + CAP + GAP);
      return <div key={i} style={{position: "absolute", left: x, top: y, width: p.cellW}}>
        <Img src={c.src} style={{width: p.cellW, height: cellH, display: "block", background: "#000"}}/>
        <div style={{fontSize: 17, lineHeight: 1.25, marginTop: 4, height: CAP - 6, overflow: "hidden"}}>{c.label}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// LookData as text, for builders and reviewers: what each beat locks on and how.
const DataSheet: React.FC<{id: string; look?: LookId}> = ({id, look}) => {
  const D = BEATS.find((d) => d.id === id) ?? BEATS[0];
  const L = toLookData(D, {look});
  const num = (n: {text: string; lockF: number; lockHow: string} | null) => n ? `${n.text} @${n.lockF} (${n.lockHow})` : "";
  const rows = [`${L.id} · ${L.type} · look ${L.look} · brand ${L.brand} · seed ${L.seed} · plate ${L.plate ?? "none"} · ${L.frames} frames · timing ${L.timing}: ${L.timingMethod}`,
    `sourceShort: ${L.sourceShort}`, `sourceLabel: ${L.sourceLabel ?? "-"}`, ...L.sourceLines.map((x) => `source line: ${x}`), "",
    ...L.beats.flatMap((b) => [`b${b.i} ${b.kind}${b.name ? " " + b.name : ""} · f${b.f0}-${b.f1} settle ${b.settleF} · lock ${b.lockF} ${b.lockHow}${b.lockWord ? ` '${b.lockWord}'` : ""}${b.late ? " LATE" : ""} · src: ${b.src}`,
      `    hero ${num(b.hero)} · tokens [${b.tokens.map((t) => t.text).join(" | ")}] · bars [${b.barsL.map((r) => num(r.num)).join(" | ")}] · text nums [${b.textNums.map(num).join(" | ")}] · line nums [${b.lineNums.map(num).join(" | ")}]`,
      ...(b.subShown !== (b.sub ?? "") ? [`    sub shown: ${b.subShown}`] : [])])];
  return <AbsoluteFill style={{background: "#FFFFFF", color: "#111111", fontFamily: "Menlo, monospace", fontSize: 19, lineHeight: 1.35, padding: 30, whiteSpace: "pre-wrap"}}>
    {rows.map((r, i) => <div key={i}>{r}</div>)}
  </AbsoluteFill>;
};

export const LookCompositions: React.FC = () => {
  const ids = [...new Set([...LOOK_SCOPE, ...LOOK_STORIES])];
  return <>
    {ids.flatMap((id) => {
      const D = BEATS.find((d) => d.id === id);
      if (!D) return [];
      return LOOK_IDS.map((look) => <Composition key={`${id}-${look}`} {...({id: `DATA-${id}-look-${look}`, component: Preview, defaultProps: {D, look},
        durationInFrames: Math.ceil(D.total * 30), fps: 30, width: 1080, height: 1920} as any)}/>);
    })}
    <Composition {...({id: "LOOK-kit", component: KitSheet, defaultProps: {look: "slab"}, durationInFrames: 60, fps: 30, width: 1080, height: 1920} as any)}/>
    <Composition {...({id: "LOOK-data", component: DataSheet, defaultProps: {id: "gd01"}, durationInFrames: 1, fps: 30, width: 2200, height: 1500} as any)}/>
    <Composition {...({id: "LOOK-sheet", component: ContactSheet, defaultProps: {title: "", cols: 7, cellW: 270, cells: []},
      calculateMetadata: ({props}: {props: SheetProps}) => sheetSize(props), durationInFrames: 1, fps: 30, width: 1000, height: 1000} as any)}/>
  </>;
};
