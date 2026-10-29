// Dev sheet for the prop icons: renders ICONS in a grid. Bundle with
//   npx remotion bundle src/looks/cartoon/long/dev/icons_entry.ts --out-dir=/tmp/long_icons
// and render stills with props {"spec": {"s": 1, "cols": 6, "bg": "sky", "box": true, "page": 0, "per": 12}, "dur": 300}.
// spec: s (icon scale), cols, bg ("sky" | "royal" | "wall" | "white"), box (draw the 120 x 120 guide), page + per (which icons), names (explicit list), seeds (seed per icon index).
import React from "react";
import {registerRoot} from "remotion";
import {makeRoot} from "./devRoot";
import {Icon, ICONS} from "../icons";
import {C} from "../../palette";
import type {SceneProps} from "../contract";

const h = React.createElement;
const BG: Record<string, string> = {sky: C.sky, royal: C.royal, wall: C.wall, white: "#FFFFFF", ink: C.ink};

const Sheet: React.FC<SceneProps> = ({f, spec}) => {
  const {s = 1, cols = 6, page = 0, per = 12, bg = "sky", box = false, names = null, gap = 1.45} = spec ?? {};
  const items: string[] = (names ?? ICONS).slice(page * per, (page + 1) * per);
  const cell = 120 * s * gap, rows = Math.ceil(items.length / cols);
  const x0 = (1920 - cols * cell) / 2 + cell / 2, y0 = (1080 - rows * cell) / 2 + cell / 2;
  return h("svg", {width: 1920, height: 1080, style: {position: "absolute", left: 0, top: 0}},
    h("rect", {width: 1920, height: 1080, fill: BG[bg] ?? bg}),
    items.map((n, i) => {
      const x = x0 + (i % cols) * cell, y = y0 + Math.floor(i / cols) * cell;
      return h("g", {key: n + i},
        box ? h("rect", {x: x - 60 * s, y: y - 60 * s, width: 120 * s, height: 120 * s, fill: "none", stroke: "#E03A3E", strokeWidth: 1.5, strokeDasharray: "6 6"}) : null,
        h(Icon as any, {name: n, x, y, s, f, shadow: !!spec?.shadow, seed: spec?.seeds?.[i] ?? 0}));
    }));
};
registerRoot(makeRoot(Sheet as any));
