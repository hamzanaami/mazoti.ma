"""Constants with provenance. Every value needs a source and an 'as of' date.

Status tags: verified | secondary | to_verify  (see CLAUDE.md), plus "seen" for a figure
found in a report or search result whose full document has not been read (docs/sources.md).
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Constant:
    value: float
    unit: str
    status: str  # verified | seen | secondary | to_verify
    source: str
    as_of: str


VAT_RATE = Constant(
    0.10, "ratio", "secondary",
    "Press (Le360, 2026) reports a 10% rate on fuel, charged on import and again at the pump. "
    "Confirm against the Code général des impôts.",
    "2026-03",
)

# TIC is a fixed amount per litre, levied at import. Values below come from a single press
# article (ecoactu.ma) and are consistent with the Competition Council Q4 2025 figures
# (see tests), but the primary legal text has not been checked.
TIC_GASOIL_MAD_PER_L = Constant(
    2.42, "MAD/L", "secondary", "https://ecoactu.ma/?p=255474", "2026"
)
TIC_SSP_MAD_PER_L = Constant(
    3.76, "MAD/L", "secondary", "https://ecoactu.ma/?p=255474 ('about 3.76')", "2026"
)

# Typical densities (kg/L). The Competition Council report does not state the factor it uses.
# These are textbook values for EN 590 diesel and 95 RON gasoline; to be calibrated.
DENSITY_GASOIL_KG_PER_L = Constant(0.84, "kg/L", "to_verify", "textbook value", "n/a")
DENSITY_SSP_KG_PER_L = Constant(0.745, "kg/L", "to_verify", "textbook value", "n/a")
