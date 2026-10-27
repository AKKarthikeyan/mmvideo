# Sources kept only on the SSD (not in git)

This repository is public. Copies of third-party copyrighted material stay in the SSD checkout
(`/Volumes/DarwinSSD/MMVideo/docs/inventors_desk/research/P01-velcro/sources/`) and are not committed:

| File | What | Why not in git |
|---|---|---|
| rts/rts1961_la_bande_velcro.mp4, .wav, .transcript_fr.txt | RTS film, 10 Jul 1961 (13 min), audio and machine transcript | RTS copyright; re-download URL in rts/mc_10360995.json |
| rts/rts1984_velcro_tenace.mp4, .wav, .transcript_fr.txt | RTS Case ouverte, 15 Dec 1984 (7 min) | RTS copyright; URL in rts/mc_3451547.json |
| rts/frames/*.png | Stills from both films | RTS copyright |
| nyt1990.html | Reuters obituary via the NYT archive | NYT/Reuters copyright |
| velcro_co.html | Velcro Companies page | Company copyright |
| hls_fr.html | Historical Dictionary of Switzerland entry | Linked instead (URL in sources.jsonl) |
| rts1961.html, rts1984.html | RTS archive pages | Linked instead |
| US2717437.html, US3009235A.html, CH295638A.html, CH264212A.html | Google Patents pages | The patent PDFs (public domain) are committed instead |

`research_check.py` re-finds quotes in local copies, so on a git-only checkout it prints WARN lines for these sources.
The claims, quotes and locators in claims.jsonl are unchanged.
