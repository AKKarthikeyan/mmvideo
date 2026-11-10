# Fact-check: the Gemini report on Shorts and Reels (10 Nov 2026)

AK shared a Gemini deep-research report ("The Neuro-Algorithmic Architecture of Short-Form Video") on 10 Nov 2026. Each claim
was checked against primary sources: YouTube Help and Blog, Instagram and Mosseri, journal pages, Sensor Tower. The rules
built from what survived are in [`SHORTS_RULES.md`](SHORTS_RULES.md).

**Summary.**
- **Broadly right:** the platform mechanics, the main studies, and the India ban and Shorts timeline.
- **Wrong or unsupported:**
  - the causal story linking the 47-second figure to Shorts length;
  - the claim that Reels came from the Haugen research;
  - several invented or misattributed findings: "Wei et al.", the TikTok gray-matter claim, the "3.3 billion views study"
    and the editing advice attributed to an eye-tracking study;
  - every viral threshold it quotes, which is creator lore;
  - the India brand statistics.
- **Misapplied:** most of the neuroscience is correlational research on addiction and harm. It is evidence about risks to
  viewers, not a storytelling method.
- **Missing:** the report leaves out the facts that matter most to us now:
  - the inauthentic-content policy;
  - the 1 Oct 2026 change that favours original Shorts;
  - the YPP change of 1 Feb 2027;
  - the move of all formats to first-frame view counting on 24 Aug 2026.

Verdicts: **TRUE** · **PARTLY** · **FALSE** · **UNVERIFIED** (no source found) · **LORE** (creator folklore) · **MISAPPLIED**
(a real finding used for something it does not show).

## Platforms and money

| Claim | Verdict | What is actually true | Source |
| --- | --- | --- | --- |
| From 31 Mar 2025 a Shorts view counts on play or replay, with no minimum; engaged views drive YPP | TRUE | Also: on 24 Aug 2026 every format moved to first-frame counting. Analytics and YPP still use engaged or qualified views. | blog.youtube/inside-youtube/engaged-views-youtube-explained/ |
| "Viewed vs swiped away" is a Studio metric | TRUE | Official metric. | support.google.com/youtube/answer/12942217 |
| Under 60 % viewed stalls a Short; 70 %+ triggers viral spread | LORE | YouTube publishes no threshold; it keeps them private (Todd Sherman, 2023). | searchenginejournal.com/youtube-explains-how-shorts-algorithm-works/494953/ |
| "A study of 3.3 billion Shorts views" (Lacombe, Medium) | FALSE attribution | The data is Paddy Galloway's April 2023 thread: 5,400 Shorts, 33 channels. It found under 60 % "rarely performed well" and the best Shorts at 70–90 %. The authors called it "still early research", and it predates 3-minute Shorts and both counting changes. | threadreaderapp.com/thread/1646898356419981315.html |
| Shorts up to 3 min from 15 Oct 2024; over 1 min with a Content ID claim is blocked worldwide | TRUE | Any active claim, manual claims included. | support.google.com/youtube/answer/15424877 |
| YPP via Shorts: 10M views in 90 days, 45 % share (long-form 55 %) | TRUE now, changing | From 1 Feb 2027:<br>• new channels need 20M qualified Shorts views in 90 days, or 8,000 watch hours;<br>• existing members need 10M qualified Shorts views in the last 90 days to earn any Shorts revenue;<br>• the 45 % / 55 % split is unchanged. | blog.youtube/news-and-events/youtube-partner-program-updates-2027-new-opportunities-earn/ |
| Related video link from Shorts | TRUE | Since about Sep 2023. One link per Short, same channel, set in desktop Studio. | blog.youtube/creator-and-artist-stories/youtube-related-videos-traffic-guide/ |
| Shorts like cards show likes minus dislikes | UNVERIFIED / likely FALSE | They are separate metrics. The Shorts dislike button was removed about 25 Jun 2026. | support.google.com/youtube/answer/9313698 |
| Cross-posting with other platforms' watermarks hurts reach | TRUE for Instagram | Instagram:<br>• does not recommend Reels with other apps' logos (Oct 2024);<br>• replaces reposts with the original (Apr 2024);<br>• extended this to photos and carousels (30 Apr 2026).<br>YouTube has no watermark rule, but since 1 Oct 2026 its Shorts ranking favours originals over re-uploads and template bulk edits. | creators.instagram.com/original-content-guidelines/ · searchenginejournal.com/youtube-original-shorts-reposted-clips-reach/591774/ |
| Instagram signals: watch time, likes, sends | TRUE | Mosseri, Jan 2025. Sends weigh more for non-followers. "Sends = 3–5× likes" is lore. | socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/ |
| Reels captions have no clickable links | TRUE | A limited caption-link test for Meta Verified accounts started in Mar 2026, on feed posts only. Assume no links in Reels. | |
| Reels up to 3 min; Trial Reels | TRUE | 3 min since 20 Jan 2025. Trial Reels went global on 10 Dec 2024 and show a Reel to non-followers first. | techcrunch.com/2024/12/10/instagram-rolls-out-trial-reels-that-arent-shown-to-a-creators-followers |
| Completion benchmarks: "70 % completion is the 2026 catalyst", "40–50 % at 60 s", "APV 120–148 % on loops" | LORE | No traceable source. The best real dataset is Metricool 2026 (799,718 videos): average Shorts watch time is about 16 s, 61 % of views come from the feed, and hashtags go with about 10 % fewer views. | metricool.com/youtube-trends/ |
| Not in the report | — | Inauthentic-content policy, 15 Jul 2025:<br>• judged channel-wide, and it decides monetisation;<br>• names templated storylines, slideshows or scrolling text with little narrative, AI made from generic templates, and readings of other people's material.<br>AI disclosure is needed only for realistic synthetic content. YouTube says posting volume is neither rewarded nor penalised. | support.google.com/youtube/answer/1311392 · /answer/14328491 |

## Science

| Claim | Verdict | What the research actually shows | Source |
| --- | --- | --- | --- |
| Attention on a screen fell from 150 s to 75 s to 47 s (Gloria Mark) | PARTLY | Real figures, from office workers switching computer windows, not from video viewing. They come from different samples (not one cohort followed over time) and mostly her own lab. "Replicated at 44–50 s" is unverified. | universityofcalifornia.edu/news/how-sharpen-your-attention-and-meet-your-goals-2024 |
| Platforms designed 30–60 s video around the 47 s figure | FALSE / MISAPPLIED | No evidence. | |
| 25.5 min to return to an interrupted task | TRUE | Mark, Gonzalez and Harris, CHI 2005: 25 min 26 s. | |
| Loewenstein's information-gap theory of curiosity (1994) | TRUE | *Psychological Bulletin* 116(1):75–98. | doi:10.1037/0033-2909.116.1.75 |
| Schultz on reward prediction error; Skinner on variable-ratio schedules; cuts trigger orienting | TRUE | Schultz et al. 1997 (*Science*); Ferster and Skinner 1957; Lang 1993 and 2000. Related cuts keep memory intact; unrelated cuts cost processing capacity. | |
| Su et al. 2021 (fMRI): personalised feeds activate the VTA and the default mode network | Mostly TRUE | N=30 students. VTA and default-mode activation, and 5.9 % possible problematic use, are real. The report's ACC and dlPFC claims are not in the connectivity paper. Small N, acute viewing only, with a sound and luminance confound. The effect comes from the recommender, not from anything a creator controls. | pubmed.ncbi.nlm.nih.gov/33951514/ · pmc.ncbi.nlm.nih.gov/articles/PMC8519862 |
| Yan et al. 2024 (EEG): prefrontal theta r = −0.395, p = .007 | TRUE | 45 people analysed. Correlational, with no behavioural effect. | frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2024.1383913/full |
| Nguyen et al. 2025 meta-analysis: 71 studies, N = 98,299 | TRUE, sign misreported | Cognition r = −.34, inhibitory control −.41, attention −.38, mental health −.21. More short-video use goes with more stress and anxiety. Mostly cross-sectional, so association, not cause. | psypost.org/large-meta-analysis-links-tiktok-and-instagram-reels-to-poorer-cognitive-and-mental-health/ |
| Montag: reduced ACC gray matter in heavy TikTok users | FALSE | That study (2018) was about WeChat. | pmc.ncbi.nlm.nih.gov/articles/PMC5794793/ |
| "Wei et al.": adolescents' dlPFC–striatum control reversed | UNVERIFIED, likely invented | No such paper found. | |
| ABCD study: screens accelerate prefrontal thinning | PARTLY | Shou et al. 2025 found reduced *thickening* in a few regions, for all screen time (not short video), with small effects. | doi:10.1038/s41398-025-03672-1 |
| fNIRS risk-task study and Liu et al. 2025 (loss aversion) | TRUE, but they conflict | Small cross-sectional studies; one finds more loss sensitivity, the other less loss aversion. | pmc.ncbi.nlm.nih.gov/articles/PMC12015723/ |
| CCNU eye-tracking study, "so keep the subject centred across cuts" | Study TRUE, advice INVENTED | Li et al. 2025 (*npj Science of Learning*): random short videos hurt later movie recall; personalised ones did not. It gives no editing advice. | pmc.ncbi.nlm.nih.gov/articles/PMC12657513/ |
| CHI 2023: short video hurts prospective memory | TRUE | Chiossi et al., N=60; only TikTok differed from rest. | arxiv.org/abs/2302.03714 |

## History and India

| Claim | Verdict | What is actually true | Source |
| --- | --- | --- | --- |
| Toutiao launched 2012, Douyin Sep 2016 | TRUE | Douyin launched 26 Sep 2016, first as "A.me". | bytedance.com |
| Toutiao video views +300 % in 2016; 6× 2015; the "Second Curve" story | UNVERIFIED | Sources only show video time on Toutiao passing text by May 2016, and an RMB 1bn creator subsidy in Sep 2016. | commoncog.com/case/tiktok/ |
| TikTok: 738M downloads in 2019, "1.9B during COVID" | PARTLY | 738M is right (Sensor Tower). The second figure is wrong: over 2B lifetime downloads by Apr 2020. | sensortower.com/blog/tiktok-downloads-2-billion |
| Reels launched because of the Haugen-disclosed teen research | FALSE | Reels launched in India on 8 Jul 2020 and globally on 5 Aug 2020, as a response to TikTok. Haugen's disclosures came in Sep 2021. | about.fb.com/news/2020/08/introducing-instagram-reels/ |
| India's TikTok ban (29 Jun 2020, Section 69A, 59 apps); permanent Jan 2021 | TRUE | | |
| Shorts timeline: India beta Sep 2020, tripled channels, 3.5B daily views, US Mar 2021, $100M fund, global Jul 2021 | TRUE | | tubefilter.com/2021/03/18/youtube-launches-shorts-beta-us-working-on-monetization/ |
| Shorts "exited beta 20 Feb 2022" | FALSE | No source. US beta ended May 2021; Shorts ad revenue sharing began 1 Feb 2023. | |
| 68.2 % of Indian creators work in Hindi, 23.9 % in regional languages | UNVERIFIED, contradicted | ISB–Hashfame: 58 % regional, 42 % Hindi; 66 % of creators are non-metro. | isb.edu (ISB–Hashfame press release) |
| Tier-3/4 cities are 43–48 % of campaigns, with higher engagement | PARTLY | One vendor's own data (Kofluence). | |
| Zomato regional Reels +32 %; boAt +40 % sales | UNVERIFIED | The nearest match is Swiggy's own "40 % engagement spike" claim; nothing found for boAt. | |
| Not in the report | — | YouTube Shorts in India: 650M+ monthly logged-in viewers (June 2025). Hindi and regional languages were ~85 % of India's short-video consumption (EY, 2022). | blog.google/intl/en-in/brandcast-2025-ctv-shorts-and-youtube-as-indias-new-tv/ |

## What the report gets wrong in spirit

The report treats findings about addiction and harm (lower self-control, worse attention, more stress) as a playbook for
creators. The valid creator lessons are older and plainer:
- curiosity comes from an information gap;
- a payoff that beats expectations is noticed;
- related cuts hold attention without costing memory;
- captions help viewers who watch with the sound off.

Our rules use those lessons and nothing that depends on compulsion.
