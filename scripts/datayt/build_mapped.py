#!/usr/bin/env python3
"""Data Kadai MAPPED Shorts: every state's number on the India map, band by band (the Tamil Nadu alcohol-map format
for all of India). One story = one config file, public/datayt/mapped/configs/<id>.json:

  id, chip, source, source_short        text for the chrome and the end card
  values {state: number}                 or  dataset {file, key}: a JSON file with states[state][key]
  bands [upper bounds], band_labels      5 bands, low to high; a state falls in the first band whose bound it does not exceed
  palette "A".."O"                       map palette (build_india_shorts.PALETTES)
  title [lines], headline [lines], sub   title card, then the persistent header above the map (*accent*)
  top {kicker, title, sub}, insight {big, text, focus[]}, end {q, sub}
  vo {scene: narration}                  scenes: title, draw, b0..b4, all, top, insight, end

Writes public/datayt/mapped/<id>/data.json, music.wav and the narration files, and src/datayt/mappedData.ts.
Run from the repo root: python3 scripts/datayt/build_mapped.py <id> [...]
"""
import glob, json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import music_shorts as M
import voice_dk as V
from build_india_shorts import PALETTES

GEO = {s["name"]: s for s in json.load(open("public/datayt/india/geo.json"))["states"]}
ALIAS = {"Delhi": "NCT of Delhi", "Dadra and Nagar Haveli and Daman and Diu": "Dadra & Nagar Haveli and Daman & Diu",
         "Jammu & Kashmir": "Jammu and Kashmir", "Andaman & Nicobar Islands": "Andaman and Nicobar Islands"}
SHORT = {"Andaman and Nicobar Islands": "Andaman & Nicobar", "Dadra & Nagar Haveli and Daman & Diu": "DNH & Daman Diu", "NCT of Delhi": "Delhi",
         "Jammu and Kashmir": "J&K", "Arunachal Pradesh": "Arunachal", "Himachal Pradesh": "Himachal", "Madhya Pradesh": "Madhya Pradesh"}
# Where each state's number sits (map units from its label point). Small or crowded states get a leader line to open space.
NUDGE = {"Chandigarh": (130, -75), "NCT of Delhi": (-215, -35), "Sikkim": (0, -62), "Nagaland": (78, 8), "Meghalaya": (-76, 52),
         "Manipur": (88, 24), "Mizoram": (72, 56), "Tripura": (-32, 72), "Goa": (-82, 0), "Dadra & Nagar Haveli and Daman & Diu": (-84, 16),
         "Puducherry": (96, 0), "Lakshadweep": (-30, -62), "Andaman and Nicobar Islands": (-78, 0), "Kerala": (-72, 30),
         "Assam": (-26, -10), "Haryana": (-8, 6), "Punjab": (-6, 0)}
VO_LEAD, FPS = 0.15, 30
MIN_BARS = {"title": 2, "draw": 1, "b0": 2, "b1": 2, "b2": 2, "b3": 2, "b4": 2, "all": 2, "top": 2, "insight": 2, "end": 2}


def fmt(v, unit):
    return (f"{v:,.0f}" if float(v).is_integer() else f"{v:,.1f}") + unit


def build(cfg):
    sid = cfg["id"]; unit = cfg.get("unit", "")
    if "values" in cfg:
        vals = cfg["values"]
    else:
        ds = json.load(open(cfg["dataset"]["file"]))
        vals = {s: r[cfg["dataset"]["key"]] for s, r in ds["states"].items()}
    vals = {ALIAS.get(s, s): v for s, v in vals.items() if v is not None}
    unknown = set(vals) - set(GEO)
    assert not unknown, f"{sid}: states not on the map: {unknown}"
    if "check_total" in cfg:
        assert abs(sum(vals.values()) - cfg["check_total"]) < 1e-6, (sid, sum(vals.values()), cfg["check_total"])
    bounds = cfg["bands"]; pal = PALETTES[cfg.get("palette", "A")]
    bucket = lambda v: next((i for i, b in enumerate(bounds) if v <= b), len(bounds))
    assert len(bounds) == 4 and len(cfg["band_labels"]) == 5

    d = f"public/datayt/mapped/{sid}"; os.makedirs(d, exist_ok=True)
    vo = {}
    for sec, tx in cfg.get("vo", {}).items():
        fn, dur = V.say(tx, f"{d}/vo_{sec}")
        vo[sec] = {"sec_name": sec, "text": tx, "file": fn, "sec": dur}
    # one state appears every half beat inside its band's scene; a scene is as long as its narration or its reveals need
    members = {i: sorted([s for s in vals if bucket(vals[s]) == i], key=lambda s: (vals[s], s)) for i in range(5)}
    T, t = {}, 0.0
    for name in MIN_BARS:
        need = vo[name]["sec"] + VO_LEAD + 0.35 if name in vo else 0
        if name[0] == "b" and name[1:].isdigit():
            need = max(need, M.BEAT * (1.5 + len(members[int(name[1:])]) / 2))
        nb = max(MIN_BARS[name], math.ceil(need / M.BAR))
        T[name] = [round(t, 3), round(t + nb * M.BAR, 3)]; t += nb * M.BAR
    for sec in vo:
        vo[sec]["at"] = round(T[sec][0] + VO_LEAD, 3)
    total = round(t + 0.5, 3)
    states = []
    for i in range(5):
        for j, s in enumerate(members[i]):
            states.append({"name": s, "short": SHORT.get(s, s), "v": vals[s], "label": fmt(vals[s], unit), "bucket": i,
                           "at": round(T[f"b{i}"][0] + M.BEAT + j * M.BEAT / 2, 3), "nudge": NUDGE.get(s, (0, 0))})
    rank = sorted(vals, key=lambda s: -vals[s])
    out = {"id": sid, "series": "Mapped", "chip": cfg.get("chip", "MAPPED"), "sourceShort": cfg["source_short"], "source": cfg["source"],
           "title": cfg["title"], "titleSub": cfg.get("title_sub"), "headline": cfg["headline"], "sub": cfg.get("sub", ""), "unit": unit,
           "bands": [{"label": cfg["band_labels"][i], "color": pal["bands"][i], "count": len(members[i])} for i in range(5)],
           "accent": pal["accent"], "accent2": pal["accent2"], "palette": cfg.get("palette", "A"),
           "states": states, "nodata": sorted(set(GEO) - set(vals)), "t": T, "total": total, "fps": FPS,
           "top": rank[:5], "topText": cfg["top"], "max": max(vals.values()), "insight": cfg["insight"], "end": cfg["end"],
           "draw": cfg.get("draw", {}), "all": cfg.get("all", {}), "bandNotes": cfg.get("band_notes", []),
           "vo": list(vo.values()), "voiceEngine": V.ENGINE, "voice": V.VOICE, "ytTitle": cfg.get("yt_title", "")}
    json.dump(out, open(f"{d}/data.json", "w"), indent=1, ensure_ascii=False)
    ticks = [s["at"] for s in states]
    M.make(f"{d}/music.wav", total, seed=sum(map(ord, sid)) % 50, hits=[T["top"][0], T["insight"][0], T["end"][0]], ticks=ticks,
           drop=(T["insight"][0] - M.BEAT * 2, T["insight"][0]))
    print(f"{sid}: {len(states)} states · {total:.1f}s · bands {[len(members[i]) for i in range(5)]} · no data {out['nodata']} · voice {V.ENGINE}")


def write_registry():
    ids = sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob("public/datayt/mapped/*/data.json"))
    lines = ["// Generated by scripts/datayt/build_mapped.py: every built MAPPED Short, for the Remotion registry."]
    lines += [f'import {i} from "../../public/datayt/mapped/{i}/data.json";' for i in ids]
    lines += ['import type {MappedData} from "./IndiaMapped";', "", f"export const MAPPED = [{', '.join(ids)}] as unknown as MappedData[];", ""]
    open("src/datayt/mappedData.ts", "w").write("\n".join(lines))


if __name__ == "__main__":
    want = set(sys.argv[1:])
    for f in sorted(glob.glob("public/datayt/mapped/configs/*.json")):
        cfg = json.load(open(f))
        if not want or cfg["id"] in want:
            build(cfg)
    write_registry()
