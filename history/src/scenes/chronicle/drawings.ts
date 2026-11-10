// Fine-line drawings (one per chapter) in a 600×600 box, ground at y=560.
// Each is an ordered list of strokes, drawn on in that order. Generic forms, not copies of artworks.

export type Stroke = { d: string; w?: number };

const rect = (x: number, y: number, w: number, h: number) => `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r},${cy} A${r},${r} 0 1,0 ${cx + r},${cy} A${r},${r} 0 1,0 ${cx - r},${cy}`;

const greatBath = (): Stroke[] => {
  const s: Stroke[] = [{ d: "M20,560 L580,560", w: 2 }, { d: rect(50, 240, 500, 300), w: 2.6 }];
  for (let k = 1; k <= 4; k++) s.push({ d: rect(50 + k * 34, 240 + k * 22, 500 - k * 68, 300 - k * 44), w: 1.6 });
  // steps down at both ends
  for (let k = 0; k < 6; k++) {
    s.push({ d: `M${200 + k * 8},${262 + k * 14} L${400 - k * 8},${262 + k * 14}`, w: 1.1 });
    s.push({ d: `M${200 + k * 8},${518 - k * 14} L${400 - k * 8},${518 - k * 14}`, w: 1.1 });
  }
  // brick courses on the front wall
  for (let r = 0; r < 3; r++) {
    s.push({ d: `M50,${540 + r * 7} L550,${540 + r * 7}`, w: 0.8 });
  }
  s.push({ d: circle(520, 200, 22), w: 1.8 }, { d: circle(520, 200, 12), w: 1 }); // well
  s.push({ d: "M70,240 L70,190 L130,190 L130,240 M150,240 L150,170 L230,170 L230,240", w: 1.6 }); // rooms
  return s;
};

const pillar = (): Stroke[] => {
  const s: Stroke[] = [
    { d: "M20,560 L580,560", w: 2 },
    { d: rect(240, 530, 120, 30), w: 2 },
    { d: "M282,530 L290,190 L310,190 L318,530", w: 2.4 },
    { d: "M262,190 Q300,120 338,190 Z", w: 2 }, // inverted lotus bell
  ];
  for (let k = 0; k < 7; k++) s.push({ d: `M${270 + k * 10},188 Q${300},${150 - Math.abs(k - 3) * 4} ${300},140`, w: 0.9 });
  s.push({ d: rect(244, 108, 112, 26), w: 2 });
  s.push({ d: circle(300, 121, 9), w: 1.2 });
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4;
    s.push({ d: `M300,121 L${300 + Math.cos(a) * 9},${121 + Math.sin(a) * 9}`, w: 0.8 });
  }
  s.push({ d: "M252,108 Q258,64 280,72 Q300,40 320,72 Q342,64 348,108", w: 2.2 }); // seated lions (abstracted)
  s.push({ d: circle(300, 32, 24), w: 2 });
  for (let k = 0; k < 12; k++) {
    const a = (k * Math.PI) / 6;
    s.push({ d: `M300,32 L${300 + Math.cos(a) * 24},${32 + Math.sin(a) * 24}`, w: 0.9 });
  }
  return s;
};

const shrine = (): Stroke[] => {
  const s: Stroke[] = [
    { d: "M20,560 L580,560", w: 2 },
    { d: rect(110, 500, 380, 60), w: 2.2 }, // platform
    { d: "M200,500 L200,480 L400,480 L400,500", w: 1.4 }, // steps
    { d: rect(230, 280, 260, 200), w: 2.4 }, // cella
    { d: rect(110, 250, 390, 30), w: 2.4 }, // flat roof slab
  ];
  [130, 175, 215].forEach((x) => s.push({ d: `M${x},280 L${x},480 M${x - 8},280 L${x + 8},280 M${x - 8},480 L${x + 8},480`, w: 1.8 }));
  s.push({ d: "M320,480 L320,350 Q360,320 400,350 L400,480", w: 2 }); // doorway
  for (let k = 0; k < 4; k++) s.push({ d: `M${322 + k * 2},${350 - k * 8} Q360,${320 - k * 8} ${398 - k * 2},${350 - k * 8}`, w: 0.8 });
  s.push({ d: "M110,265 L500,265", w: 0.9 });
  return s;
};

const vimana = (): Stroke[] => {
  const s: Stroke[] = [{ d: "M20,560 L580,560", w: 2 }, { d: rect(120, 500, 360, 60), w: 2.2 }, { d: rect(160, 400, 280, 100), w: 2.2 }];
  let y = 400;
  for (let i = 0; i < 10; i++) {
    const w = 260 * (1 - i * 0.075);
    const h = 24 * (1 - i * 0.03);
    y -= h;
    s.push({ d: rect(300 - w / 2, y, w, h), w: 1.6 });
  }
  s.push({ d: `M240,${y} Q300,${y - 80} 360,${y} Z`, w: 2 });
  s.push({ d: `M300,${y - 40} L300,${y - 80}`, w: 2 });
  [190, 250, 350, 410].forEach((x) => s.push({ d: rect(x - 12, 425, 24, 55), w: 1.2 }));
  return s;
};

const dome = (): Stroke[] => {
  const s: Stroke[] = [
    { d: "M20,560 L580,560", w: 2 },
    { d: rect(80, 520, 440, 40), w: 2.2 }, // plinth
    { d: rect(170, 330, 260, 190), w: 2.4 }, // main block
    { d: "M250,520 L250,410 Q300,350 350,410 L350,520", w: 2 }, // iwan arch
    { d: rect(230, 300, 140, 30), w: 1.8 }, // drum
    { d: "M230,300 C190,240 250,160 300,140 C350,160 410,240 370,300", w: 2.4 }, // onion dome
    { d: "M300,140 L300,96", w: 1.8 },
    { d: circle(300, 126, 5), w: 1.4 },
    { d: circle(300, 112, 3.5), w: 1.2 }, // kalash finial
  ];
  [110, 490].forEach((x) =>
    s.push({ d: `M${x - 9},520 L${x - 7},250 L${x + 7},250 L${x + 9},520 M${x - 14},250 Q${x},215 ${x + 14},250 M${x},220 L${x},200`, w: 1.8 }),
  );
  [195, 405].forEach((x) => s.push({ d: `M${x - 14},330 Q${x},300 ${x + 14},330 M${x},305 L${x},290`, w: 1.4 })); // chhatris
  return s;
};

export const drawings: Record<string, () => Stroke[]> = { greatBath, pillar, shrine, vimana, dome };
