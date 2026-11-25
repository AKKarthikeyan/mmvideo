#!/usr/bin/env python3
"""Build the Reveal Loop benchmark Shorts (docs/SHORTS_FORMAT.md): voice each beat, write timings, mux the sound.

usage:
  shorts_build.py story <id ...|all> [--no-tts]   voice the beats (MiniMax, cached) and write shorts/<id>/story.js,
                                                  shorts/<id>/check.json and out/hyperframes/shorts_audio/<id>/voice.wav
  shorts_build.py mux <id ...|all>                after `hf.py render <id>`: add voice + music bed ->
                                                  out/hyperframes/<id>-final.mp4
  shorts_build.py check <id ...|all>              run scripts/shorts_check.py on the built timings
  shorts_build.py lines <id ...|all>              print each beat's line, for a local voice or a narrator to read
  shorts_build.py verify <id ...|all>             transcribe every voiced beat (faster-whisper, local) and print it next to
                                                  the script: the voice sometimes repeats or drops words, and this is how
                                                  a session that cannot listen checks it. Needs `pip install faster-whisper`.

A Short is a list of beats; a beat is a list of (say, cap) chunks. `say` is what the voice reads (numbers in words);
`cap` is the 2-4 word caption shown while it is read (*word* = accent colour). `ev` lists phrases at which the picture
changes (a new scene or element), so shorts_check.py can measure how long any picture is held. The last beat runs
back into the first (loop). Without a working key (or with --no-tts) timings are estimated from text length and the
Short is silent: fine for layout work, not for publishing.

The voice is not deterministic. A beat whose length is far off the others for its text is voiced again (up to three
times, shortest kept), and pauses longer than 0.42 s inside a beat are cut to 0.3 s.

A local voice (for example "Maya" for Hindi, which lives on AK's machine) replaces MiniMax in two ways:
  SHORTS_TTS_CMD_HI='<command with {text} and {out}>'   a command that reads the UTF-8 text file {text} and writes the
                                                        speech to {out} (.wav); the suffix is the language (HI, EN_IN, EN_US)
  shorts_build.py story um-parisiman --clips <folder>   one recorded file per beat: <folder>/b1.wav ... (wav, mp3 or m4a);
                                                        `shorts_build.py lines um-parisiman` prints the lines to read
Voice: MINIMAX_API_KEY in the environment, or a key the cloud session's proxy adds to api.minimax.io
(then any placeholder value works). Voices are in VOICE below; Hindi must be ear-checked by a native speaker.
"""
import hashlib
import json
import math
import os
import re
import subprocess
import sys
import time
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SHORTS = ROOT / "hyperframes" / "shorts"
OUT = ROOT / "out" / "hyperframes"
GAP = 0.12            # pause between beats, as in the loop Shorts of VoxEngine
SR = 44100

VOICE = {
    "en-IN": dict(voice_id="English_Diligent_Man", boost="English", cps=15.0),            # Indian-accent English
    "en-US": dict(voice_id="English_captivating_female1", boost="English", cps=15.5),      # American documentary narrator
    "hi": dict(voice_id="hindi_male_1_v2", boost="Hindi", cps=13.0),
}

# ---------------------------------------------------------------------------------------------------------------------
# Scripts. Every number is sourced in docs/SHORTS_BENCHMARKS.md.
S = {}

S["ia-southtip"] = dict(
    channel="Indica Atlas", lang="en-IN", series="Not Where You Think",
    title="Kanyakumari is NOT India's southern tip",
    send="Every Indian learnt 'Kanyakumari' at school; the real tip is closer to Indonesia than to the mainland.",
    beats=[
        ("b1", [("This is Kanyakumari.", "This is *Kanyakumari.*"), ("The southern tip of India.", "The southern tip of *India.*"), ("Right?", "*Right?*")],
         ["This is", "The southern tip", "Right"]),
        ("b2", [("Not quite.", "*Not quite.*")], ["Not quite"]),
        ("b3", [("It's the tip of the mainland.", "It's the tip of the *mainland.*")], ["It's the tip"]),
        ("b4", [("The real southern tip", "The *real* southern tip"), ("is eighteen hundred kilometres away.", "is *1,800 km* away."),
                ("Past Sri Lanka,", "Past Sri Lanka,"), ("across the Bay of Bengal.", "across the *Bay of Bengal.*")],
         ["The real", "eighteen hundred", "Past Sri Lanka", "across the Bay"]),
        ("b5", [("This is Indira Point,", "This is *Indira Point,*"), ("on Great Nicobar Island.", "on Great Nicobar Island.")],
         ["This is Indira", "on Great"]),
        ("b6", [("From here, Indonesia", "From here, *Indonesia*"), ("is just a hundred and sixty kilometres away.", "is just *160 km* away."),
                ("Eleven times closer", "*11 times* closer"), ("than Kanyakumari.", "than Kanyakumari.")],
         ["From here", "a hundred and sixty", "Eleven times"]),
        ("b7", [("In two thousand four,", "In *2004,*"), ("the earthquake sank this coast", "the earthquake sank this coast"),
                ("by about four metres.", "by about *4 metres.*"), ("Its lighthouse still stands.", "Its lighthouse *still stands.*")],
         ["In two thousand", "by about four", "Its lighthouse"]),
        ("b8", [("So the next time", "So the next time"), ("someone points to the bottom of the map", "someone points to the *bottom of the map*"),
                ("and says,", "and says,")],
         ["So the next", "someone points"]),
    ])

S["ma-tsmc"] = dict(
    channel="Moat Atlas", lang="en-US", series="From Orbit",
    title="This was empty Arizona desert in 2020",
    send="Americans know the iPhone; few have seen where its chips are now made, or how fast it rose from bare desert.",
    beats=[
        ("b1", [("In twenty twenty,", "In *2020,*"), ("this was empty Arizona desert.", "this was *empty desert.*")], ["In twenty", "this was"]),
        ("b2", [("Watch.", "*Watch.*")], ["Watch"]),
        ("b3", [("A warehouse?", "A warehouse?"), ("A data center?", "A data center?"), ("No.", "*No.*")], ["A warehouse", "A data center", "No."]),
        ("b4", [("This is where Apple", "This is where *Apple*"), ("now gets chips for the iPhone.", "now gets chips for the *iPhone.*"),
                ("Over a hundred million chips", "Over *100 million* chips"), ("this year.", "this year.")],
         ["This is where", "Over a hundred"]),
        ("b5", [("The builder is T S M C,", "The builder: *TSMC,*"), ("from Taiwan.", "from *Taiwan.*"),
                ("Its plan here started", "Its plan here started"), ("at twelve billion dollars.", "at *$12 billion.*"),
                ("Now it's two hundred sixty-five billion.", "Now: *$265 billion.*")],
         ["The builder", "Its plan", "at twelve", "Now it's"]),
        ("b6", [("Why here?", "*Why here?*"), ("In twenty nineteen,", "In 2019,"), ("ninety-two percent", "*92%*"),
                ("of the world's most advanced chip capacity", "of the most advanced chip capacity"), ("sat on one island.", "sat on *one island.*")],
         ["Why here", "ninety-two", "sat on one"]),
        ("b7", [("But here's the catch.", "But here's *the catch.*"), ("The newest chips", "The *newest* chips"),
                ("are still made in Taiwan.", "are still made in *Taiwan.*"), ("Arizona's next fab", "Arizona's next fab"),
                ("starts in twenty twenty-seven.", "starts in *2027.*")],
         ["But here's", "The newest", "Arizona's next"]),
        ("b8", [("And six years ago?", "And *six years ago?*")], ["And six"]),
    ])

S["um-parisiman"] = dict(
    channel="UPSC Mains", lang="hi", series="आँकड़ों में संविधान",
    title="लोक सभा की सीटें आज भी 1971 से तय हैं",
    send="हर अभ्यर्थी ने परिसीमन पढ़ा है; 27 लाख बनाम 17 लाख और अप्रैल 2026 का गिरा विधेयक उत्तर में जान डालते हैं।",
    beats=[
        ("b1", [("लोक सभा की सीटें", "*लोक सभा* की सीटें"), ("आज भी", "*आज भी*"),
                ("इकहत्तर की जनगणना से", "*1971* की जनगणना से"), ("तय हैं।", "*तय* हैं।")],
         ["लोक सभा", "आज भी", "इकहत्तर"]),
        ("b2", [("तब से आबादी", "तब से आबादी"), ("दोगुनी से ज़्यादा हो चुकी है।", "*दोगुनी* से ज़्यादा")], ["तब से", "दोगुनी"]),
        ("b3", [("नतीजा?", "*नतीजा?*"), ("राजस्थान में एक सांसद", "*राजस्थान* में एक सांसद"),
                ("औसतन सत्ताईस लाख लोगों का", "औसतन *27 लाख* लोगों का"), ("प्रतिनिधि है।", "प्रतिनिधि है।")],
         ["नतीजा", "राजस्थान", "सत्ताईस"]),
        ("b4", [("केरल में,", "*केरल* में,"), ("सत्रह लाख से भी कम।", "*17 लाख* से भी कम।")], ["केरल", "सत्रह"]),
        ("b5", [("यह रोक इसलिए लगी थी", "यह *रोक* इसलिए लगी"), ("कि राज्य", "कि राज्य"),
                ("जनसंख्या स्थिर करने पर ज़ोर दें।", "*जनसंख्या स्थिर* करने पर ज़ोर दें।")],
         ["यह रोक", "कि राज्य", "जनसंख्या स्थिर"]),
        ("b6", [("चौरासीवें संशोधन ने इसे", "*84वें संशोधन* ने इसे"), ("दो हज़ार छब्बीस के बाद की", "*2026* के बाद की"),
                ("पहली जनगणना तक बढ़ा दिया।", "पहली जनगणना तक बढ़ाया।")],
         ["चौरासीवें", "दो हज़ार छब्बीस", "पहली जनगणना"]),
        ("b7", [("अप्रैल दो हज़ार छब्बीस में", "*अप्रैल 2026* में"), ("इसे बदलने वाला विधेयक", "इसे बदलने वाला विधेयक"),
                ("लोक सभा में गिर गया।", "लोक सभा में *गिर गया।*"), ("चाहिए थे तीन सौ बावन वोट,", "चाहिए थे *352* वोट,"),
                ("मिले दो सौ अट्ठानवे।", "मिले *298।*")],
         ["अप्रैल", "इसे बदलने वाला", "लोक सभा में गिर", "चाहिए थे", "मिले"]),
        ("b8", [("अब नज़र", "अब नज़र"), ("जनगणना दो हज़ार सत्ताईस पर है।", "*जनगणना 2027* पर है।"), ("और तब तक,", "और *तब तक,*")],
         ["अब नज़र", "और तब तक"]),
    ])


# ---- India Ledger, week 1 (docs/INDIA_LEDGER_WEEK1.md section 4). Voice only: no music under narration (CLAUDE.md).
# Short 1 · Doesn't Add Up · gold bonds. Numbers from scripts/india_ledger_gold.py at RBI's ₹13,345/g of 19 Nov 2026.
S["il-gold-lose"] = dict(
    channel="India Ledger", lang="en-IN", series="Doesn't Add Up", music=False,
    title="How do you lose money on gold that only rose?",
    send="Gold-bond holders and taxpayers both want to know who is paying.",
    beats=[
        ("b1", [("How do you lose money", "How do you *lose money*"), ("on gold that only went up?", "on gold that *only went up?*")],
         ["How do", "on gold"]),
        ("b2", [("Ask the government.", "Ask the *government.*"), ("It owes one point six four lakh crore rupees on it.", "It owes *₹1.64 lakh crore*")],
         ["Ask the", "It owes"]),
        ("b3", [("Not stolen.", "Not *stolen.*"), ("Not a crash.", "Not a *crash.*")], ["Not stolen", "Not a crash"]),
        ("b4", [("In twenty fifteen, it sold paper gold:", "*2015:* paper gold"),
                ("bonds that pay you whatever gold is worth later.", "pays what gold is *worth later*")],
         ["In twenty", "bonds that"]),
        ("b5", [("But it never bought the gold.", "It never *bought* the gold")], ["But it never"]),
        ("b6", [("It spent the money, like any loan.", "Spent it, *like a loan*")], ["It spent"]),
        ("b7", [("Then gold went up about five times.", "Gold went up *about 5×*")], ["Then gold", "five times"]),
        ("b8", [("So every bond is paid back at today's price,", "Paid back at *today's price*"),
                ("and every thousand rupees on a gram", "Every *+₹1,000* a gram"), ("adds twelve thousand crore.", "adds *₹12,277 cr*")],
         ["So every", "and every thousand", "adds twelve"]),
        ("b9", [("It kept the risk, not the gold.", "It kept the *risk,* not the gold"), ("That's the answer to", "That's the answer to…")],
         ["It kept", "That's the answer"]),
    ])

# Short 2 · Doesn't Add Up · the deposit scheme. D16-D18.
S["il-gold-31t"] = dict(
    channel="India Ledger", lang="en-IN", series="Doesn't Add Up", music=False,
    title="31 tonnes in 9 years: the gold India wouldn't lend",
    send="Every mother would refuse to melt her bangle; now they know why the scheme failed.",
    beats=[
        ("b1", [("In twenty fifteen, the government asked Indian families", "*2015:* the government asked"),
                ("to lend it their gold.", "*Lend us* your gold")],
         ["In twenty", "to lend"]),
        ("b2", [("Nine years later, how much had it collected?", "9 years later: *how much?*")], ["Nine years"]),
        ("b3", [("Not a thousand tonnes.", "Not *1,000 tonnes.*"), ("Not a hundred.", "Not *100.*")], ["Not a thousand", "Not a hundred"]),
        ("b4", [("Thirty one tonnes.", "*31 tonnes*"), ("From fewer than six thousand depositors.", "from *5,693* depositors")],
         ["Thirty one", "From fewer"]),
        ("b5", [("India imports that much gold in about sixteen days.", "India imports that in *16 days*")], ["India imports", "sixteen days"]),
        ("b6", [("Why so little?", "*Why* so little?")], ["Why so"]),
        ("b7", [("Deposit your bangle, and it's melted.", "Your bangle? *Melted.*"), ("You get back gold, never the bangle.", "Gold back, *never the bangle*")],
         ["Deposit", "and it's melted", "You get back"]),
        ("b8", [("So families said no,", "So families *said no*"), ("and in twenty twenty five, its long deposits closed.", "*2025:* long deposits closed")],
         ["So families", "and in twenty"]),
        ("b9", [("Remember,", "Remember…")], ["Remember"]),
    ])

# Short 3 · In Your Pocket · phones. DGCIS FY 2025-26 (hyperframes/videos/dk-phones/story.js).
S["il-phones"] = dict(
    channel="India Ledger", lang="en-IN", series="In Your Pocket", music=False,
    title="India exports ₹3 lakh crore of this",
    send="People assume India imports its phones.",
    beats=[
        ("b1", [("India now exports", "India now *exports*"), ("three lakh crore rupees of this.", "*₹3 lakh crore* of this")], ["India now", "three lakh"]),
        ("b2", [("It's in your pocket.", "It's in your *pocket.*")], ["It's in"]),
        ("b3", [("Phones and telecom gear.", "*Phones* and telecom gear")], ["Phones"]),
        ("b4", [("Four years ago?", "*Four years* ago?"), ("Fifty five thousand crore.", "*₹55,126 crore*")], ["Four years", "Fifty five"]),
        ("b5", [("That's five and a half times bigger.", "*5.5×* bigger")], ["five and a half"]),
        ("b6", [("And most of it doesn't go by ship.", "Not by *ship.*")], ["And most", "by ship"]),
        ("b7", [("Sixty nine percent flies out", "*69%* flies out"), ("of just two airports:", "of just *two airports*"),
                ("Chennai and Bengaluru.", "*Chennai* and *Bengaluru*")],
         ["Sixty nine", "two airports", "Chennai"]),
        ("b8", [("Who buys it?", "Who *buys* it?"), ("America alone takes fifty eight and a half percent.", "USA alone: *58.5%*")],
         ["Who buys", "America alone"]),
        ("b9", [("Made here,", "Made *here,*"), ("flown from the south,", "flown from the *south,*"), ("sold in America.", "sold in *America.*")],
         ["Made here", "flown from", "sold in"]),
        ("b10", [("Because", "Because…")], ["Because"]),
    ])

# Short 4 · In Your Pocket · the ₹10 bottle. NielsenIQ Jan-Sep 2024 vs Jan-Sep 2025, as reported (Storyboard18, Trak.in);
# no 2026 NielsenIQ reading found 19 Nov 2026.
S["il-cola"] = dict(
    channel="India Ledger", lang="en-IN", series="In Your Pocket", music=False,
    title="₹10 bottle vs Coke and Pepsi: 93% to 85%",
    send="Everyone has seen Campa in the shop; nobody knows it moved the market.",
    beats=[
        ("b1", [("For decades, two companies", "For decades, *two companies*"), ("sold almost every soft drink in India.", "sold almost *every soft drink*")],
         ["For decades", "sold almost"]),
        ("b2", [("Ninety three percent of the market.", "*93%* of the market"), ("Could anyone break that?", "Could anyone *break that?*")],
         ["Ninety three", "Could anyone"]),
        ("b3", [("Then came a ten rupee bottle.", "Then came a *₹10 bottle*")], ["Then came"]),
        ("b4", [("Campa, from Reliance.", "*Campa,* from Reliance"), ("And Lahori, a jeera drink.", "*Lahori,* a jeera drink")], ["Campa", "And Lahori"]),
        ("b5", [("In one year, the two of them doubled.", "In one year: *doubled*"), ("Seven percent, to nearly fifteen.", "*7%* to nearly *15%*")],
         ["In one year", "Seven percent"]),
        ("b6", [("Coke and Pepsi?", "Coke and Pepsi?"), ("Down to eighty five.", "Down to *85%*")], ["Coke and", "Down to"]),
        ("b7", [("Most of the fight was at one price.", "The fight: *one price*"), ("Ten rupees.", "*₹10*")], ["Most of", "Ten rupees"]),
        ("b8", [("So the giants brought back ten rupee packs.", "Giants bring back *₹10 packs*")], ["So the giants", "ten rupee packs"]),
        ("b9", [("Something they hadn't needed in years, because", "Not needed *in years,* because…")], ["Something they"]),
    ])

# Short 5 · Doesn't Add Up · buffalo meat (AK kept it, 19 Nov 2026). DGCIS FY 2025-26 (dk-buffalo, ia-poultry story.js).
S["il-buffalo"] = dict(
    channel="India Ledger", lang="en-IN", series="Doesn't Add Up", music=False,
    title="India's ₹45,000 crore meat export isn't chicken",
    send="Almost everyone guesses chicken.",
    beats=[
        ("b1", [("India's biggest meat export", "India's biggest *meat export*"), ("earns forty five thousand crore rupees a year.", "*₹45,196 crore* a year")],
         ["India's biggest", "earns forty"]),
        ("b2", [("Is it chicken?", "Is it *chicken?*"), ("No.", "*No.*")], ["Is it chicken", "No."]),
        ("b3", [("All poultry together is under three thousand crore.", "All poultry: *under ₹3,000 cr*"), ("This is sixteen times that.", "This is *16×* that")],
         ["All poultry", "This is sixteen"]),
        ("b4", [("It's buffalo meat.", "It's *buffalo meat.*"), ("Up thirty one percent in a year.", "*+31%* in a year")], ["It's buffalo", "Up thirty"]),
        ("b5", [("And most of it isn't cleared at a sea port.", "Not cleared at a *sea port*")], ["And most", "sea port"]),
        ("b6", [("More than half is cleared at inland depots", "*54%* at inland depots"), ("in Uttar Pradesh: Dadri and Kanpur.", "*Dadri* and *Kanpur,* UP")],
         ["More than half", "in Uttar Pradesh", "Dadri and"]),
        ("b7", [("The biggest buyer?", "The biggest *buyer?*"), ("Vietnam.", "*Vietnam:* 18%")], ["The biggest buyer", "Vietnam."]),
        ("b8", [("Not chicken. Buffalo.", "Not chicken. *Buffalo.*"), ("From U P to Vietnam.", "From *UP* to *Vietnam*"), ("So remember,", "So remember…")],
         ["Not chicken", "From U P", "So remember"]),
    ])

# Karthigai Deepam · ink animation, 15 s (AK, 24 Nov 2026). Picture: scripts/deepam/film.py (MiniMax image-01 + Hailuo-02,
# graded to blue/black/red with yellow for fire only), not a HyperFrames page. The Inner Chariot, no voice (AK, 24 Nov 2026):
# the lines are on-screen text over the picture and our music bed, timed at reading pace (`voice=False`).
# The story is the legend of the pillar of fire (Shiva Purana, Vidyeshvara Samhita; Arunachala Mahatmyam, Skanda Purana),
# labelled on screen as legend and illustration. No date or number is claimed, so it stays true every year.
# WARN S1 (under 20 s) kept on purpose: AK asked for 15 s. The voiced length must stay at or over 15.0 s (H1).
S["kd-deepam"] = dict(
    channel="The Inner Chariot", lang="en-IN", series="Karthigai Deepam", voice=False,
    title="The hill that is a flame: Karthigai Deepam",
    send="Tamil families forward it on Deepam day: everyone knows the lamp on the hill, few can say why that hill.",
    beats=[
        ("b1", [("A whole mountain", "A whole *mountain*"), ("becomes a lamp.", "becomes a *lamp.*")], ["A whole", "becomes"]),
        ("b2", [("Why this hill?", "*Why* this hill?")], ["Why this"]),
        ("b3", [("Brahma flew up", "Brahma flew *up*"), ("as a swan.", "as a *swan.*")], ["Brahma flew"]),
        ("b4", [("Vishnu dug down", "Vishnu dug *down*"), ("as a boar.", "as a *boar.*")], ["Vishnu dug"]),
        ("b5", [("To find where", "To find *where*"), ("the fire ends.", "the *fire* ends.")], ["To find"]),
        ("b6", [("Neither could.", "*Neither* could."), ("Shiva has no end.", "Shiva has *no end.*")], ["Neither", "Shiva has"]),
        ("b7", [("That fire? It's this hill.", "That fire? It's *this hill.*"), ("So every Karthigai,", "So every *Karthigai,*"),
                ("in Thiruvannamalai,", "in *Thiruvannamalai,*")], ["That fire", "So every"]),
    ])


# kd-deepam60: the 60 s story version of kd-deepam (AK, 24 Nov 2026: "up to 60 sec, short story, use our Director engine").
# Same look, shots k1-k7 reused, k8-k14 new. Text only, read at 12 characters a second (slower than the 15 s cut: this
# one is a story to follow, AK's followable-pacing rule). Treatment: docs/deepam/TREATMENT_60.md. Legend from the Shiva
# Purana (Vidyeshvara Samhita: the pillar, the ketaki/thalampoo witness and the curses) and the Arunachala Mahatmyam
# (the fire becomes the hill), labelled on screen as legend and illustration.
S["kd-deepam60"] = dict(
    channel="The Inner Chariot", lang="en-IN", series="Karthigai Deepam", voice=False, cps=12.0,
    title="Why Shiva never gets this flower",
    send="The flower every Tamil home knows, and the reason it is never offered to Shiva: a story to forward on Deepam day.",
    beats=[
        ("b1", [("A whole mountain", "A whole *mountain*"), ("becomes a lamp.", "becomes a *lamp.*"),
                ("And one flower", "And one *flower*"), ("is never offered to Shiva.", "is *never* offered to Shiva.")], ["A whole", "And one"]),
        ("b2", [("Why? It began", "*Why?* It began"), ("with Brahma and Vishnu.", "with *Brahma* and *Vishnu.*"),
                ("Who is greater?", "Who is *greater?*")], ["Why", "Who is"]),
        ("b3", [("A pillar of fire", "A pillar of *fire*"), ("split the sky.", "split the *sky.*"),
                ("Find its end, and you win.", "Find its *end,* and you win.")], ["A pillar", "Find its"]),
        ("b4", [("Brahma flew up", "Brahma flew *up*"), ("as a swan.", "as a *swan.*"),
                ("Vishnu dug down", "Vishnu dug *down*"), ("as a boar.", "as a *boar.*")], ["Brahma flew", "Vishnu dug"]),
        ("b5", [("But the fire never ended.", "But the fire *never ended.*"), ("Vishnu came back:", "Vishnu came *back:*"),
                ("I could not find it.", "I could *not* find it.")], ["But the fire", "Vishnu came"]),
        ("b6", [("Brahma saw a flower falling,", "Brahma saw a *flower* falling,"), ("a thalampoo.", "a *thalampoo.*"),
                ("He made it lie:", "He made it *lie:*"), ("He reached the top.", "He reached the *top.*")], ["Brahma saw", "He made"]),
        ("b7", [("But the fire opened.", "But the fire *opened.*"), ("Shiva stepped out.", "*Shiva* stepped out."),
                ("Shiva has no end.", "Shiva has *no end.*")], ["But the fire", "Shiva stepped"]),
        ("b8", [("No worship for Brahma.", "No *worship* for Brahma."), ("No thalampoo for Shiva.", "No *thalampoo* for Shiva."),
                ("Vishnu told the truth.", "Vishnu told the *truth.*"), ("He was blessed.", "He was *blessed.*")], ["No worship", "No thalampoo", "Vishnu told"]),
        ("b9", [("They begged the fire", "They *begged* the fire"), ("to become small.", "to become *small.*"),
                ("It cooled into this hill.", "It cooled into *this hill.*")], ["They begged", "It cooled"]),
        ("b10", [("So every Karthigai,", "So every *Karthigai,*"), ("in Thiruvannamalai,", "in *Thiruvannamalai,*")], ["So every", "in Thiru"]),
    ])


# ---------------------------------------------------------------------------------------------------------------------
def tts(text, lang, path):
    cmd = os.environ.get("SHORTS_TTS_CMD_" + lang.upper().replace("-", "_"))
    if cmd:                                   # a local voice: the command reads {text} and writes {out}
        txt = path.with_suffix(".txt"); txt.write_text(text, encoding="utf-8"); wav = path.with_suffix(".local.wav")
        r = subprocess.run(cmd.format(text=str(txt), out=str(wav)), shell=True)
        if r.returncode != 0 or not wav.exists():
            print("  local voice command failed for", path.name); return False
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-ac", "1", "-ar", str(SR), str(path)], check=True)
        return True
    import requests
    v = VOICE[lang]
    body = {"model": "speech-2.6-hd", "text": text, "stream": False, "language_boost": v["boost"],
            "voice_setting": {"voice_id": v["voice_id"], "speed": 1, "vol": 1, "pitch": 0},
            "audio_setting": {"sample_rate": SR, "bitrate": 128000, "format": "mp3", "channel": 1}}
    key = os.environ.get("MINIMAX_API_KEY", "proxy-injected")
    for attempt in range(4):
        j = requests.post("https://api.minimax.io/v1/t2a_v2", headers={"Authorization": f"Bearer {key}"}, json=body, timeout=120).json()
        if (j.get("data") or {}).get("audio"):
            path.write_bytes(bytes.fromhex(j["data"]["audio"]))
            return True
        code = (j.get("base_resp") or {}).get("status_code")
        if code == 1004:                      # no key reached MiniMax: do not retry
            return False
        print("  retry", path.name, j.get("base_resp")); time.sleep(15 * (attempt + 1))
    return False


def pcm(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    # trim leading / trailing silence so beats sit tight against each other
    idx = np.where(np.abs(a) > 0.01)[0]
    a = a[max(0, idx[0] - 400): idx[-1] + 2000] if len(idx) else a
    # shorten long pauses inside the beat: 20 ms windows below the floor, runs over 0.42 s cut to 0.3 s
    w = 882; n = len(a) // w; quiet = np.abs(a[: n * w]).reshape(n, w).max(1) < 0.012
    keep = np.ones(len(a), dtype=bool); i = 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            if (j - i) * w / SR > 0.42 and i > 0 and j < n:
                cut0 = i * w + int(0.15 * SR); cut1 = j * w - int(0.15 * SR)
                keep[cut0:cut1] = False
            i = j
        else:
            i += 1
    return a[keep]


def cap_html(c):
    c = c.replace("&", "&amp;").replace("<", "&lt;")
    return re.sub(r"\*(.+?)\*", r"<em>\1</em>", c)


def story(sid, use_tts=True, clips_dir=None):
    sp = S[sid]; lang = sp["lang"]; cps = sp.get("cps") or VOICE[lang]["cps"]   # cps: a text-only Short may set its own reading pace
    if sp.get("voice") is False:              # a text-only Short: lines are read on screen, timed at cps
        use_tts = False; clips_dir = None
    adir = OUT / "shorts_audio" / sid; adir.mkdir(parents=True, exist_ok=True)
    beats = []; caps = []; t = 0.0; voiced = use_tts; clips = []
    says = [" ".join(c[0] for c in chunks) for _, chunks, _ in sp["beats"]]
    engine = os.environ.get("SHORTS_TTS_CMD_" + lang.upper().replace("-", "_")) or VOICE[lang]["voice_id"]
    clip = lambda say, k=0: adir / (hashlib.sha1((engine + say + ("#%d" % k if k else "")).encode()).hexdigest()[:12] + ".mp3")
    audio = {}
    if clips_dir:                               # recorded lines, one file per beat
        for (bid, _, _), say in zip(sp["beats"], says):
            hit = [f for ext in ("wav", "mp3", "m4a") for f in [Path(clips_dir) / f"{bid}.{ext}"] if f.exists()]
            if not hit:
                sys.exit(f"{sid}: no clip for {bid} in {clips_dir} (expected {bid}.wav, .mp3 or .m4a)")
            audio[say] = pcm(hit[0])
        voiced = True
    elif voiced:
        for say in says:
            if not clip(say).exists() and not tts(say, lang, clip(say)):
                print(f"  {sid}: no voice (MiniMax key missing or refused); timings are estimates"); voiced = False; break
            audio[say] = pcm(clip(say))
    if voiced and not clips_dir:                # a beat far slower than the rest for its text was probably said twice: voice it again
        rate = {say: len(a) / SR / len(say) for say, a in audio.items()}; med = sorted(rate.values())[len(rate) // 2]
        for say in says:
            k = 0
            while rate[say] > 1.4 * med and len(say) > 12 and k < 3:
                k += 1
                if clip(say, k).exists() or tts(say, lang, clip(say, k)):
                    a = pcm(clip(say, k))
                    if len(a) < len(audio[say]):
                        audio[say] = a; rate[say] = len(a) / SR / len(say)
                        print(f"  {sid}: re-voiced a slow beat ({len(a) / SR:.1f} s): {say[:40]}")
    for (bid, chunks, ev), say in zip(sp["beats"], says):
        a = audio.get(say) if voiced else None
        sec = len(a) / SR if a is not None else max(0.7, len(say) / cps)
        tot = sum(len(c[0]) for c in chunks); acc = 0
        for csay, ccap in chunks:
            c0 = t + sec * acc / tot; acc += len(csay); c1 = t + sec * acc / tot
            caps.append(dict(t0=round(c0, 3), t1=round(c1 + (GAP if acc == tot else 0), 3), html=cap_html(ccap)))
        for p in ev:
            if p.lower() not in say.lower():
                sys.exit(f"{sid} {bid}: event phrase not in narration: {p}")
        beats.append(dict(id=bid, t0=round(t, 3), sec=round(sec, 3), say=say, ev=ev))
        clips.append((t, a)); t += sec + GAP
    dur = math.ceil(t * 30) / 30
    st = dict(id=sid, channel=sp["channel"], lang=lang, title=sp["title"], dur=round(dur, 3), voiced=bool(voiced),
              silent=sp.get("voice") is False, beats=beats, caps=caps)
    d = SHORTS / sid; d.mkdir(parents=True, exist_ok=True)
    (d / "story.js").write_text("window.STORY = " + json.dumps(st, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    # timings in the shape scripts/shorts_check.py reads
    chk = dict(id=sid, title=sp["title"], shorts=[dict(title=sp["title"], beats=[b["id"] for b in beats], loop=True)],
               beats=[dict(key=b["id"], say=b["say"], sec=b["sec"], scene=dict(type="picture", items=[dict(at=p) for p in b["ev"]])) for b in beats])
    (d / "check.json").write_text(json.dumps(chk, ensure_ascii=False, indent=1), encoding="utf-8")
    if voiced:
        mix = np.zeros(int(dur * SR) + SR, dtype=np.float32)
        for (t0, a), b in zip(clips, beats):
            i = int(t0 * SR); mix[i:i + len(a)] += a
            write_wav(adir / f"{b['id']}.wav", a)          # the clip as used, for `verify`
        write_wav(adir / "voice.wav", mix[: int(dur * SR)])
    else:
        (adir / "voice.wav").unlink(missing_ok=True)
    words = sum(len(b["say"].split()) for b in beats)
    print(f"{sid}: {dur:.1f} s, {words} words, {words / dur * 60:.0f} wpm, {'voiced' if voiced else 'text only, no voice (by design)' if sp.get('voice') is False else 'ESTIMATED, silent'}")
    idx = d / "index.html"
    if idx.exists():                         # keep data-duration in step with the story
        h = idx.read_text(encoding="utf-8")
        h2 = re.sub(r'data-duration="[0-9.]+"', f'data-duration="{dur:.3f}"', h)
        if h2 != h:
            idx.write_text(h2, encoding="utf-8")
    return st


def write_wav(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())


def bed(dur, root=146.83):
    """A quiet code-composed pad (root, fifth, octave, ninth) with slow movement: our own music, nothing to license."""
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for k, (ratio, g) in enumerate([(1, 1.0), (1.5, 0.55), (2, 0.5), (2.25, 0.28), (3, 0.18)]):
        f = root * ratio
        for det in (-0.6, 0.6):
            x += g * np.sin(2 * np.pi * (f + det) * t + k) * (0.75 + 0.25 * np.sin(2 * np.pi * (0.07 + 0.013 * k) * t + k))
    x /= np.max(np.abs(x))
    fade = np.minimum(1, np.minimum(t / 0.4, (dur - t) / 0.4))      # same level at both ends, so the loop does not jump
    return (x * (0.35 + 0.65 * fade)).astype(np.float32)


def mux(sid):
    adir = OUT / "shorts_audio" / sid; v = OUT / f"{sid}.mp4"; voice = adir / "voice.wav"
    if not v.exists():
        sys.exit(f"render first: python3 hyperframes/tools/hf.py render {sid}")
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(v)],
                               capture_output=True, text=True, check=True).stdout)
    b = bed(dur) * (0.05 if S[sid].get("music", True) else 0.0)     # music=False: voice only (India Ledger, CLAUDE.md)
    if S[sid].get("voice") is False:                                 # text-only Short: the music is the whole soundtrack
        b = bed(dur) * 0.5
    if voice.exists():
        with wave.open(str(voice)) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        a = np.pad(a, (0, max(0, len(b) - len(a))))[: len(b)]
        a = a / max(0.01, np.max(np.abs(a))) * 0.89
        mixd = a + b
    else:
        print(f"  {sid}: no voice.wav; muxing the music bed only (silent draft)"); mixd = b
    write_wav(adir / "mix.wav", mixd)
    out = OUT / f"{sid}-final.mp4"
    norm = [] if S[sid].get("music", True) else ["-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000"]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(v), "-i", str(adir / "mix.wav"), *norm, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-shortest", "-movflags", "+faststart", str(out)], check=True)
    print(out)


def verify(sid):
    """Transcribe each beat as used and print it under the script line. Flags a beat whose transcript is much longer
    or shorter than the script (a repeat or a dropped phrase). Spelling differences are normal: read the words."""
    from faster_whisper import WhisperModel
    sp = S[sid]; lang = sp["lang"][:2]; adir = OUT / "shorts_audio" / sid
    model = WhisperModel("small", device="cpu", compute_type="int8"); bad = 0
    print(f"{sid} ({sp['lang']})")
    for bid, chunks, _ in sp["beats"]:
        say = " ".join(c[0] for c in chunks); cap = re.sub(r"\*", "", " ".join(c[1] for c in chunks)); f = adir / f"{bid}.wav"
        if not f.exists():
            print(f"  {bid}: no clip (build the story with a voice key first)"); bad += 1; continue
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
        segs, _ = model.transcribe(np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768, language=lang, beam_size=5)
        heard = " ".join(x.text.strip() for x in segs)
        ratio = len(heard.split()) / max(1, len(cap.split()))
        flag = "CHECK" if ratio > 1.45 or ratio < 0.6 else "ok   "
        bad += flag == "CHECK"
        print(f"  {flag} {bid}  script: {say}\n            heard:  {heard}")
    print(f"  {bad} beat(s) to check" if bad else "  every beat matches its script in length; read the lines above for wrong words")


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    cmd = sys.argv[1]; raw = sys.argv[2:]; clips = None
    if "--clips" in raw:
        i = raw.index("--clips"); clips = raw[i + 1]; raw = raw[:i] + raw[i + 2:]
    args = [a for a in raw if not a.startswith("--")]
    names = list(S) if args == ["all"] else args
    for n in names:
        if n not in S:
            sys.exit(f"no Short called {n}; have: {', '.join(S)}")
        if cmd == "story":
            story(n, "--no-tts" not in sys.argv, clips)
        elif cmd == "lines":
            print(f"{n} · {S[n]['channel']} · {S[n]['lang']}")
            for bid, chunks, _ in S[n]["beats"]:
                print(f"  {bid}: " + " ".join(c[0] for c in chunks))
        elif cmd == "mux":
            mux(n)
        elif cmd == "verify":
            verify(n)
        elif cmd == "check":
            subprocess.run([sys.executable, str(ROOT / "scripts" / "shorts_check.py"), "--file", str(SHORTS / n / "check.json")])
        else:
            sys.exit(__doc__)


if __name__ == "__main__":
    main()
