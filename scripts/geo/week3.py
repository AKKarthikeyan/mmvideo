# Indica Atlas week 3 (AK 8 Nov 2026: all 14 Week 3 Shorts). Topics: docs/geo/week3/TOPICS.json.
# Every line comes from a CLEARED research folder (docs/geo/research/W3-*/, gates incl. G6); claim IDs per beat live in that
# folder's script_v1.json. Each beat: (key, spoken text, caption). Length rule (AK): 25-35 s. Scene specs: src/geo/week3/.
# Voice: python3 scripts/geo/voice_geo.py week3:<id>   then   python3 scripts/geo/trim_geo.py <id> 1.07
VOICE = "English_Diligent_Man"

VIDEOS = {
# W3-01 · F10 Paradox · claims C012 C013 | C014 | C006 C019 | C008 | C009 | C004 | C008 C013
"w3up": [
    ("b1", "Uttar Pradesh is about the size of the United Kingdom.", "UP ≈ UK in area (240,928 vs 243,610 km²)"),
    ("b2", "But in twenty twenty-six, it is projected to have three and a half times as many people.", "2026 (projected): UP ≈ 3.5× the UK's people"),
    ("b3", "That's about two hundred and forty-three million. A projection: India's last census was in twenty eleven.", "≈ 243 million (projection) · last census: 2011"),
    ("b4", "Counted as a country, it would rank sixth in the world.", "As a country: 6th in the world (UN list, 2026)"),
    ("b5", "Pakistan would be just above it, and Nigeria about level.", "Above: Pakistan · About level: Nigeria"),
    ("b6", "In the last census, one in six Indians lived in Uttar Pradesh.", "2011 census: 1 in 6 Indians"),
    ("b7", "Land the size of the UK. A crowd the size of the sixth-largest country.", "UK-sized land · 6th-largest crowd"),
],
# W3-02 · F1 Myth Flip · ⚑ colonial history · claims C003 | C004 | C005 | C007 | C026 C028 | C003 C006
"w3ww1": [
    ("b1", "The Government of India counted over a million Indians sent overseas in the First World War.", "Govt of India: 1,096,013 sent overseas (to end 1919)"),
    ("b2", "But about forty-three percent were not soldiers: they were labourers and followers.", "43.3% non-combatants · 56.7% combatants"),
    ("b3", "And most did not go to France. Over sixty percent went to Mesopotamia, now Iraq; thirteen percent, to France.", "Mesopotamia 61.6% · France 12.6%"),
    ("b4", "More than half the dead, by the Government of India's own table, were in Mesopotamia.", "Dead (Govt of India table): Mesopotamia 54.8% · France 14.6%"),
    ("b5", "Even the death toll depends on who counted: from sixty-one thousand to about seventy-four thousand.", "Govt of India 61,041 · CWGC ≈ 74,000"),
    ("b6", "A million went overseas, and the official counts of their dead still differ.", "1,096,013 went · the counts of the dead differ"),
],
# W3-05 · F13 Scale Shock · claims C003 C004 C005 | C001 | C004 | C006 C008 | C009 | C007 | C004 C005
"w3rajasthan": [
    ("b1", "Rajasthan is bigger than all but six countries in Europe.", "Bigger than all but 6 European countries (UN list)"),
    ("b2", "It covers about three hundred and forty-two thousand square kilometres.", "Rajasthan: 342,239 km²"),
    ("b3", "Only Russia, Ukraine, France, Spain, Sweden and Germany are larger.", "Larger: Russia · Ukraine · France · Spain · Sweden · Germany"),
    ("b4", "Germany is just four and a half percent bigger. Finland, one percent smaller.", "Germany +4.5% · Finland −1.1%"),
    ("b5", "So Rajasthan fits in a gap: no European country lies between Finland and Germany.", "Nothing between Finland and Germany"),
    ("b6", "Norway depends on the definition: its mainland is smaller, but with Svalbard it is bigger.", "Norway: mainland smaller · with Svalbard, bigger"),
    ("b7", "Bigger than all but six, measured the same way.", "Total area, one basis for every country (UN list of Europe)"),
],
}
