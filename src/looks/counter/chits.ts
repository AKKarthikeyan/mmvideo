// Per-beat source chits for stories whose config has no look_opts.beatSources yet. Counter prints a chit on every
// eye-level frame, so one story-wide sourceShort ("NielsenIQ · Jan-Sep 2025") would credit the wrong publisher or period
// on some beats. Every phrase here is taken from the story's own data.json `source` line. A config's look_opts.beatSources
// always wins; move these into the config (cw01.json look_opts.beatSources) when the lead next edits it.
import type {LookBeat, LookData} from "../shared/types";

const CHITS: Record<string, Record<string, string>> = {
  cw01: {
    spot: "NielsenIQ, as reported by Storyboard18 · Jan-Sep 2024",
    Campa: "GlobalData · March 2023",
    Challengers: "NielsenIQ, as reported by Storyboard18 · Jan-Sep 2024 and 2025",
    "Coke + Pepsi": "NielsenIQ, as reported by Storyboard18 · Jan-Sep 2024 and 2025",
    Reply: "Storyboard18 · 25 Nov 2025",
    say: "GlobalData · Storyboard18",
  },
};

export const chitFor = (L: LookData, b: LookBeat): string => {
  const key = b.name ?? b.kind;
  if (L.lookOpts.beatSources?.[key]) return b.src;
  return CHITS[L.id]?.[key] ?? b.src;
};
