// Layered Sankey for the global channel: data in the currency the company files in, flows checked before any render.
// One shape serves a single income statement (segments -> revenue -> profit) and a cross-company "follow the dollar"
// chain (buyer capex -> Nvidia -> TSMC -> ASML); columns are explicit, so the layout never guesses.

import {Beat, Meta, Money, Status, money, textW} from "./frame";

export type Kind = "rev" | "keep" | "spend" | "neutral";
// Status: verified = read off the filing; derived = arithmetic on filed lines; check = not yet read off the filing.
export type Side = "left" | "right" | "above" | "below";
export type SNode = {id: string; label: string; col: number; kind?: Kind; sub?: string[]; compact?: boolean; status?: Status; side?: Side};
export type SLink = {from: string; to: string; value: number};
export type Step = Beat & {cols?: number; focus?: string[]};
export type SankeyData = Meta & Money & {
  scale?: number;                        // px per filed unit; set the same value on peers to draw them to one scale
  nodes: SNode[]; links: SLink[]; steps?: Step[];
};

export const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);

export const flows = (D: SankeyData) => {
  const inn: Record<string, number> = {}, out: Record<string, number> = {};
  D.links.forEach((l) => { out[l.from] = (out[l.from] || 0) + l.value; inn[l.to] = (inn[l.to] || 0) + l.value; });
  const v: Record<string, number> = {};
  D.nodes.forEach((n) => { v[n.id] = Math.max(inn[n.id] || 0, out[n.id] || 0); });
  return {inn, out, v};
};

// Every way a chart like the TSMC infographic goes wrong: a node that leaks, a link to nowhere, a flow running backwards.
export const checkSankey = (D: SankeyData): string[] => {
  const err: string[] = [], tol = D.tol ?? 0.05, ids = new Set(D.nodes.map((n) => n.id));
  const col: Record<string, number> = Object.fromEntries(D.nodes.map((n) => [n.id, n.col]));
  if (ids.size !== D.nodes.length) err.push("duplicate node ids");
  D.links.forEach((l) => {
    if (!ids.has(l.from) || !ids.has(l.to)) err.push(`link ${l.from} -> ${l.to}: unknown node`);
    else if (col[l.to] <= col[l.from]) err.push(`link ${l.from} -> ${l.to}: must run to a later column`);
    if (!(l.value > 0)) err.push(`link ${l.from} -> ${l.to}: value must be positive`);
  });
  const {inn, out} = flows(D);
  D.nodes.forEach((n) => {
    const i = inn[n.id] || 0, o = out[n.id] || 0;
    if (!i && !o) err.push(`${n.id}: no flows`);
    if (i && o && Math.abs(i - o) > tol) err.push(`${n.id}: in ${i.toFixed(3)} != out ${o.toFixed(3)} (gap ${(i - o).toFixed(3)} ${D.cur}${D.unit ?? ""})`);
  });
  return err;
};

export const assertSankey = (D: SankeyData) => {
  const e = checkSankey(D);
  if (e.length) throw new Error(`Sankey "${D.id}" does not reconcile:\n  ${e.join("\n  ")}`);
};

export const unchecked = (D: SankeyData) => D.nodes.filter((n) => (n.status ?? "check") === "check").map((n) => n.id);


// ---- layout ----
export const NODE_W = 22, GAP = 16, LINE = {label: 34, value: 38, small: 26};
export type Box = {x: number; y: number; w: number; h: number};
export type PNode = SNode & {v: number; x: number; y: number; h: number; side: Side; lb: number};
export type PLink = SLink & {sx: number; tx: number; sy: number; ty: number; w: number; kind: Kind};

// Compact labels (segments): the name, then value and share on one line.
const labelBlock = (D: SankeyData, n: SNode) => n.compact
  ? LINE.label + LINE.value - 6 + 4
  : LINE.label + LINE.value + (D.show ? LINE.small : 0) + LINE.small * (n.sub?.length ?? 0) + 6;

// Oswald is condensed, so textW (about 0.47 em per character) is a safe estimate for sizing the label gutters.
const labelW = (D: SankeyData, n: SNode) => Math.max(textW(n.label, 28), textW(money(D, 999.9), 34),
  n.compact ? textW(`${money(D, 999.9)} · ${n.sub?.[0] ?? ""}`, 27) : 0, ...(n.sub ?? []).map((t) => textW(t, 21)));

export const layout = (D: SankeyData, box: Box) => {
  const {v} = flows(D), ncol = Math.max(...D.nodes.map((n) => n.col)) + 1;
  const padL = Math.max(120, ...D.nodes.filter((n) => n.col === 0).map((n) => labelW(D, n) + 24));
  const padR = Math.max(120, ...D.nodes.filter((n) => n.col === ncol - 1).map((n) => labelW(D, n) + 24));
  const cols = Array.from({length: ncol}, (_, c) => D.nodes.filter((n) => n.col === c));
  const side = (n: SNode, i: number): Side =>
    n.side ?? (n.col === 0 ? "left" : n.col === ncol - 1 ? "right" : i === 0 ? "above" : "below");
  const slot = (n: SNode, i: number, k: number) => {
    const h = v[n.id] * k, lb = labelBlock(D, n);
    return side(n, i) === "left" || side(n, i) === "right" ? Math.max(h, lb) : h + lb;
  };
  const colH = (k: number) => cols.map((ns) => sum(ns.map((n, i) => slot(n, i, k))) + GAP * Math.max(0, ns.length - 1));
  let k = D.scale ?? box.h / Math.max(...cols.map((ns) => sum(ns.map((n) => v[n.id])))) * 0.9;
  if (!D.scale) for (let t = 0; t < 60 && Math.max(...colH(k)) > box.h; t++) k *= 0.96;
  const x0 = box.x + padL, x1 = box.x + box.w - padR - NODE_W, hs = colH(k);
  const P: Record<string, PNode> = {};
  cols.forEach((ns, c) => {
    let y = box.y + (box.h - hs[c]) / 2;
    const x = ncol === 1 ? x0 : x0 + (x1 - x0) * c / (ncol - 1);
    ns.forEach((n, i) => {
      const h = v[n.id] * k, sd = side(n, i), lb = labelBlock(D, n), sl = slot(n, i, k);
      const ny = sd === "above" ? y + lb : sd === "below" ? y : y + (sl - h) / 2;
      P[n.id] = {...n, v: v[n.id], x, y: ny, h, side: sd, lb};
      y += sl + GAP;
    });
  });
  // Stack each node's links in the order of the nodes they connect to, so ribbons do not cross needlessly.
  const outOff: Record<string, number> = {}, inOff: Record<string, number> = {};
  const links: PLink[] = [];
  const bySrc = [...D.links].sort((a, b) => P[a.from].y - P[b.from].y || P[a.to].y - P[b.to].y);
  const order = [...D.links].sort((a, b) => P[a.to].y - P[b.to].y);
  const sy: Map<SLink, number> = new Map(), ty: Map<SLink, number> = new Map();
  order.forEach((l) => { sy.set(l, P[l.from].y + (outOff[l.from] || 0)); outOff[l.from] = (outOff[l.from] || 0) + l.value * k; });
  bySrc.forEach((l) => { ty.set(l, P[l.to].y + (inOff[l.to] || 0)); inOff[l.to] = (inOff[l.to] || 0) + l.value * k; });
  D.links.forEach((l) => links.push({...l, sx: P[l.from].x + NODE_W, tx: P[l.to].x, sy: sy.get(l)!, ty: ty.get(l)!, w: l.value * k,
    kind: P[l.from].col === 0 ? (P[l.from].kind ?? "rev") : (P[l.to].kind ?? "neutral")}));
  return {nodes: Object.values(P), links, k, ncol};
};

export const ribbon = (l: PLink) => {
  const mx = (l.sx + l.tx) / 2;
  return `M ${l.sx} ${l.sy} C ${mx} ${l.sy}, ${mx} ${l.ty}, ${l.tx} ${l.ty} L ${l.tx} ${l.ty + l.w} C ${mx} ${l.ty + l.w}, ${mx} ${l.sy + l.w}, ${l.sx} ${l.sy + l.w} Z`;
};
