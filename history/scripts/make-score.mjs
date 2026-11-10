// Synthesises the Chronicle soundtrack from the SAME beat grid as the picture
// (src/scenes/chronicle/chronicle.json). No samples: every sound is code.
//  - Raga Bhupali (pentatonic: Sa Re Ga Pa Dha) over a tanpura drone
//  - Instruments evolve per chapter: flute → veena → sitar → bronze bells → orchestra
//  - Tabla-like theka on every beat, tempo rising with the centuries
//  - Each chapter cut: big drum + temple bell, landing exactly on the seal-stamp impact
// Usage: node scripts/make-score.mjs  → public/chronicle-score.wav
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "src/scenes/chronicle/chronicle.json"), "utf8"));
const FPS = 30; // must match the composition (stamp lands 4 frames after each cut)
const SR = 44100;
const SA = data.sa;
const BHUPALI = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3];

// ---- beat grid (same maths as schedule.ts) ----
let sec = 0;
const chapters = data.chapters.map((c, i) => {
  const beat = 60 / c.bpm;
  const start = sec;
  sec += beat * data.beatsPerChapter;
  return { ...c, i, start, beat };
});
const total = sec + data.outroSec;
const out = new Float32Array(Math.ceil((total + 0.5) * SR));

// ---- helpers ----
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const add = (t0, dur, fn, gain = 1) => {
  const s0 = Math.floor(t0 * SR);
  const n = Math.floor(dur * SR);
  for (let k = 0; k < n && s0 + k < out.length; k++) out[s0 + k] += fn(k / SR, k) * gain;
};
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));
const noteFreq = (deg, oct = 0) => {
  const o = Math.floor(deg / 5);
  return SA * BHUPALI[((deg % 5) + 5) % 5] * 2 ** (o + oct);
};
// Karplus–Strong plucked string
const pluck = (t0, f, dur, { decay = 0.996, bright = 0.5, gain = 0.4, buzz = 0, seed = 1 } = {}) => {
  const N = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(N);
  const r = rng(seed);
  for (let k = 0; k < N; k++) buf[k] = r() * 2 - 1;
  let idx = 0;
  add(t0, dur, () => {
    const a = buf[idx];
    const b = buf[(idx + 1) % N];
    buf[idx] = decay * (bright * a + (1 - bright) * b);
    idx = (idx + 1) % N;
    return buzz ? Math.tanh(a * (1 + buzz * 4)) : a;
  }, gain);
};
const bell = (t0, f, dur, gain) =>
  add(t0, dur, (t) =>
    [1, 2, 2.76, 5.4, 8.93].reduce((s, p, k) => s + Math.sin(2 * Math.PI * f * p * t) * [1, 0.45, 0.35, 0.15, 0.08][k] * Math.exp(-t / (dur / (1 + k * 0.7))), 0), gain);

// ---- instruments ----
const play = {
  flute: (t, f, d, s) =>
    add(t, d + 0.3, (x, k) => {
      const vib = 1 + 0.004 * Math.sin(2 * Math.PI * 5.2 * x);
      const ph = 2 * Math.PI * f * 2 * vib * x;
      const e = x < 0.08 ? x / 0.08 : x > d ? Math.max(0, 1 - (x - d) / 0.3) : 1;
      return (Math.sin(ph) + 0.15 * Math.sin(2 * ph) + 0.03 * (rng(k + s)() - 0.5)) * e;
    }, 0.22),
  veena: (t, f, d, s) => pluck(t, f, 1.8, { decay: 0.997, bright: 0.45, gain: 0.5, seed: s }),
  sitar: (t, f, d, s) => pluck(t, f * 2, 1.6, { decay: 0.998, bright: 0.7, gain: 0.32, buzz: 0.6, seed: s }),
  bells: (t, f, d) => bell(t, f * 2, 2.2, 0.16),
  orchestra: (t, f, d, s) => {
    add(t, d + 0.4, (x) => {
      const e = Math.min(1, x / 0.05) * (x > d ? Math.max(0, 1 - (x - d) / 0.4) : 1);
      let v = 0;
      for (const det of [0.997, 1, 1.003]) v += ((((f * 2 * det * x) % 1) + 1) % 1) * 2 - 1; // saws
      return (v / 3) * e;
    }, 0.09);
    pluck(t, f, 1.2, { decay: 0.995, bright: 0.5, gain: 0.25, seed: s + 7 });
  },
};

// ---- percussion (tabla-like) ----
const dha = (t, g = 0.55) =>
  add(t, 0.45, (x) => Math.sin(2 * Math.PI * (70 + 90 * Math.exp(-x / 0.04)) * x) * Math.exp(-x / 0.18), g);
const na = (t, g = 0.22) =>
  add(t, 0.12, (x) => (Math.sin(2 * Math.PI * 520 * x) + 0.6 * Math.sin(2 * Math.PI * 1040 * x)) * Math.exp(-x / 0.035), g);
const bigDrum = (t) => {
  const r = rng(99);
  add(t, 1.6, (x) => Math.sin(2 * Math.PI * (38 + 30 * Math.exp(-x / 0.08)) * x) * Math.exp(-x / 0.5), 0.95);
  add(t, 0.08, (x) => (r() * 2 - 1) * Math.exp(-x / 0.02), 0.4);
};

// ---- tanpura drone: Pa, Sa', Sa', Sa cycle across the whole piece ----
{
  const cyc = [noteFreq(3, -1), noteFreq(0), noteFreq(0), noteFreq(0, -1)];
  let k = 0;
  for (let t = 0; t < total; t += 0.95, k++) pluck(t, cyc[k % 4], 3.2, { decay: 0.9993, bright: 0.5, gain: 0.12, buzz: 0.3, seed: 500 + k });
}

// ---- chapters ----
for (const c of chapters) {
  const r = rng(1000 + c.i);
  const impact = c.start + 4 / FPS;
  bigDrum(impact);
  bell(impact, 196, 3.5, 0.3);
  const sub = c.i >= 3 ? 2 : 1; // later eras: eighth-note melody
  let deg = 5; // start on upper Sa
  for (let b = 0; b < data.beatsPerChapter; b++) {
    const t = c.start + b * c.beat;
    // theka: dha on 1 & 3, na on 2 & 4, extra ticks as tempo rises
    if (b > 0) (b % 4 === 0 || b % 4 === 2 ? dha : na)(t);
    if (c.i >= 2) na(t + c.beat / 2, 0.1);
    if (b < 1) continue; // let the stamp breathe
    for (let s = 0; s < sub; s++) {
      if (b === data.beatsPerChapter - 1 && s > 0) break;
      deg += Math.round((r() - 0.5) * 4);
      deg = Math.max(0, Math.min(9, deg));
      if (b % 4 === 0 && s === 0) deg = r() < 0.5 ? 5 : 3; // land on Sa or Pa at each bar
      play[c.instrument](t + (s * c.beat) / sub, noteFreq(deg), (c.beat / sub) * 0.9, 2000 + c.i * 100 + b * 4 + s);
    }
  }
}
// outro: final Sa bell + drum
const endT = chapters.at(-1).start + chapters.at(-1).beat * data.beatsPerChapter;
bigDrum(endT);
bell(endT, noteFreq(0), data.outroSec + 0.5, 0.35);

// ---- master: normalise, soft clip, fade, write 16-bit WAV ----
let peak = 0;
for (const v of out) peak = Math.max(peak, Math.abs(v));
const n = Math.floor(total * SR);
const pcm = Buffer.alloc(44 + n * 2);
for (let k = 0; k < n; k++) {
  const fade = Math.min(1, (n - k) / (SR * 0.8));
  const v = Math.tanh((out[k] / peak) * 1.2) * 0.9 * fade;
  pcm.writeInt16LE(Math.round(v * 32767), 44 + k * 2);
}
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + n * 2, 4); pcm.write("WAVE", 8); pcm.write("fmt ", 12);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(n * 2, 40);
mkdirSync(join(root, "public"), { recursive: true });
writeFileSync(join(root, "public/chronicle-score.wav"), pcm);
console.log(`chronicle-score.wav: ${total.toFixed(2)} s, ${chapters.length} chapters, BPM ${chapters.map((c) => c.bpm).join("→")}`);
