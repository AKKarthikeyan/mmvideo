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
 "cy04baywhy": "Dramatic high-altitude view of a vast swirling tropical cyclone over a warm glowing turquoise-and-gold bay of the sea, bands of its clouds spiralling toward a narrow funnel-shaped coast far ahead, calm bright shallow water along the coast, cinematic storm light. No people, no text, no maps.",
 "cy05kgdelta": "A low flat green river delta coast at the edge of the sea at dusk: many winding river channels fanning out through paddy fields and palm groves toward a grey-green sea, a dark storm wall of clouds on the horizon and a pale surging wall of water beginning to roll toward the flat land. Tense, no people, no boats, no damage or bodies, no text.",
}
if __name__ == "__main__":
    for i in (sys.argv[1:] or list(ART)):
        d = ROOT / "public" / "geo" / i
        ok = gen(ART[i], "9:16", d / "art_thumb.png"); print(i, "art_thumb.png", "ok" if ok else "FAILED", flush=True)
