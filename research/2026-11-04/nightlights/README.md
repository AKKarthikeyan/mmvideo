# Night lights 2013 vs 2025 without a login (probe, 4 Nov 2026, Mac Mini)

Source: NASA GIBS layer `VIIRS_SNPP_GapFilled_BRDF_Corrected_DayNightBand_Radiance`
(Black Marble VNP46A2: daily, cloud-masked, moon/BRDF-corrected, gap-filled; Suomi NPP),
dates 2012-01-19 to 2026-11-02. Public WMS, no Earthdata account:
`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=<layer>&CRS=EPSG:4326&BBOX=<latS>,<lonW>,<latN>,<lonE>&WIDTH=..&HEIGHT=..&FORMAT=image/png&TIME=YYYY-MM-DD`

The PNG colours follow GIBS's fixed colour map `VIIRS_DayNightBand_At_Sensor_Radiance.xml` (cmap.xml here):
180 radiance bins, 0 to 38.2 nW/(cm2 sr); brighter is clipped at 38.2. `bm_decode.py` turns each pixel back
into its bin's radiance; 100% of pixels matched a colour-map entry in the test.

Test, Tamil Nadu box 8-13.6N, 76-80.4E, 15 nights each (10-24 Jan):
- 2013 nightly box mean 0.69-1.31 (mean 0.88, CV 20%); 2025 nightly 1.44-1.94 (mean 1.66, CV 6%). No overlap.
- Median composite 2025/2013 = 2.10x.

Limits: bright city cores clip at 38.2 in both years (understates growth there); box includes sea (near 0
both years); sample is one January window, not a full year. The Earthdata VNP46A3/A4 files remain the stronger
source if AK makes a login (LAADS lists VNP46A4 2024 tiles h25v06 etc., download needs the token).

# 2012 vs 2025 per state (built 4 Nov 2026, AK's pick of years)

Data: NASA Black Marble **VNP46A4** (annual, collection 002) from LAADS DAAC, India tiles h24-h27 x v05-v08,
downloaded with `get_vnp46a4.sh` (needs EARTHDATA_TOKEN in the Mini's ~/.zshrc and the LAADS licence, both done 4 Nov).
Files in `vnp46a4/<year>/` (3 GB, not in git).

Method follows RBI Bulletin 23 Oct 2026, "Nowcasting State-Level Economic Activity in India with Night-Time Light and
Google Trends" (Ghosh, Singh, Kuruganti; text in `sources/`): all-angle snow-free radiance, poor-quality pixels
(flag 1) removed, sum of light (radiance x pixel area) inside each state's boundary. Background: NASA already zeroes
every pixel under 0.5 nW/(cm2 sr) in both years, and dark deserts/forests read ~0 in both, so no extra threshold.
Only pixels valid in both years are counted. Boundaries: DataMeet Admin2 (sources/geo/, Government of India lines);
state areas match official figures within ~1%.

Tools: `nl_states.py` (measure, writes out/states_2012_2025.json), `nl_export.py` (frames + data.json for the Shorts
into public/datayt/nightlights/), `nl_scripts.py` (narration per state + SCRIPTS.md review sheet with flags).
Video: `DATA-nl-<ID>` in src/datayt/NightLights.tsx.

Caveats to keep in mind (not all are said in the videos):
- Light is not GDP. RBI found night-light growth tracks GSVA growth in Maharashtra (0.90), Karnataka (0.79), Gujarat
  (0.66); it did not test other states.
- LED street lighting emits blue light the satellite's band partly misses, so fully lit cities (Delhi 1.12x,
  Chandigarh 1.52x) likely understate the change.
- Flagged in SCRIPTS.md: Manipur (tiny 2012 base), Ladakh and Lakshadweep (missing pixels), Sikkim (light fell 10%:
  check before publishing), Delhi/Chandigarh/Puducherry (already fully lit), small UTs (frames upscaled).

# Voiced cut (5 Nov 2026, 00:00-01:30 IST; AK: "Voice Now")

Voice: MiniMax speech-2.6-hd, English_Diligent_Man, on MINIMAX_GO_API_KEY (second plan) because the main key belongs
to Vigil/Ravens at night. `nl_voice.py` voices six lines per state into public/datayt/nightlights/vo/<ID>/, times
each scene from its line (vo/<ID>/timing.json, merged into vo.json). Effects: our own synthesised set from the Namakkal
films (scripts/datayt/long_sfx.py on datakadai/namakkal-looks), 8 cues per Short, -18 dBFS under the voice.
Master: `nl_master.py` (pyloudnorm), one gain per file to -16 LUFS with peaks at or under -1 dBFS.
Deliverables: out/datakadai/nightlights/<ID>_final.mp4 (36). <ID>.mp4 is the unmastered render, <ID>_text.mp4 the
silent text-led cut.
