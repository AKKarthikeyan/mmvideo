# Scripts for the spiritual channel (working name "dharma"), in the Vox beat format used by scripts/vx_scripts.py.
# Each beat: T(ch, key, say, cap, scene). say = spoken (numbers as words); cap = on-screen captions; scene = one scene type.
# "at"/"hl" phrases must occur in `say` (the build checks). Verse scenes carry only a reference (ref="gita:2.47"): the build
# fills the Sanskrit, transliteration, English and source line from scripts/dharma/corpus.py, so no verse is ever typed by hand.
#
# House rules (docs/DHARMA_CHANNEL.md): the narrator is a guide and never speaks as a deity; every verse is shown with chapter
# and verse and the translator; our reading is marked OUR NOTE; no deity is drawn; nothing is claimed as "research shows"
# without the paper on screen; a human reviewer signs `reviewed_by` before anything is uploaded.
#
# Status: DRAFT skeleton for the pilot (21 Oct 2026). Doctrine and Sanskrit not yet reviewed.

def T(ch, key, say, cap, scene): return dict(ch=ch, key=key, say=say, cap=cap, scene=scene)
def title(ch, key, lines, say): return T(ch, key, say, None, dict(type="title", lines=lines))
def K(say, *lines, kicker=None, cap=None):   # kinetic typography: lines = (text, at, emphasised words)
    return dict(type="kinetic", kicker=kicker, lines=[dict(t=t, at=a, em=e) for t, a, e in lines])
def V(ch, key, ref, say, cap=None, at=None, hl=None, heading=None):
    """A verse beat. The build resolves `ref` through corpus.ref() into sa/tr/en/src. `at` = when the English appears."""
    return T(ch, key, say, cap, dict(type="verse", ref=ref, heading=heading or f"BHAGAVAD GITA {ref.split(':')[-1]}", at=at, hl=hl or []))

# The channel's standing disclosure (the equivalent of Moat & Margin's SEBI beat). Spoken once, early, in every long video.
DISC_SAY = ("A note on how we work. Every verse you see is shown with its chapter and verse, in a public domain translation named on screen. "
            "Where we add our own reading, it is marked as our note. The pictures are drawn in code, the voice is synthetic, and nothing here speaks for God.")
DISC_CAP = ("A note on how we work. Every verse is shown with its chapter and verse, in a public-domain translation named on screen. "
            "Our own reading is marked OUR NOTE. The pictures are drawn in code, the voice is synthetic, and nothing here speaks for God.")
DISC = dict(type="strips", items=[dict(text="VERSE + CHAPTER ON SCREEN", at="chapter and verse"), dict(text="OUR READING = OUR NOTE", at="marked as our note"),
                                  dict(text="DRAWN IN CODE · SYNTHETIC VOICE", at="drawn in code"), dict(text="NOBODY HERE SPEAKS FOR GOD", at="nothing here speaks", red=True)])

# ================================================================ pilot 1 · Gita chapter 2, read as a chapter about overthinking
G02 = dict(id="dhgita02", title="The Gita Chapter That Answers Overthinking", voice="English_Diligent_Man", template="vox",
  brand="Dharma · chapter and verse", brandName="DHARMA", endLines=["Every verse with its chapter and verse.", "Our own reading is marked OUR NOTE."],   # working name until AK names the channel
  reviewed_by=None, sources_note="Sanskrit and transliteration: the Bhagavad Gita dataset (github.com/gita/gita, Unlicense). English: Shri Purohit Swami, 1935 (public domain). Katha Upanishad 1.3.3-4: our paraphrase, to be replaced by a public-domain translation once sources/ holds one.",
  chapters=["It is two in the morning", "The collapse", "The diagnosis", "The chain", "The instruction", "What it looks like", "One thing to try", "Sources"],
  shorts=[
    dict(title="The chain that ends in ruin · Gita 2.62-63", beats=["c30", "c31", "c32"], hook="How overthinking ends. In two verses."),
    dict(title="You have the right to work · Gita 2.47", beats=["c40", "c41", "c42"], hook="The most quoted line in the Gita, and what it does not say."),
    dict(title="The ocean and the rivers · Gita 2.70", beats=["c51", "c52"], hook="A mind that stays full and still."),
  ],
  beats=[
  # ---- 0 · hook: a modern problem, then the oldest version of it
  T(0,"c00","It is two in the morning. You are not asleep. You are running the same conversation for the fortieth time. The one that has not happened yet.",
    "It's 2 a.m. You're not asleep. You're running the same conversation for the 40th time. The one that hasn't happened yet.",
    K(None, ("2 A.M.", "two in the morning", []), ("THE SAME CONVERSATION.", "same conversation", []), ("THE ONE THAT HAS NOT HAPPENED YET.", "has not happened", ["NOT HAPPENED"]))),
  T(0,"c01","That loop has a name in the oldest book most Indians own, and the book is not kind about it. It calls it grief for what has not happened. And it spends a whole chapter taking it apart.",
    "That loop has a name in the oldest book most Indians own, and the book isn't kind about it. It calls it grief for what hasn't happened. And it spends a whole chapter taking it apart.",
    K(None, ("GRIEF FOR WHAT HAS NOT HAPPENED.", "grief for what", ["GRIEF"]), ("ONE WHOLE CHAPTER.", "whole chapter", []), kicker="THE GITA, CHAPTER TWO")),
  T(0,"c02", DISC_SAY, DISC_CAP, DISC),
  T(0,"c03","So here is the plan. The symptoms. The diagnosis. The chain reaction that makes it worse. The instruction. And one thing you can try tonight.", None,
    dict(type="list", heading="THE PLAN", items=[dict(text="THE SYMPTOMS", at="The symptoms"), dict(text="THE DIAGNOSIS", at="The diagnosis"), dict(text="THE CHAIN REACTION", at="chain reaction"), dict(text="THE INSTRUCTION", at="The instruction"), dict(text="ONE THING TO TRY", at="one thing")])),

  # ---- 1 · the collapse: Arjuna's symptoms are a panic attack, described in the first person
  title(1,"c10",["THE", "COLLAPSE"], "Chapter one. The collapse."),
  T(1,"c11","The Gita opens with a soldier who cannot act. Arjuna is the best archer alive, the battle is about to begin, and he puts his bow down. Here is how he describes it, in his own words.",
    "The Gita opens with a soldier who can't act. Arjuna is the best archer alive, the battle is about to begin, and he puts his bow down. Here's how he describes it, in his own words.",
    dict(type="strips", items=[dict(text="THE BEST ARCHER ALIVE", at="best archer"), dict(text="PUTS HIS BOW DOWN", at="puts his bow", red=True)])),
  V(1,"c12","gita:1.29","His limbs fail. His throat dries. His body trembles. The next verse adds that the bow slips from his hand. That is not cowardice. That is a body that has decided before the mind has.",
    "His limbs fail. His throat dries. His body trembles. The next verse adds that the bow slips from his hand. That isn't cowardice. That's a body that has decided before the mind has.", at="limbs fail", hl=["limbs", "throat", "trembling"]),
  V(1,"c13","gita:2.7","Then he says the sentence the whole book hangs on. My mind is confused about my duty. Direct me. I am your disciple. Everything after this is an answer to that.",
    "Then he says the sentence the whole book hangs on: My mind is confused about my duty. Direct me. I'm your disciple. Everything after this is an answer to that.", at="Direct me", hl=["confused", "duty", "disciple", "direct"]),
  T(1,"c14","Our note. Chapter one is the symptoms. Chapter two is the first time the symptoms are named and answered. That is why it is the chapter most teachers start with, and why we start here.", None,
    K(None, ("CHAPTER ONE: THE SYMPTOMS.", "Chapter one", []), ("CHAPTER TWO: THE ANSWER BEGINS.", "Chapter two", ["ANSWER"]), kicker="OUR NOTE")),

  # ---- 2 · the diagnosis: grief for what has not happened; sensations come and go
  title(2,"c20",["THE", "DIAGNOSIS"], "Chapter two. The diagnosis."),
  V(2,"c21","gita:2.11","The first thing Krishna says is not comfort. It is a diagnosis. You are grieving for those who do not call for grief, and you sound wise while you do it. The wise, it says, grieve neither for the dead nor the living.",
    "The first thing Krishna says isn't comfort. It's a diagnosis. You're grieving for those who don't call for grief, and you sound wise while you do it. The wise, it says, grieve neither for the dead nor the living.", at="not call for grief", hl=["grieve", "grief", "wise"]),
  T(2,"c22","Our note. Read that as a description of overthinking and it fits exactly. The loop at two in the morning is grief paid in advance, for a loss that may never arrive.", None,
    K(None, ("GRIEF PAID IN ADVANCE.", "paid in advance", ["ADVANCE"]), ("FOR A LOSS THAT MAY NEVER ARRIVE.", "may never arrive", []), kicker="OUR NOTE")),
  V(2,"c23","gita:2.14","Then the second move. Heat and cold, pleasure and pain, come from contact with the world. They come and they go. They are not permanent. Endure them.",
    "Then the second move. Heat and cold, pleasure and pain, come from contact with the world. They come and they go. They aren't permanent. Endure them.", at="come and they go", hl=["come", "go", "permanent", "endure"]),
  T(2,"c24","Our note. This is a weather model of feeling. A feeling is a front passing through, not a verdict on your life. The verse does not say the weather is not real. It says it moves.", None,
    K(None, ("A FEELING IS WEATHER.", "weather model", ["WEATHER"]), ("IT IS REAL. AND IT MOVES.", "It says it moves", ["MOVES"]), kicker="OUR NOTE")),

  # ---- 3 · the chain: 2.62-63, then the chariot
  title(3,"c30",["THE", "CHAIN"], "Chapter three. The chain."),
  V(3,"c31","gita:2.62","Now the part that reads like a case study. Two verses describe how a mind comes apart, one link at a time. It starts with dwelling on an object. Dwelling becomes attraction. Attraction becomes desire. Desire, blocked, becomes anger.",
    "Now the part that reads like a case study. Two verses describe how a mind comes apart, one link at a time. It starts with dwelling on an object. Dwelling becomes attraction. Attraction becomes desire. Desire, blocked, becomes anger.", at="dwelling on an object", hl=["dwells", "attraction", "desire", "anger"]),
  V(3,"c32","gita:2.63","Anger brings delusion. Delusion wipes memory. Without memory, reason shatters. And when reason goes, the verse says, you are destroyed. Eight links. Every one of them familiar.",
    "Anger brings delusion. Delusion wipes memory. Without memory, reason shatters. And when reason goes, the verse says, you're destroyed. Eight links. Every one of them familiar.", at="Anger brings delusion", hl=["anger", "delusion", "memory", "reason", "destruction"]),
  T(3,"c33","Dwelling. Attraction. Desire. Anger. Delusion. Memory gone. Reason gone. Destruction. The loop at two in the morning usually lives between the first and the fourth link.", None,
    dict(type="strips", items=[dict(text="DWELLING → ATTRACTION → DESIRE → ANGER", at="Dwelling"), dict(text="DELUSION → MEMORY → REASON → DESTRUCTION", at="Delusion", red=True), dict(text="2 A.M. LIVES BETWEEN LINKS 1 AND 4", at="usually lives")])),
  T(3,"c34","The Gita assumes a picture of the mind that an older text draws out in full. Picture a chariot. The body is the chariot. The intellect is the driver. The mind is the reins. The senses are the horses. The road is the things of the world. The self rides in it. When the mind lets go, the horses pull wherever they like.",
    "The Gita assumes a picture of the mind that an older text draws out in full. Picture a chariot. The body is the chariot. The intellect is the driver. The mind is the reins. The senses are the horses. The road is the things of the world. The self rides in it. When the mind lets go, the horses pull wherever they like.",
    dict(type="chariot", heading="THE CHARIOT OF THE SELF", note="KATHA UPANISHAD 1.3.3-4 · OUR PARAPHRASE",
         parts=dict(chariot=dict(text="THE BODY · THE CHARIOT", at="The body is"), driver=dict(text="THE INTELLECT · THE DRIVER", at="The intellect"), reins=dict(text="THE MIND · THE REINS", at="The mind is"),
                    horses=dict(text="THE SENSES · THE HORSES", at="The senses"), road=dict(text="THE OBJECTS · THE ROAD", at="The road is"), rider=dict(text="THE SELF · THE RIDER", at="The self rides")), wild="lets go")),
  V(3,"c35","gita:2.67","Chapter two says the same thing with a boat. One straying sense the mind follows can carry the whole reason away, the way a storm tosses a ship at sea. Overthinking is the ship going sideways.",
    "Chapter two says the same thing with a ship. One straying sense the mind follows can carry the whole reason away, the way a storm tosses a ship at sea. Overthinking is the ship going sideways.", at="storm tosses", hl=["ship", "tempest", "reason", "mind", "senses"]),

  # ---- 4 · the instruction: 2.47, 2.48, 2.50, 2.40
  title(4,"c40",["THE", "INSTRUCTION"], "Chapter four. The instruction."),
  V(4,"c41","gita:2.47","Here is the most quoted line in the book, and the most misquoted. You have the right to work, but never to the fruit of it. Do not make the fruit your motive. And do not use that as an excuse to do nothing.",
    "Here's the most quoted line in the book, and the most misquoted. You have the right to work, but never to the fruit of it. Don't make the fruit your motive. And don't use that as an excuse to do nothing.", at="right to work", hl=["work", "fruit", "inaction"]),
  T(4,"c42","Our note. Read it against the loop. Two in the morning is spent entirely on the fruit: the reply, the result, the verdict. The verse hands you back the only part that was ever yours: the next piece of work.",
    None, K(None, ("2 A.M. IS SPENT ON THE FRUIT.", "spent entirely", ["FRUIT"]), ("THE VERSE HANDS BACK THE WORK.", "hands you back", ["WORK"]), kicker="OUR NOTE")),
  V(4,"c48","gita:2.48","The next verse gives the method a name. Act with the mind held steady, renounce attachment, look on success and failure with an equal eye. That equanimity, the verse says, is what yoga means; this translator's word for yoga is spirituality.",
    "The next verse gives the method a name. Act with the mind held steady, renounce attachment, look on success and failure with an equal eye. That equanimity, the verse says, is what yoga means; this translator's word for yoga is spirituality.", at="equal eye", hl=["success", "failure", "equanimity"]),
  V(4,"c49","gita:2.50","And two verses on, a definition that surprises people. The Sanskrit says yoga is skill in action; Purohit renders it as the true art of living. Either way: not withdrawal from action. Skill in it.",
    "And two verses on, a definition that surprises people. The Sanskrit says yoga is skill in action; Purohit renders it as the true art of living. Either way: not withdrawal from action. Skill in it.", at="true art of living", hl=["right", "action", "art", "living"]),
  V(4,"c43","gita:2.40","One more, because the loop always asks: what if I start and it goes wrong? On this path, the verse says, effort is never wasted. Even a little of it protects you from great danger.",
    "One more, because the loop always asks: what if I start and it goes wrong? On this path, the verse says, effort is never wasted. Even a little of it protects you from great danger.", at="never wasted", hl=["endeavour", "wasted", "protects", "danger"]),
  T(4,"c44","Our note. What the instruction is not. It is not fatalism, and it is not indifference to results. The right to the work includes caring about doing it well. Commentators across the schools agree on that much; where they differ is in why, and we will come to that in a later video.", None,
    dict(type="strips", items=[dict(text="NOT FATALISM", at="not fatalism", red=True), dict(text="NOT INDIFFERENCE TO RESULTS", at="not indifference", red=True), dict(text="CARE ABOUT THE WORK, NOT THE VERDICT", at="caring about doing")])),

  # ---- 5 · what it looks like: 2.56, 2.58, 2.70
  title(5,"c50",["WHAT IT", "LOOKS LIKE"], "Chapter five. What it looks like."),
  V(5,"c51","gita:2.70","Arjuna asks what such a person is like. The answer ends with a picture. Rivers pour into the ocean from every side, and the ocean, brimming, remains the same. That is the mind the chapter is describing. Not empty. Full, and still.",
    "Arjuna asks what such a person is like. The answer ends with a picture: rivers pour into the ocean from every side, and the ocean, brimming, remains the same. That's the mind the chapter is describing. Not empty. Full, and still.", at="Rivers pour", hl=["peace", "rivers", "ocean", "same"]),
  T(5,"c52","Our note. Notice what the ocean does not do. It does not stop the rivers. Thoughts still arrive. The difference is that they arrive into something that does not rise and fall with each one.", None,
    K(None, ("THE OCEAN DOES NOT STOP THE RIVERS.", "does not stop", []), ("IT DOES NOT RISE AND FALL WITH EACH ONE.", "rise and fall", ["RISE AND FALL"]), kicker="OUR NOTE")),
  V(5,"c53","gita:2.58","And a second picture, smaller. A tortoise drawing its limbs in. Not because the world is dangerous, but because it can. The ability to pull attention back is the skill the chapter is teaching.",
    "And a second picture, smaller: a tortoise drawing its limbs in. Not because the world is dangerous, but because it can. The ability to pull attention back is the skill the chapter is teaching.", at="tortoise", hl=["withdraw", "senses", "tortoise", "limbs"]),
  V(5,"c54","gita:2.56","Here is the plain description, for the record. Unruffled in suffering. Not stirred by enjoyment. Without attachment, anger or fear. The chapter calls this a settled mind. Notice it never says a mind with nothing in it.",
    "Here's the plain description, for the record: unruffled in suffering, not stirred by enjoyment, without attachment, anger or fear. The chapter calls this a settled mind. Notice it never says a mind with nothing in it.", at="Unruffled", hl=["unruffled", "suffering", "attachment", "anger", "fear"]),

  # ---- 6 · one thing to try tonight
  title(6,"c60",["ONE THING", "TO TRY"], "Chapter six. One thing to try."),
  T(6,"c61","Tonight, when the loop starts, take the thing you are looping on and split it on paper into two columns. My work. The fruit. Everything in the second column, the chapter says, was never yours. Everything in the first column has a next step. Do that step tomorrow, and stop.",
    "Tonight, when the loop starts, take the thing you're looping on and split it on paper into two columns: My work. The fruit. Everything in the second column, the chapter says, was never yours. Everything in the first column has a next step. Do that step tomorrow, and stop.",
    dict(type="cards", heading="THE TWO COLUMNS · OUR NOTE", cards=[dict(top="COLUMN ONE", big="MY WORK", sub="HAS A NEXT STEP", at="My work"), dict(top="COLUMN TWO", big="THE FRUIT", sub="WAS NEVER YOURS", at="The fruit", fill="mustard")])),
  T(6,"c62","That is not a cure. It is the reins back in the hand for one night. The chapter does not promise the horses will stop. It promises you can hold them.", None,
    K(None, ("NOT A CURE.", "not a cure", []), ("THE REINS BACK IN THE HAND.", "reins back", ["REINS"]), ("FOR ONE NIGHT.", "one night", []))),

  # ---- 7 · sources and the ask
  title(7,"c70",["SOURCES"], "Sources."),
  T(7,"c71","Every verse in this video was shown with its chapter and verse. The English follows Shri Purohit Swami's translation of nineteen thirty five, which is in the public domain, in the edited text of the open Gita dataset; the Sanskrit is verbatim. The chariot is from the Katha Upanishad, in our own words. Our reading was marked as our note. If you think we read a verse wrong, say so in the comments, with the verse number, and we will check it against the Sanskrit.",
    "Every verse in this video was shown with its chapter and verse. The English follows Shri Purohit Swami's translation of 1935, which is in the public domain, in the edited text of the open Gita dataset; the Sanskrit is verbatim. The chariot is from the Katha Upanishad, in our own words. Our reading was marked OUR NOTE. If you think we read a verse wrong, say so in the comments, with the verse number, and we'll check it against the Sanskrit.",
    dict(type="list", heading="SOURCES", items=[dict(text="SANSKRIT: BHAGAVAD GITA DATASET (GITHUB.COM/GITA/GITA)", at="Every verse"), dict(text="ENGLISH: AFTER SHRI PUROHIT SWAMI, 1935 (PUBLIC DOMAIN; EDITED TEXT)", at="Purohit Swami"),
                                                 dict(text="KATHA UPANISHAD 1.3.3-4: OUR PARAPHRASE", at="Katha Upanishad"), dict(text="OUR READING: MARKED OUR NOTE", at="marked as our note"), dict(text="TELL US THE VERSE NUMBER", at="verse number")])),
  T(7,"c72","Next in this series: chapter three, the chapter about why doing nothing is not an option. Chapter and verse, as always.",
    "Next in this series: chapter three, the chapter about why doing nothing isn't an option. Chapter and verse, as always.",
    K(None, ("NEXT: CHAPTER THREE.", "chapter three", []), ("WHY DOING NOTHING IS NOT AN OPTION.", "doing nothing", ["NOT AN OPTION"]))),
])

VIDEOS = [G02]
