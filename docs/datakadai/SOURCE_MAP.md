# Data Kadai: source map

Mapped 2026-10-10. 212 sources. This is a map of where reliable data lives, not the data itself:
pull the latest figures from a source only when a story needs them.

- **Tier 1** = the official or primary publisher. **Tier 2** = a research institution. **Tier 3** = industry body, NGO or private
  compiler: name it on screen and cross-check against a Tier 1 source where one exists.
- **Access** was tested from the MacBook Air on the mapping date: 172 open to scripts, 33 open only in a browser
  (the site blocks automated requests), 7 gave no response and need a second look.
- Descriptions of what each source offers are from general knowledge of the publisher, not from reading each site today.
- Machine-readable copy: `public/datayt/sources/source_map.json`. Already-collected tables: `SOURCES_CATALOG.md`.

## India: statistics system and Parliament (18)

| Source | What it gives | Level | Frequency | Tier | Access |
| --- | --- | --- | --- | --- | --- |
| [MoSPI eSankhyiki (API)](https://esankhyiki.mospi.gov.in) | National accounts, CPI, IIP, PLFS, ASI, HCES through one API | State-wise | monthly to annual | 1 | Script can fetch |
| [MoSPI press releases](https://www.mospi.gov.in/press-release) | GDP, CPI, IIP, PLFS release notes with tables | State-wise | monthly | 1 | Script can fetch |
| [MoSPI reports and publications](https://www.mospi.gov.in/publications-reports) | NSS survey reports, Women and Men in India, Energy Statistics, EnviStats | State-wise | annual | 1 | Script can fetch |
| [Census of India](https://censusindia.gov.in) | Population, housing, language, migration tables | State-wise | decennial | 1 | Script can fetch |
| [Sample Registration System](https://censusindia.gov.in/census.website/data/SRSSTAT) | Birth, death, infant mortality, fertility, life tables | State-wise | annual | 1 | Script can fetch |
| [Open Government Data portal](https://www.data.gov.in) | Catalogue of ministry datasets, API with a free key | State-wise | varies | 1 | Script can fetch |
| [NITI Aayog NDAP](https://ndap.niti.gov.in) | Cleaned, joined datasets from ministries | State-wise | varies | 1 | Script can fetch |
| [NITI Aayog reports](https://www.niti.gov.in/documents/reports) | State indices: health, export readiness, fiscal health, MPI | State-wise | annual | 1 | Script can fetch |
| [SDG India Index](https://sdgindiaindex.niti.gov.in) | State and UT scores on each SDG | State-wise | annual | 1 | Script can fetch |
| [Economic Survey](https://www.indiabudget.gov.in/economicsurvey/) | Statistical appendix and chapter data | National | annual | 1 | Script can fetch |
| [Union Budget](https://www.indiabudget.gov.in) | Receipts, expenditure, transfers to states | State-wise | annual | 1 | Script can fetch |
| [Press Information Bureau](https://www.pib.gov.in) | Every ministry's releases (already scanned daily) | State-wise | daily | 1 | Script can fetch |
| [Lok Sabha questions and answers](https://sansad.in/ls/questions/questions-and-answers) | Ministers' written answers, many with state-wise annexures (being harvested) | State-wise | each session | 1 | Script can fetch |
| [Rajya Sabha questions and answers](https://sansad.in/rs/questions/questions-and-answers) | Same for the upper house | State-wise | each session | 1 | Script can fetch |
| [Comptroller and Auditor General](https://cag.gov.in/en/audit-report) | Audit reports, state finance accounts | State-wise | annual | 1 | Script can fetch |
| [Controller General of Accounts](https://cga.nic.in) | Monthly union accounts, fiscal deficit | National | monthly | 1 | Script can fetch |
| [Finance Commission](https://fincomindia.nic.in) | Tax devolution, state fiscal data | State-wise | five-yearly | 1 | Script can fetch |
| [Election Commission of India](https://www.eci.gov.in/statistical-reports) | Turnout, results, electors by state and seat | State-wise | each election | 1 | Script can fetch |

## India: finance regulators and market bodies (24)

| Source | What it gives | Level | Frequency | Tier | Access |
| --- | --- | --- | --- | --- | --- |
| [RBI Database on Indian Economy](https://data.rbi.org.in) | Banking, money, external sector, state finances time series | State-wise | weekly to annual | 1 | Script can fetch |
| [RBI Handbook of Statistics on Indian States](https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States) | 181 state tables (already collected) | State-wise | annual | 1 | Script can fetch |
| [RBI Handbook of Statistics on the Indian Economy](https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+Economy) | Long national series | National | annual | 1 | Script can fetch |
| [RBI State Finances: A Study of Budgets](https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=State+Finances+:+A+Study+of+Budgets) | State revenue, spending, debt | State-wise | annual | 1 | Script can fetch |
| [RBI Bulletin and Weekly Statistical Supplement](https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx) | Forex reserves, credit, deposits, surveys | National | weekly, monthly | 1 | Script can fetch |
| [RBI Annual Report and Financial Stability Report](https://www.rbi.org.in/Scripts/AnnualReportMainDisplay.aspx) | Banking health, frauds, currency in circulation | National | annual, half-yearly | 1 | Script can fetch |
| [SEBI reports and statistics](https://www.sebi.gov.in/reports-and-statistics.html) | Bulletin, Handbook of Statistics, investor and market data, annual report | National | monthly, annual | 1 | Script can fetch |
| [IRDAI](https://irdai.gov.in) | Handbook on Indian Insurance Statistics, annual report, monthly business figures | State-wise | monthly, annual | 1 | Script can fetch |
| [PFRDA](https://www.pfrda.org.in) | NPS and Atal Pension Yojana subscribers and assets, annual report | State-wise | monthly, annual | 1 | Script can fetch |
| [NPS Trust](https://npstrust.org.in) | Scheme-wise NPS assets and returns | National | weekly | 1 | Script can fetch |
| [TRAI performance indicators](https://www.trai.gov.in/release-publication/reports/performance-indicators-reports) | Phone and internet subscribers by service area | State-wise | quarterly | 1 | Script can fetch |
| [TRAI telecom subscription data](https://www.trai.gov.in/release-publication/reports/telecom-subscriptions-reports) | Monthly subscriber counts by circle | State-wise | monthly | 1 | Script can fetch |
| [EPFO payroll data](https://www.epfindia.gov.in) | Net new formal-sector subscribers by state, age, industry *(The specific section link did not open; this is the site's home page.)* | State-wise | monthly | 1 | Script can fetch |
| [Insolvency and Bankruptcy Board](https://ibbi.gov.in/en/publication) | Insolvency cases and recoveries | National | quarterly | 1 | Script can fetch |
| [NABARD](https://www.nabard.org) | Rural finance, NAFIS household survey, state focus papers | State-wise | annual | 1 | Script can fetch |
| [National Housing Bank RESIDEX](https://residex.nhbonline.org.in) | Housing price index by city | State-wise | quarterly | 1 | Script can fetch |
| [NPCI statistics](https://www.npci.org.in/statistics) | UPI, IMPS, RuPay volumes and values | National | monthly | 1 | Browser only |
| [AMFI](https://www.amfiindia.com/research-information) | Mutual fund assets, SIP flows, state-wise AUM *(The specific section link did not open; this is the site's home page.)* | State-wise | monthly | 3 | Script can fetch |
| [NSE Market Pulse](https://www.nseindia.com/research/publications-reports-nse-market-pulse) | Investor counts by state, turnover, market ownership | State-wise | monthly | 3 | Script can fetch |
| [BSE](https://www.bseindia.com/markets/keystatics/Keystat_index.aspx) | Market statistics, investors by state | State-wise | daily | 3 | Script can fetch |
| [NSDL FPI Monitor](https://www.fpi.nsdl.co.in) | Foreign portfolio flows by sector and country | National | fortnightly | 1 | Script can fetch |
| [GST statistics](https://www.gst.gov.in/download/gststatistics) | State-wise GST collections, returns filed, registrations | State-wise | monthly | 1 | Script can fetch |
| [GST Council](https://gstcouncil.gov.in) | Council decisions, revenue data | State-wise | per meeting | 1 | Script can fetch |
| [Income Tax Department statistics](https://incometaxindia.gov.in/Pages/Direct-Taxes-Data.aspx) | Returns filed by income band, collections by state | State-wise | annual | 1 | Browser only |

## India: ministries, departments and agencies (62)

| Source | What it gives | Level | Frequency | Tier | Access |
| --- | --- | --- | --- | --- | --- |
| [Department of Economic Affairs](https://dea.gov.in) | Monthly Economic Review, public debt | National | monthly | 1 | Script can fetch |
| [Health and Family Welfare](https://mohfw.gov.in) | Annual report, Rural Health Statistics, National Health Accounts | State-wise | annual | 1 | Script can fetch |
| [NFHS (IIPS)](https://www.nfhsiips.in) | Family health survey fact sheets and reports (states already collected) | State-wise | every few years | 1 | Script can fetch |
| [Health Management Information System](https://hmis.mohfw.gov.in) | Facility-level health service data | State-wise | monthly | 1 | Script can fetch |
| [Central TB Division](https://tbcindia.mohfw.gov.in) | India TB Report | State-wise | annual | 1 | Script can fetch |
| [Education](https://www.education.gov.in) | Annual report, education statistics at a glance | State-wise | annual | 1 | Script can fetch |
| [UDISE+](https://udiseplus.gov.in) | Schools, enrolment, teachers, facilities | State-wise | annual | 1 | Script can fetch |
| [AISHE](https://aishe.gov.in) | Colleges, universities, enrolment, gender parity | State-wise | annual | 1 | Script can fetch |
| [Agriculture and Farmers Welfare](https://agriwelfare.gov.in) | Annual report, crop estimates | State-wise | annual | 1 | Script can fetch |
| [Directorate of Economics and Statistics (Agriculture)](https://desagri.gov.in) | Agricultural Statistics at a Glance, area and yield | State-wise | annual | 1 | No response |
| [UPAg](https://upag.gov.in) | Unified crop production, prices, trade | State-wise | monthly | 1 | Script can fetch |
| [Agmarknet](https://agmarknet.gov.in) | Mandi arrivals and prices by market | State-wise | daily | 1 | Script can fetch |
| [Animal Husbandry and Dairying](https://dahd.gov.in) | Livestock census, Basic Animal Husbandry Statistics (milk, eggs, meat) | State-wise | annual | 1 | Script can fetch |
| [Consumer Affairs price monitoring](https://fcainfoweb.nic.in) | Daily retail and wholesale prices of 22+ essentials by city | State-wise | daily | 1 | Browser only |
| [Food and Public Distribution](https://dfpd.gov.in) | Procurement, stocks, ration cards | State-wise | monthly | 1 | Script can fetch |
| [Rural Development](https://rural.gov.in) | Annual report; MGNREGA, PMAY-G, PMGSY dashboards | State-wise | annual | 1 | Script can fetch |
| [MGNREGA](https://nrega.nic.in) | Person-days, wages, households by state and district | State-wise | daily | 1 | Script can fetch |
| [Jal Jeevan Mission](https://ejalshakti.gov.in) | Tap-water connections by state and village | State-wise | daily | 1 | Browser only |
| [Pradhan Mantri Jan Dhan Yojana](https://pmjdy.gov.in) | Accounts and balances by state | State-wise | weekly | 1 | Script can fetch |
| [Labour and Employment](https://labour.gov.in) | Annual report, labour codes | National | annual | 1 | Script can fetch |
| [Labour Bureau](https://labourbureau.gov.in) | CPI for workers, wage rates, Quarterly Employment Survey | State-wise | monthly | 1 | Script can fetch |
| [Power](https://powermin.gov.in) | Annual report, electrification | State-wise | annual | 1 | Script can fetch |
| [Central Electricity Authority](https://cea.nic.in) | Installed capacity, generation, per-capita consumption by state | State-wise | monthly | 1 | Script can fetch |
| [National Power Portal](https://npp.gov.in) | Daily and monthly generation reports | State-wise | daily | 1 | Script can fetch |
| [New and Renewable Energy](https://mnre.gov.in) | Renewable capacity by state, annual report | State-wise | monthly | 1 | Script can fetch |
| [Petroleum Planning and Analysis Cell](https://ppac.gov.in) | Petrol, diesel, LPG consumption and prices by state | State-wise | monthly | 1 | Browser only |
| [Coal](https://coal.gov.in) | Production, dispatch, coal directory | State-wise | monthly | 1 | No response |
| [Road Transport and Highways](https://morth.nic.in) | Road Accidents in India, highway length, annual report | State-wise | annual | 1 | Script can fetch |
| [Vahan dashboard](https://vahan.parivahan.gov.in/vahan4dashboard/) | Vehicle registrations by state, fuel, class | State-wise | daily | 1 | Script can fetch |
| [Indian Railways](https://indianrailways.gov.in) | Year book, freight and passenger statistics | National | annual | 1 | Script can fetch |
| [DGCA](https://www.dgca.gov.in) | Domestic air traffic, airline market share | National | monthly | 1 | Script can fetch |
| [Airports Authority of India](https://www.aai.aero/en/business-opportunities/aai-traffic-news) | Passengers and cargo by airport | State-wise | monthly | 1 | Browser only |
| [Commerce: Tradestat](https://tradestat.commerce.gov.in) | Exports and imports by commodity and country | National | monthly | 1 | Script can fetch |
| [Commerce: NIRYAT](https://niryat.gov.in) | Exports by state and district | State-wise | monthly | 1 | No response |
| [DPIIT](https://dpiit.gov.in/publications/fdi-statistics) | FDI by state, sector, country; Startup India | State-wise | quarterly | 1 | Script can fetch |
| [MSME (Udyam)](https://msme.gov.in) | Registered MSMEs, annual report | State-wise | annual | 1 | Script can fetch |
| [Corporate Affairs](https://www.mca.gov.in) | Companies registered and struck off by state | State-wise | monthly | 1 | Browser only |
| [Telecommunications](https://dot.gov.in) | Annual report, telecom statistics, BharatNet | State-wise | annual | 1 | Script can fetch |
| [Digital Bharat Nidhi](https://usof.gov.in/en/parliament-questions) | Rural telecom project data and Parliament annexures | State-wise | per session | 1 | Browser only |
| [Electronics and IT](https://www.meity.gov.in) | Digital India, electronics production | National | annual | 1 | Script can fetch |
| [Housing and Urban Affairs](https://mohua.gov.in) | PMAY-U, Smart Cities, Swachh Survekshan | State-wise | annual | 1 | Script can fetch |
| [Home Affairs](https://www.mha.gov.in) | Annual report | National | annual | 1 | Script can fetch |
| [National Crime Records Bureau](https://www.ncrb.gov.in) | Crime in India, accidental deaths and suicides, prison statistics | State-wise | annual | 1 | Script can fetch |
| [Women and Child Development](https://wcd.gov.in) | Annual report, Poshan Tracker | State-wise | annual | 1 | Script can fetch |
| [Tourism](https://tourism.gov.in) | India Tourism Statistics: domestic and foreign visits by state | State-wise | annual | 1 | Script can fetch |
| [Environment, Forest and Climate Change](https://moef.gov.in) | Annual report | National | annual | 1 | Script can fetch |
| [Forest Survey of India](https://fsi.nic.in) | India State of Forest Report | State-wise | two-yearly | 1 | Script can fetch |
| [Central Pollution Control Board](https://cpcb.nic.in) | Air quality index by city, water quality | State-wise | daily | 1 | Script can fetch |
| [India Meteorological Department](https://mausam.imd.gov.in) | Rainfall by sub-division and district, heat waves | State-wise | daily | 1 | Script can fetch |
| [India WRIS](https://indiawris.gov.in) | Reservoir levels, groundwater, rivers | State-wise | weekly | 1 | Script can fetch |
| [Jal Shakti](https://jalshakti-dowr.gov.in) | Water resources annual report | State-wise | annual | 1 | Script can fetch |
| [Tribal Affairs](https://tribal.gov.in) | Statistical profile of Scheduled Tribes *(The specific section link did not open; this is the site's home page.)* | State-wise | occasional | 1 | Script can fetch |
| [Social Justice and Empowerment](https://socialjustice.gov.in) | Annual report, handbook on social welfare statistics | State-wise | annual | 1 | Script can fetch |
| [Steel](https://steel.gov.in) | Production, consumption, prices | National | monthly | 1 | Script can fetch |
| [Mines (Indian Bureau of Mines)](https://ibm.gov.in) | Indian Minerals Yearbook | State-wise | annual | 1 | Script can fetch |
| [Textiles](https://texmin.nic.in) | Annual report, handloom census | State-wise | annual | 1 | No response |
| [Science and Technology](https://dst.gov.in) | R&D statistics | National | two-yearly | 1 | Script can fetch |
| [ISRO](https://www.isro.gov.in) | Launch record, annual report | National | annual | 1 | Script can fetch |
| [Defence](https://mod.gov.in) | Annual report, defence production and exports | National | annual | 1 | Script can fetch |
| [Ports, Shipping and Waterways](https://shipmin.gov.in) | Port traffic, basic port statistics | State-wise | monthly | 1 | Script can fetch |
| [UIDAI](https://uidai.gov.in) | Aadhaar saturation by state *(The specific section link did not open; this is the site's home page.)* | State-wise | daily | 1 | Script can fetch |
| [India Brand Equity Foundation](https://www.ibef.org) | Sector and state summaries compiled from official data | State-wise | monthly | 3 | Browser only |

## India: universities, research institutions and think tanks (28)

| Source | What it gives | Level | Frequency | Tier | Access |
| --- | --- | --- | --- | --- | --- |
| [IIM Ahmedabad research](https://www.iima.ac.in/faculty-research/research-publications) | Working papers, gold policy, agri-business | National | ongoing | 2 | Script can fetch |
| [IIM Bangalore research](https://www.iimb.ac.in) | Working papers, public policy, real estate indices *(The specific section link did not open; this is the site's home page.)* | National | ongoing | 2 | Script can fetch |
| [IIM Calcutta research](https://www.iimcal.ac.in/faculty/publications) | Working papers | National | ongoing | 2 | Script can fetch |
| [IIT Madras research](https://www.iitm.ac.in) | Engineering, transport and energy studies *(The specific section link did not open; this is the site's home page.)* | National | ongoing | 2 | Script can fetch |
| [IIT Bombay research](https://www.iitb.ac.in/en/research-and-development) | Research output; climate and urban studies | National | ongoing | 2 | No response |
| [IIT Delhi research](https://home.iitd.ac.in) | Research output; air quality, transport safety (TRIPP) *(The specific section link did not open; this is the site's home page.)* | National | ongoing | 2 | Script can fetch |
| [Indian Statistical Institute](https://www.isid.ac.in) | Economics and planning unit papers | National | ongoing | 2 | Script can fetch |
| [International Institute for Population Sciences](https://www.iipsindia.ac.in) | NFHS, LASI (ageing), migration studies | State-wise | ongoing | 2 | Script can fetch |
| [IGIDR](http://www.igidr.ac.in) | India Development Report, working papers | National | ongoing | 2 | Script can fetch |
| [NIPFP](https://www.nipfp.org.in) | Public finance, state budgets, tax studies | State-wise | ongoing | 2 | Script can fetch |
| [NCAER](https://ncaer.org) | State Investment Potential Index, surveys, quarterly review | State-wise | ongoing | 2 | Browser only |
| [ICRIER](https://icrier.org) | Trade, agriculture, digital economy papers | National | ongoing | 2 | Script can fetch |
| [Centre for Policy Research](https://cprindia.org) | Governance, urbanisation, accountability studies | State-wise | ongoing | 2 | Script can fetch |
| [CSEP](https://csep.org) | Energy, health, growth and finance research | National | ongoing | 2 | Script can fetch |
| [CEEW](https://www.ceew.in) | Energy, water, climate data and state studies | State-wise | ongoing | 2 | Browser only |
| [TERI](https://www.teriin.org) | Energy and environment data and yearbook | National | ongoing | 2 | Script can fetch |
| [Centre for Science and Environment](https://www.cseindia.org) | State of India's Environment, air and water analyses | State-wise | annual | 3 | Script can fetch |
| [CEDA, Ashoka University](https://ceda.ashoka.edu.in) | Data portals built on official surveys (prices, jobs, health) | State-wise | ongoing | 2 | Script can fetch |
| [Trivedi Centre for Political Data](https://tcpd.ashoka.edu.in) | Election and legislator datasets | State-wise | ongoing | 2 | No response |
| [Azim Premji University, State of Working India](https://cse.azimpremjiuniversity.edu.in) | Employment and earnings studies | State-wise | annual | 2 | Script can fetch |
| [Lokniti-CSDS](https://www.lokniti.org) | National Election Studies, opinion surveys | State-wise | each election | 2 | Script can fetch |
| [Development Data Lab (SHRUG)](https://www.devdatalab.org/shrug) | Village and town level open data platform | State-wise | ongoing | 2 | Script can fetch |
| [Data For India](https://www.dataforindia.com) | Explained charts from official data | State-wise | ongoing | 3 | Script can fetch |
| [PRS Legislative Research](https://prsindia.org) | Budget analysis, state finances, legislature tracking | State-wise | ongoing | 2 | Script can fetch |
| [Dvara Research](https://dvararesearch.com) | Household finance and financial inclusion | National | ongoing | 2 | Script can fetch |
| [ORF](https://www.orfonline.org) | Policy research and data briefs | National | ongoing | 3 | Script can fetch |
| [CMIE](https://www.cmie.com) | Unemployment, capex, household surveys (paid) | State-wise | daily | 3 | Script can fetch |
| [ICRISAT](https://www.icrisat.org) | District-level agriculture database | State-wise | annual | 2 | Browser only |

## India: NGOs and civil society (8)

| Source | What it gives | Level | Frequency | Tier | Access |
| --- | --- | --- | --- | --- | --- |
| [ASER Centre (Pratham)](https://asercentre.org) | Annual Status of Education Report: learning levels by state | State-wise | annual | 3 | Script can fetch |
| [Association for Democratic Reforms](https://adrindia.org) | Candidates' assets and criminal cases, party funding | State-wise | each election | 3 | Script can fetch |
| [Open Budgets India (CBGA)](https://openbudgetsindia.org) | Union, state and district budget data | State-wise | annual | 3 | Script can fetch |
| [Oxfam India](https://www.oxfamindia.org) | Inequality reports | National | annual | 3 | Browser only |
| [IndiaSpend](https://www.indiaspend.com) | Data journalism with source links | State-wise | ongoing | 3 | Browser only |
| [Factly / Dataful](https://dataful.in) | Cleaned copies of official datasets | State-wise | ongoing | 3 | Script can fetch |
| [Janaagraha](https://www.janaagraha.org) | Annual Survey of India's City-Systems | State-wise | annual | 3 | Script can fetch |
| [Public Health Foundation of India](https://phfi.org) | Health system and disease burden studies | State-wise | ongoing | 2 | Script can fetch |

## India: industry bodies and rating agencies (5)

| Source | What it gives | Level | Frequency | Tier | Access |
| --- | --- | --- | --- | --- | --- |
| [SIAM](https://www.siam.in) | Vehicle production, sales, exports | National | monthly | 3 | Script can fetch |
| [FADA](https://fada.in) | Retail vehicle sales | National | monthly | 3 | Script can fetch |
| [NASSCOM](https://nasscom.in) | IT industry revenue and jobs | National | annual | 3 | Browser only |
| [CRISIL research](https://www.crisil.com/en/home/our-analysis.html) | Sector outlooks, state rankings | State-wise | ongoing | 3 | Browser only |
| [World Gold Council](https://www.gold.org/goldhub/data) | Gold demand, reserves, India market | Global, incl. India | quarterly | 3 | Browser only |

## International organisations (48)

| Source | What it gives | Level | Frequency | Tier | Access |
| --- | --- | --- | --- | --- | --- |
| [World Bank Open Data](https://data.worldbank.org/country/india) | World Development Indicators for India and every country | Global, incl. India | annual | 1 | Script can fetch |
| [World Bank API](https://api.worldbank.org/v2/country/IND/indicator/NY.GDP.MKTP.CD?format=json) | Same indicators by API, no key needed | Global, incl. India | annual | 1 | Script can fetch |
| [World Bank India](https://www.worldbank.org/en/country/india) | India Development Update, project documents | National | half-yearly | 1 | Script can fetch |
| [World Bank Poverty and Inequality Platform](https://pip.worldbank.org) | Poverty headcounts on international lines | Global, incl. India | annual | 1 | Script can fetch |
| [World Bank Global Findex](https://www.worldbank.org/en/publication/globalfindex) | Bank accounts, digital payments, saving, borrowing | Global, incl. India | every 3-4 years | 1 | Script can fetch |
| [World Bank Worldwide Governance Indicators](https://www.worldbank.org/en/publication/worldwide-governance-indicators) | Governance scores | Global, incl. India | annual | 1 | Script can fetch |
| [IMF World Economic Outlook](https://www.imf.org/en/Publications/WEO) | GDP, inflation, debt forecasts for all countries | Global, incl. India | twice a year | 1 | Browser only |
| [IMF DataMapper: India](https://www.imf.org/external/datamapper/profile/IND) | Headline macro series and forecasts | Global, incl. India | twice a year | 1 | Browser only |
| [IMF India page](https://www.imf.org/en/Countries/IND) | Article IV reports, statements | National | annual | 1 | Browser only |
| [IMF Data portal](https://data.imf.org) | IFS, balance of payments, COFER reserves | Global, incl. India | monthly | 1 | Browser only |
| [BIS statistics (Basel)](https://data.bis.org) | Credit to GDP, property prices, exchange rates, debt securities, payments | Global, incl. India | quarterly | 1 | Script can fetch |
| [Basel Committee on Banking Supervision](https://www.bis.org/bcbs/) | Basel standards, monitoring reports | Global, incl. India | half-yearly | 1 | Script can fetch |
| [Financial Stability Board](https://www.fsb.org) | Global non-bank finance, crypto, G-SIB lists | Global, incl. India | annual | 1 | Script can fetch |
| [World Economic Forum reports](https://www.weforum.org/publications/) | Global Gender Gap, Future of Jobs, Global Risks, Travel and Tourism | Global, incl. India | annual | 2 | Browser only |
| [FAO FAOSTAT](https://www.fao.org/faostat/en/#country/100) | Crop, livestock, food balance, land use for India | Global, incl. India | annual | 1 | Script can fetch |
| [FAO Food Price Index](https://www.fao.org/worldfoodsituation/foodpricesindex/en/) | World food prices | Global, incl. India | monthly | 1 | Script can fetch |
| [FAO State of Food Security and Nutrition](https://www.fao.org/publications/sofi/en/) | Undernourishment, cost of a healthy diet | Global, incl. India | annual | 1 | Script can fetch |
| [World Food Programme India](https://www.wfp.org/countries/india) | Food security programmes and assessments | National | ongoing | 1 | Script can fetch |
| [International Energy Agency: India](https://www.iea.org/countries/india) | Energy supply, demand, emissions, outlooks | Global, incl. India | annual | 1 | Browser only |
| [IRENA](https://www.irena.org/Data) | Renewable capacity, generation, costs, jobs | Global, incl. India | annual | 1 | Browser only |
| [Energy Institute Statistical Review](https://www.energyinst.org/statistical-review) | Oil, gas, coal, power by country | Global, incl. India | annual | 3 | Browser only |
| [Ember](https://ember-energy.org/data/) | Electricity generation and emissions, India state data | State-wise | monthly | 3 | Script can fetch |
| [UNDP Human Development Reports](https://hdr.undp.org/data-center) | HDI, gender inequality, multidimensional poverty | Global, incl. India | annual | 1 | Script can fetch |
| [UN World Population Prospects](https://population.un.org/wpp/) | Population, fertility, life expectancy to 2100 | Global, incl. India | two-yearly | 1 | Script can fetch |
| [UN Comtrade](https://comtradeplus.un.org) | Trade by product and partner | Global, incl. India | monthly | 1 | Script can fetch |
| [UNCTAD statistics](https://unctadstat.unctad.org) | FDI, trade, shipping, digital economy | Global, incl. India | annual | 1 | Script can fetch |
| [UNICEF data: India](https://data.unicef.org/country/ind/) | Child survival, nutrition, education, water | Global, incl. India | annual | 1 | Browser only |
| [WHO Global Health Observatory](https://www.who.int/data/gho) | Mortality, disease, health systems | Global, incl. India | annual | 1 | Script can fetch |
| [UNESCO Institute for Statistics](https://uis.unesco.org) | Education, literacy, R&D | Global, incl. India | annual | 1 | Browser only |
| [ILO ILOSTAT](https://ilostat.ilo.org) | Employment, wages, informality | Global, incl. India | annual | 1 | Browser only |
| [UN SDG database](https://unstats.un.org/sdgs/dataportal) | Every SDG indicator by country | Global, incl. India | annual | 1 | Script can fetch |
| [ITU DataHub](https://datahub.itu.int) | Internet use, mobile coverage, prices | Global, incl. India | annual | 1 | Browser only |
| [WIPO Global Innovation Index](https://www.wipo.int/en/web/global-innovation-index) | Innovation ranking and patents | Global, incl. India | annual | 1 | Script can fetch |
| [WTO statistics](https://stats.wto.org) | Merchandise and services trade, tariffs | Global, incl. India | annual | 1 | Script can fetch |
| [OECD Data Explorer](https://data-explorer.oecd.org) | India in OECD comparisons (tax, education, migration) | Global, incl. India | annual | 1 | Browser only |
| [Asian Development Bank Key Indicators](https://kidb.adb.org) | Asia-Pacific economic and social indicators | Global, incl. India | annual | 1 | Script can fetch |
| [Our World in Data: India](https://ourworldindata.org/country/india) | Charts compiled from primary sources, with data files | Global, incl. India | ongoing | 2 | Script can fetch |
| [IHME Global Burden of Disease: India](https://www.healthdata.org/research-analysis/health-by-location/profiles/india) | Causes of death and disability, state-level for India | State-wise | annual | 2 | Script can fetch |
| [World Inequality Database: India](https://wid.world/country/india/) | Income and wealth shares | Global, incl. India | annual | 2 | Script can fetch |
| [OPHI Global Multidimensional Poverty Index](https://ophi.org.uk/global-mpi) | Poverty by country and sub-national region | State-wise | annual | 2 | Script can fetch |
| [Global Hunger Index](https://www.globalhungerindex.org) | Hunger ranking (methodology disputed by the Government of India) | Global, incl. India | annual | 3 | Script can fetch |
| [World Happiness Report](https://worldhappiness.report) | Life evaluation ranking | Global, incl. India | annual | 3 | Script can fetch |
| [Transparency International CPI](https://www.transparency.org/en/cpi) | Corruption perception ranking | Global, incl. India | annual | 3 | Script can fetch |
| [SIPRI databases](https://www.sipri.org/databases) | Military spending, arms imports and exports | Global, incl. India | annual | 2 | Script can fetch |
| [Climate Watch](https://www.climatewatchdata.org) | Greenhouse gas emissions by sector *(The specific section link did not open; this is the site's home page.)* | Global, incl. India | annual | 2 | Script can fetch |
| [Global Carbon Atlas](https://globalcarbonatlas.org) | CO2 emissions by country | Global, incl. India | annual | 2 | Script can fetch |
| [V-Dem](https://www.v-dem.net) | Democracy indices | Global, incl. India | annual | 3 | Script can fetch |
| [Pew Research Center](https://www.pewresearch.org/topic/international-affairs/) | Surveys on India: religion, attitudes, diaspora | Global, incl. India | ongoing | 2 | Script can fetch |

## United States government data on India (19)

| Source | What it gives | Level | Frequency | Tier | Access |
| --- | --- | --- | --- | --- | --- |
| [US Census Bureau: trade with India](https://www.census.gov/foreign-trade/balance/c5330.html) | Monthly US exports, imports, balance with India | National | monthly | 1 | Script can fetch |
| [USTR India page](https://ustr.gov/countries-regions/south-central-asia/india) | Trade summary, tariff actions | National | annual | 1 | Script can fetch |
| [US International Trade Commission DataWeb](https://dataweb.usitc.gov) | Trade by product at tariff-line level | National | monthly | 1 | Script can fetch |
| [Bureau of Economic Analysis](https://www.bea.gov/data/intl-trade-investment) | Direct investment and services trade with India | National | annual | 1 | Script can fetch |
| [USDA PSD Online](https://apps.fas.usda.gov/psdonline/app/index.html) | India crop production, consumption, stocks, trade estimates | National | monthly | 1 | Script can fetch |
| [USDA GAIN reports](https://gain.fas.usda.gov) | Attaché reports on Indian agriculture | National | ongoing | 1 | Script can fetch |
| [Energy Information Administration: India](https://www.eia.gov/international/overview/country/IND) | Energy production, consumption, imports | National | annual | 1 | Script can fetch |
| [State Department visa statistics](https://travel.state.gov/content/travel/en/legal/visa-law0/visa-statistics.html) | Visas issued by nationality and post | National | monthly, annual | 1 | Browser only |
| [USCIS H-1B Employer Data Hub](https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub) | H-1B approvals by employer; reports by country of birth | National | annual | 1 | Script can fetch |
| [DHS Yearbook of Immigration Statistics](https://ohss.dhs.gov/topics/immigration/yearbook) | Green cards, naturalisations by country | National | annual | 1 | Script can fetch |
| [Open Doors (IIE, State Department)](https://opendoorsdata.org) | Indian students in the US | National | annual | 1 | Script can fetch |
| [US Census Bureau data](https://data.census.gov) | Indian-American population, income, education | National | annual | 1 | Script can fetch |
| [Treasury International Capital](https://home.treasury.gov/data/treasury-international-capital-tic-system) | India's holdings of US Treasuries | National | monthly | 1 | Script can fetch |
| [FRED (St. Louis Fed)](https://fred.stlouisfed.org/tags/series?t=india) | Indian macro series collected from primary sources | National | varies | 1 | No response |
| [CIA World Factbook: India](https://www.cia.gov/the-world-factbook/countries/india/) | Country profile | National | ongoing | 1 | Script can fetch |
| [DHS Program (USAID)](https://dhsprogram.com/Countries/Country-Main.cfm?ctry_id=57) | NFHS microdata and comparable indicators | State-wise | each round | 1 | Script can fetch |
| [USGS minerals: India](https://www.usgs.gov/centers/national-minerals-information-center/asia-and-pacific) | Mineral production yearbook | National | annual | 1 | Browser only |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov) | Satellite fire detections (crop burning) | State-wise | daily | 1 | Script can fetch |
| [Congressional Research Service](https://crsreports.congress.gov) | Briefs on India-US relations and trade | National | ongoing | 1 | Browser only |

## Collect by hand

These block automated requests or need an account. Open the link in a browser and download the file when a story needs it.

| Source | Link | What to download |
| --- | --- | --- |
| GST statistics | https://www.gst.gov.in/download/gststatistics | State-wise monthly GST collection files (Excel) |
| NSE Market Pulse | https://www.nseindia.com/research/publications-reports-nse-market-pulse | Latest Market Pulse PDF: investors by state, turnover |
| AMFI | https://www.amfiindia.com/research-information | State-wise and monthly AUM files; SIP data |
| Vahan dashboard | https://vahan.parivahan.gov.in/vahan4dashboard/ | Registrations by state, fuel and vehicle class: use the Excel export button |
| NCRB | https://www.ncrb.gov.in | Crime in India, Accidental Deaths and Suicides, Prison Statistics: yearly PDF tables |
| RBI Handbook Excel files | https://www.rbi.org.in/Scripts/AnnualPublications.aspx?head=Handbook+of+Statistics+on+Indian+States | Only if the Excel originals are wanted; the same numbers are already collected from RBI's HTML pages |
| data.gov.in API key | https://www.data.gov.in/user/register | Register once; the key unlocks the catalogue's API for scripts |
| Rajya Sabha answers | https://sansad.in/rs/questions/questions-and-answers | Search by ministry or subject; download the answer PDF |
| NPCI statistics | https://www.npci.org.in/statistics | UPI, IMPS, RuPay volumes and values |
| Income Tax Department statistics | https://incometaxindia.gov.in/Pages/Direct-Taxes-Data.aspx | Returns filed by income band, collections by state |
| Consumer Affairs price monitoring | https://fcainfoweb.nic.in | Daily retail and wholesale prices of 22+ essentials by city |
| Jal Jeevan Mission | https://ejalshakti.gov.in | Tap-water connections by state and village |
| Petroleum Planning and Analysis Cell | https://ppac.gov.in | Petrol, diesel, LPG consumption and prices by state |
| Airports Authority of India | https://www.aai.aero/en/business-opportunities/aai-traffic-news | Passengers and cargo by airport |
| Corporate Affairs | https://www.mca.gov.in | Companies registered and struck off by state |
| Digital Bharat Nidhi | https://usof.gov.in/en/parliament-questions | Rural telecom project data and Parliament annexures |
| India Brand Equity Foundation | https://www.ibef.org | Sector and state summaries compiled from official data |
| NCAER | https://ncaer.org | State Investment Potential Index, surveys, quarterly review |
| CEEW | https://www.ceew.in | Energy, water, climate data and state studies |
| ICRISAT | https://www.icrisat.org | District-level agriculture database |
| Oxfam India | https://www.oxfamindia.org | Inequality reports |
| IndiaSpend | https://www.indiaspend.com | Data journalism with source links |
| NASSCOM | https://nasscom.in | IT industry revenue and jobs |
| CRISIL research | https://www.crisil.com/en/home/our-analysis.html | Sector outlooks, state rankings |
| World Gold Council | https://www.gold.org/goldhub/data | Gold demand, reserves, India market |
| IMF World Economic Outlook | https://www.imf.org/en/Publications/WEO | GDP, inflation, debt forecasts for all countries |
| IMF DataMapper: India | https://www.imf.org/external/datamapper/profile/IND | Headline macro series and forecasts |
| IMF India page | https://www.imf.org/en/Countries/IND | Article IV reports, statements |
| IMF Data portal | https://data.imf.org | IFS, balance of payments, COFER reserves |
| World Economic Forum reports | https://www.weforum.org/publications/ | Global Gender Gap, Future of Jobs, Global Risks, Travel and Tourism |
| International Energy Agency: India | https://www.iea.org/countries/india | Energy supply, demand, emissions, outlooks |
| IRENA | https://www.irena.org/Data | Renewable capacity, generation, costs, jobs |
| Energy Institute Statistical Review | https://www.energyinst.org/statistical-review | Oil, gas, coal, power by country |
| UNICEF data: India | https://data.unicef.org/country/ind/ | Child survival, nutrition, education, water |
| UNESCO Institute for Statistics | https://uis.unesco.org | Education, literacy, R&D |
| ILO ILOSTAT | https://ilostat.ilo.org | Employment, wages, informality |
| ITU DataHub | https://datahub.itu.int | Internet use, mobile coverage, prices |
| OECD Data Explorer | https://data-explorer.oecd.org | India in OECD comparisons (tax, education, migration) |
| State Department visa statistics | https://travel.state.gov/content/travel/en/legal/visa-law0/visa-statistics.html | Visas issued by nationality and post |
| USGS minerals: India | https://www.usgs.gov/centers/national-minerals-information-center/asia-and-pacific | Mineral production yearbook |
| Congressional Research Service | https://crsreports.congress.gov | Briefs on India-US relations and trade |

## No response on the mapping date

| Source | Link |
| --- | --- |
| Directorate of Economics and Statistics (Agriculture) | https://desagri.gov.in |
| Coal | https://coal.gov.in |
| Commerce: NIRYAT | https://niryat.gov.in |
| Textiles | https://texmin.nic.in |
| IIT Bombay research | https://www.iitb.ac.in/en/research-and-development |
| Trivedi Centre for Political Data | https://tcpd.ashoka.edu.in |
| FRED (St. Louis Fed) | https://fred.stlouisfed.org/tags/series?t=india |
