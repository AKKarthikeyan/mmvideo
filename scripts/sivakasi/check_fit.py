"""List regional lines that do not fit their English slot at the speed cap (hi 1.20, ta/te 1.10). Unique by text. Writes flagged_<tag>.json."""
import json, sys, wave, os
R = "/Volumes/DarwinSSD/MMVideo/docs/geo/research/SV01-sivakasi-fireworks/voice"; CAP = {"hi": 1.20, "ta": 1.10, "te": 1.10}; GAP, LEAD = 0.20, 0.10
def dur(p):
    w = wave.open(p); n = w.getnframes() / w.getframerate(); w.close(); return n
out = {}; tag = sys.argv[1] if len(sys.argv) > 1 else "x"
for lang in CAP:
    seen = {}
    for n in ("paradox_v1", "long_road_v1"):
        tl = json.load(open(f"{R}/{n}/timeline.json")); fps = tl["fps"]; sp = [s for s in tl["scenes"] if s["vo"].strip()]; tr = json.load(open(f"{R}/{n}/translations/{lang}.json"))["scenes"]
        for i, s in enumerate(sp):
            p = f"{R}/{n}/tracks/{lang}/{s['id']}.wav"
            if not os.path.exists(p): continue
            nxt = (sp[i + 1]["from"] / fps + LEAD) if i + 1 < len(sp) else tl["total"] / fps
            slot = nxt - GAP - (s["from"] / fps + LEAD); L = dur(p); t = tr[s["id"]]["text"]
            r = seen.setdefault(t, {"slot": slot, "len": L}); r["slot"] = min(r["slot"], slot)
    bad = {t: {"slot": round(v["slot"], 2), "len": round(v["len"], 2), "need": round(1.03 * v["slot"] * CAP[lang] / v["len"], 2), "speed": round(v["len"] / v["slot"], 2)} for t, v in seen.items() if v["len"] / v["slot"] > CAP[lang]}
    out[lang] = bad; print(lang, len(bad), "of", len(seen), "unique lines over the cap", "worst speed", max([v["speed"] for v in bad.values()] or [0]))
json.dump({l: b for l, b in out.items()}, open(f"flagged_{tag}.json", "w"), ensure_ascii=False, indent=0)
