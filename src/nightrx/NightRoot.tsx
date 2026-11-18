import React from "react";
import {Composition} from "remotion";
import {StyleTest, FPS, W, H, StyleData} from "./StyleTest";
import styletest from "../../public/nightrx/styletest/data.json";
import styletestLive from "../../public/nightrx/styletest_live/data.json";
import {StyleReel, ReelData} from "./StyleReel";
import reel from "../../public/nightrx/styles/data.json";

export const NightRoot: React.FC = () => (
  <>
    <Composition id="NRX-styletest" component={StyleTest as any} defaultProps={{D: styletest as unknown as StyleData}}
      durationInFrames={Math.ceil((styletest as unknown as StyleData).total * FPS)} fps={FPS} width={W} height={H}/>
    <Composition id="NRX-styletest-live" component={StyleTest as any} defaultProps={{D: styletestLive as unknown as StyleData}}
      durationInFrames={Math.ceil((styletestLive as unknown as StyleData).total * FPS)} fps={FPS} width={W} height={H}/>
    <Composition id="NRX-stylereel" component={StyleReel as any} defaultProps={{D: reel as unknown as ReelData}}
      durationInFrames={Math.ceil((reel as unknown as ReelData).total * FPS)} fps={FPS} width={W} height={H}/>
  </>
);
