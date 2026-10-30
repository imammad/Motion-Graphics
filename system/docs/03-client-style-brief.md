# Client Style Brief

Fill one of these per client or per new editing style. It becomes the client's Style Profile (src/ReelKit/styles/client-name.ts) and is stored as system/styles/client-name.md. Everything not listed here follows the house rules in the Style Guide.

> Fastest way: send prompt 01 with the client's reference reel(s) and brand assets. Claude watches the references frame by frame and fills this brief for you to approve.

## A. Client

| Field | Answer |
|---|---|
| Client / brand name | |
| Niche and audience | |
| Platform (Reels, TikTok, Shorts) | |
| Speaker(s) and setting (studio colour, lighting) | |
| Reference reels (links or files) | |
| What they like about the references | |
| What they never want | |
| Brand assets supplied (logo, fonts, colours, product shots) | |

## B. Captions

| Field | Reference reel value | Client value |
|---|---|---|
| Sans font + weight | Creato Display Medium | |
| Script / special font | Apple Garamond Bold Italic | |
| Regular word colour | #F3F3F3 warm white | |
| Accent (special words) | #3A7BFF | |
| Glow on special words | Yes, accent 55% | |
| Size (sans / script at 1080 wide) | 36 / 78 px | |
| Default placement | Lower half, centred | |
| Animation | Word-by-word rise + fade + blur; script letter by letter; under 1.5 s | |
| Words per line | 3 to 8 | |

## C. Paper world (full and half screens)

| Field | Reference reel value | Client value |
|---|---|---|
| Background look | White + casted shadow + grid | |
| Paper colour | #F4F2EE | |
| Grid | Thin grey, 54 px | |
| Casted shadow | Soft diagonal window panes | |
| 3-tone palette | Near-black #141414 / off-white / #3A7BFF | |
| Object style | Glossy 3D, white rounded cards, soft shadows | |
| Text on paper | Sans ink + accent script | |

## D. On-screen UI

| Field | Reference reel value | Client value |
|---|---|---|
| Card style | Dark glass, 72% black, radius 26 | |
| Scale | 75% | |
| Background treatment | Darken + blur lower half | |
| Recurring UI | 1-2-3 chapter tracker | |

## E. Motion and camera

| Field | Reference reel value | Client value |
|---|---|---|
| Easing | Fast then slow, no bounce | |
| Transitions into full screen | Circle / square reveal | |
| Camera | Track the action, slow zoom-out, snap to new angle; slow push-ins on A-roll | |
| Energy (calm / medium / high) | Medium | |
| Animations per minute | About 12 | |

## F. Approval

| Field | Answer |
|---|---|
| Test frame approved (date) | |
| Profile file | src/ReelKit/styles/client-name.ts |
| Notes for next edits | |

## How to analyse a new reference style (what Claude does in prompt 01)

1. Pull frames twice a second; make contact sheets with timestamps.
2. Write a shot list: time, line, scene type, what happens.
3. Sample exact colours from frames (background, accent, caption white).
4. Identify fonts by shape (sans: geometric / grotesk / humanist; script: serif italic / handwritten) and pick the closest free font.
5. Measure caption size and placement relative to the frame.
6. Describe motion: how words enter, easing, durations, camera moves, transitions.
7. Map every animation to the four categories and the four scene types.
8. Fill sections B to E, build one test frame per scene type, get approval.
