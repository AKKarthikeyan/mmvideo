// Figures for the Gita film as silhouettes (21 Oct 2026). Pure functions that return lists of SVG path strings in local
// units, so the same code draws in Remotion (sil.tsx) and in the quick browser sketch (esbuild bundle). Rules: no face is
// ever drawn; Krishna is known by his crown, the peacock feather, the garland and the raised hand; Arjuna by his crown,
// the quiver and the Gandiva bow. All poses stand on y = 0 (the chariot floor); a standing figure is ~400 units tall.
import {smooth, ribbon, sampleCubics, streamer, Pt} from "./geom";

const pearls = (pts: number[][], r: number): string[] => pts.map(([x, y]) => `M ${x + r} ${y} a ${r} ${r} 0 1 0 ${-2 * r} 0 a ${r} ${r} 0 1 0 ${2 * r} 0 Z`);
// The kirita-mukuta: a tall crown that swells like a bell, tapers to a finial, with petals at its band.
const mukuta = (x: number, y: number, s: number, tall = 1): string[] => {
  const T = (p: number[]): Pt => [x + p[0] * s, y + p[1] * s * (p[1] < 0 ? tall : 1)] as Pt;
  return [
    smooth([[-25, 0], [-27, -10], [-24, -22], [-20, -34], [-18, -46], [-12, -58], [-6, -70], [-2, -82, "c"], [2, -70], [8, -58], [14, -46], [16, -34], [20, -22], [23, -10], [21, 0]].map(T as any) as Pt[]),
    smooth([[-30, 2], [26, 2], [26, -6, "c"], [-30, -6, "c"]].map(T as any) as Pt[]),
    smooth([[-4, -84], [0, -96], [4, -84], [0, -78]].map(T as any) as Pt[]),
    ...[[-30, -4], [26, -4]].map(([px, py]) => smooth([[px - 4, py], [px, py - 12], [px + 4, py]].map(T as any) as Pt[])),
  ];
};
// The peacock feather: a slender quill and a fan-shaped eye at its tip, barbs lifting in the wind w.
const feather = (x: number, y: number, len: number, lean: number, w: number): string[] => {
  const tip: number[] = [x + lean * len * 0.55, y - len];
  const quill = sampleCubics([[x, y], [x + lean * len * 0.1, y - len * 0.35], [x + lean * len * 0.3, y - len * 0.7], tip], 14);
  const out = [ribbon(quill, 4.5, 2, 1)];
  const ex = tip[0] + lean * 6, ey = tip[1] - 8 + w * 2;
  out.push(smooth([[ex - 7, ey + 9], [ex - 10, ey - 3], [ex - 4, ey - 15], [ex + 3, ey - 16], [ex + 9, ey - 7], [ex + 8, ey + 4], [ex + 1, ey + 11]]));
  for (let k = 0; k < 9; k++) {   // the barbs, a soft fan from the upper quill
    const u = 0.5 + k * 0.055, p = quill[Math.round(u * (quill.length - 1))], side = k % 2 ? 1 : -1;
    out.push(ribbon(sampleCubics([p, [p[0] + side * 8, p[1] - 6], [p[0] + side * 16 + w * 3, p[1] - 10], [p[0] + side * 24 + w * 4, p[1] - 8]], 5), 2.2, 0.6, 1));
  }
  return out;
};
// Krishna standing, turned to the left towards Arjuna, right hand raised in teaching. w: the wind (-1..1), t: time.
export const krishnaTeach = (w = 0, t = 0): string[] => {
  const P: string[] = [];
  // head in profile facing left (no features beyond the line of the profile)
  P.push(smooth([[6, -402], [-10, -400], [-20, -392], [-23, -381], [-22, -373], [-28, -364, "c"], [-23, -360], [-24, -355], [-22, -351], [-23, -347], [-18, -341], [-8, -337], [4, -341], [16, -350], [24, -364], [26, -380], [20, -394]]));
  P.push(smooth([[-10, -344], [10, -348], [12, -320], [-8, -320]]));
  // hair: dark locks falling behind the neck to the shoulder blades, lifting a little
  P.push(smooth([[14, -394], [28, -380], [34, -356], [40, -334], [52, -316 + w * 3], [44, -304], [32, -312], [24, -330], [16, -350], [10, -372]]));
  // torso: broad shoulders, a narrow waist; the chest towards Arjuna
  P.push(smooth([[-36, -326], [-12, -334], [18, -334], [42, -326], [46, -300], [36, -266], [28, -236], [26, -212], [-22, -212], [-26, -240], [-32, -268], [-40, -298]]));
  // the dhoti in folds to the ankles, its pleated front panel, the feet
  P.push(smooth([[-26, -222], [28, -222], [38, -186], [42, -136], [44, -86], [46, -38], [52, -8], [32, -6], [22, -40], [14, -90], [6, -128], [-2, -98], [-12, -48], [-18, -8], [-38, -6], [-34, -48], [-34, -108], [-34, -168]]));
  P.push(smooth([[-6, -212], [6, -212], [12, -150], [18, -80], [20, -18], [8, -12, "c"], [0, -80], [-6, -150]]));
  P.push(smooth([[-40, -10], [-18, -10], [-16, 0, "c"], [-54, 0, "c"], [-50, -4]]));
  P.push(smooth([[32, -10], [52, -10], [54, 0, "c"], [18, 0, "c"], [22, -4]]));
  // the garland (vanamala) from the neck to below the knee, standing just off the front of the body
  P.push(...pearls(sampleCubics([[-20, -330], [-46, -290], [-48, -200], [-40, -120]], 22), 5.2));
  P.push(...pearls(sampleCubics([[-40, -120], [-30, -150], [-10, -230], [8, -330]], 14).slice(1), 4.6));
  // the raised right hand: upper arm forward, forearm up, the open palm turned to Arjuna
  P.push(ribbon(sampleCubics([[-28, -318], [-46, -306], [-64, -294], [-82, -290]], 8), 27, 19, 1));
  P.push(ribbon(sampleCubics([[-82, -290], [-88, -306], [-92, -324], [-94, -344]], 8), 19, 14, 1));
  P.push(smooth([[-100, -342], [-102, -356], [-101, -372], [-98, -382], [-95, -374], [-94, -384], [-91, -388], [-88, -378], [-86, -386], [-82, -382], [-82, -368], [-80, -354], [-86, -340]]));
  P.push(smooth([[-100, -352], [-110, -362], [-112, -358], [-102, -344]]));
  P.push(...pearls([[-56, -300], [-92, -334]], 6));                     // armlet and bracelet
  // the left arm down at the side holding the reins and the whip
  P.push(ribbon(sampleCubics([[32, -322], [42, -292], [44, -262], [38, -232]], 8), 25, 17, 1));
  P.push(ribbon(sampleCubics([[38, -232], [32, -212], [24, -200], [14, -192]], 6), 17, 12, 1));
  P.push(smooth([[18, -200], [8, -190], [6, -182], [14, -180], [22, -188]]));
  // the uttariya over the shoulders, both ends streaming back in the wind
  // the uttariya draped over the forearm: from the elbow it falls to the knee, its end lifting a little in the wind
  {
    const ph = t * 0.09, pts: number[][] = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([40 + 10 * u + (8 + 10 * w) * u * u + Math.sin(ph + u * 4) * 5 * u, -236 + 130 * u]); }
    const L: number[][] = [], R: number[][] = [];
    for (let i = 0; i < pts.length; i++) { const u = i / (pts.length - 1), a2 = pts[Math.max(0, i - 1)], b2 = pts[Math.min(pts.length - 1, i + 1)], tx = b2[0] - a2[0], ty = b2[1] - a2[1], l = Math.hypot(tx, ty) || 1, wd = (10 + 8 * Math.sin(u * Math.PI)) / 2; L.push([pts[i][0] - (ty / l) * wd, pts[i][1] + (tx / l) * wd]); R.push([pts[i][0] + (ty / l) * wd, pts[i][1] - (tx / l) * wd]); }
    P.push(smooth([...L, ...R.reverse()].map((q) => [q[0], q[1]] as Pt)));
  }
  // the crown and the feather
  P.push(...mukuta(-2, -396, 1));
  P.push(...feather(14, -440, 110, 0.55, w));
  return P;
};
// Krishna seated at the front of the chariot, driving: leaning forward, both hands on the reins. Faces right.
export const krishnaDrive = (w = 0, t = 0): string[] => {
  const P: string[] = [];
  P.push(smooth([[-8, -262], [8, -264], [18, -256], [22, -246], [21, -238], [27, -230, "c"], [22, -226], [23, -221], [21, -217], [22, -213], [17, -207], [7, -204], [-5, -208], [-17, -218], [-22, -234], [-18, -252]]));
  P.push(smooth([[-10, -212], [8, -210], [10, -186], [-8, -188]]));
  P.push(smooth([[-16, -258], [-30, -244], [-36, -222], [-46, -200 + w * 2], [-38, -192], [-28, -206], [-20, -226]]));
  P.push(smooth([[-34, -192], [-4, -200], [22, -194], [34, -176], [32, -140], [22, -110], [20, -86], [-30, -86], [-36, -120], [-40, -160]]));
  P.push(smooth([[-30, -96], [26, -96], [64, -84], [86, -70], [92, -46], [88, 0, "c"], [70, 0, "c"], [70, -40], [58, -54], [20, -50], [-26, -48], [-36, -70]]));
  P.push(ribbon(sampleCubics([[24, -186], [44, -170], [62, -158], [86, -152]], 8), 24, 16, 1));
  P.push(ribbon(sampleCubics([[86, -152], [100, -148], [112, -146], [124, -148]], 6), 16, 12, 1));
  P.push(smooth([[120, -156], [134, -154], [138, -146], [130, -138], [120, -140]]));
  P.push(...pearls(sampleCubics([[16, -200], [40, -170], [40, -120], [30, -90]], 14), 4.6));
  P.push(streamer(-26, -196, 200, 24, 5, t * 0.12, 24 + w * 10, -1, 14));
  P.push(...mukuta(0, -258, 0.92));
  P.push(...feather(-10, -300, 96, -0.6, w));
  return P;
};
// Arjuna standing, facing right. pose: "despair" (1.47: head bowed, shoulders sunk, the bow slipping from his hand),
// "listen" (hands joined at the chest, head a little bowed), "resolve" (18.73: upright, the Gandiva raised).
export const arjuna = (pose: "despair" | "listen" | "resolve" = "listen", w = 0, t = 0): string[] => {
  const P: string[] = [];
  const bow = pose === "despair" ? 22 : pose === "listen" ? 9 : -4;          // head bow in degrees
  const sink = pose === "despair" ? 10 : 0;                                   // shoulders sink
  const r = (bow * Math.PI) / 180, hx = 0, hy = -330 + sink;                  // neck pivot
  const rot = (p: number[]): Pt => { const dx = p[0] - hx, dy = p[1] - hy; return [hx + dx * Math.cos(r) - dy * Math.sin(r), hy + dx * Math.sin(r) + dy * Math.cos(r)] as Pt; };
  // head in profile facing right, turned down by `bow`
  P.push(smooth(([[-6, -402], [10, -400], [20, -392], [23, -381], [22, -373], [28, -364, "c"], [23, -360], [24, -355], [22, -351], [23, -347], [18, -341], [8, -337], [-4, -341], [-16, -350], [-24, -364], [-26, -380], [-20, -394]] as number[][]).map((p) => rot([p[0], p[1] + sink]))));
  P.push(smooth([[-10, -348 + sink], [10, -344 + sink], [8, -318 + sink], [-12, -320 + sink]]));
  P.push(smooth(([[-14, -394], [-28, -380], [-34, -356], [-40, -336], [-50, -320 + w * 3], [-42, -308], [-30, -316], [-22, -334], [-14, -354], [-10, -374]] as number[][]).map((p) => rot([p[0], p[1] + sink]))));
  // the warrior's crown (Arjuna is Kiriti, "the crowned"), lower than Krishna's, with a streaming crest
  P.push(...mukuta(2, -396 + sink, 0.84, 0.62).map((d) => d));
  // torso with a breastplate line, a little forward when he sinks
  P.push(smooth([[-42, -326 + sink], [-18, -334 + sink], [12, -334 + sink], [36, -326 + sink], [40, -298 + sink], [32, -266], [26, -236], [24, -212], [-24, -212], [-28, -240], [-36, -268], [-46, -298 + sink]]));
  // the dhoti and the warrior's sash, the feet
  P.push(smooth([[-26, -222], [26, -222], [34, -186], [38, -136], [40, -86], [42, -38], [46, -8], [28, -6], [20, -40], [12, -90], [4, -128], [-4, -98], [-12, -48], [-18, -8], [-38, -6], [-36, -48], [-36, -108], [-36, -168]]));
  P.push(smooth([[18, -10], [40, -10], [54, 0, "c"], [16, 0, "c"]]));
  P.push(smooth([[-36, -10], [-14, -10], [0, 0, "c"], [-38, 0, "c"]]));
  P.push(streamer(-26, -220, 66, 12, 4, t * 0.11 + 2, 8 + w * 4, -1, 8));
  // the quiver across the back, arrows fletched above the shoulder
  P.push(smooth([[-58, -214], [-48, -220], [-16, -340 + sink], [-26, -344 + sink]]));
  for (let k = 0; k < 4; k++) P.push(ribbon(sampleCubics([[-20 + k * 3, -340 - k * 2 + sink], [-22 + k * 3, -352 - k * 2 + sink], [-24 + k * 4, -364 - k * 3 + sink], [-26 + k * 4, -376 - k * 3 + sink]], 4), 6, 2, 1));
  if (pose === "despair") {
    // arms hanging; the near hand loosely holding the bow at its grip, the bow tilting down to the floor
    P.push(ribbon(sampleCubics([[30, -322 + sink], [40, -292], [42, -262], [40, -232]], 8), 24, 17, 1));
    P.push(ribbon(sampleCubics([[40, -232], [42, -212], [44, -196], [46, -184]], 6), 17, 12, 1));
    P.push(smooth([[38, -188], [52, -190], [56, -178], [48, -170], [38, -174]]));
    const bw = gandiva(330); P.push(...bw.map((d) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, a, b) => { const x = +a, y = +b, c = Math.cos(1.25), sn = Math.sin(1.25); return `${(48 + x * c - y * sn).toFixed(1)} ${(-330 + x * sn + y * c).toFixed(1)}`; })));
  } else if (pose === "listen") {
    P.push(ribbon(sampleCubics([[30, -322], [42, -300], [44, -276], [40, -262]], 8), 24, 17, 1));
    P.push(ribbon(sampleCubics([[40, -262], [46, -268], [50, -278], [52, -286]], 6), 17, 13, 1));
    P.push(smooth([[44, -284], [48, -298], [52, -308], [56, -312, "c"], [60, -304], [60, -292], [54, -280]]));
  } else {
    // the bow raised upright in the near hand, the string catching the light
    P.push(ribbon(sampleCubics([[30, -322], [52, -332], [70, -346], [80, -362]], 8), 24, 17, 1));
    P.push(ribbon(sampleCubics([[80, -362], [86, -382], [88, -400], [88, -414]], 6), 17, 13, 1));
    P.push(smooth([[80, -414], [96, -416], [98, -402], [90, -396], [80, -400]]));
    P.push(ribbon(sampleCubics([[96, -560], [74, -520], [70, -460], [88, -408], [104, -360], [102, -300], [80, -254]], 10), 9, 9, 1));
    P.push(`M 96 -560 L 80 -254 L 82 -254 L 98 -560 Z`);
  }
  P.push(streamer(-30, -318 + sink, 70, 14, 3, t * 0.09, 10 + w * 5, -1, 10));   // his scarf, lifting behind
  return P;
};
// The Gandiva: a long recurved bow with its string; laid down (angle in degrees) at x, y.
export const gandiva = (len = 300): string[] => [
  ribbon(sampleCubics([[0, 0], [len * 0.1, -len * 0.08], [len * 0.3, -len * 0.04], [len * 0.5, -len * 0.05], [len * 0.7, -len * 0.06], [len * 0.9, -len * 0.02], [len, -len * 0.1]], 10), 9, 5, 1),
  `M 0 0 L ${len} ${-len * 0.1} L ${len} ${-len * 0.1 + 1.6} L 0 1.6 Z`,
];
// The ratha (chariot), side view facing right; origin at the wheel hub. t animates the pennant.
export const ratha = (t = 0, w = 0): string[] => {
  const P: string[] = [];
  // floor and the car: a curved body that sweeps up into a tall prow, a back rail, arched lattice in the side panel
  P.push(smooth([[-240, -36], [200, -36], [262, -44], [312, -78], [342, -128], [352, -168], [364, -186, "c"], [374, -170], [372, -128], [354, -66], [312, -14], [240, 4], [-240, 4, "c"]]));
  P.push(smooth([[-236, -36], [-236, -150], [-228, -168], [-212, -172], [-198, -164], [-196, -36]]));
  P.push(smooth([[-200, -116], [236, -116], [270, -132], [298, -164], [304, -156], [276, -112], [238, -100], [-200, -100]]));
  for (let i = 0; i < 10; i++) { const x = -182 + i * 42; P.push(`M ${x} -100 L ${x + 8} -100 L ${x + 8} -36 L ${x} -36 Z`); P.push(`M ${x + 8} -76 q 17 -22 34 0 L ${x + 42} -70 q -17 -16 -34 0 Z`); }
  P.push(smooth([[-232, -170], [-238, -196], [-222, -214, "c"], [-210, -196], [-214, -172]]));
  P.push(smooth([[360, -184], [354, -206], [368, -226, "c"], [382, -206], [372, -184]]));
  // the pole to the yoke
  P.push(`M 330 -52 L 660 -150 L 664 -138 L 336 -40 Z`);
  // the dhvaja: a tall flagstaff at the back with a long swallow-tailed pennant in the wind
  P.push(`M -216 -170 L -211 -600 L -201 -600 L -204 -170 Z`);
  P.push(`M -206 -606 m -11 0 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0`);
  const Wv = (k: number) => Math.sin(t * 0.12 + k) * (14 + w * 8);
  P.push(`M -206 -590 C -120 ${-604 + Wv(0)} -20 ${-580 + Wv(1)} 90 ${-596 + Wv(2)} L 46 ${-562 + Wv(2.4)} L 100 ${-528 + Wv(2.8)} C -10 ${-524 + Wv(1.6)} -116 ${-538 + Wv(0.6)} -206 -518 Z`);
  return P;
};
// The wheel: rim, sixteen spokes, hub, studs; light shows between the spokes (even-odd fill).
export const wheel = (r = 118, rot = 0): string => {
  let d = `M ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 Z M ${r - 18} 0 A ${r - 18} ${r - 18} 0 1 1 ${-(r - 18)} 0 A ${r - 18} ${r - 18} 0 1 1 ${r - 18} 0 Z`;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + rot, wd = 0.045, r0 = 26, r1 = r - 16;
    d += ` M ${Math.cos(a - wd * 2.2) * r0} ${Math.sin(a - wd * 2.2) * r0} L ${Math.cos(a - wd * 0.6) * r1} ${Math.sin(a - wd * 0.6) * r1} L ${Math.cos(a + wd * 0.6) * r1} ${Math.sin(a + wd * 0.6) * r1} L ${Math.cos(a + wd * 2.2) * r0} ${Math.sin(a + wd * 2.2) * r0} Z`;
  }
  d += ` M 30 0 A 30 30 0 1 0 -30 0 A 30 30 0 1 0 30 0 Z`;
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2 + rot + Math.PI / 16; d += ` M ${Math.cos(a) * (r + 6) + 6} ${Math.sin(a) * (r + 6)} a 6 6 0 1 0 -12 0 a 6 6 0 1 0 12 0 Z`; }
  return d;
};
