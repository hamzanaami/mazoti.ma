"""Internal-consistency checks on the CC figures transcribed in data/reference/.

The figures were extracted from the PDFs by a text fetch, not typed from a PDF viewer, so
these checks catch transcription errors: fortnightly changes must match differences of
levels, printed sums must match the sum of the cells, and quarterly averages must sit near
the mean of the fortnights. Known discrepancies inside the CC's own documents are listed
explicitly rather than hidden by loose tolerances (see data/reference/README.md).
"""

import csv
from collections import defaultdict
from pathlib import Path

import pytest

REF = Path(__file__).resolve().parents[1] / "data" / "reference"


def rows(name):
    with open(REF / name, newline="") as fh:
        return list(csv.DictReader(fh))


def num(x):
    return float(x) if x != "" else None


def grouped(name, *keys):
    out = defaultdict(list)
    for r in rows(name):
        out[tuple(r[k] for k in keys)].append(r)
    return out


LEVELS = grouped("cc_fortnightly_levels.csv", "quarter", "product")
VARS = grouped("cc_fortnightly_variations.csv", "quarter", "product")


def test_every_row_has_a_known_source():
    ids = {r["source_id"] for r in rows("sources_manifest.csv")}
    for name in (
        "cc_fortnightly_levels.csv",
        "cc_fortnightly_variations.csv",
        "cc_quarterly_averages.csv",
        "cc_other_figures.csv",
        "cc_2023_fortnightly.csv",
        "cc_2023_monthly_gross_margins.csv",
        "cc_note3_2026_fortnightly_changes.csv",
    ):
        for r in rows(name):
            assert r["source_id"] in ids, (name, r["source_id"])
            assert r["status"] in {"secondary", "verified", "to_verify"}


def test_eight_quarters_two_products_six_fortnights_each():
    assert len(LEVELS) == 16 and all(len(v) == 6 for v in LEVELS.values())
    assert len(VARS) == 16 and all(len(v) == 6 for v in VARS.values())


@pytest.mark.parametrize("key", sorted(VARS))
def test_printed_quarter_sums_match_cells(key):
    cells = VARS[key]
    s_cif = sum(num(r["d_cif_mad_per_l"]) or 0 for r in cells)
    s_pump = sum(num(r["d_pump_ttc_mad_per_l"]) or 0 for r in cells)
    p_cif, p_pump = num(cells[0]["printed_quarter_sum_d_cif"]), num(cells[0]["printed_quarter_sum_d_pump"])
    if key == ("2024-Q1", "gasoil"):
        # The printed sum includes the unprinted 1Q-Jan variation (about +0.03 CIF, +0.17 pump),
        # which the levels confirm is missing from the cells.
        assert (p_cif - s_cif, p_pump - s_pump) == pytest.approx((0.03, 0.17), abs=0.015)
        return
    assert s_cif == pytest.approx(p_cif, abs=0.015)
    assert s_pump == pytest.approx(p_pump, abs=0.015)


@pytest.mark.parametrize("key", sorted(VARS))
def test_variations_equal_level_differences(key):
    lv, va = LEVELS[key], VARS[key]
    for i in range(1, 6):
        for level, var in (
            ("cif_mad_per_l", "d_cif_mad_per_l"),
            ("pump_ttc_mad_per_l", "d_pump_ttc_mad_per_l"),
        ):
            diff = num(lv[i][level]) - num(lv[i - 1][level])
            assert diff == pytest.approx(num(va[i][var]), abs=0.025), (key, i, level)


def test_quarterly_averages_near_fortnight_means():
    # Known: the Q1 2024 essence pump average printed in the text (14.77) does not match the
    # fortnightly levels (mean 14.62); 14.77 is the 1Q-Jul-2024 level. Flagged to verify.
    known = {("2024-Q1", "ssp", "pump_ttc_mad_per_l")}
    for r in rows("cc_quarterly_averages.csv"):
        key = (r["quarter"], r["product"])
        for col, tol in (
            ("cif_mad_per_l", 0.15),
            ("purchase_cost_ht_mad_per_l", 0.15),
            ("cession_ht_mad_per_l", 0.15),
            ("pump_ttc_mad_per_l", 0.10),
        ):
            if r[col] == "" or (*key, col) in known:
                continue
            mean = sum(num(x[col]) for x in LEVELS[key]) / 6
            assert mean == pytest.approx(num(r[col]), abs=tol), (key, col)


def test_gross_margin_is_close_to_cession_minus_cost():
    # The CC's gross margin is weighted by company and fortnight, so it is not exactly
    # cession minus cost. A gap of up to ~0.3 MAD/L occurs in the CC's own tables (Q1 2024
    # and Q4 2025 essence); anything bigger would indicate a transcription slip.
    for key, cells in LEVELS.items():
        for r in cells:
            if r["gross_margin_mad_per_l"] == "":
                continue
            gap = (
                num(r["cession_ht_mad_per_l"])
                - num(r["purchase_cost_ht_mad_per_l"])
                - num(r["gross_margin_mad_per_l"])
            )
            assert abs(gap) <= 0.31, (key, r["period_start"], gap)


@pytest.mark.parametrize("product", ["gasoil", "ssp"])
def test_2023_series_consistent(product):
    cells = [r for r in rows("cc_2023_fortnightly.csv") if r["product"] == product]
    assert len(cells) == 24
    for i in range(1, 24):
        for level, var in (
            ("cif_mad_per_l", "d_cif"),
            ("purchase_cost_ht_mad_per_l", "d_purchase_cost"),
            ("pump_price_ht_mad_per_l", "d_pump_price_ht"),
        ):
            diff = num(cells[i][level]) - num(cells[i - 1][level])
            assert diff == pytest.approx(num(cells[i][var]), abs=0.025), (product, i, level)
    totals = {
        "gasoil": {"d_cif": -1.51, "d_purchase_cost": -1.47, "d_pump_price_ht": -0.64},
        "ssp": {"d_cif": -0.33, "d_purchase_cost": -0.67, "d_pump_price_ht": 0.20},
    }[product]
    for col, total in totals.items():
        assert sum(num(r[col]) or 0 for r in cells) == pytest.approx(total, abs=0.03)


def test_2023_monthly_margins_average_to_printed_annual():
    for product, annual in (("gasoil", 0.76), ("ssp", 1.38)):
        vals = [num(r["gross_margin_mad_per_l"]) for r in rows("cc_2023_monthly_gross_margins.csv")
                if r["product"] == product]
        assert len(vals) == 12
        # Unweighted mean; the CC's annual figure is volume-weighted.
        assert sum(vals) / 12 == pytest.approx(annual, abs=0.03)


def test_march_may_2026_note_sums():
    cells = rows("cc_note3_2026_fortnightly_changes.csv")
    for product, (s_cif, s_pump) in (("gasoil", (4.24, 4.18)), ("ssp", (2.81, 2.43))):
        sel = [r for r in cells if r["product"] == product]
        assert sum(num(r["d_cif_mad_per_l"]) for r in sel) == pytest.approx(s_cif, abs=0.005)
        assert sum(num(r["d_pump_ttc_mad_per_l"]) for r in sel) == pytest.approx(s_pump, abs=0.005)


def test_q4_2025_matches_the_constants_used_by_the_model():
    from mazoti.cc_reports import CC_Q4_2025

    for r in rows("cc_quarterly_averages.csv"):
        if r["quarter"] != "2025-Q4":
            continue
        c = CC_Q4_2025[r["product"]]
        assert num(r["cif_mad_per_l"]) == c.cif_mad_per_l
        assert num(r["purchase_cost_ht_mad_per_l"]) == c.purchase_cost_mad_per_l
        assert num(r["cession_ht_mad_per_l"]) == c.cession_price_mad_per_l
        assert num(r["pump_ttc_mad_per_l"]) == c.pump_mad_per_l
        assert num(r["weighted_gross_margin_mad_per_l"]) == c.weighted_gross_margin_mad_per_l
