# W3-03 "Baarle: the town where the border runs through cafes": research dossier (1 Nov 2026)

Research only. No script. Every sentence carries claim IDs. Sources are listed in `sources.jsonl`; method scripts in `method/`.

## Verdict on the pitch
"The border runs through cafes" is **not supported by any official record we could read** [C022]. What the records do support: the Dutch-Belgian border around Baarle is the most fragmented in Europe by the owners' own count, **30 enclaves** (22 Belgian pieces in Dutch land, 8 Dutch pieces in Belgian land) [C001, C002, C003]; the line cuts through houses (named by the 1995 procès-verbal via Franckx) and through building footprints in the town enclave [C021, C022]. Honest wording: "the border runs through the town's buildings", not "cafes".

The more surprising true story is about **how the border got there**: the 1843 treaty drew every kilometre of the Dutch-Belgian line except here, where it says the limit "is interrupted" [C007]; the 1892 plan to swap the whole puzzle away lapsed [C014-C016]; the last enclave borders were fixed in 1995 by a procès-verbal, not a treaty [C010].

## The real story, in plain words
- Belgium and the Netherlands split in 1830-39. Their boundary convention was signed at Maastricht on 8 August 1843 and took effect on 3 October 1843 [C005].
- A year earlier, Article 14 of the treaty of 5 November 1842 had said the status quo "shall be maintained" for the villages of Baarle-Nassau (Netherlands) and Baarle-Duc/Baarle-Hertog (Belgium) and the roads through them [C008]. So the commissioners did not draw a line there. Article 14 of the 1843 convention says the limit "is interrupted" at Baarle, the division of the two communes being "the subject of a special work" [C007]. Article 1 allows a special parcel plan of the two communes (four sheets at 1:10,000 plus two at 1:2,500) [C006].
- The puzzle was therefore inherited, not made, in 1843 [C006, C007]. (Its medieval origin is told only in tourist copy: not used; see myths M12.)
- In 1892 the two governments agreed to end it by exchange: Belgium to give up the Baarle-Duc agglomeration, the Netherlands to give the hamlets of Castelré and Ulicoten [C014]. The Belgian memorandum counted 728 people in the land Belgium would hand over and 726 in the land it would receive [C015]. The Belgian bill was deposited on 24 May 1893 and lapsed on 19 September 1894 [C016]. Baarle-Hertog still exists [C017]. The Dutch bills were printed in 1894 and still listed in 1895-96; the Dutch outcome is unknown [C018].
- In 1959 the International Court of Justice, by ten votes to four, gave Belgium two plots (91 and 92) over which the 1841 and 1843 records disagreed [C012].
- The line was completed in two steps: a procès-verbal of 26 April 1974 (everything except the enclaves) [C009], and a procès-verbal signed at Baarle on 31 October 1995 for the enclaves, published in the Moniteur belge on 26 June 1996 [C010, secondary-only]. Franckx: about 35 km of frontier on 249 ha, 960 turning points, no 1843-style markers [C011]. Our own measurement of the Kadaster rings: 35.2 km [C004].
- Today the shapes are in both countries' official maps: 22 holes in the Dutch municipal polygon, matched one-to-one with Belgian parts (areas within 0.04 ha) [C002]. Seven Dutch pieces sit inside the two biggest Belgian enclaves (six in the largest, 165 ha), one in Belgian land away from enclaves [C003]. The two municipalities have governed jointly through a Benelux body since 2021 [C023].

## Timeline
| Date | Event | Claims |
|---|---|---|
| 5 Nov 1842 | Treaty; Article 14 maintains the status quo at Baarle | C008 |
| 8 Aug 1843 | Maastricht boundary convention signed; in force 3 Oct 1843 | C005, C006, C007 |
| 11 Jun 1892 / 21 Dec 1892 | Convention and declaration to exchange the Baarle puzzle for Castelré and Ulicoten | C014 |
| 24 May 1893 | Belgian bill deposited; lapses 19 Sep 1894 | C016 |
| 20 Jun 1959 | ICJ judgment, plots 91 and 92 to Belgium (10 to 4) | C012 |
| 26 Apr 1974 | Turnhout procès-verbal, the line round Baarle except the enclaves | C009 |
| 31 Oct 1995 | Procès-verbal for the enclaves (published 26 Jun 1996) | C010 (secondary) |
| 2021 | BGTS Baarle cross-border body | C023 |

## Fresh angles (gate G7)
1. **The 1843 treaty did not draw the line at Baarle.** Article 14 says the limit is "interrupted"; the gap stayed until 1974 and 1995. Popular versions credit "the 1843 treaty" with the border [C006, C007, C009; myths M2]. Usable as the "why".
2. **1892: two kingdoms agreed to end the maze, and it lapsed.** A swap of Baarle-Duc town for two Dutch hamlets, designed at 728 people against 726 [C014, C015, C016]. Popular versions never mention it. Usable as the hook or the twist.
3. **The last piece was fixed by a procès-verbal, not a treaty** (hedged) [C010]; and "30 enclaves" is the official count: 22 Belgian plus 8 Dutch, with Dutch pieces inside Belgian pieces inside Dutch land [C001-C003].
4. **The numbers**: about 35 km of border to fence 250 ha [C004, C011].
G7: PASS (facts 1, 2, 4 are VERIFIED-P or CORROBORATED and absent from the popular versions we skimmed).

## Hook and twist candidates (for the script writer; AK decides)
- Hook A: "The 1843 border treaty draws a line the whole way across the Netherlands and Belgium. Then it reaches one town, and writes: the limit is interrupted." [C007]
- Hook B: "In 1892 two kingdoms signed a deal to get rid of this town's border. It lapsed." [C014, C016]
- Hook C (numbers): "Thirty enclaves. Dutch land inside Belgian land inside Dutch land." [C001, C003]
- Twist: the last border was fixed in 1995 by a procès-verbal, and about 35 km had to be agreed to divide about 250 ha [C010, C011] (hedged).
- Not to use: "cafes" [C022], "a front door decides your country" [M9].

## Map and visual notes
- Do **not** use Natural Earth for the enclaves: at 1:10m it has no enclaves. Use the Kadaster and Flemish polygons already saved in WGS84: `sources/pdok_gemeentegebied_baarle_nassau_crs84.json` (9 parts; 22 holes = Belgian enclaves; 8 detached = Dutch pieces) and `sources/vrbg_refgem_baarle_hertog_4326.json` (26 parts, 8 holes). Both are official, drawn by owners of the data [C001-C003]. Licences unchecked (open_questions 7).
- Colours: Belgium vs Netherlands as two flat colours; show the 22 Belgian pieces as holes in the Dutch shape and the 8 Dutch pieces inside them. A zoom into the largest enclave (165 ha, centre about 51.44 N, 4.93 E from the polygon) shows six Dutch pieces inside it [C003]. Pin coordinates come from the same polygons only; no pin may be invented.
- Locator: Europe at country scale from the house geodata is fine; no India border is involved. Natural Earth India-point-of-view file not needed.
- Do not show a café, a bar line or a door: no official geometry exists for them. A building-footprint overlay from the BAG is possible but unverified [C021].
- Everything on screen must trace to C001-C004 and C017.

## Artistic-licence notes
- The 1892 hamlets and the exchange could be drawn schematically, labelled "1892 plan" [C014]. The 1892 area figures other than 266.54.71 ha are unreadable in the scan: do not label them.
- The street "cross" markings and the aluminium plates are tourism claims [M13]: draw only as `artistic`.

## What a 9-beat 85-100 word Short could safely say (ten strongest verified one-sentence facts)
1. Baarle-Nassau (Netherlands) and Baarle-Hertog (Belgium) together form thirty enclaves [C001].
2. Twenty-two of them are Belgian pieces inside Dutch land; eight are Dutch pieces inside Belgian land [C001, C002, C003].
3. Seven of those Dutch pieces sit inside the two biggest Belgian enclaves, six in the largest [C003].
4. The border around these enclaves adds up to about thirty-five kilometres [C004].
5. The 1843 treaty between the Netherlands and Belgium was signed at Maastricht on 8 August 1843 [C005].
6. At Baarle that treaty says the limit "is interrupted", because a status quo from 1842 had to stay [C007, C008].
7. In 1892 the two governments agreed to swap the Baarle-Duc agglomeration for two Dutch hamlets, Castelré and Ulicoten [C014].
8. The Belgian bill for that swap lapsed on 19 September 1894, and Baarle-Hertog is still Belgian [C016, C017].
9. In 1959 the International Court of Justice gave Belgium two disputed plots, ten votes to four [C012].
10. The enclave borders were fixed last in 1995, by a procès-verbal rather than a treaty, according to a 1998 Belgian legal study (hedge) [C010].
