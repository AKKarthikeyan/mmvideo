# RBI Grade B: economics and finance syllabus, mapped onto the series (AK, 9 Nov 2026)

Source: Reserve Bank of India Services Board, Advt. No. RBISB/DA/03/2025-26 (Panel Year 2025), Appendix II (General cadre, printed pages 32-36) and Appendix III (DEPR, pages 37-40). AK's call: the economics syllabus there is good, so it runs beside the UPSC series. The same videos serve both exams.

## What is in scope and what is not

**In:** Paper I Economic and Social Issues; Paper III Financial System, Financial Markets and General Topics (a to c); every DEPR economics paper (microeconomics, macroeconomics, quantitative methods, Indian economy policy and trends).

**Out for now:** English, reasoning, quantitative aptitude and general awareness (Phase I General); Paper III management, organisational behaviour and ethics (d); the DSIM (statistics) cadre's own papers, beyond the shared quantitative-methods videos. Say if you want any of these added.

## How it is built

- A new serial, **RBI Grade B (economics and finance)**: 11 seasons in the notice's order, 38 new episodes (`ECR-01` to `ECR-38`, tier `R`) and the existing UPSC economics, optional-economics, agriculture, geography and polity episodes shown inline (the same video, not a copy).
- Every line of the RBI syllabus is a code (`RBI-ESI1`, `RBI-FS3`, `RBI-MAC4`...) in `scripts/upsc/check_coverage.py`, tagged on the episodes in `catalogue.csv`. The check fails if a line has no episode.
- Rules do not change: NCERT-first where an NCERT chapter exists, research from the original publisher (RBI, BIS, MoSPI, Economic Survey, the Union Budget, the company filing), Gold Standard, ELI5 with depth. The theory episodes (`F`) cite the original papers and the standard texts the RBI notice lists (Mishra & Puri, Uma Kapila, Debraj Ray, Andley and Sundaram, Kurihara, Meier and Baldwin); each needs the usual audit before a script.
- Living episodes (`L`) carry dated figures and need a re-check before every upload, like the UPSC ones.

## Reuse: how much was already there

71 existing episodes already serve an RBI line; 38 new ones close the gaps. A line marked **new only** had no UPSC episode before.

## Line by line

| Code | RBI syllabus line | Existing episodes | New episodes |
|---|---|---|---|
| RBI-ESI1 | Growth and development: national and per-capita income, poverty and jobs, sustainable development and the environment | ECO-01, ECO-07, ECO-08, ECO-09, ECO-24 | ECR-01 |
| RBI-ESI2 | Indian economy: economic history, industrial and labour policy, monetary and fiscal policy since 1991, Survey and Budget, money and financial markets, banks and the RBI in development, public finance, political economy, industry, agriculture, services | ECO-02, ECO-03, ECO-04, ECO-05, ECO-06, ECO-10, ECO-11, ECO-12, ECO-13, ECO-14, ECO-15, ECO-16, ECO-21, ECO-26, AGR-05, ECO-29, ECO-31, ECO-33, ECO-37, ECO-46 | ECR-02, ECR-03, ECR-04, ECR-06 |
| RBI-ESI3 | Globalisation: opening up, balance of payments, export-import policy, IMF, World Bank, WTO, regional co-operation, international economic issues | ECO-18, ECO-19, ECO-20, ECO-22, ECO-50 | ECR-05, ECR-09, ECR-10, ECR-13 |
| RBI-ESI4 | Social structure: multiculturalism, demographic trends, urbanisation and migration, gender issues, social justice | ECO-23, GEO-31, GEO-34, POL-24 | ECR-07, ECR-08 |
| RBI-FS1 | Paper III a1: structure and functions of financial institutions | ECO-33, ECO-37, ECO-40, ECO-41 | - |
| RBI-FS2 | a2: functions of the Reserve Bank of India | ECO-14 | - |
| RBI-FS3 | a3: the banking system, SIDBI, EXIM, NABARD, NHB, NaBFID | ECO-37, ECO-38, ECO-39, ECO-51 | - |
| RBI-FS4 | a4: recent developments in the global financial system and their impact on India | **new only** | ECR-10 |
| RBI-FS5 | a5: information technology in banking and finance | ECO-34, ECO-35, ECO-36 | - |
| RBI-FS6 | a6: the non-banking system | ECO-37 | ECR-16 |
| RBI-FS7 | a7: developments in digital payments | ECO-34, ECO-35, ECO-36 | - |
| RBI-FMK | b: primary and secondary markets (forex, money, bond, equity), functions, instruments | ECO-18, ECO-29, ECO-42 | ECR-11, ECR-12, ECR-13 |
| RBI-GT1 | c1: financial risk management | ECO-39 | ECR-15 |
| RBI-GT2 | c2: basics of derivatives | ECO-42 | ECR-14 |
| RBI-GT3 | c3: global financial markets and international banking | **new only** | ECR-21 |
| RBI-GT4 | c4: financial inclusion | ECO-17, ECO-51 | - |
| RBI-GT5 | c5: alternate sources of finance, private and social cost-benefit, PPP | ECO-25 | ECR-20 |
| RBI-GT6 | c6: corporate governance in the banking sector | ECO-43 | ECR-17 |
| RBI-GT7 | c7: the Union Budget, concepts, approach, trends | ECO-10, ECO-45 | ECR-03 |
| RBI-GT8 | c8: accounting and financial statements, ratio analysis | **new only** | ECR-18, ECR-19 |
| RBI-GT9 | c9: inflation, WPI and CPI, inflation against growth | ECO-15, ECO-44 | - |
| RBI-MIC1 | DEPR micro: consumer theory (utility, indifference curves, substitution effect, game theory) | ECO-30 | ECR-22, ECR-23 |
| RBI-MIC2 | DEPR micro: production theory (production functions, returns, partial and general equilibrium) | ECO-49 | ECR-24, ECR-25 |
| RBI-MIC3 | DEPR micro: market theory, pricing under market structures | ECD-01, ECD-03, ECO-30, ECO-49 | ECR-23 |
| RBI-MIC4 | DEPR micro: distribution theories (Ricardo, Marx, Kalecki, Kaldor) | ECD-02 | - |
| RBI-MIC5 | DEPR micro: welfare economics (Pareto, Arrow, Coase, Sen) | ECD-04 | ECR-25 |
| RBI-MAC1 | DEPR macro: national income accounting | ECO-01 | - |
| RBI-MAC2 | DEPR macro: employment and output, Keynes, business cycles | ECD-05 | ECR-26, ECR-28 |
| RBI-MAC3 | DEPR macro: inflation, Phillips curve, Taylor rule, Lucas critique | **new only** | ECR-27 |
| RBI-MAC4 | DEPR macro: money and banking, quantity theory, IS-LM, AD-AS, money multiplier, monetary policy, inflation targeting | ECO-15, ECO-16, ECD-05, ECD-06, ECD-07 | ECR-28 |
| RBI-MAC5 | DEPR macro: theories of growth and development | ECD-13, ECD-14 | ECR-29 |
| RBI-MAC6 | DEPR macro: international trade, exchange rates, balance of payments, impossible trinity | ECO-19, ECD-08, ECD-09, ECD-10, ECD-11, ECD-12 | ECR-30 |
| RBI-MAC7 | DEPR macro: public finance theory (taxation, expenditure, debt) | ECO-12, ECO-45 | ECR-31 |
| RBI-ENV | DEPR: environmental economics (green GDP, valuation, policy instruments) | ECD-15 | ECR-01 |
| RBI-QM1 | DEPR Paper II: mathematical methods | **new only** | ECR-32, ECR-33 |
| RBI-QM2 | DEPR Paper II: statistical methods | **new only** | ECR-34, ECR-35 |
| RBI-QM3 | DEPR Paper II: econometrics, Bayesian basics, AI and machine learning | **new only** | ECR-36, ECR-37, ECR-38 |
| RBI-IE1 | DEPR Indian economy: fiscal policy | ECO-10, ECO-11, ECO-12, ECO-13, ECO-47 | - |
| RBI-IE2 | DEPR Indian economy: monetary policy and the RBI | ECO-14, ECO-15 | - |
| RBI-IE3 | DEPR Indian economy: banking and financial sector | ECO-16, ECO-38, ECO-39 | - |
| RBI-IE4 | DEPR Indian economy: inflation, trends and drivers | ECO-15, ECO-44 | - |
| RBI-IE5 | DEPR Indian economy: external sector, exchange rate, external debt, BoP | ECO-18, ECO-19, ECO-48 | ECR-09 |
| RBI-IE6 | DEPR Indian economy: agriculture, industry, services, social sector | ECO-26, ECO-27, ECO-28, AGR-05, AGR-06, AGR-07, ECO-31 | ECR-04 |
| RBI-CUR | DEPR Phase I: current developments in the Indian economy (living episodes plus the monthly current-affairs scan) | ECO-07, ECO-15, ECO-19, ECO-44 | - |

## The 38 new episodes

| Id | Episode | Kind | Covers |
|---|---|---|---|
| ECR-01 | What pollution costs: green GDP and carbon prices | fixed | green GDP · environmental valuation · carbon tax · tradable permits · polluter pays |
| ECR-02 | Hire and fire: labour laws and the four codes | living | industrial relations · labour codes · flexibility debate · informal work |
| ECR-03 | The Economic Survey: what it says and how it differs from the Budget | living | Survey chapters · Survey v Budget · how to read both |
| ECR-04 | The services boom: why most of India's GDP is services | living | sector shares · IT-BPM · tourism · services exports · jobs |
| ECR-05 | Trade blocs and trade deals: SAARC ASEAN RCEP BRICS | living | regional economic co-operation · free trade agreements · why India stayed out of RCEP |
| ECR-06 | Why reforms stall: the political economy of India | living | lobbies · subsidies · federal bargaining · populism and reform |
| ECR-07 | Women and work: why so few Indian women are counted | living | female labour participation · wage gap · unpaid and care work |
| ECR-08 | Caste, class and inequality: who gets ahead | living | social structure · mobility · multiculturalism · affirmative action as policy |
| ECR-09 | What India owes the world: external debt and reserves | living | external debt · reserves · short-term debt · adequacy |
| ECR-10 | When America sneezes: how global finance reaches India | living | 2008 crisis · taper tantrum · capital flows · spillovers |
| ECR-11 | The money market: call money T-bills CPs and CDs | living | call money · treasury bills · commercial paper · certificates of deposit · repo market |
| ECR-12 | Government bonds and the yield curve | living | G-secs · yield · yield curve · auctions · who buys |
| ECR-13 | The forex market: how currencies actually trade | living | spot · forward · swaps · RBI intervention · reserves |
| ECR-14 | Futures options and swaps: derivatives explained (no advice) | fixed | forwards · futures · options · swaps · hedging |
| ECR-15 | How banks manage risk: credit market liquidity operational | fixed | four risks · asset-liability management · stress tests · value at risk |
| ECR-16 | Shadow banks: NBFCs IL&FS and the rules that followed | living | NBFC types · IL&FS · scale-based regulation |
| ECR-17 | Who watches the bank? Boards auditors and governance failures | living | corporate governance in banks · fit and proper · Yes Bank · PMC Bank |
| ECR-18 | Reading a balance sheet and a profit and loss account | fixed | assets · liabilities · equity · income statement · a bank against a company |
| ECR-19 | Cash flow and ratios: debt to equity debtor days return on equity | fixed | cash flow statement · liquidity and leverage ratios · turnover · ROA · ROE |
| ECR-20 | Private cost v social cost: cost-benefit and new ways to fund projects | fixed | social cost-benefit · PPP · venture capital · crowdfunding · social impact bonds |
| ECR-21 | Banks across borders: the BIS Basel and international banking | living | cross-border lending · offshore banking · BIS statistics · globally important banks |
| ECR-22 | Choosing between goods: utility and indifference curves | fixed | marginal utility · indifference curves · budget line · income and substitution effects · Giffen goods |
| ECR-23 | Game theory: why rivals get stuck | fixed | prisoner's dilemma · Nash equilibrium · repeated games · oligopoly |
| ECR-24 | Production and cost: returns to scale and the shape of a firm | fixed | production functions · Cobb-Douglas · returns to scale · isoquants |
| ECR-25 | All markets at once: general equilibrium | fixed | partial v general equilibrium · Walras · Edgeworth box · welfare theorems |
| ECR-26 | Booms and slumps: theories of the business cycle | fixed | cycle phases · Keynesian · real business cycle · Kalecki's political cycle |
| ECR-27 | The Phillips curve the Taylor rule and the Lucas critique | fixed | inflation-unemployment trade-off · rules v discretion · expectations |
| ECR-28 | AD-AS: one picture of the whole economy | fixed | aggregate demand · aggregate supply · shocks · stagflation |
| ECR-29 | The Solow model: why some countries grow | fixed | capital accumulation · steady state · convergence · endogenous growth |
| ECR-30 | The impossible trinity: what a country cannot have at once | fixed | fixed rate · free capital flows · independent monetary policy · India's choice |
| ECR-31 | Taxes spending and debt in theory | fixed | optimal taxation · benefit principle · Wagner's law · Ricardian equivalence · debt sustainability |
| ECR-32 | Calculus for economists: marginal and optimal | fixed | derivatives · optimisation · Lagrange · integration |
| ECR-33 | Matrices linear algebra and linear programming | fixed | matrices · inverse · linear programming · sets |
| ECR-34 | Average and spread: statistics and probability for economists | fixed | mean median mode · dispersion · probability · distributions |
| ECR-35 | Index numbers and time series | fixed | Laspeyres · Paasche · Fisher · trend · seasonality · moving average |
| ECR-36 | Regression: what ordinary least squares does | fixed | OLS · assumptions · R-squared · hypothesis tests · multicollinearity |
| ECR-37 | Panel data and time-series econometrics | fixed | fixed and random effects · stationarity · cointegration · ARIMA · VAR |
| ECR-38 | Bayes machine learning and AI in economics | fixed | Bayesian updating · prediction v causation · nowcasting |

## Notes on the syllabus itself

- Both General cadre papers are half objective, half typed-descriptive; DEPR Phase II papers are descriptive, so the theory episodes should end on a worked written answer, as the UPSC PYQ-answer plan does.
- The notice lists "material sourced from RBI and BIS website" as reference: the RBI Annual Report, Report on Trend and Progress of Banking in India, Report on Currency and Finance, RBI Bulletin, Economic Survey and IMF WEO are our primary sources for the living episodes.
- The notice's 2025 exam dates (18 Oct, 6-7 Dec 2025) are past; the syllabus is the same in outline each year, so the series is evergreen like the UPSC one. Re-check the syllabus against the next notice.
- Not yet done: research folders, scripts, voice or renders for any ECR episode. This is the plan and the coverage map only.
