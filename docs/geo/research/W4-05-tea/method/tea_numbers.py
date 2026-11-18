# W4-05-tea: our measurements (run: python3 -I method/tea_numbers.py from the topic folder)
# Inputs copied from saved sources; no figure is taken from an article.
# Tea Board of India, "TEA PRODUCTION IN 2024-25 (APR-MAR)- FINAL", M.Kg, Total column
# (sources/teaboard_prod_2025_2025-26.txt, lines ~177-200)
assam, darj, wb, all_india = 666.82, 5.75, 387.51, 1315.77
print(f"Assam share of All India 2024-25 (FINAL): {assam/all_india*100:.1f}%")
print(f"Assam / Darjeeling 2024-25: {assam/darj:.0f}x")
print(f"Darjeeling share: {darj/all_india*100:.2f}%")
# Dates: Tea Committee letter Calcutta 24 Dec 1834 (JASB 1835) vs Fortune leaves Southampton 20 Jun 1848 (Fortune 1852 preface)
print(f"Years between Assam tea declared indigenous (1834) and Fortune setting out (1848): {1848-1834}")
# Latitudes: Tsong-gan-hien, black-tea town of the Bohea hills, 27 47' 38\" N (Fortune 1852, citing Jesuit observations);
# Manche, Khamti village east of Sadiya where Wilcox was shown a tea tree, 27 29' 16\" N (JASB 1835 editor's note citing Wilcox)
a = 27 + 47/60 + 38/3600; b = 27 + 29/60 + 16/3600
d = a - b
print(f"Latitude difference: {d*60:.1f} arc-minutes = {d*111.2:.0f} km north-south (1 deg lat ~ 111.2 km)")
# Fortune's cargo: 'Upwards of twenty thousand tea-plants, eight first-rate manufacturers' (preface)
