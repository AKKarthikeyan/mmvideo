# Indica Atlas extra Shorts outside the numbered weeks (4 Nov 2026). Each beat: (key, spoken text, caption).
# Length rule (AK, 25 Oct 2026): 25-35 s, 85-100 spoken words. Voice with: zsh -lic 'python3 scripts/geo/voice_geo.py extra:tnmonsoon' (06:45-22:10 IST only).
# Research: docs/geo/research/X1-tn-nemonsoon/ (claim IDs in docs/geo/extra/tnmonsoon_script.md). Scene spec: src/geo/extra/tnmonsoon.ts.
VOICE = "English_Diligent_Man"

VIDEOS = {
"tnmonsoon": [
    ("b1", "Forty-eight per cent of Tamil Nadu's yearly rain falls after the summer monsoon withdraws.", "48% of Tamil Nadu's rain: after the summer monsoon"),
    ("b2", "About seventy-five per cent of India's rain falls in that monsoon.", "India: ~75% in June–September"),
    ("b3", "But in those months, IMD says, Tamil Nadu sits in a rain shadow.", "June–Sept: Tamil Nadu in a rain shadow (IMD)"),
    ("b4", "Then, in October, the summer monsoon withdraws.", "October: the summer monsoon withdraws"),
    ("b5", "Low-level winds reverse, from south-westerly to north-easterly.", "Low-level winds reverse: SW → NE"),
    ("b6", "Low-pressure systems from the Bay of Bengal drift west, adding rain.", "Bay of Bengal systems drift west, adding rain"),
    ("b7", "The north-east monsoon takes over: for Tamil Nadu, the chief rainy season.", "North-east monsoon: Tamil Nadu's chief rainy season"),
    ("b8", "So its biggest rains begin as India's summer monsoon ends.", "Its biggest rains begin as the summer monsoon ends"),
],
"hormuz": [
    ("b1", "In 2024, about one in every five barrels of oil the world used passed through this narrow strait.", "2024: about 1 in 5 barrels of the world's oil"),
    ("b2", "It is the Strait of Hormuz, between Oman and Iran.", "Strait of Hormuz · between Oman and Iran"),
    ("b3", "But most of its crude goes to Asia: eighty-four per cent.", "84% of its crude goes to Asia"),
    ("b4", "China, India, Japan and South Korea are the top destinations.", "Top destinations: China · India · Japan · S. Korea"),
    ("b5", "For the United States, it is about two per cent of its petroleum use.", "US: ~2% of its petroleum use"),
    ("b6", "EIA says Asia would likely be hit hardest by a closure.", "EIA: Asia would likely be hit hardest"),
    ("b7", "One strait, about a fifth of the world's oil, and most of its crude bound for Asia.", "One strait · about a fifth of the world's oil · mostly to Asia"),
],
}
