import React from "react";
import {Composition, Still} from "remotion";
import {Banner, Logo, ThumbG15, Watermark} from "./brand";
import {StyleTest, FPS, W, H, StyleData} from "./StyleTest";
import styletest from "../../public/gita/styletest/data.json";
import {G15} from "./g15/G15";
import {G15Data} from "./kit";
import g15 from "../../public/gita/g15/data.json";

export const GitaRoot: React.FC = () => (
  <>
    <Composition id="GITA-styletest" component={StyleTest as any} defaultProps={{D: styletest as StyleData}}
      durationInFrames={Math.ceil((styletest as StyleData).total * FPS)} fps={FPS} width={W} height={H}/>
    <Composition id="GITA-g15" component={G15 as any} defaultProps={{D: g15 as unknown as G15Data}}
      durationInFrames={Math.ceil((g15 as unknown as G15Data).total * FPS)} fps={FPS} width={W} height={H}/>
    <Still id="GITA-logo" component={Logo} width={800} height={800}/>
    <Still id="GITA-watermark" component={Watermark} width={150} height={150}/>
    <Still id="GITA-banner" component={Banner} width={2560} height={1440}/>
    <Still id="GITA-banner-guides" component={Banner as any} defaultProps={{guides: true}} width={2560} height={1440}/>
    <Still id="GITA-thumb-g15" component={ThumbG15} width={1280} height={720}/>
  </>
);
