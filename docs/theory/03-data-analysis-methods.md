# 03 — Data analysis methods

How we turn messy public data into numbers we can defend. Read after `01` (structure) and
`02` (models). Standard econometric tests are named here without citation; their references
are listed in `../sources.md` and flagged `[from memory]` until checked.

## 1. The data problem in one picture

| Series | Frequency | Source | Latency | Notes |
|---|---|---|---|---|
| Pump price, by brand and city | fortnightly (revision on the 1st and 16th) | Press, distributor announcements, stations | days | No official open series; we must compile it |
| CIF quotation, CC definition | fortnightly (published quarterly) | CC reports | 4–7 months | Ground truth for calibration, indicative not actual |
| Purchase cost, cession price, gross margin | quarterly average | CC reports | 4–7 months | Weighted across nine firms |
| Refined-product quotations (proxy for Platts) | daily/weekly | EIA, EU Oil Bulletin, futures | 0–7 days | Platts itself is licensed; see `sources.md` |
| USD/MAD, EUR/MAD | daily | Bank Al-Maghrib reference rate | same day | Methodology and publication time changed on 2 Jan 2024 |
| Import volumes and values | monthly | Office des Changes | about 1 month | Product detail is coarse |
| TIC, VAT | event-driven | Finance laws | n/a | Fixed per-litre TIC; check each budget year |

Design consequence: **the real-time layer of the product is model-based; the CC layer is
used to calibrate and to validate, and is back-filled when new reports appear.** We must
always say which is which on screen.

## 2. Pipeline stages

1. **Ingest**: one script per source, raw files saved untouched with fetch date and URL.
2. **Harmonise**: put everything on the fortnight key $t$ (revision date). Convert units
   in one module (`pricing.py`). Align daily quotations to the window before each revision.
3. **Validate**: automatic checks (section 7). A failing check blocks publication.
4. **Model**: estimate structure (`01`) and dynamics (`02`).
5. **Quantify uncertainty**: section 5.
6. **Publish**: figures, CSV of derived data, methodology page with the exact version of
   code and data used.

## 3. Exploratory analysis before any model

- Plot each series, in levels and first differences, with revision dates marked.
- Compare fortnight changes in $\bar c_t$ and in $P_t$: scatter, sign agreement rate,
  and the share of fortnights where the pump price moved against the cost.
- Overlay candidate event dates: 1 Dec 2015 (liberalisation), 2022 shock, 23 Nov 2023
  (settlement announced), March 2026 (Middle East shock). Do not fit anything yet.
- Look at the gasoil–SSP price gap. In autumn 2026 gasoil has been priced above SSP at the
  pump `[secondary: press, Nov 2026]`, an unusual inversion given that gasoil carries
  about 1.34 MAD/L less TIC. It needs a much higher pre-tax diesel cost, which the
  structure in `01` can test directly with product-specific quotations. It is a good
  first case study.

## 4. Time-series diagnostics (before and between models)

Order matters. Each step decides which model in `02` is valid.

1. **Unit roots**: ADF and KPSS on $p_t$, $\bar c_t$, $\mu_t$. Use Zivot–Andrews when a
   break is plausible. Prices are usually I(1), margin gap $\mu_t$ should be I(0) if
   pass-through is complete in the long run.
2. **Cointegration** of $p_t$ and $\bar c_t$: Engle–Granger (two-step); Johansen for the
   system with both products; Gregory–Hansen when a break in the relation is plausible.
3. **Structural breaks**: Bai–Perron on the long-run relation and on $\mu_t$; compare with
   the event dates above. Report break dates and confidence sets, then estimate by regime.
4. **Residual checks**: autocorrelation (Ljung–Box), heteroskedasticity, outliers. Use
   Newey–West (HAC) or block bootstrap for inference. Overlapping windows induce serial
   correlation by construction.
5. **Window selection** (`01`, section 6): grid search over window length $J$ and lag, scoring by
   out-of-sample fit on the symmetric model. Report the surface, not only the argmax.

## 5. Quantifying uncertainty

We cannot observe true purchase costs, so every "gap" we publish is an interval.

### 5.1 Parameter uncertainty by simulation

Treat the unknowns as random variables with priors, then propagate:

$$d \sim \text{Uniform}(d_{\min}, d_{\max}),\quad
a_t = \bar a + \eta_t,\ \eta_t = \phi\,\eta_{t-1}+\nu_t,\quad J \sim \text{discrete},\quad
\bar m,\bar r \sim \text{reference-margin distribution}.$$

Priors for $\bar a$ come from the implied approach costs in CC tables (0.09 and 0.12 MAD/L in
Q4 2025). For each draw compute $G_t = P_t - P^{*}_t$. Publish the 10th–90th percentile band
and the share of draws with $G_t>0$. Show nothing that depends on a single draw.

### 5.2 Latent state estimation

When we want a time-varying cost wedge, use a local-level state-space model:

$$
\begin{aligned}
y_t &= P_t/(1+\tau) - \theta - \bar c_t = \mu_t &&\text{(observation, with noise)}\\
\mu_t &= \mu_{t-1} + \zeta_t &&\text{(latent margin gap, random walk)}\\
\end{aligned}
$$

and anchor it with the CC quarterly margins as sparse, more precise observations on
$m_t + a_t + r_t$. A Kalman filter or Bayesian fit gives smoothed margin paths with credible
intervals. Keep this for phase 3; start with simulation.

### 5.3 Cost corridor (bounding, no priors)

Define a lower and an upper plausible cost, $c^{\text{low}}_t = c_t + a_{\min}$ and
$c^{\text{high}}_t = c_t + a_{\max} + \text{premium}_{\max}$, with bounds justified by CC data.
If the observed price exceeds the corridor plus reference margins for several consecutive
fortnights, that is a robust signal even under the most generous cost assumptions. A single
number never carries that weight.

## 6. Descriptive transparency metrics

Computed from prices alone, so they stay valid when the cost model is questioned.

- **Synchronisation**: share of brands that revise on the same day; share changing by the
  same amount (within 0.02 MAD). Corresponds to the CC's market-structure concerns.
- **Cross-brand dispersion**: standard deviation or range of pump prices across the major
  brands in one city, per fortnight. Related to price-uniformity studies (Eckert and West).
- **Direction agreement**: fortnights where pump price rose while the cost window fell, and
  the reverse, with sizes.
- **Net-of-tax benchmark vs Europe**: $N_t = P_t/(1+\tau) - \theta$ against the EU
  Weekly Oil Bulletin "prices without taxes" (weighted EU average and selected countries),
  converted to MAD. Differences in retail costs, blending rules and quality mean the level
  gap is not a margin; the **change in the gap over time** and its behaviour around world-price
  falls are the informative parts. A reasonable first benchmark set: Spain, Portugal,
  France, EU weighted average.
- **Event study for the 2023 settlement**: interrupted time series
  $y_t = \alpha + \lambda t + \kappa\,D_t + \varepsilon_t$ with $D_t = \mathbb{1}[t\ge \text{Nov 2023}]$,
  for $y_t \in \{\mu_t, \text{PT}^{\text{adj}}, \text{AI}_4, \text{spread to EU}\}$. Exploratory only: other
  events coincide with the break, so the estimate is a description, not a causal claim.

## 7. Data quality rules (automatic checks)

1. Dates are revision dates (1st or 16th); anything else is flagged.
2. Pump prices move in multiples of 0.01 MAD; step changes above 2.5 MAD are flagged for
   manual review (real ones exist, such as +2.00 on 16 Mar 2026 `[secondary]`).
3. Two independent sources for the same fortnight must agree within 0.05 MAD, else the
   record is held back.
4. Unit sanity: $c_t$ must fall in a plausible range (for instance 2–15 MAD/L) after conversion.
5. Reconciliation: our quarterly averages of $P_t$ must land within 0.15 MAD/L of the CC's
   reported pump price average, or we investigate the series definition.
6. Every derived number stores the code version, input file hashes and fetch dates.

## 8. Nowcasting the next revision

A useful product feature and a strong external check on the model: before the 1st and 16th,
predict $\Delta P_{t+1}$ from the cost window already observed. Press reports often cite
"sources" a day or two before the change `[secondary]`; that gives a cheap out-of-sample
test.

- Baselines: zero change; last change; last window's cost change times $(1+\tau)$.
- Model: M1/M2 from `02`, estimated on an expanding window (rolling origin).
- Metrics: MAE (MAD/L), sign accuracy, share within 0.10 MAD/L. Intervals via split
  conformal prediction on rolling residuals.
- Rule: publish only if the model beats the baseline out of sample. A nowcast that fails
  this does not ship.

## 9. Sample-size reality check

About 240 fortnights from 2016 to 2026 per product, split by breaks into three or four
regimes of 50–100 observations. That supports distributed lags with 4–6 lags and
two-regime comparisons. It does **not** support rich nonlinear models unless pooled across
products. Prefer simple models, show confidence intervals, and say "not enough data to
tell" when that is the case.

## 10. Reproducibility and ethics

- Code, derived data and methodology are open. Raw licensed data (Platts) are not
  redistributed.
- Every chart carries its source, date of last update, and a one-line statement of whether it
  is observed, CC-reported or model-implied.
- Before publishing a "gap" series, send the method to an independent economist for review,
  and keep a changelog of methodological changes (ADR).
