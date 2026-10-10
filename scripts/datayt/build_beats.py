#!/usr/bin/env python3
"""Data Kadai "beat" Shorts: one thing on screen at a time, very large type, a cut every bar or two.
Built after the Shorts benchmark (docs/datakadai/SHORTS_BENCHMARK.md) to sit beside the all-states templates.

  clues       Guess the state from five clues, hardest first, then a 3-2-1 and the reveal
  countdown   Top five, one state per beat from #5 to #1, then the all-states map as the closing beat
  versus      State against state across five categories, with a running score

One story = one config, public/datayt/beats/configs/<id>.json. Data specs are the same as build_story.py
({"nfhs": id}, {"plfs": [...]}, {"values": {...}}), plus {"coverage": key} for the mobile-coverage table.
Every claim in a clue ("highest", "lowest") is checked against the data before anything is voiced.
Writes public/datayt/beats/<id>/data.json, music.wav, narration and src/datayt/beatData.ts. Template: src/datayt/BeatStory.tsx.
Run from the repo root: python3 scripts/datayt/build_beats.py <id> [...]
"""
import glob, json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import music_shorts as M
import voice_dk as V
from build_india_shorts import PALETTES
from build_mapped import ALIAS as GEO_ALIAS, NUDGE, GEO
from build_story import series as base_series, fmt, SHORT

FPS, VO_LEAD = 30, 0.12
MIN_BARS = {"hook": 2, "clue": 2, "count": 1, "reveal": 2, "recap": 2, "rank": 2, "map": 2, "versus": 2, "score": 2, "end": 2}
geo = lambda s: GEO_ALIAS.get(s, s)
nm = lambda s: SHORT.get(s, s)
SAY = {"NCT of Delhi": "Delhi", "Jammu and Kashmir": "Jammu and Kashmir", "Dadra & Nagar Haveli and Daman & Diu": "Dadra, Nagar Haveli, Daman and Diu"}
say = lambda s: SAY.get(s, s)


def series(spec):
    if "coverage" in spec:
        d = json.load(open("public/datayt/coverage/mobile_coverage_2026-02-28.json"))["states"]
        return {s: r[spec["coverage"]] for s, r in d.items()}, None
    return base_series(spec)


def find(vals, state):
    """The value for a state whatever spelling the dataset uses."""
    for k in (state, geo(state), next((a for a, g in GEO_ALIAS.items() if g == state), state)):
        if k in vals:
            return vals[k]
    raise SystemExit(f"no value for {state}")


def build(cfg):
    sid, typ = cfg["id"], cfg["type"]
    pal = PALETTES[cfg.get("palette", "A")]
    d = f"public/datayt/beats/{sid}"; os.makedirs(d, exist_ok=True)
    beats = [{"kind": "hook", "lines": cfg["hook"], "vo": cfg.get("hook_vo") or " ".join(cfg["hook"]).replace("*", "")}]
    extra = {}
    if typ == "clues":
        st = cfg["state"]
        for i, c in enumerate(cfg["clues"]):
            vals, _ = series(c["data"]); v = find(vals, st)
            if c.get("claim") in ("highest", "lowest"):
                rk = sorted(vals.values(), reverse=c["claim"] == "highest")
                lead = abs(rk[0] - rk[1])
                assert rk[0] == v and lead >= c.get("min_lead", 0.5), f"{sid} clue {i + 1}: {st} is not clearly the {c['claim']} ({v} vs {rk[:3]})"
            big = c.get("big") or fmt(v, c.get("unit", "%"))
            beats.append({"kind": "clue", "n": i + 1, "of": len(cfg["clues"]), "big": big, "text": c["text"], "vo": c.get("vo") or f"Clue {i + 1}. {c['text']}"})
        beats.append({"kind": "count", "text": "Which state?", "vo": "Which state is it?"})
        beats.append({"kind": "reveal", "name": nm(st), "geo": geo(st), "sub": cfg.get("reveal_sub", ""), "vo": f"It's {say(st)}!"})
        beats.append({"kind": "recap", "name": nm(st), "geo": geo(st), "items": [{"big": b["big"], "text": b["text"]} for b in beats if b["kind"] == "clue"],
                      "vo": cfg.get("recap_vo", "How many clues did you need?")})
    elif typ == "countdown":
        vals, india = series(cfg["data"]); unit = cfg.get("unit", "%")
        rk = sorted(vals.items(), key=lambda x: -x[1])
        assert rk[0][1] - rk[1][1] >= cfg.get("min_lead", 1.0), f"{sid}: lead of #1 is under the minimum"
        top = rk[:5]
        for i in range(4, -1, -1):
            s_, v = top[i]
            beats.append({"kind": "rank", "rank": i + 1, "name": nm(s_), "geo": geo(s_), "big": fmt(v, unit), "frac": v / top[0][1], "label": cfg["label"],
                          "vo": (f"{['One', 'Two', 'Three', 'Four', 'Five'][i]}: {say(s_)}, {v:g}." if i else f"Number one: {say(s_)}, {v:g} percent.")})
        asc = sorted(vals, key=lambda s_: (vals[s_], s_)); n = len(asc)
        extra["map"] = [{"name": geo(s_), "label": fmt(vals[s_], ""), "bucket": min(4, i * 5 // n), "nudge": NUDGE.get(geo(s_), (0, 0))} for i, s_ in enumerate(asc)]
        beats.append({"kind": "map", "title": cfg["map_title"], "sub": f"India {fmt(india, unit)}" if india is not None else "",
                      "vo": cfg.get("map_vo") or (f"Every state, mapped. India: {india:g} percent." if india is not None else "Every state, mapped.")})
    elif typ == "versus":
        a, b = cfg["a"], cfg["b"]; sa = sb = 0
        for c in cfg["categories"]:
            vals, _ = series(c["data"]); va, vb = find(vals, a), find(vals, b)
            assert va != vb, f"{sid}: {c['label']} is a tie"
            high = c.get("better", "high") == "high"
            win = "a" if (va > vb) == high else "b"
            sa += win == "a"; sb += win == "b"
            u = c.get("unit", "%")
            beats.append({"kind": "versus", "label": c["label"], "note": "higher is better" if high else "lower is better", "a": fmt(va, u), "b": fmt(vb, u), "win": win, "sa": sa, "sb": sb,
                          "vo": c.get("vo") or f"Round {len([x for x in beats if x['kind'] == 'versus']) + 1}, {c['say']}: {say(a if win == 'a' else b)}."})
        lead = a if sa > sb else b
        beats.append({"kind": "score", "sa": sa, "sb": sb, "vo": f"Final score: {say(lead)} {max(sa, sb)}, {say(b if lead == a else a)} {min(sa, sb)}."})
        extra["a"] = {"name": nm(a), "geo": geo(a)}; extra["b"] = {"name": nm(b), "geo": geo(b)}
    else:
        raise SystemExit(f"{sid}: unknown type {typ}")
    beats.append({"kind": "end", "q": cfg["end"]["q"], "sub": cfg["end"]["sub"], "vo": cfg["end"].get("vo") or f"{cfg['end']['q']} {cfg['end']['sub']}"})
    for bt in beats:
        g = bt.get("geo")
        assert g is None or g in GEO, f"{sid}: {g} is not on the map"

    t, vo = 0.0, []
    for i, bt in enumerate(beats):
        need = 0
        if bt.get("vo"):
            fn, dur = V.say(bt["vo"], f"{d}/vo_{i:02d}")
            vo.append({"file": fn, "sec": dur, "at": round(t + VO_LEAD, 3), "text": bt["vo"]})
            need = dur + VO_LEAD + 0.3
        nb = max(MIN_BARS[bt["kind"]], math.ceil(need / M.BAR))
        bt["t0"], bt["t1"] = round(t, 3), round(t + nb * M.BAR, 3); t += nb * M.BAR
    total = round(t + 0.4, 3)
    out = {"id": sid, "type": typ, "chip": cfg["chip"], "sourceShort": cfg["source_short"], "source": cfg["source"], "accent": pal["accent"], "accent2": pal["accent2"],
           "bands": pal["bands"], "beats": beats, "total": total, "fps": FPS, "beat": M.BEAT, **extra, "vo": vo, "voiceEngine": V.ENGINE, "voice": V.VOICE,
           "ytTitle": cfg.get("yt_title", "")}
    json.dump(out, open(f"{d}/data.json", "w"), indent=1, ensure_ascii=False)
    hits = [bt["t0"] for bt in beats if bt["kind"] in ("reveal", "score", "map") or (bt["kind"] == "rank" and bt["rank"] == 1)]
    drop_at = hits[0] if hits else beats[-1]["t0"]
    M.make(f"{d}/music.wav", total, seed=sum(map(ord, sid)) % 50, hits=hits, ticks=[bt["t0"] for bt in beats], drop=(drop_at - M.BEAT * 2, drop_at))
    print(f"{sid}: {typ} · {len(beats)} beats · {total:.1f}s · voice {V.ENGINE}")


def write_registry():
    ids = sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob("public/datayt/beats/*/data.json"))
    lines = ["// Generated by scripts/datayt/build_beats.py: every built beat Short, for the Remotion registry."]
    lines += [f'import {i} from "../../public/datayt/beats/{i}/data.json";' for i in ids]
    lines += ['import type {BeatData} from "./BeatStory";', "", f"export const BEATS = [{', '.join(ids)}] as unknown as BeatData[];", ""]
    open("src/datayt/beatData.ts", "w").write("\n".join(lines))


if __name__ == "__main__":
    want = set(sys.argv[1:])
    for f in sorted(glob.glob("public/datayt/beats/configs/*.json")):
        cfg = json.load(open(f))
        if not want or cfg["id"] in want:
            build(cfg)
    write_registry()
