// Placeholder scene shot (removed by the scene builder when the real shots land).
import React from "react";
import {AbsoluteFill} from "remotion";
import {Paper, SP} from "./kit/A01V4Parts";
import {C, F} from "./kit/tokens";

export const Placeholder: React.FC<SP & {n: string; title: string; screen: string[]}> = ({n, title, screen}) => (
  <AbsoluteFill style={{background: C.paper}}>
    <Paper/>
    <div style={{position: "absolute", left: 120, top: 140, fontFamily: F.sans, fontWeight: 800, fontSize: 40, color: C.teal, letterSpacing: 3}}>SCENE {n} · PLACEHOLDER</div>
    <div style={{position: "absolute", left: 120, top: 210, width: 1680, fontFamily: F.sans, fontWeight: 800, fontSize: 96, lineHeight: 1.05, color: C.ink}}>{title}</div>
    <div style={{position: "absolute", left: 120, top: 520, width: 1680, fontFamily: F.sans, fontWeight: 600, fontSize: 44, lineHeight: 1.3, color: C.inkSoft}}>
      {screen.map((l, i) => <div key={i} style={{marginBottom: 14}}>{l}</div>)}
    </div>
  </AbsoluteFill>
);
