// END: the bill is torn away; the brand's Mark stands on the counter as the tea-glass prop, a cream
// chit carries the closing question and its sub, and a kraft card holds the full sources. The story's textless cover,
// when it has one, may hang as a small framed illustration (captioned), never behind a word.
// MAP (basket stories): the existing state map (shared MapClose), on a paper sheet laid over the counter.
import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {fitCss, fitFont, fitLines, fitSize} from "../shared/fit";
import {MapClose} from "../shared/MapClose";
import {plain} from "../shared/text";
import {type Cam, project} from "./camera";
import {assertContrast, rgba} from "./materials";
import {ease, tagIn} from "./motion";
import {GatedLine, SAFE, W_SAFE} from "./props";
import {World, type Ctx} from "./scene";
import {STAGE} from "./surfaces";

export const endFrame = (_ctx: Ctx) => ({objH: 300, focus: [680, 1150] as [number, number]});

export const End: React.FC<{ctx: Ctx; cam: Cam}> = ({ctx, cam}) => {
  const {f, B, M, b, L} = ctx;
  const disp = fitFont(B.f.display), mono = fitFont(B.f.mono);
  const q = b.q ?? "";
  const chitW = W_SAFE - 40;
  const Q = fitLines(plain(q), disp, chitW - 60, 3, 84, 52);
  const qLh = Math.round(Q.size * 1.04);
  const subS = b.sub ? fitSize(b.sub, mono, chitW - 60, 40, 30) : 0;
  const chitH = 46 + Q.lines.length * qLh + (b.sub ? subS + 26 : 0) + 34;
  const inChit = tagIn(f, b.f0 + 4);
  const glassS = 270, gs = Math.round(glassS * (1 + Math.max(0, cam.s - 1) * 0.5));      // the glass swells with each camera punch
  // the framed illustration is opt-in for Counter (look_opts.counterPlate: true): the covers are not plate_qa reviewed
  // (gd01's shows coins and a pendant in an open safe, which also suggests all the gold sits in homes)
  const plate = L.lookOpts.counterPlate === true ? L.plate : null;
  const [gx, gy] = project(cam, 680, STAGE.base);
  const srcTop = 300 + chitH + 44;
  const srcBottom = Math.min(gy - glassS * 1.17 - 40, 1250);
  const S = fitLines(L.sourceLines.join(" · "), mono, W_SAFE - 64, Math.max(3, Math.floor((srcBottom - srcTop - 70) / 34)), 32, 26);
  const srcH = 66 + S.lines.length * Math.round(S.size * 1.32);
  const ink = assertContrast(B.c.ink, B.c.paper, Q.size, "end question");
  const subC = assertContrast(B.c.accent, B.c.paper, subS || 30, "end sub");
  const srcInk = assertContrast(B.c.ink, M.kraft, S.size, "end sources");
  // starred words of the question, wrapped
  const words = q.split(/\s+/);
  let k = 0;
  const qLines = Q.lines.map((ln) => { const n = ln.split(/\s+/).length; const s = words.slice(k, k + n).join(" "); k += n; return (s.match(/\*/g) ?? []).length % 2 ? (s.startsWith("*") ? s + "*" : "*" + s) : s; });
  return <>
    <World ctx={ctx} cam={cam}/>
    {/* a small framed illustration (the story's textless cover), captioned, when the story has one */}
    {plate && <div style={{position: "absolute", left: SAFE.x0 + 10, top: gy - 300, width: 190, height: 250, transform: "rotate(-3deg)", opacity: ease(f, b.f0 + 10, b.f0 + 20)}}>
      <div style={{position: "absolute", inset: 0, background: M.brassDark, padding: 10, boxShadow: `8px 12px 16px ${rgba(M.shadow, 0.5)}`}}>
        <Img src={staticFile(plate)} style={{width: 170, height: 210, objectFit: "cover", objectPosition: "50% 82%", display: "block"}}/>
      </div>
      <div style={{position: "absolute", left: 0, top: 258, ...fitCss(mono, 26), color: assertContrast(B.c.paper, M.wall, 26, "illustration caption")}}>ILLUSTRATION</div>
    </div>}
    {/* the tea glass prop: the brand's Mark, standing on the counter */}
    <div style={{position: "absolute", left: gx - gs / 2, top: gy - gs + 6, width: gs, height: gs, filter: `drop-shadow(16px 14px 12px ${rgba(M.shadow, 0.55)})`}}>
      <B.Mark size={gs} on="dark"/>
      <svg width={gs} height={160} style={{position: "absolute", left: 0, top: -120, overflow: "visible"}}>
        {[0, 1, 2].map((k) => {
          const t = ((f - b.f0) / 60 + k / 3) % 1;
          const x = gs * (0.38 + k * 0.12) + Math.sin((f + k * 20) / 11) * 8;
          return <path key={k} d={`M${x},${150 - t * 40} q-14,-26 0,-52 q14,-26 0,-52`} fill="none" stroke={M.paper} strokeWidth={5} strokeLinecap="round" opacity={0.28 * Math.sin(Math.PI * t)}/>;
        })}
      </svg>
    </div>
    {/* the question chit */}
    <div style={{position: "absolute", left: SAFE.x0, top: 300, width: chitW, height: chitH, opacity: inChit.vis, transformOrigin: "20% 0%",
      transform: `rotate(${-1.5 + inChit.rot * 0.3 + 0.7 * Math.sin((f - b.f0) / 22)}deg) scale(${0.9 + 0.1 * inChit.s + 0.012 * Math.sin((f - b.f0) / 30)})`, filter: `drop-shadow(10px 16px 14px ${rgba(M.shadow, 0.5)})`}}>
      <div style={{position: "absolute", inset: 0, background: B.c.paper}}/>
      <div style={{position: "absolute", left: 30, top: 30, width: chitW - 60}}>
        {qLines.map((l, i) => <GatedLine key={i} line={l} nums={b.qNums} f={f} font={disp} size={Q.size} ink={ink} acc={B.c.accent} blank={rgba(B.c.ink, 0.15)}/>)}
        {b.sub && <div style={{marginTop: 18, ...fitCss(mono, subS), color: subC, opacity: /\d/.test(b.sub) && f < b.lockF ? 0 : 1}}>{b.sub}</div>}
      </div>
    </div>
    {/* the kraft source card */}
    <div style={{position: "absolute", left: SAFE.x0 + 6, top: srcTop, width: W_SAFE - 16, height: srcH, transform: "rotate(0.8deg)", opacity: ease(f, b.f0 + 12, b.f0 + 20),
      filter: `drop-shadow(8px 12px 12px ${rgba(M.shadow, 0.45)})`}}>
      <div style={{position: "absolute", inset: 0, background: M.kraft}}/>
      <div style={{position: "absolute", left: 22, top: 16, ...fitCss(mono, 30), color: srcInk, letterSpacing: "0.1em"}}>SOURCES</div>
      <div style={{position: "absolute", left: 22, top: 56, width: W_SAFE - 60}}>{S.lines.map((l, i) => <div key={i} style={{...fitCss(mono, S.size), color: srcInk, lineHeight: 1.32}}>{l}</div>)}</div>
    </div>
  </>;
};

// ---------------------------------------------------------------- MAP on a paper sheet laid over the counter
export const MapSheet: React.FC<{ctx: Ctx}> = ({ctx}) => {
  const {L, B, b, f} = ctx;
  const k = ease(f, b.f0 - 8, b.f0 + 4);
  return <AbsoluteFill>
    <AbsoluteFill style={{clipPath: "inset(26px 22px 26px 22px round 10px)", boxShadow: "none"}}>
      <MapClose L={L} B={B} b={b} ground="paper" top={292} reserveBottom={20}/>
    </AbsoluteFill>
    <AbsoluteFill style={{pointerEvents: "none", boxShadow: `inset 0 0 0 26px transparent`, opacity: k}}/>
  </AbsoluteFill>;
};
