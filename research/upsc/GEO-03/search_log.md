# GEO-03 search log (read 11 Nov 2026)

Order followed: NCERT (local copies, checked against live byte sizes), then publishers of record (USGS, NOAA, NDMA, INCOIS, NCS, PIB/Lok Sabha replies, the Act). Web searches only suggested where to look; every claim was read from a file saved under `sources/`. No news, blog, coaching, Wikipedia or YouTube page was used as evidence (many appeared in search results, notably coaching articles on a "Zone VI" map; ignored).

## NCERT
- Word search of all local NCERT text for "earthquake" and "tsunami": hits listed in `ncert_map.md`.

## USGS
- pubs.usgs.gov (plain fetch OK): "The Severity of an Earthquake" (1989 text), "The Interior of the Earth", "Earthquakes: Where Earthquakes Occur", Johnston 1990 abstract in Pubs Warehouse, This Dynamic Earth (copied from GEO-04).
- earthquake.usgs.gov FDSN web service (official API): 2004 Sumatra and 2001 Bhuj event records.
- usgs.gov (www) pages (magnitude types, FAQ, magnitude/energy/intensity): fetch returned HTTP 202 with no content; the reading tool also got empty text. Bot protection: not bypassed. Marked BLOCKED (G3-A13). earthquake.usgs.gov/learn/... older URL: 404.

## NOAA
- tsunami.gov FAQ (read), oceanservice.noaa.gov "What is a tsunami?" (read), NCEI/NGDC "Introduction to Global Historical Tsunami Data" (read). noaa.gov/jetstream tsunami generation page: HTTP 403, not read.

## India
- NDMA tsunami guidelines (Aug 2010) and earthquake guidelines (Apr 2007): ndma.gov.in links 404 from plain fetch; the NDMA PDFs are hosted at nidm.mha.gov.in (nidm.gov.in has a certificate mismatch; not forced). Both read in full text form.
- PIB / Lok Sabha: 1 Apr 2026 seismograph network reply (read; source of the March 2026 withdrawal sentence), 29 Mar 2017 early warning reply, 15 Mar 2021 and 30 Jul 2021 seismic mapping replies, 22 Jul 2025 DM Amendment reply, Sept 2020 ITEWC release (saved, only skimmed), 2025 reply on earthquake preparedness (saved, not used).
- INCOIS: Tsunami Ready PDF (read), Indian Tsunami Early Warning System "About TSP" page (read), INCOIS About Us (read). Live network pages not located.
- NCS: seismo.gov.in home page (read).
- Disaster Management Act 2005: India Code returned HTTP 504 (twice); read the copy at ndmindia.mha.gov.in (MHA site). 2024 Bill text from egazette (read). The 2025 Act's final text not read.
- GSDMA Smritivan page (read).
- BIS: standards.bis.gov.in and services.bis.gov.in pages appear only in search snippets (BIS standards list, IS 1893 Part 6 PDF); IS 1893 (Part 1) itself not opened (paid standard).
- IGNOU/egyankosh: not searched (NCERT, USGS and NDMA covered the content). Optional for a later pass.
- Not opened: MHA annual report for the 2004 toll (NDMA 2010 figure used), GSI, IMD seismology pages, PIB PRID 2226879/2147276 (2025-26 early warning replies).

## Request hygiene
Single requests, 2 to 5 second gaps, no loops against one server. No CAPTCHA or bot check was bypassed.
