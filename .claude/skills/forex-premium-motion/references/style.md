# Style: Forex Premium Motion

All tokens and primitives live in `assets/template/src/GoldMoves/design.tsx`.

## Look (from the client's reference, rebuilt in the brand)

- **World**: one hue. Radial ground `#0C2A1C → #06170F → #030A06`, three drifting fog banks, floating dust,
  vignette. `World` component.
- **Depth**: `CandleRain`: vertical glass candles streaming at different depths (far = small, slow, blurred).
  Keep speed low (0.2–0.5) behind content.
- **Materials**: frosted glass cards (`Glass`): 40–44 px radius, green-tinted gradient, 1.5 px light border, big soft
  shadow. CSS-3D gold `Coin` (stacked edge layers + embossed faces) and `GoldBar` (box) for covers/hero moments only.
- **Charts**: `MarketChart` in `Reel2.tsx`: `#0E1512` panel, grid, right price axis, teal/red candles
  (`#26A69A` / `#EF5350`), dashed level lines with axis tags, live price tag, optional zone highlight.

## Colour

| token | hex | use |
|---|---|---|
| void / deep / mid | `#030A06` `#06170F` `#0C2A1C` | ground |
| hue / light / deep | `#2FD27E` `#9CFFC9` `#128048` | keywords, bullish, CTA |
| gold / light / deep | `#E8C77F` `#FFF1C9` `#9C7330` | gold price, XAUUSD levels, gold objects |
| red | `#FF5F66` | drop, bearish, high impact |
| white / soft | `#F3F7F4` / 72 % | text |

## Typography (approved: option C)

- **Keyword two-tier** (`TwoTier variant="C"`): lead = Inter 600, tracked 8 px, uppercase, ~30 px ×scale,
  soft white; keyword = Anton uppercase ~150 px ×scale with brand gradient fill (hue/gold/red/white) and soft glow.
  Centred. Words reveal 3 frames apart: blur 10 → 0, rise 18–34 px; exit blur + lift (8 f).
- **Normal captions**: Inter 700, 46 px, white; spoken words light up as said, key terms in hue green; unsaid words
  45 % white. Glass pill `rgba(6,18,12,.62)`, radius 22. Lines of 3–4 words, balanced.
- Labels: Inter 600, 24–26 px, tracked 6 px, uppercase. Numbers: Anton (big) or JetBrains Mono (chart axes).
- Alternatives (if a client picks them): A = Inter Light Italic + Nunito Black; B = Instrument Serif Italic + Plus
  Jakarta ExtraBold.

## Motion

| thing | rule |
|---|---|
| card / chart / screenshot in | ease-out `bezier(.16,1,.3,1)`, 18 f, rise 40 px, scale .96→1, blur 8→0 |
| idle | sin drift 4–5 px over ~4 s |
| out | ease-in `bezier(.7,0,.84,1)`, 14 f, lift 30 px, blur 0→8 |
| list items (news cards) | slide in from the right 160 px, 20 f, older cards dim 50 % + blur 1.5 px |
| full-screen camera | slow push 1.00→1.06 or vertical pan following the newest element |
| scene change | `FogWipe` light bloom 18 f + layers blur to 26 px at the peak (`fogAt`) |
| jump cut | 8 f dissolve from the outgoing frozen frame + 1.04→1 zoom settle over 0.5 s |
| forbidden | falling, bouncing, tumbling, spring overshoot on shapes, `backdrop-filter` |

## Layout (9:16, 1080×1920)

- Speaker view: keyword two-tier top ≈ 330 (inside the dark band above the head, darkened by a top gradient);
  on-screen cards in the same band (y 250–620), they replace the keyword line while visible; normal captions
  at y ≈ 1420.
- Full screens: hero element y 300–1100, keyword two-tier y ≈ 1000–1330, normal captions y ≈ 1470.
- Cover: big gold word behind the head (Anton ~430), cut-out with soft gold rim, out-of-focus coins for depth,
  headline (tracked lead + Anton keyword, one line) + 3 chips, all inside y 240–1680.

## Sound

Voice: highpass 80 → afftdn → lowpass 13k → compressor 3:1 → loudnorm −14 LUFS. Music: client-supplied, −30 LUFS
(vocal) / −29 (instrumental), starts on a beat. SFX very low: whoosh 0.14 on scene changes, tick 0.22–0.28 on
card arrivals.
