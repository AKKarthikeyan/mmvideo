# Gadget Kadai: episode plan (everyday tech, explained)

Written 22 Oct 2026. AK, 21 Oct 2026: "I want this to be explainer of Everyday Tech to non tech people. Like How
Bluethooth works, GPU works, CPU vs GPU, Different types of memory, AirTag Work. Thing that donest explained by Big Tech
companies." Name **Gadget Kadai** is settled. The look from the pilot stays (kinetic type, everything drawn in code,
cobalt accent, source line on every fact beat).

**Who it's for:** people who use phones, earbuds and laptops every day but have never had them explained. No jargon
on screen without a picture and a plain-word label ("RAM = the kitchen counter").

**Series line (suggestion):** "What the box doesn't tell you." It fits AK's point that big tech never explains this.

## Decisions for AK
1. **Sign-off.** "Worth it, or not?" was written for launch reviews; an explainer has nothing to judge. Recommended:
   **"Now you know."** on the end card, with the mono line **"What should we explain next?"** That question gets
   comments, and the comments become the topic list.
2. **Cadence.** Recommended: **3 a week** (Mon, Wed, Fri) to start. Each explainer needs new drawings (radio waves, chip
   cores, memory ladder, map); the drawing library grows, so it gets faster.
3. **The Mivi pilot** (launch format, tag GK001 burned in) does not fit the explainer series. Recommended: keep it
   unposted, or post once as a stand-alone. The explainers start again at GK001.

## The explainer template (60-90 s)
| Beat | Time | What happens |
|---|---|---|
| HOOK | 0-5 s | One surprising, true line about something you use daily; on screen from the first frame (AK's opening rule, 13 Oct). |
| THE QUESTION | 5-8 s | "So how does it actually work?" |
| HOW IT WORKS | 8-45 s | Three steps, one diagram that builds up; each term gets a plain-word label. |
| THINK OF IT LIKE | 45-55 s | One everyday Indian analogy, drawn, tagged ANALOGY on screen. Checked to be technically honest. |
| THE PART NOBODY TELLS YOU | 55-70 s | The thing the company never explains. |
| SO THAT'S WHY | 70-80 s | The daily annoyance it explains (stutter, heat, "missing" storage). |
| SIGN-OFF | last 2 s | "Now you know." / "What should we explain next?" |

Rules: every figure from a primary source (standards body or the company's own pages), with "Apple says" / "Google
says" when the claim is a company's design claim; analogies labelled; no "best/worst", no brand-bashing; the ledger is
checked before the render (same as GK pilot).

---

## Batch 1: AK's five (facts checked 21-22 Oct 2026)
Suggested order: Bluetooth first (everyone owns earbuds; the name story is the strongest hook), then memory, CPU vs GPU,
trackers (builds on Bluetooth), GPU drawing (builds on CPU vs GPU).

### GK001 How Bluetooth works
- **Hook:** "Bluetooth is named after a Danish king with a dead, blue-grey tooth. And the name was only meant to be a
  placeholder."
- **How it works:** (1) a small radio in the 2.4 GHz band, the same band as Wi-Fi and microwave ovens; (2) classic
  Bluetooth (used for audio) has 79 channels, 1 MHz apart, and both devices hop between them 1,600 times a second in an
  order only they know; (3) Adaptive Frequency Hopping drops busy channels and keeps hopping on the clear ones.
- **Analogy:** two friends at a packed wedding hall who jump between 79 corners in a secret order, 1,600 times a second,
  and stop using the corners where the band is playing.
- **Nobody tells you:** the logo is the king's initials in runes (ᚼ + ᛒ); "PAN" nearly became the name; and range is not
  "10 metres": the Bluetooth SIG says anywhere from under a metre to over a kilometre, depending on the device.
- **So that's why:** your earbuds can glitch near a running microwave or a busy Wi-Fi router: they share the same band.
- **Draw:** king + rune logo build, radio band strip with Wi-Fi and microwave, 79-channel strip with a hopping dot,
  crossed-out busy channels.
- **Facts:** 79 channels "with 1 MHz spacing" (bluetooth.com/learn-about-bluetooth/tech-overview); 1,600 hops/s
  standard rate (Core Spec 6.2, Vol 1 Part A); BLE 40 channels, 2 MHz apart, 3 for advertising (same pages); microwave
  ovens at 2.45 GHz (FCC OET Bulletin 56); ISM band shared with "wireless LAN, cordless phones, and microwave ovens"
  (Core Spec 6.2); AFH, minimum 20 channels on classic (Core Spec 6.2 §7.2); name, Harald "Bluetooth" Gormsson,
  958, dead blue-grey tooth, bind rune of Hagall + Bjarkan, placeholder name, PAN nearly won
  (bluetooth.com/about-us/bluetooth-origin); range "more than a kilometer down to less than a meter"
  (bluetooth.com/learn-about-bluetooth/key-attributes/range).
- **Don't say:** "1 MHz wide" (it's spacing); any metre range as "typical"; "Viking" (the SIG page says king of Denmark
  and Norway).

### GK002 RAM, storage, cache: the memory in your phone
- **Hook:** on screen "4 GB RAM | 128 GB ROM". "Every phone listing says 128 GB ROM. But ROM means memory you can't
  write to."
- **How it works:** three kinds, from fastest to biggest: (1) cache, inside the processor (SRAM, about 1 nanosecond);
  (2) RAM (DRAM, phones use LPDDR), about 100 nanoseconds, and it forgets everything when power goes; (3) storage (flash),
  roughly 50-100 microseconds at the chip, and it keeps your photos with the power off because it stores trapped charge.
- **Analogy (kitchen):** cache = the masala dabba next to the stove; RAM = the kitchen counter (cleared when the kitchen
  closes); storage = the godown. If cache took 1 second, RAM would take about 2 minutes and storage about a day. Honest
  note on screen: storage is slow to start but moves a lot at once, like a truck (flagship UFS 4.0 reads about 4,200 MB/s).
- **Nobody tells you:** your RAM is leaking right now: every cell has to be topped up about every 32 milliseconds or your
  open apps would fade away. And your phone does have real ROM: a tiny Boot ROM written at the factory, the first code
  that runs when you switch on.
- **So that's why:** read "128 GB ROM" as "128 GB storage". And a 128 GB drive shows about 119 GB on a Windows laptop
  (it counts 1 GB as 1,073,741,824 bytes); recent phones count in decimal, so on a phone the missing space is the system.
- **Draw:** listing line with ROM struck out, three-layer ladder (dabba / counter / godown), leaking cells being refilled,
  time-scale bar 1 s / 2 min / 1 day.
- **Facts:** "4 GB RAM | 128 GB ROM" on live Flipkart listings (e.g. HMD Vibe2 5G; search "4gb ram 128gb rom") — recreate
  the text, do not screenshot Flipkart's page; ROM = can only be read, not written (NIST CSRC glossary); Boot ROM "laid down
  during chip fabrication" (Apple Platform Security, boot process); DRAM 1 transistor + 1 capacitor, volatile, refreshed
  (semiconductor.samsung.com/dram); SRAM about six transistors (Infineon knowledge base; say "about"); NAND keeps data
  without power, trapped charge (Micron glossary, SK hynix); refresh window 32 ms at normal temperature for LPDDR4X
  (Micron datasheet Table 117) and LPDDR6 (SK hynix slide on jedec.org); LPDDR5 = 32 ms is an inference, not quoted;
  latencies: L1 about 1.1 ns (Arm Cortex-X925 guide, 4 cycles at 3.62 GHz), DRAM about 95-110 ns (Arm pointer-chase
  measurements, server chips), NAND read 70-100 µs (Micron flyer, 2016) — order of magnitude only; UFS 4.0 4,200 MB/s
  (Samsung); 1 GB = 1,000,000,000 bytes (Samsung UFS footnote, Apple support 102119); Android counts decimal since 8.0
  (Android Formatter docs); Samsung My Files decimal from One UI 6.0 (Samsung Members notice).
- **Don't say:** 64 ms (that's DDR4 PCs); "your phone shows 119 GB"; "phones use UFS" for every phone (budget phones may
  use eMMC; iPhone storage type has no primary source); any LPDDR5 refresh figure as quoted.

### GK003 CPU vs GPU
- **Hook:** "Your phone has up to 8 CPU cores. The biggest gaming graphics card has 21,760. So why isn't it 2,700 times
  faster at everything?"
- **How it works:** (1) a CPU has a few strong cores and spends much of the chip on memory and decision-making, so it is
  good at anything, one step after another; (2) a GPU has thousands of simple maths units that work in groups of 32, all
  doing the same instruction at the same moment; (3) so the GPU wins when the same small job repeats millions of times
  (every pixel, every number in an AI model) and loses on jobs full of "if this, then that".
- **Analogy:** a few master chefs vs a giant idli steamer: the steamer does the same step to thousands of moulds at once,
  but it can't cook a biryani. (I dropped "thousands of dosa makers": NVIDIA's docs say GPU units don't work
  independently, so that analogy is wrong.)
- **Nobody tells you:** a "CUDA core" is not a CPU core: NVIDIA's own guide says CPUs spend more of the chip on caching and
  flow control, GPUs on maths. Comparing core counts is comparing chefs with idli moulds.
- **So that's why:** AI runs on GPUs: neural networks are mostly matrix multiplication, the same sum repeated at huge scale.
  NVIDIA's data-centre revenue was $89.0 billion in one quarter (quarter ended 26 Jul 2026), up 117% in a year.
- **Draw:** chip die with 8 big cores vs a grid of tiny units in rows of 32, chef vs steamer, matrix of numbers lighting
  up together.
- **Facts:** Snapdragon 8 Elite Gen 5, 8 cores, 2 Prime + 6 Performance (Qualcomm product brief); Apple A19 / A20 Pro,
  6-core CPU (apple.com/in specs); RTX 5090 21,760 CUDA cores, RTX 4090 16,384 (nvidia.com, Blackwell whitepaper);
  CPUs "dedicate more transistors to data caching and flow control" (CUDA Programming Guide §1.1.2); warps of 32 threads,
  one common instruction (CUDA C Programming Guide, SIMT); matrix multiplication is the building block of neural-network
  layers, Tensor Cores accelerate it (NVIDIA deep-learning performance guide); $89.0B data-centre revenue, Q2 FY2027
  (nvidianews.nvidia.com, 26 Aug 2026).
- **Don't say:** "8 cores" for iPhones (they have 6); "GPU has hundreds of cores" (NVIDIA's old blog line); "GPU sales"
  for the revenue line (it's data-centre revenue); NVIDIA's market-cap rank (no primary source). **Recheck before
  publishing:** NVIDIA reports Q3 in late November, which replaces the $89.0B line.

### GK004 How AirTag-style trackers find your lost keys
- **Hook:** "A stranger's phone you'll never meet can find your lost keys. And Apple says even Apple can't see where they
  are."
- **How it works:** (1) the tag has no GPS and no SIM; it just sends a small Bluetooth signal (callback to GK001);
  (2) any nearby phone in the network (iPhones for Apple's Find My, Android phones for Google's Find Hub) hears it and
  sends its own location, encrypted; (3) only your phone can unlock that report and show the tag on the map. Up close,
  Ultra Wideband turns your phone into an arrow (Precision Finding).
- **Analogy:** a child lost at a mela keeps repeating a secret code word; any passer-by who hears it phones the parents
  and says "I heard it here", in a language only the parents understand.
- **Nobody tells you:** the tag changes its Bluetooth ID often so strangers can't follow it; and since May 2024 both
  iPhone and Android warn you when an unknown tracker is moving with you ("Found Moving With You").
- **So that's why:** it works best where there are lots of phones around: more passers-by, more chances someone hears it.
- **India angle:** AirTag ₹3,790 (apple.com/in); JioTag (2nd gen) ₹1,249 works with both Apple Find My and Google Find
  Hub (jio.com/jiotag-go).
- **Draw:** tag pulsing, phones on a city map relaying, locked envelope, owner's phone opens it, UWB arrow.
- **Facts:** "sends out a secure Bluetooth signal that can be detected by nearby devices in the Find My network" and
  "not even Apple knows the location" (apple.com/in/airtag); end-to-end encrypted, anonymous (Apple Platform Security,
  Find My security); current AirTag is second generation (26 Jan 2026), second-gen Ultra Wideband chip, Precision Finding
  up to 50% farther, CR2032, "more than a year" (Apple newsroom Jan 2026); identifiers "change frequently" (Apple);
  Find Hub (earlier Find My Device) uses Android devices' Bluetooth, locations private from Google (Google Help 14796936,
  Google blog 13 May 2025); unwanted-tracking alerts on iOS 17.5 and Android 6.0+ (Apple newsroom 13 May 2024).
- **Don't say:** "changes ID every 15 minutes" (that figure is for offline iPhones/Macs, not AirTag); any range in metres;
  a date for Google's network launching in India (not found). Prices move: recheck on publishing day.

### GK005 How your phone's GPU draws the screen
- **Hook:** "To keep a game smooth at 120 frames a second, your phone has 8.3 milliseconds to colour 2.6 million pixels.
  Then it does it all again."
- **How it works:** (1) everything you see is built from triangles; (2) rasterization works out which pixels each
  triangle covers; (3) a pixel shader decides each pixel's colour (standard 8-bit colour = 16.7 million possible colours);
  (4) the finished frame goes to a frame buffer, and the screen shows it.
- **Analogy:** your screen is a giant kolam dot grid, 2.6 million dots, and the GPU recolours the whole kolam up to 120
  times a second.
- **Nobody tells you:** 120 Hz is a maximum: a still screen reuses the last frame; and Android 15 sets games to 60 Hz by
  default to save power.
- **So that's why:** games heat your phone and drain the battery: Android's own docs say running at 120 Hz all the time
  can cause heat and fast battery drain; iPhone's Low Power Mode caps the screen at 60 frames a second.
- **Draw:** a triangle mesh (e.g. a cricket ball), triangle snapping to the pixel grid, colours filling in, frame
  counter racing, kolam grid.
- **Facts:** Redmi Note 14 5G, 2400×1080, up to 120 Hz (mi.com/in specs) → 2,592,000 pixels, 1/120 s = 8.33 ms, up to
  311 million pixel updates a second (our arithmetic); 8 bits per channel, 24 bits per pixel = 16,777,216 colours
  (Microsoft WIC docs, Android Bitmap.Config); pipeline steps (Microsoft Direct3D 11 pipeline docs, Khronos OpenGL 4.6
  spec ch. 14-15, Apple Metal sample); Android 15 default 60 Hz for games, heat and drain at constant 120 Hz
  (developer.android.com/games/optimize); Low Power Mode limits to 60 fps (Apple Support).
- **Don't say:** "each pixel is three little lights" (many OLED panels share sub-pixels); sub-pixel counts; any 60 vs 120 Hz
  battery percentage (no source). Consider a current phone instead of the Redmi Note 14 5G if it's no longer on sale.

---

## Batch 2: candidates (my ranking; facts to be checked at scripting)
Ranked on how much a non-tech Indian viewer uses it daily, how surprising the "nobody tells you" is, and how well it
draws.
| # | Topic | Hook idea (to verify) | Primary sources to use |
|---|---|---|---|
| 6 | How UPI sends money in two seconds | What actually happens between "Pay" and the green tick | NPCI |
| 7 | How a QR code still scans when it's torn | QR codes carry spare data so a damaged sticker still works | DENSO WAVE (QR inventor), ISO/IEC 18004 |
| 8 | How FASTag pays without stopping | The sticker has no battery | NPCI, IHMCL/NHAI |
| 9 | How GPS finds you, and India's own NavIC | Satellite timing to a billionth of a second | ISRO, GPS.gov |
| 10 | mAh vs Wh: why a 20,000 mAh power bank doesn't charge your phone 4 times | Voltage and conversion losses | power-bank makers' datasheets |
| 11 | Why fast charging slows after 80% | The last 20% is filled gently on purpose | phone makers, USB-IF |
| 12 | How noise cancellation works | Earbuds make "anti-noise" | Sony / Apple / Bose support |
| 13 | Wi-Fi 2.4 GHz vs 5 GHz | Faster but doesn't reach the bedroom | Wi-Fi Alliance |
| 14 | How a touchscreen feels your finger | Your finger changes an electric field | touch-controller makers |
| 15 | How a smartwatch reads your heart with green light | Blood absorbs green light | Apple / Samsung support |
| 16 | How OTPs work and why they expire | Time-based codes | RFC 6238, banks |
| 17 | SIM vs eSIM | A SIM is a tiny computer | GSMA |
| 18 | How ChatGPT writes | One word-piece at a time | OpenAI / Anthropic docs |
| 19 | Why your phone gets hot and slows down | Thermal throttling | Android docs |
| 20 | How face unlock works (2D vs 3D) | Dot projector vs camera photo | Apple Face ID security, Android biometrics |

## Production notes
- Reuse from the pilot: `src/gadget/kit.tsx` (type, tags, specs, price tag, toggle, strike), `phone.tsx` (phone in four
  views), `props.tsx` (chip, battery, pixel grid, sun, loop), voice and timing scripts, render script.
- New drawings needed for batch 1: radio waves and channel strip, rune logo, memory ladder, leaking-cell grid, core grid
  in rows of 32, idli steamer, city map with relaying phones, triangle mesh, kolam grid.
- Each episode: `src/gadget/<id>/script.json` + `Short.tsx`, ledger section in `scripts/gadget/SCRIPT_<id>.md`.
- Language: English first (house voice). Tamil/Hindi cuts later, after AK picks those voices (see Data Kadai voice notes).
