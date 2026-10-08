#!/usr/bin/env python3
"""Hero thumbnails for the Angel One commodity-share video (7 Oct 2026). Reuses thumb_hero.py without editing it.
Thumb 2 has no filing strip (STRUCTURE §5: one of three without it). No ₹ glyph (thumbnail font lacks it)."""
import sys, pathlib
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import thumb_hero as th
_orig = th.proof_strip
th.proof_strip = lambda vid, D, clip, width=520: Image.new("RGBA", (1, 1), (0, 0, 0, 0)) if clip is None else _orig(vid, D, clip, width)
th.VIDEOS["angelone"] = {"out": "angel-one-commodity", "thumbs": [
    {"img": "slide", "chip": "ANGEL ONE · COMMODITY", "big": "44.0%", "line": "MARKET SHARE", "fact": "FROM 65.1% A YEAR AGO", "clip": "ao_q2",
     "prompt": "Cinematic photograph of a tall stack of gold coins on a dark desk, the top coins sliding off and scattering, "
               "stack on the right side of the frame, dramatic warm side light, high contrast."},
    {"img": "piles", "chip": "COMMODITY TRADING", "big": "×3", "line": "THE MARKET GREW", "fact": "ANGEL ONE ONLY ×2", "clip": None,
     "prompt": "Cinematic photograph of one small stack of gold coins beside a much larger heap of gold coins on a dark wooden table, "
               "coins on the right side of the frame, dark background, dramatic warm side light, high contrast."},
    {"img": "hourglass", "chip": "ANGEL ONE", "big": "41.7%", "line": "BACK TO 2022", "fact": "LOWEST IN 4+ YEARS", "clip": "ao_sep26",
     "prompt": "Cinematic photograph of a glass hourglass filled with gold sand, most of it already run to the bottom, "
               "hourglass on the right side of the frame, dark background, dramatic warm backlight, high contrast."},
]}
if __name__ == "__main__":
    sys.argv = [sys.argv[0], "angelone", "--gen"]
    th.main()
