# Brand: Forex Trading style

Source of truth in code: `src/Anfaal/brand.ts` (tokens) and `src/Anfaal/kit.tsx` (ease, entrances, grounds, cards, pills).

## Colour (3 tones + meaning accents)

| Token | Hex | Use |
|---|---|---|
| ink | `#07100C` | near-black green ground |
| ink2 | `#0D1A14` | glass gradient bottom |
| white | `#F4F5F1` | warm white text |
| muted | `#9BA8A1` | micro labels, secondary text |
| green | `#2FD27E` (+ glow `rgba(47,210,126,.45)`) | keywords, bullish, active lines, CTA |
| greenDeep | `#159A55` | pill/button gradient bottom |
| gold | `#D9B66E` / deep `#A9823C` | gold price, XAUUSD levels, GOLD word, Fed ring |
| red | `#FF5A5F` (+ glow) | crash, break, loss, PANIC |
| paper | `#F3F5F1` / ink `#0E1712` | light full screen (one per reel, for contrast) |

Grounds: dark radial `#10241A → ink`, 72 px grid at 10% that drifts slowly, soft glow behind the focal point.
Light full screen: white → paper radial with blurred green rings at two corners.

## Type

| Role | Font | Size (1080 wide) |
|---|---|---|
| Big keyword / behind-head word / headline | Anton | 120–440 px, caps |
| Captions, UI text | Inter 600 (keywords 800) | 58 px (keywords 66 px) |
| Accent phrase | Instrument Serif Italic | 54–130 px ("sirf *afwaahein*", "*khatam*", "saal mein *do dafa*") |
| Prices, P&L, % | JetBrains Mono Bold | 30–56 px |
| Micro labels | Inter 600, caps, 5–9 px tracking | 20–26 px |

Fonts are in `public/fonts/` (Anton, Inter variable, InstrumentSerif-Italic, JetBrainsMono-Bold), loaded in `brand.ts`.

Behind-head word fills: white `#FFF → #C9CFCB`, gold `#FFF1CF → #E2BF77 → #A07A35`, red `#FFD6D7 → #FF6B70 → #C9343A`,
vertical gradient + drop shadow; letter-spacing collapses from +30 on entry.

## Materials

- Glass card: gradient `rgba(22,40,31,.92) → rgba(11,22,16,.92)`, 1 px `rgba(220,255,235,.12)` border, radius 24–32,
  big soft shadow. Pill-shaped (radius 999) for handles and the Fed card.
- Pills (hook/lesson chips, RATES ↑, BREAK): solid colour → 72% shade gradient, white Inter 700, inner top highlight.
- Light cards on paper: white → `#F4F7F4`, two-layer green-tinted shadow.

## Motion

- Entrance: 12 frames, rise 30 px, scale 0.9 → 1, blur 8 → 0, `bezier(0.16,1,0.3,1)`. Exit 7 frames, ease-in, blur out.
- Captions: phrase of 2–5 words, words stagger 2 frames, rise 16 px + blur 6 → 0; keywords scale 0.85 → 1.
- Camera: in-out `bezier(0.65,0,0.35,1)`; keys in `timeline.ts` `CAM`; idle push 0.3%/s; cut settle 4% + 5 px blur.
- Split panel slides down 16 frames, out 14 frames; speaker box reframes in the same move; green seam line.
- Full screen: circle reveal from the face (15 frames), exit scale 1.06 + blur.
- One snap per scene (PANIC, BREAK, RATES ↑, count-up landing), held ≥ 0.8 s.

## Sound

- Voice: highpass 80 → afftdn → lowpass 13k → compressor 3:1 → loudnorm −14 LUFS / −1.5 TP.
- Music: original synthesized dark R&B bed, 100 BPM, F minor (Fm9 · Dbmaj7 · Ebadd9 · Cm7), kick sidechain on the pad,
  drums drop out on the full-screen "rumour" beat and the lesson, riser into the snap. Volume 0.2 (~15 dB under voice).
- SFX: soft whoosh (band-swept noise) at 0.10–0.16 for transitions/keywords, muted tick at 0.3 for pills/snaps,
  low boom at 0.35 for PANIC / BREAK / NO PROFIT. Never loud.

## Grade

`curves=all='0/0.01 0.2/0.17 0.5/0.49 0.85/0.86 1/0.97', colorbalance (warm mids, cool shadows), eq contrast 1.05
saturation 1.1`, then a soft vignette in the composition. Goal: keep white shirts and bright car roofs from blowing out.
