# Motion design principles (style-agnostic)

These rules hold in every style. A style profile changes colours, fonts, materials and mood; it does not change these.

## Contents
1. Composition · 2. Hierarchy and sizing · 3. Colour · 4. Typography · 5. Materials and depth · 6. Motion · 7. Camera · 8. Retention and pacing · 9. Checklist

## 1. Composition: focal, supporting, depth

Think of the frame as a 3×3 grid.

- **Focal point (centre cell, or centre column on 9:16):** one main thing, chosen by asking "what is this scene's message?". If the object is the focus, the object goes in the main zone; if the text is the focus, the text goes there; if a person is the focus, the person goes there.
- **Supporting elements (around the focal point):** 1 to 3 smaller elements that explain or emphasise it: labels, cards, mini UI, arrows, a timeline card next to an eyeball, a sound-wave card under it. They touch or overlap the focal zone edge.
- **Depth elements (outside the focal zone):** small, faint, blurred or partly off-frame: pills at the edges, particles, background shapes, a second layer of cards at 50% opacity with 2 to 4 px blur. They make the frame feel like a space, not a slide.
- **Background:** gradient + texture + a light source (casted shadow, glow, vignette). Never a flat fill unless the style asks for "plain".

Safe areas for 9:16 social: keep important text out of the top 220 px and bottom 380 px (platform UI), and 70 px from the sides.

The **four scene categories** decide what the focal point is:

| Category | Focal point | Typical support |
|---|---|---|
| Text-centric | A two-font headline or a single big number/word | Small object or graphic beside it; camera tracks the text as it writes |
| Object-centric | One hero object (3D eye, coin, brain, product, app icon) | Labels, mini cards orbiting, text above |
| Person-centric | A person (cut-out or framed photo), centre or side | A graphic behind them (shape, ring, poster), name/title text |
| Graphic-centric | A chart, UI card, progress bar, swatches, logo grid | An object or one line of text |

## 2. Hierarchy and sizing

- One message per scene. If you need two, make two scenes.
- Size by importance: focal is the largest, then supporting at about 40 to 60% of focal size, depth at 15 to 30%.
- **Go 25% smaller than your first instinct.** Oversized icons and shape layers are the main sign of a beginner. Leave at least 30% of the frame as breathing space.
- Text is smaller than you think on 9:16: body/sans captions about 34 to 40 px at 1080 wide; one emphasised word about 2× that.
- Micro labels (tiny uppercase, wide letter-spacing, muted) add a "designed product" feel: `EFFECT USAGE`, `1 / 9`, `TIMELINE`.

## 3. Colour

- **3 tones per scene:** an ink (near-black or near-white), a ground (paper, dark, or tinted), and **one** accent. Tints of those three are fine; a fourth hue is not.
- Desaturate. Harsh #000, #FFF and pure saturated red/green read cheap; use near-black (#141414), warm white (#F3F3F3 / #F4F2EE) and a slightly dulled accent. "Luxury brands use dull colours."
- The accent marks meaning: the special word, the active state, the one thing that changed. If everything is accent, nothing is.
- Glow is an accent-only effect (accent at 40 to 60% opacity, 20 to 30 px blur), used on the 1 or 2 elements that must pop.

## 4. Typography

- **Two fonts that are opposites:** a clean sans for regular words (needs several weights) and a contrasting display face (serif italic, script, condensed, or mono) for special words. If one is light, the other is bold.
- **One special phrase per line.** Choose the word that makes people keep watching: the number or promise ("3 mistakes", "25% smaller"), a scary or negative word ("steal", "gap"), the audience's desire ("growth", "$100,000"), or the contrast word ("beginner" vs "pro").
- Caption layout: a short sans lead-in beside the big special word, then a second sans row under it; centre aligned unless the scene composition needs left/right.
- Regular words get a light drop shadow on footage; the special word gets the accent + glow.
- Kinetic text: word-by-word pop for the sans (rise about 14 px + fade + blur about 6 px → 0), letter-by-letter for the display word (1 to 1.5 frames apart). The full line lands in under 1.5 s and is synced to the spoken words. Exit: quick blur-out in about 6 frames.

## 5. Materials and depth

- Cards: rounded (28 to 64 px radius), slightly off-white gradient, a two-layer soft shadow (large and soft + small and tight) and a faint inner shadow at the bottom. They look like objects, not boxes.
- Glossy 3D objects with a soft contact shadow under them.
- Dark UI (on footage): dark glass, about 70% opacity near-black, 1 px faint light border, backdrop blur, big soft shadow.
- Depth by blur and opacity, not by more objects.
- Effects are rare. The less an effect is used, the more special it is. Reserve particles, glow and big camera moves for the one moment that needs attention.

## 6. Motion

| Thing | Rule |
|---|---|
| Easing (entrances) | Fast then slow: cubic-bezier(0.16, 1, 0.3, 1). Never linear for entrances; no visible bounce |
| Easing (camera, moves A→B) | Smooth in-out: cubic-bezier(0.65, 0, 0.35, 1) |
| Element entrance | 8 to 14 frames: scale 0.85 → 1, rise 20 to 40 px, fade, blur 8 px → 0 |
| Stagger | 4 to 8 frames between related elements; focal first, then supporting, then depth |
| Hold | The payoff state must hold at least 0.8 s before anything else happens |
| Snap moments | One sharp change per scene (a value snaps, a segment lights up, a badge pops); 6 to 10 frames |
| Exit | Faster than the entrance (6 to 8 frames), or let a transition carry it out |
| Idle | Nothing is ever fully still: slow drift of shadows, 3 to 10 px float on supporting elements, slow camera push |
| Scene length | 2.5 to 6 s; change something on screen every 0.5 to 1.5 s |

Sync the motion to speech: entrances land on the spoken word they illustrate, never before it.

## 7. Camera

- Always a slow move: push-in on footage (1.00 → 1.06 over a line), slow zoom-out on full screens (1.08 → 1.00).
- **Track the action:** when text writes on in the top-left and then the bottom-right, the camera follows it there.
- **Slow zoom-out, then snap to a new angle** to restart attention mid-scene.
- Punch-in (about 1.15 to 1.2× in 6 to 8 frames) on the speaker for emphasis lines.
- Into full screens: circle or square reveal from the footage (12 to 16 frames). Half screens slide in from their edge.

## 8. Retention and pacing (what to show, when)

- **Hook (first 2 to 3 s):** the speaker is on screen; captions in the lower half; highlight the one word that makes them stay and visualise the promise (e.g. a 1-2-3 tracker for "three mistakes").
- **Pay off the hook visually:** the hook's UI comes back as the chapter marker and is complete at the end.
- **Scene mix:** alternate face and visual every 3 to 5 s. Never two full screens in a row. Use full screens for the key explanation of each section, half screens for supporting proof, captions + UI for chapters/lists/numbers, captions only for personal lines and the ending.
- **Typical density:** about 12 animations per 50 s reel.

## 9. Checklist (run it on every still)

- [ ] One message, one focal point in the centre zone, supporting + depth present
- [ ] 3 tones only; accent used only for meaning
- [ ] Nothing oversized (try it 25% smaller; keep the smaller one if it still reads)
- [ ] Text inside safe areas, never on a face or a UI
- [ ] One special phrase per caption line
- [ ] Entrances eased fast-then-slow, staggered, synced to speech; one snap moment; payoff holds 0.8 s or more
- [ ] Camera is moving; transitions match the style
- [ ] Every colour, font and material comes from the style profile
