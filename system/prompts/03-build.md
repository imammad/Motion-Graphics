# 03 · Build the animations

Use when: you've exported your plan from the planning page.

```
Here's the full plan for [EDIT] (attached / at src/Reels/[edit]/plan.json). Use the viral-talking-head-editor skill and Remotion to build it.

Before you start, tell me every asset you need from me (screenshots, product photos, logos, 3D objects, cut-outs) and wait for them. You can source generic objects yourself if you tell me where they came from.

Then:
1. Create src/Reels/[edit]/ with Reel.tsx (wires plan + scenes like src/Reels/Demo/DemoReel.tsx) and scenes.tsx (one component per animated line). Use ReelKit components and the [client-name] style profile. Register the composition in src/Root.tsx as [EditId].
2. Build every line exactly as I described in the plan. Where my note is vague, follow the style guide (focal point, supporting elements, depth elements, 3 tones, small elements, fast-then-slow motion) and pick references from system/references/inspiration.
3. Time captions to the word-level transcript; captions must never cover a face or a UI.
4. Render a still of every animated line, check each one against the style guide's quality checklist, fix what fails, then render a preview to out/[edit]-preview.mp4.
5. Give me a table of every line: what you built, and anything you changed from my plan and why.
```
