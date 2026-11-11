"""Upload kits for the Reveal Loop Shorts: what goes into YouTube and Instagram next to the video.

`shorts_build.py kit <id>` reads KITS[id] and the built story.js and writes out/hyperframes/kit/<id>/:
  kit.txt        titles to test, description with sources, pinned comment, tags, Instagram caption, upload settings
  captions.srt   the narration as captions, timed to the voice (upload as the caption track)
  cover.png      a frame for the Shorts / Reels cover (taken at `cover` seconds of the final video)
Rules followed (docs/SHORTS_RULES.md): title at most 50 characters, 0-2 hashtags, sources in the description, the
Related video set by hand in Studio. Hindi kits are in Hindi; a native speaker checks them with the voice track.
"""

NCERT = "NCERT Class 9, Contemporary India I, ch. 1 \"India: Size and Location\": https://ncert.nic.in/textbook/pdf/iess101.pdf"
TERRAIN = "Terrain: AWS Terrain Tiles (Mapzen; sources include SRTM, GMTED, ETOPO1 and GEBCO): https://registry.opendata.aws/terrain-tiles/"
VOICE_EN = "Narration: synthetic voice."
VOICE_HI = "वाचन: कृत्रिम आवाज़।"

KITS = {}

KITS["ia-southtip"] = dict(
    cover=19.4,
    titles=["Kanyakumari is NOT India's southern tip", "India's real southern tip is 1,800 km away", "India is only 160 km from Indonesia"],
    description="""Every school map of India ends at Kanyakumari. India doesn't.
Its southernmost point is Indira Point, on Great Nicobar Island: about 1,800 km from Kanyakumari, and only about 160 km from Indonesia's Rondo Island. That is 11 times closer to Indonesia than to the mainland tip.

How we measured: great-circle distances from the Indira Point lighthouse (6°45.2′N, 93°49.6′E) to Kanyakumari and to Rondo Island. Our measurement.""",
    sources=[
        "Indira Point lighthouse, position, and the 4.25 m drop in 2004: Directorate General of Lighthouses and Lightships: https://www.dgll.nic.in/DGLL-light-house-location/about-portblair/indira-point-lighthouse",
        "Mainland India begins at 8°4′N: " + NCERT,
        "Rondo Island base point TD.177 (06°04′30″N, 95°06′45″E): Indonesia Government Regulation 38 of 2002: https://dmsppid.bantenprov.go.id/upload/dms/21/pp38-th2002_daftar-koordinat-geografis.pdf",
        "Subsidence of 4.25 ± 0.2 m: R. Bilham, University of Colorado (2005): https://cires1.colorado.edu/~bilham/IndonesiAndaman2004_files/IndiraPointSubsidence.htm",
        "Satellite image: contains modified Copernicus Sentinel data 2026 (Sentinel-2, 11 January 2026)",
        TERRAIN,
    ],
    hashtags="#IndicaAtlas #Geography",
    pinned="Which other 'fact' from your school atlas should we check next?",
    tags=["Kanyakumari", "Indira Point", "Great Nicobar", "southernmost point of India", "India map", "Indian geography", "Andaman and Nicobar Islands"],
    instagram="Kanyakumari is not India's southern tip. The real one is 1,800 km away, and only 160 km from Indonesia. Send this to the friend who still points at Kanyakumari.\n\nSources in the YouTube description (link in bio).\n#IndicaAtlas #Geography",
    voice=VOICE_EN, lang="English (India)")

KITS["ia-sunrise"] = dict(
    cover=20.6,
    titles=["One clock, two sunrises: India's 2-hour gap", "The sun rises at 4:05 am in India. And at 6:09.", "Why India's sunrise is 2 hours apart"],
    description="""India runs on one clock: Indian Standard Time. The sun doesn't.
On 21 June, the sun rises at about 4:05 am in Dong, Arunachal Pradesh, and at about 6:09 am in Guhar Moti, Gujarat: 2 hours and 4 minutes apart on the same clock.
India spans 29°18′ of longitude (68°7′E to 97°25′E), and every degree is 4 minutes of sun. That alone is almost two hours.

How we calculated: sunrise times for 21 June 2027 from the NOAA solar equations, for a sea-level horizon (hills delay the real sunrise by a few minutes). Our calculation.""",
    sources=[
        "Longitudes 68°7′E to 97°25′E, the two-hour time lag, and the Standard Meridian 82°30′E through Mirzapur: " + NCERT,
        "Solar equations: NOAA Global Monitoring Laboratory, Solar Calculator: https://gml.noaa.gov/grad/solcalc/",
        "Place coordinates: Dong 28.17°N 97.04°E, Guhar Moti 23.71°N 68.54°E (gazetteer values)",
        TERRAIN,
    ],
    hashtags="#IndicaAtlas #Geography",
    pinned="What time does the sun rise where you live? And should India have two time zones?",
    tags=["Indian Standard Time", "IST", "sunrise in India", "Dong Arunachal Pradesh", "Guhar Moti", "time zones India", "Indian geography"],
    instagram="India has one clock and two sunrises. On 21 June the sun is up at 4:05 am in Arunachal, and at 6:09 am in Gujarat. Should India have two time zones?\n\nSources in the YouTube description (link in bio).\n#IndicaAtlas #Geography",
    voice=VOICE_EN, lang="English (India)")

KITS["ia-sunrise-hi"] = dict(
    cover=23.0,
    titles=["घड़ी एक, सूर्योदय दो: भारत में 2 घंटे का फ़र्क़", "भारत में सूरज 4:05 पर भी निकलता है, 6:09 पर भी", "एक देश, एक घड़ी, दो सूर्योदय"],
    description="""भारत एक ही घड़ी से चलता है: भारतीय मानक समय। पर सूरज नहीं।
21 जून को अरुणाचल प्रदेश के डोंग में सूरज सुबह लगभग 4:05 पर निकलता है, और गुजरात के गुहार मोती में लगभग 6:09 पर। एक ही घड़ी पर 2 घंटे 4 मिनट का फ़र्क़।
भारत 29°18′ देशांतर में फैला है (68°7′ पू. से 97°25′ पू.), और हर डिग्री का मतलब है 4 मिनट की धूप। सिर्फ़ इसी से लगभग दो घंटे का अंतर बनता है।

गणना: 21 जून 2027 के सूर्योदय, NOAA के सौर समीकरणों से, समुद्र-तल क्षितिज के लिए (पहाड़ों के कारण असली सूर्योदय कुछ मिनट बाद दिखता है)। हमारी गणना।""",
    sources=[
        "68°7′ पू. से 97°25′ पू., दो घंटे का अंतर, और मिर्ज़ापुर से गुज़रती मानक याम्योत्तर 82°30′ पू.: " + NCERT,
        "सौर समीकरण: NOAA Global Monitoring Laboratory, Solar Calculator: https://gml.noaa.gov/grad/solcalc/",
        "निर्देशांक: डोंग 28.17° उ. 97.04° पू., गुहार मोती 23.71° उ. 68.54° पू.",
        TERRAIN,
    ],
    hashtags="#IndicaAtlas #भूगोल",
    pinned="आपके शहर में सूरज कितने बजे निकलता है? क्या भारत में दो टाइम ज़ोन होने चाहिए?",
    tags=["भारतीय मानक समय", "IST", "सूर्योदय", "डोंग अरुणाचल प्रदेश", "गुहार मोती", "टाइम ज़ोन", "भारत का भूगोल"],
    instagram="घड़ी एक, सूर्योदय दो। 21 जून को अरुणाचल में सूरज 4:05 पर निकलता है, गुजरात में 6:09 पर। क्या भारत में दो टाइम ज़ोन होने चाहिए?\n\nस्रोत YouTube विवरण में (लिंक बायो में)।\n#IndicaAtlas #भूगोल",
    voice=VOICE_HI, lang="Hindi")

KITS["ia-capitals"] = dict(
    cover=17.6,
    titles=["8 foreign capitals closer to Delhi than Chennai", "Kabul is closer to Delhi than Chennai is", "Delhi to Chennai is farther than you think"],
    description="""Delhi to Chennai is 1,756 km in a straight line. Eight foreign capitals are closer to Delhi than that:
Islamabad 692 km · Kathmandu 801 km · Kabul 1,005 km · Thimphu 1,226 km · Dushanbe 1,350 km · Dhaka 1,424 km · Tashkent 1,582 km · Bishkek 1,602 km.
Even Bengaluru (1,741 km) is farther from Delhi than Bishkek, the capital of Kyrgyzstan.

How we measured: great-circle distances between city-centre points. Road and air routes are longer. Our measurement.""",
    sources=[
        "City coordinates: GeoNames gazetteer (capitals, feature code PPLC): https://www.geonames.org/",
        TERRAIN,
        "No borders are drawn on the map.",
    ],
    hashtags="#IndicaAtlas #Geography",
    pinned="How many did you guess? And which Indian city is closer to a foreign capital than to its own state capital?",
    tags=["Delhi", "Chennai", "distance from Delhi", "India map", "Indian geography", "capitals near India", "Kabul", "Bishkek"],
    instagram="Eight foreign capitals are closer to Delhi than Chennai is. Kabul, Tashkent, even Bishkek. How many did you guess?\n\nSources in the YouTube description (link in bio).\n#IndicaAtlas #Geography",
    voice=VOICE_EN, lang="English (India)")

KITS["ia-capitals-hi"] = dict(
    cover=21.0,
    titles=["दिल्ली से चेन्नई दूर, 8 विदेशी राजधानियाँ पास", "काबुल दिल्ली से चेन्नई से ज़्यादा पास है", "दिल्ली से चेन्नई जितना सोचते हैं, उससे दूर"],
    description="""दिल्ली से चेन्नई की सीधी दूरी 1,756 किमी है। आठ विदेशी राजधानियाँ दिल्ली से इससे ज़्यादा पास हैं:
इस्लामाबाद 692 किमी · काठमांडू 801 किमी · काबुल 1,005 किमी · थिम्पू 1,226 किमी · दुशान्बे 1,350 किमी · ढाका 1,424 किमी · ताशकंद 1,582 किमी · बिश्केक 1,602 किमी।
बेंगलुरु (1,741 किमी) भी दिल्ली से, किर्गिज़स्तान की राजधानी बिश्केक से ज़्यादा दूर है।

नाप: शहर-केंद्रों के बीच वृहत्-वृत्त (सीधी) दूरी। सड़क और हवाई रास्ते इससे लंबे होते हैं। हमारी गणना।""",
    sources=[
        "शहरों के निर्देशांक: GeoNames gazetteer: https://www.geonames.org/",
        TERRAIN,
        "मानचित्र पर कोई सीमा-रेखा नहीं खींची गई है।",
    ],
    hashtags="#IndicaAtlas #भूगोल",
    pinned="आपने कितनी राजधानियों का अंदाज़ा लगाया था?",
    tags=["दिल्ली", "चेन्नई", "दिल्ली से दूरी", "भारत का नक्शा", "भारत का भूगोल", "काबुल", "बिश्केक"],
    instagram="आठ विदेशी राजधानियाँ दिल्ली से, चेन्नई से ज़्यादा पास हैं। काबुल, ताशकंद, यहाँ तक कि बिश्केक भी। आपने कितने सोचे थे?\n\nस्रोत YouTube विवरण में (लिंक बायो में)।\n#IndicaAtlas #भूगोल",
    voice=VOICE_HI, lang="Hindi")

KITS["ia-coastline"] = dict(
    cover=6.2,
    titles=["India's coastline is no longer 7,516 km", "India's coast just grew by 3,582 km", "Why India's coastline got 48% longer"],
    description="""Every school book says India's coastline is 7,516 km. The official figure is now 11,098.81 km.
India did not gain land. It changed the ruler: the new survey used maps at 1:250,000, against about 1:4,500,000 earlier, so it follows bays, creeks and estuaries the old one skipped. Gujarat's coast alone went from 1,214.70 km to 2,340.62 km.

Our ruler test: we stepped a 200 km ruler and then a 25 km ruler along the same mainland coast (Kutch to the mouth of the Hooghly) on Natural Earth's 1:10m coastline. 200 km ruler: 4,125 km. 25 km ruler: 5,465 km, a third longer. These two numbers are our measurement, and show the principle; the official figures come from far finer maps.""",
    sources=[
        "7,516.6 km re-assessed to 11,098.81 km by the National Hydrographic Office with the Survey of India; state figures: Rajya Sabha Unstarred Question 589, 4 December 2025 (Ministry of Earth Sciences): https://moes.gov.in/sites/default/files/589English.pdf",
        "Map scales 1:250,000 and 1:4,500,000, and the ten-year review: Ministry of Ports, Shipping and Waterways circular of 29 April 2025, as reported in the press",
        "Coastline for the ruler test: Natural Earth 1:10m coastline (public domain): https://www.naturalearthdata.com/",
        TERRAIN,
    ],
    hashtags="#IndicaAtlas #Geography",
    pinned="Did your school book say 7,516 km? Which state do you think has the longest coast now?",
    tags=["India coastline", "7516 km", "11098 km", "coastline paradox", "Gujarat coastline", "Indian geography", "UPSC geography"],
    instagram="Your school book said 7,516 km. The official figure for India's coastline is now 11,098 km, and not one inch of land was added. They changed the ruler.\n\nSources in the YouTube description (link in bio).\n#IndicaAtlas #Geography",
    voice=VOICE_EN, lang="English (India)")

KITS["ia-coastline-hi"] = dict(
    cover=8.0,
    titles=["भारत की तटरेखा अब 7,516 किमी नहीं रही", "भारत का तट 3,582 किमी कैसे बढ़ गया?", "7,516 नहीं, अब 11,098 किमी"],
    description="""हर स्कूली किताब कहती है कि भारत की तटरेखा 7,516 किमी है। अब सरकारी आँकड़ा 11,098.81 किमी है।
भारत की ज़मीन नहीं बढ़ी। नापने का पैमाना बदला: नए सर्वे में 1:2,50,000 के नक़्शे इस्तेमाल हुए, जबकि पहले लगभग 1:45,00,000 के थे। इसलिए अब वे खाड़ियाँ और मुहाने भी गिने गए जो पहले छूट जाते थे। अकेले गुजरात का तट 1,214.70 किमी से 2,340.62 किमी हो गया।

हमारा प्रयोग: Natural Earth की 1:10m तटरेखा पर, कच्छ से हुगली के मुहाने तक मुख्यभूमि का तट पहले 200 किमी और फिर 25 किमी के पैमाने से नापा। 200 किमी: 4,125 किमी। 25 किमी: 5,465 किमी, यानी एक-तिहाई ज़्यादा। ये दो आँकड़े हमारी गणना हैं और सिर्फ़ सिद्धांत दिखाते हैं; सरकारी आँकड़े कहीं ज़्यादा बारीक नक़्शों से आए हैं।""",
    sources=[
        "7,516.6 किमी का पुनर्मूल्यांकन 11,098.81 किमी (राष्ट्रीय जल सर्वेक्षण कार्यालय और भारतीय सर्वेक्षण विभाग); राज्यवार आँकड़े: राज्य सभा अतारांकित प्रश्न 589, 4 दिसंबर 2025: https://moes.gov.in/sites/default/files/589English.pdf",
        "नक़्शों का पैमाना और हर 10 साल में समीक्षा: पत्तन, पोत परिवहन और जलमार्ग मंत्रालय का परिपत्र, 29 अप्रैल 2025 (प्रेस के अनुसार)",
        "प्रयोग की तटरेखा: Natural Earth 1:10m coastline: https://www.naturalearthdata.com/",
        TERRAIN,
    ],
    hashtags="#IndicaAtlas #भूगोल",
    pinned="आपकी किताब में 7,516 किमी लिखा था? अब सबसे लंबा तट किस राज्य का है, बताइए।",
    tags=["भारत की तटरेखा", "7516 किमी", "11098 किमी", "गुजरात का तट", "भारत का भूगोल", "UPSC भूगोल"],
    instagram="स्कूल में पढ़ा था 7,516 किमी। अब भारत की तटरेखा का सरकारी आँकड़ा 11,098 किमी है, और ज़मीन एक इंच नहीं बढ़ी। बस पैमाना बदला।\n\nस्रोत YouTube विवरण में (लिंक बायो में)।\n#IndicaAtlas #भूगोल",
    voice=VOICE_HI, lang="Hindi")


KITS["dk-hundred"] = dict(
    cover=25.0,
    titles=["You pay ₹100 at DMart. DMart keeps ₹5.62", "Where your ₹100 goes at DMart", "DMart keeps only ₹5.62 of your ₹100"],
    description="""Out of every ₹100 you pay at DMart, here is where the money went in July-September 2026:
The goods ₹85.85 · Staff ₹2.06 · Other running costs ₹4.77 · Wear and tear (depreciation) ₹1.49 · Interest ₹0.31 · Left for DMart ₹5.62, before income tax.
Sales in those three months: ₹19,206 crore. A thin slice of a very big cake.

How we worked it out: each line of DMart's profit and loss statement for the quarter, divided by its sales. That split is our arithmetic. The pieces add to ₹100.10 because the profit includes about 10 paise of other income. In the video the coins are rounded to whole rupees (86 + 2 + 5 + 2 + 5).

Anna and Thambi are illustrated characters, not real people. Educational, not investment advice. We are not SEBI-registered. No share price or recommendation is discussed.""",
    sources=[
        "Avenue Supermarts (DMart): press release and financial results for the quarter ended 30 September 2026, filed with the stock exchanges on 10 October 2026",
    ],
    hashtags="#DataKadai #DMart",
    pinned="What did you guess DMart keeps out of ₹100? Tell us before you watch it again. Which shop should Anna count next?",
    tags=["DMart", "DMart profit", "Avenue Supermarts", "where does my money go", "DMart results", "retail margin", "Data Kadai", "explained simply"],
    instagram="You pay ₹100 at DMart. DMart keeps ₹5.62, before income tax. Anna counts it in one-rupee coins.\n\nSource: DMart's July-September 2026 results. Educational, not investment advice.\n#DataKadai #DMart",
    altered="No (a plainly animated cartoon; nothing in it looks like real footage of a real person or event)",
    voice="Narration: synthetic voices (one voice, pitched two ways). Characters are illustrations drawn in code.", lang="English (India)")

def srt_time(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"


def write_kit(sid, story, out_dir, final_mp4):
    """story = the dict in story.js; writes kit.txt, captions.srt and (when the final video exists) cover.png."""
    import html
    import re
    import subprocess
    k = KITS[sid]; out_dir.mkdir(parents=True, exist_ok=True)
    with open(out_dir / "captions.srt", "w", encoding="utf-8") as f:
        for i, c in enumerate(story["caps"], 1):
            f.write(f"{i}\n{srt_time(c['t0'])} --> {srt_time(c['t1'])}\n{html.unescape(re.sub('<[^>]+>', '', c['html']))}\n\n")
    for t in k["titles"]:
        if len(t) > 50:
            print(f"  {sid}: title over 50 characters ({len(t)}): {t}")
    L = [f"UPLOAD KIT · {sid} · {story['channel']} · {k['lang']}",
         f"Video: {final_mp4.name} · {story['dur']:.1f} s · 1080x1920 · loops (last line runs into the first)",
         "Captions: captions.srt · Cover: cover.png" + (f" (frame at {k['cover']} s)" if final_mp4.exists() else " (render the video first)"), "",
         "TITLE (test A first; B and C are the alternates)"] + [f"  {chr(65 + i)}. {t}   [{len(t)}]" for i, t in enumerate(k["titles"])]
    L += ["", "DESCRIPTION (paste as is)", k["description"], "", "Sources" if not story["lang"].startswith("hi") else "स्रोत"] + ["• " + s for s in k["sources"]]
    L += [k["voice"], k["hashtags"], "", "PINNED COMMENT", k["pinned"], "", "TAGS", ", ".join(k["tags"]), "",
          "YOUTUBE SETTINGS", f"  Language: {k['lang']} · Category: Education · Audience: not made for kids",
          "  Altered content: " + k.get("altered", "No (real maps and satellite images; the synthetic narrator needs no label)"),
          "  Related video: set by hand in desktop Studio once a long video on this topic exists",
          "  Remix: allow · Comments: on", "",
          "INSTAGRAM REEL (upload the same file natively; no YouTube marks on it)", k["instagram"], "",
          "BEFORE PUBLISHING", "  1. Listen to the whole video once with headphones (the build session cannot hear).",
          "  2. Read the captions against the voice." + (" A native speaker checks the Hindi." if story["lang"].startswith("hi") else ""),
          "  3. At 48 hours, read it against the channel's median (docs/SHORTS_RULES.md, section 7)."]
    (out_dir / "kit.txt").write_text("\n".join(L) + "\n", encoding="utf-8")
    if final_mp4.exists():
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(k["cover"]), "-i", str(final_mp4), "-frames:v", "1", str(out_dir / "cover.png")], check=True)
    return out_dir
