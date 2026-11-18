"""Price-structure model: Moroccan pump price from cost, TIC, margins and VAT.

Theory: docs/theory/01-price-structure.md
Units: MAD (dirham), L (litre), t (tonne). Variable names carry their unit.
"""

from __future__ import annotations

from dataclasses import dataclass


def quote_to_mad_per_l(quote_usd_per_t: float, usdmad: float, density_kg_per_l: float) -> float:
    """Convert a refined-product quotation (USD/tonne) to MAD per litre.

    litres per tonne = 1000 / density, so MAD/L = USD/t * MAD/USD * density / 1000.
    """
    return quote_usd_per_t * usdmad * density_kg_per_l / 1000.0


@dataclass(frozen=True)
class Structure:
    """Decomposition of one pump price (all MAD per litre)."""

    cif: float            # reference CIF quotation, excl. TIC and VAT
    approach: float       # freight/handling/storage beyond CIF (implied)
    tic: float            # fixed excise
    gross_margin: float   # distributor margin: cession price - purchase cost
    station_margin: float # retail margin on top of the cession price
    vat: float            # VAT amount
    pump: float           # pump price incl. VAT

    @property
    def purchase_cost(self) -> float:
        """Distributor purchase cost, incl. TIC, excl. VAT."""
        return self.cif + self.approach + self.tic

    @property
    def cession_price(self) -> float:
        return self.purchase_cost + self.gross_margin

    @property
    def tax_share(self) -> float:
        return (self.tic + self.vat) / self.pump


def build_up(
    cif: float,
    tic: float,
    approach: float,
    gross_margin: float,
    station_margin: float,
    vat_rate: float = 0.10,
) -> Structure:
    """Forward model: components -> pump price.

    pump = (cif + approach + tic + gross_margin + station_margin) * (1 + vat_rate)
    """
    ex_vat = cif + approach + tic + gross_margin + station_margin
    vat = ex_vat * vat_rate
    return Structure(cif, approach, tic, gross_margin, station_margin, vat, ex_vat + vat)


def decompose(
    cif: float,
    purchase_cost: float,
    cession_price: float,
    pump: float,
    tic: float,
    vat_rate: float = 0.10,
) -> Structure:
    """Inverse model: observed price chain -> implied components.

    Implied approach cost   = purchase_cost - cif - tic
    Gross margin            = cession_price - purchase_cost
    Implied station margin  = pump / (1 + vat_rate) - cession_price
    """
    ex_vat = pump / (1.0 + vat_rate)
    return Structure(
        cif=cif,
        approach=purchase_cost - cif - tic,
        tic=tic,
        gross_margin=cession_price - purchase_cost,
        station_margin=ex_vat - cession_price,
        vat=pump - ex_vat,
        pump=pump,
    )


def full_pass_through(delta_ex_tax_cost: float, vat_rate: float = 0.10) -> float:
    """Pump-price change implied by a change in ex-tax, ex-VAT cost, margins unchanged."""
    return delta_ex_tax_cost * (1.0 + vat_rate)


def pass_through_rate(delta_pump: float, delta_cif: float, vat_rate: float = 0.10,
                      vat_adjusted: bool = True) -> float:
    """Share of a CIF change that reached the pump.

    The Competition Council compares delta_pump (incl. VAT) with delta_cif (excl. VAT).
    With vat_adjusted=True the benchmark is full_pass_through(delta_cif), i.e. 1.10 x.
    """
    benchmark = full_pass_through(delta_cif, vat_rate) if vat_adjusted else delta_cif
    return delta_pump / benchmark
