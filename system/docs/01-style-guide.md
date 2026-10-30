# Viral Talking-Head Style Guide

Visual training for Claude: captions, animations and on-screen UI for 9:16 talking-head reels. Rebuilt from the reference reel "3 things from beginner to pro" and the training method in "How to Edit VIRAL Instagram Reels Using Opus 5.5". Cutting and sound design are out of scope.

> How to use this guide: Part 1 to 4 are the house rules and never change. The Style Profile (colours, fonts, background) is the part that changes per client. Swap the profile with the Client Style Brief, keep the rules.

## 0. The reference reel at a glance

| Item | Value |
|---|---|
| Format | 1080 x 1920, 30 fps, about 50 s, 14 script lines |
| Look | Talking head on a dark studio blue, explainer scenes on warm off-white paper |
| Accent | Brand blue #3A7BFF (sampled #3A7AFF in the render) |
| Caption fonts | Sans: Creato Display Medium (stand-in: Inter 500). Script: Apple Garamond Bold Italic (stand-in: EB Garamond Bold Italic) |
| Paper | Warm off-white #F4F2EE, thin grey grid, soft casted window shadow |
| Scene mix | 5 captions-only/captions+UI, 3 half screens, 3 full screens, chapter UI 3 times |
| Animations | 12 animations, all built in Remotion |

![Hook: captions + red 1-2-3 tracker](system/references/reel-frames/01_t1.8s.jpg)
![Captions + UI: slider drag](system/references/reel-frames/02_t5.6s.jpg)
![Full screen: text + focal object](system/references/reel-frames/04_t10.5s.jpg)
![Half screen: -25% snap](system/references/reel-frames/06_t18.6s.jpg)

## 1. Captions

### 1.1 Two fonts, always opposite

- A simple sans for regular words. It needs many weights (thin, medium, black) so the weight can vary across the edit. Default: Medium.
- A script/serif italic for special words. It is always the opposite of the sans: if the sans is light, the script is bold, and the other way round.
- Reference reel: Creato Display Medium + Apple Garamond Bold Italic. Free stand-ins in this repo: Inter 500 + EB Garamond Bold Italic.

### 1.2 Colours

- Regular words: a warm near-white, never pure white. #F3F3F3.
- Special words: the accent colour of the edit (here #3A7BFF). Pick the accent from the client brand or the mood of the video.
- On paper scenes the sans switches to near-black ink #141414 and the script stays accent.

### 1.3 Placement

- Lower half of the screen, centre aligned, unless a scene has a special text design.
- Keep text smaller than "normal". Small sans reads premium. Only scale a word up to drag attention to it.
- The script word is about 2.1x the sans size (36 px sans, 78 px script at 1080 wide).
- Typical layout: one short sans lead-in on the left of the script word ("These *three mistakes*"), then a second sans row underneath.
- Placement moves with the composition: chest height on A-roll, above the head when a UI sits below, top-left/centre on paper scenes, inside the free half on half screens.

### 1.4 Effects

- Glow on special words in the script font (accent at about 55% opacity, 28 px blur).
- Light drop shadow on the sans words so they separate from the footage.
- Hook lines: drop shadow, no glow (planning-page rule in the reference).

### 1.5 Animation

- Word-by-word pop-up for sans words: each word rises from slightly under its final position, fades in, and un-blurs (about 6 px blur to 0).
- Letter-by-letter for script words: same rise + fade + blur per letter, 1 to 1.5 frames apart.
- Easing is fast then slow (cubic-bezier 0.16, 1, 0.3, 1). Never linear, never bouncy.
- The whole line takes at most 1.5 s to animate in. Words are timed to the word-level transcript.
- Exit: the line blurs and fades out in about 6 frames as the next line starts.

![Guide: fonts and colours](system/references/guide-frames/captions-fonts-colors.jpg)
![Guide: placement, effects, animation](system/references/guide-frames/captions-placement-effects-animation.jpg)

### 1.6 Choosing the special word

The special word is the one word that makes people keep watching. Ask "what is this line about?" and highlight that. Good candidates: the number or promise ("three mistakes", "25% smaller"), a scary or negative term ("steal", "gap between"), the audience's desire ("growth", "$100,000"), or the contrast word ("beginner" vs "professional"). One special phrase per line, never more.

## 2. The hook (first 3 seconds)

![Guide: hook psychology](system/references/guide-frames/hook-psychology.jpg)

1. Show the main speaker. There is always a shot of the speaker so viewers decide if they know them / want to watch.
2. Subtitles sit in the lower half. Sans for regular words, bolder script for special words + accent colour + glow.
3. Hook messaging. The editor asks "what is the one thing that will make the viewer want to watch?" and visualises it. In the reference the hook "These three mistakes make your edits look like an amateur" gets "three mistakes" in blue plus a 1-2-3 tracker with red outlines (red = mistakes). The tracker comes back as the chapter UI later, which pays off the promise.

## 3. Scene types (the four you plan with)

| Type | What it is | When to use it |
|---|---|---|
| Captions | Speaker full screen + captions. Slow push-in, or a punch-in for emphasis | Personal lines, transitions, the ending |
| Captions + UI | Captions + a small dark-glass UI in the lower third. Background darkens and blurs behind it | Chapters, lists, steps, sliders, numbers the speaker says out loud |
| Half screen | Animation on the top half (paper), speaker on the bottom half with captions | Simple visual proof that still needs the speaker's face |
| Full screen | Animation takes over the whole screen (paper world), captions become scene text | The key explanation in each section; the "payoff" visual |

Rhythm used in the reference: never two full screens in a row; alternate face and visual roughly every 3 to 5 s; every chapter opens on the speaker with the chapter UI; the ending returns to the speaker with the tracker fully filled.

## 4. Full-screen and half-screen animations

### 4.1 Three animation looks

| Look | Build |
|---|---|
| Plain white | A plain white solid. Objects carry the scene |
| White + casted shadow + grid (house default) | White-to-greyish gradient, casted window-shadow overlay, thin light grid |
| Yellow + casted shadow + grid | Yellow-to-greyish gradient, casted shadow overlay, sometimes a thin grey grid |

![Guide: backgrounds and graphic-centric scenes](system/references/guide-frames/backgrounds-and-graphic-centric.jpg)

### 4.2 Four animation categories

- **Text-centric:** the text is the star (big two-font headline, kinetic words, text writing on while the camera tracks it). Text only, text + object, or text + graphic.
- **Person-centric:** a person (cut-out or framed photo) is the focus, in the centre or on the side, with a graphic behind them to support and emphasise them.
- **Object-centric:** one object in the middle (3D eyeball, coin, brain, app icon) + text, or object + graphic. In the reference: the play icon, the eyeball.
- **Graphic-centric:** a graphic in the middle delivers the point: charts, UIs, cards, logos, progress bars. Usually combined with an object or text. In the reference: the effect-usage bar, colour swatches, brand-logo pills.

### 4.3 How to build a scene (the five steps)

1. **Colour:** a 3-tone palette: black, white and one special colour. Nothing else.
2. **Focal point:** decide the scene's main focus (object, text or person) and put it in the main focal zone: the centre cell of a 3x3 grid.
3. **Supporting elements:** add elements around the main object to emphasise it (cards, labels, timeline UI, sound-wave card around the eyeball).
4. **Depth elements:** add elements outside the focal zone, smaller, fainter or blurred, for depth (logo pills at the edges, confetti, particles).
5. **Background:** gradient + texture + casted shadows (section 4.1).

![Guide: focal point, supporting, depth](system/references/guide-frames/focal-point-supporting-depth.jpg)

### 4.4 Design basics

- Objects: glossy, slightly 3D, soft shadows. White rounded cards (radius 28 to 64 px) with a two-layer soft shadow and a faint inner shadow at the bottom.
- Accent objects use a vertical gradient of the accent with an accent-coloured glow under them.
- Micro labels: tiny uppercase sans with wide tracking ("EFFECT USAGE", "TIMELINE", "SOUND FX", "1 / 9").
- Keep things small. A beginner makes icons and shapes huge; make every element about 25% smaller than your first instinct.
- Use effects rarely. The less an effect is used, the more special it is.
- Use dull, desaturated colours. Harsh black, harsh white and bright red read cheap.

### 4.5 Motion and camera

- Elements enter with a soft pop: scale 0.85 to 1, rise, fade and un-blur. No visible bounce.
- Stagger related elements 4 to 8 frames apart.
- Into a full screen: a circle or square reveal from the speaker. Half screens slide in from the top edge.
- Camera tracks the action: it follows text as it writes (top left, then bottom right), slowly zooms out, then snaps to a new angle. Slow push-ins on the A-roll. Punch-in (about 1.18x) on key lines.
- Idle drift: nothing is ever fully still. The casted shadow drifts, supporting elements float a few pixels.

### 4.6 Shot list of the reference reel

| Time | Line | Type | What happens |
|---|---|---|---|
| 0.0 to 3.0 | These three mistakes make your edits look like an amateur | Captions + UI | "three mistakes" in blue script; dark glass pill with red-outlined circles 1-2-3 |
| 3.0 to 6.5 | Here's what you should do to take your animation from beginner to professional | Captions + UI | Punch-in on face; cursor drags a Beginner to Professional slider, Professional turns blue |
| 6.5 to 8.3 | Number 1: stop oversizing everything | Captions + UI | Tracker returns in white, circle 1 fills; title under it in script |
| 8.3 to 13.3 | The biggest thing that screams beginner is huge icons and huge shape layers | Full screen | Low-quality edit card pops in centre; camera tracks text top-left then bottom-right |
| 13.3 to 20.3 | As a rule of thumb, make every element 25% smaller | Half screen | Play icon starts too big, snaps smaller; dashed outline, -25% badge, confetti |
| 20.3 to 23.5 | Number 2: stop overusing effects / Less is more | Captions + UI | Circle 2 fills |
| 23.5 to 27.0 | The less you use an effect, the more special it is | Half screen | "EFFECT USAGE 1/9" bar, only one segment lights blue |
| 27.0 to 30.5 | Reserve your visual effects for elements you need to grab attention | Full screen | Eyeball pops and spins; TIMELINE and SOUND FX cards slide in around it |
| 30.5 to 33.0 | And number 3: use more dull colors | Captions + UI | Circle 3 fills |
| 33.0 to 37.0 | Beginner editors always use harsh blacks, harsh whites and bright reds | Half screen | Three swatch tiles pop in with names and hex codes |
| 37.0 to 43.5 | Luxurious brands always use dull colors / Duller colors look more high-end | Full screen | Luxury logo pills orbit the text, fade out, new serif text writes on |
| 43.5 to 49.7 | So now that you know that, change these three things... | Captions + UI | Tracker fills 1, 2, 3 to show everything was covered |

![Full screen: eyeball + cards](system/references/reel-frames/08_t29.6s.jpg)
![Full screen: logo pills](system/references/reel-frames/10_t39.6s.jpg)
![Half screen: colour swatches](system/references/reel-frames/09_t35.6s.jpg)
![Full screen: text write-on](system/references/reel-frames/11_t43.0s.jpg)

## 5. On-screen animations (captions + UI)

Two rules:

1. The background behind the UI darkens and blurs, so the lower-third animation is clearly visible.
2. The animation sits in the lower half / lower third, takes up real space, and is kept at about 75% scale. The caption sits right above it.

Build: dark glass card (near-black at about 72% opacity, 1 px faint white border, radius 26, big soft shadow), white text, accent for the active state. UI inspiration: glowing blue/purple dark dashboards, stat cards, progress bars, toggles, step trackers, icon tiles (see references/inspiration/onscreen-ui).

![Captions + UI: chapter tracker](system/references/reel-frames/03_t8.0s.jpg)
![Guide: inspiration boards and on-screen rules](system/references/guide-frames/inspiration-and-onscreen.jpg)

## 6. Inspiration library

All in system/references/inspiration (219 images):

- **captions-text/** (9): caption-style references. Warm podcast footage, gold/orange script words, small sans.
- **onscreen-ui/** (34): dark glass UI, glowing charts, cards, icon tiles, and frames of lower-third UIs over a speaker.
- **scenes-and-ui/** (176): clean white minimal posters (halftone brains, chess pieces, hands, coins), dark blue/purple SaaS scenes, charts and dashboards.

Rule: before building any animation, look at 3 to 5 references from the matching folder and borrow composition, not content.

## 7. Quality checklist (before you hand over)

- One special phrase per caption line, in the accent, with glow.
- Every caption animates in under 1.5 s and never sits on top of a face or a UI.
- Every full screen has one focal object in the centre zone, supporting elements, and depth elements.
- Only 3 tones per scene: black, white, accent.
- Nothing is oversized; check by shrinking it 25% and comparing.
- No two full screens back to back; the speaker returns every few seconds.
- Chapter UI appears at every chapter and is fully filled at the end.
- Motion is fast-then-slow, no bounce, no linear moves; the camera is always slowly moving.
