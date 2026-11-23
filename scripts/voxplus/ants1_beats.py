# ants1 (Moat Atlas, Anthropic S-1, 27 Oct 2026): beats for the voice. "cap" = the approved script text (draft 2, AK sign-off 27 Oct),
# parsed from docs/global-launch/EP_ANTHROPIC_S1_SCRIPT.md; "say" = the same words with figures spelled out for MiniMax.
import json, pathlib, re
R = pathlib.Path("/Volumes/DarwinSSD/MMVideo-atlas-ant")
md = (R / "docs/global-launch/EP_ANTHROPIC_S1_SCRIPT.md").read_text().split("## The 3 Shorts")[0]
CAP = dict(re.findall(r"\*\*([a-z]\d\d)\*\*\n> (.+)", md))
SAY = {
 "c01": "In the first six months of twenty twenty-six, Anthropic, the company behind the AI model Claude, booked sixteen point three billion dollars of revenue. In the same six months a year earlier, it booked one point two billion dollars.",
 "c02": "On October twenty-sixth, it filed to list its shares in the US. And the filing shows what that growth cost. In operating costs, it spent a dollar and four cents for every dollar of revenue.",
 "c03": "Now the strange part. Over eighty percent of last quarter's revenue came from models released in the six months to September. Most of what pays the bills is at most half a year old.",
 "c04": "So, our question: if most of what pays the bills is that new, what does Anthropic own that a rival can't copy? To answer it, we'll follow the dollar.",
 "w01": "Anthropic sells Claude three ways. Developers build it into their own software. People and companies use its own apps. And it's sold through the clouds of Amazon, Google and Microsoft, which are also its main compute suppliers, and investors and customers too.",
 "w02": "Consultancies like Accenture and Deloitte also bring it to their clients. And its flagship tool at work is Claude Code, which the filing calls its coding agent.",
 "d01": "Here's where each dollar of revenue went, from January to June twenty twenty-six. Every figure comes from the company's filing, or simple arithmetic on it.",
 "d02": "Only about fifteen cents of each dollar was the direct cost of serving customers, mostly the computing that runs Claude when they use it. About sixty cents went to research and development, mostly computing to build the next models.",
 "d03": "Twenty-three cents went to sales and marketing, and six to running the company. Counted another way, compute across all of it took fifty-five cents of every dollar, much of it bought from those same cloud companies.",
 "d04": "Add it up and it comes to a dollar and four cents, so over the half-year it lost about four cents on every dollar, before interest and other items. But the half hides a turn. From January to March, it lost one point seven billion dollars. From April to June, it made an operating profit of nine hundred and seventy-four million dollars.",
 "d05": "A year earlier, in the first half of twenty twenty-five, it spent two dollars and eighty-four cents for every dollar it earned. In one year, the loss on each dollar shrank from a dollar eighty-four to four cents.",
 "d06": "On the company's own adjusted measure, which leaves out stock-based pay, about thirteen cents per dollar, its operating margin was ten percent. And a further stock-pay charge will be booked when the listing takes effect. The filing leaves that amount blank.",
 "d07": "Cash from operations was positive too: three point nine billion dollars in those six months, helped by one point one billion dollars of interest on its cash. A year before, one point five billion dollars went out.",
 "d08": "So why is the filing's net loss eighty point seven billion dollars? Because seventy-two point four billion dollars of it is an accounting charge on its convertible notes, which rose in value as the company's value rose.",
 "d09": "It isn't cash. The notes are set to turn into shares, so the cost shows up as more shares, not money out. On its own adjusted measure, net income was two point seven billion dollars.",
 "d10": "And it isn't short of money. At the end of June, it held a hundred and twelve point four billion dollars in cash and nineteen point three billion dollars in short-term investments, from a hundred and forty-one point one billion dollars raised so far.",
 "p01": "Who pays? Eighty cents of each dollar is billed by usage, some of it under contracts with a minimum spend. The other twenty cents are subscriptions.",
 "p02": "Customers paying over a hundred thousand dollars a year jumped from more than nine hundred and fifty to more than eleven thousand nine hundred in twelve months. More than nineteen hundred now pay over a million dollars a year, and about two hundred and fifty pay over ten million.",
 "p03": "Taken together, customers who paid in the September quarter of twenty twenty-five, not counting its Pro and Max subscribers, paid about nine times as much a year later. The company calls this net revenue retention: about nine hundred percent.",
 "p04": "Is it hooked on a few giants? Less than before. Its top five customers paid about twenty-one percent of revenue last quarter, down from about thirty-six percent in the March quarter. Over the first nine months, they were about a quarter, and many top customers can cut spending at any time.",
 "p05": "The company argues there's room to grow. Over half the Fortune five hundred pay it at least a hundred thousand dollars a year, yet on average that's under a tenth of one percent of those listed companies' expenses.",
 "m01": "Now the Moat Atlas moat test. Three questions. One: do customers spend more over time? Net of any who leave, yes. Two: can a rival copy what they're buying? Three: does it make money from them?",
 "m02": "Question two is where the filing is frank: Customers adopt and retain our technology based on whether our models are at the frontier of AI capability, and maintaining that frontier position is essential to revenue generation.",
 "m03": "That's why new models matter so much. Models released in the six months to September brought in over eighty percent of last quarter's revenue. The company says each release also opens up new uses, and its latest top model cut customers' cost per task by about forty percent.",
 "m04": "It names Google and OpenAI as its main rivals, and says many competitors have substantially greater financial, technical, and marketing resources than it does, and their own or greater access to compute.",
 "m05": "So what can't a rival copy quickly? The company says it has a loop. Compute trains a better model. A better model serves more customers. And serving customers teaches it what to build next.",
 "m06": "The company says the loop runs inside it too. Over ninety percent of the contributions to its own codebase in September twenty twenty-six were written by Claude. Since the end of twenty twenty-four, its headcount grew over five times, and its quarterly revenue became eighty-six times larger.",
 "m07": "Three: does it make money from them? Over the half-year, on the standard accounts, not yet: minus four cents per dollar, though the June quarter was in profit. On its own adjusted measure, its operating margin was ten percent.",
 "m08": "Our reading: a speed moat, not a wall. A rival with enough compute can run the same loop, and the filing says some have more. So the lead has to be won again with every new model.",
 "b01": "But. Here are six things in the filing that a moat story could skip.",
 "b02": "One: the company says its growth may not be sustainable, and expects its growth rate to decline, possibly sharply.",
 "b03": "Two: by its own estimate, about five to seven percent of revenue in the first nine months of twenty twenty-six came from customers it later found breaking its usage rules. It expects that share to fall as it enforces its rules, and says that may reduce its revenue and growth.",
 "b04": "Three: spending moves with the calendar. In the last two weeks of twenty twenty-five, customer spending was about twenty percent lower than in the two weeks before.",
 "b05": "Four: the bills are fixed and long. Some compute contracts oblige it to pay whether or not it uses the capacity, and its commitments run to twenty forty-five. The amounts are still blank in this draft.",
 "b06": "Five: it has delayed the release of models for safety reasons before, and says such steps could slow its gains compared with rivals that don't take them.",
 "b07": "Six: control. Anthropic is a public benefit corporation. A trust with no financial stake can elect most of the board, and a founders' share carries fifty point one percent of the votes. Together they can elect every director. People who buy the listed shares get a minority of the votes.",
 "e01": "So, back to our question. What does Anthropic own that a rival can't copy in six months? Not any one model. Over eighty percent of last quarter's revenue came from models released in the six months to September.",
 "e02": "Our reading: what it has is a loop. About forty million smaller customers, people and organisations, more than eleven thousand nine hundred paying over a hundred thousand dollars a year, and the compute that turns their money into the next model. A rival with enough compute can run a loop too.",
 "e03": "So, our verdict. Moat: a speed moat, won again with every release. Margin: about break-even over the half-year on the standard accounts, in profit in the June quarter, and ten percent on its own adjusted measure.",
 "e04": "Three numbers to watch in its next filing. Compute's share of each dollar: fifty-five cents in the first half. Revenue from models under six months old: over eighty percent last quarter. And the top five customers: about twenty-one percent last quarter.",
 "e05": "Next, see how T S M C, the company that makes the chips AI runs on, earns its money.",
}
assert list(CAP) == list(SAY), (set(CAP) ^ set(SAY))
# word-count sanity: spelled-out numbers add words, but nothing should be dropped
for k in CAP:
    a, b = len(CAP[k].split()), len(SAY[k].split())
    if b < a: print("WARN fewer spoken words", k, a, b)
json.dump([{"key": k, "say": SAY[k], "cap": CAP[k]} for k in CAP], open(R / "scripts/voxplus/ants1_beats.json", "w"), indent=1, ensure_ascii=False)
print(len(CAP), "beats", sum(len(s.split()) for s in SAY.values()), "spoken words")
