# Style system: knowledge vs. style

**Knowledge** (principles.md, scene-recipes.md) is fixed: composition, hierarchy, the 3-tone rule, two-font contrast, motion timing, camera language, retention.
**Style** (a profile in `styles/`) is swappable: the actual colours, fonts, materials, background, UI skin, motion energy and transitions.

Applying a new style = keep the beat sheet, swap the profile values. A full-screen scene designed for one style should translate to another just by changing the profile, plus small material tweaks (e.g. white cards → dark glass cards).

## Profile fields (and defaults when a brief leaves them out)

| Field | What it controls | Default |
|---|---|---|
| ground | Background of full/half screens: colour, gradient, texture, grid, light (casted shadow / glow) | warm off-white #F4F2EE, thin grid, casted window shadow |
| ink | Main text/object colour on the ground | #141414 |
| inkMuted | Micro labels, secondary text | #8B8883 |
| accent | Special words, active states, the one highlight | #3A7BFF |
| accentGlow | Glow colour | accent at 55% |
| sansFont + weight | Regular words | Inter 500 |
| displayFont | Special words (opposite of the sans) | EB Garamond Bold Italic |
| captionColor | Caption words on footage | #F3F3F3 |
| card | Material of objects/cards on the ground | white gradient card, soft 2-layer shadow |
| uiMaterial | Lower-third UI over footage | dark glass 72%, 1 px border, blur |
| uiScale | Size of on-screen UI | 0.75 |
| speakerTreatment | Darken/blur behind the UI | darken 0.7, blur 14 px |
| transitions | Into full screens | circle / square reveal |
| energy | Calm / medium / high: scales stagger, camera speed, particle use | medium |
| references | Inspiration folder or images | — |

In code this is one object (ReelKit `StyleProfile`, or the `Style` type in remotion-cookbook.md). Scenes read only from it.

## Turning a client brief into a profile

1. Map brand colours to the 3 tones: the darkest usable brand colour → ink (or the ground for dark styles), the lightest neutral → ground, the most distinctive colour → accent. Desaturate it 10 to 20% if it's neon.
2. Fonts: the brand sans → sansFont; pick a display face that is its opposite (serif italic for a geometric sans, condensed bold for a light sans, mono for tech). Use a free equivalent if the brand font is paid; say which.
3. Ground: light brands → paper/grid/shadow; tech/dark brands → near-black gradient + accent glow + subtle noise; editorial/warm brands → yellow/cream gradient + casted shadow.
4. Materials follow the ground: light ground → white cards with soft shadows; dark ground → glass cards with a 1 px light border and an inner glow.
5. Energy from the brand tone: finance/luxury → calm (longer holds, fewer particles); creator/education → medium; gaming/hype → high (faster stagger, more punch-ins), but the principles still hold.

## Analyse a reference video into a profile

1. Pull frames at 2 fps (`ffmpeg -i ref.mp4 -vf "fps=2,scale=270:480,tile=8x3" sheet_%02d.jpg`) and look at every sheet.
2. Write a shot list: time · line · scene type · category · what happens.
3. Sample exact colours from full-res frames (ground, caption white, accent, card) with PIL `getpixel`, and pick the most common saturated colour for the accent.
4. Identify fonts by shape (geometric/grotesk/humanist sans; serif italic/script/condensed display); name the closest free fonts.
5. Measure caption size and position as a fraction of the frame height.
6. Describe the motion: entrance type, durations (count frames), easing feel, stagger, camera moves, transitions.
7. Write `styles/<name>.md` from `styles/_template.md`; render one test still per scene type for approval.

## Built-in example styles

- `styles/blue-minimal.md`: the reference reel. Warm paper, blue accent, serif-italic special words, dark-glass UI.
- `styles/dark-saas.md`: a dark tech style built from the same knowledge (an example of transfer).
- `styles/warm-editorial.md`: the yellow + casted shadow + grid look from the guide.
