"""Numbers for the showcase site (site/), computed from the model, with provenance.

The site never retypes a model number: scripts/build_site_data.py writes the payload built
here to site/data/. The JavaScript copy of the formulas (site/js/model.js) is checked
against `reference_cases()` every time the page loads.

Money values are MAD per litre; ratios are fractions (0.314, not 31.4).
"""

from __future__ import annotations

from dataclasses import asdict

from mazoti.cc_reports import (
    CC_Q4_2024_TAX_SHARE,
    CC_Q4_2025,
    CC_Q4_2025_URL,
    MARCH_2026_EPISODES,
)
from mazoti.constants import (
    DENSITY_GASOIL_KG_PER_L,
    DENSITY_SSP_KG_PER_L,
    TIC_GASOIL_MAD_PER_L,
    TIC_SSP_MAD_PER_L,
    VAT_RATE,
    Constant,
)
from mazoti.inventory import wac_weight, weighted_average_cost
from mazoti.pricing import (
    Structure,
    build_up,
    decompose,
    full_pass_through,
    pass_through_rate,
    quote_to_mad_per_l,
)
from mazoti.validation import check_structure

SCHEMA_VERSION = 1
PRODUCTS = ("gasoil", "ssp")
TIC = {"gasoil": TIC_GASOIL_MAD_PER_L, "ssp": TIC_SSP_MAD_PER_L}
DENSITY = {"gasoil": DENSITY_GASOIL_KG_PER_L, "ssp": DENSITY_SSP_KG_PER_L}

# Made-up CIF path for the inventory illustration, MAD per litre, one value per fortnight.
# Shaped like a price shock (rise, plateau, fall) around the Q4 2025 gasoil level.
# Not data: the site labels it "illustrative".
ILLUSTRATIVE_CIF_PATH_MAD_PER_L = (
    5.6, 5.6, 5.6, 6.0, 6.4, 6.8, 7.2, 7.6, 7.6, 7.6, 7.6, 7.3,
    7.0, 6.7, 6.4, 6.1, 5.8, 5.5, 5.2, 5.2, 5.2, 5.2, 5.2, 5.2,
)
DEFAULT_STOCK_DAYS = 30

# Unit-conversion example taken from tests/test_pricing.py. It is not market data.
CONVERTER_EXAMPLE = {"quote_usd_per_t": 700.0, "usdmad": 9.0}

# Context facts shown on the site, each with its source and status (docs/sources.md).
CONTEXT_FACTS = {
    "liberalisation": {
        "value": "2015-12-01", "status": "seen",
        "source": "https://www.esmap.org/node/13180", "as_of": "2015-12",
    },
    "revisions": {
        "value": "1st and 16th of each month", "status": "secondary",
        "source": "https://lematin.ma/economie/prix-des-carburants-lessence-baisse-de-50-"
                  "centimes-et-le-gasoil-de-20/375828",
        "as_of": "2026-11",
    },
    "settlement": {
        "value": 1_840_410_426, "unit": "MAD", "date": "2023-11-23", "status": "secondary",
        "source": "https://fr.hespress.com/340704-340704.html", "as_of": "2023-11",
    },
    "distributors_followed": {
        "value": 9, "status": "verified", "source": CC_Q4_2025_URL, "as_of": "2026-06",
    },
}

STOCK_FACTS = {
    # Stated in docs/theory/01 section 7 without a recorded source.
    "legal_minimum_days": {
        "value": 60, "status": "to_verify",
        "source": "docs/theory/01-price-structure.md, section 7 (press; source not recorded)",
        "as_of": "n/a",
    },
    "reported_days": {
        "value": {"gasoil": 47, "ssp": 49}, "status": "secondary",
        "source": "https://www.challenge.ma/energie-des-defis-strategiques-face-a-une-"
                  "dependance-structurelle-322400/",
        "as_of": "n/a",
    },
}


def constant_entry(c: Constant) -> dict:
    return {
        "value": c.value, "unit": c.unit, "status": c.status, "source": c.source,
        "as_of": c.as_of,
    }


def _decompose(product: str) -> Structure:
    chain = CC_Q4_2025[product]
    return decompose(tic=TIC[product].value, vat_rate=VAT_RATE.value, **chain.decompose_kwargs())


def structure_entry(product: str) -> dict:
    """CC Q4 2025 price chain for one product and the components the model implies."""
    chain = CC_Q4_2025[product]
    s = _decompose(product)
    ex_vat = s.pump - s.vat
    return {
        "product": product,
        "period": chain.period,
        "status": chain.status,
        "source": chain.source,
        "as_of": chain.as_of,
        "reported": {
            "cif": chain.cif_mad_per_l,
            "purchase_cost": chain.purchase_cost_mad_per_l,
            "cession_price": chain.cession_price_mad_per_l,
            "pump": chain.pump_mad_per_l,
            "weighted_gross_margin": chain.weighted_gross_margin_mad_per_l,
        },
        "components": {
            "cif": s.cif,
            "approach": s.approach,
            "tic": s.tic,
            "gross_margin": s.gross_margin,
            "station_margin": s.station_margin,
            "vat": s.vat,
        },
        "subtotals": {
            "purchase_cost": s.purchase_cost,
            "cession_price": s.cession_price,
            "ex_vat": ex_vat,
            "pump": s.pump,
        },
        "groups": {
            "product_cost": s.cif + s.approach,
            "taxes": s.tic + s.vat,
            "margins": s.gross_margin + s.station_margin,
        },
        "tax_share": s.tax_share,
        "net_of_tax": ex_vat - s.tic,
        "reported_tax_share_q4_2024": constant_entry(CC_Q4_2024_TAX_SHARE[product]),
    }


def validation_entries() -> list[dict]:
    rows = []
    for product in PRODUCTS:
        checks = check_structure(
            CC_Q4_2025[product], TIC[product].value, VAT_RATE.value,
            CC_Q4_2024_TAX_SHARE[product],
        )
        rows.extend(asdict(c) for c in checks)
    return rows


def pass_through_entry(product: str) -> dict:
    ep = MARCH_2026_EPISODES[product]
    vat = VAT_RATE.value
    return {
        "product": product,
        "window": ep.window,
        "delta_cif": ep.delta_cif_mad_per_l,
        "delta_pump": ep.delta_pump_mad_per_l,
        "full_pass_through_delta_pump": full_pass_through(ep.delta_cif_mad_per_l, vat),
        "raw": pass_through_rate(ep.delta_pump_mad_per_l, ep.delta_cif_mad_per_l, vat,
                                 vat_adjusted=False),
        "adjusted": pass_through_rate(ep.delta_pump_mad_per_l, ep.delta_cif_mad_per_l, vat,
                                      vat_adjusted=True),
        "status": ep.status,
        "source": ep.source,
        "as_of": ep.as_of,
    }


def inventory_entry() -> dict:
    """Inputs for the illustrative inventory simulation (gasoil levels, made-up path)."""
    s = _decompose("gasoil")
    return {
        "status": "illustrative",
        "product": "gasoil",
        "cif_path": list(ILLUSTRATIVE_CIF_PATH_MAD_PER_L),
        "approach": s.approach,
        "tic": s.tic,
        "gross_margin": s.gross_margin,
        "period_days": 15,
        "default_stock_days": DEFAULT_STOCK_DAYS,
        "stock_facts": STOCK_FACTS,
    }


def _replacement_path(approach: float, tic: float) -> list[float]:
    return [c + approach + tic for c in ILLUSTRATIVE_CIF_PATH_MAD_PER_L]


def reference_cases() -> dict:
    """Inputs and Python outputs that the page's JavaScript must reproduce.

    Arguments are positional, in the order of the Python function signatures.
    """
    vat = VAT_RATE.value
    cases: dict[str, list] = {
        "quote_to_mad_per_l": [], "build_up": [], "decompose": [],
        "pass_through_rate": [], "full_pass_through": [], "wac_weight": [],
        "weighted_average_cost": [],
    }
    for args in [(700.0, 9.0, 0.84), (650.0, 10.2, 0.745)]:
        cases["quote_to_mad_per_l"].append({"args": list(args), "result": quote_to_mad_per_l(*args)})

    for product in PRODUCTS:
        chain = CC_Q4_2025[product]
        kw = chain.decompose_kwargs()
        args = [kw["cif"], kw["purchase_cost"], kw["cession_price"], kw["pump"],
                TIC[product].value, vat]
        s = decompose(*args)
        cases["decompose"].append({"args": args, "result": _structure_dict(s)})

    tic = TIC_GASOIL_MAD_PER_L.value
    for args in [(5.59, tic, 0.09, 1.28, 0.5, vat), (7.0, tic, 0.1, 1.5, 0.6, vat),
                 (3.0, TIC_SSP_MAD_PER_L.value, 0.12, 2.06, 0.6, vat)]:
        cases["build_up"].append({"args": list(args), "result": _structure_dict(build_up(*args))})

    for ep in MARCH_2026_EPISODES.values():
        for adjusted in (False, True):
            args = [ep.delta_pump_mad_per_l, ep.delta_cif_mad_per_l, vat, adjusted]
            cases["pass_through_rate"].append({"args": args, "result": pass_through_rate(*args)})
    cases["full_pass_through"].append({"args": [1.0, vat], "result": full_pass_through(1.0, vat)})

    for days in (0, 30, 60):
        cases["wac_weight"].append({"args": [days, 15.0], "result": wac_weight(days, 15.0)})

    s = _decompose("gasoil")
    path = _replacement_path(s.approach, s.tic)
    w = wac_weight(DEFAULT_STOCK_DAYS)
    cases["weighted_average_cost"].append(
        {"args": [path, w], "result": weighted_average_cost(path, w)}
    )
    return cases


def _structure_dict(s: Structure) -> dict:
    d = asdict(s)
    d.update(purchase_cost=s.purchase_cost, cession_price=s.cession_price, tax_share=s.tax_share)
    return d


def build_payload(generated_on: str, model_version: str, tests: dict | None = None) -> dict:
    """Everything the site needs, as plain JSON-ready data."""
    return {
        "schema": SCHEMA_VERSION,
        "generated_on": generated_on,
        "model_version": model_version,
        "unit": "MAD/L",
        "constants": {
            "vat_rate": constant_entry(VAT_RATE),
            "tic_gasoil": constant_entry(TIC_GASOIL_MAD_PER_L),
            "tic_ssp": constant_entry(TIC_SSP_MAD_PER_L),
            "density_gasoil": constant_entry(DENSITY_GASOIL_KG_PER_L),
            "density_ssp": constant_entry(DENSITY_SSP_KG_PER_L),
        },
        "structure": {p: structure_entry(p) for p in PRODUCTS},
        "validation": validation_entries(),
        "pass_through": {p: pass_through_entry(p) for p in PRODUCTS},
        "inventory": inventory_entry(),
        "converter_example": dict(CONVERTER_EXAMPLE),
        "context": CONTEXT_FACTS,
        "tests": tests,
        "reference_cases": reference_cases(),
    }
