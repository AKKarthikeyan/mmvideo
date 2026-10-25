#!/usr/bin/env python3
"""Hero thumbnails for the DMart Q2 FY27 Vox video (11 Oct 2026). Reuses thumb_hero.py without editing it.
Thumbs 2 and 3 have no filing strip (STRUCTURE §5). No rupee glyph (thumbnail font lacks it). Text-free MiniMax images; text drawn in code."""
import sys, pathlib
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import thumb_hero as th
_orig = th.proof_strip
th.proof_strip = lambda vid, D, clip, width=520: Image.new("RGBA", (1, 1), (0, 0, 0, 0)) if clip is None else _orig(vid, D, clip, width)
th.VIDEOS["dmartq2"] = {"out": "dmart-q2-margin", "thumbs": [
    {"img": "trolleys", "chip": "DMART · Q2 FY27", "big": "18%", "line": "MORE SALES", "fact": "PROFIT +7.6%", "clip": "dm_pr",
     "prompt": "Cinematic photograph of a row of empty steel shopping trolleys nested together, on the right side of the frame, "
               "dark background on the left, warm side light, high contrast, no people, no signs, no text, no logos."},
    {"img": "racks", "chip": "DMART · LAST YEAR", "big": "85 STORES", "line": "IN ONE YEAR", "fact": "WHO PAYS?", "clip": None,
     "prompt": "Cinematic photograph of tall warehouse racks filled with plain unmarked brown cardboard boxes, on the right side of the frame, "
               "dark background, dramatic warm side light, high contrast, no labels, no people, no text."},
    {"img": "loaf", "chip": "DMART · BORROWINGS", "big": "2.7X", "line": "IN SIX MONTHS", "fact": "WHY NOW?", "clip": None,
     "prompt": "Cinematic photograph of a single thin slice being cut from a plain round loaf of bread on a dark wooden board, on the right side of the frame, "
               "dark background, warm side light, high contrast, no packaging, no text."},
]}
if __name__ == "__main__":
    sys.argv = [sys.argv[0], "dmartq2", "--gen"]
    th.main()
