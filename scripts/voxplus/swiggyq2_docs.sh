#!/bin/zsh
# swiggyq2: every document excerpt used on screen, cut from the NSE shareholders letter PDF (text pages) with swiggyq2_shot.py.
P=~/jev_full/research/desk_20261022/extra/SWIGGY_22102026155201_Covering_Letter_Letter_to_Shareholders_Signed.pdf; D=/Volumes/DarwinSSD/MMVideo/public/voxplus/swiggyq2/docs
R(){ /usr/bin/python3 /Volumes/DarwinSSD/MMVideo/scripts/voxplus/swiggyq2_shot.py $P "$@"; }
R $D/store9.png "Targeted pricing investments to reactivate dormant base" 0 2 "INR 9 Store" "Targeted pricing investments"
R $D/chose.png "having achieved contribution break-even" 0 2 "we chose" "to calibrate near-term investments to accelerate growth" "contribution break-even in May"
R $D/food341.png "reported the highest ever absolute Adjusted EBITDA" 0 1 "highest ever absolute Adjusted EBITDA of INR 341 Cr"
R $D/foodhl.png "Added 0.6 Mn Monthly Transacting Users" 1 2 "GOV grew 17.7% YoY to INR 10,054 Cr" "Margin stood at 3.4% of GOV" "INR 341 Cr"
R $D/takerate.png "Advertising-led monetisation that accelerated" 1 1 "accelerated the take-rate to 26.1%" "highest ever)" "Some of the margin"
R $D/bolt.png "Delivery cost efficiency through higher order" 0 2 "Delivery cost efficiency through higher order" "Bolt and 99-Store" "more than 25% of Food delivery volumes"
R $D/nov.png "Q2FY27 saw acceleration in sequential growth with NOV" 0 1 "NOV growing 13.4% QoQ (vs 4% and 2.5% in" "the preceding two quarters)"
R $D/users.png "of the transacting user base averaged over 60%" 1 1 "added 1.3 Mn MTUs in the quarter (our highest addition in five quarters)" "Month-1 retention" "of the transacting user base averaged over 60% for the quarter which was meaningfully" "higher than the previous quarters"
R $D/stores.png "Network expansion and differentiated assortment" 0 1 "We added 69 dark stores during the" "equivalent to the previous 3 quarters"
R $D/busy.png "higher store utilisation with orders per day per store" 0 0 "reaching 1,192"
R $D/cm.png "CM moved to -1.0% of GOV in Q2FY27" 1 1 "CM moved to -1.0% of GOV in Q2FY27" "while our take rate declined by 140 bps QoQ" "of zero to -100 bps on CM"
R $D/targeted.png "Targeted investments of 100 bps in habit formation" 0 3 "Targeted investments of 100 bps in habit formation and dormant-user reactivation" "Adverse mix led impact of 40 bps" "delivered 60 bps of improvement"
R $D/peaked.png "We believe the Adjusted EBITDA losses to have peaked out" 2 0 "discretionary and transient" "expect them to start reversing over the next couple of quarters" "We believe the Adjusted EBITDA losses to have peaked out in Q2FY27."
R $D/q3range.png "we expect the contribution margin to remain within the" 0 3 "we expect the contribution margin to remain within the" "zero to -100 bps range in Q3FY27" "improving by ~100" "bps QoQ in Q3FY27"
R $D/breakeven.png "Our path to Adjusted EBITDA break-even remains unchanged" 0 1 "We need ~2.3x today" "60,000 Cr of annualised NOV, from INR 26,400 Cr today" "INR 30 of contribution per order"
R $D/thirds.png "Roughly two-thirds of this will come from higher revenue per order" 0 2 "Roughly two-thirds of this will come from higher revenue per order" "one-third from lower cost per order"
R $D/iocc.png "shareholder approval on the cap on foreign shareholding" 0 2 "49.5% (fully diluted basis) to qualify as an Indian Owned and Controlled entity" "Instamart to own inventory"
R $D/bps80.png "The IOCC transition will start from mid-Q3 FY27" 0 2 "The IOCC transition will start from mid-Q3 FY27" "contribution margin when fully rolled-out"
R $D/compete.png "Competitive intensity in the sector remains high" 0 1 "Competitive intensity in the sector remains high, and we do not expect it to ease in the near-term"
R $D/toing.png "Toing (standalone app for affordable meal options) remains within" 0 1 "remains within Platform Innovations"
R $D/rangebound.png "investment outlay to be range bound" 1 0 "investment outlay to be range bound in the short term"
cp /Volumes/DarwinSSD/MMVideo/public/voxplus/eternalq2/docs/blinkit.png /Volumes/DarwinSSD/MMVideo/public/voxplus/eternalq2/docs/blinkit.json $D/
