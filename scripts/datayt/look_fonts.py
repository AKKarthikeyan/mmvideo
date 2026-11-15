#!/usr/bin/env python3
"""Glyph check for the fonts the premium looks use (docs/datakadai/looks/FOUNDATION.md).

Every word and number on a look's screen is set in code from data.json, so the fonts must carry what Indian money and
price data prints: the rupee sign U+20B9, the real minus U+2212 (never a hyphen), the multiplication sign U+00D7, %,
+, the middle dot of chips and sources, and digits that can line up (tabular figures, either by default or through the
OpenType 'tnum' feature). A font that lacks one of these makes the browser fall back to another face for that glyph,
which is what the critic found in Noto Serif Display (no U+2212).

  .venv/bin/python scripts/datayt/look_fonts.py                 # every font in public/fonts/looks/
  .venv/bin/python scripts/datayt/look_fonts.py a.ttf b.ttf     # just these files

Exits 1 when a font misses a required glyph or has no way to set tabular digits. Needs fontTools in .venv.
"""
import glob, os, sys
from fontTools.ttLib import TTFont

REQUIRED = {"₹": "rupee", "−": "minus", "×": "times", "%": "percent", "+": "plus", "·": "middle dot",
            ",": "comma", ".": "point", "~": "tilde", "'": "apostrophe", "’": "right quote", "-": "hyphen", "/": "slash",
            ":": "colon", "(": "paren", "?": "question"}
DIGITS = "0123456789"


def tnum_map(font):
    """Glyph substitutions of the font's 'tnum' feature (single substitutions only), or None if it has no 'tnum'."""
    if "GSUB" not in font:
        return None
    gsub = font["GSUB"].table
    if not gsub.FeatureList:
        return None
    idx = [i for i, fr in enumerate(gsub.FeatureList.FeatureRecord) if fr.FeatureTag == "tnum"]
    if not idx:
        return None
    out = {}
    for i in idx:
        for li in gsub.FeatureList.FeatureRecord[i].Feature.LookupListIndex:
            lk = gsub.LookupList.Lookup[li]
            for st in lk.SubTable:
                if lk.LookupType == 7:      # extension
                    st = st.ExtSubTable
                mapping = getattr(st, "mapping", None)
                if mapping:
                    out.update(mapping)
    return out


def check(path):
    font = TTFont(path, lazy=True)
    cmap = font.getBestCmap()
    hmtx = font["hmtx"].metrics
    name = font["name"].getDebugName(4) or os.path.basename(path)
    missing = [f"{REQUIRED[c]} U+{ord(c):04X}" for c in REQUIRED if ord(c) not in cmap]
    missing += [f"digit {d}" for d in DIGITS if ord(d) not in cmap]
    dg = [cmap.get(ord(d)) for d in DIGITS]
    widths = sorted({hmtx[g][0] for g in dg if g})
    tab_default = len(widths) == 1
    tm = tnum_map(font)
    tab_widths = sorted({hmtx[tm.get(g, g)][0] for g in dg if g}) if tm is not None else []
    tab_ok = tab_default or (tm is not None and len(tab_widths) == 1)
    axes = {a.axisTag: (a.minValue, a.maxValue) for a in font["fvar"].axes} if "fvar" in font else {}
    return {"file": os.path.basename(path), "name": name, "missing": missing, "digits_default": widths, "tnum": tm is not None,
            "digits_tnum": tab_widths, "tabular": tab_ok, "axes": axes, "upm": font["head"].unitsPerEm}


def main(paths):
    bad = 0
    for p in paths:
        r = check(p)
        ok = not r["missing"] and r["tabular"]
        bad += not ok
        ax = " ".join(f"{k} {v[0]:g}-{v[1]:g}" for k, v in r["axes"].items()) or "static"
        dig = (f"digits {r['digits_default'][0]} units by default" if len(r["digits_default"]) == 1
               else f"digits {r['digits_default'][0]}-{r['digits_default'][-1]} by default, tnum {'/'.join(map(str, r['digits_tnum'])) or 'n/a'}")
        print(f"{'OK  ' if ok else 'FAIL'} {r['file']}: {r['name']} · {ax} · upm {r['upm']} · {dig}"
              + (f" · MISSING {', '.join(r['missing'])}" if r["missing"] else "") + ("" if r["tabular"] else " · NO TABULAR DIGITS"))
    return 1 if bad else 0


if __name__ == "__main__":
    args = sys.argv[1:] or sorted(glob.glob("public/fonts/looks/**/*.ttf", recursive=True))
    sys.exit(main(args))
