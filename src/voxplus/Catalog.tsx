// Component catalogue (not part of the reel): chapter card, PAUSE card, quote/headline stack and a big number, so every
// component in the kit renders at least once. All quotes are verbatim from the Berkshire letters named on each card.
import React from "react";
import {AbsoluteFill, Sequence, useCurrentFrame} from "remotion";
import {BigNumber, SubLine} from "./BigType";
import {ChapterCard, HeadlineStack, PauseCard, SourceTag} from "./Cards";
import {Finish, InkSurface, PaperSurface} from "./Texture";
import {useVoxFonts} from "./fonts";

export const CATALOG_TOTAL = 360;

const Chap: React.FC = () => { const f = useCurrentFrame(); return <><ChapterCard f={f} n={1} word="The Looms" kicker="Why machines lose value"/><Finish f={f}/></>; };
const Pause: React.FC = () => {
  const f = useCurrentFrame();
  return <><PauseCard f={f} term="goodwill" note="value you can't touch" icon={{src: "media/candy_box_sticker.png", w: 620, h: 215}}/><Finish f={f}/></>;
};
const Stack: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <PaperSurface tone="kraft" drift={f / 90}/>
      <HeadlineStack f={f} clips={[
        {kicker: "Berkshire letter · 1985", text: "“no takers at $50”", at: 4},
        {kicker: "Berkshire letter · 1985", text: "“scrap at $26 each”", at: 22},
        {kicker: "Berkshire letter · 1986", text: "“a kind of moat”", at: 40, style: "quote"},
      ]}/>
      <Finish f={f}/>
    </AbsoluteFill>
  );
};
const Num: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <InkSurface/>
      <BigNumber f={f} at={6} to={163122} prefix="$" x={960} y={480} size={250} dur={32}/>
      <SubLine f={f} at={30} text="All the machinery sold" x={960} y={660} size={44}/>
      <SourceTag f={f} at={10} text="Berkshire Hathaway · 1985 letter" dark/>
      <Finish f={f} dark/>
    </AbsoluteFill>
  );
};

export const Catalog: React.FC = () => {
  useVoxFonts();
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={90}><Chap/></Sequence>
      <Sequence from={90} durationInFrames={90}><Pause/></Sequence>
      <Sequence from={180} durationInFrames={90}><Stack/></Sequence>
      <Sequence from={270} durationInFrames={90}><Num/></Sequence>
    </AbsoluteFill>
  );
};
