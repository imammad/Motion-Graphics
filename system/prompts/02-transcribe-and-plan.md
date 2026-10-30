# 02 · Transcribe + planning page

Use when: you have the cut video (you did the cutting). Put it in public/footage/[client]/[edit]/cut.mp4 first.

```
Use the viral-talking-head-editor skill. Client: [CLIENT] (style profile: [client-name]). New edit: [EDIT NAME].

The cut video is at public/footage/[client]/[edit]/cut.mp4. Do not cut anything; the cut is final.
1. Make a word-level transcript with tools/transcribe.py (word, start, end in seconds) and save it to src/Reels/[edit]/transcript.json.
2. Group the words into caption lines of 3 to 8 words, one idea per line. For each line suggest the special word(s) and a scene type, following the style guide's rhythm rules. Save that as the planner seed: src/Reels/[edit]/plan.json.
3. Tell me to open planner/index.html, load that plan.json and fill in my plan. Don't build anything yet.
```
