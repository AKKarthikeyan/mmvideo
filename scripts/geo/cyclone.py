# Indica Atlas cyclone Shorts (27 Oct 2026). Beats come from the cleared research folders, one claim ID per line there.
# CY01 script + claims: docs/geo/research/CY01-odisha-deaths/script_v1.json (SCRIPT_v1.md). Each beat: (key, spoken text, caption).
# Voice (daytime 06:45-22:10 IST only): zsh -lic 'python3 scripts/geo/voice_geo.py cyclone:cy01odisha'
VOICE = "English_Diligent_Man"

VIDEOS = {
"cy01odisha": [
    ("b1", "In nineteen ninety-nine, one cyclone killed almost ten thousand people in Odisha.", "Odisha, 1999: 9,887 dead"),
    ("b2", "Most drowned, as the sea surged far inland.", "Most deaths: the sea surge"),
    ("b3", "Two months later, Odisha set up its own disaster authority.", "Dec 1999: disaster authority set up"),
    ("b4", "It built hundreds of cyclone shelters.", "Hundreds of cyclone shelters"),
    ("b5", "In twenty thirteen, Phailin struck, the strongest to hit India since.", "2013: Phailin"),
    ("b6", "The order: zero casualties. Nearly a million people were moved out of its way.", "Order: ZERO CASUALTY · 9.84 lakh moved"),
    ("b7", "Twenty-one died in the storm.", "Phailin: 21 dead"),
    ("b8", "Almost ten thousand, then twenty-one. But the floods that followed killed more than the storm.", "9,887 → 21 · floods killed more"),
    ("b9", "Odisha outran the sea. Can it outrun the floods?", "Outran the sea. The floods?"),
],
"cy02bay": [
    ("b1", "Storm for storm, there's no sign Bay of Bengal cyclones are stronger.", "Stronger? No sign, storm for storm"),
    ("b2", "India's weather service counts six in ten storms turning severe, in the Bay and the Arabian Sea.", "IMD 1982–2024: 62% vs 62% turn severe"),
    ("b3", "But the Bay makes about twice as many cyclones, and the deadliest on record.", "About 2× as many · deadliest on record"),
    ("b4", "In nineteen seventy, in what is now Bangladesh, at least three hundred thousand died, mostly from the storm surge.", "1970: 300,000+ died (WMO estimate)"),
    ("b5", "Why? At its head the Bay narrows like a funnel, with shallow water and crowded low islands.", "The Bay narrows: 1,400 km → under 500 km"),
    ("b6", "So it's less about stronger storms, more about where they land.", "Not stronger storms: where they land"),
    ("b7", "Stronger? No. Deadliest on record? Yes.", "Stronger? No. Deadliest on record? Yes."),
],
}
