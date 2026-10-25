#!/usr/bin/env python3
"""Hero thumbnails for the jewellers-vs-gold napkin video (8 Oct 2026). Reuses thumb_hero.py without editing it.
Thumb 2 has no filing strip (STRUCTURE §5). No ₹ glyph (thumbnail font lacks it). Text-free MiniMax images; text drawn in code."""
import sys, pathlib
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import thumb_hero as th
_orig = th.proof_strip
th.proof_strip = lambda vid, D, clip, width=520: Image.new("RGBA", (1, 1), (0, 0, 0, 0)) if clip is None else _orig(vid, D, clip, width)
th.VIDEOS["jewel"] = {"out": "jewellers-gold", "thumbs": [
    {"img": "necklace", "chip": "JEWELLERS, UP TO", "big": "+29%", "line": "GOLD: +28%", "fact": "SAME GRAMS?", "clip": "jw_gold",
     "prompt": "Cinematic photograph of a heavy gold necklace and gold bangles on dark velvet, warm spotlight, jewellery on the right side of the frame, "
               "dark background, high contrast, no people, no text."},
    {"img": "scale", "chip": "GOLD vs JEWELLERS", "big": "+28%", "line": "THE GOLD PRICE", "fact": "DID THE WORK", "clip": None,
     "prompt": "Cinematic photograph of an antique brass balance scale with gold bars on one pan and gold jewellery on the other, "
               "scale on the right side of the frame, dark background, dramatic warm side light, high contrast, no text."},
    {"img": "bangles", "chip": "SENCO · LAST YEAR", "big": "+6.5%", "line": "GOLD ROSE 43%", "fact": "REVENUE LAGGED", "clip": "jw_sen25",
     "prompt": "Cinematic photograph of a small stack of gold bangles beside a tall stack of gold coins on a dark wooden table, "
               "objects on the right side of the frame, dark background, warm backlight, high contrast, no text."},
]}
if __name__ == "__main__":
    sys.argv = [sys.argv[0], "jewel", "--gen"]
    th.main()
