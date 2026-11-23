# Upload kit for ia-greenland (research: docs/geo/research/W4-01-greenland). Draft only: never posted by this tool.
KITS["ia-greenland"] = dict(
    cover=17.0,
    titles=["Is Greenland bigger than India?", "On a Mercator map, Greenland is 9 times India. Really: two-thirds.", "Slide Greenland down to India and watch it shrink"],
    description="""On a Mercator map, Greenland looks huge: its outline covers about 9 times as much map as India's (our measurement).
In reality Greenland is 2,166,086 sq km and India is 3,287,263 sq km, so Greenland is about two-thirds of India's size (our arithmetic on the UN figures).
Why: a Mercator map stretches land more the further it lies from the equator. At Greenland's middle (about 74°N) area is blown up about 13.7 times; at India's middle (about 23°N), about 1.17 times (our measurement).
About 80% of Greenland lies under an ice sheet. About 57,000 people live there, and the UN table prints its density as 0 people per sq km, which is a rounding. It is still the largest island in the world.

How we measured: Greenland's and India's outlines from Natural Earth (1:10m), their areas on a Mercator map compared with their true areas on the globe. In the video, the outline is re-projected at each latitude as it slides, so the shrink is the map's own stretch. Our measurement.""",
    sources=[
        "Surface area of Greenland (2,166,086 sq km) and India (3,287,263 sq km), Greenland's population and density: United Nations Statistics Division, Demographic Yearbook 2023, Table 3: https://unstats.un.org/unsd/demographic-social/products/dyb/documents/dyb2023/table03.pdf",
        "Ice sheet covers about 80 percent of Greenland; \"the largest island in the world\": National Snow and Ice Data Center, Ice Sheet Quick Facts: https://nsidc.org/learn/parts-cryosphere/ice-sheets/ice-sheet-quick-facts",
        "Outlines, and the Mercator ratios (about 9 times; 13.7 and 1.17 times), our measurement: Natural Earth 1:10m (public domain): https://www.naturalearthdata.com/",
        TERRAIN,
    ],
    hashtags="#IndicaAtlas #Geography",
    pinned="Which country should we slide down to India's latitude next?",
    tags=["Greenland", "Greenland vs India", "Mercator projection", "true size of Greenland", "India map", "world map", "geography"],
    instagram="On a Mercator map, Greenland looks about 9 times India's size (our measurement). Slide it down to India's latitude and it shrinks to about two-thirds of India. Send this to someone who loves maps.\n\nSources in the YouTube description (link in bio).\n#IndicaAtlas #Geography",
    voice=VOICE_EN, lang="English (India)")
