#!/usr/bin/env python3
"""Checks a regional narration file against the English scene slots of a film (UPSC long-form).

  python3 -I scripts/upsc/fit_lang.py geo07-p1 hi          # report every scene, exit 1 if any is out of the band
  python3 -I scripts/upsc/fit_lang.py geo07-p1 hi --init   # write a skeleton translations/hi.json from the storyboard

File: public/datayt/long/upsc/<film>/translations/<lang>.json, the Namakkal shape:
  {film, lang, status: "DRAFT", reviewed_by: null, voice, scenes: {sNNN: {en, text, est_sec, slot_sec, flag, notes}}}
slot_sec = the English scene's speech time in the timeline (scene dur minus the 0.5 s lead-out). est_sec = spoken characters
(letters and marks, no spaces or punctuation) / the language's rate, measured on the Namakkal draft tracks (median chars a
second: hi 11.1 Gemini Charon, ta 13.5 and te 11.0 Maya Siddhant). kn has no measurement yet: the te rate is used until one exists.
Band: est_sec between 80% and 105% of slot_sec. A line may run short and wait; up to 5% over is allowed because the voicing step
may speed a line by up to 5% (the Namakkal tracks did the same, at most 1.03x). Grammar is never clipped to fit.
"""
import json, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RATE = {"hi": 11.3, "ta": 12.5, "te": 10.2, "kn": 11.0}
VOICE = {"hi": "Maya Siddhant", "ta": "Maya Siddhant", "te": "Maya Siddhant", "kn": "not chosen"}
LO, HI = 0.80, 1.05
STRIP = re.compile(r"[\s\.,!?;:।॥\"“”‘’'()\-–—…/]")


def main():
    if len(sys.argv) < 3:
        print(__doc__); return 2
    film, lang = sys.argv[1], sys.argv[2]
    base = os.path.join(ROOT, "public/datayt/long/upsc", film)
    tl = {s["id"]: s for s in json.load(open(os.path.join(base, "timeline.json")))["scenes"]}
    path = os.path.join(base, "translations", f"{lang}.json")
    if "--init" in sys.argv:
        if os.path.exists(path):
            print("exists, not overwritten:", path); return 1
        os.makedirs(os.path.dirname(path), exist_ok=True)
        sc = {k: dict(en=s["vo"], text="", est_sec=0, slot_sec=round(s["dur"] / 30 - 0.5, 2), flag="", notes="") for k, s in tl.items()}
        json.dump(dict(film=film, lang=lang, status="DRAFT", reviewed_by=None, voice=VOICE[lang], scenes=sc), open(path, "w"), ensure_ascii=False, indent=1)
        print("wrote", path); return 0
    D = json.load(open(path, encoding="utf-8"))
    bad, rows = 0, []
    for k, s in tl.items():
        v = D["scenes"].get(k)
        if v is None:
            print(f"  MISSING {k}"); bad += 1; continue
        slot = round(s["dur"] / 30 - 0.5, 2)
        est = round(len(STRIP.sub("", v["text"])) / RATE[lang], 2)
        v["slot_sec"], v["est_sec"] = slot, est
        r = est / slot if slot else 0
        flag = "" if LO <= r <= HI else ("long" if r > HI else "short")
        if not v["text"].strip():
            flag = "empty"
        if re.search(r"\d", v["text"]):
            flag = (flag + " digits").strip()
        v["flag"] = flag
        bad += bool(flag)
        rows.append((k, slot, est, r, flag))
    json.dump(D, open(path, "w"), ensure_ascii=False, indent=1)
    for k, slot, est, r, flag in rows:
        if flag:
            print(f"  {k}: slot {slot:5.2f}s est {est:5.2f}s ({r:4.0%}) {flag}")
    tot_s = sum(r[1] for r in rows); tot_e = sum(r[2] for r in rows)
    print(f"{lang}: {len(rows)} scenes, {bad} outside {LO:.0%}-{HI:.0%} or flagged; total est {tot_e/60:.1f} min of {tot_s/60:.1f} min slots")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
