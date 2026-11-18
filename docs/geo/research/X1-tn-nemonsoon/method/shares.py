# X1: shares from IMD Chennai figures (TN subdivision, 921.4 mm annual; OND normal 442.8 mm; SWM normal 328.5 mm per 2023 report)
annual, ond, swm23, swm25_printed, ond_actual_2025 = 921.4, 442.8, 328.5, 428.9, 428.9
print(f"OND share = {ond}/{annual} = {ond/annual*100:.2f}%  (IMD prints 48%)")
print(f"SWM share (2023 report) = {swm23}/{annual} = {swm23/annual*100:.2f}%  (IMD 2023 prints 36%)")
print(f"SWM share if 428.9 mm (2025 print) = {swm25_printed}/{annual} = {swm25_printed/annual*100:.2f}%  (2025 text prints 47%)")
print(f"2025 Table-4 TN actual OND = {ond_actual_2025} mm (same number as the 'SWM normal' in the 2025 text)")
print(f"SWM + OND normals = {swm23+ond} mm = {(swm23+ond)/annual*100:.1f}% of annual; rest (Jan-May) = {annual-swm23-ond:.1f} mm = {(annual-swm23-ond)/annual*100:.1f}%")
print(f"2025 OND departure = {(ond_actual_2025-ond)/ond*100:.1f}% (IMD prints -3%)")
