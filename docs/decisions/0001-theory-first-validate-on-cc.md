# ADR-0001: Theory first, validated on Competition Council figures

- Status: accepted
- Date: 2026-11-18

## Context

True purchase costs of Moroccan fuel distributors are not public. The only systematic ground truth
is the Competition Council's (CC) quarterly follow-up reports, which give average CIF, purchase cost,
cession price, gross margin and pump price for nine distributors, with a lag of several months.
A web product built before the model is validated would publish numbers we cannot defend.

## Decision

1. Write the price-structure and pass-through theory before building data pipelines or UI.
2. Require the structural model to reproduce CC figures (tests in `tests/test_pricing.py`) before it
   is used on anything else.
3. Treat all derived margins and gaps as model-implied, with intervals, never as accounting facts.
4. Tag every fact in docs as verified, secondary or to verify.

## Consequences

- Slower start, but a methodology that can be published and challenged.
- Product work starts only after phase 3 of `docs/plan.md` yields results with intervals.
- Constants such as TIC move from `secondary` to `verified` once the legal text is read (task 1.3).
