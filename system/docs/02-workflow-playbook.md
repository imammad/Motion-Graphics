# Workflow Playbook

From raw talking-head to finished animated reel with Claude + Remotion. You do the cutting and the sound design; Claude does the planning page, captions, animations and render.

> Time budget from the reference edit: cutting 24 min (do it yourself or with a fast tool), planning 15 min, building 40 min, revisions 10 to 20 min. You actively work about 20 minutes; Claude does the rest.

## The pipeline

| Step | Who | Input | Output |
|---|---|---|---|
| 0. Style | You + Claude | Client references (one-time per client) | Style Profile + Client Style Brief |
| 1. Cut | You | Raw footage | cut.mp4 (silences and bad takes removed) |
| 2. Transcribe | Claude | cut.mp4 | Word-level transcript (JSON with word times) |
| 3. Plan | You (15 min) | Planning page | plan.json |
| 4. Build | Claude (about 40 min) | plan.json + skill + assets | Remotion scenes + preview |
| 5. Review | You | Preview render | List of changes |
| 6. Revise + render | Claude | Change list | final.mp4 (no audio mix: you add sound design) |

## Step 0: one-time setup (per machine)

1. Open this repo in Claude Code. Model: the strongest Opus available, high effort.
2. Run npm i once. Remotion is already set up in this repo.
3. The skill in .claude/skills/viral-talking-head-editor loads automatically in this repo. On claude.ai, upload the docs folder and use prompt 00 instead.

## Step 0b: new client or new style

1. Collect 1 to 3 reference reels the client likes + their brand colours, fonts, logo.
2. Fill the Client Style Brief (03-client-style-brief) with the client, or send prompt 01 with the reference video and let Claude fill it.
3. Claude creates src/ReelKit/styles/client-name.ts (a Style Profile) and system/styles/client-name.md (the brief). From then on every edit for that client starts from that profile.

## Step 1: cut (you)

Remove silences and bad takes, keep about 20 ms padding. Export 1080 x 1920 at 30 fps. Put it in public/footage/client-name/cut.mp4.

## Step 2: transcribe

Send prompt 02. Claude creates a word-level transcript (word, start, end) and groups words into caption lines of about 3 to 8 words, one idea per line. This also seeds the planning page.

## Step 3: plan (the most important step)

Open planner/index.html in a browser, load the transcript JSON Claude made, then:

1. **Constants for the whole edit:** accent colour, caption fonts, caption style and animation, theme/look, lower-third UI rules, transitions and camera. (These are prefilled from the Style Profile.)
2. **Per line:** pick a scene type (captions / captions + UI / half screen / full screen), mark the special words with asterisks, and write in one or two sentences what happens on screen.
3. Export plan.json and drop it in src/Reels/edit-name/plan.json.

![Planning page constants (reference)](system/references/guide-frames/planning-page-constants.jpg)

How to decide the scene type:

- Hook: speaker on screen, captions + a UI that visualises the promise.
- Chapter title: captions + UI (tracker / step counter).
- First explanation in a chapter: full screen (the payoff visual).
- Supporting proof or a rule of thumb: half screen.
- Personal or emotional line: captions only, push-in.
- Ending: captions + the UI that shows everything was covered.

## Step 4: build

Send prompt 03 with the plan. Claude:

1. reads the skill + the Style Profile + the plan,
2. lists the assets it needs from you (screenshots, product shots, 3D objects, logos) before building: send them,
3. builds one scene component per animated line in src/Reels/edit-name/scenes.tsx, using ReelKit components,
4. renders stills of every scene to check them against the checklist,
5. renders a preview MP4.

## Step 5: review

Watch it three times: once for the animations, once for the text, once for the timing. Write changes as "line L05: make the badge appear on the word smaller, not before" and send prompt 04.

## Step 6: render

npx remotion render edit-id out/edit-name.mp4. Hand the render to your sound-design pass.

## Folder layout

| Path | What lives there |
|---|---|
| system/docs | These guides (source for the PDFs) |
| system/prompts | Copy-paste prompts 00 to 05 |
| system/styles | One Client Style Brief per client |
| system/references | Reference frames + 219 inspiration images |
| planner/index.html | The planning page |
| src/ReelKit | Reusable components + Style Profiles |
| src/Reels/edit-name | One folder per edit: plan.json, scenes.tsx, Reel.tsx |
| public/footage | Cut videos (not committed if large) |
