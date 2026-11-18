"""Inventory valuation: why a distributor's book cost lags the market.

Theory: docs/theory/01-price-structure.md, section 7 (weighted-average cost, WAC).
Costs are MAD per litre, excl. VAT, incl. TIC. Periods are fortnights.
"""

from __future__ import annotations

from collections.abc import Sequence


def wac_weight(stock_days: float, period_days: float = 15.0) -> float:
    """Share of the stock bought during one period, assuming constant volumes.

    lambda = period_days / (stock_days + period_days). Thirty days of stock and fortnightly
    periods give 1/3. Zero stock days give 1: the book cost is the market cost.
    """
    if stock_days < 0:
        raise ValueError("stock_days must be >= 0")
    if period_days <= 0:
        raise ValueError("period_days must be > 0")
    return period_days / (stock_days + period_days)


def weighted_average_cost(
    replacement_cost_mad_per_l: Sequence[float],
    weight: float,
    opening_cost_mad_per_l: float | None = None,
) -> list[float]:
    """Book cost path A_t = (1 - weight) * A_{t-1} + weight * k_t.

    k_t is the replacement cost of period t (CIF + approach cost + TIC). The opening book
    cost defaults to the first replacement cost, so the stock starts in steady state.
    """
    if not 0.0 < weight <= 1.0:
        raise ValueError("weight must be in (0, 1]")
    if not replacement_cost_mad_per_l:
        return []
    book = (
        replacement_cost_mad_per_l[0] if opening_cost_mad_per_l is None else opening_cost_mad_per_l
    )
    path = []
    for k in replacement_cost_mad_per_l:
        book = (1.0 - weight) * book + weight * k
        path.append(book)
    return path
