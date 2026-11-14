# W3-05: gaps, unreachable sources, wording risks

1. **Does Rajasthan's 342,239 include inland water?** The census footnote calls it "Geographical Area" supplied by Survey of India; it does not say. Every European figure compared is total area including inland water. Rajasthan has few large water bodies, so the effect should be small, but it is not measured. Wording safeguard: say "area", never "land area", about Rajasthan. Possible next step: Ministry of Agriculture land-use statistics (reporting area) or Survey of India.
2. **Boundary change.** Rajasthan's area since 1956 was not traced to a gazette. The census table is for 2011; the planning document (S12) gives 3.42 lakh sq km in 2001; our polygon today is 343,082. No change found; not searched for in gazettes (G3 category 3).
3. **Larger-state sources not opened at the offices:** Rosstat, Ukrstat, INSEE, INE, Statistics Sweden, ISTAT, GUS. UNSD and Eurostat already report their figures; all six are larger than Rajasthan by 4% (Germany) to 50x, so a small revision cannot change the count. Poland (+9.5%) and Finland (+1.1%) are the only margins under 10% on the smaller side; Finland was read at the office, Poland at UNSD and Eurostat.
4. **FAO's definition of "country area"** was not opened (the figures for Norway and Sweden look like they include sea). Not needed: FAO is not used for counts.
5. **Ukraine, Russia and Belarus areas** are as reported to the UN. Russia's reported area includes Crimea? Not stated in the DYB line read; the Russian 17,098,246 and Ukraine 603,500 figures are the countries' reports. This does not change the count, but do not show borders for Crimea. Show Ukraine and Russia only as numbers or generic outlines if at all, and avoid a map of that area (sensitive; neighbours).
6. **A Survey of India primary table** of state areas was not found online; Census A-1 passes on Survey of India's number.
7. **The Mercator part is our computation.** It needs the independent checker (G6) to rerun `method/ne_areas_mercator.py`. The "four times" figure depends on which point of each country is taken (inflation varies across a country); say "about four times".
8. **Planning Commission (S12) was read through a page fetch**, not opened as a PDF; one sentence only, corroboration.

## Wording risks for AK
(Topic is not flagged sensitive; these are small.)
- "Bigger than most countries in Europe": say which Europe (UN, Russia included) and that it is total area. Without that, viewers can answer "Europe isn't that small, Russia alone is 50 times bigger".
- "Bigger than Norway" is only true for the mainland; "bigger than Germany" is false.
- Do not say "Rajasthan is bigger than France" or "bigger than Germany" for effect.
- Do not show Ukraine's or Russia's map with a border near Crimea; use a bar or a number label.
- If you show Rajasthan's western edge, it is the India-Pakistan international boundary; no side-taking needed.
- Mercator is "a way of drawing", not "a lie by Europeans": avoid colonial-conspiracy phrasing.
- Say "UN's Europe" (Russia counted whole) and "total area" on screen, not just in the voice.
- Do not imply a precise fit in the Finland-Germany gap: the gap is 338,493 to 357,683 sq km, and Rajasthan only lies inside it; the margins (1.1% above Finland, 4.5% below Germany) are not a match.
- Do not narrate "10.41% of India" unless unavoidable: India's total area (3,287,469) as given by Survey of India includes areas that are disputed; if used, say so.
- Show no map of Crimea (the DYB footnote says Ukraine cannot report it); use numbers or bars for Russia and Ukraine.
