# The Letter · Video 48 · Nick Sleep · "The Nomad letters explained" (16:9, fixed fund-letter styles).
# Source script: DarwinWiki contentengine/youtube/letters_scripts/sleep/48_nomad_letters_explained.md (fact sheet there).
# `page` values are hints from the 218-page edition; build_letter.py moves each to the nearest page that has `find`.
PDF = "/Users/akkarthikeyan/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Full Collection Nomad Letters Nick Sleep.pdf"
VOICE = "English_Diligent_Man"
I04 = "Nomad letter, period ended 30 Jun 2004"
I06 = "Nomad letter, period ended 30 Jun 2006"
I08 = "Nomad letter, period ended 30 Jun 2008"
A09 = "Nomad letter, period ended 31 Dec 2009"
A12 = "Nomad letter, period ended 31 Dec 2012"
A13 = "Nomad letter, period ended 31 Dec 2013"
PST = "Postamble to the compiled letters, 2021"

B = lambda key, ch, say, **scene: {"key": key, "ch": ch, "say": say, "scene": scene}

BEATS = [
 # ---- cold open ----
 B("b00", 0, "In 2006, Nick Sleep and his partner Zak set up their own firm to run the Nomad fund, and applied to Britain's financial regulator. On the form, they said the fund made an average of three trades a month.",
   type="title", kicker="LONDON", lines=["2006"], sub="A form for the regulator"),
 B("b01", 0, "The regulator came back puzzled. Surely, they asked, you have missed off some zeros? But there was no mistake. Nomad held its shares for about five years on average.",
   type="page", page=94, find="you have missed off the noughts", src=I06 + " · p.94", at="missed off some zeros"),
 B("b02", 0, "Imagine telling your CA you filed only three bills all month, and he asks if the other three hundred are in your scooter's dickey.",
   type="ours", q="Only three bills this month, sir.", sync="three bills", em=["three"]),
 B("b03", 0, "", type="title", kicker="NICK SLEEP · THE NOMAD LETTERS", lines=["The Fund That", "Said No"], silent=4.0),
 B("b04", 0, "This video is about how Nomad was run. Because the way Sleep treated his own investors teaches as much as the stocks he picked.",
   type="ours", q="How you treat your investors is part of the investment.", sync="the way Sleep treated", em=["investors"]),
 # ---- I ----
 B("b10", 1, "", type="title", kicker="PART ONE", lines=["No Performance, No Fees"], silent=2.6),
 B("b11", 1, "In 2004, Sleep took a swipe at what he called closet index funds. Managers who charge high fees for active stock picking, while quietly holding something very close to the whole market. At Nomad, he wrote, no performance means no fees. That's the way it should be.",
   type="page", page=34, find="no performance means no fees", src=I04 + " · p.34", at="no performance means no fees"),
 B("b12", 1, "Imagine a restaurant that only charges you if the food is actually good. You'd trust that restaurant. A lot of fund fees work like a restaurant that bills you even when the dal is burnt, and then adds a service charge.",
   type="list", ours=True, items=[["Food good → you pay", "only charges you if"], ["Dal burnt → you still pay", "the dal is burnt"], ["+ service charge", "service charge"]]),
 # ---- II ----
 B("b20", 2, "", type="title", kicker="PART TWO", lines=["The Fund That Said No"], silent=2.6),
 B("b21", 2, "Most fund managers want as much money as possible, because fees grow with size. Nomad was usually closed to new money. Sleep wrote that job one, two and three for a manager is investment performance, not gathering assets.",
   type="page", page=35, find="Job one, two and three for your manager", src=I04 + " · p.35", at="job one, two and three"),
 B("b22", 2, "Had they accepted everyone, he said, the fund would have been about three times bigger, but with worse results.",
   type="page", page=35, find="approximately three times", src=I04 + " · p.35", at="three times bigger"),
 B("b23", 2, "They would reopen only when prices were low. And he listed a meltdown in big company shares, adding the word please in brackets, as the kind of moment they hoped for.",
   type="page", page=35, find="large capitalization shares (please)", src=I04 + " · p.35", at="the word please"),
 B("b24", 2, "A fund manager hoping for a crash, so he can take your money when it's worth the most. That's either brilliant, or slightly mad. It was brilliant.",
   type="ours", q="Brilliant, or slightly mad?", sync="brilliant, or slightly mad", em=["Brilliant,", "mad?"]),
 # ---- III ----
 B("b30", 3, "", type="title", kicker="PART THREE", lines=["The Fee That Shrank"], silent=2.6),
 B("b31", 3, "When they set up their own firm, Sleep described the new fees. The management fee would simply pay the firm's running costs, capped at one percent a year, with any shortfall paid out of their own pockets. The fee, he said, should not be a profit centre.",
   type="page", page=99, find="should not be a profits centre", src=I06 + " · p.99", at="own pockets"),
 B("b32", 3, "And as the fund grew, the fee would fall as a percentage, so every investor shared in the savings of a bigger fund. That's the scale economies shared idea from video forty-six, applied to themselves.",
   type="ours", q="Bigger fund → smaller fee, for everyone.", sync="as the fund grew", em=["smaller"]),
 B("b33", 3, "The performance fee would only count above a six percent yearly hurdle, and it would be held back, and paid back to investors if results later went bad.",
   type="list", ours=True, head="THE PERFORMANCE FEE", items=[["Only above a 6% hurdle", "six percent"], ["Held back", "held back"], ["Paid back if results go bad", "paid back to investors"]], src=I06),
 B("b34", 3, "They even had their lawyers make sure Nomad could never be sold to another fund manager. So you'd never wake up to find a stranger running your money, while your old manager caught a plane to Hawaii. His line:",
   type="page", page=99, find="catches a plane to Hawaii", src=I06 + " · p.99", at="plane to Hawaii"),
 B("b35", 3, "You can sack us, but we won't sell you.",
   type="quote", q="You can sack us, but we won’t sell you.", em=["sack", "sell"], sync="You can sack us", src=I06 + " · p.99"),
 # ---- IV ----
 B("b40", 4, "", type="title", kicker="PART FOUR", lines=["Stocks Are Not", "Like Children"], silent=2.6),
 B("b41", 4, "Nomad also owned very few stocks. Sleep explained why with a lovely line. When children are born, he said, they seem to bring their own love with them. But stocks are not like children. The more stocks you own, the less you care about each one.",
   type="page", page=37, find="stocks are not like children", src=I04 + " · p.37", at="stocks are not like children"),
 B("b42", 4, "He even said he'd take bumpier yearly results if it meant better five year results. And investors who disagreed, he said, should think long and hard about staying.",
   type="page", page=37, find="think long and hard about your investment in Nomad", src=I04 + " · p.37", at="think long and hard"),
 B("b43", 4, "So yes. A fund manager who politely told his own customers: if you want a smooth ride, maybe take the other bus.",
   type="ours", q="Want a smooth ride? Take the other bus.", sync="if you want a smooth ride", em=["other", "bus."]),
 # ---- V ----
 B("b50", 5, "", type="title", kicker="PART FIVE", lines=["The Renters"], silent=2.6),
 B("b51", 5, "One number from his 2008 letter explains why patient investors can win. Across the market, the American shares Nomad owned were held for an average of just fifty-one days.",
   type="stat", big="51", after="days · average holding period of Nomad's US stocks", at="fifty-one days", src=I08 + " · p.141"),
 B("b52", 5, "Fifty-one days. That's less time than most people take to return a borrowed pressure cooker.",
   type="ours", q="Less time than returning a borrowed pressure cooker.", sync="less time than", em=["pressure", "cooker."]),
 B("b53", 5, "Sleep called those people renters. And the renters were setting the daily prices of businesses Nomad planned to own for years. That gap, he said, was the whole investment case for Nomad, in a nutshell.",
   type="page", page=141, find="(the renters)", src=I08 + " · p.141", at="renters"),
 # ---- VI ----
 B("b60", 6, "", type="title", kicker="PART SIX", lines=["Honest About", "The Small Things"], silent=2.6),
 B("b61", 6, "The letters are funny about their own flaws, too. In 2012, a property agent told Sleep that nobody cares about the pennies any more. And Sleep admitted that he and Zak looked at their shoes, because the rent at their own office was, he whispered, a round number. We still have much to learn, he wrote.",
   type="page", page=203, find="at Galactic HQ is", src=A12 + " · p.203", at="looked at their shoes"),
 B("b62", 6, "A fund manager admitting he overpaid on rent. In a letter. To investors. That's rarer than a bank queue with only one person in it.",
   type="ours", q="Rarer than a bank queue with one person in it.", sync="rarer than", em=["one", "person"]),
 B("b63", 6, "And from 2009, the footnotes in every letter began with India. There is, they'd been told, a ticket counter at an Indian railway station with a sign that says: No Bamboozlement Here.",
   type="page", page=171, find="No Bamboozlement Here", src=A09 + " · p.171", at="No Bamboozlement"),
 # ---- VII ----
 B("b70", 7, "", type="title", kicker="PART SEVEN", lines=["Why They Closed"], silent=2.6),
 B("b71", 7, "In early 2014, Nomad returned its money and closed. Years later, Sleep and Zak explained why. Regulation had become irksome. They didn't want to keep justifying every action to a revolving door of interested parties. And they felt they'd got everything they could out of their method.",
   type="page", page=218, find="revolving door of interested parties", src=PST + " · p.218", at="revolving door"),
 B("b72", 7, "They said they didn't enjoy closing one bit. By then, a dollar invested at the start had grown to about ten dollars, before fees.",
   type="page", page=211, find="$10.21", src=A13 + " · p.211 · unaudited, before fees", at="about ten dollars"),
 # ---- VIII ----
 B("b80", 8, "", type="title", kicker="THE INDIA LENS", lines=["The Nomad Test"], silent=2.6),
 B("b81", 8, "In India, whether you use a mutual fund, a PMS or an AIF, you can hold your manager to Nomad's standards. Five questions. How are they paid? Do they ever say no to new money? How often do they trade? Do they own a real stake in their own fund? And do their letters admit mistakes?",
   type="list", ours=True, flat=True, head="THE NOMAD TEST", items=[["1 · How are they paid?", "How are they paid"], ["2 · Ever say no to money?", "say no to new money"], ["3 · How often do they trade?", "How often do they trade"], ["4 · Own stake in the fund?", "Do they own a real stake"], ["5 · Letters admit mistakes?", "admit mistakes"]]),
 B("b82", 8, "Very few will pass all five. That doesn't make the rest crooks. It tells you whose interests come first. And if nobody passes, a low cost index fund is a perfectly good answer.",
   type="ours", q="It tells you whose interests come first.", sync="It tells you", em=["interests"]),
 # ---- IX ----
 B("b90", 9, "", type="title", kicker="PART EIGHT", lines=["What People Get Wrong"], silent=2.6),
 B("b91", 9, "One. A fund that says no to money must be arrogant. No. Too much money would have made results worse for the people already in. Two. Low trading means a lazy manager. No. The letters show years of reading and company visits behind every rare trade. Three. Nomad's style suits everyone. Sleep himself said it didn't.",
   type="list", ours=True, flat=True, items=[["✗  Saying no = arrogance", "must be arrogant"], ["✗  Low trading = lazy", "lazy manager"], ["✗  It suits everyone", "suits everyone"]]),
 # ---- close ----
 B("c00", 10, "One line for your friend over chai. A good fund manager earns when you earn, says no to easy money, and tells you the truth.",
   type="ours", q="Earns when you earn. Says no to easy money. Tells you the truth.", sync="A good fund manager", em=["truth."], lastTick=True),
 B("c01", 10, "Next. Sleep's hardest discipline: not selling his best ideas, even after they'd doubled.",
   type="ours", q="Next: why he refused to sell.", sync="not selling", em=["refused"]),
 B("c02", 10, "", type="end", silent=7.0),
]

CHAPTERS = ["Missed off the noughts", "No performance, no fees", "The fund that said no", "The fee that shrank", "Stocks are not like children",
            "The renters", "Honest about the small things", "Why they closed", "The India lens: the Nomad test", "What people get wrong", "The Chai Test"]

META = {
 "title": "The Fund Manager Who Refused Your Money | Nick Sleep's Nomad Letters Explained",
 "author": "Nick Sleep",
 "end": "Quotations and ringed passages are from the Nomad Investment Partnership letters (Sleep, Zakaria and Company) and the 2021 postamble, with the letter period and PDF page shown. Lines marked “our note” are our own reading.",
 "thumb": {"kicker": "NICK SLEEP · THE NOMAD LETTERS", "l1": "The fund that", "l2": "said no", "sub": "“No performance means no fees”"},
 "description": """How Nick Sleep ran the Nomad Investment Partnership: "no performance means no fees", a fund usually closed to new money, a fee that shrank as the fund grew, 51-day "renters", "No Bamboozlement Here", and why they closed in 2014, plus five questions to ask any Indian fund manager. From the original Nomad letters.

Every ringed passage is shown on the real letter page, with the letter period and page. Lines marked "our note" are our own reading.""",
 "sources": """Sources (Nomad letters, compiled edition; page = PDF page)
- Letter, period ended 30 Jun 2004: p.34 (closet indexers; no performance, no fees), p.35 (job one, two and three; ~3x size; reopen "(please)"), p.37 (stocks are not like children)
- Letter, period ended 30 Jun 2006: p.94 (regulator: three trades a month), p.99 (fees; "You can sack us, but we won't sell you")
- Letter, period ended 30 Jun 2008: p.141 (51-day holding period; renters)
- Annual letter, period ended 31 Dec 2009: p.171 ("No Bamboozlement Here")
- Annual letter, period ended 31 Dec 2012: p.210 (pennies and a round-number rent)
- Annual letter, period ended 31 Dec 2013: p.218 (results, unaudited, before fees)
- Postamble to the compiled letters, 2021: p.225 (why they closed)""",
 "tags": "nomad investment partnership letters, nick sleep, how to choose a fund manager, performance fee explained, pms aif fees india, long term investing, nick sleep letters, mutual fund fees",
}
