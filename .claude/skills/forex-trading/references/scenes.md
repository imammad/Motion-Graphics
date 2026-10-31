# Scene library (all in `src/Anfaal/`)

Typical 60 s density: 1 hook, 4–5 split screens, 2 full screens (one dark, one light), 4–5 behind-head words,
1 info card, 2 pill moments, 1 CTA split. Alternate face and visual every 3–6 s; never two full screens in a row.

| Scene | File / component | Use for | Snap |
|---|---|---|---|
| Hook | `Speaker` behind word (gold GOLD) + `HookPills` "↓ Crash vs ↑ All-time high" | first 3.5 s, the myth/fear; captions hidden, pills carry the line | pills pop on the spoken words |
| Behind-head word | `BEHIND` in `timeline.ts` (Anton, tone white/gold/red/green) | the single spoken keyword (RATES, SUPPORT, NO PROFIT); ≈ 1.2–1.5 s, replaces the caption | letter-spacing collapse + de-blur |
| Rumour flood (full, dark) | `FullScreens.RumoursScene` | "people are spreading panic/rumours" | cards tint red + shake, **PANIC** |
| Liquidity (full, light) | `FullScreens.LiquidityScene` | money leaving markets, rates up | vessel drains 82% → 16%, GOLD/CRYPTO inflow ✕ $0 |
| Rate path (split) | `Splits.RateSplit` | expectation vs reality (cuts vs hikes) | green up-path draws, RATES ↑ pill |
| Odds gauge (split) | `Splits.OddsSplit` | a probability (36% hike chance) + "2× a year" chips | count-up lands |
| Range chart (split) | `Splits.RangeSplit` (`PriceChart mode="range"`) | consolidation between two levels | box fills, CONSOLIDATION |
| Support / break (split) | `Splits.SupportSplit` (`mode="support"`) | last support tap → possible break | tap ripple, warning pill, red BREAK + shake |
| Info card | `Overlays.FedChairCard` | a person or fact (Fed chair: ring + monogram or portrait) above the head | gold ring draws |
| Thought pills | `Overlays.LessonPills` | greedy thoughts ("Bara move?", "Bari lot?") above the head; they exit before the punchline caption | then NO PROFIT behind the head |
| CTA (split) | `Splits.CtaSplit` | community: signal chat + P&L screenshots, +$ count-up, handle "link in bio", Join button with cursor click | button click ripple |
| Cover | `Cover.AnfaalCover` (Still) | Instagram cover | n/a |

## Making a new chart or infographic

Keep it in a split panel: header micro label (green, left) + context label (muted, right) at y 236; content in
y 300–900, x 90–1000. One focal element, ≤ 2 supporting labels, one snap synced to the spoken word. Prices are
JetBrains Mono on gold tags at the right axis; candles are green/red rounded rects generated deterministically (`rnd`).

## Cover recipe

1080×1920 still: blurred, darkened copy of the frame as the backdrop (scale 1.35, blur 28) → sharp frame at
~0.88 scale, face lifted to y≈960, side-feathered → green-black vignette (face untouched) → faint candles →
big gold keyword (Anton 410) behind the hair → **head-only** cut-out (alpha faded out above the chin, because the
body mask is messy) → chest gradient → headline: red Anton word + serif "ya" + green Anton question, serif
italic tagline with a gold word, micro handle below. Check the 3:4 grid crop: `crop=1080:1440:0:240`.
Pick a frame with no raised hands (they cut out badly) and an expressive face.
