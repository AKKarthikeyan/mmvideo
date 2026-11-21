// VOXPLUS-depth (8 s): one shot that exercises every part of Depth.tsx on the A01 loom story.
// Facts: Berkshire Hathaway 1985 letter (the looms sold for scrap at $26 each, the same quote the Catalog uses);
// photo: Draper looms, Bamberg, 1987 (HAER / Library of Congress, public domain, LICENSES.md).
//
// The shot, beat by beat (ticks of 1/30 s):
//   0-60    wide on the desk; camera dollies in from d 1180 to 980 with a 4-degree orbit; focus on the photo (z 0)
//   40      a torn blue block is already behind (z -260): it moves slower and sits softer, so depth reads at once
//   70-94   the "$26 EACH" label is picked up and placed onto the photo (liftArc): shadow grows, then lands
//   110     a flap hinges up from the bottom on the near plane (z 200): "SOLD FOR SCRAP"
//   130-170 focus racks from the photo to the flap; the photo softens and hazes slightly
//   170-240 hold with idle drift: 2.3 s of reading time, nothing frozen
import React from "react";
import {AbsoluteFill} from "remotion";
import {SourceTag} from "./Cards";
import {PhotoPrint, StickerLabel, TornBlock} from "./Collage";
import {BlockCard, Boil, Cam3Key, Hinge, Lifted, Plane, Stage, cam3At, drift, liftArc, onTwos} from "./Depth";
import {Finish, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";
import {C, F, outQuint, useTicks} from "./tokens";

export const DEPTH_TOTAL = 240;   // ticks (= frames at 30 fps)

const KEYS: Cam3Key[] = [
  [0, {x: 960, y: 560, d: 1180, yaw: -4, pitch: 2, focus: 0, aperture: 0.35, haze: 0.4}],
  [60, {x: 940, y: 540, d: 980, yaw: 0, pitch: 0}, outQuint],
  [130, {focus: 0}],
  [170, {focus: 200, x: 980, y: 600, d: 940}],
  [240, {d: 920, yaw: 1.5}],
];

export const DepthDemo: React.FC = () => {
  useVoxFonts();
  const t = useTicks();
  const cam = cam3At(t, KEYS);
  const pick = liftArc(t, 70, 24, 150);
  // label travels from the left margin onto the photo's corner while it is in the air
  const lx = 420 + (1080 - 420) * pick.p, ly = 300 + (390 - 300) * pick.p;
  const d1 = drift(t, "photo", 3), d2 = drift(t, "flap", 4);
  return (
    <AbsoluteFill style={{background: C.kraft}}>
      <Stage cam={cam}>
        {/* far: the desk itself, deliberately blurred and hazed */}
        <Plane cam={cam} z={-520}><PaperSurface tone="kraft"/></Plane>
        {/* back: a torn colour block, on twos so it reads as cut paper */}
        <Plane cam={cam} z={-260}>
          <TornBlock f={onTwos(t)} x={760} y={520} w={1180} h={640} rot={-3} seed="depthblock" enter={{at: 0, mode: "none"}}/>
        </Plane>
        {/* focus plane: the photo, and the label that lands on it */}
        <Plane cam={cam} z={0}>
          <AbsoluteFill style={{transform: `translate(${d1.x}px, ${d1.y}px) rotate(${d1.r}deg)`}}>
            <PhotoPrint f={t} src="media/loom_draper_1987.jpg" x={940} y={540} w={900} h={600} rot={2} caption="Draper looms · 1987 · HAER/LoC"
              enter={{at: 0, mode: "none"}}/>
          </AbsoluteFill>
          {t >= 60 ? (
            <Lifted lift={pick.lift} x={lx} y={ly} strength={0.9}>
              <StickerLabel f={t} text="$26 each" x={lx} y={ly} size={64} rot={-4} enter={{at: 60, mode: "pop"}}/>
            </Lifted>
          ) : null}
        </Plane>
        {/* near: a hand-cut flap, with line boil on its edge only */}
        <Plane cam={cam} z={200}>
          <AbsoluteFill style={{transform: `translate(${d2.x}px, ${d2.y}px)`}}>
            <Hinge t={t} at={110} dur={18} edge="bottom" x={1260} y={850} w={620} h={150} stepped={2}>
              <Boil t={t} amount={1.2}>
                <BlockCard x={310} y={75} w={620} h={150} color={C.highlight} lift={0}/>
              </Boil>
              {/* the words sit outside the boil: wobble the paper edge, never the text */}
              <div style={{position: "absolute", inset: 0, fontFamily: F.sans, fontWeight: 900, fontSize: 64, color: C.ink, textAlign: "center",
                lineHeight: "150px", textTransform: "uppercase", letterSpacing: 1}}>Sold for scrap</div>
            </Hinge>
          </AbsoluteFill>
        </Plane>
      </Stage>
      {/* screen space: never moves, never blurs */}
      <SourceTag f={t} at={8} text="Berkshire Hathaway · 1985 letter · style sample of the depth kit"/>
      <Finish f={t}/>
    </AbsoluteFill>
  );
};
