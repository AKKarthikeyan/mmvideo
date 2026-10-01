# The Letter · Video 50 · Nick Sleep · "Why great businesses look expensive" (16:9, fixed fund-letter styles).
# Source script: DarwinWiki contentengine/youtube/letters_scripts/sleep/50_why_great_businesses_look_expensive.md (fact sheet there).
# `page` values are hints from the 218-page edition; build_letter.py moves each to the nearest page that has `find`.
PDF = "/Users/akkarthikeyan/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Full Collection Nomad Letters Nick Sleep.pdf"
VOICE = "English_Diligent_Man"
A06 = "Nomad letter, period ended 31 Dec 2006"
I09 = "Nomad letter, period ended 30 Jun 2009"

B = lambda key, ch, say, **scene: {"key": key, "ch": ch, "say": say, "scene": scene}

BEATS = [
 # ---- cold open ----
 B("e00", 0, "A rishta aunty is comparing two boys. One is a bank clerk, earning forty thousand a month. The other is a medical student, earning exactly zero. Aunty decides in two seconds. The clerk. The doctor boy earns nothing.",
   type="list", ours=True, head="AUNTY'S SHORTLIST", items=[["Bank clerk · ₹40,000 a month", "bank clerk"], ["Medical student · ₹0 a month", "medical student"], ["Aunty's pick: the clerk", "The clerk"]]),
 B("e01", 0, "Ten years later, the medical student is a surgeon. And aunty is very quietly asking if he has a younger brother.",
   type="ours", q="“Does he have a younger brother?”", sync="very quietly", em=["brother?”"]),
 B("e02", 0, "Aunty made one mistake. She judged both boys by what they earn today, not what they'll earn later. The stock market makes this exact mistake with great businesses, all the time.",
   type="ours", q="Judged by today's salary. Not tomorrow's.", sync="She judged both boys", em=["tomorrow's."]),
 B("e03", 0, "", type="title", kicker="NICK SLEEP · THE NOMAD LETTERS", lines=["Cheap for Decades"], sub="Why great businesses look expensive", silent=4.0),
 # ---- I ----
 B("e10", 1, "", type="title", kicker="PART ONE", lines=["The P/E in One Line"], silent=2.6),
 B("e11", 1, "First, one simple tool. The P E ratio is the share price divided by one year's profit per share. A P E of twenty means you're paying twenty years of today's profit. So a high P E looks expensive. And most of the time, that instinct is right. But not always.",
   type="list", ours=True, flat=True, head="THE P/E RATIO", items=[["Price ÷ one year's profit", "divided by one year's profit"], ["P/E 20 = 20 years of today's profit", "A P E of twenty"], ["High P/E looks expensive", "looks expensive"]]),
 # ---- II ----
 B("e20", 2, "", type="title", kicker="PART TWO", lines=["Wal-Mart, 1972"], silent=2.6),
 B("e21", 2, "In 2009, Sleep drew a chart that stops you in your tracks. Wal-Mart's share price since its listing in 1972, and above it, the price you could have paid at any time and still earned ten percent a year. He titled it: cheap for decades.",
   type="page", page=162, find="Chart 2: Cheap for Decades", src=I09 + " · p.162", at="cheap for decades"),
 B("e22", 2, "An investor in 1972 could have paid over one hundred and fifty times the actual share price. That's a P E of over fifteen hundred. And still earned ten percent a year.",
   type="page", page=162, find="over one hundred and fifty times the prevailing share price", src=I09 + " · p.162", at="one hundred and fifty times"),
 B("e23", 2, "Fifteen hundred times earnings. If your broker suggested that, you'd hang up the phone. And you'd have missed one of the best investments of the century.",
   type="stat", ours=True, big="1,500×", after="earnings: the 1972 P/E that still earned 10% a year", at="Fifteen hundred"),
 B("e24", 2, "Ten years later, you could still have paid over two hundred times earnings and made ten percent. The market, Sleep said, struggled to see how big and how long lasting the success would be.",
   type="page", page=162, find="he could still have paid over two hundred times", src=I09 + " · p.162", at="two hundred times"),
 # ---- III ----
 B("e30", 3, "", type="title", kicker="PART THREE", lines=["Why the Market", "Gets It Wrong"], silent=2.6),
 B("e31", 3, "Everybody knew Wal-Mart was a wonderful business. So why did almost nobody, except the founding Walton family, own it all the way through? Sleep gave three reasons.",
   type="page", page=160, find="no one but the founding Walton family", src=I09 + " · p.160", at="Walton family"),
 B("e32", 3, "Reason one. The wrong mental model. Most companies have one good idea, then struggle to repeat it. Sleep called it the Barbie problem, after the toy company that struggled to repeat the success of its famous doll.",
   type="page", page=160, find="call this the Barbie problem", src=I09 + " · p.160", at="Barbie problem"),
 B("e33", 3, "We have a Bollywood version. The one hit wonder. One superhit film, then ten flops. The market treats every company like a one hit wonder. But Wal-Mart's engine was a habit, not a hit. Cutting prices and sharing savings, every single year.",
   type="ours", q="Not a one-hit wonder. A habit.", sync="The market treats every company", em=["habit."]),
 B("e34", 3, "Reason two. Fund managers have to look active. So they sell the great company that looks expensive, to buy something that looks cheaper, but often isn't.",
   type="page", page=161, find="Active fund managers have to look active", src=I09 + " · p.161", at="look active"),
 B("e35", 3, "Reason three is the most interesting. The odds. Sleep quoted research showing that only one growth company in five stays a growth company for five years. And only one in ten, for ten years.",
   type="page", page=161, find="for five years is one in five, and for ten years just one in ten", src=I09 + " · p.161 · research he cites", at="one growth company in five"),
 B("e36", 3, "So investors sensibly assume the good times won't last, and price every growing company for a fall. Fair, on average. But the discount gets applied to all of them, even the rare ones that don't fall. Those rare ones end up cheap, sometimes for decades.",
   type="page", page=161, find="cheap, in some cases, for decades", src=I09 + " · p.161", at="even the rare ones"),
 # ---- IV ----
 B("e40", 4, "", type="title", kicker="PART FOUR", lines=["They Sold IBM.", "Then Wal-Mart."], silent=2.6),
 B("e41", 4, "Sleep heard a story from a very senior fund manager. In the early 1970s, a big fund company found that selling its IBM shares thirty years earlier had been a huge mistake. Had it kept them, that one stake would have been bigger than all the money it managed.",
   type="page", page=160, find="their sale of IBM thirty years earlier", src=I09 + " · p.160", at="IBM shares"),
 B("e42", 4, "Everyone agreed to learn from it, went back to their desks, and carried on as before. And at about the same time, they sold their Wal-Mart shares too.",
   type="page", page=160, find="made the decision to sell", src=I09 + " · p.160", at="sold their Wal-Mart shares"),
 B("e43", 4, "Learning from mistakes. Very popular in meetings. Less popular in practice.",
   type="ours", q="Very popular in meetings. Less popular in practice.", sync="Very popular", em=["practice."]),
 # ---- V ----
 B("e50", 5, "", type="title", kicker="PART FIVE", lines=["Amazon, 2006"], silent=2.6),
 B("e51", 5, "Sleep saw the same thing live with Amazon. In 2006, Amazon was spending heavily on growth: warehouses, technology, free shipping, and price cuts. After all that, it still produced just over five hundred million dollars of free cash a year.",
   type="page", page=105, find="free cash flow of just over U$500m", src=A06 + " · p.105", at="five hundred million"),
 B("e52", 5, "Sleep worked out that, valued as a plain cash cow with no extra growth spending, Amazon was worth about twenty-six dollars a share. And that's roughly where the market had priced it the summer before. In other words, the market was saying to Amazon's managers: your growth spending has no value.",
   type="quote", q="your growth spending has no value", em=["no", "value"], sync="your growth spending", src=A06 + " · p.105 · Sleep, on what the price implied"),
 B("e53", 5, "Think of a shopkeeper who spends his profits opening new branches. His notebook shows a small profit this year. A lazy observer says, weak business. A smart observer asks, what would he earn if he stopped expanding? And what will those new branches earn later?",
   type="list", ours=True, flat=True, items=[["Lazy: “small profit, weak business”", "A lazy observer"], ["Smart: “what if he stopped expanding?”", "what would he earn"], ["Smart: “what will the branches earn?”", "those new branches earn later"]]),
 # ---- VI ----
 B("e60", 6, "", type="title", kicker="THE INDIA LENS", lines=["The “Stop Investing” Test"], silent=2.6),
 B("e61", 6, "Here's a simple test from Sleep's Amazon maths, for any company you study. One. What would it earn if it stopped spending on growth tomorrow? Two. Is that growth spending building something customers love, or just burning money? Three. Is the engine a one time hit, or a habit it repeats every year?",
   type="list", ours=True, flat=True, head="THE TEST", items=[["1 · Earnings if growth spending stopped?", "What would it earn"], ["2 · Building love, or burning cash?", "building something customers love"], ["3 · One-time hit, or a yearly habit?", "one time hit"]]),
 B("e62", 6, "If the answers are strong, a high P E might not tell you much. If they're weak, a high P E is exactly the warning it looks like. And to be clear, we're not saying any listed company today is cheap.",
   type="ours", q="Strong answers: P/E says little. Weak answers: P/E is a warning.", sync="If the answers are strong", em=["warning."]),
 # ---- VII ----
 B("e70", 7, "", type="title", kicker="PART SIX", lines=["What People Get Wrong"], silent=2.6),
 B("e71", 7, "One. So high P E stocks are always fine. No. Remember the odds: nine in ten growth companies stop growing within ten years. Two. Sleep just had hindsight. He expected that criticism, and wrote that greatness may sometimes be knowable in foresight, if you study the engine. Three. A low P E means safe. A cheap price on a fading business is like a sale on milk that expires tomorrow.",
   type="list", ours=True, flat=True, items=[["✗  High P/E is always fine", "always fine"], ["✗  It's all hindsight", "just had hindsight"], ["✗  Low P/E = safe", "A low P E means safe"]]),
 # ---- close ----
 B("f00", 8, "One line for your friend over chai. Don't judge a doctor by his salary as a student.",
   type="ours", q="Don't judge a doctor by his salary as a student.", sync="Don't judge a doctor", em=["student."], lastTick=True),
 B("f01", 8, "Next. Sleep said the thing that kept Wal-Mart's engine running for forty years wasn't a product. It was culture. Can culture be a moat?",
   type="page", page=162, find="a thrift orientation fueling growth", src=I09 + " · p.162", at="culture"),
 B("f02", 8, "", type="end", silent=7.0),
]

CHAPTERS = ["The rishta aunty's mistake", "The P/E in one line", "Wal-Mart: cheap for decades", "Why the market gets it wrong",
            "They sold IBM, then Wal-Mart", "Amazon, 2006", "The India lens: the \"stop investing\" test", "What people get wrong", "The Chai Test"]

META = {
 "title": "Why Great Stocks Look \"Too Expensive\" | Nick Sleep's Wal-Mart Chart Explained",
 "author": "Nick Sleep",
 "end": "Quotations and ringed passages are from the Nomad Investment Partnership letters (Sleep, Zakaria and Company), with the letter period and PDF page shown. Lines marked “our note” are our own reading.",
 "thumb": {"kicker": "NICK SLEEP · THE NOMAD LETTERS", "l1": "P/E 1,500.", "l2": "Still cheap?", "sub": "Wal-Mart, 1972 → 10% a year for decades"},
 "description": """Why great businesses look expensive, explained simply: Nick Sleep's Wal-Mart chart (over 150x the 1972 price and still 10% a year), the "Barbie problem", the 1-in-10 growth odds, the fund that sold IBM and then Wal-Mart, and his 2006 Amazon maths, plus a simple test for Indian investors. From the original Nomad letters.

Every ringed passage is shown on the real letter page, with the letter period and page. Lines marked "our note" are our own reading. We do not say any listed company is cheap.""",
 "sources": """Sources (Nomad letters, compiled edition; page = PDF page)
- Letter, period ended 31 Dec 2006: p.105 (Amazon free cash flow; ~US$26 cash-cow value; "your growth spending has no value")
- Letter, period ended 30 Jun 2009: p.160 (Walton family; IBM and Wal-Mart sales; Barbie problem), p.161 (look active; growth-stock odds, research cited by Sleep; cheap for decades), p.162 (Wal-Mart chart; 150x; 200x earnings; thrift orientation)""",
 "tags": "apparent overvaluation, high pe ratio stocks, is a high pe bad, nick sleep walmart, growth vs value investing, overvalued stocks explained, nick sleep letters, pe ratio explained",
}
