HubBox - "A locker, pickup point, supermarket or other collection location" - After Effects rebuild
=====================================================================================================

HOW TO RUN
1. FIRST install the font in fonts/ (PlusJakartaSans-Bold.ttf): double-click > Install. Restart After Effects.
   If you'd rather use the real Satoshi Bold, install it from fontshare.com (Satoshi > Bold) before running:
   the script uses Satoshi-Bold automatically when it is installed. (Plus Jakarta Sans is what the
   Remotion render used, so it matches the reference exactly.)
2. Open After Effects 2023 or newer (needed for shared track mattes), File > New > New Project.
3. Keep this folder unzipped as it is. File > Scripts > Run Script File... > HubBox_CollectionPoints_Rebuild.jsx
4. Success looks like: "Built 7 of 7 comps. No errors."
   If not, send the summary screenshot or the log file it writes to your Desktop.

WHAT YOU GET (Project panel > HubBox_CollectionPoints_AE)
  00_MAIN/MAIN_HubBox_CollectionPoints   the line + DIALOGUE_MARKERS (VO word onsets from 0:06.00). Drop the VO in here.
  01_SCENES/S1_CollectionPoints          the animation, 1080 x 1920, 60 fps, 5.5 s (330 frames)
  03_PRECOMPS/PRE_Icon_Locker / _PickupPoint / _Supermarket / _Pin   the glyphs (vector, drawn 3x) + their own moments
  03_PRECOMPS/PRE_MapStreets             the map's streets and water
  05_REFERENCE                           PNG textures + the original Remotion render (GUIDE_Reference_Remotion in S1)

HOW THE GLASS WORKS (one set per glass shape: Card, Locker, Pickup, Supermarket, Other_1..3)
  MATTE_x       a solid copy of the shape (eye off). Several layers use it as their track matte.
  FX_Frost_x    adjustment layer with Gaussian Blur, alpha-matted to MATTE_x = the backdrop blur.
  x_Shadow      shadow only, cut out where the glass is (Alpha Inverted matte), like CSS box-shadow.
  x_Glass       9 % white fill + 1.5 px white rim.     x_Sheen   light across the top 38 %.
  Card contents (Hero_Glow, Hero_Ripple_1-6, PRE_MapStreets, Location_Pulse_1-2) are clipped by MATTE_Card.

HOW TO CHANGE...
  ...the card's wipe-in:              S1 > CTRL_Card > Reveal (%) keys (graph editor = the ease)
  ...the wipe direction / softness:   CTRL_Card > Wipe Angle, Edge Softness (%)   (badges: Circle/Icon Wipe Angle)
  ...the focus pull on the glass:     CTRL_Card (or CTRL_Locker...) > Focus Blur (px), Focus Scale (%), Focus Drop (px)
  ...when the card opens into the map: CTRL_Card > Morph (%) keys; its sizes: Width/Height/Corner Start and End (px)
  ...an icon's flight path:           CTRL_Locker / CTRL_Pickup / CTRL_Supermarket > X / Y Position keys
  ...an icon's bounce:                Icon_Locker (etc.) > Scale keys (the overshoot peaks are real keys)
  ...an icon's glow:                  CTRL_x > Glow (%) keys (pulses), Breathe (%), Breathe Speed; all: CTRL_Glass > Glow Size (%)
  ...the dock bob:                    CTRL_x > Float (px), Float Speed (0 = still); Docked (%) keys = when it bobs
  ...the backdrop blur amount:        CTRL_Glass > Frost Blur
  ...a heading:                       Heading_x > Enter (%) / Exit (%) keys, Rise (px), Lift Out (px), Start/End Blur
  ...the links drawing out:           Link_x > Contents > Link > Trim Paths > End keys
  ...the hub / its rings:             Hub_Dot / Hub_Ripple_x > Scale and Opacity keys
  ...the background drift:            CTRL_Background > Drift (%) (0 = still); each BG_Blob: Drift X/Y (px), Speed X/Y
  Want plain keys instead of an expression? Select the property > Animation > Keyframe Assistant >
  Convert Expression to Keyframes.

GUIDE_READ_ME layers (yellow) hold these notes inside AE. Their eye is off: switch it on to read.
LABELS: red = controls (CTRL_), purple = driven by an expression, aqua = mattes, yellow = guides, sandstone = artwork.

EASING: every move is fitted to Remotion's own spring / Easing curves, keys on whole frames at 60 fps. Worst error is
1.19% of a move (113 channels, checked at every frame and 4 sub-frames). Instant pops (rings appearing) are HOLD keys.
Motion blur matches the render: 180 degree shutter (comp settings and each moving layer's switch).

KNOWN GAPS
- Checked in a strict simulation of After Effects, not yet run in a real copy of AE.
- CSS blur values become AE settings approximately: Frost Blur (backdrop-filter blur 36 px), Drop Shadow softness
  (glows, card shadow) and the focus-pull blur. Compare against GUIDE_Reference_Remotion and adjust by eye.
- The glass fill is one flat 9 % white (the source fades 16 % > 5 % > 8 %), the 1.5 px inner top highlight and the
  backdrop saturation (165 %) are not rebuilt. Add Hue/Saturation to FX_Frost_x if you want the extra colour.
- Gradients with 3 colour stops (icon pink, "Location") use Gradient Ramp's 2 colours, matched where the glyphs sit.
- The gradient-wipe edge uses AE mask feather, which is a little softer at its ends than the CSS linear ramp.
- Background textures, hero glow and the hub dot are PNGs made with the same maths as the CSS. Everything else is
  native shapes and live text.
