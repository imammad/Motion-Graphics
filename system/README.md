# Motion Graphics System: start here

A repeatable system for editing 9:16 talking-head reels with Claude + Remotion, trained on the "viral talking-head" style (two-font captions, dark-glass on-screen UI, half/full-screen paper-world animations). You do the cutting and sound design; Claude does everything else.

## What's in here

| Path | What it is |
|---|---|
| `pdf/01-Style-Guide.pdf` | The visual training: captions, hook, scene types, animation build steps, on-screen UI, shot list of the reference reel, checklist |
| `pdf/02-Workflow-Playbook.pdf` | Step by step from cut video to final render |
| `pdf/03-Client-Style-Brief.pdf` | Fill one per client / per new style |
| `pdf/04-Prompt-Library.pdf` | All prompts in one place |
| `prompts/` | The same prompts as copy-paste files (00 to 05) |
| `docs/` | Markdown sources of the PDFs (edit these, then rebuild) |
| `styles/` | One filled-in Client Style Brief per client |
| `references/` | Reference reel frames, guide frames, 219 inspiration images |
| `../.claude/skills/mgskill/` | The knowledge skill: all motion graphics craft, any style, any single scene. Portable |
| `skills/mgskill.zip` | The same skill packaged for claude.ai upload |
| `../.claude/skills/viral-talking-head-editor/` | The reel workflow skill (planner → build → render) for this repo |
| `../planner/index.html` | The planning page (open in a browser) |
| `../tools/transcribe.py` | Word-level transcript + planner seed from your cut video |
| `../src/ReelKit/` | Reusable Remotion components + style profiles |
| `../src/Reels/` | One folder per edit (see `Demo/`) |

## Every edit, in short

1. Cut the video yourself → `public/footage/<client>/<edit>/cut.mp4`.
2. Prompt 02 → Claude transcribes and seeds the plan.
3. Open `planner/index.html`, load the plan, choose a scene type + write notes per line, export `plan.json`.
4. Prompt 03 → Claude builds every animation and renders a preview.
5. Prompt 04 for changes, prompt 05 for the final render. Add your sound design.

New client? Run prompt 01 first, once.

## The mgskill skill (use it anywhere)

It holds the knowledge, not one look. Styles are plug-ins: add your client briefs as `.claude/skills/mgskill/styles/<client>.md` (copy `_template.md`). Then in any chat: "Use mgskill: a full-screen animation for 'engagement grew 3.4x' in the dark-saas style" builds just that scene in that style.

- **This repo (Claude Code):** loads automatically.
- **Every project on your computer:** copy the folder to `~/.claude/skills/mgskill/`.
- **claude.ai:** upload `system/skills/mgskill.zip` in Settings, in the Skills section (skills must be enabled for your account). Re-zip after adding briefs: `python3 system/package_skill.py`.

## Rebuild the PDFs after editing the docs

```bash
python3 system/build_pdfs.py
```
