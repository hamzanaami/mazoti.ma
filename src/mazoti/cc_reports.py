"""Figures published by the Competition Council (CC), with provenance.

Values are MAD per litre unless the name says otherwise. They are the ground truth the
price-structure model is checked against (tests/test_pricing.py) and the figures the
showcase site displays (src/mazoti/site_data.py). Keep them here, in one place.

Status tags as in src/mazoti/constants.py. Sources: docs/sources.md.
"""

from __future__ import annotations

from dataclasses import dataclass

from mazoti.constants import Constant

CC_Q4_2025_URL = (
    "https://conseil-concurrence.ma/wp-content/uploads/2026/06/"
    "Reporting-du-4eme-trimestre-de-lannee-2025-relatif-au-suivi-des-engagements-pris-par-"
    "les-societes-de-distribution-en-gros-du-gasoil-et-dessence-FR.pdf"
)
CC_Q4_2024_URL = (
    "https://conseil-concurrence.ma/wp-content/uploads/2025/04/Rapport-Reporting-FR-N°4-2025.pdf"
)
# Press report of the CC's pass-through figures for early March 2026.
CC_MARCH_2026_PRESS_URL = "https://northafricapost.com/?p=95972"


@dataclass(frozen=True)
class QuarterlyPriceChain:
    """CC quarterly averages for one product, MAD per litre."""

    product: str  # "gasoil" or "ssp"
    period: str  # quarter, e.g. "2025-Q4"
    cif_mad_per_l: float
    purchase_cost_mad_per_l: float
    cession_price_mad_per_l: float
    pump_mad_per_l: float
    # The CC's own gross margin, weighted across companies and periods. It differs from
    # cession price minus purchase cost (a difference of two averages).
    weighted_gross_margin_mad_per_l: float
    status: str
    source: str
    as_of: str  # month the report was posted

    def decompose_kwargs(self) -> dict[str, float]:
        """Arguments for mazoti.pricing.decompose, which works in MAD per litre."""
        return {
            "cif": self.cif_mad_per_l,
            "purchase_cost": self.purchase_cost_mad_per_l,
            "cession_price": self.cession_price_mad_per_l,
            "pump": self.pump_mad_per_l,
        }


@dataclass(frozen=True)
class PassThroughEpisode:
    """A move in the CIF cost and the pump-price response reported for it, MAD per litre."""

    product: str
    window: str
    delta_cif_mad_per_l: float  # excl. TIC and VAT
    delta_pump_mad_per_l: float  # incl. VAT
    status: str
    source: str
    as_of: str


# CC reporting for Q4 2025 (9th follow-up report): table of average CIF, purchase cost,
# cession price and pump price, and weighted gross margins.
CC_Q4_2025 = {
    "gasoil": QuarterlyPriceChain(
        "gasoil", "2025-Q4", 5.59, 8.10, 9.38, 10.87, 1.23, "verified", CC_Q4_2025_URL, "2026-06"
    ),
    "ssp": QuarterlyPriceChain(
        "ssp", "2025-Q4", 5.12, 9.00, 11.06, 12.82, 1.85, "verified", CC_Q4_2025_URL, "2026-06"
    ),
}

# CC reporting for Q4 2024: taxes as a share of the pump price.
CC_Q4_2024_TAX_SHARE = {
    "gasoil": Constant(0.31, "ratio", "seen", CC_Q4_2024_URL, "2025-04"),
    "ssp": Constant(0.38, "ratio", "seen", CC_Q4_2024_URL, "2025-04"),
}

# Early-March 2026 episode as reported by the press from CC figures. The CC published a
# diesel ratio of 69.5% and "above 100%" for gasoline (docs/theory/01, section 5).
MARCH_2026_EPISODES = {
    "gasoil": PassThroughEpisode(
        "gasoil", "early March 2026", 2.92, 2.03, "secondary", CC_MARCH_2026_PRESS_URL, "2026-03"
    ),
    "ssp": PassThroughEpisode(
        "ssp", "early March 2026", 1.26, 1.43, "secondary", CC_MARCH_2026_PRESS_URL, "2026-03"
    ),
}
