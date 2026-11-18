"""Checks of the price-structure model against Competition Council (CC) figures.

The bounds below are shared by tests/test_pricing.py and the showcase site, so both say
the same thing. Bounds are MAD per litre unless the name says otherwise.
"""

from __future__ import annotations

from dataclasses import dataclass

from mazoti.cc_reports import QuarterlyPriceChain
from mazoti.constants import Constant
from mazoti.pricing import build_up, decompose

# Implied approach cost must be small and positive: the CIF quotation already carries
# freight and insurance (docs/theory/01, section 4).
APPROACH_BOUNDS_MAD_PER_L = {"gasoil": (0.0, 0.25), "ssp": (0.0, 0.25)}
# Implied station margin must be plausible for retail.
STATION_MARGIN_BOUNDS_MAD_PER_L = {"gasoil": (0.3, 0.8), "ssp": (0.3, 0.9)}
# Implied tax share must match the CC's reported share within this many points (ratio).
TAX_SHARE_TOLERANCE = 0.02
# Forward and inverse model must agree on the pump price.
ROUNDTRIP_TOLERANCE_MAD_PER_L = 1e-9


@dataclass(frozen=True)
class Check:
    """One comparison between a model output and a reference or a plausibility bound."""

    product: str
    quantity: str  # approach | gross_margin | station_margin | tax_share | roundtrip
    model_value: float
    reference_value: float | None  # CC figure, when one exists
    low: float | None
    high: float | None
    passed: bool | None  # None: shown for information, no pass/fail rule


def check_structure(
    chain: QuarterlyPriceChain,
    tic_mad_per_l: float,
    vat_rate: float,
    reported_tax_share: Constant,
) -> list[Check]:
    """Decompose one CC quarter and check each implied component."""
    p = chain.product
    s = decompose(tic=tic_mad_per_l, vat_rate=vat_rate, **chain.decompose_kwargs())
    t = build_up(s.cif, s.tic, s.approach, s.gross_margin, s.station_margin, vat_rate)

    a_lo, a_hi = APPROACH_BOUNDS_MAD_PER_L[p]
    r_lo, r_hi = STATION_MARGIN_BOUNDS_MAD_PER_L[p]
    share_ref = reported_tax_share.value
    return [
        Check(p, "approach", s.approach, None, a_lo, a_hi, a_lo < s.approach < a_hi),
        # A difference of two averages is not the CC's weighted margin; shown, not scored.
        Check(p, "gross_margin", s.gross_margin, chain.weighted_gross_margin_mad_per_l,
              None, None, None),
        Check(p, "station_margin", s.station_margin, None, r_lo, r_hi,
              r_lo < s.station_margin < r_hi),
        Check(p, "tax_share", s.tax_share, share_ref, share_ref - TAX_SHARE_TOLERANCE,
              share_ref + TAX_SHARE_TOLERANCE, abs(s.tax_share - share_ref) <= TAX_SHARE_TOLERANCE),
        Check(p, "roundtrip", t.pump, chain.pump_mad_per_l, None, None,
              abs(t.pump - chain.pump_mad_per_l) <= ROUNDTRIP_TOLERANCE_MAD_PER_L),
    ]
