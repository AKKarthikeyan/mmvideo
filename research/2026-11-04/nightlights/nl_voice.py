"""Voice the DATA-nl Shorts and time each scene from its line.

Each state's six lines (public/datayt/nightlights/vo/<ID>.json, from nl_scripts.py) are voiced one by one with the house
voice (scripts/datayt/voice_dk.py: MiniMax speech-2.6-hd, English_Diligent_Man; 06:45-22:10 IST only). Scene starts
come from the line lengths and go to public/datayt/nightlights/vo.json, which src/datayt/NightLights.tsx reads.

Run on the Mini from the repo root, inside the login shell so the key loads:
  zsh -lic '.venv/bin/python research/2026-11-04/nightlights/nl_voice.py [ID ...]'
  .venv/bin/python research/2026-11-04/nightlights/nl_voice.py --check   # no voice call: timing from 2.7 words/s
"""
import json, pathlib, sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[2]
PUB = ROOT / "public" / "datayt" / "nightlights"
sys.path.insert(0, str(ROOT / "scripts" / "datayt"))
GAP, LEAD, TAIL = 0.35, 0.4, 2.2  # seconds between lines, before the first, after the last
WIPE = 2.4  # the wipe needs this long before the multiple can land


def timeline(secs):
    """Scene starts (s) from the six line lengths: hook, wipe, num, lit, rbi, map; end = the question."""
    t, starts = LEAD, []
    for i, d in enumerate(secs):
        if i == 2: t = max(t, starts[1] + WIPE)
        starts.append(round(t, 3)); t += d + GAP
    hook, wipe, num, lit, rbi, mp = starts
    return {"hook": 0, "wipe": wipe, "num": num, "lit": lit, "rbi": rbi, "map": mp,
            "end": round(mp + secs[5] * 0.55, 3), "total": round(mp + secs[5] + TAIL, 3)}, starts


def merge():
    """vo.json = every state voiced so far (the composition reads this one file)."""
    out = {p.parent.name: json.load(open(p)) for p in sorted((PUB / "vo").glob("*/timing.json"))}
    json.dump(out, open(PUB / "vo.json", "w"), indent=0)
    print("vo.json:", len(out), "states voiced")


def main():
    check = "--check" in sys.argv
    if "--merge" in sys.argv: return merge()
    ids = [a for a in sys.argv[1:] if not a.startswith("--")] or sorted(p.stem for p in (PUB / "vo").glob("*.json"))
    if not check:
        import voice_dk as V
        if V.ENGINE != "minimax": sys.exit("MINIMAX_API_KEY not loaded: run inside zsh -lic (06:45-22:10 IST)")
    for sid in ids:
        lines = json.load(open(PUB / "vo" / f"{sid}.json"))
        if check:
            files, secs = [None] * len(lines), [len(l.split()) / 2.7 for l in lines]
        else:
            d = PUB / "vo" / sid; d.mkdir(exist_ok=True)
            got = [V.say(l, str(d / f"vo_{i}")) for i, l in enumerate(lines)]
            files, secs = [f"vo/{sid}/{fn}" for fn, _ in got], [s for _, s in got]
        T, starts = timeline(secs)
        print(f"{sid}: {T['total']:.1f} s" + (" (estimate)" if check else ""))
        if T["total"] > 45: print(f"  WARNING {sid} runs {T['total']:.1f} s, over 45")
        if not check:  # one timing file per state, so parallel runs never overwrite each other
            json.dump({"T": T, "vo": [{"file": f, "at": a, "sec": round(s, 3)} for f, a, s in zip(files, starts, secs)]},
                      open(PUB / "vo" / sid / "timing.json", "w"), indent=0)
    if not check: merge()


if __name__ == "__main__":
    main()
