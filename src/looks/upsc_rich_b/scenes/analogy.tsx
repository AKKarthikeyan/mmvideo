// Look B "analogy" scenes (UPSC monsoon film). Spec: {which, time?, chip?, limit?, labels: [{text, key}]}; see ../CONTRACT_B.md.
// which: heat-rates | column | rooms | gradient (analogy_a.tsx), breeze | roundabout | pot (analogy_b.tsx). Labels are drawn only from at(key).
import React from "react";
import type {SceneProps} from "../../cartoon/long/contract";
import {A} from "./analogy_a";
import {B} from "./analogy_b";
import {P2A} from "./analogy_p2a";
import {P2B} from "./analogy_p2b";
import {E1} from "./analogy_e1";
import {E2} from "./analogy_e2";
import {E3} from "./analogy_e3";
import {F1} from "./analogy_f1";
import {F2} from "./analogy_f2";
import {F3} from "./analogy_f3";
import {G1} from "./analogy_g1";
import {G2} from "./analogy_g2";
import {G3} from "./analogy_g3";
import {V1} from "./analogy_v1";
import {V2} from "./analogy_v2";
import {V3} from "./analogy_v3";
import {W1} from "./analogy_w1";
import {W2} from "./analogy_w2";
import {W3} from "./analogy_w3";
import {W4} from "./analogy_w4";
import {Frame, type AnalogySpec} from "./analogy_kit";

const ART: Record<string, {Art: React.FC<any>; Labels: React.FC<any>; bg?: string}> = {...A, ...B, ...P2A, ...P2B, ...E1, ...E2, ...E3, ...F1, ...F2, ...F3, ...G1, ...G2, ...G3, ...V1, ...V2, ...V3, ...W1, ...W2, ...W3, ...W4};

export const Scene: React.FC<SceneProps<AnalogySpec>> = ({f, dur, spec, at}) => {
  const which = spec?.which ?? "", E = ART[which];
  if (!E) throw new Error(`analogy: unknown which "${which}" (${Object.keys(ART).join(", ")})`);
  const props = {f, dur, spec, at}, night = which === "breeze" && spec.time === "night";
  return (
    <Frame f={f} dur={dur} spec={spec} id={`an-${which}`} dark={night} bg={E.bg ?? "#EFE6D2"} drift={which === "roundabout" ? 0.012 : 0.03} overlay={<E.Labels {...props}/>}>
      <E.Art {...props}/>
    </Frame>
  );
};
