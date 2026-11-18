# data/reference: figures published by the Competition Council (CC)

Small, public, citable tables that the model is checked against. Unlike `data/raw/` (large or
licensed downloads, not committed), these are transcriptions of published figures, each row
with a `source_id` that resolves in `sources_manifest.csv`.

**Status of every row: `secondary`.** The sandbox that built this cannot download the PDFs
(its network allowlist blocks the CC site), so the tables were read through a web-fetch text
extraction of each PDF, not from the PDFs themselves. Values read from chart labels (all
fortnightly levels) were matched to series by order and by the report text. Verify against
the PDF before publishing any figure; `tests/test_reference_data.py` catches internal
inconsistencies but not a consistent misreading.

Retrieved 2026-11-18. Units: MAD per litre unless a column or `unit` says otherwise.
`ssp` is the CC's *essence* (super sans plomb); `gasoil` is diesel.

## Files

| File | Contents |
|---|---|
| `sources_manifest.csv` | The 10 documents used: id, title, URL, period, CC report number |
| `cc_quarterly_averages.csv` | Q1 2024 to Q4 2025: average CIF, purchase cost (HT), cession price (HT), pump price (TTC), weighted gross margin |
| `cc_fortnightly_levels.csv` | 8 quarters x 2 products x 6 fortnights: CIF, pump TTC, purchase cost, cession price, gross margin (period_start = 1st or 16th) |
| `cc_fortnightly_variations.csv` | The CC's fortnightly variation tables (CIF and pump TTC), with the printed quarter sums |
| `cc_other_figures.csv` | Sales volumes and values, imports, TIC/TVA receipts, annual gross and net margins, 2023 annual averages (long format) |
| `cc_2023_fortnightly.csv` | 2023, 24 fortnights: CIF, purchase cost, **pump price HT** (not TTC), and their variations |
| `cc_2023_monthly_gross_margins.csv` | 2023 monthly weighted gross margins |
| `cc_note3_2026_fortnightly_changes.csv` | CC note of 1 Jun 2026: fortnightly CIF and pump changes, 1 Mar to 16 May 2026 |

## Conventions and traps

- **Pump price basis:** 2024 and 2025 reports give pump prices TTC (VAT included). The 2023
  analysis gives pump prices HT. Do not splice them without converting (TTC = HT x 1.10).
- **Fortnight labels:** `1Q` = first fortnight (1st to 15th), `2Q` = second (16th to month end).
  `period_start` is the first day of the fortnight.
- **Gross margin is not cession minus cost.** The CC weights by company and fortnight. The gap
  reaches about 0.3 MAD/L in the CC's own tables (Q1 2024 gasoil and essence, Q4 2025 essence).
- **Missing series.** Fortnightly gross margins for Q3 2025 were not extracted. Pump price
  quarterly averages are missing for Q2 2024, Q3 2024 and Q1 2024 gasoil (they are not in the
  text); the fortnightly pump levels are complete.
- **Variations** are the CC's printed numbers, rounded to 0.01, so a sum of cells can differ
  from the printed sum by 0.01. The first fortnight of a report's first quarter is "-" in
  Q1 and Q2 2024.

## Discrepancies inside the CC documents (kept, flagged)

| Where | What |
|---|---|
| Q1 2024, essence pump average | Text says 14.77; the six fortnightly levels average 14.62 and 14.77 is the 1Q-Jul-2024 level. Row flagged `TO VERIFY` in `note`. |
| Q1 2024, gasoil pump variation | Printed quarter sum (-0.21) includes the unprinted 1Q-Jan change; the cells sum to -0.38 and the levels agree. |
| Q4 2024 | Text gives gasoil cession 9.97 and essence cost 9.94; Tableau 4 gives 9.94 and 9.97. The table values are used. |
| Annual 2024 gross margin | Q4 2024 report: 1.35 / 1.88 (gasoil / essence). Q1 2025 report conclusion: 1.34 / 1.85. Both kept. |
| Q2 2024 sales value, nine companies | Q2 2024 report: 15 637 / 3 310 MDH (chart in thousand DH). Q2 2025 report restates Q2 2024 as 16 377 / 3 430. Both kept. |
| Q3 2024 imports value | Text gives 12.9 MMDH in one place and 14.03 MMDH (the Q2 figure) in the conclusion. 12.9 used. |
| Q3 2024 gasoil gross margin | Text says 1.46 by end of September; last chart label is 1.42. Series assigned by the min/max in the text. |
| Q4 2024 gasoil gross margin | Text puts the maximum (1.46) in 2Q-Dec; chart order puts it in 1Q-Dec. |
| Q2 2024 essence | Chart for cost and cession has no series labels; assigned from the text. |
| 1 Mar to 16 May 2026 note | The note states no pass-through rate and no spread for the two March essence fortnights. |

## Possible correction elsewhere in the repo

`src/mazoti/cc_reports.py`, `docs/theory/01-price-structure.md`, the LaTeX document and the
showcase site label the +2.92 CIF / +2.03 pump episode (diesel; gasoline +1.26 / +1.43) as
"early March 2026", following press reports. In the CC's own note of 1 Jun 2026 these figures
are the **second half of March 2026** (`cc_note3_2026_fortnightly_changes.csv`); the first half
of March was +0.21 CIF / +0.39 pump for diesel. 2.03 / 2.92 = 69.5% matches the reported rate.
Not changed here because it touches the published site texts; decide and relabel together.

## Not found (needs the PDFs or another source)

Gasoil pump prices for Q1 2024 (quarterly); 2022 and earlier CIF, cost and cession series;
cession prices in the 2023 analysis; fortnightly data before 2023; per-company margins;
the CC's "weekly" or daily series, if any exist.

## Check

```bash
pytest tests/test_reference_data.py
```
