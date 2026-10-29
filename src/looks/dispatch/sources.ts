// What Dispatch prints that the shared LookData does not yet carry: per-beat source lines a story's config is missing, and
// the publisher's printed qualifiers ("almost 15%"). Both are applied to a copy of LookData before the plan is made, so
// every page, ghost row and source line reads the same thing.
//
// FOR THE LEAD: the PICK table belongs in each config's look_opts.beatSources (useLookData already reads it, and a
// look_opts entry wins over this table). Each part below must appear word for word in the story's own source text
// (data.json "source"); a part that does not is dropped, and a beat with no part left keeps its default line. So nothing
// here can name a source the data does not.
import type {LookBeat, LookData} from "../shared/types";
import type {Printed} from "./quotes";

const PICK: Record<string, Record<string, string[]>> = {
  cw01: {
    // the hook's 93% is Jan-Sep 2024 (the short source says Jan-Sep 2025), so it names the report, not a period
    spot: ["NielsenIQ", "Storyboard18, 25 Nov 2025"],
    Campa: ["GlobalData, March 2023"],                       // "Campa relaunch and price: GlobalData, March 2023"
    Challengers: ["NielsenIQ", "Storyboard18, 25 Nov 2025"],
    "Coke + Pepsi": ["NielsenIQ", "Storyboard18, 25 Nov 2025"],
    Reply: ["Storyboard18, 25 Nov 2025"],                     // the new ₹10 packs, down from ₹12 and above: Storyboard18's report
    say: ["GlobalData, March 2023", "Storyboard18, 25 Nov 2025"],
  },
};

const keyOf = (b: LookBeat) => b.name ?? b.kind;

// A printed figure keeps the data's own number and adds only the publisher's words in front of it ("almost " + "15%").
const qualified = (label: string, printed: string | undefined) => {
  if (!printed) return null;
  const p = printed.trim();
  if (!p.endsWith(label) || p === label) return null;
  const qual = p.slice(0, p.length - label.length);
  return /^[A-Za-z~ ]+$/.test(qual) ? qual : null;
};

export const withDispatchData = (L: LookData, printed: Printed): LookData => {
  const pick = PICK[L.id] ?? {};
  const own = (L.lookOpts.beatSources ?? {}) as Record<string, string>;
  const srcText = L.D.source ?? "";
  const beats = L.beats.map((b) => {
    let out = b;
    const k = keyOf(b);
    if (!own[k] && pick[k]) {
      const parts = pick[k].filter((p) => srcText.includes(p));
      if (parts.length) out = {...out, src: parts.join(" · ")};
    }
    const pr = printed[b.name ?? ""];
    if (pr) {
      const barsL = out.barsL.map((r) => {
        const q = r.num ? qualified(r.label, pr[r.name]) : null;
        return q && r.num ? {...r, label: q + r.label, num: {...r.num, qual: q + r.num.qual, text: q + r.num.text}} : r;
      });
      let big = out.big;
      // the card's big is one of its bars ("15%" = the Jan-Sep 2025 bar): it takes that bar's printed form
      const bq = big ? qualified(big.text, pr.big) ?? (() => {
        const twin = out.barsL.find((r) => r.num && big && r.num.value === big.value && r.num.unit === big.unit);
        return twin ? qualified(twin.label, pr[twin.name]) : null;
      })() : null;
      if (big && bq) big = {...big, qual: bq + big.qual, text: bq + big.text};
      out = {...out, barsL, big, hero: big ?? out.hero};
    }
    return out;
  });
  return {...L, beats};
};
