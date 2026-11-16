# Scripts for the spiritual channel (working name "dharma"), in the story format AK set on 11 Oct 2026 for the Moat & Margin
# story videos (dmartstory and after; the team calls it VoxPlus): the Vox engine plus the illustration kit, a real question at 0:00,
# a hook at most every 45 s (checked by the build), a spine, a gate, marks, mood plates on the chapter titles, a recurring case
# board, hand-written worries and comforts before the verdict, and a hand-off to the next video. Told to a viewer who has never
# opened the text.
#
# Each beat: T(ch, key, say, cap, scene). say = spoken (numbers as words); cap = on-screen captions; scene = one scene type.
# "at"/"hl" phrases must occur in `say` (the build checks). Verse scenes carry only a reference (ref="gita:2.47"): the build fills
# the Sanskrit, transliteration, English and source line from scripts/dharma/corpus.py, so no verse is ever typed by hand.
#
# House rules (docs/DHARMA_CHANNEL.md): the narrator is a guide and never speaks as a deity; every verse is shown with chapter
# and verse and the translator; our reading is marked OUR NOTE; no deity is drawn or generated; nothing is claimed as "research
# shows" without the paper on screen; a human reviewer signs `reviewed_by` before anything is uploaded.
#
# Status: DRAFT (21 Oct 2026). Doctrine and Sanskrit not yet reviewed. Mood plates not yet generated (build --pics).

def T(ch, key, say, cap, scene): return dict(ch=ch, key=key, say=say, cap=cap, scene=scene)
def title(ch, key, lines, say, pic=None): return T(ch, key, say, None, dict(type="title", lines=lines, pic=pic))
def V(ch, key, ref, say, cap=None, at=None, hl=None, heading=None, stamps=None):
    """A verse beat. The build resolves `ref` through corpus.ref() into sa/tr/en/src. `at` = when the English appears."""
    sc = dict(type="verse", ref=ref, heading=heading or f"BHAGAVAD GITA {ref.split(':')[-1]}", at=at, hl=hl or [])
    if stamps: sc["stamps"] = stamps
    return T(ch, key, say, cap, sc)

# The chariot is this video's case board (what the missing-56-paise board is to the DMart story): six parts, named one by one.
_PARTS = dict(chariot="THE BODY · THE CHARIOT", horses="THE SENSES · THE HORSES", reins="THE MIND · THE REINS",
              driver="THE INTELLECT · THE DRIVER", rider="THE SELF · THE RIDER", road="THE OBJECTS · THE ROAD")
def _board(named=(), found=(), **kw):
    """named: parts already on the board from frame one; found: (part, at) pairs that pop in as they are spoken."""
    parts = {k: dict(text=_PARTS[k]) for k in named}
    parts.update({k: dict(text=_PARTS[k], at=a) for k, a in found})
    return dict(type="chariot", heading="THE CASE OF THE RUNAWAY CHARIOT", note="KATHA UPANISHAD 1.3.3-4 · OUR PARAPHRASE", parts=parts, **kw)

# The channel's standing disclosure (the equivalent of Moat & Margin's SEBI beat). Spoken once, early, in every long video.
DISC_SAY = ("A note on how we work. Every verse you see is shown with its chapter and verse, in a public domain translation named on screen. "
            "Where we add our own reading, it is marked as our note. The pictures are drawn in code, the voice is synthetic, and nothing here speaks for God.")
DISC_CAP = ("A note on how we work. Every verse is shown with its chapter and verse, in a public-domain translation named on screen. "
            "Our own reading is marked OUR NOTE. The pictures are drawn in code, the voice is synthetic, and nothing here speaks for God.")
DISC = dict(type="strips", items=[dict(text="VERSE + CHAPTER ON SCREEN", at="chapter and verse"), dict(text="OUR READING = OUR NOTE", at="marked as our note"),
                                  dict(text="DRAWN IN CODE · SYNTHETIC VOICE", at="drawn in code"), dict(text="NOBODY HERE SPEAKS FOR GOD", at="nothing here speaks", red=True)])

# ================================================================ pilot 1 · Gita chapter 2, read as a chapter about overthinking
G02 = dict(id="dhgita02", title="The Gita Chapter That Answers Overthinking", voice="English_Diligent_Man",
  brand="Dharma · chapter and verse", brandName="DHARMA", endLines=["Every verse with its chapter and verse.", "Our own reading is marked OUR NOTE."],   # working name until AK names the channel
  keyword="Bhagavad Gita chapter 2",
  spine="Who let go of the reins at two in the morning?",
  gate=dict(
    changed="What the text says: Gita 1.29 (the body fails), 2.7 (teach me), 2.11 (grief for what needs no grief), 2.14 (sensations come and go), 2.62-63 (the eight-link chain), 2.67 (the ship in the storm), 2.47 (the right to work, not the fruit), 2.48 (equanimity is yoga), 2.50 (skill in action), 2.40 (no effort lost), 2.70 (the ocean), 2.58 (the tortoise), 2.56 (the settled mind); Katha Upanishad 1.3.3-4 (the chariot) and Mundaka 3.1.1 (two birds) in our paraphrase.",
    care="For a viewer who has never opened the Gita and lies awake looping on one thing: what does the oldest Indian text on a mind that will not act say is happening, which part of you let go, and what is the one thing to try tonight?",
    added="Our reading, marked OUR NOTE throughout: the 2 a.m. loop as grief paid in advance (from 2.11), the weather model of feeling (from 2.14), the chain as an engine with eight gears (from 2.62-63), the chariot as a case board with six parts named one by one, the two-column exercise (from 2.47), the rope and the snake as the verdict (Advaita's classic example).",
    invalidate="The text is about grief, duty and a battle, not overthinking: 2.11 names the dead and the living, not outcomes; the chariot is from the Katha Upanishad, not the Gita; 2.47 has centuries of competing readings (Shankara, Ramanuja, Gandhi, Tilak) and ours is the plain-sense one; the English on screen is an edited copy of Purohit Swami (1935), not his exact wording; none of this is clinical advice.",
    monitor="Whether the viewer can do the two columns tonight; the comments for verse-number corrections; chapter three next (why doing nothing is not an option)."),
  next_video="Gita Chapter 3: Why Doing Nothing Is Not an Option",
  chapters=["Two in the morning", "The collapse", "The diagnosis", "The chain", "The instruction", "What it looks like", "The verdict", "One thing to try", "Sources"],
  marks=dict(hook=["h00"], rehooks=["h01", "c11", "c14", "c21", "c24", "c33", "c35", "c41", "c46", "c51", "c53", "c62", "c64"], turn="c63", counter=["c61"],
             plants=[("h00", "c63"), ("h01", "c64")], known="c62", unknown="c64", monitor="c72", handoff="c72"),
  hooks=["h00|is it", "h01|which part lets go", "h03|the one thing you can try tonight", "c11|What happened to him", "c13|Direct me", "c14|has not said a word",
         "c21|Why does that matter", "c23|Then why does the loop not pass", "c24|why does the loop not pass", "c31|Two verses describe", "c33|which part of the chariot",
         "c34|wherever they like", "c35|who is supposed to be holding", "c41|what does the verse hand back", "c43|what yoga means", "c45|what if I start",
         "c46|one of them is you", "c47|What is it not", "c51|What does that feel like", "c52|That part was never looping", "c53|who let go of the reins",
         "c54|because it can", "c55|a mind with nothing in it", "c61|our reading, not the text", "c62|which side wins", "c63|And the reins",
         "c64|can you do it tonight", "c71|was never yours", "c72|why doing nothing is not an option"],
  reviewed_by=None,
  sources_note="Sanskrit and transliteration: the Bhagavad Gita dataset (github.com/gita/gita, Unlicense). English: after Shri Purohit Swami, 1935 (public domain), in the dataset's edited text. Katha Upanishad 1.3.3-4 and Mundaka Upanishad 3.1.1: our paraphrase, to be replaced by a public-domain translation once sources/ holds one.",
  pics={"n_field": ("An empty ancient battlefield at dawn seen from a low angle, thin mist, two distant empty chariots as silhouettes, spears planted in the ground", "land"),
        "n_dawn": ("A plain stone courtyard at first light, one tree, long shadows, an empty wooden bench", "land"),
        "n_night": ("A dark bedroom window at night, a faint city glow outside, an empty bed, a phone face-down on the sheet", "land"),
        "n_reins": ("A close view of worn leather reins resting over a wooden rail in a stable, morning light through slats", "land"),
        "n_ocean": ("Three rivers meeting a calm sea at dusk, seen from a cliff, the water flat and full", "land"),
        "n_lamp": ("A single clay lamp on a stone floor in a dark room, warm light on the flagstones", "land"),
        "n_paper": ("A blank sheet of paper and a pencil on a wooden desk under a small lamp at night", "land")},
  timelines={},
  shorts=[
    dict(title="The chain that ends in ruin · Gita 2.62-63", beats=["c31", "c32"], hook="How a mind comes apart. Two verses, eight links."),
    dict(title="You have the right to work · Gita 2.47", beats=["c41", "c42", "c45"], hook="The most quoted line in the Gita, and what it does not say."),
    dict(title="Feelings are weather · Gita 2.14", beats=["c23", "c24"], hook="A feeling is a front passing through, not a verdict."),
  ],
  beats=[
  # ---- 0 · two in the morning: the question, the picture, the rules, the plan
  T(0,"h00","Two in the morning. Looping on it again? You are looking at the thing you have been turning over all day. And in the dark, it looks like a snake. Here is the question this video is about. Is it?",
    "2 a.m. Looping on it again? You're looking at the thing you've been turning over all day. And in the dark, it looks like a snake. Here's the question this video is about. Is it?",
    dict(type="rope", heading="2 A.M.", note="WHERE WE START", dark=True, snake=dict(text="THE THING YOU ARE LOOPING ON", at="looks like a snake"), stamps=[dict(text="IS IT?", at="Is it")])),
  T(0,"h01","An old Indian text has a picture for exactly this. A chariot. Someone is riding in it. Someone is supposed to be driving. And the horses are pulling in six directions. By the end of this video every part of that chariot will have a name, and you will know which part lets go at two in the morning. That is the case.",
    "An old Indian text has a picture for exactly this. A chariot. Someone is riding in it. Someone is supposed to be driving. And the horses are pulling in six directions. By the end of this video every part of that chariot will have a name, and you'll know which part lets go at 2 a.m. That's the case.",
    _board(wild="pulling in six", stamps=[dict(text="WHO LET GO OF THE REINS?", at="which part lets go")])),
  T(0,"h02", DISC_SAY, DISC_CAP, DISC),
  T(0,"h03","The plan. First, a soldier who could not act. Then the diagnosis. Then the chain reaction, link by link. Then the instruction everyone misquotes. Then the verdict. And the one thing you can try tonight.", None,
    dict(type="list", heading="THE PLAN", items=[dict(text="A SOLDIER WHO COULD NOT ACT", at="a soldier"), dict(text="THE DIAGNOSIS", at="the diagnosis"), dict(text="THE CHAIN, LINK BY LINK", at="chain reaction"),
                                                dict(text="THE INSTRUCTION EVERYONE MISQUOTES", at="the instruction"), dict(text="THE VERDICT", at="the verdict"), dict(text="ONE THING TO TRY TONIGHT", at="one thing")])),

  # ---- 1 · the collapse: Arjuna's symptoms, in the first person; the first part of the board
  title(1,"c10",["THE", "COLLAPSE"], "Chapter one. A soldier who cannot act.", pic="n_field"),
  T(1,"c11","The Gita opens with a soldier who cannot act. Arjuna is the best archer alive. The battle is about to begin. And he puts his bow down. What happened to him? He tells us himself.",
    "The Gita opens with a soldier who can't act. Arjuna is the best archer alive. The battle is about to begin. And he puts his bow down. What happened to him? He tells us himself.",
    dict(type="strips", items=[dict(text="THE BEST ARCHER ALIVE", at="best archer"), dict(text="PUTS HIS BOW DOWN", at="puts his bow", red=True), dict(text="WHAT HAPPENED TO HIM?", at="What happened")])),
  V(1,"c12","gita:1.29","His limbs fail. His throat dries. His body trembles. The next verse adds that the bow slips from his hand. That is not cowardice. That is a body that has decided before the mind has.",
    "His limbs fail. His throat dries. His body trembles. The next verse adds that the bow slips from his hand. That isn't cowardice. That's a body that has decided before the mind has.", at="limbs fail", hl=["limbs", "throat", "trembling"]),
  V(1,"c13","gita:2.7","Then he says the sentence the whole book hangs on. My mind is confused about my duty. Direct me. I am your disciple. Everything after this is an answer to that.",
    "Then he says the sentence the whole book hangs on: My mind is confused about my duty. Direct me. I'm your disciple. Everything after this is an answer to that.", at="Direct me", hl=["confused", "duty", "disciple", "direct"]),
  T(1,"c14","So here is the first part of the picture. The body is the chariot. Arjuna's chariot has stopped: his body has decided before his mind has. One part named. Five to go. And the driver has not said a word yet.",
    "So here's the first part of the picture. The body is the chariot. Arjuna's chariot has stopped: his body has decided before his mind has. One part named. Five to go. And the driver hasn't said a word yet.",
    _board(found=[("chariot", "The body is")], stamps=[dict(text="1 OF 6 NAMED", at="One part named"), dict(text="THE DRIVER HAS NOT SPOKEN", at="has not said")])),

  # ---- 2 · the diagnosis: grief for what has not happened; feelings come and go
  title(2,"c20",["THE", "DIAGNOSIS"], "Chapter two. The diagnosis.", pic="n_dawn"),
  V(2,"c21","gita:2.11","The first thing Krishna says is not comfort. It is a diagnosis. You are grieving for those who do not call for grief, and you sound wise while you do it. The wise, it says, grieve neither for the dead nor the living. Why does that matter at two in the morning?",
    "The first thing Krishna says isn't comfort. It's a diagnosis. You're grieving for those who don't call for grief, and you sound wise while you do it. The wise, it says, grieve neither for the dead nor the living. Why does that matter at 2 a.m.?", at="not call for grief", hl=["grieve", "grief", "wise"]),
  T(2,"c22","Our note. Read that as a description of overthinking and it fits. The loop at two in the morning is grief paid in advance, for a loss that may never arrive. The verse is about the dead and the living; the reading is ours.", None,
    dict(type="strips", items=[dict(text="GRIEF PAID IN ADVANCE", at="paid in advance"), dict(text="FOR A LOSS THAT MAY NEVER ARRIVE", at="may never arrive", red=True), dict(text="OUR NOTE · THE VERSE IS ABOUT THE DEAD AND THE LIVING", at="the reading is ours")])),
  V(2,"c23","gita:2.14","Then the second move. Heat and cold, pleasure and pain, come from contact with the world. They come and they go. They are not permanent. Endure them. Then why does the loop not pass?",
    "Then the second move. Heat and cold, pleasure and pain, come from contact with the world. They come and they go. They aren't permanent. Endure them. Then why does the loop not pass?", at="come and they go", hl=["come", "go", "permanent", "endure"]),
  T(2,"c24","Our note. This is a weather model of feeling. A feeling is a front passing through, not a verdict on your life. The verse does not say the weather is not real. It says it moves. So if feelings move, why does the loop not pass? Because something keeps turning it.",
    "Our note. This is a weather model of feeling. A feeling is a front passing through, not a verdict on your life. The verse doesn't say the weather isn't real. It says it moves. So if feelings move, why does the loop not pass? Because something keeps turning it.",
    dict(type="strips", items=[dict(text="A FEELING IS WEATHER · OUR NOTE", at="weather model"), dict(text="REAL. AND IT MOVES.", at="It says it moves"), dict(text="SO WHAT KEEPS TURNING THE LOOP?", at="something keeps turning", red=True)])),

  # ---- 3 · the chain: 2.62-63 as an engine; the horses and the reins join the board
  title(3,"c30",["THE", "CHAIN"], "Chapter three. The chain.", pic="n_night"),
  V(3,"c31","gita:2.62","Now the part that reads like a case study. Two verses describe how a mind comes apart, one link at a time. It starts with dwelling on an object. Dwelling becomes attraction. Attraction becomes desire. Desire, blocked, becomes anger.",
    "Now the part that reads like a case study. Two verses describe how a mind comes apart, one link at a time. It starts with dwelling on an object. Dwelling becomes attraction. Attraction becomes desire. Desire, blocked, becomes anger.", at="dwelling on an object", hl=["dwells", "attraction", "desire", "anger"]),
  V(3,"c32","gita:2.63","Anger brings delusion. Delusion wipes memory. Without memory, reason shatters. And when reason goes, the verse says, you are destroyed. Eight links. Every one of them familiar.",
    "Anger brings delusion. Delusion wipes memory. Without memory, reason shatters. And when reason goes, the verse says, you're destroyed. Eight links. Every one of them familiar.", at="Anger brings delusion", hl=["anger", "delusion", "memory", "reason", "destruction"]),
  T(3,"c33","Put the links in a row and they turn each other. Dwelling. Attraction. Desire. Anger. Delusion. Memory. Reason. Ruin. The loop at two in the morning usually lives between the first and the fourth link. So which part of the chariot is turning that engine?",
    "Put the links in a row and they turn each other. Dwelling. Attraction. Desire. Anger. Delusion. Memory. Reason. Ruin. The loop at 2 a.m. usually lives between the first and the fourth link. So which part of the chariot is turning that engine?",
    dict(type="gears", heading="THE ENGINE OF RUIN · GITA 2.62-63", note="EIGHT LINKS, IN THE ORDER THE TEXT GIVES THEM",
         gears=[dict(text="DWELLING", icon="feather", at="Dwelling"), dict(text="ATTRACTION", icon="lotus", at="Attraction"), dict(text="DESIRE", icon="coin", at="Desire"), dict(text="ANGER", icon="bow", at="Anger"),
                dict(text="DELUSION", icon="conch", at="Delusion"), dict(text="MEMORY", icon="box", at="Memory"), dict(text="REASON", icon="chariot", at="Reason"), dict(text="RUIN", icon="banyan", at="Ruin")],
         result=dict(text="2 A.M. LIVES BETWEEN LINKS 1 AND 4", at="lives between"))),
  T(3,"c34","The senses are the horses. The mind is the reins. In the text's picture the horses do not decide where the chariot goes. The reins do. When the reins go slack, the horses pull wherever they like. Three of six named.",
    "The senses are the horses. The mind is the reins. In the text's picture the horses don't decide where the chariot goes. The reins do. When the reins go slack, the horses pull wherever they like. Three of six named.",
    _board(named=["chariot"], found=[("horses", "The senses"), ("reins", "The mind is")], wild="reins go slack", stamps=[dict(text="3 OF 6 NAMED", at="Three of six")])),
  V(3,"c35","gita:2.67","Chapter two says the same thing with a ship. One straying sense the mind follows can carry the whole reason away, the way a storm tosses a ship at sea. Overthinking is the ship going sideways. So who is supposed to be holding the reins?",
    "Chapter two says the same thing with a ship. One straying sense the mind follows can carry the whole reason away, the way a storm tosses a ship at sea. Overthinking is the ship going sideways. So who's supposed to be holding the reins?", at="storm tosses", hl=["ship", "tempest", "reason", "mind", "senses"]),

  # ---- 4 · the instruction: 2.47, 2.48, 2.50, 2.40; the driver joins the board
  title(4,"c40",["THE", "INSTRUCTION"], "Chapter four. The instruction.", pic="n_reins"),
  V(4,"c41","gita:2.47","Here is the most quoted line in the book, and the most misquoted. You have the right to work, but never to the fruit of it. Do not make the fruit your motive. And do not use that as an excuse to do nothing. So what does the verse hand back to you?",
    "Here's the most quoted line in the book, and the most misquoted. You have the right to work, but never to the fruit of it. Don't make the fruit your motive. And don't use that as an excuse to do nothing. So what does the verse hand back to you?", at="right to work", hl=["work", "fruit", "inaction"]),
  T(4,"c42","Our note. Read it against the loop. Two in the morning is spent entirely on the fruit: the reply, the result, the verdict. The verse hands you back the only part that was ever yours. The next piece of work.",
    "Our note. Read it against the loop. 2 a.m. is spent entirely on the fruit: the reply, the result, the verdict. The verse hands you back the only part that was ever yours. The next piece of work.",
    dict(type="strips", items=[dict(text="2 A.M. IS SPENT ON THE FRUIT · OUR NOTE", at="spent entirely"), dict(text="THE VERSE HANDS BACK THE WORK", at="hands you back", red=True)])),
  V(4,"c43","gita:2.48","The next verse gives the method a name. Act with the mind held steady, renounce attachment, look on success and failure with an equal eye. That equanimity, the verse says, is what yoga means; this translator's word for yoga is spirituality.",
    "The next verse gives the method a name. Act with the mind held steady, renounce attachment, look on success and failure with an equal eye. That equanimity, the verse says, is what yoga means; this translator's word for yoga is spirituality.", at="equal eye", hl=["success", "failure", "equanimity"]),
  V(4,"c44","gita:2.50","And two verses on, a definition that surprises people. The Sanskrit says yoga is skill in action; Purohit renders it as the true art of living. Either way: not withdrawal from action. Skill in it.",
    "And two verses on, a definition that surprises people. The Sanskrit says yoga is skill in action; Purohit renders it as the true art of living. Either way: not withdrawal from action. Skill in it.", at="true art of living", hl=["right", "action", "art", "living"]),
  V(4,"c45","gita:2.40","One more, because the loop always asks: what if I start and it goes wrong? On this path, the verse says, effort is never wasted. Even a little of it protects you from great danger.",
    "One more, because the loop always asks: what if I start and it goes wrong? On this path, the verse says, effort is never wasted. Even a little of it protects you from great danger.", at="never wasted", hl=["endeavour", "wasted", "protects", "danger"]),
  T(4,"c46","The intellect is the driver. This is the part the instruction is for. Not the horses, not the reins: the one who decides where the chariot is going. Four of six named. Two left, and one of them is you.",
    "The intellect is the driver. This is the part the instruction is for. Not the horses, not the reins: the one who decides where the chariot is going. Four of six named. Two left, and one of them is you.",
    _board(named=["chariot", "horses", "reins"], found=[("driver", "The intellect")], stamps=[dict(text="4 OF 6 NAMED", at="Four of six"), dict(text="ONE OF THEM IS YOU", at="one of them is you")])),
  T(4,"c47","Our note. What is it not? It is not fatalism, and it is not indifference to results. The right to the work includes caring about doing it well. Commentators across the schools agree on that much; where they differ is why, and that is a later video.",
    "Our note. What is it not? It isn't fatalism, and it isn't indifference to results. The right to the work includes caring about doing it well. Commentators across the schools agree on that much; where they differ is why, and that's a later video.",
    dict(type="strips", items=[dict(text="NOT FATALISM", at="not fatalism", red=True), dict(text="NOT INDIFFERENCE TO RESULTS", at="not indifference", red=True), dict(text="CARE ABOUT THE WORK, NOT THE VERDICT · OUR NOTE", at="caring about doing")])),

  # ---- 5 · what it looks like: the ocean, the two birds, the rider; the board is complete
  title(5,"c50",["WHAT IT", "LOOKS LIKE"], "Chapter five. What it looks like.", pic="n_ocean"),
  V(5,"c51","gita:2.70","Arjuna asks what such a person is like. The answer ends with a picture. Rivers pour into the ocean from every side, and the ocean, brimming, remains the same. That is the mind the chapter is describing. Not empty. Full, and still. What does that feel like from the inside?",
    "Arjuna asks what such a person is like. The answer ends with a picture: rivers pour into the ocean from every side, and the ocean, brimming, remains the same. That's the mind the chapter is describing. Not empty. Full, and still. What does that feel like from the inside?", at="Rivers pour", hl=["peace", "rivers", "ocean", "same"]),
  T(5,"c52","An older text gives the inside view. Two birds sit on the same tree. One eats the sweet and bitter fruit. The other eats nothing. It only watches. The one who watches is the part of you that was awake at two in the morning, watching the loop. That part was never looping.",
    "An older text gives the inside view. Two birds sit on the same tree. One eats the sweet and bitter fruit. The other eats nothing. It only watches. The one who watches is the part of you that was awake at 2 a.m., watching the loop. That part was never looping.",
    dict(type="birds", heading="TWO BIRDS, ONE TREE", note="MUNDAKA UPANISHAD 3.1.1 · OUR PARAPHRASE", tree=dict(text="ONE TREE · ONE BODY", at="same tree"), eater=dict(text="THE ONE WHO EATS", at="One eats"),
         fruit=dict(text="SWEET AND BITTER FRUIT", at="sweet and bitter"), watcher=dict(text="THE ONE WHO WATCHES", at="only watches"), stamps=[dict(text="NEVER LOOPING", at="never looping")])),
  T(5,"c53","The self is the rider. The one who watches. Five of six named. The last part is the road: the things of the world, which the horses chase. Six. The picture is complete. So, the verdict. Who let go of the reins at two in the morning?",
    "The self is the rider. The one who watches. Five of six named. The last part is the road: the things of the world, which the horses chase. Six. The picture is complete. So, the verdict. Who let go of the reins at 2 a.m.?",
    _board(named=["chariot", "horses", "reins", "driver"], found=[("rider", "The self is"), ("road", "The last part is the road")], stamps=[dict(text="6 OF 6 NAMED", at="Six. The picture"), dict(text="WHO LET GO?", at="who let go")])),
  V(5,"c54","gita:2.58","Two smaller pictures before the verdict. A tortoise drawing its limbs in. Not because the world is dangerous, but because it can. The ability to pull attention back is the skill the chapter is teaching.",
    "Two smaller pictures before the verdict. A tortoise drawing its limbs in. Not because the world is dangerous, but because it can. The ability to pull attention back is the skill the chapter is teaching.", at="tortoise", hl=["withdraw", "senses", "tortoise", "limbs"]),
  V(5,"c55","gita:2.56","And the plain description, for the record. Unruffled in suffering. Not stirred by enjoyment. Without attachment, anger or fear. The chapter calls this a settled mind. Notice it never says a mind with nothing in it.",
    "And the plain description, for the record: unruffled in suffering, not stirred by enjoyment, without attachment, anger or fear. The chapter calls this a settled mind. Notice it never says a mind with nothing in it.", at="Unruffled", hl=["unruffled", "suffering", "attachment", "anger", "fear"]),

  # ---- 6 · the verdict: the worries, the comforts, the lamp, the board closed
  title(6,"c60",["THE", "VERDICT"], "Chapter six. The verdict.", pic="n_lamp"),
  T(6,"c61","First, the worries, because this channel does not oversell. The chapter is not a cure. It never promises the horses will stop. And reading it as a chapter about overthinking is our reading, not the text's own words. The text is about grief and duty on a battlefield.",
    "First, the worries, because this channel doesn't oversell. The chapter isn't a cure. It never promises the horses will stop. And reading it as a chapter about overthinking is our reading, not the text's own words. The text is about grief and duty on a battlefield.",
    dict(type="hand", title="Worries:", items=[dict(text="Not a cure", at="not a cure"), dict(text="The horses never promised to stop", at="never promises"), dict(text="The 2 a.m. reading is ours", at="our reading, not"), dict(text="The text: grief and duty, in a war", at="grief and duty")])),
  T(6,"c62","Now the comforts. The chain of two sixty two is described exactly, link by link, and it is recognisable. The instruction is about the one thing that was yours all along: the work. And the part of you that watched the loop was never in it. So which side wins?",
    "Now the comforts. The chain of 2.62 is described exactly, link by link, and it's recognisable. The instruction is about the one thing that was yours all along: the work. And the part of you that watched the loop was never in it. So which side wins?",
    dict(type="hand", title="Comforts:", items=[dict(text="The chain is described exactly", at="described exactly"), dict(text="The work was always yours", at="yours all along"), dict(text="The watcher was never looping", at="was never in it"), dict(text="So which side wins?", at="which side wins")])),
  T(6,"c63","Our verdict. The thing you were looping on at two in the morning was a rope. The lamp is the chapter. It does not remove the rope; it shows you what it is. The snake was never there. And the reins? The mind let go of them. Not you.",
    "Our verdict. The thing you were looping on at 2 a.m. was a rope. The lamp is the chapter. It doesn't remove the rope; it shows you what it is. The snake was never there. And the reins? The mind let go of them. Not you.",
    dict(type="rope", heading="OUR VERDICT · THE ROPE AND THE SNAKE", note="ADVAITA VEDANTA'S CLASSIC EXAMPLE · OUR READING", snake=dict(text="WHAT IT LOOKED LIKE AT 2 A.M.", at="looping on"),
         lamp=dict(text="THE CHAPTER IS THE LAMP", at="The lamp is the chapter"), rope=dict(text="A ROPE, ALL ALONG", at="was a rope"), stamps=[dict(text="THE MIND LET GO. NOT YOU.", at="Not you")])),
  T(6,"c64","Case closed? Every part has a name. The reins are the mind. The hand on them is the intellect. And the chapter's whole instruction is to that hand: hold the work, let go of the fruit. One question stays open. Can you do it tonight?",
    "Case closed? Every part has a name. The reins are the mind. The hand on them is the intellect. And the chapter's whole instruction is to that hand: hold the work, let go of the fruit. One question stays open. Can you do it tonight?",
    _board(named=["chariot", "horses", "reins", "driver", "rider", "road"], stamps=[dict(text="CASE CLOSED?", at="Case closed"), dict(text="TONIGHT?", at="Can you do it")])),

  # ---- 7 · one thing to try tonight, and the hand-off
  title(7,"c70",["ONE THING", "TO TRY"], "Chapter seven. One thing to try.", pic="n_paper"),
  T(7,"c71","Tonight, when the loop starts, take the thing you are looping on and split it on paper into two columns. My work. The fruit. Everything in the second column, the chapter says, was never yours. Everything in the first column has a next step.",
    "Tonight, when the loop starts, take the thing you're looping on and split it on paper into two columns: My work. The fruit. Everything in the second column, the chapter says, was never yours. Everything in the first column has a next step.",
    dict(type="cards", heading="THE TWO COLUMNS · OUR NOTE", cards=[dict(top="COLUMN ONE", big="MY WORK", sub="HAS A NEXT STEP", at="My work"), dict(top="COLUMN TWO", big="THE FRUIT", sub="WAS NEVER YOURS", at="The fruit", fill="mustard")])),
  T(7,"c72","Three steps. Two columns on paper. One next step for tomorrow, written down. Then stop. That is not a cure. It is the reins back in the hand for one night. And next time, chapter three: why doing nothing is not an option.",
    "Three steps. Two columns on paper. One next step for tomorrow, written down. Then stop. That's not a cure. It's the reins back in the hand for one night. And next time, chapter three: why doing nothing isn't an option.",
    dict(type="hand", title="Try tonight:", items=[dict(text="Two columns on paper", at="Two columns"), dict(text="One next step, written down", at="One next step"), dict(text="Then stop", at="Then stop"), dict(text="Next: chapter three", at="chapter three")])),

  # ---- 8 · sources and the end card
  T(8,"c80","Every verse in this video was shown with its chapter and verse. The English follows Shri Purohit Swami's translation of nineteen thirty five, which is in the public domain, in the edited text of the open Gita dataset; the Sanskrit is verbatim. The chariot is from the Katha Upanishad and the two birds from the Mundaka, both in our own words. If you think we read a verse wrong, say so in the comments, with the verse number, and we will check it against the Sanskrit.",
    "Every verse in this video was shown with its chapter and verse. The English follows Shri Purohit Swami's translation of 1935, which is in the public domain, in the edited text of the open Gita dataset; the Sanskrit is verbatim. The chariot is from the Katha Upanishad and the two birds from the Mundaka, both in our own words. If you think we read a verse wrong, say so in the comments, with the verse number, and we'll check it against the Sanskrit.",
    dict(type="sources", items=["Sanskrit and transliteration: the Bhagavad Gita dataset (github.com/gita/gita, Unlicense)", "English: after Shri Purohit Swami, 1935 (public domain), in the dataset's edited text",
                                "Katha Upanishad 1.3.3-4 (the chariot): our paraphrase", "Mundaka Upanishad 3.1.1 (the two birds): our paraphrase", "Our reading is marked OUR NOTE; tell us the verse number if we read one wrong"])),
  T(8,"c81","Subscribe for the texts, chapter and verse.", None, dict(type="end")),
])

VIDEOS = [G02]
