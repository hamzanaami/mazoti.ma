"""Validation of the price-structure model against Competition Council (CC) figures.

Source: CC reporting for Q4 2025 (9th follow-up report), Table of average CIF, purchase
cost, cession price and pump price. Figures and provenance: src/mazoti/cc_reports.py.
TIC amounts: src/mazoti/constants.py. Plausibility bounds: src/mazoti/validation.py.
If these checks break, the structural model (or a constant) is wrong.
"""

import pytest

from mazoti.cc_reports import CC_Q4_2024_TAX_SHARE, CC_Q4_2025, MARCH_2026_EPISODES
from mazoti.constants import TIC_GASOIL_MAD_PER_L, TIC_SSP_MAD_PER_L
from mazoti.pricing import build_up, decompose, full_pass_through, pass_through_rate, quote_to_mad_per_l
from mazoti.validation import (
    APPROACH_BOUNDS_MAD_PER_L,
    STATION_MARGIN_BOUNDS_MAD_PER_L,
    TAX_SHARE_TOLERANCE,
)

# CC Q4 2025 averages, MAD per litre
GASOIL = CC_Q4_2025["gasoil"].decompose_kwargs()
SSP = CC_Q4_2025["ssp"].decompose_kwargs()


def test_cc_figures_are_the_published_ones():
    assert GASOIL == dict(cif=5.59, purchase_cost=8.10, cession_price=9.38, pump=10.87)
    assert SSP == dict(cif=5.12, purchase_cost=9.00, cession_price=11.06, pump=12.82)


def test_gasoil_structure_matches_cc():
    s = decompose(tic=TIC_GASOIL_MAD_PER_L.value, **GASOIL)
    # Implied approach cost is small and positive (CIF already includes freight/insurance)
    lo, hi = APPROACH_BOUNDS_MAD_PER_L["gasoil"]
    assert lo < s.approach < hi
    # CC reports a weighted gross margin of 1.23; the simple difference of averages is 1.28
    assert s.gross_margin == pytest.approx(1.28, abs=0.01)
    # Implied station margin is plausible (about 0.5 MAD/L)
    lo, hi = STATION_MARGIN_BOUNDS_MAD_PER_L["gasoil"]
    assert lo < s.station_margin < hi
    # CC reports taxes at about 31% of the gasoil pump price (Q4 2024)
    assert s.tax_share == pytest.approx(
        CC_Q4_2024_TAX_SHARE["gasoil"].value, abs=TAX_SHARE_TOLERANCE
    )


def test_ssp_structure_matches_cc():
    s = decompose(tic=TIC_SSP_MAD_PER_L.value, **SSP)
    lo, hi = APPROACH_BOUNDS_MAD_PER_L["ssp"]
    assert lo < s.approach < hi
    assert s.gross_margin == pytest.approx(2.06, abs=0.01)
    lo, hi = STATION_MARGIN_BOUNDS_MAD_PER_L["ssp"]
    assert lo < s.station_margin < hi
    # CC reports taxes at about 38% of the gasoline pump price (Q4 2024)
    assert s.tax_share == pytest.approx(CC_Q4_2024_TAX_SHARE["ssp"].value, abs=TAX_SHARE_TOLERANCE)


def test_forward_inverse_roundtrip():
    s = decompose(tic=TIC_GASOIL_MAD_PER_L.value, **GASOIL)
    t = build_up(s.cif, s.tic, s.approach, s.gross_margin, s.station_margin)
    assert t.pump == pytest.approx(GASOIL["pump"])


def test_vat_multiplies_pass_through():
    assert full_pass_through(1.0) == pytest.approx(1.10)
    # CC March 2026 episode: diesel CIF +2.92, pump +2.03 -> 69.5% (raw) / 63.2% (VAT-adjusted)
    ep = MARCH_2026_EPISODES["gasoil"]
    assert (ep.delta_cif_mad_per_l, ep.delta_pump_mad_per_l) == (2.92, 2.03)
    raw = pass_through_rate(ep.delta_pump_mad_per_l, ep.delta_cif_mad_per_l, vat_adjusted=False)
    adj = pass_through_rate(ep.delta_pump_mad_per_l, ep.delta_cif_mad_per_l, vat_adjusted=True)
    assert raw == pytest.approx(0.695, abs=0.001)
    assert adj == pytest.approx(0.632, abs=0.001)
    # Gasoline: CIF +1.26, pump +1.43 -> 113.5% (raw) / 103.2% (VAT-adjusted)
    ep = MARCH_2026_EPISODES["ssp"]
    raw = pass_through_rate(ep.delta_pump_mad_per_l, ep.delta_cif_mad_per_l, vat_adjusted=False)
    adj = pass_through_rate(ep.delta_pump_mad_per_l, ep.delta_cif_mad_per_l, vat_adjusted=True)
    assert raw == pytest.approx(1.135, abs=0.001)
    assert adj == pytest.approx(1.032, abs=0.001)


def test_unit_conversion():
    # 700 USD/t at 9.0 MAD/USD, diesel density 0.84 -> 5.292 MAD/L
    assert quote_to_mad_per_l(700, 9.0, 0.84) == pytest.approx(5.292)
