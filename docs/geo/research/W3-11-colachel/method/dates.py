# Compare the Colachel 1741 dates given by the three sources (no outside data).
from datetime import date, timedelta
ME_OFFSET = 825  # Karkadakam is the last month of the Kollam year, so ME 916 Karkadakam falls in AD 916+825
print("ME 916 Karkadakam -> AD", 916 + ME_OFFSET)
# Nagam Aiya: 15 Karkadagam 916 = 31 July 1741 -> implied 1 Karkadakam
n1 = date(1741, 7, 31) - timedelta(days=14); print("Nagam implied 1 Karkadakam:", n1)
# Menon: 27 Audy (= Karkadakam/Aadi) = 10 August -> implied 1 Audy
m1 = date(1741, 8, 10) - timedelta(days=26); print("Menon implied 1 Audy:", m1)
print("Menon 31 Audy (fort taken) on his own count:", m1 + timedelta(days=30))
print("Nagam's 15 Karkadakam on Menon's count:", m1 + timedelta(days=14))
d = date(1741, 8, 7)
print("Dutch surrender 7 Aug 1741 vs Nagam 31 Jul: days", (d - date(1741,7,31)).days, "| vs Menon battle 10 Aug:", (date(1741,8,10)-d).days)
