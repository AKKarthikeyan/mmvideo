# Three Nick Sleep shorts (Letter Reader style). say = spoken; scene "at" phrases must occur in say.
# Every quote (q) is verbatim from the Nomad letters; src names the letter period and printed page.
PDF = "/Users/akkarthikeyan/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Full Collection Nomad Letters Nick Sleep.pdf"
S08 = "Nomad letter, period ended 31 Dec 2008"
S09 = "Nomad letter, period ended 30 Jun 2009"
S10 = "Nomad letter, period ended 30 Jun 2010"

SHORTS = [
 {"id": "sleep_s1_lightbulb", "title": "The Light Bulb Problem",
  "clips": {
    "smoking": ("a vivid smoking gun such as a brand name, a location, a clever re- insurance contract, or a patent", 2, 2),
    "chem":    ("A rival could displace it at any time with a better chemical", 2, 2),
    "million": ("a million little actions", 2, 2),
    "goals":   ("we have 452 detailed goals, with owners, deliverables and targeted", 1, 2),
    "bulb":    ("saves the firm U$20,000 per annum", 2, 2),
    "harder":  ("They are simply harder to beat", 2, 2)},
  "beats": [
   {"key": "a", "say": "Nick Sleep spent years hunting for the one big thing that makes a company unbeatable. A brand. A location. A patent. He admits he was looking for a vivid smoking gun.",
    "scene": {"type": "quote", "head": "THE WRONG PLACE TO LOOK", "clip": "smoking", "q": "a vivid smoking gun such as a brand name, a location, a clever re-insurance contract, or a patent", "src": S10 + " · p.174", "qat": "vivid smoking gun", "at": "smoking gun"}},
   {"key": "b", "say": "But one big thing is fragile. A drug company with a patent can be displaced at any time by a better chemical.",
    "scene": {"type": "quote", "head": "ONE BIG THING IS FRAGILE", "clip": "chem", "q": "A rival could displace it at any time with a better chemical", "src": S10 + " · p.175", "qat": "displaced at any time", "at": "better chemical"}},
   {"key": "c", "say": "Now flip it. To beat a business that shares its scale savings, a rival would need to be better at not one thing, but a million little actions.",
    "scene": {"type": "quote", "head": "NOW FLIP IT", "clip": "million", "q": "a million little actions", "src": S10 + " · p.175", "qat": "a million little actions", "at": "million little actions"}},
   {"key": "d", "say": "Amazon's shareholder letter that year listed four hundred and fifty-two detailed goals, each with an owner and a target date.",
    "scene": {"type": "dots", "head": "AMAZON, 2010", "clip": "goals", "src": "Amazon shareholder letter, quoted in the " + S10 + " · p.175", "at": "four hundred and fifty-two"}},
   {"key": "e", "say": "And one employee idea: take the light bulbs out of the vending machines. Really. It saves the firm twenty thousand dollars a year.",
    "scene": {"type": "bulb", "head": "ONE OF THE 452", "clip": "bulb", "src": S10 + " · p.175", "at": "take the light bulbs out", "off": "twenty thousand dollars"}},
   {"key": "f", "say": "Sleep's conclusion: firms that do many things a little better than their rivals are simply harder to beat.",
    "scene": {"type": "quote", "head": "HARDER TO BEAT", "clip": "harder", "q": "They are simply harder to beat.", "src": S10 + " · p.175", "qat": "simply harder to beat", "at": "harder to beat"}},
   ]},
 {"id": "sleep_s2_gameover", "title": "The Game Is Over",
  "clips": {
    "table":  ("-45.3%", 1, 3),
    "less":   ("are less than some of its high street peers", 2, 2),
    "over":   ("the game is over", 2, 1),
    "gone":   ("Circuit City, Woolworths, Zavvi", 2, 2),
    "shared": ("scale savings are given back to the customer in the form of lower prices", 2, 2)},
  "beats": [
   {"key": "a", "say": "December 2008. Nick Sleep's fund has just lost forty-five point three percent in a year. The world index lost forty point seven.",
    "scene": {"type": "stat", "head": "THE WORST YEAR IN THE TABLE", "clip": "table", "src": S08 + " · p.147 · unaudited, before fees", "at": "forty-five point three", "at2": "forty point seven", "n1": 45.3, "n2": 40.7, "l1": "NOMAD", "l2": "MSCI WORLD"}},
   {"key": "b", "say": "In that same letter he writes about a shop. Amazon's operating costs, plus its operating margin, are less than some of its high street rivals' costs.",
    "scene": {"type": "bars", "head": "THE ARITHMETIC", "clip": "less", "src": S08 + " · p.151", "at": "operating costs", "at2": "less than some"}},
   {"key": "c", "say": "So a rival could price at breakeven and still not undercut Amazon. His words: for these high street competitors, the game is over.",
    "scene": {"type": "quote", "head": "THE TURN", "clip": "over", "q": "For these high street competitors the game is over.", "src": S08 + " · p.151", "qat": "the game is over", "at": "game is over"}},
   {"key": "d", "say": "He named three that had already gone. Circuit City. Woolworths. Zavvi.",
    "scene": {"type": "quote", "head": "ALREADY GONE", "clip": "gone", "q": "Circuit City, Woolworths, Zavvi", "src": S08 + " · p.152", "qat": "Circuit City", "at": "Circuit City"}},
   {"key": "e", "say": "The engine is a loop. Scale savings are given back to the customer as lower prices. The customer buys more. The scale grows again.",
    "scene": {"type": "loop", "head": "THE LOOP", "clip": "shared", "src": S08 + " · p.151", "at": "given back"}},
   ]},
 {"id": "sleep_s3_walmart", "title": "Forty Years of Watching the Wrong Number",
  "clips": {
    "cheer":  ("great quarter", 2, 2),
    "weigh":  ("incorrectly weigh the information", 2, 2),
    "engine": ("a thrift orientation fueling growth with the savings shared with the customer", 2, 2),
    "const":  ("may be constant", 2, 1),
    "gm":     ("average companies are more like GM than Wal-Mart", 2, 2)},
  "beats": [
   {"key": "a", "say": "For forty years, investors sat on conference calls and cheered: great quarter, Wal-Mart.",
    "scene": {"type": "quote", "head": "THE WRONG NUMBER", "clip": "cheer", "q": "great quarter, Wal-Mart", "src": S09 + " · p.162", "qat": "great quarter", "at": "great quarter"}},
   {"key": "b", "say": "But Sleep says they incorrectly weighed the information. They leaned on valuation, margin trends and revenue growth.",
    "scene": {"type": "quote", "head": "WEIGHED WRONG", "clip": "weigh", "q": "they incorrectly weigh the information", "src": S09 + " · p.162", "qat": "incorrectly weighed", "at": "incorrectly weighed"}},
   {"key": "c", "say": "The real engine was simpler: a thrift orientation, fueling growth, with the savings shared with the customer.",
    "scene": {"type": "quote", "head": "THE REAL ENGINE", "clip": "engine", "q": "a thrift orientation fueling growth with the savings shared with the customer", "src": S09 + " · p.162", "qat": "a thrift orientation", "at": "thrift orientation"}},
   {"key": "d", "say": "Investors recognise success step by step. The factors behind it, he says, may be constant.",
    "scene": {"type": "quote", "head": "THE ENGINE NEVER MOVED", "clip": "const", "q": "the factors that lead to success ... may be constant", "src": S09 + " · p.163", "qat": "may be constant", "at": "may be constant"}},
   {"key": "e", "say": "Average companies, he wrote, are more like GM than Wal-Mart.",
    "scene": {"type": "quote", "head": "THE PUNCHLINE", "clip": "gm", "q": "average companies are more like GM than Wal-Mart!", "src": S09 + " · p.163", "qat": "more like GM", "at": "more like GM"}},
   ]},
]
