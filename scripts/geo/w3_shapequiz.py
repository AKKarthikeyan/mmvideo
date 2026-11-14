# Indica Atlas W3-14 shape quiz (India slot) · G3 Guess the Place · F8 quiz. Research: docs/geo/research/W3-14-shape-quiz (CLEARED, G6 PASS).
# Claim IDs per beat: docs/geo/research/W3-14-shape-quiz/script_v1.json.
# b1 C007 | b2 C001 | b3 C001 C002 | b4 C005 | b5 C005 C006 | b6 C007 C008 | b7 C007 | b8 C001 C007
# Voice: zsh -lic "cd /Volumes/DarwinSSD/MMVideo && python3 scripts/geo/voice_geo.py w3_shapequiz:w3shapes"; then trim_geo.py w3shapes 1.07
VOICE = "English_Diligent_Man"

VIDEOS = {
"w3shapes": [
    ("b1", "Three Indian states, shapes only. One is eighty-three times another's size.", "3 states · shapes only · one is ~83× another"),
    ("b2", "Shape one: second-largest state in the last census. Which is it?", "Shape 1 · 2nd largest (Census 2011) · Which state?"),
    ("b3", "Madhya Pradesh, ahead of Maharashtra by five hundred and thirty-nine square kilometres.", "MADHYA PRADESH · ahead of Maharashtra by 539 km²"),
    ("b4", "Shape two gained four taluks from Travancore-Cochin in nineteen fifty-six. Which is it?", "Shape 2 · 1956: four taluks moved in · Which state?"),
    ("b5", "Tamil Nadu, then called Madras. Those taluks became Kanyakumari district.", "TAMIL NADU (then Madras) · Kanyakumari: 1,684 km² (2011)"),
    ("b6", "Shape three: so small, we had to zoom in. Which is it?", "Shape 3 · zoomed in · Which state?"),
    ("b7", "Goa, the smallest state by area in the last census.", "GOA · smallest state by area (Census 2011)"),
    ("b8", "Shape one is about eighty-three Goas. How many did you get?", "Madhya Pradesh ≈ 83 × Goa (Census 2011 areas)"),
],
}
