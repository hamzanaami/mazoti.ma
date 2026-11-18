"""The showcase site's numbers come from the model and carry their provenance."""

import json

import pytest

from mazoti.cc_reports import CC_Q4_2025
from mazoti.pricing import build_up, decompose, pass_through_rate, quote_to_mad_per_l
from mazoti.site_data import PRODUCTS, build_payload
from mazoti.validation import check_structure

PROVENANCE_KEYS = {"status", "source", "as_of"}
STATUSES = {"verified", "seen", "secondary", "to_verify", "illustrative"}


@pytest.fixture(scope="module")
def payload():
    return build_payload("2026-11-18", "0.0.1")


def test_payload_is_json_serialisable(payload):
    assert json.loads(json.dumps(payload))["schema"] == 1


def test_every_constant_and_fact_has_provenance(payload):
    blocks = list(payload["constants"].values()) + list(payload["context"].values())
    blocks += list(payload["inventory"]["stock_facts"].values())
    blocks += [payload["structure"][p] for p in PRODUCTS]
    blocks += [payload["pass_through"][p] for p in PRODUCTS]
    for block in blocks:
        assert PROVENANCE_KEYS <= block.keys()
        assert block["status"] in STATUSES
        assert block["source"]


def test_structure_adds_up_to_the_pump_price(payload):
    for p in PRODUCTS:
        s = payload["structure"][p]
        assert sum(s["components"].values()) == pytest.approx(s["reported"]["pump"])
        assert sum(s["groups"].values()) == pytest.approx(s["reported"]["pump"])
        assert s["subtotals"]["purchase_cost"] == pytest.approx(s["reported"]["purchase_cost"])
        assert s["subtotals"]["cession_price"] == pytest.approx(s["reported"]["cession_price"])


def test_structure_matches_the_model(payload):
    s = payload["structure"]["gasoil"]
    model = decompose(tic=s["components"]["tic"], **CC_Q4_2025["gasoil"].decompose_kwargs())
    assert s["components"]["approach"] == pytest.approx(model.approach)
    assert s["tax_share"] == pytest.approx(model.tax_share)


def test_all_scored_checks_pass(payload):
    scored = [c for c in payload["validation"] if c["passed"] is not None]
    assert len(scored) == 8
    assert all(c["passed"] for c in scored)


def test_check_structure_flags_a_wrong_tic():
    chain = CC_Q4_2025["gasoil"]
    from mazoti.cc_reports import CC_Q4_2024_TAX_SHARE

    checks = check_structure(chain, 1.0, 0.10, CC_Q4_2024_TAX_SHARE["gasoil"])
    failed = {c.quantity for c in checks if c.passed is False}
    assert {"approach", "tax_share"} <= failed


def test_reference_cases_match_python(payload):
    rc = payload["reference_cases"]
    for case in rc["quote_to_mad_per_l"]:
        assert quote_to_mad_per_l(*case["args"]) == pytest.approx(case["result"])
    for case in rc["build_up"]:
        assert build_up(*case["args"]).pump == pytest.approx(case["result"]["pump"])
    for case in rc["pass_through_rate"]:
        assert pass_through_rate(*case["args"]) == pytest.approx(case["result"])
    assert len(rc["weighted_average_cost"][0]["result"]) == len(payload["inventory"]["cif_path"])
