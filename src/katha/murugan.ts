// Figures for the Surasamharam film as silhouettes (17 Nov 2026). Rule 5 as AK extended it on 16 Nov 2026: Murugan is a
// faceless backlit silhouette with one head, known by the vel, the peacock and the rooster banner; his six faces are
// never drawn. Pure functions that return SVG path strings in local units; figures stand on y = 0 and face LEFT (flip
// with scale(-1 1) and mirror the light). A standing figure is ~400 units tall.
import {smooth, ribbon, band, sampleCubics, Pt} from "./geom";
import {mukuta} from "./figures";

const disc = (x: number, y: number, r: number) => `M ${x + r} ${y} a ${r} ${r} 0 1 0 ${-2 * r} 0 a ${r} ${r} 0 1 0 ${2 * r} 0 Z`;
const cub = (a: number[], b: number[], c: number[], d: number[], n = 10) => sampleCubics([a, b, c, d], n);

// The vel: a long shaft, a small guard, and a broad leaf-shaped blade. Butt at (x, y), pointing up; len = shaft length.
export const vel = (x = 0, y = 0, len = 470, s = 1): string[] => {
  const top = y - len;
  return [
    `M ${x - 3.4 * s} ${y} L ${x - 3.4 * s} ${top} L ${x + 3.4 * s} ${top} L ${x + 3.4 * s} ${y} Z`,
    smooth([[x - 17 * s, top + 4], [x, top - 5], [x + 17 * s, top + 4], [x, top + 12]] as Pt[]),
    smooth([[x, top - 2, "c"], [x - 14 * s, top - 16 * s], [x - 26 * s, top - 40 * s], [x - 22 * s, top - 66 * s], [x - 10 * s, top - 96 * s], [x, top - 124 * s, "c"],
      [x + 10 * s, top - 96 * s], [x + 22 * s, top - 66 * s], [x + 26 * s, top - 40 * s], [x + 14 * s, top - 16 * s]] as Pt[]),
  ];
};

// Murugan, young, standing, turned to the left. pose "hold": the vel upright in the forward hand. "thrown": the arm
// stretched out, the hand open, no vel. w: wind, t: time.
export const murugan = (pose: "hold" | "thrown" = "hold", w = 0, t = 0): string[] => {
  const P: string[] = [];
  // head in profile (only the line of the profile), neck
  P.push(smooth([[6, -400], [-9, -398], [-18, -391], [-21, -381], [-20, -374], [-25, -366, "c"], [-21, -362], [-21, -355], [-17, -346], [-8, -341], [4, -344], [15, -352], [22, -365], [24, -380], [18, -393]]));
  P.push(smooth([[-9, -347], [9, -350], [11, -324], [-7, -324]]));
  // hair gathered to the nape
  P.push(smooth([[14, -393], [27, -380], [31, -360], [30, -342], [22, -334], [16, -348], [11, -370]]));
  // torso: a boy's build, shoulders not yet broad
  P.push(smooth([[-31, -328], [-10, -335], [16, -335], [36, -328], [39, -302], [31, -268], [25, -238], [23, -214], [-20, -214], [-23, -242], [-28, -270], [-34, -300]]));
  // a warrior's short dhoti, tucked, to below the knee; the legs apart
  P.push(smooth([[-24, -224], [25, -224], [33, -190], [34, -150], [30, -118], [14, -116], [6, -150], [0, -128], [-10, -114], [-30, -116], [-32, -150], [-30, -190]]));
  P.push(ribbon(cub([-20, -122], [-22, -90], [-24, -50], [-26, -10]), 24, 15, 1));
  P.push(ribbon(cub([22, -122], [24, -90], [26, -50], [28, -10]), 24, 15, 1));
  P.push(smooth([[-36, -11], [-17, -11], [-15, 0, "c"], [-50, 0, "c"], [-46, -5]]));
  P.push(smooth([[18, -11], [37, -11], [39, 0, "c"], [4, 0, "c"], [8, -5]]));
  // the front pleat of the waist-cloth
  P.push(smooth([[-8, -222], [8, -222], [12, -170], [6, -120], [-2, -108, "c"], [-8, -150]]));
  // a short necklace and armlets
  for (const q of cub([-22, -326], [-16, -306], [6, -304], [16, -328], 9)) P.push(disc(q[0], q[1], 4.2));
  if (pose === "hold") {
    // forward arm: upper arm down and forward, forearm up to the grip on the shaft
    P.push(ribbon(cub([-26, -320], [-44, -306], [-58, -288], [-66, -268]), 24, 17, 1));
    P.push(ribbon(cub([-66, -268], [-76, -278], [-84, -292], [-88, -306]), 17, 13, 1));
    P.push(smooth([[-98, -300], [-98, -318], [-90, -324], [-80, -320], [-79, -304], [-86, -296]]));
    P.push(...vel(-90, 0, 470));
  } else {
    // the arm flung out level, the palm open towards the tree
    P.push(ribbon(cub([-26, -322], [-52, -318], [-78, -318], [-104, -322]), 24, 15, 1));
    P.push(smooth([[-102, -330], [-116, -336], [-130, -334], [-138, -326], [-128, -324], [-136, -318], [-124, -314], [-108, -313]]));
  }
  P.push(disc(-46, -302, 5.5));
  // the rear arm, hand on the hip
  P.push(ribbon(cub([30, -322], [44, -296], [48, -268], [40, -244]), 23, 16, 1));
  P.push(ribbon(cub([40, -244], [34, -232], [28, -226], [20, -224]), 16, 12, 1));
  // the crown, shorter than a king's
  P.push(...mukuta(-1, -394, 0.86, 0.72));
  return P;
};

// Surapadman as a king: tall crown, broad, a mace-less open stance; faceless; no demon features. Facing left.
export const surapadman = (w = 0, t = 0): string[] => {
  const P: string[] = [];
  P.push(smooth([[8, -402], [-10, -400], [-21, -392], [-24, -380], [-23, -372], [-28, -364, "c"], [-23, -359], [-23, -350], [-18, -341], [-8, -337], [6, -341], [18, -350], [26, -364], [28, -381], [21, -395]]));
  P.push(smooth([[-12, -344], [12, -348], [16, -318], [-10, -318]]));
  P.push(smooth([[-52, -322], [-14, -334], [22, -334], [58, -322], [62, -292], [46, -252], [36, -222], [34, -200], [-30, -200], [-34, -226], [-44, -256], [-58, -292]]));
  P.push(smooth([[-34, -212], [36, -212], [48, -170], [54, -110], [58, -50], [64, -8], [40, -6], [26, -50], [14, -110], [6, -140], [-2, -108], [-14, -50], [-22, -8], [-48, -6], [-44, -52], [-42, -112], [-42, -170]]));
  P.push(smooth([[-50, -10], [-22, -10], [-20, 0, "c"], [-66, 0, "c"], [-62, -4]]));
  P.push(smooth([[38, -10], [64, -10], [66, 0, "c"], [22, 0, "c"], [26, -4]]));
  // arms: one on the hip, one out over the worlds below
  P.push(ribbon(cub([-46, -316], [-72, -300], [-92, -282], [-108, -268]), 30, 20, 1));
  P.push(ribbon(cub([-108, -268], [-126, -270], [-142, -276], [-156, -284]), 20, 15, 1));
  P.push(smooth([[-154, -292], [-170, -294], [-180, -286], [-172, -280], [-180, -274], [-166, -270], [-152, -274]]));
  P.push(ribbon(cub([50, -316], [70, -288], [74, -256], [62, -230]), 29, 19, 1));
  P.push(ribbon(cub([62, -230], [54, -216], [44, -208], [34, -204]), 19, 14, 1));
  // the cloak streaming behind
  {
    const pts: number[][] = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([40 + 150 * u + w * 30 * u * u, -318 + 250 * u * u + Math.sin(t * 0.07 + u * 5) * 9 * u]); }
    P.push(band(pts, 46, 12, 1, "point"));
  }
  P.push(...mukuta(-1, -396, 1.12, 1.25));
  return P;
};

// A peacock standing, facing left. open = false: the train closed, sweeping back to the ground. open = true: the train
// fanned behind the body. Returns [body paths, eye marks] (the eyes are a colour layer: draw them with rim: false).
export const peacock = (open = false, t = 0): {body: string[]; eyes: string[]} => {
  const B: string[] = [], E: string[] = [];
  const eye = (x: number, y: number, r: number, a = 0) => { const c = Math.cos(a), s = Math.sin(a); const pt = (u: number, v: number) => [x + u * c - v * s, y + u * s + v * c];
    E.push(smooth([pt(-r * 0.75, 0), pt(0, -r), pt(r * 0.75, 0), pt(0, r * 1.15)] as Pt[])); };
  if (open) {
    const cx = 10, cy = -150, n = 23;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1), a = Math.PI * (1.08 - 1.16 * u) + Math.sin(t * 0.03 + i) * 0.006, L = 250 + 26 * Math.sin(u * Math.PI);
      const ex = cx + Math.cos(a) * L, ey = cy - Math.sin(a) * L;
      B.push(band([[cx, cy], [cx + Math.cos(a) * L * 0.5, cy - Math.sin(a) * L * 0.5], [ex, ey]], 16, 30, 1.6, "round"));
      eye(cx + Math.cos(a) * L * 0.9, cy - Math.sin(a) * L * 0.9, 10, Math.PI / 2 - a);
      if (i < n - 1) { const a2 = Math.PI * (1.08 - 1.16 * (u + 0.5 / (n - 1))), L2 = L * 0.72; B.push(band([[cx, cy], [cx + Math.cos(a2) * L2, cy - Math.sin(a2) * L2]], 14, 22, 1.4, "round")); eye(cx + Math.cos(a2) * L2 * 0.9, cy - Math.sin(a2) * L2 * 0.9, 8, Math.PI / 2 - a2); }
    }
  } else {
    // the train: a long tapering sweep to the ground behind, its lower edge feathered
    B.push(smooth([[20, -176], [70, -178], [150, -160], [240, -120], [330, -66], [410, -22], [452, -4, "c"], [400, -6], [330, -20], [250, -48], [170, -84], [100, -108], [50, -116], [22, -126]]));
    for (let i = 0; i < 9; i++) { const u = i / 8, x = 110 + 290 * u, y = -112 + 96 * u; B.push(band([[x, y], [x + 34, y + 20 + 6 * Math.sin(i)], [x + 62, y + 30]], 15, 4, 1, "point")); }
    for (let i = 0; i < 7; i++) { const u = i / 6; eye(140 + 250 * u, -128 + 100 * u + (i % 2 ? 10 : -4), 8.5 - u * 2, 0.5); }
  }
  // body, breast forward
  B.push(smooth([[-58, -150], [-50, -184], [-22, -200], [14, -198], [44, -180], [56, -150], [44, -118], [10, -100], [-26, -104], [-50, -124]]));
  // neck in an S, head, beak
  B.push(ribbon(cub([-40, -176], [-62, -214], [-34, -246], [-46, -286]), 34, 13, 0.8));
  B.push(smooth([[-58, -288], [-52, -302], [-40, -304], [-33, -294], [-36, -282], [-48, -278]]));
  B.push(smooth([[-56, -296], [-76, -289], [-56, -286]] as Pt[]));
  // crest: fine stalks with a bead at each tip
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.2 + 0.25, x0 = -43, y0 = -302, x1 = x0 + Math.cos(a) * 28, y1 = y0 + Math.sin(a) * 28; B.push(band([[x0, y0], [x1, y1]], 2.4, 1.6, 1, "round")); B.push(disc(x1, y1, 3.3)); }
  // legs
  for (const lx of [-14, 12]) { B.push(band([[lx, -106], [lx - 3, -50], [lx - 1, -4]], 7, 4.5, 1, "round")); B.push(smooth([[lx - 22, 0], [lx - 6, -8], [lx + 12, 0], [lx - 2, -2]] as Pt[])); }
  return {body: B, eyes: E};
};

// A rooster standing tall, facing left: comb, wattle, an arched tail of sickle feathers.
export const rooster = (t = 0): string[] => {
  const B: string[] = [];
  B.push(smooth([[-44, -92], [-46, -124], [-30, -146], [-2, -150], [30, -138], [48, -112], [40, -82], [14, -64], [-18, -64], [-36, -74]]));
  B.push(ribbon(cub([-28, -122], [-44, -150], [-40, -174], [-44, -196]), 44, 20, 0.9));
  B.push(smooth([[-56, -196], [-52, -212], [-38, -216], [-28, -206], [-32, -192], [-46, -188]]));
  B.push(smooth([[-56, -206], [-76, -198], [-55, -194]] as Pt[]));
  // comb: three rounded points; wattle below the beak
  B.push(smooth([[-54, -210], [-56, -226], [-48, -220], [-44, -234], [-38, -222], [-30, -230], [-28, -212], [-40, -208]]));
  B.push(smooth([[-56, -194], [-60, -178], [-52, -170], [-48, -184]]));
  // hackle feathers down the neck
  for (let i = 0; i < 5; i++) B.push(band([[-30 + i * 3, -170 + i * 10], [-20 + i * 5, -140 + i * 9], [-6 + i * 6, -124 + i * 8]], 9, 2, 1, "point"));
  // tail: sickles rising and arching back
  for (let i = 0; i < 7; i++) { const u = i / 6, sw = Math.sin(t * 0.05 + i) * 2;
    B.push(band(cub([30 + 6 * u, -124 + 14 * u], [60 + 20 * u, -230 + 70 * u], [130 + 30 * u, -270 + 110 * u + sw], [190 - 20 * u, -150 + 110 * u], 12), 22, 3, 1.2, "point")); }
  for (const lx of [-10, 14]) { B.push(band([[lx, -68], [lx - 2, -34], [lx, -4]], 8, 5, 1, "round")); B.push(smooth([[lx - 22, 0], [lx - 6, -8], [lx + 12, 0], [lx - 2, -2]] as Pt[])); }
  return B;
};

// A man sitting on the edge of a bed, bowed over a phone in his hands. Faces left; the seat is at y = -150, feet on
// y = 0. Returns the paths and the phone's centre (the one light of the shot).
export const seatedMan = (): {paths: string[]; phone: [number, number]} => {
  const P: string[] = [];
  // head bowed, no features; neck
  P.push(smooth([[-70, -330], [-88, -322], [-96, -304], [-90, -286], [-74, -278], [-56, -284], [-46, -300], [-50, -318]]));
  P.push(smooth([[-70, -288], [-52, -292], [-40, -270], [-60, -262]]));
  // the back curved forward, shoulders rounded
  P.push(smooth([[-66, -276], [-36, -282], [-6, -266], [16, -232], [26, -190], [26, -150], [-30, -146], [-36, -176], [-50, -210], [-70, -244]]));
  // thigh, shin, foot
  P.push(ribbon(cub([4, -164], [-30, -168], [-66, -166], [-100, -160]), 44, 34, 1));
  P.push(ribbon(cub([-98, -162], [-104, -110], [-106, -60], [-106, -12]), 34, 20, 1));
  P.push(smooth([[-120, -14], [-94, -14], [-92, 0, "c"], [-142, 0, "c"], [-138, -6]]));
  // arm: upper arm down, forearm forward to the phone above the knees
  P.push(ribbon(cub([-46, -262], [-48, -236], [-52, -212], [-58, -192]), 24, 18, 1));
  P.push(ribbon(cub([-58, -192], [-76, -196], [-94, -202], [-110, -208]), 18, 13, 1));
  P.push(smooth([[-108, -216], [-122, -216], [-126, -206], [-118, -198], [-106, -200]]));
  return {paths: P, phone: [-128, -222]};
};
