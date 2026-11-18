# W4-02 Ganga at Varanasi: search log (14 Nov 2026, Shorts Lite)

Researcher: Claude (research agent, one run). Lite mode: 2-3 original sources.
Examined sources: 5 (CWC basin page, India-WRIS Ganga page, Varanasi district site, Natural Earth geodata, 2 web searches)
Saturation: yes (lite: the three cited owners settle all 8 spine claims; further searches for an official 'Uttarvahini' page found none)

| What | Query / URL | Result | Kept |
|---|---|---|---|
| WebSearch | Varanasi Ganga flows north uttarvahini (site:varanasi.nic.in, up.gov.in, uptourism.gov.in) | Only tier-X pages (heritage site, travel site, Wikipedia mirrors, coaching notes) | none opened as evidence; led to cwc.gov.in/lgbo/about-basins |
| curl | cwc.gov.in/lgbo/about-basins | 200; course, 2,525 km, 'left bank', 195 km, 'almost eastern direction' | S01 |
| curl | indiawris.gov.in/wiki/doku.php?id=ganga | 200; same 2,525 km; no Varanasi bank or direction | opened, not cited (lite cap); saved as sources/indiawris_ganga.txt |
| curl | varanasi.nic.in home, about-district, history, culture-heritage, tourism, demography, tourist-places, ganga-ghat, other-important-places | 'west bank' found on other-important-places; beliefs on history; ghat page looks Wikipedia-derived | S02 (two pages) |
| WebSearch | "uttarvahini" OR "uttarwahini" Ganga Kashi site:gov.in/nic.in/shrikashivishwanath.org | No official page; Wikipedia, drishtiias, news | nothing; C12 UNVERIFIED |
| Natural Earth | ne_10m_rivers_lake_centerlines 'Ganges', populated places | method/ganga_north.py | S03 |
| NCERT | ncert.nic.in/textbook/pdf/iess103.pdf (Class 9 Drainage) | 404; not retried | belief source gap (open_questions) |

Tier X seen and not used: culturalheritageofvaranasi.com, bharatonline.com, penang-traveltips.com, drishtiias.com, wisdomlib.org, scribd, Wikipedia and mirrors (Uttarvahini Ganga), greenmesg.org, organiser.org.
