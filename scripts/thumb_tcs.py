#!/usr/bin/env python3
"""Hero thumbnails for the TCS Q2 FY27 Vox video (9 Oct 2026). Reuses thumb_hero.py without editing it.
Thumb 2 has no filing strip (STRUCTURE §5). No ₹ glyph (thumbnail font lacks it). Text-free MiniMax images; text drawn in code."""
import sys, pathlib
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import thumb_hero as th
_orig = th.proof_strip
th.proof_strip = lambda vid, D, clip, width=520: Image.new("RGBA", (1, 1), (0, 0, 0, 0)) if clip is None else _orig(vid, D, clip, width)
th.VIDEOS["tcsq2"] = {"out": "tcs-q2", "thumbs": [
    {"img": "servers", "chip": "TCS Q2 · REALLY", "big": "+2.8%", "line": "NOT +11%", "fact": "THE RUPEE DID IT", "clip": "tc_q2",
     "prompt": "Cinematic photograph of a long corridor of dark server racks with small blue and amber lights, racks on the right side of the frame, "
               "dark background, high contrast, no people, no text, no logos."},
    {"img": "cheese", "chip": "TCS MARGIN", "big": "24.0%", "line": "FROM 25.2%", "fact": "NOT SALARIES", "clip": None,
     "prompt": "Cinematic photograph of a thin wedge being cut from a large plain round cheese wheel on a dark wooden board, cheese on the right side of the frame, "
               "dark background, dramatic warm side light, high contrast, no labels, no text."},
    {"img": "filaments", "chip": "TCS · AI REVENUE", "big": "$3.1 BN", "line": "10%+ OF REVENUE", "fact": "GROWING OR SHRINKING?", "clip": None,
     "prompt": "Cinematic abstract photograph of glowing blue and gold light filaments flowing like a river through darkness, light on the right side of the frame, "
               "dark background, high contrast, no objects, no text, no logos, no markings."},
]}
if __name__ == "__main__":
    sys.argv = [sys.argv[0], "tcsq2", "--gen"]
    th.main()
