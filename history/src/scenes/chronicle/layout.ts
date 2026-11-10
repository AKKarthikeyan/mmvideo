// Per-format layout for the Chronicle: 16:9 long-form, 9:16 Shorts/Reels, 1:1 feed.
// Picked automatically from the composition's width/height.

export type Layout = {
  seal: { x: number; y: number; size: number };
  topBand: { x: number; y: number; w: number };
  bottomBand: { x: number; y: number; w: number };
  drawing: { x: number; y: number; scale: number };
  text: { x: number; y: number; w: number; keyword: number; caption: number; era: number };
  name: { right: number; top: number; height: number; size: number; spacing: number };
  timeline: { x: number; w: number; y: number };
  stampSize: number;
  titleSize: number;
};

const landscape: Layout = {
  seal: { x: 60, y: 36, size: 140 },
  topBand: { x: 240, y: 64, w: 1440 },
  bottomBand: { x: 150, y: 840, w: 1620 },
  drawing: { x: 250, y: 214, scale: 1.06 },
  text: { x: 1000, y: 250, w: 720, keyword: 230, caption: 64, era: 32 },
  name: { right: 70, top: 150, height: 690, size: 52, spacing: 18 },
  timeline: { x: 190, w: 1540, y: 958 },
  stampSize: 360,
  titleSize: 96,
};

const portrait: Layout = {
  seal: { x: 50, y: 70, size: 140 },
  topBand: { x: 230, y: 100, w: 800 },
  bottomBand: { x: 60, y: 1600, w: 960 },
  drawing: { x: 110, y: 300, scale: 1.25 },
  text: { x: 90, y: 1110, w: 900, keyword: 210, caption: 62, era: 32 },
  name: { right: 46, top: 260, height: 760, size: 48, spacing: 14 },
  timeline: { x: 130, w: 820, y: 1750 },
  stampSize: 420,
  titleSize: 80,
};

const square: Layout = {
  seal: { x: 36, y: 28, size: 112 },
  topBand: { x: 176, y: 46, w: 840 },
  bottomBand: { x: 60, y: 748, w: 960 },
  drawing: { x: 50, y: 150, scale: 0.9 },
  text: { x: 590, y: 220, w: 420, keyword: 150, caption: 44, era: 26 },
  name: { right: 34, top: 150, height: 560, size: 36, spacing: 10 },
  timeline: { x: 130, w: 820, y: 900 },
  stampSize: 320,
  titleSize: 70,
};

export const layoutFor = (w: number, h: number): Layout => (h > w ? portrait : w === h ? square : landscape);
