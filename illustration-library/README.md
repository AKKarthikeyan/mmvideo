# Illustration library

Illustrated, animated scene types and icons for Moat & Margin videos. Built 11 Oct 2026 for the DMart story video
(`dmartstory`) after the brief "more illustration with motion graphics, told to a viewer who does not follow the market".
Everything is drawn in code, so every word and number on screen comes from the script, never from an image model.

## What is in this folder

| Path | What it is |
|---|---|
| `catalogue.png` | One sheet showing every scene type and every icon. Start here. |
| `scenes/<type>.png` | The finished frame of each scene type, 1920 x 1080. |
| `scenes/<type>.mp4` | A short silent clip of the scene animating, with the example data. Not kept in git (videos are regenerable): run the export script below to make them. |
| `props/<type>.json` | The example data behind each still and clip: `{"scene": {...}, "say": "narration", "sec": 12.3}`. Copy the `scene` part into a script and change the words and numbers. |
| `icons/<name>.png` | Each kit icon on a transparent ground, 512 x 512: store, trolley, coin, note, bank, box, person, tag. |
| `thumbnails/` | Thumbnail studies made with the same kit. |

The drawings themselves live in the video project at `src/vx/illus/`:

| File | Scene types |
|---|---|
| `kit.tsx` | Palette, stage, heading, provenance tag, stamps, chips, ticking numbers, arrows, and the eight icons. |
| `Money.tsx` | `keep` (how much of ₹100 is kept, and what went missing), `note` (the ₹100 cut into pieces, with a zoom on the small ones), `case` (a board of coins that fills as each piece is found). |
| `Growth.tsx` | `duo` (two things that grew by different amounts), `shops` (a row of shops per year), `stacks` (before and after as piles of money), `spread` (a made-up example of a cost spread over years). |
| `Compare.tsx` | `scale` (a balance), `calendar` (a date that moved), `race` (companies as runners). |
| `World.tsx` | `store` (a storefront with shoppers and fact chips), `gears` (three meshing gears), `castle` (a castle and moat with check shields). |
| `Thumb.tsx` | Thumbnails drawn with the kit (composition `ILLUS-thumb`). |
| `Dharma.tsx` | The spiritual channel's kit (21 Oct 2026): `verse` (a verse on a paper card: Devanagari, transliteration, English, source; text from `scripts/dharma/corpus.py`), `chariot` (Katha Upanishad 1.3.3-4), `birds` (Mundaka 3.1.1), `tree` (Gita 15.1-3, the inverted ashvattha), `gunas` (three bars), `rope` (rope and snake, with the lamp), `salt` (Chandogya 6.13); icons diya, lotus, chariot, bow, flute, feather, banyan, conch. Fonts: Noto Serif and Noto Serif Devanagari (OFL) in `public/fonts`. The drawings are built from a few geometry helpers at the top of the file (`ribbon` tapered bands, `locks` hanging locks, `cloud` leaf clusters, `limb` bending legs), so a new animal or tree is a list of points, not a hand-traced path. The `chariot` scene names its parts with a numbered legend and matching badges. |

## Using a scene in a new video

In `scripts/vx_scripts.py`, give a beat a scene of that type, for example:

```python
T(3, "c35", "In March, its short term borrowings were nine hundred and sixty five crore rupees. By the end of September: two thousand six hundred and twenty nine crore.",
  "In March, its short-term borrowings were ₹965 crore. By the end of September: ₹2,629 crore.",
  dict(type="stacks", heading="SHORT-TERM BORROWINGS", note="BALANCE SHEET · RESULTS OF 10 OCT 2026", icon="bank",
       items=[dict(label="31 MARCH 2026", v=965.27, text="₹965 CR", at="nine hundred and sixty five"),
              dict(label="30 SEPT 2026", v=2628.66, text="₹2,629 CR", at="two thousand six hundred", red=True)]))
```

Every `at` is a phrase from the narration: the element appears when that phrase is spoken.

## Seeing a scene without writing a script

```bash
python3 scripts/export_illustration_library.py stacks        # re-export one type from props/stacks.json
python3 scripts/export_illustration_library.py               # everything, plus icons and the catalogue
REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium python3 scripts/export_illustration_library.py   # where Remotion cannot download a browser (cloud sessions)
```

## House rules learned on the first video

- One colour and one icon per thing, the same in every scene (set `color` on note pieces and case suspects). Red is for alerts only.
- Label a made-up example on screen (`note="MADE-UP EXAMPLE"`), and mark a reading that is ours and not the filing's.
- Text-only strip beats are blank until their first `at` phrase: anchor the first strip to the beat's first words.
- A row that counts up needs its cue early enough to finish before the beat ends.
- Keep each caption close to its narration in length, or the caption drifts away from the picture.
- Check the hook spacing with `python3 scripts/hook_check.py <video id>` (a question in the first 5 seconds, then one at most every 45 seconds).
