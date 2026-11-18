# W3-05: the popular version, checked

Claims come from the topic pitch ("Rajasthan is bigger than most countries in Europe"), from the snippets of search results seen while looking for primary sources (unacademy.com, geeksforgeeks.org, vedantu.com and the like, all tier X, not opened) and from the obvious variations someone would say next. Nothing here enters the script except through claims.jsonl. Variations marked "(tested, not seen)" are claims we thought a viewer might assume, not claims read in a source.

| # | Popular claim | Verdict | Claims | Why |
|---|---|---|---|---|
| M1 | Rajasthan is bigger than most countries in Europe | Confirmed | C004, C005 | Bigger than 38 of the 44 European states (UN Europe), by total area. The pitch understates it: it is bigger than all but six (seven if "Norway" means the Kingdom with Svalbard). |
| M2 | Rajasthan is the largest state of India | Confirmed | C002 | 342,239 vs Madhya Pradesh 308,252 in the 2011 census table. |
| M3 | Rajasthan's area is 342,239 sq km | Confirmed | C001 | Census A-1; Survey of India supplied the area. |
| M4 | Rajasthan is bigger than Germany (tested, not seen) | Contradicted | C008 | Germany is 357,683 sq km (Destatis), about 4.5% larger than Rajasthan (Rajasthan is about 4.3% smaller). |
| M5 | Rajasthan is bigger than Finland (tested, not seen) | Confirmed | C006 | By 1.1% on Statistics Finland's own figure; a narrow margin. |
| M6 | Rajasthan is bigger than Norway (tested, not seen) | Embellished | C007 | True for the mainland (323,805), false for the Kingdom with Svalbard and Jan Mayen (384,486). Say which. |
| M7 | Rajasthan is bigger than France / Spain / Sweden (tested, not seen) | Contradicted | C004 | All three are larger by every source opened. |
| M8 | Rajasthan is bigger than the United Kingdom (tested, not seen) | Confirmed | C010 | By about 40% (UK 244,376, excluding the Channel Islands and Isle of Man). |
| M9 | "Europe" includes Russia (so Russia counts as one big country) | Confirmed | C003, C004 | In the UN geoscheme the whole of Russia (17.1 million sq km) is in Europe. If Russia is left out, Rajasthan is bigger than 38 of 43 (88%). |
| M10 | Mercator maps make northern countries look bigger than they are | Confirmed | C014, C015 | Area scale is sec squared of latitude. A computed example: Finland looks about four times Rajasthan on a Mercator map. |
| M11 | Rajasthan has more people than the UK (tested, not seen) | Confirmed | C016 | Same census year, 2011: 68.5 million vs 63.4 million. |
