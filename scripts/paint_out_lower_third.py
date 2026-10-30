"""Inpaints the white lower-third text that crosses into the 9:16 crop of the
opening shot (frames 9+), so the vertical lower third can replace it."""
import glob
import sys

import cv2
import numpy as np

for path in sorted(glob.glob(sys.argv[1] + "/f_*.png")):
    index = int(path[-7:-4]) - 1
    if index < 9:
        continue
    im = cv2.imread(path)
    y0, y1, x0, x1 = 1820, 1935, 0, 300
    text = (im[y0:y1, x0:x1].min(2) > 105).astype(np.uint8) * 255
    mask = np.zeros(im.shape[:2], np.uint8)
    mask[y0:y1, x0:x1] = cv2.dilate(text, np.ones((7, 7), np.uint8))
    cv2.imwrite(path, cv2.inpaint(im, mask, 9, cv2.INPAINT_TELEA))
