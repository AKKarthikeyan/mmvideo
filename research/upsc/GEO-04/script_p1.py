"""GEO-04 Part 1, draft 2 (3 Nov 2026, audit fixes from SCRIPT_P1_AUDIT.md): volcanoes, what comes out, why some explode, the shapes, what stays underground, where.
Storytelling v2 (docs/STORYTELLING.md, mmvideo branch claude/keen-ride-f20uky) and the Gold Standard (docs/upsc/GOLD_STANDARD.md).
Same form as research/upsc/GEO-07/script_p1.py; check with scripts/upsc/script_tool.py. Numbers are words in `say` (years may be
digits), numerals in `cap`. `claims` are ids in this folder's claims.csv (audited 3 Nov 2026, AUDIT.md)."""

def T(ch, key, link, say, cap, pic, claims, rung="", term="", note=""):
    return dict(ch=ch, key=key, link=link, say=" ".join(say.split()), cap=cap,
                scene=dict(type="stage", pic=" ".join(pic.split())), claims=claims, rung=rung, term=term, note=note)

V = dict(
    id="GEO-04-P1",
    title="Why Do Some Volcanoes Ooze and Others Explode?",
    beats=[
        T(1, "b00", "",
          """On Hawaii's Mauna Loa, which USGS calls the largest active volcano on Earth, lava usually pours out gently.
          It has built a broad mountain with gentle slopes.
          In 1991, Mount Pinatubo in the Philippines exploded.
          It threw so much gas high into the sky that the whole world cooled.
          USGS says global temperatures fell by about half a degree Celsius over 1991 to 1993.
          Both are openings where melted rock reaches the surface. So why do some volcanoes ooze and others explode?""",
          "Mauna Loa: gentle lava | Pinatubo 1991: explosion · global temperature ~0.5 °C lower, 1991–93 (USGS)",
          """First second: a red lava river sliding down a broad grey slope at dusk. Cut to a towering ash column over
          green Philippine hills. Then a globe dimming slightly under a thin veil. The girl from the monsoon films watches both on a screen.""",
          ["V012", "V060", "V001"], "question"),
        T(1, "b01", "therefore",
          """The exam asks about this. In 2024, the Prelims paper asked how many of four things come out of a volcano.
          Here is our plan. First, what comes out.
          Then the switch that makes one volcano ooze and another explode. Then, where volcanoes sit on the map.
          One famous volcano will not fit that map. Keep an eye on Hawaii.""",
          "UPSC Prelims 2024, GS I, Q3 · plan: what comes out → the switch → the map",
          """The girl's notebook: three steps. A map of the world with a small question mark hovering over the middle of the
          Pacific (plant: Hawaii).""",
          ["V006", "V027"], "stakes"),
        T(2, "b02", "therefore",
          """Start with the word. NCERT calls a volcano a place where gases, ash or melted rock escape to the ground.
          The United States Geological Survey, USGS, adds that the word also means the vent itself.
          It usually means the cone the vent builds around itself, too.
          Under the ground, melted rock is called magma. Once it erupts, it is called lava.
          Our Class 11 book starts calling it lava a little earlier, once it begins to rise.
          For the exam, keep the clean line: magma below, lava above.""",
          "volcano = vent (+ usually its cone) · magma: underground · lava: erupted",
          """A cut-away mountain in atlas relief: a glowing chamber deep below labelled MAGMA, a red flow on the slope labelled
          LAVA; the ground line between them glows.""",
          ["V001", "V003"], "1", "magma"),
        T(2, "b03", "therefore",
          """So what comes out? NCERT lists lava flows, broken rock called pyroclastic debris, volcanic bombs, ash and dust, and gases.
          The gases it names are nitrogen and sulphur compounds, with a little chlorine, hydrogen and argon.
          That is the list the 2024 question tested. By NCERT's list, all four things it asked about come out.
          We have not read UPSC's own answer key, so that answer is ours.
          USGS says the biggest lumps, the bombs, usually land near the vent. The finest ash travels farthest.
          And an older USGS fact sheet adds a gas the textbook leaves out. More than nine-tenths of volcanic gas is water vapour.""",
          "NCERT: lava · pyroclastic debris · bombs · ash & dust · gases | older USGS fact sheet: >90% of the gas is water vapour",
          """An eruption sorts itself into labelled layers: heavy bombs falling close, ash drifting far, a pale plume of steam.
          A small exam card: the four items, all ticked (our answer).""",
          ["V004", "V006", "V007", "V005"], "2", "pyroclastic debris",
          note="Answer to the 2024 question is our inference from NCERT (V006 note): said as ours."),
        T(2, "b04", "but",
          """But a list does not tell us why Mauna Loa oozes and Pinatubo explodes.
          Think of a pot of water boiling with its lid on. The lid starts to rattle.
          Pressure builds underneath, looking for a way out. That is our picture, not a geologist's.
          So what decides whether the steam slips out, or blows the lid off?""",
          "an everyday picture (our analogy)",
          """The girl's kitchen: a steel pot on a gas flame, the lid rattling, puffs escaping at its rim. [chip: ANALOGY]""",
          [], "1", note="Rung 1, the everyday picture, labelled as ours (audit: NCERT Class VII uses the pot for earthquakes, not volcanoes)."),
        T(3, "b05", "therefore",
          """Here is the switch, in the words of USGS. Thin, runny lava lets its gas escape quietly.
          Thick, pasty lava traps the gas, until it bursts out. Geologists call that thick lava viscous.
          USGS compares it to a fizzy drink. Shake the bottle with your thumb on top, then lift your thumb.
          The trapped gas rushes out, and the drink comes with it.
          The picture stops at one point. In magma, the gas is not shaken loose.
          It comes out of the melt as the pressure on it falls, as the magma rises.""",
          "runny lava: gas escapes quietly · viscous lava: gas trapped → explosion (USGS)",
          """The girl shakes a bottle of fizzy drink with her thumb on top; lifts it; foam bursts out. Beside it, two jugs:
          water poured runs and bubbles pop; thick porridge holds big bubbles that burst. [chip: ANALOGY;
          limit: in magma the gas comes out as pressure falls, not by shaking]""",
          ["V009"], "2", "viscous", note="The limit sentence is ours (V009 note) and is shown as the analogy's limit."),
        T(3, "b06", "therefore",
          """So the lava decides the shape. Runny basalt lava spreads far before it cools.
          It builds a shield volcano: broad, with gentle slopes. Mauna Loa is the largest of them.
          It rises more than four thousand metres above the sea.
          NCERT notes one exception. A shield volcano can turn explosive if water gets into its vent.""",
          "shield volcano: runny basalt · broad, gentle · Mauna Loa: 13,677 ft (~4,170 m) above sea level (USGS)",
          """A wide, low dome in atlas relief, thin lava sheets layered like pages; a figure of the girl at its foot for scale.
          Then a thin jet of steam where sea water meets the vent.""",
          ["V012"], "2", "shield volcano", note="4,169 m is our conversion of USGS's 13,677 ft."),
        T(3, "b07", "but",
          """But sticky lava behaves differently. It erupts cooler, with ash, and builds up in layers.
          That builds a steep cone called a composite volcano, or a stratovolcano.
          Mount Fuji in Japan is one. So are Mount St Helens in the United States, and Pinatubo.
          These are the ones that often explode.
          When they do, a pyroclastic flow can race down the side: a fast avalanche of hot ash, rock and gas.
          USGS says it can be hotter than eight hundred degrees Celsius.""",
          "composite volcano (stratovolcano): steep, lava + ash layers · Fuji, St Helens, Pinatubo | pyroclastic flow up to 1,500 °F (~815 °C)",
          """A steep cone cut open to show stripes of lava and ash; then a grey avalanche of hot cloud racing down its flank.""",
          ["V013", "V008"], "2", "composite volcano", note="815 °C is our conversion of USGS's 1,500 °F."),
        T(3, "b08", "therefore",
          """NCERT names five kinds of volcano in all, by how they erupt and what they build. Shield and composite are two.
          The third is a caldera. When a volcano empties its magma chamber, the top can fall in, leaving a huge hollow.
          Crater Lake, in Oregon, sits in one that formed about six thousand eight hundred years ago.
          The fourth is a flood basalt province. Very runny lava pours out in many flows, for hundreds of kilometres.
          The fifth is the mid-ocean ridge volcano. Here lava erupts under the sea.
          USGS says scientists estimate that about three-quarters of all lava erupted on Earth comes out under the oceans.""",
          "NCERT's 5: shield · composite · caldera · flood basalt province · mid-ocean ridge | ~¾ of erupted lava: under the sea (USGS estimate)",
          """Five cards on the girl's desk, each a small relief drawing: dome, steep cone, collapsed hollow with a blue lake,
          stacked lava sheets, a glowing crack on the sea floor.""",
          ["V011", "V014", "V016", "V018"], "3", "caldera"),
        T(3, "b09", "therefore",
          """USGS also counts the simplest kind, the cinder cone.
          In 1943, one began in a farmer's field in Mexico, called Paricutin.
          In nine years of eruptions, it grew more than three hundred and sixty metres tall.
          But what about magma that never reaches the surface at all?""",
          "cinder cone · Parícutin, Mexico: 1943, ~1,200 ft (~366 m) in 9 years (USGS)",
          """A ploughed field with a farmer's oxen; a small smoking mound becomes a tall black cone over a time-lapse of seasons.""",
          ["V015"], "2", "cinder cone", note="366 m is our conversion of USGS's 1,200 ft."),
        T(4, "b10", "therefore",
          """When lava cools on the surface, it makes volcanic rock. When magma cools underground, it makes plutonic rock.
          Underground it cools slowly, so its crystals grow bigger and the rock is coarser.
          NCERT calls the shapes it leaves underground intrusive forms.
          A batholith is a large granite body that cooled deep in the crust, part of an old magma chamber.
          We only see one after erosion strips away the rock above it.""",
          "volcanic rock (surface) v plutonic rock (underground, coarser) · intrusive forms · batholith",
          """A cut-away of the crust: a huge granite body far below; above it, layers wear away over a fast clock until its dome
          shows as grey hills.""",
          ["V019", "V020"], "3", "intrusive forms"),
        T(4, "b11", "therefore",
          """A laccolith is a dome with a flat base, fed by a pipe from below. A lapolith is shaped like a saucer.
          A phacolith is a wavy body that sits in folded rock. A sill is a near-horizontal body; a thinner one is called a sheet.
          And a dyke is a wall, where magma filled a crack and hardened almost upright.
          NCERT says dykes are the commonest intrusive form in western Maharashtra.
          It says they are considered the feeders of the Deccan Traps.""",
          "laccolith · lapolith · phacolith · sill · dyke | NCERT: dykes, commonest in western Maharashtra, considered the Deccan Traps' feeders",
          """One labelled cut-away of the crust with all six shapes drawn in, each lighting up as it is named; the dyke glows as a
          vertical wall feeding lava sheets above.""",
          ["V021", "V023"], "3", "dyke", note="NCERT is the only source read for these shapes (V020, V021 notes): marked for the reviewer (R1)."),
        T(5, "b12", "therefore",
          """Now, where do volcanoes sit? Most active volcanoes stand at or near the edges of the plates that make up Earth's shell.
          Where an ocean plate meets a continental plate, the ocean plate sinks beneath it. That gives volcanoes and earthquakes.
          Where plates move apart, magma rises and makes new crust, as along the mid-ocean ridges.
          The busiest belt rings the Pacific Ocean. USGS says more than half the world's active volcanoes circle it.
          NCERT calls it the rim of fire. It is better known as the Ring of Fire.""",
          "most active volcanoes: near plate boundaries | Pacific Ring of Fire: more than ½ of active volcanoes (USGS)",
          """A world map with the plates outlined; red dots gather along the edges and crowd round the Pacific in a ring.
          A slice view: an ocean plate sliding under a continent, a volcano above.""",
          ["V024", "V025", "V026"], "3", "Ring of Fire"),
        T(5, "b13", "therefore",
          """Now the switch and the map join up. USGS says most active volcanoes stand near boundaries where one plate sinks under another.
          The volcanoes over sinking plates, like St Helens and Pinatubo, are composite cones.
          The ridges, where plates pull apart, pour out runny basalt.""",
          "where a plate sinks: composite cones (St Helens, Pinatubo) · where plates part: runny basalt (ridges)",
          """The slice view again: a sticky, steep cone over the sinking plate; then across the ocean, a ridge splitting with
          runny lava welling up.""",
          ["V025", "V013", "V018"], "4"),
        T(5, "b14", "but",
          """But remember Hawaii. Its islands formed more than three thousand two hundred kilometres from the nearest plate boundary.
          So where does its magma come from? In 1963, the geologist J. Tuzo Wilson suggested an answer: a hotspot.
          A fixed hot region deep in the mantle melts rock beneath the Pacific plate.
          As the plate drifts over it, the hotspot builds a new island, and the older ones are carried away.
          Kauai, far along the chain, has oldest rocks about five and a half million years old.
          A hotspot track has also been linked to India's Deccan Traps. We follow that story in part two.""",
          "Hawaii: 3,200+ km from the nearest plate boundary · hotspot (J. Tuzo Wilson, 1963) · Kauai's oldest rocks ~5.5 million years",
          """The question mark from the start lands on Hawaii. A cut-away: a plume of heat under a moving plate, islands forming
          one by one and sliding away like a conveyor; the oldest ones worn low.""",
          ["V027", "V028"], "4", "hotspot", note="The turn (STORYTELLING 4.1): the plant from b01 pays off."),
        T(6, "b15", "therefore",
          """So why do some volcanoes ooze and others explode? It comes down to the lava. And the lava is linked to where the volcano sits.
          Runny basalt lets its gas slip out. It pours from Hawaii's hotspot, and from the ocean ridges.
          Sticky lava traps its gas until it bursts. Over sinking plates stand composite cones like St Helens and Pinatubo.
          For the exam, write it this way. Magma is melted rock underground. Lava is magma that has erupted.
          Thin lava erupts gently. Thick, viscous lava traps gas and explodes.
          NCERT's five types are shield, composite, caldera, flood basalt province and mid-ocean ridge volcanoes.
          Magma that cools underground leaves intrusive forms: batholith, laccolith, lapolith, phacolith, sill and dyke.
          Most active volcanoes sit near plate boundaries. More than half of them ring the Pacific.
          Hotspots, like Hawaii's, can build volcanoes far from any boundary.""",
          "the lava decides the blast; where it sits shapes the lava · exam card",
          """The girl's notebook: "What comes out?" crossed out and replaced by "Where it sits decides"; the exam lines fill in,
          one per sentence, beside the bottle and the map.""",
          ["V009", "V012", "V013", "V025", "V018", "V003", "V011", "V019", "V021", "V024", "V026", "V027"], "5",
          note="Payoff with the exam card inside it (AK, 2 Nov 2026)."),
        T(6, "b16", "therefore",
          """In part two: Barren Island, which NCERT calls India's only active volcano. The lava that built the Deccan Traps. And eruptions that changed the world's weather.""",
          "next: India's volcanoes and what eruptions do",
          "The girl looks out from a ferry at a lone smoking island in a blue sea.",
          ["V043", "V060"], "handoff"),
    ],
    story=dict(
        promise="Why do some volcanoes ooze and others explode?",
        arc="wow-first",
        loops=[
            dict(id="L1", kind="primary", q="Why do some volcanoes ooze and others explode?", open="b00", close="b15"),
            dict(id="L2", kind="secondary", q="What actually comes out of a volcano?", open="b01", close="b03"),
            dict(id="L3", kind="tertiary", q="Which famous volcano will not fit the map?", open="b01", close="b14"),
            dict(id="M1", kind="micro", q="What decides whether the steam slips out or blows the lid off?", open="b04", close="b05"),
            dict(id="M2", kind="micro", q="What happens to magma that never reaches the surface?", open="b09", close="b10"),
            dict(id="M3", kind="micro", q="Where do volcanoes sit?", open="b12", close="b13"),
        ],
        turn="b14",
        plants=[("b01", "b14"), ("b04", "b05"), ("b00", "b15")],
        critical=[
            dict(what="Runny v viscous lava and the gas: the switch", src="USGS General Interest Publication, 'The Nature of Volcanoes' (V009)"),
            dict(what="NCERT's five types and the intrusive forms", src="NCERT Class XI Fundamentals of Physical Geography ch.3 pp.23-25 (V011, V019-V023)"),
            dict(what="Boundaries, the Ring of Fire and the Hawaiian hotspot", src="NCERT Grade 9 pp.15-16; USGS This Dynamic Earth (V024-V027)"),
        ],
        fallback="If the boundary-to-lava link failed review: what makes a volcano explosive, and what are NCERT's five types?",
        tier="broad",
    ),
)
