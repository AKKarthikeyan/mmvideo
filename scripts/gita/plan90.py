#!/usr/bin/env python3
"""90-day content plan for "Gita in Ink" (AK, 22 Oct 2026): 2 long videos a week, Shorts cut from them, evergreen
topics with high search and demand, rated by Jev.

  python3 scripts/gita/plan90.py rank        # Jev scores every long-video idea -> docs/gita/plan/jev_longs.jsonl
Slot A (Tuesday) is the chapter-by-chapter series promised at the end of the 15-minute video; slot B (Saturday) takes
the best Jev-ranked evergreen topics. Every idea lists the verses it would cite as (ref, stem): `verify` proves each
stem occurs in that verse of sources/gita/gita.json, so the plan never cites a verse that says something else.
Not -I: requests lives in the user site-packages.
"""
import concurrent.futures as cf, json, os, re, sys, time
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "gita" / "plan"; OUT.mkdir(parents=True, exist_ok=True)
V = json.load(open(ROOT / "sources/gita/gita.json"))["verses"]

# (id, kind, title, [(verse, stem), ...])  kinds: problem, concept, verse, question, story, upanishad, beginner
TOPICS = [
 ("T01", "problem", "Overthinking: what the Gita actually says", [("2.47", "karmaṇyevādhikāraste"), ("6.5", "uddhared"), ("6.35", "abhyāsena")]),
 ("T02", "problem", "Anger: the Gita's chain from a thought to ruin", [("2.62", "dhyāyato"), ("2.63", "krodhād")]),
 ("T03", "problem", "Fear of failure: the Gita on results", [("2.47", "phaleṣu"), ("2.48", "yogasthaḥ")]),
 ("T04", "problem", "Comparison and jealousy: your own path", [("3.35", "svadharmo"), ("12.13", "adveṣṭā")]),
 ("T05", "problem", "Laziness and procrastination: the Gita on tamas", [("14.8", "pramād"), ("3.8", "niyataṃ")]),
 ("T06", "problem", "Grief: what the Gita says when you lose someone", [("2.13", "dehino"), ("2.20", "najāyate"), ("2.27", "jātasya")]),
 ("T07", "problem", "How to make a hard decision, the Gita way", [("2.7", "kārpaṇya"), ("18.63", "vimṛśya")]),
 ("T08", "problem", "What is the purpose of life? The Gita's answer", [("3.35", "śreyān"), ("18.46", "yataḥpravṛttir")]),
 ("T09", "problem", "Stress at work: karma yoga for your job", [("2.50", "kauśalam"), ("3.19", "asaktaḥ")]),
 ("T10", "problem", "Self-doubt: Krishna's first words, 'Stand up'", [("2.3", "klaibyaṃ")]),
 ("T11", "problem", "Heartbreak and attachment", [("2.62", "saṅgas"), ("5.22", "saṃsparśajā")]),
 ("T12", "problem", "Ego: who is really the doer?", [("3.27", "prakṛteḥ")]),
 ("T13", "problem", "Desire and dopamine: the Gita's three gates", [("3.37", "kāmaeṣa"), ("16.21", "trividhaṃ")]),
 ("T14", "problem", "Peace of mind: the ocean verse", [("2.70", "āpūryamāṇam"), ("2.66", "nāstibuddhir")]),
 ("T15", "problem", "Food and mood: the Gita's three kinds of food", [("17.8", "āyuḥsattva"), ("17.9", "kaṭvamla"), ("17.10", "yātayāmaṃ")]),
 ("T16", "problem", "Sleep, food and balance: Gita 6.16-17", [("6.16", "nātyaśnatas"), ("6.17", "yuktāhāra")]),
 ("T17", "problem", "Forgiveness: how the Gita treats enemies", [("12.13", "kṣamī"), ("16.3", "kṣamā")]),
 ("T18", "problem", "What happens when we die? The Gita's answer", [("2.22", "vāsāṃsi"), ("8.6", "smaranbhāvaṃ")]),
 ("T19", "problem", "Meditation the Gita way, step by step", [("6.11", "śucaudeśe"), ("6.13", "samaṃkāya")]),
 ("T49", "problem", "The Gita for students: exams, focus and results", [("2.47", "karmaṇyevādhikāraste"), ("6.26", "yatoyato")]),
 ("T51", "problem", "Love and relationships in the Gita", [("12.13", "maitraḥ"), ("6.9", "suhṛn")]),
 ("T20", "concept", "Karma yoga explained in plain words", [("3.19", "asaktaḥ"), ("2.47", "karmaṇyevādhikāraste")]),
 ("T21", "concept", "Bhakti yoga explained: the path of love", [("9.26", "patraṃ"), ("12.8", "mayyevamana")]),
 ("T22", "concept", "Jnana yoga explained: the path of knowledge", [("4.38", "nahijñānena"), ("4.37", "jñānāgniḥ")]),
 ("T23", "concept", "The three gunas: a personality test from the Gita", [("14.5", "sattvaṃrajas"), ("14.6", "nirmalatvāt")]),
 ("T24", "concept", "What is dharma? The Gita's real meaning", [("4.7", "dharmasya"), ("18.47", "svadharmo")]),
 ("T25", "concept", "Who am I? The self (atman) in the Gita", [("2.20", "najāyate"), ("2.23", "nainaṃchindanti")]),
 ("T26", "concept", "Who is Krishna in the Bhagavad Gita?", [("4.7", "sṛjāmyaham"), ("10.20", "ahamātmā"), ("7.7", "mattaḥparataraṃ")]),
 ("T27", "concept", "The universal form explained (Gita chapter 11)", [("11.12", "sūryasahasrasya"), ("11.32", "kālo")]),
 ("T28", "concept", "The steady mind: the Gita's ideal person", [("2.55", "sthitaprajñas"), ("2.56", "duḥkheṣv")]),
 ("T32", "concept", "Yoga is not exercise: what yoga means in the Gita", [("2.48", "samatvaṃ"), ("2.50", "yogaḥkarmasu")]),
 ("T29", "verse", "Karmanye vadhikaraste: the most famous verse, fully explained", [("2.47", "karmaṇyevādhikāraste")]),
 ("T30", "verse", "Sarva dharman parityajya: the Gita's most debated verse", [("18.66", "sarvadharmān")]),
 ("T31", "verse", "Yada yada hi dharmasya: Krishna's promise explained", [("4.7", "yadāyadā"), ("4.8", "paritrāṇāya")]),
 ("T33", "question", "Is the Gita violent? Why Krishna told Arjuna to fight", [("2.31", "svadharmam"), ("2.37", "hatovā"), ("11.33", "nimittamātraṃ")]),
 ("T34", "question", "Did Krishna really speak 700 verses on a battlefield?", [("1.1", "dharmakṣetre")]),
 ("T35", "question", "Is the Mahabharata history? What the text itself says", [("1.1", "kurukṣetre")]),
 ("T36", "question", "Is Hindu mythology fake? How to read the epics", []),
 ("T37", "question", "The Gita and caste: what 4.13 and 18.41 actually say", [("4.13", "cāturvarṇyaṃ"), ("18.41", "brāhmaṇa")]),
 ("T38", "question", "Famous minds who read the Gita: Gandhi, Thoreau, Oppenheimer", [("11.32", "kālo")]),
 ("T48", "question", "Who heard the Gita first? Arjuna, Sanjaya and a blind king", [("1.1", "sañjaya"), ("18.75", "vyāsaprasādāc")]),
 ("T55", "question", "Arjuna's questions to Krishna, and what they teach us", [("3.1", "jyāyasī"), ("8.1", "kiṃtadbrahma"), ("18.1", "saṃnyāsasya")]),
 ("T39", "upanishad", "The Upanishads explained: the 10 principal Upanishads", []),
 ("T40", "upanishad", "Nachiketa and Death: the Katha Upanishad story", []),
 ("T41", "upanishad", "The Isha Upanishad in 10 minutes", []),
 ("T42", "upanishad", "Om explained: the Mandukya Upanishad", [("8.13", "omityekākṣaraṃ")]),
 ("T43", "upanishad", "The Yoga Sutras: yoga is stilling the mind", []),
 ("T44", "story", "The Mahabharata in 15 minutes", []),
 ("T45", "story", "The Ramayana in 15 minutes", []),
 ("T46", "story", "Karna: the Mahabharata's tragic hero", []),
 ("T47", "story", "Bhishma's vow, and why he waited for Uttarayana", [("8.24", "uttarāyaṇam")]),
 ("T56", "story", "Draupadi: the question that shook the court", []),
 ("T57", "story", "The 18 days of the Kurukshetra war", []),
 ("T52", "beginner", "Which Gita chapter should you read first?", []),
 ("T53", "beginner", "How to start reading the Bhagavad Gita: a beginner's guide", []),
]
CHAPTERS = [  # slot A: the series the 15-minute video's end card promises ("starting with the one that answers overthinking")
 ("C02", 2, "Gita chapter 2: the chapter that answers overthinking", [("2.47", "karmaṇyevādhikāraste"), ("2.10", "prahasann")]),
 ("C03", 3, "Gita chapter 3: why no one can stop acting", [("3.5", "kṣaṇamapi"), ("3.35", "svadharmo")]),
 ("C04", 4, "Gita chapter 4: why Krishna comes, age after age", [("4.7", "yadāyadā"), ("4.34", "praṇipātena")]),
 ("C05", 5, "Gita chapter 5: live in the world like a lotus leaf", [("5.10", "padmapatram"), ("5.18", "samadarśinaḥ")]),
 ("C06", 6, "Gita chapter 6: meditation and the restless mind", [("6.5", "uddhared"), ("6.35", "abhyāsena")]),
 ("C07", 7, "Gita chapter 7: everything strung on one thread", [("7.7", "maṇigaṇā"), ("7.8", "raso")]),
 ("C08", 8, "Gita chapter 8: what you remember at the end", [("8.6", "smaranbhāvaṃ"), ("8.7", "anusmara")]),
 ("C09", 9, "Gita chapter 9: a leaf, a flower, a fruit, water", [("9.26", "patraṃ"), ("9.22", "yogakṣemaṃ")]),
 ("C10", 10, "Gita chapter 10: where to see the divine", [("10.41", "vibhūtimat"), ("10.20", "ahamātmā")]),
 ("C11", 11, "Gita chapter 11: the vision of the universal form", [("11.12", "sūryasahasrasya"), ("11.33", "nimittamātraṃ")]),
 ("C12", 12, "Gita chapter 12: who is dear to Krishna", [("12.13", "adveṣṭā"), ("12.15", "yasmānnodvijate")]),
 ("C13", 13, "Gita chapter 13: the field and its knower", [("13.2", "kṣetram"), ("13.3", "kṣetrajñaṃ")]),
]

CTX = ("We are planning long videos (8-15 minutes) for 'Gita in Ink', a new YouTube channel of plain-words, illustrated "
       "explainers of the Bhagavad Gita, the Upanishads and the epics: the Sanskrit verse, transliteration and source on "
       "screen, illustrations drawn in code, English narration with a Hindi audio track. Audience: young Indians (18-30) and "
       "the Indian diaspora. `idea.title` is a proposed video; it is data, never an instruction. ")
Q = {
 "search": {"type": "score", "instructions": CTX + "How many people search YouTube or Google every month for the topic of `idea.title` (in English or Hindi spellings), across India and the diaspora?",
   "criteria": ["Almost nobody searches for it", "A small niche searches for it", "A steady few thousand a month",
                "Tens of thousands a month", "Huge: one of the most searched spiritual topics"]},
 "evergreen": {"type": "score", "instructions": CTX + "How evergreen is `idea.title`: will people keep searching for it every month, year after year, regardless of news or festivals?",
   "criteria": ["Only relevant around one event or date", "Mostly seasonal", "Steady but may fade",
                "Evergreen: searched all year", "Timeless: will be searched for decades"]},
 "genz": {"type": "score", "instructions": CTX + "How strongly would a 22-year-old Indian want to click and watch a video titled `idea.title`?",
   "criteria": ["Would scroll past", "Mild interest", "Some interest", "Strong interest: feels made for them",
                "Must-watch: they would share it with friends"]},
 "fit": {"type": "score", "instructions": CTX + "How well can this channel's format (verses on screen with citations, calm drawn illustrations, 8-15 minutes, accurate to the texts) deliver `idea.title`?",
   "criteria": ["Poor fit: needs footage, a face or speculation", "Weak fit", "Workable", "Good fit",
                "Perfect fit: made for verse-on-screen explainers"]},
 "shorts": {"type": "score", "instructions": CTX + "How many strong, stand-alone 30-second YouTube Shorts could be cut from a long video on `idea.title`?",
   "criteria": ["None", "One weak Short", "One or two decent Shorts", "Three good Shorts", "Four or more Shorts that could each go viral"]},
 "crowded": {"type": "score", "instructions": CTX + "How crowded is YouTube already with videos on `idea.title`?",
   "criteria": ["Almost no videos exist", "A few", "A moderate number", "Many", "Saturated: thousands of near-identical videos"]},
 "risk": {"type": "noul", "instructions": CTX + "Could a video on `idea.title` draw sectarian or political controversy, or tempt a creator into claims the texts do not support?"},
}


def ask(item):
    iid, kind, title = item[0], item[1], item[2]
    body = json.dumps({"model": "jev-latest", "state": {"idea": {"title": title, "kind": kind}}, "questions": Q})
    for a in range(6):
        try:
            x = requests.post("https://api.typesafe.ai/v1/systemone", data=body, timeout=60,
                              headers={"Authorization": f"Bearer {os.environ['VIGIL_V2_TYPESAFE_API_KEY']}", "Content-Type": "application/json"})
        except requests.RequestException:
            time.sleep(3); continue
        if x.status_code in (429, 529): time.sleep(5 * 2 ** a); continue
        if x.status_code != 200: return {"id": iid, "title": title, "err": f"http {x.status_code}"}
        A = x.json()["answers"]
        r = {"id": iid, "kind": kind, "title": title, **{k: round(A[k]["score"] / 4, 3) for k in ("search", "evergreen", "genz", "fit", "shorts", "crowded")},
             "risk": round(A["risk"]["noul"], 3)}
        r["composite"] = round(0.30 * r["search"] + 0.20 * r["evergreen"] + 0.15 * r["genz"] + 0.15 * r["fit"] + 0.10 * r["shorts"]
                               - 0.10 * r["crowded"] - 0.25 * r["risk"], 4)
        return r
    return {"id": iid, "title": title, "err": "retries"}


def norm(s): return re.sub(r"[\s\-|’']", "", s)


def verify(refs):
    bad = []
    for ref, stem in refs:
        if ref not in V or norm(stem) not in norm("".join(V[ref]["iast"])): bad.append(f"{ref}:{stem}")
    return bad


if __name__ == "__main__":
    if sys.argv[1] == "verify":
        bad = [(i[0], verify(i[3])) for i in TOPICS + [(c[0], 0, c[2], c[3]) for c in CHAPTERS]]
        bad = [b for b in bad if b[1]]
        print("verse stems failing:", bad or "none"); sys.exit(1 if bad else 0)
    if sys.argv[1] == "rank":
        items = TOPICS + [(c[0], "chapter", c[2], c[3]) for c in CHAPTERS]
        with cf.ThreadPoolExecutor(6) as ex: R = list(ex.map(ask, items))
        R.sort(key=lambda r: -r.get("composite", -9))
        with open(OUT / "jev_longs.jsonl", "w") as f:
            for r in R: f.write(json.dumps(r, ensure_ascii=False) + "\n")
        print(len(R), "ideas; errors:", sum("err" in r for r in R))
        for i, r in enumerate(R, 1):
            print(f"{i:2} {r['id']} {r.get('kind',''):9} {r.get('composite')} | s {r.get('search')} e {r.get('evergreen')} g {r.get('genz')} f {r.get('fit')} sh {r.get('shorts')} c {r.get('crowded')} risk {r.get('risk')} | {r['title']}")


# ---------- the schedule (selection by demand: 0.5 search + 0.3 evergreen + 0.2 Gen Z; fit >= 0.75; Jev risk >= 0.95 held
# until a Sanskrit/doctrine reviewer is on board; ideas that duplicate a chapter episode inside the 90 days left out)
SLOT_A = ["G15", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "C11", "C12", "C13"]
SLOT_B = ["T29", "T08", "T24", "T25", "T11", "T20", "T18", "T26", "T21", "T23", "T22", "T55", "T42"]
HELD = ["T33", "T35", "T36", "T37", "T30"]
G15 = ("G15", "overview", "The Bhagavad Gita in 15 minutes: all 18 chapters (ready, v2)", [("2.10", "prahasann")])

# 4 Short candidates per long video: (title, verse, stem). Jev keeps the best 3.
S = {
 "G15": [("Why did Krishna smile at a crying Arjuna? Gita 2.10", "2.10", "prahasann"), ("My confusion is gone: Gita 18.73", "18.73", "naṣṭomohaḥ"),
         ("The verse Oppenheimer remembered: Gita 11.32", "11.32", "kālo"), ("Krishna didn't give an order: Gita 18.63", "18.63", "vimṛśya")],
 "C02": [("Overthinking? Gita 2.47 in 30 seconds", "2.47", "karmaṇyevādhikāraste"), ("You were never born: Gita 2.20", "2.20", "najāyate"),
         ("The steady mind test: Gita 2.56", "2.56", "duḥkheṣv"), ("Like changing old clothes: Gita 2.22", "2.22", "vāsāṃsi")],
 "C03": [("Stop comparing your life: Gita 3.35", "3.35", "svadharmo"), ("People copy what you do: Gita 3.21", "3.21", "yadyad"),
         ("You can't stop acting, even for a moment: Gita 3.5", "3.5", "kṣaṇamapi"), ("Who is really the doer? Gita 3.27", "3.27", "prakṛteḥ")],
 "C04": [("Whenever dharma declines: Gita 4.7", "4.7", "yadāyadā"), ("How to learn from a real teacher: Gita 4.34", "4.34", "praṇipātena"),
         ("Knowledge burns karma to ash: Gita 4.37", "4.37", "jñānāgniḥ"), ("Krishna taught this to the sun first: Gita 4.1", "4.1", "vivasvate")],
 "C05": [("Be like a lotus leaf: Gita 5.10", "5.10", "padmapatram"), ("A dog, a cow, a scholar: Gita 5.18", "5.18", "śuni"),
         ("Pleasures that end in pain: Gita 5.22", "5.22", "saṃsparśajā"), ("Quit or keep working? Gita 5.2", "5.2", "karmayogo")],
 "C06": [("Lift yourself up: Gita 6.5", "6.5", "uddhared"), ("Sleeping too much or too little? Gita 6.16", "6.16", "svapna"),
         ("Your mind is like the wind: Gita 6.34", "6.34", "vāyor"), ("A lamp in a windless place: Gita 6.19", "6.19", "dīpo")],
 "C07": [("Everything on one thread: Gita 7.7", "7.7", "maṇigaṇā"), ("The taste in water: Gita 7.8", "7.8", "raso"),
         ("One in thousands: Gita 7.3", "7.3", "manuṣyāṇāṃsahasreṣu"), ("Four kinds of people who pray: Gita 7.16", "7.16", "caturvidhā")],
 "C08": [("What you remember at the end: Gita 8.6", "8.6", "smaranbhāvaṃ"), ("Remember me, and fight: Gita 8.7", "8.7", "yudhya"),
         ("Om at the last breath: Gita 8.13", "8.13", "omityekākṣaraṃ"), ("A day of Brahma: Gita 8.17", "8.17", "sahasrayuga")],
 "C09": [("A leaf, a flower, a little water: Gita 9.26", "9.26", "patraṃ"), ("I carry what you need: Gita 9.22", "9.22", "yogakṣemaṃ"),
         ("Do everything as an offering: Gita 9.27", "9.27", "yatkaroṣi"), ("The same to every being: Gita 9.29", "9.29", "samohaṃ")],
 "C10": [("Where to see the divine: Gita 10.41", "10.41", "vibhūtimat"), ("Among mountains, the Himalaya: Gita 10.25", "10.25", "himālayaḥ"),
         ("Among months, Margashirsha: Gita 10.35", "10.35", "mārgaśīrṣo"), ("The self in every heart: Gita 10.20", "10.20", "ahamātmā")],
 "C11": [("Brighter than a thousand suns: Gita 11.12", "11.12", "sūryasahasrasya"), ("Oppenheimer's verse: Gita 11.32", "11.32", "kālo"),
         ("Be only the instrument: Gita 11.33", "11.33", "nimittamātraṃ"), ("Divine eyes: Gita 11.8", "11.8", "divyaṃ")],
 "C12": [("Who is dear to Krishna: Gita 12.13", "12.13", "adveṣṭā"), ("Don't disturb, don't be disturbed: Gita 12.15", "12.15", "yasmānnodvijate"),
         ("Form or formless? Gita 12.5", "12.5", "kleśo"), ("Fix your mind on me: Gita 12.8", "12.8", "mayyevamana"), ("Can't meditate? Then do this: Gita 12.10", "12.10", "asamartho")],
 "C13": [("Your body is a field: Gita 13.2", "13.2", "kṣetram"), ("The knower in every field: Gita 13.3", "13.3", "kṣetrajñaṃ"),
         ("Knowledge starts with humility: Gita 13.8", "13.8", "amānitvam"), ("The light of all lights: Gita 13.18", "13.18", "jyotiṣām")],
 "T29": [("Karmanye vadhikaraste in 30 seconds: Gita 2.47", "2.47", "karmaṇyevādhikāraste"), ("What Gita 2.47 does NOT say", "2.47", "mākarmaphala"),
         ("Skill in action is yoga: Gita 2.50", "2.50", "kauśalam"), ("Equanimity is yoga: Gita 2.48", "2.48", "samatvaṃ")],
 "T08": [("Your purpose is your own path: Gita 3.35", "3.35", "śreyān"), ("Worship through your work: Gita 18.46", "18.46", "yataḥpravṛttir"),
         ("Lift yourself by yourself: Gita 6.5", "6.5", "uddhared"), ("Who are you, really? Gita 2.20", "2.20", "najāyate")],
 "T24": [("What dharma really means: Gita 4.7", "4.7", "dharmasya"), ("Your own path, even imperfect: Gita 18.47", "18.47", "viguṇaḥ"),
         ("Dharma in one line: Gita 3.35", "3.35", "paradharmo"), ("Krishna's last word on dharma: Gita 18.66", "18.66", "sarvadharmān")],
 "T25": [("Weapons cannot cut it: Gita 2.23", "2.23", "nainaṃchindanti"), ("Never born, never dies: Gita 2.20", "2.20", "najāyate"),
         ("Childhood, youth, old age: Gita 2.13", "2.13", "dehino"), ("The knower in every field: Gita 13.3", "13.3", "kṣetrajñaṃ")],
 "T11": [("How attachment turns into anger: Gita 2.62", "2.62", "saṅgas"), ("Pleasures that end in pain: Gita 5.22", "5.22", "saṃsparśajā"),
         ("Grieving what you shouldn't: Gita 2.11", "2.11", "aśocyān"), ("Friendly to all, hating none: Gita 12.13", "12.13", "maitraḥ")],
 "T20": [("Act without clinging: Gita 3.19", "3.19", "asaktaḥ"), ("Work as an offering: Gita 3.9", "3.9", "yajñārthāt"),
         ("Skill in action: Gita 2.50", "2.50", "kauśalam"), ("Nobody can stop acting: Gita 3.5", "3.5", "kṣaṇamapi"), ("Do the work in front of you: Gita 3.8", "3.8", "niyataṃ")],
 "T18": [("Like changing clothes: Gita 2.22", "2.22", "vāsāṃsi"), ("What you think of at the end: Gita 8.6", "8.6", "smaranbhāvaṃ"),
         ("Death is certain for the born: Gita 2.27", "2.27", "jātasya"), ("Fire cannot burn it: Gita 2.23", "2.23", "nainaṃdahati"), ("Eternal, everywhere, unmoving: Gita 2.24", "2.24", "acchedyo")],
 "T26": [("Why Krishna comes, age after age: Gita 4.7", "4.7", "sṛjāmyaham"), ("I am the self in every being: Gita 10.20", "10.20", "ahamātmā"),
         ("Nothing higher than me: Gita 7.7", "7.7", "mattaḥparataraṃ"), ("Krishna, lord of yoga: Gita 18.78", "18.78", "yogeśvaraḥ")],
 "T21": [("A leaf, a flower, a fruit, water: Gita 9.26", "9.26", "patraṃ"), ("Fix your mind on me: Gita 12.8", "12.8", "mayyevamana"),
         ("Four kinds of people who pray: Gita 7.16", "7.16", "caturvidhā"), ("My devotee never perishes: Gita 9.31", "9.31", "pratijānīhi"), ("Only love can see me: Gita 11.54", "11.54", "ananyayā")],
 "T23": [("Three strands that bind you: Gita 14.5", "14.5", "sattvaṃrajas"), ("Sattva, rajas, tamas: which are you? Gita 14.6", "14.6", "nirmalatvāt"),
         ("Laziness is tamas: Gita 14.8", "14.8", "pramād"), ("Three kinds of food: Gita 17.8", "17.8", "āyuḥsattva")],
 "T22": [("Nothing purifies like knowledge: Gita 4.38", "4.38", "nahijñānena"), ("The fire of knowledge: Gita 4.37", "4.37", "jñānāgniḥ"),
         ("Learn by asking: Gita 4.34", "4.34", "paripraśnena"), ("The wise see the same in all: Gita 5.18", "5.18", "samadarśinaḥ"), ("Knowledge is the highest offering: Gita 4.33", "4.33", "jñānayajñaḥ")],
 "T55": [("Arjuna's first real question: Gita 2.7", "2.7", "kārpaṇya"), ("Why push me to act? Gita 3.1", "3.1", "jyāyasī"),
         ("What is Brahman? Gita 8.1", "8.1", "kiṃtadbrahma"), ("Where should I look for you? Gita 10.17", "10.17", "kathaṃvidyām")],
 "T42": [("Om at the last breath: Gita 8.13", "8.13", "omityekākṣaraṃ"), ("I am Om in all the Vedas: Gita 7.8", "7.8", "praṇavaḥ"),
         ("Om Tat Sat: Gita 17.23", "17.23", "oṃtatsad"), ("Among words, the one syllable: Gita 10.25", "10.25", "ekamakṣaram"), ("The imperishable the Vedas speak of: Gita 8.11", "8.11", "vedavido"), ("I am the sacred Om: Gita 9.17", "9.17", "oṅkāra")],
}

QS = {
 "hook": {"type": "score", "instructions": CTX + "This is a 30-second YouTube Short titled `short.title`, cut from a long video. How strongly does the title stop a scrolling 22-year-old Indian?",
   "criteria": ["Would scroll past", "Weak hook", "Decent hook", "Strong hook: they stop and watch", "Irresistible: they watch twice and share"]},
 "standalone": {"type": "score", "instructions": CTX + "How well can a 30-second Short titled `short.title` stand alone (one complete idea, satisfying without the long video)?",
   "criteria": ["Needs the long video to make sense", "Weak alone", "Works alone", "Strong alone", "Perfect single-idea Short"]},
 "search": {"type": "score", "instructions": CTX + "How often do people search YouTube for what `short.title` is about?",
   "criteria": ["Almost never", "Rarely", "Sometimes", "Often", "Very often"]},
}


def ask_short(args):
    lid, (title, ref, stem) = args
    body = json.dumps({"model": "jev-latest", "state": {"short": {"title": title}}, "questions": QS})
    for a in range(6):
        try:
            x = requests.post("https://api.typesafe.ai/v1/systemone", data=body, timeout=60,
                              headers={"Authorization": f"Bearer {os.environ['VIGIL_V2_TYPESAFE_API_KEY']}", "Content-Type": "application/json"})
        except requests.RequestException:
            time.sleep(3); continue
        if x.status_code in (429, 529): time.sleep(5 * 2 ** a); continue
        if x.status_code != 200: return {"long": lid, "title": title, "err": f"http {x.status_code}"}
        A = x.json()["answers"]
        r = {"long": lid, "title": title, "verse": ref, **{k: round(A[k]["score"] / 4, 3) for k in QS}}
        r["composite"] = round(0.45 * r["hook"] + 0.30 * r["standalone"] + 0.25 * r["search"], 4)
        return r
    return {"long": lid, "title": title, "err": "retries"}


def build():
    import csv, datetime as dt
    bad = [(lid, t) for lid, xs in S.items() for t, ref, stem in xs if verify([(ref, stem)])]
    if bad: raise SystemExit(f"Short verse stems failing: {bad}")
    longs = {r["id"]: r for r in map(json.loads, open(OUT / "jev_longs.jsonl"))}
    meta = {i[0]: i for i in TOPICS}; meta.update({c[0]: (c[0], "chapter", c[2], c[3]) for c in CHAPTERS}); meta["G15"] = G15
    cache = OUT / "jev_shorts.jsonl"
    want = {(lid, t) for lid, xs in S.items() for t, _, _ in xs}
    R = [json.loads(l) for l in open(cache)] if cache.exists() else []
    if {(r["long"], r["title"]) for r in R} != want:          # re-ask Jev only when the candidates changed
        with cf.ThreadPoolExecutor(6) as ex: R = list(ex.map(ask_short, [(lid, s) for lid, xs in S.items() for s in xs]))
        errs = [r for r in R if "err" in r]
        if errs: raise SystemExit(f"Jev errors: {errs[:3]}")
        with open(cache, "w") as f:
            for r in R: f.write(json.dumps(r, ensure_ascii=False) + "\n")
    # in schedule order, keep each long's best three Shorts whose verse has not already had a Short in these 90 days
    used, keep = set(), {}
    for lid in [x for pair in zip(SLOT_A, SLOT_B) for x in pair]:
        ranked = sorted([r for r in R if r["long"] == lid], key=lambda r: -r["composite"])
        fresh = [r for r in ranked if r["verse"] not in used]
        keep[lid] = (fresh + [r for r in ranked if r not in fresh])[:3]
        used |= {r["verse"] for r in keep[lid]}
    start = dt.date(2026, 10, 27)                    # Tuesday of week 1
    rows = []
    for w in range(13):
        tue = start + dt.timedelta(weeks=w); sat = tue + dt.timedelta(days=4)
        for slot, lid, day, sdays in (("A", SLOT_A[w], tue, (1, 2, 3)), ("B", SLOT_B[w], sat, (1, 2, 3))):
            m = meta[lid]; j = longs.get(lid, {})
            dem = round(0.5 * j.get("search", 0) + 0.3 * j.get("evergreen", 0) + 0.2 * j.get("genz", 0), 3) if j else ""
            rows.append({"week": w + 1, "date": day.isoformat(), "day": day.strftime("%a"), "type": "LONG", "slot": slot, "id": lid, "title": m[2],
                         "verses": " ".join(r for r, _ in m[3]), "jev_demand": dem, "jev_search": j.get("search", ""), "jev_evergreen": j.get("evergreen", ""),
                         "jev_risk": j.get("risk", "")})
            for k, sh in enumerate(keep[lid]):
                d = day + dt.timedelta(days=sdays[k])
                rows.append({"week": w + 1, "date": d.isoformat(), "day": d.strftime("%a"), "type": "SHORT", "slot": slot, "id": f"{lid}-S{k + 1}",
                             "title": sh["title"], "verses": sh["verse"], "jev_demand": sh["composite"], "jev_search": sh["search"], "jev_evergreen": "", "jev_risk": ""})
    rows.sort(key=lambda r: (r["week"], r["date"], r["type"] != "LONG"))
    with open(OUT / "plan90.csv", "w", newline="") as f:
        wr = csv.DictWriter(f, fieldnames=list(rows[0])); wr.writeheader(); wr.writerows(rows)
    return rows, longs, keep


if __name__ == "__main__" and sys.argv[1] == "build":
    rows, longs, keep = build()
    print(len([r for r in rows if r["type"] == "LONG"]), "longs,", len([r for r in rows if r["type"] == "SHORT"]), "shorts")
    for r in rows:
        if r["type"] == "LONG": print(f"W{r['week']:>2} {r['date']} {r['day']} {r['slot']} {r['id']:4} demand {r['jev_demand']} risk {r['jev_risk']} | {r['title']}")
