// The contract between the long-form cartoon engine (LongCartoon.tsx) and the scene components in scenes/*.tsx.
// 1920 x 1080, 30 fps. See CONTRACT.md for every scene kind and its spec.
export const W = 1920, H = 1080, FPS = 30;
// Text and numbers stay inside this box (the engine's caption strip sits at y 930-1016 in draft mode; art may bleed to the edges).
export const SAFE = {x0: 96, x1: 1824, y0: 64, y1: 1016};

// A reference into figures.json: { t: "tfr", state: "Bihar", s: "nfhs6" }. Components never type a figure; they read it with fig().
export type FigRef = {t: string; state: string; s?: string};

export type SceneProps<S = any> = {
  f: number;                      // local frame (0 at the scene's first frame)
  dur: number;                    // the scene's length in frames
  spec: S;                        // the storyboard's spec for this scene kind
  at: (key: string) => number;    // local frame from which the number/label with this key may be drawn (the narrator's word); throws on an unknown key in the real engine
  draft: boolean;
};

export type TimelineScene = {id: string; act: string; kind: string; spec: any; vo: string; from: number; dur: number; reveals: Record<string, number>; transition?: "wipe" | "cut"};
export type Timeline = {id: string; fps: number; total: number; timing: "estimated" | "measured"; scenes: TimelineScene[]};
