#!/usr/bin/env python3
"""Hero thumbnails for the Persistent / Nagarro Vox video (10 Oct 2026). Reuses thumb_hero.py without editing it.
Thumb 2 has no filing strip (STRUCTURE §5). No rupee glyph (thumbnail font lacks it). Text-free MiniMax images; text drawn in code."""
import sys, pathlib
from PIL import Image
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import thumb_hero as th
_orig = th.proof_strip
th.proof_strip = lambda vid, D, clip, width=520: Image.new("RGBA", (1, 1), (0, 0, 0, 0)) if clip is None else _orig(vid, D, clip, width)
th.VIDEOS["persistent"] = {"out": "persistent-nagarro", "thumbs": [
    {"img": "bridge", "chip": "PERSISTENT · NAGARRO", "big": "94%", "line": "OF NAGARRO", "fact": "WHO PAYS?", "clip": "pe_94",
     "prompt": "Cinematic photograph of a narrow rope bridge stretching across a deep misty canyon at dawn, bridge on the right side of the frame, "
               "dark background on the left, high contrast, no people, no buildings, no text, no logos."},
    {"img": "hourglass", "chip": "PERSISTENT'S LOAN", "big": "18 MONTHS", "line": "EUR 1.4 BN BRIDGE", "fact": "THEN WHAT?", "clip": None,
     "prompt": "Cinematic photograph of a large plain glass hourglass with fine sand running, on the right side of the frame, dark background, "
               "dramatic warm side light, high contrast, plain glass and plain wood, no engravings, no text."},
    {"img": "puzzle", "chip": "PERSISTENT · JUNE vs OCTOBER", "big": "NO QIP?", "line": "USD 450 M APPROVED", "fact": "WHAT CHANGED", "clip": None,
     "prompt": "Cinematic photograph of two plain wooden jigsaw puzzle pieces, one large and one smaller, about to join, on the right side of the frame, "
               "dark desk, dark background, warm side light, high contrast, no markings, no text."},
]}
if __name__ == "__main__":
    sys.argv = [sys.argv[0], "persistent", "--gen"]
    th.main()
