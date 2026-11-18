"""Generate every number, table and plot-data file used in mazoti_theory.tex.

Run from the repo root:
    PYTHONPATH=src python3 docs/latex/make_examples.py

Outputs go to docs/latex/generated/. Nothing in the LaTeX document is typed by hand
if it can be computed here, so the text cannot drift from the code.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import statsmodels.api as sm

from mazoti.constants import TIC_GASOIL_MAD_PER_L, TIC_SSP_MAD_PER_L
from mazoti.pricing import decompose, pass_through_rate

OUT = Path(__file__).parent / "generated"
OUT.mkdir(exist_ok=True)


def write(name: str, text: str) -> None:
    (OUT / name).write_text(text)


# ---------------------------------------------------------------------------
# 1. Competition Council Q4 2025 decomposition (section: price structure)
# ---------------------------------------------------------------------------
CC = {
    "Gasoil": dict(cif=5.59, purchase_cost=8.10, cession_price=9.38, pump=10.87,
                   tic=TIC_GASOIL_MAD_PER_L.value, gm_cc=1.23),
    "SSP": dict(cif=5.12, purchase_cost=9.00, cession_price=11.06, pump=12.82,
                tic=TIC_SSP_MAD_PER_L.value, gm_cc=1.85),
}
rows, bars = [], []
for name, v in CC.items():
    s = decompose(v["cif"], v["purchase_cost"], v["cession_price"], v["pump"], v["tic"])
    rows.append((name, v, s))
    bars.append((name, s))

lines = []
lines.append(r"\begin{tabular}{lrr}")
lines.append(r"\toprule")
lines.append(r"& Gasoil & SSP \\")
lines.append(r"\midrule")
def row(label, f):
    return label + " & " + " & ".join(f(v, s) for _, v, s in rows) + r" \\"
lines.append(row(r"CIF quotation $c$ (CC)", lambda v, s: f"{v['cif']:.2f}"))
lines.append(row(r"Purchase cost $w$ (CC)", lambda v, s: f"{v['purchase_cost']:.2f}"))
lines.append(row(r"Cession price $S$ (CC)", lambda v, s: f"{v['cession_price']:.2f}"))
lines.append(row(r"Pump price $P$ (CC)", lambda v, s: f"{v['pump']:.2f}"))
lines.append(row(r"TIC $\theta$ (press)", lambda v, s: f"{v['tic']:.2f}"))
lines.append(r"\midrule")
lines.append(row(r"Implied approach cost $a = w - c - \theta$", lambda v, s: f"{s.approach:.2f}"))
lines.append(row(r"Gross margin $m = S - w$", lambda v, s: f"{s.gross_margin:.2f}"))
lines.append(row(r"\quad (CC weighted figure)", lambda v, s: f"{v['gm_cc']:.2f}"))
lines.append(row(r"$P/(1+\tau)$", lambda v, s: f"{v['pump'] / 1.10:.3f}"))
lines.append(row(r"Implied station margin $r$", lambda v, s: f"{s.station_margin:.2f}"))
lines.append(row(r"VAT amount", lambda v, s: f"{s.vat:.2f}"))
lines.append(row(r"Tax share $(\theta+\mathrm{VAT})/P$",
                 lambda v, s: f"{100 * s.tax_share:.1f}\\%"))
lines.append(r"\bottomrule")
lines.append(r"\end{tabular}")
write("cc_table.tex", "\n".join(lines))

# data for a stacked bar chart (pgfplots), MAD per litre
hdr = "product cif approach tic gross station vat\n"
body = "".join(
    f"{n} {s.cif:.4f} {s.approach:.4f} {s.tic:.4f} {s.gross_margin:.4f} "
    f"{s.station_margin:.4f} {s.vat:.4f}\n" for n, s in bars
)
write("stack.dat", hdr + body)

# ---------------------------------------------------------------------------
# 2. VAT trap: raw vs adjusted pass-through
# ---------------------------------------------------------------------------
cases = [("Diesel", 2.92, 2.03), ("Gasoline", 1.26, 1.43)]
t = [r"\begin{tabular}{lrrrr}", r"\toprule",
     r"& $\Delta c$ & $\Delta P$ & $\mathrm{PT}^{\mathrm{raw}}$ & $\mathrm{PT}^{\mathrm{adj}}$ \\",
     r"\midrule"]
for name, dc, dp in cases:
    raw = 100 * pass_through_rate(dp, dc, vat_adjusted=False)
    adj = 100 * pass_through_rate(dp, dc, vat_adjusted=True)
    t.append(f"{name} & {dc:+.2f} & {dp:+.2f} & {raw:.1f}\\% & {adj:.1f}\\% \\\\")
t += [r"\bottomrule", r"\end{tabular}"]
write("vat_table.tex", "\n".join(t))

# ---------------------------------------------------------------------------
# 3. Inventory toy model: why a pass-through delay is not proof of anything
# ---------------------------------------------------------------------------
lam, margin = 1 / 3, 1.20
theta, a = 2.42, 0.10
c = np.array([6.0] * 4 + [5.0] * 4 + [6.0] * 4)        # CIF: a fall at t=4, a rise at t=8
R = c + a + theta                                       # replacement cost
A = np.empty_like(R)                                    # weighted-average (book) cost
A[0] = R[0]
for i in range(1, len(R)):
    A[i] = (1 - lam) * A[i - 1] + lam * R[i]
S1 = R + margin                                         # rule 1: replacement cost-plus
S2 = A + margin                                         # rule 2: book cost-plus
S3 = np.maximum(R, A) + margin                          # rule 3: dearer of the two costs
rows_inv = ["t R A S1 S2 S3 mR1 mR2 mR3 mH1 mH2 mH3"]
for i in range(len(R)):
    rows_inv.append(
        f"{i} {R[i]:.4f} {A[i]:.4f} {S1[i]:.4f} {S2[i]:.4f} {S3[i]:.4f} "
        f"{S1[i]-R[i]:.4f} {S2[i]-R[i]:.4f} {S3[i]-R[i]:.4f} "
        f"{S1[i]-A[i]:.4f} {S2[i]-A[i]:.4f} {S3[i]-A[i]:.4f}"
    )
write("inventory.dat", "\n".join(rows_inv) + "\n")

t = [r"\begin{tabular}{rrrrrr}", r"\toprule",
     r"$t$ & $R_t$ & $A_t$ & $S^{(1)}_t$ & $S^{(2)}_t$ & $S^{(3)}_t$ \\", r"\midrule"]
for i in range(len(R)):
    t.append(f"{i} & {R[i]:.2f} & {A[i]:.2f} & {S1[i]:.2f} & {S2[i]:.2f} & {S3[i]:.2f} \\\\")
t += [r"\bottomrule", r"\end{tabular}"]
write("inventory_table.tex", "\n".join(t))

# cumulative asymmetry measure for each rule: total cession price paid over fall vs rise window
fall = slice(4, 8)
rise = slice(8, 12)
def lag_cost(S):
    """Sum over a window of (S - (R+margin)): positive = price above replacement cost-plus."""
    return (S[fall] - (R[fall] + margin)).sum(), (S[rise] - (R[rise] + margin)).sum()
summary = {k: lag_cost(v) for k, v in {"1": S1, "2": S2, "3": S3}.items()}
t = [r"\begin{tabular}{lrr}", r"\toprule",
     r"Pricing rule & Over the fall (t=4--7) & Over the rise (t=8--11) \\", r"\midrule"]
names = {"1": "Replacement cost-plus", "2": "Book cost-plus", "3": "Dearer of the two"}
for k in "123":
    f_, r_ = summary[k]
    t.append(f"{names[k]} & {f_:+.2f} & {r_:+.2f} \\\\")
t += [r"\bottomrule", r"\end{tabular}"]
write("inventory_summary.tex", "\n".join(t))

# ---------------------------------------------------------------------------
# 4. Simulation of rockets and feathers: can OLS with HAC errors find it?
# ---------------------------------------------------------------------------
K = 4
beta_up = np.array([0.70, 0.30, 0.00, 0.00, 0.00])     # up: complete within 2 fortnights
beta_dn = np.array([0.30, 0.30, 0.20, 0.10, 0.10])     # down: complete after 5 fortnights
assert abs(beta_up.sum() - 1) < 1e-12 and abs(beta_dn.sum() - 1) < 1e-12


def simulate(n: int, beta_u, beta_d, rng, sigma_c=0.30, sigma_e=0.08):
    """Cost changes (heavy tails), pump price changes from the asymmetric lag structure."""
    dc = sigma_c * rng.standard_t(df=5, size=n + K) / np.sqrt(5 / 3)
    up, dn = np.maximum(dc, 0.0), np.minimum(dc, 0.0)
    dp = np.zeros(n)
    for t_ in range(n):
        for k in range(K + 1):
            dp[t_] += beta_u[k] * up[t_ + K - k] + beta_d[k] * dn[t_ + K - k]
    dp += sigma_e * rng.standard_normal(n)
    return dp, up, dn


def design(up, dn, n):
    cols = []
    for k in range(K + 1):
        cols.append(up[K - k:K - k + n])
    for k in range(K + 1):
        cols.append(dn[K - k:K - k + n])
    return sm.add_constant(np.column_stack(cols))


def fit(dp, up, dn, n):
    X = design(up, dn, n)
    return sm.OLS(dp, X).fit(cov_type="HAC", cov_kwds={"maxlags": 4})


rng = np.random.default_rng(20261118)
n = 240
dp, up, dn = simulate(n, beta_up, beta_dn, rng)
res = fit(dp, up, dn, n)
bu = res.params[1:K + 2]
bd = res.params[K + 2:2 * K + 3]
su = res.bse[1:K + 2]
sd = res.bse[K + 2:2 * K + 3]

t = [r"\begin{tabular}{rrrrrr}", r"\toprule",
     r"lag $k$ & true $\beta^{+}_k$ & est. $\hat\beta^{+}_k$ (s.e.) & true $\beta^{-}_k$ & "
     r"est. $\hat\beta^{-}_k$ (s.e.) & \\", r"\midrule"]
for k in range(K + 1):
    t.append(f"{k} & {beta_up[k]:.2f} & {bu[k]:.2f} ({su[k]:.2f}) & {beta_dn[k]:.2f} & "
             f"{bd[k]:.2f} ({sd[k]:.2f}) & \\\\")
t += [r"\bottomrule", r"\end{tabular}"]
write("sim_coefs.tex", "\n".join(t))

# cumulative responses and Wald-type tests of equality at each horizon
cum_u, cum_d = np.cumsum(bu), np.cumsum(bd)
tests = []
for h in range(K + 1):
    r_vec = np.zeros(len(res.params))
    r_vec[1:h + 2] = 1.0
    r_vec[K + 2:K + 3 + h] = -1.0
    tt = res.t_test(r_vec)
    tests.append((h, float(tt.effect[0]), float(tt.sd[0][0]), float(tt.pvalue)))
rows_c = ["h cum_up cum_dn true_up true_dn gap p"]
for h in range(K + 1):
    rows_c.append(f"{h} {cum_u[h]:.4f} {cum_d[h]:.4f} {np.cumsum(beta_up)[h]:.4f} "
                  f"{np.cumsum(beta_dn)[h]:.4f} {tests[h][1]:.4f} {tests[h][3]:.4f}")
write("sim_cumulative.dat", "\n".join(rows_c) + "\n")

t = [r"\begin{tabular}{rrrrr}", r"\toprule",
     r"horizon $h$ & $\hat B^{+}_h$ & $\hat B^{-}_h$ & gap $\hat{\mathrm{AI}}_h$ & $p$-value \\",
     r"\midrule"]
for h in range(K + 1):
    t.append(f"{h} & {cum_u[h]:.2f} & {cum_d[h]:.2f} & {tests[h][1]:+.2f} & "
             f"{tests[h][3]:.3f} \\\\")
t += [r"\bottomrule", r"\end{tabular}"]
write("sim_tests.tex", "\n".join(t))

# scatter data for the first 120 observations: price change vs cost change
sc = ["dc dp"]
dc_full = up[K:K + n] + dn[K:K + n]
for i in range(120):
    sc.append(f"{dc_full[i]:.4f} {dp[i]:.4f}")
write("sim_scatter.dat", "\n".join(sc) + "\n")

# Monte Carlo: size and power of the test of H0: B+_1 = B-_1
def mc(n_obs, beta_u, beta_d, reps=1000, seed=7):
    rng_ = np.random.default_rng(seed)
    rej = 0
    for _ in range(reps):
        dp_, up_, dn_ = simulate(n_obs, beta_u, beta_d, rng_)
        r_ = fit(dp_, up_, dn_, n_obs)
        r_vec = np.zeros(len(r_.params))
        r_vec[1:3] = 1.0
        r_vec[K + 2:K + 4] = -1.0
        if float(r_.t_test(r_vec).pvalue) < 0.05:
            rej += 1
    return rej / reps


beta_sym = beta_dn.copy()  # symmetric: same response up and down
mc_rows = []
for n_obs in (60, 120, 240):
    size = mc(n_obs, beta_sym, beta_sym)
    power = mc(n_obs, beta_up, beta_dn)
    mc_rows.append((n_obs, size, power))
t = [r"\begin{tabular}{rrr}", r"\toprule",
     r"sample size $n$ & rejection rate if symmetric (size) & rejection rate if asymmetric (power) \\",
     r"\midrule"]
for n_obs, size, power in mc_rows:
    t.append(f"{n_obs} & {100 * size:.1f}\\% & {100 * power:.1f}\\% \\\\")
t += [r"\bottomrule", r"\end{tabular}"]
write("sim_mc.tex", "\n".join(t))

# ---------------------------------------------------------------------------
# 4b. Spurious regression: two INDEPENDENT random walks
# ---------------------------------------------------------------------------
rng_sp = np.random.default_rng(99)
rej_sp, r2_sp = 0, []
reps_sp, n_sp = 2000, 240
for _ in range(reps_sp):
    x = np.cumsum(rng_sp.standard_normal(n_sp))
    y = np.cumsum(rng_sp.standard_normal(n_sp))
    r_sp = sm.OLS(y, sm.add_constant(x)).fit()
    rej_sp += float(r_sp.pvalues[1]) < 0.05
    r2_sp.append(r_sp.rsquared)
t = [r"\begin{tabular}{lr}", r"\toprule",
     r"Independent random walks, $n=240$, 2000 repetitions & \\", r"\midrule",
     f"Share of repetitions where the slope looks ``significant'' at 5\\% & "
     f"{100 * rej_sp / reps_sp:.0f}\\% \\\\",
     f"Average $R^2$ & {np.mean(r2_sp):.2f} \\\\",
     r"\bottomrule", r"\end{tabular}"]
write("spurious.tex", "\n".join(t))

# ---------------------------------------------------------------------------
# 4c. Average margins under the three pricing rules (toy inventory model)
# ---------------------------------------------------------------------------
t = [r"\begin{tabular}{lrr}", r"\toprule",
     r"Pricing rule & mean replacement margin $\bar m^{R}$ & mean book margin $\bar m^{H}$ \\",
     r"\midrule"]
for k, S_ in (("Replacement cost-plus", S1), ("Book cost-plus", S2), ("Dearer of the two", S3)):
    t.append(f"{k} & {np.mean(S_ - R):.2f} & {np.mean(S_ - A):.2f} \\\\")
t += [r"\bottomrule", r"\end{tabular}"]
write("inventory_margins.tex", "\n".join(t))

# ---------------------------------------------------------------------------
# 5. Half-life table for error correction speeds
# ---------------------------------------------------------------------------
t = [r"\begin{tabular}{rr}", r"\toprule", r"$\gamma$ & half-life (fortnights) \\", r"\midrule"]
for g in (-0.8, -0.5, -0.3, -0.2, -0.1):
    t.append(f"{g:.1f} & {np.log(0.5) / np.log(1 + g):.1f} \\\\")
t += [r"\bottomrule", r"\end{tabular}"]
write("halflife.tex", "\n".join(t))

print("generated:", sorted(p.name for p in OUT.iterdir()))
print("sim estimates up:", np.round(bu, 2), "down:", np.round(bd, 2))
print("tests:", [(h, round(e, 3), round(p, 4)) for h, e, _, p in tests])
print("MC:", mc_rows)
print("inventory summary:", summary)
