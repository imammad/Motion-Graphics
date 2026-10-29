---
name: ambitious-mg
description: >-
  AmbitiousMG: create premium, clean "editorial infographic" motion graphics synced to a voice-over: dark forest-green gradient, tall condensed display type with wide-tracked labels, flat infographic shapes (bars, rulers, stepped area lines, thin arrows), rule-of-thirds layout, smooth masked and letter-by-letter reveals, built in Remotion and rendered 1080p60 with no SFX. Use this skill whenever someone wants explainer / YouTube / talking-head graphics, animated stats, charts or "visual points" for a script or audio, kinetic typography for finance or data stories, or asks to turn transcript sections into motion graphics, even if they don't name the style, and whenever they mention AmbitiousMG or "AmbitiousMG style", or ask for "the same style as the intro", "premium and clean", "infographic style", or "not AI-looking / not choppy" animation.
---

# AmbitiousMG

The AmbitiousMG editorial infographic motion style.

A style and a workflow for voice-synced explainer graphics that feel like an editorial annual report brought to life: one big idea per visual, set in condensed type, carried by a single flat infographic shape, timed to the narrator's words.

The style was arrived at through client feedback. An earlier glowing "tech" version (neon glows, glass cards, sound effects, lots of labels) was rejected as "not premium" and "AI-looking". What won was flat, editorial and restrained. Keep that history in mind when tempted to add effects.

## When the style fits

- Talking-head explainers (finance, economics, business) where a few numbers or ideas need to land visually.
- Inserts that cut away from the speaker for 8–15 seconds, then hand back.
- Anything the user describes as premium, clean, editorial, infographic, minimal text, or "like the intro".

If the user wants playful, 3D, character, or UI-mockup animation, this is the wrong style.

## The look

### Colour (dark only, flat)

| Token | Value | Use |
|---|---|---|
| bg | `#072818` | base; background is the gradient below |
| ink | `#dddddd` | primary type, "then"/neutral shapes |
| muted | `rgba(221,221,221,0.56)` | labels, axis years |
| rule | `rgba(221,221,221,0.42)` | rulers, baselines |
| mint | `#43e097` | the positive / "today" / highlight colour |
| brand | `#01572a` | brand green (dark; use sparingly as fill on light) |
| red | `#ff4b4b` | negative, loss, decline: one element per visual at most |

Fills are **flat**: no glows, no drop shadows, no glassmorphism, no gradients inside shapes. Translucency is fine for area charts (mint at ~0.16 opacity under a solid line).

**Background**: deep forest radial gradient (`#0c3621` → `#072818` → `#03130a`), two very soft glows (mint 11%, brand 40%) drifting slowly on sin/cos of time, and a vignette. No dot texture or grain, which reads as noise in this style. This lives in `Stage` in `assets/remotion/common.tsx`.

### Type

- **Display**: Barlow Condensed 800, UPPERCASE, line-height 0.84. Use it for hero words and big numbers only, at 150px for headlines and 300–380px for hero numbers.
- **Labels**: Inter 500, 16–20px, UPPERCASE, letter-spacing 0.3em, muted colour. Use them for legends, axis years and small captions.
- Fonts are in `assets/fonts/` (OFL). Copy them to the project's `public/fonts/`; `common.tsx` loads them from there.

**Minimal text.** A visual carries one hero phrase (2–3 words, ideally the narrator's own word: "Better off?", "On paper", "Negative") plus at most a few tiny labels. Never put sentences on screen.

### Layout: rule of thirds

1920×1080, margins 160px, third lines at x 640/1280 and y 360/720 (`G` in common.tsx).

- The hero headline sits **on the upper third line** (bottom of the text at y=360), left-aligned at the margin.
- Big numbers and chart baselines sit on or near the **lower third** (y≈720–850).
- Two-item comparisons centre each item on a **vertical third** (x=640 and x=1280).
- Legends and secondary labels are right-aligned to the right margin on the upper third line.

### Infographic vocabulary

Pick **one** primary device per visual, chosen to match the sentence:

| Sentence shape | Device |
|---|---|
| "X years ago vs today" | two huge numbers on a horizontal **ruler** with year ticks; a flat progress bar runs the ruler |
| "went up on paper, but…" | **stepped area/line chart** (straight segments, dots + tiny labels on the steps) vs a flat light slab |
| "then vs now", decline, "negative" | flat **bars** with names inside top-left (in bg colour), a vertical tick ruler, a baseline; loss shown as a **red block stacked on the bar** eating down from its top |
| a verdict | a built glyph (an "=" from two bars, a thin editorial arrow ↗ → ↓) next to the hero word |

Shapes have square corners, flat colour, and names set inside them like a printed annual report.

## The motion

- **60fps**. Keep all cue times in **seconds** (`time = frame / fps`), so frame rate and duration never break the sync.
- Easing:
  - `EXPO` (cubic-bezier 0.16, 1, 0.3, 1) for entrances.
  - `SMOOTH` (0.65, 0, 0.35, 1) for moves, wipes and hand-offs.
  - `SOFT` (0.22, 1, 0.36, 1) for type.
  - No bounces or overshoot.
- **Text**:
  - Headlines rise from behind a mask (`Reveal`) and leave upward the same way (`out`).
  - For the climactic word, use `Letters`: each glyph lifts about 0.32em, fades in and sharpens from a 10px blur, staggered ~45ms, over ~1.1s.
  - Clear the previous headline ~0.75s before the next arrives so they never overlap.
- **Shapes**:
  - Bars grow from the baseline (scaleY or a growing height), lines draw on with a clip or dash offset, rulers draw left to right.
  - One thing moves at a time. Most frames should be still enough to read.
- Use `steps()` to move a value through several voice cues, one eased segment each. For example, a line revealed step by step as the narrator names each event.
- **No sound effects** unless the user asks; the voice alone carries it.

## Workflow

Follow this order. The user expects to approve design before animation, and to see one finished graphic before the rest.

1. **Pick the sections.**
   - Read the transcript and choose the moments with the strongest visual point: a number, a comparison, a turn ("but…"), a verdict.
   - Propose 2–3 sections with time ranges, the line, and a one-line visual idea for each (a small table works well).
   - Leave breathing room between them for the talking head.
2. **Get word timings.**
   - Run `scripts/word_timestamps.py <audio> --start A --end B` to get per-word times.
   - Cut each section's voice clip (`ffmpeg -ss A -to B`, short fades) into `public/audio/`.
   - Express cues relative to the clip start, with a comment naming the spoken word, e.g. `paper: 5.88, // "on paper"`.
3. **Build in Remotion.**
   - Copy `assets/remotion/common.tsx` into the project, e.g. `src/<Name>/common.tsx`.
   - Write one component per visual, with a `CUE` object at the top and the spoken line in a comment.
   - Register the compositions at 1920×1080 and 60fps, with a duration of clip length plus ~0.6s.
   - See `references/examples.md` and `references/examples/*.tsx` for three complete worked visuals.
4. **Show the design first.**
   - Render 3–4 keyframe stills per visual with `scripts/render_stills.mjs` and tile them with `scripts/contact_sheet.sh`.
   - Check them yourself before sending. Look for:
     - text clipping (descenders inside masks)
     - collisions between labels and lines
     - lopsided spacing
     - anything off the thirds
   - Send the boards and explain each visual beat by beat against the words. Wait for approval.
5. **Render one, then the rest.**
   - Render the first visual at 1080p60 with `scripts/render_videos.mjs "^Intro1-" out/`.
   - Spot-check frames mid-transition (extract with `ffmpeg -ss t`), send it, and wait for feedback.
   - Then render the others the same way. Use 4K (scale 2) only on request; it is ~3× slower.
6. **Iterate narrowly.** When feedback targets one element (a chip, a word's animation), change just that, re-render that visual only, and say exactly what changed.

When delivering, give the start time of each graphic in the source audio so the editor can drop it in sync.

## Pitfalls seen in practice

- **Mask padding in em** is measured against the wrapper's font size, not the child's. Use px padding or set the font size on the mask, or "g"/"p" descenders get clipped.
- **Stills at the wrong time**: convert seconds with the composition's fps, not a hard-coded 30.
- **Long renders** can be killed if the machine goes idle. Run renders as a background task that stays alive until done, and write to `.part` files that are renamed when complete, so a restart can resume.
- **Upload limits** (~500 MB): split zips (e.g. by theme) rather than sending one huge archive.
- Don't invent figures. If a chart needs values the script doesn't give, label the data as illustrative, or prefer shapes whose meaning is relative (taller or shorter, flat or rising).
