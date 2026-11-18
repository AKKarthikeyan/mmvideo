// 60 FPS shim (20 Oct 2026, jioipo): every scene keeps working in 30 FPS units (frame numbers, phrase offsets, spring fps),
// while the composition renders more real frames per second. useCurrentFrame returns fractional 30-FPS frames, so motion is
// sampled at the real frame rate; Sequence/Audio placements are scaled up. At fps=30 this is a no-op.
import React from "react";
import * as R from "remotion";
export * from "remotion";
const k = (fps: number) => fps / 30;
export const useCurrentFrame = () => {
  const f = R.useCurrentFrame();
  const {fps} = R.useVideoConfig();
  return f / k(fps);
};
export const useVideoConfig = () => {
  const c = R.useVideoConfig();
  return {...c, fps: 30, durationInFrames: Math.round(c.durationInFrames / k(c.fps))};
};
export const Sequence: React.FC<any> = ({from = 0, durationInFrames, ...p}) => {
  const {fps} = R.useVideoConfig();
  const s = k(fps);
  const d = durationInFrames === undefined || durationInFrames === Infinity ? durationInFrames : Math.max(1, Math.round(durationInFrames * s));
  return <R.Sequence {...p} from={Math.round(from * s)} durationInFrames={d}/>;
};
