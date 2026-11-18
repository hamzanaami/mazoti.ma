# 02 — Pass-through, asymmetry and margin dynamics

Question this document answers: **how fast and how fully do changes in the international
cost of fuel reach the Moroccan pump, and is the response the same for rises and falls?**

Tags: `[verified]` / `[secondary]` / `[to verify]` as in `01-price-structure.md`.
Method references are in `../sources.md`; items marked `[from memory]` there must have their
bibliographic details checked before we cite them in anything public.

## 1. Why this matters, and what asymmetry means

Pass-through is the share of a cost change that shows up in the price. Asymmetric price
transmission (APT), nicknamed "rockets and feathers" after Bacon (1991), means prices rise
faster than they fall. The survey by Meyer and von Cramon-Taubadel (2004) distinguishes:

- **Speed (time) asymmetry**: increases are passed on faster than decreases.
- **Magnitude (size) asymmetry**: increases are passed on in larger amounts than decreases.

In the US, Borenstein, Cameron and Gilbert (1997) found that nearly all of a crude price
rise reaches the pump within 4 weeks, while decreases take about 8 weeks, and that the
asymmetry sits mostly between wholesale and retail, not between crude and wholesale
`[verified: NBER abstract]`. Candidate causes include inventory valuation, search costs,
menu costs and market power. Asymmetry alone does **not** prove collusion. It is a
statistical pattern with several explanations, and the work is to separate them.

## 2. Setup for Morocco

Work with additive, ex-tax quantities, because the structure in `01` is additive.

- $\bar c_t$: window-averaged cost, MAD/L, excl. TIC and VAT (reference CIF).
- $p_t = P_t/(1+\tau) - \theta$: net-of-tax pump price, MAD/L.
- Margin gap: $\mu_t = p_t - \bar c_t = a + m_t + r_t$ (all non-tax, non-product components).
- Changes: $\Delta x_t = x_t - x_{t-1}$, indexed by fortnight. Split
  $\Delta \bar c_t^{+} = \max(\Delta \bar c_t, 0)$, $\Delta \bar c_t^{-} = \min(\Delta \bar c_t, 0)$.

Long-run expectation under full pass-through: $p_t = \alpha + \bar c_t$ (slope 1), with
$\alpha$ the average margin gap. A slope below 1 in levels is not partial pass-through of
the product cost, it is a sign of a misspecified or mismeasured cost variable.

## 3. Model ladder (from simplest to richest)

Build in this order. Stop climbing when the next model does not change conclusions.

### M0 — Margin descriptives (no inference)

Plot $\mu_t$ and its components, per product, with $\pm$ bands for CC-reported margins.
Count fortnights where $\mu_t$ rises while $\bar c_t$ falls. This is the first deliverable
because it needs no econometrics and is easy to explain.

### M1 — Symmetric distributed lag

$$\Delta p_t = \alpha + \sum_{k=0}^{K}\beta_k\,\Delta\bar c_{t-k} + \varepsilon_t .$$

- Cumulative pass-through at horizon $h$: $B_h = \sum_{k=0}^{h}\beta_k$. Complete when $B_h \to 1$.
- Mean adjustment lag: $\bar k = \sum_k k\,\beta_k / \sum_k \beta_k$ (in fortnights).
- Choose $K$ by information criterion, but cap it at about 4–6 fortnights given the sample.

### M2 — Asymmetric distributed lag (Houck / Wolffram split)

$$\Delta p_t = \alpha + \sum_{k=0}^{K}\big(\beta^{+}_k\,\Delta\bar c^{+}_{t-k} + \beta^{-}_k\,\Delta\bar c^{-}_{t-k}\big) + \varepsilon_t .$$

- Cumulative responses $B^{+}_h$ and $B^{-}_h$ defined as above.
- **Rocket-feather gap** at horizon $h$: $\text{AI}_h = B^{+}_h - B^{-}_h$. Under symmetry $\text{AI}_h=0$.
- Test $H_0: B^{+}_h = B^{-}_h$ for $h = 0,\dots,K$ with a Wald test and HAC standard errors.
  This is the Borenstein–Cameron–Gilbert design.

### M3 — Margin-dynamics form (the most readable one)

Model the margin gap directly:

$$\Delta\mu_t = \alpha + \sum_{k=0}^{K}\big(\delta^{+}_k\,\Delta\bar c^{+}_{t-k} + \delta^{-}_k\,\Delta\bar c^{-}_{t-k}\big) + \varepsilon_t ,
\qquad \delta_k = \beta_k - \mathbb{1}[k=0] .$$

Complete, immediate pass-through gives $\delta = 0$. Cost rises squeeze the margin
($\delta^{+}<0$); cost falls widen it ($\delta^{-}<0$ because $\Delta\bar c^{-}<0$).
Margins "widening when costs fall" is what the public debate is about, and this form
makes it a single coefficient to display. It is algebraically equivalent to M2.

### M4 — Asymmetric error correction (APT-ECM)

Step 1, long-run relation: $p_t = a_0 + b\,\bar c_t + u_t$. Step 2:

$$\Delta p_t = \sum_{k}\big(\beta^{+}_k\Delta\bar c^{+}_{t-k}+\beta^{-}_k\Delta\bar c^{-}_{t-k}\big)
+ \gamma^{+}\,u^{+}_{t-1} + \gamma^{-}\,u^{-}_{t-1} + \sum_j\phi_j\Delta p_{t-j} + \varepsilon_t,$$

with $u^{+}=\max(u,0)$ (price above its long-run level, margin fat) and $u^{-}=\min(u,0)$
(margin thin). Both $\gamma$ are expected negative (error correction). "Rockets and feathers"
corresponds to $|\gamma^{-}| > |\gamma^{+}|$: thin margins are repaired faster than fat ones are
competed away. Half-life of a deviation: $\text{HL}^{\pm} = \ln 0.5 / \ln(1+\gamma^{\pm})$ fortnights.
Test $H_0:\gamma^{+}=\gamma^{-}$.
Requires evidence of cointegration of $p_t$ and $\bar c_t$ first (see `03`).

### M5 — NARDL (nonlinear ARDL)

Partial sums $c^{\pm}_t = \sum_{j\le t}\Delta c^{\pm}_j$, then

$$\Delta p_t = \rho\,p_{t-1} + \theta^{+}c^{+}_{t-1} + \theta^{-}c^{-}_{t-1} + \sum_j(\ldots) + \varepsilon_t,$$

with long-run asymmetric multipliers $\beta^{\pm} = -\theta^{\pm}/\rho$ `[from memory: Shin, Yu and
Greenwood-Nimmo 2014]`. Use it if M4's two-step procedure is fragile, because it handles a
mix of I(0) and I(1) variables via a bounds test.

### M6 — Regime / threshold models

Asymmetry can depend on the **level** of the margin, not only the sign of the shock: the
gasoline–crude spread may have to widen a lot before the price adjusts `[secondary: Qiu and
Zhang, three-regime study]`. Candidate: a threshold error-correction model with a band
around $\mu_t = \bar\mu$ where nothing happens. Use after M4 if the data support it.

## 4. Stage-by-stage design (where does the delay arise?)

Following Borenstein et al., decompose the chain and test each link separately. Morocco's
chain is observable only partly, so we use the CC series where possible:

| Link | Observable via | Delay expected from |
|---|---|---|
| Quotation $\to$ distributor purchase cost | CC (quarterly) | Inventory valuation (WAC, `01` section 7) |
| Purchase cost $\to$ cession price | CC (quarterly) | Distributor pricing decision |
| Cession price $\to$ pump price | CC + press prices | Station margin, rounding, contracts |

If the delay is already present at the first link, it is an accounting artefact; if it
arises at the second, it is a pricing choice. The CC's Q4 2025 report shows a gasoil case
where purchase cost rose (+0.22) while the cession price fell (−0.29), a 0.51 MAD/L gap
the CC reads as partial absorption by distributors `[verified: CC Q4 2025]`. That is a
second-link finding.

## 5. What can go wrong (and how we guard against it)

1. **Wrong cost variable.** If $\bar c_t$ is not the cost distributors respond to (wrong hub,
   wrong window, different grade), the data will show spurious asymmetry or sluggishness.
   *Guard:* estimate the window by grid search on the symmetric model first, compare ARA
   proxies, report sensitivity.
2. **Prices fixed for a fortnight.** Cost is daily, price is biweekly, so contemporaneous
   regressions are mis-timed. *Guard:* regress on window averages ending before the revision
   date; never on the quotation of the revision day itself.
3. **Structural breaks.** Liberalisation (Dec 2015), the 2022 price shock, the Nov 2023
   settlement and commitments, the 2026 Middle East shock. Asymmetry tests are known to
   reject too often when breaks are ignored `[secondary: robustness study, see sources]`.
   *Guard:* test for breaks first; estimate by sub-period; report break dates, not just
   full-sample results.
4. **Small sample.** About 24 revisions a year, so roughly 250 observations since 2016 per
   product, with several breaks. Power is limited. *Guard:* pool gasoil and SSP with product
   fixed effects, use HAC or block-bootstrap inference, and **pre-register** the hypotheses below
   in an ADR before looking at the full-sample results.
5. **Coordination.** Price revisions are synchronised on the 1st and 16th, which the CC treats
   as a market-structure feature. This makes station-level price cycles (Edgeworth cycles)
   unlikely and shifts attention to **cross-brand dispersion**: how many brands move on the same
   day by the same amount (`03`, section 6).
6. **Reading too much into the result.** A significant $\text{AI}_h$ is evidence of an
   asymmetric pattern, not of intent. See the wording rules in `CLAUDE.md`.

## 6. Pre-registered hypotheses (draft)

- **H1.** After the VAT adjustment, cumulative pass-through at 4 fortnights is equal for rises
  and falls: $B^{+}_4 = B^{-}_4$ (M2), separately for gasoil and SSP.
- **H2.** Half-lives of margin repair are equal above and below the long-run margin:
  $\gamma^{+}=\gamma^{-}$ (M4).
- **H3.** The asymmetry measure $\text{AI}_4$ did not change after the November 2023
  settlement (sub-sample test, with break date fixed in advance).
- **H4.** The first-link delay (quotation to purchase cost) explains a share of the
  second-link delay that is estimable and non-zero (needs the CC fortnightly series).

## 7. Open questions

- Do CC reports publish fortnightly series (tables or charts) that we can digitise, or only
  quarterly aggregates plus quarterly sums of fortnightly changes? `[to verify]`
- Which quotation do distributors really use as reference: Platts CIF Med, ARA barges, or
  a mix by supplier? Ask the CC's published methodology and trade press.
- Is there a public source for volumes by period (needed for the WAC weight $\lambda_t$)?
  Candidates: customs and Office des Changes import tonnage; CC reports give volumes per quarter.
