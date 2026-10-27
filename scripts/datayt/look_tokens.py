#!/usr/bin/env python3
"""Check every brand's look tokens (src/looks/brands/<id>.tokens.json): the palette is complete, every listed text pair
passes contrast (4.5:1 at any size, 3:1 only at its minPx and at least 40 px), no pair is on the brand's "never" list,
every font file exists, and every face passes the glyph check of look_fonts.py (₹ U+20B9, − U+2212, ×, %, tabular digits).

  .venv/bin/python scripts/datayt/look_tokens.py            # all brands; exit 1 on any failure
"""
import glob, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from look_fonts import check as font_check

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PALETTE = ["ground", "ink", "paper", "accent", "accent2", "deep", "muted"]
DERIVED = ["ray", "line", "empty", "softInk", "accent2Text", "accent2Light", "newsprint", "newsprint2"]
ROLES = ["display", "hero", "mono", "serif", "body", "wordmark"]


def lum(h):
    r, g, b = [int(h.lstrip("#")[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a, b):
    x, y = lum(a), lum(b)
    return (max(x, y) + 0.05) / (min(x, y) + 0.05)


def check(path):
    T = json.load(open(path))
    bad = []
    col = {**T["palette"], **T["derived"]}
    bad += [f"palette role {r} missing" for r in PALETTE if r not in T["palette"]]
    bad += [f"derived tone {r} missing" for r in DERIVED if r not in T["derived"]]
    bad += [f"font role {r} missing" for r in ROLES if r not in T["fonts"]]
    print(f"{T['id']}: {T['name']}")
    for p in T["contrast"]["pairs"]:
        r = ratio(col[p["fg"]], col[p["bg"]])
        need = 4.5 if not p.get("minPx") else 3.0
        never = [p["fg"], p["bg"]] in T["contrast"]["never"]
        ok = r >= need and not never and (r >= 4.5 or p.get("minPx", 0) >= 40)
        print(f"  {'ok  ' if ok else 'FAIL'} {p['fg']:>12} on {p['bg']:<11} {r:5.2f}" + (f"  (only at {p['minPx']} px or more)" if p.get("minPx") else ""))
        if not ok:
            bad.append(f"pair {p['fg']} on {p['bg']} is {r:.2f}")
    for fg, bg in T["contrast"]["never"]:
        print(f"  never {fg} on {bg} ({ratio(col[fg], col[bg]):.2f})")
    faces = {T["fonts"][r]["face"] for r in ROLES} | {s["face"] for lk in T.get("lookFonts", {}).values() for s in lk.values()}
    for k in sorted(faces):
        fc = T["faces"][k]
        fp = os.path.join(ROOT, "public", fc["file"])
        if not os.path.exists(fp):
            bad.append(f"face {k}: {fc['file']} missing"); continue
        if fc["file"].endswith(".woff2"):
            print(f"  font {k}: {fc['file']} (wordmark letters only; probed in the browser by LookFonts)"); continue
        r = font_check(fp)
        ok = not r["missing"] and r["tabular"]
        print(f"  font {k}: {fc['file']} {'ok' if ok else 'FAIL ' + ', '.join(r['missing'])}")
        if not ok:
            bad.append(f"face {k} misses {r['missing']}")
    return bad


if __name__ == "__main__":
    allbad = []
    for p in sorted(glob.glob(os.path.join(ROOT, "src/looks/brands/*.tokens.json"))):
        allbad += [f"{os.path.basename(p)}: {b}" for b in check(p)]
    for b in allbad:
        print("FAIL", b)
    sys.exit(1 if allbad else 0)
