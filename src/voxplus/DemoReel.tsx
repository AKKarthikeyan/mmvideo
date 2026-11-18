// Vox Motion+ demo reel (18 Oct 2026): ~28 s, no narration, temp CC0 music bed. Shows the kit on the "$26 loom" material
// (VOX_STUDY section 4, angle 1 cold-open sketch). Every figure on screen is from the 1985 Berkshire letter, shown on screen.
// Shots: A loom photo + price tag ($5,000 -> $50 crossed -> $26) | B 1985 letter, highlighted | C chart on black |
//        D candy box cut-out vs the looms | E the question, big serif on black | F 1986 letter, "moat" | G India map, four pins
import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {BigWord, PriceTag} from "./BigType";
import {Layer, camAt, CamKey} from "./Camera";
import {SourceTag} from "./Cards";
import {ChartBuild} from "./ChartBuild";
import {PhotoPrint, Sticker, StickerLabel, TornBlock} from "./Collage";
import {DocPage, docRectCentre} from "./DocPage";
import {MapRoute, useGeo} from "./MapRoute";
import {Rect} from "./Marker";
import {Cue, MusicBed, SfxTrack} from "./Sound";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {TransitionSeries, linearTiming, paperOver, pushThrough, whip} from "./Transitions";
import {useVoxFonts} from "./fonts";
import {C, F, H, W, clamp01, ease, inOut, outCubic, outQuint} from "./tokens";

// ---------------- timeline ----------------
const T = 14;                                   // transition length (frames)
export const SCENES = {A: 215, B: 132, C: 122, D: 118, E: 96, F: 118, G: 128};
const ORDER = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const START: Record<string, number> = {};
{ let s = 0; for (const k of ORDER) { START[k] = s; s += SCENES[k] - T; } }
export const DEMO_TOTAL = ORDER.reduce((s, k) => s + SCENES[k], 0) - T * (ORDER.length - 1);

// ---------------- documents (rects in image px, from tools/letter_shot.py JSON) ----------------
const D85 = {src: "docs/bh1985_looms.png", imgW: 2018, imgH: 918, x: 960, y: 575, width: 1480, rot: -1.2};
const R85 = {
  looms: [[744.1, 432, 1123.4, 54], [24, 486, 1411.5, 54]] as Rect[],
  scrap: [[1493.0, 486, 316.9, 54], [24, 540, 893.0, 54]] as Rect[],
  d26: [686.5, 540, 86.4, 54] as Rect,
};
const D86 = {src: "docs/bh1986_moat.png", imgW: 2018, imgH: 864, x: 960, y: 560, width: 1480, rot: 1.0};
const R86 = {
  line: [[456.0, 486, 1411.5, 54], [24, 540, 835.4, 54]] as Rect[],
  moat: [744.1, 486, 115.3, 54] as Rect,
};

// ======================= A: the loom and the price tag =======================
const TAG = {x: 1430, y: -30};
const A_CAM: CamKey[] = [
  [0, 1.0, 960, 540], [104, 1.07, 950, 530],
  [122, 1.95, TAG.x - 10, 340, outQuint], [215, 2.08, TAG.x - 10, 350, inOut],
];
const SceneA: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(f, A_CAM);
  const focus = ease(f, 104, 126, outCubic);               // rack focus: photos go soft as we land on the tag
  const pushBlur = 5 * Math.sin(Math.PI * clamp01((f - 104) / 18));
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.85}><PaperSurface drift={f / 215}/></Layer>
      <Layer cam={cam} depth={0.8} blur={focus * 7 + pushBlur}>
        <PhotoPrint f={f} src="media/looms_radcliffe_1912.jpg" x={1250} y={430} w={940} h={600} rot={-5} halftone={0.22} darken={0.12}
          enter={{at: 0, mode: "slide", from: [-1600, 0], dur: 10, stepped: 2}} crop={{s0: 1.0, s1: 1.08, dur: 215}}/>
      </Layer>
      <Layer cam={cam} depth={1} blur={focus * 5 + pushBlur}>
        <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={760} y={575} w={1120} h={790} rot={2} halftone={0.12}
          enter={{at: 4, mode: "slide", from: [1700, 120], rot0: 8, dur: 11}} crop={{s0: 1.12, s1: 1.0, fx: 0.55, fy: 0.6, dur: 200}}/>
        <StickerLabel f={f} text="1981" x={300} y={240} size={64} rot={-5} enter={{at: 30, mode: "pop", rot0: -14}}/>
      </Layer>
      <Layer cam={cam} depth={1} blur={pushBlur * 0.6}>
        <PriceTag f={f} enterAt={16} x={TAG.x} y={TAG.y} string={250} values={[
          {text: "$5,000", at: 16},
          {text: "$50", at: 136, crossAt: 160},
          {text: "$26", at: 186, stamp: true},
        ]}/>
        <StickerLabel f={f} text="1986" x={TAG.x - 250} y={455} size={34} rot={-4} enter={{at: 140, mode: "pop", rot0: 12}}/>
      </Layer>
      <SourceTag f={f} at={20} until={98} text="Photo: J. Boucher, HAER / Library of Congress" pos="bl"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// ======================= B: the 1985 letter =======================
const b0 = docRectCentre(D85, R85.looms[0]), b1 = docRectCentre(D85, R85.scrap[1]);
const B_CAM: CamKey[] = [[0, 1.0, 960, 560], [14, 1.0, 960, 560], [70, 1.32, (b0.x + b1.x) / 2 + 40, (b0.y + b1.y) / 2, inOut], [132, 1.42, b1.x - 60, b1.y, inOut]];
const B_D26 = (() => {             // screen position of "$26" at the end of the scene (aim of the push-through)
  const w = docRectCentre(D85, R85.d26), c = camAt(SCENES.B - T, B_CAM);
  return {x: (w.x - c.x) * c.s + W / 2, y: (w.y - c.y) * c.s + H / 2};
})();
const SceneB: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(f, B_CAM);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.9}><PaperSurface tone="kraft" drift={f / 130}/></Layer>
      <Layer cam={cam}>
        <DocPage f={f} {...D85} stack={2} enter={{at: 0, mode: "slide-up", dur: 13}}
          highlights={[{rects: R85.looms, at: 22, dur: 10}, {rects: R85.scrap, at: 50, dur: 10}]}
          circles={[{rect: R85.d26, at: 78, dur: 13}]}
          focus={{rect: [0, 432, 2018, 162], at: 62, blur: 2.4}}/>
      </Layer>
      <SourceTag f={f} at={8} text="Berkshire Hathaway · 1985 letter"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// ======================= C: chart on black =======================
const SceneC: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ChartBuild f={f} at={4} title="One loom's price" source="Berkshire Hathaway · 1985 letter" max={5400}
        bars={[{label: "Bought, 1981", value: 5000}, {label: "Scrap, 1986", value: 26, key: true, valueText: "$26"}]}
        box={{x: 470, y: 370, w: 980, h: 470}}/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// ======================= D: candy box vs the looms =======================
const D_CAM: CamKey[] = [[0, 1.1, 760, 560], [60, 1.02, 940, 545], [118, 1.08, 1010, 540]];
const SceneD: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(f, D_CAM);
  const write = ease(f, 52, 74, (t) => t);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.8}><PaperSurface drift={f / 118}/></Layer>
      <Layer cam={cam} depth={0.85}>
        <TornBlock f={f} x={470} y={560} w={760} h={680} rot={-3} color={C.wallBlue} enter={{at: 0, mode: "slide", from: [0, 1200], dur: 10}}/>
        <TornBlock f={f} x={1500} y={560} w={600} h={640} rot={4} color={C.kraft} seed="tb2" enter={{at: 6, mode: "slide", from: [0, -1200], dur: 10}}/>
      </Layer>
      <Layer cam={cam} depth={1}>
        <Sticker f={f} src="media/candy_box_sticker.png" x={470} y={620} w={720} h={250} rot={-8} bob={4}
          enter={{at: 3, mode: "slide", from: [-1500, 200], rot0: -20, dur: 12}}/>
        <PhotoPrint f={f} src="media/looms_radcliffe_1912.jpg" x={1520} y={680} w={400} h={276} rot={7} border={9} tape={false} halftone={0.2}
          enter={{at: 16, mode: "slide", from: [1300, 0], dur: 9, stepped: 2}}/>
        <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={1470} y={590} w={410} h={286} rot={-4} border={9} tape={false} halftone={0.16}
          enter={{at: 21, mode: "slide", from: [1300, -60], dur: 9, stepped: 2}}/>
        <PhotoPrint f={f} src="media/loom_draper_1987.jpg" x={1530} y={500} w={380} h={266} rot={3} border={9} halftone={0.16}
          crop={{s0: 1.6, s1: 1.6, fx: 0.62, fy: 0.62}} enter={{at: 26, mode: "slide", from: [1300, 40], dur: 9, stepped: 2}}/>
      </Layer>
      <Layer cam={cam} depth={1.12}>
        <StickerLabel f={f} text="One candy shop" x={470} y={380} size={52} rot={-3} enter={{at: 30, mode: "pop", rot0: -10}}/>
        <StickerLabel f={f} text="All the looms" x={1500} y={330} size={48} rot={3} dark enter={{at: 40, mode: "pop", rot0: 10}}/>
        <div style={{position: "absolute", left: 1040, top: 520, transform: "translate(-50%, -50%) rotate(-5deg)", fontFamily: F.marker, fontSize: 56,
          lineHeight: 1.0, textAlign: "center", color: C.markerRed, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - write * 100}% -20% 0)`}}>worth<br/>more than</div>
        <svg width={W} height={H} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
          <path d="M 920 650 Q 1040 700 1170 640" fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" pathLength={1}
            strokeDasharray={1} strokeDashoffset={1 - ease(f, 74, 84, outCubic)}/>
          <path d="M 1138 620 L 1172 640 L 1144 668" fill="none" stroke={C.markerRed} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
            strokeDasharray={1} strokeDashoffset={1 - ease(f, 84, 90, outCubic)}/>
        </svg>
      </Layer>
      <SourceTag f={f} at={34} text="Berkshire Hathaway · 1985 letter"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// ======================= E: the question =======================
const SceneE: React.FC = () => {
  const f = useCurrentFrame();
  const s = 1.08 - 0.08 * ease(f, 0, 96, outCubic);   // pull-out (breaks the run of push-ins)
  return (
    <AbsoluteFill>
      <InkSurface glow={0.07}/>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <BigWord f={f} at={6} text="Why does candy win?" x={960} y={520} size={176} stagger={5} mark={["candy"]} markAt={36}/>
      </AbsoluteFill>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

// ======================= F: the 1986 letter, "moat" =======================
const fm = docRectCentre(D86, R86.moat);
const F_CAM: CamKey[] = [[0, 1.0, 960, 560], [12, 1.0, 960, 560], [64, 1.35, fm.x + 120, fm.y + 10, inOut], [118, 2.1, fm.x, fm.y, inOut]];
export const F_MOAT_END = (() => {
  const c = camAt(SCENES.F - T, F_CAM);
  return {x: (fm.x - c.x) * c.s + W / 2, y: (fm.y - c.y) * c.s + H / 2};
})();
const SceneF: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(f, F_CAM);
  return (
    <AbsoluteFill>
      <Layer cam={cam} depth={0.9}><PaperSurface tone="kraft" drift={f / 118}/></Layer>
      <Layer cam={cam}>
        <DocPage f={f} {...D86} stack={3}
          highlights={[{rects: R86.line, at: 20, dur: 11}]}
          circles={[{rect: R86.moat, at: 52, dur: 13}]}
          focus={{rect: [0, 486, 2018, 108], at: 46, blur: 2.8}}/>
        <StickerLabel f={f} text="1986" x={D86.x + 720} y={D86.y - 405} size={58} rot={5} enter={{at: 10, mode: "pop", rot0: 16}}/>
      </Layer>
      <SourceTag f={f} at={6} text="Berkshire Hathaway · 1986 letter"/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};

// ======================= G: India map, four pins =======================
const MUMBAI: [number, number] = [72.88, 19.08], DELHI: [number, number] = [77.21, 28.61], KOLKATA: [number, number] = [88.36, 22.57], CHENNAI: [number, number] = [80.27, 13.08];
const G_CAM: CamKey[] = [[0, 0.62, 960, 560], [30, 1.06, 960, 540, outCubic], [128, 0.98, 990, 545, inOut]];
const SceneG: React.FC = () => {
  const f = useCurrentFrame();
  const geo = useGeo();
  const cam = camAt(f, G_CAM);
  return (
    <AbsoluteFill style={{background: C.mapWater}}>
      <Layer cam={cam}>
        <MapRoute f={f} geo={geo} inkAt={6} credit={false}
          pins={[
            {lon: MUMBAI[0], lat: MUMBAI[1], at: 30, label: "Mumbai", side: "left"},
            {lon: DELHI[0], lat: DELHI[1], at: 40, label: "Delhi", side: "left"},
            {lon: KOLKATA[0], lat: KOLKATA[1], at: 50, label: "Kolkata", side: "right"},
            {lon: CHENNAI[0], lat: CHENNAI[1], at: 60, label: "Chennai", side: "right"},
          ]}
          routes={[
            {from: MUMBAI, to: DELHI, at: 68, dur: 20, bend: -0.2},
            {from: MUMBAI, to: KOLKATA, at: 74, dur: 24, bend: -0.12},
            {from: MUMBAI, to: CHENNAI, at: 80, dur: 20, bend: 0.2},
          ]}/>
      </Layer>
      <SourceTag f={f} at={20} text="Map: Natural Earth (India view)" pos="br"/>
      <Finish f={f} vignette={0.26}/>
      <AbsoluteFill style={{background: "#000", opacity: ease(f, 110, 128, inOut)}}/>
    </AbsoluteFill>
  );
};

// ======================= sound =======================
const at = (k: keyof typeof SCENES, f: number) => START[k] + f;
export const DEMO_CUES: Cue[] = [
  [at("A", 0), "paper", 0.8], [at("A", 6), "click"], [at("A", 18), "paper", 0.5], [at("A", 30), "pop"],
  [at("A", 104), "whooshDeep", 0.7], [at("A", 131), "paper", 0.6], [at("A", 160), "circle"], [at("A", 186), "stamp"],
  [at("B", -6), "whoosh"], [at("B", 2), "paper"], [at("B", 22), "highlighter"], [at("B", 50), "highlighter", 0.8], [at("B", 78), "circle"],
  [at("C", -8), "whooshDeep", 0.8], [at("C", 34), "ding", 0.8], [at("C", 76), "ding", 0.6], [at("C", 96), "circle", 0.8],
  [at("D", -4), "paper"], [at("D", 10), "paper", 0.7], [at("D", 18), "click", 0.6], [at("D", 30), "pop"], [at("D", 40), "pop"], [at("D", 52), "highlighter", 0.7], [at("D", 74), "circle", 0.6],
  [at("E", -6), "whoosh", 0.8], [at("E", 8), "stamp", 0.35], [at("E", 36), "highlighter", 0.6],
  [at("F", -2), "paper"], [at("F", 20), "highlighter"], [at("F", 52), "circle"],
  [at("G", -8), "whooshDeep", 0.7], [at("G", 30), "pop"], [at("G", 40), "pop"], [at("G", 50), "pop"], [at("G", 60), "pop"],
];

export const DemoReel: React.FC<{bed?: string; music?: boolean}> = ({bed = "audio/music_06_curious_ambience_reg1n0ld.wav", music = true}) => {
  useVoxFonts();
  const t = linearTiming({durationInFrames: T});
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.A}><SceneA/></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip("right")} timing={t}/>
        <TransitionSeries.Sequence durationInFrames={SCENES.B}><SceneB/></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pushThrough(B_D26.x, B_D26.y, 5, 7)} timing={t}/>
        <TransitionSeries.Sequence durationInFrames={SCENES.C}><SceneC/></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paperOver("up")} timing={t}/>
        <TransitionSeries.Sequence durationInFrames={SCENES.D}><SceneD/></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={whip("down")} timing={t}/>
        <TransitionSeries.Sequence durationInFrames={SCENES.E}><SceneE/></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={paperOver("up")} timing={t}/>
        <TransitionSeries.Sequence durationInFrames={SCENES.F}><SceneF/></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={pushThrough(F_MOAT_END.x, F_MOAT_END.y, 6, 8)} timing={t}/>
        <TransitionSeries.Sequence durationInFrames={SCENES.G}><SceneG/></TransitionSeries.Sequence>
      </TransitionSeries>
      {music ? <MusicBed src={bed} total={DEMO_TOTAL} open={0.42} startFrom={600} fadeIn={10} fadeOut={24}/> : null}
      <SfxTrack cues={DEMO_CUES}/>
    </AbsoluteFill>
  );
};
