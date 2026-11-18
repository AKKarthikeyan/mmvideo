# Indica Atlas border Shorts (28 Oct 2026). SENSITIVE: AK checks the wording before anything is voiced.
# CY03 script + claims: docs/geo/research/CY03-galwan-lac/script_v1.json (SCRIPT_v1.md). Each beat: (key, spoken text, caption).
# Voice (daytime 06:45-22:10 IST only; AK has NOT approved voicing yet): zsh -lic 'python3 scripts/geo/voice_geo.py lac:cy03lac'
VOICE = "English_Diligent_Man"

VIDEOS = {
"cy03lac": [
    ("b1", "In nineteen ninety-six, India and China agreed to exchange maps of the Line of Actual Control.", "1996: agree to swap LAC maps"),
    ("b2", "In twenty twenty, at Galwan, India says twenty personnel died; China says casualties on both sides.", "Galwan, 2020 · India: 20 died · China: casualties on both sides"),
    ("b3", "India says disengagement is complete, with patrols restored at Depsang and Demchok.", "India: disengagement complete · patrols back at Depsang, Demchok"),
    ("b4", "But elsewhere, India says, steps are temporary and limited, and troop cuts were only agreed for discussion in twenty twenty-five.", "Elsewhere: 'temporary and limited' steps · troop cuts: to be discussed (2025)"),
    ("b5", "And the line itself? India says some areas lack a common understanding of it.", "India: no common understanding of the LAC in some areas"),
    ("b6", "Thirty years after the map promise, August twenty twenty-six talks still discussed ways to improve understanding of it.", "1996 → 2026: still discussing the LAC"),
],
}
