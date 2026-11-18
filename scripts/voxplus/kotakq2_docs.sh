#!/bin/zsh
# kotakq2: every document excerpt used on screen, cut from the three NSE PDFs (media release [M], investor deck [P], board outcome [D]) with kotakq2_shot.py.
X=~/jev_full/research/desk_20261024/extra; M=$X/KMBLTAB_24102026132632_MediareleaseBMOct242026SIGNED.pdf; P=$X/KMBLTAB_24102026133347_InvestorPresentationOct242026SIGNED.pdf; D=$X/KMBLTAB_24102026154235_OutcomeofBM24102026MDIDSIGNED.pdf
O=/Volumes/DarwinSSD/MMVideo/public/voxplus/kotakq2/docs
S(){ /usr/bin/python3 /Volumes/DarwinSSD/MMVideo/scripts/voxplus/kotakq2_shot.py "$@"; }
S $M $O/nim.png "Net Interest Margin (NIM) for Q2FY27" 0 1 "Net Interest Margin (NIM) for Q2FY27 stood at 4.31% versus 4.54%" "largely on account of"
S $M $O/fcnr.png "During the quarter, the Bank mobilised" 0 1 "55,344 crore" "mobilised FCNR(B) deposits"
S $M $O/pat.png "The Bank’s PAT for Q2FY27 increased" 0 0 "₹ 4,212 crore, up 29% YoY"
S $P $O/swap.png "Deposits as of 30th Sep, 2026 include" 0 2 "pursuant to RBI’s swap facility" "16,110 cr" "15,800 cr"
S $P $O/balance.png "Capital & Reserves and Surplus" 0 6 "572,820" "651,491" "25,840" "55,223" "44,620" "80,910"
S $M $O/deposits.png "Total period-end Deposits grew to" 0 1 "Excluding FCNR (B) deposits, total deposits grew by 13% YoY" "651,491 crore"
S $M $O/advances.png "Net Advances increased 25% YoY" 0 2 "Excluding loans provided against FCNR (B) deposits and loan portfolio acquired from" "net advances grew by 19% YoY" "Net Advances increased 25% YoY"
S $P $O/loans.png "Advances against FCNR(B)" 2 0 "16,110"
S $P $O/kmil.png "Includes loan portfolio aggregating" 0 2 "8,915 cr" "transferred from KMIL during the"
S $M $O/casa.png "CASA ratio as at September 30, 2026 stood at" 0 2 "reflecting the increase in the term" "deposit base due to FCNR (B) deposit inflows" "41.8%" "38.2%"
S $P $O/casadeck.png "of which, CASA" 0 0 "249,105"
S $P $O/costs.png "Cost of Funds" 0 2 "Cost of SA" "2.86%" "4.52%"
S $P $O/fees.png "Fees and Services include processing fees" 0 1 "processing fees of ~ ₹ 158 cr" "on advances against FCNR(B) deposits"
S $P $O/prov.png "Provision on standard assets for Q2FY27 includes" 0 2 "₹ 274 cr" "₹ 120 cr" "Advances against FCNR(B) and Loans transferred from Kotak"
S $P $O/opex.png "Other Operating Expenses include fees and other" 0 1 "₹ 116 cr" "mobilized by Bank’s"
S $P $O/roe.png "Return on Equity" 0 0 "11.65%" "10.38%" "11.98%"
S $D $O/saha.png "appointed Mr. Anup Kumar Saha" 0 3 "subject to the approval of the members of the Bank" "for a period of three years" "January 1, 2027"
S $D $O/rbi.png "approved by the Reserve Bank of India" 0 1 "September 30, 2026"
