#!/usr/bin/env python3
"""Hero thumbnails for the FCNR video (6 Oct 2026). Reuses thumb_hero.py (other session's tool) without editing it:
adds a config and calls its main(). Big numbers are on screen in the video and highlighted in the real filing strip."""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import thumb_hero as th
th.VIDEOS["fcnr"] = {"out": "fcnr-deposits-seven-banks", "thumbs": [
    {"img": "loop", "chip": "IDFC FIRST BANK", "big": "24,885 CR", "line": "THE LOOP", "fact": "LENT, THEN DEPOSITED", "clip": "fc_idfc",
     "prompt": "Cinematic photograph of gold coins flowing in a closed circular loop between two cupped hands, the coins leaving one hand and returning to it, "
               "loop on the right side of the frame, dramatic warm backlight, high contrast."},
    {"img": "vault", "chip": "HDFC BANK", "big": "$11.5 BN", "line": "IN 12 WEEKS", "fact": "$5.7 BN LENT AGAINST IT", "clip": "fc_hdfc",
     "prompt": "Cinematic photograph of an open bank vault door with a glowing pile of US dollar banknotes inside, a thin chain looping out of the vault and back in, "
               "vault on the right side of the frame, dramatic golden light, high contrast."},
    {"img": "mirror", "chip": "AXIS BANK", "big": "$10.62 BN", "line": "MATCHED", "fact": "~87% BY LOANS", "clip": "fc_axis",
     "prompt": "Cinematic photograph of a stack of gold coins standing on a mirror, its reflection exactly matching it below, "
               "stack on the right side of the frame, dark background, dramatic warm side light, high contrast."},
]}
if __name__ == "__main__":
    sys.argv = [sys.argv[0], "fcnr", "--gen"]
    th.main()
