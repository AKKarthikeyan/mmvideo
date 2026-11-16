// The Ramayana figures for IC-01 as silhouettes (16 Nov 2026). Rule 5: no face is ever drawn; each is known by outline
// alone. Rama and Lakshmana in exile: matted hair tied up in a knot (jata), bark cloth (valkala) to the knee, a quiver
// on the back; Rama carries the great bow upright, Lakshmana his bow slung across the back. Sita: the sari with its pallu
// over the shoulder and streaming behind, the long braid. All face right and stand on y = 0, ~400 units tall (Sita ~380).
// walk(ph): the stride phase in radians (0 = mid-stride); `still` stands. Returns Rimmed items; the whole figure is
// lifted or lowered (item transform) so the planted foot always touches the ground.
import type {Item} from "../sil";
import {smooth, ribbon, sampleCubics, Pt} from "../geom";

const HEAD: number[][] = [[-6, -402], [10, -400], [20, -392], [23, -381], [22, -373], [27, -364], [23, -360], [24, -355], [22, -351], [23, -347], [18, -341], [8, -337], [-4, -341], [-16, -350], [-24, -364], [-26, -380], [-20, -394]];
const pts = (a: number[][], dx = 0, dy = 0, s = 1): Pt[] => a.map(([x, y]) => [x * s + dx, y * s + dy] as Pt);
const deg = Math.PI / 180;
// a limb: from p0, `l1` along angle a1 (0 = straight down, + = forward / right), then `l2` along a2
const limb = (p0: [number, number], l1: number, a1: number, l2: number, a2: number) => {
  const k: [number, number] = [p0[0] + Math.sin(a1) * l1, p0[1] + Math.cos(a1) * l1];
  const e: [number, number] = [k[0] + Math.sin(a2) * l2, k[1] + Math.cos(a2) * l2];
  return {k, e, line: [p0, [(p0[0] + k[0]) / 2, (p0[1] + k[1]) / 2], k, [(k[0] + e[0]) / 2, (k[1] + e[1]) / 2], e] as number[][]};
};
// the stride: thigh swing and knee bend for a leg at phase p
const legAt = (p: number, amp = 0.36) => {
  const th = Math.sin(p) * amp;                       // the thigh swings forward and back
  const kb = Math.max(0, Math.cos(p)) * 0.55 + 0.04;   // the knee bends while the leg swings through (cos > 0: moving forward)
  return {th, sh: th - kb};
};
const foot = (e: [number, number], s = 1): string => smooth(pts([[-6, -6], [4, -9], [22, -5], [30, 0, ], [26, 3, ], [-6, 3]], e[0], e[1], s));
const reach = (L: {th: number; sh: number}, l1: number, l2: number) => Math.cos(L.th) * l1 + Math.cos(L.sh) * l2;

// cloth hanging from p0 down the back, its end lifting a little in the wind (never a flat streamer: that reads as an arm)
const drape = (p0: [number, number], len: number, w0: number, w1: number, ph: number, wind: number, back = 1): string => {
  const q: number[][] = [];
  for (let i = 0; i <= 10; i++) { const u = i / 10; q.push([p0[0] - back * (len * 0.22 * u + (6 + wind * 10) * u * u + Math.sin(ph + u * 3.2) * 4 * u), p0[1] + len * u * (1 - 0.12 * u)]); }
  return ribbon(q, w0, w1, 1);
};
type Opt = {ph?: number; still?: boolean; w?: number; t?: number};

// Rama or Lakshmana. who: "rama" (bow upright in the near hand) | "lakshmana" (bow slung across the back).
export const ascetic = (who: "rama" | "lakshmana", {ph = 0, still = false, w = 0, t = 0}: Opt = {}): Item[] => {
  const P: string[] = [], back: string[] = [];
  const hip: [number, number] = [0, -206], l1 = 98, l2 = 100;
  const A = still ? {th: 0.06, sh: 0.02} : legAt(ph), B = still ? {th: -0.06, sh: -0.08} : legAt(ph + Math.PI);
  const dy = l1 + l2 - Math.max(reach(A, l1, l2), reach(B, l1, l2));   // lower the body onto the planted foot
  // the far leg and far arm first (behind the body)
  const lb = limb(hip, l1, B.th, l2, B.sh); back.push(ribbon(lb.line, 32, 15, 1), foot(lb.e));
  const armSw = still ? 0.04 : -Math.sin(ph) * 0.3;
  const fa = limb([-8, -318], 84, -armSw + 0.05, 78, -armSw * 0.6 + 0.18); back.push(ribbon(fa.line, 24, 14, 1), smooth(pts([[-7, 0], [7, -2], [9, 12], [0, 20], [-8, 10]], fa.e[0], fa.e[1])));
  // the near leg
  const la = limb(hip, l1, A.th, l2, A.sh); P.push(ribbon(la.line, 34, 15, 1), foot(la.e));
  // head, the jata knot, the neck
  P.push(smooth(pts(HEAD)));
  P.push(smooth(pts([[-16, -398], [-18, -410], [-10, -419], [2, -418], [7, -409], [2, -399]])));
  P.push(smooth(pts([[-10, -346], [10, -342], [9, -318], [-12, -320]])));
  // torso, bare-chested; a cloth band across it
  P.push(smooth(pts([[-44, -324], [-18, -336], [14, -336], [38, -324], [40, -296], [32, -264], [25, -236], [23, -212], [-23, -212], [-27, -240], [-36, -268], [-46, -296]])));
  // the valkala to the knee, its hem uneven like bark cloth, swinging a little with the stride
  const sw = still ? 0 : Math.sin(ph) * 5;
  const hem: number[][] = [];
  for (let i = 0; i <= 9; i++) { const u = i / 9; hem.push([38 + sw - u * (74 + sw * 0.4), -112 + (i % 2 ? 6 : 0) + Math.sin(i * 1.7) * 3]); }
  P.push(smooth([...pts([[-26, -226], [24, -226], [32, -190], [36, -150]]), ...pts(hem), ...pts([[-34, -150], [-32, -192]])]));
  // the quiver across the back, its arrows fletched above the shoulder
  P.push(smooth(pts([[-50, -206], [-40, -212], [-10, -338], [-22, -342]])));
  for (let k = 0; k < 4; k++) P.push(ribbon(sampleCubics([[-14 + k * 3, -338 - k * 2], [-16 + k * 3, -350 - k * 2], [-18 + k * 4, -362 - k * 3], [-20 + k * 4, -374 - k * 3]], 4), 6, 2, 1));
  if (who === "rama") {
    // the near arm bent, the hand at the grip, the great bow upright (taller than the man) and its string
    const na = limb([22, -318], 80, 0.25, 64, 1.05); P.push(ribbon(na.line, 26, 16, 1));
    const g: [number, number] = [na.e[0] + 6, na.e[1]];
    P.push(smooth(pts([[-8, -10], [8, -12], [12, 4], [4, 12], [-8, 8]], g[0], g[1])));
    const top: number[] = [g[0] + 26, g[1] - 250], bot: number[] = [g[0] + 6, g[1] + 210];
    P.push(ribbon(sampleCubics([top, [g[0] + 2, g[1] - 200], [g[0] - 18, g[1] - 90], [g[0], g[1]], [g[0] + 18, g[1] + 80], [g[0] + 4, g[1] + 160], bot], 14), 7, 7, 1));
    P.push(`M ${top[0]} ${top[1]} L ${bot[0]} ${bot[1]} L ${bot[0] + 1.6} ${bot[1]} L ${top[0] + 1.6} ${top[1]} Z`);
  } else {
    // the bow slung across the back, from below the far hip to above the near shoulder; the near arm swings
    const b0: number[] = [-70, -140], b1: number[] = [30, -428];
    back.push(ribbon(sampleCubics([b0, [-48, -220], [-34, -310], [-12, -380], b1], 14), 6.5, 6.5, 1));
    back.push(`M ${b0[0]} ${b0[1]} L ${b1[0]} ${b1[1]} L ${b1[0] + 1.6} ${b1[1]} L ${b0[0] + 1.6} ${b0[1]} Z`);
    const na = limb([20, -318], 84, armSw + 0.05, 78, armSw * 0.6 + 0.2); P.push(ribbon(na.line, 26, 15, 1), smooth(pts([[-7, 0], [7, -2], [9, 12], [0, 20], [-8, 10]], na.e[0], na.e[1])));
  }
  // a scarf end at the shoulder, lifting in the wind
  P.push(drape([-34, -322], 120, 14, 6, t * 0.08 + (who === "rama" ? 0 : 1.3), w));
  const tr = `translate(0 ${dy.toFixed(1)})`;
  return [{d: back.join(" "), t: tr, fill: "#1E1228"}, {d: P.join(" "), t: tr}];
};

// Sita walking (or standing): the sari, the pallu over the near shoulder streaming back, the braid.
export const sita = ({ph = 0, still = false, w = 0, t = 0}: Opt = {}): Item[] => {
  const P: string[] = [], back: string[] = [];
  const s = 0.95, bob = still ? 0 : Math.abs(Math.cos(ph)) * 3;
  const S = (a: number[][], dx = 0, dy = 0) => pts(a.map(([x, y]) => [x * s, y * s]), dx, dy + bob);
  const armSw = still ? 0.03 : -Math.sin(ph) * 0.22;
  const fa = limb([-6 * s, -316 * s + bob], 78 * s, -armSw + 0.08, 72 * s, -armSw * 0.5 + 0.22); back.push(ribbon(fa.line, 19, 11, 1));
  // the braid falling down the back, swinging a little
  const bsw = still ? Math.sin(t * 0.05) * 2 : Math.sin(ph - 0.6) * 5;
  back.push(ribbon(sampleCubics([[-20 * s, -372 * s + bob], [-34 * s, -330 * s], [-36 * s + bsw, -270 * s], [-30 * s + bsw * 1.4, -214 * s]], 12), 15, 5, 1));
  // the head (a gentler profile), a low knot of hair, the neck
  P.push(smooth(S(HEAD.map(([x, y]) => [x === 27 ? 23 : x, y]))));
  P.push(smooth(S([[-22, -392], [-34, -384], [-36, -366], [-24, -360], [-14, -372]])));
  P.push(smooth(S([[-9, -346], [9, -342], [8, -320], [-11, -322]])));
  // the torso in the blouse, a narrow waist
  P.push(smooth(S([[-30, -324], [-12, -332], [10, -332], [28, -322], [30, -298], [24, -266], [18, -240], [17, -220], [-19, -220], [-22, -244], [-27, -272], [-33, -300]])));
  // the sari: from the waist, flaring to the ankles; the hem swings with the stride, the feet show at its edge
  const sw = still ? 0 : Math.sin(ph) * 9;
  P.push(smooth(S([[-22, -232], [20, -232], [28, -186], [36, -120], [44, -52], [50 + sw, -10], [52 + sw, -2, ], [-44 + sw * 0.6, -2], [-42 + sw * 0.4, -12], [-38, -70], [-32, -140], [-26, -196]])));
  const fx = still ? 0 : Math.sin(ph) * 16;
  P.push(smooth(S([[10 + fx, -8], [24 + fx, -10], [40 + fx, -4], [42 + fx, 0], [8 + fx, 0]])));
  // the pleats' front panel (a flat lighter fold)
  // the near arm, a little bent, swinging less than a man's stride
  const na = limb([16 * s, -318 * s + bob], 76 * s, armSw + 0.12, 70 * s, armSw * 0.5 + 0.35); P.push(ribbon(na.line, 19, 11, 1), smooth(pts([[-6, 0], [6, -2], [8, 10], [0, 16], [-7, 8]], na.e[0], na.e[1])));
  // the pallu: over the near shoulder, across the back, its end streaming behind in the wind
  P.push(smooth(S([[22, -330], [30, -316], [10, -290], [-20, -262], [-40, -250], [-44, -270], [-30, -300], [-6, -322]])));
  P.push(drape([-38 * s, -262 * s + bob], 150, 30, 12, t * 0.07 + 0.6 + (still ? 0 : ph * 0.5), w));
  return [{d: back.join(" "), fill: "#1E1228"}, {d: P.join(" ")}];
};
