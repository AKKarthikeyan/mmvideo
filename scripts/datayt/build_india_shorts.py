#!/usr/bin/env python3
"""Data YT India Shorts: per-Short data + timeline + original music.

Reads public/datayt/nfhs6/nfhs6_states.json and writes, for each Short in SHORTS:
  public/datayt/shorts/<id>/data.json   values for every state, colour bands, answer, options, top 5, beats
  public/datayt/shorts/<id>/music.wav   code-composed score (scripts/datayt/music_shorts.py) synced to the beats
Run from the repo root: python3 scripts/datayt/build_india_shorts.py [id ...]
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from nfhs6_meta import META, SHORT_NAME
import music_shorts as M

DATA = json.load(open("public/datayt/nfhs6/nfhs6_states.json"))["states"]
NO_RANK = {"India", "Lakshadweep"}
UTS = {"Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Jammu and Kashmir", "Ladakh",
       "Lakshadweep", "NCT of Delhi", "Puducherry"}

# Guess the State series. side = which end of the ranking the answer sits at.
SHORTS = [
    dict(id="gts01", ind=10, answer="Meghalaya", decoys=["Kerala", "Goa"], side="top",
         hook=["In one Indian state,", "*women* own the land."], q="Which state?"),
    dict(id="gts02", ind=100, answer="Arunachal Pradesh", decoys=["Goa", "Kerala"], side="top",
         hook=["In one state,", "*1 in 4 women* drink alcohol."], q="Which state?"),
    dict(id="gts03", ind=99, answer="Mizoram", decoys=["Bihar", "Uttar Pradesh"], side="top",
         hook=["In one state,", "*3 in 4 men* use tobacco."], q="Which state?"),
    dict(id="gts04", ind=98, answer="Mizoram", decoys=["Tripura", "Bihar"], side="top",
         hook=["Here, *6 in 10 women*", "use tobacco."], q="Which state?"),
    dict(id="gts05", ind=18, answer="Sikkim", decoys=["Kerala", "Goa"], side="bottom", states_only=True,
         hook=["Of 28 states, in one the average", "woman has just *1 child*."], q="Which state?"),
    dict(id="gts06", ind=24, answer="Telangana", decoys=["Kerala", "Tamil Nadu"], side="top",
         hook=["The state where *men*", "get sterilised."], q="Which state?"),
    dict(id="gts07", ind=39, answer="Jammu and Kashmir", decoys=["Telangana", "Kerala"], side="top",
         hook=["*9 in 10* private-hospital births", "here are C-sections."], q="Which state?"),
    dict(id="gts08", ind=17, answer="Bihar", decoys=["Rajasthan", "Uttar Pradesh"], side="top",
         hook=["*3 in 10 men* here marry", "before 21."], q="Which state?"),
]

# Beat grid (bars at 124 BPM): hook, quiz, reveal, fill, top5, end
BARS = [("hook", 2), ("quiz", 2), ("reveal", 2), ("fill", 2), ("top", 3), ("end", 2)]
BANDS = ["#26306B", "#5A3D9E", "#A8429A", "#EE5D6C", "#FFC15E"]   # low -> high on the dark background


def num(x):
    s = str(x)
    if s.startswith("(") or s in ("*", "na", "-"):
        return None
    try:
        return float(s)
    except ValueError:
        return None


def build(sh):
    k = sh["ind"]; lab = META[k][0]
    unit = "" if k == 18 else "%"
    vals = {s: num(r.get(str(k), [None] * 3)[2]) for s, r in DATA.items() if s != "India"}
    vals = {s: v for s, v in vals.items() if v is not None}
    skip = NO_RANK | (UTS if sh.get("states_only") else set())
    ranked = sorted([(v, s) for s, v in vals.items() if s not in skip], reverse=(sh["side"] == "top"))
    assert ranked[0][1] == sh["answer"], (sh["id"], ranked[:3])
    india = num(DATA["India"][str(k)][2]); india5 = num(DATA["India"][str(k)][3])
    # 5 colour bands by rank (quantiles) so every Short gets a full-colour map
    srt = sorted(vals.values())
    cuts = [srt[int(len(srt) * q)] for q in (0.2, 0.4, 0.6, 0.8)]
    band = lambda v: sum(v >= c for c in cuts)
    T, t = {}, 0.0
    for name, nb in BARS:
        T[name] = [round(t, 3), round(t + nb * M.BAR, 3)]; t += nb * M.BAR
    total = round(t + 0.6, 3)
    order = sorted(vals, key=lambda s: vals[s])
    fill_at = {s: round(T["fill"][0] + M.BEAT * 0.5 + i * (M.BAR * 1.2 / len(order)), 3) for i, s in enumerate(order)}
    opts = [sh["answer"]] + sh["decoys"]
    opts = [opts[i] for i in ((1, 0, 2) if sh["id"][-1] in "13579" else (2, 1, 0) if sh["id"][-1] in "24" else (0, 2, 1))]
    nm = lambda s: SHORT_NAME.get(s, s)
    out = {"id": sh["id"], "series": "Guess the State", "ind": k, "label": lab, "unit": unit, "hook": sh["hook"], "q": sh["q"],
           "answer": sh["answer"], "answerName": nm(sh["answer"]), "options": [nm(o) for o in opts], "optionKeys": opts,
           "answerIndex": opts.index(sh["answer"]), "value": vals[sh["answer"]], "india": india, "india5": india5,
           "values": vals, "band": {s: band(v) for s, v in vals.items()}, "bands": BANDS,
           "bandLabels": [f"< {cuts[0]:g}{unit}"] + [f"{cuts[i]:g}–{cuts[i + 1]:g}{unit}" for i in range(3)] + [f"{cuts[3]:g}{unit}+"],
           "top": [{"name": nm(s), "key": s, "v": v} for v, s in ranked[:5]],
           "other": {"name": nm(ranked[-1][1]), "v": ranked[-1][0]}, "side": sh["side"], "statesOnly": bool(sh.get("states_only")),
           "t": T, "total": total, "fillAt": fill_at, "fps": 30,
           "source": "NFHS-6 (2023-24), IIPS · state fact sheets"}
    d = f"public/datayt/shorts/{sh['id']}"
    os.makedirs(d, exist_ok=True)
    json.dump(out, open(f"{d}/data.json", "w"), indent=1)
    beat = lambda s, n: T[s][0] + n * M.BEAT
    ticks = [beat("quiz", i) for i in (0, 1, 2)] + [beat("quiz", 4), beat("quiz", 5), beat("quiz", 6)] + \
            list(fill_at.values())[::2] + [beat("top", 1 + i) for i in range(5)]
    seed = int(sh["id"][-2:])
    M.make(f"{d}/music.wav", total, seed=seed, hits=[T["reveal"][0], T["end"][0]], ticks=ticks,
           drop=(T["quiz"][1] - M.BEAT * 2, T["quiz"][1]))
    print(f"{sh['id']}: {nm(sh['answer'])} {vals[sh['answer']]}{unit} (India {india}{unit}) · {total:.1f}s · options {out['options']}")
    return out


if __name__ == "__main__":
    want = set(sys.argv[1:])
    reg = []
    for sh in SHORTS:
        if not want or sh["id"] in want:
            build(sh)
        reg.append({"id": sh["id"]})
    json.dump(reg, open("public/datayt/shorts/index.json", "w"))
