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
"cy04baywhy": [   # docs/geo/research/CY04-bay-why/script_v1.json (3 Nov 2026)
    ("b1", "More than twice as many cyclones as the Arabian Sea: the Bay of Bengal, from nineteen eighty-two to twenty twenty-four.", "1982–2024: Bay 120 · Arabian Sea 51 (IMD)"),
    ("b2", "This week's Cyclone Murasu is the latest. Why so many, and why so deadly?", "Severe Cyclonic Storm Murasu · Nov 2026"),
    ("b3", "One: warmth. The Arabian Sea is cooler, and India's weather office says that holds storms back.", "1 · Cooler Arabian Sea holds storms back (IMD)"),
    ("b4", "Two: a lid. After the monsoon, river water caps the north Bay, so storms stir up warm water.", "2 · Fresh-water lid (north Bay, after the monsoon)"),
    ("b5", "Three: the shape. At its head, the Bay narrows like a funnel, over shallow water.", "3 · At its head: a funnel over shallow water"),
    ("b6", "Storms push the sea in, and it piles up. That surge is the biggest killer.", "The surge: the biggest killer (IMD)"),
    ("b7", "Warm water breeds them. The funnel makes them deadly.", "Warm water breeds them. The funnel makes them deadly."),
],
"cy05kgdelta": [   # docs/geo/research/CY05-kg-delta/script_v1.json (3 Nov 2026)
    ("b1", "About five to seven metres. That's how high the sea can surge where the Krishna and Godavari meet the Bay.", "Bapatla–Kakinada: surge of 5–7 m possible (IMD)"),
    ("b2", "India's weather office calls it a very high risk zone.", "IMD: Very High Risk Zone"),
    ("b3", "For Murasu, it warned of a surge up to one and a half metres, worst around Bapatla and Krishna.", "Murasu: peak surge 1–1.5 m forecast"),
    ("b4", "Two river mouths. After a cyclone in nineteen ninety, satellites saw water still standing in the Krishna delta eleven days later.", "May 1990: standing water seen after 11 days"),
    ("b5", "In nineteen seventy-seven, a cyclone struck Divi Seema. About ten thousand people died. The surge was blamed.", "1977 Divi Seema: about 10,000 dead · blamed on the surge"),
    ("b6", "One and a half metres this time. About five to seven is possible. Is the delta ready?", "1.5 m this time · 5–7 m possible"),
],
}
