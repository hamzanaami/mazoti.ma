# 01 — Price structure: from world quotation to pump price

Goal: write down, as equations, how a Moroccan pump price is built, check the equations
against the only public ground truth (Competition Council reports), and define the
quantities our tool will display.

Tags: `[verified]` checked in a primary document, `[secondary]` reported by press,
`[to verify]` assumption or from memory. Sources are in `../sources.md`.

## 1. Institutional facts the model relies on

- Prices were fully liberalised on 1 Dec 2015. Before that, the state set them with a
  formula `[secondary]`. Since then, distributors set prices; revisions happen on the
  **1st and 16th** of each month `[secondary: press 2026]`.
- Morocco imports all refined products (Samir refining stopped in 2015) `[secondary]`.
  Pump prices follow refined-product quotations (Platts), with the ARA hub
  (Amsterdam–Rotterdam–Antwerp) as a main reference, not crude oil directly
  `[verified: CC Q4 2025 report]`.
- Two taxes: the **TIC** (taxe intérieure de consommation), a fixed amount per litre
  collected at import, and **VAT** at 10% `[secondary]`. The TIC does not change when
  prices change, and VAT is charged on the value including the TIC `[secondary]`.
- The Competition Council (CC) follows nine distributors and publishes quarterly
  averages of: CIF quotation, purchase cost, cession price, gross margin, pump price
  `[verified]`. Its figures lag by several months (the Q4 2025 report was posted in
  mid-2026).

## 2. Notation

All money in MAD, volume in litres. Product $p \in \{\text{gasoil}, \text{SSP}\}$.
Period $t$ is a fortnight keyed by its revision date.

| Symbol | Meaning | Observed? |
|---|---|---|
| $Q_t$ | Reference quotation, USD per tonne (Platts CIF/ARA type) | licensed; proxies exist |
| $X_t$ | USD/MAD exchange rate | yes (Bank Al-Maghrib) |
| $d$ | density, kg/L | assumed, calibrate |
| $c_t$ | CIF cost in MAD/L, excluding TIC and VAT | derived |
| $a_t$ | approach cost: port, unloading, storage, financing, not already in CIF | latent |
| $\theta$ | TIC, MAD/L (fixed per product) | legal text |
| $w_t$ | purchase cost (distributor), incl. TIC, excl. VAT | CC (quarterly avg) |
| $m_t$ | distributor gross margin | CC (quarterly avg) |
| $r_t$ | station (retail) margin | latent |
| $\tau$ | VAT rate, 0.10 | legal text |
| $P_t$ | pump price incl. VAT | press, stations |
| $S_t$ | cession price (distributor to partner station), excl. VAT, incl. TIC | CC (quarterly avg) |

## 3. The build-up

### 3.1 Unit conversion

A tonne holds $1000/d$ litres, so

$$c_t \;=\; Q_t \cdot X_t \cdot \frac{d}{1000}.$$

Densities are not given in the CC report `[verified: not stated]`; use 0.84 kg/L for
diesel and 0.745 kg/L for 95 RON gasoline as starting values `[to verify]` and treat $d$ as
a calibration parameter (section 6).

### 3.2 Chain

$$
\begin{aligned}
w_t &= c_t + a_t + \theta &&\text{(purchase cost)}\\
S_t &= w_t + m_t &&\text{(cession price)}\\
P_t &= (S_t + r_t)\,(1+\tau) &&\text{(pump price)}
\end{aligned}
$$

Equivalently,

$$P_t = (1+\tau)\,\big(c_t + a_t + m_t + r_t\big) + (1+\tau)\,\theta .$$

The tax content of the pump price is $\theta + \tau\,\tfrac{P_t}{1+\tau}$, so the tax
*share* is $\theta/P_t + \tau/(1+\tau)$. It falls when the price rises, because $\theta$ is
fixed.

### 3.3 Margins in the CC vocabulary

- CC "gross margin per litre" $\approx S_t - w_t$ (it is weighted across companies and
  periods, so it will not equal the difference of two quarterly averages exactly).
- Station margin is not published. It is implied: $r_t = P_t/(1+\tau) - S_t$.

## 4. Validation on CC Q4 2025 `[verified numbers, secondary TIC]`

CC averages for Q4 2025 (MAD/L), TIC from press: gasoil 2.42, SSP about 3.76.

| | Gasoil | SSP |
|---|---|---|
| CIF $c$ | 5.59 | 5.12 |
| Purchase cost $w$ | 8.10 | 9.00 |
| Cession price $S$ | 9.38 | 11.06 |
| Pump price $P$ | 10.87 | 12.82 |
| **Implied** approach $a = w - c - \theta$ | **0.09** | **0.12** |
| Gross margin $S - w$ | 1.28 (CC weighted: 1.23) | 2.06 (CC weighted: 1.85) |
| $P/(1+\tau)$ | 9.88 | 11.65 |
| **Implied** station margin $r$ | **0.50** | **0.60** |
| VAT amount | 0.99 | 1.17 |
| Tax share $(\theta + \text{VAT})/P$ | 31.4% | 38.4% |

Why we trust the structure:

1. Implied approach costs are small and positive for both products, as expected when the
   CIF quotation already carries freight and insurance.
2. Implied tax shares (31% and 38%) match the shares the CC reports for Q4 2024
   (31% and 38%), which supports both the TIC amounts and "VAT on everything incl. TIC".
3. Implied station margins (about 0.5–0.6 MAD/L) are plausible for retail.

What it does not prove: that the CIF in the CC report equals what distributors actually
paid. The CC itself calls its CIF series indicative and theoretical.

Reproduced in `tests/test_pricing.py`.

## 5. Pass-through arithmetic: the VAT trap

Differentiate the chain with margins and $a$ held fixed:

$$\frac{\partial P_t}{\partial c_t} = 1+\tau = 1.10 .$$

So if the ex-tax CIF rises by $\Delta c$, a **complete** pass-through raises the pump price
by $1.10\,\Delta c$, not $\Delta c$. The CC compares the pump-price change (incl. VAT)
with the CIF change (excl. VAT) `[verified: CC Q4 2025 describes both series; the
treatment of VAT in the ratio is inferred from the reported 69.5%]`. Define:

$$\text{PT}^{\text{raw}} = \frac{\Delta P}{\Delta c}, \qquad
\text{PT}^{\text{adj}} = \frac{\Delta P}{(1+\tau)\,\Delta c}.$$

Worked check with the CC's early-March 2026 episode `[secondary: press report of CC]`:

| | $\Delta c$ | $\Delta P$ | $\text{PT}^{\text{raw}}$ | $\text{PT}^{\text{adj}}$ |
|---|---|---|---|---|
| Diesel | +2.92 | +2.03 | 69.5% | **63.2%** |
| Gasoline | +1.26 | +1.43 | 113.5% | **103.2%** |

The adjustment lowers the diesel rate by about 6 points and turns the gasoline "above
100%" into roughly full pass-through. **Hypothesis to confirm** by reading the CC's
methodology note: that the published ratio is on a TTC pump price versus an HT CIF.
If so, our tool should show both and explain the difference. This is exactly the kind
of detail a transparency tool must get right.

## 6. Unknowns to calibrate

1. **Density** $d$ per product (affects only the level of $c$; affects pass-through
   ratios not at all).
2. **Approach cost** $a_t$: estimated 0.09–0.12 MAD/L in Q4 2025. Check its stability
   over several quarters; if it moves with freight rates, model it explicitly.
3. **Which quotation and which window.** Prices change only every fortnight while
   quotations move daily. The relevant regressor is a window average
   $\bar c_t = \sum_{j=0}^{J} \omega_j\, c_{s_t - j}$ where $s_t$ is the last day of the
   observation window before revision $t$. Estimate $J$ and the weights $\omega$ by grid search (see
   `03-data-analysis-methods.md`). The old administered formula used a fortnightly
   average `[to verify]`.
4. **Product definition**: gasoil 10 ppm vs 50 ppm, SSP 95 vs 98, Platts hub (ARA vs
   Mediterranean). The CC says ARA is "a main reference".

## 7. Purchase cost lags the market: inventories

Distributors hold stock (the legal minimum is 60 days of consumption; observed
coverage has been well below that at times `[secondary]`). The CC's purchase cost is a
**weighted average that includes stock variations** `[verified]`, so it responds to
quotation changes with a delay. A minimal model, weighted-average-cost (WAC):

$$A_t = (1-\lambda_t)\,A_{t-1} + \lambda_t\,(c_t + a_t + \theta),
\qquad \lambda_t = \frac{I_t}{S^{\text{stock}}_{t-1} + I_t},$$

where $I_t$ is the volume imported in the period and $S^{\text{stock}}$ the opening stock.
With roughly constant volumes and $D$ days of stock, $\lambda \approx 15/(D+15)$ per
fortnight (30 days of stock gives $\lambda \approx 1/3$).

This gives two distinct margins, and mixing them up is a classic source of confusion:

| | Definition | What it answers |
|---|---|---|
| Historical-cost margin $m^H_t$ | $S_t - A_t$ | What the company's books show (CC type) |
| Replacement-cost margin $m^R_t$ | $S_t - (c_t + a_t + \theta)$ | What the company earns if it had to rebuy today |
| Inventory gain | $m^H_t - m^R_t = (c_t + a_t + \theta) - A_t$ | Positive when costs have been rising |

Consequence: when world prices fall, $A_t$ stays above $c_t + a_t + \theta$ for a while, so
the historical-cost margin is squeezed even if replacement-cost margins are fat. That
is the distributors' standard defence of slow pass-through. When prices rise, the
reverse holds. A fair tool must show both and not mislabel one as the other.

## 8. Quantities the product will display

| Quantity | Formula | Honest caveat |
|---|---|---|
| Pump price waterfall | $c,\ a,\ \theta,\ m,\ r,\ \text{VAT}$ | $a, r$ implied; $m$ is CC quarterly |
| Net-of-tax pump price | $N_t = P_t/(1+\tau) - \theta$ | Comparable across countries (see EU Oil Bulletin) |
| Cost-reflective reference price | $P^*_t = (1+\tau)(c_t + \hat a + \bar m + \bar r + \theta)$ | $\bar m, \bar r$ are reference margins we must justify |
| Model-implied gap | $G_t = P_t - P^*_t$ | An interval, not a point |
| Pass-through to date | $\text{PT}^{\text{adj}}$ over a window | Needs a window convention |

The choice of reference margins $\bar m, \bar r$ is a normative decision. Options: the
CC's own margin series, the median of EU net-of-tax spreads, or the margins implied by
the pre-2015 administered formula `[to verify: legacy structure]`. See ADR-0002 (to write).
