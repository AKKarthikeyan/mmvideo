#!/usr/bin/env python3
"""Data Kadai "beat" Shorts: one thing on screen at a time, very large type, a cut every bar or two.
Built after the Shorts benchmark (docs/datakadai/SHORTS_BENCHMARK.md) to sit beside the all-states templates.

  clues       Guess the state from five clues, hardest first, then a 3-2-1 and the reveal
  countdown   Top five, one state per beat from #5 to #1, then the all-states map as the closing beat
  versus      State against state across five categories, with a running score
  paradox     Two official numbers about one state that seem to disagree, a second state for contrast, what the two
              numbers have to do with each other across all states, then every state on the map

One story = one config, public/datayt/beats/configs/<id>.json. Data specs are the same as build_story.py
({"nfhs": id}, {"plfs": [...]}, {"values": {...}}), plus {"coverage": key} for the mobile-coverage table and
{"rbi": [table, year]} for a table of the RBI Handbook of Statistics on Indian States.
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
MIN_BARS = {"hook": 2, "clue": 2, "count": 1, "reveal": 2, "recap": 2, "rank": 2, "map": 2, "versus": 2, "score": 2, "end": 2,
            "spot": 2, "fact": 2, "say": 2, "mapend": 2}
COVERAGE = "public/datayt/coverage/mobile_coverage_2026-02-28.json"
PCT = {"g5_pct": ("g5", "total"), "uncovered_pct": ("uncovered", "total")}
geo = lambda s: GEO_ALIAS.get(s, s)
nm = lambda s: SHORT.get(s, s)
SAY = {"NCT of Delhi": "Delhi", "Jammu and Kashmir": "Jammu and Kashmir", "Dadra & Nagar Haveli and Daman & Diu": "Dadra, Nagar Haveli, Daman and Diu"}
say = lambda s: SAY.get(s, s)


def series(spec):
    if "coverage" in spec:
        d = json.load(open(COVERAGE)); k = spec["coverage"]; tot = d["published_total_row"]
        india = round(100 * tot[PCT[k][0]] / tot[PCT[k][1]], 1) if k in PCT else tot.get(k)
        return {s: r[k] for s, r in d["states"].items()}, india
    if "rbi" in spec:
        no, year = spec["rbi"]
        t = json.load(open(f"public/datayt/sources/rbi_handbook/T{int(no):03d}.json"))
        col = [c for c in t["columns"] if c.split("|")[-1].strip() == year]
        assert len(col) == 1, f"T{int(no):03d}: no single column for {year}"
        v = {s: r[col[0]] for s, r in t["states"].items() if r.get(col[0]) is not None}      # states with no figure that year are left out
        return v, v.pop("India", None)
    return base_series(spec)


def inr(v):
    """Rupees with Indian digit grouping: 387623 -> ₹3,87,623."""
    s = str(int(round(v))); head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:]); head = head[:-2]
    return "₹" + ",".join(([head] if head else []) + parts + [tail])


show = lambda v, unit: inr(v) if unit == "₹" else fmt(v, unit)


def spearman(a, b):
    """Rank correlation of two {state: value} series over the states both have; returns (rho, n)."""
    ks = sorted(set(a) & set(b))
    def ranks(v):
        o = sorted(range(len(v)), key=lambda i: v[i]); r = [0.0] * len(v); i = 0
        while i < len(o):
            j = i
            while j + 1 < len(o) and v[o[j + 1]] == v[o[i]]:
                j += 1
            for k in range(i, j + 1):
                r[o[k]] = (i + j) / 2 + 1
            i = j + 1
        return r
    x, y = ranks([a[k] for k in ks]), ranks([b[k] for k in ks])
    mx, my = sum(x) / len(x), sum(y) / len(y)
    cov = sum((p - mx) * (q - my) for p, q in zip(x, y))
    return cov / math.sqrt(sum((p - mx) ** 2 for p in x) * sum((q - my) ** 2 for q in y)), len(ks)


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
    elif typ == "paradox":
        st0 = cfg["state"]; checked = []
        beats[0].update({"kind": "spot", "geo": geo(st0), "name": nm(st0)})
        for i, c in enumerate(cfg["facts"]):
            vals, india = series(c["data"]); st = c["state"]; v = find(vals, st); u = c.get("unit", "%")
            if c.get("claim") in ("highest", "lowest"):
                rk = sorted(vals.values(), reverse=c["claim"] == "highest")
                assert rk[0] == v and rk[0] != rk[1], f"{sid} fact {i + 1}: {st} is not the {c['claim']} ({v} vs {rk[:3]})"
                checked.append(f"{st} is the {c['claim']} of {len(vals)} with data ({show(v, u)})")
            ctx = {"n": len(vals), "v": show(v, u)}
            bars = [{"name": nm(st), "label": show(v, u), "v": v}]
            for o in c.get("compare", []):
                ov = india if o == "India" else find(vals, o)
                assert ov is not None, f"{sid} fact {i + 1}: no value for {o}"
                bars.append({"name": nm(o), "label": show(ov, u), "v": ov})
            top = c.get("bar_max") or max(x["v"] for x in bars)
            sub = c.get("sub", "")
            if "counts" in c:      # the two counts behind a share, read from the coverage table
                row = json.load(open(COVERAGE))["states"]; r = row.get(st) or row[next(a for a, g in GEO_ALIAS.items() if g == st)]
                a, b = (r[k] for k in c["counts"])
                assert abs(100 * a / b - v) < 0.06, f"{sid} fact {i + 1}: counts do not give {v}"
                sub = f"{a:,} of {b:,} {c.get('counts_unit', 'villages')}"
            beats.append({"kind": "fact", "name": nm(st), "geo": geo(st), "kicker": c["kicker"], "big": show(v, u), "text": c.get("text", "").format(**ctx), "sub": sub.format(**ctx),
                          "bars": [{"name": x["name"], "label": x["label"], "frac": x["v"] / top} for x in bars] if len(bars) > 1 else [], "vo": c["vo"].format(**ctx)})
        for k in cfg.get("checks", []):      # every spoken comparison is recomputed here; a failed check stops the build
            if k["kind"] == "ratio":
                r = find(series(k["num"]["data"])[0], k["num"]["state"]) / find(series(k["den"]["data"])[0], k["den"]["state"])
                assert r >= k["min"], f"{sid}: ratio is {r:.2f}, under {k['min']}"
                checked.append(f"{k['num']['state']} / {k['den']['state']} = {r:.2f} (at least {k['min']})")
            elif k["kind"] == "round":
                vals, india = series(k["data"]); v = india if k["state"] == "India" else find(vals, k["state"])
                assert round(v) == k["equals"], f"{sid}: {k['state']} is {v}, which does not round to {k['equals']}"
                checked.append(f"{k['state']} {v:g} rounds to {k['equals']}")
            else:
                raise SystemExit(f"{sid}: unknown check {k['kind']}")
        so = cfg["so"]; ctx = {}
        if "weak_link" in so:      # "only weakly linked" is voiced only when the rank correlation across states is small
            rho, n = spearman(series(so["weak_link"]["a"])[0], series(so["weak_link"]["b"])[0])
            assert abs(rho) <= so["weak_link"].get("max_abs", 0.3), f"{sid}: rank correlation is {rho:.2f}; 'weakly linked' is not supported"
            ctx = {"n": n, "rho": f"{rho:.2f}"}; checked.append(f"rank correlation across {n} states = {rho:.2f}")
        beats.append({"kind": "say", "lines": [l.format(**ctx) for l in so["lines"]], "vo": so["vo"].format(**ctx)})
        m = cfg["map"]; vals, india = series(m["data"]); unit = m.get("unit", "%")
        asc = sorted(vals, key=lambda s_: (vals[s_], s_)); n = len(asc)
        extra["map"] = [{"name": geo(s_), "label": fmt(vals[s_], ""), "bucket": min(4, i * 5 // n), "nudge": NUDGE.get(geo(s_), (0, 0))} for i, s_ in enumerate(asc)]
        missing = {x["name"] for x in extra["map"]} - set(GEO)
        assert not missing, f"{sid}: states not on the map: {missing}"
        ctx = {"india": fmt(india, unit) if india is not None else ""}
        ring = [geo(x) for x in m.get("ring", [])]
        beats.append({"kind": "map", "title": m["title"], "sub": m.get("sub", "").format(**ctx), "note": m.get("note", ""), "anim": True, "ring": ring, "vo": m["vo"].format(**ctx)})
        extra["checked"] = checked
        cfg["end"] = {"kind": "mapend", "note": m.get("note", ""), "ring": ring, **cfg["end"]}
    else:
        raise SystemExit(f"{sid}: unknown type {typ}")
    e = cfg["end"]
    beats.append({**{k: v for k, v in e.items() if k not in ("kind", "vo")}, "kind": e.get("kind", "end"), "vo": e.get("vo") or f"{e['q']} {e['sub']}".replace("*", "")})
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
    for bt in beats:      # an animated map fills state by state, lowest value first, then holds
        if bt["kind"] == "map" and bt.get("anim"):
            step = min(M.BEAT / 4, (bt["t1"] - bt["t0"] - 2.0) / len(extra["map"]))
            for k, s_ in enumerate(extra["map"]):
                s_["at"] = round(bt["t0"] + 0.35 + k * step, 3)
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
