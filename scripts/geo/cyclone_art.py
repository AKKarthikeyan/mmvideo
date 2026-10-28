# Thumbnail art for the cyclone Shorts (27-28 Oct 2026), same method as week2_art.py (Google Nano Banana, no text/maps/flags/people).
# Titles and figures are laid on top in Remotion (src/geo/week2/art.tsx, ART_TEXT) so spelling and numbers stay under our control.
#   zsh -lic 'python3 scripts/geo/cyclone_art.py [id ...]'    ->  public/geo/<id>/art_thumb.png (9:16)
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from week2_art import gen, ROOT

ART = {
 "cy01odisha": "A sturdy concrete multi-storey cyclone shelter raised on thick pillars at a south Asian coastal village, coconut palms bending in strong wind, a dark storm wall of clouds and a rough grey-green sea behind it, but a shaft of warm golden light breaking through the clouds onto the shelter. Calm, hopeful, no people visible, no damage or bodies.",
 "cy02bay": "Dramatic high-altitude view of a huge swirling tropical cyclone over a deep blue bay, its cloud arms funnelling toward a narrow low-lying river-delta coast with tiny mangrove islands, a pale surging wall of seawater racing ahead of the storm toward the flat green delta, cinematic storm light. No people.",
}
if __name__ == "__main__":
    for i in (sys.argv[1:] or list(ART)):
        d = ROOT / "public" / "geo" / i
        ok = gen(ART[i], "9:16", d / "art_thumb.png"); print(i, "art_thumb.png", "ok" if ok else "FAILED", flush=True)
