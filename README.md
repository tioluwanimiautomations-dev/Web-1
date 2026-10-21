# PracticeOp website

Marketing site for PracticeOp, the intake system for US criminal defense firms. Static Astro 7 site,
built to the PracticeOp website brief of 21 October 2026.

## Run it

Needs Node 22.12 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve dist/
npx astro check  # type and template diagnostics
```

Set the real domain when building: `SITE_URL=https://your-domain npm run build`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Hero with the ratified one-liner and two example phones, the three problems, what the intake system does, control, English and Spanish, mixed-practice scope rule, pilot and resources teasers |
| `/how-it-works` | One call end to end as a pinned walkthrough, captured fields, forms and ad leads, practice management, what the firm keeps |
| `/founding-pilot` | Pilot terms, guarantee, definitions, slots. No prices anywhere |
| `/resources` | Free resources. No pitch, no email gate |
| `/about` | First-person letter from Stephen Adeniji |
| `/data-and-privacy` | The five data statements, nothing more |
| `/book` | Booking scheduler, what happens on the call, email |
| `/privacy`, `/terms` | Legal pages, pending review |

## Editing

- `src/config/site.ts`: name, description, the one CTA, contact email, booking URL, Open Graph image.
  Empty values render as visible `[PLACEHOLDER]` tags on the pages.
- `src/config/navigation.ts`: header and footer links.
- `src/styles/tokens.css`: colours (white, ink, one deep green) and type scale.
- `src/pages/*.astro`: page copy. `src/components/*Phone.astro`: the labeled example screens.

## Open placeholders

Booking URL, contact email, founding slot count (3 or 5), live practice management integrations,
free resource links, founder headshot, mailing address, privacy and terms review (plus analytics
choice, review date, liability wording), Open Graph image, domain, logo (the name is set in type
until then).

## Credits

- Base structure, layout script, SEO and fonts setup: [ST AI Agency](https://github.com/striviothemes/ST-AI-Agency)
  by StrivioThemes, MIT (see `LICENSE`).
- Pinned walkthrough motion: adapted from [Lapse](https://github.com/agnilem/lapse-astro)
  (`src/scripts/fx/step-scroll.js`) by Alex Prokhorov, MIT.
