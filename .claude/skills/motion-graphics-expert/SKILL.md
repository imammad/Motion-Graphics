---
name: motion-graphics-expert
description: Motion graphics expert knowledge for short-form video (9:16 reels, TikTok, Shorts, also 16:9): how to design and animate full-screen animations, half-screen animations, on-screen lower-third UI, kinetic captions, transitions and camera moves in ANY visual style, built in Remotion. Style-agnostic craft (composition, typography, colour, motion timing, camera, retention) plus pluggable client style profiles. Use whenever the user asks for any motion graphic, animation, scene, caption style, UI animation or explainer visual, even a single one ("just a full-screen animation", "make this in my other style", "animate this stat"), names a client/style, attaches a client brief, or refers to "my motion graphics skill".
---

# Motion Graphics Expert

You are a senior motion designer. This skill holds the craft knowledge; the **style** is a swappable input. Never confuse the two: the knowledge always applies, the style decides colours, fonts, materials and mood.

## 1. Work out the job (scope only what was asked)

| Ask | Deliverable | Read |
|---|---|---|
| One full-screen animation | One 1080×1920 composition (or the requested size), 3 to 6 s | `references/scene-recipes.md` § Full screen |
| One half-screen animation | Top-half scene, 1080×960, with a speaker slot below | § Half screen |
| On-screen UI / lower third | Small UI over footage, darken+blur behind | § On-screen UI |
| Captions / kinetic type | Caption component or styled lines | § Captions |
| Transition / camera move | Transition or camera keyframes | § Transitions and camera |
| Whole reel / edit plan | Scene plan + all scenes | all of `scene-recipes.md` + § Retention in `principles.md` |
| New style from references | A style profile | `references/style-system.md` § Analyse a reference |

If the ask is a single scene, build only that scene as its own composition. Don't build a whole reel, planner or captions unless asked.

## 2. Resolve the style (before designing anything)

1. User attached or pasted a brief/profile → use it.
2. User named a style/client → load `styles/<name>.md` (list the folder; match loosely, e.g. "my other style", "the yellow one"). If several could match, ask which one in one line.
3. Nothing given → ask once, in one line, offering the styles in `styles/`; if the user wants you to just go, use `styles/blue-minimal.md` and say so.
4. Fill gaps in a brief with the defaults in `references/style-system.md` § Profile fields. Never let a style break the craft rules in `principles.md` unless the brief says so explicitly (note it when it does).

## 3. Design (always, in this order)

Read `references/principles.md` once per session. Then for each scene write a short **beat sheet** before code:

```
Scene: <name> · <type> · <duration>s · style: <profile>
Message: <the one idea the viewer must get>
Category: text- / object- / person- / graphic-centric
Focal (centre zone): …
Supporting (around it): …
Depth (outside, smaller/fainter): …
Palette: ink / ground / accent (3 tones)
Beats: 0.0s … · 0.4s … · 1.2s … (entrances, the payoff moment, camera)
```

Pick 2 to 4 references that fit the style (the user's inspiration folder if they have one, else `examples/`), and borrow composition and finish, never content.

## 4. Build (Remotion)

- If the repo has `src/ReelKit` (the user's toolkit), use it: `StyleContext` + profile, `FullScreen`, `HalfScreen`, `Paper`, `WhiteCard`, `GlassCard`, `LowerThird`, `Caption`, `StepTracker`, `SliderUI`, `Badge`, `Pill`, `Confetti`, `progress`/`pop`/`easeOut`.
- Otherwise use the self-contained snippets in `references/remotion-cookbook.md` (no dependencies beyond `remotion`). Set up Remotion if the project has none (`npx create-video@latest`, blank template).
- All colours, fonts and materials come from the style profile object, never hard-coded in the scene.
- Standalone scene = its own `<Composition>` with the right size, fps 30, duration from the beat sheet.

## 5. Verify, then report

1. `npx tsc --noEmit` (and eslint if configured).
2. Render stills at the key beats (`npx remotion still <Id> out/<id>-<frame>.png --frame=<n>`); look at every one.
3. Check against the checklist at the end of `principles.md`. Fix and re-render what fails.
4. Report: what you built, the beat sheet, the style used, any rule you bent and why, and how to render it.

## Adding styles

Users add client briefs as `styles/<client-name>.md` (copy `styles/_template.md`). A brief only changes the look; the knowledge here stays the same. `references/style-system.md` explains how to turn a reference video into a brief.
