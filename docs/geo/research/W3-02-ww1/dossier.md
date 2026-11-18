# W3-02-ww1: Why over a million Indians fought in World War One (research dossier, 1 Nov 2026)

G7: PASS. At least two verified facts the popular versions leave out (section 3: items 1-5; items 1 and 2 are strong enough to be the hook).

Status: research only, no script. Sensitive (colonial history). Every figure below is a claim ID in `claims.jsonl`; computations are in `method/ww1_numbers.py`. G6 (independent check) is still to be done: `verify.md` is a stub.

## 1. Is the pitch true as worded?
Close, but with three corrections.
- "Over a million Indians" is true for **Indians sent overseas**: 1,096,013 to 31 December 1919 (War Office and Government of India agree, CWGC says "more than one million") [C003]. But 474,789 of them (43.3 per cent) were non-combatants such as labour and followers; 621,224 were Indian combatants [C004].
- 56.7 per cent of them (621,224) were combatants, so "fought" fits most; but the larger part went to Mesopotamia, not the Western Front [C004, C005].
- "Why" has no single record-based answer: the sources show wages and bonus, duty and honour in soldiers' letters, a Viceroy telling the Council the Empire had been "plunged into war" [C015], and a mid-war British promise of reform. Sources never say Indians fought *for* that promise [C015, C017, C020, C021].

Honest one-line wording for AK: "Over a million Indians were sent overseas in the First World War, about 620,000 of them as soldiers, and most went not to France but to Mesopotamia."

## 2. What the record shows (timeline)
- Eve of war: 76,953 British and 239,561 Indian ranks in the Army in India (193,901 Indian combatants) [C001]. The Indian Army had been cut for economy: divisions ready to mobilise reduced from nine to seven, equipment set by frontier warfare only, medical services worst of all [C014].
- 4 Aug 1914: Britain declares war (CWGC's start date) [C022]. 8 Sep 1914: the Viceroy tells the Legislative Council that "five weeks ago" the British Empire "was plunged into war" and reads the King-Emperor's message [C015].
- 26 Sep 1914: the first Indian troops land at Marseilles; the Sirhind Brigade, held in Egypt, arrives 30 Nov [C010]. March 1915: Neuve-Chapelle; CWGC says Indian forces were about a third of the attack (hedged) [C011].
- 1917: the Government offers GBP 100 million as a war contribution; nearly GBP 75 million raised by loans in India [C019]. 20 Aug 1917: Montagu's declaration on "the increasing association of Indians" [C020].
- April 1918: Delhi War Conference; India undertakes half a million recruits in 12 months; about 200,000 enrolled by the Armistice [C018].
- Recruited by 31 Dec 1919: 877,068 combatants + 563,369 non-combatants = 1,440,437 [C002].
- Dead: 61,041 to 62,056 by the Government's own counts; about 74,000 by CWGC (to 31 Aug 1921) [C006, C026, C027, C028, C022].
- Memorials: Neuve-Chapelle (4,700+ names, no known grave); India Gate (13,000+ names; national memorial to the dead of "Undivided India") [C012, C013].

## 3. Fresh angles (G7: verified facts the popular versions leave out)
1. **Mesopotamia, not France.** 675,391 of the 1,096,013 Indians sent overseas went to Mesopotamia (61.6 per cent) against 138,608 to France (12.6 per cent) [C005]. In the Government's own table of dead, Mesopotamia holds 33,462 of 61,041 (54.8 per cent) against France's 8,907 (14.6 per cent): about 3.8 to 1 [C007]. The popular picture is turbaned troops in Flanders.
2. **The "million" is 43 per cent labourers and followers.** 474,789 non-combatants [C004]. The soldiers are 621,224. It does not shrink the sacrifice (followers died too: 18,783 of the dead in the Government table [C007]); it says who the million were.
3. **One province, about a tenth of the people, about half of British India's provincial combatant recruits.** Punjab 349,688 of 683,149 combatants (51.2 per cent of the provinces' combatants; 42.3 per cent of all combatants once the Indian States' recruits are counted) from about 9 per cent of the provincial population (hedged; C008, C009). Bengal supplied 7,117 combatants and 51,935 non-combatants [C008].
4. **An army built for the frontier.** The Mesopotamia Commission (a British Parliament inquiry, 1917) found the Indian Army "suddenly and unexpectedly called upon" for a war nobody had prepared it for [C014]. (Dossier's own line, not the Commission's: the cuts, not courage, shaped the Mesopotamia campaign.)
5. **Nobody agrees how many died.** 61,041, 62,056, about 74,000, and "70,000" on another CWGC page [C006]. The twist is that each count belongs to someone, and the windows differ by up to a year [C022].
6. **The record of why.** A bonus of Rs. 50 (+ Rs. 15), a 25 per cent field allowance, one soldier writing that his family will get an allowance, though he also wrote "I do not al all like this, but I am helpless" [C017, C021]. Pay and bonus are what was offered, not a proven motive; "duty" appears in one letter [C021].

## 4. Hook and twist candidates (for the scriptwriter; not script)
- Hook A (surprise number): "Over a million Indians were sent overseas in the First World War. Six in ten went to Mesopotamia; only one in eight to France." [C003, C005]
- Hook B (who counts): "The official books give different numbers for India's war dead, depending on who counts." [C006]
- Twist to "why": the Government's own words say it was voluntary, the Commission says it was unprepared, one soldier's letter says duty, another says he is helpless, and no document says they fought for freedom [C016, C014, C021, M6]. Say what is disputed as a dispute.
- Closing question: "Whose war was it?" is a framing, not a fact: only if AK approves.

## 5. Map and visual notes (all borders from official geodata)
- House outline for India = Natural Earth India point of view `ne_10m_admin_0_countries_ind` in `sources/geo/` (repo file; the brief says it is also in `public/geo/_shared/`, where only `geo.json` was seen) [S12]. Do not draw the British Indian Empire of 1914 as a border and do not label modern Pakistan, Bangladesh or Myanmar as part of India.
- Pins from `ne_10m_populated_places_simple`: Mumbai (72.88E, 19.07N), Karachi (66.99E, 24.87N), Marseille (5.37E, 43.29N), Basra (47.81E, 30.52N), Mombasa (39.69E, -4.04N). Labels: use "Mesopotamia (now Iraq)" for the period name; show Marseille as "Marseilles" only if quoting the document [C023].
- Great-circle lines (say "straight line", not shipping route): Mumbai-Marseille about 6,765 km; Karachi-Basra about 1,986 km; Mumbai-Mombasa about 4,448 km [C023].
- Bar graphics from [C005] (theatre shares) and [C007] (dead by theatre) are drawn in code: cost-free and exact. A single bar split into 56.7 per cent combatants / 43.3 per cent non-combatants [C004].
- No photographs (rule 5: nothing CC BY-SA); drawn-in-code silhouettes and the memorial inscription text only. The CWGC Delhi page was blocked: the inscription is as quoted by CWGC [C013], to be checked against the monument.
- Do NOT show Kashmir or any disputed border; the story needs none.

## 6. What a 9-beat 85-100 word Short could safely say (ten strongest verified one-sentence facts)
1. About 1,096,000 Indians were sent overseas in the First World War, counting labourers and followers [C003, C004].
2. About 621,000 of them were soldiers; the rest, 474,789, were non-combatants [C004].
3. Six in ten went to Mesopotamia; one in eight went to France [C005].
4. The Government of India's own table shows 33,462 of 61,041 dead in Mesopotamia, 8,907 in France [C007].
5. The Indian Army had been cut before the war: nine divisions ready to mobilise became seven [C014].
6. The Viceroy told the Council the Empire "was plunged into war" five weeks earlier [C015].
7. Punjab gave 349,688 of 683,149 combatant recruits in British India's provinces, about half (42.3 per cent of all combatants counting the States), with about a tenth of the provincial people (hedged) [C008, C009].
8. Recruits were offered a bonus of Rs. 50 [C017]; one soldier wrote "Fighting is our duty" and another "I am helpless" [C021].
9. The count of dead depends on who counts: 61,041 (Government of India), 62,056 (War Office), or about 74,000 (CWGC) [C006, C026, C027, C028].
10. The Neuve-Chapelle memorial names more than 4,700 Indian soldiers and labourers with no known grave [C012].

## 7. Source notes (rule 6: who gains)
- S01 (War Office, 1922) and S02 (Government of India, 1923) share one origin for the India figures ("information supplied by the India Office"). Both are the rulers' own accounts of their army; S02 is openly a record of loyalty and service and is the weaker witness on motive [C016, C019].
- S03-S06 (CWGC): the data owner for commemoration, a charity-and-intergovernmental body with no stake in the war's causes; its counts go to 31 Aug 1921 and are not the same as the War Office's [C006].
- S08 (Mesopotamia Commission): British Parliament criticising its own Governments: strong on the army's unreadiness.
- S11 (soldiers' letters): British censors chose and translated them; volunteers typed them.
