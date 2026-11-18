"""Weighted-average inventory cost (docs/theory/01, section 7)."""

import pytest

from mazoti.inventory import wac_weight, weighted_average_cost


def test_weight_from_stock_days():
    # 30 days of stock, fortnightly periods -> lambda = 15 / 45 = 1/3 (docs/theory/01)
    assert wac_weight(30) == pytest.approx(1 / 3)
    assert wac_weight(0) == 1.0
    assert wac_weight(60) == pytest.approx(0.2)


def test_weight_rejects_bad_inputs():
    with pytest.raises(ValueError):
        wac_weight(-1)
    with pytest.raises(ValueError):
        wac_weight(30, period_days=0)


def test_no_stock_means_book_cost_is_market_cost():
    path = [8.0, 9.0, 7.5]
    assert weighted_average_cost(path, wac_weight(0)) == pytest.approx(path)


def test_book_cost_lags_a_rise_and_a_fall():
    path = [8.0, 8.0, 10.0, 10.0, 7.0, 7.0]
    book = weighted_average_cost(path, 1 / 3)
    assert book[0] == pytest.approx(8.0)  # steady-state opening
    assert book[2] == pytest.approx(8.0 + (10.0 - 8.0) / 3)  # one third of the rise
    assert 8.0 < book[3] < 10.0  # still below the new cost after a rise
    assert book[4] > 7.0  # still above the new cost after a fall


def test_book_cost_converges():
    book = weighted_average_cost([9.0] * 60, 0.25, opening_cost_mad_per_l=6.0)
    assert book[-1] == pytest.approx(9.0, abs=1e-6)


def test_empty_path():
    assert weighted_average_cost([], 0.5) == []
