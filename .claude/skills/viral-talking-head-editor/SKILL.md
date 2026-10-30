---
name: viral-talking-head-editor
description: >-
  Edit 9:16 talking-head reels (Instagram Reels, TikTok, Shorts) in the house "viral talking-head" style with Remotion and the ReelKit components in this repo. Two-font captions (sans + accent script), dark-glass lower-third UIs, half-screen and full-screen paper-world animations, camera moves. Use for any request to plan, animate, caption or render a short-form talking-head video, to onboard a new client style, or when the user pastes the planning-page plan.json or one of the prompts in system/prompts. Cutting and sound design are done by the user, not by this skill.
---

# Viral Talking-Head Editor

You are the motion graphics editor. The user cuts the footage and does the sound design; you do captions, animations, on-screen UI, camera and render.

This skill is the **reel workflow** (planner, transcript, PlanReel, renders). The **craft knowledge** (composition, typography, colour, motion, camera, scene recipes, style profiles) lives in the `mgskill` skill: load it too and follow it for every design decision.

## Read first (every time)

1. `system/docs/01-style-guide.md`: the house rules (captions, hook, scene types, animation build steps, on-screen UI, checklist). Non-negotiable unless the client brief overrides them.
2. The client's brief in `system/styles/<client>.md` and profile in `src/ReelKit/styles/<client>.ts`. No brief yet → use `BLUE_MINIMAL` and say so.
3. `system/docs/02-workflow-playbook.md` for where files go.
4. Before designing any animation, open 3 to 5 images from `system/references/inspiration/` (`captions-text/`, `onscreen-ui/`, `scenes-and-ui/`) that match the scene, and the reference frames in `system/references/reel-frames/`. Borrow composition and finish, never content.

## Pipeline

| Step | Prompt | What you do |
|---|---|---|
| New client | 01 | Analyse references frame by frame (2 fps contact sheets, shot list, sampled colours, fonts, motion), fill the brief, create the profile, render a test still per scene type |
| Transcribe | 02 | `python3 tools/transcribe.py <cut.mp4> src/Reels/<edit>` → transcript.json + plan.json seed. Suggest special words + scene types. Do not cut. |
| Plan | user | User fills `planner/index.html` and exports plan.json |
| Build | 03 | Ask for missing assets first. Build `src/Reels/<edit>/{Reel.tsx,scenes.tsx}`, register in `src/Root.tsx`, render stills of every animated line, check, render preview |
| Revise | 04 | Change only what's listed; before/after stills |
| Final | 05 | Run the checklist, render `out/<edit>-final.mp4` |

## Building with ReelKit (`src/ReelKit`)

- `PlanReel` renders a whole plan: continuous speaker (carries audio), one Sequence per line, automatic captions. Wrap it per edit like `src/Reels/Demo/DemoReel.tsx`; scene components can't go through Remotion props.
- Scene registry: `{ [line.scene]: React.FC<SceneProps> }`. Frames inside a scene are relative to the line start. Line ids map to keys (`l05` etc.) unless the plan says otherwise.
- `captions` → nothing to build. `captions_ui` → return `<LowerThird><GlassCard>…</GlassCard></LowerThird>` (PlanReel already darkens + blurs). `half` → return the top-half content (paper is drawn for you, canvas is 1080 × 960). `full` → return the full 1080 × 1920 composition (paper + reveal + camera drawn for you); set `captionInScene: true` if you draw the text yourself.
- Pieces: `Caption` (rows with `*special*` markup, `times`, `position`, `onPaper`), `Paper`, `Speaker`/`UIFocus`, `HalfScreen`, `FullScreen` (camera keys + circle/square reveal), `GlassCard`, `LowerThird`, `StepTracker`, `SliderUI`, `Cursor`, `WhiteCard`, `Pill`, `Badge`, `MicroLabel`, `Confetti`, motion helpers `progress`, `pop`, `easeOut`, `easeInOut`, `mix`.
- Style comes from `useStyle()`; never hard-code client colours or fonts in scenes. New fonts: add the woff2 to `public/fonts` and register in `src/ReelKit/fonts.ts`.
- Images/3D objects/logos go in `public/assets/<client>/` and load with `<Img src={staticFile(...)}>`.

## Scene recipe (every full/half screen)

1. 3 tones only: ink, paper/white, accent.
2. One focal object in the centre zone (3×3 grid centre cell).
3. Supporting elements around it (cards, labels, UI), smaller.
4. Depth elements outside the focal zone: smaller, fainter or blurred, particles.
5. Background: gradient + grid + casted shadow (Paper does this).
6. Motion: soft pop entrances staggered 4 to 8 frames, fast-then-slow easing, camera always drifting; track text as it writes, slow zoom-out, snap to a new angle.
7. Make it 25% smaller than your first instinct. Effects only where attention is needed.

## Verify before you hand over

- `npx tsc --noEmit && npx eslint src`
- Render stills: `npx remotion still <Id> out/stills/<line>.png --frame=<n>` (in the cloud add `--browser-executable` pointing at the Playwright chrome-headless-shell). Look at every still; check the checklist in the style guide (section 7).
- Preview: `npx remotion render <Id> out/<edit>-preview.mp4`.
- Report a table: line id, type, what you built, deviations from the plan and why.
