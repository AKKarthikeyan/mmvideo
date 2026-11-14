# Indica Atlas W3-03 Baarle (global slot) · G5 The Line · F4 Cold Case. Research: docs/geo/research/W3-03-baarle (CLEARED, G6 PASS).
# Claim IDs per beat: docs/geo/research/W3-03-baarle/script_v1.json.
# b1 C007 | b2 C005 | b3 C008 | b4 C001 | b5 C001 C002 | b6 C003 | b7 C014 C016 C017 | b8 C007
# Voice: zsh -lic "cd /Volumes/DarwinSSD/MMVideo && python3 scripts/geo/voice_geo.py w3_baarle:w3baarle"; then trim_geo.py w3baarle 1.07
VOICE = "English_Diligent_Man"

VIDEOS = {
"w3baarle": [
    ("b1", "One border treaty reaches a town, and simply writes: the limit is interrupted.", "1843 treaty, at Baarle: “the limit is interrupted”"),
    ("b2", "That treaty, from eighteen forty-three, set the border between the Netherlands and Belgium.", "Netherlands–Belgium boundary treaty · 1843"),
    ("b3", "But at Baarle, an older deal said the status quo must stay.", "1842 treaty, Art. 14: the status quo stays at Baarle"),
    ("b4", "So no line was drawn there. Today, the map shows thirty enclaves.", "30 enclaves today (official maps)"),
    ("b5", "Twenty-two are Belgian pieces, inside the Netherlands.", "22 Belgian enclaves inside Dutch land"),
    ("b6", "And six Dutch pieces sit inside the biggest Belgian one.", "6 Dutch pieces inside the largest Belgian enclave (165 ha)"),
    ("b7", "In eighteen ninety-two, both governments agreed a land swap to end this. Belgium's bill lapsed.", "1892 swap deal · Belgian bill lapsed in 1894"),
    ("b8", "All because one treaty wrote: the limit is interrupted.", "Treaty of 1843: “the limit is interrupted”"),
],
}
