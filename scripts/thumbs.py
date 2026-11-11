#!/usr/bin/env python3
"""Hero thumbnails for the daily-filings videos: every config in one place.
Usage: thumbs.py <id>      e.g. thumbs.py dmartq2     -> three thumbnails, pictures generated first (--gen)

The drawing is done by thumb_hero.py (the other session's tool; it is not in git yet, so this runs only where that
file sits next to this one). We hand it a config and call its main(), without editing it.
Rules: one thumbnail in three carries no filing strip (STRUCTURE §5): give that one "clip": None. No rupee glyph
(the thumbnail font lacks it). MiniMax pictures are text-free; all text is drawn in code."""
import sys
from PIL import Image

THUMBS = {
 # FCNR video (6 Oct 2026). Big numbers are on screen in the video and highlighted in the real filing strip.
 "fcnr": {"out": "fcnr-deposits-seven-banks", "thumbs": [
    {"img": "loop", "chip": "IDFC FIRST BANK", "big": "24,885 CR", "line": "THE LOOP", "fact": "LENT, THEN DEPOSITED", "clip": "fc_idfc",
     "prompt": "Cinematic photograph of gold coins flowing in a closed circular loop between two cupped hands, the coins leaving one hand and returning to it, "
               "loop on the right side of the frame, dramatic warm backlight, high contrast."},
    {"img": "vault", "chip": "HDFC BANK", "big": "$11.5 BN", "line": "IN 12 WEEKS", "fact": "$5.7 BN LENT AGAINST IT", "clip": "fc_hdfc",
     "prompt": "Cinematic photograph of an open bank vault door with a glowing pile of US dollar banknotes inside, a thin chain looping out of the vault and back in, "
               "vault on the right side of the frame, dramatic golden light, high contrast."},
    {"img": "mirror", "chip": "AXIS BANK", "big": "$10.62 BN", "line": "MATCHED", "fact": "~87% BY LOANS", "clip": "fc_axis",
     "prompt": "Cinematic photograph of a stack of gold coins standing on a mirror, its reflection exactly matching it below, "
               "stack on the right side of the frame, dark background, dramatic warm side light, high contrast."},
]},
 # Angel One commodity-share video (7 Oct 2026). Thumb 2 has no filing strip.
 "angelone": {"out": "angel-one-commodity", "thumbs": [
    {"img": "slide", "chip": "ANGEL ONE · COMMODITY", "big": "44.0%", "line": "MARKET SHARE", "fact": "FROM 65.1% A YEAR AGO", "clip": "ao_q2",
     "prompt": "Cinematic photograph of a tall stack of gold coins on a dark desk, the top coins sliding off and scattering, "
               "stack on the right side of the frame, dramatic warm side light, high contrast."},
    {"img": "piles", "chip": "COMMODITY TRADING", "big": "×3", "line": "THE MARKET GREW", "fact": "ANGEL ONE ONLY ×2", "clip": None,
     "prompt": "Cinematic photograph of one small stack of gold coins beside a much larger heap of gold coins on a dark wooden table, "
               "coins on the right side of the frame, dark background, dramatic warm side light, high contrast."},
    {"img": "hourglass", "chip": "ANGEL ONE", "big": "41.7%", "line": "BACK TO 2022", "fact": "LOWEST IN 4+ YEARS", "clip": "ao_sep26",
     "prompt": "Cinematic photograph of a glass hourglass filled with gold sand, most of it already run to the bottom, "
               "hourglass on the right side of the frame, dark background, dramatic warm backlight, high contrast."},
]},
 # Jewellers-vs-gold napkin video (8 Oct 2026). Thumb 2 has no filing strip.
 "jewel": {"out": "jewellers-gold", "thumbs": [
    {"img": "necklace", "chip": "JEWELLERS, UP TO", "big": "+29%", "line": "GOLD: +28%", "fact": "SAME GRAMS?", "clip": "jw_gold",
     "prompt": "Cinematic photograph of a heavy gold necklace and gold bangles on dark velvet, warm spotlight, jewellery on the right side of the frame, "
               "dark background, high contrast, no people, no text."},
    {"img": "scale", "chip": "GOLD vs JEWELLERS", "big": "+28%", "line": "THE GOLD PRICE", "fact": "DID THE WORK", "clip": None,
     "prompt": "Cinematic photograph of an antique brass balance scale with gold bars on one pan and gold jewellery on the other, "
               "scale on the right side of the frame, dark background, dramatic warm side light, high contrast, no text."},
    {"img": "bangles", "chip": "SENCO · LAST YEAR", "big": "+6.5%", "line": "GOLD ROSE 43%", "fact": "REVENUE LAGGED", "clip": "jw_sen25",
     "prompt": "Cinematic photograph of a small stack of gold bangles beside a tall stack of gold coins on a dark wooden table, "
               "objects on the right side of the frame, dark background, warm backlight, high contrast, no text."},
]},
 # TCS Q2 FY27 Vox video (9 Oct 2026). Thumb 2 has no filing strip.
 "tcsq2": {"out": "tcs-q2", "thumbs": [
    {"img": "servers", "chip": "TCS Q2 · REALLY", "big": "+2.8%", "line": "NOT +11%", "fact": "THE RUPEE DID IT", "clip": "tc_q2",
     "prompt": "Cinematic photograph of a long corridor of dark server racks with small blue and amber lights, racks on the right side of the frame, "
               "dark background, high contrast, no people, no text, no logos."},
    {"img": "cheese", "chip": "TCS MARGIN", "big": "24.0%", "line": "FROM 25.2%", "fact": "NOT SALARIES", "clip": None,
     "prompt": "Cinematic photograph of a thin wedge being cut from a large plain round cheese wheel on a dark wooden board, cheese on the right side of the frame, "
               "dark background, dramatic warm side light, high contrast, no labels, no text."},
    {"img": "filaments", "chip": "TCS · AI REVENUE", "big": "$3.1 BN", "line": "10%+ OF REVENUE", "fact": "GROWING OR SHRINKING?", "clip": None,
     "prompt": "Cinematic abstract photograph of glowing blue and gold light filaments flowing like a river through darkness, light on the right side of the frame, "
               "dark background, high contrast, no objects, no text, no logos, no markings."},
]},
 # Persistent / Nagarro Vox video (10 Oct 2026). Thumb 2 has no filing strip.
 "persistent": {"out": "persistent-nagarro", "thumbs": [
    {"img": "bridge", "chip": "PERSISTENT · NAGARRO", "big": "94%", "line": "OF NAGARRO", "fact": "WHO PAYS?", "clip": "pe_94",
     "prompt": "Cinematic photograph of a narrow rope bridge stretching across a deep misty canyon at dawn, bridge on the right side of the frame, "
               "dark background on the left, high contrast, no people, no buildings, no text, no logos."},
    {"img": "hourglass", "chip": "PERSISTENT'S LOAN", "big": "18 MONTHS", "line": "EUR 1.4 BN BRIDGE", "fact": "THEN WHAT?", "clip": None,
     "prompt": "Cinematic photograph of a large plain glass hourglass with fine sand running, on the right side of the frame, dark background, "
               "dramatic warm side light, high contrast, plain glass and plain wood, no engravings, no text."},
    {"img": "puzzle", "chip": "PERSISTENT · JUNE vs OCTOBER", "big": "NO QIP?", "line": "USD 450 M APPROVED", "fact": "WHAT CHANGED", "clip": None,
     "prompt": "Cinematic photograph of two plain wooden jigsaw puzzle pieces, one large and one smaller, about to join, on the right side of the frame, "
               "dark desk, dark background, warm side light, high contrast, no markings, no text."},
]},
 # DMart Q2 FY27 Vox video (11 Oct 2026). Thumbs 2 and 3 have no filing strip.
 "dmartq2": {"out": "dmart-q2-margin", "thumbs": [
    {"img": "trolleys", "chip": "DMART · Q2 FY27", "big": "18%", "line": "MORE SALES", "fact": "PROFIT +7.6%", "clip": "dm_pr",
     "prompt": "Cinematic photograph of a row of empty steel shopping trolleys nested together, on the right side of the frame, "
               "dark background on the left, warm side light, high contrast, no people, no signs, no text, no logos."},
    {"img": "racks", "chip": "DMART · LAST YEAR", "big": "85 STORES", "line": "IN ONE YEAR", "fact": "WHO PAYS?", "clip": None,
     "prompt": "Cinematic photograph of tall warehouse racks filled with plain unmarked brown cardboard boxes, on the right side of the frame, "
               "dark background, dramatic warm side light, high contrast, no labels, no people, no text."},
    {"img": "loaf", "chip": "DMART · BORROWINGS", "big": "2.7X", "line": "IN SIX MONTHS", "fact": "WHY NOW?", "clip": None,
     "prompt": "Cinematic photograph of a single thin slice being cut from a plain round loaf of bread on a dark wooden board, on the right side of the frame, "
               "dark background, warm side light, high contrast, no packaging, no text."},
]},
}


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in THUMBS:
        sys.exit("usage: thumbs.py <id>   ids: " + " ".join(THUMBS))
    import thumb_hero as th
    strip = th.proof_strip      # a thumbnail without a filing strip gets an empty one
    th.proof_strip = lambda vid, D, clip, width=520: Image.new("RGBA", (1, 1), (0, 0, 0, 0)) if clip is None else strip(vid, D, clip, width)
    th.VIDEOS[sys.argv[1]] = THUMBS[sys.argv[1]]
    sys.argv = [sys.argv[0], sys.argv[1], "--gen"]
    th.main()


if __name__ == "__main__":
    main()
