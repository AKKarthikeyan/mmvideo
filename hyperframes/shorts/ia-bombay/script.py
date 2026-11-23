# Indica Atlas Week 4, W4-08 Bombay seven islands (research: docs/geo/research/W4-08-bombay, G6 PASS 15 Nov 2026).
# verify.md fixes kept: Grose gets no year ("a visitor"); the Vellard is never "the first wall"; "reportedly" stays on
# Hornby; the hook is "seven islands" only (no "one big wall"); no island outlines and pins only for Colaba and Mahim
# (OSM Nominatim points) plus the measured line; Worli, Mazagon and Parel are not pinned. Twist: Colaba, joined in 1838.
# People forward this because it shows the island city was stitched together slowly, and the last island held out
# fifty-four years after the famous wall.
S["ia-bombay"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think", pause=0.2,
    title="Mumbai was seven islands. One held out to 1838",
    send="Everyone knows Mumbai was seven islands; few know the last one, Colaba, was joined only in 1838, 54 years after the Vellard.",
    beats=[
        # C001 (seven separate islands: Gazetteer 1909; MCGM city profile)
        ("b1", [("Mumbai was once seven islands,", "Mumbai was once *seven islands,*"), ("joined up long ago.", "joined up *long ago.*"),
                ("Right?", "*Right?*")],
         {"hook": "Mumbai was", "long": "joined up", "right": "Right"}),
        # turn
        ("b2", [("Not quite.", "*Not quite.*"), ("Not all at once.", "Not *all at once.*")], {"nq": "Not quite", "once": "Not all"}),
        # C002 (Mahim and Colaba among the seven), felt comparison: 13.8 km straight line (our measurement, method/felt.py)
        ("b3", [("They ran from Mahim", "They ran from *Mahim*"), ("down to Colaba:", "down to *Colaba:*"),
                ("thirteen point eight kilometres,", "*13.8 km,*"), ("by our measurement.", "our measurement.")],
         {"mahim": "They ran", "colaba": "down to Colaba", "km": "thirteen point", "ours": "by our"}),
        # C004 (Grose, quoted in the 1909 Gazetteer; no year given, per verify.md fix 1)
        ("b4", [("At high tide, the sea almost cut", "At *high tide,* the sea almost cut"), ("the main island in two,", "the main island *in two,*"),
                ("a visitor wrote.", "a visitor wrote.")],
         {"tide": "At high", "two": "the main", "wrote": "a visitor"}),
        # C003 (Hornby Vellard finished 1784; not called the first wall, per verify.md fix 2)
        ("b5", [("Then a sea wall, the Vellard,", "Then a sea wall, the *Vellard,*"), ("finished in seventeen eighty-four,", "finished in *1784,*"),
                ("shut the sea out.", "shut the sea *out.*")],
         {"wall": "Then a sea", "y84": "finished in", "out": "shut the sea"}),
        # C005 (hedged: Gazetteer prints it as an anecdote from Maclean; keep "reportedly")
        ("b6", [("Governor Hornby reportedly began it", "Governor *Hornby* reportedly began it"), ("without permission,", "*without permission,*"),
                ("and pocketed the order suspending him.", "and *pocketed* the order suspending him.")],
         {"gov": "Governor", "perm": "without", "pocket": "and pocketed"}),
        # C006 (Colaba Causeway 1838, the last of the seven); 54 years = 1838 - 1784 (our arithmetic, C003 + C006)
        ("b7", [("But one island was still apart.", "But one island was *still apart.*"), ("Colaba.", "*Colaba.*"),
                ("Joined only in eighteen thirty-eight,", "Joined only in *1838,*"), ("fifty-four years after the wall.", "*54 years* after the wall.")],
         {"but": "But one", "col2": "Colaba.", "y38": "Joined only", "y54": "fifty-four"}),
        # loop -> b1
        ("b8", [("So the next time someone tells you,", "So the next time *someone tells you,*")], {"end": "So the next"}),
    ])
