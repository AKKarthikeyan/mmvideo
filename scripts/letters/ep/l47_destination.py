# The Letter · Video 47 · Nick Sleep · "Destination analysis" (16:9, fixed fund-letter styles).
# Source script: DarwinWiki contentengine/youtube/letters_scripts/sleep/47_destination_analysis.md (fact sheet there).
# Scene types: title, page (real letter page; `find` must be on that PDF page), quote (VERBATIM, one per video),
#   ours (our words, labelled), list, stat, end. `at`/`sync`/items phrases must occur in `say`.
# Page numbers are PDF pages of the compiled Nomad edition (same convention as the Light Bulb pilot).
PDF = "/Users/akkarthikeyan/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Full Collection Nomad Letters Nick Sleep.pdf"
VOICE = "English_Diligent_Man"
D05 = "Nomad letter, period ended 31 Dec 2005"
D07 = "Nomad letter, period ended 31 Dec 2007"
D13 = "Nomad letter, period ended 31 Dec 2013"

B = lambda key, ch, say, **scene: {"key": key, "ch": ch, "say": say, "scene": scene}

BEATS = [
 # ---- cold open ----
 B("a00", 0, "Here's a strange trick your brain plays. Imagine five years of returns. Plus eighty percent. Plus twenty-two. Plus ten. Plus nine. Plus one. Feels like things are going downhill, right?",
   type="list", ours=True, head="FIVE YEARS OF RETURNS", items=[["+80%", "Plus eighty"], ["+22%", "Plus twenty-two"], ["+10%", "Plus ten"], ["+9%", "Plus nine"], ["+1%  …downhill?", "Plus one"]]),
 B("a01", 0, "Now flip the order. Plus one. Plus nine. Plus ten. Plus twenty-two. Plus eighty. Feels fantastic! Getting better every year!",
   type="list", ours=True, head="SAME FIVE, FLIPPED", items=[["+1%", "Plus one"], ["+9%", "Plus nine"], ["+10%", "Plus ten"], ["+22%", "Plus twenty-two"], ["+80%  fantastic!", "Plus eighty"]]),
 B("a02", 0, "But you end up with exactly the same money either way. Nick Sleep pointed this out to his investors in 2005. The order changes how we feel. It doesn't change where we end up.",
   type="page", page=74, find="the end result (the destination) is identical", src=D05 + " · p.74", at="exactly the same money"),
 B("a03", 0, "", type="title", kicker="NICK SLEEP · THE NOMAD LETTERS", lines=["Destination Analysis"], sub="Judge the road by where it ends", silent=4.0),
 B("a04", 0, "That's Sleep's second big idea. Stop judging the ride. Judge where it ends.",
   type="ours", q="Stop judging the ride. Judge where it ends.", sync="Stop judging", em=["ends."]),
 # ---- I ----
 B("a10", 1, "", type="title", kicker="PART ONE", lines=["18 Years or 22?"], silent=2.6),
 B("a11", 1, "In the same letter, Sleep asked a simple question. If you could turn one dollar into sixteen, does it matter much whether it takes eighteen years or twenty-two?",
   type="page", page=74, find="matter if it takes 18 years or 22 years", src=D05 + " · p.74", at="eighteen years"),
 B("a12", 1, "He was honest that the yearly return is different. Sixteen times in eighteen years is about sixteen point seven percent a year. In twenty-two years, about thirteen point four. But reaching sixteen at all matters far more.",
   type="stat", ours=True, big="16.7%", after="a year, if $1 → $16 takes 18 years", at="sixteen point seven", second="13.4%", second_label="a year, if it takes 22 years", second_at="thirteen point four"),
 B("a13", 1, "Then he wrote the sentence that sums up how most people invest. Travelling comfortably dominates people's thinking when they should be thinking about destinations.",
   type="quote", q="Travelling comfortably dominates people’s thinking when they should be thinking about destinations.", em=["destinations."], sync="Travelling comfortably", src=D05 + " · p.74"),
 # ---- II ----
 B("a20", 2, "", type="title", kicker="PART TWO", lines=["The Road to Goa"], silent=2.6),
 B("a21", 2, "Think of a family road trip to Goa. Some stretches are smooth. Some are full of potholes. And someone in the back seat asks at every single bump: are we there yet?",
   type="ours", q="Are we there yet?", sync="someone in the back seat", em=["yet?"]),
 B("a22", 2, "Would you turn the car around because of one bad stretch? Of course not. You check one thing. Are we still on the road to Goa?",
   type="ours", q="Are we still on the road to Goa?", sync="You check one thing", em=["Goa?"]),
 B("a23", 2, "Destination analysis asks the same question of a business. Not, was this quarter bumpy? But, is this company still heading where I thought it was going?",
   type="list", ours=True, items=[["Not: was this quarter bumpy?", "was this quarter bumpy"], ["But: is it still heading where I thought?", "is this company still heading"]]),
 # ---- III ----
 B("a30", 3, "", type="title", kicker="PART THREE", lines=["The Bus Company"], silent=2.6),
 B("a31", 3, "Sleep learned this the hard way, and wrote about it with rare honesty in 2007. He'd bought shares of Stagecoach, a British bus company, at fourteen pence. They rose to about ninety pence, and he sold. A success!",
   type="page", page=128, find="shares purchased at 14p were sold at a high of around 90p", src=D07 + " · p.128", at="fourteen pence"),
 B("a32", 3, "Except that, when he was writing, the shares traded above two pounds fifty. He'd left about one pound sixty a share on the table.",
   type="stat", big="£2.50", after="Stagecoach share price when Sleep wrote", at="two pounds fifty", second="£1.60", second_label="left on the table, per share", second_at="one pound sixty", src=D07 + " · p.128"),
 B("a33", 3, "Why did he sell? He'd anchored on his original analysis. At fourteen pence, all he needed was a business worth more than fourteen pence. He never asked where the business itself was heading. He put the cost at about twelve million dollars, and counting.",
   type="page", page=128, find="anchoring on the original purchase decision analysis", src=D07 + " · p.128", at="anchored"),
 B("a34", 3, "It's like selling your plot of land the day its price doubles, and then driving past the shopping mall they built on it, every single day.",
   type="ours", q="Sold the plot. Now I drive past the mall every day.", sync="selling your plot", em=["mall"]),
 # ---- IV ----
 B("a40", 4, "", type="title", kicker="PART FOUR", lines=["The Other Mistake"], silent=2.6),
 B("a41", 4, "His second big mistake was the opposite. He held Conseco, an American financial company, too long, relying on his analysis from the day he bought it. Conseco went bankrupt. Counting what the money could have earned elsewhere, he put that cost at about ten million dollars.",
   type="page", page=128, find="Conseco went bankrupt", src=D07 + " · p.128", at="Conseco went bankrupt"),
 B("a42", 4, "Two mistakes, one cause. In both cases, he judged the company by a snapshot taken on the day he bought it, and never updated the picture.",
   type="page", page=128, find="static view of a firm formed at the time of purchase", src=D07 + " · p.128", at="a snapshot"),
 # ---- V ----
 B("a50", 5, "", type="title", kicker="PART FIVE", lines=["A Return on Mistakes"], silent=2.6),
 B("a51", 5, "He even joked about it, calling his two biggest mistakes, sorry, learning opportunities.",
   type="page", page=128, find="sorry, learning opportunities", src=D07 + " · p.128", at="sorry"),
 B("a52", 5, "And here's the part I love. Sleep said destination analysis became central to how they studied businesses. The Conseco lesson, he believed, kept them out of American banks before the 2008 crisis. The Stagecoach lesson helped them keep holding Amazon.",
   type="page", page=128, find="may well have kept us out of the US banks", src=D07 + " · p.128", at="American banks"),
 B("a53", 5, "He estimated those two lessons added around sixty million dollars to Nomad's results in 2007 alone. He called it a return on prior years' losses.",
   type="stat", big="U$60m", after="rough gain in 2007 from two old lessons (Sleep's estimate)", at="sixty million", src=D07 + " · p.128"),
 # ---- VI ----
 B("a60", 6, "", type="title", kicker="PART SIX", lines=["The Bank Manager"], silent=2.6),
 B("a61", 6, "Sleep gave a brilliant everyday example in the same letter. Imagine your home loan was sold to you by a young salesman on commission, and then passed on to some faraway fund.",
   type="page", page=127, find="commissioned pimply youth", src=D07 + " · p.127", at="young salesman"),
 B("a62", 6, "Now imagine instead that it's still held by your local bank manager, who has known your father for fifty years. You'd feel very differently about those two loans. And so would the lender.",
   type="page", page=127, find="who has known your Dad for fifty years", src=D07 + " · p.127", at="bank manager"),
 B("a63", 6, "The first set-up looks efficient on this year's profit statement. But its destination is disloyal customers and careless lending, roughly what happened before 2008. The second looks old-fashioned. Its destination is trust.",
   type="list", ours=True, items=[["Commission salesman → looks efficient", "The first set-up"], ["…destination: disloyalty", "disloyal customers"], ["Old bank manager → looks old-fashioned", "The second looks"], ["…destination: trust", "Its destination is trust"]]),
 B("a64", 6, "In India we all know that bank manager. He's the reason some families have banked at the same branch for three generations.",
   type="ours", q="Three generations. Same branch.", sync="In India", em=["Same", "branch."]),
 # ---- VII ----
 B("a70", 7, "", type="title", kicker="THE INDIA LENS", lines=["Three Destination Questions"], silent=2.6),
 B("a71", 7, "For any Indian company you study, ask three destination questions. One. In ten years, will customers need this business more than today, or less? Two. Is it doing things now that make that future more likely, even if they hurt this year's profit? Three. What would have to go wrong for it to end up somewhere much worse?",
   type="list", ours=True, flat=True, items=[["1 · In 10 years: needed more, or less?", "In ten years"], ["2 · Building that future now?", "Is it doing things now"], ["3 · What sends it somewhere worse?", "What would have to go wrong"]]),
 B("a72", 7, "And before you sell, ask one more. Am I selling because the business changed direction, or only because it hit my old target price? That's the Stagecoach question.",
   type="ours", q="Did the business change? Or only the price?", sync="Am I selling", em=["business", "price?"]),
 # ---- VIII ----
 B("a80", 8, "", type="title", kicker="PART SEVEN", lines=["What People Get Wrong"], silent=2.6),
 B("a81", 8, "One. Destination analysis doesn't mean ignoring bad news. Conseco shows you must update the destination when the facts change. Two. A target price is not a destination. A target price is where you get off. Three. A bumpy ride doesn't mean a bad business.",
   type="list", ours=True, flat=True, items=[["✗  Ignore bad news", "ignoring bad news"], ["✗  Target price = destination", "A target price is not"], ["✗  Bumpy ride = bad business", "A bumpy ride"]]),
 B("a82", 8, "Nomad's own yearly returns bounced around a lot. Yet by the final letter, one dollar invested at the start had become ten dollars and twenty-one cents, before fees.",
   type="page", page=211, find="$10.21", src=D13 + " · p.211 · unaudited, before fees", at="ten dollars and twenty-one"),
 # ---- close ----
 B("a90", 9, "One line for your friend over chai. Don't judge the trip by the potholes. Ask where the road ends.",
   type="ours", q="Don't judge the trip by the potholes. Ask where the road ends.", sync="Don't judge", em=["potholes.", "ends."], lastTick=True),
 B("a91", 9, "Next, how Sleep actually ran a fund on these ideas, in some of the most honest letters in the business.",
   type="ours", q="Next: the most honest letters in the business.", sync="some of the most honest", em=["honest"]),
 B("a92", 9, "", type="end", silent=7.0),
]

CHAPTERS = ["Same returns, different mood", "18 years or 22?", "The road to Goa", "The bus company", "The other mistake",
            "A return on mistakes", "The bank manager", "The India lens: three questions", "What people get wrong", "The Chai Test"]

META = {
 "title": "Destination Analysis Explained Simply | Nick Sleep and the Nomad Letters",
 "author": "Nick Sleep",
 "end": "Quotations and ringed passages are from the Nomad Investment Partnership letters (Sleep, Zakaria and Company), with the letter period and PDF page shown. Lines marked “our note” are our own reading.",
 "thumb": {"kicker": "NICK SLEEP · THE NOMAD LETTERS", "l1": "Where does", "l2": "the road end?", "sub": "$1 → $16: in 18 years or 22?"},
 "description": """Nick Sleep's destination analysis, explained simply: why the order of returns fools us, "$1 into $16: does it matter if it takes 18 years or 22?", the Stagecoach and Conseco mistakes, the old bank manager, and three destination questions for Indian investors. From the original Nomad Investment Partnership letters.

Every ringed passage is shown on the real letter page, with the letter period and page. Lines marked "our note" are our own reading.""",
 "sources": """Sources (Nomad letters, compiled edition; page = PDF page)
- Annual letter, period ended 31 Dec 2005: p.74 (reordered returns; $1 → $16; "Travelling comfortably…")
- Annual letter, period ended 31 Dec 2007: p.127 (pimply youth vs bank manager), p.128 (Stagecoach, Conseco, destination analysis, ~US$60m)
- Annual letter, period ended 31 Dec 2013: p.218 (since-inception results, unaudited, before fees)""",
 "tags": "destination analysis, nick sleep, long term investing, anchoring bias, selling too early, nomad investment partnership, nick sleep letters, stock market for beginners",
}
