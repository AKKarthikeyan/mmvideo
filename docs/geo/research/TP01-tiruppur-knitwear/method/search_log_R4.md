# TP01 R4 saturation sweep (30 Oct 2026)

Method: direct fetches (curl, WebFetch) and web search. Bot checks and refused connections were not worked around. Search summaries are not evidence; only opened documents are cited.

## Category 5: Old maps
- David Rumsey (davidrumsey.com search "Tiruppur"): returned a reCAPTCHA "Verify Access" page. Stopped; nothing opened.
- Library of Congress (loc.gov/maps search): Cloudflare "Just a moment" bot check (HTTP 403). Stopped; nothing opened.
- Wikimedia Commons: not used (no dated map found to chase).
- Survey of India historical sheets: not searched beyond R3's catalogue-only leads (Strathclyde, SOAS); no scan opened. Still open.
- DSAL Imperial Gazetteer of India maps (dsal.uchicago.edu/maps/gazetteer/): opened. Map 'Madras (Southern section) with Mysore, Coorg & Travancore', vol 18 opposite p. 250, 1907-1909, downloaded and viewed (S401). Tiruppur is labelled beside the Noyil R. in Coimbatore district (C601). Licence of the scan not stated (about page 'File not found'). Date: map in a 1907-1909 edition; per-map date not printed on the sheet.

## Category 8: Tamil sources
- tiruppur.nic.in/ta/ home page: read; Tamil-script name, garment-industry statement (S402, C602). tiruppur.nic.in/ta/history page: English text already held as S37; nothing new.
- tn.gov.in/ta/district_view (cited by Vikaspedia): 404. Vikaspedia Tamil Tiruppur page read as a mirror (S403, C603).
- tamilvu.org: home page loads; a search for Tiruppur / knitwear (web search and site search URL) returned no tamilvu library item. Empty.
- Tamil Wikipedia: not opened (no gap it would fill).
- Tamil press archives, 1984 strike: web search returned only Subbarayan note (S06), Indian Textile Magazine (S13) and modern Tamil news pieces; no open Tamil archive found. Empty.

## Category 7: Parliament
- Lok Sabha AU1672: search located the PDF (eparlib.sansad.in/bitstream/123456789/3021841/1/AU1672_HV93qe.pdf; asked by S. Jothimani, Commerce and Industry, 10 Feb 2026 per search summary only). curl and WebFetch: connection refused again (HTTP 000, ECONNREFUSED); web.archive.org copy 404; sansad.in getFile returned HTTP 500. NOT read; S309 stays unread.
- 1984 debates for the strike (eparlib): search found a Lok Sabha 13 Aug 1984 volume and a 30 Jul 1985 item on a cess on banian production; both PDFs unreachable (connection refused / archive 404). Not read; not evidence. No debate on the Tiruppur strike was identified.

## Category 10: Place names
- Tamil-script spelling obtained: திருப்பூர் (C602). Pronunciation still not from a primary source.

Examined sources (this sweep): 3 documents opened and used (S401-S403), plus the English history page (already S37). Unread: Rumsey, LoC (bot checks), AU1672, 1984/1985 Parliament PDFs (unreachable).
Saturation: yes. The last three sources opened were the IGI 1907-09 map (added: Tiruppur drawn as a named place on a dated map, background only), the tiruppur.nic.in Tamil page (added: Tamil spelling and a rank/population line, background), and the Vikaspedia mirror (added: Rs 10 crore in 1984, size-consistent with the 1985 figure already held, hedged). None changed what a script would say. Two sweeps have now found nothing new on the 1984 strike (still no dates or order number). Caveat: the unopened items are blocked, not exhausted; the log records them honestly rather than treating them as read.
