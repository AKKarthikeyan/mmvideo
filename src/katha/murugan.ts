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
  // a cape from the shoulders to the calf
  P.push(smooth([[30, -326], [62, -318], [84, -250], [96, -160], [100, -70], [70, -60], [62, -150], [52, -240]]));
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

// ---------- people of the present day (Arun's story): faceless, plain, facing left, standing on y = 0 ----------
// A man standing (~400 tall). arm: "down" | "point" (the forward arm out, a finger extended) | "bag" (a bag in the rear hand).
// bow: 0..1, the head and shoulders dropped.
export const man = (arm: "down" | "point" | "bag" = "down", bow = 0): string[] => {
  const P: string[] = [], hx = -4 - 14 * bow, hy = -372 + 16 * bow;
  P.push(smooth([[hx - 22, hy], [hx - 16, hy - 24], [hx + 4, hy - 30], [hx + 22, hy - 18], [hx + 24, hy + 6], [hx + 10, hy + 26], [hx - 10, hy + 24]]));
  P.push(smooth([[hx - 6, hy + 20], [hx + 14, hy + 16], [14, -326], [-10, -326]]));
  P.push(smooth([[-40 - 6 * bow, -322 + 6 * bow], [-12, -332], [18, -332], [44, -320], [46, -280], [40, -230], [38, -196], [-34, -196], [-36, -232], [-42, -282]]));
  P.push(smooth([[-34, -204], [38, -204], [40, -150], [36, -80], [34, -14], [8, -14], [4, -90], [2, -150], [-4, -90], [-10, -14], [-36, -14], [-36, -80], [-36, -150]]));
  P.push(smooth([[-38, -16], [-8, -16], [-6, 0, "c"], [-58, 0, "c"], [-54, -8]]));
  P.push(smooth([[8, -16], [36, -16], [38, 0, "c"], [-8, 0, "c"], [-4, -8]]));
  if (arm === "point") {
    P.push(ribbon(cub([-32, -316], [-60, -312], [-92, -316], [-124, -322]), 28, 18, 1));
    P.push(smooth([[-120, -332], [-140, -334], [-172, -330], [-172, -324], [-146, -322], [-150, -314], [-132, -310], [-120, -312]]));
  } else {
    P.push(ribbon(cub([-34, -316 + 6 * bow], [-46, -280], [-46, -240], [-40, -200]), 27, 18, 1));
    P.push(smooth([[-50, -204], [-48, -184], [-38, -178], [-30, -188], [-32, -204]]));
  }
  P.push(ribbon(cub([36, -316], [48, -280], [48, -240], [42, -200]), 27, 18, 1));
  if (arm === "bag") { P.push(`M 30 -196 L 54 -196 L 54 -190 L 78 -190 L 78 -110 L 6 -110 L 6 -190 L 30 -190 Z`); }
  return P;
};
// A woman standing in a sari (~380 tall), the pallu over the shoulder, hair in a knot.
export const woman = (crown = false): string[] => {
  const P: string[] = [];
  P.push(smooth([[-24, -352], [-18, -374], [2, -380], [20, -370], [22, -348], [10, -330], [-10, -332]]));
  P.push(smooth([[14, -372], [34, -362], [36, -342], [22, -336]]));
  P.push(smooth([[-8, -334], [10, -336], [12, -312], [-8, -312]]));
  P.push(smooth([[-34, -306], [-10, -316], [14, -316], [36, -306], [38, -270], [30, -236], [28, -210], [-26, -210], [-28, -238], [-36, -272]]));
  P.push(smooth([[-28, -216], [30, -216], [44, -160], [56, -90], [66, -20], [70, 0, "c"], [-62, 0, "c"], [-56, -30], [-44, -100], [-34, -160]]));
  // the pallu falling behind
  P.push(smooth([[20, -314], [40, -304], [52, -250], [58, -180], [54, -120], [42, -124], [40, -190], [32, -250]]));
  P.push(ribbon(cub([-30, -300], [-42, -270], [-44, -240], [-36, -206]), 22, 15, 1));
  if (crown) P.push(...mukuta(-1, -374, 0.8, 0.9));
  return P;
};
// A child (~235 tall). paper: "up" (a sheet held high in both hands) | "down" (the sheet hanging from one hand) | "none".
// Returns the paths and the sheet's corners (draw the sheet as a pale colour layer).
export const child = (paper: "up" | "down" | "none" = "none"): {paths: string[]; sheet: number[][] | null} => {
  const P: string[] = [];
  P.push(smooth([[-22, -200], [-18, -224], [2, -234], [22, -224], [26, -200], [14, -180], [-10, -180]]));
  P.push(smooth([[-6, -184], [10, -184], [12, -168], [-8, -168]]));
  P.push(smooth([[-24, -166], [-8, -172], [12, -172], [26, -166], [28, -130], [24, -96], [-22, -96], [-26, -130]]));
  P.push(smooth([[-22, -102], [24, -102], [26, -64], [6, -62], [2, -84], [-2, -62], [-24, -64]]));
  P.push(ribbon(cub([-12, -66], [-13, -44], [-14, -24], [-14, -8]), 15, 11, 1));
  P.push(ribbon(cub([14, -66], [15, -44], [16, -24], [16, -8]), 15, 11, 1));
  P.push(smooth([[-22, -9], [-6, -9], [-4, 0, "c"], [-32, 0, "c"]]));
  P.push(smooth([[8, -9], [24, -9], [26, 0, "c"], [-2, 0, "c"]]));
  let sheet: number[][] | null = null;
  if (paper === "up") {
    P.push(ribbon(cub([-20, -160], [-36, -176], [-48, -200], [-54, -226]), 15, 10, 1));
    P.push(ribbon(cub([22, -160], [10, -186], [-10, -214], [-30, -232]), 15, 10, 1));
    sheet = [[-112, -300], [-26, -292], [-32, -222], [-118, -230]];
  } else {
    P.push(ribbon(cub([-22, -160], [-30, -136], [-32, -112], [-30, -92]), 15, 10, 1));
    P.push(ribbon(cub([24, -160], [32, -136], [32, -112], [28, -92]), 15, 10, 1));
    if (paper === "down") sheet = [[-48, -94], [-18, -94], [-14, -22], [-52, -26]];
  }
  return {paths: P, sheet};
};
// A man on one knee, at a child's height, the forward arm reaching out. Faces left.
export const kneeling = (): string[] => {
  const P: string[] = [];
  P.push(smooth([[-36, -262], [-30, -286], [-10, -294], [10, -284], [14, -262], [2, -242], [-18, -242]]));
  P.push(smooth([[-14, -246], [4, -248], [10, -226], [-10, -224]]));
  P.push(smooth([[-36, -220], [-10, -230], [18, -230], [42, -218], [48, -176], [46, -130], [44, -104], [-24, -104], [-30, -136], [-38, -180]]));
  // forward thigh level, shin down; rear thigh down, shin along the floor
  P.push(ribbon(cub([10, -116], [-24, -122], [-60, -120], [-92, -112]), 46, 36, 1));
  P.push(ribbon(cub([-90, -114], [-94, -80], [-96, -44], [-96, -12]), 36, 22, 1));
  P.push(smooth([[-110, -14], [-84, -14], [-82, 0, "c"], [-132, 0, "c"], [-128, -6]]));
  P.push(ribbon(cub([30, -116], [36, -84], [40, -50], [44, -20]), 44, 34, 1));
  P.push(ribbon(cub([40, -22], [76, -22], [112, -18], [146, -12]), 34, 18, 1));
  P.push(ribbon(cub([-30, -214], [-54, -200], [-80, -190], [-106, -186]), 25, 16, 1));
  P.push(smooth([[-104, -194], [-120, -194], [-128, -186], [-118, -178], [-104, -178]]));
  P.push(ribbon(cub([40, -212], [52, -178], [52, -146], [40, -118]), 25, 17, 1));
  return P;
};
// A Dravida temple tower (gopuram): a stone base with a doorway, tapering storeys, a barrel roof with a row of finials.
// Foot at (x, y), width w at the base; about 2.3 w tall.
export const gopuram = (x: number, y: number, w: number, tiers = 9): string[] => {
  const P: string[] = [], bh = w * 0.42;
  P.push(`M ${x - w / 2} ${y} L ${x - w / 2} ${y - bh} L ${x + w / 2} ${y - bh} L ${x + w / 2} ${y} L ${x + w * 0.1} ${y} L ${x + w * 0.1} ${y - bh * 0.6} L ${x - w * 0.1} ${y - bh * 0.6} L ${x - w * 0.1} ${y} Z`);
  let yy = y - bh, ww = w * 0.94;
  const th = (w * 1.5) / tiers;
  for (let i = 0; i < tiers; i++) {
    const w2 = ww * 0.925;
    P.push(`M ${x - ww / 2 - th * 0.12} ${yy} L ${x - ww / 2 - th * 0.12} ${yy - th * 0.16} L ${x - w2 / 2} ${yy - th * 0.16} L ${x - w2 / 2} ${yy - th} L ${x + w2 / 2} ${yy - th} L ${x + w2 / 2} ${yy - th * 0.16} L ${x + ww / 2 + th * 0.12} ${yy - th * 0.16} L ${x + ww / 2 + th * 0.12} ${yy} Z`);
    yy -= th; ww = w2;
  }
  const rw = ww * 1.06, rh = w * 0.2;
  P.push(smooth([[x - rw / 2, yy, "c"], [x - rw / 2 - rh * 0.25, yy - rh * 0.55], [x - rw / 2 + rh * 0.3, yy - rh], [x + rw / 2 - rh * 0.3, yy - rh], [x + rw / 2 + rh * 0.25, yy - rh * 0.55], [x + rw / 2, yy, "c"]]));
  const nk = 7;
  for (let i = 0; i < nk; i++) { const kx = x - rw * 0.36 + (rw * 0.72 * i) / (nk - 1), ky = yy - rh; P.push(smooth([[kx - 5, ky + 2], [kx - 7, ky - 10], [kx, ky - 26, "c"], [kx + 7, ky - 10], [kx + 5, ky + 2]])); }
  return P;
};
