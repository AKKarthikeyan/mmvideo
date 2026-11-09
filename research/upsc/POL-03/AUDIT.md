# POL-03 independent audit (gate S5), 3 Nov 2026

**Method.** Every one of the 154 claim rows was reopened in its saved file at the cited place: the Constitution (10 Sep 2026, text and, where a footnote was garbled, the page image), the Supreme Court PDFs (opinion boundaries, bench, author, majority or separate), NCERT text, DoPT files, the Act and the CAD page. Each judgment row was checked for majority versus separate opinion, bench size and judge (rule 6). Counts: **PASS 132, FIX 21, FAIL 1** (154). Status changes made in claims.csv: 13 rows downgraded to UNVERIFIED because the official judgment copy was not read.

## Official copies of the nine Indian Kanoon judgments

| Judgment | Result |
|---|---|
| D.K. Basu 1996 | **Obtained**: api.sci.gov.in/jonew/judis/14580.pdf, saved as sources/official_dk_basu.pdf/.txt; claims D22, L02 now cite it |
| PUDR 1982 | **Obtained**: judis/9882.pdf, sources/official_pudr.pdf/.txt; E02, L07, L14 |
| Ajay Hasia 1980 | **Obtained**: judis/4414.pdf, sources/official_ajay_hasia.pdf/.txt; A01, A02 |
| Indra Sawhney, Davinder Singh, Jarnail Singh, Subhash Kumar, Bijoe Emmanuel, Gopalan | **Not obtained.** Search found only later judgments that cite them; digiscr.sci.gov.in and main.sci.gov.in gave no connection; no captcha was touched. Claims set to UNVERIFIED with the note "official copy not read; text from Indian Kanoon": C01, C03-C09, C15, C16, D24, F06, L06 (C04 is partly backed by the official Jaishri Patil para 444(1)). |

Two rows keep CONFIRMED but lean on Indian Kanoon for a secondary point (C17, D09). H06 and I06 (reused from POL-06) rest on Indian Kanoon copies of Minerva Mills and Property Owners Association; POL-06's own audit passed them, so they are flagged, not changed.

**indiacode retry (once).** indiacode.nic.in now serves a migration page that points to **indiacode.gov.in**. That host answered HTTP 200 and its REST search (indiacode.gov.in/server/api/discover/search/objects?query=...) returned the SC/ST (PoA) Amendment Act 2015. So the BLOCKED rows X01-X08 can be retried there. They were not worked further here and stay BLOCKED. No captcha was met.

## Checklist

All claim ids named in checklist.csv exist in claims.csv. Every NCERT heading in the brief is covered or set aside with a sound reason. Three headings that sit inside keps2 ch.2 are covered by claims but have no checklist row of their own: **"National Human Rights Commission (NHRC)"** (keps202 line 744; claim H07), **"Fundamental Duties of citizens"** (line 833; I07, I08) and **"Right to Property"** (line 942; J01, J02, D04). Fix: add three rows. Claims H04, L01, L09, L10, L13, L14 and X04-X06, X08-X10 are not named in any checklist row; harmless (game ideas, Arts 33-34, blocked Acts).

## Claim-by-claim

| claim_id | verdict | evidence | exact fix |
|---|---|---|---|
| POL03-A01 | PASS | Art. 12 text (txt line 1202). Second source now the official Ajay Hasia copy (judis 4414). | none |
| POL03-A02 | PASS | Official copy read: bench of five (Chandrachud CJ, Bhagwati, Krishna Iyer, Fazal Ali, Koshal), one judgment by Bhagwati J.; tests summarised on judis p.4. | none |
| POL03-A03 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. (Art. 13(1)-(3), txt lines 1206-1222). A05 matches the OCR of Prelims 2026 Q54 (options c: both correct). | none |
| POL03-A04 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. (Art. 13(1)-(3), txt lines 1206-1222). A05 matches the OCR of Prelims 2026 Q54 (options c: both correct). | none |
| POL03-A05 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. (Art. 13(1)-(3), txt lines 1206-1222). A05 matches the OCR of Prelims 2026 Q54 (options c: both correct). | none |
| POL03-A06 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. (Art. 13(1)-(3), txt lines 1206-1222). A05 matches the OCR of Prelims 2026 Q54 (options c: both correct). | none |
| POL03-A07 | PASS | Art. 13(4) footnote: 24th Amendment Act 1971 s.2, w.e.f. 5-11-1971. Art. 368(3) same date. | none |
| POL03-A08 | PASS | Headnote count in sources/reused_from_POL-06/kbj_engJud.txt: ten judges named on Golaknath/Art. 13(2); seven on basic structure; counts are the SCR reporter's, one question only. Audited in POL-06. | none |
| POL03-A09 | PASS | Art. 123(3): "makes any provision which Parliament would not ... be competent to enact, it shall be void" (txt line 3215); with 13(3)(a). The Prelims 2025 OCR is outside sources/ and was not re-opened. | none |
| POL03-A10 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 14 "any person", 21 "No person", 19(1) "All citizens", 15(1)-(2), 16(1)-(2), 29(1)-(2) "citizen". | none |
| POL03-A11 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 14 "any person", 21 "No person", 19(1) "All citizens", 15(1)-(2), 16(1)-(2), 29(1)-(2) "citizen". | none |
| POL03-A12 | FIX | NCERT hees205 line 170 "every Indian citizen" found. The claim's list put Arts 21A, 23, 24, 26 and 28 under "persons"; the text says "all children" (21A), "every religious denomination" (26) and has no word "person" in 23, 24. Fix applied to claim text. | applied (see changes list) |
| POL03-B01 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. NCERT iest106 lines 172, 214-217. | none |
| POL03-B02 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (iest106 p.141, two phrases). Indra Sawhney para 5 note is Indian Kanoon only. | none |
| POL03-B03 | PASS | Maneka Gandhi official copy: Bhagwati J. for himself, Untwalia and Fazal Ali JJ. (headnote line 625); Royappa quote and "Article 14 strikes at arbitrariness" at txt lines 3748-3755, judis p.57-58. Beg CJ, Chandrachud J. and Krishna Iyer J. concur (lines 270, 503, 1282); Kailasam J. dissent (line 1480). | none |
| POL03-B04 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B05 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B06 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B07 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B08 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B09 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B10 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B11 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B12 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. B05: 1st Amendment w.e.f. 18-6-1951; B06: 93rd, 20-1-2006; B07: 103rd, 14-1-2019 (ss.2-3); B10: 77th 17-6-1995, 81st 9-6-2000, 85th retrospective 17-6-1995. B09 NCERT keps202 line 308 prints 16(4). Indra Sawhney notes in B02/B05/B10 are IK-only and not relied on. | none |
| POL03-B13 | PASS | act_poa_1989_tribal.txt: No. 33 of 1989, 11 Sep 1989, s.3(1)(i) "drink or eat any inedible or obnoxious substance"; NCERT hess306 line 305 has the same list. Original text only (stated). | none |
| POL03-C01 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. Indian Kanoon text, paras 12-13: Presidential Order 1979 under Art. 340; report submitted by the extended date 31 Dec 1980. Matches, but IK only. | applied (see changes list) |
| POL03-C02 | PASS | dopt_compendium p.3: OM 13 Aug 1990 para 2(i) "27% ... reserved for SEBC", direct recruitment. IK date typo correctly noted. | none |
| POL03-C03 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK header: lead judgment of Kania CJ, Venkatachaliah, Ahmadi, Jeevan Reddy JJ., by Jeevan Reddy J.; para 121(3)(a), 121(4)(a) match. | applied (see changes list) |
| POL03-C04 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK para 121(6) and 122(4) match. Official Jaishri Patil para 444(1) supports the 50% rule and the para 810 exception, not the "each year" and "remote areas" wording. | applied (see changes list) |
| POL03-C05 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK paras 121(3)(d), 123(B), 124 match. Claim now names the lead judgment. | applied (see changes list) |
| POL03-C06 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK para 121(7) and the Ahmadi note after para 122 match. Claim now names the lead judgment. | applied (see changes list) |
| POL03-C07 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK para 121(11) (10% economic reservation struck down) and 124 match. Claim now names the lead judgment. | applied (see changes list) |
| POL03-C08 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK para 121(2)(a) matches. | applied (see changes list) |
| POL03-C09 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK para 21: Nagaraj not referred to seven judges; quantifiable-data requirement "held to be invalid to this extent". Bench Misra CJI, Joseph, Nariman, Kaul, Malhotra; author Nariman J. | applied (see changes list) |
| POL03-C10 | PASS | Jaishri Patil official copy: Bhat J. para 188(1)-(3) agrees with Bhushan J. on Points 1-3; cover note: Bhushan for himself and Nazeer, Rao, Gupta, Bhat concur on Questions 1-3. | none |
| POL03-C11 | FIX | Jaishri Patil official copy: Bhat J. para 188(4)-(5) is the 102nd Amendment conclusion, but Rao J. and Gupta J. agreed with Bhat on Questions 4-6 (Rao J. para 1-2, 26; Gupta J. cover note), so it is the 3:2 majority view, not "Bhat alone"; Bhushan and Nazeer JJ. took the other view (Bhushan para 443). Art. 338B, 342A, 366(26C) text and dates (102nd, 15-8-2018; 105th, 15-9-2021) match. Note rewritten. | applied (see changes list) |
| POL03-C12 | PASS | Janhit Abhiyan official Order: four separate judgments; majority Maheshwari, Trivedi, Pardiwala; Bhat J. (for himself and the CJI) in minority; 7 Nov 2022. | none |
| POL03-C13 | PASS | Janhit Abhiyan, Maheshwari J. conclusion (c), txt lines 7608-7620: ceiling "not inflexible", applies only to 15(4), 15(5), 16(4). Attribution to him alone is correct. | none |
| POL03-C14 | PASS | Janhit Abhiyan, Bhat J. paras 192-195 (txt 16925-16955): Sections 2 and 3 of 103rd Amendment "unconstitutional and void" for violating the basic structure; para 193 economics-only allowed in Art. 15, not Art. 16. | none |
| POL03-C15 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK para 205(a)-(f) (CJI for himself and Misra J.); Chinnaiah overruled; Gavai, Vikram Nath, Mithal, Sharma JJ. separate concurring; Trivedi J. separate opinion at line 11010 (Chinnaiah correct law). 6:1 stands. | applied (see changes list) |
| POL03-C16 | FIX | Status downgraded to UNVERIFIED: official copy not read; text from Indian Kanoon. IK: Gavai J. opinion lines 4151-10955, para 295 at line 10899, separate opinion; attributed correctly to one judge. | applied (see changes list) |
| POL03-C17 | PASS | Art. 335 and proviso (82nd Amendment, w.e.f. 8-9-2000) match. Davinder Singh para 205(f)(iii) IK only; noted. | none |
| POL03-C18 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. NCERT iest106 line 303. | none |
| POL03-C19 | PASS | Arts 341(1)-(2), 342(1)-(2) read; consultation with the Governor applies "where it is a State". | none |
| POL03-C20 | PASS | Art. 334: "eighty years in respect of clause (a)" (104th Amendment, w.e.f. 25-1-2020 on the earlier period; footnote chain uses 25 Jan). 25 Jan 2030 is own arithmetic, so labelled. | none |
| POL03-C20b | FIX | Art. 330(2) text matches. NCERT does not draw the 330 vs 16(4A) contrast (no hit in any NCERT file); only Jarnail Singh does (IK, paras 19-20). Claim text corrected. | applied (see changes list) |
| POL03-C21 | FAIL | Claim said only s.4 (Art. 330A) is in force from 16-4-2026 and the rest is "date to be notified". The page images show Art. 330A footnote s.3, Art. 332A s.4, Art. 334A s.5, all "w.e.f. 16-4-2026", while the text layer overprints "(date yet to be notified)". Section number was wrong and the commencement reading is not safe. Rewritten and set UNVERIFIED. POL06-A13 has the same slip. | applied (see changes list) |
| POL03-C22 | FIX | The 50% cap and the 15% SC and 7.5% ST roster rates are in the DoPT OM of 22 Oct 1993 (PDF p.48, txt lines 2970-2990), not in the 8 Sep 1993 OM (27% OBC). Date and claim corrected. | applied (see changes list) |
| POL03-C23 | PASS | dopt_ews_faq.txt: OM 36039/1/2019-Estt(Res) 31.01.2019 provides 10%; "gross annual income below Rs 8.00 lakh" (line 188). | none |
| POL03-C24 | PASS | Arithmetic 15 + 7.5 + 27 = 49.5; + 10 = 59.5. Status UNVERIFIED is right (1993 rates not re-checked). | none |
| POL03-C25 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. hess306 lines 142-143. | none |
| POL03-D01 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Footnotes: 97th Amendment co-operative societies 8-2-2012; 1st Amendment 1951 and 16th Amendment 1963 on 19(2). NCERT keps202 pp.31, 35. | none |
| POL03-D02 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Footnotes: 97th Amendment co-operative societies 8-2-2012; 1st Amendment 1951 and 16th Amendment 1963 on 19(2). NCERT keps202 pp.31, 35. | none |
| POL03-D03 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Footnotes: 97th Amendment co-operative societies 8-2-2012; 1st Amendment 1951 and 16th Amendment 1963 on 19(2). NCERT keps202 pp.31, 35. | none |
| POL03-D04 | PASS | Art. 300A footnote 44th Amendment s.34 w.e.f. 20-6-1979; Art. 19(1)(f) omitted s.2 and Art. 31 omitted s.6, both 20-6-1979. NCERT keps202 line 951-956 says "1978" for the Act. The note on the Kesavananda 1973 claim is the POL-06 conflict (J02). | none |
| POL03-D05 | PASS | Shreya Singhal official copy: para 119(a) "Section 66A ... struck down in its entirety being violative of Article 19(1)(a) and not saved under Article 19(2)"; Nariman J. for Chelameswar J. and himself; 24 Mar 2015. | none |
| POL03-D06 | PASS | NCERT keps202 line 444 "assembly of five or more persons". The BNSS point is correctly left open. | none |
| POL03-D07 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. NCERT iest106 / keps202 pages match. | none |
| POL03-D08 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. NCERT iest106 / keps202 pages match. | none |
| POL03-D09 | PASS | Puttaswamy official copy, Part T conclusion 2 (txt ~13420-13440): Kharak Singh's "reliance upon the decision of the majority in Gopalan is not reflective of the correct position in view of ... Cooper and ... Maneka"; Part A para 3 notes the 11-judge Cooper bench. Opinion of Chandrachud J. for four judges (Order). Gopalan date and bench are IK header only; noted. | none |
| POL03-D10 | FIX | Quote "right and just and fair ... not arbitrary, fanciful or oppressive" found in Bhagwati J.'s opinion (txt lines 3764-3766, judis p.57-58), also in headnote (line 757, p.12). The page cell said "PDF p.12" for the opinion; corrected. Bench: Bhagwati J. for himself, Untwalia, Fazal Ali; Beg CJ, Chandrachud, Krishna Iyer concur; Kailasam dissents. Correct. | applied (see changes list) |
| POL03-D11 | PASS | NCERT iest106 lines 176-182 "adherence to duly enacted ... laws" box; Maneka quote as D10. | none |
| POL03-D12 | FIX | Order of the Court items (i)-(iv) and signatures of all nine judges read (puttaswamy.txt 25720-25800). The note said "four others wrote separately"; it is five (Chelameswar, Bobde, Sapre, Nariman, Kaul). Prelims 2024 Q76 OCR matches (options a-d Arts 15, 16, 19, 21). Note corrected. | applied (see changes list) |
| POL03-D13 | PASS | Puttaswamy Part T conclusion 3(H), judis/txt 13641-13660: "three-fold requirement of (i) legality ... (ii) need ... (iii) proportionality". Chandrachud J. for himself, Khehar CJI, Agrawal, Nazeer JJ. correct. | none |
| POL03-D14 | PASS | Puttaswamy txt 6192: "ADM Jabalpur must be and is accordingly overruled. We also overrule ... Bhanudas Krishna Gawde"; in Chandrachud J.'s opinion; Kaul J. para 82 agrees separately. Correctly not credited to the Order. | none |
| POL03-D15 | PASS | Puttaswamy Part T conclusion 5: informational privacy; state and non-state actors; "robust regime for data protection". | none |
| POL03-D16 | PASS | Art. 21A footnote: 86th Amendment Act 2002 s.2, w.e.f. 1-4-2010. NCERT iest106 line 209 "was added in 2009" confirmed. CORRECTED correct. | none |
| POL03-D17 | PASS | Art. 21A footnote: 86th Amendment Act 2002 s.2, w.e.f. 1-4-2010. NCERT iest106 line 209 "was added in 2009" confirmed. CORRECTED correct. | none |
| POL03-D18 | PASS | Olga Tellis official copy: bench Chandrachud CJ, Fazal Ali, Tulzapurkar, Chinnappa Reddy, Varadarajan; livelihood passage txt lines 225-230; a unanimous judgment by Chandrachud CJ. | none |
| POL03-D19 | PASS | "shelter" holding not in Olga Tellis (only facts and scheme names); UNVERIFIED right. | none |
| POL03-D20 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 22(1)-(3). | none |
| POL03-D21 | FIX | Art. 22(4) has two limbs: (a) Advisory Board report, or (b) detention under a Parliamentary law under 22(7)(a)-(b). The claim said "only if an Advisory Board reports". Claim rewritten; L11 likewise. | applied (see changes list) |
| POL03-D21b | PASS | Footnote to Art. 22(4): 44th Amendment s.3 "date yet to be notified"; substituted text says "two months". Matches. | none |
| POL03-D22 | PASS | Official copy read (judis 14580): requirements (2) memo of arrest attested and countersigned, (3) friend or relative informed, (6) diary entry; bench Kuldip Singh and A.S. Anand JJ.; 18 Dec 1996. | none |
| POL03-D23 | PASS | Art. 359(1) "(except articles 20 and 21)"; footnote 44th Amendment s.40 w.e.f. 20-6-1979. | none |
| POL03-D24 | FIX | NCERT hess307 lines 148-149 found and Art. 21 does not mention water. The Subhash Kumar attribution is Indian Kanoon only (K.N. Singh and N.D. Ojha JJ.; "pollution free water and air"); status downgraded to UNVERIFIED. | applied (see changes list) |
| POL03-E01 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. NCERT keps202 pp.37-38. | none |
| POL03-E02 | PASS | Official PUDR copy read (judis 9882): Bhagwati J. author, with Baharul Islam J.; headnote 5:8-5:9 and text lines 360-364, 400-404, 570-606 on minimum wage being forced labour; lines 646, 1929 on enforcement against private individuals. | none |
| POL03-E03 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. NCERT keps202 pp.37-38. | none |
| POL03-E04 | PASS | NCERT hess306 lines 370-386 (PIL in 2003; Act in force 6 Dec 2013). UNVERIFIED right. | none |
| POL03-F01 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 25(1) Expl. I, 25(2)(a)-(b), 26(a)-(d), 27, 28(1) and (3) read. | none |
| POL03-F02 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 25(1) Expl. I, 25(2)(a)-(b), 26(a)-(d), 27, 28(1) and (3) read. | none |
| POL03-F03 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 25(1) Expl. I, 25(2)(a)-(b), 26(a)-(d), 27, 28(1) and (3) read. | none |
| POL03-F04 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 25(1) Expl. I, 25(2)(a)-(b), 26(a)-(d), 27, 28(1) and (3) read. | none |
| POL03-F05 | PASS | Devaru official copy: 8 Nov 1957; bench Venkatarama Aiyar, Bose, Das CJ, Imam, Sarkar; single judgment by Venkatarama Aiyar J.; harmonising Art. 25(2)(b) and 26(b) at txt lines 86, 1040-1044. | none |
| POL03-F06 | FIX | Indian Kanoon headnote HELD 1.1-1.2 matches the claim; bench Chinnappa Reddy and M.M. Dutt JJ. Official copy not read: status downgraded to UNVERIFIED. | applied (see changes list) |
| POL03-F07 | PASS | NCERT keps202 lines 580-581 and 598-602. UNVERIFIED right; NCERT-only. | none |
| POL03-F08 | PASS | Preamble footnote: 42nd Amendment s.2 w.e.f. 3-1-1977 ("SOCIALIST SECULAR"). | none |
| POL03-F09 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (hees205 line 462; keps105 lines 31, 91-103, 247, 330, 372; keps202 lines 119-120 (1928), 53-62 (Machal Lalung, 54 years, July 2005)). K03 second source Puttaswamy conclusion 3(I) matches. | none |
| POL03-G01 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 29(1)-(2); 30(1), (1A) (44th Amendment s.4, 20-6-1979), (2). | none |
| POL03-G02 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 29(1)-(2); 30(1), (1A) (44th Amendment s.4, 20-6-1979), (2). | none |
| POL03-G03 | PASS | No definition of "minority" in the Constitution text (grep); NCERT keps202 line 668-670. | none |
| POL03-H01 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 32(1)-(4), 226(1). NCERT iest106 p.141. | none |
| POL03-H02 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 32(1)-(4), 226(1). NCERT iest106 p.141. | none |
| POL03-H03 | PASS | CAD mirror page, Ambedkar 9 Dec 1948, line 646: "the very soul of the Constitution and the very heart of it". NCERT keps202 line 695 words it "heart and soul". | none |
| POL03-H04 | PASS | Art. 33 (substituted by the 50th Amendment, w.e.f. 11-9-1984) and Art. 34 text read. | none |
| POL03-H05 | PASS | Art. 31B read; 31A, 31C exist (txt 1690-1710). | none |
| POL03-H06 | PASS | Reused from POL-06 (audited 2 Nov 2026). Source is Indian Kanoon (Property Owners Association, Minerva Mills): official copy not read; flag for the lead, kept CONFIRMED because POL-06 already audited it. | none |
| POL03-H07 | PASS | NCERT keps202 lines 744-750 (1993; composition). NCERT-only; UNVERIFIED right. | none |
| POL03-I01 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 36-48 and 50 read; Art. 39A and 43A 42nd Amendment w.e.f. 3-1-1977; Art. 45 substituted by 86th Amendment, w.e.f. 1-4-2010. | none |
| POL03-I02 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 36-48 and 50 read; Art. 39A and 43A 42nd Amendment w.e.f. 3-1-1977; Art. 45 substituted by 86th Amendment, w.e.f. 1-4-2010. | none |
| POL03-I03 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 36-48 and 50 read; Art. 39A and 43A 42nd Amendment w.e.f. 3-1-1977; Art. 45 substituted by 86th Amendment, w.e.f. 1-4-2010. | none |
| POL03-I03b | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 36-48 and 50 read; Art. 39A and 43A 42nd Amendment w.e.f. 3-1-1977; Art. 45 substituted by 86th Amendment, w.e.f. 1-4-2010. | none |
| POL03-I03c | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 36-48 and 50 read; Art. 39A and 43A 42nd Amendment w.e.f. 3-1-1977; Art. 45 substituted by 86th Amendment, w.e.f. 1-4-2010. | none |
| POL03-I04 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 36-48 and 50 read; Art. 39A and 43A 42nd Amendment w.e.f. 3-1-1977; Art. 45 substituted by 86th Amendment, w.e.f. 1-4-2010. | none |
| POL03-I05 | PASS | Article text and footnote read in leg_constitution_sep2026 (.txt, and page image where the footnote was garbled); wording, amendment and date match. Art. 36-48 and 50 read; Art. 39A and 43A 42nd Amendment w.e.f. 3-1-1977; Art. 45 substituted by 86th Amendment, w.e.f. 1-4-2010. | none |
| POL03-I06 | PASS | Reused from POL-06 F05 (audited); Minerva Mills text is Indian Kanoon, official copy not read: flag, as H06. NCERT keps202 lines 936-939 matches. | none |
| POL03-I07 | PASS | Art. 51A (a)-(k); Part IVA and (a)-(j) 42nd Amendment w.e.f. 3-1-1977; (k) 86th Amendment s.4 w.e.f. 1-4-2010. NCERT keps202 line 836 "ten"; hees205 line 611 "11th ... 2002". | none |
| POL03-I08 | PASS | NCERT keps202 lines 836-845. The negative claim about the text rests on reading Art. 51A (no enforcement clause); a text search for "51A" gives only the heading and the article. | none |
| POL03-J01 | PASS | Footnotes read: 44th Amendment w.e.f. 20-6-1979; Art. 368(4)-(5) 42nd Amendment, flagged invalid per Minerva Mills AIR 1980 SC 1789. | none |
| POL03-J02 | PASS | NCERT keps202 lines 951-953 says "in 1973 ... not part of the basic structure". CONFLICT stays; relies on POL-06 H06. | none |
| POL03-J03 | PASS | Footnotes read: 44th Amendment w.e.f. 20-6-1979; Art. 368(4)-(5) 42nd Amendment, flagged invalid per Minerva Mills AIR 1980 SC 1789. | none |
| POL03-K01 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (hees205 line 462; keps105 lines 31, 91-103, 247, 330, 372; keps202 lines 119-120 (1928), 53-62 (Machal Lalung, 54 years, July 2005)). K03 second source Puttaswamy conclusion 3(I) matches. | none |
| POL03-K02 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (hees205 line 462; keps105 lines 31, 91-103, 247, 330, 372; keps202 lines 119-120 (1928), 53-62 (Machal Lalung, 54 years, July 2005)). K03 second source Puttaswamy conclusion 3(I) matches. | none |
| POL03-K03 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (hees205 line 462; keps105 lines 31, 91-103, 247, 330, 372; keps202 lines 119-120 (1928), 53-62 (Machal Lalung, 54 years, July 2005)). K03 second source Puttaswamy conclusion 3(I) matches. | none |
| POL03-K04 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (hees205 line 462; keps105 lines 31, 91-103, 247, 330, 372; keps202 lines 119-120 (1928), 53-62 (Machal Lalung, 54 years, July 2005)). K03 second source Puttaswamy conclusion 3(I) matches. | none |
| POL03-K05 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (hees205 line 462; keps105 lines 31, 91-103, 247, 330, 372; keps202 lines 119-120 (1928), 53-62 (Machal Lalung, 54 years, July 2005)). K03 second source Puttaswamy conclusion 3(I) matches. | none |
| POL03-K06 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (hees205 line 462; keps105 lines 31, 91-103, 247, 330, 372; keps202 lines 119-120 (1928), 53-62 (Machal Lalung, 54 years, July 2005)). K03 second source Puttaswamy conclusion 3(I) matches. | none |
| POL03-K07 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. (hees205 line 462; keps105 lines 31, 91-103, 247, 330, 372; keps202 lines 119-120 (1928), 53-62 (Machal Lalung, 54 years, July 2005)). K03 second source Puttaswamy conclusion 3(I) matches. | none |
| POL03-K08 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K09 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K10 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K11 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K12 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K13 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K14 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K15 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K16 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-K17 | PASS | NCERT file text found at the cited place (grep of the .txt); wording and page match. K12 Rosa Parks 1 Dec 1955 and Civil Rights Act 1964 at gess301 lines 161-169. K14 UNVERIFIED right. | none |
| POL03-L01 | PASS | Art. 15(2)(a) and Art. 17 text; marked as inference. | none |
| POL03-L02 | PASS | D20 and D22 as above; official D.K. Basu copy now the second source. | none |
| POL03-L03 | PASS | Puttaswamy conclusion 5; zero hits for "privacy" in the Constitution text (grep over leg_constitution_sep2026.txt). | none |
| POL03-L04 | PASS | Maneka Gandhi opinion lines 3060-3085 and headnote 138-151: impounded "in public interest", reasons refused 6 Jul 1977; reasons in the counter-affidavit (lines 3254, 3291). | none |
| POL03-L05 | PASS | Puttaswamy conclusion 5; zero hits for "privacy" in the Constitution text (grep over leg_constitution_sep2026.txt). | none |
| POL03-L06 | FIX | As F06; status downgraded to UNVERIFIED. | applied (see changes list) |
| POL03-L07 | PASS | As E02 (official copy). | none |
| POL03-L08 | PASS | Puttaswamy Order item (iii); Prelims 2024 Q76 OCR. | none |
| POL03-L09 | PASS | UNVERIFIED status right; arithmetic 59.5% depends on C24. | none |
| POL03-L10 | PASS | Follow from A10-A11, 13(3)(a)/13(2), and Kesavananda headnote (A08). | none |
| POL03-L11 | FIX | See D21: "only" in the corrected statement was incomplete; claim rewritten with 22(4)(b) and 22(5). | applied (see changes list) |
| POL03-L12 | PASS | Follow from A10-A11, 13(3)(a)/13(2), and Kesavananda headnote (A08). | none |
| POL03-L13 | PASS | Follow from A10-A11, 13(3)(a)/13(2), and Kesavananda headnote (A08). | none |
| POL03-L14 | PASS | Official PUDR: "enforceable against private individuals" (lines 646, 1929). Articles 15(2), 17, 23, 24 are not worded as State-only; the grouping is labelled inference. | none |
| POL03-L15 | PASS | UNVERIFIED right: Mukesh Kumar not opened. | none |
| POL03-X01 | PASS | BLOCKED stays. indiacode.nic.in now redirects to indiacode.gov.in (migrated); the new site answers (HTTP 200) and has a REST search at indiacode.gov.in/server/api (found the PoA Amendment Act 2015). Retry there. | none |
| POL03-X02 | PASS | BLOCKED stays; see X01: indiacode.gov.in is reachable (the old .nic.in host redirects to it), so retry through it. | none |
| POL03-X03 | PASS | BLOCKED stays; see X01: indiacode.gov.in is reachable (the old .nic.in host redirects to it), so retry through it. | none |
| POL03-X04 | PASS | BLOCKED stays; see X01: indiacode.gov.in is reachable (the old .nic.in host redirects to it), so retry through it. | none |
| POL03-X05 | PASS | BLOCKED stays; see X01: indiacode.gov.in is reachable (the old .nic.in host redirects to it), so retry through it. | none |
| POL03-X06 | PASS | BLOCKED stays; see X01: indiacode.gov.in is reachable (the old .nic.in host redirects to it), so retry through it. | none |
| POL03-X07 | PASS | BLOCKED stays; see X01: indiacode.gov.in is reachable (the old .nic.in host redirects to it), so retry through it. | none |
| POL03-X08 | PASS | BLOCKED stays; see X01: indiacode.gov.in is reachable (the old .nic.in host redirects to it), so retry through it. | none |
| POL03-X09 | PASS | BLOCKED stays; eparlib not retried. | none |
| POL03-X10 | PASS | Audit result: official copies obtained for D.K. Basu, PUDR and Ajay Hasia (api.sci.gov.in/jonew/judis 14580, 9882, 4414). digiscr.sci.gov.in and main.sci.gov.in did not connect. Not found: Indra Sawhney, Davinder Singh, Jarnail Singh, Subhash Kumar, Bijoe Emmanuel, Gopalan. Only api.sci.gov.in judis PDFs were reachable. | none |

## Changes applied to claims.csv

1. **A01, A02**: second source and source now the official Ajay Hasia copy; page cell and note rewritten.
2. **A12**: "persons" list corrected (21A "all children", 26 "every religious denomination", 23-24 not limited to citizens).
3. **C01, C03, C04, C05, C06, C07, C08, C09, C15, C16, D24, F06, L06**: status CONFIRMED (D24 CORRECTED) to UNVERIFIED; note "official copy not read; text from Indian Kanoon".
4. **C05, C06, C07**: claim text now says "Indra Sawhney, lead judgment (Jeevan Reddy J. for four judges)".
5. **C11**: note rewritten: the 102nd Amendment conclusion is the 3:2 majority (Bhat, Rao, Gupta JJ.); Bhushan and Nazeer JJ. in the minority.
6. **C17, D09**: note added that the Davinder Singh and Gopalan details are Indian Kanoon only.
7. **C20b**: removed "NCERT/"; only Jarnail Singh draws the Art. 330 contrast.
8. **C21**: claim rewritten (s.3 / s.4 / s.5 for Arts 330A / 332A / 334A, all footnoted 16-4-2026, with an overprinted "(date yet to be notified)"); status UNVERIFIED. POL06-A13 has the same slip and was not touched.
9. **C22**: OM date corrected from 8 Sep 1993 to 22 Oct 1993 (as_of and page cell too).
10. **D10**: page cell corrected to official PDF p.57-58.
11. **D12**: note corrected from four to five separate judgments.
12. **D21, L11**: statements now include Art. 22(4)(b), 22(7) and (for L11) 22(5).
13. **D22, L02, E02, L07, L14**: source fields point to the official copies; notes added.
14. sources/SOURCE.md: one paragraph added about the three official copies.

Nothing else was changed. Backup of the original claims.csv: scratchpad copy only (git does not track research/upsc/**/sources; claims.csv is tracked by the repo as usual).

## Follow-up, 3-4 Nov 2026

Closes the open source gaps left by the audit above. No captcha or bot check was touched. Files saved in `sources/` (`.pdf` and `.txt`). Backups of the three CSVs before the edit are in the session scratchpad only.

**1. Acts (X01-X08), read at indiacode.gov.in.** The old host redirects; the new host's REST search finds each Act and the item's ORIGINAL bundle serves the English PDF (the Hindi file is listed first on some items and was not used). The `url` column now holds the India Code item record.

| Row | New status | What the Act says (place) | Saved as |
|---|---|---|---|
| X01 Protection of Civil Rights Act 1955 | CONFIRMED | long title and s.1 with footnote 3: renamed w.e.f. 19-11-1976 by Act 106 of 1976 (PDF p.4); s.3 penalty | indiacode_pcr_1955 |
| X02 Bonded Labour System (Abolition) Act 1976 | CONFIRMED | s.4 abolished (p.5); ss.16-18 offences, up to 3 years (p.9); s.1(3) deemed from 25 Oct 1975 | indiacode_bonded_labour_1976 |
| X03 Child and Adolescent Labour Act 1986 (2016) | **CORRECTED** | s.3(1) bans work in any occupation, but s.3(2) lets a child help family/family enterprise outside school hours and work as an audio-visual artist; 1-9-2016 | indiacode_calpra_1986 |
| X04 RTE Act 2009 | CONFIRMED | s.12(1)(c) 25% of Class I (p.9-10); in force 1 Apr 2010 | indiacode_rte_2009 |
| X05 BNSS 2023 | CONFIRMED | s.163 urgent nuisance orders (p.65); s.148 dispersal of five or more (p.61); s.531 repeals CrPC (p.174); 1 Jul 2024. The s.144 match is by subject only; text is as on 6 Oct 2025 | indiacode_bnss_2023 |
| X06 DPDP Act 2023 | CONFIRMED | G.S.R. 843(E) of 13 Nov 2025: three stages (now, +1 year, +18 months); Board by G.S.R. 844(E); Rules 2025 r.1 | indiacode_dpdp_act_2023, _dpdp_gsr843_commencement, _dpdp_gsr844_board, _dpdp_rules_2025 |
| X07 PoA Act 1989 as amended | CONFIRMED | 2015 Act = Act 1 of 2016, w.e.f. 26-1-2016; 2018 Act = Act 27 of 2018, s.18A w.e.f. 20-8-2018 (p.16) | indiacode_poa_1989_consolidated |
| X08 PHRA 1993 and FRA 2006 | CONFIRMED | PHRA s.1(3) deemed 28-9-1993, s.3, s.18; FRA s.3(1), in force 31-12-2007 | indiacode_phra_1993, indiacode_fra_2006 |

Knock-on notes (follow-up sentence added, status unchanged): B13, E03, D06, H07. K14 moved UNVERIFIED to CONFIRMED (FRA s.3(1)(a), (c), (d) match NCERT). X09 and X10 stay BLOCKED (not retried).

**2. Supreme Court's own copies (api.sci.gov.in).** Found by listing the court's `jonew/judis` IDs by date (the old judgments sit in date order, newest first) and, for post-2010 cases, the `supremecourt/<year>/<diary>/` path from the court's own order links.

| Judgment | Copy | Rows | Result |
|---|---|---|---|
| Jarnail Singh, 26 Sep 2018 | supremecourt/2011/34614/..._Judgement_26-Sep-2018.pdf | C09 | CONFIRMED: one judgment by Nariman J., bench Misra CJI, Joseph, Nariman, Kaul, Malhotra; paras 14, 21 |
| Davinder Singh, 1 Aug 2024 | supremecourt/2010/25536/..._54462_Judgement_01-Aug-2024.pdf | C15, C16, C17 | C15 CONFIRMED (6:1; para 205 by the CJI and Misra J.; Trivedi J. dissent para 80). C16 CONFIRMED and widened: Gavai J. para 295, and Nath, Mithal and Sharma JJ. say they agree; the CJI's conclusions do not hold on it. C17 note: para 205(f)(iii) now read |
| Subhash Kumar, 9 Jan 1991 | judis/12854.pdf | D24 | CONFIRMED: K.N. Singh and N.D. Ojha JJ.; pollution-free water and air under Art. 21 (p.7) |
| Bijoe Emmanuel, 11 Aug 1986 | judis/8973.pdf | F06, L06 | CONFIRMED: judgment of Chinnappa Reddy J. (bench with M.M. Dutt J.); Arts 19(1)(a), 25(1); re-admission ordered (p.16); "no provisions of law which obliges anyone to sing" (p.7-8) |
| Gopalan, 19 May 1950 | judis/1251.pdf | D09 | Date and six-judge bench match; Kania CJ on "different and separate rights" (p.20). Status was already CONFIRMED (via Puttaswamy); note only |
| Indra Sawhney, 16 Nov 1992 | **not found** | C01, C03-C08 | judis has no entry (IDs 12281-12284 and 12287 are 404; 12286 is another case); digiscr.sci.gov.in and main.sci.gov.in did not connect; scr.sci.gov.in needs a captcha (not touched). Stay UNVERIFIED, note added |

Official copies saved: official_jarnail_singh, official_davinder_singh, official_subhash_kumar, official_bijoe_emmanuel, official_gopalan.

**3. Checklist.** Added CK86 National Human Rights Commission (NHRC) (keps2 p.42; H07, X08; full account to POL-24), CK87 Fundamental Duties of citizens (p.44; I07, I08; duties as a topic to POL-05), CK88 Right to Property (p.46; J01, J02, D04). Claims existed for all three, so none is "set aside".

**4. POL-06.** POL06-A13 in `research/upsc/POL-06/claims.csv` now carries C21's wording, value, page reference and status (UNVERIFIED); its note records the correction (Arts 330A, 332A, 334A are footnotes s.3, s.4, s.5, all w.e.f. 16-4-2026, with the "(date yet to be notified)" text layer on top). Not changed: line 37 of POL-06/dossier.md still repeats the old "only s.4" sentence.

**Counts now (claims.csv, 154 rows):** CONFIRMED 132, UNVERIFIED 15, CORRECTED 4, BLOCKED 2, CONFLICT 1.
