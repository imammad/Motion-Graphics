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
| `../.claude/skills/viral-talking-head-editor/` | The skill: Claude Code loads it automatically in this repo |
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

## Rebuild the PDFs after editing the docs

```bash
python3 system/build_pdfs.py
```
