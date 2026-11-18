"""ON01 script v1 (13 Nov 2026): narration, claim IDs and shot notes. Writes indica_atlas_v1.json and .md."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
B = []
def b(act, shot, say, c=()):
    B.append({"key": f"o{len(B)+1:03d}", "act": act, "shot": shot, "say": say, "claims": list(c), **({} if c else {"no_fact": True})})

# ---- cold open ----
b("hook", "story onionfield: the farmer pulls an onion, holds it up to the light (ILLUSTRATIVE)", "April, in the fields near Nashik, in western India. A farmer pulls up an onion.", ["A-C19"])
b("hook", "o-trade: arrows run out of India, then the gate slams down", "A few months earlier, in December twenty twenty-three, India had banned the export of this vegetable.", ["B-C02"])
b("hook", "o-onion hero", "Not rice. Not wheat. Onions. And the government said the ban was to protect consumers at home.", ["B-C10"])
b("hook", "o-seesaw glut, then swing", "But its own price fund says that at harvest time, onion prices normally fall steeply. And as the stored stocks run down, they climb again.", ["B-C22"])
b("hook", "story split: the farmer beside a heap / a city mother and child at an empty basket (ILLUSTRATIVE)", "So the same bulb can be too cheap for the family who grows it, and too dear for the family who buys it. In the same year.", ["B-C22"])
b("hook", "o-onion slice: the knife comes down", "How can both be true?")
b("hook", "q-chain: three myth icons (map, market, ballot)", "We read the agriculture ministry's crop tables, the government's trade notices, and the Election Commission's results. And three things you may have heard about the onion need a closer look.", ["A-C02", "B-C02", "C-C01"])
b("hook", "q-title: The Onion Paradox", "The answer is not inside the onion. It is in the map behind it.")

# ---- 1 the map ----
b("map", "o-plates: onion plate", "First, the onion itself. An old Ayurvedic text, the Charaka Samhita, already describes it, and calls it good with food.", ["C-C21"])
b("map", "o-plates: Jain plate", "Yet some kitchens leave it out on purpose. A Jain source explains that pulling up a root kills the whole plant, and many tiny lives with it. So many Jains avoid onion, some more strictly than others.", ["C-C18"])
b("map", "o-plates: temple plate", "And in some Hindu traditions, onion and garlic count as over-stimulating foods, and are left out.", ["C-C15", "C-C16"])
b("map", "o-plates: all three", "Essential in one kitchen, avoided in another. But none of that explains why its price can shake a country. For that, you need a map.")
b("map", "o-india states: map rises, fill", "In twenty twenty-four to twenty-five, India grew nearly thirty-one million tonnes of onions.", ["A-C02"])
b("map", "q-globe: India lit", "By the count of the UN's food agency, that was more than any other country grew in twenty twenty-three.", ["A-C32"])
b("map", "o-india states", "So you might think a crop that big grows all over the country. Look where it grows.")
b("map", "o-india: Maharashtra towers", "One state, Maharashtra, grew forty-four percent of it.", ["A-C04"])
b("map", "o-india metric area", "And almost half of all the land under onions in India is in that one state.", ["A-C04"])
b("map", "o-india lit MH MP KA", "Add Madhya Pradesh and Karnataka, and three states grow two thirds of India's onions.", ["A-C16"])
b("map", "q-versus yields", "Maharashtra does not lead because its fields grow the most per hectare. Farms in Madhya Pradesh and Gujarat get far more from each one. Maharashtra leads because it plants so much.", ["A-C17"])
b("map", "q-chain myth 1 crossed", "So the first thing you may have heard is wrong. India eats onions everywhere. It does not grow them everywhere.", ["A-C04", "A-C16"])
b("map", "o-india zoom Nashik", "And at the heart of that one state is Nashik district.", ["A-C28"])
b("map", "story onionfield: the farmer looks at the sky (worried)", "But to see why prices swing, you have to ask not only where onions grow. You have to ask when.")

# ---- 2 three harvests ----
b("harvest", "o-calendar: ring turns", "India grows onions in three seasons.", ["A-C19"])
b("harvest", "o-calendar kharif + late arcs", "One crop is planted with the monsoon and comes out from October to December. Another comes out from January to March.", ["A-C19"])
b("harvest", "o-calendar rabi arc glows", "And then the big one. The spring crop, called rabi, harvested from the end of March to May.", ["A-C19"])
b("harvest", "o-calendar rabi slice + badge", "ICAR, the government's farm research council, says the rabi crop is about sixty percent of India's onions.", ["A-C21"])
b("harvest", "o-calendar store band sweeps", "So most of the year's onions arrive in a few weeks of spring. And they have to last. ICAR says the stored rabi crop feeds the country until October or November.", ["A-C21", "A-C22"])
b("harvest", "o-store fill (cutaway)", "They are kept in ventilated stores like this, open to the air.", ["A-C24"])
b("harvest", "o-store heat, then rain", "And a stored onion is still alive. It breathes, and it loses water. In heat and damp, it can rot, or start to sprout.", ["A-C26"])
b("harvest", "o-store gauge falls", "ICAR says thirty to forty percent of the crop is lost in storage.", ["A-C23"])
b("harvest", "q-stat 55%", "In its own trial, after a hundred and twenty days, ordinary ventilated storage had lost about fifty-five percent.", ["A-C24"])
b("harvest", "o-onion age: cold then sprout", "Cold storage cuts the loss. But the same research page says the onions sprout soon after they come out of the cold.", ["A-C25"])
b("harvest", "o-calendar gap pulses red, rain", "So here is the dangerous gap. By autumn, the spring stock is running low. And the next crop is still in the ground, through the monsoon.", ["A-C22"])
b("harvest", "story onionfield: rain", "If that crop is late, there is little left to bridge the gap. In December twenty twenty-three, a delayed kharif crop was one of the reasons the government gave for its export ban.", ["B-C10"])

# ---- 3 the journey ----
b("journey", "story mandi: trolleys, auction (ILLUSTRATIVE)", "From the stores, the onions go to auction. Lasalgaon, in Nashik district, is one of the country's key onion markets, the government says.", ["A-C28"])
b("journey", "story mandi: the farmer, a trader", "You may have heard it called Asia's biggest onion market. We did not find that title in the government records we read, or on the market's own home page.", ["L-C01"])
b("journey", "q-chain myth 2 tilde", "So the second thing you may have heard has no source we could find.", ["L-C01"])
b("journey", "o-india routes", "From here, onions travel. In a straight line, Lasalgaon to Delhi is about nine hundred and ninety kilometres. To Kolkata, nearly fifteen hundred. To Guwahati, about nineteen hundred.", ["A-C31"])
b("journey", "o-india rail + train", "So the government has started putting onions on trains. It calls them the Kanda Express.", ["B-C18"])
b("journey", "o-india rail + badges", "In twenty twenty-four to twenty-five, fourteen trainloads carried nearly twelve thousand tonnes. The next year, eighty-six trainloads carried around eighty-eight thousand tonnes, to sixteen cities.", ["B-C18"])
b("journey", "story vegshop: mother buys onions (ILLUSTRATIVE)", "These are onions the government bought and stored itself. In August twenty twenty-six it began selling them at thirty-five rupees a kilo. The average retail price across India that week was about thirty-eight.", ["B-C19", "B-C25"])
b("journey", "o-india routes all", "The state is moving onions across the map, to flatten the price.", ["B-C18", "B-C19"])

# ---- 4 the border ----
b("border", "o-trade arrows open", "Some onions leave India altogether. In twenty twenty-five to twenty-six, India exported about one and a half million tonnes.", ["B-C12"])
b("border", "o-trade dests light", "To Malaysia, the UAE, Sri Lanka, Nepal, Bangladesh, and more.", ["B-C13"])
b("border", "q-stat 1 in 20", "That is only about one onion in twenty that India grows. But for a government watching prices at home, it is a lever.", ["L-C02"])
b("border", "q-dates point 1", "In October twenty twenty-three, it set a minimum export price of eight hundred dollars a tonne.", ["B-C01"])
b("border", "o-trade ban", "In December, it banned exports outright.", ["B-C02"])
b("border", "o-trade ban, a thin arrow to Dhaka", "Even then, some onions went out, to governments that asked. Bangladesh was allowed fifty thousand tonnes.", ["B-C03", "B-C05"])
b("border", "o-trade mep", "In May twenty twenty-four, exports reopened, with a minimum price of five hundred and fifty dollars a tonne, and a forty percent export duty.", ["B-C06", "B-C08"])
b("border", "o-trade open", "In September, the minimum price went, and the duty was cut to twenty percent. From April twenty twenty-five, the duty went too.", ["B-C07", "B-C08"])
b("border", "q-dates full", "The government's list of trade notices, which we checked up to November twenty twenty-six, shows no new onion restriction since.", ["B-C16"])
b("border", "o-trade Bangladesh arrow thick then thin", "And look at Bangladesh. In twenty twenty-three to twenty-four, a year of limits, it was still India's biggest buyer, at over seven hundred thousand tonnes. In twenty twenty-five to twenty-six, under ninety thousand. The trade figures do not say why.", ["B-C14"])
b("border", "story split: farmer / city family", "For a farmer near Nashik, Dhaka or Dubai is just another market. For a government watching prices in Delhi, the same shipment can look like supply leaving the country.")

# ---- 5 the onion election ----
b("election", "o-paper: the paper drops (sepia)", "And why would a government watch onion prices so closely? Go back to nineteen ninety-eight.")
b("election", "o-paper price tag", "In August that year, a newspaper reported that the commerce minister had ordered a temporary ban on onion exports, and that imports would be considered if prices stayed high.", ["C-C12"])
b("election", "o-paper ballot", "A few months later, Delhi voted for its assembly.", ["C-C01"])
b("election", "q-versus seats 1993 / 1998", "In nineteen ninety-three, the BJP had won forty-nine of the seventy seats. In nineteen ninety-eight, Congress won fifty-two, and the BJP fifteen.", ["C-C03", "C-C01"])
b("election", "q-chain myth 3", "So did onions bring down a government? A study by three economists says the defeat was partly about onion prices. But an election has many causes, and no record we read can measure the onion's share. So the third thing you may have heard is only half true.", ["C-C10", "C-C23"])
b("election", "o-india pins 28 cities", "What the same study did measure is stranger. It looked at weekly food prices in twenty-eight cities, from nineteen ninety-three to twenty twelve, and found an election pattern in just one food of the sixteen. The onion.", ["C-C06", "C-C07"])
b("election", "price wave dips before a ballot box", "Onion prices tended to fall as a state election came near, and to rise after it. The authors call their explanation, a trade concentrated in a few markets, only suggestive.", ["C-C08", "C-C09"])

# ---- 6 the paradox ----
b("paradox", "o-seesaw (still, level)", "So, back to the question from the start. How can the onion be too cheap and too dear in the same year?")
b("paradox", "o-seesaw glut + story onionfield heap", "In spring, the rabi harvest floods the markets in a few weeks. The price fund's own rules say a steep fall at harvest time is normal.", ["B-C22", "A-C21"])
b("paradox", "q-stat Rs 13/kg", "In March twenty twenty-five, the usual price at Lasalgaon's auctions was one thousand three hundred and thirty rupees a quintal. About thirteen rupees a kilo.", ["B-C24", "L-C03"])
b("paradox", "o-onion age shrink", "And holding on is costly. Every week in the store, the heap gets lighter.", ["A-C24", "A-C26"])
b("paradox", "o-seesaw swing", "Then the stored stock runs down, and the same rules say prices rise. If the next crop is late, the family in the city pays.", ["B-C22", "B-C10"])
b("paradox", "o-seesaw buffer: warehouse rises", "So the government tries to be the store. It buys onions when there are many, and sells them when there are few. From the rabi crop of twenty twenty-four, it bought about four hundred and seventy thousand tonnes.", ["B-C21", "L-C04", "B-C20"])
b("paradox", "o-seesaw levels, wobbles", "And every tool pulls both ways. A ban can help the family and hurt the farmer. Open exports can help the farmer and cost the family.")

# ---- close ----
b("close", "o-india routes + rail, wide", "So the onion's power does not come from the bulb. It comes from the map behind it.")
b("close", "montage: map, calendar, store, train, trade gate", "Half the onion land in one state. Most of the crop in one spring. Months in stores where it slowly shrinks. Hundreds of kilometres to the cities. And a border that opens and shuts.", ["A-C04", "A-C21", "A-C24", "A-C31", "B-C02"])
b("close", "story citykitchen: the mother drops the onion into the pan; the child watches (ILLUSTRATIVE, callback)", "And at the end of all that, one onion pulled from a field near Nashik in April lands in a pan in a city kitchen.")
b("close", "o-onion hero, pull out to the map", "India's onion paradox is really a geography paradox.")

words = sum(len(x["say"].split()) for x in B)
json.dump({"id": "ON01", "format": "F10 The Paradox (main) + F7 Follow the Thing (the onion's year); YouTube Storytelling and Viral Strategy; Kurz story kit", "words": words, "beats": B}, open(os.path.join(D, "indica_atlas_v1.json"), "w"), indent=1, ensure_ascii=False)
md = [f"# The Onion Paradox: script v1 (Indica Atlas, ON01, 13 Nov 2026) · DRAFT, not voiced\n\n{words} words. Claim IDs in brackets (research ON01-onion-paradox).\n"]
act = None
for x in B:
    if x["act"] != act: act = x["act"]; md.append(f"\n## {act}\n")
    md.append(f"- `{x['key']}` *{x['shot']}* · {x['say']} [{', '.join(x['claims']) or 'no factual claim'}]")
open(os.path.join(D, "indica_atlas_v1.md"), "w").write("\n".join(md) + "\n")
print(words, len(B))
