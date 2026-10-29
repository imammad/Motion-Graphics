# Worked examples

Three approved visuals from an inflation explainer (UK personal finance video). The full source for each is next to this file in `examples/`. They import from `./common`, which is `assets/remotion/common.tsx`.

Each one shows how a spoken sentence maps to one device, one hero phrase, and a handful of cues.

## 1 · "2021 = 2026" (`ThenNow.tsx`, 9.4s)

> "…do you ever look back to what you were earning in 2021, five years ago, and think to yourself, I don't feel any better off today than I did back then."

Layout:
- "Better off?" sits on the upper third.
- "2021" (ink, 380px) is left-aligned and "2026" (mint) is right-aligned, both standing on the lower third.
- A ruler at y=790 carries six year ticks.

| Cue (s) | Word | Beat |
|---|---|---|
| 0.3 | — | ruler draws left→right |
| 1.4 | "what you were earning" | small label fades in |
| 2.3 | "2021" | 2021 rises from its mask |
| 3.3→6.9 | "five years ago … today" | flat mint bar + marker run the ruler, lighting each year |
| 6.34 | "better off" | "Better off?" (mint "?") rises in |
| 6.96 | "today" | 2026 rises in mint |
| 8.24 | "back then" | "=" built from two bars grows from centre → reads 2021 = 2026 |

## 2 · "On paper / In the bank" (`OnPaper.tsx`, 14.6s)

> "You may have progressed in your career… changed jobs… had several pay rises. So on paper… you're doing everything well. But when you look at what's left in your bank account at the end of each month… not actually made much progress."

Layout:
- A stepped mint line and area run over the years 2021–2026.
- The steps are labelled Career, New job and Pay rise, with a dot on each.
- A flat ink slab labelled "Left each month" sits along the baseline.
- The hero swaps from "On paper ↗" to "In the bank →".

| Cue (s) | Word | Beat |
|---|---|---|
| 1.24 / 2.36 / 4.06 | "career" / "jobs" / "pay rises" | line revealed one step per word (`steps()`), dot + label pop |
| 5.88 | "on paper" | hero "On paper" + arrow ↗ draws |
| 8.12 | "But" | pay line dims, hero exits upward |
| 10.0 | "bank account" | ink slab wipes in, "In the bank →" |
| 12.76 | "not much progress" | thin red dimension line measures the gap at the right edge |

## 3 · "Negative" (`Negative.tsx`, 13.0s)

> "…I had more disposable income back then than I do now… in the past five years, we've actually experienced a negative period of disposable income."

Layout:
- A vertical tick ruler and a baseline run along the left.
- A "Then" bar in ink is centred on x=640, and a "Now" bar in mint is centred on x=1280.
- Each bar's name sits inside it, top-left, in the background colour.

| Cue (s) | Word | Beat |
|---|---|---|
| 1.96 | "disposable income" | hero "Disposable income" rises in |
| 2.78 | "back then" | Then bar grows |
| 3.82 | "now" | Now bar grows to full height |
| 7.56 | "past five years" | red "Negative" block eats down from the top of the Now bar (the lost share), with a hairline seam |
| 9.6 | — | previous hero clears upward |
| 10.26 | "negative" | "NEGATIVE" letter-by-letter (`Letters`), red; thin ↓ arrow draws after |

Client notes that shaped these:
- The loss was first drawn as a separate orange bar under the baseline. The client asked for it **red, labelled "Negative", stacked on the Now bar** so the decrease reads directly.
- The headline was asked to animate "smooth", which led to the `Letters` reveal.
