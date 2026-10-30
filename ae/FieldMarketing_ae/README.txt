FieldMarketing - Scene 4 "They booked the events." - After Effects rebuild (pilot)
==================================================================================

HOW TO RUN
1. FIRST install the fonts in fonts/ (if you skip this, all text shows in Times) (Inter-ExtraBold, Inter-Bold, Inter-SemiBold): double-click > Install. Restart AE.
2. Open After Effects 2023 or newer, File > New > New Project.
3. Keep this folder unzipped as it is. File > Scripts > Run Script File... > FieldMarketing_EventsScene_Rebuild.jsx
4. Success looks like: "Built 4 of 4 comps. No errors."
   If not, send the summary screenshot or the log file it writes to your Desktop.

WHAT YOU GET (Project panel > FieldMarketing_AE)
  00_MAIN/MAIN_FieldMarketing      the pilot timeline (scene 4 only) + DIALOGUE_MARKERS
  01_SCENES/S4_BookedTheEvents     the scene, 1920x1080, 30 fps, 135 frames
  03_PRECOMPS/PRE_Window           the app window and everything inside it
  03_PRECOMPS/PRE_Calendar_Grid    the static month grid (locked)
  05_REFERENCE                     PNG textures + the original Remotion render (GUIDE_Reference_Remotion in S4)

HOW TO CHANGE...
  ...the headline's ease:          S4 > CTRL_Headline > Rise (%) / Fade In (%) / Unblur (%) keys, in the graph editor
  ...the gap between words:        CTRL_Headline > Word Delay (frames)
  ...how far / how blurry words start: CTRL_Headline > Rise Distance (px) / Start Blur
  ...the window's entrance:        S4 > PRE_Window layer > X Position, Rotation, Opacity keys
  ...the chip bounce:              PRE_Window > Chip_1_Summit > Scale keys (chips 2 and 3 copy it)
  ...the gap between chips:        PRE_Window > CTRL_Chips > Delay (frames)
  ...when the cell turns blue:     CTRL_Chips > Tint At (%), colour = Tint Color
  ...the cursor path / timing:     PRE_Window > Cursor > X / Y Position keys
  ...the click:                    PRE_Window > CTRL_Click > Press (%) keys (squash timing), Press Depth (%),
                                   Booked checkbox key (the frame the button flips to "Booked")
  Want plain keys instead of an expression? Select the property > Animation > Keyframe Assistant >
  Convert Expression to Keyframes.

GUIDE_READ_ME layers (yellow) hold these notes inside AE. Their eye is off so they don't cover the picture: switch it on to read.
LABELS: red = controls (CTRL_), purple = driven by an expression, yellow = guides, sandstone = artwork.
CLIPPING: none needed. The window precomp's own frame clips the cursor while it is outside the window.

EASING: every move is fitted to Remotion's own spring / interpolate curves. Worst error is 1.49% of a move
(checked at every frame and 4 sub-frames). The cell tint switches on the same frame as the original.
The original render has no motion blur, so motion blur is off.

KNOWN GAPS
- Checked in a strict simulation of After Effects, not yet run in a real copy of AE.
- Shadow softness and the word blur amount convert CSS blur values to AE settings approximately.
  Compare against GUIDE_Reference_Remotion and adjust Softness / Start Blur by eye if needed.
- The background dots, glows and the "Booked" button gradient are PNGs made with the same maths as the CSS.
  Everything else is native shapes and live text.
