#!/usr/bin/env python3
"""Q2 bank forensic napkin Shorts (4 Oct 2026): BoB overseas loans (bka), Bandhan deposit mix (bkb), Ujjivan book shift (bkc).
Indian-accent narrator (AK 3 Oct). Figures from the banks' own Q2 FY27 filings (1–3 Oct 2026); splits are our arithmetic.
Usage: hand_banks.py [bka bkb bkc]"""
import json, sys, pathlib
sys.path.insert(0, "/Volumes/DarwinSSD/MMVideo/scripts")
from build_vx import tts
from voices import MALE
VOICE = MALE
ROOT = pathlib.Path("/Volumes/DarwinSSD/MMVideo/public/hand")
SHORTS = {
 "bka": [
  ("a1", "Bank of Baroda's loans grew eighteen percent. Here's what the headline hides."),
  ("a2", "Global loans, fifteen point one two lakh crore. Minus loans in India, eleven point eight eight lakh crore. That leaves three point two four lakh crore abroad."),
  ("a3", "It grew forty percent in a year. Loans in India grew thirteen and a half."),
  ("a4", "So twenty one percent of the book delivered thirty nine percent of the growth."),
  ("a5", "And it's not just Baroda. P N B's overseas loans grew sixty three percent. So where is the growth really coming from? Back to the napkin."),
 ],
 "bkb": [
  ("b1", "Bandhan Bank's deposits grew seven thousand eight hundred crore in three months. Sounds good. Look closer."),
  ("b2", "Retail term deposits, up five thousand eight hundred crore. Bulk deposits, up four thousand three hundred crore."),
  ("b3", "But CASA, the cheapest money, fell two thousand three hundred crore."),
  ("b4", "Cheap money out, costly money in. The CASA ratio fell from twenty nine point four to twenty six point seven percent."),
  ("b5", "So will every new loan cost Bandhan more to fund? Back to the napkin."),
 ],
 "bkc": [
  ("c1", "Ujjivan started as a microfinance lender. Its own numbers say it's changing."),
  ("c2", "Group loans, its microfinance core, were thirty eight percent of the book a year ago. Now, thirty four."),
  ("c3", "Secured loans went from forty seven percent of the book to fifty two."),
  ("c4", "And bad loans fell, from two point four five percent to two point one, while write offs dropped from two hundred and thirteen crore to forty three."),
  ("c5", "A cleaner book, without writing off more. Is it still a microfinance bank? Back to the napkin."),
 ],
 "bkd": [
  ("d1", "Bank of Baroda's savers are in India. Its fastest growing borrowers aren't."),
  ("d2", "Clue one. In India, deposits grew seventy five thousand crore more than loans."),
  ("d3", "Clue two. Abroad, loans grew fifty seven thousand crore more than deposits."),
  ("d4", "The twist. Overseas loans are a fifth of the book, but forty percent of the growth."),
  ("d5", "So, is it bad? Not by itself. The moat is at home. Indians hand Baroda more deposits than it lends here."),
  ("d6", "The open question is abroad. Who borrows, and what do they pay? Back to the napkin."),
 ],
 "bke": [
  ("e1", "Union Bank lent two hundred and thirteen rupees for every hundred it raised."),
  ("e2", "Clue one. In a year, loans grew one lakh eighty thousand crore. Deposits grew just eighty five thousand crore."),
  ("e3", "Clue two. The deposits it skipped were the costly ones. Fixed deposits grew three percent. Cheap CASA grew fifteen."),
  ("e4", "The twist. Cheaper money, but not enough of it. The loan to deposit ratio jumped from seventy seven to eighty four percent."),
  ("e5", "Smart funding, thinner cushion. Can deposits catch up? Back to the napkin."),
 ],
 "bkf": [
  ("f1", "Bank of India pulled in seventy five thousand crore of deposits in ninety days."),
  ("f2", "Clue one. That's forty four percent of its whole year's deposit growth, in one quarter."),
  ("f3", "Clue two. In the same quarter, it lent only twenty nine thousand crore in India."),
  ("f4", "The twist. Its loan to deposit ratio fell, from eighty two to seventy eight percent. The fastest deposit growth of the eight government banks that have reported."),
  ("f5", "Plenty of fuel to lend. But will this money stay after the quarter ends? Back to the napkin."),
 ],
 "bkg": [
  ("g1", "Two banks from Thrissur, both about a hundred years old, are turning into gold loan banks."),
  ("g2", "Clue one. C S B Bank. Gold loans are now fifty three percent of all its loans, up from forty seven."),
  ("g3", "Clue two. Dhanlaxmi Bank. Forty three percent, up from thirty four."),
  ("g4", "The twist. At Dhanlaxmi, gold and small business loans grew more than the whole book. Everything else shrank."),
  ("g5", "Gold loans are secured, so today's book looks safe. But it's one bet, on one metal. What if gold prices fall? Back to the napkin."),
 ],
 "bkh": [
  ("h1", "E S A F Small Finance Bank wrote off six hundred and twenty five crore of loans in three months."),
  ("h2", "Clue one. The filing mentions it to explain growth. Without the write off, loans would have grown twenty eight percent, not twenty five."),
  ("h3", "Clue two. Flip it. That's two point six percent of the entire loan book, off the books in one quarter."),
  ("h4", "The twist. Ujjivan, nearly twice the size, wrote off forty three crore."),
  ("h5", "Clean up, or warning sign? The results will show the cost. Back to the napkin."),
 ],
 "bki": [
  ("i1", "Its peers are pulling back from microfinance. Equitas is walking in."),
  ("i2", "Clue one. Ujjivan's group loans? Down to thirty four percent of its book. E S A F's micro loans? They shrank this quarter."),
  ("i3", "Clue two. Equitas's microfinance and micro loans? Up seventy percent in a year, even after removing loans it bought."),
  ("i4", "The twist. The fuel is costly. Cheap CASA deposits fell one percent, while total deposits rose nineteen."),
  ("i5", "Brave contrarian, or early to a recovery? Back to the napkin."),
 ],
 "bkj": [
  ("j1", "J and K Bank has a moat most banks would envy. Forty two percent of its deposits are cheap current and savings money."),
  ("j2", "Clue one. A year ago, it was forty six."),
  ("j3", "Clue two. New deposits this year, twenty four thousand eight hundred crore. Cheap CASA brought just four and a half thousand."),
  ("j4", "The twist. The other eighty two percent came from costlier term deposits. Loans grew twenty four percent, so the bank needed the money."),
  ("j5", "The moat is still wide, but it's getting thinner. Back to the napkin."),
 ],
 "bkk": [
  ("k1", "Thirteen of the twenty two banks we track lent more than they raised this year. A U Small Finance Bank did the opposite."),
  ("k2", "Clue one. Loans grew thirty three thousand crore. Deposits grew thirty eight thousand crore."),
  ("k3", "Clue two. Cheap CASA grew twenty nine percent, as fast as total deposits. So the CASA ratio held, at twenty nine and a half."),
  ("k4", "The twist. The headline loan growth, twenty eight percent, is helped by selling fewer loans. The full portfolio grew twenty five."),
  ("k5", "Still, that's a deposit engine keeping pace. Back to the napkin."),
 ],
 "bkl": [
  ("l1", "This bank is a hundred and five years old. It's growing like a startup."),
  ("l2", "Clue one. Tamilnad Mercantile Bank's loans grew twenty nine percent. Of twenty two banks, only two small finance banks grew faster."),
  ("l3", "Clue two. To fund it, deposits grew twenty five percent."),
  ("l4", "The twist. Eighty two of every hundred new rupees came as costlier term deposits. Cheap CASA fell from twenty seven to twenty five percent of deposits."),
  ("l5", "Fast growth, pricier fuel. Can it keep both? Back to the napkin."),
 ],
 "bkm": [
  ("m1", "Bank of Baroda's India deposits grew faster than its India loans. Canara Bank did the opposite."),
  ("m2", "Clue one. Canara's loans in India grew seventeen percent. Its deposits in India grew eleven. Loans outran deposits by twenty nine thousand crore."),
  ("m3", "Clue two. P N B's overseas loans grew sixty three percent."),
  ("m4", "The twist. P N B now lends a hundred and twenty nine rupees abroad for every hundred it holds there. A year ago, ninety seven."),
  ("m5", "Two banks, two different gaps. How will they fill them? Back to the napkin."),
 ],
 "bkn": [
  ("n1", "Union Bank lent two hundred and thirteen for every hundred it raised. Meet number two."),
  ("n2", "Clue one. Karnataka Bank's loans grew eighteen thousand crore. Deposits, just twelve thousand. A hundred and forty nine for every hundred."),
  ("n3", "Clue two. Its loan to deposit ratio jumped from seventy two to eighty percent."),
  ("n4", "The twist. The cheap money held up. CASA grew fifteen percent, faster than deposits."),
  ("n5", "Growing fast, funding well, but the cushion is thinning. Back to the napkin."),
 ],
 "bko": [
  ("o1", "Twenty two banks. One question. For every hundred rupees of new deposits, how much did they lend?"),
  ("o2", "Clue one. Union Bank, two hundred and thirteen. Karnataka Bank, one forty nine. Equitas, one thirty eight."),
  ("o3", "Clue two. At the other end, Bank of India and IDBI, seventy nine."),
  ("o4", "The twist. Thirteen of twenty two lent more than they raised. That works, until deposits get expensive."),
  ("o5", "Find your bank. Pause the video. Back to the napkin."),
 ],
 "bkp": [
  ("p1", "This bank's bad loans fell by more than half in ninety days."),
  ("p2", "Clue one. Suryoday Small Finance Bank. Bad loans, six point five percent in June. Two point nine percent in September."),
  ("p3", "Clue two. In the same quarter, it wrote off five hundred and ninety one crore of loans."),
  ("p4", "The twist. Put the write off back, and bad loans are about six point six percent. Right where they were in June."),
  ("p5", "And provisions cover just thirty one percent of what's left. Cleaner book, or cleaner number? Back to the napkin."),
 ],
 "bkq": [
  ("q1", "Angel One's commodity trading doubled. So why did its share drop twenty one points?"),
  ("q2", "Clue one. Today: two thousand four hundred and thirty eight billion a day. Forty four percent."),
  ("q3", "Clue two. A year ago, eleven eighty seven billion. Sixty five point one percent."),
  ("q4", "The twist. Divide turnover by share. The market went from eighteen hundred to fifty five hundred billion a day. It tripled."),
  ("q5", "Its futures and options share held. New commodity traders went elsewhere. Back to the napkin."),
 ],
 "bkr": [
  ("r1", "Angel One's commodity trading doubled."),
  ("r2", "Its market share fell to forty one point seven percent."),
  ("r3", "How? The market tripled. Angel One only doubled."),
  ("r4", "In twenty twenty one, it had twenty eight percent. It built that to sixty seven point six."),
  ("r5", "Now about two thirds of that climb is gone."),
  ("r6", "Its futures and options share? Held at twenty two percent."),
  ("r7", "So it's losing the new traders, not the old ones. Because"),
 ],
 "bks": [
  ("s1", "India's jewellers grew up to twenty nine percent."),
  ("s2", "Gold prices rose twenty eight percent."),
  ("s3", "So the same grams, at higher prices."),
  ("s4", "Existing stores grew less than gold did."),
  ("s5", "So who's actually growing? Diamonds. Seven percent, by volume."),
  ("s6", "Last year gold rose forty three percent. Senco grew six and a half."),
  ("s7", "So is it demand, or just the price of gold? Because"),
 ],
 "bkt": [
  ("t1", "T C S grew eleven percent last quarter."),
  ("t2", "Take out the weaker rupee: two point eight."),
  ("t3", "Its A I revenue? Three point one billion dollars a year."),
  ("t4", "Up seventy percent in nine months."),
  ("t5", "So why did total revenue barely move?"),
  ("t6", "Its own C E O: there is a deflation because of the productivity benefit."),
  ("t7", "So is A I growing T C S, or shrinking it? Because"),
 ],
}
for sid in (sys.argv[1:] or SHORTS):
    OUT = ROOT / sid; OUT.mkdir(parents=True, exist_ok=True)
    old = {b["key"]: b for b in json.load(open(OUT / "beats.json"))} if (OUT / "beats.json").exists() else {}
    out = []
    for k, say in SHORTS[sid]:
        mp3 = OUT / f"{k}.mp3"; o = old.get(k)
        sec = o["sec"] if (mp3.exists() and o and o["text"] == say and o.get("voice") == VOICE) else round(tts(say, mp3, VOICE), 2)
        out.append({"key": k, "text": say, "sec": sec, "voice": VOICE})
    json.dump(out, open(OUT / "beats.json", "w"), indent=1, ensure_ascii=False)
    print(sid, round(sum(b["sec"] + 0.15 for b in out), 1), "s", [b["sec"] for b in out])
