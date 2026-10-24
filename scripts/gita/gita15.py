#!/usr/bin/env python3
"""The Bhagavad Gita, all 18 chapters, in about 15 minutes (16:9 long video). Script + verse cards + scene notes.

  python3 -I scripts/gita/gita15.py check      # every card's IAST equals the corpus letter for letter; counts words
  python3 -I scripts/gita/gita15.py md         # writes docs/gita/gita15_script.md (review copy for AK)

Text: sources/gita/gita.json (scripts/gita/corpus.py, sanskritdocuments.org edition, 701 verses: chapter 13 opens with
Arjuna's question, so 13.2 here = 13.1 in Gita Press). Translations are ours, word for word; speakers come from the
corpus. House rules: the narrator is a guide, never the deity; Krishna appears only as symbols; quotes are italic,
our interpretation is roman with an OUR NOTE tag ("note": True); every verse shows Devanagari, IAST, English, source.
Spoken numbers are spelled out for the TTS. Structure (AK, 21 Oct): three movements of six chapters + a Gen Z thread.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CORPUS = ROOT / "sources" / "gita" / "gita.json"
VOICE = "English_Diligent_Man"

# ---- verse cards: IAST split into words (compounds hyphenated); en = our translation
CARDS = {
    "2.10": dict(iast=["tam uvāca hṛṣīkeśaḥ prahasann iva bhārata |", "senayor ubhayor madhye viṣīdantam idaṃ vacaḥ ||"],
                 en="Then, O Bharata, between the two armies, Hrishikesha, as if smiling, spoke these words to the one sinking in despair.",
                 gloss="hṛṣīkeśa = Krishna · bhārata: Sanjaya, telling the story to the blind king"),
    "1.47": dict(iast=["evam uktvārjunaḥ saṅkhye rathopastha upāviśat |", "visṛjya sa-śaraṃ cāpaṃ śoka-saṃvigna-mānasaḥ ||"],
                 en="Having spoken thus on the battlefield, Arjuna sank down on the seat of the chariot, casting aside his bow and arrows, his mind overwhelmed by grief."),
    "2.47": dict(iast=["karmaṇy evādhikāras te mā phaleṣu kadācana |", "mā karma-phala-hetur bhūr mā te saṅgo’stv akarmaṇi ||"],
                 en="Your right is to the action alone, never to its fruits. Do not let the fruit of action be your motive, and do not cling to inaction."),
    "3.35": dict(iast=["śreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣṭhitāt |", "sva-dharme nidhanaṃ śreyaḥ para-dharmo bhayāvahaḥ ||"],
                 en="Better your own dharma, even done imperfectly, than another's dharma done well. Better to die in your own dharma; another's dharma is full of fear."),
    "4.7": dict(iast=["yadā yadā hi dharmasya glānir bhavati bhārata |", "abhyutthānam adharmasya tadātmānaṃ sṛjāmy aham ||"],
                en="Whenever dharma declines, O Bharata, and adharma rises, then I bring myself forth."),
    "4.8": dict(iast=["paritrāṇāya sādhūnāṃ vināśāya ca duṣkṛtām |", "dharma-saṃsthāpanārthāya sambhavāmi yuge yuge ||"],
                en="To protect the good, to destroy wrongdoing, and to establish dharma, I come into being, age after age."),
    "5.10": dict(iast=["brahmaṇy ādhāya karmāṇi saṅgaṃ tyaktvā karoti yaḥ |", "lipyate na sa pāpena padma-patram ivāmbhasā ||"],
                 en="One who acts, offering every action to Brahman and giving up attachment, is not stained by sin, as a lotus leaf is not wetted by water."),
    "6.5": dict(iast=["uddhared ātmanātmānaṃ nātmānam avasādayet |", "ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ ||"],
                en="Lift yourself up by yourself; do not let yourself sink. For the self alone is the friend of the self, and the self alone is its enemy."),
    "7.7": dict(iast=["mattaḥ parataraṃ nānyat kiñcid asti dhanañjaya |", "mayi sarvam idaṃ protaṃ sūtre maṇi-gaṇā iva ||"],
                en="There is nothing higher than me, Dhananjaya. All this is strung on me, like gems on a thread."),
    "8.7": dict(iast=["tasmāt sarveṣu kāleṣu mām anusmara yudhya ca |", "mayy arpita-mano-buddhir mām evaiṣyasy asaṃśayaḥ ||"],
                en="Therefore, at all times, remember me, and fight. With your mind and intellect offered to me, you will surely come to me."),
    "9.26": dict(iast=["patraṃ puṣpaṃ phalaṃ toyaṃ yo me bhaktyā prayacchati |", "tad ahaṃ bhakty-upahṛtam aśnāmi prayatātmanaḥ ||"],
                 en="Whoever offers me with devotion a leaf, a flower, a fruit or water, that offering, made with devotion by one whose heart is pure, I accept and partake of."),
    "10.41": dict(iast=["yad yad vibhūtimat sattvaṃ śrīmad ūrjitam eva vā |", "tat tad evāvagaccha tvaṃ mama tejo’ṃśa-sambhavam ||"],
                  en="Whatever being is glorious, beautiful or mighty, know that it springs from a spark of my splendour."),
    "11.12": dict(iast=["divi sūrya-sahasrasya bhaved yugapad utthitā |", "yadi bhāḥ sadṛśī sā syād bhāsas tasya mahātmanaḥ ||"],
                  en="If the light of a thousand suns were to blaze forth in the sky at once, it might resemble the splendour of that great being."),
    "11.32": dict(iast=["kālo’smi loka-kṣaya-kṛt pravṛddho", "lokān samāhartum iha pravṛttaḥ |",
                        "ṛte’pi tvāṃ na bhaviṣyanti sarve", "ye’vasthitāḥ pratyanīkeṣu yodhāḥ ||"],
                  en="I am Time, grown mighty, the destroyer of worlds, come forth to consume the worlds. Even without you, none of the warriors arrayed in the opposing armies will remain."),
    "12.13": dict(iast=["adveṣṭā sarva-bhūtānāṃ maitraḥ karuṇa eva ca |", "nirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī ||"],
                  en="One who hates no being, who is friendly and compassionate, free from 'mine' and from ego, the same in pain and pleasure, forgiving ...",
                  gloss="the sentence completes in 12.14: '... that devotee is dear to me'"),
    "13.2": dict(iast=["idaṃ śarīraṃ kaunteya kṣetram ity abhidhīyate |", "etad yo vetti taṃ prāhuḥ kṣetrajña iti tad-vidaḥ ||"],
                 en="This body, Kaunteya, is called the field. Whoever knows it is called the knower of the field by those who know.",
                 gloss="13.1 in Gita Press numbering"),
    "14.5": dict(iast=["sattvaṃ rajas tama iti guṇāḥ prakṛti-sambhavāḥ |", "nibadhnanti mahābāho dehe dehinam avyayam ||"],
                 en="Sattva, rajas and tamas, the gunas born of nature, bind the imperishable embodied self to the body, mighty-armed one."),
    "15.1": dict(iast=["ūrdhva-mūlam adhaḥ-śākham aśvatthaṃ prāhur avyayam |", "chandāṃsi yasya parṇāni yas taṃ veda sa veda-vit ||"],
                 en="They speak of an imperishable sacred fig, its roots above and its branches below. Its leaves are the Vedic hymns. Whoever knows it knows the Vedas."),
    "16.21": dict(iast=["tri-vidhaṃ narakasyedaṃ dvāraṃ nāśanam ātmanaḥ |", "kāmaḥ krodhas tathā lobhas tasmād etat trayaṃ tyajet ||"],
                  en="Threefold is this gate of hell, the ruin of the self: desire, anger and greed. Therefore, give up these three."),
    "17.3": dict(iast=["sattvānurūpā sarvasya śraddhā bhavati bhārata |", "śraddhā-mayo’yaṃ puruṣo yo yac-chraddhaḥ sa eva saḥ ||"],
                 en="Each person's faith follows their nature, Bharata. A person is made of faith: whatever one's faith is, that one is."),
    "18.63": dict(iast=["iti te jñānam ākhyātaṃ guhyād guhyataraṃ mayā |", "vimṛśyaitad aśeṣeṇa yathecchasi tathā kuru ||"],
                  en="Thus I have told you wisdom more secret than all secrets. Reflect on it fully, then do as you wish."),
    "18.66": dict(iast=["sarva-dharmān parityajya mām ekaṃ śaraṇaṃ vraja |", "ahaṃ tvā sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||"],
                  en="Giving up all dharmas, take refuge in me alone. I will free you from all sins. Do not grieve.",
                  gloss="schools read 'all dharmas' differently; every reading keeps the last words, mā śucaḥ: do not grieve"),
    "18.73": dict(iast=["naṣṭo mohaḥ smṛtir labdhā tvat-prasādān mayācyuta |", "sthito’smi gata-sandehaḥ kariṣye vacanaṃ tava ||"],
                  en="My delusion is gone. By your grace, Achyuta, I have regained my memory. I stand firm, my doubts are gone. I will do as you say."),
    "18.78": dict(iast=["yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanur-dharaḥ |", "tatra śrīr vijayo bhūtir dhruvā nītir matir mama ||"],
                  en="Wherever there is Krishna, the lord of yoga, and wherever there is Arjuna, the archer, there are fortune, victory, prosperity and sure justice. That is my conviction."),
}

# ---- chapter names: Sanskrit from the corpus headings; English is ours
CHAPTERS = {1: "The yoga of Arjuna's despair", 2: "The yoga of understanding", 3: "The yoga of action",
            4: "The yoga of knowledge and renouncing action", 5: "The yoga of renunciation", 6: "The yoga of self-mastery",
            7: "The yoga of knowledge and realisation", 8: "The yoga of the imperishable Brahman",
            9: "The yoga of the royal knowledge and royal secret", 10: "The yoga of divine glories",
            11: "The yoga of the vision of the universal form", 12: "The yoga of devotion",
            13: "The yoga of the field and its knower", 14: "The yoga of the three gunas", 15: "The yoga of the Supreme Person",
            16: "The yoga of the divine and demonic natures", 17: "The yoga of the three kinds of faith",
            18: "The yoga of liberation through renunciation"}

CHAPTER_IAST = {1: "arjuna-viṣāda-yogaḥ", 2: "sāṅkhya-yogaḥ", 3: "karma-yogaḥ", 4: "jñāna-karma-saṃnyāsa-yogaḥ",
                5: "saṃnyāsa-yogaḥ", 6: "ātma-saṃyama-yogaḥ", 7: "jñāna-vijñāna-yogaḥ", 8: "akṣara-brahma-yogaḥ",
                9: "rāja-vidyā-rāja-guhya-yogaḥ", 10: "vibhūti-yogaḥ", 11: "viśvarūpa-darśana-yogaḥ", 12: "bhakti-yogaḥ",
                13: "kṣetra-kṣetrajña-vibhāga-yogaḥ", 14: "guṇa-traya-vibhāga-yogaḥ", 15: "puruṣottama-yogaḥ",
                16: "daivāsura-sampad-vibhāga-yogaḥ", 17: "śraddhā-traya-vibhāga-yogaḥ", 18: "mokṣa-saṃnyāsa-yogaḥ"}
ORDINALS = ["प्रथमो", "द्वितीयो", "तृतीयो", "चतुर्थो", "पञ्चमो", "षष्ठो", "सप्तमो", "अष्टमो", "नवमो", "दशमो",
            "एकादशो", "द्वादशो", "त्रयोदशो", "चतुर्दशो", "पञ्चदशो", "षोडशो", "सप्तदशो", "अष्टादशो"]   # + "ऽध्यायः"

# ---- on-screen Sanskrit labels used by the scenes. check() proves every "show" (or its "stem", for words shown in
# pausa form rather than as sandhi-joined in the verse) occurs in the cited verse of the corpus.
def L(v, show, en="", stem=None, deva=None): return dict(v=v, show=show, en=en, stem=stem, deva=deva)
LABELS = {
    "conch": L("1.15", "pāñcajanya", "Krishna's conch", stem="pāñcajanya", deva="पाञ्चजन्य"),
    "pitrn": L("1.26", "pitṝn", "fathers"), "pitamahan": L("1.26", "pitāmahān", "grandfathers"),
    "acaryan": L("1.26", "ācāryān", "teachers"), "matulan": L("1.26", "mātulān", "uncles"),
    "bhratrn": L("1.26", "bhrātṝn", "brothers"), "putran": L("1.26", "putrān", "sons"),
    "pautran": L("1.26", "pautrān", "grandsons"), "sakhin": L("1.26", "sakhīn", "friends", stem="sakhī"),
    "shishya": L("2.7", "śiṣyas te’haṃ śādhi māṃ tvāṃ prapannam", "I am your disciple; teach me, I have taken refuge in you"),
    "najayate": L("2.20", "na jāyate mriyate vā kadācin", "it is never born, nor does it ever die"),
    "vasamsi": L("2.22", "vāsāṃsi jīrṇāni yathā vihāya", "as one casts off worn-out clothes"),
    "sthita": L("2.55", "sthita-prajña", "one of steady wisdom", stem="sthitaprajña"),
    "yajna": L("3.9", "yajñārthāt karmaṇo’nyatra", "action other than for the sake of offering"),
    "yadyad": L("3.21", "yad yad ācarati śreṣṭhas tat tad evetaro janaḥ", "whatever the best do, others do"),
    "svadharma": L("3.35", "sva-dharma", "your own dharma", stem="svadharm"),
    "paradharma": L("3.35", "para-dharma", "another's dharma", stem="paradharm"),
    "vivasvan": L("4.1", "vivasvān", "the sun"), "manu": L("4.1", "manu", "father of humankind", stem="manu"),
    "ikshvaku": L("4.1", "ikṣvāku", "founder of the solar dynasty", stem="ikṣvāk"),
    "pranipata": L("4.34", "praṇipātena paripraśnena sevayā", "by bowing, by asking, by serving"),
    "jnanagni": L("4.37", "jñānāgniḥ sarva-karmāṇi bhasmasāt kurute", "the fire of knowledge turns all karma to ash"),
    "padma": L("5.10", "padma-patram ivāmbhasā", "as a lotus leaf by water"),
    "samadarshi": L("5.18", "paṇḍitāḥ sama-darśinaḥ", "the wise see the same in all"),
    "yukta": L("6.17", "yuktāhāra-vihārasya", "balanced in food and rest"),
    "dipa": L("6.19", "yathā dīpo nivāta-stho neṅgate", "as a lamp in a windless place does not flicker"),
    "cancala": L("6.34", "cañcalaṃ hi manaḥ", "the mind is restless"),
    "abhyasa": L("6.35", "abhyāsena", "by practice"), "vairagya": L("6.35", "vairāgyeṇa", "by letting go"),
    "bhumi": L("7.4", "bhūmi", "earth", stem="bhūmi"), "apah": L("7.4", "āpaḥ", "water", stem="āpo"),
    "anala": L("7.4", "analaḥ", "fire", stem="nalo"), "vayu": L("7.4", "vāyuḥ", "air"),
    "kham": L("7.4", "kham", "space", stem="khaṃ"), "manah": L("7.4", "manaḥ", "mind", stem="mano"),
    "buddhi": L("7.4", "buddhiḥ", "intellect", stem="buddhir"), "ahankara": L("7.4", "ahaṅkāraḥ", "ego", stem="ahaṅkāra"),
    "para": L("7.5", "prakṛtiṃ viddhi me parām", "know my higher nature"),
    "raso": L("7.8", "raso’ham apsu", "I am the taste in water"), "prabha": L("7.8", "prabhāsmi śaśi-sūryayoḥ", "the light of moon and sun"),
    "pranava": L("7.8", "praṇavaḥ sarva-vedeṣu", "Om in all the Vedas"),
    "antakale": L("8.5", "anta-kāle", "at the final moment"),
    "anusmara": L("8.7", "mām anusmara", "remember me"), "yudhya": L("8.7", "yudhya ca", "and fight"),
    "yogakshema": L("9.22", "yoga-kṣemaṃ vahāmy aham", "I carry what they need and protect what they have", deva="योगक्षेमं वहाम्यहम्"),
    "patram": L("9.26", "patram", "a leaf", stem="patra"), "pushpam": L("9.26", "puṣpam", "a flower", stem="puṣpa"),
    "phalam": L("9.26", "phalam", "a fruit", stem="phala"), "toyam": L("9.26", "toyam", "water", stem="toya"),
    "yatkaroshi": L("9.27", "yat karoṣi yad aśnāsi yaj juhoṣi dadāsi yat", "whatever you do, eat, offer, give"),
    "himalaya": L("10.25", "himālayaḥ", "the Himalaya, among mountains"), "ashvattha": L("10.26", "aśvatthaḥ", "the sacred fig, among trees"),
    "jahnavi": L("10.31", "jāhnavī", "among rivers: the Ganga"), "margashirsha": L("10.35", "mārgaśīrṣa", "Margashirsha, among months", stem="mārgaśīrṣ"),
    "kusumakara": L("10.35", "kusumākaraḥ", "among seasons: spring"),
    "divyam": L("11.8", "divyaṃ dadāmi te cakṣuḥ", "I give you divine sight"),
    "nantam": L("11.16", "nāntaṃ na madhyaṃ na punas tavādiṃ", "no end, no middle, no beginning"),
    "nadinam": L("11.28", "yathā nadīnāṃ bahavo’mbu-vegāḥ samudram", "as the many rivers rush to the sea"),
    "vasudeva": L("11.50", "vāsudevaḥ", "Vasudeva", stem="vāsudev"), "saumya": L("11.50", "saumya-vapuḥ", "the gentle form", stem="saumyavapu"),
    "avyakta": L("12.1", "akṣaram avyaktaṃ", "the imperishable, unmanifest"),
    "kshetrajnam": L("13.3", "kṣetrajñaṃ cāpi māṃ viddhi sarva-kṣetreṣu", "know me as the knower in every field"),
    "kshetra": L("13.2", "kṣetram", "the field"), "kshetrajna": L("13.2", "kṣetrajña", "the knower of the field"),
    "sattva": L("14.5", "sattva", "goodness, clarity", stem="sattva"), "rajas": L("14.5", "rajas", "passion"), "tamas": L("14.5", "tamas", "inertia", stem="tama"),
    "atitya": L("14.20", "guṇān etān atītya trīn", "rising above these three gunas"),
    "urdhva": L("15.1", "ūrdhva-mūlam adhaḥ-śākham", "roots above, branches below"),
    "chandamsi": L("15.1", "chandāṃsi yasya parṇāni", "its leaves are the hymns"),
    "asanga": L("15.3", "asaṅga-śastreṇa dṛḍhena chittvā", "cutting it with the strong axe of detachment"),
    "hrdi": L("15.15", "sarvasya cāhaṃ hṛdi sanniviṣṭo", "I am seated in the hearts of all"),
    "abhayam": L("16.1", "abhayam", "fearlessness", stem="abhaya"), "satyam": L("16.2", "satyam", "truth"), "daya": L("16.2", "dayā bhūteṣu", "compassion for beings", stem="dayābhūteṣ"),
    "darpa": L("16.4", "darpaḥ", "arrogance", stem="darp"), "krodha16": L("16.4", "krodhaḥ", "anger"), "parushya": L("16.4", "pāruṣyam", "harshness"),
    "kama": L("16.21", "kāmaḥ", "desire"), "krodha": L("16.21", "krodhaḥ", "anger", stem="krodh"), "lobha": L("16.21", "lobhaḥ", "greed", stem="lobh"),
    "ahara": L("17.7", "āhāras tv api sarvasya tri-vidho", "food too is of three kinds"),
    "omtatsat": L("17.23", "oṃ tat sat", "", stem="oṃtatsad", deva="ॐ तत् सत्"),
    "tyaga": L("18.2", "sarva-karma-phala-tyāgaṃ", "giving up the fruit of all action"),
    "hrddeshe": L("18.61", "īśvaraḥ sarva-bhūtānāṃ hṛd-deśe’rjuna tiṣṭhati", "the Lord dwells in the heart of all beings"),
    "yathecchasi": L("18.63", "yathecchasi tathā kuru", "do as you wish"),
    "kaccid": L("18.72", "kaccid ajñāna-sammohaḥ pranaṣṭas te", "is your confusion gone?"),
}

# ---- the script. Each beat: key, section, scene (what is drawn), cues [(say, opts)], refs (small citation chips).
# A cue with card="x.y" runs the verse ritual: reference spoken, bell, Devanagari writes itself, IAST, then the English read.
B = []
def beat(key, section, scene, *cues, refs=()):
    B.append(dict(key=key, section=section, scene=scene, cues=list(cues), refs=list(refs)))
def c(say, **o): return dict(say=say, **o)

# COLD OPEN
beat("open1", "Cold open", "Dawn over Kurukshetra: two armies in silhouette, banners, dust; a conch sounds, labelled 'Pāñcajanya · Krishna's conch · 1.15'. Slow push-in on one chariot.",
     c("Two armies face each other at dawn, on the field of Kurukshetra."),
     c("Between them, in one chariot, stands Arjuna, the finest archer of his age. And his hands begin to shake."), refs=["1.15"])
beat("open2", "Cold open", "Close: his bow (the Gandiva) slips and falls to the chariot floor; the three symptoms appear as lines; 'I will not fight' as an italic quote.",
     c("His mouth goes dry. His bow slips from his hand. He sits down in the chariot, and says: I will not fight."), refs=["1.29", "1.30", "2.9"])
beat("open3", "Cold open", "The reins and a peacock feather: Krishna as symbol. Warm light blooms on 'smiles'. Verse card 2.10 on a palm leaf.",
     c("The one holding the reins is Shri Krishna. And Krishna smiles."),
     c("Chapter two, verse ten.", card="2.10"))
beat("meera1", "Gen Z thread", "Modern: a dark room, 1:47 on a phone clock, two emails glowing. Same ink-and-paper style, cool blue light. Tag: 'Meera is an illustration, not a real person.'",
     c("Thousands of years later, at one forty-seven in the morning, Meera, twenty-one, stares at two emails. One is the safe job her family is already celebrating. The other is the path she actually wants. She has to reply by morning. And her hands are shaking too."))
beat("title", "Title", "Title card: 'The Bhagavad Gita' in serif, 'श्रीमद्भगवद्गीता' above; the Mahabharata's 18 books as a shelf with the 6th (Bhishma Parva) pulled out.",
     c("What Krishna told Arjuna that morning is the Bhagavad Gita: seven hundred verses, eighteen chapters, inside the sixth book of the Mahabharata. Here is all of it, in fifteen minutes."))
beat("map", "Title", "A japa mala of 18 beads appears at the foot of the frame (it lights one bead per chapter for the rest of the video), grouped 6 · 6 · 6: ACTION · DEVOTION · KNOWLEDGE.",
     c("Many teachers read the eighteen chapters as three movements of six: action, devotion, and knowledge."))

# MOVEMENT I: ACTION (1-6)
beat("ch1", "I · Action", "Chapter title card. Arjuna's view: teachers, grandfather, cousins drawn as banners and silhouettes on the other side. Bead 1 lights.",
     c("Chapter one. The yoga of Arjuna's despair."),
     c("Arjuna looks across the field and sees teachers, cousins, his own grandfather. And he breaks."),
     c("Even this collapse is called a yoga, because it is where the journey begins.", note=True),
     c("Verse forty-seven.", card="1.47"), refs=["1.26"])
beat("ch2", "I · Action", "Arjuna's words 2.7 as a quote; then a figure discarding a worn shawl for a new one (2.22); then an arrow leaving a bowstring with the target out of frame (2.47).",
     c("Chapter two. The yoga of understanding."),
     c("It begins with a surrender. Arjuna says: I am your disciple. Teach me."),
     c("Krishna's first lesson is about who Arjuna really is. The self is never born and never dies. As we throw off worn-out clothes and put on new ones, the self moves from body to body."),
     c("Then comes the most famous line in the Gita. Verse forty-seven.", card="2.47"),
     c("It does not say: don't care about results. It says: don't let results run you.", note=True),
     c("And the chapter ends with a portrait of a steady mind: not shaken by sorrow, not hungry for pleasure, free of craving, fear and anger."),
     refs=["2.7", "2.20", "2.22", "2.56", "2.55-72"])
beat("ch3", "I · Action", "A small sacred fire (yajna) for action as offering; then two lanes: a polished lane of other people's highlight cards and a rough lane lit from within.",
     c("Chapter three. The yoga of action."),
     c("Arjuna asks: if knowing is better than doing, why push me into this terrible act? Krishna answers: no one can stay without acting, even for a moment. So act, but act as an offering."),
     c("And remember that people are watching. Whatever the best person does, Krishna says, others copy. Whatever standard they set, the world follows."),
     c("And here is a verse for everyone who scrolls through other people's lives. Verse thirty-five.", card="3.35"),
     refs=["3.1", "3.5", "3.9", "3.21"])
beat("ch4", "I · Action", "A flame passed down a chain: the sun (Vivasvan) to Manu to Ikshvaku (4.1); then the flame relit across ages; fire turning wood to ash (4.37).",
     c("Chapter four. The yoga of knowledge."),
     c("Krishna reveals who he is. He taught this yoga long ago to Vivasvan, the sun, who taught it to Manu, who taught it to Ikshvaku. And he makes a promise. Verses seven and eight.", card="4.7+4.8"),
     c("How do you find this knowledge? Bow down, ask questions, and serve, Krishna says, and those who have seen the truth will teach you. And as a blazing fire turns wood to ash, the fire of knowledge burns all karma to ash."),
     refs=["4.1", "4.34", "4.37"])
beat("ch5", "I · Action", "A lotus leaf on dark water; a drop rolls across it and off, leaving the leaf dry.",
     c("Chapter five. The yoga of renunciation."),
     c("Arjuna asks again: which is better, giving up action, or acting well? Both lead to freedom, Krishna says, but acting without attachment is better. Picture a lotus leaf. Verse ten.", card="5.10"),
     c("And the wise, he says, see the same self in a learned scholar, a cow, an elephant, a dog, and the person the world pushes away."),
     refs=["5.1", "5.2", "5.18"])
beat("ch6", "I · Action", "A diya in a windless room; wind lines arrive and the flame flickers, then steadies and stands still (6.19).",
     c("Chapter six. The yoga of self-mastery."),
     c("It opens with a line made for two in the morning. Verse five.", card="6.5"),
     c("Meditation here is not escape. Yoga is not for one who eats too much or too little, Krishna says, or who sleeps too much or too little. It is balance."),
     c("Arjuna is honest. The mind is restless, he says, as hard to hold as the wind. Krishna does not deny it. By practice, and by letting go, it can be held. And a mind that is held is like a lamp in a windless place. It does not flicker."),
     refs=["6.16", "6.17", "6.34", "6.35", "6.19"])
beat("meera2", "Gen Z thread", "Meera turns the phone face down. Her desk lamp stops flickering.",
     c("Meera turns her phone face down. The fear does not leave. But for the first time tonight, she is not fighting her own mind.", note=True))

# MOVEMENT II: DEVOTION (7-12)
beat("ch7", "II · Devotion", "Movement card 'II · DEVOTION'. Eight elements as icons (earth, water, fire, air, space, mind, intellect, ego) strung like gems on one thread (7.7).",
     c("The second movement turns to Krishna himself."),
     c("Chapter seven. The yoga of knowledge and realisation."),
     c("Earth, water, fire, air, space, mind, intellect and ego: this, Krishna says, is my lower nature. Life itself is my higher nature. Verse seven.", card="7.7"),
     c("I am the taste in water, he says, the light of the sun and the moon, the sacred syllable Om in all the Vedas."),
     refs=["7.4", "7.5", "7.8"])
beat("ch8", "II · Devotion", "A heartbeat line slowly becomes a flute melody line; a bow and a peacock feather side by side.",
     c("Chapter eight. The yoga of the imperishable."),
     c("Whatever a person remembers at the very end, Krishna says, that is what they reach. So he gives Arjuna the simplest practice in the Gita. Verse seven.", card="8.7"),
     c("Not: leave the world, then remember. Remember, and do the work in front of you.", note=True),
     refs=["8.5", "8.6"])
beat("ch9", "II · Devotion", "A banana leaf; a tulsi leaf, a flower, a fruit and a small kalash of water are placed on it one by one. Chip: 'योगक्षेमं वहाम्यहम् · 9.22 · the motto on LIC's logo'.",
     c("Chapter nine. The yoga of the royal secret."),
     c("Those who worship me with nothing else in their minds, Krishna says, I carry what they need and protect what they have. That line is the motto on the logo of LIC."),
     c("And the royal secret turns out to be gentle. Verse twenty-six.", card="9.26"),
     c("Whatever you do, whatever you eat, whatever you give, he says, do it as an offering to me."),
     refs=["9.22", "9.27"])
beat("ch10", "II · Devotion", "Icons light up one by one like stars: the Himalaya, a peepal tree, the Ganga, spring blossom, and a calendar leaf for Margashirsha; then sparks fly from all of them.",
     c("Chapter ten. The yoga of divine glories."),
     c("Arjuna asks: where should I look for you? Among mountains, Krishna says, I am the Himalaya. Among trees, the sacred fig. Among rivers, the Ganga. Among months, Margashirsha, the month of Gita Jayanti. Among seasons, spring. Verse forty-one.", card="10.41"),
     refs=["10.17", "10.25", "10.26", "10.31", "10.35"])
beat("ch11", "II · Devotion", "The summit. A tiny Arjuna silhouette before an expanding sacred-geometry mandala of light; rivers pouring into a sea (11.28); then everything folds back into the feather and flute (11.50).",
     c("Chapter eleven. The vision of the universal form."),
     c("This is the summit."),
     c("Arjuna asks to see Krishna's cosmic form. You cannot see me with these eyes, Krishna says, so I give you divine sight. And Sanjaya, who is telling the story, tries to describe what Arjuna saw. Verse twelve.", card="11.12"),
     c("Arjuna sees every world inside one form, with no beginning, no middle and no end. Warriors rush into it the way rivers rush into the sea. Then Krishna speaks a verse that the physicist J. Robert Oppenheimer said came to his mind at the first atomic test. Verse thirty-two.", card="11.32"),
     c("Terrified, Arjuna begs to see the familiar form again. And Vasudeva, gently, becomes himself once more."),
     refs=["11.8", "11.16", "11.28", "11.50"])
beat("ch12", "II · Devotion", "Kinetic type: the qualities of the devotee appear one by one, each on a lit bead.",
     c("Chapter twelve. The yoga of devotion."),
     c("One of the two shortest chapters, just twenty verses."),
     c("Who is the better devotee, Arjuna asks: the one who loves a form, or the one who seeks the formless? For people in bodies, Krishna says, the path of love is easier. Then he describes who is dear to him. Verse thirteen.", card="12.13"),
     refs=["12.1", "12.5", "12.14"])
beat("meera3", "Gen Z thread", "Meera's memory: her grandmother's prayer shelf. A leaf, a flower, a small cup of water.",
     c("Meera remembers her grandmother's prayer shelf. A leaf, a flower, a little water. Nothing expensive. Just love, every single morning.", note=True))

# MOVEMENT III: KNOWLEDGE (13-18)
beat("ch13", "III · Knowledge", "Movement card 'III · KNOWLEDGE'. A field (kshetra) drawn as farmland seen from above; a small light above it that sees the whole field.",
     c("The third movement asks: what is real?"),
     c("Chapter thirteen. The field and its knower."),
     c("Verse two.", card="13.2"),
     c("And Krishna says: know me as the knower in every field. You are not the field. You are the one who sees it.", note=True),
     refs=["13.3"])
beat("ch14", "III · Knowledge", "A rope made of three strands twisting together: luminous white (sattva), red (rajas), dark (tamas), the traditional colours; then a figure stepping out of the knot (14.20).",
     c("Chapter fourteen. The three gunas."),
     c("Verse five.", card="14.5"),
     c("Guna also means a strand of rope. Sattva binds with attachment to happiness and knowledge. Rajas with craving and restless action. Tamas with carelessness, laziness and sleep. Whoever rises above all three, Krishna says, is free."),
     refs=["14.6", "14.7", "14.8", "14.20"])
beat("ch15", "III · Knowledge", "An upside-down peepal tree, roots in light above, branches below, its leaves drawn as lines of hymn text; an axe of detachment; then a small lamp in a heart.",
     c("Chapter fifteen. The Supreme Person."),
     c("It begins with an upside-down tree. Verse one.", card="15.1"),
     c("Cut it, Krishna says, with the strong axe of detachment, and seek the source. And then: I am seated in the hearts of all."),
     refs=["15.3", "15.4", "15.15"])
beat("ch16", "III · Knowledge", "Two columns of qualities (divine: fearlessness, truth, compassion; demonic: arrogance, anger, harshness); then three dark gateways labelled desire, anger, greed, like app icons with notification dots.",
     c("Chapter sixteen. The divine and the demonic."),
     c("Fearlessness, truth and compassion on one side. Arrogance, anger and harshness on the other."),
     c("Then a warning that reads like a guide to every feed. Verse twenty-one.", card="16.21"),
     refs=["16.1", "16.2", "16.4"])
beat("ch17", "III · Knowledge", "Meera's reflection in a dark phone screen; three kinds of food, worship and giving in three colours; ॐ तत् सत् written last.",
     c("Chapter seventeen. The three kinds of faith."),
     c("Food, worship, discipline and giving: each comes in three kinds, like the gunas. And at the centre, verse three.", card="17.3"),
     c("The chapter ends on three words that, by tradition, close every chapter of the Gita: Om, Tat, Sat."),
     refs=["17.7", "17.23"])
beat("ch18", "III · Knowledge", "All 18 beads lit. An open path splitting two ways; Krishna's reins held loosely, not pulled (18.63); then light gathers around the chariot (18.66).",
     c("Chapter eighteen. The yoga of liberation."),
     c("The longest chapter, seventy-eight verses, and it gathers everything."),
     c("Renunciation, Krishna says, is not giving up action. It is giving up attachment to its fruit. He repeats his advice from chapter three: better your own path, done imperfectly. And he says the Lord lives in the heart of every being."),
     c("And then, after seventeen chapters of teaching, he does something remarkable. He does not give Arjuna an order. Verse sixty-three.", card="18.63"),
     c("And then his last and most intimate word. Verse sixty-six.", card="18.66"),
     refs=["18.2", "18.11", "18.47", "18.61"])

# CLOSE
beat("close1", "Close", "Krishna asks 18.72 (quote); Arjuna's bow rises from the chariot floor, the reverse of the opening fall; verse card 18.73.",
     c("Have you heard this with a focused mind, Krishna asks? Is your confusion gone? And Arjuna, who sat down with his bow at his feet, stands firm. Verse seventy-three.", card="18.73"),
     refs=["18.72"])
beat("meera4", "Gen Z thread", "Six a.m. light through Meera's window. She types and sends. We never see which email.",
     c("At six in the morning, Meera types her reply. We won't tell you which one she chose. That was never the point. She chose with a steady mind.", note=True))
beat("end", "Close", "Final card 18.78 (Sanjaya). Then 'ॐ तत् सत्' and the 18 lit beads closing into a full mala. End screen: 'Next · Chapter 2'.",
     c("And Sanjaya, who has told the whole story to a blind king, ends it like this. Verse seventy-eight.", card="18.78"),
     c("That was the Bhagavad Gita. All eighteen chapters. Next, we go chapter by chapter, starting with the one that answers overthinking."))


def norm(s):  # compare letters only: drop spaces, hyphens, dandas and verse numbers
    s = re.sub(r"\|\|?\s*\d+-\d+\|\|", "", s)
    return re.sub(r"[\s\-|]", "", s)


def check():
    d = json.load(open(CORPUS))["verses"]; bad = 0
    for k, v in CARDS.items():
        src = norm("".join(d[k]["iast"])); ours = norm("".join(v["iast"]))
        if src != ours:
            bad += 1; print("MISMATCH", k, "\n  src ", src, "\n  ours", ours)
    used = {x for b in B for q in b["cues"] if q.get("card") for x in q["card"].split("+")}
    missing = used - set(CARDS); extra = set(CARDS) - used
    refs = {r for b in B for r in b["refs"]}
    for r in refs:
        for part in r.split(","):
            ch, v = part.split(".")
            lo = int(v.split("-")[0]); hi = int(v.split("-")[-1])
            for n in (lo, hi):
                if f"{ch}.{n}" not in d: bad += 1; print("REF NOT IN CORPUS", r)
    for k, lb in LABELS.items():
        src = norm("".join(d[lb["v"]]["iast"])); want = norm(lb["stem"] or lb["show"])
        if want not in src: bad += 1; print("LABEL NOT IN VERSE", k, lb["v"], want)
        if lb["deva"] and lb["deva"].replace(" ", "") not in "".join(d[lb["v"]]["deva"]).replace(" ", "") and k != "omtatsat" and k != "conch":
            bad += 1; print("DEVA LABEL NOT IN VERSE", k)
    for n, v in CHAPTER_IAST.items():
        if norm(v) != norm(json.load(open(CORPUS))["chapter_names"][str(n)]["iast"]): bad += 1; print("CHAPTER NAME MISMATCH", n, v)
    words = sum(len(q["say"].split()) for b in B for q in b["cues"]) + sum(len(CARDS[x]["en"].split()) for x in used)
    print(f"{len(CARDS)} cards checked, {bad} problems; cards used {len(used)}, missing {sorted(missing)}, unused {sorted(extra)}")
    print(f"{len(B)} beats; ~{words} spoken words (narration + translations read aloud)")
    return bad == 0 and not missing


def md():
    d = json.load(open(CORPUS)); V = d["verses"]; names = d["chapter_names"]
    out = ["# The Bhagavad Gita in 15 minutes: script for review", "",
           "Draft 1, 21 Oct 2026. Narration: MiniMax English_Diligent_Man (Indian male). Krishna appears only as symbols.",
           "Source text: sanskritdocuments.org (701-verse edition; 13.2 here = 13.1 in Gita Press). Translations are ours.",
           "Lines marked **OUR NOTE** are our interpretation and appear in the roman 'OUR NOTE' style on screen; everything else is the guide's narration or a quote.",
           "Each verse card: the reference is spoken, a bell, then a short silence while the Devanagari writes itself, then the IAST, then the English is read.", ""]
    sec = None
    for b in B:
        if b["section"] != sec:
            sec = b["section"]; out += [f"## {sec}", ""]
        ch = re.match(r"ch(\d+)$", b["key"])
        if ch:
            n = int(ch.group(1)); out += [f"### Chapter {n} · {names[str(n)]['deva']} · {names[str(n)]['iast']} · {CHAPTERS[n]}", ""]
        else:
            out += [f"### {b['key']}", ""]
        out += [f"*On screen:* {b['scene']}", ""]
        for q in b["cues"]:
            out.append(("> **OUR NOTE** " if q.get("note") else "> ") + q["say"])
            if q.get("card"):
                for k in q["card"].split("+"):
                    v = V[k]; cd = CARDS[k]
                    out += [">", f"> **Verse card {k}** ({v['speaker']})", ">"] + [f"> {ln}  " for ln in v["deva"]] + [">"] + \
                           [f"> *{ln}*  " for ln in cd["iast"]] + [">", f"> “{cd['en']}” *(read aloud)*"]
                    if cd.get("gloss"): out.append(f"> <small>{cd['gloss']}</small>")
            out.append("")
        if b["refs"]:
            out += ["*Citation chips:* " + ", ".join(b["refs"]), ""]
    p = ROOT / "docs" / "gita" / "gita15_script.md"; p.parent.mkdir(parents=True, exist_ok=True); p.write_text("\n".join(out))
    print("wrote", p)


if __name__ == "__main__":
    {"check": check, "md": md}[sys.argv[1]]()
