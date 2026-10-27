# Week 2 thumbnail + community-poster artwork with Google Nano Banana (gemini-2.5-flash-image), AK 25 Oct 2026.
# The art carries NO text, maps, borders or flags: titles are laid on top in Remotion (src/geo/week2/art.tsx) so spelling,
# figures and map accuracy stay under our control. Run inside the Mini's login shell (GEMINI_API_KEY):
#   zsh -lic 'python3 scripts/geo/week2_art.py [id ...]'      ->  public/geo/<id>/art_thumb.png (9:16), art_post.png (1:1)
import base64, json, os, sys, time
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[2]
MODEL = "gemini-2.5-flash-image"
STYLE = ("Cinematic painterly digital illustration, rich saturated colour, dramatic warm light, strong single focal subject, "
         "high detail, YouTube thumbnail quality. Absolutely no text, letters, numbers, logos, watermarks, flags, maps or "
         "country borders anywhere in the image. No recognisable real person.")
ART = {
 "minicoy": "Aerial view of a small tropical coral island with a tall white-and-black lighthouse, a turquoise lagoon, white sand and coconut palms, surrounded by deep blue ocean stretching to the horizon, a traditional wooden fishing boat nearby.",
 "austria": "An 18th-century three-masted wooden sailing ship with plain unmarked sails anchored off a lush tropical island with palm trees and a small wooden stockade fort on the beach, stormy golden sky over the Bay of Bengal.",
 "kuttanad": "Bright green rice paddy fields lying visibly lower than the water of a large lake beside them, separated by a narrow mud embankment; the lake water is higher than the fields. Coconut palms, a farmer in a small wooden canoe on the lake, Kerala backwaters, golden morning light.",
 "sikhpolice": "A 1930s waterfront street in Shanghai with art-deco buildings, rickshaws and a tram; in the foreground a Sikh police officer in a red turban and khaki uniform calmly directing traffic, respectful and dignified, empty hands in white traffic gloves, no weapon of any kind, cinematic sepia-and-colour film look.",
 "seazone": "View from high above a vast deep-blue tropical ocean with scattered tiny green islands and coral atolls, a soft glowing translucent ring of light on the water around the islands, sunlit clouds, sense of enormous scale.",
 "nainsingh": "A 19th-century traveller in a heavy woollen robe and fur hat walking alone on a high Himalayan mountain path, seen from behind, a string of prayer beads in his hand, snowy peaks, a distant hilltop monastery, wind and golden light.",
 "thumba": "A small whitewashed coastal church among coconut palms by a beach in south India at dusk, and a slender white research rocket rising into the twilight sky nearby with a bright exhaust trail, 1960s atmosphere, respectful and awe-inspiring.",
 "zanzibar": "A massive ornately carved dark-wood door with rows of pointed brass studs, set in an old white coral-stone wall in a narrow sunlit Stone Town alley, warm afternoon light, bougainvillea.",
 "barmer": "Golden sand dunes of the Thar desert at sunset, a lone oil drilling rig silhouetted on the horizon, a camel in the foreground, glowing sky.",
 "berenike": "An ancient Roman-era harbour on the Red Sea coast with desert hills, wooden sailing ships in the bay, and in the foreground a large clay amphora jar tipped over spilling black peppercorns onto the sand, warm evening light.",
 "panipat": "A textile recycling yard with towering mountains of colourful used clothes sorted by colour, bales of fabric, fluffy shredded fibre drifting in sunbeams, workers small in the background with faces not visible.",
 "bhitarkanika": "A huge saltwater crocodile basking on a muddy bank of a mangrove creek, tangled mangrove roots, misty golden morning light, a small wooden boat far behind, powerful and dramatic.",
 "thibaw": "A red-roofed two-storey colonial-era palace on a green hill overlooking the Arabian Sea at sunset, coconut palms, and in the foreground an empty ornate gilded Burmese royal chair, melancholic and quiet.",
 "narcondam": "A Narcondam hornbill (black body, white tail, pale yellow bill and casque, rufous-orange head and neck) perched on a branch in the foreground, behind it a small forested volcanic island cone rising steeply from a deep blue sea.",
}

def gen(prompt, ratio, out):
    body = {"contents": [{"parts": [{"text": prompt + " " + STYLE}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": ratio}}}
    for a in range(5):
        r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent", timeout=180,
                          headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"}, data=json.dumps(body))
        if r.status_code == 200:
            parts = r.json()["candidates"][0]["content"]["parts"]
            img = [p for p in parts if "inlineData" in p]
            if img: out.write_bytes(base64.b64decode(img[0]["inlineData"]["data"])); return True
        print("  retry", out.name, r.status_code, r.text[:160].replace("\n", " ")); time.sleep(10 * (a + 1))
    return False

if __name__ == "__main__":
    ids = sys.argv[1:] or list(ART)
    for i in ids:
        d = ROOT / "public" / "geo" / i
        for ratio, name in (("9:16", "art_thumb.png"), ("1:1", "art_post.png")):
            ok = gen(ART[i], ratio, d / name); print(i, name, "ok" if ok else "FAILED", flush=True)
