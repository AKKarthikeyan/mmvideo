# GEO-07 search log (read 2 Nov 2026)

Order followed: NCERT, then IMD / MoES, then peer-reviewed reviews. Searches only suggested pages; every claim was read in the file saved under `sources/`.

## NCERT
- Local `research/upsc/_ncert/`: kegy104, kegy209, kegy208, jess104 and front pages kegy1.ps, kegy2.ps read in full or by chapter. OK.
- `ncert.nic.in/textbook/pdf/iess1ps, iess104, iess1dd, iess1an, iess1cc, fess104`: **404** (old Class 9 Contemporary India I).
- `ncert.nic.in/textbook.php`: 200. Class IX list shows Contemporary India-I commented out and "Understanding Society India and Beyond" Part I (iest1) and II (iest2).
- `iest1ps`, `iest101` to `iest105`: 200. Chapter 3 (iest103) is Atmosphere and Climate. Saved: ncert_class9/. OK.
- `kegy210.pdf` (Water in the Atmosphere): 200. `jess1ps.pdf`: 200 (edition read).
- `ncert.nic.in/pdf/BookletClass11.pdf` (rationalised content): 200. OK.

## UPSC
- `upsc.gov.in/.../Notif-CSP-2026-Engl-060226Rev.pdf`: 200. Syllabus text found at PDF pp.65-67. OK.

## IMD / MoES
- `mausam.imd.gov.in/backend/assets/press_release_pdf/IMD_Press_release_new_onset_and_withdrawal_dates(Final).pdf`: **404** (HTML error page). So IMD's adoption notice for the new normals is not read. **Open item.**
- `internal.imd.gov.in/press_release/20200515_pr_804.pdf` (CRS Research Report 3/2020): 200, 38 pages. OK.
- `internal.imd.gov.in/press_release/20220414_pr_1572.pdf` (1971-2020 normals): 200. `..._1573.pdf` is the Hindi copy. OK.
- LRF 2026: first guessed URLs under `/Forecast/mcmarq/mcmarq_data/` returned 404; `marquee_data/...Press_release_13.4.2026.pdf` worked. The updated end-May release was not fetched; its content is quoted in the Salient Features document.
- `Salient_Features_SW_MONSOON _2026_30_sep.pdf`: 200, 19 pages. OK.
- `mausam.imd.gov.in/responsive/monsooninformation.php` and `_onset`, `_withdrawal`, `_monsoon_activity`, `faq.php`: 200 with curl. WebFetch of the FAQ page returned only image names (monsoonfaq-1.jpg to -20.jpg); the text PDF `imd_latest/monsoonfaq.pdf` was used instead. OK.
- `imd_latest/FAQ_ENSO_IOD.pdf`, `imd_latest/monsoon_report_2025_2.pdf` (310 pp.): 200. OK.
- `chennai/mcdata/ne_monsoon_2020.pdf` (NE monsoon 2020): 200. `responsive/pdf_viewer_css/met1/Chapter-3 page 37-51/Chapter-3.1.pdf`: 200 (monograph title not printed in the chapter file).
- `event/mission_mausam.pdf`: 200.
- Not found / not opened: IMD station normals for Mawsynram, Cherrapunji, Jaisalmer; IMD all-India "drought year" definition; IMD Monsoon Report 2026 (not out yet).
- PIB: not used (pages not needed; Mission Mausam read from IMD's copy).

## Science literature
- Gadgil 2018 (J. Earth Syst. Sci. 127:1) from `ias.ac.in/article/fulltext/jess/127/01/0001` by curl: 200. WebFetch of the same URL: 403. OK via curl.
- Gadgil 2003 (Annu. Rev.) from `iri.columbia.edu/~tippett/Gadgil2003.pdf`: 200. Geen et al. 2020 from `atmos.washington.edu/~david/Geen_etal_2020.pdf`: 200. Rajeevan et al. 2010 from `ias.ac.in/public/Volumes/jess/119/03/0229-0247.pdf`: 200.
- Boos & Kuang 2010: my first guessed URL (`nature.com/articles/nature08831`) was a different paper (discarded and deleted); the correct paper is doi 10.1038/nature08707, read from `boos.berkeley.edu/pdf/BoosKuang2010_Nature_withSI.pdf`. OK.
- Schiemann et al. 2009 (J. Climate): Reading CentAUR page 200, abstract read only; full text not read.
- IPCC AR6 WG1 Ch8 from ipcc.ch: 200, 18 MB. It is the "Final Government Distribution" draft.
- NOAA NWS RONI circular: 200.
- Saji et al. 1999 (IOD, Nature 401:360): paywalled / restricted repository copies. **Not read.**
- Yin 1949, Koteswaram: not located. **Not read.**
- Boos & Kuang 2013 and Wu et al. 2012: seen in search summaries only. **Not read.**

## Excluded as evidence
News, coaching and encyclopedia pages that appeared in searches (for example Mawsynram/Cherrapunji values, "drought year" definition, 11 Sept 2024 Mission Mausam coverage) were used only to find what to open.
