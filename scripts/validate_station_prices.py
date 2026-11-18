"""Validate a station price CSV (see docs/data-collection.md).

Usage: python3 scripts/validate_station_prices.py data/raw/station_prices.csv
Exit code 1 if any ERROR; WARNINGs are advisory. Standard library only.
"""
import csv
import sys
from collections import defaultdict
from datetime import date, datetime

COLUMNS = ["date", "time", "city", "brand", "station_name", "address", "product",
           "price_mad_per_l", "photo_file", "notes"]
CITIES = {"Casablanca", "Rabat"}
PRODUCTS = {"gasoil", "ssp95"}
BRANDS = {"Afriquia", "Petrom", "Shell", "TotalEnergies", "Winxo", "Ziz", "Other"}
PRICE_MIN, PRICE_MAX = 5.0, 30.0


def last_revision(d: date) -> date:
    """Most recent revision date (1st or 16th) on or before d."""
    return d.replace(day=16 if d.day >= 16 else 1)


def validate(path):
    errors, warnings = [], []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames != COLUMNS:
            return [f"header must be exactly: {','.join(COLUMNS)}"], []
        rows = list(reader)
    seen = {}
    by_station = defaultdict(list)
    by_day = defaultdict(list)
    for i, r in enumerate(rows, start=2):
        where = f"line {i}"
        if "delete me" in (r["notes"] or ""):
            warnings.append(f"{where}: example row still present")
        try:
            d = datetime.strptime(r["date"], "%Y-%m-%d").date()
        except ValueError:
            errors.append(f"{where}: date must be YYYY-MM-DD"); continue
        if d > date.today():
            errors.append(f"{where}: date in the future")
        try:
            datetime.strptime(r["time"], "%H:%M")
        except ValueError:
            errors.append(f"{where}: time must be HH:MM")
        if r["city"] not in CITIES:
            errors.append(f"{where}: city must be one of {sorted(CITIES)}")
        if r["brand"] not in BRANDS:
            errors.append(f"{where}: brand must be one of {sorted(BRANDS)}")
        if r["product"] not in PRODUCTS:
            errors.append(f"{where}: product must be one of {sorted(PRODUCTS)}")
        if not r["station_name"].strip():
            errors.append(f"{where}: station_name required")
        try:
            p = float(r["price_mad_per_l"])
        except ValueError:
            errors.append(f"{where}: price is not a number (use a dot, e.g. 16.70)"); continue
        if not (PRICE_MIN <= p <= PRICE_MAX):
            errors.append(f"{where}: price {p} outside {PRICE_MIN}-{PRICE_MAX}")
        if round(p, 2) != p:
            errors.append(f"{where}: price must have at most 2 decimals")
        key = (r["date"], r["station_name"], r["product"])
        if key in seen:
            warnings.append(f"{where}: duplicate of line {seen[key]} (same day, station, product)")
        seen[key] = i
        by_station[(r["station_name"], r["product"])].append((d, p, i))
        by_day[(r["date"], r["city"], r["product"])].append((r["brand"], p, i))
        # days since the last revision: prices within 0-1 days can be stale
        age = (d - last_revision(d)).days
        if age == 0 and r["time"] < "08:00":
            warnings.append(f"{where}: reading before 08:00 on a revision day, may predate the new price")
    for (st, prod), obs in by_station.items():
        obs.sort()
        for (d0, p0, _), (d1, p1, i1) in zip(obs, obs[1:]):
            if abs(p1 - p0) > 2.5:
                warnings.append(f"line {i1}: {st}/{prod} moved {p1 - p0:+.2f} since {d0}; check for typo")
    for (day, city, prod), obs in by_day.items():
        ps = [p for _, p, _ in obs]
        if len(ps) > 1 and max(ps) - min(ps) > 1.0:
            warnings.append(f"{day} {city} {prod}: spread {max(ps) - min(ps):.2f} MAD/L across brands; check")
    return errors, warnings


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    errs, warns = validate(sys.argv[1])
    for w in warns:
        print("WARNING", w)
    for e in errs:
        print("ERROR  ", e)
    print(f"{len(errs)} error(s), {len(warns)} warning(s)")
    sys.exit(1 if errs else 0)
