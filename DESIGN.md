# Design

Direction: calm and exact. White pages, one deep green, the product shown as labeled example screens
instead of photography. Lead with the attorney's situation; let the example phones carry the proof.

## Tokens (`src/styles/tokens.css`)

| Role | Value | Use |
| --- | --- | --- |
| Ground | `#FFFFFF` | Every page |
| Surface | `#F2F5F3` / `#E4EBE7` | Panels, phones, inner page heroes, footer |
| Ink | `#13201B` | All running text |
| Muted | `#4A5752` | Secondary notes only (AA on white) |
| Accent | `#1E4D3B` deep green | The CTA button, active states, one statement field per page |

Type: Outfit (headings, weight 500) and Inter Tight (body), self-hosted. Five sizes: small 15px,
body 17 to 18px, lead 20 to 24px, heading 28 to 40px, display 32 to 72px.

## Rules

- One button shape (10px radius), one fill (green). One CTA label: "Book a 25-minute intake audit".
- No eyebrow labels, no gradients, no shadows at rest (the sticky header's 1px edge is the exception),
  no stock photos, no gavels or courtrooms, no fake proof.
- Sections: heading on the left, text on the right (`.split`), one green field per page for the
  statement that matters most.
- Every mockup carries an "Example" tag.
- Motion: short reveals, and one pinned walkthrough on How it works. All of it respects
  `prefers-reduced-motion`, and every page reads fully without JavaScript.

## Known deviations from the taste skill's inspector

- The ratified hero line wraps to three lines on phones; the brief fixes the wording.
- No photographs: the brief bans stock imagery, so example interface screens carry the pages.
