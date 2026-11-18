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
| `src/mazoti/` | Code (starting with the price-structure model) |
| `tests/` | Tests, including the check against Competition Council figures |
| `data/` | Local data, not committed |

## Quick start

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pytest
```

## Principles

- Public data only, every figure sourced and dated.
- Estimates are labelled as estimates, with uncertainty.
- Methods and code are open so others can check and challenge them.
