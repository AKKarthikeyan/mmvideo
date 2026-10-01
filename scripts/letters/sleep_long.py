# Nick Sleep long form, "The Light Bulb Problem" (16:9). Fixed styles (AK 29 Sep): 16 mm documentary + kinetic typography.
# Scene types: title (16 mm title card, silent unless say), page (16 mm push-in on a real letter page, ring round `find`),
#   quote (kinetic, VERBATIM letter text, shown with quote marks + source), ours (kinetic, our own words, labelled),
#   list (kinetic lines, one per `at` phrase), stat (kinetic big number), end (disclaimer).
# `sync` = the spoken span the kinetic words are spread over (must occur in `say`); `at` phrases must occur in `say`.
PDF = "/Users/akkarthikeyan/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Full Collection Nomad Letters Nick Sleep.pdf"
D08 = "Nomad letter, period ended 31 Dec 2008"
D09 = "Nomad letter, period ended 30 Jun 2009"
D10 = "Nomad letter, period ended 30 Jun 2010"
D12 = "Nomad letter, period ended 31 Dec 2012"

B = lambda key, ch, say, **scene: {"key": key, "ch": ch, "say": say, "scene": scene}

BEATS = [
 # ---- cold open ----
 B("b00", 0, "December 2008. In London, a fund manager sits down to write to his investors.",
   type="title", kicker="THE NOMAD LETTERS", lines=["December 2008"], sub="London"),
 B("b01", 0, "His fund has just lost forty-five point three percent in a year. The world index lost forty point seven. It is the worst year in the fund's table.",
   type="page", page=147, find="-45.3%", src=D08 + " · p.147 · unaudited, before fees", at="forty-five point three"),
 B("b02", 0, "And yet, in that same letter, he writes a sentence about somebody else's business. For these high street competitors, the game is over.",
   type="quote", q="For these high street competitors the game is over.", em=["over."], sync="For these high street", src=D08 + " · p.151"),
 B("b03", 0, "His name is Nick Sleep. Watch closely. Nothing here is hidden. It just isn't where you are looking.",
   type="ours", q="Nothing here is hidden. It just isn't where you are looking.", sync="Nothing here", em=["looking."]),
 B("b04", 0, "", type="title", kicker="NICK SLEEP AND THE NOMAD LETTERS", lines=["The Light Bulb Problem"], silent=4.0),
 # ---- I. the pledge ----
 B("b10", 1, "", type="title", kicker="PART ONE", lines=["The Pledge"], silent=2.6),
 B("b11", 1, "Two shops. The first plays the old game. Prices are high, so every week something goes on sale to pull you through the door.",
   type="ours", q="Two shops.", sync="Two shops", em=["shops."]),
 B("b12", 1, "Sleep's verdict on that game is blunt. Customers are trained to buy on deal, be disloyal and shop around.",
   type="page", page=151, find="customers are trained to buy on deal, be disloyal and shop around", src=D08 + " · p.151", at="Customers are trained"),
 B("b13", 1, "His one-word summary: Yuck.",
   type="quote", q="Yuck.", em=["Yuck."], sync="Yuck", src=D08 + " · p.151"),
 B("b14", 1, "The second shop does something that looks like a mistake. Every time it gets more efficient, it does not keep the saving.",
   type="ours", q="The second shop looks like it is making a mistake.", sync="The second shop", em=["mistake."]),
 B("b15", 1, "In Sleep's words: as the firm grows in size, scale savings are given back to the customer in the form of lower prices.",
   type="page", page=151, find="scale savings are given back to the customer in the form of lower prices", src=D08 + " · p.151", at="scale savings"),
 B("b16", 1, "The customer reciprocates by buying more. That gives the retailer greater scale, and the new savings are passed on as well. A loop. Sleep's word for it: Yippee.",
   type="list", items=[["Lower prices", "The customer reciprocates"], ["More buying", "greater scale"], ["New savings", "passed on as well"], ["…and round again", "A loop"]],
   finale="Yippee.", finale_at="Yippee", src=D08 + " · p.151"),
 B("b17", 1, "This, he wrote, is why Costco enjoys sales per foot of retailing space four times greater than run-of-the-mill supermarkets.",
   type="quote", q="sales per foot of retailing space four times greater than run-of-the-mill supermarkets", em=["four", "times"], sync="sales per foot", src=D08 + " · p.151"),
 # ---- II. the turn ----
 B("b20", 2, "", type="title", kicker="PART TWO", lines=["The Turn"], silent=2.6),
 B("b21", 2, "Here is the part that should not be possible.",
   type="ours", q="Here is the part that should not be possible.", sync="Here is", em=["not", "possible."]),
 B("b22", 2, "Amazon's operating costs per dollar of sales, plus its operating margin, are less than some of its high street peers' costs.",
   type="page", page=151, find="plus its operating margin are less than some of its high street peers", src=D08 + " · p.151", at="plus its operating margin"),
 B("b23", 2, "Read that again. Amazon's costs and its profit, added together, come to less than what those rivals spend just to run the shop.",
   type="list", items=[["Amazon's costs", "Amazon's costs"], ["+ Amazon's profit", "its profit"], ["< a rival's costs alone", "less than"]], src=D08 + " · p.151 (paraphrased)"),
 B("b24", 2, "So in theory, Sleep says, those rivals could price their products at net income breakeven and still not undercut Amazon's prices or profitability.",
   type="quote", q="could price their products at net income breakeven and still not undercut Amazon's prices or profitability.", em=["still", "not", "undercut"], sync="could price", src=D08 + " · p.151"),
 B("b25", 2, "Which is the sentence we started with. For these high street competitors, the game is over.",
   type="quote", q="For these high street competitors the game is over.", em=["over."], sync="For these high street", src=D08 + " · p.151"),
 B("b26", 2, "He put the combined US revenues of Amazon's nearest high street rivals at a hundred and fifty billion dollars. And he named firms that had recently gone away. Circuit City. Woolworths. Zavvi.",
   type="page", page=152, find="Circuit City, Woolworths, Zavvi", src=D08 + " · p.152", at="Circuit City"),
 # ---- III. the fold ----
 B("b30", 3, "", type="title", kicker="PART THREE", lines=["Forty Years Earlier"], silent=3.0),
 B("b31", 3, "But Sleep did not discover this in 2008. His letters keep going back to an older shop. Wal-Mart.",
   type="ours", q="An older shop.", sync="an older shop", em=["older"]),
 B("b32", 3, "For forty years, he writes, investors saw the information. On conference calls they cheered: great quarter, Wal-Mart.",
   type="page", page=162, find="great quarter", src=D09 + " · p.162", at="great quarter"),
 B("b33", 3, "But in his opinion, they incorrectly weigh the information.",
   type="quote", q="in our opinion, they incorrectly weigh the information", em=["incorrectly"], sync="they incorrectly", src=D09 + " · p.162"),
 B("b34", 3, "The central engine of success, he wrote, was a thrift orientation fueling growth with the savings shared with the customer.",
   type="quote", q="a thrift orientation fueling growth with the savings shared with the customer", em=["savings", "shared"], sync="a thrift orientation", src=D09 + " · p.162"),
 B("b35", 3, "Instead, investors may place too much emphasis on valuation heuristics, or margin trends. Items he calls transitory and anecdotal.",
   type="page", page=162, find="valuation heuristics, or margin trends", src=D09 + " · p.162–163", at="valuation heuristics"),
 B("b36", 3, "Put simply: average companies do not do scale economics shared. After all, average companies are more like GM than Wal-Mart.",
   type="quote", q="average companies are more like GM than Wal-Mart!", em=["GM"], sync="average companies are more", src=D09 + " · p.163"),
 # ---- IV. the second question ----
 B("b40", 4, "", type="title", kicker="PART FOUR", lines=["The Second Question"], silent=2.6),
 B("b41", 4, "A fair objection. If the loop is so powerful, why can't a rival just copy it?",
   type="ours", q="Why can't a rival just copy it?", sync="why can't", em=["copy"]),
 B("b42", 4, "Sleep asks himself the same thing, and starts with a confession. He had gone looking for a vivid smoking gun. A brand name, a location, a clever re-insurance contract, or a patent.",
   type="page", page=174, find="a vivid smoking gun", src=D10 + " · p.174", at="vivid smoking gun"),
 B("b43", 4, "One big thing is fragile. Take a drug company with a patent. A rival could displace it at any time with a better chemical.",
   type="quote", q="A rival could displace it at any time with a better chemical", em=["better", "chemical"], sync="A rival could", src=D10 + " · p.175"),
 B("b44", 4, "To better a scale economics business, a rival would have to be superior at, not one thing, but a million little actions.",
   type="quote", q="not one thing, but a million little actions", em=["million", "little", "actions"], sync="not one thing", src=D10 + " · p.175"),
 B("b45", 4, "Amazon's shareholder letter that year: four hundred and fifty-two detailed goals, with owners, deliverables and targeted completion dates.",
   type="page", page=175, find="452 detailed goals", src="Amazon shareholder letter, quoted in the " + D10 + " · p.175", at="four hundred"),
 B("b46", 4, "And one employee initiative, to remove the light bulbs from the vending machines. Really. It saves the firm twenty thousand dollars a year.",
   type="stat", big="U$20,000", after="per annum", lead="remove the light bulbs from the vending machines", lead_at="remove the light bulbs", lead_quote=True, at="twenty thousand", src=D10 + " · p.175"),
 B("b47", 4, "Firms that do many things a little better than their rivals, he concludes, are simply harder to beat.",
   type="quote", q="They are simply harder to beat.", em=["harder", "to", "beat."], sync="are simply", src=D10 + " · p.175"),
 # ---- V. the prestige ----
 B("b50", 5, "", type="title", kicker="PART FIVE", lines=["The Prestige"], silent=2.6),
 B("b51", 5, "Now go back to the page we started on. December 2008. The worst year in the table.",
   type="page", page=147, find="-45.3%", src=D08 + " · p.147", at="December 2008", reverse=True),
 B("b52", 5, "Here is the trick. The moat was never in that year's number. A business running this loop can show thin margins for years, because it chose to. The saving did not disappear. It went to the customer, and came back as scale.",
   type="ours", q="The moat was never in the number.", sync="The moat was never", em=["never"]),
 B("b53", 5, "It is why Sleep ran his fund the way he did. Few investments, held for long periods. In his words: Zak and I don't want to be busy; we want to be right.",
   type="quote", q="Zak and I don't want to be busy; we want to be right.", em=["right."], sync="Zak and I", src=D08 + " · p.150–151"),
 B("b54", 5, "Years later he wrote that the decision not to do something is still an active decision. It is just that the accountants don't capture it.",
   type="page", page=207, find="the decision not to do something is still an active decision", src=D12 + " · p.207", at="the decision not"),
 B("b55", 5, "And the table from that worst year? From September 2001 to the end of 2008, it prints plus one hundred and one point one percent for the fund, unaudited and before fees. The world index: plus seven point seven.",
   type="stat", big="+101.1%", after="Nomad, since inception (10 Sept 2001) to 31 Dec 2008", at="plus one hundred", second="+7.7%", second_label="MSCI World Index (net) US$", second_at="plus seven point seven", src=D08 + " · p.147 · unaudited, before fees"),
 B("b56", 5, "So the next time you see a shrinking margin, before you call it weakness, ask two questions. Did the company choose it? And where did the savings go?",
   type="list", ours=True, items=[["Did the company choose it?", "Did the company"], ["Where did the savings go?", "where did the savings"]], lastTick=True),
 B("b57", 5, "", type="end", silent=7.0),
]

CHAPTERS = ["Cold open", "Part One: The Pledge", "Part Two: The Turn", "Part Three: Forty Years Earlier", "Part Four: The Second Question", "Part Five: The Prestige"]
