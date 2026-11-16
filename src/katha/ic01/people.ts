// The Ramayana figures for IC-01 (16 Nov 2026), Lamplight look. Rule 5: no face is ever drawn; the head is a profile in
// shadow. Rama and Lakshmana in exile: matted hair tied up in a knot (jata), bark cloth (valkala) to the knee, a quiver on
// the back; Rama carries the great bow upright, Lakshmana his bow slung across the back. Sita: the sari, its pallu over the
// shoulder and hanging behind, the long braid. All face right and stand on y = 0, ~400 units tall (Sita ~380).
//
// Colour (AK, 16 Nov 2026: "why can't we add colours to the figures?"): a backlit figure is not black. Its clothes keep
// their hue on the shadow side, only darker. So each figure is drawn as one dark rimmed outline (the Lamplight read, and
// the rim of light) with flat colour layers on top: skin tone, costume, hair, gold. The colours stay low in value so the
// shape and the rim still lead; costume layers take a gradient from the light side (CostumeDefs) so they have form.
// The faces stay in shadow: colour goes on cloth, ornament and skin tone only, never on features.
//
// Walking: the legs come from the gait solver of the vendored line-art library (lineart/vendor/gait.ts): the planted
// foot stays still on the ground, the hip rises over each step and dips at double support, the swinging foot peels off
// its toe. `dist` is how far the figure has walked, in its own units (scene px / scale); `still` stands.
import React from "react";
import type {Item} from "../sil";
import {smooth, ribbon, sampleCubics, Pt} from "../geom";
import {mixHex} from "../look";
import {gait} from "../lineart/vendor/gait";

export type Look = {skin: string; cloth: string; cloth2: string; scarf: string; hair: string; gold: string; wood: string};
// Traditional cues, kept dark: Rama's skin the deep blue-black of shyama, his scarf the yellow of pitambara; Lakshmana in
// bark cloth with a maroon scarf; Sita in a red sari with a gold border.
// Hanuman: a dark warm rust (the vermilion of temple worship, sunk into shadow), a saffron-red short dhoti, a gold mace.
export const LOOKS: Record<"rama" | "lakshmana" | "sita" | "hanuman", Look> = {
  rama: {skin: "#1C1E3C", cloth: "#8B5A2B", cloth2: "#6E4422", scarf: "#B8862F", hair: "#120A16", gold: "#D9A441", wood: "#3A2418"},
  lakshmana: {skin: "#2A1A22", cloth: "#7E5630", cloth2: "#5F3F22", scarf: "#6E2430", hair: "#120A16", gold: "#D9A441", wood: "#3A2418"},
  sita: {skin: "#2B1A22", cloth: "#A3262C", cloth2: "#7A1C26", scarf: "#A3262C", hair: "#120A16", gold: "#D9A441", wood: "#3A2418"},
  hanuman: {skin: "#3E1E18", cloth: "#9A3A1C", cloth2: "#6E2A16", scarf: "#B8862F", hair: "#1E0E10", gold: "#D9A441", wood: "#5A3A16"},
};
const MACE = "#9A6A26";                            // Hanuman's mace: an old, dark gold, so only its lit edge shines
const gid = (c: string, lx: number) => `cg${c.replace("#", "")}${lx < 0 ? "L" : "R"}`;
// The costume gradients for one shot: light side warm and a little brighter, far side sinking into the silhouette.
export const CostumeDefs: React.FC<{light: [number, number]; rim?: string}> = ({light, rim = "#FFD38A"}) => {
  const cs = new Set<string>();
  Object.values(LOOKS).forEach((L) => [L.cloth, L.cloth2, L.scarf, MACE].forEach((c) => cs.add(c)));
  const left = light[0] < 0;
  return React.createElement("defs", null, [...cs].map((c) => React.createElement("linearGradient", {key: c, id: gid(c, light[0]), x1: left ? 0 : 1, x2: left ? 1 : 0, y1: 0, y2: 0},
    React.createElement("stop", {offset: 0, stopColor: mixHex(c, rim, 0.22)}),
    React.createElement("stop", {offset: 0.32, stopColor: c}),
    React.createElement("stop", {offset: 1, stopColor: mixHex(c, "#160C1E", 0.62)}))));
};
const cloth = (c: string, light: [number, number]) => `url(#${gid(c, light[0])})`;

const HEAD: number[][] = [[-6, -402], [10, -400], [20, -392], [23, -381], [22, -373], [27, -364], [23, -360], [24, -355], [22, -351], [23, -347], [18, -341], [8, -337], [-4, -341], [-16, -350], [-24, -364], [-26, -380], [-20, -394]];
const pts = (a: number[][], dx = 0, dy = 0, s = 1): Pt[] => a.map(([x, y]) => [x * s + dx, y * s + dy] as Pt);
const circle = (x: number, y: number, r: number) => `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
// a limb from p0: `l1` along angle a1 (0 = straight down, + = forward), then `l2` along a2
const limb = (p0: [number, number], l1: number, a1: number, l2: number, a2: number) => {
  const k: [number, number] = [p0[0] + Math.sin(a1) * l1, p0[1] + Math.cos(a1) * l1];
  const e: [number, number] = [k[0] + Math.sin(a2) * l2, k[1] + Math.cos(a2) * l2];
  return {k, e, line: [p0, [(p0[0] + k[0]) / 2, (p0[1] + k[1]) / 2], k, [(k[0] + e[0]) / 2, (k[1] + e[1]) / 2], e] as number[][]};
};
const through = (a: number[], b: number[], c: number[]) => [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b, [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2], c];
// a bare foot at the ankle, pitched toe-down by `pitch` degrees (the heel peeling off before the swing)
const foot = (e: number[], pitch = 0): string => {
  const r = (pitch * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return smooth(([[-7, 0], [4, -3], [22, 2], [30, 7], [26, 10], [-6, 10]] as number[][]).map(([x, y]) => [e[0] + x * c - y * s, e[1] + x * s + y * c] as Pt));
};
// cloth hanging from p0 down the back, its end lifting a little in the wind
const drape = (p0: number[], len: number, w0: number, w1: number, ph: number, wind: number): string => {
  const q: number[][] = [];
  for (let i = 0; i <= 10; i++) { const u = i / 10; q.push([p0[0] - (len * 0.22 * u + (6 + wind * 10) * u * u + Math.sin(ph + u * 3.2) * 4 * u), p0[1] + len * u * (1 - 0.12 * u)]); }
  return ribbon(q, w0, w1, 1);
};

// The gait, in this file's units: the library's figure is ~95 units tall with its feet on y = 120 and its hip over x = 40;
// ours is 400 tall on y = 0, so K maps one to the other.
const K = 4.4;
const MEN = gait({kind: "walk", stride: 26}), WOMAN = gait({kind: "shuffle", stride: 19});
const legs = (g: ReturnType<typeof gait>, dist: number, still: boolean) => {
  const phase = (dist / K) / (g.stride / g.duty);           // cycles walked (one cycle = stride / duty along the ground)
  const p = g.pose(phase, still ? 0 : 1);
  const M = (v: number[]) => [(v[0] - 40) * K, (v[1] - 120) * K];
  const hip = M(p.hip);
  const ft = p.feet.map((f) => ({ankle: M(f.ankle), knee: M(f.knee), pitch: f.pitch}));
  const swing = (ft[0].ankle[0] - ft[1].ankle[0]) / (g.stride * K);   // + when the near foot is ahead
  return {hip, near: ft[0], far: ft[1], dy: hip[1] + 206, swing};
};

type Opt = {dist?: number; still?: boolean; w?: number; t?: number; light?: [number, number]};

// Rama or Lakshmana. who: "rama" (bow upright in the near hand) | "lakshmana" (bow slung across the back).
export const ascetic = (who: "rama" | "lakshmana", {dist = 0, still = false, w = 0, t = 0, light = [-1, -0.2]}: Opt = {}): Item[] => {
  const L = LOOKS[who];
  const back: string[] = [], body: string[] = [], dress: string[] = [], hair: string[] = [], scarf: string[] = [], gold: string[] = [], wood: string[] = [];
  const G = legs(MEN, dist, still), dy = G.dy, U = (a: number[][], dx = 0) => pts(a, dx, dy);
  const hip = G.hip, sh = [0, -318 + dy];
  const armSw = still ? 0.04 : -G.swing * 0.55;
  // the far leg and the far arm, behind the body
  back.push(ribbon(through(hip, G.far.knee, G.far.ankle), 32, 15, 1), foot(G.far.ankle, G.far.pitch));
  const fa = limb([-8, sh[1]], 84, -armSw + 0.05, 78, -armSw * 0.6 + 0.18);
  back.push(ribbon(fa.line, 24, 14, 1), smooth(pts([[-7, 0], [7, -2], [9, 12], [0, 20], [-8, 10]], fa.e[0], fa.e[1])));
  // the near leg, head, jata, neck, torso
  body.push(ribbon(through(hip, G.near.knee, G.near.ankle), 34, 15, 1), foot(G.near.ankle, G.near.pitch));
  body.push(smooth(U(HEAD)));
  const knot = smooth(U([[-16, -398], [-18, -410], [-10, -419], [2, -418], [7, -409], [2, -399]]));
  body.push(knot); hair.push(knot);
  hair.push(smooth(U([[-6, -402], [-20, -394], [-26, -380], [-24, -364], [-16, -350], [-12, -356], [-14, -372], [-8, -390]])));
  body.push(smooth(U([[-10, -346], [10, -342], [9, -318], [-12, -320]])));
  body.push(smooth(U([[-44, -324], [-18, -336], [14, -336], [38, -324], [40, -296], [32, -264], [25, -236], [23, -212], [-23, -212], [-27, -240], [-36, -268], [-46, -296]])));
  // the valkala to the knee, an uneven bark hem swinging with the near knee
  const sw = still ? 0 : (G.near.knee[0] - 0) * 0.08;
  const hem: number[][] = [];
  for (let i = 0; i <= 9; i++) { const u = i / 9; hem.push([38 + sw - u * (74 + sw * 0.4), -112 + (i % 2 ? 6 : 0) + Math.sin(i * 1.7) * 3]); }
  const valkala = smooth([...U([[-26, -226], [24, -226], [32, -190], [36, -150]]), ...U(hem), ...U([[-34, -150], [-32, -192]])]);
  body.push(valkala); dress.push(valkala);
  // a cord of bark cloth across the chest (the darker cloth)
  const cord = ribbon(U([[-40, -318], [-14, -290], [10, -258], [26, -228]]), 9, 9, 1);
  // the quiver across the back, its arrows fletched above the shoulder
  const quiver = smooth(U([[-50, -206], [-40, -212], [-10, -338], [-22, -342]]));
  body.push(quiver); wood.push(quiver);
  for (let k = 0; k < 4; k++) body.push(ribbon(sampleCubics(U([[-14 + k * 3, -338 - k * 2], [-16 + k * 3, -350 - k * 2], [-18 + k * 4, -362 - k * 3], [-20 + k * 4, -374 - k * 3]]), 4), 6, 2, 1));
  // the near arm; an armlet and a bracelet catch the light
  if (who === "rama") {
    const na = limb([22, sh[1]], 80, 0.25, 64, 1.05); body.push(ribbon(na.line, 26, 16, 1));
    const g = [na.e[0] + 6, na.e[1]];
    body.push(smooth(pts([[-8, -10], [8, -12], [12, 4], [4, 12], [-8, 8]], g[0], g[1])));
    const top = [g[0] + 26, g[1] - 250], bot = [g[0] + 6, g[1] + 210];
    const bow = ribbon(sampleCubics([top, [g[0] + 2, g[1] - 200], [g[0] - 18, g[1] - 90], g, [g[0] + 18, g[1] + 80], [g[0] + 4, g[1] + 160], bot], 14), 7, 7, 1);
    body.push(bow, `M ${top[0]} ${top[1]} L ${bot[0]} ${bot[1]} L ${bot[0] + 1.6} ${bot[1]} L ${top[0] + 1.6} ${top[1]} Z`); wood.push(bow);
    gold.push(circle(top[0], top[1], 5), circle(bot[0], bot[1], 5));                       // the bow's gilded tips
    const ua = [(na.line[1][0]), na.line[1][1]];
    gold.push(ribbon([[ua[0] - 12, ua[1] - 4], [ua[0] + 12, ua[1] + 4]], 6, 6, 1), ribbon([[g[0] - 12, g[1] - 14], [g[0] - 2, g[1] - 16]], 5, 5, 1));
  } else {
    const b0 = [-70, -140 + dy], b1 = [30, -428 + dy];
    back.push(ribbon(sampleCubics([b0, [-48, -220 + dy], [-34, -310 + dy], [-12, -380 + dy], b1], 14), 6.5, 6.5, 1));
    back.push(`M ${b0[0]} ${b0[1]} L ${b1[0]} ${b1[1]} L ${b1[0] + 1.6} ${b1[1]} L ${b0[0] + 1.6} ${b0[1]} Z`);
    const na = limb([20, sh[1]], 84, armSw + 0.05, 78, armSw * 0.6 + 0.2);
    body.push(ribbon(na.line, 26, 15, 1), smooth(pts([[-7, 0], [7, -2], [9, 12], [0, 20], [-8, 10]], na.e[0], na.e[1])));
    const ua = na.line[1];
    gold.push(ribbon([[ua[0] - 12, ua[1] - 2], [ua[0] + 12, ua[1] + 2]], 6, 6, 1));
  }
  // the scarf hanging from the shoulder
  const sc = drape([-34, -322 + dy], 120, 14, 6, t * 0.08 + (who === "rama" ? 0 : 1.3), w);
  body.push(sc); scarf.push(sc);
  return [
    {d: back.join(" "), fill: mixHex(L.skin, "#160C1E", 0.35)},
    {d: body.join(" "), fill: L.skin},                                     // the rimmed silhouette, in the skin's dark tone
    {d: dress.join(" "), fill: cloth(L.cloth, light), rim: false},
    {d: cord, fill: L.cloth2, rim: false},
    {d: scarf.join(" "), fill: cloth(L.scarf, light), rim: false},
    {d: wood.join(" "), fill: L.wood, rim: false},
    {d: hair.join(" "), fill: L.hair, rim: false},
    {d: gold.join(" "), fill: L.gold, rim: false},
  ];
};

// Sita walking (or standing): the sari with a gold border, the pallu over the near shoulder hanging behind, the braid.
export const sita = ({dist = 0, still = false, w = 0, t = 0, light = [-1, -0.2]}: Opt = {}): Item[] => {
  const L = LOOKS.sita;
  const back: string[] = [], body: string[] = [], sari: string[] = [], blouse: string[] = [], hair: string[] = [], gold: string[] = [];
  const s = 0.95, G = legs(WOMAN, dist, still), bob = G.dy * s;
  const S = (a: number[][], dx = 0) => pts(a.map(([x, y]) => [x * s, y * s]), dx, bob);
  const armSw = still ? 0.03 : -G.swing * 0.4;
  const fa = limb([-6 * s, -316 * s + bob], 78 * s, -armSw + 0.08, 72 * s, -armSw * 0.5 + 0.22);
  back.push(ribbon(fa.line, 19, 11, 1));
  // the braid down the back, swinging a little
  const bsw = still ? Math.sin(t * 0.05) * 2 : G.swing * 6;
  const braid = ribbon(sampleCubics([[-20 * s, -372 * s + bob], [-34 * s, -330 * s + bob], [-36 * s + bsw, -270 * s + bob], [-30 * s + bsw * 1.4, -214 * s + bob]], 12), 15, 5, 1);
  back.push(braid);
  // feet below the hem (the legs stay inside the sari)
  const fN = G.near.ankle.map((v) => v * s), fF = G.far.ankle.map((v) => v * s);
  back.push(foot([fF[0], fF[1] + 4], G.far.pitch));
  body.push(foot([fN[0], fN[1] + 4], G.near.pitch));
  // head, the low knot, the neck, the blouse
  body.push(smooth(S(HEAD.map(([x, y]) => [x === 27 ? 23 : x, y]))));
  const knot = smooth(S([[-22, -392], [-34, -384], [-36, -366], [-24, -360], [-14, -372]]));
  body.push(knot); hair.push(knot, smooth(S([[-6, -402], [-20, -394], [-26, -380], [-24, -364], [-16, -352], [-12, -360], [-14, -374], [-8, -392]])));
  body.push(smooth(S([[-9, -346], [9, -342], [8, -320], [-11, -322]])));
  const torso = smooth(S([[-30, -324], [-12, -332], [10, -332], [28, -322], [30, -298], [24, -266], [18, -240], [17, -220], [-19, -220], [-22, -244], [-27, -272], [-33, -300]]));
  body.push(torso); blouse.push(smooth(S([[-30, -324], [-12, -332], [10, -332], [28, -322], [30, -298], [26, -280], [-28, -280], [-33, -300]])));
  // the sari from the waist to the ankles, its hem following the feet
  const mx = (fN[0] + fF[0]) / 2 / s;
  const skirt = smooth(S([[-22, -232], [20, -232], [28, -186], [36, -120], [42 + mx * 0.3, -52], [46 + mx * 0.6, -12], [46 + mx * 0.6, -4], [-42 + mx * 0.5, -4], [-42 + mx * 0.4, -12], [-38, -70], [-32, -140], [-26, -196]]));
  body.push(skirt); sari.push(skirt);
  gold.push(ribbon(S([[-42 + mx * 0.45, -10], [0 + mx * 0.5, -9], [44 + mx * 0.6, -9]]), 7, 7, 1));        // the gold border
  // the near arm, bangles at the wrist
  const na = limb([16 * s, -318 * s + bob], 76 * s, armSw + 0.12, 70 * s, armSw * 0.5 + 0.35);
  body.push(ribbon(na.line, 19, 11, 1), smooth(pts([[-6, 0], [6, -2], [8, 10], [0, 16], [-7, 8]], na.e[0], na.e[1])));
  const wr = na.line[3];
  gold.push(ribbon([[wr[0] - 9, wr[1] + 6], [wr[0] + 9, wr[1] + 2]], 5, 5, 1), ribbon([[wr[0] - 9, wr[1] + 13], [wr[0] + 9, wr[1] + 9]], 4, 4, 1));
  // the pallu over the near shoulder and across the back, its end hanging behind
  const pallu = smooth(S([[22, -330], [30, -316], [10, -290], [-20, -262], [-40, -250], [-44, -270], [-30, -300], [-6, -322]]));
  const end = drape([-38 * s, -262 * s + bob], 150, 30, 12, t * 0.07 + 0.6 + (still ? 0 : dist * 0.004), w);
  body.push(pallu, end); sari.push(pallu, end);
  gold.push(ribbon(S([[24, -328], [8, -296], [-22, -266], [-42, -254]]), 4, 4, 1));                         // the pallu's border
  return [
    {d: back.join(" "), fill: mixHex(L.skin, "#160C1E", 0.35)},
    {d: body.join(" "), fill: L.skin},
    {d: blouse.join(" "), fill: L.cloth2, rim: false},
    {d: sari.join(" "), fill: cloth(L.cloth, light), rim: false},
    {d: hair.join(" "), fill: L.hair, rim: false},
    {d: gold.join(" "), fill: L.gold, rim: false},
  ];
};

// Hanuman, walking or standing: known by the tail and the mace (rule 5's attribute, AK 25 Oct 2026). The head is a profile
// in shadow with the vanara's muzzle and strong jaw (hanu): a shape, like the men's nose, never an eye or a mouth. Broad
// chest, a saffron-red short dhoti with a gold waistband, the mace resting on the near shoulder, its head behind the back,
// the tail rising in an S behind him and curling at the tip; it sways with the walk. mace: false leaves his hands empty.
// AK, 16 Nov 2026: he keeps the mace in Lamplight too (the source-text look), as his rule-5 attribute.
export const hanuman = ({dist = 0, still = false, w = 0, t = 0, light = [-1, -0.2], mace = true}: Opt & {mace?: boolean} = {}): Item[] => {
  const L = LOOKS.hanuman;
  const back: string[] = [], body: string[] = [], dress: string[] = [], sash: string[] = [], gold: string[] = [], macep: string[] = [], ribs: string[] = [];
  const G = legs(MEN, dist, still), dy = G.dy, U = (a: number[][], dx = 0) => pts(a, dx, dy);
  const hip = G.hip, sh = -318 + dy;
  const armSw = still ? 0.04 : -G.swing * 0.6;
  // the tail first, behind everything: from the base of the spine back and up in an S, the tip curling over
  const sway = Math.sin(t * 0.05) * 6 + (still ? 0 : G.swing * 10) + w * 8;
  const tc = sampleCubics(U([[-22, -214], [-72, -204], [-116, -238], [-122, -300], [-128, -362], [-100, -424], [-66 + sway * 0.6, -432], [-42 + sway, -436], [-30 + sway, -420], [-42 + sway, -408]]), 16);
  back.push(ribbon(tc, 16, 6, 1));
  // the far leg and the far arm (swinging, empty)
  back.push(ribbon(through(hip, G.far.knee, G.far.ankle), 36, 16, 1), foot(G.far.ankle, G.far.pitch));
  const fa = limb([-10, sh], 84, -armSw + 0.05, 76, -armSw * 0.6 + 0.2);
  back.push(ribbon(fa.line, 28, 16, 1), smooth(pts([[-8, 0], [8, -2], [10, 13], [0, 22], [-9, 11]], fa.e[0], fa.e[1])));
  // the near leg, the head (muzzle and jaw in profile), the neck, the broad torso
  body.push(ribbon(through(hip, G.near.knee, G.near.ankle), 38, 16, 1), foot(G.near.ankle, G.near.pitch));
  body.push(smooth(U([[-4, -404], [10, -402], [20, -395], [24, -386], [27, -379], [25, -375], [31, -369], [38, -363], [41, -355], [37, -347], [29, -344], [27, -337], [17, -332], [4, -334], [-8, -340], [-18, -350], [-24, -362], [-27, -378], [-22, -394]])));
  body.push(smooth(U([[-13, -346], [12, -340], [12, -316], [-15, -318]])));
  body.push(smooth(U([[-52, -326], [-22, -342], [16, -342], [44, -330], [51, -302], [42, -268], [31, -238], [28, -212], [-28, -212], [-31, -240], [-42, -270], [-54, -300]])));
  gold.push(circle(-22, -356 + dy, 3.5));                                               // an earring's glint (no ear drawn: a rimmed ear reads as an eye)
  // the short dhoti to above the knee, its hem swinging with the near knee, a pleat falling in front, a gold waistband
  const sw = still ? 0 : G.near.knee[0] * 0.08;
  const dhoti = smooth([...U([[-30, -228], [30, -228], [38, -192]]), ...U([[42 + sw, -150], [10 + sw * 0.5, -146], [-24, -150], [-40, -154]]), ...U([[-36, -194]])]);
  body.push(dhoti); dress.push(dhoti);
  const pleat = ribbon(U([[14, -222], [18 + sw * 0.4, -186], [22 + sw * 0.8, -140], [24 + sw, -126]]), 16, 11, 1);
  body.push(pleat); sash.push(pleat);
  gold.push(ribbon(U([[-30, -226], [0, -228], [30, -226]]), 8, 8, 1));
  // the near arm: elbow down, the fist up in front of the chest, holding the mace on the shoulder
  const na = mace ? limb([22, sh], 78, 0.15, 66, 2.2) : limb([22, sh], 84, armSw + 0.05, 76, armSw * 0.6 + 0.2);
  body.push(ribbon(na.line, 30, 18, 1));
  const fist = mace ? [na.e[0] + 2, na.e[1] - 2] : na.e;
  body.push(smooth(pts([[-10, -10], [9, -12], [13, 4], [4, 13], [-9, 9]], fist[0], fist[1])));
  const ua = na.line[1], wr = na.line[3];
  gold.push(ribbon([[ua[0] - 14, ua[1] - 4], [ua[0] + 14, ua[1] + 4]], 7, 7, 1), ribbon([[wr[0] - 10, wr[1] + 8], [wr[0] + 10, wr[1] - 2]], 6, 6, 1));
  if (mace) {
    // the shaft from below the fist, over the near shoulder (under the jaw), to the head behind the back
    const head: [number, number] = [-72, -336 + dy], R = 26, v = [head[0] - fist[0], head[1] - fist[1]];
    const pom = [fist[0] - v[0] * 0.13, fist[1] - v[1] * 0.13];
    const shaft = ribbon([pom, fist, [fist[0] + v[0] * 0.5, fist[1] + v[1] * 0.5], head], 10, 12, 1);
    const ball = circle(head[0], head[1], R), spike = smooth(pts([[-6, 0], [0, -14], [6, 0]], head[0] - R * 0.7, head[1] - R * 0.7));
    body.push(shaft, ball, spike, circle(pom[0], pom[1], 7)); macep.push(shaft, ball, spike, circle(pom[0], pom[1], 7));
    // the ridges of the mace's head: meridians from crown to base, like the lobes of a melon
    for (const k of [-0.62, 0, 0.62]) {
      const q: number[][] = [];
      for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI; q.push([head[0] + k * R * Math.cos(a), head[1] + R * 0.94 * Math.sin(a)]); }
      ribs.push(ribbon(q, 2.6, 2.6, 1));
    }
  }
  return [
    {d: back.join(" "), fill: mixHex(L.skin, "#160C1E", 0.35)},
    {d: body.join(" "), fill: L.skin},
    {d: dress.join(" "), fill: cloth(L.cloth, light), rim: false},
    {d: sash.join(" "), fill: L.cloth2, rim: false},
    {d: macep.join(" "), fill: cloth(MACE, light), rim: false},
    {d: ribs.join(" "), fill: "#3A2410", rim: false},
    {d: gold.join(" "), fill: L.gold, rim: false},
  ];
};
