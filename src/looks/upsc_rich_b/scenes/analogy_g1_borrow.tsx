// ECO-16 Part 3, builder G1: `two-borrowers` (b00, the hook). mode "salim": the shoe workshop; mode "swapna": the groundnut field and the moneylender at the gate.
import React from "react";
import {P2Card, elabs, type AP} from "./analogy_g1_kit";
import {SalimArt} from "./analogy_g1_salim";
import {SwapnaArt, SwapnaLabels} from "./analogy_g1_swapna";

export const BorrowArt: React.FC<AP> = (p) => ((p.spec as any).mode === "swapna" ? <SwapnaArt {...p}/> : <SalimArt {...p}/>);

const SalimLabels: React.FC<AP> = (p) => {
  const L = elabs(p);
  return (
    <>
      <P2Card cx={430} y={128} text={L.sl.text} f={p.f} at={L.sl.at} size={34} maxW={620} upper={false}/>
      <P2Card cx={1010} y={128} text={L.od.text} f={p.f} at={L.od.at} size={38} maxW={520} upper={false}/>
      <P2Card cx={1500} y={128} text={L.pf.text} f={p.f} at={L.pf.at} size={38} maxW={520} upper={false} tone="green"/>
    </>
  );
};

export const BorrowLabels: React.FC<AP> = (p) => ((p.spec as any).mode === "swapna" ? <SwapnaLabels {...p}/> : <SalimLabels {...p}/>);
