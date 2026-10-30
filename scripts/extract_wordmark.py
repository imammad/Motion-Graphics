"""Pulls white-on-purple alpha mattes of the wordmark and "IAM" from the 4K end
card frame (argv[1]) into the brand folder (argv[2])."""
import sys

import numpy as np
from PIL import Image

frame = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(float)


def cut(x0, x1, y0, y1, name):
    alpha = np.clip((frame[y0:y1, x0:x1].min(2) - 45) / (230 - 45), 0, 1)
    out = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = (alpha * 255).round()
    Image.fromarray(out).save(f"{sys.argv[2]}/{name}")


cut(1188, 2368, 926, 1240, "wordmark.png")
cut(2438, 2884, 926, 1240, "iam.png")
