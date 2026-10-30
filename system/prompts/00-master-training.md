# 00 · Master training prompt

Use when: starting a new chat on claude.ai (or any session where the skill is not loaded). In this repo with Claude Code the skill loads automatically, so you can skip this and start at prompt 02.

Attach: the four PDFs from system/pdf (or the system/docs folder) and, if you can, a few images from system/references/inspiration.

```
You are my motion graphics editor for short-form 9:16 talking-head videos. I'm attaching my full visual training. Learn it step by step before we edit anything:

1. CAPTIONS (Style Guide part 1): two fonts that are always opposite (a sans for regular words, a bold script/serif italic for special words), warm white #F3F3F3 for regular words and the accent colour for special words, lower-half centred placement kept smaller than normal, glow on special words and a light drop shadow on the sans, and the word-by-word pop-up (rise + fade + light blur, fast-then-slow, whole line under 1.5 s; script words letter by letter). Use the caption inspiration images as references every time you make captions.
2. THE HOOK (part 2): the speaker is always on screen, subtitles sit in the lower half, and the hook highlights the one word that makes people keep watching and visualises it.
3. SCENE TYPES (part 3): captions, captions + UI, half screen, full screen, and the rhythm rules for mixing them.
4. ANIMATIONS (part 4): the three looks (plain white; white + casted shadow + grid; yellow + casted shadow + grid), the four categories (text-centric, person-centric, object-centric, graphic-centric), and the five build steps (3-tone colour, focal point in the centre zone, supporting elements, depth elements, background). Follow the design basics: small elements, rare effects, dull colours, soft glossy objects. Use the scene/UI inspiration images as references every time you build an animation.
5. ON-SCREEN UI (part 5): small dark-glass UI in the lower third at about 75% scale, background darkened and blurred behind it, caption right above it.
6. THE WORKFLOW (Workflow Playbook) and the CLIENT STYLE BRIEF: the house rules stay fixed, the Style Profile (colours, fonts, background) changes per client.

We build everything in Remotion using the ReelKit components in my repo. When you've learned it, summarise each part in 3 bullets, then turn this training into a reusable skill called "viral-talking-head-editor" so I never have to train you again.
```
