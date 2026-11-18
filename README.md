# mazoti.ma

Fuel price transparency for Morocco: what you pay at the pump versus what the fuel costs
to buy.

**Status:** phase 0–1 (theory and validation). No product yet.

## Why

Morocco liberalised fuel prices in December 2015. Distributors now set prices freely and
revise them every fortnight. The public sees the pump price and the headlines, but not how
it breaks down into international cost, taxes and margins, nor how quickly a fall in world
prices reaches the pump. The Competition Council publishes quarterly follow-up data, but
with a lag of several months and in PDF reports. This project turns public data into a
transparent, reproducible model and, later, a website.

## What is in this repo

| Path | Contents |
|---|---|
| `CLAUDE.md` | Rules and context for Claude and contributors |
| `docs/plan.md` | Phased roadmap, deliverables and open questions |
| `docs/theory/` | The mathematics: price structure, pass-through, data analysis |
| `docs/sources.md` | Data sources and reading list, with verification status |
| `docs/glossary.md` | FR / AR / EN vocabulary |
| `docs/decisions/` | Architecture and modelling decision records |
| `src/mazoti/` | Code: price-structure model, CC figures, inventory model, checks, site data |
| `tests/` | Tests, including the check against Competition Council figures |
| `site/` | Static showcase site (Arabic first, French, English), see below |
| `scripts/` | `build_site_data.py`: writes the site's numbers from the model |
| `data/` | Local data, not committed |

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pytest
```

## Showcase site

`site/` is a static page that shows the work so far:
- the price structure and the interactive price builder;
- the VAT effect on pass-through ratios;
- the inventory lag;
- the validation against Competition Council figures;
- the method, the roadmap and the sources.

It opens in Arabic, and French and English are one click away. There is no build step. Its
numbers come from the Python model:

```bash
python scripts/build_site_data.py   # runs the tests, then writes site/data/
python -m http.server 8765 --directory site
```

Then open <http://localhost:8765>. Rationale and limits: `docs/decisions/0004-showcase-site.md`.

## Principles

- Public data only, every figure sourced and dated.
- Estimates are labelled as estimates, with uncertainty.
- Methods and code are open so others can check and challenge them.
