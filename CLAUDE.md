# CLAUDE.md — mazoti.ma

Guidance for Claude (and any contributor) working in this repository.

## What this project is

mazoti.ma is a transparency tool for fuel prices in Morocco. It tracks pump prices
for gasoil (diesel) and super sans plomb (SSP gasoline) and compares them with what
the product costs to buy, so the public can see how much of the pump price is
international market cost, tax, and margin.

Context: Morocco fully liberalised fuel prices on 1 Dec 2015. Since then distributors
set prices freely, revised on the 1st and 16th of each month. The country has imported
all of its refined products since the Samir refinery stopped. Distributors' margins and
how fast they pass international price drops through to the pump are matters of public
debate. In Nov 2023 the Competition Council settled with nine distributors for
1.84 bn MAD and now publishes quarterly follow-up reports.

## Working order (do not skip ahead)

1. **Theory first**: price structure maths, pass-through and asymmetry models, data
   analysis methods. Lives in `docs/theory/`.
2. **Validate on known numbers**: the model must reproduce the Competition Council's
   published figures before we trust it on anything else.
3. **Data pipeline**, then **models**, then **product (web/app)**.

The roadmap is in `docs/plan.md`. Sources and their verification status are in
`docs/sources.md`.

## Hard rules

- **Never present an estimate as an accounting fact.** True purchase costs are not
  public. Everything we compute from public quotations is a *model-implied* figure
  with an uncertainty range. Use wording like "model-implied gap", never
  "overcharge", "profiteering" or any accusation about a named company.
- **Every number needs a source and a date.** Hard-coded constants (TIC amounts, VAT
  rate, densities) live in `src/mazoti/constants.py`-style config with a source URL and
  an "as of" date, not scattered in code.
- **Units are explicit.** Money is MAD, volume is litre, mass is tonne. Name variables
  with units (`cif_mad_per_l`, `quote_usd_per_t`). Convert in one place only.
- **Mark verification status.** In docs, tag facts as `[verified]`, `[secondary]`
  (reported by press, not checked against the primary text) or `[to verify]`.
  Do not upgrade a tag without opening the primary source.
- **Do not copy copyrighted text.** Paraphrase press and report content; keep quotes
  short. Platts data is licensed: do not commit or redistribute raw Platts series.
  Use free proxies (see `docs/sources.md`) or derived, aggregated values we are allowed
  to publish.
- **Do not commit secrets or large raw data.** `data/raw/` and `data/processed/` are
  git-ignored except `.gitkeep`. Document how to rebuild them instead.

## Conventions

- Language: Python 3.11+ for analysis (`pandas`, `statsmodels`, `numpy`). Tests with
  `pytest`. Format with `ruff`.
- Docs are Markdown. English is the working language. User-facing product text will be
  Arabic, French and English; keep a FR/AR glossary in `docs/glossary.md`.
- Dates: ISO 8601. The Moroccan price calendar uses fortnights; the code uses the
  revision date (1st or 16th) as the period key.
- Prefer small, tested functions in `src/mazoti/`. Notebooks go in `notebooks/` and must
  not hold logic that is not also in `src/`.
- Every modelling decision that changes results gets a short ADR in `docs/decisions/`.

## Commands

```bash
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pytest            # the price-structure model must reproduce the CC Q4 2025 check
ruff check .
python scripts/build_site_data.py   # regenerate site/data/ after changing constants or CC figures
```

## Key facts to keep straight

- Pump price = (cost of product + TIC + distributor and station margins) x (1 + VAT).
- TIC (taxe intérieure de consommation) is a fixed MAD per litre, so it does not move
  with oil prices. VAT is 10% and is applied on everything, including the TIC.
- Because VAT multiplies the cost, a full pass-through of a MAD 1/L change in the
  ex-tax cost is MAD 1.10/L at the pump. Compare like with like.
- The Competition Council's "cession price" is what distributors charge partner
  stations (excl. VAT). Station margin comes on top. See `docs/theory/01-price-structure.md`.
- Prior art exists (Mazote.ma comparator, 2016; government app Mahatati, 2018). Our
  angle is cost-vs-price transparency, not station-by-station comparison.
