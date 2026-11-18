# Plan of attack

Principle: **theory first, then validate on numbers we can check, then data pipeline, then
product.** Each phase has a deliverable and an exit test. Sizes are relative effort
(S: days, M: 1–2 weeks, L: several weeks), not promises.

Status as of 18 Nov 2026: phase 0 done, phase 1 started (see "Already done").

## Phase 0 — Foundations (S) — done

- Repo, `CLAUDE.md`, README, tooling.
- Theory notes: `docs/theory/01`, `02`, `03`.
- Annotated sources: `docs/sources.md`.
- Price-structure model with tests against Competition Council (CC) Q4 2025 figures.

## Phase 1 — Theory and validation (M) — start here

**Goal:** show that our equations reproduce what the CC reports, across several quarters, and
find out how stable the unknown parts (approach cost, station margin) are.

| # | Task | Output |
|---|---|---|
| 1.1 | Read the CC methodology end to end. Settle: VAT treatment in pass-through ratios, density used, definition of purchase cost, whether fortnightly series are published | Notes in `docs/theory/01` (section 5–6 updated) |
| 1.2 | Digitise the CC tables from all follow-up reports (Q4 2023 or earliest through Q4 2025, and later ones as they appear) into `data/` as CSV, with page references | `cc_quarterly.csv` (git-ignored; script and schema in repo) |
| 1.3 | Open the finance-law and customs texts for TIC per product and effective dates | Updated `constants.py`, status moved from `secondary` to `verified` |
| 1.4 | Run the section-4 check of `01` on every quarter: implied approach cost, station margin, tax share | Table and plot; stability within about ±0.15 MAD/L is the target |
| 1.5 | Write ADR-0002 on **reference margins** ($\bar m$, $\bar r$): which benchmark we use and why | `docs/decisions/0002-...` |
| 1.6 | Write ADR-0003 pre-registering hypotheses H1–H4 of `02` | `docs/decisions/0003-...` |

**Exit test:** the structure reproduces CC pump price, cession price and tax shares within the
tolerances in 1.4 for every available quarter, or we know exactly which quarter breaks and why.

## Phase 2 — Data (L)

**Goal:** a reproducible dataset covering Dec 2015 to today at fortnight frequency.

| # | Task | Notes |
|---|---|---|
| 2.1 | Pump price history, per brand and a reference city | Compile from press archives and distributor announcements; two sources per fortnight; checks from `03` section 7 |
| 2.2 | Cost proxy | Compare EIA hubs, EU Oil Bulletin Rotterdam quotations and futures against the CC's CIF series; pick on fit, not on convenience |
| 2.3 | FX series | Bank Al-Maghrib reference rates; handle the 2 Jan 2024 methodology change |
| 2.4 | Volumes and stocks | CC quarterly volumes, Office des Changes imports; stock days are patchy, treat as scenario input |
| 2.5 | Pipeline | One ingestion script per source, raw files stored with URL and fetch date, scheduled refresh (GitHub Actions is enough) |
| 2.6 | EU benchmark | Oil Bulletin net-of-tax series converted to MAD |

**Exit test:** our quarterly averages reconcile to CC averages (pump price within 0.15 MAD/L) and
the cost proxy tracks the CC's CIF changes (target: correlation of fortnightly changes above 0.95,
mean absolute difference below 0.10 MAD/L). Targets are proposals; revise after seeing the data.

## Phase 3 — Models (L)

Climb the ladder in `02` and stop when the next model does not change the conclusions.

1. M0 margin descriptives and the gasoil/SSP inversion case study (`03`, section 3).
2. Window selection, then M1 and M2 with HAC inference, per product and pooled.
3. Breaks (2015, 2022, Nov 2023, 2026) and sub-sample estimates.
4. M3 and M4 if cointegration holds; M5/M6 only if needed.
5. Uncertainty: simulation bands first (`03` 5.1), then state-space.
6. Nowcast of the next revision, shipped only if it beats the baseline out of sample.

**Exit test:** every published number comes with an interval, a data vintage and a code version;
an outside economist has read the methodology.

## Phase 4 — MVP product (L)

Build only after phase 3 has something worth showing. Proposed shape, to confirm after phase 2:

- **Home:** current pump price per fuel, with the waterfall (cost, TIC, margins, VAT) and a plain-language
  label for each part: observed, CC-reported, or model-implied.
- **History:** price vs cost over time; margin gap with its band; pass-through of the latest moves.
- **Next revision:** nowcast with interval, once validated.
- **Methodology and data:** full methods, downloadable CSV, change log.
- Languages: Arabic (RTL), French, English. Mobile first.
- Stack suggestion (decide in an ADR): Python for analysis, Parquet/DuckDB for data, static site
  generated from the pipeline output (for example Astro or Next.js) on a static host, so there is no
  server to run. Refresh by scheduled job each fortnight and on quotation updates.

## Phase 5 — Extensions (later)

Station-level prices, user-submitted prices, alerts at each revision, per-trip or per-fleet cost
calculators, other products (butane, fuel oil), a public API, and an explainer series with partners
(journalists, consumer groups, academics).

## Risks

| Risk | Mitigation |
|---|---|
| True purchase costs are unobservable, so "gap" can be mistaken for accusation | Intervals, wording rules in `CLAUDE.md`, methodology first, independent review before launch |
| CC data lag 4–7 months | Real-time layer is explicitly model-based; back-fill and re-validate on each new report |
| Free price proxies differ from Platts | Calibrate on CC CIF; publish proxy error; sensitivity analysis |
| Small sample and structural breaks | Simple models, pooled estimation, honest "cannot tell" |
| No open price data | Our own compiled series with two-source rule; invite corrections |
| Legal and reputational exposure | Public data only, no claims about intent, legal read-through before launch |
| Name clash with Mazote.ma (2016 comparator) | Check name and domain early; see decisions below |

## Decisions I need from you

1. **Audience and tone:** general public explainer, journalists and researchers, or both? This sets
   how much of the model the front page shows.
2. **Languages at launch:** Arabic, French, English, or a subset.
3. **Name:** "mazoti.ma" is very close to the existing Mazote.ma comparator; keep it, or choose a
   name that differs?
4. **Licence:** open code (MIT or Apache-2.0) and open data (for example CC BY), or something more
   restrictive. I have not added a LICENSE file yet.
5. **Who reviews the methodology?** An economist, statistician or journalist with domain knowledge
   would add credibility before launch.

## Already done in this repo

- Price-structure model and tests (`src/mazoti/pricing.py`, `tests/test_pricing.py`): reproduces CC Q4 2025
  gross margins (1.28 and 2.06 vs CC weighted 1.23 and 1.85), tax shares (31.4% and 38.4%) and implies
  small positive approach costs (0.09 and 0.12 MAD/L).
- Finding to confirm in task 1.1: the CC's pass-through ratio (pump price incl. VAT over CIF excl. VAT)
  appears to overstate the VAT-free picture by 10%. Diesel 69.5% becomes about 63%, gasoline 113% becomes
  about 103%.
