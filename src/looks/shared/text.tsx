// Small text helpers shared by the looks. Strings are data.json's own; these only style them.
import React from "react";

export const plain = (s?: string | null) => (s ?? "").replace(/\*/g, "");

// *starred* words in the script's emphasis colour (a brand colour the look passes).
export const Rich: React.FC<{text?: string | null; acc: string}> = ({text, acc}) => <>{(text ?? "").split("*").map((p, i) =>
  i % 2 ? <span key={i} style={{color: acc}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;

// Rich text already wrapped into lines (by fit.ts on the plain string): the stars are re-applied by word position.
export const RichLines: React.FC<{text: string; lines: string[]; acc: string; lineHeight: number; style?: React.CSSProperties}> = ({text, lines, acc, lineHeight, style}) => {
  const words = text.split(/\s+/).filter(Boolean);
  let on = false, k = 0;
  const marked = words.map((w) => {
    const s = w.startsWith("*"), e = w.replace(/[.,;:!?)]+$/, "").endsWith("*");
    if (s) on = true;
    const hot = on;
    if (e) on = false;
    return {w: w.replace(/\*/g, ""), hot};
  });
  return <div style={style}>{lines.map((ln, i) => {
    const n = ln.split(/\s+/).filter(Boolean).length;
    const part = marked.slice(k, k + n); k += n;
    return <div key={i} style={{height: lineHeight, lineHeight: `${lineHeight}px`, whiteSpace: "pre"}}>
      {part.map((p, j) => <React.Fragment key={j}>{j ? " " : ""}{p.hot ? <span style={{color: acc}}>{p.w}</span> : p.w}</React.Fragment>)}
    </div>;
  })}</div>;
};
