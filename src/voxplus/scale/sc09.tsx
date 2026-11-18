// Scene 09 | 6:45-7:35 | The relationships underneath the network (AK brief + review pass 20 Oct). A labelled relationship map: Jio telecom (RJIL) at the
// centre; Reliance Retail (distribution of prepaid), tower partner (Summit Digitel) and fibre partner (Jio Digital Fibre) are added as they are
// mentioned; distribution links solid blue, infrastructure service links dashed ink; every node has the same neutral card (links = agreements,
// not ownership). The map and the contract excerpts ALTERNATE (the map is never shrunk to a thumbnail under an excerpt); each excerpt is cropped to
// the ONE relevant sentence (RHP p.33, p.37). A full-screen photo shot (tower, fibre) turns the story to "relationships". End: pull back from the map
// to the frame of the capital-spending chart (handoff to scene 10). Neutral colours, no warning stamps.
import React from "react";
import {StickerLabel} from "./kit/Collage";
import {SCue} from "./kit/A01V4Cold";
import {SP, Shot} from "./kit/A01V4Parts";
import {DocPage} from "./kit/DocPage";
import {SourceTag} from "./kit/Cards";
import {Finish} from "./kit/Texture";
import {AbsoluteFill} from "remotion";
import {C, F, clamp01, ease, inOut, outCubic, spr, useTicks} from "./kit/tokens";
import {H0, PU, S, W, WD, WL, useAt} from "./cue";
import {CapexFrame, Frame, Headline, PhotoFull, RelMap} from "./parts789";
import RRL from "../../../public/voxplus/scale/docs/sc09_rhp33_sentence.json";
import PRICE from "../../../public/voxplus/scale/docs/sc09_rhp37_price.json";
import EXIT from "../../../public/voxplus/scale/docs/sc09_rhp37_exit.json";

const CHIP = "Jio RHP p.33, p.37 · arrangements as disclosed";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const HEAD = <Headline f={1000} at={0} b="REACH ALSO DEPENDS ON CONTRACTS" x={60} y={100} size={64} align="left"/>;

// A (p1): the map builds as each party is mentioned (from the cut it already shows the phone, Jio telecom and the distribution card)
const a9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = {phone: -40, rjil: -40, dist: -40, ghostInfra: -40, distName: a("s09p1", "Reliance") - 2, sdil: a("s09p1", "tower") - 4, jdf: a("s09p1", "fibre") - 4, legend: a("s09p1", "long") - 2};
  return (
    <Frame f={f} d={d} chip={CHIP} cam={[[0, 1.0, 960, 540], [d, 1.03, 960, 540]]}>
      <RelMap f={f} t={t} hl={f > a("s09p1", "distributes") - 2 && f < a("s09p1", "distributes") + 40 ? "dist" : null}/>
      <StickerLabel f={f} text="Prepaid: distribution" x={430} y={760} size={36} rot={-1.5} bg={C.teal} color={C.white} enter={{at: a("s09p1", "prepaid") - 4, mode: "pop", rot0: -5}}/>
      <StickerLabel f={f} text="Long-term arrangements" x={1500} y={560} size={36} rot={1.5} dark enter={{at: a("s09p1", "long") - 4, mode: "pop", rot0: 5}}/>
    </Frame>
  );
};

// P (p2, first words): full-screen photos: towers, then fibre (generic infrastructure photos, CC BY 4.0, credited in the chip)
const p9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const sw = a("s09p2", "expand") - 4;
  const second = f >= sw;
  return (
    <AbsoluteFill>
      {!second ? <PhotoFull f={f} d={sw} src="jio/media/tower_in_sunset.jpg" label="TOWERS" labelAt={-30} s0={1.15} s1={1.75} fx={61} fy={100}/>
        : <PhotoFull f={f - sw} d={d - sw} src="jio/media/fibre_reel_orange.jpg" label="FIBRE" labelAt={-30} s0={1.02} s1={1.1} fx={50} fy={50}/>}
      <SourceTag f={f} at={-30} dark text={second ? "Illustrative photo, not India · Antti Leppänen, CC BY 4.0, via Wikimedia Commons" : "Illustrative photo · Ayush Soran, CC BY 4.0, via Wikimedia Commons"}/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// B (p2 "They also" - p3): contract terms, one sentence at a time, each filling the frame width
const b9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  return (
    <Frame f={f} d={d} chip="Jio RHP p.33 · distribution agreements with Reliance Retail" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      {HEAD}
      <DocPage f={f} src="scale/docs/sc09_rhp33_sentence.png" imgW={RRL.w} imgH={RRL.h} x={960} y={520} width={1800} margin={0.025} rot={0}
        enter={{at: -14, mode: "drop", dur: 8}}
        highlights={[{rects: RRL.rects.mda, at: 10, dur: 12}, {rects: RRL.rects.mca, at: 34, dur: 12}, {rects: RRL.rects.sole, at: 66, dur: 10, color: "#D9D3C6"}]}/>
      <StickerLabel f={f} text="Pricing · service · renewal and exit?" x={960} y={820} size={44} rot={-1} dark enter={{at: a("s09p2", "important") - 6, mode: "pop", rot0: -5}}/>
    </Frame>
  );
};

// C (p3): the three questions, one sentence each: the price sentence, then the sentence on service credits and termination
const TERMS = [["Pricing", C.teal], ["Service obligations", C.ink], ["Renewal and exit terms", "#6B665E"]] as const;
const c9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const tS = a("s09p3", "service") - 8, tt = [a("s09p3", "price"), a("s09p3", "service"), a("s09p3", "happens")];
  const swap = ease(f, tS, tS + 10);
  return (
    <Frame f={f} d={d} chip="Jio RHP p.37 · RJIL's tower and fibre agreements (MSA, FUA)" cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      {HEAD}
      <div style={{opacity: 1 - swap}}>
        <DocPage f={f} src="scale/docs/sc09_rhp37_price.png" imgW={PRICE.w} imgH={PRICE.h} x={960} y={500} width={1800} margin={0.025} rot={0}
          enter={{at: -14, mode: "drop", dur: 8}}
          highlights={[{rects: PRICE.rects.pay, at: tt[0] + 2, dur: 12}]}/>
      </div>
      <div style={{opacity: swap}}>
        <DocPage f={f} src="scale/docs/sc09_rhp37_exit.png" imgW={EXIT.w} imgH={EXIT.h} x={960} y={500} width={1800} margin={0.025} rot={0}
          enter={{at: tS, mode: "slide-up", dur: 10}}
          highlights={[{rects: EXIT.rects.sla, at: tt[1] + 6, dur: 12}, {rects: EXIT.rects.term, at: tt[2] + 4, dur: 12}]}/>
      </div>
      {TERMS.map(([l, bg], i) => (
        <StickerLabel key={l} f={f} text={l} x={[330, 900, 1560][i]} y={850} size={40} rot={i % 2 ? 1.2 : -1.2} bg={bg} color={C.white} enter={{at: tt[i] - 2, mode: "pop", rot0: i % 2 ? 5 : -5}}/>
      ))}
    </Frame>
  );
};

// D (p4): reach depends partly on relationships, not only on assets inside one company: the full map again (full size, from the cut)
const d9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const t = {phone: -40, rjil: -40, dist: -40, distName: -40, sdil: -40, jdf: -40, legend: a("s09p4", "reach") - 4, scope: a("s09p4", "only") - 6};
  const hl = f > a("s09p4", "relationships") - 2 && f < a("s09p4", "not") ? "infra" : null;
  return (
    <Frame f={f} d={d} chip={CHIP} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <RelMap f={f} t={t} sub hl={hl}/>
      {HEAD}
      <div style={{position: "absolute", left: 60, top: 196, fontFamily: F.sans, fontWeight: 800, fontSize: 38, color: C.ink}}>Pricing · Service obligations · Renewal and exit terms</div>
    </Frame>
  );
};

// E (p5): step back. The map recedes, the three strengths are named, then the capital-spending chart frame rises (scene 10 follows)
const e9: React.FC<SP> = ({s0, d}) => {
  const f = useTicks(), a = useAt(s0);
  const back = ease(f, a("s09p5", "step") - 4, a("s09p5", "step") + 26, inOut);
  const inv = a("s09p5", "investment") - 6, away = ease(f, inv - 4, inv + 10, inOut);
  const t = {phone: -40, rjil: -40, dist: -40, distName: -40, sdil: -40, jdf: -40, legend: undefined};
  const sc = lerp(1, 0.5, back), tx = lerp(0, 1920 * (1 - 0.5) / 2, back), ty = lerp(0, 40, back);
  const strengths = [["Scale", "scale"], ["Useful spectrum", "useful"], ["Encouraging retention", "encouraging"]] as const;
  return (
    <Frame f={f} d={d} chip={CHIP} cam={[[0, 1.0, 960, 540], [d, 1.0, 960, 540]]}>
      <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 1 - away, transform: `translateY(${-away * 360}px)`}}>
        <div style={{position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${sc})`}}>
          <RelMap f={f} t={t} sub={false}/>
        </div>
        {strengths.map(([l, w], i) => (
          <StickerLabel key={l} f={f} text={l} x={[260, 800, 1520][i]} y={680 + (i % 2) * 20} size={46} rot={i % 2 ? 1.5 : -1.5} bg={i === 1 ? C.ink : i === 0 ? C.teal : "#6B665E"} color={C.white}
            enter={{at: a("s09p5", w) - 3, mode: "pop", rot0: i % 2 ? 5 : -5}}/>
        ))}
        <StickerLabel f={f} text="A serious case, as spending changes" x={960} y={840} size={40} rot={-0.8} enter={{at: a("s09p5", "serious") - 4, mode: "pop", rot0: -4}}/>
      </div>
      <CapexFrame f={f} at={inv + 8} x={960} y={520}/>
    </Frame>
  );
};

export const SHOTS09: Shot[] = [
  S("s09p1", 0, H0, a9, "s09-a"), S("s09p2", 0, WL, p9, "s09-photo"), S("s09p2", "They also|-0.1", PU, b9, "s09-b"), S("s09p3", 0, PU, c9, "s09-c"),
  S("s09p4", 0, WL, d9, "s09-d"), S("s09p5", 0, PU, e9, "s09-e"),
];
export const CUES09: SCue[] = [[W("s09p1", "Reliance"), "pop", 0.3], [W("s09p2", "contract"), "paper", 0.35], [W("s09p3", "Who"), "highlighter", 0.3], [W("s09p5", "investment"), "paper", 0.35]];
