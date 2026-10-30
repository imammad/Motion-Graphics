"""Package .claude/skills/mgskill as system/skills/mgskill.skill (installable in Claude).

    python3 system/package_skill.py
"""
import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAME = "mgskill"
SRC = os.path.join(ROOT, ".claude", "skills", NAME)
OUT = os.path.join(ROOT, "system", "skills", f"{NAME}.skill")  # a .skill file is a zip

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for base, _, files in os.walk(SRC):
        for f in sorted(files):
            path = os.path.join(base, f)
            z.write(path, os.path.join(NAME, os.path.relpath(path, SRC)))
print("wrote", os.path.relpath(OUT, ROOT), f"({os.path.getsize(OUT) // 1024} KB)")
