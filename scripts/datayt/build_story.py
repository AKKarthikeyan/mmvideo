#!/usr/bin/env python3
"""Data Kadai story Shorts: the five story types that are not a quiz or a map (docs/datakadai/STORYTELLING_FRAMEWORK.md).

  ranking     every state in a league table that fills from last place to first
  change      every state's before and after on one scale, sorted by how far it moved
  faceoff     two groups head to head (women and men, or two states), then the same gap for every row
  breakdown   a whole split into its parts on a 100-square grid
  myth        the answer most people expect, then the full table that shows where it really sits

One story = one config, public/datayt/stories/configs/<id>.json. Common keys: id, type, chip, source, source_short,
title [lines], title_sub, headline [lines], sub, unit, palette, end {q, sub}, vo {scene: narration}.
Data keys name a series: {"nfhs": id, "col": 2|3}, {"plfs": [indicator, year, sector, gender]}, or {"values": {...}}.
Writes public/datayt/stories/<id>/data.json, music.wav, narration files and src/datayt/storyData.ts. Template:
src/datayt/DataStory.tsx. Run from the repo root: python3 scripts/datayt/build_story.py <id> [...]
"""
import glob, json, math, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import music_shorts as M
import voice_dk as V
from build_india_shorts import PALETTES

SHORT = {"Andaman and Nicobar Islands": "A&N Islands", "Dadra & Nagar Haveli and Daman & Diu": "DNH & DD",
         "Dadra and Nagar Haveli and Daman and Diu": "DNH & DD", "NCT of Delhi": "Delhi", "Jammu and Kashmir": "J&K",
         "Arunachal Pradesh": "Arunachal", "Himachal Pradesh": "Himachal", "Madhya Pradesh": "Madhya Pradesh", "Uttar Pradesh": "Uttar Pradesh"}
VO_LEAD, FPS = 0.15, 30
SCENES = {"ranking": [("title", 2), ("table", 4), ("top", 2), ("context", 2), ("end", 2)],
          "change": [("title", 2), ("india", 2), ("rows", 4), ("movers", 2), ("end", 2)],
          "faceoff": [("title", 2), ("duel", 2), ("rows", 4), ("gap", 2), ("end", 2)],
          "breakdown": [("title", 2), ("parts", 4), ("big", 2), ("small", 2), ("end", 2)],
          "myth": [("title", 2), ("guess", 2), ("table", 4), ("truth", 2), ("end", 2)]}
MAIN = {"ranking": "table", "change": "rows", "faceoff": "rows", "breakdown": "parts", "myth": "table"}      # the scene where every row appears
_cache = {}


def series(spec):
    """{state: value} and the all-India value for one data spec."""
    def n(x):
        s = str(x).strip()
        if s.startswith("(") or s in ("*", "na", "-", ""):
            return None
        try:
            return float(s)
        except ValueError:
            return None
    if "values" in spec:
        v = dict(spec["values"]); return v, spec.get("india", v.pop("India", None))
    if "nfhs" in spec:
        raw = _cache.setdefault("nfhs", json.load(open("public/datayt/nfhs6/nfhs6_states.json"))["states"])
        col = spec.get("col", 2)
        v = {s: n(r.get(str(spec["nfhs"]), [None] * 4)[col]) for s, r in raw.items()}
        v = {s: x for s, x in v.items() if x is not None and s != "Lakshadweep"}       # tiny sample: never ranked
        return v, v.pop("India", None)
    if "plfs" in spec:
        raw = _cache.setdefault("plfs", json.load(open("public/datayt/sources/mospi/plfs_annual.json"))["data"])
        ind, year, sector, gender = spec["plfs"]
        v = dict(raw[ind][year][sector][gender]); return v, v.pop("India", None)
    raise SystemExit(f"unknown data spec {spec}")


def fmt(v, unit, dec=None):
    d = dec if dec is not None else (0 if float(v).is_integer() and abs(v) >= 100 else 1)
    return f"{v:,.{d}f}{unit}"


def build(cfg):
    sid, typ, unit = cfg["id"], cfg["type"], cfg.get("unit", "%")
    pal = PALETTES[cfg.get("palette", "A")]
    d = f"public/datayt/stories/{sid}"; os.makedirs(d, exist_ok=True)
    nm = lambda s: SHORT.get(s, s)
    body = {}
    if typ in ("ranking", "myth"):
        vals, india = series(cfg["data"])
        low_first = cfg.get("order", "high") == "low"
        rk = sorted(vals.items(), key=lambda x: (x[1], x[0]), reverse=not low_first)
        lead = abs(rk[0][1] - rk[1][1])
        assert lead >= cfg.get("min_lead", 1.0), f"{sid}: lead of #1 over #2 is only {lead:.2f}; not a safe #1 claim"
        body = {"rows": [{"name": nm(s), "v": v, "label": fmt(v, unit), "rank": i + 1} for i, (s, v) in enumerate(rk)], "india": india,
                "indiaLabel": fmt(india, unit) if india is not None else None, "max": max(vals.values()), "lowFirst": low_first,
                "context": cfg.get("context", {}), "top": cfg.get("top", {})}
        if typ == "myth":
            m = cfg["myth"]["state"]; pos = [s for s, _ in rk].index(m)
            assert pos >= 3, f"{sid}: the 'myth' answer is actually #{pos + 1}; not a myth"
            body["myth"] = {"name": nm(m), "rank": pos + 1, "label": fmt(vals[m], unit), "v": vals[m], "of": len(rk), **{k: v for k, v in cfg["myth"].items() if k != "state"}}
            body["truth"] = {"name": nm(rk[0][0]), "label": fmt(rk[0][1], unit), "v": rk[0][1], **cfg.get("truth", {})}
    elif typ in ("change", "faceoff"):
        a, ia = series(cfg["a"]["data"]); b, ib = series(cfg["b"]["data"])
        common = [s for s in a if s in b]
        rows = [{"name": nm(s), "a": a[s], "b": b[s], "d": round(b[s] - a[s], 1), "la": fmt(a[s], unit), "lb": fmt(b[s], unit)} for s in common]
        rows.sort(key=lambda r: -r["d"] if typ == "change" else -abs(r["d"]))
        body = {"rows": rows, "aName": cfg["a"]["name"], "bName": cfg["b"]["name"], "indiaA": ia, "indiaB": ib,
                "indiaLa": fmt(ia, unit), "indiaLb": fmt(ib, unit), "min": min(min(a[s], b[s]) for s in common), "max": max(max(a[s], b[s]) for s in common),
                "bAhead": sum(1 for r in rows if r["d"] > 0), "aAhead": sum(1 for r in rows if r["d"] < 0),
                "india": cfg.get("india", {}), "movers": cfg.get("movers", {}), "duel": cfg.get("duel", {}), "gap": cfg.get("gap", {}),
                "rowsText": cfg.get("rows", {})}
    elif typ == "breakdown":
        parts = cfg["parts"]
        cells = [round(p["v"]) for p in parts]
        assert sum(cells) == 100, f"{sid}: rounded parts fill {sum(cells)} squares, not 100; adjust 'parts' or add an 'Other' part"
        cols = cfg.get("colors") or (pal["bands"][::-1] + ["#B9A898", "#D8CFC2", "#E7DFD3"])
        body = {"parts": [{"name": p["name"], "v": p["v"], "label": fmt(p["v"], unit), "cells": c, "color": cols[i % len(cols)]} for i, (p, c) in enumerate(zip(parts, cells))],
                "whole": cfg.get("whole", ""), "big": cfg.get("big", {}), "small": cfg.get("small", {}), "partsText": cfg.get("parts_text", {})}
    else:
        raise SystemExit(f"{sid}: unknown type {typ}")

    vo = {}
    for sec, tx in cfg.get("vo", {}).items():
        fn, dur = V.say(tx, f"{d}/vo_{sec}")
        vo[sec] = {"sec_name": sec, "text": tx, "file": fn, "sec": dur}
    T, t = {}, 0.0
    for name, bars in SCENES[typ]:
        need = vo[name]["sec"] + VO_LEAD + 0.35 if name in vo else 0
        nb = max(bars, math.ceil(need / M.BAR))
        T[name] = [round(t, 3), round(t + nb * M.BAR, 3)]; t += nb * M.BAR
    for sec in vo:
        vo[sec]["at"] = round(T[sec][0] + VO_LEAD, 3)
    total = round(t + 0.5, 3)
    # every row or part gets its own beat inside the main scene
    main = MAIN[typ]
    items = body.get("rows") or body.get("parts")
    span = T[main][1] - T[main][0] - 2.5 * M.BEAT
    step = min(M.BEAT / 2, span / max(1, len(items)))
    order = list(range(len(items)))[::-1] if typ in ("ranking", "myth") else list(range(len(items)))      # league tables fill from the bottom
    ticks = []
    for k, i in enumerate(order):
        items[i]["at"] = round(T[main][0] + M.BEAT + k * step, 3); ticks.append(items[i]["at"])
    out = {"id": sid, "type": typ, "chip": cfg["chip"], "sourceShort": cfg["source_short"], "source": cfg["source"], "title": cfg["title"],
           "titleSub": cfg.get("title_sub", ""), "headline": cfg["headline"], "sub": cfg.get("sub", ""), "unit": unit, "accent": pal["accent"],
           "accent2": pal["accent2"], "bands": pal["bands"], "t": T, "total": total, "fps": FPS, "end": cfg["end"], **body,
           "panels": cfg.get("panels", {}), "focus": {k: [nm(x) for x in v] for k, v in cfg.get("focus", {}).items()},
           "vo": list(vo.values()), "voiceEngine": V.ENGINE, "voice": V.VOICE, "ytTitle": cfg.get("yt_title", "")}
    json.dump(out, open(f"{d}/data.json", "w"), indent=1, ensure_ascii=False)
    names = [n for n, _ in SCENES[typ]]
    last = names[names.index(main) + 1]
    M.make(f"{d}/music.wav", total, seed=sum(map(ord, sid)) % 50, hits=[T[last][0], T["end"][0]], ticks=ticks[::2] if len(ticks) > 24 else ticks,
           drop=(T[last][0] - M.BEAT * 2, T[last][0]))
    print(f"{sid}: {typ} · {len(items)} items · {total:.1f}s · voice {V.ENGINE}")


def write_registry():
    ids = sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob("public/datayt/stories/*/data.json"))
    lines = ["// Generated by scripts/datayt/build_story.py: every built story Short, for the Remotion registry."]
    lines += [f'import {i} from "../../public/datayt/stories/{i}/data.json";' for i in ids]
    lines += ['import type {StoryData} from "./DataStory";', "", f"export const STORIES = [{', '.join(ids)}] as unknown as StoryData[];", ""]
    open("src/datayt/storyData.ts", "w").write("\n".join(lines))


if __name__ == "__main__":
    want = set(sys.argv[1:])
    for f in sorted(glob.glob("public/datayt/stories/configs/*.json")):
        cfg = json.load(open(f))
        if not want or cfg["id"] in want:
            build(cfg)
    write_registry()
