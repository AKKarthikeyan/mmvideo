#!/bin/zsh
# tatamotorsq2: every document excerpt used on screen, cut from the two NSE PDFs (results+press release [R], investor deck [P]) with tatamotorsq2_shot.py.
X=~/jev_full/research/desk_20261023/extra; R=$X/TMLCOMMERCIAL_23102026154330_NSEBSELETTER.pdf; P=$X/TMLCOMMERCIAL_23102026171720_IR.pdf
D=/Volumes/DarwinSSD/MMVideo/public/voxplus/tatamotorsq2/docs
S(){ /usr/bin/python3 /Volumes/DarwinSSD/MMVideo/scripts/voxplus/tatamotorsq2_shot.py "$@"; }
S $P $D/price.png "Offer price increased from" 0 1 "Offer price increased from €14.10 to €14.40" "In consideration of the slight delay in the completion of the Offer"
S $R $D/note6.png "On July 30, 2025, the Company and" 0 3 "all-cash" "41,363 crores" "excluding" "42,561 crores (€3.91 billion)" "revised maximum"
S $R $D/name.png "Tata Motors Limited (formerly TML Commercial Vehicles Limited)" 0 0 "Tata Motors Limited (formerly TML Commercial Vehicles Limited)"
S $R $D/demerger.png "demerger, transfer and vesting" 0 3 "commercial vehicles business of TMPVL" "consolidating the passenger vehicles business" "effective from October 1, 2025"
S $P $D/segments.png "Double digit growth across segments" 0 0 "Double digit growth across segments"
CLIPX0=262 S $P $D/indonesia.png "IB: Delivered strong performance" 0 1 "177% YoY" "on the back of Indonesia order"
S $R $D/share.png "Overall domestic CV VAHAN market share" 0 1 "36.2%, up 110 bps from FY26" "HCV 55.7%"
CLIPX0=372 S $P $D/ebitdadef.png "Reported EBITDA is defined" 0 3 "Reported EBITDA is defined"
S $R $D/cfo.png "Despite significant commodity cost pressures" 1 1 "Despite significant commodity cost pressures" "particularly in steel and rubber, we maintained margins sequentially"
CLIPX1=575 S $P $D/largely.png "Commodity impact largely offset" 0 0 "largely offset"
S $R $D/partially.png "helped partially mitigate" 1 1 "helped partially mitigate the impact" "despite the significant impact from rising commodity costs"
CLIPX0=372 S $P $D/fcfdef.png "Free cash flow is defined as" 0 3 "Free cash flow is defined as"
S $P $D/tmf.png "Includes TMF Holdings gross debt" 0 1 "market value"
S $P $D/settle.png "Tata Motors to pay offer price" 0 0 "subject to Offer conditions being met"
S $R $D/consol.png "As we prepare for consolidation" 1 1 "As we prepare for consolidation from next quarter"
S $R $D/egm.png "Following receipt of all regulatory approvals" 0 3 "Extraordinary General Meeting held on 16 October 2026" "approved all proposed resolutions" "settlement is scheduled for"
S $R $D/wagh.png "volumes up 35%, we remain well positioned" 0 4 "growth rates are expected to moderate in the second" "half against a higher base" "remain a headwind" "well positioned for a robust FY27"
CLIPX1=240 S $P $D/tendered.png "SHARES TENDERED SO FAR" 0 1 "35%"
