# The Letter · Video 49 · Nick Sleep · "Why Nick Sleep refused to sell his best ideas" (16:9, fixed fund-letter styles).
# Source script: DarwinWiki contentengine/youtube/letters_scripts/sleep/49_why_sleep_refused_to_sell.md (fact sheet there).
# `page` values are hints from the 218-page edition; build_letter.py moves each to the nearest page that has `find`.
PDF = "/Users/akkarthikeyan/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Full Collection Nomad Letters Nick Sleep.pdf"
VOICE = "English_Diligent_Man"
A04 = "Nomad letter, period ended 31 Dec 2004"
A05 = "Nomad letter, period ended 31 Dec 2005"
I07 = "Nomad letter, period ended 30 Jun 2007"
A08 = "Nomad letter, period ended 31 Dec 2008"
I09 = "Nomad letter, period ended 30 Jun 2009"
A09 = "Nomad letter, period ended 31 Dec 2009"
A13 = "Nomad letter, period ended 31 Dec 2013"

B = lambda key, ch, say, **scene: {"key": key, "ch": ch, "say": say, "scene": scene}

BEATS = [
 # ---- cold open ----
 B("c00", 0, "Imagine a batsman who scores a lovely fifty. The pitch is flat. The bowlers are tired. And he walks off, all by himself. Why? Fifty is a good score, yaar. Why take risk?",
   type="ours", q="Fifty is a good score, yaar. Why take risk?", sync="Fifty is a good score", em=["risk?"]),
 B("c01", 0, "You'd call it madness. But this is exactly what most investors do with their best stocks. The stock doubles, and everyone around them says the same two words. Book profit.",
   type="ours", q="“Book profit.”", sync="the same two words", em=["profit.”"]),
 B("c02", 0, "In 2007, Nick Sleep faced that moment. Amazon's share price had doubled, and it had become a big part of his fund. He wrote that it would be easy for him and Zak to claim victory, do a high five, and sell. They didn't.",
   type="page", page=120, find="claim victory, high five, and sell our shares in Amazon", src=I07 + " · p.120", at="claim victory"),
 B("c03", 0, "", type="title", kicker="NICK SLEEP · THE NOMAD LETTERS", lines=["Why He Refused", "To Sell"], silent=4.0),
 # ---- I ----
 B("c10", 1, "", type="title", kicker="PART ONE", lines=["The Invisible Mistake"], silent=2.6),
 B("c11", 1, "Sleep believed the biggest mistake an investor can make is not buying a bad company. It's selling a great company too early. In his words, selling a Wal-Mart or a Microsoft in the early years of its growth.",
   type="page", page=120, find="the biggest error an investor can make is the sale of a Wal-Mart", src=I07 + " · p.120", at="selling a Wal-Mart"),
 B("c12", 1, "Here's why, in simple rupees. Mistake one. You buy a company for a hundred rupees, and it goes bust. You lose a hundred. Mistake two. You buy for a hundred, sell at two hundred, and it goes on to be worth a thousand. You missed eight hundred.",
   type="list", ours=True, head="IN SIMPLE RUPEES", items=[["Mistake 1: goes bust → lose ₹100", "Mistake one"], ["Mistake 2: sold at ₹200, later ₹1,000", "Mistake two"], ["→ missed ₹800", "You missed eight hundred"]]),
 B("c13", 1, "The first mistake hurts, but it's capped. You can never lose more than you put in. The second has no cap at all. And it never shows up anywhere. Sleep pointed out that missed gains go unrecorded in performance records.",
   type="page", page=120, find="opportunity costs go unrecorded in performance records", src=I07 + " · p.120", at="go unrecorded"),
 B("c14", 1, "It's like your school report card. It shows your marks. It never shows the rank you'd have got if you had actually studied.",
   type="ours", q="Your report card never shows the rank you could have got.", sync="It's like your school", em=["could"]),
 # ---- II ----
 B("c20", 2, "", type="title", kicker="PART TWO", lines=["The Bus Company, Again"], silent=2.6),
 B("c21", 2, "Sleep had personal proof. He wrote that Nomad's greatest error was not Conseco, the company that went bankrupt on him. It was selling Stagecoach, the British bus company, which kept rising after he sold.",
   type="page", page=120, find="our greatest error was the sale of Stagecoach", src=I07 + " · p.120", at="greatest error"),
 B("c22", 2, "The bankrupt company cost money. The early sale cost more.",
   type="ours", q="The bankruptcy cost money. The early sale cost more.", sync="The bankrupt company", em=["more."]),
 # ---- III ----
 B("c30", 3, "", type="title", kicker="PART THREE", lines=["Why Smart People", "Sell Winners"], silent=2.6),
 B("c31", 3, "So why does everyone sell too early? Sleep listed the reasons, and they're painfully human. The stock has gone up, so it must be okay to sell. Other people are selling, so it must be okay for us too. Psychological mistakes, he said, not analysis.",
   type="page", page=77, find="the stock has risen in price so it is OK to sell", src=A05 + " · p.77", at="must be okay to sell"),
 B("c32", 3, "In 2009 he added the professional reasons. Fund managers have to look active. Marketing wants new stories. And some managers sell their winners just to look diversified to clients.",
   type="page", page=161, find="fund managers sell their winners in order to appear diversified", src=I09 + " · p.161", at="sell their winners"),
 B("c33", 3, "Notice what's missing from that list. The business got worse. None of these reasons are about the business.",
   type="ours", q="Missing from the list: “the business got worse.”", sync="Notice what's missing", em=["worse.”"]),
 B("c34", 3, "In India we have an extra reason. Relatives. The moment your stock doubles, some uncle at a wedding says: beta, profit book kar lo. Uncle has never booked a profit in his life. But the advice is free, so it keeps coming.",
   type="ours", q="“Beta, profit book kar lo.”", sync="some uncle at a wedding", em=["book"]),
 # ---- IV ----
 B("c40", 4, "", type="title", kicker="PART FOUR", lines=["Start at 100%"], silent=2.6),
 B("c41", 4, "Most funds build a holding slowly. One percent, then two, then three. So their best ideas almost never become big holdings. In 2007 Sleep suggested turning it upside down. Start at a hundred percent, and work down.",
   type="page", page=120, find="start at a hundred percent", src=I07 + " · p.120", at="Start at a hundred percent"),
 B("c42", 4, "He wasn't suggesting the whole fund in Amazon. Well, not just yet, he joked. And about Costco, back in 2004, he wrote that his first mistake might have been not buying enough.",
   type="page", page=52, find="made his first mistake investing in Costco", src=A04 + " · p.52", at="not buying enough"),
 # ---- V ----
 B("c50", 5, "", type="title", kicker="PART FIVE", lines=["The Price of Holding On"], silent=2.6),
 B("c51", 5, "Now the honest part. With about one sixth of the fund in Amazon, Sleep warned that results would swing more in the short term. Then he added: the volatility does not bother Zak and me one jot.",
   type="quote", q="The volatility does not bother Zak and me one jot.", em=["one", "jot."], sync="the volatility does not", src=I07 + " · p.120"),
 B("c52", 5, "A year later, it got tested. In 2008 Nomad fell forty-five point three percent. The world index fell forty point seven. Brutal.",
   type="stat", big="−45.3%", after="Nomad in 2008 (unaudited, before fees)", at="forty-five point three", second="−40.7%", second_label="MSCI World Index (net) US$", second_at="forty point seven", src=A08 + " · p.147 · unaudited, before fees"),
 B("c53", 5, "But in 2009, Nomad rose seventy-one point five percent.",
   type="stat", big="+71.5%", after="Nomad in 2009 (unaudited, before fees)", at="seventy-one point five", src=A09 + " · p.167 · unaudited, before fees"),
 B("c54", 5, "And most investors held on too. Withdrawals during the crisis were less than two percent of the fund.",
   type="page", page=154, find="less than two percent of the Partnership", src=A08 + " · p.154", at="less than two percent"),
 B("c55", 5, "A year later Sleep told them that the simple decision not to redeem had earned them something like seventy percent, and counting. Sometimes the best thing you can do with a great investment is absolutely nothing. Which, for most of us, is the hardest thing in the world.",
   type="page", page=167, find="order of seventy percent (and counting!)", src=A09 + " · p.167", at="seventy percent"),
 # ---- VI ----
 B("c60", 6, "", type="title", kicker="PART SIX", lines=["So When Do You Sell?"], silent=2.6),
 B("c61", 6, "Is the lesson never sell? No. Remember Conseco. Sleep held on too long because he didn't update his view when the business changed. So the rule isn't about the price. It's about the destination. Sell when the business stops heading where you thought. Not just because the price went up.",
   type="list", ours=True, flat=True, items=[["✓ Sell: the business changed direction", "Sell when the business"], ["✗ Sell: the price went up", "the price went up"]]),
 # ---- VII ----
 B("c70", 7, "", type="title", kicker="THE INDIA LENS", lines=["Before You Book Profit"], silent=2.6),
 B("c71", 7, "Next time a stock you own goes up a lot, ask three questions. One. Has the business changed, or only the price? Two. If I had the cash today, would I still want to own this business for ten years? Three. Am I selling because of analysis, or because of an uncle, a WhatsApp group, or the urge to feel smart?",
   type="list", ours=True, flat=True, head="BEFORE I SELL", items=[["1 · Business changed, or only the price?", "Has the business changed"], ["2 · Would I buy it today, for 10 years?", "If I had the cash today"], ["3 · Analysis, or uncle + WhatsApp?", "Am I selling because"]]),
 B("c72", 7, "If the business is getting stronger, a rising price is a report card, not an exit sign.",
   type="ours", q="A rising price is a report card, not an exit sign.", sync="a rising price", em=["report", "card,"]),
 # ---- VIII ----
 B("c80", 8, "", type="title", kicker="PART SEVEN", lines=["What People Get Wrong"], silent=2.6),
 B("c81", 8, "One. You never go broke booking profits. True. But you can stay small forever doing it. Two. A stock that has doubled must be expensive now. Not if the business has more than doubled in value. Three. Big holdings are reckless. They can be, if you don't understand the business. Sleep's big bets came after years of study, and he warned his investors about the bumps in advance.",
   type="list", ours=True, flat=True, items=[["✗  Booking profits is always safe", "booking profits"], ["✗  Doubled = expensive", "doubled must be expensive"], ["✗  Big = reckless", "Big holdings are reckless"]]),
 # ---- close ----
 B("d00", 9, "One line for your friend over chai. Don't cut down the mango tree the year it finally gives mangoes.",
   type="ours", q="Don't cut down the mango tree the year it finally gives mangoes.", sync="Don't cut down", em=["mangoes."], lastTick=True),
 B("d01", 9, "Next. Sleep showed you could have paid over a hundred and fifty times Wal-Mart's 1972 share price, and still made ten percent a year. How can a great business look expensive, and still be cheap?",
   type="page", page=162, find="over one hundred and fifty times the prevailing share price", src=I09 + " · p.162", at="a hundred and fifty times"),
 B("d02", 9, "", type="end", silent=7.0),
]

CHAPTERS = ["Declaring at fifty", "The invisible mistake", "The bus company, again", "Why smart people sell winners", "Start at 100%",
            "The price of holding on", "So when do you sell?", "The India lens: before you book profit", "What people get wrong", "The Chai Test"]

META = {
 "title": "Amazon Doubled. He Didn't Sell. | Nick Sleep on Selling Winners Too Early",
 "author": "Nick Sleep",
 "end": "Quotations and ringed passages are from the Nomad Investment Partnership letters (Sleep, Zakaria and Company), with the letter period and PDF page shown. Lines marked “our note” are our own reading.",
 "thumb": {"kicker": "NICK SLEEP · THE NOMAD LETTERS", "l1": "Why declare", "l2": "at fifty?", "sub": "Amazon doubled. He didn't sell."},
 "description": """Why Nick Sleep didn't sell Amazon after it doubled: the invisible cost of selling winners early, why his worst mistake was a sale and not a bankruptcy, "start at 100% and work down", living through 2008, and three questions to ask before you "book profit". From the original Nomad letters.

Every ringed passage is shown on the real letter page, with the letter period and page. Lines marked "our note" are our own reading.""",
 "sources": """Sources (Nomad letters, compiled edition; page = PDF page)
- Letter, period ended 31 Dec 2004: p.52 (Costco: not buying enough)
- Letter, period ended 31 Dec 2005: p.77 (why institutions sell)
- Letter, period ended 30 Jun 2007: p.120 (Amazon doubled; the biggest error; Stagecoach; start at 100%; one sixth; "one jot")
- Letter, period ended 31 Dec 2008: p.154 (redemptions under 2%)
- Letters, periods ended 30 Jun and 31 Dec 2009: p.161-162 (why managers sell winners; Wal-Mart), p.167 (not redeeming: ~70%)
- Letter, period ended 31 Dec 2008: p.147 (2008 result); letter, period ended 31 Dec 2009: p.167 (2009 result); unaudited, before fees""",
 "tags": "nick sleep amazon costco, when to sell a stock, selling winners too early, profit booking, concentrated portfolio, opportunity cost investing, nick sleep letters, nomad investment partnership",
}
