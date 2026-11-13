# Andon design rules

## The idea

The screen is a factory andon board: the lit sign above a production line that
shows every station's state and turns red when someone pulls the cord.
It is shown on a projector to judges standing 3 meters away. Big, calm, readable.

One bold moment only: **the line stop**. Everything else stays quiet so that
moment lands.

## Colors

Painted steel, not black. Lamp colors come from real stack lights.

```css
:root {
  --steel-900: #18222B;  /* page */
  --steel-800: #212E39;  /* panels */
  --steel-600: #3A4B59;  /* borders, idle lamps */
  --paper:     #F3EFE6;  /* main text */
  --paper-dim: #A9B4BC;  /* secondary text */
  --go:        #2FA36B;  /* pass */
  --hold:      #F2A900;  /* rework */
  --halt:      #E5372C;  /* stop */
}
```

- Color is never the only signal. Every verdict also shows its word and a shape:
  pass = filled circle, rework = triangle, stop = square.
- No gradients. No glow except on the one lit lamp of the newest event.
- No shadows. Panels are separated by a 1px `--steel-600` border.

## Type

- `Barlow Condensed` (600, 700): numbers, verdict words, the stop banner.
- `Barlow` (400, 500): everything else.
- `IBM Plex Mono` (400): diffs and code only. Never for labels.
- Load from Google Fonts with `next/font`. Fallback: `system-ui, sans-serif`.

Scale (px): 14, 16, 20, 28, 40, 72. Nothing smaller than 14.
Sentence case everywhere. No all-caps labels. No letter-spaced text.

## Layout

One page. No navigation. Fixed 16:9, built for 1440x810 and up.

```
+--------------------------------------------------------------+
| Andon          Line running          128 checks  0.19s  $0.01 |  status bar
+--------------------------------------------------------------+
|  [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [ ] [#]              |  the line
+--------------------------------+-----------------------------+
|  Selected check                |  Why                         |
|  diff (mono, red/green lines)  |  reason sentence             |
|                                |  questions with score bars   |
|                                |  facts that fired            |
+--------------------------------+-----------------------------+
```

- **Status bar.** Left: name. Middle: line state in words. Right: three stats.
- **The line.** One lamp tile per check, newest on the right, oldest falls off
  the left. Tile is 56px square, shows the shape in its verdict color. Keep the
  last 24. Click a tile to select it. Newest is selected by default.
- **Selected check.** Left: the diff. Right: the reason in 20px, then each
  question as a row: plain-words label, a horizontal bar from 0 to 1 with tick
  marks at the rework and stop thresholds, and the number.
- Everything is left-aligned.

## The line stop (the one bold moment)

When the verdict is `stop`:

1. The status bar fills with `--halt` in 200ms, left to right.
2. Middle text becomes "Line stopped" at 40px, Barlow Condensed 700.
3. Under it, the reason sentence at 20px.
4. All lamp tiles except the stopping one dim to 40% opacity.
5. A single button appears on the right: "Resume line".

Clicking "Resume line" asks for a one-line note, then restores the board.
No other animation exists in the app, except a 150ms fade when a new tile enters.
Respect `prefers-reduced-motion`: swap animations for instant changes.

## Words

Use these exact words. Do not invent synonyms.

| Thing | Word |
|---|---|
| verdicts | Pass, Rework, Stop |
| line states | Line running, Line stopped |
| resume button | Resume line |
| after resume | Line resumed |
| empty board | No checks yet. Run the agent or replay a case. |
| API down | Can't reach the gate. Check that the server is running. |

Question labels shown to people:

| ID | Label |
|---|---|
| `test_weakened` | Test checks less than before |
| `fake_test` | Test doesn't check the spec |
| `special_case` | Hard-coded for the test |
| `error_hidden` | Error hidden, not fixed |
| `check_disabled` | A check was turned off |
| `out_of_scope` | Outside the task |

## Do not

- No cards with rounded corners and soft shadows. Corners are 2px.
- No emoji. No icons library; draw the three shapes as inline SVG.
- No charts, sidebars, tabs, modals (the resume note is inline), or toasts.
- No loading spinners. Show the last known state until new data arrives.
- No light theme, no mobile layout.

## Quality floor

- Text contrast at least 4.5:1 on its background.
- Visible keyboard focus: 2px `--paper` outline.
- Tiles and the button are real `<button>` elements.
- Long diffs scroll inside their panel. The page never scrolls.
