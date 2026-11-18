# ADR-0004: A static showcase site for phases 0–1

- Status: accepted
- Date: 2026-11-18

(ADR-0002 and ADR-0003 are reserved in `docs/plan.md` for reference margins and pre-registered
hypotheses.)

## Context

The roadmap puts the public product in phase 4, after the data and the models. In the meantime the
project needs a way to show its work so far: the price structure, the validation against Competition
Council (CC) figures, the method and the roadmap. It must not look like the phase-4 product. There
is no time-series data yet, and ADR-0001 forbids publishing numbers we cannot defend.

## Decision

1. **A plain static site in `site/`:** HTML, CSS and JavaScript, with no build step and no Node
   toolchain. It runs from any static host or from `python -m http.server`. KaTeX (equations) and
   the IBM Plex Sans Arabic font load from public CDNs. The page still works without them, using
   plain-text equations and system fonts.
2. **Numbers come from the Python model, never retyped:**
   - `src/mazoti/site_data.py` builds the payload, with source, status and date on every value.
   - `scripts/build_site_data.py` runs the tests first and refuses to write if they fail. It then
     writes `site/data/site_data.json` and `site_data.js`. Both are derived and safe to commit.
   - CC figures now live in `src/mazoti/cc_reports.py`, shared by the tests and the site.
   - The plausibility bounds live in `src/mazoti/validation.py`, also shared.
3. **The JavaScript copy is checked against Python:** the interactive parts need the formulas in
   the browser (`site/js/model.js`). On every load the page replays the reference cases that
   Python exported and shows whether they match.
4. **Every figure carries a visible label:**
   - CC-reported;
   - model-implied;
   - press or legal text;
   - illustrative.

   The inventory simulation uses a made-up cost path and is labelled illustrative. No section
   shows a "gap" figure: that needs the reference margins of ADR-0002.
5. **Languages:** Arabic first (right to left, the default), with French and English one click
   away. The layout uses logical CSS properties so one stylesheet serves both directions. Numeric
   chart axes stay left to right in every language; bars and the waterfall mirror in Arabic.
   Arabic and French text need review by native speakers before any public launch.

## Consequences

- Anyone can see the work without installing Python. Contributors rebuild the data with one
  command.
- A change to a constant or a CC figure reaches the site only after a rebuild. A stale
  `site_data.js` is possible, but its generation date and test run are shown in the footer and
  the validation section.
- This site is not the phase-4 product. That one still needs its own stack decision once the
  data pipeline exists (see `docs/plan.md`, phase 4).
