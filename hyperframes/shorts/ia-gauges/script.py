# Indica Atlas Week 4, W4-06 gauges (research: docs/geo/research/W4-06-gauges, G6 PASS 15 Nov 2026).
# verify.md wording fixes applied: three gauge CLASSES but four WIDTHS "in the Railways' own classification" (MoSPI),
# with the 2026 list's standard gauge (1.43 m) named on screen, never "only four"; never "once ran" or "gone"; no two
# years in one comparison; no 2026 share and no 2026 metre/narrow km (C11); 1,676 mm not 1.6 m, 762 mm not 0.76 m;
# Unigauge "launched 1 April 1992, had converted over 13,000 km by 2007 (Ministry's figure)"; 70,142 km not used.
# The belief is not shown to be common (open_questions #3), so it is asked as a question. 1,066 mm and 2.75x are our
# measurement (method/gauge_numbers.py). Heritage-line gauges (C10) are not named.
# People forward this because the railway they ride is still classed in more than one width, by the Government's own 2026 text.
S["ia-gauges"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think", pause=0.1,
    title="India's trains: one track width? There are four",
    send="Most people picture one Indian track; the Railways' own classification has four widths, and the 2026 Government list still names metre and narrow gauge.",
    beats=[
        # belief, asked as a question (dossier: the belief is not shown to be common)
        ("b1", [("Indian trains.", "*Indian trains.*"), ("One track width for all.", "One track width for *all.*"),
                ("Right?", "*Right?*")],
         {"hook": "Indian trains", "one": "One track", "right": "Right"}),
        # turn
        ("b2", [("Not quite.", "*Not quite.*")], {"nq": "Not quite"}),
        # C01 (MoSPI Year Book ch.19 para 19.7: Broad, Meter and Narrow (0.762 & 0.610 m) = 3 classes, 4 widths)
        ("b3", [("The Railways list three gauge classes,", "The Railways list *three gauge classes,*"), ("but four widths.", "but *four widths.*")],
         {"cls": "The Railways", "four": "but four"}),
        # C01 (1.676, 1.000, 0.762, 0.610 m)
        ("b4", [("Broad, sixteen seventy-six millimetres.", "Broad: *1,676 mm.*"), ("Metre, one thousand.", "Metre: *1,000.*"),
                ("Narrow, seven sixty-two,", "Narrow: *762,*"), ("and six ten.", "and *610.*")],
         {"bg": "Broad, sixteen", "mg": "Metre, one", "ng1": "Narrow, seven", "ng2": "and six ten"}),
        # C01 (our measurement: 1,676 - 610 = 1,066 mm; 2.75 times)
        ("b5", [("The widest is over a metre wider", "The widest is *over a metre* wider"), ("than the narrowest.", "than the narrowest.")],
         {"wide": "The widest", "narr": "than the narrowest"}),
        # C03 (PIB 15 Apr 2026: broad gauge for the first lines; metre gauge adopted as second standard in 1871); C12 pin only
        ("b6", [("Broad gauge came first.", "*Broad gauge* came first."), ("Metre followed in eighteen seventy-one.", "Metre followed in *1871.*")],
         {"first": "Broad gauge came", "m71": "Metre followed"}),
        # C03 (narrower gauges "For developing poor areas and for bringing merchandise to the main railways")
        ("b7", [("Narrower lines served poor areas.", "Narrower lines served *poor areas.*")], {"poor": "Narrower lines"}),
        # C06 (Ministry of Railways, Feb 2007: launched 1 April 1992; over 13,000 km converted, Ministry's figure)
        ("b8", [("Project Unigauge was launched in nineteen ninety-two.", "Project *Unigauge* was launched in *1992.*"),
                ("By two thousand seven, the Ministry said,", "By *2007*, the Ministry said,"),
                ("over thirteen thousand kilometres were converted.", "over *13,000 km* were converted.")],
         {"uni": "Project Unigauge", "by07": "By two thousand", "k13": "over thirteen"}),
        # C02 (PIB backgrounder 15 Apr 2026: "has the following categories of track:" broad, metre, narrow, plus standard 1.43 m)
        ("b9", [("Yet in twenty twenty-six, the Government still lists", "Yet in *2026*, the Government still lists"), ("metre and narrow gauge.", "*metre and narrow* gauge.")],
         {"y26": "Yet in", "still": "metre and narrow"}),
        # loop -> b1 "Indian trains."
        ("b10", [("And still we picture", "And still we *picture*")], {"end": "And still"}),
    ])
