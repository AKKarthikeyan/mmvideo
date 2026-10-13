// Result Engine videos (Q2 FY27 season onwards): props-driven compositions, so a new company result needs no code.
// The Result Engine (DarwinWiki resultengine/video.py) writes Vox-shaped data and passes it as --props={D, idx?};
// audio is read from <public-dir>/vx/<D.id>/<beat>.mp3. Scenes, timing and furniture are the Vox engine's own.
// RESULT-napkin is the exception: the Short drawn with the hand kit in the Napkin Math format (ResultNapkin.tsx).
import React from "react";
import {AbsoluteFill, Composition, Still} from "remotion";
import {C, COND, TYPE, VoxFonts} from "../voxkit";
import {FPS, VData, VoxLong, VoxShort, longLayout, shortLayout} from "../vx/VoxEngine";
import {NEMPTY, NFPS, ResultNapkin, napkinTotal} from "./ResultNapkin";

const EMPTY: VData = {id: "r-empty", title: "Result", chapters: ["Result"], shorts: [{title: "Result", beats: ["e0"], loop: true}],
  timelines: {}, clips: {}, beats: [{ch: 0, key: "e0", say: "", cap: "", sec: 1, cues: [""], scene: {type: "end", plain: true}}]};

// Thumbnail: dark ground (not red-and-white), company name, one number badge. Three words or fewer beside the badge.
type Thumb = {name: string; badge: string; badgeSub: string; line: string; accent?: string};
const ResultThumb: React.FC<Thumb> = ({name, badge, badgeSub, line, accent}) => {
  const A = accent || C.mustard;
  return (
    <AbsoluteFill style={{background: "#15171c"}}>
      <VoxFonts/>
      <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: "absolute"}}>
        <text x={60} y={250} fontFamily={COND} fontWeight={700} fontSize={Math.min(190, 1500 / Math.max(5, name.length))} fill="#f7f3ea">{name.toUpperCase()}</text>
        <text x={60} y={400} fontFamily={COND} fontWeight={700} fontSize={Math.min(110, 1400 / Math.max(6, line.length))} fill={A}>{line.toUpperCase()}</text>
        <text x={60} y={650} fontFamily={TYPE} fontSize={30} fill="#f7f3ea" opacity={0.7}>Moat &amp; Margin · from the filings</text>
        <g transform="translate(880 130)">
          <rect x={0} y={0} width={340} height={440} rx={24} fill={A}/>
          <text x={170} y={240} fontFamily={COND} fontWeight={700} fontSize={Math.min(150, 560 / Math.max(3, badge.length))} textAnchor="middle" fill="#15171c">{badge}</text>
          {badgeSub.split("|").map((l, i) => <text key={i} x={170} y={330 + i * 50} fontFamily={COND} fontWeight={700} fontSize={40} textAnchor="middle" fill="#15171c">{l}</text>)}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const ResultRoot: React.FC = () => (
  <>
    <Composition id="RESULT-long" component={VoxLong as any} defaultProps={{D: EMPTY}} fps={FPS} width={1920} height={1080}
      durationInFrames={longLayout(EMPTY).total} calculateMetadata={({props}: any) => ({durationInFrames: longLayout(props.D).total})}/>
    <Composition id="RESULT-short" component={VoxShort as any} defaultProps={{D: EMPTY, idx: 0}} fps={FPS} width={1080} height={1920}
      durationInFrames={shortLayout(EMPTY, 0).total} calculateMetadata={({props}: any) => ({durationInFrames: shortLayout(props.D, props.idx ?? 0).total})}/>
    {/* The Short in the Napkin Math format (13 Oct 2026 onwards): --props={D, label}; layout comes from resultengine/napkin.py. */}
    <Composition id="RESULT-napkin" component={ResultNapkin as any} defaultProps={{D: NEMPTY, label: "Result"}} fps={NFPS} width={1080} height={1920}
      durationInFrames={napkinTotal(NEMPTY)} calculateMetadata={({props}: any) => ({durationInFrames: napkinTotal(props.D)})}/>
    <Still id="RESULT-thumb" component={ResultThumb as any} defaultProps={{name: "Company", badge: "+0%", badgeSub: "NET PROFIT|Q2 FY27", line: "Q2 results"}} width={1280} height={720}/>
  </>
);
