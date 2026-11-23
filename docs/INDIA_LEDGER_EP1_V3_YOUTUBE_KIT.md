# India Ledger · Episode 1 · YouTube kit

**The Govt Bet Against Gold and Lost. You're Paying for It.**

Draft for AK, 20 Nov 2026. Nothing has been uploaded. AK uploads.

## Files

The video is in `out/india_ledger/` on the Mini. Everything else is in `out/india_ledger/youtube-kit/`.

| File | What it is |
|---|---|
| `india-ledger-gold-v3.mp4` | Final video: 1080p, 5:29, English voice, −16 LUFS. A small top-right box, "Audio also in हिन्दी · தமிழ் · తెలుగు", shows for 20 s every 30 s (from 0:02). |
| `thumbnail.jpg` | Thumbnail, 1280×720 (₹650) |
| `captions_en.srt` | English captions, timed to the voice |
| `audio_hi_maya-siddhant_DRAFT.m4a` | Hindi audio track, Maya-2-Native voice "Siddhant". Same length as the video. |
| `audio_ta_maya-siddhant_DRAFT.m4a` | Tamil audio track, Maya Siddhant |
| `audio_te_maya-siddhant_DRAFT.m4a` | Telugu audio track, Maya Siddhant |
| `captions_hi/ta/te_DRAFT.srt` | Captions that match each dubbed track |

**Native-speaker check.** The Hindi, Tamil and Telugu files are drafts. A native speaker should listen to each before it goes up.

**Voices.** All three use Maya-2-Native, voice Siddhant (your pick, 20 Nov 2026). It runs locally on the Mini. The video itself stays English; these are extra audio tracks only. To rebuild one: `il_v3_maya.py <hi|ta|te>` with the mayavenv python.

## Upload settings

- **Category:** Education
- **Audience:** not made for kids
- **Video language:** English
- **Altered or synthetic content:** **Yes**. The voice is AI-generated, and Amma and Ravi are AI-made illustrations.
- **Paid promotion:** no
- **Thumbnail:** `thumbnail.jpg`
- **Chapters:** they are in the description. The first one starts at 0:00, so YouTube will pick them up.
- **Extra audio tracks:**
  1. Open Studio → the video → **Languages**.
  2. Add Hindi, Tamil and Telugu.
  3. Under each one, upload that language's `.m4a` as the **Audio** track.
  4. Upload that language's `.srt` as its captions.
  - Multi-language audio has to be switched on for the channel. I have not checked whether it is.
- **Translated title and description:** add them in the same Languages page (they are below).

## Title

The Govt Bet Against Gold and Lost. You're Paying for It.

## Description (English)

In 2015, the Government of India made a bet against gold. Gold went up almost five times. On 13 November 2026, one batch of its gold bonds paid back 4.4 times the money. The extra cost of the bet comes to about ₹650 for every Indian.

This is the story of Amma, who wouldn't hand over her mother's bangle, and Ravi, who bought gold that didn't exist. It's also the story of a reasonable bet that lost.

Amma and Ravi are illustrations, not real people. The voice is AI-generated (MiniMax). Hindi, Tamil and Telugu audio: AI voice (Maya-2-Native).

**Chapters**
0:00 The bet
0:28 The pile India can't touch
1:03 Two plans
1:19 Plan A: give us the bangle
1:58 Plan B: gold that doesn't exist
2:44 The bet goes wrong
3:23 Who pays
4:08 Amma won twice
4:30 So, was it a scam?
5:00 You're paying for it

**Sources**
- RBI: Sovereign Gold Bond issue prices, all 67 tranches, Nov 2015 to Feb 2024, and redemption prices. Press release of 12 Nov 2026: final redemption on 13 Nov 2026 at ₹14,024.
- IBJA gold 999 closing rate, 19 Nov 2026: ₹12,953 per gram. This is the price RBI uses for gold bond redemptions.
- RBI: Gold Monetisation Scheme FAQ (testing and melting of deposited gold)
- RBI Handbook of Statistics on Indian Economy 2019, Table 39 (gold price, Mumbai, yearly average)
- RBI Bulletin, Sep 2026: bank credit by sector, 31 Jul 2026 (loans against gold jewellery)
- PIB, Ministry of Finance, 5 Nov 2015: launch of the gold schemes
- Ministry of Finance, Mar 2025: gold deposited under the Gold Monetisation Scheme
- DGCIS, FY 2025-26: gold imports and import ranking
- Ministry of Mines, 2024-25: gold mined in India
- World Gold Council, Aug 2026: household gold (an estimate) and the "Swarnim Udaan 2047" proposal. This is a proposal, not government policy.
- Government Securities Act, 2006 · Finance Bill 2026 (tax on redemption)
- 10-year G-sec yield in each issue month (FRED) · population 142.6 crore (MoHFW projection, 2026)
- The ₹93,000 crore extra cost and ₹650 per Indian are our own bond-by-bond estimates. For each bond, we took what it costs and subtracted what an ordinary 10-year loan would have cost that month. The bonds still outstanding are valued at the gold price of 19 Nov 2026, so the figure moves with gold.

**Photos and footage**
- Photos of the 2015 launch: Prime Minister's Office, Government of India (GODL-India)
- Photo of the Union Budget: Ministry of Finance, Government of India (GODL-India)
- "Crystallization of liquid gold": François Nguyen, CC BY 2.0
- "Into the twilight": Rajarshi Mitra, CC BY 2.0
- North and South Block, New Delhi: Ankur Panchbudhe, CC BY 2.0
- Pouring gold: public domain · 916 bangles: CC0
- Illustrations of Amma and Ravi: made for this video (MiniMax image and video models)

Educational research, not investment advice. Not SEBI-registered. Not affiliated with the Government of India.

## Tags

sovereign gold bond, SGB, gold bond loss, gold price India, government of India gold, gold monetisation scheme, SGB redemption, Indian economy explained, India Ledger, gold imports India, fiscal cost, RBI gold bond, gold story, Amma gold bangle, why government stopped SGB

## Pinned comment

Our number, in one line: the gold bonds will cost about ₹93,000 crore more than an ordinary loan would have. That's roughly ₹650 per Indian at the 19 Nov 2026 gold price. Gold has fallen for ten trading days in a row, so the bill is shrinking this month. It still moves every day.

How we worked it out: for every one of the 67 bond issues, we took what the government pays and subtracted what a normal 10-year loan would have cost that month. Every source is in the description. Did your family buy SGBs? Tell us below.

## Hindi (title and description)

**Title:** सरकार ने सोने के ख़िलाफ़ दांव लगाया और हार गई। क़ीमत आप चुका रहे हैं।

**Description:** 2015 में भारत सरकार ने सोने के ख़िलाफ़ एक दांव लगाया। सोना लगभग पांच गुना हो गया। 13 नवंबर 2026 को गोल्ड बॉन्ड की एक सीरीज़ ने 4.4 गुना पैसा लौटाया। इस दांव की अतिरिक्त लागत: हर भारतीय पर करीब ₹650।

ये कहानी है अम्मा की, जिन्होंने अपनी माँ का कंगन नहीं दिया, और रवि की, जिसने ऐसा सोना ख़रीदा जो था ही नहीं।

अम्मा और रवि चित्र हैं, असली लोग नहीं। आवाज़ AI से बनी है। स्रोत, अध्याय और फ़ोटो क्रेडिट अंग्रेज़ी विवरण में हैं।

शैक्षिक शोध, निवेश सलाह नहीं। SEBI-पंजीकृत नहीं। भारत सरकार से संबद्ध नहीं।

## Tamil (title and description)

**Title:** தங்கத்துக்கு எதிரா அரசு கட்டின பந்தயம் தோத்துச்சு. பில் உங்களுக்கு.

**Description:** 2015-ல இந்திய அரசாங்கம் தங்கத்துக்கு எதிரா ஒரு பந்தயம் கட்டுச்சு. தங்கம் கிட்டத்தட்ட அஞ்சு மடங்கு ஏறிடுச்சு. 13 நவம்பர் 2026 அன்று ஒரு கோல்ட் பாண்ட் சீரிஸ் 4.4 மடங்கு பணத்தைத் திருப்பிக் கொடுத்துச்சு. இந்த பந்தயத்தோட கூடுதல் செலவு: ஒவ்வொரு இந்தியருக்கும் சுமார் ₹650.

அம்மாவோட வளையல், ரவி வாங்கின இல்லாத தங்கம்: இது ரெண்டு பேரோட கதை.

அம்மாவும் ரவியும் ஓவியங்கள், நிஜ மனிதர்கள் இல்லை. குரல் AI மூலம் உருவாக்கப்பட்டது. ஆதாரங்கள், அத்தியாயங்கள், புகைப்பட நன்றி ஆங்கில விளக்கத்தில் இருக்கு.

கல்வி நோக்கிலான ஆய்வு, முதலீட்டு ஆலோசனை அல்ல. SEBI-ல் பதிவு செய்யப்படவில்லை. இந்திய அரசுடன் தொடர்பில்லை.

## Telugu (title and description)

**Title:** బంగారంపై ప్రభుత్వం పందెం కాసి ఓడింది. బిల్లు మీదే.

**Description:** 2015లో భారత ప్రభుత్వం బంగారానికి వ్యతిరేకంగా ఒక పందెం కాసింది. బంగారం దాదాపు ఐదు రెట్లు పెరిగింది. 13 నవంబర్ 2026న ఒక గోల్డ్ బాండ్ సిరీస్ 4.4 రెట్లు డబ్బు తిరిగి ఇచ్చింది. ఈ పందెం అదనపు ఖర్చు: ప్రతి భారతీయుడిపై సుమారు ₹650.

తల్లి ఇచ్చిన గాజును ఇవ్వని అమ్మ, లేని బంగారం కొన్న రవి: ఇది వాళ్ల కథ.

అమ్మ, రవి చిత్రాలు మాత్రమే, నిజమైన వ్యక్తులు కాదు. గొంతు AI ద్వారా రూపొందించబడింది. ఆధారాలు, అధ్యాయాలు, ఫోటో క్రెడిట్లు ఇంగ్లీష్ వివరణలో ఉన్నాయి.

విద్యా పరిశోధన, పెట్టుబడి సలహా కాదు. SEBI-లో నమోదు కాలేదు. భారత ప్రభుత్వంతో సంబంధం లేదు.

## Before upload

1. **Gold price.** Gold is falling, so check the latest IBJA 999 price on upload day.
   - Every ₹100 a gram moves the extra cost by about ₹1,200 crore, which is about ₹9 per Indian.
   - The "₹650" figure holds while gold stays within about ₹150 a gram of ₹12,953. If it moves further, the voice, screen and thumbnail all need updating together.
   - To update: change `PRICE_TODAY` in `scripts/india_ledger_gold.py`, then run `il_v3_build.py build` → `il_v3_page.py` → render → mux. The check in `il_v3_build.py` stops the build if a spoken number no longer matches the data.
2. **"Last week".** The English voice says "Last week, one batch of its gold bonds paid back 4.4 times." That redemption was on 13 Nov 2026. Upload by about 22 Nov, or the line needs re-voicing as "This month".
3. **Native review.** Have a native speaker check the Hindi, Tamil and Telugu tracks, and approve them.
4. **Terms.** Check MiniMax's terms and the Maya-2-Native model licence for commercial use of their output.
5. **Channel.** India Ledger (AK, 20 Nov 2026). It has no `deliver.py` key yet, so AK uploads by hand.
